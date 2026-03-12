import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { ThemeProvider } from "@/components/ThemeProvider";
import FloatingCTA from "@/components/FloatingCTA";
import StickyContactBar from "@/components/StickyContactBar";

const inter = Inter({ subsets: ["latin"] });

import { getAllSettings } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getAllSettings();
  const businessName = settings.siteName || "Consider IT Fixed";
  const description = settings.metaDescription || "Reliable, jargon-free tech support in Felpham and Bognor Regis.";
  
  return {
    title: {
      default: settings.metaTitle || `${businessName} | Friendly Tech Support`,
      template: `%s | ${businessName}`
    },
    description,
    keywords: "tech support, computer repair, Felpham, Bognor Regis, West Sussex, IT help, home networking, virus removal, smart home setup",
    authors: [{ name: businessName }],
    metadataBase: new URL('https://consideritfixed.uk'),
    alternates: {
      canonical: '/',
    },
    manifest: '/manifest.json',
    openGraph: {
      title: businessName,
      description,
      url: "https://consideritfixed.uk",
      siteName: businessName,
      locale: "en_GB",
      type: "website",
      images: [
        {
          url: 'https://consideritfixed.uk/images/hero-tech.webp',
          width: 1200,
          height: 630,
          alt: businessName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: businessName,
      description,
      images: ['https://consideritfixed.uk/images/hero-tech.webp'],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getAllSettings();
  const businessName = settings.siteName || "Consider IT Fixed";
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": businessName,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Felpham",
      "addressRegion": "West Sussex",
      "addressCountry": "GB"
    },
    "description": settings.metaDescription,
    "url": "https://consideritfixed.uk",
    "telephone": `+${settings.whatsappNumber || "447419738500"}`,
    "priceRange": "££",
    "areaServed": ["Felpham", "Bognor Regis", "Middleton-on-Sea", "Aldwick", "Pagham"]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
          <Providers>
            {children}
            <FloatingCTA />
            <StickyContactBar />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}