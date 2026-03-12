'use client';

import Link from 'next/link';
import { Phone, Calendar, ArrowUp } from 'lucide-react';
import styles from './StickyContactBar.module.css';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function StickyContactBar() {
  const pathname = usePathname();
  const [showScrollTop, setShowScrollTop] = useState(false);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => {});

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const telPhone = settings.phoneTel || "07419738500";

  // Don't show on login or admin pages
  if (pathname.startsWith('/login') || pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <div className={styles.container}>
      <button 
        className={`${styles.scrollTop} ${showScrollTop ? styles.visible : ''}`} 
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <ArrowUp size={24} />
      </button>
      <div className={styles.barActions}>
        <a href={`tel:${telPhone}`} className={styles.callButton}>
          <Phone size={20} />
          <span>Call Now</span>
        </a>
        <Link href="/contact" className={styles.bookButton}>
          <Calendar size={20} />
          <span>Book Online</span>
        </Link>
      </div>
    </div>
  );
}