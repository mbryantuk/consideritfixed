'use client';

import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';
import AccessibilityToggles from './AccessibilityToggles';
import AdminShortcuts from './AdminShortcuts';
import styles from './Header.module.css';
import { useEffect, useState } from 'react';

interface HeaderProps {
  isAdmin?: boolean;
  isPortal?: boolean;
  userEmail?: string | null;
  userName?: string | null;
}

export default function Header({ isAdmin, isPortal, userEmail, userName }: HeaderProps) {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [settings, setSettings] = useState<any>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => {});
  }, []);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const businessName = settings.siteName || "Consider IT Fixed";
  const displayPhone = settings.phoneNumber || "07419 738500";
  const telPhone = settings.phoneTel || "07419738500";

  // Logic for working hours
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const hour = now.getHours();
  const isOpen = day >= 1 && day <= 5 && hour >= 9 && hour < 18;

  const isHolidayMode = settings.holidayMode === 'on';
  const holidayMessage = settings.holidayMessage || "We're currently away on a short break. You can still log requests, but our response time will be slower.";

  return (
    <div className={styles.headerWrapper}>
      {isHolidayMode && (
        <div className={styles.holidayBanner} role="alert">
          <span className={styles.holidayIcon}>🌴</span>
          <p>{holidayMessage}</p>
        </div>
      )}
      <header className={styles.header}>
        <AdminShortcuts isAdmin={isAdmin} />
      <div className={`${styles.logo} notranslate`}>
        <Link href={isAdmin ? "/admin" : (isPortal ? "/portal" : "/")} className={styles.logoLink} onClick={closeMobileMenu}>
          <Image 
            src="/logo.svg" 
            alt={businessName} 
            width={240} 
            height={80} 
            className={styles.mainLogo}
            priority
          />
          {isAdmin && <span className={styles.adminBadge}>Admin</span>}
          {isPortal && <span className={styles.portalBadge}>Portal</span>}
        </Link>
        {!isAdmin && !isPortal && (
          <div className={styles.headerContact}>
            <a href={`tel:${telPhone}`} className={styles.phoneLink} aria-label={`Call us at ${displayPhone}`}>
              <span className={styles.phoneIcon} aria-hidden="true">📞</span>
              <strong>{displayPhone}</strong>
            </a>
            <div className={`${styles.hoursBadge} ${isOpen ? styles.open : styles.closed}`} aria-live="polite">
              <span className={styles.dot} aria-hidden="true"></span>
              {isOpen ? 'Open Now' : 'Closed'}
            </div>
          </div>
        )}
      </div>
      
      <button 
        className={styles.mobileMenuButton} 
        onClick={toggleMobileMenu}
        aria-label="Toggle navigation menu"
        aria-expanded={isMobileMenuOpen}
      >
        {isMobileMenuOpen ? '✕' : '☰'}
      </button>

      <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.mobileNavOpen : ''}`}>
        {!isAdmin && !isPortal && (
          <div className={styles.desktopNav}>
            <Link href="/#services" onClick={closeMobileMenu}>Services</Link>
            <Link href="/pricing" onClick={closeMobileMenu}>Pricing</Link>
            <Link href="/blog" onClick={closeMobileMenu}>Tech Alerts</Link>
            <Link href="/knowledge-base" onClick={closeMobileMenu}>Guides</Link>
            <Link href="/about" onClick={closeMobileMenu}>About</Link>
            <Link href="/portal" className="btn btn-secondary" onClick={closeMobileMenu}>Client Login</Link>
          </div>
        )}
        
        {isPortal && (
          <>
            <span className={styles.userEmail}>
              Logged in as <strong>{userName || userEmail}</strong>
            </span>
            <div className={styles.desktopNav}>
               <Link href="/" className={styles.outlineBtn} onClick={closeMobileMenu}>Main Website</Link>
               <Link href="/portal/my-profile" className={styles.outlineBtn} onClick={closeMobileMenu}>My Profile</Link>
               <button onClick={() => { handleSignOut(); closeMobileMenu(); }} className={styles.outlineBtn}>Sign Out</button>
            </div>
          </>
        )}

        {isAdmin && (
          <>
            <span className={styles.userEmail}>
              Admin: <strong>{userName || userEmail}</strong>
            </span>
            <div className={styles.desktopNav}>
              <Link href="/" className={styles.outlineBtn} onClick={closeMobileMenu}>Main Website</Link>
              <Link href="/admin" className={styles.outlineBtn} onClick={closeMobileMenu}>Dashboard</Link>
              <button onClick={() => { handleSignOut(); closeMobileMenu(); }} className={styles.outlineBtn}>Sign Out</button>
            </div>
          </>
        )}

        <div className={styles.controls}>
          <AccessibilityToggles />
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
      </nav>
    </header>
    </div>
  );
}