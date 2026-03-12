import { prisma } from "@/lib/prisma";
import { sendQuoteReminder } from "@/lib/mail";

async function checkExpiringQuotes() {
  console.log("Checking for quotes expiring in 48 hours...");
  
  const in48Hours = new Date();
  in48Hours.setHours(in48Hours.getHours() + 48);
  const now = new Date();

  const expiringQuotes = await prisma.quote.findMany({
    where: {
      status: 'PENDING',
      expiresAt: {
        lte: in48Hours,
        gte: now
      }
    },
    include: {
      request: {
        include: { user: true }
      }
    }
  });

  console.log(`Found ${expiringQuotes.length} quotes expiring soon.`);

  for (const quote of expiringQuotes) {
    const user = quote.request.user;
    if (user.email) {
      console.log(`Sending reminder to ${user.email} for Quote ${quote.id}`);
      await sendQuoteReminder(user.email, user.name || "Customer", quote.request.title, quote.id, quote.expiresAt!);
    }
  }

  console.log("Done.");
}

checkExpiringQuotes()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
