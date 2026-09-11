import { argv } from "node:process";
import { CommandsRegistry, registerCommand, runCommand } from "./commands/commandHandlers.js";
import { handlerLogin, handlerRegister } from "./commands/users.js";

async function main() {
  const registry: CommandsRegistry = {};
  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegister);
  const args = argv.slice(2);

  if (!args.length) {
    console.error("ERROR: No arguments provided");
    process.exit(1);
  }

  const cmdName = args[0];
  const cmdArgs = args.slice(1);
  await runCommand(registry, cmdName, ...cmdArgs);
  process.exit(0);
}

main();
