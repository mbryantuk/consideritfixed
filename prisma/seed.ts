import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  // 1. Services
  const services = [
    {
      title: 'Device Setup & Migration',
      description: 'New computer, phone, or tablet? We’ll set it up and move your photos and files safely.',
      icon: '📱',
      estimatedTime: '1-2 Hours',
      order: 1,
    },
    {
      title: 'Maintenance & Upgrades',
      description: 'Slow computer? We can speed it up with more memory or a faster storage drive.',
      icon: '⚙️',
      estimatedTime: '1-3 Hours',
      order: 2,
    },
    {
      title: 'Virus & Malware Removal',
      description: 'Thorough cleaning of infections and setup of robust security to keep you safe.',
      icon: '🛡️',
      estimatedTime: '2-4 Hours',
      order: 3,
    },
    {
      title: 'Data Recovery & Backup',
      description: 'Lost photos or documents? We can help recover data and set up automatic backups.',
      icon: '💾',
      estimatedTime: 'Varies',
      order: 4,
    },
    {
      title: 'Home Wi-Fi & Networking',
      description: 'Fixing dead zones, signal drops, and slow speeds throughout your home.',
      icon: '📶',
      estimatedTime: '1-2 Hours',
      order: 5,
    },
    {
      title: 'Smart Home & TV Setup',
      description: 'Setting up Smart TVs, video doorbells, smart lights, and voice assistants.',
      icon: '🏠',
      estimatedTime: '1-2 Hours',
      order: 6,
    },
    {
      title: 'Printer & Peripheral Support',
      description: 'Resolving printer offline errors, scanner issues, and hardware connection problems.',
      icon: '🖨️',
      estimatedTime: '45-90 Mins',
      order: 7,
    },
    {
      title: 'Tech Tutoring & Advice',
      description: 'Patient, jargon-free lessons on how to use your devices and stay safe online.',
      icon: '👨‍🏫',
      estimatedTime: '1 Hour',
      order: 8,
    },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { id: `service-${s.order}` }, // Artificial ID for upsert
      update: s,
      create: { ...s, id: `service-${s.order}` },
    });
  }

  // 2. Price Rates
  const rates = [
    {
      serviceName: 'Standard Hourly Rate',
      description: 'For general support, setup, and troubleshooting.',
      price: '£40',
      order: 1,
    },
    {
      serviceName: 'Senior Discount Rate',
      description: 'Reduced rate for residents aged 65 and over.',
      price: '£30',
      order: 2,
    },
    {
      serviceName: 'Fixed Price Virus Removal',
      description: 'Comprehensive malware cleaning with a capped price guarantee.',
      price: '£80',
      order: 3,
    },
    {
      serviceName: 'Remote Support (per 30m)',
      description: 'Quick fixes via screen share for minor software issues.',
      price: '£20',
      order: 4,
    },
    {
      serviceName: 'Home Network Audit',
      description: 'Full signal mapping and optimization recommendation.',
      price: '£60',
      order: 5,
    },
  ];

  for (const r of rates) {
    await prisma.priceRate.upsert({
      where: { id: `rate-${r.order}` },
      update: r,
      create: { ...r, id: `rate-${r.order}` },
    });
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
