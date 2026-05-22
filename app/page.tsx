'use client'

import { useState } from 'react'
import { Tier, UseCase, Category } from '@/lib/types'
import { formatCurrency, calculateTotal } from '@/lib/utils'
import itemsData from '@/data/items.json'
import buildsData from '@/data/builds.json'
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Wrench className="w-8 h-8 text-blue-500" />
                OHG Studio Builder
              </h1>
              <p className="text-gray-400 mt-1">
                Build your perfect studio. Backed by <span className="text-orange-400 font-semibold">Office Hours Global</span>.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-400">Total Budget</div>
                <div className="text-2xl font-bold text-white">{formatCurrency(tierBudget)}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="space-y-6 mb-8">
          {/* Tier Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
              Budget Tier
            </label>
            <TierSelector selected={selectedTier} onSelect={setSelectedTier} />
          </div>

          {/* Use Case Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
              Primary Use Case
            </label>
            <UseCaseSelector selected={selectedUseCase} onSelect={setSelectedUseCase} />
          </div>
        </div>

        {/* Build Info */}
        {baselineBuild && (
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-800/50 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <Sparkles className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">{baselineBuild.title}</h2>
                <p className="text-gray-300">{baselineBuild.blurb}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-8">
            {(Object.keys(categorizedItems) as Category[]).map(category => {
              const items = categorizedItems[category]
              if (items.length === 0) return null

              return (
                <div key={category}>
                  <h3 className="text-lg font-semibold text-white mb-4 capitalize flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    {category}
                  </h3>
                  <div className="grid gap-4">
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
      </div>
    </div>
  )
}
