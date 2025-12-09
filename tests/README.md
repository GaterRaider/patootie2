# Playwright Test Files

## Current Test Suite

### 1. `example.spec.ts` (Basic Smoke Test)
- **Purpose**: Verify the app loads at all
- **What it tests**: Homepage is accessible and renders
- **Keep?**: Optional - can be removed if you prefer cleaner setup

### 2. `admin-login.spec.ts` (Authentication Test)
- **Purpose**: Verify admin login and navigation works
- **What it tests**: 
  - Login form accepts credentials
  - Successful redirect to dashboard
  - Navigation to email templates page
- **Keep?**: ✅ YES - Essential for testing auth

### 3. `email-templates.spec.ts` (Feature Test)
- **Purpose**: Test complete email template creation flow
- **What it tests**:
  - Login
  - Navigate to templates
  - Open create modal
  - Fill form
  - Submit
  - Verify template appears in list
- **Keep?**: ✅ YES - Tests critical admin feature

## Recommendation

**Keep all 3 files** for now. As you write more tests, you can:
- Delete `example.spec.ts` if it feels redundant
- Organize tests into subdirectories (`tests/auth/`, `tests/admin/`, etc.)
- Create test fixtures/helpers to reduce duplication

## File Count Summary

**Total files to commit: 6**
- 3 configuration files (`.gitignore`, `package.json`, `pnpm-lock.yaml`)
- 1 documentation file (`PLAYWRIGHT_GUIDE.md`)
- 1 config file (`playwright.config.ts`)
- 1 directory with 3 test files (`tests/`)

All test artifacts (reports, screenshots, videos) are now ignored by git.
