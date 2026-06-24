const { test, expect } = require('@playwright/test');

test('Test studiobuilder.cochran.cloud RIGHT NOW', async ({ page }) => {
  console.log('\n🧪 Testing https://studiobuilder.cochran.cloud...\n');
  
  const response = await page.goto('https://studiobuilder.cochran.cloud', {
    waitUntil: 'networkidle',
    timeout: 30000
  });
  
  console.log('HTTP Status:', response.status());
  console.log('Response URL:', response.url());
  
  // Get the HTML content
  const html = await page.content();
  console.log('\nHTML Length:', html.length, 'characters');
  console.log('HTML Preview:', html.substring(0, 500));
  
  // Check for key elements
  const title = await page.title();
  console.log('\nPage Title:', title);
  
  const h1Count = await page.locator('h1').count();
  const buttonCount = await page.locator('button').count();
  const amazonLinkCount = await page.locator('a[href*="amazon.com"]').count();
  
  console.log('\nElement Counts:');
  console.log('- H1 tags:', h1Count);
  console.log('- Buttons:', buttonCount);
  console.log('- Amazon links:', amazonLinkCount);
  
  // Take screenshot
  await page.screenshot({ path: 'production-test-now.png', fullPage: true });
  console.log('\n📸 Screenshot saved: production-test-now.png');
  
  // TRUTH TIME
  if (response.status() === 404) {
    console.log('\n❌ TRUTH: Site returns HTTP 404 - White screen confirmed');
  } else if (response.status() === 200 && h1Count > 0) {
    console.log('\n✅ TRUTH: Site is WORKING - Page loads with content');
  } else if (response.status() === 200 && h1Count === 0) {
    console.log('\n⚠️  TRUTH: HTTP 200 but NO content - Empty page');
  }
});
