
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { sql } from "drizzle-orm";
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

    const result = await db.execute(sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `);

    console.log("Tables in database:");
    result.rows.forEach((row: any) => {
        console.log(`- ${row.table_name}`);
    });

    await pool.end();
}

main().catch(console.error);
