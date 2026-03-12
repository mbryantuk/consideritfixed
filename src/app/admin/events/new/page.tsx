import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import styles from "../../blog/blog-admin.module.css";
import EventFormClient from "../EventFormClient";
import { revalidatePath } from "next/cache";

export const metadata = {
  title: "New Event | Admin",
};

async function createEvent(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return;

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const eventDate = new Date(formData.get("eventDate") as string);
  const startTime = formData.get("startTime") as string;
  const endTime = formData.get("endTime") as string;
  const published = formData.get("published") === "on";

  await prisma.calendarEvent.create({
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

export default async function NewEvent() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/portal");
  }

  return (
    <div className={styles.container}>
      <Header isAdmin userEmail={session.user.email} />
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Schedule New Workshop</h1>
        </div>
        <EventFormClient action={createEvent} />
      </main>
    </div>
  );
}
