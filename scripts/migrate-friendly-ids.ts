import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const requests = await prisma.request.findMany();
  for (let i = 0; i < requests.length; i++) {
    const r = requests[i];
    const friendlyId = `REQ-${(1000 + i + 1).toString()}`;
    await prisma.request.update({
      where: { id: r.id },
      data: { friendlyId }
    });
    console.log(`Updated ${r.id} to ${friendlyId}`);
  }
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
