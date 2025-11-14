import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Contact form submissions table
 * Stores all inquiries from potential clients
 */
export const contactSubmissions = mysqlTable("contactSubmissions", {
  id: int("id").autoincrement().primaryKey(),
  
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
export const submissionRateLimits = mysqlTable("submissionRateLimits", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  ipAddress: varchar("ipAddress", { length: 50 }).notNull(),
  lastSubmission: timestamp("lastSubmission").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SubmissionRateLimit = typeof submissionRateLimits.$inferSelect;
export type InsertSubmissionRateLimit = typeof submissionRateLimits.$inferInsert;
