import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import Header from '@/components/Header';
import Testimonials from '@/components/Testimonials';
import PostcodeChecker from '@/components/PostcodeChecker';
import D3ServiceMap from '@/components/D3ServiceMap';
import NoFixNoFeeBadge from '@/components/NoFixNoFeeBadge';
import HealthCheckQuiz from '@/components/HealthCheckQuiz';
import NewsletterForm from '@/components/NewsletterForm';
import EventCard from '@/components/EventCard';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { getAllSettings } from '@/lib/settings';

export async function generateMetadata() {
  const settings = await getAllSettings();
  return {
    title: settings.metaTitle || 'Consider IT Fixed | Friendly, Local Tech Support in Felpham & Bognor Regis',
    description: settings.metaDescription || 'Reliable, jargon-free tech support, device setup, and home networking assistance in Felpham and Bognor Regis. No fix, no fee.',
  };
}

export default async function Home() {
  const settings = await getAllSettings();
  const services = await prisma.service.findMany({
    where: { featured: true },
    orderBy: { order: 'asc' }
  });
  
  const events = await prisma.calendarEvent.findMany({
    where: { published: true, eventDate: { gte: new Date() } },
    orderBy: { eventDate: 'asc' },
    take: 3
  });

  const businessName = settings.siteName || "Consider IT Fixed";
  const tagline = settings.siteTagline || "Expert Local Tech Support Without the Jargon";
  const displayPhone = settings.phoneNumber || "07419 738500";
  const telPhone = settings.phoneTel || "07419738500";

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': businessName,
    'description': 'Friendly, jargon-free tech support, device setup, and home networking assistance in Felpham and Bognor Regis.',
    'image': 'https://consideritfixed.uk/logo.png',
    '@id': 'https://consideritfixed.uk',
    'url': 'https://consideritfixed.uk',
    'telephone': `+${settings.whatsappNumber || "447419738500"}`,
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Felpham',
      'addressLocality': 'Bognor Regis',
      'addressRegion': 'West Sussex',
      'postalCode': 'PO22',
      'addressCountry': 'GB'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 50.7936,
      'longitude': -0.6552
    },
    'openingHoursSpecification': [
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        'opens': '09:00',
        'closes': '18:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': 'Saturday',
        'opens': '10:00',
        'closes': '14:00'
      }
    ],
    'sameAs': [
      settings.nextdoorUrl || 'https://nextdoor.co.uk/pages/consideritfixed-felpham',
      settings.facebookUrl || 'https://facebook.com/consideritfixed',
      settings.linkedinUrl || 'https://www.linkedin.com/in/matthew-bryant-3407061b/'
    ],
    'priceRange': '££',
    'areaServed': ['Felpham', 'Bognor Regis', 'Aldwick', 'Middleton-on-Sea', 'Elmer']
  };

  const latestScamAlert = await prisma.blogPost.findFirst({
    where: { category: 'SCAM_ALERT', published: true },
    orderBy: { createdAt: 'desc' }
  });

  const homeHeroImage = settings.homeHeroImage || '/images/hero-tech.webp';

  return (
    <div className={styles.container}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {latestScamAlert && (
        <div className={styles.scamBanner}>
          <div className={styles.scamContent}>
            <span className={styles.scamIcon}>⚠️</span>
            <div className={styles.scamText}>
              <strong>LOCAL SCAM ALERT:</strong> {latestScamAlert.title}
            </div>
            <Link href={`/blog/${latestScamAlert.slug}`} className={styles.scamLink}>
              Learn How to Stay Safe →
            </Link>
          </div>
        </div>
      )}
      <Header />

      <main id="main-content" className={styles.main}>
        <section 
          className={styles.hero}
          style={{ '--hero-bg': `url('${homeHeroImage}')` } as React.CSSProperties}
        >
          <div className={styles.heroContent}>
            <span className={styles.badge}>Based in Felpham, West Sussex</span>
            <h1>{businessName} <span>{tagline.includes('Without the Jargon') ? 'Without the Jargon' : ''}</span></h1>
            {!tagline.includes('Without the Jargon') && <p>{tagline}</p>}
            {tagline.includes('Without the Jargon') && (
              <p>
                Struggling with your computer, Wi-Fi, or smart devices? I provide reliable, expert assistance right to your door. No confusing terms, no hidden fees—we just consider it fixed.
              </p>
            )}
            <div className={styles.heroContactRow}>
              <a href={`tel:${telPhone}`} className={styles.heroPhone}>
                <span className={styles.heroPhoneLabel}>Call for expert help:</span>
                <span className={styles.heroPhoneNumber}>{displayPhone}</span>
              </a>
            </div>
            <div className={styles.jargonSealHero}>
              <span className={styles.sealIcon} aria-hidden="true">🛡️</span>
              <strong>Guaranteed Jargon-Free:</strong> We explain tech in plain English, always.
            </div>
            <div className={styles.heroActions}>
              <Link href="/contact" className="btn btn-primary">Get Expert Help</Link>
              <Link href="/pricing" className="btn btn-outline">View Pricing</Link>
            </div>
            <NoFixNoFeeBadge />
            <div className={styles.trustBadges}>
              <span className={styles.badgeItem}>✓ No Fix, No Fee</span>
              
              <span className={styles.badgeItem}>✓ 15+ Years Experience</span>
            </div>
          </div>
        </section>

        <section className={styles.howItWorks}>
          <div className={styles.sectionHeader}>
            <h2>Simple Help in 3 Easy Steps</h2>
            <p>Getting your technology sorted shouldn&apos;t be stressful.</p>
          </div>
          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <div className={styles.stepImageWrapper}>
                <Image src="/images/step1.svg" alt="Book a slot illustration" width={180} height={180} loading="lazy" />
              </div>
              <h3>Book a Slot</h3>
              <p>Call or request help online. We&apos;ll pick a time that works for you.</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepImageWrapper}>
                <Image src="/images/step2.svg" alt="Free diagnosis illustration" width={180} height={180} loading="lazy" />
              </div>
              <h3>Free Diagnosis</h3>
              <p>We visit your home, identify the problem, and explain it in plain English.</p>
            </div>
            <div className={styles.stepCard}>
              <div className={styles.stepImageWrapper}>
                <Image src="/images/step3.svg" alt="Fixed and friendly illustration" width={180} height={180} loading="lazy" />
              </div>
              <h3>Fixed & Friendly</h3>
              <p>Your tech is fixed, and we&apos;ll show you how to keep it working smoothly.</p>
            </div>
          </div>
        </section>




        <section className={styles.trustSection}>
          <h2>Why Choose <span className="notranslate">{businessName}</span>?</h2>
          <div className={styles.trustGrid}>
            <div className={styles.trustItem}>
              <div className={styles.iconWrapper}>
                <svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h4>No Fix, No Fee</h4>
              <p>If we cannot diagnose or fix your problem, you won&apos;t pay a single penny.</p>
            </div>
            <div className={styles.trustItem}>
              <div className={styles.iconWrapper}>
                <svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <h4>Capped Rates</h4>
              <p>Long virus scans or data recovery won&apos;t result in surprise bills.</p>
            </div>
            <div className={styles.trustItem}>
              <div className={styles.iconWrapper}>
                <svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              <h4>Free Local Callout</h4>
              <p>Coming to your home in Felpham or Bognor Regis is entirely free.</p>
            </div>
          </div>
          
          <div className={styles.communityBadges}>
            <div className={styles.communityBadge}>
              <span className={styles.badgeLabel}>Recommended on</span>
              <span className={styles.badgeName}>Nextdoor</span>
            </div>
            <div className={styles.communityBadge}>
              <span className={styles.badgeLabel}>Active in</span>
              <span className={styles.badgeName}>Felpham Village</span>
            </div>
            <div className={styles.communityBadge}>
              <span className={styles.badgeLabel}>Member of</span>
              <span className={styles.badgeName}>Felpham Village Support Group</span>
            </div>
          </div>
        </section>

        <section className={styles.meetTheTech}>
          <div className={styles.bioContainer}>
            <div className={styles.bioText} style={{ textAlign: 'center', margin: '0 auto' }}>
              <h2>Reliable Tech Support You Can Trust</h2>
              <p>
                Hi, I&apos;m Matt. As a <strong>Solutions Architect with over 20 years of technical experience</strong>, I bring a unique level of expertise and precision to every home visit. 
                My mission is to provide <strong>Felpham and Bognor Regis</strong> residents with honest, jargon-free technical assistance that actually makes life easier.
              </p>
              <div className={styles.localBadges} style={{ justifyContent: 'center' }}>
                <span className={styles.localBadge}>🏡 Felpham Based</span>
                <span className={styles.localBadge}>💻 20+ Years Experience</span>
                
              </div>
              <div style={{ marginTop: '2rem' }}>
                <Link href="/about" className="btn btn-secondary">Read My Story</Link>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.humanExpertise}>
          <div className={styles.humanContent}>
            <div className={styles.humanIcon} aria-hidden="true">🧠🤝</div>
            <h2>Human-Led Support in a Tech World</h2>
            <p>
              In a world of chatbots and automated answers, we believe technology is best handled with a human touch. We provide tailored solutions that actually work for you.
            </p>
            <div className={styles.humanGrid}>
              <div className={styles.humanItem}>
                <h4>Local Context</h4>
                <p>We know the Bognor Wi-Fi dead zones and which local providers are having issues today.</p>
              </div>
              <div className={styles.humanItem}>
                <h4>Real Patience</h4>
                <p>We don&apos;t just fix it; we show you how to use it, at your pace, until you feel confident.</p>
              </div>
              <div className={styles.humanItem}>
                <h4>Empathy</h4>
                <p>Technology can be stressful. We&apos;re here to listen, understand, and provide a reassuring, calm presence.</p>
              </div>
            </div>
          </div>
        </section>



        <section id="services" className={styles.services}>
          <div className={styles.sectionHeader}>
            <h2>How We Can Help You</h2>
            <p>From unboxing your new tablet to recovering lost family photos, we cover all aspects of home technology.</p>
          </div>

          <div className={styles.brandSupport}>
            <p className={styles.brandLabel}>Expert support for:</p>
            <div className={styles.brandGrid}>
              <span>Apple (Mac, iPhone, iPad)</span>
              <span>Windows PC & Laptops</span>
              <span>Android Phones & Tablets</span>
              <span>Sky, BT, Virgin & TalkTalk</span>
              <span>Printers, Wi-Fi & Smart TVs</span>
            </div>
          </div>
          
          <div className={styles.grid}>
            {services.length === 0 ? (
              <>
                <article className={styles.card}>
                  <div className={styles.iconWrapper}>
                    <svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                  </div>
                  <h3>Device Setup & Migration</h3>
                  <p>Get your new computer, phone, or tablet set up securely. We&apos;ll move all your old files, photos, and emails over safely.</p>
                </article>
                <article className={styles.card}>
                  <div className={styles.iconWrapper}>
                    <svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
                  </div>
                  <h3>Wi-Fi & Home Networking</h3>
                  <p>Fix dead zones, stop connection drops, and ensure your home network is fast and secure for all your devices.</p>
                </article>
              </>
            ) : (
              services.map(service => (
                <article key={service.id} className={styles.card}>
                  <div className={styles.iconWrapper}>
                    <span style={{ fontSize: '1.5rem' }}>{service.icon}</span>
                  </div>
                  {service.estimatedTime && (
                    <span className={styles.timeBadge}>{service.estimatedTime}</span>
                  )}
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </article>
              ))
            )}
          </div>
        </section>

        <section className={styles.areasCovered}>
          <div className={styles.sectionHeader}>
            <h2>Areas We Cover</h2>
            <p>I provide friendly, in-home tech support to Felpham and all surrounding areas within a 15-mile radius.</p>
          </div>
          
          <PostcodeChecker />

          <div className={styles.mapContainer}>
            <D3ServiceMap />
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Felpham,Bognor+Regis" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.mapLink}
              >
                📍 View Full Map on Google
              </a>
            </div>
          </div>

          <div className={styles.areasContent}>
            <div className={styles.areasList}>
              <div className={styles.areaCategory}>
                <h3>Free Home Visit Zone</h3>
                <ul>
                  <li><strong>Felpham & Bognor Regis</strong> (All areas)</li>
                  <li><strong>Middleton & Elmer</strong></li>
                  <li><strong>Aldwick & Pagham</strong></li>
                  <li><strong>Chichester & Surrounds</strong></li>
                  <li><strong>Littlehampton & Rustington</strong></li>
                  <li><strong>Arundel & Barnham</strong></li>
                </ul>
              </div>
              <div className={styles.areaCategory}>
                <h3>Also Serving (15-mile radius)</h3>
                <ul>
                  <li><strong>Worthing</strong> (West)</li>
                  <li><strong>Selsey & The Witterings</strong></li>
                  <li><strong>Yapton & Ford</strong></li>
                  <li><strong>Tangmere & Westergate</strong></li>
                  <li><strong>Fontwell & Walberton</strong></li>
                  <li><strong>Anywhere in between!</strong></li>
                </ul>
              </div>
            </div>
          </div>
          <p style={{ textAlign: 'center', marginTop: '2.5rem', color: 'var(--text-muted)', fontSize: '1rem' }}>
            <strong>Not on the list?</strong> We also provide remote support over the phone and internet for anyone in the UK.
          </p>
        </section>

        <section className={styles.quizSection} style={{ padding: '4rem 1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '24px', margin: '2rem 0' }}>
          <div className={styles.sectionHeader} style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2>How Healthy is Your Tech?</h2>
            <p>Take our 1-minute quiz to see if your computer and data are secure.</p>
          </div>
          <HealthCheckQuiz />
        </section>

        <Testimonials />

        {settings.showCalendar === 'on' && (
          <section className={styles.communityEvents}>
            <div className={styles.sectionHeader}>
              <h2>Community Workshops</h2>
              <p>Join us for local &quot;Tea & Tech&quot; group sessions in Felpham and Bognor Regis.</p>
            </div>
            {events.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No workshops currently scheduled. Check back soon!</p>
            ) : (
              <div className={styles.eventsGrid}>
                {events.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <p>Interested in joining a workshop? <Link href="/contact" className={styles.eventLink}>Register your interest here →</Link></p>
            </div>
          </section>
        )}

        <section id="about" className={styles.ctaSection}>
          <h2>Ready to get your tech sorted?</h2>
          <p>Whether you need an immediate fix or just some friendly advice, we&apos;re here to help.</p>
          <Link href="/contact" className="btn btn-accent">Get Expert Help Now</Link>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerGrid}>
            <div className={styles.footerAbout}>
              <div style={{ marginBottom: '1rem' }}>
                <Image src="/logo.svg" alt={businessName} width={180} height={60} />
              </div>
              <p>&copy; {new Date().getFullYear()} <span className="notranslate">{businessName}</span>. Serving West Sussex since {settings.servingSince || "2010"}.</p>
              <address className={styles.address}>
                {settings.businessAddress || "Felpham, Bognor Regis, West Sussex, PO22"}<br />
                United Kingdom
              </address>
              <div className={styles.operatingHours}>
                <p><strong>Operating Hours:</strong><br />
                Monday - Friday: 9 AM - 6 PM<br />
                Weekend: Emergency Support Only</p>
              </div>
            </div>
            
            <div className={styles.footerNewsletter}>
              <h4>Stay Tech-Safe</h4>
              <p>Join our monthly jargon-free newsletter for local tech alerts and tips.</p>
              <NewsletterForm />
            </div>
          </div>

          <div className={styles.nearbyNeighborhoods}>
            <p><strong>Serving:</strong> Felpham, Bognor Regis, Middleton-on-Sea, Aldwick, Pagham, Chichester, Littlehampton, Arundel, Worthing, and all areas within a 15-mile radius of Felpham.</p>
          </div>
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