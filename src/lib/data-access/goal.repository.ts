import { prisma } from "../prisma";
import { GoalInput } from "../validations/goal";

export class GoalRepository {
  static async listByUser(userId: string) {
    return prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async findActiveByUser(userId: string) {
    return prisma.goal.findFirst({
      where: { userId, status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
    });
  }

  static async create(userId: string, input: GoalInput) {
    return prisma.goal.create({
      data: {
        userId,
        title: input.title,
        category: input.category || null,
        targetReductionPercent: input.targetReductionPercent || null,
        targetKgCO2e: input.targetKgCO2e,
        timeHorizon: input.timeHorizon,
        startDate: new Date(input.startDate),
        endDate: new Date(input.endDate),
        status: "ACTIVE",
      },
    });
  }

  static async updateStatus(id: string, userId: string, status: string) {
    const existing = await prisma.goal.findFirst({
      where: { id, userId },
    });
    if (!existing) return null;

    return prisma.goal.update({
      where: { id },
      data: { status },
    });
  }

  static async delete(id: string, userId: string) {
    const existing = await prisma.goal.findFirst({
      where: { id, userId },
    });
    if (!existing) return false;

    await prisma.goal.delete({ where: { id } });
    return true;
  }
}
