import { fetchFeed } from "../lib/rss/index.js";

export async function handlerAgg(cmdName: string, ...args: string[]) {
  // if (!args.length) {
  //   throw new Error(`The ${cmdName} command expects 1 argument: <feedURL>`);
  // }

  // const feedURL = args[0];

  const rssFeed = await fetchFeed("https://www.wagslane.dev/index.xml");

  console.dir(rssFeed, { depth: null, colors: true });
}
