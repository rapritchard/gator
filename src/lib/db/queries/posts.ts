import { desc, eq, getTableColumns } from "drizzle-orm";
import { db } from "../index.js";
import { feedFollows, feeds, posts, users } from "../schema.js";
import { firstOrUndefined } from "../utils.js";

export async function createPost(
  title: string,
  url: string,
  publishedAt: Date,
  feedId: string,
  description?: string,
) {
  const [result] = await db
    .insert(posts)
    .values({
      title: title,
      url: url,
      publishedAt: publishedAt,
      feedId: feedId,
      ...(description && { description: description }),
    })
    .onConflictDoNothing()
    .returning();

  return result;
}

export async function getPostsForUser(userId: string, limit: number) {
  return await db
    .select({
      ...getTableColumns(posts),
      feedName: feeds.name,
    })
    .from(posts)
    .innerJoin(feedFollows, eq(posts.feedId, feedFollows.feedId))
    .innerJoin(feeds, eq(posts.feedId, feeds.id))
    .where(eq(feedFollows.userId, userId))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
}
