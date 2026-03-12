'use client';

import styles from './remote-support.module.css';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Link from 'next/link';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Monitor, Download, ShieldCheck, Copy, Check } from 'lucide-react';
import { useState } from 'react';

// Client-side component for interactivity
function CopyButton({ text, label }: { text: string, label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={styles.copyWrapper}>
      <span className={styles.copyLabel}>{label}:</span>
      <code className={styles.copyCode}>{text}</code>
      <button 
        onClick={handleCopy} 
        className={styles.copyButton}
        title="Copy to clipboard"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
    </div>
  );
}

export default function RemoteSupportClient() {
  return (
    <section className={styles.content}>
      <div className={styles.infoCard}>
        <ShieldCheck size={32} className={styles.shieldIcon} />
        <div>
          <h3>Is this safe?</h3>
          <p>Yes. These tools only allow our technician to see your screen **while you are watching**. You can end the session at any time, and we cannot access your computer once the program is closed.</p>
        </div>
      </div>

      <div className={styles.toolGrid}>
        <div className={styles.toolCard}>
          <h2>AnyDesk</h2>
          <p>Our preferred tool for fast, reliable remote support on Windows and Mac.</p>
          <a href="https://anydesk.com/en/downloads" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            <Download size={20} style={{ marginRight: '8px' }} />
            Download AnyDesk
          </a>
        </div>

        <div className={styles.toolCard}>
          <h2>TeamViewer</h2>
          <p>A widely used alternative for remote desktop assistance.</p>
          <a href="https://www.teamviewer.com/en/download" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            <Download size={20} style={{ marginRight: '8px' }} />
            Download TeamViewer
          </a>
        </div>
      </div>

      <div className={styles.instructions}>
        <h2>What to do next:</h2>
        <ol>
          <li>Download and run the tool above.</li>
          <li>We will ask you for the **ID number** shown on your screen.</li>
          <li>You will need to click **&quot;Accept&quot;** when our technician requests to connect.</li>
          <li>Stay at your computer while the work is being done!</li>
        </ol>
        
        <div className={styles.copyUtilities}>
           <h3>Quick Copy Utilities:</h3>
           <p>If the technician asks for our website URL or business name for verification:</p>
           <div className={styles.copyGrid}>
              <CopyButton text="https://consideritfixed.co.uk" label="Website URL" />
              <CopyButton text="Consider IT Fixed" label="Business Name" />
           </div>
        </div>
      </div>
    </section>
  );
}
