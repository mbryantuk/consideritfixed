import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import styles from "../../../page.module.css";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSettings } from "@/lib/settings";

const LOCATIONS = [
  { name: 'Felpham', slug: 'felpham', description: 'Expert, jargon-free tech support right here in Felpham Village.' },
  { name: 'Bognor Regis', slug: 'bognor-regis', description: 'Reliable computer repairs and Wi-Fi help across Bognor Regis.' },
  { name: 'Aldwick', slug: 'aldwick', description: 'Professional home tech assistance for residents in Aldwick.' },
  { name: 'Middleton-on-Sea', slug: 'middleton-on-sea', description: 'Friendly IT support and device setup in Middleton.' },
  { name: 'Pagham', slug: 'pagham', description: 'Local tech help and troubleshooting for the Pagham community.' },
  { name: 'Chichester', slug: 'chichester', description: 'Expert tech support and computer repairs for homes and small businesses in Chichester.' },
  { name: 'Barnham', slug: 'barnham', description: 'Reliable, local IT assistance and Wi-Fi troubleshooting in Barnham and Eastergate.' },
];

export async function generateStaticParams() {
  return LOCATIONS.map((loc) => ({
    slug: loc.slug,
  }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const location = LOCATIONS.find(l => l.slug === params.slug);
  if (!location) return {};

  return {
    title: `Tech Support in ${location.name} | Consider IT Fixed`,
    description: `Need computer help in ${location.name}? Friendly, local IT support for home and office. No fix, no fee.`,
  };
}

export default async function LocationPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const location = LOCATIONS.find(l => l.slug === params.slug);
  const settings = await getAllSettings();

  if (!location) notFound();

  const services = await prisma.service.findMany({
    where: { featured: true },
    orderBy: { order: 'asc' }
  });

  const serviceHeroImage = settings.serviceHeroImage || '/images/tech-help.webp';

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <section 
          className={styles.hero} 
          style={{ minHeight: '400px', '--hero-bg': `url('${serviceHeroImage}')` } as React.CSSProperties}
        >
          <div className={styles.heroContent}>
            <span className={styles.badge}>Local Support: {location.name}</span>
            <h1>Friendly Tech Support in <span>{location.name}</span></h1>
            <p>{location.description}</p>
            <div className={styles.heroActions}>
              <Link href="/contact" className="btn btn-primary">Get Help in {location.name}</Link>
              <Link href="/pricing" className="btn btn-outline">View Local Rates</Link>
            </div>
          </div>
        </section>

        <section className={styles.services}>
          <div className={styles.sectionHeader}>
            <h2>Services Available in {location.name}</h2>
            <p>We provide a full range of tech assistance directly to your home or office in {location.name}.</p>
          </div>
          <div className={styles.grid}>
            {services.map(service => (
              <article key={service.id} className={styles.card}>
                <div className={styles.iconWrapper}>
                  <span style={{ fontSize: '1.5rem' }}>{service.icon}</span>
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.ctaSection}>
          <h2>Live in {location.name} and need tech help?</h2>
          <p>Don&apos;t struggle with confusing manuals or long hold times. We&apos;re just around the corner.</p>
          <Link href="/contact" className="btn btn-accent">Request a {location.name} Visit</Link>
        </section>
      </main>
    </div>
  );
}
