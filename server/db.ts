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
  faqItems,
  InsertFAQItem,
  FAQItem,
  siteSettings,
  InsertSiteSetting,
  SiteSetting,
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
        // Ensure UTF-8 encoding for proper handling of Korean and special characters
        options: '-c client_encoding=UTF8',
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
export async function getAllActivityLogs(options?: {
  limit?: number;
  offset?: number;
  adminId?: number;
  action?: string;
  entityType?: string;
  search?: string;
}) {
  const db = await getDb();
  if (!db) return { logs: [], total: 0 };

  const limit = options?.limit || 50;
  const offset = options?.offset || 0;

  const conditions = [];
  if (options?.adminId) {
    conditions.push(eq(activityLogs.adminId, options.adminId));
  }
  if (options?.action) {
    conditions.push(eq(activityLogs.action, options.action));
  }
  if (options?.entityType) {
    conditions.push(eq(activityLogs.entityType, options.entityType));
  }
  if (options?.search) {
    // Search in details JSON or other fields if needed.
    // For now, let's search in action or entityType if not exact match,
    // or maybe we can cast details to text.
    // Drizzle doesn't support JSON search easily in all drivers, but PG does.
    // Let's stick to simple search for now.
    const search = `%${options.search}%`;
    conditions.push(
      or(
        ilike(activityLogs.action, search),
        ilike(activityLogs.entityType, search),
        // ilike(activityLogs.details, search) // JSONB search is tricky
      )
    );
  }

  const [logs, total] = await Promise.all([
    db
      .select({
        id: activityLogs.id,
        adminId: activityLogs.adminId,
        action: activityLogs.action,
        entityType: activityLogs.entityType,
        entityId: activityLogs.entityId,
        details: activityLogs.details,
        ipAddress: activityLogs.ipAddress,
        userAgent: activityLogs.userAgent,
        createdAt: activityLogs.createdAt,
        adminUsername: adminUsers.username,
      })
      .from(activityLogs)
      .leftJoin(adminUsers, eq(activityLogs.adminId, adminUsers.id))
      .where(and(...conditions))
      .orderBy(desc(activityLogs.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: count() })
      .from(activityLogs)
      .where(and(...conditions))
      .then((res) => res[0]?.count || 0),
  ]);

  return { logs, total };
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

/**
 * Get all admin users
 */
export async function getAllAdminUsers() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select({
      id: adminUsers.id,
      username: adminUsers.username,
      createdAt: adminUsers.createdAt,
    })
    .from(adminUsers)
    .orderBy(desc(adminUsers.createdAt));
}

/**
 * Create a new admin user
 */
export async function createAdminUser(username: string, passwordHash: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db
    .insert(adminUsers)
    .values({
      username,
      passwordHash,
    })
    .returning({
      id: adminUsers.id,
      username: adminUsers.username,
      createdAt: adminUsers.createdAt,
    });

  return result[0];
}

/**
 * Delete an admin user
 */
export async function deleteAdminUser(id: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.delete(adminUsers).where(eq(adminUsers.id, id));
}

/**
 * Update admin user password
 */
export async function updateAdminUserPassword(id: number, passwordHash: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db
    .update(adminUsers)
    .set({ passwordHash })
    .where(eq(adminUsers.id, id));
}

// ============================================================================
// FAQ Management Functions
// ============================================================================

/**
 * Get all published FAQ items for a specific language, ordered by displayOrder
 */
export async function getFAQItemsByLanguage(language: string): Promise<FAQItem[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get FAQ items: database not available");
    return [];
  }

  return await db
    .select()
    .from(faqItems)
    .where(and(eq(faqItems.language, language), eq(faqItems.isPublished, true)))
    .orderBy(faqItems.displayOrder);
}

/**
 * Get all FAQ items (including unpublished) for admin management
 */
export async function getAllFAQItems(): Promise<FAQItem[]> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db
    .select()
    .from(faqItems)
    .orderBy(faqItems.language, faqItems.displayOrder);
}

/**
 * Get FAQ item by ID
 */
export async function getFAQItemById(id: number): Promise<FAQItem | null> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const results = await db
    .select()
    .from(faqItems)
    .where(eq(faqItems.id, id))
    .limit(1);

  return results[0] || null;
}

/**
 * Create a new FAQ item
 */
export async function createFAQItem(data: InsertFAQItem): Promise<FAQItem> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Get the max display order for this language
  const maxOrderResult = await db
    .select({ maxOrder: faqItems.displayOrder })
    .from(faqItems)
    .where(eq(faqItems.language, data.language))
    .orderBy(desc(faqItems.displayOrder))
    .limit(1);

  const nextOrder = (maxOrderResult[0]?.maxOrder ?? -1) + 1;

  const results = await db
    .insert(faqItems)
    .values({
      ...data,
      displayOrder: data.displayOrder ?? nextOrder,
    })
    .returning();

  return results[0];
}

/**
 * Update an existing FAQ item
 */
export async function updateFAQItem(id: number, data: Partial<InsertFAQItem>): Promise<FAQItem> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const results = await db
    .update(faqItems)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(faqItems.id, id))
    .returning();

  if (!results[0]) {
    throw new Error(`FAQ item with id ${id} not found`);
  }

  return results[0];
}

/**
 * Delete a FAQ item
 */
export async function deleteFAQItem(id: number): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.delete(faqItems).where(eq(faqItems.id, id));
}

/**
 * Reorder FAQ items for a specific language
 * @param language - The language code
 * @param itemIds - Array of FAQ item IDs in the desired order
 */
export async function reorderFAQItems(language: string, itemIds: number[]): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Update each item's displayOrder based on its position in the array
  for (let i = 0; i < itemIds.length; i++) {
    await db
      .update(faqItems)
      .set({ displayOrder: i, updatedAt: new Date() })
      .where(and(eq(faqItems.id, itemIds[i]), eq(faqItems.language, language)));
  }
}

/**
 * Toggle publish status of a FAQ item
 */
export async function toggleFAQItemPublish(id: number): Promise<FAQItem> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const item = await getFAQItemById(id);
  if (!item) {
    throw new Error(`FAQ item with id ${id} not found`);
  }

  const results = await db
    .update(faqItems)
    .set({
      isPublished: !item.isPublished,
      updatedAt: new Date(),
    })
    .where(eq(faqItems.id, id))
    .returning();

  return results[0];
}

// ============================================================================
// Site Settings Management Functions
// ============================================================================

/**
 * Get all site settings
 */
export async function getAllSiteSettings(): Promise<SiteSetting[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get site settings: database not available");
    return [];
  }

  return await db.select().from(siteSettings);
}

/**
 * Get a specific site setting by key
 */
export async function getSiteSetting(key: string): Promise<SiteSetting | null> {
  const db = await getDb();
  if (!db) {
    return null;
  }

  const results = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.key, key))
    .limit(1);

  return results[0] || null;
}

/**
 * Update a site setting value
 */
export async function updateSiteSetting(
  key: string,
  value: string,
  updatedBy?: number
): Promise<SiteSetting> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const results = await db
    .update(siteSettings)
    .set({
      value,
      updatedAt: new Date(),
      updatedBy,
    })
    .where(eq(siteSettings.key, key))
    .returning();

  if (!results[0]) {
    throw new Error(`Site setting with key ${key} not found`);
  }

  return results[0];
}

/**
 * Create a new site setting
 */
export async function createSiteSetting(
  data: InsertSiteSetting
): Promise<SiteSetting> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const results = await db.insert(siteSettings).values(data).returning();

  return results[0];
}

// ============================================================================
// Client User Management Functions (CRM)
// ============================================================================

/**
 * Get aggregated list of client users based on unique email addresses
 */
export async function getClientUsersList(options?: {
  page?: number;
  limit?: number;
  search?: string;
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

  const { sql } = await import("drizzle-orm");

  // Build search clause
  const searchClause = options?.search
    ? sql`WHERE c.email ILIKE ${'%' + options.search + '%'} OR c."firstName" ILIKE ${'%' + options.search + '%'} OR c."lastName" ILIKE ${'%' + options.search + '%'}`
    : sql``;

  const sortCol = options?.sortBy === 'submissionCount' ? 'submission_count'
    : options?.sortBy === 'lastSubmission' ? 'last_submission'
      : 'last_submission';

  const sortDir = options?.sortOrder === 'asc' ? sql`ASC` : sql`DESC`;

  const query = sql`
    WITH UserStats AS (
      SELECT 
        c.id as client_id,
        c.email,
        c."firstName" as first_name,
        c."lastName" as last_name,
        COUNT(cs.id) as submission_count,
        MIN(cs."createdAt") as first_submission,
        MAX(cs."createdAt") as last_submission,
        (SELECT status FROM "contactSubmissions" cs2 WHERE cs2.email = c.email ORDER BY "createdAt" DESC LIMIT 1) as latest_status
      FROM clients c
      LEFT JOIN "contactSubmissions" cs ON cs.email = c.email
      ${searchClause}
      GROUP BY c.id, c.email, c."firstName", c."lastName"
    )
    SELECT *, count(*) OVER() as total_count
    FROM UserStats
    ORDER BY ${sql.identifier(sortCol)} ${sortDir}
    LIMIT ${limit} OFFSET ${offset}
  `;

  const result = await db.execute(query);

  const users = result.rows.map(row => ({
    id: Number(row.client_id),
    email: row.email as string,
    firstName: row.first_name as string,
    lastName: row.last_name as string,
    submissionCount: Number(row.submission_count),
    firstSubmission: new Date(row.first_submission as string),
    lastSubmission: new Date(row.last_submission as string),
    latestStatus: row.latest_status as string,
  }));

  const total = result.rows.length > 0 ? Number(result.rows[0].total_count) : 0;

  return { users, total };
}

/**
 * Get full client profile by email
 */
export async function getClientUserByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // 1. Get all submissions
  const submissions = await db
    .select()
    .from(contactSubmissions)
    .where(eq(contactSubmissions.email, email))
    .orderBy(desc(contactSubmissions.createdAt));

  if (submissions.length === 0) {
    return null;
  }

  // 2. Get all invoices
  const { invoices } = await import("../drizzle/schema");
  const clientInvoices = await db
    .select()
    .from(invoices)
    .where(eq(invoices.clientEmail, email))
    .orderBy(desc(invoices.createdAt));

  // 3. Get aggregated stats
  const totalInvoiced = clientInvoices.reduce((sum, inv) => sum + Number(inv.total), 0);
  const outstandingBalance = clientInvoices
    .filter(inv => inv.status === 'sent' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + (Number(inv.total) - Number(inv.paidAmount)), 0);

  // 4. Get latest contact info
  const latestSubmission = submissions[0];
  const contactInfo = {
    firstName: latestSubmission.firstName,
    lastName: latestSubmission.lastName,
    phoneNumber: latestSubmission.phoneNumber,
    street: latestSubmission.street,
    postalCode: latestSubmission.postalCode,
    city: latestSubmission.city,
    country: latestSubmission.country,
  };

  return {
    email,
    contactInfo,
    stats: {
      submissionCount: submissions.length,
      invoiceCount: clientInvoices.length,
      totalInvoiced,
      outstandingBalance,
      firstSeen: submissions[submissions.length - 1].createdAt,
      lastSeen: submissions[0].createdAt,
    },
    submissions,
    invoices: clientInvoices,
  };
}

/**
 * Get full client profile by ID
 */
export async function getClientUserById(id: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const { clients } = await import("../drizzle/schema");

  // 1. Get client record
  const clientResults = await db
    .select()
    .from(clients)
    .where(eq(clients.id, id))
    .limit(1);

  if (clientResults.length === 0) {
    return null;
  }

  const client = clientResults[0];

  // 2. Get all submissions
  const submissions = await db
    .select()
    .from(contactSubmissions)
    .where(eq(contactSubmissions.email, client.email))
    .orderBy(desc(contactSubmissions.createdAt));

  // 3. Get all invoices
  const { invoices } = await import("../drizzle/schema");
  const clientInvoices = await db
    .select()
    .from(invoices)
    .where(eq(invoices.clientEmail, client.email))
    .orderBy(desc(invoices.createdAt));

  // 4. Get aggregated stats
  const totalInvoiced = clientInvoices.reduce((sum, inv) => sum + Number(inv.total), 0);
  const outstandingBalance = clientInvoices
    .filter(inv => inv.status === 'sent' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + (Number(inv.total) - Number(inv.paidAmount)), 0);

  // 5. Get latest contact info from most recent submission or client record
  const latestSubmission = submissions.length > 0 ? submissions[0] : null;
  const contactInfo = {
    firstName: client.firstName || latestSubmission?.firstName || "",
    lastName: client.lastName || latestSubmission?.lastName || "",
    phoneNumber: client.phoneNumber || latestSubmission?.phoneNumber || "",
    street: latestSubmission?.street || "",
    postalCode: latestSubmission?.postalCode || "",
    city: latestSubmission?.city || "",
    country: latestSubmission?.country || "",
  };

  return {
    id: client.id,
    email: client.email,
    contactInfo,
    stats: {
      submissionCount: submissions.length,
      invoiceCount: clientInvoices.length,
      totalInvoiced,
      outstandingBalance,
      firstSeen: submissions.length > 0 ? submissions[submissions.length - 1].createdAt : client.createdAt,
      lastSeen: submissions.length > 0 ? submissions[0].createdAt : client.createdAt,
    },
    submissions,
    invoices: clientInvoices,
  };
}
