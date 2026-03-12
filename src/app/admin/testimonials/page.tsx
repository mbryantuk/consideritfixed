import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Header from "@/components/Header";
import styles from "./testimonials.module.css";
import Link from "next/link";

export const metadata = {
  title: "Manage Testimonials | Admin",
};

async function toggleApprove(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return;

  const id = formData.get("id") as string;
  const approved = formData.get("approved") === "true";

  await prisma.testimonial.update({
    where: { id },
    data: { approved: !approved }
  });
  revalidatePath('/admin/testimonials');
  revalidatePath('/');
}

async function toggleFeatured(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return;

  const id = formData.get("id") as string;
  const featured = formData.get("featured") === "true";

  await prisma.testimonial.update({
    where: { id },
    data: { featured: !featured }
  });
  revalidatePath('/admin/testimonials');
  revalidatePath('/');
}

async function deleteTestimonial(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return;

  const id = formData.get("id") as string;
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath('/admin/testimonials');
}

export default async function AdminTestimonials() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/portal");
  }

  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className={styles.container}>
      <Header isAdmin userEmail={session.user.email} />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Feedback Wall</h1>
          <Link href="/admin" className="btn btn-secondary">Back to Dashboard</Link>
        </div>

        <section className={styles.section}>
          {testimonials.length === 0 ? (
            <div className={styles.empty}>
              <p>No testimonials found in the database.</p>
              <p className={styles.mutedText}>Once customers leave feedback, it will appear here for approval.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {testimonials.map(t => (
                <div key={t.id} className={`${styles.card} ${t.approved ? '' : styles.unapproved}`}>
                  <div className={styles.cardHeader}>
                    <strong>{t.author}</strong>
                    <span className={styles.location}>{t.location}</span>
                    <span className={styles.stars}>{'★'.repeat(t.stars)}</span>
                  </div>
                  <p className={styles.text}>&quot;{t.text}&quot;</p>
                  <div className={styles.actions}>
                    <form action={toggleApprove}>
                      <input type="hidden" name="id" value={t.id} />
                      <input type="hidden" name="approved" value={String(t.approved)} />
                      <button type="submit" className={t.approved ? styles.btnRevoke : styles.btnApprove}>
                        {t.approved ? 'Revoke Approval' : 'Approve'}
                      </button>
                    </form>
                    <form action={toggleFeatured}>
                      <input type="hidden" name="id" value={t.id} />
                      <input type="hidden" name="featured" value={String(t.featured)} />
                      <button type="submit" className={t.featured ? styles.btnUnfeature : styles.btnFeature}>
                        {t.featured ? 'Unfeature' : 'Feature on Home'}
                      </button>
                    </form>
                    <form action={deleteTestimonial} onSubmit={(e) => { if(!confirm('Are you sure?')) e.preventDefault(); }}>
                      <input type="hidden" name="id" value={t.id} />
                      <button type="submit" className={styles.btnDelete}>Delete</button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}