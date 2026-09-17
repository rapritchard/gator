import { createFeedFollow, getFeedFollowsForUser } from "../lib/db/queries/feedFollows.js";
import { getFeed } from "../lib/db/queries/feeds.js";
import { type User } from "../lib/db/queries/users.js";

export async function handlerFollow(cmdName: string, user: User, ...args: string[]) {
  if (!args.length) {
    throw new Error(`The ${cmdName} command expects 1 argument: <feedURL>`);
  }

  const [url] = args;

  const feed = await getFeed(url);

  if (!feed) {
    throw new Error(`No feed found for the given URL: ${url}`);
  }

  const feedFollow = await createFeedFollow(user.id, feed.id);

  if (!feedFollow) {
    throw new Error("Failed to create feed follow: no record returned");
  }

  console.dir(feedFollow);
}

export async function handlerFollowing(cmdName: string, user: User, ...args: string[]) {
  const results = await getFeedFollowsForUser(user.id);

  if (!results) {
    throw new Error(`User ${user.name} follows no feeds`);
  }

  console.log(`Feeds ${user.name} follows:`);
  for (const r of results) {
    console.log(` - ${r.name}`);
  }
}
