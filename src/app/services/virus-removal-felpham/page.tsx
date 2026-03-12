import Link from 'next/link';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Image from 'next/image';
import Header from '@/components/Header';
import { Metadata } from 'next';
import styles from './service-landing.module.css';
import { getAllSettings } from '@/lib/settings';

export const metadata: Metadata = {
  title: "Professional Virus & Malware Removal in Felpham | Consider IT Fixed",
  description: "Is your computer slow or showing pop-ups? Fast, local virus removal service in Felpham and Bognor Regis. No fix, no fee. Friendly, jargon-free help.",
  keywords: "virus removal felpham, malware removal bognor regis, slow computer fix West Sussex, spyware removal",
};

export default async function VirusRemovalLanding() {
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
            <span className={styles.badge}>Local Felpham Service</span>
            <h1>Computer Virus & Malware Removal <span>in Felpham</span></h1>
            <p>Is your computer acting strange, running slow, or showing annoying pop-ups? I provide thorough, professional virus cleaning (also known as &apos;malware&apos; removal) right here in Felpham and Bognor Regis.</p>
            <div className={styles.heroActions}>
              <Link href="/contact" className="btn btn-primary">Book a Virus Clean Now</Link>
              <Link href="/pricing" className="btn btn-outline">View Fixed Rates</Link>
            </div>
          </div>
        </section>

        <section className={styles.signsSection}>
          <h2>Signs You Might Have a Virus</h2>
          <div className={styles.grid}>
            <div className={styles.card}>
              <span className={styles.icon}>🐢</span>
              <h4>Sudden Slowness</h4>
              <p>Your computer takes forever to start or programs are lagging for no reason.</p>
            </div>
            <div className={styles.card}>
              <span className={styles.icon}>🪟</span>
              <h4>Strange Pop-ups</h4>
              <p>Advertisements or &quot;security warnings&quot; appearing even when you aren&apos;t browsing the web.</p>
            </div>
            <div className={styles.card}>
              <span className={styles.icon}>📧</span>
              <h4>Strange Emails</h4>
              <p>Friends reporting they received odd emails or messages from your accounts.</p>
            </div>
            <div className={styles.card}>
              <span className={styles.icon}>🔋</span>
              <h4>Battery Drain</h4>
              <p>On laptops, the battery is dying much faster than it used to, or the fan is always loud.</p>
            </div>
          </div>
        </section>

        <section className={styles.processSection}>
          <div className={styles.processContent}>
            <h2>Our 4-Step Cleaning Process</h2>
            <ol className={styles.steps}>
              <li>
                <strong>Deep Diagnostic:</strong> We use professional tools to identify every trace of malware, spyware, and viruses.
              </li>
              <li>
                <strong>Safe Removal:</strong> We carefully remove the threats while protecting your precious photos, documents, and files.
              </li>
              <li>
                <strong>Security Hardening:</strong> We&apos;ll ensure your Windows or Mac security settings are updated to prevent it happening again.
              </li>
              <li>
                <strong>Free Advice:</strong> We&apos;ll show you exactly what to look out for to stay safe from scams and malicious websites in the future.
              </li>
            </ol>
          </div>
        </section>

        <section className={styles.trustSection}>
          <div className={styles.trustBox}>
            <h3>No Fix, No Fee Guarantee</h3>
            <p>If we cannot successfully remove the virus or restore your computer&apos;s performance, you won&apos;t pay a penny for the labour. That&apos;s our promise to our Felpham neighbors.</p>
            <div className={styles.priceCap}>
              <strong>Fixed Rate:</strong> Most virus removals are covered by our <strong>£80 Price Cap</strong>, no matter how long the scan takes!
            </div>
          </div>
        </section>

        <section id="pricing" className={styles.pricingSection}>
          <h2>Transparent Pricing</h2>
          <p>No hidden fees or surprise hourly charges. You&apos;ll always know the cost upfront.</p>
          <div className={styles.priceGrid}>
            <div className={styles.priceCard}>
              <div>
                <h3 className={styles.priceTitle}>Diagnostic Scan</h3>
                <p className={styles.priceAmount}>Free</p>
              </div>
              <p className={styles.priceDesc}>We&apos;ll identify the infection and explain the removal plan at no cost to you.</p>
            </div>
            <div className={styles.priceCard}>
              <div>
                <h3 className={styles.priceTitle}>Standard Removal</h3>
                <p className={styles.priceAmount}>£40-£80</p>
              </div>
              <p className={styles.priceDesc}>Thorough cleaning, security updates, and performance tuning. Capped at £80.</p>
            </div>
            <div className={styles.priceCard}>
              <div>
                <h3 className={styles.priceTitle}>Senior Discount</h3>
                <p className={styles.priceAmount}>-25%</p>
              </div>
              <p className={styles.priceDesc}>We offer a 25% discount on all labour for residents aged 65 and over.</p>
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <h2>Don&apos;t let a virus compromise your privacy</h2>
          <p>Get your computer cleaned by a local professional you can trust.</p>
          <Link href="/contact" className="btn btn-accent">Request Assistance in Felpham</Link>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>&copy; {new Date().getFullYear()} Consider IT Fixed. Serving the PO22 community.</p>
          <nav className={styles.footerLinks}>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/">Back to Home</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}