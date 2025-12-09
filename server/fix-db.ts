import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

async function main() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });

    try {
        console.log("Adding tokenVersion column...");
        await pool.query(`
            ALTER TABLE "adminUsers" 
            ADD COLUMN IF NOT EXISTS "tokenVersion" integer DEFAULT 0 NOT NULL;
        `);
        console.log("✅ Success!");
    } catch (e) {
        console.error("Error:", e);
    }

    await pool.end();
}

main().catch(console.error);
