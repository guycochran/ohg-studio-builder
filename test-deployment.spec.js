const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://10.0.1.18:3011';

test.describe('OHG Studio Builder - Deployment Test', () => {
  test('should load homepage and show all key features', async ({ page }) => {
    // Navigate to the deployed app (using container IP since localhost:3010 has connection issues)
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Check header loaded
    await expect(page.locator('h1')).toContainText('Studio Builder');
    await expect(page.locator('text=Office Hours Global')).toBeVisible();

    // Check budget tier selector is visible and has 4 options
    await expect(page.locator('text=Budget Tier')).toBeVisible();
    const tierButtons = page.locator('button:has-text("$")').filter({ hasText: /\$500|\$5,000|\$10,000|\$20,000/ });
    await expect(tierButtons).toHaveCount(4);

    // Check use case selector has 4 options
    await expect(page.locator('text=Primary Use Case')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Podcasting Audio-first' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Recording Video content' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Live Live streaming' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Hybrid Does everything' })).toBeVisible();

    // Check equipment items are displayed
    await expect(page.locator('text=Sony ZV-E10 II')).toBeVisible();
    await expect(page.locator('text=Shure MV7+')).toBeVisible();
    await expect(page.locator('text=ATEM Mini Pro')).toBeVisible();

    // Check YouTube mentions badges
    const mentionBadges = page.locator('button:has-text("Mentioned in 3 episodes")');
    await expect(mentionBadges.first()).toBeVisible();

    // Check budget sidebar
    await expect(page.locator('text=Total Budget')).toBeVisible();
    await expect(page.locator('header').getByText('$5,000')).toBeVisible();

    console.log('✅ All core features verified');
  });

  test('should switch between budget tiers', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Click $10,000 tier
    await page.getByRole('button', { name: '$10,000 Advanced' }).click();
    await page.waitForTimeout(1000);

    // Verify budget updated in header
    await expect(page.locator('header').getByText('$10,000')).toBeVisible();

    console.log('✅ Tier switching works');
  });

  test('should switch between use cases', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Click Podcasting use case
    await page.getByRole('button', { name: 'Podcasting Audio-first' }).click();
    await page.waitForTimeout(1000);

    // Verify build title changed
    await expect(page.locator('h2')).toContainText('Podcast');

    console.log('✅ Use case switching works');
  });
});
