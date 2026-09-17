import { type UserCommandHandler, type CommandHandler } from "../../commands/commandHandlers.js";
import { readConfig } from "../../config.js";
import { getUserByName } from "../db/queries/users.js";

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
  return async (cmdName: string, ...args: string[]) => {
    const user = readConfig();

    if (!user?.currentUserName) {
      throw new Error("You must be logged in to add a feed");
    }

    const userData = await getUserByName(user.currentUserName);

    if (!userData) {
      throw new Error(`User ${user.currentUserName} not found`);
    }

    await handler(cmdName, userData, ...args);
  };
}
