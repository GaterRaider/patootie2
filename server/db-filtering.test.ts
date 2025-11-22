import "dotenv/config";
import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { getAllContactSubmissions, createContactSubmission, getDb } from "./db";
import { contactSubmissions } from "../drizzle/schema";
import { sql } from "drizzle-orm";

describe("getAllContactSubmissions", () => {
    beforeAll(async () => {
        const db = await getDb();
        if (!db) {
            console.warn("Skipping tests because DB is not available");
            return;
        }
        // Clean up existing submissions for testing
        await db.delete(contactSubmissions);

        // Seed test data
        await createContactSubmission({
            firstName: "Alice",
            lastName: "Smith",
            email: "alice@example.com",
            service: "Anmeldung",
            message: "Test 1",
            language: "en",
            salutation: "Ms",
            dateOfBirth: "1990-01-01",
            phoneNumber: "1234567890",
            street: "Test St",
            postalCode: "12345",
            city: "Berlin",
            country: "Germany",
            currentResidence: "USA",
            preferredLanguage: "English",
            contactConsent: true,
            privacyConsent: true,
            submitterIp: "127.0.0.1",
            userAgent: "test-agent",
        });

        await createContactSubmission({
            firstName: "Bob",
            lastName: "Jones",
            email: "bob@example.com",
            service: "Abmeldung",
            message: "Test 2",
            language: "en",
            salutation: "Mr",
            dateOfBirth: "1985-05-05",
            phoneNumber: "0987654321",
            street: "Test Ave",
            postalCode: "54321",
            city: "Munich",
            country: "Germany",
            currentResidence: "UK",
            preferredLanguage: "English",
            contactConsent: true,
            privacyConsent: true,
            submitterIp: "127.0.0.1",
            userAgent: "test-agent",
        });

        await createContactSubmission({
            firstName: "Charlie",
            lastName: "Brown",
            email: "charlie@example.com",
            service: "Anmeldung",
            message: "Test 3",
            language: "en",
            salutation: "Mr",
            dateOfBirth: "1995-10-10",
            phoneNumber: "1122334455",
            street: "Test Blvd",
            postalCode: "67890",
            city: "Hamburg",
            country: "Germany",
            currentResidence: "France",
            preferredLanguage: "English",
            contactConsent: true,
            privacyConsent: true,
            submitterIp: "127.0.0.1",
            userAgent: "test-agent",
        });
    });

    it("should return all submissions", async () => {
        const db = await getDb();
        if (!db) return;
        const result = await getAllContactSubmissions();
        expect(result.length).toBeGreaterThanOrEqual(3);
    });

    it("should filter by search term", async () => {
        const db = await getDb();
        if (!db) return;
        const result = await getAllContactSubmissions({ search: "Alice" });
        expect(result.length).toBe(1);
        expect(result[0].firstName).toBe("Alice");
    });

    it("should filter by service", async () => {
        const db = await getDb();
        if (!db) return;
        const result = await getAllContactSubmissions({ service: "Anmeldung" });
        expect(result.length).toBeGreaterThanOrEqual(2);
        result.forEach(sub => expect(sub.service).toBe("Anmeldung"));
    });

    it("should sort by firstName asc", async () => {
        const db = await getDb();
        if (!db) return;
        const result = await getAllContactSubmissions({ sortBy: "firstName", sortOrder: "asc" });
        // Filter to our test users to avoid interference from other data if any
        const testUsers = result.filter(u => ["Alice", "Bob", "Charlie"].includes(u.firstName));
        expect(testUsers[0].firstName).toBe("Alice");
        expect(testUsers[1].firstName).toBe("Bob");
        expect(testUsers[2].firstName).toBe("Charlie");
    });

    it("should sort by firstName desc", async () => {
        const db = await getDb();
        if (!db) return;
        const result = await getAllContactSubmissions({ sortBy: "firstName", sortOrder: "desc" });
        const testUsers = result.filter(u => ["Alice", "Bob", "Charlie"].includes(u.firstName));
        expect(testUsers[0].firstName).toBe("Charlie");
        expect(testUsers[1].firstName).toBe("Bob");
        expect(testUsers[2].firstName).toBe("Alice");
    });
});
