import { prisma } from "../prisma";

export class AuditRepository {
  static async log(
    action: string,
    status: "SUCCESS" | "FAILED",
    userId?: string | null,
    metadata?: Record<string, any>
  ) {
    try {
      await prisma.auditLog.create({
        data: {
          action,
          status,
          userId: userId || null,
          metadata: metadata ? JSON.stringify(metadata) : null,
        },
      });
    } catch (e) {
      console.error("[Audit Log Failed]", e);
    }
  }
}
