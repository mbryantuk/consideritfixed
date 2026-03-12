'use client';

import { useRef } from "react";
import Link from "next/link";
import styles from "../request-detail.module.css";
import { SubmitButton } from "./SubmitButton";

interface FinancialCardProps {
  request: any;
  actions: {
    createQuote: (formData: FormData) => Promise<void>;
    createInvoice: (formData: FormData) => Promise<void>;
    markPaid: (formData: FormData) => Promise<void>;
    sendReviewRequest: (formData: FormData) => Promise<void>;
  };
}

export function FinancialCard({ request, actions }: FinancialCardProps) {
  const quoteAmountRef = useRef<HTMLInputElement>(null);
  const quoteDetailsRef = useRef<HTMLTextAreaElement>(null);

  const applyTemplate = (amount: string, details: string) => {
    if (quoteAmountRef.current) quoteAmountRef.current.value = amount;
    if (quoteDetailsRef.current) quoteDetailsRef.current.value = details;
  };

  const latestQuote = request.quotes[0];

  if (request.invoice) {
    return (
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
    );
  }

  if (latestQuote) {
    return (
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
    );
  }

  return (
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
  );
}