import { argv } from "node:process";
import { CommandsRegistry, registerCommand, runCommand } from "./commands/commandHandlers.js";
import { handlerLogin } from "./commands/users.js";

function main() {
  const registry: CommandsRegistry = {};
  registerCommand(registry, "login", handlerLogin);
  const args = argv.slice(2);

  if (!args.length) {
    console.error("ERROR: No arguments provided");
    process.exit(1);
  }

  const cmdName = args[0];
  const cmdArgs = args.slice(1);
  runCommand(registry, cmdName, ...cmdArgs);
}

main();
