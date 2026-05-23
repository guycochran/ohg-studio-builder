'use client'

import { Tier } from '@/lib/types'
import { cn } from '@/lib/utils'

interface TierSelectorProps {
  selected: Tier
  onSelect: (tier: Tier) => void
}

const tiers: { value: Tier; label: string; description: string }[] = [
  { value: '500', label: '$500', description: 'Starter' },
  { value: '5000', label: '$5,000', description: 'Pro' },
  { value: '10000', label: '$10,000', description: 'Advanced' },
  { value: '20000', label: '$20,000', description: 'Broadcast' },
]

export function TierSelector({ selected, onSelect }: TierSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {tiers.map(tier => (
        <button
          key={tier.value}
          onClick={() => onSelect(tier.value)}
          className={cn(
            'group relative p-6 rounded-2xl border-2 transition-all duration-300 overflow-hidden',
            'hover:scale-105 hover:shadow-2xl',
            selected === tier.value
              ? 'bg-gradient-to-br from-orange-600 to-orange-700 border-orange-500 text-white shadow-2xl shadow-orange-500/50 scale-105'
              : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:border-orange-500/60 hover:bg-slate-800/80 backdrop-blur-sm'
          )}
        >
          {selected === tier.value && (
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 via-transparent to-orange-600/20 animate-pulse"></div>
          )}
          <div className="relative">
            <div className="text-2xl font-bold mb-1 tracking-tight">{tier.label}</div>
            <div className={cn(
              "text-sm font-medium tracking-wide uppercase",
              selected === tier.value ? "text-orange-100" : "text-slate-400 group-hover:text-slate-300"
            )}>
              {tier.description}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
