'use client';

import { useState } from 'react';
import { subscribeToNewsletter } from '@/app/actions/newsletter';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';
import styles from './NewsletterForm.module.css';

export default function NewsletterForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setMessage('');

    const formData = new FormData(e.currentTarget);
    const result = await subscribeToNewsletter(formData);

    if (result.success) {
      setStatus('success');
      setMessage('You have been subscribed! Keep an eye on your inbox.');
    } else {
      setStatus('error');
      setMessage(result.error || 'Something went wrong.');
    }
  };

  if (status === 'success') {
    return (
      <div className={styles.success}>
        <CheckCircle size={20} />
        <p>{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputGroup}>
        <Mail className={styles.icon} size={18} />
        <input 
          type="email" 
          name="email" 
          placeholder="Your email address" 
          required 
          className={styles.input}
          disabled={status === 'submitting'}
        />
      </div>
      <button type="submit" className="btn btn-secondary" disabled={status === 'submitting'}>
        {status === 'submitting' ? <Loader2 className={styles.spin} size={18} /> : 'Sign Up'}
      </button>
      {status === 'error' && <p className={styles.error}>{message}</p>}
    </form>
  );
}
