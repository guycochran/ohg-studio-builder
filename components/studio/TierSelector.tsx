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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {tiers.map(tier => (
        <button
          key={tier.value}
          onClick={() => onSelect(tier.value)}
          className={cn(
            'p-4 rounded-lg border-2 transition-all duration-200',
            'hover:scale-105 hover:shadow-lg',
            selected === tier.value
              ? 'bg-blue-600 border-blue-500 text-white shadow-blue-500/50'
              : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-blue-600'
          )}
        >
          <div className="text-xl font-bold">{tier.label}</div>
          <div className="text-sm opacity-80">{tier.description}</div>
        </button>
      ))}
    </div>
  )
}
