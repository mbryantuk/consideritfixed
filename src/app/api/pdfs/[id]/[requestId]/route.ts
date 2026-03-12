import { NextRequest, NextResponse } from 'next/server';
import { generatePdf } from '@/lib/pdf';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string, requestId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resolvedParams = await params;
  const { id: type, requestId } = resolvedParams;

  if (type !== 'quote' && type !== 'invoice') {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  const requestData = await prisma.request.findUnique({
    where: { id: requestId },
  });

  if (!requestData) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (requestData.userId !== session.user.id && session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const secret = process.env.NEXTAUTH_SECRET || 'secret';
  const protocol = request.headers.get('x-forwarded-proto') || 'http';
  const host = request.headers.get('host') || 'localhost:3000';
  
  // URL to the print view page with secret bypass
  const printUrl = `${protocol}://${host}/portal/requests/${requestId}/${type}?secret=${secret}`;
  
  // Use a predictable filename for the PDF
  const filename = `${type}-${requestData.friendlyId}.pdf`;

  try {
    const pdfPath = await generatePdf(printUrl, filename);
    
    // Redirect to the actual static file URL
    return NextResponse.redirect(`${protocol}://${host}${pdfPath}`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
