'use client';

import { useState, useRef } from 'react';
import styles from './files.module.css';
import { uploadFile } from '@/app/actions/files';
import { Upload, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function FileUploadForm() {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('uploading');
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);
    const result = await uploadFile(formData);

    if (result.success) {
      setStatus('success');
      formRef.current?.reset();
      setTimeout(() => setStatus('idle'), 3000);
    } else {
      setStatus('error');
      setErrorMessage(result.error || 'Upload failed.');
    }
  };

  return (
    <div className={styles.formCard}>
      <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.dropZone}>
          <Upload size={32} className={styles.uploadIcon} />
          <p>Click to select or drag and drop a file</p>
          <span className={styles.fileHint}>Images, PDFs, or Word docs (max 5MB)</span>
          <input 
            type="file" 
            name="file" 
            required 
            className={styles.fileInput} 
            onChange={(e) => {
              if (e.target.files?.length) {
                // Submit automatically or show selection? Let's just let them click Upload
              }
            }}
          />
        </div>
        
        {status === 'error' && (
          <div className={styles.errorAlert}>
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {status === 'success' && (
          <div className={styles.successAlert}>
            <CheckCircle size={18} />
            <span>File uploaded successfully!</span>
          </div>
        )}

        <button type="submit" className="btn btn-primary" disabled={status === 'uploading'}>
          {status === 'uploading' ? (
            <><Loader2 className={styles.spin} size={18} /> Uploading...</>
          ) : 'Upload Securely'}
        </button>
      </form>
    </div>
  );
}
