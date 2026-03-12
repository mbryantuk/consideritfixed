'use server';

import { prisma } from "@/lib/prisma";
import { z } from "zod";

const waitlistSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  postcode: z.string().min(2, "Invalid postcode."),
});

export async function joinWaitlist(formData: FormData) {
  const email = formData.get("email") as string;
  const postcode = formData.get("postcode") as string;

  const validated = waitlistSchema.safeParse({ email, postcode });
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message };
  }

  try {
    await prisma.waitlist.upsert({
      where: { email_postcode: { email: email.toLowerCase(), postcode: postcode.toUpperCase() } },
      update: {},
      create: {
        email: email.toLowerCase(),
        postcode: postcode.toUpperCase(),
      }
    });
    return { success: true };
  } catch (err) {
    console.error("Waitlist error:", err);
    return { success: false, error: "Failed to join waitlist." };
  }
}
