'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import Header from '@/components/Header';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Screen Share Error:', error);
  }, [error]);

  return (
    <>
      <Header />
      <div style={{ 
        minHeight: 'calc(100vh - 80px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: 'var(--bg-secondary)'
      }}>
        <div style={{ 
          maxWidth: '500px', 
          backgroundColor: 'var(--bg-main)', 
          padding: '3rem 2rem', 
          borderRadius: '16px',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-light)'
        }}>
          <AlertTriangle size={64} style={{ color: 'var(--accent)', marginBottom: '1.5rem' }} />
          <h1 style={{ marginBottom: '1rem' }}>Support Session Error</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>
            We encountered a problem with the secure connection engine. This can sometimes happen due to temporary network issues or firewall restrictions.
          </p>
          
          <button
            onClick={() => reset()}
            className="btn btn-primary"
            style={{ width: '100%', gap: '10px' }}
          >
            <RefreshCcw size={20} />
            Restart Connection Engine
          </button>

          <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Error details: {error.message || 'Unknown connection failure'}
          </p>
        </div>
      </div>
    </>
  );
}