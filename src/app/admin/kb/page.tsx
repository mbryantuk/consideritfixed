import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import styles from "../blog/blog-admin.module.css";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export const metadata = {
  title: "Manage Knowledge Base | Admin",
};

async function togglePublish(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const published = formData.get("published") === "true";

  await prisma.kBArticle.update({
    where: { id },
    data: { published: !published }
  });
  revalidatePath('/admin/kb');
  revalidatePath('/knowledge-base');
}

async function deleteArticle(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await prisma.kBArticle.delete({ where: { id } });
  revalidatePath('/admin/kb');
  revalidatePath('/knowledge-base');
}

export default async function AdminKB() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/portal");
  }

  const articles = await prisma.kBArticle.findMany({
    orderBy: { category: 'asc' }
  });

  return (
    <div className={styles.container}>
      <Header isAdmin userEmail={session.user.email} />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Knowledge Base CMS</h1>
          <div className={styles.headerActions}>
            <Link href="/admin/kb/new" className="btn btn-primary">+ New Guide</Link>
            <Link href="/admin/content" className="btn btn-secondary">Back to Content Hub</Link>
          </div>
        </div>

        <section className={styles.section}>
          {articles.length === 0 ? (
            <div className={styles.empty}>
              <p>No guides found in Knowledge Base.</p>
              <Link href="/admin/kb/new" className="btn btn-secondary">Create your first guide</Link>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map(art => (
                    <tr key={art.id}>
                      <td>
                        <strong>{art.title}</strong>
                        <div className={styles.slug}>{art.slug}</div>
                      </td>
                      <td>{art.category}</td>
                      <td>
                        <span className={`${styles.badge} ${art.published ? styles.published : styles.draft}`}>
                          {art.published ? 'Live' : 'Draft'}
                        </span>
                      </td>
                      <td>
                        <div className={styles.rowActions}>
                          <Link href={`/admin/kb/${art.id}/edit`} className={styles.btnEdit}>Edit</Link>
                          <form action={togglePublish}>
                            <input type="hidden" name="id" value={art.id} />
                            <input type="hidden" name="published" value={String(art.published)} />
                            <button type="submit" className={styles.btnAction}>
                              {art.published ? 'Hide' : 'Publish'}
                            </button>
                          </form>
                          <form action={deleteArticle} onSubmit={(e) => { if(!confirm('Delete guide?')) e.preventDefault(); }}>
                            <input type="hidden" name="id" value={art.id} />
                            <button type="submit" className={styles.btnDelete}>Delete</button>
                          </form>
                        </div>
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