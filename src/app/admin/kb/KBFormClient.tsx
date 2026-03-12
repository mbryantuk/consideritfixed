'use client';

import { useState } from 'react';
import styles from '../blog/blog-admin.module.css';
import Link from 'next/link';
import MarkdownEditor from '@/components/MarkdownEditor';

export default function KBFormClient({ 
  article, 
  action 
}: { 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  article?: any, 
  action: (formData: FormData) => Promise<void> 
}) {
  const [title, setTitle] = useState(article?.title || '');
  const [slug, setSlug] = useState(article?.slug || '');

  const generateSlug = (val: string) => {
    setTitle(val);
    if (!article) {
      setSlug(val.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
    }
  };

  return (
    <form action={action} className={styles.form}>
      {article && <input type="hidden" name="id" value={article.id} />}
      <div className={styles.card}>
        <div className={styles.inputGroup}>
          <label htmlFor="title">Guide Title</label>
          <input 
            id="title" 
            name="title" 
            type="text" 
            required 
            value={title} 
            onChange={(e) => generateSlug(e.target.value)} 
            className={styles.input} 
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="slug">Slug (URL)</label>
          <input 
            id="slug" 
            name="slug" 
            type="text" 
            required 
            value={slug} 
            onChange={(e) => setSlug(e.target.value)} 
            className={styles.input} 
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="category">Category</label>
          <input 
            id="category" 
            name="category" 
            type="text" 
            required 
            defaultValue={article?.category || "General"} 
            placeholder="e.g. Internet & Wi-Fi" 
            className={styles.input} 
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="videoUrl">Video URL (Optional YouTube Embed)</label>
          <input 
            id="videoUrl" 
            name="videoUrl" 
            type="url" 
            defaultValue={article?.videoUrl || ''} 
            placeholder="https://www.youtube.com/embed/..." 
            className={styles.input} 
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Guide Content (Markdown)</label>
          <MarkdownEditor name="content" initialValue={article?.content || ''} />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" name="published" defaultChecked={article?.published} />
            Publish immediately?
          </label>
        </div>

        <div className={styles.actions}>
          <Link href="/admin/kb" className="btn btn-secondary">Cancel</Link>
          <button type="submit" className="btn btn-primary">{article ? 'Save Changes' : 'Create Guide'}</button>
        </div>
      </div>
    </form>
  );
}