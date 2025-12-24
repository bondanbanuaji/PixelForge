import { test, expect } from '@playwright/test';
import path from 'path';

test('dashboard requires auth', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/sign-in/);
});

// Since we can't easily bypass Clerk auth in E2E without complex setup or mocking,
// we will focus on the dashboard functionality assuming we are logged in IF we could mock it.
// For now, we'll write a test that we can skip or run if we provide STORAGE_STATE.

// Placeholder for full dashboard test with auth state
test.skip('dashboard upload flow', async ({ page }) => {
    // requires auth state
    await page.goto('/dashboard');

    // Check upload zone
    await expect(page.locator('text=Drag and drop your image')).toBeVisible();

    // TODO: Add file upload test when we have auth setup in global-setup
});
