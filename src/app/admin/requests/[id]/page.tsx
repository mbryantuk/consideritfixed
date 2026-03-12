import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateRequestStatus } from "@/lib/request-utils";
import { revalidatePath } from "next/cache";
import AdminRequestDetailClient from "./AdminRequestDetailClient";
import { sendQuoteNotification, sendNewMessageAlert, sendStatusUpdateEmail, sendInvoiceReadyEmail, sendPaymentReceiptEmail, sendReviewRequestEmail } from "@/lib/mail";

export const metadata = {
  title: "Request Details | Admin | Consider IT Fixed",
};

export default async function AdminRequestDetail(props: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { params, searchParams } = props;
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/portal");
  }

  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const success = resolvedSearchParams.success;

  const requestData = await prisma.request.findUnique({
    where: { id: resolvedParams.id },
    include: { 
      user: true,
      quotes: { orderBy: { createdAt: 'desc' } },
      notes: { orderBy: { createdAt: 'asc' } },
      invoice: true
    }
  });

  if (!requestData) {
    return <div>Request not found.</div>;
  }

  // Fetch customer history (other requests by this user)
  const userHistory = await prisma.request.findMany({
    where: { 
      userId: requestData.userId,
      NOT: { id: requestData.id }
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  // Define Server Actions
  async function addNote(formData: FormData) {
    "use server";
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") return;

    const requestId = formData.get("requestId") as string;
    const text = formData.get("text") as string;
    const attachmentFile = formData.get("attachmentFile") as File | null;
    if (!requestId || !text) return;

    // Use dynamic import for saveFileUpload to avoid module loading issues in server actions
    const { saveFileUpload } = await import("@/lib/upload");
    const attachmentUrl = await saveFileUpload(attachmentFile);

    await prisma.note.create({
      data: { text, authorRole: "ADMIN", attachmentUrl, requestId }
    });

    const currentRequest = await prisma.request.findUnique({
      where: { id: requestId },
      include: { user: true }
    });

    if (currentRequest?.user?.email) {
      await sendNewMessageAlert(
        currentRequest.user.email,
        "Consider IT Fixed Support",
        currentRequest.title,
        currentRequest.id,
        text,
        false
      );
    }

    revalidatePath(`/admin/requests/${requestId}`);
    revalidatePath(`/portal/requests/${requestId}`);
    redirect(`/admin/requests/${requestId}?success=message`);
  }

  async function createQuote(formData: FormData) {
    "use server";
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") return;

    const requestId = formData.get("requestId") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const details = formData.get("details") as string;
    const validDays = parseInt(formData.get("validDays") as string) || 14;
    const isDraft = formData.get("isDraft") === "true";

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + validDays);

    const status = isDraft ? "DRAFT" : "PENDING";

    await prisma.quote.create({
      data: { amount, details, requestId, expiresAt, status }
    });
    
    if (!isDraft) {
      const updatedRequest = await updateRequestStatus(requestId, "QUOTED");
      
      const fullRequest = await prisma.request.findUnique({
        where: { id: requestId },
        include: { user: true }
      });

      // Send Email Notification
      if (fullRequest?.user?.email) {
        await sendQuoteNotification(
          fullRequest.user.email,
          fullRequest.user.name || "Customer",
          fullRequest.title,
          amount.toFixed(2),
          updatedRequest.id
        );
      }
    }

    revalidatePath(`/admin/requests/${requestId}`);
    revalidatePath(`/portal/requests/${requestId}`);
    redirect(`/admin/requests/${requestId}?success=${isDraft ? 'draft' : 'quote'}`);
  }

    async function createInvoice(formData: FormData) {
    "use server";
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") return;

    const requestId = formData.get("requestId") as string;
    const amount = parseFloat(formData.get("amount") as string);

    // 1. Create the invoice
    await prisma.invoice.create({
      data: { amount, requestId }
    });

    // 2. Deduct parts from inventory
    const partsUsed = await prisma.partUsage.findMany({
      where: { requestId }
    });

    for (const usage of partsUsed) {
      await prisma.part.update({
        where: { id: usage.partId },
        data: {
          stockLevel: {
            decrement: usage.quantity
          }
        }
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updatedRequest = await updateRequestStatus(requestId, "CLOSED");

    const fullRequest = await prisma.request.findUnique({
      where: { id: requestId },
      include: { user: true }
    });
    
    if (fullRequest?.user?.email) {
      await sendInvoiceReadyEmail(
        fullRequest.user.email,
        fullRequest.user.name || "Customer",
        fullRequest.title,
        fullRequest.id,
        amount.toFixed(2)
      );
    }
    
    revalidatePath(`/admin/requests/${requestId}`);
    revalidatePath(`/portal/requests/${requestId}`);
    redirect(`/admin/requests/${requestId}?success=invoice`);
    }

    async function markPaid(formData: FormData) {
    "use server";
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") return;

    const invoiceId = formData.get("invoiceId") as string;
    const requestId = formData.get("requestId") as string;
    const isCash = formData.get("isCash") === "true";

    const invoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: "PAID" }
    });

    const updatedRequest = await prisma.request.findUnique({
      where: { id: requestId },
      include: { user: true }
    });

    if (isCash && updatedRequest) {
      const updatedNote = `${updatedRequest.privateNote || ""}\n[System: Marked as Paid via CASH on ${new Date().toLocaleString('en-GB')}]`.trim();
      await prisma.request.update({
        where: { id: requestId },
        data: { privateNote: updatedNote }
      });
    }
    
    if (updatedRequest?.user?.email) {
      await sendPaymentReceiptEmail(
        updatedRequest.user.email,
        updatedRequest.user.name || "Customer",
        updatedRequest.title,
        updatedRequest.id,
        invoice.amount.toFixed(2)
      );
    }
    
    revalidatePath(`/admin/requests/${requestId}`);
    revalidatePath(`/portal/requests/${requestId}`);
    redirect(`/admin/requests/${requestId}?success=paid`);
    }

    async function updateStatus(formData: FormData) {
    "use server";
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") return;

    const requestId = formData.get("requestId") as string;
    const status = formData.get("status") as string;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updatedRequest = await updateRequestStatus(requestId, status);
    
    const fullRequest = await prisma.request.findUnique({
      where: { id: requestId },
      include: { user: true }
    });
    
    if (fullRequest?.user?.email) {
      await sendStatusUpdateEmail(
        fullRequest.user.email,
        fullRequest.user.name || "Customer",
        fullRequest.title,
        fullRequest.id,
        status
      );
    }
    
    revalidatePath(`/admin/requests/${requestId}`);
    revalidatePath(`/portal/requests/${requestId}`);
    redirect(`/admin/requests/${requestId}?success=status`);
    }

    async function savePrivateNote(formData: FormData) {
    "use server";
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") return;

    const requestId = formData.get("requestId") as string;
    const privateNote = formData.get("privateNote") as string;

    await prisma.request.update({
      where: { id: requestId },
      data: { privateNote }
    });
    revalidatePath(`/admin/requests/${requestId}`);
    redirect(`/admin/requests/${requestId}?success=note`);
  }

  async function sendReviewRequest(formData: FormData) {
    "use server";
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") return;

    const requestId = formData.get("requestId") as string;
    const request = await prisma.request.findUnique({
      where: { id: requestId },
      include: { user: true }
    });

    if (request?.user?.email) {
      await sendReviewRequestEmail(
        request.user.email,
        request.user.name || "Customer",
        request.title
      );
    }
    revalidatePath(`/admin/requests/${requestId}`);
    redirect(`/admin/requests/${requestId}?success=review`);
  }

  return (
    <AdminRequestDetailClient 
      requestId={requestData.id}
      userEmail={session.user.email}
      userName={session.user.name}
      initialData={requestData}
      userHistory={userHistory}
      success={success as string}
      actions={{
        addNote,
        createQuote,
        createInvoice,
        markPaid,
        updateStatus,
        savePrivateNote,
        sendReviewRequest
      }}
    />
    );
    }