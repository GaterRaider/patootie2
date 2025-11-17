// server/db.ts
// Hybrid database adapter that works with both MySQL (Manus) and PostgreSQL (self-hosted)

import { drizzle } from "drizzle-orm/node-postgres";
import { drizzle as mysqlDrizzle } from "drizzle-orm/mysql2";
import { eq, and, gt } from "drizzle-orm";
import { Pool } from "pg";
import mysql from "mysql2/promise";
import {
  InsertUser,
  users,
  contactSubmissions,
  InsertContactSubmission,
  submissionRateLimits,
  InsertSubmissionRateLimit,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

console.log("DATABASE_URL from env:", process.env.DATABASE_URL);

let pool: Pool | null = null;
let mysqlPool: mysql.Pool | null = null;
let _db: any = null;
let dbType: "postgresql" | "mysql" | null = null;

// Detect database type from connection string
function detectDbType(connectionString: string): "postgresql" | "mysql" {
  if (connectionString.includes("mysql://") || connectionString.includes("tidb://")) {
    return "mysql";
  }
  return "postgresql";
}

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.warn("[Database] DATABASE_URL is not set");
      return null;
    }

    try {
      dbType = detectDbType(connectionString);
      console.log("[Database] Detected database type:", dbType);

      if (dbType === "postgresql") {
        pool = new Pool({
          connectionString,
          // Needed for many managed Postgres providers that enforce SSL
          ssl: {
            rejectUnauthorized: false,
          },
        });
        _db = drizzle(pool);
      } else {
        // MySQL/TiDB
        mysqlPool = await mysql.createPool({
          uri: connectionString,
        });
        _db = mysqlDrizzle(mysqlPool);
      }
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }

  return _db;
}

/**
 * Upsert user by openId
 */
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    if (dbType === "postgresql") {
      // PostgreSQL upsert using onConflict
      await db
        .insert(users)
        .values(values)
        .onConflictDoUpdate({
          target: users.openId,
          set: updateSet,
        });
    } else {
      // MySQL upsert using onDuplicateKeyUpdate
      await db.insert(users).values(values).onDuplicateKeyUpdate({
        set: updateSet,
      });
    }
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

/**
 * Get user by openId
 */
export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Create a new contact form submission
 */
export async function createContactSubmission(
  submission: InsertContactSubmission,
) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(contactSubmissions).values(submission);
  return result;
}

/**
 * Check if email and IP combination is rate limited
 * Returns true if they can submit (NOT rate limited)
 */
export async function checkRateLimit(
  email: string,
  ipAddress: string,
): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    // If DB is unavailable, fail open (allow submission)
    return true;
  }

  // Example: 60-second rate limit window
  const WINDOW_MS = 60 * 1000;
  const now = new Date();
  const cutoff = new Date(now.getTime() - WINDOW_MS);

  try {
    const rows = await db
      .select()
      .from(submissionRateLimits)
      .where(
        and(
          eq(submissionRateLimits.email, email),
          eq(submissionRateLimits.ipAddress, ipAddress),
          gt(submissionRateLimits.lastSubmission, cutoff),
        ),
      )
      .limit(1);

    // If there is a row newer than cutoff -> user is rate limited
    const isRateLimited = rows.length > 0;
    return !isRateLimited;
  } catch (error) {
    console.error("[RateLimit] Failed to check rate limit:", error);
    // On error, don't block the user from submitting (or switch this to false if you prefer strict)
    return true;
  }
}

/**
 * Record a submission attempt (upsert by email + IP)
 */
export async function recordSubmissionAttempt(
  email: string,
  ipAddress: string,
): Promise<void> {
  const db = await getDb();
  if (!db) {
    return;
  }

  const now = new Date();

  try {
    if (dbType === "postgresql") {
      await db
        .insert(submissionRateLimits)
        .values({
          email,
          ipAddress,
          lastSubmission: now,
          createdAt: now,
        })
        .onConflictDoUpdate({
          target: [
            submissionRateLimits.email,
            submissionRateLimits.ipAddress,
          ],
          set: {
            lastSubmission: now,
          },
        });
    } else {
      // MySQL doesn't support composite unique constraints in the same way
      // Try to update first, then insert if not found
      await db
        .insert(submissionRateLimits)
        .values({
          email,
          ipAddress,
          lastSubmission: now,
          createdAt: now,
        })
        .onDuplicateKeyUpdate({
          set: {
            lastSubmission: now,
          },
        });
    }
  } catch (error) {
    console.error("[RateLimit] Failed to record submission attempt:", error);
    // Don't rethrow here so the form submission itself can still succeed
  }
}

/**
 * Get all contact submissions (admin only)
 */
export async function getAllContactSubmissions() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db
    .select()
    .from(contactSubmissions)
    .orderBy(contactSubmissions.createdAt);
}
