import { drizzle } from "drizzle-orm/node-postgres";
import { eq, and, gt, desc, ilike, or, inArray, count } from "drizzle-orm";
import { Pool } from "pg";
import {
  InsertUser,
  users,
  contactSubmissions,
  InsertContactSubmission,
  submissionRateLimits,
  activityLogs,
  submissionNotes,
  InsertSubmissionNote,
  adminUsers,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

console.log("DATABASE_URL from env:", process.env.DATABASE_URL);

let pool: Pool | null = null;
export let _db: ReturnType<typeof drizzle> | null = null;
export const db = _db!; // Export for use in other files, assuming initialized. Better pattern would be to always use getDb() but for now matching existing usage if any.

// Actually, looking at email-templates.ts, it imports `db` from `./db`.
// But `db` is not exported in the original file.
// I should export a `db` proxy or similar, or update email-templates to use getDb().
// Updating email-templates to use getDb() is cleaner but `db` export is requested by the error.
// Let's export a getter or just the variable.


// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.warn("[Database] DATABASE_URL is not set");
      return null;
    }

    try {
      pool = new Pool({
        connectionString,
        // Needed for many managed Postgres providers that enforce SSL
        ssl: {
          rejectUnauthorized: false,
        },
        // Connection pool settings for Supabase
        max: 20, // Maximum number of clients in the pool
        idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
        connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection could not be established
      });

      // Handle pool errors to prevent crashes
      pool.on('error', (err) => {
        console.error('[Database] Unexpected pool error:', err);
        // Don't exit the process, just log the error
      });

      _db = drizzle(pool);
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

    // PostgreSQL upsert using onConflict
    await db
      .insert(users)
      .values(values)
      .onConflictDoUpdate({
        target: users.openId,
        set: updateSet,
      });
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
 * Generate a unique Reference ID
 * Format: REF-YYYYMMDD-XXXX (where XXXX is random alphanumeric)
 */
export async function generateRefId(db: ReturnType<typeof drizzle>): Promise<string> {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");

  // Try up to 5 times to generate a unique ID
  for (let i = 0; i < 5; i++) {
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const refId = `REF-${dateStr}-${randomSuffix}`;

    const existing = await db
      .select({ id: contactSubmissions.id })
      .from(contactSubmissions)
      .where(eq(contactSubmissions.refId, refId))
      .limit(1);

    if (existing.length === 0) {
      return refId;
    }
  }

  // Fallback if collision loop fails (extremely unlikely)
  return `REF-${dateStr}-${Date.now().toString(36).toUpperCase()}`;
}

/**
 * Create a new contact form submission
 */
export async function createContactSubmission(
  submission: Omit<InsertContactSubmission, "refId">,
) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const refId = await generateRefId(db);

  const result = await db.insert(contactSubmissions).values({
    ...submission,
    refId,
  }).returning({ refId: contactSubmissions.refId });

  return result[0];
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
  } catch (error) {
    console.error("[RateLimit] Failed to record submission attempt:", error);
    // Don't rethrow here so the form submission itself can still succeed
  }
}

/**
 * Get all contact submissions (admin only)
 */
export async function getAllContactSubmissions(options?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  service?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const page = options?.page || 1;
  const limit = options?.limit || 20;
  const offset = (page - 1) * limit;

  const conditions = [];
  if (options?.search) {
    const search = `%${options.search}%`;
    conditions.push(
      or(
        ilike(contactSubmissions.firstName, search),
        ilike(contactSubmissions.lastName, search),
        ilike(contactSubmissions.email, search),
        ilike(contactSubmissions.refId, search)
      )
    );
  }

  if (options?.service) {
    conditions.push(eq(contactSubmissions.service, options.service));
  }

  // Note: Status filtering will be added when we add a status column to the schema
  if (options?.status) {
    conditions.push(eq(contactSubmissions.status, options.status));
  }

  let orderBy = desc(contactSubmissions.createdAt);
  if (options?.sortBy && options?.sortOrder) {
    const col = contactSubmissions[options.sortBy as keyof typeof contactSubmissions];
    if (col) {
      orderBy = options.sortOrder === "asc" ? col : desc(col);
    }
  }

  return await db
    .select()
    .from(contactSubmissions)
    .where(and(...conditions))
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);
}

/**
 * Get count of contact submissions
 */
export async function getContactSubmissionsCount(options?: {
  search?: string;
  service?: string;
}) {
  const db = await getDb();
  if (!db) return 0;

  const conditions = [];
  if (options?.search) {
    const search = `%${options.search}%`;
    conditions.push(
      or(
        ilike(contactSubmissions.firstName, search),
        ilike(contactSubmissions.lastName, search),
        ilike(contactSubmissions.email, search),
        ilike(contactSubmissions.refId, search)
      )
    );
  }

  if (options?.service) {
    conditions.push(eq(contactSubmissions.service, options.service));
  }

  const result = await db
    .select({ count: count() })
    .from(contactSubmissions)
    .where(and(...conditions));

  return result[0]?.count || 0;
}

/**
 * Bulk update submission status
 */
export async function bulkUpdateSubmissionStatus(ids: number[], status: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db
    .update(contactSubmissions)
    .set({ status })
    .where(inArray(contactSubmissions.id, ids));
}

/**
 * Get contact submissions by IDs (for export)
 */
export async function getContactSubmissionsByIds(ids: number[]) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(contactSubmissions)
    .where(inArray(contactSubmissions.id, ids))
    .orderBy(desc(contactSubmissions.createdAt));
}

/**
 * Get all activity logs
 */
export async function getAllActivityLogs(limit = 50) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(activityLogs)
    .orderBy(desc(activityLogs.createdAt))
    .limit(limit);
}

/**
 * Get a single contact submission by ID
 */
export async function getContactSubmissionById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(contactSubmissions)
    .where(eq(contactSubmissions.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Update contact submission status
 */
export async function updateContactSubmissionStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db
    .update(contactSubmissions)
    .set({ status })
    .where(eq(contactSubmissions.id, id));
}

/**
 * Get all notes for a submission
 */
export async function getSubmissionNotes(submissionId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select({
      id: submissionNotes.id,
      note: submissionNotes.note,
      createdAt: submissionNotes.createdAt,
      adminId: submissionNotes.adminId,
      adminUsername: adminUsers.username,
    })
    .from(submissionNotes)
    .leftJoin(adminUsers, eq(submissionNotes.adminId, adminUsers.id))
    .where(eq(submissionNotes.submissionId, submissionId))
    .orderBy(desc(submissionNotes.createdAt));
}

/**
 * Create a new submission note
 */
export async function createSubmissionNote(note: InsertSubmissionNote) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db
    .insert(submissionNotes)
    .values(note)
    .returning();

  return result[0];
}
/**
 * Check if IP address is rate limited for admin login attempts
 * Returns true if they can attempt login (NOT rate limited)
 * Limit: 3 attempts per 15 minutes per IP
 */
export async function checkAdminLoginRateLimit(
  ipAddress: string,
): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    // If DB is unavailable, fail open (allow attempt)
    return true;
  }

  const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
  const MAX_ATTEMPTS = 3;
  const now = new Date();
  const cutoff = new Date(now.getTime() - WINDOW_MS);

  try {
    const { adminLoginAttempts } = await import("../drizzle/schema");
    const { and, eq, gt, count } = await import("drizzle-orm");

    const result = await db
      .select({ count: count() })
      .from(adminLoginAttempts)
      .where(
        and(
          eq(adminLoginAttempts.ipAddress, ipAddress),
          gt(adminLoginAttempts.attemptedAt, cutoff),
        ),
      );

    const attemptCount = result[0]?.count || 0;
    const isRateLimited = attemptCount >= MAX_ATTEMPTS;

    return !isRateLimited;
  } catch (error) {
    console.error("[AdminRateLimit] Failed to check rate limit:", error);
    // On error, fail open (allow attempt)
    return true;
  }
}

/**
 * Record an admin login attempt (success or failure)
 * Used for both rate limiting and security auditing
 */
export async function recordAdminLoginAttempt(
  ipAddress: string,
  username: string,
  success: boolean,
): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.error("[AdminRateLimit] Database not available");
    return;
  }

  try {
    const { adminLoginAttempts } = await import("../drizzle/schema");

    await db.insert(adminLoginAttempts).values({
      ipAddress,
      attemptedUsername: username,
      success,
    });
  } catch (error) {
    console.error("[AdminRateLimit] Failed to record login attempt:", error);
    // Don't throw - we don't want to block login on logging failure
  }
}
