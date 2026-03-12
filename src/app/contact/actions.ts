'use server';

import { prisma } from "@/lib/prisma";
import { generateFriendlyId } from "@/lib/friendly-id";
import { sendTicketConfirmation, sendAdminNewTicketAlert } from "@/lib/mail";
import { rateLimit } from "@/lib/rate-limit";
import { saveFileUpload } from "@/lib/upload";
import { headers } from "next/headers";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
  address: z.string().optional(),
  availability: z.string().optional(),
  message: z.string().min(10, "Please provide a bit more detail (at least 10 characters)."),
  isEmergency: z.boolean().default(false),
});

export async function submitContactForm(formData: FormData) {
  try {
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for") || "unknown";
    const userAgent = headerList.get("user-agent") || "unknown";
    
    const limitResult = await rateLimit(`contact-form:${ip}`, 3, 3600); // 3 requests per hour
    if (!limitResult.success) {
      return { success: false, error: `Too many requests. Please try again in ${Math.ceil(limitResult.retryAfter! / 60)} minutes.` };
    }

    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      availability: formData.get("availability"),
      message: formData.get("message"),
      isEmergency: formData.get("isEmergency") === "on",
    };

    const photoFile = formData.get("photo") as File | null;
    const attachmentUrl = photoFile ? await saveFileUpload(photoFile) : null;

    const validatedData = contactSchema.safeParse(rawData);

    if (!validatedData.success) {
      return { success: false, error: validatedData.error.issues[0].message };
    }

    const { name, email, phone, address, availability, message, isEmergency } = validatedData.data;

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          name,
          phone,
          address,
          profileComplete: false,
        }
      });
    } else {
      // Update missing info
// eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updates: any = {};
      if (!user.name && name) updates.name = name;
      if (!user.phone && phone) updates.phone = phone;
      if (!user.address && address) updates.address = address;
      if (Object.keys(updates).length > 0) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: updates
        });
      }
    }

    const friendlyId = await generateFriendlyId();
    
    const title = message.length > 50 ? message.substring(0, 50) + "..." : message;

    const request = await prisma.request.create({
      data: {
        friendlyId,
        title: `${isEmergency ? '🚨 EMERGENCY: ' : 'Web Enquiry: '}${title}`,
        description: `${message}\n\n--- Metadata ---\nIP: ${ip}\nUA: ${userAgent}`,
        userId: user.id,
        isEmergency,
        availability,
        attachmentUrl,
      }
    });

    if (user.email) {
      await sendTicketConfirmation(user.email, user.name || "Customer", request.title, request.id);
    }
    await sendAdminNewTicketAlert(request.title, user.name || email, request.id);

    return { success: true };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
