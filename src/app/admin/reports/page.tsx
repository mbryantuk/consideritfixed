import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import styles from "../admin.module.css";
import Link from "next/link";

export const metadata = {
  title: "Earnings Reports | Admin",
};

export default async function AdminReports() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/portal");
  }

  // Fetch paid invoices grouped by month
  const paidInvoices = await prisma.invoice.findMany({
    where: { status: 'PAID' },
    orderBy: { createdAt: 'desc' }
  });

  const monthlyStats: { [key: string]: number } = {};
  paidInvoices.forEach(inv => {
    const monthYear = new Date(inv.createdAt).toLocaleString('en-GB', { month: 'long', year: 'numeric' });
    monthlyStats[monthYear] = (monthlyStats[monthYear] || 0) + inv.amount;
  });

  const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.amount, 0);

  // Fetch parts usage cost
  const partsUsage = await prisma.partUsage.findMany({
    include: { part: true }
  });
  const totalPartsCost = partsUsage.reduce((sum, pu) => sum + (pu.priceAtTime * pu.quantity), 0);

  return (
    <div className={styles.container}>
      <Header isAdmin userEmail={session.user.email} />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Financial Reports</h1>
          <Link href="/admin" className="btn btn-secondary">Back to Dashboard</Link>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Lifetime Revenue</span>
            <span className={styles.statValue}>£{totalRevenue.toFixed(2)}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total Parts Cost</span>
            <span className={styles.statValue}>£{totalPartsCost.toFixed(2)}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Net Profit</span>
            <span className={styles.statValue} style={{ color: 'var(--secondary)' }}>£{(totalRevenue - totalPartsCost).toFixed(2)}</span>
          </div>
        </div>

        <section className={styles.requestsSection}>
          <h2>Monthly Revenue Breakdown</h2>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(monthlyStats).map(([month, total]) => (
                  <tr key={month}>
                    <td><strong>{month}</strong></td>
                    <td>£{total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.requestsSection}>
          <h2>Recent Sales Ledger</h2>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {paidInvoices.slice(0, 20).map(inv => (
                  <tr key={inv.id}>
                    <td>{new Date(inv.createdAt).toLocaleDateString('en-GB')}</td>
                    <td>Invoice {inv.id.substring(0, 8)}</td>
                    <td>£{inv.amount.toFixed(2)}</td>
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
