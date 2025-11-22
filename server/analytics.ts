import { getDb } from "./db";
import { contactSubmissions, invoices, paymentHistory, activityLogs } from "../drizzle/schema";
import { sql, and, gte, lte, eq, desc, count, sum, avg } from "drizzle-orm";

/**
 * Analytics functions for dashboard metrics and charts
 * All functions accept optional date range filtering
 */

interface DateRange {
    startDate?: string; // ISO date string
    endDate?: string;   // ISO date string
}

// ==========================================
// Summary Metrics
// ==========================================

/**
 * Get total submissions with monthly comparison
 */
export async function getTotalSubmissions(dateRange?: DateRange) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    // Total all time (or within date range if provided)
    const conditions = [];
    if (dateRange?.startDate) {
        conditions.push(gte(contactSubmissions.createdAt, new Date(dateRange.startDate)));
    }
    if (dateRange?.endDate) {
        conditions.push(lte(contactSubmissions.createdAt, new Date(dateRange.endDate)));
    }

    const totalResult = await db
        .select({ count: count() })
        .from(contactSubmissions)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

    // This month
    const thisMonthResult = await db
        .select({ count: count() })
        .from(contactSubmissions)
        .where(gte(contactSubmissions.createdAt, thisMonthStart));

    // Last month
    const lastMonthResult = await db
        .select({ count: count() })
        .from(contactSubmissions)
        .where(
            and(
                gte(contactSubmissions.createdAt, lastMonthStart),
                lte(contactSubmissions.createdAt, lastMonthEnd)
            )
        );

    const total = totalResult[0]?.count || 0;
    const thisMonth = thisMonthResult[0]?.count || 0;
    const lastMonth = lastMonthResult[0]?.count || 0;

    const percentageChange = lastMonth > 0
        ? ((thisMonth - lastMonth) / lastMonth) * 100
        : thisMonth > 0 ? 100 : 0;

    return {
        total,
        thisMonth,
        lastMonth,
        percentageChange: Math.round(percentageChange * 10) / 10,
    };
}

/**
 * Get total invoices created
 */
export async function getTotalInvoices(dateRange?: DateRange) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const conditions = [];
    if (dateRange?.startDate) {
        conditions.push(gte(invoices.createdAt, new Date(dateRange.startDate)));
    }
    if (dateRange?.endDate) {
        conditions.push(lte(invoices.createdAt, new Date(dateRange.endDate)));
    }

    const result = await db
        .select({ count: count() })
        .from(invoices)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

    return result[0]?.count || 0;
}

/**
 * Get revenue metrics (this month and YTD)
 */
export async function getRevenue(dateRange?: DateRange) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    // This month revenue (only paid invoices)
    const thisMonthResult = await db
        .select({ total: sum(invoices.total) })
        .from(invoices)
        .where(
            and(
                eq(invoices.status, 'paid'),
                gte(invoices.createdAt, thisMonthStart)
            )
        );

    // Year to date revenue
    const ytdResult = await db
        .select({ total: sum(invoices.total) })
        .from(invoices)
        .where(
            and(
                eq(invoices.status, 'paid'),
                gte(invoices.createdAt, yearStart)
            )
        );

    // Custom date range if provided
    let customRange = null;
    if (dateRange?.startDate || dateRange?.endDate) {
        const conditions = [eq(invoices.status, 'paid')];
        if (dateRange.startDate) {
            conditions.push(gte(invoices.createdAt, new Date(dateRange.startDate)));
        }
        if (dateRange.endDate) {
            conditions.push(lte(invoices.createdAt, new Date(dateRange.endDate)));
        }

        const customResult = await db
            .select({ total: sum(invoices.total) })
            .from(invoices)
            .where(and(...conditions));

        customRange = parseFloat(customResult[0]?.total || '0');
    }

    return {
        thisMonth: parseFloat(thisMonthResult[0]?.total || '0'),
        ytd: parseFloat(ytdResult[0]?.total || '0'),
        customRange,
        currency: 'EUR',
    };
}

/**
 * Get unpaid invoices count and total amount
 */
export async function getUnpaidInvoices() {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const result = await db
        .select({
            count: count(),
            total: sum(invoices.total),
        })
        .from(invoices)
        .where(eq(invoices.status, 'sent'));

    return {
        count: result[0]?.count || 0,
        totalAmount: parseFloat(result[0]?.total || '0'),
        currency: 'EUR',
    };
}

/**
 * Get average response time (simplified - returns mock data for now)
 */
export async function getAverageResponseTime(dateRange?: DateRange) {
    // Simplified implementation - returns placeholder data
    // In production, this would calculate from activity logs
    return {
        averageHours: 18.5,
        averageDays: 0.8,
        sampleSize: 0,
    };
}

/**
 * Get conversion rate from submissions to paid invoices
 */
export async function getConversionRate(dateRange?: DateRange) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const conditions = [];
    if (dateRange?.startDate) {
        conditions.push(gte(contactSubmissions.createdAt, new Date(dateRange.startDate)));
    }
    if (dateRange?.endDate) {
        conditions.push(lte(contactSubmissions.createdAt, new Date(dateRange.endDate)));
    }

    // Total submissions
    const totalSubmissions = await db
        .select({ count: count() })
        .from(contactSubmissions)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

    // Submissions with paid invoices
    const paidInvoices = await db
        .select({ count: count() })
        .from(invoices)
        .where(
            and(
                eq(invoices.status, 'paid'),
                conditions.length > 0 ? and(...conditions) : undefined
            )
        );

    const total = totalSubmissions[0]?.count || 0;
    const paid = paidInvoices[0]?.count || 0;

    const conversionRate = total > 0 ? (paid / total) * 100 : 0;

    return {
        conversionRate: Math.round(conversionRate * 10) / 10,
        totalSubmissions: total,
        paidInvoices: paid,
    };
}

// ==========================================
// Chart Data Functions
// ==========================================

/**
 * Get submissions over time (daily, weekly, or monthly aggregation)
 */
export async function getSubmissionsOverTime(dateRange?: DateRange, groupBy: 'day' | 'week' | 'month' = 'day') {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const endDate = dateRange?.endDate ? new Date(dateRange.endDate) : new Date();
    const startDate = dateRange?.startDate
        ? new Date(dateRange.startDate)
        : new Date(endDate.getTime() - 90 * 24 * 60 * 60 * 1000);

    let dateFormat: string;
    switch (groupBy) {
        case 'month':
            dateFormat = 'YYYY-MM';
            break;
        case 'week':
            dateFormat = 'YYYY-"W"IW';
            break;
        case 'day':
        default:
            dateFormat = 'YYYY-MM-DD';
            break;
    }

    const result = await db
        .select({
            date: sql<string>`TO_CHAR(${contactSubmissions.createdAt}, ${dateFormat})`,
            count: count(),
        })
        .from(contactSubmissions)
        .where(
            and(
                gte(contactSubmissions.createdAt, startDate),
                lte(contactSubmissions.createdAt, endDate)
            )
        )
        .groupBy(sql`TO_CHAR(${contactSubmissions.createdAt}, ${dateFormat})`)
        .orderBy(sql`TO_CHAR(${contactSubmissions.createdAt}, ${dateFormat})`);

    return result.map((row: any) => ({
        date: row.date,
        count: row.count,
    }));
}

/**
 * Get submissions breakdown by service type
 */
export async function getSubmissionsByService(dateRange?: DateRange) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const conditions = [];
    if (dateRange?.startDate) {
        conditions.push(gte(contactSubmissions.createdAt, new Date(dateRange.startDate)));
    }
    if (dateRange?.endDate) {
        conditions.push(lte(contactSubmissions.createdAt, new Date(dateRange.endDate)));
    }

    const result = await db
        .select({
            service: contactSubmissions.service,
            count: count(),
        })
        .from(contactSubmissions)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .groupBy(contactSubmissions.service)
        .orderBy(desc(count()));

    const total = result.reduce((sum: number, row: any) => sum + row.count, 0);

    return result.map((row: any) => ({
        service: row.service,
        count: row.count,
        percentage: total > 0 ? Math.round((row.count / total) * 1000) / 10 : 0,
    }));
}

/**
 * Get revenue trends by month
 */
export async function getRevenueTrends(dateRange?: DateRange) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const now = new Date();
    const currentYear = now.getFullYear();
    const previousYear = currentYear - 1;

    // Current year monthly revenue
    const currentYearResult = await db
        .select({
            month: sql<string>`TO_CHAR(${invoices.createdAt}, 'YYYY-MM')`,
            revenue: sum(invoices.total),
            count: count(),
        })
        .from(invoices)
        .where(
            and(
                eq(invoices.status, 'paid'),
                gte(invoices.createdAt, new Date(currentYear, 0, 1))
            )
        )
        .groupBy(sql`TO_CHAR(${invoices.createdAt}, 'YYYY-MM')`)
        .orderBy(sql`TO_CHAR(${invoices.createdAt}, 'YYYY-MM')`);

    // Previous year monthly revenue
    const previousYearResult = await db
        .select({
            month: sql<string>`TO_CHAR(${invoices.createdAt}, 'YYYY-MM')`,
            revenue: sum(invoices.total),
            count: count(),
        })
        .from(invoices)
        .where(
            and(
                eq(invoices.status, 'paid'),
                gte(invoices.createdAt, new Date(previousYear, 0, 1)),
                lte(invoices.createdAt, new Date(previousYear, 11, 31, 23, 59, 59))
            )
        )
        .groupBy(sql`TO_CHAR(${invoices.createdAt}, 'YYYY-MM')`)
        .orderBy(sql`TO_CHAR(${invoices.createdAt}, 'YYYY-MM')`);

    return {
        currentYear: currentYearResult.map((row: any) => ({
            month: row.month,
            revenue: parseFloat(row.revenue || '0'),
            count: row.count,
        })),
        previousYear: previousYearResult.map((row: any) => ({
            month: row.month,
            revenue: parseFloat(row.revenue || '0'),
            count: row.count,
        })),
    };
}

/**
 * Get invoice status distribution
 */
export async function getInvoiceStatusDistribution(dateRange?: DateRange) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const conditions = [];
    if (dateRange?.startDate) {
        conditions.push(gte(invoices.createdAt, new Date(dateRange.startDate)));
    }
    if (dateRange?.endDate) {
        conditions.push(lte(invoices.createdAt, new Date(dateRange.endDate)));
    }

    const result = await db
        .select({
            status: invoices.status,
            count: count(),
        })
        .from(invoices)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .groupBy(invoices.status)
        .orderBy(desc(count()));

    return result.map((row: any) => ({
        status: row.status,
        count: row.count,
    }));
}

/**
 * Get response time metrics over time (simplified - returns empty for now)
 */
export async function getResponseTimeMetrics(dateRange?: DateRange) {
    // Simplified implementation - returns placeholder structure
    return {
        data: [],
        targetHours: 24,
    };
}

/**
 * Get top services by revenue
 */
export async function getTopServicesByRevenue(dateRange?: DateRange, limit: number = 10) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const conditions = [eq(invoices.status, 'paid')];
    if (dateRange?.startDate) {
        conditions.push(gte(invoices.createdAt, new Date(dateRange.startDate)));
    }
    if (dateRange?.endDate) {
        conditions.push(lte(invoices.createdAt, new Date(dateRange.endDate)));
    }

    // Join invoices with submissions to get service type
    const result = await db
        .select({
            service: contactSubmissions.service,
            revenue: sum(invoices.total),
            count: count(),
        })
        .from(invoices)
        .innerJoin(contactSubmissions, eq(invoices.submissionId, contactSubmissions.id))
        .where(and(...conditions))
        .groupBy(contactSubmissions.service)
        .orderBy(desc(sum(invoices.total)))
        .limit(limit);

    return result.map((row: any) => ({
        service: row.service,
        revenue: parseFloat(row.revenue || '0'),
        count: row.count,
    }));
}

/**
 * Get all summary metrics in one call
 */
export async function getSummaryMetrics(dateRange?: DateRange) {
    const [
        submissions,
        totalInvoices,
        revenue,
        unpaidInvoices,
        responseTime,
        conversionRate,
    ] = await Promise.all([
        getTotalSubmissions(dateRange),
        getTotalInvoices(dateRange),
        getRevenue(dateRange),
        getUnpaidInvoices(),
        getAverageResponseTime(dateRange),
        getConversionRate(dateRange),
    ]);

    return {
        submissions,
        totalInvoices,
        revenue,
        unpaidInvoices,
        responseTime,
        conversionRate,
    };
}
