import styles from './NoFixNoFeeBadge.module.css';
import { ShieldCheck } from 'lucide-react';

export default function NoFixNoFeeBadge({ className }: { className?: string }) {
  return (
    <div className={`${styles.badge} ${className || ''}`}>
      <ShieldCheck size={18} className={styles.icon} />
      <span>No Fix, No Fee Guarantee</span>
    </div>
  );
}
