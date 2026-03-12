'use client';

import { useState, useEffect } from 'react';
import { Type, Eye } from 'lucide-react';
import styles from './AccessibilityToggles.module.css';
import { updateA11yPreferences } from '@/app/actions/user';

export default function AccessibilityToggles() {
  const [isLargeText, setIsLargeText] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Load initial state from localStorage
    const savedLargeText = localStorage.getItem('a11y-large-text') === 'true';
    const savedHighContrast = localStorage.getItem('a11y-high-contrast') === 'true';
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLargeText(savedLargeText);
    setIsHighContrast(savedHighContrast);

    // Then try to fetch from user profile if logged in
    fetch('/api/user/preferences')
      .then(res => res.json())
      .then(data => {
        if (data) {
          if (data.largeText !== undefined) {
            setIsLargeText(data.largeText);
            localStorage.setItem('a11y-large-text', String(data.largeText));
          }
          if (data.highContrast !== undefined) {
            setIsHighContrast(data.highContrast);
            localStorage.setItem('a11y-high-contrast', String(data.highContrast));
          }
        }
      })
      .catch(() => {})
      .finally(() => setInitialized(true));
  }, []);

  useEffect(() => {
    if (!initialized) return;

    if (isLargeText) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }
    localStorage.setItem('a11y-large-text', String(isLargeText));
  }, [isLargeText, initialized]);

  useEffect(() => {
    if (!initialized) return;

    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    localStorage.setItem('a11y-high-contrast', String(isHighContrast));
  }, [isHighContrast, initialized]);

  const toggleLargeText = async () => {
    const newVal = !isLargeText;
    setIsLargeText(newVal);
    await updateA11yPreferences({ largeText: newVal });
  };

  const toggleHighContrast = async () => {
    const newVal = !isHighContrast;
    setIsHighContrast(newVal);
    await updateA11yPreferences({ highContrast: newVal });
  };

  return (
    <div className={styles.container}>
      <button 
        onClick={toggleLargeText}
        className={`${styles.toggle} ${isLargeText ? styles.active : ''}`}
        title="Toggle Larger Text"
        aria-pressed={isLargeText}
      >
        <Type size={20} />
        <span className={styles.label}>Large Text</span>
      </button>
      <button 
        onClick={toggleHighContrast}
        className={`${styles.toggle} ${isHighContrast ? styles.active : ''}`}
        title="Toggle High Contrast"
        aria-pressed={isHighContrast}
      >
        <Eye size={20} />
        <span className={styles.label}>High Contrast</span>
      </button>
    </div>
  );
}
