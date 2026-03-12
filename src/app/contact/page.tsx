import Header from '@/components/Header';
import Breadcrumbs from '@/components/Breadcrumbs';
import styles from './contact.module.css';
import ContactForm from './ContactForm';
import { getAllSettings } from '@/lib/settings';

export const metadata = {
  title: 'Contact Us | Consider IT Fixed',
  description: 'Get in touch for fast, jargon-free tech support.',
};

export default async function ContactPage() {
  const settings = await getAllSettings();
  const displayPhone = settings.phoneNumber || "07419 738500";
  const telPhone = settings.phoneTel || "07419738500";

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <div className={styles.topContent}>
          <Breadcrumbs items={[{ label: 'Contact Us' }]} />
        </div>
        
        <div className={styles.contentWrapper}>
          <div className={styles.infoSection}>
            <h1>How can we help?</h1>
            <p className={styles.description}>
              Fill out the form below and we&apos;ll get back to you as soon as possible. No jargon, no stress, just friendly advice.
            </p>

            <div className={styles.contactDetails}>
              <h3>Prefer to call?</h3>
              <p>You can reach us directly at:</p>
              <a href={`tel:${telPhone}`} className={styles.phoneLink}>
                <span className={styles.phoneIcon}>📞</span>
                <strong>{displayPhone}</strong>
              </a>
            </div>
            
            <div className={styles.guarantee}>
              <h3>Our Promise</h3>
              <ul>
                <li>✓ No Fix, No Fee</li>
                <li>✓ Jargon-Free Explanations</li>
                <li>✓ Free Local Call-Outs</li>
              </ul>
            </div>
          </div>

          <div className={styles.formSection}>
            <div className={styles.formCard}>
              <ContactForm />
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>&copy; {new Date().getFullYear()} Consider IT Fixed. Serving Felpham & Bognor Regis.</p>
        </div>
      </footer>
    </div>
  );
}
