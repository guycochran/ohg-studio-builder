'use client'

import { useState } from 'react'
import { Tier, UseCase, Category } from '@/lib/types'
import { formatCurrency, calculateTotal, cn } from '@/lib/utils'
import itemsDataRaw from '@/data/items.json'
import buildsDataRaw from '@/data/builds.json'

// Type assertions for JSON imports
const itemsData = itemsDataRaw as Record<string, import('@/lib/types').Item>
const buildsData = buildsDataRaw as Record<string, import('@/lib/types').Build>
import { TierSelector } from '@/components/studio/TierSelector'
import { UseCaseSelector } from '@/components/studio/UseCaseSelector'
import { ItemCard } from '@/components/studio/ItemCard'
import { BudgetSummary } from '@/components/studio/BudgetSummary'
import { Wrench, Sparkles } from 'lucide-react'

export default function Home() {
  const [selectedTier, setSelectedTier] = useState<Tier>('5000')
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase>('hybrid')
  const [customItems, setCustomItems] = useState<string[]>([])

  // Get baseline build
  const buildKey = `${selectedTier}-${selectedUseCase}`
  const baselineBuild = buildsData[buildKey as keyof typeof buildsData]
  const currentItems = customItems.length > 0 ? customItems : baselineBuild?.items || []

  // Calculate totals
  const total = calculateTotal(currentItems, itemsData)
  const tierBudget = parseInt(selectedTier)
  const remaining = tierBudget - total

  // Group items by category
  const categorizedItems: Record<Category, typeof currentItems> = {
    camera: [],
    audio: [],
    lighting: [],
    control: [],
    computer: [],
    recording: [],
    cables: [],
    extras: []
  }

  currentItems.forEach(itemId => {
    const item = itemsData[itemId as keyof typeof itemsData]
    if (item) {
      categorizedItems[item.cat as Category].push(itemId)
    }
  })

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
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl blur opacity-50"></div>
                <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-xl shadow-lg">
                  <Wrench className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent tracking-tight">
                  OHG Studio Builder
                </h1>
                <p className="text-slate-400 mt-1.5 text-sm font-medium tracking-wide">
                  By <span className="text-orange-500 font-bold">Office Hours Global</span> • Professional Studio Design Platform
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right bg-gradient-to-br from-slate-800/50 to-slate-900/50 px-6 py-4 rounded-xl border border-slate-700/50 shadow-xl">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Budget</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  {formatCurrency(tierBudget)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Controls */}
        <div className="space-y-8 mb-12">
          {/* Tier Selection */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-4 uppercase tracking-widest flex items-center gap-2">
              <div className="w-1 h-4 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
              Budget Tier
            </label>
            <TierSelector selected={selectedTier} onSelect={setSelectedTier} />
          </div>

          {/* Use Case Selection */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-4 uppercase tracking-widest flex items-center gap-2">
              <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
              Primary Use Case
            </label>
            <UseCaseSelector selected={selectedUseCase} onSelect={setSelectedUseCase} />
          </div>
        </div>

        {/* Build Info */}
        {baselineBuild && (
          <div className="relative bg-gradient-to-br from-slate-800/40 via-slate-800/30 to-slate-900/40 border border-slate-700/50 rounded-2xl p-8 mb-12 shadow-2xl overflow-hidden backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/5 via-transparent to-blue-600/5"></div>
            <div className="relative flex items-start gap-5">
              <div className="bg-gradient-to-br from-orange-500/20 to-blue-500/20 p-3 rounded-xl border border-orange-500/30">
                <Sparkles className="w-7 h-7 text-orange-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">{baselineBuild.title}</h2>
                <p className="text-slate-300 text-lg leading-relaxed">{baselineBuild.blurb}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-10">
            {(Object.keys(categorizedItems) as Category[]).map(category => {
              const items = categorizedItems[category]
              if (items.length === 0) return null

              return (
                <div key={category}>
                  <h3 className="text-xl font-bold text-white mb-5 capitalize flex items-center gap-3 tracking-tight">
                    <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-orange-500 to-blue-500"></div>
                    {category}
                  </h3>
                  <div className="grid gap-5">
                    {items.map(itemId => {
                      const item = itemsData[itemId as keyof typeof itemsData]
                      if (!item) return null

                      return (
                        <ItemCard
                          key={itemId}
                          itemId={itemId}
                          item={item}
                          onRemove={() => {
                            setCustomItems(prev => prev.filter(id => id !== itemId))
                          }}
                        />
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BudgetSummary
                total={total}
                budget={tierBudget}
                remaining={remaining}
                itemCount={currentItems.length}
              />
            </div>
          </div>
        </div>

        {/* Affiliate Disclosure */}
        <div className="mt-16 mb-8">
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <div className="w-1 h-4 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
              Affiliate Disclosure
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Office Hours Global is a participant in the Amazon Services LLC Associates Program,
              an affiliate advertising program designed to provide a means for sites to earn
              advertising fees by advertising and linking to Amazon.com. As an Amazon Associate,
              we earn from qualifying purchases. Your price remains the same, and you help support
              our nonprofit mission to provide free production education.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
