'use client';

import { useEffect, useState } from "react";
import styles from "../invoice/invoice-print.module.css";
import Link from "next/link";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function QuotePrint({ params }: { params: any }) {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const secret = searchParams.get('secret');
    const id = params.id;
    const url = `/api/requests/${id}/quote${secret ? `?secret=${secret}` : ''}`;
    fetch(url)
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) return <div className={styles.loading}>Loading quote...</div>;
  if (!data || !data.quote) return <div className={styles.error}>Quote not found or unauthorized.</div>;

  const { request, quote, user } = data;

  return (
    <div className={styles.printContainer}>
      <div className={styles.noPrint}>
        <Link href={`/portal/requests/${request.id}`} className={styles.backLink}>← Back to Request</Link>
      </div>

      <div className={styles.invoicePage}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <h1>Consider IT Fixed</h1>
            <p>Friendly, Local Tech Support</p>
          </div>
          <div className={styles.invoiceMeta}>
            <h2 style={{ color: '#3730A3' }}>QUOTE</h2>
            <p><strong>Quote #:</strong> {request.friendlyId}-{quote.id.substring(0, 4).toUpperCase()}</p>
            <p><strong>Date:</strong> {new Date(quote.createdAt).toLocaleDateString('en-GB')}</p>
            {quote.expiresAt && (
              <p><strong>Valid Until:</strong> {new Date(quote.expiresAt).toLocaleDateString('en-GB')}</p>
            )}
          </div>
        </div>

        <div className={styles.addressGrid}>
          <div className={styles.from}>
            <h3>Service Provider:</h3>
            <p><strong>Consider IT Fixed</strong></p>
            <p>Felpham, Bognor Regis</p>
            <p>West Sussex, PO22</p>
            <p>United Kingdom</p>
          </div>
          <div className={styles.to}>
            <h3>Quote For:</h3>
            <p><strong>{user.name}</strong></p>
            <p>{user.address}</p>
            <p>{user.phone}</p>
          </div>
        </div>

        <div className={styles.billTable}>
          <table>
            <thead>
              <tr>
                <th>Proposed Work & Details</th>
                <th className={styles.amountCol}>Estimated Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>{request.title}</strong>
                  <p className={styles.descText}>{quote.details}</p>
                </td>
                <td className={styles.amountCol}>£{quote.amount.toFixed(2)}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td><strong>Estimated Total</strong></td>
                <td className={styles.amountCol}><strong>£{quote.amount.toFixed(2)}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className={styles.paymentInfo}>
          <h3>Terms & Conditions</h3>
          <p style={{ fontSize: '0.9rem' }}>• This quote is valid until the date shown above.</p>
          <p style={{ fontSize: '0.9rem' }}>• Work will only commence once this quote is accepted via your online portal.</p>
          <p style={{ fontSize: '0.9rem' }}>• Final invoice will be issued upon completion of the work.</p>
          <p style={{ fontSize: '0.9rem' }}>• No Fix, No Fee: If we cannot resolve the issue, you won&apos;t be charged for labour.</p>
        </div>

        <div className={styles.footer}>
          <p>Thank you for considering Consider IT Fixed!</p>
          <p>Reliable. Local. Jargon-Free.</p>
        </div>
      </div>

      <div className={styles.printAction}>
        <button onClick={() => window.print()} className="btn btn-primary">Print this Quote</button>
      </div>
    </div>
  );
}