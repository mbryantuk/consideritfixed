import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import styles from "../../../blog/blog-admin.module.css";
import EventFormClient from "../../EventFormClient";
import { revalidatePath } from "next/cache";

export const metadata = {
  title: "Edit Event | Admin",
};

async function updateEvent(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return;

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const eventDate = new Date(formData.get("eventDate") as string);
  const startTime = formData.get("startTime") as string;
  const endTime = formData.get("endTime") as string;
  const published = formData.get("published") === "on";

  await prisma.calendarEvent.update({
    where: { id },
    data: {
      title,
      description,
      location,
      eventDate,
      startTime,
      endTime,
      published
    }
  });

  revalidatePath('/admin/events');
  revalidatePath('/');
  redirect('/admin/events');
}

export default async function EditEvent(props: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/portal");
  }

  const resolvedParams = await props.params;
  const event = await prisma.calendarEvent.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!event) notFound();

  return (
    <div className={styles.container}>
      <Header isAdmin userEmail={session.user.email} />
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Edit Workshop</h1>
        </div>
        <EventFormClient event={event} action={updateEvent} />
      </main>
    </div>
  );
}
