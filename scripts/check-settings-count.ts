
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { siteSettings } from "../drizzle/schema";
import { count } from "drizzle-orm";
import "dotenv/config";

async function main() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error("DATABASE_URL is not set");
        process.exit(1);
    }

    const pool = new Pool({
        connectionString,
        ssl: {
            rejectUnauthorized: false,
        }
    });
    const db = drizzle(pool);

    console.log("Connected to database");

    const result = await db.select({ count: count() }).from(siteSettings);
    console.log("Row count:", result[0].count);

    await pool.end();
}

main().catch(console.error);
