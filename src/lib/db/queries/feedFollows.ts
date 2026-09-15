import { eq, type InferSelectModel } from "drizzle-orm";
import { db } from "../index.js";
import { feedFollows, feeds, users } from "../schema.js";

export async function createFeedFollow(userId: string, feedId: string) {
  const [newFeedFollow] = await db
    .insert(feedFollows)
    .values({ user_id: userId, feed_id: feedId })
    .returning();

  const [result] = await db
    .select({
      id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAt: feedFollows.updatedAt,
      feed: {
        name: feeds.name,
        url: feeds.url,
      },
      userName: users.name,
    })
    .from(feedFollows)
    .innerJoin(users, eq(users.id, feedFollows.user_id))
    .innerJoin(feeds, eq(feeds.id, feedFollows.feed_id))
    .where(eq(feedFollows.id, newFeedFollow.id));

  return result;
}

export async function getFeedFollowsForUser(userId: string) {
  const result = await db
    .select({
      name: feeds.name,
      url: feeds.url,
      userName: users.name,
    })
    .from(feedFollows)
    .innerJoin(users, eq(users.id, feedFollows.user_id))
    .innerJoin(feeds, eq(feeds.id, feedFollows.feed_id))
    .where(eq(feedFollows.user_id, userId));

  return result;
}
