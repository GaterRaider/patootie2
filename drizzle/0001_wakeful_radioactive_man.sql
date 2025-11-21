ALTER TABLE "contactSubmissions" ADD COLUMN "refId" varchar(50);--> statement-breakpoint
ALTER TABLE "contactSubmissions" ADD CONSTRAINT "contactSubmissions_refId_unique" UNIQUE("refId");