'use client';

import { useState } from 'react';
import styles from './MarkdownEditor.module.css';

export default function MarkdownEditor({ 
  name, 
  initialValue = "", 
  placeholder = "Write your content in Markdown..." 
}: { 
  name: string, 
  initialValue?: string, 
  placeholder?: string 
}) {
  const [value, setValue] = useState(initialValue);
  const [mode, setMode] = useState<'write' | 'preview'>('write');

  // Basic Markdown Parser (Client Side Only)
  const renderSimpleMarkdown = (md: string) => {
    const html = md
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' style='max-width:100%; border-radius:8px;' />")
      .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2' target='_blank' style='color:var(--secondary-hover)'>$1</a>")
      .replace(/\n/gim, '<br />');
    
    return { __html: html };
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button 
          type="button" 
          className={`${styles.tab} ${mode === 'write' ? styles.active : ''}`}
          onClick={() => setMode('write')}
        >
          Write
        </button>
        <button 
          type="button" 
          className={`${styles.tab} ${mode === 'preview' ? styles.active : ''}`}
          onClick={() => setMode('preview')}
        >
          Preview
        </button>
      </div>

      <div className={styles.editorArea}>
        {mode === 'write' ? (
          <textarea
            name={name}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={styles.textarea}
            placeholder={placeholder}
            rows={15}
          />
        ) : (
          <>
            <div 
              className={styles.preview} 
              dangerouslySetInnerHTML={renderSimpleMarkdown(value)} 
            />
            {/* Hidden input to ensure value is still sent in form action */}
            <input type="hidden" name={name} value={value} />
          </>
        )}
      </div>
      <div className={styles.helpText}>
        Basic Markdown supported: # H1, ## H2, **Bold**, *Italic*, [Link](url), ![Image](url)
      </div>
    </div>
  );
}