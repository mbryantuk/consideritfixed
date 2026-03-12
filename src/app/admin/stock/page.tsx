import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Header from "@/components/Header";
import styles from "./stock.module.css";
import Link from "next/link";
import { logAudit } from "@/lib/utils";

export const metadata = {
  title: "Stock Tracker | Admin",
};

async function addPart(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return;

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const stockLevel = parseInt(formData.get("stockLevel") as string) || 0;
  const price = parseFloat(formData.get("price") as string) || 0;

  if (!name) return;

  const part = await prisma.part.create({
    data: { name, description, stockLevel, price }
  });
  await logAudit(session.user.id, "CREATE_PART", "Part", part.id, { name });
  revalidatePath('/admin/stock');
}

async function updateStock(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return;

  const id = formData.get("id") as string;
  const adjustment = parseInt(formData.get("adjustment") as string);

  const part = await prisma.part.findUnique({ where: { id } });
  if (!part) return;

  await prisma.part.update({
    where: { id },
    data: { stockLevel: Math.max(0, part.stockLevel + adjustment) }
  });
  revalidatePath('/admin/stock');
}

async function updatePrice(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return;

  const id = formData.get("id") as string;
  const price = parseFloat(formData.get("price") as string);

  await prisma.part.update({
    where: { id },
    data: { price }
  });
  await logAudit(session.user.id, "UPDATE_PART_PRICE", "Part", id, { price });
  revalidatePath('/admin/stock');
}

async function deletePart(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return;

  const id = formData.get("id") as string;
  await prisma.part.delete({ where: { id } });
  await logAudit(session.user.id, "DELETE_PART", "Part", id);
  revalidatePath('/admin/stock');
}

export default async function AdminStock() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/portal");
  }

  const parts = await prisma.part.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className={styles.container}>
      <Header isAdmin userEmail={session.user.email} />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Inventory & Pricing</h1>
          <Link href="/admin" className="btn btn-secondary">Back to Dashboard</Link>
        </div>

        <section className={styles.addSection}>
          <div className={styles.card}>
            <h3>Add New Part / Item</h3>
            <form action={addPart} className={styles.addForm}>
              <div className={styles.inputGroup}>
                <label htmlFor="name">Item Name</label>
                <input id="name" name="name" type="text" required placeholder="e.g. 500GB SSD" className={styles.input} />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="stockLevel">Initial Stock</label>
                <input id="stockLevel" name="stockLevel" type="number" defaultValue="0" className={styles.input} />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="price">Approx. Price (£)</label>
                <input id="price" name="price" type="number" step="0.01" defaultValue="0" className={styles.input} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: 'auto' }}>Add Item</button>
            </form>
          </div>
        </section>

        <section className={styles.listSection}>
          <div className={styles.card}>
            <h3>Current Inventory</h3>
            {parts.length === 0 ? (
              <p className={styles.mutedText}>No items in stock yet.</p>
            ) : (
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Unit Price</th>
                      <th>Level</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parts.map(part => (
                      <tr key={part.id}>
                        <td>
                          <strong>{part.name}</strong>
                          {part.description && <p className={styles.desc}>{part.description}</p>}
                        </td>
                        <td>
                          <form action={updatePrice} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <input type="hidden" name="id" value={part.id} />
                            <span>£</span>
                            <input 
                              name="price" 
                              type="number" 
                              step="0.01" 
                              defaultValue={part.price?.toFixed(2)} 
                              onBlur={(e) => e.target.form?.requestSubmit()}
                              style={{ width: '80px', padding: '4px' }}
                            />
                          </form>
                        </td>
                        <td>
                          <span className={`${styles.level} ${part.stockLevel < 3 ? styles.low : ''}`}>
                            {part.stockLevel}
                          </span>
                        </td>
                        <td>
                          <div className={styles.rowActions}>
                            <form action={updateStock}>
                              <input type="hidden" name="id" value={part.id} />
                              <input type="hidden" name="adjustment" value="1" />
                              <button type="submit" className={styles.btnAdjust}>+1</button>
                            </form>
                            <form action={updateStock}>
                              <input type="hidden" name="id" value={part.id} />
                              <input type="hidden" name="adjustment" value="-1" />
                              <button type="submit" className={styles.btnAdjust}>-1</button>
                            </form>
                            <form action={deletePart} onSubmit={(e) => { if(!confirm('Delete item?')) e.preventDefault(); }}>
                              <input type="hidden" name="id" value={part.id} />
                              <button type="submit" className={styles.btnDelete}>🗑️</button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
