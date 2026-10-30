import { prisma } from "../prisma";
import { hashPassword, verifyPassword } from "../auth/password";
import {
  createSession,
  createVerificationToken,
  destroySession,
} from "../auth/session";
import { UserRepository } from "../data-access/user.repository";
import { AuditRepository } from "../data-access/audit.repository";
import {
  SignUpInput,
  SignInInput,
  ResetPasswordInput,
} from "../validations/auth";

export class AuthService {
  static async signUp(input: SignUpInput) {
    const existing = await UserRepository.findByEmail(input.email);
    if (existing) {
      throw new Error("An account with this email address already exists.");
    }

    const passwordHash = await hashPassword(input.password);
    const user = await UserRepository.createUser({
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      passwordHash,
    });

    const verificationToken = await createVerificationToken(user.id);

    await AuditRepository.log("SIGN_UP", "SUCCESS", user.id, {
      email: user.email,
    });

    // Automatically create session so user is logged in
    await createSession(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerifiedAt: user.emailVerifiedAt,
      },
      verificationToken,
    };
  }

  static async signIn(input: SignInInput) {
    const user = await UserRepository.findByEmail(input.email);
    if (!user) {
      await AuditRepository.log("SIGN_IN", "FAILED", null, {
        email: input.email,
        reason: "USER_NOT_FOUND",
      });
      throw new Error("Invalid email or password.");
    }

    if (user.isDemoUser) {
      await AuditRepository.log("SIGN_IN", "FAILED", user.id, {
        reason: "DEMO_USER_LOGIN_BLOCKED",
      });
      throw new Error("Demo community profiles cannot be used for sign-in.");
    }

    const isValid = await verifyPassword(input.password, user.passwordHash);
    if (!isValid) {
      await AuditRepository.log("SIGN_IN", "FAILED", user.id, {
        reason: "INVALID_PASSWORD",
      });
      throw new Error("Invalid email or password.");
    }

    await createSession(user.id);
    await AuditRepository.log("SIGN_IN", "SUCCESS", user.id);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerifiedAt: user.emailVerifiedAt,
      profile: user.profile,
    };
  }

  static async verifyEmail(token: string) {
    const record = await prisma.verificationToken.findFirst({
      where: {
        token,
        type: "EMAIL_VERIFICATION",
        usedAt: null,
      },
      include: { user: true },
    });

    if (!record) {
      throw new Error("Verification token is invalid or has already been used.");
    }

    if (record.expiresAt < new Date()) {
      throw new Error("Verification token has expired. Please request a new verification email.");
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        data: { emailVerifiedAt: new Date() },
      }),
      prisma.verificationToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
    ]);

    await AuditRepository.log("VERIFY_EMAIL", "SUCCESS", record.userId);
    return { success: true };
  }

  static async requestPasswordReset(email: string) {
    const user = await UserRepository.findByEmail(email);
    // Generic response regardless of whether user exists to prevent account enumeration
    if (!user || user.isDemoUser) {
      return { success: true, message: "If an account exists, a reset link has been issued." };
    }

    // Invalidate previous reset tokens
    await prisma.verificationToken.deleteMany({
      where: { userId: user.id, type: "PASSWORD_RESET" },
    });

    const resetToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await prisma.verificationToken.create({
      data: {
        userId: user.id,
        token: resetToken,
        type: "PASSWORD_RESET",
        expiresAt,
      },
    });

    await AuditRepository.log("REQUEST_PASSWORD_RESET", "SUCCESS", user.id);

    return {
      success: true,
      resetToken, // Returned for testing / development link flow
      message: "If an account exists, a reset link has been issued.",
    };
  }

  static async resetPassword(input: ResetPasswordInput) {
    const record = await prisma.verificationToken.findFirst({
      where: {
        token: input.token,
        type: "PASSWORD_RESET",
        usedAt: null,
      },
    });

    if (!record) {
      throw new Error("Password reset link is invalid or has expired.");
    }

    if (record.expiresAt < new Date()) {
      throw new Error("Password reset link has expired.");
    }

    const passwordHash = await hashPassword(input.password);
    await UserRepository.updatePassword(record.userId, passwordHash);

    await prisma.verificationToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    });

    await AuditRepository.log("RESET_PASSWORD", "SUCCESS", record.userId);

    return { success: true };
  }

  static async signOut() {
    await destroySession();
  }
}
