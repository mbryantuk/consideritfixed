'use client';

import { useState, useEffect } from 'react';
import { Lightbulb, ChevronRight, ChevronLeft } from 'lucide-react';
import styles from './TechTipWidget.module.css';

const TIPS = [
  {
    title: "Spotting Fake Emails",
    content: "Always check the sender's full email address. If it's a long string of random letters or doesn't match the official company domain, it's likely a scam.",
    category: "Security"
  },
  {
    title: "Restarting Fixes Most Things",
    content: "If your computer or phone is acting slow or buggy, try a full restart. This clears the temporary memory and often resolves minor software glitches.",
    category: "General"
  },
  {
    title: "Secure Your Wi-Fi",
    content: "Ensure your home Wi-Fi has a strong password. Avoid using 'admin' or 'password123'. A secure network protects all your connected devices.",
    category: "Networking"
  },
  {
    title: "Backup Your Photos",
    content: "Don't risk losing precious memories. Use a cloud service like Google Photos or iCloud, or regularly copy them to an external hard drive.",
    category: "Maintenance"
  },
  {
    title: "Update Your Software",
    content: "Keep your apps and operating system up to date. Updates often include critical security patches that protect you from new threats.",
    category: "Security"
  }
];

export default function TechTipWidget() {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    // Pick a random tip on initial load
    const randomIndex = Math.floor(Math.random() * TIPS.length);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentTipIndex(randomIndex);

    // Rotate tip every 24 hours (simulated with interval for demo, but could be daily)
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 1000 * 60 * 60 * 24); 

    return () => clearInterval(interval);
  }, []);

  const nextTip = () => setCurrentTipIndex((prev) => (prev + 1) % TIPS.length);
  const prevTip = () => setCurrentTipIndex((prev) => (prev === 0 ? TIPS.length - 1 : prev - 1));

  const tip = TIPS[currentTipIndex];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <Lightbulb className={styles.icon} size={20} />
          <h3>Jargon-Free Tech Tip</h3>
        </div>
        <div className={styles.controls}>
          <button onClick={prevTip} aria-label="Previous tip" className={styles.controlBtn}><ChevronLeft size={18} /></button>
          <button onClick={nextTip} aria-label="Next tip" className={styles.controlBtn}><ChevronRight size={18} /></button>
        </div>
      </div>
      
      <div className={styles.content}>
        <span className={styles.category}>{tip.category}</span>
        <h4>{tip.title}</h4>
        <p>{tip.content}</p>
      </div>
      
      <div className={styles.footer}>
        <span className={styles.tipCount}>Tip {currentTipIndex + 1} of {TIPS.length}</span>
      </div>
    </div>
  );
}
