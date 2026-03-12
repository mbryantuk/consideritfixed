import Link from 'next/link';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Image from 'next/image';
import Header from '@/components/Header';
import { Metadata } from 'next';
import styles from '../virus-removal-felpham/service-landing.module.css';
import { getAllSettings } from '@/lib/settings';

export const metadata: Metadata = {
  title: "Patient Tech Support for Seniors in Felpham & Bognor | Consider IT Fixed",
  description: "Specialized, patient IT help for seniors. Learning to video call, using iPads, avoiding scams, and staying connected. No jargon, just clear help.",
  keywords: "tech help for seniors, computer lessons for elderly, tablet tutoring Bognor Regis, iPad help Felpham",
};

export default async function SeniorsSupportLanding() {
  const settings = await getAllSettings();
  const serviceHeroImage = settings.serviceHeroImage || '/images/tech-help.webp';

  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        <section 
          className={styles.hero}
          style={{ '--hero-bg': `url('${serviceHeroImage}')` } as React.CSSProperties}
        >
          <div className={styles.heroContent}>
            <span className={styles.badge}>Specialist Patient Support</span>
            <h1>Friendly Tech Help <span>for Seniors</span></h1>
            <p>Technology should bring you closer to your loved ones, not push you away. I provide patient, jargon-free support tailored specifically for seniors in Felpham and Bognor Regis.</p>
            <div className={styles.heroActions}>
              <Link href="/contact" className="btn btn-primary">Book a Home Visit</Link>
              <Link href="/pricing" className="btn btn-outline">View My Senior Discount</Link>
            </div>
          </div>
        </section>

        <section className={styles.signsSection}>
          <h2>How I Can Help You</h2>
          <div className={styles.grid}>
            <div className={styles.card}>
              <span className={styles.icon}>👵</span>
              <h4>Patient Tutoring</h4>
              <p>We&apos;ll go at your pace. I can teach you how to use your iPad, laptop, or smartphone with zero stress.</p>
            </div>
            <div className={styles.card}>
              <span className={styles.icon}>📞</span>
              <h4>Staying Connected</h4>
              <p>Setup and lessons for WhatsApp, Zoom, or FaceTime so you can see your grandkids anytime.</p>
            </div>
            <div className={styles.card}>
              <span className={styles.icon}>🛡️</span>
              <h4>Scam Prevention</h4>
              <p>I&apos;ll show you exactly how to spot &quot;fake&quot; emails and phone calls, keeping your money and privacy safe.</p>
            </div>
            <div className={styles.card}>
              <span className={styles.icon}>🛒</span>
              <h4>Online Shopping</h4>
              <p>Learn how to safely order groceries or gifts online without worrying about technical hitches.</p>
            </div>
          </div>
        </section>

        <section className={styles.processSection}>
          <div className={styles.processContent}>
            <h2>The &quot;Tea & Tech&quot; Approach</h2>
            <p style={{ marginBottom: '2rem', fontSize: '1.25rem' }}>I believe tech support should be as comfortable as a chat over a cup of tea. That&apos;s why I created my signature sessions:</p>
            <ul className={styles.steps} style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '1.5rem' }}>
                <strong style={{ color: 'var(--secondary)', fontSize: '1.3rem' }}>No Jargon:</strong> I use simple, everyday language. No &quot;SSIDs&quot; or &quot;IP addresses&quot; here.
              </li>
              <li style={{ marginBottom: '1.5rem' }}>
                <strong style={{ color: 'var(--secondary)', fontSize: '1.3rem' }}>Hands-On:</strong> I don&apos;t just &quot;do it for you.&quot; I guide your hands so you build the muscle memory to do it yourself.
              </li>
              <li style={{ marginBottom: '1.5rem' }}>
                <strong style={{ color: 'var(--secondary)', fontSize: '1.3rem' }}>Written Notes:</strong> I can leave you with a simple, large-print &quot;Cheat Sheet&quot; for everything we covered.
              </li>
            </ul>
          </div>
        </section>

        <section className={styles.trustSection}>
          <div className={styles.trustBox}>
            <h3>Special Rate for Over-65s</h3>
            <p>We are committed to making tech support accessible. That&apos;s why we offer a discounted rate for all members of our senior community.</p>

          </div>
        </section>

        <section id="pricing" className={styles.pricingSection}>
          <h2>Friendly Rates for Elders</h2>
          <p>Simple, patient support with a community-focused discount.</p>
          <div className={styles.priceGrid}>
            <div className={styles.priceCard}>
              <div>
                <h3 className={styles.priceTitle}>&quot;Tea & Tech&quot; Lesson</h3>
                <p className={styles.priceAmount}>£30</p>
              </div>
              <p className={styles.priceDesc}>A patient, 1-hour session in your home covering any device you&apos;d like to learn.</p>
            </div>
            <div className={styles.priceCard}>
              <div>
                <h3 className={styles.priceTitle}>Scam Safety Check</h3>
                <p className={styles.priceAmount}>£30</p>
              </div>
              <p className={styles.priceDesc}>We&apos;ll review your accounts and emails to ensure you&apos;re protected from scammers.</p>
            </div>
            <div className={styles.priceCard}>
              <div>
                <h3 className={styles.priceTitle}>Setup & Install</h3>
                <p className={styles.priceAmount}>£30</p>
              </div>
              <p className={styles.priceDesc}>Setting up a new phone, iPad, or printer and showing you how to use it.</p>
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <h2>Ready to feel confident with your gadgets?</h2>
          <p>Call or book a session online today. We&apos;re here to help.</p>
          <Link href="/contact" className="btn btn-accent">Request a &quot;Tea & Tech&quot; Session</Link>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>&copy; {new Date().getFullYear()} Consider IT Fixed. Serving our local Felpham elders.</p>
          <nav className={styles.footerLinks}>
            <Link href="/">Home</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/services/wifi-troubleshooting-bognor">Wi-Fi Help</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}