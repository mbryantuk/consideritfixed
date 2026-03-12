import Link from 'next/link';
import styles from './pricing.module.css';
import Header from '@/components/Header';
import Breadcrumbs from '@/components/Breadcrumbs';
import NoFixNoFeeBadge from '@/components/NoFixNoFeeBadge';
import PriceCalculator from '@/components/PriceCalculator';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { getAllSettings } from '@/lib/settings';

export const metadata: Metadata = {
  title: "Fair Pricing & Rates | Tech Support Felpham & Bognor Regis",
  description: "Transparent, compassionate pricing for computer repair and tech support in Felpham and Bognor Regis. No Fix, No Fee and capped rates.",
};

export default async function Pricing() {
  const settings = await getAllSettings();
  const rates = await prisma.priceRate.findMany({
    orderBy: { order: 'asc' }
  });

  const businessName = settings.siteName || "Consider IT Fixed";
  const calendlyUrl = settings.calendlyUrl || "https://calendly.com/consideritfixed-support";

  return (
    <div className={styles.container}>
      
      <Header />

      <main id="main-content" className={styles.main}>
        <div className={styles.topContent}>
          <Breadcrumbs items={[{ label: 'Pricing & Rates' }]} />
        </div>
        
        <section className={styles.hero}>
          <h1>Transparent, Compassionate Pricing</h1>
          <p className={styles.subtitle}>
            &quot;We believe tech support should relieve stress, not cause it. We don&apos;t use confusing jargon, we don&apos;t hide our fees, and if we can&apos;t fix your problem, you won&apos;t pay a penny.&quot;
          </p>
        </section>

        <section className={styles.promises}>
          <div className={styles.promiseCard}>
            <h3>No Fix, No Fee</h3>
            <p>If we cannot diagnose or resolve your problem, you pay nothing. Removing your financial anxiety is our priority.</p>
          </div>
          <div className={styles.promiseCard}>
            <h3>Free Local Call-Outs</h3>
            <p>Coming to your home is entirely free for all areas within a 15-mile radius of Felpham.</p>
          </div>
          <div className={styles.promiseCard}>
            <h3>Community Support</h3>
            <p>We offer a 10% discount on all labour for over-65s and community members on specific benefits.</p>
            <div className={styles.badgesRow}>
              <div className={styles.discountBadge}>
                <span className={styles.discountIcon} aria-hidden="true">👵👴</span>
                <strong>10% Over-65s Discount</strong>
              </div>
              <div className={styles.jargonBadge}>
                <span className={styles.jargonIcon} aria-hidden="true">🛡️</span>
                <strong>Jargon-Free Guarantee</strong>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.calculatorSection}>
          <div className={styles.sectionHeader} style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2>Instant Price Estimate</h2>
            <p>Select the services you need to see a rough idea of the cost.</p>
          </div>
          <PriceCalculator />
        </section>

        <section className={styles.rateCardSection}>
          <h2>Our Rate Card</h2>
          <div className={styles.tableContainer}>
            <table className={styles.rateTable}>
              <thead>
                <tr>
                  <th scope="col">Service</th>
                  <th scope="col">Description</th>
                  <th scope="col">Price</th>
                </tr>
              </thead>
              <tbody>
                {rates.length === 0 ? (
                  <tr>
                    <th scope="row"><strong>General Tech Support</strong></th>
                    <td>Troubleshooting, printer setup, Wi-Fi fixes, or just helping you learn how to use your device.</td>
                    <td><strong>£40 per hour</strong></td>
                  </tr>
                ) : (
                  rates.map(rate => (
                    <tr key={rate.id}>
                      <th scope="row"><strong>{rate.serviceName}</strong></th>
                      <td>{rate.description}</td>
                      <td><strong>{rate.price}</strong></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className={styles.tableNotes}>
            <p>* <strong>Free Call-outs:</strong> All locations within a 15-mile radius of Felpham, including Bognor Regis, Chichester, Littlehampton, Arundel, and Worthing.</p>
            <p>* <strong>Remote Support:</strong> Also available for anyone outside this radius via phone and screen-sharing.</p>
          </div>
        </section>
        
        <section className={styles.bookingSection}>
          <div className={styles.card}>
            <h2>Prefer to pick your own time?</h2>
            <p>You can now book a home visit or remote session directly using my online calendar.</p>
            <div style={{ marginTop: '1.5rem' }}>
              <a href={calendlyUrl} target="_blank" rel="noopener noreferrer" className="btn btn-accent">
                📅 Open Booking Calendar
              </a>
            </div>
            <p className={styles.mutedText} style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
              No upfront payment required. We&apos;ll confirm your slot within 2 hours.
            </p>
          </div>
        </section>

        <section className={styles.ctaSection}>
            <h2>Ready to get help?</h2>
            <p>Book a session or request a custom quote today.</p>
            <Link href="/contact" className="btn btn-primary">Get Expert Help</Link>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <NoFixNoFeeBadge />
            </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>&copy; {new Date().getFullYear()} <span className="notranslate">{businessName}</span>. Serving Felpham & Bognor Regis.</p>
          <nav className={styles.footerLinks} aria-label="Footer Navigation">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/portal">Customer Login</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}