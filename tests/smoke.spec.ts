import { test, expect } from '@playwright/test';

test.describe('MakeItWork Smoke Tests', () => {
  test('landing page loads and has correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/MakeItWork/);
    await expect(page.getByText('Friendly, Local Tech Support')).toBeVisible();
  });

  test('dark mode switcher works', async ({ page }) => {
    await page.goto('/');
    
    // Default should be system/light usually
    const html = page.locator('html');
    
    // Find theme switcher buttons
    const darkButton = page.getByLabel('Dark theme');
    await darkButton.click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    
    const lightButton = page.getByLabel('Light theme');
    await lightButton.click();
    await expect(html).toHaveAttribute('data-theme', 'light');
  });

  test('pricing page loads', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByText('Transparent, Compassionate Pricing')).toBeVisible();
    await expect(page.getByText('No Fix, No Fee')).toBeVisible();
  });

  test('login page loads', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('Welcome to Your Portal')).toBeVisible();
    await expect(page.getByLabel('Email Address')).toBeVisible();
  });
});