import Header from '@/components/Header';
import Breadcrumbs from '@/components/Breadcrumbs';
import styles from './kb.module.css';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import KBList from './KBList';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Download, Printer } from 'lucide-react';

export const metadata = {
  title: "Tech How-To Guides | Knowledge Base | Felpham & Bognor Regis",
  description: "Simple, step-by-step tech guides for common tasks. Helping residents in Felpham and Bognor Regis master their devices.",
};

export default async function KnowledgeBase() {
  const articles = await prisma.kBArticle.findMany({
    where: { published: true },
    orderBy: [{ category: 'asc' }, { order: 'asc' }],
    select: { id: true, title: true, slug: true, category: true }
  });

  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.topContent}>
          <Breadcrumbs items={[{ label: 'Knowledge Base' }]} />
        </div>

        <section className={styles.hero}>
          <BookOpen size={48} className={styles.heroIcon} />
          <h1>Knowledge Base</h1>
          <p>Simple, step-by-step guides to help you master your technology.</p>
        </section>

        <KBList initialArticles={articles} />



        <section className={styles.cta}>
          <h2>Can&apos;t find what you need?</h2>
          <p>I can create a custom guide for you during a &quot;Tea & Tech&quot; session.</p>
          <Link href="/services/tech-support-for-seniors" className="btn btn-primary">Learn about Tutoring</Link>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>&copy; {new Date().getFullYear()} Consider IT Fixed. Empowering you with tech knowledge.</p>
        </div>
      </footer>
    </div>
  );
}