import Header from '@/components/Header';
import Skeleton from '@/components/Skeleton';
import styles from './request-detail.module.css';

export default function RequestDetailsLoading() {
  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.topActions}>
          <Skeleton width={120} height={36} />
        </div>

        <div className={styles.layout}>
          <div className={styles.detailsColumn}>
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <Skeleton width={100} height={24} />
                <Skeleton width={150} height={32} />
              </div>
              <Skeleton width="100%" height={100} className={styles.mtMd} />
            </section>

            <section className={styles.card}>
              <Skeleton width={200} height={28} />
              <div className={styles.notesListSkeleton}>
                {[1, 2].map(i => (
                  <div key={i} className={styles.noteSkeleton}>
                    <Skeleton width={150} height={20} />
                    <Skeleton width="100%" height={40} className={styles.mtSm} />
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className={styles.sidebarColumn}>
            <section className={styles.card}>
              <Skeleton width={150} height={24} />
              <Skeleton width="100%" height={60} className={styles.mtSm} />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
