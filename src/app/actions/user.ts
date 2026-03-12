'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateThemePreference(theme: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return;

  await prisma.user.update({
    where: { id: session.user.id },
    data: { themePreference: theme }
  });
  
  revalidatePath('/');
}

export async function updateA11yPreferences(prefs: { largeText?: boolean, highContrast?: boolean }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return;

  await prisma.user.update({
    where: { id: session.user.id },
    data: prefs
  });
  
  revalidatePath('/');
}