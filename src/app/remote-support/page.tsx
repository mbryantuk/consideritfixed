import Header from '@/components/Header';
import Breadcrumbs from '@/components/Breadcrumbs';
import styles from './remote-support.module.css';
import Link from 'next/link';
import { Monitor, CheckSquare } from 'lucide-react';
import RemoteSupportClient from './RemoteSupportClient';

export const metadata = {
  title: "Remote Support Tools | Consider IT Fixed",
  description: "Securely download remote support tools for your session with our technician. Safe, temporary access to fix your tech issues remotely.",
};

export default function RemoteSupport() {
  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.topContent}>
          <Breadcrumbs items={[{ label: 'Remote Support' }]} />
        </div>

        <section className={styles.hero}>
          <Monitor size={64} className={styles.heroIcon} />
          <h1>Remote Support Portal</h1>
          <p>Download the tools needed for your remote assistance session.</p>
        </section>

        <RemoteSupportClient />

        <section className={styles.preFlightSection} style={{ marginTop: '4rem', padding: '3rem 2rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '16px' }}>
          <div className={styles.sectionHeader} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <CheckSquare size={48} color="var(--secondary)" />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Pre-Flight Check</h2>
            <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>Do these 3 simple things before your session starts:</p>
          </div>
          
          <div className={styles.checkGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
            <div className={styles.checkCard} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '0.5rem' }}>1.</div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--primary)' }}>Plug In Power</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0.5rem 0' }}>If using a laptop, ensure it&apos;s connected to its charger so it doesn&apos;t die mid-fix.</p>
            </div>
            
            <div className={styles.checkCard} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '0.5rem' }}>2.</div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--primary)' }}>Close Private Files</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0.5rem 0' }}>Close any sensitive documents or websites you don&apos;t want us to see.</p>
            </div>

            <div className={styles.checkCard} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '0.5rem' }}>3.</div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--primary)' }}>Stable Internet</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0.5rem 0' }}>Try to stay near your Wi-Fi router for the best connection during the session.</p>
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <h2>Haven&apos;t booked a session yet?</h2>
          <p>Remote support is available UK-wide for many technical issues.</p>
          <Link href="/contact" className="btn btn-accent">Request Remote Support Now</Link>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>&copy; {new Date().getFullYear()} Consider IT Fixed. Secure Remote Assistance.</p>
        </div>
      </footer>
    </div>
  );
}
