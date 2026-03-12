'use client';

import { useState } from "react";
import Header from "@/components/Header";
import ProgressTracker from "@/components/ProgressTracker";
import styles from "./request-detail.module.css";
import Link from "next/link";
import { RequestInfoCard } from "./components/RequestInfoCard";
import { ConversationCard } from "./components/ConversationCard";
import { FinancialCard } from "./components/FinancialCard";
import { SubmitButton } from "./components/SubmitButton";

export default function AdminRequestDetailClient({ 
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
  initialData: any,
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
  const [request] = useState(initialData);

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
            <RequestInfoCard request={request} updateStatusAction={actions.updateStatus} />

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

            <ConversationCard request={request} addNoteAction={actions.addNote} />
          </div>

          <div className={styles.rightColumn}>
            <FinancialCard request={request} actions={actions} />
          </div>
        </div>
      </main>
    </div>
  );
}