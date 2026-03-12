import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import styles from "./blog-admin.module.css";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export const metadata = {
  title: "Manage Blog Posts | Admin",
};

async function togglePublish(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return;

  const id = formData.get("id") as string;
  const published = formData.get("published") === "true";

  await prisma.blogPost.update({
    where: { id },
    data: { published: !published }
  });
  revalidatePath('/admin/blog');
  revalidatePath('/blog');
}

async function deletePost(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return;

  const id = formData.get("id") as string;
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath('/admin/blog');
  revalidatePath('/blog');
}

export default async function AdminBlog() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/portal");
  }

  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className={styles.container}>
      <Header isAdmin userEmail={session.user.email} />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Blog & Tech Alerts CMS</h1>
          <div className={styles.headerActions}>
            <Link href="/admin/blog/new" className="btn btn-primary">+ Create New Post</Link>
            <Link href="/admin" className="btn btn-secondary">Back to Dashboard</Link>
          </div>
        </div>

        <section className={styles.section}>
          {posts.length === 0 ? (
            <div className={styles.empty}>
              <p>No blog posts found.</p>
              <Link href="/admin/blog/new" className="btn btn-secondary">Create your first post</Link>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map(post => (
                    <tr key={post.id}>
                      <td>
                        <strong>{post.title}</strong>
                        <div className={styles.slug}>{post.slug}</div>
                      </td>
                      <td>{post.category.replace('_', ' ')}</td>
                      <td>
                        <span className={`${styles.badge} ${post.published ? styles.published : styles.draft}`}>
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td>{new Date(post.createdAt).toLocaleDateString('en-GB')}</td>
                      <td>
                        <div className={styles.rowActions}>
                          <Link href={`/admin/blog/${post.id}/edit`} className={styles.btnEdit}>Edit</Link>
                          <form action={togglePublish}>
                            <input type="hidden" name="id" value={post.id} />
                            <input type="hidden" name="published" value={String(post.published)} />
                            <button type="submit" className={styles.btnAction}>
                              {post.published ? 'Unpublish' : 'Publish'}
                            </button>
                          </form>
                          <form action={deletePost} onSubmit={(e) => { if(!confirm('Delete post?')) e.preventDefault(); }}>
                            <input type="hidden" name="id" value={post.id} />
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