import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function archiveOldRequests() {
  console.log("Starting auto-archive of closed requests older than 1 year...");
  
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const requestsToArchive = await prisma.request.findMany({
    where: {
      status: 'CLOSED',
      updatedAt: {
        lt: oneYearAgo
      }
    }
  });

  console.log(`Found ${requestsToArchive.length} requests to archive.`);

  for (const req of requestsToArchive) {
    // In a real app with an Archive table, we'd move them.
    // For now, we'll mark them as ARCHIVED (if we had that status)
    // or just log that we are cleaning up.
    console.log(`Archiving Request: ${req.friendlyId} - ${req.title}`);
    
    // Let's add 'ARCHIVED' to status if we want, or just delete if it's GDPR policy.
    // Given the 1-year policy, let's just log for now or update status.
    await prisma.request.update({
      where: { id: req.id },
      data: { status: 'ARCHIVED' }
    });
  }

  console.log("Auto-archive complete.");
}

archiveOldRequests()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
