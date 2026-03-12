import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import KBFormClient from "../../KBFormClient";
import styles from "../../../blog/blog-admin.module.css";

export const metadata = {
  title: "Edit KB Guide | Admin",
};

async function updateKB(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return;

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const category = formData.get("category") as string;
  const content = formData.get("content") as string;
  const videoUrl = formData.get("videoUrl") as string;
  const published = formData.get("published") === "on";

  if (!id || !title || !slug || !content) return;

  await prisma.kBArticle.update({
    where: { id },
    data: { title, slug, category, content, videoUrl, published }
  });

  redirect("/admin/kb");
}

export default async function EditKB({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/portal");
  }

  const resolvedParams = await params;
  const article = await prisma.kBArticle.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!article) notFound();

  return (
    <div className={styles.container}>
      <Header isAdmin userEmail={session.user.email} />
      <main className={styles.main}>
        <h1>Edit Knowledge Base Guide</h1>
        <KBFormClient article={article} action={updateKB} />
      </main>
    </div>
  );
}