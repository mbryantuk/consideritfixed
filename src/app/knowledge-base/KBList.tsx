'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ChevronRight } from 'lucide-react';
import Fuse from 'fuse.js';
import styles from './kb.module.css';

interface KBArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
}

export default function KBList({ initialArticles }: { initialArticles: KBArticle[] }) {
  const [searchQuery, setSearchQuery] = useState('');

  const fuse = useMemo(() => {
    return new Fuse(initialArticles, {
      keys: ['title', 'category'],
      threshold: 0.3,
    });
  }, [initialArticles]);

  const filteredArticles = useMemo(() => {
    if (!searchQuery) return initialArticles;
    return fuse.search(searchQuery).map(result => result.item);
  }, [searchQuery, fuse, initialArticles]);

  // Group filtered articles by category
{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
  const categoriesMap = filteredArticles.reduce((acc: any, art) => {
    if (!acc[art.category]) acc[art.category] = [];
    acc[art.category].push(art);
    return acc;
  }, {});

  const categoryList = Object.keys(categoriesMap).map(name => ({
    title: name,
    articles: categoriesMap[name]
  }));

  return (
    <>
      <section className={styles.searchSection}>
        <div className={styles.searchBar}>
          <Search className={styles.searchIcon} size={20} />
          <input 
            type="text" 
            placeholder="Search guides (e.g. 'Wi-Fi', 'password')..." 
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </section>

      <section className={styles.content}>
        {categoryList.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.mutedText}>No guides found matching your search.</p>
            <button onClick={() => setSearchQuery('')} className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }}>Clear Search</button>
          </div>
        ) : (
          <div className={styles.grid}>
            {categoryList.map((cat, i) => (
              <div key={i} className={styles.categoryCard}>
                <h2>{cat.title}</h2>
                <ul className={styles.articleList}>
{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {cat.articles.map((art: any, j: number) => (
                    <li key={j}>
                      <Link href={`/knowledge-base/${art.slug}`} className={styles.articleLink}>
                        <span>{art.title}</span>
                        <ChevronRight size={16} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
