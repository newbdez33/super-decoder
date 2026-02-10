import { test, expect } from '@playwright/test';

test.describe('Home Screen layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display title SUPER DECODER', async ({ page }) => {
    await expect(page.getByText('SUPER')).toBeVisible();
    await expect(page.getByText('DECODER')).toBeVisible();
  });

  test('should display all navigation buttons', async ({ page }) => {
    await expect(page.getByText('SOLO MODE')).toBeVisible();
    await expect(page.getByText('DUO MODE')).toBeVisible();
    await expect(page.getByText('FREE PLAY')).toBeVisible();
    await expect(page.getByText('Stats')).toBeVisible();
    await expect(page.getByText('Settings')).toBeVisible();
  });

  test('should display progress bar area', async ({ page }) => {
    await expect(page.getByRole('progressbar')).toBeAttached();
    await expect(page.getByText(/Level \d+ \/ 600/)).toBeVisible();
  });

  test('game container should not exceed 480px', async ({ page }) => {
    // The centered game container has maxWidth: 480
    const container = page.locator('div[style*="max-width"]').first();
    const box = await container.boundingBox();
    expect(box!.width).toBeLessThanOrEqual(480);
  });

  test('screenshot - home screen default', async ({ page }) => {
    // Wait for animations to settle
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('home-screen.png', {
      maxDiffPixelRatio: 0.05,
    });
  });
});
