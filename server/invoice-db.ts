import { drizzle } from "drizzle-orm/node-postgres";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";
import { getDb } from "./db";
import {
    companySettings,
    InsertCompanySettings,
    invoices,
    InsertInvoice,
    invoiceItems,
    InsertInvoiceItem,
    paymentHistory,
    InsertPaymentHistory,
    contactSubmissions,
} from "../drizzle/schema";

/**
 * Get company settings (singleton)
 */
export async function getCompanySettings() {
    const db = await getDb();
    if (!db) return null;

    const result = await db
        .select()
        .from(companySettings)
        .limit(1);

    return result.length > 0 ? result[0] : null;
}

/**
 * Update or create company settings
 */
export async function upsertCompanySettings(settings: Partial<InsertCompanySettings>) {
    const db = await getDb();
    if (!db) {
        throw new Error("Database not available");
    }

    const existing = await getCompanySettings();

    if (existing) {
        const result = await db
            .update(companySettings)
            .set({ ...settings, updatedAt: new Date() })
            .where(eq(companySettings.id, existing.id))
            .returning();
        return result[0];
    } else {
        const result = await db
            .insert(companySettings)
            .values(settings as InsertCompanySettings)
            .returning();
        return result[0];
    }
}

/**
 * Generate invoice number in format INV-YYYY-NNN
 * Resets counter annually
 */
export async function generateInvoiceNumber(sourceRefId?: string): Promise<string> {
    const db = await getDb();
    if (!db) {
        throw new Error("Database not available");
    }

    if (sourceRefId) {
        // Use the reference ID but replace REF with INV
        // Handle case where sourceRefId might not start with REF- just in case
        return sourceRefId.startsWith('REF-')
            ? sourceRefId.replace('REF-', 'INV-')
            : `INV-${sourceRefId}`;
    }

    // Generate a new ID in format INV-YYYYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");

    // Try up to 5 times to generate a unique ID
    for (let i = 0; i < 5; i++) {
        const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
        const invoiceNumber = `INV-${dateStr}-${randomSuffix}`;

        const existing = await db
            .select({ id: invoices.id })
            .from(invoices)
            .where(eq(invoices.invoiceNumber, invoiceNumber))
            .limit(1);

        if (existing.length === 0) {
            return invoiceNumber;
        }
    }

    return `INV-${dateStr}-${Date.now().toString(36).toUpperCase()}`;
}

/**
 * Create invoice with items
 */
export async function createInvoice(
    invoice: Omit<InsertInvoice, "invoiceNumber">,
    items: Omit<InsertInvoiceItem, "invoiceId" | "sortOrder">[],
    sourceRefId?: string
) {
    const db = await getDb();
    if (!db) {
        throw new Error("Database not available");
    }

    let refIdToUse = sourceRefId;

    // If no sourceRefId provided but we have a submissionId, try to fetch the submission's refId
    if (!refIdToUse && invoice.submissionId) {
        const [submission] = await db
            .select({ refId: contactSubmissions.refId })
            .from(contactSubmissions)
            .where(eq(contactSubmissions.id, invoice.submissionId))
            .limit(1);

        if (submission) {
            refIdToUse = submission.refId;
        }
    }

    const invoiceNumber = await generateInvoiceNumber(refIdToUse);

    // Insert invoice
    const [newInvoice] = await db
        .insert(invoices)
        .values({ ...invoice, invoiceNumber })
        .returning();

    // Insert items
    if (items.length > 0) {
        await db.insert(invoiceItems).values(
            items.map((item, index) => ({
                ...item,
                invoiceId: newInvoice.id,
                sortOrder: index,
            }))
        );
    }

    return newInvoice;
}

/**
 * Get invoice by ID with items
 */
export async function getInvoiceById(id: number) {
    const db = await getDb();
    if (!db) return null;

    const [invoice] = await db
        .select()
        .from(invoices)
        .where(eq(invoices.id, id))
        .limit(1);

    if (!invoice) return null;

    const items = await db
        .select()
        .from(invoiceItems)
        .where(eq(invoiceItems.invoiceId, id))
        .orderBy(invoiceItems.sortOrder);

    return { ...invoice, items };
}

/**
 * Get all invoices with pagination and filtering
 */
export async function getAllInvoices(options?: {
    page?: number;
    limit?: number;
    status?: string;
    clientName?: string;
    startDate?: string;
    endDate?: string;
}) {
    const db = await getDb();
    if (!db) return [];

    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (options?.status) {
        conditions.push(eq(invoices.status, options.status));
    }

    if (options?.clientName) {
        conditions.push(sql`${invoices.clientName} ILIKE ${'%' + options.clientName + '%'}`);
    }

    if (options?.startDate) {
        conditions.push(gte(invoices.issueDate, options.startDate));
    }

    if (options?.endDate) {
        conditions.push(lte(invoices.issueDate, options.endDate));
    }

    return await db
        .select()
        .from(invoices)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(invoices.createdAt))
        .limit(limit)
        .offset(offset);
}

/**
 * Update invoice
 */
export async function updateInvoice(id: number, updates: Partial<InsertInvoice>) {
    const db = await getDb();
    if (!db) {
        throw new Error("Database not available");
    }

    const result = await db
        .update(invoices)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(invoices.id, id))
        .returning();

    return result[0];
}

/**
 * Update invoice items
 */
export async function updateInvoiceItems(
    invoiceId: number,
    items: Omit<InsertInvoiceItem, "invoiceId">[]
) {
    const db = await getDb();
    if (!db) {
        throw new Error("Database not available");
    }

    // Delete existing items
    await db.delete(invoiceItems).where(eq(invoiceItems.invoiceId, invoiceId));

    // Insert new items
    if (items.length > 0) {
        await db.insert(invoiceItems).values(
            items.map((item, index) => ({
                ...item,
                invoiceId,
                sortOrder: index,
            }))
        );
    }
}

/**
 * Delete invoice
 */
export async function deleteInvoice(id: number) {
    const db = await getDb();
    if (!db) {
        throw new Error("Database not available");
    }

    // Delete items first (foreign key constraint)
    await db.delete(invoiceItems).where(eq(invoiceItems.invoiceId, id));

    // Delete payments
    await db.delete(paymentHistory).where(eq(paymentHistory.invoiceId, id));

    // Delete invoice
    await db.delete(invoices).where(eq(invoices.id, id));
}

/**
 * Add payment to invoice
 */
export async function addPayment(payment: InsertPaymentHistory) {
    const db = await getDb();
    if (!db) {
        throw new Error("Database not available");
    }

    const [newPayment] = await db
        .insert(paymentHistory)
        .values(payment)
        .returning();

    // Update invoice paid amount
    const payments = await getInvoicePayments(payment.invoiceId);
    const totalPaid = payments.reduce((sum: number, p: any) => sum + parseFloat(p.amount), 0);

    const invoice = await getInvoiceById(payment.invoiceId);
    if (invoice) {
        const total = parseFloat(invoice.total);
        const updates: Partial<InsertInvoice> = {
            paidAmount: totalPaid.toString(),
        };

        // Update status based on payment
        if (totalPaid >= total) {
            updates.status = "paid";
            updates.paidAt = new Date();
        }

        await updateInvoice(payment.invoiceId, updates);
    }

    return newPayment;
}

/**
 * Get all payments for an invoice
 */
export async function getInvoicePayments(invoiceId: number) {
    const db = await getDb();
    if (!db) return [];

    return await db
        .select()
        .from(paymentHistory)
        .where(eq(paymentHistory.invoiceId, invoiceId))
        .orderBy(desc(paymentHistory.paymentDate));
}

/**
 * Get invoice count
 */
export async function getInvoicesCount(options?: {
    status?: string;
    clientName?: string;
    startDate?: string;
    endDate?: string;
}) {
    const db = await getDb();
    if (!db) return 0;

    const conditions = [];

    if (options?.status) {
        conditions.push(eq(invoices.status, options.status));
    }

    if (options?.clientName) {
        conditions.push(sql`${invoices.clientName} ILIKE ${'%' + options.clientName + '%'}`);
    }

    if (options?.startDate) {
        conditions.push(gte(invoices.issueDate, options.startDate));
    }

    if (options?.endDate) {
        conditions.push(lte(invoices.issueDate, options.endDate));
    }

    const result = await db
        .select({ count: sql<number>`count(*)` })
        .from(invoices)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

    return result[0]?.count || 0;
}

/**
 * Create invoice from submission
 */
export async function createInvoiceFromSubmission(
    submissionId: number,
    invoiceData: Partial<InsertInvoice>,
    items: Omit<InsertInvoiceItem, "invoiceId">[]
) {
    const db = await getDb();
    if (!db) {
        throw new Error("Database not available");
    }

    // Get submission data
    const [submission] = await db
        .select()
        .from(contactSubmissions)
        .where(eq(contactSubmissions.id, submissionId))
        .limit(1);

    if (!submission) {
        throw new Error("Submission not found");
    }

    // Pre-fill client info from submission
    const clientAddress = [
        submission.street,
        submission.addressLine2,
        `${submission.postalCode} ${submission.city}`,
        submission.stateProvince,
        submission.country
    ].filter(Boolean).join('\n');

    const invoice: Omit<InsertInvoice, "invoiceNumber"> = {
        submissionId,
        clientName: `${submission.firstName} ${submission.lastName}`,
        clientEmail: submission.email,
        clientAddress,
        ...invoiceData,
    } as Omit<InsertInvoice, "invoiceNumber">;

    return await createInvoice(invoice, items, submission.refId);
}
