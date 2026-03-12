import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Header from "@/components/Header";
import styles from "../admin.module.css";
import Link from "next/link";

export const metadata = {
  title: "Quick Replies | Admin",
};

async function addQuickReply(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return;

  const title = formData.get("title") as string;
  const text = formData.get("text") as string;

  await prisma.quickReply.create({
    data: { title, text }
  });
  revalidatePath('/admin/replies');
}

async function deleteQuickReply(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return;

  const id = formData.get("id") as string;
  await prisma.quickReply.delete({ where: { id } });
  revalidatePath('/admin/replies');
}

export default async function AdminReplies() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/portal");
  }

  const replies = await prisma.quickReply.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className={styles.container}>
      <Header isAdmin userEmail={session.user.email} />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Quick Reply Templates</h1>
          <Link href="/admin" className="btn btn-secondary">Back to Dashboard</Link>
        </div>

        <section className={styles.requestsSection}>
          <h2>Canned Responses for Tickets</h2>
          
          <div style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
            <h3>Create Template</h3>
            <form action={addQuickReply} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input name="title" placeholder="Template Name (e.g. Greeting)" required style={{ padding: '10px' }} />
              <textarea name="text" placeholder="The actual message content..." required style={{ padding: '10px', minHeight: '100px' }} />
              <button type="submit" className="btn btn-primary">Save Template</button>
            </form>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {replies.map((reply) => (
              <div key={reply.id} style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: '8px', position: 'relative' }}>
                <h4 style={{ margin: '0 0 10px 0' }}>{reply.title}</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{reply.text}</p>
                <form action={deleteQuickReply} style={{ marginTop: '15px' }} onSubmit={(e) => { if(!confirm('Delete this template?')) e.preventDefault(); }}>
                  <input type="hidden" name="id" value={reply.id} />
                  <button type="submit" className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.8rem', background: '#ef4444', color: 'white' }}>Delete</button>
                </form>
              </div>
            ))}
            {replies.length === 0 && <p>No quick replies created yet.</p>}
          </div>
        </section>
      </main>
    </div>
  );
}
