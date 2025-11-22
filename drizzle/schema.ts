import { integer, pgEnum, pgTable, text, timestamp, varchar, boolean, jsonb } from "drizzle-orm/pg-core";

/**
 * Define enum for user roles
 */
export const roleEnum = pgEnum("role", ["user", "admin"]);

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = pgTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Contact form submissions table
 * Stores all inquiries from potential clients
 */
export const contactSubmissions = pgTable("contactSubmissions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  // Service and personal information
  service: varchar("service", { length: 100 }).notNull(),
  salutation: varchar("salutation", { length: 50 }).notNull(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  dateOfBirth: varchar("dateOfBirth", { length: 20 }).notNull(),

  // Contact information
  email: varchar("email", { length: 320 }).notNull(),
  phoneNumber: varchar("phoneNumber", { length: 50 }).notNull(),

  // Address information
  street: varchar("street", { length: 200 }).notNull(),
  addressLine2: varchar("addressLine2", { length: 200 }),
  postalCode: varchar("postalCode", { length: 20 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  stateProvince: varchar("stateProvince", { length: 100 }),
  country: varchar("country", { length: 100 }).notNull(),

  // Additional information
  currentResidence: varchar("currentResidence", { length: 100 }).notNull(),
  preferredLanguage: varchar("preferredLanguage", { length: 50 }).notNull(),
  message: text("message").notNull(),

  // Consent tracking
  contactConsent: boolean("contactConsent").notNull(),
  privacyConsent: boolean("privacyConsent").notNull(),

  // Metadata
  refId: varchar("refId", { length: 50 }).notNull().unique(),
  status: varchar("status", { length: 20 }).default("new").notNull(),
  submitterIp: varchar("submitterIp", { length: 50 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = typeof contactSubmissions.$inferInsert;

/**
 * Rate limiting table for form submissions
 * Prevents spam by tracking submission attempts
 */
export const submissionRateLimits = pgTable("submissionRateLimits", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  email: varchar("email", { length: 320 }).notNull(),
  ipAddress: varchar("ipAddress", { length: 50 }).notNull(),
  lastSubmission: timestamp("lastSubmission").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SubmissionRateLimit = typeof submissionRateLimits.$inferSelect;
export type InsertSubmissionRateLimit = typeof submissionRateLimits.$inferInsert;

/**
 * Admin users for the dashboard
 */
export const adminUsers = pgTable("adminUsers", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  passwordHash: text("passwordHash").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = typeof adminUsers.$inferInsert;

/**
 * Activity logs for admin actions
 * Tracks who did what, when, and from where
 */
export const activityLogs = pgTable("activityLogs", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  adminId: integer("adminId").references(() => adminUsers.id),
  action: varchar("action", { length: 50 }).notNull(),
  entityType: varchar("entityType", { length: 50 }).notNull(),
  entityId: integer("entityId"),
  details: jsonb("details"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = typeof activityLogs.$inferInsert;
