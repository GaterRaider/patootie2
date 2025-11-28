CREATE TABLE "siteSettings" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "siteSettings_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"key" varchar(100) NOT NULL,
	"value" text NOT NULL,
	"description" text,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"updatedBy" integer,
	CONSTRAINT "siteSettings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
ALTER TABLE "siteSettings" ADD CONSTRAINT "siteSettings_updatedBy_adminUsers_id_fk" FOREIGN KEY ("updatedBy") REFERENCES "public"."adminUsers"("id") ON DELETE no action ON UPDATE no action;