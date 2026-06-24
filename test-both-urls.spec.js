const { test } = require('@playwright/test');

test('Test BOTH studio URLs', async ({ page }) => {
  console.log('\n🔍 Testing studiobuilder.cochran.cloud (what you tested)...');
  let response1 = await page.goto('https://studiobuilder.cochran.cloud', { timeout: 10000 });
  console.log('Status:', response1.status());
  const html1 = await page.content();
  console.log('Has content?', html1.length > 100 ? 'YES' : 'NO', `(${html1.length} chars)`);
  
  console.log('\n🔍 Testing studiobuild.cochran.cloud (what tunnel config has)...');
  let response2 = await page.goto('https://studiobuild.cochran.cloud', { timeout: 10000 });
  console.log('Status:', response2.status());
  const html2 = await page.content();
  console.log('Has content?', html2.length > 100 ? 'YES' : 'NO', `(${html2.length} chars)`);
  
  if (html2.length > 100) {
    const h1Count = await page.locator('h1').count();
    const amazonCount = await page.locator('a[href*="amazon.com"]').count();
    console.log('\n✅ FOUND IT! studiobuild.cochran.cloud works!');
    console.log('H1 tags:', h1Count);
    console.log('Amazon affiliate links:', amazonCount);
  }
});
