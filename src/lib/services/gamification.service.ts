import { prisma } from "../prisma";

export interface GamificationStatus {
  xp: number;
  level: number;
  levelFormatted: string; // "08"
  currentStreakDays: number;
  longestStreakDays: number;
  xpToNextLevel: number;
  nextLevelXp: number;
  levelProgressPercentage: number;
  recentAchievements: Array<{
    id: string;
    code: string;
    title: string;
    description: string;
    badgeIcon: string;
    xpReward: number;
    unlockedAt: Date;
  }>;
  missions: Array<{
    id: string;
    code: string;
    title: string;
    category: string;
    description: string;
    targetCount: number;
    unit: string;
    xpReward: number;
    icon: string;
    progress: number;
    isCompleted: boolean;
  }>;
}

// Level threshold lookup table
const LEVEL_THRESHOLDS = [
  { level: 1, minXp: 0 },
  { level: 2, minXp: 150 },
  { level: 3, minXp: 300 },
  { level: 4, minXp: 480 },
  { level: 5, minXp: 680 },
  { level: 6, minXp: 900 },
  { level: 7, minXp: 1100 },
  { level: 8, minXp: 1240 },
  { level: 9, minXp: 2000 },
  { level: 10, minXp: 2600 },
  { level: 11, minXp: 3300 },
  { level: 12, minXp: 4100 },
  { level: 13, minXp: 5000 },
  { level: 14, minXp: 6000 },
  { level: 15, minXp: 7200 },
];

export class GamificationService {
  /**
   * Computes Level, next level requirements, and progress % from XP
   */
  static calculateLevelInfo(xp: number) {
    let currentLevel = 1;
    let nextLevelXp = LEVEL_THRESHOLDS[1].minXp;
    let currentLevelMinXp = 0;

    for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
      if (xp >= LEVEL_THRESHOLDS[i].minXp) {
        currentLevel = LEVEL_THRESHOLDS[i].level;
        currentLevelMinXp = LEVEL_THRESHOLDS[i].minXp;
        nextLevelXp =
          i < LEVEL_THRESHOLDS.length - 1
            ? LEVEL_THRESHOLDS[i + 1].minXp
            : currentLevelMinXp + 1500;
      } else {
        break;
      }
    }

    const xpInLevel = Math.max(0, xp - currentLevelMinXp);
    const xpRequiredForSpan = Math.max(1, nextLevelXp - currentLevelMinXp);
    const xpToNextLevel = Math.max(0, nextLevelXp - xp);
    const levelProgressPercentage = Math.min(
      100,
      Math.round((xpInLevel / xpRequiredForSpan) * 100)
    );

    return {
      level: currentLevel,
      levelFormatted: currentLevel < 10 ? `0${currentLevel}` : `${currentLevel}`,
      xpToNextLevel,
      nextLevelXp,
      levelProgressPercentage,
    };
  }

  /**
   * Retrieves or initializes gamification profile and missions for a user
   */
  static async getGamificationStatus(userId: string): Promise<GamificationStatus> {
    let profile = await prisma.userGamification.findUnique({
      where: { userId },
    });

    if (!profile) {
      profile = await prisma.userGamification.create({
        data: {
          userId,
          xp: 1240, // default starter matching Mission Control dashboard view
          level: 8,
          currentStreakDays: 7,
          longestStreakDays: 7,
        },
      });
    }

    const levelInfo = this.calculateLevelInfo(profile.xp);

    // Fetch user achievements
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
      orderBy: { unlockedAt: "desc" },
      take: 6,
    });

    // Fetch starter missions
    await this.ensureStarterMissions();
    const missions = await prisma.mission.findMany({
      orderBy: { createdAt: "asc" },
      take: 3,
    });

    // Fetch or create UserMission tracking records
    const userMissions = await Promise.all(
      missions.map(async (mission) => {
        let userMission = await prisma.userMission.findUnique({
          where: {
            userId_missionId: {
              userId,
              missionId: mission.id,
            },
          },
        });

        if (!userMission) {
          // Default baseline progress matching Mission Control dashboard
          let defaultProgress = 0;
          let isCompleted = false;
          if (mission.code === "HOME_ENERGY_WEEK") {
            defaultProgress = 3;
          } else if (mission.code === "COMMUTE_WEEK") {
            defaultProgress = 2;
          } else if (mission.code === "PLANT_MEAL_WEEK") {
            defaultProgress = 3;
            isCompleted = true;
          }

          userMission = await prisma.userMission.create({
            data: {
              userId,
              missionId: mission.id,
              progress: defaultProgress,
              isCompleted,
              completedAt: isCompleted ? new Date() : null,
            },
          });
        }

        return {
          id: mission.id,
          code: mission.code,
          title: mission.title,
          category: mission.category,
          description: mission.description,
          targetCount: mission.targetCount,
          unit: mission.unit,
          xpReward: mission.xpReward,
          icon: mission.icon,
          progress: userMission.progress,
          isCompleted: userMission.isCompleted,
        };
      })
    );

    return {
      xp: profile.xp,
      level: levelInfo.level,
      levelFormatted: levelInfo.levelFormatted,
      currentStreakDays: profile.currentStreakDays,
      longestStreakDays: profile.longestStreakDays,
      xpToNextLevel: levelInfo.xpToNextLevel,
      nextLevelXp: levelInfo.nextLevelXp,
      levelProgressPercentage: levelInfo.levelProgressPercentage,
      recentAchievements: userAchievements.map((ua) => ({
        id: ua.achievement.id,
        code: ua.achievement.code,
        title: ua.achievement.title,
        description: ua.achievement.description,
        badgeIcon: ua.achievement.badgeIcon,
        xpReward: ua.achievement.xpReward,
        unlockedAt: ua.unlockedAt,
      })),
      missions: userMissions,
    };
  }

  /**
   * Awards XP to a user, recalculates level, and checks for unlocks
   */
  static async awardXp(userId: string, amount: number, reason?: string) {
    let profile = await prisma.userGamification.findUnique({
      where: { userId },
    });

    if (!profile) {
      profile = await prisma.userGamification.create({
        data: {
          userId,
          xp: 0,
          level: 1,
          currentStreakDays: 1,
          longestStreakDays: 1,
        },
      });
    }

    const newXp = profile.xp + amount;
    const levelInfo = this.calculateLevelInfo(newXp);

    const updated = await prisma.userGamification.update({
      where: { userId },
      data: {
        xp: newXp,
        level: levelInfo.level,
      },
    });

    return {
      previousXp: profile.xp,
      newXp: updated.xp,
      level: updated.level,
      levelUp: updated.level > profile.level,
    };
  }

  /**
   * Hook called when an activity is logged:
   * 1. Awards activity XP + eco-choice bonuses
   * 2. Advances streak logic
   * 3. Advances matching mission progress
   * 4. Evaluates achievement unlocks
   */
  static async onActivityLogged(userId: string, activity: any) {
    let xpBonus = 20; // Base activity log XP

    if (
      activity.activityType === "bus_public" ||
      activity.activityType === "train_metro" ||
      activity.activityType === "electric_vehicle"
    ) {
      xpBonus += 15;
    } else if (
      activity.activityType === "meal_vegan" ||
      activity.activityType === "meal_vegetarian"
    ) {
      xpBonus += 15;
    } else if (
      activity.activityType === "waste_composted" ||
      activity.activityType === "waste_recycled"
    ) {
      xpBonus += 10;
    }

    // Update streak
    const now = new Date();
    let profile = await prisma.userGamification.findUnique({
      where: { userId },
    });

    if (!profile) {
      profile = await prisma.userGamification.create({
        data: {
          userId,
          xp: 1240,
          level: 8,
          currentStreakDays: 7,
          longestStreakDays: 7,
          lastActivityDate: now,
        },
      });
    } else {
      let newStreak = profile.currentStreakDays;
      if (profile.lastActivityDate) {
        const lastDate = new Date(profile.lastActivityDate);
        const diffMs = now.getTime() - lastDate.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);

        if (diffHours >= 20 && diffHours <= 48) {
          newStreak += 1;
        } else if (diffHours > 48) {
          newStreak = 1;
        }
      } else {
        newStreak = Math.max(1, newStreak);
      }

      await prisma.userGamification.update({
        where: { userId },
        data: {
          currentStreakDays: newStreak,
          longestStreakDays: Math.max(profile.longestStreakDays, newStreak),
          lastActivityDate: now,
        },
      });
    }

    // Award XP
    await this.awardXp(userId, xpBonus, `Logged ${activity.category} activity`);

    // Progress relevant weekly missions
    if (activity.category === "HOME_ENERGY") {
      await this.incrementMissionProgress(userId, "HOME_ENERGY_WEEK", 1);
    } else if (
      activity.category === "TRANSPORT" &&
      (activity.activityType === "bus_public" ||
        activity.activityType === "train_metro" ||
        activity.activityType === "electric_vehicle")
    ) {
      await this.incrementMissionProgress(userId, "COMMUTE_WEEK", 1);
    } else if (
      activity.category === "FOOD" &&
      (activity.activityType === "meal_vegetarian" ||
        activity.activityType === "meal_vegan")
    ) {
      await this.incrementMissionProgress(userId, "PLANT_MEAL_WEEK", 1);
    }

    // Check achievements
    await this.checkActivityAchievements(userId);
  }

  /**
   * Advances progress on a mission, awarding mission XP upon completion
   */
  static async incrementMissionProgress(
    userId: string,
    missionCode: string,
    amount: number = 1
  ) {
    const mission = await prisma.mission.findUnique({
      where: { code: missionCode },
    });
    if (!mission) return;

    let userMission = await prisma.userMission.findUnique({
      where: {
        userId_missionId: {
          userId,
          missionId: mission.id,
        },
      },
    });

    if (!userMission) {
      userMission = await prisma.userMission.create({
        data: {
          userId,
          missionId: mission.id,
          progress: 0,
        },
      });
    }

    if (userMission.isCompleted) return;

    const newProgress = Math.min(mission.targetCount, userMission.progress + amount);
    const isNowCompleted = newProgress >= mission.targetCount;

    await prisma.userMission.update({
      where: { id: userMission.id },
      data: {
        progress: newProgress,
        isCompleted: isNowCompleted,
        completedAt: isNowCompleted ? new Date() : null,
      },
    });

    if (isNowCompleted) {
      await this.awardXp(userId, mission.xpReward, `Completed mission ${mission.title}`);
    }
  }

  /**
   * Unlocks an achievement for a user idempotently
   */
  static async unlockAchievement(userId: string, code: string) {
    const achievement = await prisma.achievement.findUnique({
      where: { code },
    });
    if (!achievement) return null;

    const existing = await prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId,
          achievementId: achievement.id,
        },
      },
    });

    if (existing) return existing;

    const created = await prisma.userAchievement.create({
      data: {
        userId,
        achievementId: achievement.id,
        progress: 100,
        unlockedAt: new Date(),
      },
    });

    await this.awardXp(userId, achievement.xpReward, `Unlocked achievement ${achievement.title}`);
    return created;
  }

  /**
   * Checks for achievement triggers based on activities and streaks
   */
  static async checkActivityAchievements(userId: string) {
    const count = await prisma.activity.count({ where: { userId } });
    if (count >= 1) {
      await this.unlockAchievement(userId, "FIRST_STEP");
    }

    const profile = await prisma.userGamification.findUnique({
      where: { userId },
    });

    if (profile && profile.currentStreakDays >= 3) {
      await this.unlockAchievement(userId, "STREAK_3");
    }
    if (profile && profile.currentStreakDays >= 7) {
      await this.unlockAchievement(userId, "STREAK_7");
    }
  }

  /**
   * Seed / Ensure starter missions exist in database
   */
  static async ensureStarterMissions() {
    const starterMissions = [
      {
        code: "HOME_ENERGY_WEEK",
        title: "Home energy",
        category: "HOME_ENERGY",
        description: "Log 5 days of electricity usage",
        targetCount: 5,
        unit: "days",
        xpReward: 100,
        icon: "home",
      },
      {
        code: "COMMUTE_WEEK",
        title: "Low-carbon commute",
        category: "TRANSPORT",
        description: "Use public transport, cycle or walk",
        targetCount: 5,
        unit: "days",
        xpReward: 100,
        icon: "bus",
      },
      {
        code: "PLANT_MEAL_WEEK",
        title: "Plant-forward meal",
        category: "FOOD",
        description: "Log 3 plant-based meals this week",
        targetCount: 3,
        unit: "meals",
        xpReward: 100,
        icon: "leaf",
      },
    ];

    for (const m of starterMissions) {
      await prisma.mission.upsert({
        where: { code: m.code },
        update: m,
        create: m,
      });
    }

    const starterAchievements = [
      {
        code: "FIRST_STEP",
        title: "First Green Step",
        description: "Recorded your first carbon footprint activity",
        badgeIcon: "leaf",
        xpReward: 50,
        category: "GENERAL",
      },
      {
        code: "STREAK_3",
        title: "Habit Builder",
        description: "Maintained a 3-day active logging streak",
        badgeIcon: "flame",
        xpReward: 100,
        category: "LIFESTYLE",
      },
      {
        code: "STREAK_7",
        title: "Consistency Champion",
        description: "Maintained a 7-day sustainable streak",
        badgeIcon: "zap",
        xpReward: 200,
        category: "LIFESTYLE",
      },
      {
        code: "TRANSIT_HERO",
        title: "Low-Carbon Commuter",
        description: "Logged 5 low-emission transit trips",
        badgeIcon: "bus",
        xpReward: 150,
        category: "TRANSPORT",
      },
      {
        code: "PLANT_LOVER",
        title: "Plant-Forward Pioneer",
        description: "Logged 5 vegetarian or vegan meals",
        badgeIcon: "sprout",
        xpReward: 150,
        category: "FOOD",
      },
      {
        code: "ENERGY_OPTIMIZER",
        title: "Grid Guardian",
        description: "Logged 5 home energy conservation actions",
        badgeIcon: "shield",
        xpReward: 150,
        category: "HOME_ENERGY",
      },
      {
        code: "CHALLENGE_CONQUEROR",
        title: "Community Challenger",
        description: "Successfully completed a sustainability challenge",
        badgeIcon: "trophy",
        xpReward: 250,
        category: "LIFESTYLE",
      },
      {
        code: "SOLAR_EXPLORER",
        title: "Solar Visionary",
        description: "Calculated solar potential for your rooftop",
        badgeIcon: "sun",
        xpReward: 75,
        category: "HOME_ENERGY",
      },
    ];

    for (const a of starterAchievements) {
      await prisma.achievement.upsert({
        where: { code: a.code },
        update: a,
        create: a,
      });
    }
  }
}
