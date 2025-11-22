CREATE TABLE "activityLogs" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "activityLogs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"adminId" integer,
	"action" varchar(50) NOT NULL,
	"entityType" varchar(50) NOT NULL,
	"entityId" integer,
	"details" jsonb,
	"ipAddress" varchar(45),
	"userAgent" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submissionNotes" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "submissionNotes_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"submissionId" integer NOT NULL,
	"adminId" integer NOT NULL,
	"note" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "contactSubmissions" ADD COLUMN "status" varchar(20) DEFAULT 'new' NOT NULL;--> statement-breakpoint
ALTER TABLE "activityLogs" ADD CONSTRAINT "activityLogs_adminId_adminUsers_id_fk" FOREIGN KEY ("adminId") REFERENCES "public"."adminUsers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissionNotes" ADD CONSTRAINT "submissionNotes_submissionId_contactSubmissions_id_fk" FOREIGN KEY ("submissionId") REFERENCES "public"."contactSubmissions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissionNotes" ADD CONSTRAINT "submissionNotes_adminId_adminUsers_id_fk" FOREIGN KEY ("adminId") REFERENCES "public"."adminUsers"("id") ON DELETE no action ON UPDATE no action;