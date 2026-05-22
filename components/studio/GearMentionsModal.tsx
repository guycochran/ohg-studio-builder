'use client'

import { useState, useEffect } from 'react'
import { X, ExternalLink, Play, Calendar, Clock } from 'lucide-react'
import { GearMention } from '@/lib/types'

interface GearMentionsModalProps {
  itemName: string
  isOpen: boolean
  onClose: () => void
}

export function GearMentionsModal({ itemName, isOpen, onClose }: GearMentionsModalProps) {
  const [mentions, setMentions] = useState<GearMention[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      // TODO: Fetch real data from YouTube API
      // For now, using mock data
      const mockMentions: GearMention[] = [
        {
          videoId: 'abc123',
          videoTitle: 'Office Hours #1047 - Studio Setup Deep Dive',
          timestamp: 1245, // 20:45
          quote: `The ${itemName} changed everything for us. We went from constant audio issues to crystal clear sound.`,
          mentionedAt: '2026-03-15T10:00:00Z'
        },
        {
          videoId: 'def456',
          videoTitle: 'Office Hours #1032 - Budget Studio Build',
          timestamp: 892, // 14:52
          quote: `If you're on a budget, the ${itemName} is the sweet spot. Professional quality without breaking the bank.`,
          mentionedAt: '2026-02-28T10:00:00Z'
        },
        {
          videoId: 'ghi789',
          videoTitle: 'Office Hours #1018 - Audio Gear Recommendations',
          timestamp: 2156, // 35:56
          quote: `We've been using the ${itemName} for six months now. Zero regrets. It just works.`,
          mentionedAt: '2026-02-14T10:00:00Z'
        }
      ]

      setTimeout(() => {
        setMentions(mockMentions)
        setLoading(false)
      }, 500)
    }
  }, [isOpen, itemName])

  if (!isOpen) return null

  const formatTimestamp = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Play className="w-5 h-5 text-orange-400" />
              <h2 className="text-xl font-semibold text-white">Episode Mentions</h2>
            </div>
            <p className="text-gray-400 text-sm">
              "{itemName}" mentioned in {mentions.length} Office Hours episodes
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : mentions.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No mentions found for this item yet.
            </div>
          ) : (
            <div className="space-y-4">
              {mentions.map((mention, index) => (
                <div
                  key={index}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-blue-600 transition-all group"
                >
                  {/* Video title and metadata */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <a
                        href={`https://youtube.com/watch?v=${mention.videoId}&t=${mention.timestamp}s`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white font-medium group-hover:text-blue-400 transition-colors flex items-center gap-2"
                      >
                        {mention.videoTitle}
                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(mention.mentionedAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(mention.timestamp)}
                        </div>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors">
                      Watch Clip
                    </button>
                  </div>

                  {/* Quote */}
                  <blockquote className="border-l-2 border-orange-400 pl-4 py-2 text-sm text-gray-300 italic">
                    "{mention.quote}"
                  </blockquote>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 bg-gray-800/50">
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-400">
              Data sourced from <span className="text-orange-400 font-semibold">Office Hours Global</span> transcriptions
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
