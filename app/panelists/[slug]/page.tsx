'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Wrench, ExternalLink, ArrowLeft, Globe, Twitter, Linkedin, Package } from 'lucide-react'
import Link from 'next/link'
import itemsData from '@/data/items.json'

interface Panelist {
  id: string
  email: string
  panelist_slug: string
  panelist_bio: string | null
  panelist_photo_url: string | null
  specialty: string | null
  website_url: string | null
  twitter_handle: string | null
  linkedin_url: string | null
  gear: {
    id: string
    item_id: string
    custom_name: string | null
    notes: string | null
    photo_url: string | null
    purchase_year: number | null
    display_order: number
  }[]
}

export default function PanelistDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [panelist, setPanelist] = useState<Panelist | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPanelist() {
      try {
        const response = await fetch('https://mindful-dev.cochran.cloud/api/public/panelists', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug: params.slug }),
        })

        if (!response.ok) {
          if (response.status === 404) {
            setError('Panelist not found')
          } else {
            throw new Error('Failed to fetch panelist')
          }
          return
        }

        const data = await response.json()
        setPanelist(data.panelist)
      } catch (err) {
        console.error('Error fetching panelist:', err)
        setError('Failed to load panelist. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.slug) {
      fetchPanelist()
    }
  }, [params.slug])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading panelist...</div>
      </div>
    )
  }

  if (error || !panelist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">{error || 'Panelist Not Found'}</h1>
          <Link
            href="/panelists"
            className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Panelists
          </Link>
        </div>
      </div>
    )
  }

  const displayName = panelist.email.split('@')[0].replace(/[.-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header */}
      <header className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50 shadow-2xl shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/panelists" className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-5 h-5" />
            Back to Panelists
          </Link>
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl blur opacity-50"></div>
              <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-xl shadow-lg">
                <Wrench className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent tracking-tight">
                {displayName}'s Studio
              </h1>
              <p className="text-slate-400 mt-1.5 text-sm font-medium tracking-wide">
                Office Hours Global Panelist
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Section */}
        <div className="relative bg-gradient-to-br from-slate-800/40 via-slate-800/30 to-slate-900/40 border border-slate-700/50 rounded-2xl p-8 mb-12 shadow-2xl overflow-hidden backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/5 via-transparent to-blue-600/5"></div>
          <div className="relative flex flex-col md:flex-row items-start gap-8">
            {panelist.panelist_photo_url ? (
              <img
                src={panelist.panelist_photo_url}
                alt={displayName}
                className="w-32 h-32 rounded-full object-cover border-4 border-slate-700 shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-4xl shadow-lg">
                {panelist.email[0].toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-white">{displayName}</h2>
                {panelist.specialty && (
                  <div className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-medium">
                    {panelist.specialty}
                  </div>
                )}
              </div>
              {panelist.panelist_bio && (
                <p className="text-slate-300 text-lg leading-relaxed mb-4">
                  {panelist.panelist_bio}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-4">
                {panelist.website_url && (
                  <a
                    href={panelist.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    Website
                  </a>
                )}
                {panelist.twitter_handle && (
                  <a
                    href={`https://twitter.com/${panelist.twitter_handle.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                    Twitter
                  </a>
                )}
                {panelist.linkedin_url && (
                  <a
                    href={panelist.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Studio Gear */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Package className="w-7 h-7 text-orange-400" />
            <h3 className="text-2xl font-bold text-white">
              Studio Gear ({panelist.gear.length} {panelist.gear.length === 1 ? 'item' : 'items'})
            </h3>
          </div>

          {panelist.gear.length === 0 ? (
            <div className="text-center py-16 bg-slate-800/40 rounded-xl border border-slate-700/50">
              <p className="text-slate-400 text-lg">No gear shared yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {panelist.gear.map((item) => {
                // Try to find item in catalog
                const catalogItem = itemsData[item.item_id as keyof typeof itemsData]

                return (
                  <div
                    key={item.id}
                    className="relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/50 rounded-xl p-6 hover:border-orange-500/50 transition-all duration-300"
                  >
                    {item.photo_url && (
                      <img
                        src={item.photo_url}
                        alt={item.custom_name || item.item_id}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h4 className="text-xl font-bold text-white mb-2">
                      {item.custom_name || catalogItem?.name || item.item_id}
                    </h4>
                    {catalogItem && (
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm text-slate-400">{catalogItem.cat}</span>
                        {catalogItem.price && (
                          <span className="text-sm font-semibold text-orange-400">
                            ${catalogItem.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    )}
                    {item.notes && (
                      <p className="text-slate-300 text-sm mb-3 italic">
                        "{item.notes}"
                      </p>
                    )}
                    {catalogItem?.why && (
                      <p className="text-slate-400 text-sm mb-3">
                        {catalogItem.why}
                      </p>
                    )}
                    {item.purchase_year && (
                      <p className="text-xs text-slate-500 mb-3">
                        Purchased: {item.purchase_year}
                      </p>
                    )}
                    {catalogItem && (
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(catalogItem.name + ' buy')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors text-sm font-medium"
                      >
                        Find this gear
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* CTA to Build Similar */}
        <div className="mt-12 relative bg-gradient-to-br from-orange-500/10 to-blue-500/10 border border-orange-500/30 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">
            Build Your Own Studio Like {displayName}
          </h3>
          <p className="text-slate-300 mb-6">
            Use Studio Builder to create your perfect setup
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
          >
            Start Building
            <Wrench className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
