import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import styles from "../admin.module.css";
import Link from "next/link";

export const metadata = {
  title: "User Management | Admin",
};

export default async function AdminUsers() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/portal");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className={styles.container}>
      <Header isAdmin userEmail={session.user.email} />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>User Management</h1>
          <Link href="/admin" className="btn btn-secondary">Back to Dashboard</Link>
        </div>

        <section className={styles.requestsSection}>
          <h2>All Registered Users ({users.length})</h2>
          
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Joined</th>
                  <th>Role</th>
                  <th>Compliance</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <strong>{user.name || "Unnamed"}</strong>
                      <div style={{ fontSize: '0.85rem' }}>{user.email}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user.phone}</div>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {new Date(user.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td>
                      <span className={`${styles.badge} ${user.role === 'ADMIN' ? styles.in_progress : styles.open}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      {user.marketingConsent ? '✅ Marketing' : '❌ No Marketing'}<br/>
                      {user.profileComplete ? '✅ Profile Done' : '⚠️ Profile Pending'}
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
