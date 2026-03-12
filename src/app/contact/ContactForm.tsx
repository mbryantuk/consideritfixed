'use client';

import { useState } from 'react';
import styles from './contact.module.css';
import { submitContactForm } from './actions';
import Link from 'next/link';
import confetti from 'canvas-confetti';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await submitContactForm(formData);
      if (result.success) {
        setStatus('success');
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0D9488', '#EA580C', '#0F172A']
        });
      } else {
        setStatus('error');
        setErrorMessage(result.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to submit request.');
    }
  };

  if (status === 'success') {
    return (
      <div className={styles.successMessage}>
        <h2>Request Received!</h2>
        <p>Thank you for reaching out. We have sent a confirmation email to you, and we will be in touch shortly.</p>
        <Link href="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>Return Home</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputGroup}>
        <label htmlFor="name">Your Name *</label>
        <input type="text" id="name" name="name" required className={styles.input} disabled={status === 'submitting'} />
      </div>
      
      <div className={styles.inputGroup}>
        <label htmlFor="email">Email Address *</label>
        <input type="email" id="email" name="email" required className={styles.input} disabled={status === 'submitting'} />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="phone">Phone Number</label>
        <input type="tel" id="phone" name="phone" className={styles.input} disabled={status === 'submitting'} />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="address">Your Address (optional - for home visits)</label>
        <input type="text" id="address" name="address" className={styles.input} disabled={status === 'submitting'} placeholder="E.g. 12 High Street, Felpham" />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="availability">Best time to contact you?</label>
        <input type="text" id="availability" name="availability" className={styles.input} disabled={status === 'submitting'} placeholder="E.g. Tuesday mornings, after 5 PM..." />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="message">How can we help? *</label>
        <textarea id="message" name="message" required rows={5} className={styles.textarea} disabled={status === 'submitting'} placeholder="E.g., My Wi-Fi keeps dropping, or I need help setting up a new printer..."></textarea>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="photo">Upload a photo of your error screen (optional)</label>
        <input type="file" id="photo" name="photo" accept="image/*" className={styles.input} disabled={status === 'submitting'} />
        <span className={styles.checkboxNote} style={{ marginTop: '0.25rem', display: 'block' }}>This helps us provide a quicker and more accurate quote.</span>
      </div>

      <div className={styles.checkboxGroup}>
        <label className={styles.checkboxLabel}>
          <input type="checkbox" name="isEmergency" disabled={status === 'submitting'} />
          <strong>🚨 This is an Emergency!</strong>
          <span className={styles.checkboxNote}>Select this if you need immediate assistance (e.g. business down, major data loss).</span>
        </label>
      </div>


      {status === 'error' && (
        <div className={styles.errorAlert} role="alert">
          {errorMessage}
        </div>
      )}

      <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
