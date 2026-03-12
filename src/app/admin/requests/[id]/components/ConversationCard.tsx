'use client';

import { useRef } from "react";
import Image from "next/image";
import styles from "../request-detail.module.css";
import { SubmitButton } from "./SubmitButton";

interface ConversationCardProps {
  request: any;
  addNoteAction: (formData: FormData) => Promise<void>;
}

export function ConversationCard({ request, addNoteAction }: ConversationCardProps) {
  const noteTextRef = useRef<HTMLTextAreaElement>(null);

  const applyNoteTemplate = (text: string) => {
    if (noteTextRef.current) noteTextRef.current.value = text;
  };

  return (
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
                    <Image 
                      src={note.attachmentUrl} 
                      alt="Attached image" 
                      className={styles.attachmentPreview} 
                      width={800} 
                      height={600} 
                      style={{ width: '100%', height: 'auto', objectFit: 'contain' }} 
                    />
                  </a>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <form action={addNoteAction} className={styles.noteForm}>
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
        />
        <SubmitButton style={{ marginTop: '0.5rem' }}>Send Message</SubmitButton>
      </form>
    </div>
  );
}