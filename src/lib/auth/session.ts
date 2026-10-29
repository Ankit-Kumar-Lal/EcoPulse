import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "../prisma";

const SESSION_COOKIE_NAME = "ecopulse_session";
const SESSION_MAX_AGE_DAYS = 30;

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  emailVerifiedAt: Date | null;
  profile: {
    region: string;
    units: string;
    householdSize: number;
    focusAreas: string[];
    initialGoal: string | null;
    leaderboardOptIn: boolean;
  } | null;
}

/**
 * Creates a new persistent session in the database and sets an httpOnly cookie.
 */
export async function createSession(userId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_MAX_AGE_DAYS);

  await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });

  try {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });
  } catch {
    // Graceful fallback when executed outside Next.js request scope (e.g. test suites)
  }

  return token;
}

/**
 * Resolves current session from cookies and returns the authenticated user.
 */
export async function getSession(): Promise<AuthenticatedUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return null;
    }

    const session = await prisma.session.findUnique({
      where: { token },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!session) {
      return null;
    }

    // Check expiration
    if (session.expiresAt < new Date()) {
      await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
      return null;
    }

    const { user } = session;
    let focusAreas: string[] = [];
    try {
      if (user.profile?.focusAreas) {
        focusAreas = JSON.parse(user.profile.focusAreas);
      }
    } catch {
      focusAreas = [];
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerifiedAt: user.emailVerifiedAt,
      profile: user.profile
        ? {
            region: user.profile.region,
            units: user.profile.units,
            householdSize: user.profile.householdSize,
            focusAreas,
            initialGoal: user.profile.initialGoal,
            leaderboardOptIn: user.profile.leaderboardOptIn,
          }
        : null,
    };
  } catch (error) {
    console.error("[Session Error]", error);
    return null;
  }
}

/**
 * Ensures a request has a valid authenticated session.
 */
export async function requireUser(): Promise<AuthenticatedUser> {
  const user = await getSession();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

/**
 * Destroys current session and removes cookie.
 */
export async function destroySession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (token) {
      await prisma.session.delete({ where: { token } }).catch(() => {});
      cookieStore.delete(SESSION_COOKIE_NAME);
    }
  } catch (error) {
    console.error("[Logout Error]", error);
  }
}

/**
 * Generates an email verification token.
 */
export async function createVerificationToken(userId: string): Promise<string> {
  const token = crypto.randomBytes(24).toString("hex");
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24); // 24-hour validity

  await prisma.verificationToken.create({
    data: {
      userId,
      token,
      type: "EMAIL_VERIFICATION",
      expiresAt,
    },
  });

  return token;
}

/**
 * Generates a password reset token.
 */
export async function createPasswordResetToken(userId: string): Promise<string> {
  const token = crypto.randomBytes(24).toString("hex");
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1); // 1-hour validity

  await prisma.verificationToken.create({
    data: {
      userId,
      token,
      type: "PASSWORD_RESET",
      expiresAt,
    },
  });

  return token;
}
