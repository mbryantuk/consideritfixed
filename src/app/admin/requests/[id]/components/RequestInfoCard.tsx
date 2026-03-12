'use client';

import Link from "next/link";
import Image from "next/image";
import styles from "../request-detail.module.css";
import { SubmitButton } from "./SubmitButton";

interface RequestInfoCardProps {
  request: any;
  updateStatusAction: (formData: FormData) => Promise<void>;
}

export function RequestInfoCard({ request, updateStatusAction }: RequestInfoCardProps) {
  return (
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
          <form action={updateStatusAction}>
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
            <Image 
              src={request.attachmentUrl} 
              alt="Issue photo" 
              className={styles.attachmentPreview} 
              width={800} 
              height={600} 
              style={{ width: '100%', height: 'auto', objectFit: 'contain' }} 
            />
          </a>
        </div>
      )}
    </div>
  );
}