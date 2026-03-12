import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ largeText: false, highContrast: false });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      largeText: true,
      highContrast: true,
      themePreference: true,
    }
  });

  return NextResponse.json(user || { largeText: false, highContrast: false });
}
