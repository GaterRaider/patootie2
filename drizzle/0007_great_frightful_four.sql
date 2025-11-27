CREATE TABLE "faqItems" (
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
--> statement-breakpoint
ALTER TABLE "faqItems" ADD CONSTRAINT "faqItems_createdBy_adminUsers_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."adminUsers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faqItems" ADD CONSTRAINT "faqItems_updatedBy_adminUsers_id_fk" FOREIGN KEY ("updatedBy") REFERENCES "public"."adminUsers"("id") ON DELETE no action ON UPDATE no action;