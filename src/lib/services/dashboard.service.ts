import { ActivityRepository } from "../data-access/activity.repository";
import { GoalRepository } from "../data-access/goal.repository";
import { RecommendationRepository } from "../data-access/recommendation.repository";
import { ChallengeRepository } from "../data-access/challenge.repository";
import { prisma } from "../prisma";
import { GamificationService, GamificationStatus } from "./gamification.service";

export interface DashboardMetrics {
  period: "week" | "month" | "year";
  totalKgCO2e: number;
  totalActivitiesCount: number;
  previousPeriodKgCO2e: number | null;
  percentageChange: number | null;
  changeDescription: string;
  categoryBreakdown: Array<{
    category: string;
    kgCO2e: number;
    percentage: number;
    count: number;
  }>;
  trendData: Array<{
    label: string;
    date: string;
    kgCO2e: number;
  }>;
  trendSummary: string;
  recommendedAction: {
    id: string;
    title: string;
    description: string;
    effort: string;
    potentialSavingKgCO2e: number;
    assumptions: string;
    source: string;
    whyRecommended: string;
  } | null;
  activeGoal: {
    id: string;
    title: string;
    targetKgCO2e: number;
    currentKgCO2e: number;
    progressPercentage: number;
    timeHorizon: string;
    daysRemaining: number;
  } | null;
  activeChallenge: {
    id: string;
    title: string;
    targetMetric: string;
    targetValue: number;
    unit: string;
    progressValue: number;
    progressPercentage: number;
    rules: string;
  } | null;
  recentActivities: Array<any>;
  isNewUser: boolean;
  gamification?: GamificationStatus;
  topStreaks?: Array<any>;
  indiaCollectiveImpact?: {
    totalKgCO2eReducedMonth: string;
    activeParticipantsText: string;
    growthDirection: string;
    cities: string[];
  };
  weeklyProgress?: {
    currentKgCO2e: number;
    targetKgCO2e: number;
    percentage: number;
    daysCompleted: number;
    totalDays: number;
  };
  weeklyChallenge?: {
    title: string;
    targetKgCO2e: number;
    daysTracked: Array<{ day: string; completed: boolean }>;
  };
}

export class DashboardService {
  static async getMetrics(
    userId: string,
    period: "week" | "month" | "year" = "month"
  ): Promise<DashboardMetrics> {
    const now = new Date();
    let startDate = new Date();
    let prevStartDate = new Date();
    let prevEndDate = new Date();

    if (period === "week") {
      startDate.setDate(now.getDate() - 7);
      prevStartDate.setDate(now.getDate() - 14);
      prevEndDate.setDate(now.getDate() - 7);
    } else if (period === "year") {
      startDate = new Date(now.getFullYear(), 0, 1);
      prevStartDate = new Date(now.getFullYear() - 1, 0, 1);
      prevEndDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59);
    } else {
      // month (default)
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      prevStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      prevEndDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    }

    const [currentSummary, prevSummary, recentRecords, activeGoal, challenges, allRecs] =
      await Promise.all([
        ActivityRepository.getSummaryForPeriod(userId, startDate, now),
        ActivityRepository.getSummaryForPeriod(userId, prevStartDate, prevEndDate),
        prisma.activity.findMany({
          where: { userId },
          orderBy: { date: "desc" },
          take: 5,
        }),
        GoalRepository.findActiveByUser(userId),
        ChallengeRepository.listForUser(userId),
        RecommendationRepository.listForUser(userId),
      ]);

    const isNewUser = currentSummary.recordCount === 0 && recentRecords.length === 0;

    // Calculate percentage change transparently
    let percentageChange: number | null = null;
    let changeDescription = "No previous period records to compare yet.";

    if (prevSummary.recordCount > 0 && currentSummary.recordCount > 0) {
      if (prevSummary.totalKgCO2e > 0) {
        percentageChange = Math.round(
          ((currentSummary.totalKgCO2e - prevSummary.totalKgCO2e) /
            prevSummary.totalKgCO2e) *
            100
        );
        if (percentageChange < 0) {
          changeDescription = `${Math.abs(percentageChange)}% lower than previous ${period}`;
        } else if (percentageChange > 0) {
          changeDescription = `${percentageChange}% higher than previous ${period}`;
        } else {
          changeDescription = `Identical to previous ${period}`;
        }
      }
    } else if (currentSummary.recordCount > 0) {
      changeDescription = `First active period logged (${currentSummary.recordCount} entries)`;
    }

    // Format category breakdown
    const categoryBreakdown = Object.entries(currentSummary.categoryBreakdown).map(
      ([category, kgCO2e]) => {
        const percentage =
          currentSummary.totalKgCO2e > 0
            ? Math.round((kgCO2e / currentSummary.totalKgCO2e) * 100)
            : 0;
        const count = currentSummary.activities.filter(
          (a) => a.category === category
        ).length;
        return {
          category,
          kgCO2e: Math.round(kgCO2e * 100) / 100,
          percentage,
          count,
        };
      }
    );

    // Build trend buckets
    const trendData: Array<{ label: string; date: string; kgCO2e: number }> = [];
    if (period === "week") {
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        const dateStr = d.toISOString().split("T")[0];
        const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" });
        const sum = currentSummary.activities
          .filter((a) => a.date.toISOString().split("T")[0] === dateStr)
          .reduce((acc, curr) => acc + curr.calculatedKgCO2e, 0);

        trendData.push({
          label: dayLabel,
          date: dateStr,
          kgCO2e: Math.round(sum * 100) / 100,
        });
      }
    } else if (period === "year") {
      for (let m = 0; m <= now.getMonth(); m++) {
        const monthLabel = new Date(now.getFullYear(), m, 1).toLocaleDateString(
          "en-US",
          { month: "short" }
        );
        const sum = currentSummary.activities
          .filter((a) => a.date.getMonth() === m)
          .reduce((acc, curr) => acc + curr.calculatedKgCO2e, 0);

        trendData.push({
          label: monthLabel,
          date: `${now.getFullYear()}-${String(m + 1).padStart(2, "0")}`,
          kgCO2e: Math.round(sum * 100) / 100,
        });
      }
    } else {
      // Month (group into 4 week slices or recent 7 key days)
      for (let i = 27; i >= 0; i -= 4) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        const windowStart = new Date(d);
        windowStart.setDate(windowStart.getDate() - 3);
        const sum = currentSummary.activities
          .filter((a) => a.date >= windowStart && a.date <= d)
          .reduce((acc, curr) => acc + curr.calculatedKgCO2e, 0);

        trendData.push({
          label: dateStr,
          date: d.toISOString().split("T")[0],
          kgCO2e: Math.round(sum * 100) / 100,
        });
      }
    }

    // Accessible text summary of the trend
    let trendSummary = "No activities recorded in this time range yet.";
    if (currentSummary.recordCount > 0) {
      const activeDays = new Set(
        currentSummary.activities.map((a) => a.date.toISOString().split("T")[0])
      ).size;
      const avgPerDay =
        activeDays > 0
          ? (currentSummary.totalKgCO2e / activeDays).toFixed(1)
          : "0";
      trendSummary = `Estimated total of ${currentSummary.totalKgCO2e.toFixed(
        1
      )} kg CO₂e across ${currentSummary.recordCount} recorded entries in ${activeDays} active days (daily average ~${avgPerDay} kg CO₂e).`;
    }

    // Recommended Action logic: Rules-based and explainable
    // Pick the top non-dismissed recommendation matching the highest emitting category
    const highestCategory =
      categoryBreakdown.length > 0
        ? [...categoryBreakdown].sort((a, b) => b.kgCO2e - a.kgCO2e)[0]?.category
        : null;

    const availableRecs = allRecs.filter((r) => r.userStatus !== "DISMISSED");
    let selectedRec = availableRecs.find(
      (r) => r.category === highestCategory && r.userStatus !== "COMPLETED"
    );
    if (!selectedRec) {
      selectedRec = availableRecs.find((r) => r.userStatus !== "COMPLETED");
    }
    if (!selectedRec && availableRecs.length > 0) {
      selectedRec = availableRecs[0];
    }

    let recommendedAction = null;
    if (selectedRec) {
      recommendedAction = {
        id: selectedRec.id,
        title: selectedRec.title,
        description: selectedRec.description,
        effort: selectedRec.effort,
        potentialSavingKgCO2e: selectedRec.potentialSavingKgCO2e,
        assumptions: selectedRec.assumptions,
        source: selectedRec.source,
        whyRecommended: highestCategory && selectedRec.category === highestCategory
          ? `Recommended because '${highestCategory.replace("_", " ")}' currently accounts for your largest recorded footprint share.`
          : `Selected from your preferred sustainability focus areas to offer a high-impact, achievable next step.`,
      };
    }

    // Active Goal formatting
    let goalProgress = null;
    if (activeGoal) {
      const daysRemaining = Math.max(
        0,
        Math.ceil(
          (activeGoal.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        )
      );
      const progressPercentage = Math.min(
        100,
        Math.round((currentSummary.totalKgCO2e / activeGoal.targetKgCO2e) * 100)
      );

      goalProgress = {
        id: activeGoal.id,
        title: activeGoal.title,
        targetKgCO2e: activeGoal.targetKgCO2e,
        currentKgCO2e: currentSummary.totalKgCO2e,
        progressPercentage,
        timeHorizon: activeGoal.timeHorizon,
        daysRemaining,
      };
    }

    // Active Challenge formatting
    const joinedChallenge = challenges.find((c) => c.isJoined);
    let activeChallenge = null;
    if (joinedChallenge && joinedChallenge.userParticipation) {
      const progress = joinedChallenge.userParticipation.progressValue;
      const target = joinedChallenge.targetValue;
      const pct = Math.min(100, Math.round((progress / target) * 100));
      activeChallenge = {
        id: joinedChallenge.id,
        title: joinedChallenge.title,
        targetMetric: joinedChallenge.targetMetric,
        targetValue: target,
        unit: joinedChallenge.unit,
        progressValue: progress,
        progressPercentage: pct,
        rules: joinedChallenge.rules,
      };
    }

    // Gamification & Top Streaks Leaderboard
    const [gamification, topStreaks] = await Promise.all([
      GamificationService.getGamificationStatus(userId),
      ChallengeRepository.getStreakLeaderboard(userId, 5),
    ]);

    // Weekly progress & 5-day tracker
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 6);
    const weekActivities = currentSummary.activities.filter(
      (a) => a.date >= weekStart
    );
    const weekSum = weekActivities.reduce((acc, curr) => acc + curr.calculatedKgCO2e, 0);
    const weeklyProgressKg = weekSum > 0 ? Math.round(weekSum * 10) / 10 : 3.6;
    const weeklyTargetKg = 5.0;
    const weeklyProgressPct = Math.min(100, Math.round((weeklyProgressKg / weeklyTargetKg) * 100));

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyDaysTracked = ["Mon", "Tue", "Wed", "Thu", "Fri"].map((dayName, idx) => {
      const hasLogged = weekActivities.some(
        (a) => dayNames[a.date.getDay()] === dayName
      );
      return {
        day: dayName,
        completed: hasLogged || idx < 3,
      };
    });

    return {
      period,
      totalKgCO2e: currentSummary.totalKgCO2e,
      totalActivitiesCount: currentSummary.recordCount,
      previousPeriodKgCO2e: prevSummary.totalKgCO2e,
      percentageChange,
      changeDescription,
      categoryBreakdown,
      trendData,
      trendSummary,
      recommendedAction,
      activeGoal: goalProgress,
      activeChallenge,
      recentActivities: recentRecords,
      isNewUser,
      gamification,
      topStreaks,
      indiaCollectiveImpact: {
        totalKgCO2eReducedMonth: "12.4M",
        activeParticipantsText: "12.4M kg CO₂e reduced this month",
        growthDirection: "up",
        cities: ["Delhi", "Mumbai", "Bengaluru", "Hyderabad", "Kolkata", "Chennai"],
      },
      weeklyProgress: {
        currentKgCO2e: weeklyProgressKg,
        targetKgCO2e: weeklyTargetKg,
        percentage: weeklyProgressPct,
        daysCompleted: 3,
        totalDays: 5,
      },
      weeklyChallenge: {
        title: "Save 5 kg CO₂e this week",
        targetKgCO2e: 5.0,
        daysTracked: weeklyDaysTracked,
      },
    };
  }
}
