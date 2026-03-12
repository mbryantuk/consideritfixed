'use server';

import { prisma } from "@/lib/prisma";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get("email") as string;

  const validated = subscribeSchema.safeParse({ email });
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message };
  }

  try {
    await prisma.newsletterSubscription.upsert({
      where: { email: email.toLowerCase() },
      update: { active: true },
      create: { email: email.toLowerCase() }
    });
    return { success: true };
  } catch (err) {
    console.error("Subscription error:", err);
    return { success: false, error: "Failed to subscribe." };
  }
}
