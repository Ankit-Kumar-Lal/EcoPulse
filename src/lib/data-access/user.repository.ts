import { prisma } from "../prisma";

export class UserRepository {
  static async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { profile: true },
    });
  }

  static async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { profile: true, notifications: true },
    });
  }

  static async createUser(data: {
    name: string;
    email: string;
    passwordHash: string;
    region?: string;
  }) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: data.name,
          email: data.email.toLowerCase(),
          passwordHash: data.passwordHash,
          profile: {
            create: {
              region: data.region || "IN",
              units: "metric",
              householdSize: 1,
              focusAreas: JSON.stringify(["HOME_ENERGY", "TRANSPORT"]),
            },
          },
          notifications: {
            create: {
              emailWeeklyDigest: true,
              emailMonthlyReport: true,
              challengeReminders: true,
              productUpdates: false,
              inAppAlerts: true,
            },
          },
        },
        include: {
          profile: true,
        },
      });

      return user;
    });
  }

  static async markEmailVerified(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { emailVerifiedAt: new Date() },
    });
  }

  static async updatePassword(userId: string, passwordHash: string) {
    return prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { passwordHash },
      }),
      // Invalidate existing sessions on password change
      prisma.session.deleteMany({
        where: { userId },
      }),
    ]);
  }

  static async updateProfile(
    userId: string,
    data: {
      name?: string;
      region?: string;
      units?: string;
      householdSize?: number;
      focusAreas?: string[];
      bio?: string;
      leaderboardOptIn?: boolean;
    }
  ) {
    return prisma.$transaction(async (tx) => {
      if (data.name) {
        await tx.user.update({
          where: { id: userId },
          data: { name: data.name },
        });
      }

      return tx.profile.update({
        where: { userId },
        data: {
          ...(data.region && { region: data.region }),
          ...(data.units && { units: data.units }),
          ...(data.householdSize && { householdSize: data.householdSize }),
          ...(data.focusAreas && { focusAreas: JSON.stringify(data.focusAreas) }),
          ...(data.bio !== undefined && { bio: data.bio }),
          ...(data.leaderboardOptIn !== undefined && { leaderboardOptIn: data.leaderboardOptIn }),
        },
      });
    });
  }

  static async updateNotifications(
    userId: string,
    data: {
      emailWeeklyDigest: boolean;
      emailMonthlyReport: boolean;
      challengeReminders: boolean;
      productUpdates: boolean;
      inAppAlerts: boolean;
    }
  ) {
    return prisma.notificationPreference.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data,
      },
    });
  }

  static async exportUserData(userId: string) {
    const [user, activities, goals, challenges, recommendations] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true, notifications: true },
      }),
      prisma.activity.findMany({
        where: { userId },
        orderBy: { date: "desc" },
      }),
      prisma.goal.findMany({
        where: { userId },
      }),
      prisma.challengeParticipant.findMany({
        where: { userId },
        include: { challenge: true },
      }),
      prisma.userRecommendation.findMany({
        where: { userId },
        include: { recommendation: true },
      }),
    ]);

    return {
      exportedAt: new Date().toISOString(),
      user: {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        emailVerifiedAt: user?.emailVerifiedAt,
        createdAt: user?.createdAt,
        profile: user?.profile,
        notifications: user?.notifications,
      },
      activities,
      goals,
      challenges,
      recommendations,
    };
  }

  static async deleteUserPermanently(userId: string) {
    return prisma.$transaction(async (tx) => {
      // Record audit log entry before deleting user
      await tx.auditLog.create({
        data: {
          userId: null,
          action: "DELETE_ACCOUNT",
          status: "SUCCESS",
          metadata: JSON.stringify({ deletedUserId: userId, timestamp: new Date().toISOString() }),
        },
      });

      // Prisma cascade onDelete will remove profile, activities, goals, sessions, tokens, etc.
      return tx.user.delete({
        where: { id: userId },
      });
    });
  }
}
