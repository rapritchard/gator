import { eq, type InferSelectModel } from "drizzle-orm";
import { db } from "../index.js";
import { feeds, users } from "../schema.js";

export type Feed = typeof feeds.$inferSelect;

export async function createFeed(name: string, url: string, userId: string) {
  const [result] = await db
    .insert(feeds)
    .values({ name: name, url: url, user_id: userId })
    .returning();
  return result;
}

export async function getFeeds() {
  return await db
    .select({
      name: feeds.name,
      url: feeds.url,
      userName: users.name,
    })
    .from(feeds)
    .innerJoin(users, eq(users.id, feeds.user_id));
}
