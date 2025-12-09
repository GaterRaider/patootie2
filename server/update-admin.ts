import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { adminUsers } from "../drizzle/schema";
import { hashPassword } from "./admin-auth";
import { eq } from "drizzle-orm";

const { Pool } = pg;

async function main() {
    const args = process.argv.slice(2);

    if (args.length < 2) {
        console.error("Usage: pnpm exec tsx server/update-admin.ts <new_username> <new_password> [current_username]");
        console.error("Defaults 'current_username' to 'admin' if not provided.");
        process.exit(1);
    }

    const [newUsername, newPassword, currentUsernameArg] = args;
    const currentUsername = currentUsernameArg || "admin";

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error("DATABASE_URL is required");
    }

    const pool = new Pool({ connectionString });
    const db = drizzle(pool);

    console.log(`🔍 Looking for admin user '${currentUsername}'...`);

    // Find the user first
    const users = await db.select().from(adminUsers).where(eq(adminUsers.username, currentUsername));

    if (users.length === 0) {
        console.error(`❌ User '${currentUsername}' not found in the database.`);
        console.log("Available options:");
        console.log("1. Run 'pnpm exec tsx server/seed-admin.ts' to create the default 'admin' user.");
        console.log("2. Check if you've already renamed the user.");
        await pool.end();
        process.exit(1);
    }

    console.log(`🔐 Hashing new password...`);
    const passwordHash = await hashPassword(newPassword);

    console.log(`💾 Updating database...`);
    await db.update(adminUsers)
        .set({ username: newUsername, passwordHash })
        .where(eq(adminUsers.username, currentUsername));

    console.log("✅ Credentials updated successfully!");
    console.log(`   Old Username: ${currentUsername}`);
    console.log(`   New Username: ${newUsername}`);
    console.log(`   New Password: ${newPassword.replace(/./g, '*')}`);

    await pool.end();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
