#!/usr/bin/env node
/**
 * Extract Equipment Mentions from Office Hours Videos (Supabase)
 *
 * Queries the ohdashboard Supabase database for Office Hours episode titles
 * and extracts equipment mentions to populate the Studio Builder database.
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Supabase config (ohdashboard database)
const supabaseUrl = process.env.SUPABASE_URL || 'https://xsmbaldyidtmxslmuenm.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzbWJhbGR5aWR0bXhzbG11ZW5tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTc3NzM3MSwiZXhwIjoyMDc3MzUzMzcxfQ.hG9pNg0iiNOmanBfEJravMhk3WLF3nsmqKabQeFua0k'

if (!supabaseKey) {
  console.error('❌ Error: SUPABASE_SERVICE_KEY environment variable not set')
  console.error('Set it in your shell or add to .env file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Load current items to avoid duplicates
const itemsPath = path.join(__dirname, '../data/items.json')
const currentItems = JSON.parse(await fs.readFile(itemsPath, 'utf-8'))

// Equipment patterns to search for in titles
const equipmentPatterns = [
  // Cameras
  { regex: /Sony\s+(ZV-E10|A7|FX\d+|A6\d+|ZV-1)/gi, category: 'camera', vendor: 'Sony' },
  { regex: /Canon\s+(R\d+|EOS|M\d+)/gi, category: 'camera', vendor: 'Canon' },
  { regex: /Blackmagic\s+(Studio|Pocket|Cinema)/gi, category: 'camera', vendor: 'Blackmagic' },
  { regex: /PTZ(optics)?\s+(\w+)/gi, category: 'camera', vendor: 'PTZOptics' },
  { regex: /BirdDog\s+(\w+)/gi, category: 'camera', vendor: 'BirdDog' },
  { regex: /Logitech\s+(Brio|C\d+|MX\s+Brio)/gi, category: 'camera', vendor: 'Logitech' },
  { regex: /Elgato\s+Facecam/gi, category: 'camera', vendor: 'Elgato' },

  // Microphones
  { regex: /(Shure|SHURE)\s+(SM7B|SM7dB|MV7\+?|Beta)/gi, category: 'audio', vendor: 'Shure' },
  { regex: /(RODE|RØDECaster|RodeCaster)\s+(\w+)/gi, category: 'audio', vendor: 'RODE' },
  { regex: /Sennheiser\s+(\w+)/gi, category: 'audio', vendor: 'Sennheiser' },
  { regex: /Samson\s+Q2U/gi, category: 'audio', vendor: 'Samson' },
  { regex: /Audio[-\s]?Technica/gi, category: 'audio', vendor: 'Audio-Technica' },

  // Switchers
  { regex: /ATEM\s+(Mini|Television|Production|Constellation)/gi, category: 'control', vendor: 'Blackmagic' },
  { regex: /vMix/gi, category: 'control', vendor: 'vMix' },
  { regex: /OBS/gi, category: 'control', vendor: 'OBS' },
  { regex: /Ecamm/gi, category: 'control', vendor: 'Ecamm' },

  // Lighting
  { regex: /Aputure\s+(\w+)/gi, category: 'lighting', vendor: 'Aputure' },
  { regex: /Elgato\s+Key\s+Light/gi, category: 'lighting', vendor: 'Elgato' },
  { regex: /GodOx|Godox/gi, category: 'lighting', vendor: 'Godox' },

  // Mixers
  { regex: /(Behringer|X32|Wing|Flow)/gi, category: 'audio', vendor: 'Behringer' },
  { regex: /Yamaha\s+(MG|TF)/gi, category: 'audio', vendor: 'Yamaha' },
  { regex: /Focusrite\s+Scarlett/gi, category: 'audio', vendor: 'Focusrite' },

  // Capture Cards
  { regex: /Elgato\s+(HD60|Cam\s+Link|4K60)/gi, category: 'recording', vendor: 'Elgato' },
  { regex: /DeckLink/gi, category: 'recording', vendor: 'Blackmagic' },

  // Other
  { regex: /Stream\s*Deck/gi, category: 'control', vendor: 'Elgato' },
  { regex: /Teleprompter/gi, category: 'extras', vendor: 'Various' }
]

async function getAllVideos() {
  console.log('📺 Fetching all Office Hours videos from Supabase...\n')

  let allVideos = []
  let page = 0
  const pageSize = 1000

  while (true) {
    const { data, error } = await supabase
      .from('video_metrics')
      .select('video_id, title, views, published_at')
      .order('published_at', { ascending: false })
      .range(page * pageSize, (page + 1) * pageSize - 1)

    if (error) {
      console.error('❌ Error fetching videos:', error)
      break
    }

    if (!data || data.length === 0) break

    allVideos = allVideos.concat(data)
    console.log(`  Loaded ${allVideos.length} videos...`)

    if (data.length < pageSize) break
    page++
  }

  return allVideos
}

function extractEquipment(videos) {
  const mentions = new Map()

  videos.forEach(video => {
    const title = video.title
    if (!title) return

    equipmentPatterns.forEach(pattern => {
      const matches = title.matchAll(pattern.regex)

      for (const match of matches) {
        const fullName = match[0].trim()
        const key = fullName.toLowerCase().replace(/\s+/g, '-')

        if (!mentions.has(key)) {
          mentions.set(key, {
            name: fullName,
            category: pattern.category,
            vendor: pattern.vendor,
            episodes: [],
            totalViews: 0
          })
        }

        const item = mentions.get(key)
        item.episodes.push({
          title: video.title,
          videoId: video.video_id,
          views: video.views || 0,
          publishedAt: video.published_at
        })
        item.totalViews += (video.views || 0)
      }
    })
  })

  return mentions
}

function generateReport(mentions) {
  console.log('\n📊 Equipment Mentions Report\n')
  console.log('=' .repeat(80))

  // Sort by number of mentions
  const sorted = Array.from(mentions.entries()).sort((a, b) => b[1].episodes.length - a[1].episodes.length)

  sorted.forEach(([key, item]) => {
    console.log(`\n${item.name}`)
    console.log(`  Category: ${item.category}`)
    console.log(`  Vendor: ${item.vendor}`)
    console.log(`  Mentioned in: ${item.episodes.length} episodes`)
    console.log(`  Total views across episodes: ${item.totalViews.toLocaleString()}`)
    console.log(`  Episodes:`)
    item.episodes.slice(0, 5).forEach(ep => {
      const date = ep.publishedAt ? new Date(ep.publishedAt).toLocaleDateString() : 'Unknown'
      console.log(`    - ${ep.title} (${date}, ${ep.views?.toLocaleString() || 0} views)`)
    })
    if (item.episodes.length > 5) {
      console.log(`    ... and ${item.episodes.length - 5} more`)
    }
  })

  console.log('\n' + '='.repeat(80))
  console.log(`\nTotal unique equipment items found: ${mentions.size}`)
  console.log(`Total episodes analyzed: ${Array.from(mentions.values()).reduce((sum, item) => sum + item.episodes.length, 0)}`)
}

async function main() {
  try {
    // Fetch all videos
    const videos = await getAllVideos()
    console.log(`\n✅ Loaded ${videos.length} videos total\n`)

    // Extract equipment mentions
    const mentions = extractEquipment(videos)

    // Generate report
    generateReport(mentions)

    // Save raw data for further processing
    const outputPath = path.join(__dirname, '../data/equipment-mentions.json')
    await fs.writeFile(
      outputPath,
      JSON.stringify(Object.fromEntries(mentions), null, 2),
      'utf-8'
    )
    console.log(`\n💾 Saved detailed data to: ${outputPath}`)

    console.log('\n✨ Done! Review the report above to see what equipment was found.')
    console.log('   You can now manually add these items to data/items.json with real pricing.')

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

main()
