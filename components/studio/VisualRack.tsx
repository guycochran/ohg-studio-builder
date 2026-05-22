'use client'

import { useState } from 'react'
import { Item, Category } from '@/lib/types'
import { cn } from '@/lib/utils'
import { GripVertical, Zap, Cable, Monitor } from 'lucide-react'

interface VisualRackProps {
  items: string[]
  itemsData: Record<string, Item>
}

interface RackSlot {
  id: string
  item: string | null
  category: Category | null
  height: number // in rack units (1U, 2U, 3U, etc.)
}

// Map item categories to rack visualization
const getCategoryIcon = (category: Category) => {
  switch (category) {
    case 'control': return <Monitor className="w-4 h-4" />
    case 'audio': return <Zap className="w-4 h-4" />
    case 'computer': return <Monitor className="w-4 h-4" />
    default: return <Cable className="w-4 h-4" />
  }
}

const getCategoryColor = (category: Category) => {
  switch (category) {
    case 'control': return 'from-blue-900/50 to-blue-800/30'
    case 'audio': return 'from-purple-900/50 to-purple-800/30'
    case 'computer': return 'from-green-900/50 to-green-800/30'
    case 'recording': return 'from-orange-900/50 to-orange-800/30'
    default: return 'from-gray-900/50 to-gray-800/30'
  }
}

export function VisualRack({ items, itemsData }: VisualRackProps) {
  // Filter items that go in a rack (control, audio, computer, recording)
  const rackableCategories: Category[] = ['control', 'audio', 'computer', 'recording']
  const rackItems = items.filter(itemId => {
    const item = itemsData[itemId as keyof typeof itemsData]
    return item && rackableCategories.includes(item.cat as Category)
  })

  // Build rack slots (simplified - in real version this would be draggable)
  const slots: RackSlot[] = rackItems.map((itemId, index) => {
    const item = itemsData[itemId as keyof typeof itemsData]
    return {
      id: `slot-${index}`,
      item: itemId,
      category: item?.cat as Category || null,
      height: 1 // All items are 1U for now (future: calculate based on actual gear)
    }
  })

  // Add empty slots if needed (standard 19" rack is ~42U)
  const totalSlots = 12 // Show 12U rack for visualization
  while (slots.length < totalSlots) {
    slots.push({
      id: `empty-${slots.length}`,
      item: null,
      category: null,
      height: 1
    })
  }

  return (
    <div className="bg-gray-900 border-2 border-gray-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Virtual Rack (19" Standard)</h3>
        <div className="text-sm text-gray-400">{rackItems.length}/{totalSlots}U filled</div>
      </div>

      {/* Rack Visualization */}
      <div className="relative">
        {/* Rack rails (left and right) */}
        <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-b from-gray-700 via-gray-800 to-gray-700 rounded-l"></div>
        <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-b from-gray-700 via-gray-800 to-gray-700 rounded-r"></div>

        {/* Rack slots */}
        <div className="mx-4 space-y-1">
          {slots.map((slot, index) => (
            <div key={slot.id} className="relative">
              {/* Unit number label */}
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-mono">
                {(index + 1).toString().padStart(2, '0')}U
              </div>

              {/* Slot */}
              {slot.item ? (
                <div className={cn(
                  "h-16 rounded border border-gray-600 bg-gradient-to-r",
                  "flex items-center justify-between px-4 group hover:border-blue-500 transition-all",
                  getCategoryColor(slot.category!)
                )}>
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-gray-500" />
                    {getCategoryIcon(slot.category!)}
                    <div>
                      <div className="text-sm font-medium text-white">
                        {itemsData[slot.item as keyof typeof itemsData]?.name}
                      </div>
                      <div className="text-xs text-gray-400 capitalize">
                        {slot.category}
                      </div>
                    </div>
                  </div>

                  {/* Connection indicators */}
                  <div className="flex gap-1">
                    {/* Power indicator */}
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Power connected"></div>
                    {/* Data indicator */}
                    <div className="w-2 h-2 rounded-full bg-blue-500" title="Data connected"></div>
                  </div>
                </div>
              ) : (
                <div className="h-16 rounded border border-dashed border-gray-700 bg-gray-800/20 flex items-center justify-center">
                  <div className="text-xs text-gray-600">Empty Rack Unit</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Cable connections visualization */}
      <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <Cable className="w-4 h-4 text-blue-400" />
          <h4 className="text-sm font-semibold text-white">Signal Flow</h4>
        </div>

        <div className="space-y-2 text-sm">
          {rackItems.slice(0, 3).map((itemId, index) => {
            const item = itemsData[itemId as keyof typeof itemsData]
            const nextItem = rackItems[index + 1]
            const nextItemData = nextItem ? itemsData[nextItem as keyof typeof itemsData] : null

            return (
              <div key={itemId} className="flex items-center gap-2 text-gray-300">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-xs">{item?.name}</span>
                {nextItemData && (
                  <>
                    <div className="flex-1 border-t border-dashed border-gray-600"></div>
                    <span className="text-xs text-gray-500">
                      {item?.cat === 'audio' ? 'XLR' : item?.cat === 'control' ? 'HDMI' : 'USB'}
                    </span>
                  </>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-3 pt-3 border-t border-gray-700">
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Power</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>Data</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <span>Audio</span>
            </div>
          </div>
        </div>
      </div>

      {/* Export options */}
      <div className="mt-4 flex gap-2">
        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded transition-colors">
          Export Rack Diagram PDF
        </button>
        <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium py-2 px-4 rounded transition-colors">
          Share Rack Layout
        </button>
      </div>
    </div>
  )
}
