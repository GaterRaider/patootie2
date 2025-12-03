-- Create clients table
CREATE TABLE IF NOT EXISTS "clients" (
  "id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "email" VARCHAR(320) NOT NULL UNIQUE,
  "firstName" VARCHAR(100),
  "lastName" VARCHAR(100),
  "phoneNumber" VARCHAR(50),
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create index on email for fast lookups
CREATE INDEX IF NOT EXISTS "clients_email_idx" ON "clients" ("email");

-- Populate clients table from existing submissions
-- This gets the first submission for each unique email
INSERT INTO "clients" ("email", "firstName", "lastName", "phoneNumber", "createdAt")
SELECT DISTINCT ON (email)
  email,
  "firstName",
  "lastName",
  "phoneNumber",
  "createdAt"
FROM "contactSubmissions"
ORDER BY email, "createdAt" ASC
ON CONFLICT (email) DO NOTHING;
