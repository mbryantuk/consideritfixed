import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import styles from "./portal.module.css";
import { prisma } from "@/lib/prisma";
import Header from '@/components/Header';
import ReferralCard from './ReferralCard';
import TechTipWidget from '@/components/TechTipWidget';

export const metadata = {
  title: "User Portal | Consider IT Fixed",
  description: "Manage your support requests and quotes securely.",
};

export default async function Portal(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const successMessage = searchParams.success === 'profile_updated' ? 'Profile updated successfully!' : null;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user?.profileComplete) {
    redirect("/portal/profile");
  }

  // Fetch the user's requests from the database
  const userRequests = await prisma.request.findMany({
    where: { userId: session.user.id },
    include: { quotes: { orderBy: { createdAt: 'desc' } } },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className={styles.container}>
      <Header isPortal userEmail={session.user.email} userName={user?.name} />

      <main className={styles.main}>
        {successMessage && (
          <div className={styles.successAlert} role="alert">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><polyline points="20 6 9 17 4 12"></polyline></svg>
            {successMessage}
          </div>
        )}
        <div className={styles.dashboardHeader}>
          <h1>Welcome, {user?.name || 'Customer'}</h1>
          <Link href="/portal/new-request" className="btn btn-accent">
            <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Log a New Request
          </Link>
          <Link href="/portal/files" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Secure File Drop
          </Link>
        </div>

        <TechTipWidget />

        <section className={styles.requestsSection}>
          <h2>Your Support Tickets</h2>
          
          {userRequests.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <svg aria-hidden="true" focusable="false" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <p>You don&apos;t have any support requests yet.</p>
              <p className={styles.mutedText}>Struggling with a device or need some tech advice? I&apos;m here to help.</p>
              <Link href="/portal/new-request" className="btn btn-accent" style={{ marginTop: '1.5rem' }}>
                <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Get Help with Something New
              </Link>
            </div>
          ) : (
            <div className={styles.grid}>
{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {userRequests.map((req: any) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const latestQuote = req.quotes?.[0];
                return (
                  <div key={req.id} className={styles.card}>
                    <div className={styles.cardHeader}>
                      <h3>{req.title}</h3>
                      <span className={`${styles.badge} ${styles[req.status.toLowerCase()]}`}>
                        {req.status}
                      </span>
                    </div>
                    <p className={styles.date}>Logged on: {new Date(req.createdAt).toLocaleDateString('en-GB')}</p>
                    <p className={styles.description}>{req.description.substring(0, 100)}{req.description.length > 100 ? '...' : ''}</p>
                    
                    <div className={styles.cardActions}>
                      <Link href={`/portal/requests/${req.id}`} className="btn btn-secondary">
                        View Details & Conversation
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className={styles.referralSection}>
          <ReferralCard />
        </section>

        <footer style={{ marginTop: '40px', textAlign: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Looking for your personal data? <Link href="/portal/export" style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>GDPR & Data Export →</Link>
          </p>
        </footer>
      </main>
    </div>
  );
}