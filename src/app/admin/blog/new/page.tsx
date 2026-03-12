import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import BlogPostFormClient from "../BlogPostFormClient";
import styles from "../blog-admin.module.css";

export const metadata = {
  title: "New Blog Post | Admin",
};

async function createPost(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") return;

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const published = formData.get("published") === "on";

  if (!title || !slug || !content) return;

  await prisma.blogPost.create({
    data: { title, slug, excerpt, content, category, published }
  });

  redirect("/admin/blog");
}

export default async function NewBlogPost() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/portal");
  }

  return (
    <div className={styles.container}>
      <Header isAdmin userEmail={session.user.email} />
      <main className={styles.main}>
        <h1>Create New Blog Post</h1>
        <BlogPostFormClient action={createPost} />
      </main>
    </div>
  );
}