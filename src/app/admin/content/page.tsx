import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import styles from "./content.module.css";
import Link from "next/link";

export const metadata = {
  title: "Content Hub CMS | Admin",
};

export default async function ContentHub() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/portal");
  }

  return (
    <div className={styles.container}>
      <Header isAdmin userEmail={session.user.email} />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Content Hub (CMS)</h1>
          <Link href="/admin" className="btn btn-secondary">Back to Dashboard</Link>
        </div>

        <div className={styles.grid}>
          <Link href="/admin/blog" className={styles.card}>
            <div className={styles.icon}>📰</div>
            <h2>Blog & Tech Alerts</h2>
            <p>Write weekly tech scam alerts and helpful tips for the community.</p>
            <span className={styles.linkText}>Manage Posts →</span>
          </Link>

          <Link href="/admin/kb" className={styles.card}>
            <div className={styles.icon}>📚</div>
            <h2>Knowledge Base</h2>
            <p>Create step-by-step guides and how-to articles for common tasks.</p>
            <span className={styles.linkText}>Manage Guides →</span>
          </Link>

          <Link href="/admin/events" className={styles.card}>
            <div className={styles.icon}>📅</div>
            <h2>Calendar & Workshops</h2>
            <p>Schedule &quot;Tea & Tech&quot; sessions and community workshops.</p>
            <span className={styles.linkText}>Manage Events →</span>
          </Link>

          <Link href="/admin/settings" className={styles.card}>
            <div className={styles.icon}>👤</div>
            <h2>About Me Content</h2>
            <p>Update your personal bio and story using the Markdown editor.</p>
            <span className={styles.linkText}>Edit About Page →</span>
          </Link>
        </div>
      </main>
    </div>
  );
}