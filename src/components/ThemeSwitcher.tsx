'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import styles from './ThemeSwitcher.module.css';
import { updateThemePreference } from '@/app/actions/user';

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    updateThemePreference(newTheme);
  };

  if (!mounted) {
    return <div className={styles.skeleton} />;
  }

  return (
    <div className={styles.container}>
      <button
        onClick={() => handleThemeChange('light')}
        className={`${styles.button} ${theme === 'light' ? styles.active : ''}`}
        aria-label="Light theme"
        title="Light theme"
      >
        <Sun size={16} />
      </button>
      <button
        onClick={() => handleThemeChange('system')}
        className={`${styles.button} ${theme === 'system' ? styles.active : ''}`}
        aria-label="System theme"
        title="System theme"
      >
        <Monitor size={16} />
      </button>
      <button
        onClick={() => handleThemeChange('dark')}
        className={`${styles.button} ${theme === 'dark' ? styles.active : ''}`}
        aria-label="Dark theme"
        title="Dark theme"
      >
        <Moon size={16} />
      </button>
    </div>
  );
}