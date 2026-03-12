import Header from '@/components/Header';
import Breadcrumbs from '@/components/Breadcrumbs';
import styles from './senior-safety.module.css';
import Link from 'next/link';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ShieldCheck, Eye, Lock, Smartphone, HelpCircle } from 'lucide-react';
import GuideActions from './GuideActions';

export const metadata = {
  title: "The 5-Step Senior Safety Guide | Free Tech Advice",
  description: "Stay safe online with our free guide tailored for seniors in Felpham and Bognor Regis. Simple steps to avoid scams and protect your privacy.",
};

export default function SeniorSafetyGuide() {
  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.topContent}>
          <Breadcrumbs items={[{ label: 'Senior Safety Guide' }]} />
        </div>

        <section className={styles.hero}>
          <h1>The 5-Step Senior Safety Guide</h1>
          <p>Simple, practical advice to help you stay safe and confident online.</p>
          <GuideActions />
        </section>

        <section className={styles.content}>
          <p style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>The 5-Step Senior Safety Guide is currently being updated. Please check back soon.</p>
        </section>

        <section className={styles.cta}>
          <h2>Want a personal security checkup?</h2>
          <p>I can visit your home in Felpham or Bognor Regis to ensure your devices are secure and show you exactly what to look out for.</p>
          <div className={styles.ctaButtons}>
            <Link href="/contact" className="btn btn-primary">Book a Security Session</Link>
            <Link href="/pricing" className="btn btn-outline">View Local Rates</Link>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>&copy; {new Date().getFullYear()} Consider IT Fixed. Keeping our local community safe.</p>
        </div>
      </footer>
    </div>
  );
}
