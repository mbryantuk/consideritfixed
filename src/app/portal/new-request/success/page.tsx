import Link from 'next/link';
import Header from '@/components/Header';
import styles from '../new-request.module.css';
import { CheckCircle } from 'lucide-react';

export default function RequestSuccess() {
  return (
    <div className={styles.container}>
      <Header isPortal />
      <main className={styles.main}>
        <div className={styles.formCard} style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--secondary)', marginBottom: '1.5rem' }}>
            <CheckCircle size={64} style={{ margin: '0 auto' }} />
          </div>
          <h1>Request Submitted!</h1>
          <p className={styles.description}>
            Thank you for reaching out. A technician has been notified and will review your request shortly. 
            We usually respond with a quote or follow-up question within 24 hours.
          </p>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/portal" className="btn btn-primary">Return to Dashboard</Link>
          </div>
        </div>
      </main>
    </div>
  );
}