'use client';

import styles from './ProgressTracker.module.css';

interface ProgressTrackerProps {
  status: string;
}

const steps = [
  { key: 'OPEN', label: 'Logged' },
  { key: 'QUOTED', label: 'Quoted' },
  { key: 'IN_PROGRESS', label: 'In Progress' },
  { key: 'AWAITING_PARTS', label: 'Parts' },
  { key: 'CLOSED', label: 'Complete' }
];

export default function ProgressTracker({ status }: ProgressTrackerProps) {
  const currentStepIndex = steps.findIndex(step => step.key === status);
  
  return (
    <div className={styles.container}>
      <div className={styles.progressBar}>
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex || status === 'CLOSED';
          const isCurrent = index === currentStepIndex && status !== 'CLOSED';
          
          return (
            <div key={step.key} className={styles.stepWrapper}>
              <div className={`${styles.circle} ${isCompleted ? styles.completed : ''} ${isCurrent ? styles.current : ''}`}>
                {isCompleted ? '✓' : index + 1}
              </div>
              <span className={`${styles.label} ${isCompleted || isCurrent ? styles.activeLabel : ''}`}>
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div className={`${styles.line} ${index < currentStepIndex || status === 'CLOSED' ? styles.completedLine : ''}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}