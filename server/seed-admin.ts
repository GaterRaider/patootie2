import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { adminUsers } from "../drizzle/schema";
import { hashPassword } from "./admin-auth";
import { eq } from "drizzle-orm";

const { Pool } = pg;

async function main() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error("DATABASE_URL is required");
    }

    const pool = new Pool({ connectionString });
    const db = drizzle(pool);

    console.log("Checking for existing admin user...");
    const existingAdmin = await db.select().from(adminUsers).where(eq(adminUsers.username, "admin")).limit(1);

    if (existingAdmin.length > 0) {
        console.log("Admin user 'admin' already exists.");
    } else {
        console.log("Creating initial admin user...");
        const password = "admin123"; // Default password
        const passwordHash = await hashPassword(password);

        await db.insert(adminUsers).values({
            username: "admin",
            passwordHash,
        });

        console.log("Admin user created successfully!");
        console.log("Username: admin");
        console.log("Password: " + password);
    }

    await pool.end();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
