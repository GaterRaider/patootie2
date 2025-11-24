CREATE TABLE "adminLoginAttempts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "adminLoginAttempts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"ipAddress" varchar(50) NOT NULL,
	"attemptedUsername" varchar(50),
	"success" boolean NOT NULL,
	"attemptedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "emailTemplates" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "emailTemplates_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"templateKey" varchar(100) NOT NULL,
	"language" varchar(10) NOT NULL,
	"subject" text NOT NULL,
	"senderName" varchar(100),
	"senderEmail" varchar(320),
	"htmlContent" text NOT NULL,
	"textContent" text,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"updatedBy" integer,
	CONSTRAINT "emailTemplates_templateKey_language_unique" UNIQUE("templateKey","language")
);
--> statement-breakpoint
ALTER TABLE "emailTemplates" ADD CONSTRAINT "emailTemplates_updatedBy_adminUsers_id_fk" FOREIGN KEY ("updatedBy") REFERENCES "public"."adminUsers"("id") ON DELETE no action ON UPDATE no action;