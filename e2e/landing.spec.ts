import { test, expect } from '@playwright/test';

test('landing page has title and navigation', async ({ page }) => {
    await page.goto('/');

    // Expect a title "PixelForge"
    await expect(page).toHaveTitle(/PixelForge/);

    // Check for getting started button or sign in
    const getStarted = page.locator('text=Framework-agnostic'); // Checking content from page.tsx
    // Actually, let's check the main heading
    await expect(page.locator('h1')).toContainText('Transform Your Images');

    // Check navigation
    await expect(page.locator('nav')).toBeVisible();
});
