import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import styles from "../admin.module.css";
import Link from "next/link";

export const metadata = {
  title: "Audit Log | Admin",
};

export default async function AdminAudit() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/portal");
  }

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100
  });

  return (
    <div className={styles.container}>
      <Header isAdmin userEmail={session.user.email} />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Audit Log</h1>
          <Link href="/admin" className="btn btn-secondary">Back to Dashboard</Link>
        </div>

        <section className={styles.requestsSection}>
          <h2>System Activity (Last 100 Actions)</h2>
          
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Action</th>
                  <th>Target</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ fontSize: '0.85rem' }}>
                      {new Date(log.createdAt).toLocaleDateString('en-GB')}<br/>
                      <small>{new Date(log.createdAt).toLocaleTimeString('en-GB')}</small>
                    </td>
                    <td>
                      <strong>{log.action}</strong>
                    </td>
                    <td>
                      {log.targetType}: {log.targetId}
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>
                      <pre style={{ margin: 0 }}>{log.details}</pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
