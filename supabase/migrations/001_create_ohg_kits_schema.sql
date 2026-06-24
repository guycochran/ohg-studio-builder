-- OHG Kits Database Schema
-- Kit.co for Live Streaming - Community-Built Gear Collections
-- Created: June 24, 2026

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PROFILES TABLE
-- Extends Supabase auth.users with public profile information
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  website_url TEXT,
  amazon_affiliate_tag TEXT, -- optional: users can use their own affiliate tag
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT username_format CHECK (username ~* '^[a-z0-9-]+$'),
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30)
);

-- Indexes
CREATE INDEX idx_profiles_username ON profiles(username);

-- ============================================================================
-- KITS TABLE
-- Main table for gear collections/kits
-- ============================================================================
CREATE TABLE IF NOT EXISTS kits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  use_case TEXT, -- church, university, corporate, event, broadcast, podcast
  budget_tier TEXT, -- good, better, best, ultimate
  is_public BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false, -- for OHG official kits
  view_count INTEGER DEFAULT 0,
  favorite_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT slug_format CHECK (slug ~* '^[a-z0-9-]+$'),
  CONSTRAINT slug_length CHECK (char_length(slug) >= 3 AND char_length(slug) <= 100),
  UNIQUE(user_id, slug) -- unique slug per user
);

-- Indexes
CREATE INDEX idx_kits_user_id ON kits(user_id);
CREATE INDEX idx_kits_slug ON kits(slug);
CREATE INDEX idx_kits_use_case ON kits(use_case) WHERE use_case IS NOT NULL;
CREATE INDEX idx_kits_budget_tier ON kits(budget_tier) WHERE budget_tier IS NOT NULL;
CREATE INDEX idx_kits_featured ON kits(is_featured) WHERE is_featured = true;
CREATE INDEX idx_kits_public ON kits(is_public) WHERE is_public = true;
CREATE INDEX idx_kits_created_at ON kits(created_at DESC);
CREATE INDEX idx_kits_view_count ON kits(view_count DESC);
CREATE INDEX idx_kits_favorite_count ON kits(favorite_count DESC);

-- ============================================================================
-- KIT_ITEMS TABLE
-- Products/gear in a kit
-- ============================================================================
CREATE TABLE IF NOT EXISTS kit_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kit_id UUID NOT NULL REFERENCES kits(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0, -- for ordering

  -- Product information
  name TEXT NOT NULL,
  brand TEXT,
  price DECIMAL(10, 2),
  image_url TEXT,

  -- Affiliate links
  amazon_asin TEXT, -- auto-generate Amazon URL from this
  affiliate_url TEXT, -- or custom URL

  -- Optional metadata
  why_chosen TEXT, -- "Great for churches because..."
  episode_reference TEXT, -- "Episode 1047 at 14:32"
  category TEXT, -- camera, mic, switcher, lighting, audio, etc.

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_kit_items_kit_id ON kit_items(kit_id);
CREATE INDEX idx_kit_items_position ON kit_items(kit_id, position);
CREATE INDEX idx_kit_items_category ON kit_items(category) WHERE category IS NOT NULL;

-- ============================================================================
-- KIT_FAVORITES TABLE
-- Users can favorite/save kits
-- ============================================================================
CREATE TABLE IF NOT EXISTS kit_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  kit_id UUID NOT NULL REFERENCES kits(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, kit_id)
);

-- Indexes
CREATE INDEX idx_kit_favorites_user_id ON kit_favorites(user_id);
CREATE INDEX idx_kit_favorites_kit_id ON kit_favorites(kit_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE kit_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE kit_favorites ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, users update their own
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Kits: Public kits viewable by everyone, users manage their own
CREATE POLICY "Public kits are viewable by everyone"
  ON kits FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can create own kits"
  ON kits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own kits"
  ON kits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own kits"
  ON kits FOR DELETE
  USING (auth.uid() = user_id);

-- Kit items: Viewable if kit is public, users manage items in their own kits
CREATE POLICY "Kit items are viewable if kit is public"
  ON kit_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM kits
      WHERE kits.id = kit_items.kit_id
        AND (kits.is_public = true OR kits.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage items in their kits"
  ON kit_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM kits
      WHERE kits.id = kit_items.kit_id
        AND kits.user_id = auth.uid()
    )
  );

-- Kit favorites: Public read, users manage their own
CREATE POLICY "Favorites are viewable by everyone"
  ON kit_favorites FOR SELECT
  USING (true);

CREATE POLICY "Users can manage own favorites"
  ON kit_favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON kit_favorites FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to update kit favorite_count when favorites are added/removed
CREATE OR REPLACE FUNCTION update_kit_favorite_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE kits SET favorite_count = favorite_count + 1 WHERE id = NEW.kit_id;
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE kits SET favorite_count = favorite_count - 1 WHERE id = OLD.kit_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update favorite_count
DROP TRIGGER IF EXISTS kit_favorites_count_trigger ON kit_favorites;
CREATE TRIGGER kit_favorites_count_trigger
  AFTER INSERT OR DELETE ON kit_favorites
  FOR EACH ROW
  EXECUTE FUNCTION update_kit_favorite_count();

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS kits_updated_at ON kits;
CREATE TRIGGER kits_updated_at
  BEFORE UPDATE ON kits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS kit_items_updated_at ON kit_items;
CREATE TRIGGER kit_items_updated_at
  BEFORE UPDATE ON kit_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SEED DATA (for testing)
-- ============================================================================

-- Create OHG official user (you'll need to create this auth user separately in Supabase)
-- INSERT INTO profiles (id, username, display_name, bio)
-- VALUES (
--   'YOUR-SUPABASE-AUTH-USER-ID-HERE',
--   'ohg',
--   'Office Hours Global',
--   'The official Office Hours Global account. We curate professional live streaming and broadcast production kits.'
-- );

-- ============================================================================
-- NOTES
-- ============================================================================
-- After running this migration:
-- 1. Create an auth user in Supabase for "ohg" official account
-- 2. Update the seed data INSERT above with the real user ID
-- 3. Create the 5 official kits (church, university, corporate, event, podcast)
-- 4. Test RLS policies by creating test users and kits
