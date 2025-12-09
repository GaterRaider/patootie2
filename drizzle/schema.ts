import { integer, pgEnum, pgTable, text, timestamp, varchar, boolean, jsonb, decimal, date, unique } from "drizzle-orm/pg-core";

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
  subService: varchar("subService", { length: 100 }),
  subServices: jsonb("subServices").$type<string[] | null>(),
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
  currentResidence: varchar("currentResidence", { length: 100 }),
  preferredLanguage: varchar("preferredLanguage", { length: 50 }),
  message: text("message").notNull(),

  // Consent tracking
  contactConsent: boolean("contactConsent").notNull(),
  privacyConsent: boolean("privacyConsent").notNull(),

  // Metadata
  refId: varchar("refId", { length: 50 }).notNull().unique(),
  status: varchar("status", { length: 20 }).default("new").notNull(),
  submitterIp: varchar("submitterIp", { length: 50 }),
  userAgent: text("userAgent"),
  tags: jsonb("tags").$type<string[]>(),
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
 * Admin login attempts tracking for rate limiting and security auditing
 * Tracks all login attempts (success and failure) by IP address
 */
export const adminLoginAttempts = pgTable("adminLoginAttempts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  ipAddress: varchar("ipAddress", { length: 50 }).notNull(),
  attemptedUsername: varchar("attemptedUsername", { length: 50 }),
  success: boolean("success").notNull(),
  attemptedAt: timestamp("attemptedAt").defaultNow().notNull(),
});

export type AdminLoginAttempt = typeof adminLoginAttempts.$inferSelect;
export type InsertAdminLoginAttempt = typeof adminLoginAttempts.$inferInsert;

/**
 * Admin users for the dashboard
 */
export const adminUsers = pgTable("adminUsers", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  passwordHash: text("passwordHash").notNull(),
  tokenVersion: integer("tokenVersion").default(0).notNull(),
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

/**
 * Internal notes for submissions
 * Allows admins to collaborate on specific cases
 */
export const submissionNotes = pgTable("submissionNotes", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  submissionId: integer("submissionId").references(() => contactSubmissions.id).notNull(),
  adminId: integer("adminId").references(() => adminUsers.id).notNull(),
  note: text("note").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SubmissionNote = typeof submissionNotes.$inferSelect;
export type InsertSubmissionNote = typeof submissionNotes.$inferInsert;

/**
 * Clients table for CRM
 * Central registry of all clients with unique IDs
 */
export const clients = pgTable("clients", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  firstName: varchar("firstName", { length: 100 }),
  lastName: varchar("lastName", { length: 100 }),
  phoneNumber: varchar("phoneNumber", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

/**
 * Company settings for invoices (singleton table)
 */
export const companySettings = pgTable("companySettings", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  companyName: varchar("companyName", { length: 200 }).notNull(),
  address: text("address").notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  taxId: varchar("taxId", { length: 50 }), // Steuernummer
  vatId: varchar("vatId", { length: 50 }), // USt-IdNr
  iban: varchar("iban", { length: 34 }),
  bic: varchar("bic", { length: 11 }),
  bankName: varchar("bankName", { length: 100 }),
  logoUrl: varchar("logoUrl", { length: 500 }),
  defaultCurrency: varchar("defaultCurrency", { length: 3 }).default("EUR").notNull(),
  invoicePrefix: varchar("invoicePrefix", { length: 20 }).default("INV-").notNull(),
  defaultTaxRate: decimal("defaultTaxRate", { precision: 5, scale: 2 }).default("19.00").notNull(),
  paymentTermsDays: integer("paymentTermsDays").default(14).notNull(),
  termsAndConditions: text("termsAndConditions"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type CompanySettings = typeof companySettings.$inferSelect;
export type InsertCompanySettings = typeof companySettings.$inferInsert;

/**
 * Invoices table
 */
export const invoices = pgTable("invoices", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  invoiceNumber: varchar("invoiceNumber", { length: 50 }).notNull().unique(),
  submissionId: integer("submissionId").references(() => contactSubmissions.id),

  // Client information
  clientName: varchar("clientName", { length: 200 }).notNull(),
  clientEmail: varchar("clientEmail", { length: 320 }).notNull(),
  clientAddress: text("clientAddress").notNull(),

  // Dates
  issueDate: date("issueDate").notNull(),
  dueDate: date("dueDate").notNull(),
  serviceDate: date("serviceDate"), // Leistungsdatum

  // Amounts
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  taxRate: decimal("taxRate", { precision: 5, scale: 2 }).notNull(),
  taxAmount: decimal("taxAmount", { precision: 10, scale: 2 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("EUR").notNull(),

  // Status and notes
  status: varchar("status", { length: 20 }).default("draft").notNull(), // draft, sent, paid, overdue, cancelled
  notes: text("notes"),
  termsAndConditions: text("termsAndConditions"),

  // Email tracking
  emailSentAt: timestamp("emailSentAt"),

  // Payment tracking
  paidAt: timestamp("paidAt"),
  paidAmount: decimal("paidAmount", { precision: 10, scale: 2 }).default("0.00").notNull(),

  // Metadata
  createdBy: integer("createdBy").references(() => adminUsers.id).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = typeof invoices.$inferInsert;

/**
 * Invoice line items
 */
export const invoiceItems = pgTable("invoiceItems", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  invoiceId: integer("invoiceId").references(() => invoices.id).notNull(),
  description: text("description").notNull(),
  quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(),
  unitPrice: decimal("unitPrice", { precision: 10, scale: 2 }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(), // quantity * unitPrice
  sortOrder: integer("sortOrder").notNull(),
});

export type InvoiceItem = typeof invoiceItems.$inferSelect;
export type InsertInvoiceItem = typeof invoiceItems.$inferInsert;

/**
 * Payment history for invoices
 */
export const paymentHistory = pgTable("paymentHistory", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  invoiceId: integer("invoiceId").references(() => invoices.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentDate: date("paymentDate").notNull(),
  paymentMethod: varchar("paymentMethod", { length: 50 }).notNull(), // bank_transfer, cash, paypal, other
  reference: varchar("reference", { length: 200 }),
  notes: text("notes"),
  recordedBy: integer("recordedBy").references(() => adminUsers.id).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PaymentHistory = typeof paymentHistory.$inferSelect;
export type InsertPaymentHistory = typeof paymentHistory.$inferInsert;

/**
 * Email templates for dynamic email content
 */
export const emailTemplates = pgTable("emailTemplates", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  templateKey: varchar("templateKey", { length: 100 }).notNull(), // e.g., 'form_submission', 'invoice_creation'
  language: varchar("language", { length: 10 }).notNull(), // 'en' or 'ko'
  subject: text("subject").notNull(),
  senderName: varchar("senderName", { length: 100 }),
  senderEmail: varchar("senderEmail", { length: 320 }),
  htmlContent: text("htmlContent").notNull(),
  textContent: text("textContent"),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  updatedBy: integer("updatedBy").references(() => adminUsers.id),
}, (t) => ({
  uniqueKeyLang: unique().on(t.templateKey, t.language),
}));

export type EmailTemplate = typeof emailTemplates.$inferSelect;
export type InsertEmailTemplate = typeof emailTemplates.$inferInsert;

/**
 * FAQ items for the public website
 * Supports multiple languages with ordering and publish status
 */
export const faqItems = pgTable("faqItems", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  language: varchar("language", { length: 2 }).notNull(), // 'en', 'ko', 'de'
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  displayOrder: integer("displayOrder").notNull().default(0),
  isPublished: boolean("isPublished").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  createdBy: integer("createdBy").references(() => adminUsers.id),
  updatedBy: integer("updatedBy").references(() => adminUsers.id),
});

export type FAQItem = typeof faqItems.$inferSelect;
export type InsertFAQItem = typeof faqItems.$inferInsert;

/**
 * Site settings for toggleable features
 * Key-value store for admin-configurable site options
 */
export const siteSettings = pgTable("siteSettings", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  updatedBy: integer("updatedBy").references(() => adminUsers.id),
});

export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = typeof siteSettings.$inferInsert;

/**
 * Saved filters for submissions page
 * Allows admins to save frequently used filter combinations
 */
export const savedFilters = pgTable("savedFilters", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  adminId: integer("adminId").notNull().references(() => adminUsers.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
  filters: jsonb("filters").$type<{
    search?: string;
    status?: string;
    service?: string;
    tags?: string[];
    dateFrom?: string;
    dateTo?: string;
  }>().notNull(),
  isDefault: boolean("isDefault").notNull().default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type SavedFilter = typeof savedFilters.$inferSelect;
export type InsertSavedFilter = typeof savedFilters.$inferInsert;
