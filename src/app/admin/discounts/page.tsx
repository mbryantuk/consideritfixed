import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import styles from "../admin.module.css";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/utils";

export const metadata = {
  title: "Discount Codes | Admin",
};

async function addDiscount(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return;

  const code = (formData.get("code") as string).toUpperCase();
  const description = formData.get("description") as string;
  const percentage = parseInt(formData.get("percentage") as string) || 0;
  const expiresAt = formData.get("expiresAt") ? new Date(formData.get("expiresAt") as string) : null;

  await prisma.discountCode.create({
    data: { code, description, percentage, expiresAt }
  });

  await logAudit(session.user.id, "CREATE_DISCOUNT", "DiscountCode", code);
  revalidatePath('/admin/discounts');
}

async function toggleDiscount(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return;

  const id = formData.get("id") as string;
  const active = formData.get("active") === "true";

  await prisma.discountCode.update({
    where: { id },
    data: { active: !active }
  });
  revalidatePath('/admin/discounts');
}

export default async function AdminDiscounts() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/portal");
  }

  const discounts = await prisma.discountCode.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className={styles.container}>
      <Header isAdmin userEmail={session.user.email} />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Discount Codes</h1>
          <Link href="/admin" className="btn btn-secondary">Back to Dashboard</Link>
        </div>

        <section className={styles.requestsSection}>
          <div className={styles.card}>
            <h3>Create New Code</h3>
            <form action={addDiscount} className={styles.form} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div className={styles.inputGroup}>
                <label>Code (e.g. WELCOME10)</label>
                <input name="code" required className={styles.input} />
              </div>
              <div className={styles.inputGroup}>
                <label>Discount (%)</label>
                <input name="percentage" type="number" required className={styles.input} />
              </div>
              <div className={styles.inputGroup} style={{ gridColumn: 'span 2' }}>
                <label>Description (internal)</label>
                <input name="description" required className={styles.input} />
              </div>
              <div className={styles.inputGroup} style={{ gridColumn: 'span 2' }}>
                <label>Expiry Date (Optional)</label>
                <input name="expiresAt" type="date" className={styles.input} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 2' }}>Create Discount</button>
            </form>
          </div>
        </section>

        <section className={styles.requestsSection}>
          <h2>Existing Codes</h2>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Discount</th>
                  <th>Status</th>
                  <th>Expires</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {discounts.map(d => (
                  <tr key={d.id}>
                    <td><strong>{d.code}</strong><br/><small>{d.description}</small></td>
                    <td>{d.percentage}%</td>
                    <td>
                      <span className={`${styles.badge} ${d.active ? styles.open : styles.closed}`}>
                        {d.active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td>{d.expiresAt ? new Date(d.expiresAt).toLocaleDateString() : 'Never'}</td>
                    <td>
                      <form action={toggleDiscount}>
                        <input type="hidden" name="id" value={d.id} />
                        <input type="hidden" name="active" value={String(d.active)} />
                        <button type="submit" className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '4px 8px' }}>
                          {d.active ? 'Disable' : 'Enable'}
                        </button>
                      </form>
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
