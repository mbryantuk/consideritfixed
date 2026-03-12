import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Header from "@/components/Header";
import styles from "./services-admin.module.css";
import Link from "next/link";

export const metadata = {
  title: "Manage Services & Pricing | Admin",
};

// ACTIONS
async function addService(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return;

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const icon = formData.get("icon") as string;
  const estimatedTime = formData.get("estimatedTime") as string;

  await prisma.service.create({
    data: { title, description, icon, estimatedTime }
  });
  revalidatePath('/');
  revalidatePath('/admin/services');
}

async function addPrice(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return;

  const serviceName = formData.get("serviceName") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price") as string;

  await prisma.priceRate.create({
    data: { serviceName, description, price }
  });
  revalidatePath('/pricing');
  revalidatePath('/admin/services');
}

async function deleteService(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return;

  const id = formData.get("id") as string;
  await prisma.service.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/admin/services');
}

async function deletePrice(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return;

  const id = formData.get("id") as string;
  await prisma.priceRate.delete({ where: { id } });
  revalidatePath('/pricing');
  revalidatePath('/admin/services');
}

export default async function AdminServices() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/portal");
  }

  const services = await prisma.service.findMany({ orderBy: { order: 'asc' } });
  const prices = await prisma.priceRate.findMany({ orderBy: { order: 'asc' } });

  return (
    <div className={styles.container}>
      <Header isAdmin userEmail={session.user.email} />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Services & Pricing CMS</h1>
          <Link href="/admin" className="btn btn-secondary">Back to Dashboard</Link>
        </div>

        <div className={styles.grid}>
          {/* SERVICES MANAGEMENT */}
          <section className={styles.column}>
            <div className={styles.card}>
              <h2>Add New Service</h2>
              <form action={addService} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label>Service Title</label>
                  <input name="title" required placeholder="e.g. Virus Removal" className={styles.input} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Icon (Emoji or name)</label>
                  <input name="icon" required placeholder="e.g. 🛡️" className={styles.input} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Estimated Time (Badge)</label>
                  <input name="estimatedTime" placeholder="e.g. 1-2 Hours" className={styles.input} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Description</label>
                  <textarea name="description" required rows={3} className={styles.textarea} />
                </div>
                <button type="submit" className="btn btn-primary">Add Service</button>
              </form>
            </div>

            <div className={styles.card} style={{ marginTop: '2rem' }}>
              <h2>Current Services</h2>
              <div className={styles.list}>
                {services.map(s => (
                  <div key={s.id} className={styles.listItem}>
                    <div>
                      <strong>{s.icon} {s.title}</strong>
                      {s.estimatedTime && <span className={styles.timeBadge}>{s.estimatedTime}</span>}
                      <p className={styles.small}>{s.description}</p>
                    </div>
                    <form action={deleteService}>
                      <input type="hidden" name="id" value={s.id} />
                      <button type="submit" className={styles.btnDelete}>🗑️</button>
                    </form>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* PRICING MANAGEMENT */}
          <section className={styles.column}>
            <div className={styles.card}>
              <h2>Add New Rate Card Item</h2>
              <form action={addPrice} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label>Rate Label</label>
                  <input name="serviceName" required placeholder="e.g. General Support" className={styles.input} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Price Display</label>
                  <input name="price" required placeholder="e.g. £40 per hour" className={styles.input} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Description</label>
                  <textarea name="description" required rows={2} className={styles.textarea} />
                </div>
                <button type="submit" className="btn btn-primary">Add to Rate Card</button>
              </form>
            </div>

            <div className={styles.card} style={{ marginTop: '2rem' }}>
              <h2>Current Rate Card</h2>
              <div className={styles.list}>
                {prices.map(p => (
                  <div key={p.id} className={styles.listItem}>
                    <div>
                      <strong>{p.serviceName}</strong>
                      <div className={styles.priceTag}>{p.price}</div>
                      <p className={styles.small}>{p.description}</p>
                    </div>
                    <form action={deletePrice}>
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" className={styles.btnDelete}>🗑️</button>
                    </form>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}