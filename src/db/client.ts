import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import { env } from "../config/env";

const url = process.env.TURSO_DATABASE_URL || env.tursoUrl;
const authToken = process.env.TURSO_AUTH_TOKEN || env.tursoAuthToken;

if (!url) {
  throw new Error("TURSO_DATABASE_URL is missing at runtime");
}

if (!authToken) {
  throw new Error("TURSO_AUTH_TOKEN is missing at runtime");
}

const client = createClient({
  url,
  authToken,
});

export const db = drizzle(client);