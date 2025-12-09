import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

async function main() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });

    const res = await pool.query(`
        SELECT column_name
        FROM information_schema.columns 
        WHERE table_name = 'adminUsers';
    `);

    console.log(JSON.stringify(res.rows, null, 2));
    await pool.end();
}

main().catch(console.error);
