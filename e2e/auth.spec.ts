import { test, expect } from '@playwright/test';

test('auth flow redirects to sign-in', async ({ page }) => {
    // Go to dashboard (protected)
    await page.goto('/dashboard');

    // Should verify redirect to sign-in
    // Note: Clerk might redirect to accounts.clerk.com or local sign-in depending on config
    // Our config is /sign-in

    await expect(page).toHaveURL(/\/sign-in/);

    // Verify sign-in page content (e.g. "Sign in")
    await expect(page.locator('h1, h2, h3')).toContainText(/Sign in|Welcome/i);
});
