import * as dotenv from "dotenv";
dotenv.config();

import { getDb } from "../db";
import { sql } from "drizzle-orm";

async function enableRLS() {
    console.log("Enabling Row Level Security (RLS) on tables...");

    const db = await getDb();
    if (!db) {
        console.error("Failed to connect to database");
        process.exit(1);
    }

    const tables = [
        "adminUsers",
        "adminLoginAttempts",
        "users",
        "submissionRateLimits",
        "activityLogs",
        "contactSubmissions",
        "submissionNotes",
        "companySettings",
        "invoices",
        "invoiceItems",
        "paymentHistory"
    ];

    try {
        for (const table of tables) {
            console.log(`Enabling RLS on table: ${table}`);
            // Enable RLS
            await db.execute(sql.raw(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY;`));
        }
        console.log("Successfully enabled RLS on all tables.");
    } catch (error) {
        console.error("Error enabling RLS:", error);
    } finally {
        process.exit(0);
    }
}

enableRLS();
