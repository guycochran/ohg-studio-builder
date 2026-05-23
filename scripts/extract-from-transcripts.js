#!/usr/bin/env node
/**
 * Extract Equipment from Office Hours Episode Transcripts
 *
 * Searches through the full transcript text in the ohg-platform database
 * to find equipment mentions with context.
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Supabase config (ohg-platform database)
const supabaseUrl = 'https://xsmbaldyidtmxslmuenm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzbWJhbGR5aWR0bXhzbG11ZW5tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTc3NzM3MSwiZXhwIjoyMDc3MzUzMzcxfQ.hG9pNg0iiNOmanBfEJravMhk3WLF3nsmqKabQeFua0k'

const supabase = createClient(supabaseUrl, supabaseKey)

// Comprehensive equipment patterns
const equipmentPatterns = [
  // Cameras - Sony
  { regex: /Sony\s+(ZV-E10|ZV-1|A7\s*(?:III|IV|S|R)?|FX\d+|A6\d+|Alpha\s*\d+)/gi, category: 'camera', vendor: 'Sony' },

  // Cameras - Canon
  { regex: /Canon\s+(R\d+|EOS\s+R\d+|M\d+|XA\d+)/gi, category: 'camera', vendor: 'Canon' },

  // Cameras - Blackmagic
  { regex: /Blackmagic\s+(Studio|Pocket|Cinema|URSA|Camera)/gi, category: 'camera', vendor: 'Blackmagic' },

  // Cameras - PTZ
  { regex: /PTZ(?:optics)?\s*(\d+X?|[A-Z]+\d+)/gi, category: 'camera', vendor: 'PTZOptics' },
  { regex: /BirdDog\s+(P\d+|A\d+|X\d+)/gi, category: 'camera', vendor: 'BirdDog' },
  { regex: /Lumens\s+(\w+)/gi, category: 'camera', vendor: 'Lumens' },

  // Cameras - Webcams
  { regex: /Logitech\s+(Brio|C\d+|MX\s+Brio|StreamCam)/gi, category: 'camera', vendor: 'Logitech' },
  { regex: /Elgato\s+Facecam\s*(Pro|4K)?/gi, category: 'camera', vendor: 'Elgato' },
  { regex: /OBSBOT\s+(Tiny|Tail|Meet)/gi, category: 'camera', vendor: 'OBSBOT' },

  // Microphones - Shure
  { regex: /Shure\s+(SM7B|SM7dB|MV7\+?|Beta\s*\d+|SM\d+)/gi, category: 'audio', vendor: 'Shure' },

  // Microphones - RODE
  { regex: /(?:RODE|Rode|RØDECaster)\s+(PodMic|NT1|Wireless\s+(?:Pro|Go)|Procaster|VideoMic)/gi, category: 'audio', vendor: 'RODE' },
  { regex: /RØDECaster\s+(Pro\s*(?:II)?|Duo|Video)/gi, category: 'audio', vendor: 'RODE' },

  // Microphones - Others
  { regex: /Sennheiser\s+(MKE?\s*\d+|EW[-\s]?D?)/gi, category: 'audio', vendor: 'Sennheiser' },
  { regex: /Audio[-\s]?Technica\s+(AT\d+)/gi, category: 'audio', vendor: 'Audio-Technica' },
  { regex: /Samson\s+Q2U/gi, category: 'audio', vendor: 'Samson' },
  { regex: /Blue\s+Yeti/gi, category: 'audio', vendor: 'Blue' },
  { regex: /Countryman\s+(H6|E6)/gi, category: 'audio', vendor: 'Countryman' },

  // Switchers/Production
  { regex: /ATEM\s+(Mini(?:\s+(?:Pro|Extreme|ISO))?|Television|Production|Constellation)/gi, category: 'control', vendor: 'Blackmagic' },
  { regex: /vMix\s*(Pro|4K|HD|Basic)?/gi, category: 'control', vendor: 'vMix' },
  { regex: /OBS\s+Studio/gi, category: 'control', vendor: 'OBS' },
  { regex: /Ecamm\s+Live/gi, category: 'control', vendor: 'Ecamm' },
  { regex: /TriCaster/gi, category: 'control', vendor: 'NewTek' },

  // Audio Mixers
  { regex: /Behringer\s+(X32|Wing|X-Air|Flow\s*\d+)/gi, category: 'audio', vendor: 'Behringer' },
  { regex: /Yamaha\s+(MG\d+|TF\d+|QL\d+)/gi, category: 'audio', vendor: 'Yamaha' },
  { regex: /Focusrite\s+Scarlett\s*\d*i\d*/gi, category: 'audio', vendor: 'Focusrite' },
  { regex: /Allen\s+&\s+Heath\s+(SQ|Qu)/gi, category: 'audio', vendor: 'Allen & Heath' },

  // Lighting
  { regex: /Aputure\s+(Amaran|LS\s*\d+|MC)/gi, category: 'lighting', vendor: 'Aputure' },
  { regex: /Elgato\s+Key\s+Light\s*(Air)?/gi, category: 'lighting', vendor: 'Elgato' },
  { regex: /GodOx|Godox/gi, category: 'lighting', vendor: 'Godox' },
  { regex: /Nanlite/gi, category: 'lighting', vendor: 'Nanlite' },

  // Capture Cards
  { regex: /Elgato\s+(HD60|4K60|Cam\s+Link)/gi, category: 'recording', vendor: 'Elgato' },
  { regex: /DeckLink\s*(Mini|Studio|Quad)?/gi, category: 'recording', vendor: 'Blackmagic' },
  { regex: /HyperDeck/gi, category: 'recording', vendor: 'Blackmagic' },

  // Lenses
  { regex: /Sigma\s+(\d+mm\s+f\/[\d.]+)/gi, category: 'camera', vendor: 'Sigma' },
  { regex: /Tamron\s+(\d+-\d+mm\s+f\/[\d.]+)/gi, category: 'camera', vendor: 'Tamron' },

  // Controllers
  { regex: /Stream\s*Deck\s*(XL|Mini|Plus)?/gi, category: 'control', vendor: 'Elgato' },
  { regex: /X-Keys/gi, category: 'control', vendor: 'P.I. Engineering' },

  // Other
  { regex: /Teleprompter/gi, category: 'extras', vendor: 'Various' }
]

async function getAllTranscripts() {
  console.log('📚 Fetching all transcripts from Supabase...\n')

  let allProjects = []
  let page = 0
  const pageSize = 1000

  while (true) {
    const { data, error } = await supabase
      .from('projects')
      .select('id, title, youtube_url, transcript_text, created_at')
      .order('created_at', { ascending: false })
      .range(page * pageSize, (page + 1) * pageSize - 1)

    if (error) {
      console.error('❌ Error fetching transcripts:', error)
      break
    }

    if (!data || data.length === 0) break

    // Filter out projects without transcripts
    const withTranscripts = data.filter(p => p.transcript_text && p.transcript_text.length > 100)
    allProjects = allProjects.concat(withTranscripts)
    console.log(`  Loaded ${allProjects.length} projects with transcripts...`)

    if (data.length < pageSize) break
    page++
  }

  return allProjects
}

function extractEquipment(projects) {
  const mentions = new Map()

  projects.forEach(project => {
    const text = project.transcript_text
    if (!text) return

    equipmentPatterns.forEach(pattern => {
      const matches = text.matchAll(pattern.regex)

      for (const match of matches) {
        const fullName = match[0].trim()
        const key = fullName.toLowerCase().replace(/\s+/g, '-')

        if (!mentions.has(key)) {
          mentions.set(key, {
            name: fullName,
            category: pattern.category,
            vendor: pattern.vendor,
            episodes: [],
            contexts: []
          })
        }

        const item = mentions.get(key)

        // Avoid duplicate episodes
        const alreadyAdded = item.episodes.find(e => e.id === project.id)
        if (!alreadyAdded) {
          item.episodes.push({
            id: project.id,
            title: project.title,
            url: project.youtube_url,
            date: project.created_at
          })

          // Extract context (100 chars before/after mention)
          const matchIndex = match.index
          const contextStart = Math.max(0, matchIndex - 100)
          const contextEnd = Math.min(text.length, matchIndex + match[0].length + 100)
          const context = text.substring(contextStart, contextEnd)

          item.contexts.push({
            episode: project.title,
            snippet: '...' + context.trim() + '...'
          })
        }
      }
    })
  })

  return mentions
}

function generateReport(mentions) {
  console.log('\n📊 Equipment Mentions from Full Transcripts\n')
  console.log('=' .repeat(100))

  // Sort by number of mentions
  const sorted = Array.from(mentions.entries()).sort((a, b) => b[1].episodes.length - a[1].episodes.length)

  sorted.slice(0, 50).forEach(([key, item]) => {
    console.log(`\n${item.name}`)
    console.log(`  Category: ${item.category} | Vendor: ${item.vendor}`)
    console.log(`  Mentioned in: ${item.episodes.length} episodes`)

    // Show first context snippet
    if (item.contexts.length > 0) {
      console.log(`  Context: "${item.contexts[0].snippet}"`)
    }

    console.log(`  Recent episodes:`)
    item.episodes.slice(0, 3).forEach(ep => {
      const date = ep.date ? new Date(ep.date).toLocaleDateString() : 'Unknown'
      console.log(`    - ${ep.title} (${date})`)
    })
    if (item.episodes.length > 3) {
      console.log(`    ... and ${item.episodes.length - 3} more`)
    }
  })

  console.log('\n' + '='.repeat(100))
  console.log(`\nTotal unique equipment items found: ${mentions.size}`)
  console.log(`Showing top 50 most mentioned items`)
}

async function main() {
  try {
    // Fetch all transcripts
    const projects = await getAllTranscripts()
    console.log(`\n✅ Loaded ${projects.length} projects with transcripts\n`)

    if (projects.length === 0) {
      console.log('⚠️  No transcripts found. Database may be empty.')
      return
    }

    // Extract equipment mentions
    console.log('🔍 Searching transcripts for equipment mentions...\n')
    const mentions = extractEquipment(projects)

    // Generate report
    generateReport(mentions)

    // Save raw data
    const outputPath = path.join(__dirname, '../data/transcript-equipment-mentions.json')
    await fs.writeFile(
      outputPath,
      JSON.stringify(Object.fromEntries(mentions), null, 2),
      'utf-8'
    )
    console.log(`\n💾 Saved detailed data to: ${outputPath}`)

    console.log('\n✨ Done! These are real equipment mentions from transcript content.')

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

main()
