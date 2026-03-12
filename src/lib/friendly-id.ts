import { prisma } from './prisma';

export async function generateFriendlyId(): Promise<string> {
  const latestRequest = await prisma.request.findFirst({
    orderBy: { createdAt: 'desc' }
  });

  if (!latestRequest || !latestRequest.friendlyId || !latestRequest.friendlyId.startsWith('REQ-')) {
    return 'REQ-1001';
  }

  const parts = latestRequest.friendlyId.split('-');
  const num = parseInt(parts[1], 10);
  if (isNaN(num)) return 'REQ-1001';

  return `REQ-${num + 1}`;
}