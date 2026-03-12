import Header from '@/components/Header';
import styles from '../legal.module.css';

export const metadata = {
  title: "Privacy Policy | Consider IT Fixed",
};

export default function PrivacyPolicy() {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.content}>
          <h1>Privacy Policy</h1>
          <p>Last Updated: {new Date().toLocaleDateString('en-GB')}</p>
          
          <section>
            <h2>1. Introduction</h2>
            <p><strong>Consider IT Fixed</strong> (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting the privacy and security of your personal data. This policy explains how we collect, use, and safeguard your personal information in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.</p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>
            <p>We may collect and process the following data about you:</p>
            <ul>
              <li><strong>Contact Information:</strong> Name, email address, telephone number, and postal address.</li>
              <li><strong>Personal Details:</strong> Date of birth (to verify eligibility for age-related discounts).</li>
              <li><strong>Technical Data:</strong> Information about the devices you own and the technical issues you report.</li>
              <li><strong>Account Data:</strong> Login information (Magic Link requests) and profile preferences.</li>
              <li><strong>Marketing Data:</strong> Your preferences in receiving marketing from us and your communication preferences.</li>
            </ul>
          </section>

          <section>
            <h2>3. How We Use Your Information</h2>
            <p>We use your information based on the following legal grounds:</p>
            <ul>
              <li><strong>Contractual Necessity:</strong> To provide the tech support services you request, manage your account, and process quotes and invoices.</li>
              <li><strong>Legitimate Interests:</strong> To improve our services, respond to enquiries, and ensure the security of our website.</li>
              <li><strong>Consent:</strong> To send you marketing communications where you have explicitly opted in.</li>
              <li><strong>Legal Obligation:</strong> To comply with tax and accounting regulations.</li>
            </ul>
          </section>

          <section>
            <h2>4. Cookies & Tracking</h2>
            <p>We use a minimal number of &quot;Cookies&quot; (small text files stored on your device) to make our website work effectively:</p>
            <ul>
              <li><strong>Essential Cookies:</strong> These are required for the website to function, such as keeping you logged in during your session. They do not track your personal behavior across other sites.</li>
              <li><strong>Preference Cookies:</strong> These remember your choices, such as your &apos;Dark Mode&apos; preference or language selection.</li>
              <li><strong>No Third-Party Tracking:</strong> We do not use invasive third-party tracking cookies (like those from Facebook or Google Analytics) on our public site without your explicit consent.</li>
            </ul>
            <p>You can choose to disable cookies in your browser settings, but please note that some parts of our website (like the User Portal) may not function correctly without them.</p>
          </section>

          <section>
            <h2>5. Data Storage and Retention</h2>
            <p>Your data is stored securely within the United Kingdom or the European Economic Area (EEA). We retain your personal data only for as long as necessary to fulfil the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements (typically 7 years for financial records).</p>
          </section>

          <section>
            <h2>6. Your Rights</h2>
            <p>Under UK GDPR, you have the following rights:</p>
            <ul>
              <li><strong>The right to access:</strong> You can request a copy of the personal data we hold about you.</li>
              <li><strong>The right to rectification:</strong> You can ask us to correct inaccurate information.</li>
              <li><strong>The right to erasure:</strong> You can ask us to delete your data (subject to legal retention requirements).</li>
              <li><strong>The right to withdraw consent:</strong> You can opt-out of marketing at any time via your profile.</li>
            </ul>
            <p>To exercise any of these rights, please contact us at <strong>privacy@consideritfixed.uk</strong>.</p>
          </section>

          <section>
            <h2>7. Complaints</h2>
            <p>If you have any concerns about our use of your personal data, you can make a complaint to us directly. You also have the right to complain to the Information Commissioner&apos;s Office (ICO) at <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">www.ico.org.uk</a>.</p>
          </section>
        </div>
      </main>
    </div>
  );
}