import { setUser } from "../config.js";

export function handlerLogin(cmdName: string, ...args: string[]) {
  if (!args.length) {
    throw new Error(`The ${cmdName} command expects 1 argument: <username>`);
  }
  const username = args[0];
  setUser(username);
  console.info(`INFO: username set to ${username}`);
}
