'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Image from 'next/image';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Link from 'next/link';
import styles from './login.module.css';
import Header from '@/components/Header';

export default function Login() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn('email', {
        email,
        redirect: true,
        callbackUrl: '/portal'
      });
      
      if (result?.error) {
        setError('Something went wrong. Please try again.');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <div className={styles.loginCard}>
          <div className={styles.logo} style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <Image src="/logo.svg" alt="Consider IT Fixed Logo" width={80} height={80} />
          </div>
          <h1>Welcome to Your Portal</h1>
          <p className={styles.description}>
            Enter your email address below. We will send you a secure link to sign in instantly—no password required.
          </p>

          <div className={styles.infoBox}>
            <p><strong>🤔 How it works:</strong> No more forgotten passwords! We send a unique link to your email. Click it, and you&apos;re in. It&apos;s the most secure way to protect your account.</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g., hello@example.com"
                required
                className={styles.input}
                disabled={isLoading}
              />
            </div>
            
            {error && <div className={styles.error} role="alert">{error}</div>}

            <button 
              type="submit" 
              className={`btn-primary ${styles.submitButton}`}
              disabled={isLoading}
            >
              {isLoading ? 'Sending Link...' : 'Send Secure Login Link'}
            </button>
          </form>
          
          <p className={styles.spamReminder}>
            Don&apos;t see the email? Please check your <strong>Spam or Junk folder</strong>.
          </p>
          
          <div className={styles.magicLinkTip}>
            <p><strong>💡 Tip:</strong> Open the link on this same device to be logged in instantly.</p>
          </div>
          
          <div className={styles.helpText}>
            <p>New here? Just enter your email and we will create an account for you automatically.</p>
          </div>
        </div>
      </main>
    </div>
  );
}