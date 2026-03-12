import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import KBFormClient from "../KBFormClient";
import styles from "../../blog/blog-admin.module.css";

export const metadata = {
  title: "New KB Guide | Admin",
};

async function createKB(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return;

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const category = formData.get("category") as string;
  const content = formData.get("content") as string;
  const videoUrl = formData.get("videoUrl") as string;
  const published = formData.get("published") === "on";

  if (!title || !slug || !content) return;

  await prisma.kBArticle.create({
    data: { title, slug, category, content, videoUrl, published }
  });

  redirect("/admin/kb");
}

export default async function NewKB() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/portal");
  }

  return (
    <div className={styles.container}>
      <Header isAdmin userEmail={session.user.email} />
      <main className={styles.main}>
        <h1>Create New Knowledge Base Guide</h1>
        <KBFormClient action={createKB} />
      </main>
    </div>
  );
}