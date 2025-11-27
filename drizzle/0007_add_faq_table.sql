-- Create FAQ items table
CREATE TABLE IF NOT EXISTS "faqItems" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "faqItems_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"language" varchar(2) NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"displayOrder" integer DEFAULT 0 NOT NULL,
	"isPublished" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"createdBy" integer,
	"updatedBy" integer
);

-- Add foreign key constraints
ALTER TABLE "faqItems" ADD CONSTRAINT "faqItems_createdBy_adminUsers_id_fk" FOREIGN KEY ("createdBy") REFERENCES "adminUsers"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "faqItems" ADD CONSTRAINT "faqItems_updatedBy_adminUsers_id_fk" FOREIGN KEY ("updatedBy") REFERENCES "adminUsers"("id") ON DELETE no action ON UPDATE no action;

-- Create index for faster queries by language and published status
CREATE INDEX IF NOT EXISTS "faqItems_language_idx" ON "faqItems" ("language");
CREATE INDEX IF NOT EXISTS "faqItems_isPublished_idx" ON "faqItems" ("isPublished");
CREATE INDEX IF NOT EXISTS "faqItems_language_displayOrder_idx" ON "faqItems" ("language", "displayOrder");
