'use client';

import { useState } from 'react';
import styles from './PostcodeChecker.module.css';
import { CheckCircle, XCircle, Search, Loader2, Mail } from 'lucide-react';
import { lookupPostcode, isSupportedPostcode } from '@/lib/postcode';
import { joinWaitlist } from './PostcodeActions';

export default function PostcodeChecker() {
  const [postcode, setPostcode] = useState('');
  const [loading, setLoading] = useState(false);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<{ status: 'supported' | 'unsupported' | 'invalid' | null, data?: any } | null>(null);
  const [waitlistStatus, setWaitlistStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const checkPostcode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setWaitlistStatus('idle');

    const formatted = postcode.trim().toUpperCase().replace(/\s/g, '');
    
    if (!formatted || formatted.length < 2) {
      setResult({ status: 'invalid' });
      setLoading(false);
      return;
    }

    const data = await lookupPostcode(formatted);
    
    if (!data) {
      if (isSupportedPostcode(formatted)) {
        setResult({ status: 'supported' });
      } else {
        setResult({ status: 'unsupported' });
      }
    } else {
      if (isSupportedPostcode(formatted)) {
        setResult({ status: 'supported', data });
      } else {
        setResult({ status: 'unsupported', data });
      }
    }
    setLoading(false);
  };

  const handleWaitlist = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setWaitlistStatus('submitting');
    const formData = new FormData(e.currentTarget);
    formData.append('postcode', postcode);
    
    const res = await joinWaitlist(formData);
    if (res.success) {
      setWaitlistStatus('success');
    } else {
      setWaitlistStatus('error');
    }
  };

  return (
    <div className={styles.container}>
      <h3>Check if we cover your area</h3>
      <form onSubmit={checkPostcode} className={styles.form}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            placeholder="Enter your postcode (e.g. PO22)"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            className={styles.input}
            aria-label="Postcode"
            disabled={loading}
          />
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? <Loader2 className={styles.spin} size={20} /> : <Search size={20} />}
            <span>{loading ? 'Checking...' : 'Check'}</span>
          </button>
        </div>
      </form>

      {result?.status === 'supported' && (
        <div className={`${styles.result} ${styles.supported}`}>
          <CheckCircle size={20} />
          <p>Great news! We provide home visits in <strong>{result.data?.admin_ward || postcode.toUpperCase()}</strong>.</p>
        </div>
      )}

      {result?.status === 'unsupported' && (
        <div className={`${styles.result} ${styles.unsupported}`}>
          <div className={styles.unsupportedHeader}>
            <XCircle size={20} />
            <p>We don&apos;t offer home visits in <strong>{postcode.toUpperCase()}</strong> yet.</p>
          </div>
          
          <div className={styles.waitlistCard}>
            {waitlistStatus === 'success' ? (
              <p className={styles.waitlistSuccess}>✓ You&apos;ve been added to the waitlist. We&apos;ll let you know when we expand to your area!</p>
            ) : (
              <form onSubmit={handleWaitlist} className={styles.waitlistForm}>
                <p>Join our waitlist to be notified when we expand here:</p>
                <div className={styles.waitlistInputGroup}>
                  <Mail size={18} className={styles.mailIcon} />
                  <input type="email" name="email" placeholder="Your email address" required className={styles.waitlistInput} />
                  <button type="submit" className={styles.waitlistBtn} disabled={waitlistStatus === 'submitting'}>
                    {waitlistStatus === 'submitting' ? 'Joining...' : 'Join Waitlist'}
                  </button>
                </div>
              </form>
            )}
          </div>
          
          <p className={styles.remoteNote}><strong>Remember:</strong> We still provide <strong>Remote Support</strong> anywhere in the UK!</p>
        </div>
      )}

      {result?.status === 'invalid' && (
        <p className={styles.error}>Please enter a valid UK postcode.</p>
      )}
    </div>
  );
}
