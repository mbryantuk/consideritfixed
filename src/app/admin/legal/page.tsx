import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import styles from "./legal.module.css";
import Link from "next/link";

export const metadata = {
  title: "Legal & GDPR Dashboard | Admin",
};

export default async function AdminLegal() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/portal");
  }

  // Count users with marketing consent
  const marketingCount = await prisma.user.count({
    where: { marketingConsent: true }
  });

  const totalUsers = await prisma.user.count();

  return (
    <div className={styles.container}>
      <Header isAdmin userEmail={session.user.email} />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Legal & GDPR Compliance</h1>
          <Link href="/admin" className="btn btn-secondary">Back to Dashboard</Link>
        </div>

        <div className={styles.grid}>
          <section className={styles.card}>
            <h2>Marketing Consent</h2>
            <div className={styles.stat}>
              <span className={styles.statValue}>{marketingCount}</span>
              <span className={styles.statLabel}>Users opted-in to marketing ({Math.round((marketingCount / totalUsers) * 100)}%)</span>
            </div>
            <p className={styles.note}>All marketing consent is recorded with a timestamp in the database.</p>
          </section>

          <section className={styles.card}>
            <h2>Data Retention Policy</h2>
            <p>Our current policy is to retain support ticket history indefinitely to provide better service for returning customers.</p>
            <div className={styles.actionBox}>
              <button className={styles.btnDisabled} disabled>Download Data Export (CSV)</button>
              <p className={styles.small}>Feature coming soon: Export all user data for GDPR requests.</p>
            </div>
          </section>

          <section className={styles.card}>
            <h2>Privacy & Terms</h2>
            <p>Last updated: October 2023</p>
            <div className={styles.links}>
              <Link href="/privacy" target="_blank">View Current Privacy Policy</Link>
              <Link href="/terms" target="_blank">View Current Terms of Service</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}