'use client'

import { UseCase } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Mic, Video, Radio, Sparkles } from 'lucide-react'

interface UseCaseSelectorProps {
  selected: UseCase
  onSelect: (useCase: UseCase) => void
}

const useCases: { value: UseCase; label: string; icon: any; description: string }[] = [
  { value: 'podcasting', label: 'Podcasting', icon: Mic, description: 'Audio-first recording' },
  { value: 'recording', label: 'Recording', icon: Video, description: 'Video content creation' },
  { value: 'live', label: 'Live', icon: Radio, description: 'Live streaming production' },
  { value: 'hybrid', label: 'Hybrid', icon: Sparkles, description: 'Does everything' },
]

export function UseCaseSelector({ selected, onSelect }: UseCaseSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {useCases.map(useCase => {
        const Icon = useCase.icon
        return (
          <button
            key={useCase.value}
            onClick={() => onSelect(useCase.value)}
            className={cn(
              'p-4 rounded-lg border-2 transition-all duration-200 text-left',
              'hover:scale-105 hover:shadow-lg',
              selected === useCase.value
                ? 'bg-purple-600 border-purple-500 text-white shadow-purple-500/50'
                : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-purple-600'
            )}
          >
            <Icon className="w-6 h-6 mb-2" />
            <div className="font-semibold">{useCase.label}</div>
            <div className="text-xs opacity-80 mt-1">{useCase.description}</div>
          </button>
        )
      })}
    </div>
  )
}
