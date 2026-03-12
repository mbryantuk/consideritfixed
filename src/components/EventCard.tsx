'use client';

import { useState } from 'react';
import styles from './EventCard.module.css';
import { bookWorkshop } from '@/app/actions/events';
import { Loader2, CheckCircle } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function EventCard({ event }: { event: any }) {
  const [showForm, setShowForm] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const date = new Date(event.eventDate);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();

  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    const formData = new FormData(e.currentTarget);
    const res = await bookWorkshop(formData);
    if (res.success) {
      setStatus('success');
    } else {
      setStatus('error');
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.eventDate}>
        <span className={styles.day}>{day}</span>
        <span className={styles.month}>{month}</span>
      </div>
      <div className={styles.eventInfo}>
        <h3>{event.title}</h3>
        <p><strong>Where:</strong> {event.location}</p>
        {event.startTime && <p><strong>Time:</strong> {event.startTime} {event.endTime ? `- ${event.endTime}` : ''}</p>}
        <div className={styles.eventDesc}>{event.description}</div>
        
        {!showForm && status !== 'success' && (
          <button onClick={() => setShowForm(true)} className={styles.bookBtn}>Book My Place</button>
        )}

        {showForm && status !== 'success' && (
          <form onSubmit={handleBooking} className={styles.bookingForm}>
            <input type="hidden" name="eventId" value={event.id} />
            <input type="text" name="name" placeholder="Your Name" required className={styles.input} />
            <input type="email" name="email" placeholder="Email Address" required className={styles.input} />
            <div className={styles.formActions}>
              <button type="submit" className={styles.submitBtn} disabled={status === 'submitting'}>
                {status === 'submitting' ? <Loader2 className={styles.spin} size={16} /> : 'Confirm Booking'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className={styles.cancelBtn}>Cancel</button>
            </div>
          </form>
        )}

        {status === 'success' && (
          <div className={styles.success}>
            <CheckCircle size={16} />
            <span>Booking Confirmed! See you there.</span>
          </div>
        )}
      </div>
    </div>
  );
}
