import { prisma } from "../prisma";

export class ChallengeRepository {
  static async listAll() {
    return prisma.challenge.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        _count: {
          select: { participants: true },
        },
      },
    });
  }

  static async listForUser(userId: string) {
    const [challenges, participations] = await Promise.all([
      prisma.challenge.findMany({
        orderBy: { createdAt: "asc" },
        include: {
          _count: {
            select: { participants: true },
          },
        },
      }),
      prisma.challengeParticipant.findMany({
        where: { userId },
      }),
    ]);

    const partMap = new Map(participations.map((p) => [p.challengeId, p]));

    return challenges.map((ch) => {
      const part = partMap.get(ch.id);
      return {
        ...ch,
        isJoined: !!part && part.status === "ACTIVE",
        userParticipation: part || null,
      };
    });
  }

  static async join(
    challengeId: string,
    userId: string,
    displayName: string,
    isOptedInLeaderboard: boolean
  ) {
    return prisma.challengeParticipant.upsert({
      where: {
        userId_challengeId: {
          userId,
          challengeId,
        },
      },
      update: {
        displayName,
        status: "ACTIVE",
        isOptedInLeaderboard,
      },
      create: {
        challengeId,
        userId,
        displayName,
        status: "ACTIVE",
        progressValue: 0,
        isOptedInLeaderboard,
      },
    });
  }

  static async updateProgress(
    challengeId: string,
    userId: string,
    progressValue: number
  ) {
    const existing = await prisma.challengeParticipant.findUnique({
      where: {
        userId_challengeId: {
          userId,
          challengeId,
        },
      },
      include: { challenge: true },
    });

    if (!existing) return null;

    const isCompleted = progressValue >= existing.challenge.targetValue;

    return prisma.challengeParticipant.update({
      where: { id: existing.id },
      data: {
        progressValue,
        status: isCompleted ? "COMPLETED" : "ACTIVE",
        completedAt: isCompleted ? new Date() : null,
      },
    });
  }

  static async leave(challengeId: string, userId: string) {
    const existing = await prisma.challengeParticipant.findUnique({
      where: {
        userId_challengeId: {
          userId,
          challengeId,
        },
      },
    });

    if (!existing) return false;

    await prisma.challengeParticipant.delete({
      where: { id: existing.id },
    });

    return true;
  }

  static async getLeaderboard(challengeId?: string) {
    // Only real opted-in users who have opted into the leaderboard!
    const where: any = {
      isOptedInLeaderboard: true,
      status: { in: ["ACTIVE", "COMPLETED"] },
    };

    if (challengeId) {
      where.challengeId = challengeId;
    }

    const participants = await prisma.challengeParticipant.findMany({
      where,
      orderBy: [{ progressValue: "desc" }, { joinedAt: "asc" }],
      take: 50,
      select: {
        id: true,
        displayName: true,
        progressValue: true,
        status: true,
        joinedAt: true,
        challenge: {
          select: {
            title: true,
            targetValue: true,
            unit: true,
          },
        },
      },
    });

    return participants;
  }
}
