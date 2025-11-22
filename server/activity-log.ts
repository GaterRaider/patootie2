import { getDb } from "./db";
import { activityLogs } from "../drizzle/schema";

interface LogActivityOptions {
    adminId: number;
    action: string;
    entityType: string;
    entityId?: number;
    details?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
}

export async function logActivity(options: LogActivityOptions) {
    const db = await getDb();
    if (!db) {
        console.error("[ActivityLog] Database not available");
        return;
    }

    try {
        await db.insert(activityLogs).values({
            adminId: options.adminId,
            action: options.action,
            entityType: options.entityType,
            entityId: options.entityId,
            details: options.details,
            ipAddress: options.ipAddress,
            userAgent: options.userAgent,
        });
    } catch (error) {
        console.error("[ActivityLog] Failed to log activity:", error);
        // Don't throw error to avoid blocking the main action
    }
}
