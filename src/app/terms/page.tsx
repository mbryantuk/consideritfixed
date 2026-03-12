import Header from '@/components/Header';
import styles from '../legal.module.css';

export const metadata = {
  title: "Terms of Service | Consider IT Fixed",
};

export default function TermsOfService() {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.content}>
          <h1>Terms of Service</h1>
          <p>Last Updated: {new Date().toLocaleDateString('en-GB')}</p>
          
          <section>
            <h2>1. Our Contract With You</h2>
            <p>These terms and conditions (&quot;Terms&quot;) apply to all services provided by <strong>Consider IT Fixed</strong> (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) to you, the customer. By booking a session, accepting a quote, or using our website, you agree to be bound by these Terms.</p>
          </section>

          <section>
            <h2>2. The &quot;No Fix, No Fee&quot; Promise</h2>
            <p>Our &quot;No Fix, No Fee&quot; policy applies to the diagnosis and attempted repair of a specific, single technical issue. If we are unable to diagnose the problem or offer a viable solution/workaround, you will not be charged for labour.</p>
            <p><strong>Exclusions:</strong> The promise does not apply if we provide a diagnosis and you choose not to proceed with the recommended fix (e.g., if a part is required that you do not wish to purchase). In such cases, a minimum diagnostic fee of £20 may apply to cover travel and time.</p>
          </section>

          <section>
            <h2>3. Your Responsibilities (Data Backup)</h2>
            <p><strong>IT IS YOUR RESPONSIBILITY TO BACK UP YOUR DATA.</strong> While we take every reasonable precaution to protect your files, technology is inherently unpredictable. We cannot be held responsible for any data loss, corruption, or hardware failure that occurs during or after our support sessions.</p>
            <p>If you have not backed up your data, please inform us <strong>before</strong> work begins, and we can assist you in setting up a backup for an additional fee.</p>
          </section>

          <section>
            <h2>4. Limitation of Liability (UK Law)</h2>
            <p>To the maximum extent permitted by English law:</p>
            <ul>
              <li>Our total liability to you in respect of all losses arising under or in connection with our services, whether in contract, tort (including negligence), or otherwise, shall in no circumstances exceed the total amount paid by you for the specific service session in question.</li>
              <li>We shall not be liable for any indirect or consequential loss, including but not limited to loss of profits, loss of business, or loss of data.</li>
              <li>Nothing in these Terms limits our liability for death or personal injury caused by our negligence or for fraud.</li>
            </ul>
          </section>

          <section>
            <h2>5. Quotes, Pricing, and Payment</h2>
            <ul>
              <li><strong>Quotes:</strong> All quotes are valid for 14 days from the date of issue.</li>
              <li><strong>Payment:</strong> Payment is due immediately upon completion of the work and receipt of an invoice. We accept Bank Transfer, Cash, and major Credit/Debit cards (where available).</li>
              <li><strong>Late Payment:</strong> We reserve the right to charge interest on late payments at the rate of 4% above the Bank of England base rate.</li>
            </ul>
          </section>

          <section>
            <h2>6. Right to Refuse Service</h2>
            <p>We reserve the right to refuse or terminate service if we encounter illegal content, unsafe working conditions, or if the customer is abusive or uncooperative.</p>
          </section>

          <section>
            <h2>7. Governing Law</h2>
            <p>These Terms are governed by the laws of England and Wales, and any disputes will be subject to the exclusive jurisdiction of the English courts.</p>
          </section>
        </div>
      </main>
    </div>
  );
}