import { createFeed, getFeeds } from "../lib/db/queries/feeds.js";
import { getPostsForUser } from "../lib/db/queries/posts.js";
import { type User } from "../lib/db/queries/users.js";
import { fetchFeed, scrapeFeeds } from "../lib/rss/index.js";
import { formatDuration, parseDuration, printFeed } from "../lib/rss/utils.js";

export async function handlerAgg(cmdName: string, ...args: string[]) {
  if (!args.length) {
    throw new Error(`The ${cmdName} command expects 1 argument: <time_between_reqs>`);
  }

  const duration = args[0];
  const requestInterval = parseDuration(duration);

  console.log(`Collecting feeds every ${formatDuration(requestInterval)}`);

  const handleError = (err: unknown) => {
    if (err instanceof Error) {
      console.error(`Error aggregating feed: ${err.message}`);
    } else {
      console.error(`Error aggregating feed: ${err}`);
    }
  };

  scrapeFeeds().catch(handleError);

  const interval = setInterval(() => {
    scrapeFeeds().catch(handleError);
  }, requestInterval);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down feed aggregator...");
      clearInterval(interval);
      resolve();
    });
  });
}

export async function handlerBrowse(cmdName: string, user: User, ...args: string[]) {
  let limit = 2;

  if (args.length) {
    if (Number.isNaN(Number(args[0]))) {
      throw new Error(`The ${cmdName} command expects argument <limit> to be a number`);
    }
    limit = Number(args[0]);
  }

  const posts = await getPostsForUser(user.id, limit);

  for (const post of posts) {
    const publishedAt = new Date(post.publishedAt);
    console.log(` - ${post.feedName} | ${post.title}`);
    console.log(`  - ${publishedAt.toLocaleString()}`);
    if (post.description) {
      console.log(`  - ${post.description}`);
    }
  }
}

export async function handlerFeeds(cmdName: string, ...args: string[]) {
  const feeds = await getFeeds();

  if (!feeds.length) {
    throw new Error("No feeds found");
  }

  for (const feed of feeds) {
    console.dir(feed);
  }
}

export async function handlerAddFeed(cmdName: string, user: User, ...args: string[]) {
  if (args.length < 2) {
    throw new Error(`The ${cmdName} command expects 2 arguments: <name> <url>`);
  }

  const [name, url] = args;

  const feed = await createFeed(name, url, user.id);
  if (!feed) {
    throw new Error("Failed to create feed: no record returned");
  }
  printFeed(feed, user);
}
