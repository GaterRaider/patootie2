import { test, expect } from '@playwright/test';

test.describe('Email Templates Admin', () => {

    // We can use a random suffix to avoid unique constraint violations on re-runs
    const timestamp = Date.now();
    const templateKey = `test_template_${timestamp}`;
    const subject = `Test Subject ${timestamp}`;

    test('should allow creating a new email template', async ({ page }) => {

        // --- Login Step ---
        await page.goto('/admin/login');

        // Wait for page to load
        await page.waitForLoadState('networkidle');

        await page.fill('input#username', 'admin');
        await page.fill('input#password', 'admin123');
        await page.click('button[type="submit"]');

        // Wait for redirect to dashboard with a longer timeout
        await page.waitForURL(/\/admin\/dashboard/, { timeout: 10000 });

        // --- End Login Step ---

        // 1. Navigate to the Email Templates page
        await page.goto('/admin/emails');
        await page.waitForLoadState('networkidle');

        // 2. Click "Add Template" button
        await page.click('text=Add Template');

        // 3. Check if modal is visible
        await expect(page.locator('text=Create New Template')).toBeVisible({ timeout: 5000 });

        // 4. Fill out the form
        await page.fill('input[placeholder="e.g., form_submission, admin_notification"]', templateKey);

        // Select Language (default is 'en', let's change to 'de')
        await page.selectOption('select', 'de');

        await page.fill('input[placeholder="Email subject line"]', subject);
        await page.fill('input[placeholder="HandokHelper"]', 'Test Sender');
        await page.fill('input[placeholder="info@handokhelper.de"]', 'test@handokhelper.de');

        // Fill HTML content (textarea)
        await page.fill('textarea[placeholder="HTML email content"]', '<h1>Hello World</h1>');

        // 5. Submit the form
        await page.click('button:has-text("Create Template")');

        // 6. Verify success message (using text match from the toast)
        // Toasts can be tricky, let's wait for the modal to close instead
        await expect(page.locator('text=Create New Template')).not.toBeVisible({ timeout: 5000 });

        // 7. Verify the new template appears in the table
        // We might need to wait for the table to reload
        await expect(page.locator(`text=${templateKey}`)).toBeVisible({ timeout: 5000 });
        await expect(page.locator(`text=${subject}`)).toBeVisible({ timeout: 5000 });
        await expect(page.locator('text=Deutsch')).toBeVisible({ timeout: 5000 });
    });
});
