import { test, expect } from '@playwright/test';

test.describe('Game Screen layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Navigate to solo mode
    await page.getByText('SOLO MODE').click();
    // Wait for game screen to load
    await page.waitForSelector('[aria-label="Back"]');
  });

  test('should display game header with level and attempts', async ({ page }) => {
    await expect(page.getByText(/LV\.\d{3}/)).toBeVisible();
    await expect(page.getByLabel('remaining attempt').first()).toBeVisible();
  });

  test('should display game board with empty slots', async ({ page }) => {
    const slots = page.getByLabel('Empty slot');
    await expect(slots.first()).toBeVisible();
  });

  test('should display color picker', async ({ page }) => {
    await expect(page.getByLabel('red')).toBeVisible();
    await expect(page.getByLabel('blue')).toBeVisible();
    await expect(page.getByLabel('green')).toBeVisible();
  });

  test('should display submit and clear buttons', async ({ page }) => {
    await expect(page.getByLabel('Submit guess')).toBeVisible();
    await expect(page.getByLabel('Clear')).toBeVisible();
  });

  test('should allow selecting colors into slots', async ({ page }) => {
    await page.getByLabel('red').click();
    await expect(page.getByLabel('red slot')).toBeVisible();
  });

  test('touch targets should be at least 44px', async ({ page }) => {
    const colorButtons = page.getByLabel('red');
    const box = await colorButtons.boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });

  test('submit button should be disabled until all slots filled', async ({ page }) => {
    const submitBtn = page.getByLabel('Submit guess');
    await expect(submitBtn).toBeDisabled();
  });

  test('screenshot - game screen initial state', async ({ page }) => {
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot('game-screen-initial.png', {
      maxDiffPixelRatio: 0.05,
    });
  });

  test('screenshot - game screen with colors selected', async ({ page }) => {
    // Select 4 colors
    await page.getByLabel('red').click();
    await page.getByLabel('blue').click();
    await page.getByLabel('green').click();
    await page.getByLabel('yellow').click();
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot('game-screen-filled.png', {
      maxDiffPixelRatio: 0.05,
    });
  });
});

test.describe('Game flow', () => {
  test('should navigate back to home from game', async ({ page }) => {
    await page.goto('/');
    await page.getByText('SOLO MODE').click();
    await page.waitForSelector('[aria-label="Back"]');

    // Dismiss confirm dialog for fresh game (no guesses yet)
    await page.getByLabel('Back').click();
    await expect(page.getByText('SUPER')).toBeVisible();
  });
});
