'use client'

import { useState, useEffect } from 'react'
import { Wrench, ExternalLink, Sparkles, Users } from 'lucide-react'
import Link from 'next/link'

interface Panelist {
  id: string
  email: string
  display_name: string | null
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

export default function PanelistsPage() {
  const [panelists, setPanelists] = useState<Panelist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPanelists() {
      try {
        const response = await fetch('https://mindful-dev.cochran.cloud/api/public/panelists')

        if (!response.ok) throw new Error('Failed to fetch panelists')

        const data = await response.json()
        setPanelists(data.panelists || [])
      } catch (err) {
        console.error('Error fetching panelists:', err)
        setError('Failed to load panelists. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPanelists()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading panelists...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    )
  }

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
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-6 hover:opacity-80 transition-opacity">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl blur opacity-50"></div>
                <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-xl shadow-lg">
                  <Wrench className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent tracking-tight">
                  Studio Builder
                </h1>
                <p className="text-slate-400 mt-1.5 text-sm font-medium tracking-wide">
                  By <span className="text-orange-500 font-bold">Office Hours Global</span> • Panelist Studios
                </p>
              </div>
            </Link>
          </div>
        </div>
      </header>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-slate-800/40 via-slate-800/30 to-slate-900/40 border border-slate-700/50 rounded-2xl p-8 mb-12 shadow-2xl overflow-hidden backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/5 via-transparent to-blue-600/5"></div>
          <div className="relative flex items-start gap-5">
            <div className="bg-gradient-to-br from-orange-500/20 to-blue-500/20 p-3 rounded-xl border border-orange-500/30">
              <Users className="w-7 h-7 text-orange-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
                See What the Pros Use
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed max-w-3xl">
                Real studio setups from Office Hours Global panelists. Get inspired by production gear trusted by experienced creators.
              </p>
            </div>
          </div>
        </div>

        {/* Panelists Grid */}
        {panelists.length === 0 ? (
          <div className="text-center py-16">
            <Sparkles className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No Panelists Yet</h3>
            <p className="text-slate-400">
              Panelists will appear here once they create their profiles
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {panelists.map((panelist) => (
              <Link
                key={panelist.id}
                href={`/panelists/${panelist.panelist_slug}`}
                className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/50 rounded-xl p-6 hover:border-orange-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10"
              >
                <div className="flex items-start gap-4 mb-4">
                  {panelist.panelist_photo_url ? (
                    <img
                      src={panelist.panelist_photo_url}
                      alt={panelist.email}
                      className="w-16 h-16 rounded-full object-cover border-2 border-slate-600 group-hover:border-orange-500 transition-colors"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-xl">
                      {panelist.email[0].toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
                      {panelist.display_name || panelist.email.split('@')[0].replace(/[.-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </h3>
                    {panelist.specialty && (
                      <p className="text-sm text-orange-400 font-medium mt-1">
                        {panelist.specialty}
                      </p>
                    )}
                  </div>
                </div>

                {panelist.panelist_bio && (
                  <p className="text-slate-300 text-sm line-clamp-3 mb-4">
                    {panelist.panelist_bio}
                  </p>
                )}

                {panelist.gear.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-700/50">
                    <p className="text-xs text-slate-400 font-medium mb-2">
                      {panelist.gear.length} {panelist.gear.length === 1 ? 'item' : 'items'} in their studio
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {panelist.gear.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded"
                        >
                          {item.custom_name || item.item_id}
                        </div>
                      ))}
                      {panelist.gear.length > 3 && (
                        <div className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded">
                          +{panelist.gear.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-4 flex items-center text-orange-400 text-sm font-medium">
                  View Studio
                  <ExternalLink className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Become a Panelist CTA */}
        <div className="mt-16 relative bg-gradient-to-br from-orange-500/10 to-blue-500/10 border border-orange-500/30 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">
            Are you an Office Hours Global panelist?
          </h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Showcase your studio gear and inspire the community. Create your panelist profile in Mindful Intake.
          </p>
          <a
            href="https://mindful-dev.cochran.cloud/dashboard/panelist-profile"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
          >
            Create Panelist Profile
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  )
}
