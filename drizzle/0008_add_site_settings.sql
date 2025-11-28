-- Add site settings table for toggleable features
CREATE TABLE IF NOT EXISTS "siteSettings" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "key" varchar(100) NOT NULL UNIQUE,
  "value" text NOT NULL,
  "description" text,
  "updatedAt" timestamp DEFAULT now() NOT NULL,
  "updatedBy" integer REFERENCES "adminUsers"("id")
);

-- Insert default settings
INSERT INTO "siteSettings" ("key", "value", "description") VALUES
  ('showResponseTime', 'true', 'Display response time expectations on the home page'),
  ('responseTimeText_en', 'We typically respond within 24-48 hours', 'Response time text in English'),
  ('responseTimeText_ko', '일반적으로 24-48시간 이내에 응답합니다', 'Response time text in Korean'),
  ('responseTimeText_de', 'Wir antworten normalerweise innerhalb von 24-48 Stunden', 'Response time text in German');
