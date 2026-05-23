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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {useCases.map(useCase => {
        const Icon = useCase.icon
        return (
          <button
            key={useCase.value}
            onClick={() => onSelect(useCase.value)}
            className={cn(
              'group relative p-6 rounded-2xl border-2 transition-all duration-300 text-left overflow-hidden',
              'hover:scale-105 hover:shadow-2xl',
              selected === useCase.value
                ? 'bg-gradient-to-br from-blue-600 to-cyan-600 border-blue-500 text-white shadow-2xl shadow-blue-500/50 scale-105'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:border-blue-500/60 hover:bg-slate-800/80 backdrop-blur-sm'
            )}
          >
            {selected === useCase.value && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-transparent to-cyan-600/20 animate-pulse"></div>
            )}
            <div className="relative">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors",
                selected === useCase.value
                  ? "bg-white/20"
                  : "bg-slate-700/50 group-hover:bg-slate-700"
              )}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="font-bold text-lg mb-1 tracking-tight">{useCase.label}</div>
              <div className={cn(
                "text-sm font-medium",
                selected === useCase.value ? "text-blue-100" : "text-slate-400 group-hover:text-slate-300"
              )}>
                {useCase.description}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
