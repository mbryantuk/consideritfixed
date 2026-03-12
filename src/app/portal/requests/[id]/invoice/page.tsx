'use client';

import { useEffect, useState } from "react";
import styles from "./invoice-print.module.css";
import Link from "next/link";
import Image from "next/image";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function InvoicePrint({ params }: { params: any }) {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We'll fetch the data from an API route to keep it simple for this client component
    const searchParams = new URLSearchParams(window.location.search);
    const secret = searchParams.get('secret');
    const id = params.id;
    const url = `/api/requests/${id}/invoice${secret ? `?secret=${secret}` : ''}`;
    fetch(url)
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) return <div className={styles.loading}>Loading invoice...</div>;
  if (!data || !data.invoice) return <div className={styles.error}>Invoice not found or unauthorized.</div>;

  const { request, invoice, user } = data;

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
            <h2>INVOICE</h2>
            <p><strong>Invoice #:</strong> {invoice.id.substring(0, 8).toUpperCase()}</p>
            <p><strong>Date:</strong> {new Date(invoice.createdAt).toLocaleDateString('en-GB')}</p>
            <p><strong>Status:</strong> {invoice.status}</p>
          </div>
        </div>

        <div className={styles.addressGrid}>
          <div className={styles.from}>
            <h3>From:</h3>
            <p><strong>Consider IT Fixed</strong></p>
            <p>Felpham, Bognor Regis</p>
            <p>West Sussex, PO22</p>
            <p>United Kingdom</p>
          </div>
          <div className={styles.to}>
            <h3>To:</h3>
            <p><strong>{user.name}</strong></p>
            <p>{user.address}</p>
            <p>{user.phone}</p>
          </div>
        </div>

        <div className={styles.billTable}>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th className={styles.amountCol}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>{request.title}</strong>
                  <p className={styles.descText}>{request.description}</p>
                </td>
                <td className={styles.amountCol}>£{invoice.amount.toFixed(2)}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td><strong>Total Due</strong></td>
                <td className={styles.amountCol}><strong>£{invoice.amount.toFixed(2)}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className={styles.paymentInfo}>
          <h3>Payment Instructions</h3>
          <div className={styles.paymentFlex}>
            <div className={styles.bankDetails}>
              <p>Please pay via Bank Transfer or Cash.</p>
              <p><strong>Bank:</strong> Starling Bank</p>
              <p><strong>Name:</strong> Consider IT Fixed</p>
              <p><strong>Sort Code:</strong> 60-00-00</p>
              <p><strong>Account:</strong> 12345678</p>
              <p><strong>Reference:</strong> {request.friendlyId}</p>
            </div>
            <div className={styles.qrCode}>
              <Image
                src={`https://chart.googleapis.com/chart?chs=120x120&cht=qr&chl=${encodeURIComponent(`Bank Transfer: Consider IT Fixed, Sort: 60-00-00, Acc: 12345678, Ref: ${request.friendlyId}`)}&choe=UTF-8`}
                alt="Payment QR Code"
                width={120}
                height={120}
              />
              <p className={styles.qrLabel}>Scan to pay via mobile banking</p>
            </div>          </div>
        </div>

        <div className={styles.footer}>
          <p>Thank you for choosing Consider IT Fixed!</p>
          <p>No Jargon. No Hidden Fees. Just Simple Help.</p>
        </div>
      </div>

      <div className={styles.printAction}>
        <button onClick={() => window.print()} className="btn btn-primary">Print this Invoice</button>
      </div>
    </div>
  );
}