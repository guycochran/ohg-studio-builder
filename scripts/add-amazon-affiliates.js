#!/usr/bin/env node

/**
 * Amazon Associates Affiliate Link Generator for OHG Studio Builder
 *
 * This script helps generate Amazon affiliate links for equipment items.
 *
 * Store ID: officehours0c-20
 *
 * Usage:
 *   node scripts/add-amazon-affiliates.js
 *
 * Affiliate Link Format:
 *   https://www.amazon.com/dp/[ASIN]?tag=officehours0c-20
 *
 * To find ASINs:
 *   1. Search for product on Amazon
 *   2. Copy ASIN from product page (found in "Product information" section)
 *   3. Or extract from URL: amazon.com/dp/B08XXXX or /gp/product/B08XXXX
 */

const fs = require('fs');
const path = require('path');

const STORE_ID = 'officehours0c-20';

// Sample ASINs for common equipment (YOU NEED TO FIND REAL ASINs)
const SAMPLE_ASINS = {
  'mx-brio': 'B0CX4D3RTY',           // Logitech MX Brio
  'sm7b': 'B0002E4Z8M',               // Shure SM7B
  'mv7-plus': 'B0D6QD5MY1',           // Shure MV7+
  'podmic-usb': 'B0CQYW8L9V',         // RODE PodMic USB
  'scarlett-2i2': 'B0CTVDSM8B',       // Focusrite Scarlett 2i2 4th Gen
  'mdr-7506': 'B000AJIF4E',           // Sony MDR-7506
  'mac-mini-m4': 'B0DPCGBRG6',        // Mac mini M4
  'stream-deck-mini': 'B07DYRS1WH',   // Elgato Stream Deck Mini
  'cam-link-4k': 'B07K3FN5MR',        // Elgato Cam Link 4K
  'usb-capture': 'B0BZ9ZZVDY',        // Elgato HD60 X
  'atem-mini': 'B086R79C5J',          // ATEM Mini Pro
  'obsbot-tiny2': 'B0CPY8QDLW',       // OBSBOT Tiny 2
  'dji-mic-2': 'B0CTY9ZMWB',          // DJI Mic 2
  'halo-60x': 'B0DNW3KQWP',           // Aputure Amaran Halo 60x
  'halo-100x': 'B0DNW36BHP',          // Aputure Amaran Halo 100x
  'elgato-key': 'B082QHRZFW',         // Elgato Key Light Air
  'ssd-1tb': 'B0BLQKDLZ9',            // Samsung T7 1TB
  'boom-arm': 'B0B4LN95W9',           // RODE PSA1+
};

/**
 * Generate Amazon affiliate link
 */
function generateAffiliateLink(asin) {
  if (!asin) return null;
  return `https://www.amazon.com/dp/${asin}?tag=${STORE_ID}`;
}

/**
 * Generate affiliate link structure for items.json
 */
function generateAffiliateUrls(asin) {
  return {
    amazon: generateAffiliateLink(asin)
  };
}

/**
 * Main function - Updates items.json with affiliate links
 */
function main() {
  const itemsPath = path.join(__dirname, '../data/items.json');
  const items = JSON.parse(fs.readFileSync(itemsPath, 'utf8'));

  let updatedCount = 0;

  // Add affiliate links to items that have ASINs
  Object.keys(SAMPLE_ASINS).forEach(itemId => {
    if (items[itemId]) {
      items[itemId].affiliateUrls = generateAffiliateUrls(SAMPLE_ASINS[itemId]);
      updatedCount++;
    }
  });

  // Write updated items back to file
  fs.writeFileSync(itemsPath, JSON.stringify(items, null, 2));

  console.log(`✅ Updated ${updatedCount} items with Amazon affiliate links`);
  console.log(`\n📋 TODO: Add ASINs for remaining items`);
  console.log(`   Total items: ${Object.keys(items).length}`);
  console.log(`   Items with affiliate links: ${updatedCount}`);
  console.log(`   Items remaining: ${Object.keys(items).length - updatedCount}`);

  console.log(`\n🔍 How to find ASINs:`);
  console.log(`   1. Go to Amazon.com`);
  console.log(`   2. Search for the exact product name`);
  console.log(`   3. Find ASIN in "Product information" section`);
  console.log(`   4. Or look in URL: amazon.com/dp/[ASIN]`);

  console.log(`\n💰 Affiliate Link Format:`);
  console.log(`   https://www.amazon.com/dp/[ASIN]?tag=${STORE_ID}`);

  console.log(`\n🎯 Priority items to add (highest revenue potential):`);
  const highValueItems = Object.entries(items)
    .filter(([_, item]) => item.price > 500 && !item.affiliateUrls)
    .sort((a, b) => b[1].price - a[1].price)
    .slice(0, 20);

  highValueItems.forEach(([id, item]) => {
    console.log(`   - ${item.name} ($${item.price})`);
  });
}

if (require.main === module) {
  main();
}

module.exports = { generateAffiliateLink, generateAffiliateUrls };
