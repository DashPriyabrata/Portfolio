import { desc } from "drizzle-orm";

import { db, guestbook } from "../db";

export interface CreateGuestbookEntry {
  name: string;
  message: string;
  website?: string | null;
}

export async function getGuestbookEntries() {
  return db
    .select()
    .from(guestbook)
    .orderBy(desc(guestbook.createdAt));
}

export async function createGuestbookEntry(
  data: CreateGuestbookEntry,
) {
  const [entry] = await db
    .insert(guestbook)
    .values({
      name: data.name.trim().slice(0, 100),
      message: data.message.trim().slice(0, 1000),
      website: data.website?.trim().slice(0, 200) || null,
      createdAt: new Date(),
    })
    .returning();

  return entry;
}