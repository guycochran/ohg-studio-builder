# OHG Kits - Project Status
## Current Status: Ready to Build MVP

**Last Updated:** June 24, 2026
**Status:** Planning complete, database schema ready, ready to start development

---

## 📍 Where We Are

### ✅ Completed
1. **Strategic Planning** - Full vision documented in `OHG_KITS_BUILD_PLAN.md`
2. **Database Schema** - Complete Supabase schema in `supabase/migrations/001_create_ohg_kits_schema.sql`
3. **Decision Made** - Building "Kit.co for Live Streaming" model (community-built gear kits)
4. **Revenue Model Defined** - Amazon Associates affiliate links (officehours0c-20)

### 📋 Key Documents Created
- `OHG_KITS_BUILD_PLAN.md` - Complete 2-week MVP plan (800+ lines)
- `LEGENDARY_BUILDER_STRATEGY.md` - Initial strategic thinking (Jobs/Musk/Gates approach)
- `supabase/migrations/001_create_ohg_kits_schema.sql` - Production-ready database schema

---

## 🎯 The Vision (Quick Recap)

**What We're Building:** Kit.co for Live Streaming

**The Problem:**
- Kit.co shut down May 11, 2026 (last month)
- Office Hours Global community spends $100k/month on gear
- No tool exists for professionals to build and share gear collections
- Universities, corporations, churches need shareable budget proposals

**The Solution:**
- Community members build curated "kits" (gear collections)
- Each kit gets shareable URL: `ohg.build/username/kit-name`
- All products have Amazon affiliate links (officehours0c-20)
- Professionals share kits internally for budget approvals
- Viral loop: 1 kit → Shared with colleagues → They clone it → All buy via affiliate

**Example Kits:**
- `ohg.build/jeff/church-streaming-2500` - Church setup ($2,500)
- `ohg.build/susan/ucb-lecture-hall` - UC Berkeley kit ($15,000)
- `ohg.build/official/podcast-ultimate` - Official OHG kit ($8,500)

---

## 💰 Revenue Model

**Target:** $3,000/month from existing $100k/month community spend

**Phase 1:** Amazon Associates (3% commissions)
**Phase 2:** User affiliate tags (25% click share)
**Phase 3:** Kit Pro ($99/year premium features)

---

## 🗄️ Database Schema (Ready to Deploy)

### Tables
```sql
profiles (id, username, display_name, bio, avatar_url, amazon_affiliate_tag)
kits (id, user_id, slug, title, description, use_case, budget_tier, is_public, is_featured)
kit_items (id, kit_id, position, name, brand, price, amazon_asin, affiliate_url, why_chosen)
kit_favorites (id, user_id, kit_id)
```

### Features
- ✅ Row Level Security (RLS) policies
- ✅ Automated triggers (favorite counts, timestamps)
- ✅ Username format validation
- ✅ Unique usernames and kit slugs

**Location:** `/home/guycochran/oh/studiobuilder/supabase/migrations/001_create_ohg_kits_schema.sql`

---

## 🚀 MVP Feature List (2 Weeks)

### Week 1: Core Functionality
- [ ] User auth (signup with username selection)
- [ ] Create kit (title, description, use case, budget tier)
- [ ] Add products to kit (manual entry: name, price, ASIN, affiliate URL)
- [ ] Kit display page (shareable URL)
- [ ] User profile page (`@username`)
- [ ] Total price calculator

### Week 2: Launch Prep
- [ ] Browse kits page (filter by use case, budget tier)
- [ ] Kit analytics (view counts)
- [ ] Favorite kits
- [ ] Create 5 official OHG kits (seed data)
- [ ] Deploy to production
- [ ] Invite 10 power users for beta

### Post-Launch Features
- [ ] "Clone this kit" button
- [ ] Episode integration ("Mentioned in Episode 1047")
- [ ] Compatibility warnings
- [ ] Comments on kits
- [ ] Kit comparisons

---

## 📁 Current Project Structure

```
studiobuilder/
├── OHG_KITS_BUILD_PLAN.md           ✅ Complete strategic plan
├── LEGENDARY_BUILDER_STRATEGY.md    ✅ Initial research
├── PROJECT_STATUS.md                 ✅ This file
├── supabase/
│   └── migrations/
│       └── 001_create_ohg_kits_schema.sql  ✅ Database schema
├── package.json                      ✅ Next.js 16 + Supabase
├── .env.local                        ✅ Has Supabase credentials
└── app/                              ⏳ Needs to be built
    ├── (auth)/                       ⏳ Login/signup
    ├── kits/                         ⏳ Kit pages
    ├── @[username]/                  ⏳ Profile pages
    └── api/                          ⏳ API routes
```

---

## 🎬 Launch Strategy (When Ready)

### Week 3: Soft Launch
1. Create 5 official OHG kits (church, university, corporate, event, podcast)
2. Invite 10 power users from community
3. Announce in Office Hours Global Discord/Slack
4. Gather feedback, fix bugs

### Week 4: Public Launch
1. **Announce on Office Hours Global live show**
   - "Kit.co shut down. We built it back."
   - Demo: Create kit live on show
   - Call to action: "Build your kit at ohg.build"
2. Monitor signups, kit creation rate
3. Track affiliate clicks/conversions
4. Iterate based on feedback

---

## 🔧 Technical Setup (Ready to Go)

### Infrastructure
- **Hosting:** Coolify (Docker) at studiobuild.cochran.cloud
- **Database:** Supabase (already configured in .env.local)
- **Auth:** Supabase Auth (email/password + Google OAuth)
- **Framework:** Next.js 16, React 19, TypeScript 5
- **Styling:** Tailwind CSS 4

### Environment Variables (Already Set)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xsmbaldyidtmxslmuenm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[configured]
NEXT_PUBLIC_SITE_URL=https://studiobuilder.cochran.cloud
```

### Amazon Affiliate Tag
```
officehours0c-20
```

---

## 🎯 Next Steps (When We Resume)

### Option 1: Fast Track (3-5 days)
Build bare minimum MVP:
1. Auth + kit creation
2. Kit display pages
3. Deploy + create official kits
4. Launch to 10 beta users

### Option 2: Full MVP (2 weeks)
Build complete feature set as planned in `OHG_KITS_BUILD_PLAN.md`

### Option 3: Review First
Review strategic plan, adjust features/priorities, then build

---

## 💡 Key Decisions Made

### ✅ Confirmed Decisions
1. **Model:** Kit.co for Live Streaming (community-built gear kits)
2. **Not Building:** Consultation services, membership platform (from earlier ideas)
3. **Focus:** Shareable gear collections for professionals (universities, corporations, churches)
4. **Monetization:** Amazon Associates affiliate links
5. **Target:** Capture existing $100k/month community spend

### 🤔 Decisions Pending
1. Domain name: `ohg.build` vs `studiobuild.cochran.cloud`
2. Fast track vs full MVP timeline
3. Beta user selection (which 10 power users?)

---

## 📊 Success Metrics (Defined)

### Week 1-2 (MVP Build)
- [ ] MVP deployed and working
- [ ] 5 official OHG kits created
- [ ] 0 bugs blocking basic usage

### Week 3 (Soft Launch)
- [ ] 10 power users invited
- [ ] 20+ kits created
- [ ] 500+ page views
- [ ] 50+ product clicks

### Week 4 (Public Launch)
- [ ] 100+ signups
- [ ] 150+ kits created
- [ ] 5,000+ page views
- [ ] 500+ affiliate clicks
- [ ] **First Amazon commission earned** ✅

### Month 2-3
- [ ] 500+ users
- [ ] 1,000+ kits
- [ ] $1,000+ affiliate commissions/month

---

## 🔗 Related Files

**Strategic Documents:**
- `OHG_KITS_BUILD_PLAN.md` - Main build plan (800+ lines)
- `LEGENDARY_BUILDER_STRATEGY.md` - Initial strategic research
- `PROJECT_STATUS.md` - This file

**Technical:**
- `supabase/migrations/001_create_ohg_kits_schema.sql` - Database schema
- `.env.local` - Environment variables (Supabase credentials)
- `package.json` - Dependencies (Next.js, Supabase, Tailwind)

**Context Documents (From Earlier Work):**
- `PORT_MISMATCH_FIX.md` - Previous deployment issue (resolved)
- `WHITE_SCREEN_FIX.md` - Dockerfile fix (resolved)
- `URL_FIX.md` - URL routing issue (resolved)

---

## 📝 Important Context

### Why This Project Exists
1. Original ask: "Help monetize Studio Builder with Amazon affiliate links"
2. Initial approach: Added affiliate buttons to existing gear list (18 items)
3. User feedback: "I don't like this one at all"
4. Research phase: Studied PC Part Picker, Sweetwater, B&H Photo
5. User suggestion: "What if we did something like Kit.co?"
6. Discovery: Kit.co shut down last month (May 11, 2026)
7. **Decision:** Build "Kit.co for Live Streaming" - community gear kits

### Why This Will Work
1. **Market gap:** Kit.co is gone, no alternative exists
2. **Existing demand:** Community spending $100k/month already
3. **Distribution:** Office Hours Global live show (built-in audience)
4. **Trust:** 9+ years of brand credibility in this space
5. **Viral mechanic:** Shareable URLs for budget approvals
6. **First mover:** No competitor in live streaming niche

### User's Background (Critical Context)
- Former CEO of DVEStore.com
- Sold $900k/month on Amazon
- Board member of Office Hours Global
- Community was spending $100k/month in his store
- Knows e-commerce deeply - not interested in "guru theories"
- Wants professional tools that professionals share

---

## 🚨 Important Notes

1. **Supabase database is shared** with mindful-intake-dev project
2. **Domain routing:** Currently using studiobuild.cochran.cloud (NOT studiobuilder - that was the white screen issue)
3. **Git repo:** https://github.com/guycochran/ohg-studio-builder
4. **Deployment:** Coolify auto-deploys from main branch
5. **Office Hours Global platform:** Separate project at ~/oh/ohg-platform (has episode transcripts we'll integrate later)

---

## ✅ Ready to Resume

When we resume, we can:
1. Review `OHG_KITS_BUILD_PLAN.md` for full details
2. Choose MVP timeline (fast track vs full)
3. Start building (database migration → auth → kit creation → deploy)
4. Launch to community

**All planning is done. All decisions are made. Schema is ready. We're ready to code.**

---

**Status:** Paused at planning phase, ready to build
**Next:** Start MVP development when ready
