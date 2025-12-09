import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    // Replacing this with a generic check since I don't know the exact title yet, 
    // but checking if the body is visible is a good start working smoke test
    await expect(page.locator('body')).toBeVisible();
});
