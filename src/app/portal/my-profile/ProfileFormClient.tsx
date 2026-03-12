'use client';

import { useState } from 'react';
import styles from './profile-edit.module.css';
import Link from 'next/link';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProfileFormClient({ user, updateProfileAction }: { user: any, updateProfileAction: (formData: FormData) => Promise<void> }) {
  const [address, setAddress] = useState(user.address || '');
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState('');

  const lookupPostcode = async () => {
    // Get the last line or the whole thing as a postcode candidate
    const lines = address.split('\n');
    const postcode = lines[lines.length - 1]?.trim() || address.trim();
    
    if (!postcode) {
      setLookupError('Please enter a postcode in the address field.');
      return;
    }

    setIsLookingUp(true);
    setLookupError('');

    try {
      const res = await fetch(`https://api.postcodes.io/postcodes/${postcode}`);
      const data = await res.json();

      if (data.status === 200) {
        const { result } = data;
        const newAddress = `${result.parish || result.admin_ward || ''}, ${result.admin_district}, ${result.postcode}`;
        setAddress(newAddress);
      } else {
        setLookupError('Postcode not found. Please enter full address manually.');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setLookupError('Error looking up postcode.');
    } finally {
      setIsLookingUp(false);
    }
  };

  return (
    <form action={updateProfileAction} className={styles.form}>
      <div className={styles.inputGroup}>
        <label htmlFor="name">Full Name</label>
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={user.name || ''}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="phone">Phone Number</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={user.phone || ''}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.inputGroup}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <label htmlFor="address" style={{ marginBottom: 0 }}>Full Address (inc. Postcode)</label>
          <button 
            type="button" 
            onClick={lookupPostcode} 
            className={styles.lookupBtn}
            disabled={isLookingUp}
          >
            {isLookingUp ? 'Searching...' : 'Lookup Postcode'}
          </button>
        </div>
        <textarea
          id="address"
          name="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className={styles.textarea}
          rows={3}
          placeholder="e.g. 12 High Street, PO22 7EE"
        />
        {lookupError && <p className={styles.lookupError}>{lookupError}</p>}
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="dob">Date of Birth (Optional - for age discounts)</label>
        <input
          id="dob"
          name="dob"
          type="date"
          defaultValue={user.dob || ''}
          className={styles.input}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="preferredContactMethod">Preferred Contact Method</label>
        <select 
          id="preferredContactMethod" 
          name="preferredContactMethod" 
          className={styles.input}
          defaultValue={user.preferredContactMethod || 'Email'}
        >
          <option value="Email">Email</option>
          <option value="Phone">Phone Call</option>
          <option value="WhatsApp">WhatsApp</option>
        </select>
      </div>

      <fieldset className={styles.fieldset}>
        <legend>Devices You Use</legend>
        <div className={styles.checkboxGrid}>
          {['Windows PC', 'Mac', 'iPhone', 'Android Phone', 'iPad/Tablet', 'Smart TV', 'Printer'].map((device) => (
            <label key={device} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="deviceTypes"
                value={device}
                defaultChecked={user.deviceTypes?.includes(device)}
              />
              <span className={styles.checkboxText}>{device}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            name="marketingConsent"
            type="checkbox"
            defaultChecked={user.marketingConsent}
          />
          <span className={styles.checkboxText}>I would like to receive local tech alerts and tips (we never spam).</span>
        </label>
      </div>

      <div className={styles.actions}>
        <Link href="/portal" className="btn btn-secondary">Cancel</Link>
        <button type="submit" className="btn btn-primary">Save Profile Changes</button>
      </div>
    </form>
  );
}