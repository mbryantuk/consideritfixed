import { prisma } from "./prisma";
import { logAudit } from "./utils";

export async function usePartInRequest(requestId: string, partId: string, quantity: number, adminId: string) {
  try {
    const part = await prisma.part.findUnique({ where: { id: partId } });
    if (!part) throw new Error("Part not found");

    if (part.stockLevel < quantity) {
      throw new Error(`Insufficient stock for ${part.name}. Requested: ${quantity}, Available: ${part.stockLevel}`);
    }

    // Use transaction to ensure both happen or neither
    await prisma.$transaction([
      prisma.partUsage.create({
        data: {
          requestId,
          partId,
          quantity,
          priceAtTime: part.price || 0,
        }
      }),
      prisma.part.update({
        where: { id: partId },
        data: {
          stockLevel: {
            decrement: quantity
          }
        }
      })
    ]);

    await logAudit(adminId, "USE_PART", "Part", partId, { requestId, quantity });
    
    return { success: true };
  } catch (error) {
    console.error("Failed to use part:", error);
    return { success: false, error: error instanceof Error ? error.message : "Inventory update failed" };
  }
}
