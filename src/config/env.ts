// import "dotenv/config";

export const env = {
  tursoUrl: (import.meta.env.TURSO_DATABASE_URL || process.env.TURSO_DATABASE_URL)!,
  tursoAuthToken: (import.meta.env.TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN)!,
};