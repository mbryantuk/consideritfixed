'use client';

import { useState } from 'react';
import styles from './new-request.module.css';
import FormDirtyWarning from '@/components/FormDirtyWarning';

export default function NewRequestForm({ createRequestAction }: { createRequestAction: (formData: FormData) => Promise<void> }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [availability, setAvailability] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDirty = title.length > 0 || description.length > 0 || availability.length > 0 || referralCode.length > 0;

  return (
    <>
      <FormDirtyWarning isDirty={isDirty && !isSubmitting} />
      <form action={createRequestAction} onSubmit={() => setIsSubmitting(true)} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="title">Brief Summary of the Issue</label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="e.g., Laptop running very slow"
            required
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label htmlFor="description">Details</label>
          <textarea
            id="description"
            name="description"
            rows={6}
            placeholder="Tell us a bit more about what is happening, what type of device it is, etc."
            required
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={1000}
          />
          <div className={styles.charCount}>
            {description.length} / 1000 characters
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="availability">Your Availability</label>
          <input
            id="availability"
            name="availability"
            type="text"
            placeholder="e.g., Evenings after 6pm, or Wednesday afternoons"
            className={styles.input}
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          />
          <small className={styles.helpText}>When is the best time for us to call or visit you?</small>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="referralCode">How did you hear about us? (Optional)</label>
          <input
            id="referralCode"
            name="referralCode"
            type="text"
            placeholder="e.g., Nextdoor, Facebook, a friend..."
            className={styles.input}
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="attachmentFile">Upload a Photo (Optional)</label>
          <input
            id="attachmentFile"
            name="attachmentFile"
            type="file"
            accept="image/*,.pdf"
            className={styles.input}
          />
          <small className={styles.helpText}>Useful for showing broken screens or error messages.</small>
        </div>

        <button type="submit" className={`btn-primary ${styles.submitButton}`} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </>
  );
}