import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Mocking Stripe for now as we don't have the package/keys
// In a real app: import Stripe from 'stripe'; const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { invoiceId } = await req.json();
    
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { request: true }
    });

    if (!invoice || invoice.status === 'PAID') {
      return NextResponse.json({ error: "Invalid or already paid invoice" }, { status: 400 });
    }

    console.log(`[Stripe Mock] Creating checkout session for Invoice ${invoiceId} - Amount: £${invoice.amount}`);

    // Mocking the checkout URL
    // In real app: const checkoutSession = await stripe.checkout.sessions.create({...});
    const mockCheckoutUrl = `/portal/payments/mock-stripe?invoiceId=${invoiceId}&amount=${invoice.amount}`;

    return NextResponse.json({ url: mockCheckoutUrl });
  } catch (error) {
    console.error("Payment checkout error:", error);
    return NextResponse.json({ error: "Failed to create payment session" }, { status: 500 });
  }
}
