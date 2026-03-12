import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateRequestStatus } from "@/lib/request-utils";
import Link from "next/link";
import Image from "next/image";
import styles from "./request-detail.module.css";
import { revalidatePath } from "next/cache";
import Header from "@/components/Header";
import ProgressTracker from "@/components/ProgressTracker";
import Breadcrumbs from "@/components/Breadcrumbs";
import { sendAdminQuoteRespondedAlert, sendNewMessageAlert } from "@/lib/mail";
import { saveFileUpload } from "@/lib/upload";

export const metadata = {
  title: "Request Details | Consider IT Fixed",
};

async function addNote(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const requestId = formData.get("requestId") as string;
  const text = formData.get("text") as string;
  const attachmentFile = formData.get("attachmentFile") as File | null;

  if (!requestId || !text) {
    throw new Error("Invalid note data.");
  }

  const attachmentUrl = await saveFileUpload(attachmentFile);

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  const request = await prisma.request.findUnique({ where: { id: requestId } });

  await prisma.note.create({
    data: {
      text,
      authorRole: "USER",
      attachmentUrl,
      requestId,
    }
  });

  if (request && user) {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
       await sendNewMessageAlert(
         adminEmail,
         user.name || user.email || "Customer",
         request.title,
         request.id,
         text,
         true
       );
    }
  }

  revalidatePath(`/portal/requests/${requestId}`);
  revalidatePath('/admin');
}

async function respondToQuote(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const quoteId = formData.get("quoteId") as string;
  const requestId = formData.get("requestId") as string;
  const action = formData.get("action") as string; // "ACCEPT" or "REJECT"

  if (!quoteId || !requestId || (action !== "ACCEPT" && action !== "REJECT")) {
    throw new Error("Invalid action.");
  }

  const newStatus = action === "ACCEPT" ? "ACCEPTED" : "REJECTED";
  const requestStatus = action === "ACCEPT" ? "IN_PROGRESS" : "OPEN";

  const quote = await prisma.quote.findUnique({ where: { id: quoteId } });
  if (!quote) throw new Error("Quote not found.");

  await prisma.quote.update({
    where: { id: quoteId },
    data: { status: newStatus }
  });

  const updatedRequest = await updateRequestStatus(requestId, requestStatus);
  
  const fullRequest = await prisma.request.findUnique({
    where: { id: requestId },
    include: { user: true, invoice: true }
  });

  // Automatically generate invoice if accepted and none exists
  if (action === "ACCEPT" && !fullRequest?.invoice) {
    await prisma.invoice.create({
      data: {
        amount: quote.amount,
        status: "UNPAID",
        requestId: updatedRequest.id
      }
    });
  }

  if (fullRequest && fullRequest.user) {
    await sendAdminQuoteRespondedAlert(
      fullRequest.title,
      fullRequest.user.name || fullRequest.user.email || "Customer",
      fullRequest.id,
      action as "ACCEPTED" | "REJECTED"
    );
  }

  revalidatePath(`/portal/requests/${requestId}`);
  revalidatePath('/admin');
  revalidatePath('/portal');
}

async function reOpenTicket(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const requestId = formData.get("requestId") as string;
  
  if (!requestId) {
    throw new Error("Invalid request ID.");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updatedRequest = await updateRequestStatus(requestId, "OPEN");
  
  const fullRequest = await prisma.request.findUnique({
    where: { id: requestId },
    include: { user: true }
  });

  if (fullRequest && fullRequest.user) {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
       await sendNewMessageAlert(
         adminEmail,
         fullRequest.user.name || fullRequest.user.email || "Customer",
         fullRequest.title,
         fullRequest.id,
         "I have re-opened this ticket for further assistance.",
         true
       );
    }
  }

  revalidatePath(`/portal/requests/${requestId}`);
  revalidatePath('/portal');
}

export default async function RequestDetail(props: { params: Promise<{ id: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const requestId = params.id;
  const successMessage = searchParams.success === 'feedback_submitted' ? 'Thank you! Your feedback has been submitted for review.' : null;

  const request = await prisma.request.findUnique({
    where: { id: requestId },
    include: { 
      quotes: { orderBy: { createdAt: 'desc' } },
      notes: { orderBy: { createdAt: 'asc' } },
      statusLogs: { orderBy: { createdAt: 'desc' } },
      invoice: true
    }
  });

  if (!request || request.userId !== session.user.id) {
    return <div className={styles.container}>Request not found or unauthorized.</div>;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user?.profileComplete) {
    redirect("/portal/profile");
  }

  const latestQuote = request.quotes[0];
  const isExpired = latestQuote?.expiresAt && new Date(latestQuote.expiresAt) < new Date() && latestQuote.status === 'PENDING';

  return (
    <div className={styles.container}>
      <Header isPortal userEmail={session.user.email} userName={user?.name} />

      <main className={styles.main}>
        {successMessage && (
          <div className={styles.successAlert} role="alert">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><polyline points="20 6 9 17 4 12"></polyline></svg>
            {successMessage}
          </div>
        )}
        <Breadcrumbs items={[{ label: 'My Requests', href: '/portal' }, { label: request.title }]} />
        <ProgressTracker status={request.status} />
        <div className={styles.grid}>
          {/* Left Column: Request Details & Notes */}
          <div className={styles.leftColumn}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>{request.title}</h2>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span className={`${styles.badge} ${styles[request.status.toLowerCase()]}`}>
                    {request.status}
                  </span>
                  {request.status === 'CLOSED' && (
                    <>
                      <form action={reOpenTicket}>
                        <input type="hidden" name="requestId" value={request.id} />
                        <button type="submit" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', minHeight: 'auto' }}>
                          Re-open Ticket
                        </button>
                      </form>
                      <Link href={`/portal/requests/${request.id}/feedback`} className="btn btn-accent" style={{ padding: '6px 12px', fontSize: '0.8rem', minHeight: 'auto' }}>
                        Leave Feedback
                      </Link>
                    </>
                  )}
                </div>
              </div>
              <p className={styles.date}>Logged on: {new Date(request.createdAt).toLocaleString('en-GB')}</p>
              <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}><strong>My Availability:</strong> {request.availability || "Not provided"}</p>
              <div className={styles.descriptionBox}>
                {request.description}
              </div>
              {request.attachmentUrl && (
                <div className={styles.mainAttachment}>
                  <p><strong>Initial Photo:</strong></p>
                  <a href={request.attachmentUrl} target="_blank" rel="noopener noreferrer">
                    <Image src={request.attachmentUrl} alt="Issue photo" className={styles.attachmentPreview} width={800} height={600} style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
                  </a>
                </div>
              )}
            </div>

            <div className={styles.card} style={{ marginTop: '1.5rem' }}>
              <h3>Conversation</h3>
              <div className={styles.notesList}>
                {request.notes.length === 0 ? (
                  <p className={styles.mutedText}>No notes yet.</p>
                ) : (
                  request.notes.map(note => (
                    <div key={note.id} className={`${styles.note} ${note.authorRole === 'USER' ? styles.noteUser : styles.noteAdmin}`}>
                      <p className={styles.noteMeta}>
                        <strong>{note.authorRole === 'USER' ? 'You' : 'Technician'}</strong> 
                        <span className={styles.noteDate}>{new Date(note.createdAt).toLocaleString('en-GB')}</span>
                      </p>
                      <p className={styles.noteText}>{note.text}</p>
                      {note.attachmentUrl && (
                        <div className={styles.noteAttachment}>
                          <a href={note.attachmentUrl} target="_blank" rel="noopener noreferrer">
                            <Image src={note.attachmentUrl} alt="Attached image" className={styles.attachmentPreview} width={800} height={600} style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
                          </a>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              <form action={addNote} className={styles.noteForm}>
                <input type="hidden" name="requestId" value={request.id} />
                <textarea 
                  name="text" 
                  rows={3} 
                  placeholder="Add a message or question..." 
                  required 
                  className={styles.textarea} 
                />
                <input 
                  name="attachmentFile" 
                  type="file" 
                  accept="image/*,.pdf"
                  className={styles.input} 
                  style={{ marginTop: '8px', padding: '8px' }}
                />
                <button type="submit" className="btn btn-secondary" style={{ marginTop: '0.5rem' }}>Send Message</button>
              </form>
            </div>
          </div>

          {/* Right Column: Quotes & Invoices */}
          <div className={styles.rightColumn}>
            {request.invoice ? (
              <div className={styles.card}>
                <h3>Invoice</h3>
                <div className={styles.invoiceBox}>
                  <p><strong>Amount Due:</strong> £{request.invoice.amount}</p>
                  <p><strong>Status:</strong> <span className={styles[request.invoice.status.toLowerCase()]}>{request.invoice.status}</span></p>
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '10px' }}>
                    <Link href={`/portal/requests/${request.id}/invoice`} className="btn btn-secondary" target="_blank">
                      View Invoice
                    </Link>
                    <a href={`/api/pdfs/invoice/${request.id}`} className="btn btn-outline" download>
                      Download PDF
                    </a>
                  </div>
                  {request.invoice.status === 'UNPAID' && (
                    <div style={{ marginTop: '1.5rem', borderTop: '1px solid #FEF08A', paddingTop: '1rem' }}>
                      <p><strong>How to Pay:</strong></p>
                      <p style={{ fontSize: '0.9rem' }}>We accept Cash or Bank Transfer.</p>
                      <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}><strong>Bank:</strong> Starling Bank<br /><strong>Name:</strong> Consider IT Fixed<br /><strong>Acc:</strong> 12345678<br /><strong>Sort:</strong> 60-00-00</p>
                      <p style={{ fontSize: '0.8rem', marginTop: '1rem', fontStyle: 'italic' }}>Please use your ticket ID ({request.friendlyId}) as the reference.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : latestQuote ? (
              <div className={styles.card}>
                <h3>Latest Quote</h3>
                <div className={styles.quoteBox}>
                  <p><strong>Amount:</strong> £{latestQuote.amount}</p>
                  <p><strong>Details:</strong> {latestQuote.details}</p>
                  <p><strong>Status:</strong> {isExpired ? 'EXPIRED' : latestQuote.status}</p>
                  <p className={styles.mutedText} style={{ fontSize: '0.85rem' }}>Sent on: {new Date(latestQuote.createdAt).toLocaleString('en-GB')}</p>
                  {latestQuote.expiresAt && !isExpired && (
                    <p className={styles.mutedText} style={{ fontSize: '0.85rem' }}>Expires on: {new Date(latestQuote.expiresAt).toLocaleDateString('en-GB')}</p>
                  )}
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '10px' }}>
                    <Link href={`/portal/requests/${request.id}/quote`} className="btn btn-secondary" target="_blank">
                      View Quote
                    </Link>
                    <a href={`/api/pdfs/quote/${request.id}`} className="btn btn-outline" download>
                      Download PDF
                    </a>
                  </div>
                  {isExpired && (
                    <p style={{ color: '#DC2626', fontWeight: 'bold', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                      This quote has expired. Please contact us via the notes below to request a revised quote.
                    </p>
                  )}
                </div>

                {latestQuote.status === 'PENDING' && !isExpired && (
                  <div className={styles.quoteActions}>
                    <p style={{ marginBottom: '0.5rem' }}>Do you accept this quote?</p>
                    <form action={respondToQuote} style={{ display: 'inline-block', marginRight: '0.5rem' }}>
                      <input type="hidden" name="quoteId" value={latestQuote.id} />
                      <input type="hidden" name="requestId" value={request.id} />
                      <input type="hidden" name="action" value="ACCEPT" />
                      <button type="submit" className="btn btn-secondary">Accept Quote</button>
                    </form>
                    <form action={respondToQuote} style={{ display: 'inline-block' }}>
                      <input type="hidden" name="quoteId" value={latestQuote.id} />
                      <input type="hidden" name="requestId" value={request.id} />
                      <input type="hidden" name="action" value="REJECT" />
                      <button type="submit" className="btn-outline" style={{ borderColor: '#DC2626', color: '#DC2626' }}>Reject Quote</button>
                    </form>
                  </div>
                )}
                
                {request.quotes.length > 1 && (
                  <div className={styles.quoteHistory}>
                    <h4>Quote History</h4>
                    {request.quotes.slice(1).map(q => (
                      <div key={q.id} className={styles.historicalQuote}>
                        <p>£{q.amount} - {q.status} ({new Date(q.createdAt).toLocaleDateString('en-GB')})</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.card}>
                <h3>Quote</h3>
                <p className={styles.mutedText}>We are reviewing your request and will provide a quote soon.</p>
              </div>
            )}

            <div className={styles.card} style={{ marginTop: '1.5rem' }}>
              <h3>Status History</h3>
              <div className={styles.statusTimeline}>
                {request.statusLogs.length === 0 ? (
                  <div className={styles.timelineItem}>
                    <p className={styles.timelineText}>Ticket created</p>
                    <p className={styles.timelineDate}>{new Date(request.createdAt).toLocaleString('en-GB')}</p>
                  </div>
                ) : (
// eslint-disable-next-line @typescript-eslint/no-explicit-any
                  request.statusLogs.map((log: any) => (
                    <div key={log.id} className={styles.timelineItem}>
                      <p className={styles.timelineText}>Status changed to <strong>{log.status}</strong></p>
                      <p className={styles.timelineDate}>{new Date(log.createdAt).toLocaleString('en-GB')}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}