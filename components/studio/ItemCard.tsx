'use client'

import { Item } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { X, ExternalLink } from 'lucide-react'

interface ItemCardProps {
  itemId: string
  item: Item
  onRemove?: () => void
}

export function ItemCard({ itemId, item, onRemove }: ItemCardProps) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-blue-600 transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-semibold text-white text-lg">{item.name}</h4>
            <div className="text-right flex-shrink-0">
              <div className="text-xl font-bold text-blue-400">{formatCurrency(item.price)}</div>
            </div>
          </div>

          <p className="text-gray-400 text-sm mb-3">{item.why}</p>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300 capitalize">
              {item.cat}
            </span>

            {/* YouTube mentions badge (placeholder for now) */}
            <button className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-900/30 text-orange-400 hover:bg-orange-900/50 transition-colors">
              <ExternalLink className="w-3 h-3 mr-1" />
              Mentioned in episodes
            </button>
          </div>
        </div>

        {onRemove && (
          <button
            onClick={onRemove}
            className="p-2 hover:bg-red-900/30 rounded-lg transition-colors text-gray-400 hover:text-red-400"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  )
}
