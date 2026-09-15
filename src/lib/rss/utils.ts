import type { Feed } from "../db/queries/feeds.js";
import type { User } from "../db/queries/users.js";

export function printFeed(feed: Feed, user: User) {
  console.log("Feed:");
  console.dir(feed);
  console.log("-----------");
  console.log("User:");
  console.dir(user);
}
