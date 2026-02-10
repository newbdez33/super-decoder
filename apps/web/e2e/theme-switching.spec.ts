import { test, expect } from '@playwright/test';

test.describe('Theme switching', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to start fresh
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should apply LED Classic theme by default', async ({ page }) => {
    const bgColor = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--bg-deepest').trim()
    );
    // Default CSS variable from index.css
    expect(bgColor).toBeTruthy();
  });

  test('should switch to Modern Flat theme', async ({ page }) => {
    await page.getByText('Settings').click();
    await page.getByRole('button', { name: /Modern Flat/i }).click();

    // Verify CSS variable changed
    const accent = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--text-accent').trim()
    );
    expect(accent).toBe('#7C8CF8');
  });

  test('should switch to Cyberpunk theme', async ({ page }) => {
    await page.getByText('Settings').click();
    await page.getByRole('button', { name: /Cyberpunk/i }).click();

    const accent = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--text-accent').trim()
    );
    expect(accent).toBe('#00F0FF');
  });

  test('theme should persist after page reload', async ({ page }) => {
    await page.getByText('Settings').click();
    await page.getByRole('button', { name: /Cyberpunk/i }).click();

    // Reload the page
    await page.reload();
    await page.waitForTimeout(500);

    const accent = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--text-accent').trim()
    );
    expect(accent).toBe('#00F0FF');
  });

  test('theme should apply across screens', async ({ page }) => {
    // Switch to cyberpunk
    await page.getByText('Settings').click();
    await page.getByRole('button', { name: /Cyberpunk/i }).click();

    // Go back to home
    await page.getByText('\u2190').click();
    await page.waitForTimeout(500);

    // Verify home screen uses cyberpunk accent
    const accent = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--text-accent').trim()
    );
    expect(accent).toBe('#00F0FF');
  });

  test('screenshot - home screen with LED Classic', async ({ page }) => {
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('theme-led-classic-home.png', {
      maxDiffPixelRatio: 0.05,
    });
  });

  test('screenshot - home screen with Modern Flat', async ({ page }) => {
    await page.getByText('Settings').click();
    await page.getByRole('button', { name: /Modern Flat/i }).click();
    await page.getByText('\u2190').click();
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('theme-modern-flat-home.png', {
      maxDiffPixelRatio: 0.05,
    });
  });

  test('screenshot - home screen with Cyberpunk', async ({ page }) => {
    await page.getByText('Settings').click();
    await page.getByRole('button', { name: /Cyberpunk/i }).click();
    await page.getByText('\u2190').click();
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('theme-cyberpunk-home.png', {
      maxDiffPixelRatio: 0.05,
    });
  });

  test('screenshot - settings with Modern Flat selected', async ({ page }) => {
    await page.getByText('Settings').click();
    await page.getByRole('button', { name: /Modern Flat/i }).click();
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot('theme-modern-flat-settings.png', {
      maxDiffPixelRatio: 0.05,
    });
  });

  test('screenshot - settings with Cyberpunk selected', async ({ page }) => {
    await page.getByText('Settings').click();
    await page.getByRole('button', { name: /Cyberpunk/i }).click();
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot('theme-cyberpunk-settings.png', {
      maxDiffPixelRatio: 0.05,
    });
  });
});
