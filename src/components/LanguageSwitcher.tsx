'use client';

import { useEffect, useState, useRef } from 'react';
import Script from 'next/script';
import styles from './LanguageSwitcher.module.css';

const languages = [
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'pl', flag: '🇵🇱', name: 'Polski' },
  { code: 'ro', flag: '🇷🇴', name: 'Română' },
  { code: 'uk', flag: '🇺🇦', name: 'Українська' },
  { code: 'lt', flag: '🇱🇹', name: 'Lietuvių' },
  { code: 'es', flag: '🇪🇸', name: 'Español' },
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
];

export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState('en');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const match = document.cookie.match(/(^|;) ?googtrans=([^;]*)(;|$)/);
    if (match) {
      const lang = match[2].split('/')[2];
      if (lang) {
        setCurrentLang(lang);
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const switchLanguage = (langCode: string) => {
    if (langCode === 'en') {
      // eslint-disable-next-line react-hooks/immutability
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      // eslint-disable-next-line react-hooks/immutability
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=' + window.location.hostname + '; path=/;';
    } else {
      // eslint-disable-next-line react-hooks/immutability
      document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname}`;
      // eslint-disable-next-line react-hooks/immutability
      document.cookie = `googtrans=/en/${langCode}; path=/;`;
    }
    setIsOpen(false);
    window.location.reload();
  };

  const activeFlag = languages.find(l => l.code === currentLang)?.flag || '🇬🇧';

  return (
    <div className={styles.container} ref={dropdownRef}>
      <div id="google_translate_element" style={{ display: 'none' }}></div>
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="lazyOnload"
      />
      <Script id="google-translate-init" strategy="lazyOnload">
        {`
          function googleTranslateElementInit() {
            new google.translate.TranslateElement({
              pageLanguage: 'en',
              includedLanguages: 'en,pl,ro,uk,lt,es,fr',
              autoDisplay: false
            }, 'google_translate_element');
          }
        `}
      </Script>

      <div className={styles.dropdown}>
        <button 
          className={styles.toggleButton} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Select language"
        >
          {activeFlag}
        </button>
        {isOpen && (
          <div className={styles.menu}>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => switchLanguage(lang.code)}
                className={`${styles.menuItem} ${currentLang === lang.code ? styles.active : ''}`}
                title={lang.name}
              >
                {lang.flag} <span className={styles.langName}>{lang.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        body { top: 0 !important; position: static !important; }
        .goog-te-banner-frame { display: none !important; }
        #goog-gt-tt, .goog-te-balloon-frame { display: none !important; }
        .goog-text-highlight { background-color: transparent !important; box-shadow: none !important; }
        .skiptranslate { display: none !important; }
      `}} />
    </div>
  );
}