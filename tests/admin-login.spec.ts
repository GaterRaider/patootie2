import { test, expect } from '@playwright/test';

test.describe('Admin Login and Navigation', () => {

    test('should login and navigate to email templates', async ({ page }) => {
        // Step 1: Login
        await page.goto('/admin/login');
        await page.waitForLoadState('networkidle');

        const username = process.env.E2E_ADMIN_USERNAME || 'admin';
        const password = process.env.E2E_ADMIN_PASSWORD || 'admin123';

        await page.fill('input#username', username);
        await page.fill('input#password', password);
        await page.click('button[type="submit"]');

        // Wait for successful login and redirect
        await page.waitForURL(/\/admin\/dashboard/, { timeout: 10000 });

        // Verify we're on the dashboard
        await expect(page).toHaveURL(/\/admin\/dashboard/);

        // Step 2: Navigate to Email Templates
        await page.goto('/admin/emails');
        await page.waitForLoadState('networkidle');

        // Verify we're on the email templates page
        await expect(page).toHaveURL(/\/admin\/emails/);

        // Verify the page loaded correctly
        await expect(page.locator('text=Email Templates')).toBeVisible();
        await expect(page.locator('text=Add Template')).toBeVisible();
    });
});
