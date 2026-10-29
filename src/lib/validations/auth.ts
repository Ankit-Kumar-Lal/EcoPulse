import { z } from "zod";

export const signUpSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(80, "Name cannot exceed 80 characters"),
  email: z
    .string()
    .email("Please provide a valid email address")
    .max(120, "Email cannot exceed 120 characters")
    .toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password cannot exceed 100 characters")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
  acceptTerms: z.literal(true, {
    errorMap: () => ({
      message: "You must accept the Terms of Service and Privacy Policy to continue.",
    }),
  }),
});

export const signInSchema = z.object({
  email: z.string().email("Please provide a valid email address").toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please provide a valid email address").toLowerCase(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password cannot exceed 100 characters")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
