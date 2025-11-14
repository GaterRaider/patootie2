import { eq, and, gt } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, contactSubmissions, InsertContactSubmission, submissionRateLimits, InsertSubmissionRateLimit } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

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
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Create a new contact form submission
 */
export async function createContactSubmission(submission: InsertContactSubmission) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(contactSubmissions).values(submission);
  return result;
}

/**
 * Check if email and IP combination is rate limited
 * Returns true if they can submit (not rate limited)
 */
export async function checkRateLimit(email: string, ipAddress: string): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    // If DB is unavailable, allow submission
    return true;
  }

  const thirtySecondsAgo = new Date(Date.now() - 30 * 1000);

  const recentSubmissions = await db
    .select()
    .from(submissionRateLimits)
    .where(
      and(
        eq(submissionRateLimits.email, email),
        eq(submissionRateLimits.ipAddress, ipAddress),
        gt(submissionRateLimits.lastSubmission, thirtySecondsAgo)
      )
    )
    .limit(1);

  return recentSubmissions.length === 0;
}

/**
 * Record a submission attempt for rate limiting
 */
export async function recordSubmissionAttempt(email: string, ipAddress: string) {
  const db = await getDb();
  if (!db) {
    return;
  }

  await db.insert(submissionRateLimits).values({
    email,
    ipAddress,
    lastSubmission: new Date(),
  });
}

/**
 * Get all contact submissions (admin only)
 */
export async function getAllContactSubmissions() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db.select().from(contactSubmissions).orderBy(contactSubmissions.createdAt);
}
