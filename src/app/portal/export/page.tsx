import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import styles from "../portal.module.css";
import Link from "next/link";

export const metadata = {
  title: "Export My Data | Customer Portal",
};

export default async function ExportData() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch all user data
  const userData = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: {
      requests: {
        include: {
          quotes: true,
          notes: true,
          invoice: true
        }
      }
    }
  });

  if (!userData) {
    return <div>User not found.</div>;
  }

  // Sanitize for JSON export
  const exportBlob = JSON.stringify(userData, null, 2);

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Your Personal Data</h1>
          <Link href="/portal" className="btn btn-secondary">Back to Portal</Link>
        </div>

        <section className={styles.card}>
          <h2>GDPR Data Export</h2>
          <p>As per the General Data Protection Regulation (GDPR), you have the right to a copy of the data we hold about you.</p>
          <p>Click the button below to download all your profile information, support requests, messages, and invoices in a machine-readable JSON format.</p>
          
          <div style={{ marginTop: '30px', padding: '20px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
            <pre style={{ maxHeight: '200px', overflow: 'auto', fontSize: '0.8rem', opacity: 0.7 }}>
              {exportBlob.substring(0, 500)}...
            </pre>
          </div>

          <div style={{ marginTop: '30px' }}>
             <a 
               href={`data:text/json;charset=utf-8,${encodeURIComponent(exportBlob)}`} 
               download={`my-data-${new Date().toISOString().split('T')[0]}.json`}
               className="btn btn-primary"
             >
               Download My Data (JSON)
             </a>
          </div>
        </section>

        <section className={styles.card} style={{ marginTop: '30px' }}>
          <h2>Right to be Forgotten</h2>
          <p>If you would like to close your account and have all your personal data permanently deleted from our system, please contact us directly.</p>
          <Link href="/contact" className="btn btn-secondary">Contact Support</Link>
        </section>
      </main>
    </div>
  );
}
