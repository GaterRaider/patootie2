/*
CREATE TABLE IF NOT EXISTS "companySettings" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "companySettings_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"companyName" varchar(200) NOT NULL,
	"address" text NOT NULL,
	"email" varchar(320) NOT NULL,
	"phone" varchar(50),
	"taxId" varchar(50),
	"vatId" varchar(50),
	"iban" varchar(34),
	"bic" varchar(11),
	"bankName" varchar(100),
	"logoUrl" varchar(500),
	"defaultCurrency" varchar(3) DEFAULT 'EUR' NOT NULL,
	"invoicePrefix" varchar(20) DEFAULT 'INV-' NOT NULL,
	"defaultTaxRate" numeric(5, 2) DEFAULT '19.00' NOT NULL,
	"paymentTermsDays" integer DEFAULT 14 NOT NULL,
	"termsAndConditions" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invoiceItems" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "invoiceItems_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"invoiceId" integer NOT NULL,
	"description" text NOT NULL,
	"quantity" numeric(10, 2) NOT NULL,
	"unitPrice" numeric(10, 2) NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"sortOrder" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invoices" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "invoices_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"invoiceNumber" varchar(50) NOT NULL,
	"submissionId" integer,
	"clientName" varchar(200) NOT NULL,
	"clientEmail" varchar(320) NOT NULL,
	"clientAddress" text NOT NULL,
	"issueDate" date NOT NULL,
	"dueDate" date NOT NULL,
	"serviceDate" date,
	"subtotal" numeric(10, 2) NOT NULL,
	"taxRate" numeric(5, 2) NOT NULL,
	"taxAmount" numeric(10, 2) NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'EUR' NOT NULL,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"notes" text,
	"termsAndConditions" text,
	"emailSentAt" timestamp,
	"paidAt" timestamp,
	"paidAmount" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"createdBy" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "invoices_invoiceNumber_unique" UNIQUE("invoiceNumber")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "paymentHistory" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "paymentHistory_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"invoiceId" integer NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"paymentDate" date NOT NULL,
	"paymentMethod" varchar(50) NOT NULL,
	"reference" varchar(200),
	"notes" text,
	"recordedBy" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
*/
--> statement-breakpoint
ALTER TABLE "contactSubmissions" ALTER COLUMN "currentResidence" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "contactSubmissions" ALTER COLUMN "preferredLanguage" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "contactSubmissions" ADD COLUMN IF NOT EXISTS "subService" varchar(100);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoiceItems" ADD CONSTRAINT "invoiceItems_invoiceId_invoices_id_fk" FOREIGN KEY ("invoiceId") REFERENCES "public"."invoices"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoices" ADD CONSTRAINT "invoices_submissionId_contactSubmissions_id_fk" FOREIGN KEY ("submissionId") REFERENCES "public"."contactSubmissions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoices" ADD CONSTRAINT "invoices_createdBy_adminUsers_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."adminUsers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "paymentHistory" ADD CONSTRAINT "paymentHistory_invoiceId_invoices_id_fk" FOREIGN KEY ("invoiceId") REFERENCES "public"."invoices"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "paymentHistory" ADD CONSTRAINT "paymentHistory_recordedBy_adminUsers_id_fk" FOREIGN KEY ("recordedBy") REFERENCES "public"."adminUsers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;