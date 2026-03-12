import Header from '@/components/Header';
import Breadcrumbs from '@/components/Breadcrumbs';
import styles from '../kb.module.css';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ChevronLeft, PlayCircle } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { renderMarkdown } from '@/lib/utils';
import TTSPlayer from '@/components/TTSPlayer';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await prisma.kBArticle.findUnique({ where: { slug: resolvedParams.slug } });
  if (!article) return { title: 'Article Not Found' };
  return { title: `${article.title} | Knowledge Base` };
}

export default async function KBArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const article = await prisma.kBArticle.findUnique({
    where: { slug: resolvedParams.slug }
  });

  if (!article || !article.published) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.topContent}>
          <Breadcrumbs items={[
            { label: 'Knowledge Base', href: '/knowledge-base' },
            { label: article.title }
          ]} />
        </div>

        <article className={styles.article}>
          <Link href="/knowledge-base" className={styles.backLink}>
            <ChevronLeft size={20} />
            Back to Guides
          </Link>

          <header className={styles.articleHeader}>
            <span className={styles.categoryLabel}>{article.category}</span>
            <h1>{article.title}</h1>
            <TTSPlayer text={`${article.title}. ${article.content}`} />
          </header>

          <div className={styles.articleBody}>
            <div dangerouslySetInnerHTML={renderMarkdown(article.content)} />

            {article.videoUrl && (
              <div className={styles.videoSection}>
                <h3>
                  <PlayCircle size={24} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  Video Guide
                </h3>
                <div className={styles.videoWrapper}>
                  <iframe 
                    src={article.videoUrl} 
                    title={article.title}
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
                <p className={styles.videoMuted}>Note: Video content is provided by third parties for educational purposes.</p>
              </div>
            )}
          </div>

          <section className={styles.articleCta}>
            <h3>Need hands-on help?</h3>
            <p>If you&apos;d prefer an in-person demonstration, why not book a &quot;Tea & Tech&quot; session?</p>
            <Link href="/services/tech-support-for-seniors" className="btn btn-primary">Book Tutoring</Link>
          </section>
        </article>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>&copy; {new Date().getFullYear()} Consider IT Fixed. Simple help for every neighbor.</p>
        </div>
      </footer>
    </div>
  );
}