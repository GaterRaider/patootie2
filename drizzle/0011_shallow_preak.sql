CREATE TABLE "savedFilters" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "savedFilters_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"adminId" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"filters" jsonb NOT NULL,
	"isDefault" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "adminUsers" ADD COLUMN "tokenVersion" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "savedFilters" ADD CONSTRAINT "savedFilters_adminId_adminUsers_id_fk" FOREIGN KEY ("adminId") REFERENCES "public"."adminUsers"("id") ON DELETE cascade ON UPDATE no action;