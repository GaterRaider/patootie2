# Playwright E2E Testing Guide

## Overview

Playwright is now installed and configured for this project. It allows you to write **End-to-End (E2E) tests** that simulate real user interactions with your application in a browser.

## What is E2E Testing?

End-to-End testing means testing your entire application flow from the user's perspective:
- **Unit tests** check individual functions in isolation
- **E2E tests** check the entire user journey (login → navigate → click buttons → fill forms → verify results)

## How It Works

### 1. Test Structure

Tests are written in TypeScript files in the `tests/` directory with the `.spec.ts` extension.

```typescript
import { test, expect } from '@playwright/test';

test('description of what you're testing', async ({ page }) => {
    // 1. Navigate to a page
    await page.goto('/some-route');
    
    // 2. Interact with elements
    await page.click('button:has-text("Click Me")');
    await page.fill('input#email', 'test@example.com');
    
    // 3. Verify results
    await expect(page.locator('text=Success!')).toBeVisible();
});
```

### 2. Key Concepts

#### **`page` object**
- Represents the browser tab
- Use it to navigate, click, type, etc.

#### **Locators**
Ways to find elements on the page:
- `page.locator('text=Some Text')` - Find by text content
- `page.locator('button')` - Find by tag name
- `page.locator('#id')` - Find by ID
- `page.locator('.class-name')` - Find by class
- `page.locator('input[placeholder="Email"]')` - Find by attribute

#### **Actions**
- `await page.goto('/path')` - Navigate to a URL
- `await page.click('selector')` - Click an element
- `await page.fill('input', 'value')` - Type into an input
- `await page.selectOption('select', 'value')` - Select from dropdown
- `await page.check('checkbox')` - Check a checkbox

#### **Assertions**
- `await expect(locator).toBeVisible()` - Element is visible
- `await expect(locator).toHaveText('text')` - Element has specific text
- `await expect(page).toHaveURL(/pattern/)` - URL matches pattern
- `await expect(locator).toBeEnabled()` - Element is enabled

#### **Waiting**
Playwright auto-waits for most actions, but you can be explicit:
- `await page.waitForLoadState('networkidle')` - Wait for network to be idle
- `await page.waitForURL('/path')` - Wait for navigation
- `await page.waitForSelector('selector')` - Wait for element to appear

## Running Tests

### Basic Commands

```bash
# Run all tests (headless mode)
pnpm test:e2e

# Run with browser visible (headed mode)
pnpm test:e2e --headed

# Run specific test file
pnpm test:e2e tests/email-templates.spec.ts

# Run in debug mode (step through test)
pnpm test:e2e --debug

# View last test report
pnpm exec playwright show-report
```

### Important Notes

1. **Dev server must be running** on port 5000 (or Playwright will try to start it automatically)
2. **Tests run in isolation** - each test gets a fresh browser context
3. **Authentication** - If your app requires login, each test needs to login first (or use a setup fixture)

## Current Test Setup

### Configuration (`playwright.config.ts`)

- **Test directory**: `./tests`
- **Base URL**: `http://localhost:5000`
- **Browser**: Chromium (Chrome)
- **Screenshots**: Captured on failure
- **Videos**: Recorded on failure
- **Reports**: HTML report generated after each run

### Example Test (`tests/email-templates.spec.ts`)

This test:
1. Logs in as admin
2. Navigates to Email Templates page
3. Creates a new template
4. Verifies it appears in the list

## Writing Your Own Tests

### Step 1: Create a new test file

```bash
# Create tests/my-feature.spec.ts
```

### Step 2: Write the test

```typescript
import { test, expect } from '@playwright/test';

test.describe('My Feature', () => {
    test('should do something', async ({ page }) => {
        // Your test code here
    });
});
```

### Step 3: Run it

```bash
pnpm test:e2e tests/my-feature.spec.ts
```

## Common Patterns

### Login Helper

Since many tests need authentication, you can create a helper:

```typescript
async function loginAsAdmin(page) {
    await page.goto('/admin/login');
    await page.fill('input#username', 'admin');
    await page.fill('input#password', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin\/dashboard/);
}

test('my test', async ({ page }) => {
    await loginAsAdmin(page);
    // Rest of test...
});
```

### Testing Forms

```typescript
test('should submit form', async ({ page }) => {
    await page.goto('/contact');
    
    // Fill form
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('textarea[name="message"]', 'Hello!');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Verify success
    await expect(page.locator('text=Thank you')).toBeVisible();
});
```

### Testing Navigation

```typescript
test('should navigate between pages', async ({ page }) => {
    await page.goto('/');
    await page.click('a:has-text("About")');
    await expect(page).toHaveURL('/about');
    await expect(page.locator('h1')).toHaveText('About Us');
});
```

### Testing API Calls

```typescript
test('should load data from API', async ({ page }) => {
    // Wait for API response
    const responsePromise = page.waitForResponse(
        response => response.url().includes('/api/trpc/') && response.status() === 200
    );
    
    await page.goto('/dashboard');
    await responsePromise;
    
    // Verify data loaded
    await expect(page.locator('.data-table')).toBeVisible();
});
```

## Debugging Tests

### 1. Use `--headed` mode
See the browser as the test runs:
```bash
pnpm test:e2e --headed
```

### 2. Use `--debug` mode
Step through the test line by line:
```bash
pnpm test:e2e --debug
```

### 3. Add `page.pause()`
Pause execution at a specific point:
```typescript
test('my test', async ({ page }) => {
    await page.goto('/');
    await page.pause(); // Browser will pause here
    await page.click('button');
});
```

### 4. Take screenshots
```typescript
await page.screenshot({ path: 'screenshot.png' });
```

### 5. Check console logs
```typescript
page.on('console', msg => console.log('PAGE LOG:', msg.text()));
```

## Best Practices

1. **Use data-testid attributes** for critical elements:
   ```html
   <button data-testid="submit-button">Submit</button>
   ```
   ```typescript
   await page.click('[data-testid="submit-button"]');
   ```

2. **Avoid hardcoded waits** - Use Playwright's auto-waiting:
   ```typescript
   // ❌ Bad
   await page.waitForTimeout(5000);
   
   // ✅ Good
   await page.waitForSelector('.element');
   ```

3. **Use descriptive test names**:
   ```typescript
   // ❌ Bad
   test('test 1', async ({ page }) => { ... });
   
   // ✅ Good
   test('should display error when email is invalid', async ({ page }) => { ... });
   ```

4. **Keep tests independent** - Each test should work on its own

5. **Clean up test data** - Use unique identifiers (timestamps) to avoid conflicts

## Troubleshooting

### "Element not found"
- Element might not be loaded yet - add explicit wait
- Selector might be wrong - inspect the page HTML
- Element might be in an iframe - use `page.frameLocator()`

### "Timeout waiting for..."
- Increase timeout: `{ timeout: 10000 }`
- Check if element actually appears in the UI
- Check network tab for failed API calls

### "Test passes locally but fails in CI"
- Add `waitForLoadState('networkidle')`
- Increase timeouts for slower CI environments
- Check for timing-dependent code

## Next Steps

1. **Run the existing tests** to see them in action
2. **Write tests for critical user flows** (signup, checkout, etc.)
3. **Add tests to CI/CD pipeline** to catch bugs before deployment
4. **Use Page Object Model** for complex applications (organize selectors and actions)

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
