import { readConfig } from "../config.js";
import { createFeed } from "../lib/db/queries/feeds.js";
import { getUserByName } from "../lib/db/queries/users.js";
import { fetchFeed } from "../lib/rss/index.js";
import { printFeed } from "../lib/rss/utils.js";

export async function handlerAgg(cmdName: string, ...args: string[]) {
  if (!args.length) {
    throw new Error(`The ${cmdName} command expects 1 argument: <feedURL>`);
  }

  const feedURL = args[0];

  const rssFeed = await fetchFeed("https://www.wagslane.dev/index.xml");

  console.dir(rssFeed, { depth: null, colors: true });
}

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
  const user = readConfig();

  if (!user?.currentUserName) {
    throw new Error("You must be logged in to add a feed");
  }

  const userData = await getUserByName(user.currentUserName);

  if (!userData) {
    throw new Error(`User ${user.currentUserName} not found`);
  }

  if (args.length < 2) {
    throw new Error(`The ${cmdName} command expects 2 arguments: <name> <url>`);
  }

  const [name, url] = args;

  const feed = await createFeed(name, url, userData.id);
  printFeed(feed, userData);
}
