import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const isValidSecret = secret === process.env.NEXTAUTH_SECRET;

  let isAuthorized = isValidSecret;

  if (!isAuthorized) {
    const session = await getServerSession(authOptions);
    if (session?.user) {
       isAuthorized = true;
    }
  }

  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resolvedParams = await params;
  const requestId = resolvedParams.id;

  const requestData = await prisma.request.findUnique({
    where: { id: requestId },
    include: { 
      user: true,
      invoice: true
    }
  });

  if (!requestData || !requestData.invoice) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!isValidSecret) {
    const session = await getServerSession(authOptions);
    if (requestData.userId !== session?.user?.id && session?.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.json({
    request: {
      id: requestData.id,
      friendlyId: requestData.friendlyId,
      title: requestData.title,
      description: requestData.description,
    },
    invoice: requestData.invoice,
    user: {
      name: requestData.user.name,
      address: requestData.user.address,
      phone: requestData.user.phone,
    }
  });
}