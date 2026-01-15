import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  MONGODB_URI: string;

  // Gmail
  GMAIL_CLIENT_ID: string;
  GMAIL_CLIENT_SECRET: string;
  GMAIL_REFRESH_TOKEN: string;

  // AI
  AI_PROVIDER: "OPENAI" | "LLAMA";

  OLLAMA_API_URL?: string;
  OLLAMA_MODEL?: string;

   OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
}

/**
 * Helper to require env variables
 */
const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const env: EnvConfig = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 4000),
  MONGODB_URI: requireEnv("MONGODB_URI"),

  // Gmail
  GMAIL_CLIENT_ID: requireEnv("GMAIL_CLIENT_ID"),
  GMAIL_CLIENT_SECRET: requireEnv("GMAIL_CLIENT_SECRET"),
  GMAIL_REFRESH_TOKEN: requireEnv("GMAIL_REFRESH_TOKEN"),

  // AI
  AI_PROVIDER: (process.env.AI_PROVIDER as "OPENAI" | "LLAMA") || "LLAMA",

  OLLAMA_API_URL: process.env.OLLAMA_API_URL,
  OLLAMA_MODEL: process.env.OLLAMA_MODEL,

  OPENAI_API_KEY: requireEnv("OPENAI_API_KEY"),
  OPENAI_MODEL: process.env.OPENAI_MODEL || "gpt-4o-mini"
};
