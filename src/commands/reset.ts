import { deleteAllUsers } from "../lib/db/queries/users.js";

export async function handlerReset(cmdName: string, ...args: string[]) {
  await deleteAllUsers();
  console.info("Database reset successfully!");
}
