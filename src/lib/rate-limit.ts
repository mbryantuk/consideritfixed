import { prisma } from "./prisma";

export async function rateLimit(key: string, limit: number, durationSeconds: number) {
  const now = new Date();
  
  // Clean up expired limits
  await prisma.rateLimit.deleteMany({
    where: { expiresAt: { lt: now } }
  });

  const record = await prisma.rateLimit.findUnique({
    where: { key }
  });

  if (!record) {
    await prisma.rateLimit.create({
      data: {
        key,
        count: 1,
        expiresAt: new Date(now.getTime() + durationSeconds * 1000)
      }
    });
    return { success: true };
  }

  if (record.count >= limit) {
    return { success: false, retryAfter: Math.ceil((record.expiresAt.getTime() - now.getTime()) / 1000) };
  }

  await prisma.rateLimit.update({
    where: { key },
    data: { count: record.count + 1 }
  });

  return { success: true };
}
