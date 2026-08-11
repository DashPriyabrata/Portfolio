import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const guestbook = sqliteTable("guestbook", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  name: text("name").notNull(),

  message: text("message").notNull(),

  website: text("website"),

  createdAt: integer("created_at", {
    mode: "timestamp",
  }).notNull(),
});