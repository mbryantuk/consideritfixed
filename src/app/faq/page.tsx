import Header from '@/components/Header';
import Breadcrumbs from '@/components/Breadcrumbs';
import styles from './faq.module.css';
import Link from 'next/link';
import { Metadata } from 'next';
import { getAllSettings } from '@/lib/settings';

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Tech Support Bognor Regis",
  description: "Answers to common questions about our local tech support services, pricing, and home visits in Felpham and Bognor Regis.",
};

const FAQS: { q: string, a: string }[] = [];

export default async function FAQPage() {
  const settings = await getAllSettings();
  const displayPhone = settings.phoneNumber || "07419 738500";
  const telPhone = settings.phoneTel || "07419738500";

  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.topContent}>
          <Breadcrumbs items={[{ label: 'Common Questions' }]} />
        </div>

        <section className={styles.hero}>
          <h1>Frequently Asked Questions</h1>
          <p>Everything you need to know about our local tech support service.</p>
        </section>

        <section className={styles.content}>
          <div className={styles.faqList}>
            {FAQS.map((faq, i) => (
              <details key={i} className={styles.faqItem}>
                <summary className={styles.question}>{faq.q}</summary>
                <div className={styles.answer}>
                  <p>{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className={styles.cta}>
          <h2>Still have a question?</h2>
          <p>I&apos;m happy to chat and provide advice. Give me a call or send a message.</p>
          <div className={styles.ctaButtons}>
            <Link href="/contact" className="btn btn-primary">Send a Message</Link>
            <a href={`tel:${telPhone}`} className="btn btn-outline">Call {displayPhone}</a>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>&copy; {new Date().getFullYear()} Consider IT Fixed. Local help you can trust.</p>
        </div>
      </footer>
    </div>
  );
}
