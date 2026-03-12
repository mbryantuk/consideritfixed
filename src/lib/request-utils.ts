import { prisma } from "./prisma";

export async function updateRequestStatus(requestId: string, status: string) {
  return await prisma.$transaction(async (tx) => {
    const request = await tx.request.update({
      where: { id: requestId },
      data: { status }
    });

    await tx.requestStatusLog.create({
      data: {
        requestId,
        status
      }
    });

    return request;
  });
}
