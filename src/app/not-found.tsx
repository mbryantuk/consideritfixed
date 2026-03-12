import Link from 'next/link';
import Header from '@/components/Header';
import styles from './not-found.module.css';
import { Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.content}>
          <span className={styles.errorCode}>404</span>
          <h1>Oops! Page Not Found</h1>
          <p>
            It looks like this page has gone missing—maybe it&apos;s having a technical glitch!
          </p>

          <div className={styles.searchBox}>
            <form action="/knowledge-base" method="GET" className={styles.searchForm}>
              <Search className={styles.searchIcon} size={20} />
              <input 
                type="text" 
                name="q" 
                placeholder="Search our guides..." 
                className={styles.searchInput}
              />
              <button type="submit" className="btn btn-secondary">Search</button>
            </form>
          </div>
          
          <div className={styles.quickLinks}>
            <h3>Looking for something specific?</h3>
            <ul>
              <li><Link href="/#services">Our Services</Link></li>
              <li><Link href="/pricing">Pricing & Rates</Link></li>
              <li><Link href="/faq">Common Questions</Link></li>
              <li><Link href="/glossary">Tech Glossary</Link></li>
              <li><Link href="/blog">Tech Alerts & Tips</Link></li>
            </ul>
          </div>

          <div className={styles.actions}>
            <Link href="/" className="btn btn-primary">Back to Home</Link>
            <Link href="/contact" className="btn btn-secondary">Request Help Directly</Link>
          </div>
        </div>
      </main>
    </div>
  );
}