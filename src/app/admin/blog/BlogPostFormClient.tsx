'use client';

import { useState } from 'react';
import styles from './blog-admin.module.css';
import Link from 'next/link';

export default function BlogPostFormClient({ 
  post, 
  action 
}: { 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  post?: any, 
  action: (formData: FormData) => Promise<void> 
}) {
  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');

  const generateSlug = (val: string) => {
    setTitle(val);
    if (!post) { // Only auto-generate slug for new posts
      setSlug(val.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
    }
  };

  return (
    <form action={action} className={styles.form}>
      {post && <input type="hidden" name="id" value={post.id} />}
      <div className={styles.card}>
        <div className={styles.inputGroup}>
          <label htmlFor="title">Post Title</label>
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
          <select id="category" name="category" defaultValue={post?.category || "SCAM_ALERT"} className={styles.input}>
            <option value="SCAM_ALERT">Scam Alert</option>
            <option value="TECH_TIP">Tech Tip</option>
            <option value="LOCAL_NEWS">Local News</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="excerpt">Excerpt (Short Summary)</label>
          <textarea id="excerpt" name="excerpt" defaultValue={post?.excerpt || ''} rows={2} className={styles.textarea} />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="content">Content (Supports multiple lines)</label>
          <textarea id="content" name="content" defaultValue={post?.content || ''} rows={12} required className={styles.textarea} />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" name="published" defaultChecked={post?.published} />
            Publish immediately?
          </label>
        </div>

        <div className={styles.actions}>
          <Link href="/admin/blog" className="btn btn-secondary">Cancel</Link>
          <button type="submit" className="btn btn-primary">{post ? 'Save Changes' : 'Create Post'}</button>
        </div>
      </div>
    </form>
  );
}