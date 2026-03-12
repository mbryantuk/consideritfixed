import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import BlogPostFormClient from "../../BlogPostFormClient";
import styles from "../../blog-admin.module.css";

export const metadata = {
  title: "Edit Blog Post | Admin",
};

async function updatePost(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return;

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const published = formData.get("published") === "on";

  if (!id || !title || !slug || !content) return;

  await prisma.blogPost.update({
    where: { id },
    data: { title, slug, excerpt, content, category, published }
  });

  redirect("/admin/blog");
}

export default async function EditBlogPost({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/portal");
  }

  const resolvedParams = await params;
  const post = await prisma.blogPost.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!post) notFound();

  return (
    <div className={styles.container}>
      <Header isAdmin userEmail={session.user.email} />
      <main className={styles.main}>
        <h1>Edit Blog Post</h1>
        <BlogPostFormClient post={post} action={updatePost} />
      </main>
    </div>
  );
}