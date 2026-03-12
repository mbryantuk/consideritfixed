import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Header from "@/components/Header";
import styles from "../admin.module.css";
import Link from "next/link";
import { renderMarkdown } from "@/lib/utils";

export const metadata = {
  title: "Internal Wiki | Admin",
};

async function addWikiArticle(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return;

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  await prisma.wikiArticle.create({
    data: { title, content }
  });
  revalidatePath('/admin/wiki');
}

async function deleteWikiArticle(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return;

  const id = formData.get("id") as string;
  await prisma.wikiArticle.delete({ where: { id } });
  revalidatePath('/admin/wiki');
}

export default async function AdminWiki() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/portal");
  }

  const articles = await prisma.wikiArticle.findMany({
    orderBy: { updatedAt: 'desc' },
  });

  return (
    <div className={styles.container}>
      <Header isAdmin userEmail={session.user.email} />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Internal Knowledge Base</h1>
          <Link href="/admin" className="btn btn-secondary">Back to Dashboard</Link>
        </div>

        <section className={styles.requestsSection}>
          <h2>Troubleshooting & Procedures</h2>
          
          <div style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
            <h3>Add New Wiki Article</h3>
            <form action={addWikiArticle} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input name="title" placeholder="Title (e.g. Printer Reset Steps)" required style={{ padding: '10px' }} />
              <textarea name="content" placeholder="Content (Markdown supported)" required style={{ padding: '10px', minHeight: '150px' }} />
              <button type="submit" className="btn btn-primary">Save to Wiki</button>
            </form>
          </div>

          <div style={{ display: 'grid', gap: '20px' }}>
            {articles.map((article) => (
              <details key={article.id} style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: '8px' }}>
                <summary style={{ fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer' }}>
                  {article.title}
                  <small style={{ fontWeight: 'normal', color: 'var(--text-muted)', marginLeft: '10px' }}>
                    Updated: {new Date(article.updatedAt).toLocaleDateString()}
                  </small>
                </summary>
                <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                  <div dangerouslySetInnerHTML={renderMarkdown(article.content)} />
                  <form action={deleteWikiArticle} style={{ marginTop: '20px' }} onSubmit={(e) => { if(!confirm('Delete this article?')) e.preventDefault(); }}>
                    <input type="hidden" name="id" value={article.id} />
                    <button type="submit" className="btn btn-secondary" style={{ background: '#ef4444', color: 'white' }}>Delete</button>
                  </form>
                </div>
              </details>
            ))}
            {articles.length === 0 && <p>No wiki articles yet. Start by adding one above.</p>}
          </div>
        </section>
      </main>
    </div>
  );
}
