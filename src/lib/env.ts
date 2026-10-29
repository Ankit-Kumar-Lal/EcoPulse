import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 characters long"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  SUPPORT_EMAIL: z.string().email().default("ankitkumarlal2006@gmail.com"),
});

export function validateEnv() {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const formattedErrors = result.error.errors
      .map((err) => `  - ${err.path.join(".")}: ${err.message}`)
      .join("\n");
    console.error(`[Configuration Error] Invalid environment variables:\n${formattedErrors}`);
    throw new Error(`Environment validation failed. Please check your .env configuration.`);
  }
  return result.data;
}

export const env = validateEnv();
