import { XMLParser } from "fast-xml-parser";
import type { RSSFeed, RSSItem } from "./types.js";

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
  const feedData = await fetch(feedURL, {
    method: "GET",
    headers: {
      "User-Agent": "gator",
    },
  });

  if (!feedData.ok) {
    throw new Error(`Error fetching RSS feed from: ${feedURL} `);
  }

  const parser = new XMLParser({
    processEntities: false,
  });
  const feedText = await feedData.text();
  const result = parser.parse(feedText);

  if (!result?.rss.channel) {
    throw new Error("No channel in fetched RSS feed");
  }

  const { channel } = result.rss;

  if (
    !(channel.title && typeof channel.title === "string") ||
    !(channel.link && typeof channel.link === "string") ||
    !(channel.description && typeof channel.description === "string")
  ) {
    throw new Error("RSS Feed data invalid");
  }

  const items: any[] = Array.isArray(channel.item) ? channel.item : [channel.item];

  const rssItems: RSSItem[] = [];

  for (const rawItem of items) {
    const { title, link, description, pubDate } = rawItem as Record<string, unknown>;
    if (
      !(title && typeof title === "string") ||
      !(link && typeof link === "string") ||
      !(description && typeof description === "string") ||
      !(pubDate && typeof pubDate === "string")
    ) {
      continue;
    }

    rssItems.push({
      title,
      link,
      description,
      pubDate,
    });
  }

  const rssFeed: RSSFeed = {
    channel: {
      title: channel.title,
      link: channel.link,
      description: channel.description,
      item: rssItems,
    },
  };

  return rssFeed;
}
