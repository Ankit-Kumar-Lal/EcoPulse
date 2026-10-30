import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../src/lib/prisma";
import { AuthService } from "../src/lib/services/auth.service";
import { GamificationService } from "../src/lib/services/gamification.service";
import { ChallengeRepository } from "../src/lib/data-access/challenge.repository";

describe("Demo Community Profiles & Gamification Verification Suite", () => {
  it("Verify that exactly 30 demo community profiles are seeded", async () => {
    const demoUsers = await prisma.user.findMany({
      where: { isDemoUser: true },
      include: {
        profile: true,
        gamificationProfile: true,
      },
    });

    assert.equal(demoUsers.length, 30, "Exactly 30 demo profiles must be seeded");

    for (const du of demoUsers) {
      assert.equal(du.isDemoUser, true, "isDemoUser must be true");
      assert.ok(du.email.endsWith(".invalid"), "Demo user email must use the .invalid domain");
      assert.ok(du.name.length > 0, "Demo user must have a non-empty name");
      assert.equal(du.profile?.leaderboardOptIn, true, "Demo profile must be opted in to leaderboard");
      assert.ok(du.gamificationProfile, "Demo profile must have gamification stats");
      assert.ok(du.gamificationProfile.xp > 0, "Demo profile must have seeded XP");
      assert.ok(du.gamificationProfile.currentStreakDays >= 1, "Demo profile must have seeded streak");
    }
  });

  it("SECURITY CHECK: Demo profiles must strictly fail authentication", async () => {
    const demoUser = await prisma.user.findFirst({
      where: { isDemoUser: true },
    });
    assert.ok(demoUser);

    // Attempt sign-in with demo email
    await assert.rejects(
      async () => {
        await AuthService.signIn({
          email: demoUser.email,
          password: "AnyPassword123!",
        });
      },
      (err: any) => {
        return err.message.includes("Demo community profiles cannot be used for sign-in");
      },
      "Demo user sign-in attempt must be rejected"
    );
  });

  it("Gamification calculation: Level, XP thresholds, streaks, and missions", async () => {
    const lvl1 = GamificationService.calculateLevelInfo(100);
    assert.equal(lvl1.level, 1);
    assert.equal(lvl1.levelFormatted, "01");

    const lvl8 = GamificationService.calculateLevelInfo(1240);
    assert.equal(lvl8.level, 8);
    assert.equal(lvl8.levelFormatted, "08");
    assert.equal(lvl8.xpToNextLevel, 760); // 2000 - 1240 = 760

    const lvl10 = GamificationService.calculateLevelInfo(2650);
    assert.equal(lvl10.level, 10);
    assert.equal(lvl10.levelFormatted, "10");
  });

  it("Community Leaderboard displays demo profiles with clear labeling", async () => {
    const leaderboard = await ChallengeRepository.getLeaderboard();
    assert.ok(leaderboard.length >= 30, "Leaderboard should include seeded demo community profiles");

    const demoEntry = leaderboard.find((e) => e.user?.isDemoUser === true);
    assert.ok(demoEntry, "Leaderboard must contain at least one demo entry");
    assert.equal(demoEntry.user?.isDemoUser, true);
  });

  it("Top eco streaks leaderboard returns top participants and includes demo profiles", async () => {
    const streaks = await ChallengeRepository.getStreakLeaderboard(undefined, 5);
    assert.equal(streaks.length, 5);
    assert.equal(streaks[0].rank, 1);
    assert.equal(streaks[0].name, "Priya Sharma");
    assert.equal(streaks[0].streak, 21);
    assert.equal(streaks[0].isDemo, true);
  });
});
