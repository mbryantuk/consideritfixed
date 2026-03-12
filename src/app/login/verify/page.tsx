import Image from "next/image";
import Link from "next/link";
import styles from "../login.module.css";

export default function VerifyRequest() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.loginCard}>
          <div className={styles.logo}>
            <Link href="/">
              <Image src="/logo.svg" alt="Consider IT Fixed Logo" width={64} height={64} style={{ marginBottom: '0.5rem' }} />
              <br />
              <span className="notranslate">Consider IT Fixed</span>
            </Link>
          </div>
          <h1>Check Your Email</h1>
          <p className={styles.description}>
            A secure sign-in link has been sent to your email address. 
          </p>
          <p className={styles.description}>
            Please check your inbox (and your spam folder, just in case) and click the link to securely access your portal.
          </p>
          
          <div className={styles.verifyActions}>
            <Link href="/login" className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>
              Didn&apos;t get the link? Click here to try again
            </Link>
            <Link href="/" className={styles.backLink}>
              Return to Home Page
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}