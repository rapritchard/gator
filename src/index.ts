import { argv } from 'node:process';
import { CommandsRegistry, handlerLogin, registerCommand, runCommand } from "./commandHandlers.js";
import { readConfig, setUser } from "./config.js";

function main() {
  const registry: CommandsRegistry = {};
  registerCommand(registry, "login", handlerLogin);
  const args = argv.slice(2);

  if (!args.length) {
    console.error('ERROR: No arguments provided');
    process.exit(1);
  }

  const cmdName = args[0];
  const cmdArgs = args.slice(1);
  runCommand(registry, cmdName, ...cmdArgs);
}

main();