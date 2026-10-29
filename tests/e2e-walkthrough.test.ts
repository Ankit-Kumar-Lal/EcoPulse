import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../src/lib/prisma";
import { AuthService } from "../src/lib/services/auth.service";
import { ActivityService } from "../src/lib/services/activity.service";
import { DashboardService } from "../src/lib/services/dashboard.service";
import { UserRepository } from "../src/lib/data-access/user.repository";
import { GoalRepository } from "../src/lib/data-access/goal.repository";
import { ChallengeRepository } from "../src/lib/data-access/challenge.repository";
import { RecommendationRepository } from "../src/lib/data-access/recommendation.repository";

describe("EcoPulse End-to-End User Journey & Audit Suite", () => {
  let testUserId: string;
  let testUserEmail = "test-e2e-journey@ecopulse.test";
  let verificationToken: string;

  before(async () => {
    await prisma.user.deleteMany({
      where: { email: testUserEmail },
    });
  });

  after(async () => {
    await prisma.user.deleteMany({
      where: { email: testUserEmail },
    });
    await prisma.$disconnect();
  });

  it("Step 1: Sign up user with terms acceptance", async () => {
    const result = await AuthService.signUp({
      name: "Ankit Lal",
      email: testUserEmail,
      password: "StrongPassword2026!",
      acceptTerms: true,
    });

    assert.ok(result.user.id);
    assert.equal(result.user.email, testUserEmail);
    assert.ok(result.verificationToken);
    testUserId = result.user.id;
    verificationToken = result.verificationToken;
  });

  it("Step 2: Verify user email with time-limited token", async () => {
    const verifyResult = await AuthService.verifyEmail(verificationToken);
    assert.equal(verifyResult.success, true);

    const updatedUser = await UserRepository.findById(testUserId);
    assert.ok(updatedUser?.emailVerifiedAt, "User emailVerifiedAt must be set");
  });

  it("Step 3: Complete onboarding questionnaire", async () => {
    const updatedProfile = await UserRepository.updateProfile(testUserId, {
      region: "IN",
      units: "metric",
      householdSize: 2,
      focusAreas: ["HOME_ENERGY", "TRANSPORT"],
    });

    assert.equal(updatedProfile.region, "IN");
    assert.equal(updatedProfile.units, "metric");
    assert.equal(updatedProfile.householdSize, 2);
  });

  it("Step 4: Record activities across all 5 tracked categories", async () => {
    // 1. Home Energy (Electricity India Grid)
    const actEnergy = await ActivityService.addActivity(testUserId, {
      category: "HOME_ENERGY",
      activityType: "electricity_grid",
      amount: 120,
      unit: "kWh",
      date: new Date().toISOString(),
      note: "Oct electricity bill",
    });
    // 120 * 0.716 = 85.92
    assert.equal(actEnergy.calculatedKgCO2e, 85.92);

    // 2. Transport (Petrol car)
    const actTransport = await ActivityService.addActivity(testUserId, {
      category: "TRANSPORT",
      activityType: "car_petrol",
      amount: 40,
      unit: "km",
      date: new Date().toISOString(),
      note: "Client commute",
    });
    // 40 * 0.171 = 6.84
    assert.equal(actTransport.calculatedKgCO2e, 6.84);

    // 3. Food (Vegetarian meals)
    const actFood = await ActivityService.addActivity(testUserId, {
      category: "FOOD",
      activityType: "meal_vegetarian",
      amount: 10,
      unit: "meals",
      date: new Date().toISOString(),
    });
    // 10 * 0.85 = 8.5
    assert.equal(actFood.calculatedKgCO2e, 8.5);

    // 4. Water (Tap water)
    const actWater = await ActivityService.addActivity(testUserId, {
      category: "WATER",
      activityType: "water_tap",
      amount: 1000,
      unit: "litres",
      date: new Date().toISOString(),
    });
    // 1000 * 0.000344 = 0.34
    assert.equal(actWater.calculatedKgCO2e, 0.34);

    // 5. Waste (Recycled)
    const actWaste = await ActivityService.addActivity(testUserId, {
      category: "WASTE",
      activityType: "waste_recycled",
      amount: 5,
      unit: "kg",
      date: new Date().toISOString(),
    });
    // 5 * 0.021 = 0.11
    assert.equal(actWaste.calculatedKgCO2e, 0.11);
  });

  it("Step 5: Dashboard aggregates metrics accurately and generates accessible trends", async () => {
    const metrics = await DashboardService.getMetrics(testUserId, "month");

    // Total: 85.92 + 6.84 + 8.5 + 0.34 + 0.11 = 101.71
    assert.equal(metrics.totalKgCO2e, 101.71);
    assert.equal(metrics.totalActivitiesCount, 5);
    assert.equal(metrics.isNewUser, false);
    assert.ok(metrics.categoryBreakdown.length >= 5);
    assert.ok(metrics.trendSummary.includes("101.7 kg CO₂e"));
  });

  it("Step 6: Goal setting and tracking", async () => {
    const goal = await GoalRepository.create(testUserId, {
      title: "Keep Monthly Footprint Under 150 kg",
      category: null,
      targetKgCO2e: 150,
      timeHorizon: "monthly",
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 86400000).toISOString(),
    });

    assert.ok(goal.id);
    assert.equal(goal.targetKgCO2e, 150);

    const activeGoal = await GoalRepository.findActiveByUser(testUserId);
    assert.ok(activeGoal);
    assert.equal(activeGoal?.id, goal.id);
  });

  it("Step 7: Action recommendations update lifecycle", async () => {
    const recs = await RecommendationRepository.listForUser(testUserId);
    assert.ok(recs.length > 0);

    const firstRec = recs[0];
    await RecommendationRepository.updateStatus(
      testUserId,
      firstRec.id,
      "COMPLETED"
    );

    const updatedRecs = await RecommendationRepository.listForUser(testUserId);
    const completedRec = updatedRecs.find((r) => r.id === firstRec.id);
    assert.equal(completedRec?.userStatus, "COMPLETED");
  });

  it("Step 8: Join challenge and update progress", async () => {
    const challenges = await ChallengeRepository.listAll();
    assert.ok(challenges.length > 0);

    const targetChallenge = challenges[0];
    await ChallengeRepository.join(
      targetChallenge.id,
      testUserId,
      "Ankit L.",
      true // Opted in to leaderboard
    );

    await ChallengeRepository.updateProgress(targetChallenge.id, testUserId, 3);

    const userChallenges = await ChallengeRepository.listForUser(testUserId);
    const joined = userChallenges.find((c) => c.id === targetChallenge.id);
    assert.equal(joined?.isJoined, true);
    assert.equal(joined?.userParticipation?.progressValue, 3);
  });

  it("Step 9: Opted-in member appears on Community Leaderboard", async () => {
    const leaderboard = await ChallengeRepository.getLeaderboard();
    assert.ok(leaderboard.length > 0);

    const foundEntry = leaderboard.find((e) => e.displayName === "Ankit L.");
    assert.ok(foundEntry, "User Ankit L. must appear on the community leaderboard");
    assert.equal(foundEntry.progressValue, 3);
  });

  it("Step 10: Generate structured CSV Export with data dictionary", async () => {
    const csv = await ActivityService.generateCsvExport(testUserId);
    assert.ok(csv.includes("EcoPulse Personal Carbon Activity Export"));
    assert.ok(csv.includes("CEA-v19.0-2024"));
    assert.ok(csv.includes("electricity_grid"));
    assert.ok(csv.includes("85.92"));
  });

  it("Step 11: Export full JSON account archive", async () => {
    const archive = await UserRepository.exportUserData(testUserId);
    assert.equal(archive.user?.email, testUserEmail);
    assert.equal(archive.activities.length, 5);
    assert.equal(archive.goals.length, 1);
  });

  it("Step 12: Account deletion permanently cascades across all records", async () => {
    await UserRepository.deleteUserPermanently(testUserId);

    const user = await UserRepository.findById(testUserId);
    assert.equal(user, null);

    const remainingActivities = await prisma.activity.findMany({
      where: { userId: testUserId },
    });
    assert.equal(remainingActivities.length, 0);

    const remainingParticipations = await prisma.challengeParticipant.findMany({
      where: { userId: testUserId },
    });
    assert.equal(remainingParticipations.length, 0);
  });
});
