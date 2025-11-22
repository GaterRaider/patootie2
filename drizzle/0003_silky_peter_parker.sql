CREATE TABLE "adminUsers" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "adminUsers_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"username" varchar(50) NOT NULL,
	"passwordHash" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "adminUsers_username_unique" UNIQUE("username")
);
