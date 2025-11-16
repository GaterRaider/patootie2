CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "contactSubmissions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "contactSubmissions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"service" varchar(100) NOT NULL,
	"salutation" varchar(50) NOT NULL,
	"firstName" varchar(100) NOT NULL,
	"lastName" varchar(100) NOT NULL,
	"dateOfBirth" varchar(20) NOT NULL,
	"email" varchar(320) NOT NULL,
	"phoneNumber" varchar(50) NOT NULL,
	"street" varchar(200) NOT NULL,
	"addressLine2" varchar(200),
	"postalCode" varchar(20) NOT NULL,
	"city" varchar(100) NOT NULL,
	"stateProvince" varchar(100),
	"country" varchar(100) NOT NULL,
	"currentResidence" varchar(100) NOT NULL,
	"preferredLanguage" varchar(50) NOT NULL,
	"message" text NOT NULL,
	"contactConsent" boolean NOT NULL,
	"privacyConsent" boolean NOT NULL,
	"submitterIp" varchar(50),
	"userAgent" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submissionRateLimits" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "submissionRateLimits_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email" varchar(320) NOT NULL,
	"ipAddress" varchar(50) NOT NULL,
	"lastSubmission" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
