const { test, expect } = require('@playwright/test');

test('Diagnose white screen at studiobuilder.cochran.cloud', async ({ page }) => {
  // Enable console logging
  page.on('console', msg => {
    console.log(`[BROWSER ${msg.type()}]:`, msg.text());
  });

  // Capture errors
  page.on('pageerror', error => {
    console.log(`[PAGE ERROR]:`, error.message);
  });

  // Capture failed requests
  page.on('requestfailed', request => {
    console.log(`[REQUEST FAILED]: ${request.url()}`);
  });

  console.log('Navigating to https://studiobuilder.cochran.cloud...');

  await page.goto('https://studiobuilder.cochran.cloud', {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });

  // Wait a bit for any async loading
  await page.waitForTimeout(3000);

  // Take screenshot
  await page.screenshot({ path: 'white-screen-debug.png', fullPage: true });
  console.log('Screenshot saved to white-screen-debug.png');

  // Get page HTML
  const html = await page.content();
  console.log('\n--- PAGE HTML (first 1000 chars) ---');
  console.log(html.substring(0, 1000));

  // Check for specific elements
  const hasHeader = await page.locator('header').count();
  const hasTitle = await page.locator('h1').count();
  const hasMain = await page.locator('main, [class*="min-h-screen"]').count();

  console.log('\n--- ELEMENT COUNTS ---');
  console.log('Header elements:', hasHeader);
  console.log('H1 elements:', hasTitle);
  console.log('Main/container elements:', hasMain);

  // Check if there's any text visible
  const bodyText = await page.locator('body').textContent();
  console.log('\n--- VISIBLE TEXT ---');
  console.log(bodyText || '(NO TEXT FOUND)');

  // Check specific error patterns
  const hasError = bodyText.includes('error') || bodyText.includes('Error');
  const has404 = bodyText.includes('404') || bodyText.includes('Not Found');
  const has500 = bodyText.includes('500') || bodyText.includes('Server Error');

  console.log('\n--- ERROR INDICATORS ---');
  console.log('Contains "error":', hasError);
  console.log('Contains "404":', has404);
  console.log('Contains "500":', has500);

  // Get computed styles of body
  const bodyBg = await page.locator('body').evaluate(el =>
    window.getComputedStyle(el).backgroundColor
  );
  console.log('\n--- BODY BACKGROUND COLOR ---');
  console.log(bodyBg);
});
