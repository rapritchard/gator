import type { Feed } from "../db/queries/feeds.js";
import type { User } from "../db/queries/users.js";

export function printFeed(feed: Feed, user: User) {
  console.log("Feed:");
  console.dir(feed);
  console.log("-----------");
  console.log("User:");
  console.dir(user);
}

const MS_PER_UNIT = {
  ms: 1,
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
} as const;

type DurationUnit = keyof typeof MS_PER_UNIT;

const DURATION_REGEX = /^(\d+)(ms|s|m|h)$/;

export function parseDuration(durationStr: string): number {
  const match = durationStr.match(DURATION_REGEX);

  if (!match) {
    throw new Error(`Invalid duration: "${durationStr}"`);
  }

  const [, valueStr, unit] = match;
  const value = Number(valueStr);

  if (value === 0) {
    throw new Error(`Invalid duration: "${durationStr}" (must be greater than 0)`);
  }

  return value * MS_PER_UNIT[unit as DurationUnit];
}

export function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms <= 0) {
    throw new Error(`Invalid duration: ${ms}ms`);
  }

  let remaining = Math.floor(ms);

  const hours = Math.floor(remaining / MS_PER_UNIT.h);
  remaining -= hours * MS_PER_UNIT.h;

  const minutes = Math.floor(remaining / MS_PER_UNIT.m);
  remaining -= minutes * MS_PER_UNIT.m;

  const seconds = Math.floor(remaining / MS_PER_UNIT.s);
  remaining -= seconds * MS_PER_UNIT.s;

  const parts: string[] = [];
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0 || hours > 0) {
    parts.push(`${minutes}m`);
  }
  parts.push(`${seconds}s`);
  if (remaining > 0) {
    parts.push(`${remaining}ms`);
  }

  return parts.join("");
}
