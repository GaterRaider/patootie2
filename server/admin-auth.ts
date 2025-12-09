import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { SignJWT, jwtVerify } from "jose";
import { TRPCError } from "@trpc/server";
import { publicProcedure } from "./_core/trpc";

const scryptAsync = promisify(scrypt);
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-dev-key-change-in-prod");
const ALG = "HS256";

// --- Password Hashing ---

export async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString("hex");
    const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    const [salt, key] = hash.split(":");
    const keyBuffer = Buffer.from(key, "hex");
    const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
    return timingSafeEqual(keyBuffer, derivedKey);
}

// --- JWT Handling ---

// --- JWT Handling ---

export async function signAdminToken(adminId: number, tokenVersion: number, keepMeLoggedIn = false): Promise<string> {
    const expirationTime = keepMeLoggedIn ? "30d" : "12h";
    return new SignJWT({ adminId, tokenVersion })
        .setProtectedHeader({ alg: ALG })
        .setIssuedAt()
        .setExpirationTime(expirationTime)
        .sign(JWT_SECRET);
}

export async function verifyAdminToken(token: string): Promise<{ adminId: number; tokenVersion: number } | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return {
            adminId: payload.adminId as number,
            tokenVersion: (payload.tokenVersion as number) || 0,
        };
    } catch (error) {
        return null;
    }
}

// --- Middleware ---

import { adminUsers } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export const adminProcedure = publicProcedure.use(async ({ ctx, next }) => {
    // Read token from cookie instead of Authorization header
    // console.log('[Admin Auth] All cookies:', ctx.req.cookies);
    const token = ctx.req.cookies?.admin_token;
    // console.log('[Admin Auth] admin_token:', token ? 'present' : 'missing');

    if (!token) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
    }

    const payload = await verifyAdminToken(token);
    // console.log('[Admin Auth] Verified payload:', payload);

    if (!payload) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid token" });
    }

    // Verify token version against database
    const [user] = await ctx.db.select({
        tokenVersion: adminUsers.tokenVersion
    }).from(adminUsers).where(eq(adminUsers.id, payload.adminId)).limit(1);

    if (!user) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "User not found" });
    }

    if (user.tokenVersion !== payload.tokenVersion) {
        console.log(`[Admin Auth] Token version mismatch. Token: ${payload.tokenVersion}, DB: ${user.tokenVersion}`);
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Session expired (password changed)" });
    }

    return next({
        ctx: {
            ...ctx,
            adminId: payload.adminId,
        },
    });
});
