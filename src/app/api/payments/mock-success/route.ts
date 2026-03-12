import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendPaymentReceiptEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { invoiceId } = await req.json();

    const invoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: 'PAID' },
      include: { 
        request: {
          include: { user: true }
        }
      }
    });

    // Send receipt email
    if (invoice.request.user.email) {
      await sendPaymentReceiptEmail(
        invoice.request.user.email,
        invoice.request.user.name || "Customer",
        invoice.request.title,
        invoice.request.id,
        invoice.amount.toString()
      );
    }

    console.log(`[Payment Success] Invoice ${invoiceId} marked as PAID.`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Payment success hook error:", error);
    return NextResponse.json({ error: "Failed to process success" }, { status: 500 });
  }
}
