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
        "users",
        "submissionRateLimits",
        "activityLogs",
        "contactSubmissions"
    ];

    try {
        for (const table of tables) {
            console.log(`Enabling RLS on table: ${table}`);
            // Enable RLS
            await db.execute(sql.raw(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY;`));

            // Create a policy to allow the service role (which our backend uses) to do everything
            // Note: By default, enabling RLS denies all access to roles that are not the table owner or superuser (like postgres).
            // If our connection uses the 'postgres' user or a service_role, it bypasses RLS automatically.
            // If it uses a different user, we might need a policy.
            // Assuming standard Supabase setup where backend uses connection string with postgres/service_role.

            // Ideally, we also want to explicitly deny 'anon' and 'authenticated' (PostgREST roles) if they aren't already blocked by default deny.
            // Default RLS behavior is "deny all" if no policy exists for the role.
            // So just enabling it is enough to block public access.
        }
        console.log("Successfully enabled RLS on all tables.");
    } catch (error) {
        console.error("Error enabling RLS:", error);
    } finally {
        process.exit(0);
    }
}

enableRLS();
