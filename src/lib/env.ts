import { z } from "zod";

const sanitizeString = (val: unknown): string => {
  if (typeof val !== "string") return "";
  let clean = val.trim();
  // Strip single quotes
  if (clean.startsWith("'") && clean.endsWith("'")) {
    clean = clean.substring(1, clean.length - 1);
  }
  // Strip double quotes
  if (clean.startsWith('"') && clean.endsWith('"')) {
    clean = clean.substring(1, clean.length - 1);
  }
  // Strip trailing semicolon
  if (clean.endsWith(";")) {
    clean = clean.substring(0, clean.length - 1);
  }
  return clean.trim();
};

const envSchema = z.object({
  API_BASE_URL: z.string().url().default("https://api.skilldeck.net/api/v1"),
  API_KEY: z.preprocess(
    (val) => sanitizeString(val),
    z.string().default("")
  ),
});

export const env = envSchema.parse({
  API_BASE_URL: "https://api.skilldeck.net/api/v1", // Hardcoded permanently as requested
  API_KEY: process.env.API_KEY,
});
