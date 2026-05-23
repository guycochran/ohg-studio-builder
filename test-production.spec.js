const { test, expect } = require('@playwright/test');

// Use Cloudflare IP for testing until DNS propagates locally
const BASE_URL = 'https://studiobuilder.cochran.cloud';

test.use({
  baseURL: BASE_URL,
  ignoreHTTPSErrors: false,
});

test.describe('OHG Studio Builder - Production Test', () => {
  test('should load production site and show all key features', async ({ page }) => {
    // Navigate to production URL
    await page.goto('/', { waitUntil: 'networkidle', timeout: 30000 });

    // Check header loaded
    await expect(page.locator('h1')).toContainText('Studio Builder', { timeout: 10000 });
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

    console.log('✅ All core features verified on production');
  });

  test('should switch between budget tiers on production', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle', timeout: 30000 });

    // Click $10,000 tier
    await page.getByRole('button', { name: '$10,000 Advanced' }).click();
    await page.waitForTimeout(1000);

    // Verify budget updated in header
    await expect(page.locator('header').getByText('$10,000')).toBeVisible();

    console.log('✅ Tier switching works on production');
  });

  test('should switch between use cases on production', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle', timeout: 30000 });

    // Click Podcasting use case
    await page.getByRole('button', { name: 'Podcasting Audio-first' }).click();
    await page.waitForTimeout(1000);

    // Verify build title changed
    await expect(page.locator('h2')).toContainText('Podcast');

    console.log('✅ Use case switching works on production');
  });
});
