'use client';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useState, useRef } from "react";
import Header from "@/components/Header";
import ProgressTracker from "@/components/ProgressTracker";
import styles from "./request-detail.module.css";
import Link from "next/link";
import Image from "next/image";
import { useFormStatus } from "react-dom";

function SubmitButton({ children, className = "btn btn-secondary", style = {} }: { children: React.ReactNode, className?: string, style?: React.CSSProperties }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className} style={style}>
      {pending ? "Sending..." : children}
    </button>
  );
}

export default function AdminRequestDetailClient({ 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  requestId, 
  userEmail, 
  userName,
  initialData,
  userHistory,
  success,
  actions 
}: { 
  requestId: string, 
  userEmail: string | null | undefined, 
  userName: string | null | undefined,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData: any,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  userHistory: any[],
  success?: string,
  actions: {
    addNote: (formData: FormData) => Promise<void>,
    createQuote: (formData: FormData) => Promise<void>,
    createInvoice: (formData: FormData) => Promise<void>,
    markPaid: (formData: FormData) => Promise<void>,
    updateStatus: (formData: FormData) => Promise<void>,
    savePrivateNote: (formData: FormData) => Promise<void>,
    sendReviewRequest: (formData: FormData) => Promise<void>
  }
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [request, setRequest] = useState(initialData);
  const noteTextRef = useRef<HTMLTextAreaElement>(null);
  const quoteAmountRef = useRef<HTMLInputElement>(null);
  const quoteDetailsRef = useRef<HTMLTextAreaElement>(null);

  const applyTemplate = (amount: string, details: string) => {
    if (quoteAmountRef.current) quoteAmountRef.current.value = amount;
    if (quoteDetailsRef.current) quoteDetailsRef.current.value = details;
  };

  const applyNoteTemplate = (text: string) => {
    if (noteTextRef.current) noteTextRef.current.value = text;
  };

  const latestQuote = request.quotes[0];

  return (
    <div className={styles.container}>
      <Header isAdmin userEmail={userEmail} userName={userName} />

      <main className={styles.main}>
        {success && (
          <div className={styles.successAlert}>
            {success === 'quote' && "✅ Quote has been sent to the customer."}
            {success === 'draft' && "✅ Quote has been saved as a draft."}
            {success === 'invoice' && "✅ Invoice has been generated."}
            {success === 'paid' && "✅ Payment has been recorded."}
            {success === 'status' && "✅ Ticket status has been updated."}
            {success === 'note' && "✅ Private note has been saved."}
            {success === 'message' && "✅ Message sent to customer."}
            {success === 'review' && "✅ Review request email has been sent."}
          </div>
        )}
        <ProgressTracker status={request.status} />
        <div className={styles.grid}>
          {/* Left Column: Request Details & Notes */}
          <div className={styles.leftColumn}>
            <div className={styles.card}>
              <h2>Request Information</h2>
              <div className={styles.meta}>
                <p><strong>Customer:</strong> {request.user.name || "N/A"} ({request.user.email})</p>
                <p><strong>Phone:</strong> {request.user.phone || "Not provided"}</p>
                <p><strong>Address:</strong> {request.user.address || "Not provided"}</p>
                <p><strong>Devices:</strong> {request.user.deviceTypes || "Not provided"}</p>
                <p><strong>Availability:</strong> {request.availability || "Not provided"}</p>
                
                <div className={styles.quickActions}>
                  <a href={`mailto:${request.user.email}?subject=Regarding your Consider IT Fixed request: ${request.title}`} className={styles.actionLink}>
                    ✉️ Email Customer
                  </a>
                  {request.user.phone && (
                    <a href={`tel:${request.user.phone}`} className={styles.actionLink}>
                      📞 Call Customer
                    </a>
                  )}
                  <button 
                    onClick={() => { navigator.clipboard.writeText(request.id); alert('Ticket ID copied!'); }} 
                    className={styles.actionLink}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    📋 Copy Ticket ID
                  </button>
                </div>

                {request.referralCode && (
                  <div className={styles.referralBox}>
                    <strong>How they found us:</strong> {request.referralCode}
                  </div>
                )}

                <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                  <form action={actions.updateStatus}>
                    <input type="hidden" name="requestId" value={request.id} />
                    <label htmlFor="status" style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Ticket Status:</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <select id="status" name="status" defaultValue={request.status} className={styles.input} style={{ flex: 1 }}>
                        <option value="OPEN">Logged</option>
                        <option value="QUOTED">Quoted</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="AWAITING_PARTS">Awaiting Parts</option>
                        <option value="CLOSED">Complete</option>
                      </select>
                      <SubmitButton style={{ padding: '8px 12px', minHeight: 'auto' }}>Update</SubmitButton>
                    </div>
                  </form>
                </div>
              </div>
              
              <h3 className={styles.title}>{request.title}</h3>
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

            {userHistory.length > 0 && (
              <div className={styles.card} style={{ marginTop: '1.5rem' }}>
                <h3>Customer Ticket History</h3>
                <div className={styles.historyList}>
                  {userHistory.map(h => (
                    <div key={h.id} className={styles.historyItem}>
                      <Link href={`/admin/requests/${h.id}`} className={styles.historyLink}>
                        <strong>{h.title}</strong>
                        <span className={`${styles.miniBadge} ${styles[h.status.toLowerCase()]}`}>{h.status}</span>
                      </Link>
                      <small>{new Date(h.createdAt).toLocaleDateString('en-GB')}</small>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.card} style={{ marginTop: '1.5rem' }}>
              <h3>Admin Only: Private Notes</h3>
              <p className={styles.mutedText} style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>These notes are never shown to the customer.</p>
              <form action={actions.savePrivateNote}>
                <input type="hidden" name="requestId" value={request.id} />
                <textarea 
                  name="privateNote" 
                  rows={4} 
                  defaultValue={request.privateNote || ""} 
                  placeholder="Internal notes about parts ordered, follow-ups needed, etc..." 
                  className={styles.textarea} 
                />
                <SubmitButton style={{ marginTop: '0.5rem' }}>Save Private Note</SubmitButton>
              </form>
            </div>

            <div className={styles.card} style={{ marginTop: '1.5rem' }}>
              <h3>Conversation</h3>
              
              <div className={styles.quickTemplates}>
                <p style={{ fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '8px' }}>Note Templates:</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  <button type="button" className={styles.templateBtn} onClick={() => applyNoteTemplate("Hi, I've seen your request. I'm available to visit you on [Date] at [Time]. Does that work for you?")}>Visit Request</button>
                  <button type="button" className={styles.templateBtn} onClick={() => applyNoteTemplate("I have issued a quote for the work discussed. You can view and accept it in the panel on the right.")}>Quote Issued</button>
                  <button type="button" className={styles.templateBtn} onClick={() => applyNoteTemplate("Great! I've started working on this. I'll keep you updated on the progress.")}>Work Started</button>
                  <button type="button" className={styles.templateBtn} onClick={() => applyNoteTemplate("This job is now complete. I've issued the final invoice. Please let me know if you need any further help!")}>Job Complete</button>
                </div>
              </div>

              <div className={styles.notesList}>
                {request.notes.length === 0 ? (
                  <p className={styles.mutedText}>No notes yet.</p>
                ) : (
// eslint-disable-next-line @typescript-eslint/no-explicit-any
                  request.notes.map((note: any) => (
                    <div key={note.id} className={`${styles.note} ${note.authorRole === 'ADMIN' ? styles.noteAdmin : styles.noteUser}`}>
                      <p className={styles.noteMeta}>
                        <strong>{note.authorRole === 'ADMIN' ? 'You' : 'Customer'}</strong> 
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

              <form action={actions.addNote} className={styles.noteForm}>
                <input type="hidden" name="requestId" value={request.id} />
                <textarea 
                  name="text" 
                  ref={noteTextRef}
                  rows={3} 
                  placeholder="Send a message to the customer..." 
                  required 
                  className={styles.textarea} 
                />
                <input
                  name="attachmentFile"
                  type="file"
                  accept="image/*,.pdf"
                  className={styles.input}
                  style={{ marginTop: '8px', padding: '8px' }}
                />                <SubmitButton style={{ marginTop: '0.5rem' }}>Send Message</SubmitButton>
              </form>
            </div>
          </div>

          <div className={styles.rightColumn}>
            {request.invoice ? (
               <div className={styles.card}>
                 <h3>Invoice Sent</h3>
                 <div className={styles.invoiceBox}>
                   <p><strong>Amount:</strong> £{request.invoice.amount}</p>
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
                     <div style={{ display: 'flex', gap: '8px', flexDirection: 'column', marginTop: '1rem' }}>
                       <form action={actions.markPaid}>
                         <input type="hidden" name="invoiceId" value={request.invoice.id} />
                         <input type="hidden" name="requestId" value={request.id} />
                         <input type="hidden" name="isCash" value="false" />
                         <SubmitButton style={{ width: '100%' }}>Mark as Paid (Bank)</SubmitButton>
                       </form>
                       <form action={actions.markPaid}>
                         <input type="hidden" name="invoiceId" value={request.invoice.id} />
                         <input type="hidden" name="requestId" value={request.id} />
                         <input type="hidden" name="isCash" value="true" />
                         <SubmitButton className="btn btn-outline" style={{ width: '100%', borderColor: '#0D9488', color: '#0D9488' }}>Mark as Paid (Cash)</SubmitButton>
                       </form>
                     </div>
                   )}

                   {request.invoice.status === 'PAID' && (
                     <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                       <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Job complete and paid. Ask for a review?</p>
                       <form action={actions.sendReviewRequest}>
                         <input type="hidden" name="requestId" value={request.id} />
                         <SubmitButton className="btn btn-accent" style={{ width: '100%' }}>Send Review Request</SubmitButton>
                       </form>
                     </div>
                   )}
                 </div>
               </div>
            ) : latestQuote ? (
              <div className={styles.card}>
                <h3>Latest Quote {latestQuote.status === 'DRAFT' && <span className={styles.draftBadge}>DRAFT</span>}</h3>
                <div className={styles.quoteProvided}>
                  <div className={styles.quoteDetails}>
                    <p><strong>Amount:</strong> £{latestQuote.amount}</p>
                    <p><strong>Details:</strong> {latestQuote.details}</p>
                    <p><strong>Status:</strong> {latestQuote.status}</p>
                    <p><strong>{latestQuote.status === 'DRAFT' ? 'Created' : 'Sent'}:</strong> {new Date(latestQuote.createdAt).toLocaleDateString('en-GB')}</p>
                    {latestQuote.expiresAt && <p><strong>Expires:</strong> {new Date(latestQuote.expiresAt).toLocaleDateString('en-GB')}</p>}
                  </div>
                  {latestQuote.status !== 'DRAFT' && (
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '10px' }}>
                      <Link href={`/portal/requests/${request.id}/quote`} className="btn btn-secondary" target="_blank">
                        View Quote
                      </Link>
                      <a href={`/api/pdfs/quote/${request.id}`} className="btn btn-outline" download>
                        Download PDF
                      </a>
                    </div>
                  )}
                </div>

                {(latestQuote.status === 'REJECTED' || latestQuote.status === 'PENDING' || latestQuote.status === 'DRAFT') && (
                  <form action={actions.createQuote} className={styles.form} style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                    <input type="hidden" name="requestId" value={request.id} />
                    <input type="hidden" id="isDraftInput" name="isDraft" value="false" />
                    <h4>{latestQuote.status === 'DRAFT' ? 'Finalise Quote' : 'Issue Revision'}</h4>
                    <div className={styles.inputGroup}>
                      <label htmlFor="amount">Amount (£)</label>
                      <input name="amount" type="number" step="0.01" defaultValue={latestQuote.amount} required className={styles.input} />
                    </div>
                    <div className={styles.inputGroup}>
                      <label htmlFor="validDays">Valid for (Days)</label>
                      <input name="validDays" type="number" defaultValue="14" required className={styles.input} />
                    </div>
                    <div className={styles.inputGroup}>
                      <label htmlFor="details">Details</label>
                      <textarea name="details" rows={3} defaultValue={latestQuote.details} required className={styles.textarea} />
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <SubmitButton style={{ flex: 1 }}>{latestQuote.status === 'DRAFT' ? 'Send to Customer' : 'Send Revised Quote'}</SubmitButton>
                      {latestQuote.status === 'DRAFT' && (
                        <button 
                          type="submit" 
                          className="btn btn-secondary" 
                          style={{ flex: 1 }}
                          onClick={(e) => {
                            const input = (e.currentTarget.form?.querySelector('#isDraftInput') as HTMLInputElement);
                            if (input) input.value = "true";
                          }}
                        >
                          Update Draft
                        </button>
                      )}
                    </div>
                  </form>
                )}

                {latestQuote.status === 'ACCEPTED' && (
                  <form action={actions.createInvoice} className={styles.form} style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                    <input type="hidden" name="requestId" value={request.id} />
                    <h4>Generate Invoice</h4>
                    <div className={styles.inputGroup}>
                      <label htmlFor="amount">Final Amount (£)</label>
                      <input name="amount" type="number" step="0.01" defaultValue={latestQuote.amount} required className={styles.input} />
                    </div>
                    <SubmitButton>Generate Invoice</SubmitButton>
                  </form>
                )}
              </div>
            ) : (
              <div className={styles.card}>
                <h3>Create Quote</h3>
                <div className={styles.quickTemplates}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '8px' }}>Quick Templates:</p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    <button type="button" className={styles.templateBtn} onClick={() => applyTemplate("40", "1 hour of general tech support and troubleshooting.")}>£40 - 1hr</button>
                    <button type="button" className={styles.templateBtn} onClick={() => applyTemplate("60", "New device setup, including data migration and security configuration.")}>£60 - Setup</button>
                    <button type="button" className={styles.templateBtn} onClick={() => applyTemplate("35", "1 hour patient Tea & Tech tutoring session.")}>£35 - Tea & Tech</button>
                  </div>
                </div>
                <form action={actions.createQuote} className={styles.form}>
                  <input type="hidden" name="requestId" value={request.id} />
                  <input type="hidden" id="isDraftInputNew" name="isDraft" value="false" />
                  <div className={styles.inputGroup}>
                    <label htmlFor="amount">Amount (£)</label>
                    <input name="amount" id="amount" ref={quoteAmountRef} type="number" step="0.01" required className={styles.input} />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="validDays">Valid for (Days)</label>
                    <input name="validDays" type="number" defaultValue="14" required className={styles.input} />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="details">Details</label>
                    <textarea name="details" id="details" ref={quoteDetailsRef} rows={5} required className={styles.textarea} />
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <SubmitButton style={{ flex: 1 }}>Send Quote</SubmitButton>
                    <button 
                      type="submit" 
                      className="btn btn-secondary" 
                      style={{ flex: 1 }}
                      onClick={(e) => {
                        const input = (e.currentTarget.form?.querySelector('#isDraftInputNew') as HTMLInputElement);
                        if (input) input.value = "true";
                      }}
                    >
                      Save as Draft
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}