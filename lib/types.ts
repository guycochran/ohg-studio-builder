export type Tier = '500' | '5000' | '10000' | '20000'
export type UseCase = 'podcasting' | 'recording' | 'live' | 'hybrid'
export type Category = 'camera' | 'audio' | 'lighting' | 'control' | 'computer' | 'recording' | 'cables' | 'extras'

export interface Item {
  name: string
  cat: Category
  price: number
  tiers: number[]
  why: string
  affiliateUrls?: {
    amazon?: string
    bh?: string
    sweetwater?: string
    adorama?: string
  }
  compatibility?: string[]
  requiredCables?: string[]
}

export interface Build {
  title: string
  blurb: string
  items: string[]
  goodFor?: string
}

export interface Panelist {
  name: string
  role: string
  initials: string
  buildKey: string
  bio: string
  using: string[]
  photo?: string
}

export interface GearMention {
  videoId: string
  videoTitle: string
  timestamp: number
  quote: string
  mentionedAt: string
}

export interface SavedBuild {
  id: string
  user_id: string
  name: string
  tier: Tier
  use_case: UseCase
  items: string[]
  created_at: string
  updated_at: string
}
