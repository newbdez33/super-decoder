import { test, expect } from '@playwright/test';

test.describe('Navigation between screens', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Home -> Solo Game -> Home', async ({ page }) => {
    await page.getByText('SOLO MODE').click();
    await expect(page.getByText(/LV\.\d{3}/)).toBeVisible();

    await page.getByLabel('Back').click();
    await expect(page.getByText('SUPER')).toBeVisible();
  });

  test('Home -> Duo Setup -> Home', async ({ page }) => {
    await page.getByText('DUO MODE').click();
    await expect(page.getByText('CODE SETTER')).toBeVisible();

    await page.getByText('\u2190').click();
    await expect(page.getByText('SUPER')).toBeVisible();
  });

  test('Home -> Stats -> Home', async ({ page }) => {
    await page.getByText('Stats').click();
    await expect(page.getByText('STATISTICS')).toBeVisible();

    await page.getByText('\u2190').click();
    await expect(page.getByText('SUPER')).toBeVisible();
  });

  test('Home -> Settings -> Home', async ({ page }) => {
    await page.getByText('Settings').click();
    await expect(page.getByText('SETTINGS')).toBeVisible();

    await page.getByText('\u2190').click();
    await expect(page.getByText('SUPER')).toBeVisible();
  });
});

test.describe('Duo setter screen layout', () => {
  test('should display code setter UI elements', async ({ page }) => {
    await page.goto('/');
    await page.getByText('DUO MODE').click();

    await expect(page.getByText('CODE SETTER')).toBeVisible();
    await expect(page.getByText('Set your secret code:')).toBeVisible();
    // 4 empty slots
    const slots = page.getByLabel('Empty slot');
    await expect(slots).toHaveCount(4);
  });

  test('screenshot - duo setter screen', async ({ page }) => {
    await page.goto('/');
    await page.getByText('DUO MODE').click();
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot('duo-setter-screen.png', {
      maxDiffPixelRatio: 0.05,
    });
  });
});

test.describe('Stats screen layout', () => {
  test('should display stat cards', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Stats').click();

    await expect(page.getByText('Games Played')).toBeVisible();
    await expect(page.getByText('Games Won')).toBeVisible();
    await expect(page.getByText('Win Rate')).toBeVisible();
    await expect(page.getByText('Current Level')).toBeVisible();
  });

  test('screenshot - stats screen', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Stats').click();
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot('stats-screen.png', {
      maxDiffPixelRatio: 0.05,
    });
  });
});
