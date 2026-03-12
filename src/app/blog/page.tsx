import Header from '@/components/Header';
import Breadcrumbs from '@/components/Breadcrumbs';
import styles from './blog.module.css';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Local Tech Alerts & Tips | Felpham & Bognor Regis",
  description: "Stay safe online with local tech alerts, scam warnings, and helpful tips for residents in Felpham and Bognor Regis.",
};

async function getPosts() {
  return await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' }
  });
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.topContent}>
          <Breadcrumbs items={[{ label: 'Tech Alerts & Tips' }]} />
        </div>

        <section className={styles.hero}>
          <h1>Local Tech Alerts & Tips</h1>
          <p>Helping the Felpham and Bognor community stay safe and informed.</p>
        </section>

        <section className={styles.content}>
          {posts.length === 0 ? (
            <div className={styles.empty}>
              <p className={styles.mutedText}>No alerts or tips currently available. Please check back later.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {posts.map(post => (
                <div key={post.id} className={styles.postCard}>
                  <span className={`${styles.categoryBadge} ${styles[post.category.toLowerCase()]}`}>
                    {post.category.replace('_', ' ')}
                  </span>
                  <h2>{post.title}</h2>
                  <p className={styles.excerpt}>{post.excerpt}</p>
                  <p className={styles.date}>{new Date(post.createdAt).toLocaleDateString('en-GB')}</p>
                  <Link href={`/blog/${post.slug}`} className={styles.readMore}>Read Full Advice →</Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>&copy; {new Date().getFullYear()} Consider IT Fixed. Keeping Bognor Regis safe online.</p>
        </div>
      </footer>
    </div>
  );
}
