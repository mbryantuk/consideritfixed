import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import styles from "../admin.module.css";
import Link from "next/link";
import fs from 'fs';
import path from 'path';

export const metadata = {
  title: "Performance Monitor | Admin",
};

export default async function AdminPerformance() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/portal");
  }

  // Get DB Size (assuming SQLite path from schema)
  const dbPath = path.join(process.cwd(), 'data', 'dev.db');
  let dbSize = "Unknown";
  try {
    const stats = fs.statSync(dbPath);
    dbSize = (stats.size / (1024 * 1024)).toFixed(2) + " MB";
  } catch (e) {
    console.error("Failed to get DB size", e);
  }

  // Get Table Row Counts
  const [userCount, requestCount, auditCount, noteCount] = await Promise.all([
    prisma.user.count(),
    prisma.request.count(),
    prisma.auditLog.count(),
    prisma.note.count()
  ]);

  return (
    <div className={styles.container}>
      <Header isAdmin userEmail={session.user.email} />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Performance & System Health</h1>
          <Link href="/admin" className="btn btn-secondary">Back to Dashboard</Link>
        </div>

        <div className={styles.grid}>
          <section className={styles.card}>
            <h3>Database Statistics</h3>
            <div style={{ marginTop: '1rem' }}>
              <p><strong>File Size:</strong> {dbSize}</p>
              <p><strong>Total Users:</strong> {userCount}</p>
              <p><strong>Total Tickets:</strong> {requestCount}</p>
              <p><strong>Audit Log Entries:</strong> {auditCount}</p>
              <p><strong>Total Messages:</strong> {noteCount}</p>
            </div>
          </section>

          <section className={styles.card}>
            <h3>Server Information</h3>
            <div style={{ marginTop: '1rem' }}>
              <p><strong>Node Version:</strong> {process.version}</p>
              <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
              <p><strong>Platform:</strong> {process.platform}</p>
              <p><strong>Memory Usage:</strong> {(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </section>
        </div>

        <section className={styles.requestsSection} style={{ marginTop: '2rem' }}>
          <h2>Optimization Tips</h2>
          <div className={styles.card}>
            <ul>
              <li>Regularly archive tickets older than 1 year to keep the database lean.</li>
              <li>Prune the Audit Log every 6 months if it grows beyond 10,000 entries.</li>
              <li>Ensure all images are uploaded in WebP format to save bandwidth.</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
