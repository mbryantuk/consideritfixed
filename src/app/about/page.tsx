import Link from 'next/link';
import Image from 'next/image';
import styles from './about.module.css';
import Header from '@/components/Header';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Metadata } from 'next';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getSetting, getAllSettings } from '@/lib/settings';
import { renderMarkdown } from '@/lib/utils';

export const metadata: Metadata = {
  title: "About Our Expert | Consider IT Fixed | Friendly Tech Support in Felpham",
  description: "Learn more about the technical expertise behind Consider IT Fixed. Over 15 years of professional experience in jargon-free tech support and technical management.",
};

export default async function About() {
  const settings = await getAllSettings();
  const businessName = settings.siteName || "Consider IT Fixed";
  const aboutMarkdown = settings.aboutContent || "";
  const aboutPicture = settings.aboutPicture || "/images/matt-portrait.webp";
  const aboutHeroImage = settings.aboutHeroImage || "/images/felpham-seafront.webp";

  return (
    <div className={styles.container}>
      <Header />

      <main id="main-content" className={styles.main}>
        <div className={styles.topContent}>
          <Breadcrumbs items={[{ label: `About ${businessName}` }]} />
        </div>

        <section 
          className={styles.hero}
          style={{ '--hero-bg': `url('${aboutHeroImage}')` } as React.CSSProperties}
        >
          <div className={styles.heroContent}>
            <div className={styles.profileImage}>
              <Image 
                src={aboutPicture} 
                alt="Your Local Tech Helper" 
                width={150} 
                height={150} 
                className={styles.portrait}
                unoptimized={aboutPicture.startsWith('/api/')}
                priority
              />
            </div>
            <h1>{settings.aboutTitle || "Hi, I'm Matt"}</h1>
            <p>{settings.aboutSubtitle || "Your friendly, local tech expert in Felpham and Bognor Regis."}</p>
          </div>
        </section>



        <section className={styles.contentSection}>
          <div className={styles.textContent}>
            {aboutMarkdown ? (
              <div className={styles.dynamicContent} dangerouslySetInnerHTML={renderMarkdown(aboutMarkdown)} />
            ) : (
              <>
                <h2>My Journey to <span className="notranslate">{businessName}</span></h2>
                <p>
                  I&apos;ve spent over 20 years navigating the ever-evolving world of technology. My career began in technical support within the scientific sector, where I first discovered my passion for solving complex infrastructure problems and working with data systems.
                </p>
                <p>
                  For over 15 years, I specialised in technical consultancy, transitioning from a Senior Engineer to a Technical Consultant and eventually a Product Manager. During that time, I managed large-scale technical implementations for major global brands, helping them bridge the gap between their business needs and technical solutions.
                </p>
                <p>
                  Today, I serve as a <strong>Solutions Architect</strong>, designing cloud-based communication systems that drive efficiency and growth. This high-level experience in solution design and technical strategy is exactly what I bring to my local community here in Bognor Regis.
                </p>
                
                <div className={styles.imageSection}>
                  <Image 
                    src="/images/felpham-seafront.webp" 
                    alt="The beautiful Felpham seafront." 
                    width={800} 
                    height={400} 
                    className={styles.seafrontImage}
                  />
                  <p className={styles.imageCaption}>Proudly serving my neighbours in the local West Sussex community.</p>
                </div>

                <h2>Local Expertise, Professional Precision</h2>
                <p>
                  <strong><span className="notranslate">{businessName}</span></strong> was established because I realized that while I spend my days solving enterprise-level technical challenges, many of my neighbors in <strong>Felpham and Bognor Regis</strong> just need a reliable, patient person to help with their home tech.
                </p>
                <p>
                  Whether you&apos;re struggling with a slow PC, a Wi-Fi dead zone, or need advice on moving your data safely to the cloud, you&apos;re getting help from someone who understands technology from the ground up—from the hardware on your desk to the complex systems that run the internet.
                </p>
                <p>
                  I pride myself on providing a face-to-face service that is jargon-free, honest, and rooted in two decades of professional experience. You can view my full professional history and connect with me on <a href="https://www.linkedin.com/in/matthew-bryant-3407061b/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>LinkedIn</a>.
                </p>
              </>
            )}

            {!aboutMarkdown && (
              <div className={styles.contactCard} style={{ marginTop: '3rem' }}>
                <h3>Ready to get started?</h3>
                <p>Whether you need an urgent fix or just want to learn how to use your new iPad, I&apos;m here for you.</p>
                <Link href="/contact" className="btn btn-primary">Book a Session</Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>&copy; {new Date().getFullYear()} <span className="notranslate">{businessName}</span>. Serving Felpham & Bognor Regis.</p>
          <nav className={styles.footerLinks} aria-label="Footer Navigation">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/portal">Customer Login</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}