'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveFileUpload } from "@/lib/upload";
import { revalidatePath } from "next/cache";

export async function uploadFile(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const file = formData.get("file") as File;
  if (!file) return { success: false, error: "No file provided" };

  try {
    const url = await saveFileUpload(file);
    if (!url) return { success: false, error: "Failed to save file. Check file size (max 5MB) and type." };

    await prisma.userFile.create({
      data: {
        name: file.name,
        url,
        size: file.size,
        type: file.type,
        userId: session.user.id,
      }
    });

    revalidatePath('/portal/files');
    return { success: true };
  } catch (err) {
    console.error("Upload error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function deleteFile(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    // Only allow deleting own files
    await prisma.userFile.deleteMany({
      where: { id, userId: session.user.id }
    });
    
    revalidatePath('/portal/files');
    return { success: true };
  } catch (err) {
    console.error("Delete error:", err);
    return { success: false, error: "Failed to delete file." };
  }
}
