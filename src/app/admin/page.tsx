import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import styles from "./admin.module.css";
import Header from '@/components/Header';

export const metadata = {
  title: "Admin Dashboard | Consider IT Fixed",
};

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/portal");
  }

  // Fetch ALL requests
  const allRequests = await prisma.request.findMany({
    include: { 
      user: true,
      quotes: { orderBy: { createdAt: 'desc' } },
      invoice: true
    },
    orderBy: { createdAt: 'desc' }
  });

  const totalEarnings = await prisma.invoice.aggregate({
    _sum: { amount: true },
    where: { status: 'PAID' }
  });

  const unpaidEarnings = await prisma.invoice.aggregate({
    _sum: { amount: true },
    where: { status: 'UNPAID' }
  });

  const pendingQuotes = await prisma.quote.count({
    where: { status: 'PENDING' }
  });

  const lowStockParts = await prisma.part.count({
    where: { stockLevel: { lte: 2 } }
  });

  const unapprovedTestimonials = await prisma.testimonial.count({
    where: { approved: false }
  });

  const totalUsers = await prisma.user.count();

  return (
    <div className={styles.container}>
      <Header isAdmin userEmail={session.user.email} />

      <main className={styles.main}>
        <div className={styles.dashboardHeader}>
          <h1>Admin Dashboard</h1>
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Paid Earnings</span>
              <span className={styles.statValue}>£{totalEarnings._sum.amount?.toFixed(2) || "0.00"}</span>
            </div>
            <div className={`${styles.statCard} ${unpaidEarnings._sum.amount ? styles.alertStat : ''}`}>
              <span className={styles.statLabel}>Unpaid Revenue</span>
              <span className={styles.statValue}>£{unpaidEarnings._sum.amount?.toFixed(2) || "0.00"}</span>
            </div>
            <div className={`${styles.statCard} ${pendingQuotes > 0 ? styles.infoStat : ''}`}>
              <span className={styles.statLabel}>Pending Quotes</span>
              <span className={styles.statValue}>{pendingQuotes}</span>
            </div>
            <div className={`${styles.statCard} ${lowStockParts > 0 ? styles.warningStat : ''}`}>
              <span className={styles.statLabel}>Low Stock Alert</span>
              <span className={styles.statValue}>{lowStockParts}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Active Tickets</span>
              <span className={styles.statValue}>{allRequests.filter(r => r.status !== 'CLOSED').length}</span>
            </div>
          </div>

          <div className={styles.quickLinks}>
            <Link href="/admin/testimonials" className={`${styles.statCard} ${styles.linkCard} ${unapprovedTestimonials > 0 ? styles.alertStat : ''}`}>
              <span className={styles.statLabel}>Reviews ({unapprovedTestimonials} pending)</span>
              <span className={styles.statValue} style={{ fontSize: '1.1rem' }}>Feedback Wall →</span>
            </Link>
            <Link href="/admin/map" className={`${styles.statCard} ${styles.linkCard}`}>
              <span className={styles.statLabel}>Customer Map</span>
              <span className={styles.statValue} style={{ fontSize: '1.1rem' }}>Distribution →</span>
            </Link>
            <Link href="/admin/users" className={`${styles.statCard} ${styles.linkCard}`}>
              <span className={styles.statLabel}>User Management ({totalUsers})</span>
              <span className={styles.statValue} style={{ fontSize: '1.1rem' }}>Customers →</span>
            </Link>
            <Link href="/admin/audit" className={`${styles.statCard} ${styles.linkCard}`}>
              <span className={styles.statLabel}>System Health</span>
              <span className={styles.statValue} style={{ fontSize: '1.1rem' }}>Audit Logs →</span>
            </Link>
            <Link href="/admin/wiki" className={`${styles.statCard} ${styles.linkCard}`}>
              <span className={styles.statLabel}>Internal Docs</span>
              <span className={styles.statValue} style={{ fontSize: '1.1rem' }}>Wiki KB →</span>
            </Link>
            <Link href="/admin/screen" className={`${styles.statCard} ${styles.linkCard}`} style={{ borderColor: 'var(--accent)', borderWidth: '2px' }}>
              <span className={styles.statLabel}>Remote Support</span>
              <span className={styles.statValue} style={{ fontSize: '1.1rem', color: 'var(--accent)' }}>Live Screen Share →</span>
            </Link>
            <Link href="/admin/replies" className={`${styles.statCard} ${styles.linkCard}`}>
              <span className={styles.statLabel}>Templates</span>
              <span className={styles.statValue} style={{ fontSize: '1.1rem' }}>Quick Replies →</span>
            </Link>
          </div>

          <div className={styles.quickLinks} style={{ marginTop: '20px' }}>
              <Link href="/admin/stock" className={`${styles.statCard} ${styles.linkCard}`}>
                <span className={styles.statLabel}>Inventory</span>
                <span className={styles.statValue} style={{ fontSize: '1.1rem' }}>Stock Tracker →</span>
              </Link>
              <Link href="/admin/legal" className={`${styles.statCard} ${styles.linkCard}`}>
                <span className={styles.statLabel}>Compliance</span>
                <span className={styles.statValue} style={{ fontSize: '1.1rem' }}>Legal & GDPR →</span>
              </Link>
              <Link href="/admin/settings" className={`${styles.statCard} ${styles.linkCard}`}>
                <span className={styles.statLabel}>Global CMS</span>
                <span className={styles.statValue} style={{ fontSize: '1.1rem' }}>Site Settings →</span>
              </Link>
              <Link href="/admin/services" className={`${styles.statCard} ${styles.linkCard}`}>
                <span className={styles.statLabel}>Products CMS</span>
                <span className={styles.statValue} style={{ fontSize: '1.1rem' }}>Services & Rates →</span>
              </Link>
              <Link href="/admin/content" className={`${styles.statCard} ${styles.linkCard}`}>
                <span className={styles.statLabel}>Editorial CMS</span>
                <span className={styles.statValue} style={{ fontSize: '1.1rem' }}>Content Hub →</span>
              </Link>
          </div>
        </div>

        <section className={styles.requestsSection}>
          <h2>All Customer Requests</h2>
          
          {allRequests.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No customer requests have been logged yet.</p>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Request</th>
                    <th>Status</th>
                    <th>Last Active</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {allRequests.map((req: any) => (
                    <tr key={req.id} className={req.isEmergency ? styles.emergencyRow : ''}>
                      <td>
                        <strong>{req.user.name || req.user.email}</strong>
                        {req.isEmergency && <span className={styles.emergencyBadge}>EMERGENCY</span>}
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{req.user.email}</div>
                      </td>
                      <td>
                        <strong>{req.title}</strong>
                        <p className={styles.truncate}>{req.description}</p>
                      </td>
                      <td>
                        <span className={`${styles.badge} ${styles[req.status.toLowerCase()]}`}>
                          {req.status}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>
                        {new Date(req.updatedAt).toLocaleDateString('en-GB')}<br/>
                        <small>{new Date(req.updatedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</small>
                      </td>
                      <td>
                         <Link href={`/admin/requests/${req.id}`} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                           Manage
                         </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
