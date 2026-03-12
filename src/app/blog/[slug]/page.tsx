import Header from '@/components/Header';
import { prisma } from '@/lib/prisma';
import styles from '../blog.module.css';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import GlossarySidebar from '@/components/GlossarySidebar';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug: resolvedParams.slug }
  });

  if (!post) return { title: 'Post Not Found' };

  return {
    title: `${post.title} | Consider IT Fixed Tech Alerts`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug: resolvedParams.slug }
  });

  if (!post || !post.published) {
    notFound();
  }

  // Fetch related posts (simple: same category, or just most recent other posts)
  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      id: { not: post.id },
      published: true,
      category: post.category
    },
    take: 3,
    orderBy: { createdAt: 'desc' }
  });

  // If we don't have enough in the same category, get any recent ones
  if (relatedPosts.length < 3) {
    const additionalPosts = await prisma.blogPost.findMany({
      where: {
        id: { notIn: [post.id, ...relatedPosts.map(p => p.id)] },
        published: true
      },
      take: 3 - relatedPosts.length,
      orderBy: { createdAt: 'desc' }
    });
    relatedPosts.push(...additionalPosts);
  }

  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.blogLayout}>
          <article className={styles.article}>
            <Link href="/blog" className={styles.backLink}>← Back to all alerts</Link>
            
            <header className={styles.articleHeader}>
              <span className={`${styles.categoryBadge} ${styles[post.category.toLowerCase()]}`}>
                {post.category.replace('_', ' ')}
              </span>
              <h1>{post.title}</h1>
              <p className={styles.date}>Published on {new Date(post.createdAt).toLocaleDateString('en-GB')}</p>
            </header>

            <div className={styles.articleContent}>
              {/* Using a simple div for content, assuming text for now. If using MDX/Markdown, would need a parser */}
              {post.content.split('\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <div className={styles.shareSection}>
              <p>Share this alert with neighbors:</p>
              <div className={styles.shareButtons}>
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=https://consideritfixed.co.uk/blog/${post.slug}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.shareButton}
                  aria-label="Share on Facebook"
                >
                  Facebook
                </a>
                <a 
                  href={`https://wa.me/?text=Check out this local tech alert from Consider IT Fixed: https://consideritfixed.co.uk/blog/${post.slug}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.shareButton}
                  style={{ backgroundColor: '#25D366' }}
                  aria-label="Share on WhatsApp"
                >
                  WhatsApp
                </a>
                <a 
                  href="https://nextdoor.co.uk" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.shareButton}
                  style={{ backgroundColor: '#00B246' }}
                  aria-label="Share on Nextdoor"
                >
                  Nextdoor
                </a>
              </div>
            </div>

            {relatedPosts.length > 0 && (
              <section className={styles.relatedGuides}>
                <hr className={styles.divider} />
                <h2>More Useful Tech Guides</h2>
                <div className={styles.relatedGrid}>
                  {relatedPosts.map(rel => (
                    <Link key={rel.id} href={`/blog/${rel.slug}`} className={styles.relatedCard}>
                      <span className={`${styles.categoryBadge} ${styles[rel.category.toLowerCase()]}`}>
                        {rel.category.replace('_', ' ')}
                      </span>
                      <h3>{rel.title}</h3>
                      <p className={styles.relExcerpt}>{rel.excerpt.substring(0, 80)}...</p>
                      <span className={styles.readMore}>Read Guide →</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <section className={styles.articleCta}>
              <h3>Worried about this or something else?</h3>
              <p>I&apos;m here to provide honest, local advice. No question is too small.</p>
              <Link href="/contact" className="btn btn-primary">Ask for Advice</Link>
            </section>
          </article>

          <GlossarySidebar currentPostContent={post.content} />
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>&copy; {new Date().getFullYear()} Consider IT Fixed. Friendly Tech Support in West Sussex.</p>
        </div>
      </footer>
    </div>
  );
}