import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { users } from "../schema.js";
import { firstOrUndefined } from "../utils.js";

export async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
}

export async function getUserByName(name: string) {
  const result = await db.select().from(users).where(eq(users.name, name));
  return firstOrUndefined(result);
}

export async function deleteAllUsers() {
  return await db.delete(users).returning();
}

export async function getAllUsers() {
  return await db.select().from(users);
}
