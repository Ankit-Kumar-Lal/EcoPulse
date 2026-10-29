import { prisma } from "../prisma";

export class RecommendationRepository {
  static async listAll() {
    return prisma.recommendation.findMany();
  }

  static async listForUser(userId: string) {
    const all = await prisma.recommendation.findMany();
    const userStatuses = await prisma.userRecommendation.findMany({
      where: { userId },
    });

    const statusMap = new Map(
      userStatuses.map((s) => [s.recommendationId, s])
    );

    return all.map((rec) => ({
      ...rec,
      userStatus: statusMap.get(rec.id)?.status || "SHOWN",
      completedAt: statusMap.get(rec.id)?.completedAt || null,
    }));
  }

  static async updateStatus(
    userId: string,
    recommendationId: string,
    status: "SHOWN" | "DISMISSED" | "COMPLETED"
  ) {
    return prisma.userRecommendation.upsert({
      where: {
        userId_recommendationId: {
          userId,
          recommendationId,
        },
      },
      update: {
        status,
        completedAt: status === "COMPLETED" ? new Date() : null,
      },
      create: {
        userId,
        recommendationId,
        status,
        completedAt: status === "COMPLETED" ? new Date() : null,
      },
    });
  }
}
