import { test, expect } from '@playwright/test';

test.describe('Settings Screen layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByText('Settings').click();
  });

  test('should display settings header', async ({ page }) => {
    await expect(page.getByText('SETTINGS')).toBeVisible();
  });

  test('should display all setting toggles', async ({ page }) => {
    await expect(page.getByLabel('Sound effects')).toBeVisible();
    await expect(page.getByLabel('Vibration')).toBeVisible();
    await expect(page.getByLabel('Color blind mode')).toBeVisible();
  });

  test('should display theme selector with 3 options', async ({ page }) => {
    await expect(page.getByRole('button', { name: /LED Classic/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Modern Flat/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Cyberpunk/i })).toBeVisible();
  });

  test('LED Classic should be active by default', async ({ page }) => {
    const ledBtn = page.getByRole('button', { name: /LED Classic/i });
    await expect(ledBtn).toHaveAttribute('aria-pressed', 'true');
  });

  test('should display language selector', async ({ page }) => {
    await expect(page.getByLabel('Language')).toBeVisible();
  });

  test('should display reset button', async ({ page }) => {
    await expect(page.getByText('Reset All Progress')).toBeVisible();
  });

  test('should navigate back to home', async ({ page }) => {
    await page.getByText('\u2190').click();
    await expect(page.getByText('SUPER')).toBeVisible();
  });

  test('screenshot - settings screen default', async ({ page }) => {
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot('settings-screen.png', {
      maxDiffPixelRatio: 0.05,
    });
  });
});
