'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import styles from '../../portal.module.css';
import Header from '@/components/Header';

function MockPaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const invoiceId = searchParams.get('invoiceId');
  const amount = searchParams.get('amount');
  const [processing, setProcessing] = useState(false);

  const handlePay = async () => {
    setProcessing(true);
    // Simulate payment processing
    setTimeout(async () => {
      // In a real app, this would be handled via Stripe Webhook.
      // Here we'll just call a mock success endpoint.
      try {
        const res = await fetch('/api/payments/mock-success', {
          method: 'POST',
          body: JSON.stringify({ invoiceId })
        });
        if (res.ok) {
          router.push('/portal?payment=success');
        } else {
          alert("Payment failed");
          setProcessing(false);
        }
      } catch (e) {
        console.error(e);
        setProcessing(false);
      }
    }, 2000);
  };

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.card} style={{ maxWidth: '500px', margin: '40px auto', textAlign: 'center' }}>
          <h2>💳 Mock Stripe Checkout</h2>
          <p>This is a simulated payment gateway for testing.</p>
          <div style={{ margin: '30px 0', padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '2px solid #e2e8f0' }}>
            <p style={{ fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'bold' }}>Amount to Pay</p>
            <p style={{ fontSize: '3rem', fontWeight: '800', color: '#0f172a' }}>£{amount}</p>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Invoice ID: {invoiceId}</p>
          </div>
          
          <button 
            onClick={handlePay} 
            disabled={processing}
            className="btn btn-primary"
            style={{ width: '100%', padding: '15px', fontSize: '1.1rem' }}
          >
            {processing ? 'Processing Payment...' : `Pay £${amount} Now`}
          </button>
          
          <p style={{ marginTop: '20px', fontSize: '0.85rem', color: '#94a3b8' }}>
            In a production environment, this would be the secure Stripe.com checkout page.
          </p>
        </div>
      </main>
    </div>
  );
}

export default function MockPaymentPage() {
  return (
    <Suspense fallback={<div>Loading payment...</div>}>
      <MockPaymentContent />
    </Suspense>
  );
}
