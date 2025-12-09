import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { db, getDb } from "../db";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
  db: typeof db; // Keeping type compatibility, though runtime value will be checked
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  // Authentication removed as per user request
  const user: User | null = null;

  // Initialize DB on context creation to ensure it's ready
  const database = await getDb();

  // If DB is not available, we have to pass null/undefined or fallback
  // For strict typing, we might cast it, or better, the procedures handle check
  // But strictly speaking, if db is null, app is broken.

  return {
    req: opts.req,
    res: opts.res,
    user,
    db: database!,
  };
}
