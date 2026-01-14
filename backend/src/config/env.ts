import dotenv from "dotenv";

dotenv.config();

/**
 * Centralized environment variable access.
 * Fails fast if required variables are missing.
 */
const getEnv = (key: string, required = true): string => {
  const value = process.env[key];

  if (!value && required) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }

  return value as string;
};

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(getEnv("PORT", false)) || 4000,

  MONGODB_URI: getEnv("MONGODB_URI"),

  // Placeholders for future modules
  GMAIL_CLIENT_ID: getEnv("GMAIL_CLIENT_ID", false),
  GMAIL_CLIENT_SECRET: getEnv("GMAIL_CLIENT_SECRET", false),
  GMAIL_REFRESH_TOKEN: getEnv("GMAIL_REFRESH_TOKEN", false),

  AI_PROVIDER: getEnv("AI_PROVIDER", false)
};
