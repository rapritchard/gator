import { setUser } from "../config.js";
import { createUser, getUserByName } from "../lib/db/queries/users.js";

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (!args.length) {
    throw new Error(`The ${cmdName} command expects 1 argument: <username>`);
  }
  const username = args[0];
  const user = await getUserByName(username);

  if (!user) {
    throw new Error(`user '${username}' does not exist`);
  }

  setUser(username);
  console.info(`INFO: username set to ${username}`);
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
  if (!args.length) {
    throw new Error(`The ${cmdName} command expects 1 argument: <name>`);
  }

  const name = args[0];

  try {
    const userData = await createUser(name);
    setUser(userData.name);
    console.info(`INFO: User '${name}' was created.`);
    console.dir(userData, { depth: null, colors: true });
  } catch (e) {
    throw new Error(`a user already exists with the username '${name}'`);
  }
}
