-- Migration: Enable Row Level Security (RLS) on all public tables
-- This addresses Supabase security linter errors for tables exposed via PostgREST
-- 
-- Strategy:
-- 1. Enable RLS on all 16 tables
-- 2. Create INSERT-only policy for contactSubmissions (public form submissions)
-- 3. All other tables require service role access (admin-only via backend)

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE "public"."faqItems" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."clients" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."adminLoginAttempts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."adminUsers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."savedFilters" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."activityLogs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."submissionRateLimits" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."contactSubmissions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."emailTemplates" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."submissionNotes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."companySettings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."invoiceItems" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."invoices" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."paymentHistory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."siteSettings" ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- CREATE RLS POLICIES
-- ============================================================================

-- Policy 1: Allow anonymous users to submit contact forms
-- This is the only public-facing operation - form submissions from the website
CREATE POLICY "Allow public form submissions"
ON "public"."contactSubmissions"
FOR INSERT
TO anon
WITH CHECK (true);

-- ============================================================================
-- NOTES
-- ============================================================================
-- 
-- All other tables have NO policies, meaning:
-- - Anonymous users (anon role) have NO access
-- - Authenticated users (authenticated role) have NO access
-- - Service role (your backend) has FULL access
-- 
-- This is intentional because:
-- 1. Your app uses custom admin authentication (not Supabase Auth)
-- 2. All admin operations go through your backend using service role keys
-- 3. This prevents unauthorized PostgREST API access
-- 
-- Tables with no policies (admin-only via service role):
-- - adminUsers: Admin credentials
-- - adminLoginAttempts: Security audit logs
-- - activityLogs: Admin action tracking
-- - submissionNotes: Internal notes
-- - clients: CRM data
-- - invoices, invoiceItems, paymentHistory: Financial records
-- - companySettings: Company configuration
-- - emailTemplates: Email templates
-- - faqItems: FAQ content (consider adding SELECT policy if public FAQs needed)
-- - siteSettings: Site configuration
-- - savedFilters: User preferences
-- - submissionRateLimits: Rate limiting data
-- - users: User data (if using Supabase Auth in future)
-- 
-- ============================================================================
-- OPTIONAL: Public FAQ Access
-- ============================================================================
-- 
-- If you want to expose FAQs publicly via PostgREST, uncomment this policy:
-- 
-- CREATE POLICY "Allow public read access to published FAQs"
-- ON "public"."faqItems"
-- FOR SELECT
-- TO anon
-- USING (isPublished = true);
-- 
-- ============================================================================
