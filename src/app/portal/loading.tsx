import styles from './portal.module.css';
import Skeleton from '@/components/Skeleton';

export default function PortalLoading() {
  return (
    <div className={styles.container}>
      <header className={styles.headerSkeleton}>
        <Skeleton width={200} height={40} />
        <Skeleton width={100} height={40} />
      </header>

      <main className={styles.main}>
        <section className={styles.welcomeSection}>
          <Skeleton width={300} height={48} />
          <Skeleton width="100%" height={24} className={styles.mtSm} />
        </section>

        <section className={styles.requestsSection}>
          <div className={styles.sectionHeader}>
            <Skeleton width={200} height={32} />
            <Skeleton width={150} height={40} />
          </div>

          <div className={styles.requestsList}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.requestCardSkeleton}>
                <div className={styles.cardMain}>
                  <Skeleton width={100} height={20} />
                  <Skeleton width={250} height={28} className={styles.mtXs} />
                  <Skeleton width="100%" height={20} className={styles.mtSm} />
                </div>
                <div className={styles.cardFooter}>
                  <Skeleton width={120} height={24} />
                  <Skeleton width={100} height={36} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
