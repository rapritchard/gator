import { readConfig } from "../config.js";
import { createFeedFollow, getFeedFollowsForUser } from "../lib/db/queries/feedFollows.js";
import { getFeed } from "../lib/db/queries/feeds.js";
import { getUserByName } from "../lib/db/queries/users.js";

export async function handlerFollow(cmdName: string, ...args: string[]) {
  const user = readConfig();

  if (!user?.currentUserName) {
    throw new Error("You must be logged in to add a feed");
  }

  const userData = await getUserByName(user.currentUserName);

  if (!userData) {
    throw new Error(`User ${user.currentUserName} not found`);
  }

  if (!args.length) {
    throw new Error(`The ${cmdName} command expects 1 argument: <feedURL>`);
  }

  const [url] = args;

  const feed = await getFeed(url);

  if (!feed) {
    throw new Error(`No feed found for the given URL: ${url}`);
  }

  const feedFollow = await createFeedFollow(userData.id, feed.id);

  if (!feedFollow) {
    throw new Error("Failed to create feed follow: no record returned");
  }

  console.dir(feedFollow);
}

export async function handlerFollowing(cmdName: string, ...args: string[]) {
  const user = readConfig();

  if (!user?.currentUserName) {
    throw new Error("You must be logged in to add a feed");
  }

  const userData = await getUserByName(user.currentUserName);

  if (!userData) {
    throw new Error(`User ${user.currentUserName} not found`);
  }

  const results = await getFeedFollowsForUser(userData.id);

  if (!results) {
    throw new Error(`User ${userData.name} follows no feeds`);
  }

  console.log(`Feeds ${userData.name} follows:`);
  for (const r of results) {
    console.log(` - ${r.name}`);
  }
}
