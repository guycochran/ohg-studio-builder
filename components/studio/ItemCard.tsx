'use client'

import { useState } from 'react'
import { Item } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { X, ExternalLink, ShoppingCart } from 'lucide-react'
import { GearMentionsModal } from './GearMentionsModal'

interface ItemCardProps {
  itemId: string
  item: Item
  onRemove?: () => void
}

export function ItemCard({ itemId, item, onRemove }: ItemCardProps) {
  const [showMentions, setShowMentions] = useState(false)

  return (
    <>
      <div className="group bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-xl p-6 hover:border-blue-500/60 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 backdrop-blur-sm">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3 gap-4">
              <h4 className="font-bold text-white text-xl tracking-tight leading-snug">{item.name}</h4>
              <div className="text-right flex-shrink-0">
                <div className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                  {formatCurrency(item.price)}
                </div>
              </div>
            </div>

            <p className="text-slate-300 text-base mb-4 leading-relaxed">{item.why}</p>

            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-700/80 text-slate-200 capitalize border border-slate-600/50 shadow-sm">
                {item.cat}
              </span>

              {/* Amazon Affiliate Link */}
              {item.affiliateUrls?.amazon && (
                <a
                  href={item.affiliateUrls.amazon}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 transition-all border border-orange-400/30 hover:border-orange-300/50 shadow-lg hover:shadow-orange-500/20"
                  onClick={(e) => {
                    // Track affiliate click (optional analytics)
                    console.log(`Affiliate click: ${itemId} - ${item.name}`);
                  }}
                >
                  <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                  Buy on Amazon
                </a>
              )}

              <button
                onClick={() => setShowMentions(true)}
                className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-blue-600/20 to-blue-700/20 text-blue-400 hover:from-blue-600/30 hover:to-blue-700/30 transition-all border border-blue-600/40 hover:border-blue-500/60 shadow-sm"
              >
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                Mentioned in 3 episodes
              </button>
            </div>
          </div>

          {onRemove && (
            <button
              onClick={onRemove}
              className="p-2.5 hover:bg-red-900/40 rounded-xl transition-all duration-300 text-slate-400 hover:text-red-400 border border-transparent hover:border-red-800/50 group-hover:opacity-100 opacity-60"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <GearMentionsModal
        itemName={item.name}
        isOpen={showMentions}
        onClose={() => setShowMentions(false)}
      />
    </>
  )
}
