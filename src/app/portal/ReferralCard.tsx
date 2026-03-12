'use client';

import { useState } from 'react';
import styles from './portal.module.css';

import { Share2, Users, Gift, Copy } from 'lucide-react';

export default function ReferralCard() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [copied, setCopied] = useState(false);
  const referralCode = "FELPHAM-FRIEND"; // In a real app, this would be user-specific

  const handleCopy = () => {
    navigator.clipboard.writeText(`Hi! I've been using 'Consider IT Fixed' for tech support in Felpham and they're great. Use my code ${referralCode} for 10% off your first session: https://consideritfixed.uk`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.referralCard}>
      <div className={styles.referralContent}>
        <div className={styles.referralMain}>
          <div className={styles.referralIcon}>
            <Share2 size={40} />
          </div>
          <div className={styles.referralText}>
            <h3>Refer a Neighbor</h3>
            <p>Enjoyed our service? Share the love! If a neighbor or friend books a session because of you, we&apos;ll give them 10% off their first hour, and you&apos;ll get a £5 credit towards your next fix.</p>
            
            <div className={styles.codeBox}>
              <span className={styles.codeLabel}>Your Unique Code:</span>
              <div className={styles.codeRow}>
                <code className={styles.code}>{referralCode}</code>
                <button className={styles.copyIconButton} onClick={handleCopy} aria-label="Copy code">
                  <Copy size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.referralStats}>
          <div className={styles.statItem}>
            <Users size={20} className={styles.statIcon} />
            <div className={styles.statInfo}>
              <span className={styles.statValue}>2</span>
              <span className={styles.statLabel}>Neighbors Referred</span>
            </div>
          </div>
          <div className={styles.statItem}>
            <Gift size={20} className={styles.statIcon} />
            <div className={styles.statInfo}>
              <span className={styles.statValue}>£10.00</span>
              <span className={styles.statLabel}>Credits Earned</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}