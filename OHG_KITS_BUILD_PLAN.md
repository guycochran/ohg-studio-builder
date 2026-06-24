# OHG Kits - Build Plan
## "Kit.co for Live Streaming" - The Platform Kit.co Should Have Been

**Date:** June 24, 2026
**Target:** MVP in 2 weeks, Launch in 30 days
**Goal:** Capture the $100k/month community spend through shareable gear kits

---

## 🎯 The Vision

**Kit.co shut down May 11, 2026.** Millions of creators lost their gear recommendation pages.

We're building it back - **specifically for live streaming and broadcast production.**

**The Model:**
- Community members build curated "kits" (gear collections)
- Each kit gets a shareable URL: `ohg.build/jeff/church-streaming-kit`
- All products have affiliate links (Amazon Associates)
- Professionals share kits internally for budget approvals
- Viral loop: 1 kit → Shared with 5 colleagues → They clone it → All buy through affiliate links

**Revenue:** Amazon Associates commissions on EVERY purchase (3-4% of total)

---

## 🏆 Why This Wins

### The Gap (MASSIVE Opportunity)
- ❌ Kit.co is GONE (shut down last month)
- ❌ No alternative for live streaming/broadcast professionals
- ❌ Alternatives are generic (MakerManifest, Linktree, Beacons)
- ✅ **Office Hours Global community already spending $100k/month**

### The Moat (Why We Win)
1. **Niche focus** - Live streaming, videography, events (not generic gear)
2. **Episode integration** - "Mentioned in Episode 1047 at 14:32"
3. **Community trust** - Office Hours Global brand (not random startup)
4. **Professional use cases** - Church, University, Corporate (not consumer)
5. **First mover** - No competitor in this space right now

---

## 📋 MVP Feature List (Week 1-2)

### Must-Have (Cannot launch without)
- [ ] User accounts (Supabase auth - email/password + Google)
- [ ] Create kit (title, description, use case, budget tier)
- [ ] Add products to kit (manual entry: name, price, ASIN, affiliate URL)
- [ ] Kit display page (clean, shareable, mobile-responsive)
- [ ] Shareable URLs: `studiobuild.cochran.cloud/kits/username/kit-name`
- [ ] User profile page: `studiobuild.cochran.cloud/@username`
- [ ] Total price calculator (sum of all products in kit)
- [ ] Edit/delete own kits
- [ ] Browse kits page (simple list, filter by use case)

### Nice-to-Have (Can add after launch)
- [ ] "Clone this kit" button (copy someone's kit to customize)
- [ ] Upvote/favorite kits
- [ ] Kit analytics (views, clicks)
- [ ] Comments on kits
- [ ] Search kits
- [ ] Episode references integration
- [ ] Compatibility warnings
- [ ] Hidden costs calculator (cables, stands, etc.)

---

## 🗄️ Database Schema (Supabase)

### Tables

#### `profiles` (extends Supabase auth.users)
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE NOT NULL, -- for URLs: @username
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  website_url TEXT,
  amazon_affiliate_tag TEXT, -- optional: use their own affiliate tag
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Username must be lowercase, alphanumeric + hyphens only
-- Constraint: CHECK (username ~* '^[a-z0-9-]+$')
```

#### `kits`
```sql
CREATE TABLE kits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  slug TEXT NOT NULL, -- URL-friendly: church-streaming-kit
  title TEXT NOT NULL,
  description TEXT,
  use_case TEXT, -- church, university, corporate, event, broadcast
  budget_tier TEXT, -- good, better, best, ultimate
  is_public BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false, -- for OHG official kits
  view_count INTEGER DEFAULT 0,
  favorite_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, slug) -- unique per user
);

CREATE INDEX idx_kits_user_id ON kits(user_id);
CREATE INDEX idx_kits_slug ON kits(slug);
CREATE INDEX idx_kits_use_case ON kits(use_case);
CREATE INDEX idx_kits_featured ON kits(is_featured) WHERE is_featured = true;
```

#### `kit_items` (products in a kit)
```sql
CREATE TABLE kit_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kit_id UUID REFERENCES kits(id) ON DELETE CASCADE,
  position INTEGER NOT NULL, -- for ordering (drag/drop later)

  -- Product info
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
  category TEXT, -- camera, mic, switcher, lighting, etc.

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_kit_items_kit_id ON kit_items(kit_id);
```

#### `kit_favorites` (users can favorite kits)
```sql
CREATE TABLE kit_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  kit_id UUID REFERENCES kits(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, kit_id)
);

CREATE INDEX idx_kit_favorites_user_id ON kit_favorites(user_id);
CREATE INDEX idx_kit_favorites_kit_id ON kit_favorites(kit_id);
```

### Row Level Security (RLS) Policies

```sql
-- Profiles: Public read, users update their own
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Kits: Public read, users manage their own
ALTER TABLE kits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public kits are viewable by everyone"
  ON kits FOR SELECT USING (is_public = true);

CREATE POLICY "Users can create own kits"
  ON kits FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own kits"
  ON kits FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own kits"
  ON kits FOR DELETE USING (auth.uid() = user_id);

-- Kit items: Public read (if kit is public), users manage their own
ALTER TABLE kit_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kit items are viewable if kit is public"
  ON kit_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM kits WHERE kits.id = kit_items.kit_id AND kits.is_public = true)
  );

CREATE POLICY "Users can manage items in their kits"
  ON kit_items FOR ALL USING (
    EXISTS (SELECT 1 FROM kits WHERE kits.id = kit_items.kit_id AND kits.user_id = auth.uid())
  );

-- Kit favorites: Users manage their own
ALTER TABLE kit_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all favorites"
  ON kit_favorites FOR SELECT USING (true);

CREATE POLICY "Users can manage own favorites"
  ON kit_favorites FOR ALL USING (auth.uid() = user_id);
```

---

## 🎨 Page Structure (Next.js Routes)

```
app/
├── page.tsx                          # Landing page ("Build and share your kits")
├── (auth)/
│   ├── login/page.tsx                # Login
│   └── signup/page.tsx               # Signup (with username selection)
├── auth/
│   └── callback/route.ts             # Supabase auth callback
├── kits/
│   ├── page.tsx                      # Browse all kits
│   ├── new/page.tsx                  # Create new kit (protected)
│   ├── [username]/
│   │   └── [slug]/
│   │       ├── page.tsx              # View kit (public)
│   │       └── edit/page.tsx         # Edit kit (protected, owner only)
├── @[username]/
│   └── page.tsx                      # User profile (all their kits)
├── dashboard/
│   └── page.tsx                      # User's own kits + analytics
├── api/
│   ├── kits/
│   │   ├── route.ts                  # POST /api/kits (create)
│   │   └── [id]/
│   │       └── route.ts              # PUT/DELETE /api/kits/:id
│   ├── kit-items/
│   │   ├── route.ts                  # POST /api/kit-items (add product)
│   │   └── [id]/
│   │       └── route.ts              # PUT/DELETE /api/kit-items/:id
│   └── profiles/
│       └── [username]/
│           └── route.ts              # GET /api/profiles/:username
```

---

## 🚀 Week 1 Plan (Core Functionality)

### Day 1-2: Database + Auth
- [ ] Create Supabase tables (profiles, kits, kit_items)
- [ ] Set up RLS policies
- [ ] Auth flow: signup → choose username → redirect to dashboard
- [ ] Profile creation on signup

### Day 3-4: Kit Creation
- [ ] "Create Kit" page (`/kits/new`)
  - Form: Title, description, use case, budget tier
  - Save to database
  - Redirect to kit edit page
- [ ] Kit editor (add/remove products)
  - Manual product entry form
  - Generate Amazon affiliate URL from ASIN
  - Drag to reorder (nice-to-have, can skip for MVP)
- [ ] Save kit items to database

### Day 5-6: Kit Display
- [ ] Kit view page (`/kits/username/slug`)
  - Display all products with images, prices
  - Total price calculator
  - Share buttons (copy link, Twitter, LinkedIn)
  - "Clone this kit" button (copy to your account)
- [ ] User profile page (`/@username`)
  - List all user's public kits
  - Bio, avatar
  - Social links

### Day 7: Browse + Polish
- [ ] Browse kits page (`/kits`)
  - Filter by use case (church, university, corporate, event)
  - Filter by budget tier (good, better, best, ultimate)
  - Sort by newest, most favorited, most viewed
- [ ] Polish UI/UX
  - Mobile responsive
  - Dark theme (Office Hours Global purple branding)
  - Fast, clean, professional

---

## 🚀 Week 2 Plan (Launch Prep)

### Day 8-9: Analytics + Favorites
- [ ] Track kit views (increment on page load)
- [ ] Favorite kits button (heart icon)
- [ ] Dashboard analytics (your kits, views, favorites)
- [ ] OHG admin panel (mark kits as "featured")

### Day 10-11: Seed Data + Content
- [ ] Create 5 "Official OHG Kits":
  1. **Church Streaming Starter** - $2,500 (Good)
  2. **University Lecture Capture** - $7,500 (Better)
  3. **Corporate Boardroom** - $15,000 (Best)
  4. **Live Event Production** - $35,000 (Ultimate)
  5. **Podcast Studio** - $4,000 (Better)
- [ ] Add products to each kit (real gear from episodes)
- [ ] Add episode references ("Mentioned in Episode 1047")
- [ ] Polish kit descriptions

### Day 12-13: Testing + Bug Fixes
- [ ] Test full user flow (signup → create kit → add products → share)
- [ ] Mobile testing
- [ ] Fix bugs
- [ ] Performance optimization (lazy loading images, etc.)
- [ ] SEO meta tags

### Day 14: Launch Prep
- [ ] Deploy to production (Coolify)
- [ ] Test on public URL
- [ ] Write launch announcement
- [ ] Prepare demo video (2-min walkthrough)
- [ ] Invite 10 power users to beta test

---

## 📣 Launch Strategy (Day 15-30)

### Week 3: Soft Launch
**Day 15:**
- [ ] Email 10 community power users: "We rebuilt Kit.co for live streaming. Build your kit."
- [ ] Announce in Office Hours Global Discord/Slack
- [ ] Post on Office Hours Global social media

**Day 16-21:**
- [ ] Help power users build their first kits (hands-on support)
- [ ] Gather feedback, fix bugs
- [ ] Add requested features (if quick wins)

### Week 4: Public Launch
**Day 22:**
- [ ] **Announce on Office Hours Global live show**
  - "Kit.co shut down. We built it back. Here's OHG Kits."
  - Demo: Create kit live on show
  - Show 5 official kits + 10 community kits
  - Call to action: "Build your kit at ohg.build"

**Day 23-30:**
- [ ] Monitor signups, kit creation rate
- [ ] Track affiliate clicks/conversions
- [ ] Iterate based on feedback
- [ ] Add community-requested features

---

## 💰 Revenue Model

### Phase 1: Amazon Associates (Immediate)
- Every product link uses: `officehours0c-20` affiliate tag
- Commission: 3% cameras, 4% musical instruments, 2.5% electronics
- **Target:** $100k/month community spend × 3% = **$3,000/month**

### Phase 2: User Affiliate Tags (Month 2+)
- Users can add their own Amazon Associate tag
- We get 25% of clicks (like old Kit.co model)
- OR they use our tag and we get 100%
- **Target:** More creators = more kits = more traffic = more commissions

### Phase 3: Premium Features (Month 6+)
- "Kit Pro" - $99/year
  - Custom domain (yourname.com instead of ohg.build/@yourname)
  - Analytics dashboard (clicks, conversions, revenue)
  - Priority placement in browse page
  - Remove "Powered by OHG Kits" footer
- **Target:** 100 Pro users × $99/year = **$10,000/year**

### Phase 4: Manufacturer Partnerships (Year 2)
- Featured placement for manufacturers
- "OHG Certified" badge for recommended products
- Bulk pricing access for community members
- **Target:** TBD based on community size

---

## 📊 Success Metrics

### Week 1-2 (MVP Build)
- [ ] MVP deployed and working
- [ ] 5 official OHG kits created
- [ ] 0 bugs blocking basic usage

### Week 3 (Soft Launch)
- [ ] 10 power users invited
- [ ] 20+ kits created (10 power users × 2 kits each)
- [ ] 500+ page views
- [ ] 50+ product clicks

### Week 4 (Public Launch)
- [ ] 100+ signups
- [ ] 150+ kits created
- [ ] 5,000+ page views
- [ ] 500+ affiliate clicks
- [ ] **First Amazon commission earned** ✅

### Month 2-3 (Growth)
- [ ] 500+ users
- [ ] 1,000+ kits
- [ ] 50,000+ page views/month
- [ ] $1,000+ affiliate commissions/month

### Month 6 (Scale)
- [ ] 2,000+ users
- [ ] 5,000+ kits
- [ ] 200,000+ page views/month
- [ ] $3,000+ affiliate commissions/month
- [ ] 50+ Kit Pro subscribers ($5,000/year recurring)

---

## 🎯 Competitive Advantages (vs Kit.co)

### What Kit.co Had
- ✅ Curated product collections
- ✅ Shareable URLs
- ✅ Affiliate monetization
- ✅ Community discovery

### What We Have (Better)
- 🔥 **Niche focus** - Live streaming/broadcast (not generic)
- 🔥 **Episode integration** - "Mentioned in Episode 1047" (unique to OHG)
- 🔥 **Community trust** - Office Hours Global brand (9+ years)
- 🔥 **Professional use cases** - Church, University, Corporate (not consumer)
- 🔥 **Compatibility checking** - "This camera needs this converter" (coming soon)
- 🔥 **Total cost calculator** - Hidden costs included (coming soon)
- 🔥 **Good/Better/Best/Ultimate** - Pre-made templates to clone
- 🔥 **First mover** - No competitor exists right now ✅

---

## 🛡️ Risk Mitigation

### Risk 1: Low adoption (people don't build kits)
**Mitigation:**
- Start with 5 official OHG kits (so there's content on day 1)
- Invite 10 power users personally (hands-on onboarding)
- Mention on Office Hours Global show (built-in audience)
- Make kit creation EASY (5 minutes, not 30)

### Risk 2: People use their own affiliate tags (we get 0%)
**Mitigation:**
- Default to OHG affiliate tag (most users won't change)
- Make it opt-in to use custom tag (friction = fewer changes)
- Offer incentive: "Use OHG tag, we'll feature your kit"

### Risk 3: Amazon doesn't convert well
**Mitigation:**
- Add B&H Photo affiliate links (higher commissions)
- Add Sweetwater, Adorama, etc.
- Track conversion data, optimize for best-performing retailers

### Risk 4: Someone clones the platform
**Mitigation:**
- Move fast (2-week MVP, not 6 months)
- Build community moats (episode integration, OHG brand trust)
- Network effects (more kits = more value = more users)
- First-mover advantage in this niche

---

## 🎨 Design Inspiration

### Kit.co (RIP)
- Clean, minimal product cards
- Beautiful kit display pages
- Simple kit creation flow

### PC Part Picker
- Compatibility warnings (red/yellow alerts)
- Total price calculator (always visible)
- Save/share prominent

### Notion
- Clean editor experience
- Drag/drop reordering
- Fast, no-BS interface

### Office Hours Global Branding
- Purple gradients (#8B5CF6 to #7C3AED)
- Dark theme (professional, broadcast vibe)
- Clean typography (Inter or similar)

---

## 🚢 Deployment

### Infrastructure
- **Hosting:** Coolify (Docker)
- **Database:** Supabase (PostgreSQL + Auth + Storage)
- **Domain:** `studiobuild.cochran.cloud` or `ohg.build` (if we buy it)
- **CDN:** Cloudflare (for images, caching)
- **Email:** Resend (for transactional emails)

### Environment Variables
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
NEXT_PUBLIC_SITE_URL=https://studiobuild.cochran.cloud
AMAZON_AFFILIATE_TAG=officehours0c-20
```

---

## ✅ Next Steps (RIGHT NOW)

1. **Create Supabase tables** (profiles, kits, kit_items)
2. **Build auth flow** (signup with username selection)
3. **Build kit creation page** (simple form)
4. **Build kit display page** (shareable URL)
5. **Seed 5 official kits** (your curated recommendations)
6. **Deploy to production** (Coolify)
7. **Invite 10 power users** (soft launch)
8. **Announce on Office Hours Global** (public launch)

---

**Let's build this. Kit.co is gone. The gap is wide open. We move fast.**

🚀 Starting MVP build NOW.
