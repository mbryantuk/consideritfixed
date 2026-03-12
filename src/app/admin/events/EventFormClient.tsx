'use client';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from 'react';
import styles from '../blog/blog-admin.module.css';
import Link from 'next/link';
import MarkdownEditor from '@/components/MarkdownEditor';

export default function EventFormClient({ 
  event, 
  action 
}: { 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  event?: any, 
  action: (formData: FormData) => Promise<void> 
}) {
  return (
    <form action={action} className={styles.form}>
      {event && <input type="hidden" name="id" value={event.id} />}
      <div className={styles.card}>
        <div className={styles.inputGroup}>
          <label htmlFor="title">Event Title</label>
          <input 
            id="title" 
            name="title" 
            type="text" 
            required 
            defaultValue={event?.title || ''} 
            className={styles.input} 
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="eventDate">Date</label>
          <input 
            id="eventDate" 
            name="eventDate" 
            type="date" 
            required 
            defaultValue={event?.eventDate ? new Date(event.eventDate).toISOString().split('T')[0] : ''} 
            className={styles.input} 
          />
        </div>

        <div className={styles.grid} style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className={styles.inputGroup}>
            <label htmlFor="startTime">Start Time</label>
            <input id="startTime" name="startTime" type="text" placeholder="e.g. 2:00 PM" defaultValue={event?.startTime || ''} className={styles.input} />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="endTime">End Time</label>
            <input id="endTime" name="endTime" type="text" placeholder="e.g. 3:30 PM" defaultValue={event?.endTime || ''} className={styles.input} />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="location">Location</label>
          <input 
            id="location" 
            name="location" 
            type="text" 
            required 
            defaultValue={event?.location || ''} 
            placeholder="e.g. Felpham Village Hall" 
            className={styles.input} 
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Description (Markdown)</label>
          <MarkdownEditor name="description" initialValue={event?.description || ''} />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" name="published" defaultChecked={event?.published} />
            Show on website immediately?
          </label>
        </div>

        <div className={styles.actions}>
          <Link href="/admin/events" className="btn btn-secondary">Cancel</Link>
          <button type="submit" className="btn btn-primary">{event ? 'Save Changes' : 'Schedule Event'}</button>
        </div>
      </div>
    </form>
  );
}