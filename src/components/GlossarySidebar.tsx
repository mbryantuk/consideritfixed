import Link from 'next/link';
import { glossaryTerms } from '@/lib/glossary-data';
import styles from './GlossarySidebar.module.css';

export default function GlossarySidebar({ currentPostContent }: { currentPostContent: string }) {
  // Find terms that are actually mentioned in the post content
  const relevantTerms = glossaryTerms.filter(item => {
    const regex = new RegExp(`\\b${item.term}\\b`, 'i');
    return regex.test(currentPostContent);
  }).slice(0, 3); // Just show top 3 relevant terms

  if (relevantTerms.length === 0) {
    // Show some default useful terms if none match
    relevantTerms.push(...glossaryTerms.slice(0, 2));
  }

  return (
    <aside className={styles.sidebar}>
      <h3>Jargon-Free Help</h3>
      <p className={styles.intro}>Need a reminder of what some terms mean?</p>
      
      <div className={styles.termList}>
        {relevantTerms.map((item, index) => (
          <div key={index} className={styles.termCard}>
            <h4>{item.term}</h4>
            <p>{item.definition}</p>
          </div>
        ))}
      </div>
      
      <Link href="/glossary" className={styles.fullLink}>
        View full glossary →
      </Link>
    </aside>
  );
}
