import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import styles from "../blog/blog-admin.module.css";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export const metadata = {
  title: "Manage Events & Workshops | Admin",
};

async function togglePublish(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const published = formData.get("published") === "true";

  await prisma.calendarEvent.update({
    where: { id },
    data: { published: !published }
  });
  revalidatePath('/admin/events');
  revalidatePath('/');
}

async function deleteEvent(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await prisma.calendarEvent.delete({ where: { id } });
  revalidatePath('/admin/events');
  revalidatePath('/');
}

export default async function AdminEvents() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/portal");
  }

  const events = await prisma.calendarEvent.findMany({
    orderBy: { eventDate: 'asc' }
  });

  return (
    <div className={styles.container}>
      <Header isAdmin userEmail={session.user.email} />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Events & Workshops CMS</h1>
          <div className={styles.headerActions}>
            <Link href="/admin/events/new" className="btn btn-primary">+ New Event</Link>
            <Link href="/admin/content" className="btn btn-secondary">Back to Content Hub</Link>
          </div>
        </div>

        <section className={styles.section}>
          {events.length === 0 ? (
            <div className={styles.empty}>
              <p>No events scheduled.</p>
              <Link href="/admin/events/new" className="btn btn-secondary">Schedule your first event</Link>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Title</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map(ev => (
                    <tr key={ev.id}>
                      <td>{new Date(ev.eventDate).toLocaleDateString('en-GB')}</td>
                      <td>
                        <strong>{ev.title}</strong>
                        {ev.startTime && <div className={styles.small}>{ev.startTime} - {ev.endTime}</div>}
                      </td>
                      <td>{ev.location}</td>
                      <td>
                        <span className={`${styles.badge} ${ev.published ? styles.published : styles.draft}`}>
                          {ev.published ? 'Live' : 'Draft'}
                        </span>
                      </td>
                      <td>
                        <div className={styles.rowActions}>
                          <Link href={`/admin/events/${ev.id}/edit`} className={styles.btnEdit}>Edit</Link>
                          <form action={togglePublish}>
                            <input type="hidden" name="id" value={ev.id} />
                            <input type="hidden" name="published" value={String(ev.published)} />
                            <button type="submit" className={styles.btnAction}>
                              {ev.published ? 'Hide' : 'Show'}
                            </button>
                          </form>
                          <form action={deleteEvent} onSubmit={(e) => { if(!confirm('Delete event?')) e.preventDefault(); }}>
                            <input type="hidden" name="id" value={ev.id} />
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