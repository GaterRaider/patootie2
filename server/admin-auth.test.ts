import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { appRouter } from "./routers";
import { createContext } from "./_core/context";
import { adminUsers } from "../drizzle/schema";
import { hashPassword } from "./admin-auth";
import { eq } from "drizzle-orm";
import { getDb } from "./db";

// Mock request/response
const mockReq = {
    headers: {},
    cookies: {},
} as any;

const mockRes = {
    cookie: vi.fn(),
    clearCookie: vi.fn(),
} as any;

describe("Admin Auth Router", () => {
    let db: any;

    beforeAll(async () => {
        db = await getDb();
        // Ensure admin user exists (should be seeded, but let's be safe)
        const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.username, "admin")).limit(1);
        if (!admin) {
            const passwordHash = await hashPassword("admin123");
            await db.insert(adminUsers).values({ username: "admin", passwordHash });
        }
    });

    it("should login successfully with correct credentials", async () => {
        const ctx = await createContext({ req: mockReq, res: mockRes });
        const caller = appRouter.createCaller(ctx);

        const result = await caller.admin.auth.login({
            username: "admin",
            password: "admin123",
        });

        expect(result.success).toBe(true);
        expect(mockRes.cookie).toHaveBeenCalledWith("admin_token", expect.any(String), expect.any(Object));
    });

    it("should fail login with incorrect credentials", async () => {
        const ctx = await createContext({ req: mockReq, res: mockRes });
        const caller = appRouter.createCaller(ctx);

        await expect(
            caller.admin.auth.login({
                username: "admin",
                password: "wrongpassword",
            })
        ).rejects.toThrow("Invalid credentials");
    });

    it("should logout successfully", async () => {
        const ctx = await createContext({ req: mockReq, res: mockRes });
        const caller = appRouter.createCaller(ctx);

        const result = await caller.admin.auth.logout();

        expect(result.success).toBe(true);
        expect(mockRes.clearCookie).toHaveBeenCalledWith("admin_token", expect.any(Object));
    });
});
