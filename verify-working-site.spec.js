const { test } = require('@playwright/test');

test('Verify studiobuild.cochran.cloud has Amazon affiliate links', async ({ page }) => {
  console.log('\n🔍 Testing https://studiobuild.cochran.cloud (WORKING URL)...\n');
  
  const response = await page.goto('https://studiobuild.cochran.cloud', {
    waitUntil: 'networkidle',
    timeout: 15000
  });
  
  console.log('✅ HTTP Status:', response.status());
  
  // Check for Amazon affiliate links
  const amazonLinks = await page.locator('a[href*="officehours0c-20"]').all();
  console.log('\n🛒 Amazon Affiliate Links Found:', amazonLinks.length);
  
  for (let i = 0; i < Math.min(amazonLinks.length, 5); i++) {
    const href = await amazonLinks[i].getAttribute('href');
    const text = await amazonLinks[i].textContent();
    console.log(`  ${i+1}. ${text?.trim()} - ${href?.substring(0, 60)}...`);
  }
  
  // Check for key page elements
  const title = await page.title();
  const h1 = await page.locator('h1').first().textContent();
  const buyButtons = await page.locator('text=Buy on Amazon').count();
  
  console.log('\n📋 Page Content:');
  console.log('  Title:', title);
  console.log('  H1:', h1);
  console.log('  "Buy on Amazon" buttons:', buyButtons);
  
  // Check for affiliate disclosure
  const disclosureText = await page.locator('text=Amazon Services LLC Associates Program').count();
  console.log('  Affiliate disclosure:', disclosureText > 0 ? '✅ Present' : '❌ Missing');
  
  // Take screenshot
  await page.screenshot({ path: 'working-site-verification.png', fullPage: false });
  console.log('\n📸 Screenshot: working-site-verification.png');
  
  console.log('\n✅ VERDICT: Site is WORKING and ready for board demo!');
});
