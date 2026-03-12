import Link from 'next/link';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Image from 'next/image';
import Header from '@/components/Header';
import { Metadata } from 'next';
import styles from '../virus-removal-felpham/service-landing.module.css';
import { getAllSettings } from '@/lib/settings';

export const metadata: Metadata = {
  title: "Wi-Fi & Home Networking Support in Bognor Regis | Consider IT Fixed",
  description: "Fix slow Wi-Fi, dead zones, and connection drops in Bognor Regis and Felpham. Professional home networking assistance. No fix, no fee.",
  keywords: "wifi repair bognor regis, home networking help Felpham, slow internet fix, wifi dead zones West Sussex",
};

export default async function WifiTroubleshootingLanding() {
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
            <span className={styles.badge}>Bognor Regis Specialist</span>
            <h1>Fast, Reliable Wi-Fi <span>in Every Room</span></h1>
            <p>Fed up with buffering, connection drops, or Wi-Fi dead zones in your Bognor Regis home? We specialize in making home networks fast, secure, and reliable.</p>
            <div className={styles.heroActions}>
              <Link href="/contact" className="btn btn-primary">Fix My Wi-Fi Now</Link>
              <Link href="/pricing" className="btn btn-outline">Pricing Guide</Link>
            </div>
          </div>
        </section>

        <section className={styles.signsSection}>
          <h2>Common Wi-Fi Frustrations We Solve</h2>
          <div className={styles.grid}>
            <div className={styles.card}>
              <span className={styles.icon}>📶</span>
              <h4>Dead Zones</h4>
              <p>Rooms where the signal just doesn&apos;t reach, or is too weak to use.</p>
            </div>
            <div className={styles.card}>
              <span className={styles.icon}>📉</span>
              <h4>Buffering</h4>
              <p>Videos stopping to load or Zoom calls dropping out at critical moments.</p>
            </div>
            <div className={styles.card}>
              <span className={styles.icon}>🔒</span>
              <h4>Security Concerns</h4>
              <p>Ensuring your home network is private and your passwords are strong.</p>
            </div>
            <div className={styles.card}>
              <span className={styles.icon}>🖨️</span>
              <h4>Device Connection</h4>
              <p>Getting your printer, smart TV, or speakers to actually stay connected.</p>
            </div>
          </div>
        </section>

        <section className={styles.processSection}>
          <div className={styles.processContent}>
            <h2>Professional Networking Help</h2>
            <p style={{ marginBottom: '2rem' }}>We don&apos;t just &quot;turn it off and on again.&quot; We provide comprehensive networking solutions tailored to your home layout.</p>
            <ul className={styles.steps} style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '1.5rem' }}>
                <strong style={{ color: 'var(--secondary)', fontSize: '1.2rem' }}>Signal Mapping:</strong> We&apos;ll identify exactly where the interference and weak spots are in your house.
              </li>
              <li style={{ marginBottom: '1.5rem' }}>
                <strong style={{ color: 'var(--secondary)', fontSize: '1.2rem' }}>Router Optimization:</strong> Often your existing equipment just needs better positioning or configuration.
              </li>
              <li style={{ marginBottom: '1.5rem' }}>
                <strong style={{ color: 'var(--secondary)', fontSize: '1.2rem' }}>Mesh Wi-Fi Setup:</strong> For larger homes, I can install and configure mesh systems for seamless coverage.
              </li>
              <li style={{ marginBottom: '1.5rem' }}>
                <strong style={{ color: 'var(--secondary)', fontSize: '1.2rem' }}>Cabling & Hubs:</strong> Professional installation of ethernet points for the fastest possible speeds.
              </li>
            </ul>
          </div>
        </section>

        <section className={styles.trustSection}>
          <div className={styles.trustBox}>
            <h3>Local Knowledge Matters</h3>
            <p>Based in Felpham, we know the local Bognor Regis internet providers (Sky, BT, Virgin, etc.) and their specific quirks. We&apos;ll deal with the technical side so you don&apos;t have to.</p>
            <div className={styles.priceCap}>
              <strong>No Fix, No Fee:</strong> If we can&apos;t improve your signal, you don&apos;t pay.
            </div>
          </div>
        </section>

        <section id="pricing" className={styles.pricingSection}>
          <h2>Wi-Fi Service Rates</h2>
          <p>Professional networking support at clear, local rates.</p>
          <div className={styles.priceGrid}>
            <div className={styles.priceCard}>
              <div>
                <h3 className={styles.priceTitle}>Home Signal Audit</h3>
                <p className={styles.priceAmount}>£60</p>
              </div>
              <p className={styles.priceDesc}>Complete mapping of your home&apos;s signal strength and interference identification.</p>
            </div>
            <div className={styles.priceCard}>
              <div>
                <h3 className={styles.priceTitle}>Router Optimization</h3>
                <p className={styles.priceAmount}>£40</p>
              </div>
              <p className={styles.priceDesc}>Configuration and relocation of your existing equipment for peak performance.</p>
            </div>
            <div className={styles.priceCard}>
              <div>
                <h3 className={styles.priceTitle}>Mesh Network Setup</h3>
                <p className={styles.priceAmount}>£80</p>
              </div>
              <p className={styles.priceDesc}>Professional installation and tuning of a whole-home Wi-Fi system (equipment not included).</p>
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <h2>Ready for stress-free internet?</h2>
          <p>Contact your local Bognor tech helper today.</p>
          <Link href="/contact" className="btn btn-accent">Request a Wi-Fi Audit</Link>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>&copy; {new Date().getFullYear()} Consider IT Fixed. Serving Bognor Regis & Felpham.</p>
          <nav className={styles.footerLinks}>
            <Link href="/">Home</Link>
            <Link href="/services/virus-removal-felpham">Virus Removal</Link>
            <Link href="/pricing">Pricing</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}