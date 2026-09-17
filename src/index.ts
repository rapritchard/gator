import { argv } from "node:process";
import { CommandsRegistry, registerCommand, runCommand } from "./commands/commandHandlers.js";
import { handlerFollow, handlerFollowing, handlerUnfollow } from "./commands/follow.js";
import { handlerReset } from "./commands/reset.js";
import { handlerAddFeed, handlerAgg, handlerFeeds } from "./commands/rss.js";
import { handlerLogin, handlerRegister, handlerUsers } from "./commands/users.js";
import { middlewareLoggedIn } from "./lib/middleware/loggedIn.js";

async function main() {
  const args = argv.slice(2);

  if (!args.length) {
    console.error("ERROR: No arguments provided");
    process.exit(1);
  }

  const cmdName = args[0];
  const cmdArgs = args.slice(1);
  const commandsRegistry: CommandsRegistry = {};

  registerCommand(commandsRegistry, "login", handlerLogin);
  registerCommand(commandsRegistry, "register", handlerRegister);
  registerCommand(commandsRegistry, "reset", handlerReset);
  registerCommand(commandsRegistry, "users", handlerUsers);
  registerCommand(commandsRegistry, "agg", handlerAgg);
  registerCommand(commandsRegistry, "addfeed", middlewareLoggedIn(handlerAddFeed));
  registerCommand(commandsRegistry, "feeds", handlerFeeds);
  registerCommand(commandsRegistry, "follow", middlewareLoggedIn(handlerFollow));
  registerCommand(commandsRegistry, "following", middlewareLoggedIn(handlerFollowing));
  registerCommand(commandsRegistry, "unfollow", middlewareLoggedIn(handlerUnfollow));

  try {
    await runCommand(commandsRegistry, cmdName, ...cmdArgs);
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error running command ${cmdName}: ${err.message}`);
    } else {
      console.error(`Error running command ${cmdName}: ${err}`);
    }
    process.exit(1);
  }
  process.exit(0);
}

main();
