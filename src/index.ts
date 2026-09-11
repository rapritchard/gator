import { argv } from "node:process";
import { CommandsRegistry, registerCommand, runCommand } from "./commands/commandHandlers.js";
import { handlerLogin, handlerRegister } from "./commands/users.js";

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
