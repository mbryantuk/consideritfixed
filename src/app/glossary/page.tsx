import Header from '@/components/Header';
import Breadcrumbs from '@/components/Breadcrumbs';
import styles from './glossary.module.css';
import Link from 'next/link';
import { glossaryTerms } from '@/lib/glossary-data';

export const metadata = {
  title: "Tech Glossary | Consider IT Fixed",
  description: "Simple explanations for common technical terms. Helping you understand your technology without the jargon.",
};

export default function Glossary() {
  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.topContent}>
          <Breadcrumbs items={[{ label: 'Tech Glossary' }]} />
        </div>

        <section className={styles.hero}>
          <h1>Tech Glossary</h1>
          <p>Simple explanations for common technical terms, without the jargon.</p>
        </section>

        <section className={styles.content}>
          <div className={styles.grid}>
            {glossaryTerms.sort((a, b) => a.term.localeCompare(b.term)).map((item, index) => (
              <div key={index} className={styles.termCard}>
                <h2>{item.term}</h2>
                <p>{item.definition}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.cta}>
          <h2>Still confused by a term?</h2>
          <p>I&apos;m here to help you make sense of it all. No question is too simple.</p>
          <Link href="/contact" className="btn btn-primary">Ask a Question</Link>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>&copy; {new Date().getFullYear()} Consider IT Fixed. Explaining tech in plain English.</p>
        </div>
      </footer>
    </div>
  );
}