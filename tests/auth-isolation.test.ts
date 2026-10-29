import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../src/lib/prisma";
import { UserRepository } from "../src/lib/data-access/user.repository";
import { ActivityRepository } from "../src/lib/data-access/activity.repository";
import { calculateFootprint } from "../src/lib/calculations/calculator";

describe("Database & Authorization Security Suite", () => {
  let userAId: string;
  let userBId: string;
  let userAActivityId: string;

  before(async () => {
    // Clean up any previous test accounts
    await prisma.user.deleteMany({
      where: {
        email: { in: ["test-user-a@ecopulse.test", "test-user-b@ecopulse.test"] },
      },
    });

    const userA = await UserRepository.createUser({
      name: "User Alpha",
      email: "test-user-a@ecopulse.test",
      passwordHash: "mockHashA123!",
    });
    userAId = userA.id;

    const userB = await UserRepository.createUser({
      name: "User Beta",
      email: "test-user-b@ecopulse.test",
      passwordHash: "mockHashB456!",
    });
    userBId = userB.id;
  });

  after(async () => {
    await prisma.user.deleteMany({
      where: {
        id: { in: [userAId, userBId] },
      },
    });
    await prisma.$disconnect();
  });

  it("User A can record an activity with calculated footprint", async () => {
    const calc = calculateFootprint({
      category: "HOME_ENERGY",
      activityType: "electricity_grid",
      amount: 150,
      unit: "kWh",
      region: "IN",
    });

    const activity = await ActivityRepository.create(
      userAId,
      {
        category: "HOME_ENERGY",
        activityType: "electricity_grid",
        amount: 150,
        unit: "kWh",
        date: new Date().toISOString(),
        note: "October bill",
      },
      calc
    );

    assert.ok(activity.id);
    assert.equal(activity.userId, userAId);
    assert.equal(activity.calculatedKgCO2e, 107.4);
    userAActivityId = activity.id;
  });

  it("STRICT ISOLATION: User B CANNOT read User A's activity record", async () => {
    const attemptedRead = await ActivityRepository.findByIdAndUser(
      userAActivityId,
      userBId
    );
    assert.equal(attemptedRead, null, "User B must not be able to read User A's activity");
  });

  it("STRICT ISOLATION: User B CANNOT modify User A's activity record", async () => {
    const calc = calculateFootprint({
      category: "HOME_ENERGY",
      activityType: "electricity_grid",
      amount: 5,
      unit: "kWh",
    });

    const attemptedUpdate = await ActivityRepository.update(
      userAActivityId,
      userBId,
      {
        category: "HOME_ENERGY",
        activityType: "electricity_grid",
        amount: 5,
        unit: "kWh",
        date: new Date().toISOString(),
      },
      calc
    );

    assert.equal(attemptedUpdate, null, "User B must not be able to update User A's activity");
  });

  it("STRICT ISOLATION: User B CANNOT delete User A's activity record", async () => {
    const attemptedDelete = await ActivityRepository.delete(
      userAActivityId,
      userBId
    );
    assert.equal(attemptedDelete, false, "User B must not be able to delete User A's activity");

    // Verify record still exists
    const stillExists = await ActivityRepository.findByIdAndUser(
      userAActivityId,
      userAId
    );
    assert.ok(stillExists, "User A's record must still be intact");
  });

  it("ACCOUNT DELETION CASCADE: deleting User A removes all personal records", async () => {
    await UserRepository.deleteUserPermanently(userAId);

    const deletedUser = await prisma.user.findUnique({ where: { id: userAId } });
    assert.equal(deletedUser, null, "User record must be removed");

    const orphanedActivities = await prisma.activity.findMany({
      where: { userId: userAId },
    });
    assert.equal(orphanedActivities.length, 0, "All activities must be cascaded on deletion");

    const orphanedProfile = await prisma.profile.findUnique({
      where: { userId: userAId },
    });
    assert.equal(orphanedProfile, null, "Profile must be cascaded on deletion");
  });

  it("User B's account and isolation remains unaffected by User A's deletion", async () => {
    const userB = await UserRepository.findById(userBId);
    assert.ok(userB, "User B must still exist");
    assert.equal(userB?.email, "test-user-b@ecopulse.test");
  });
});
