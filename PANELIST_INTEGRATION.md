# Panelist Integration Guide

## Overview

The **Panelist Showcase** feature allows Office Hours Global panelists to showcase their actual studio gear on Studio Builder, inspiring the community with real-world setups from experienced creators.

## Architecture

### Two-Project Integration

**Mindful Intake** (https://mindful-dev.cochran.cloud)
- Manages panelist profiles and gear lists
- Handles authentication and data storage
- Provides public API for Studio Builder

**Studio Builder** (https://studiobuilder.cochran.cloud)
- Displays panelist showcase pages
- Reads data from Mindful Intake API
- Links to manufacturer sites

### Data Flow

```
Panelist creates profile in Mindful Intake
          ↓
Data stored in Supabase (mindful-intake dev database)
          ↓
Studio Builder fetches via public API
          ↓
Community sees panelist studios at /panelists
```

## Setup Instructions

### 1. Apply Database Migration

**Location:** `mindful-intake/supabase/migrations/20260523_add_panelist_features.sql`

**Option A: Supabase Dashboard (Recommended)**
1. Go to https://supabase.com/dashboard/project/xsmbaldyidtmxslmuenm
2. Click "SQL Editor" in left sidebar
3. Click "New Query"
4. Copy/paste the entire migration SQL
5. Click "Run" (bottom right)

**Option B: psql Command Line**
```bash
cd ~/mindful-intake
PGPASSWORD="<password>" psql "postgresql://postgres.xsmbaldyidtmxslmuenm:<password>@db.xsmbaldyidtmxslmuenm.supabase.co:5432/postgres" -f supabase/migrations/20260523_add_panelist_features.sql
```

### 2. Deploy Mindful Intake

```bash
# Changes already committed to beta branch
# Deploy via Coolify:
# 1. Go to https://coolify.cochran.cloud
# 2. Find: mindful-intake-dev
# 3. Click: Redeploy
# 4. Wait for build success
```

### 3. Deploy Studio Builder

```bash
# Changes already committed to main branch
# Deploy via Coolify:
# 1. Find: oh-studio-builder
# 2. Click: Redeploy
# 3. Wait for build success
```

## User Workflow

### For Panelists

1. **Create Profile**
   - Visit: https://mindful-dev.cochran.cloud/dashboard/panelist-profile
   - Enable "Public Panelist Profile" toggle
   - Fill in bio, photo, specialty
   - Add studio gear items

2. **Add Gear**
   - Click "Add Gear" button
   - Select items from Studio Builder catalog (89 items)
   - Or add custom gear not in catalog
   - Add personal notes about each item
   - Upload photos of actual gear
   - Mark public/private

3. **Preview**
   - Click "Show Preview" to see public profile
   - Public URL: `studiobuilder.cochran.cloud/panelists/{slug}`

### For Community Members

1. **Browse Panelists**
   - Visit: https://studiobuilder.cochran.cloud/panelists
   - See grid of all panelists
   - Preview gear counts and specialties

2. **View Studio Details**
   - Click panelist card
   - See full bio, all gear, photos
   - Click gear items to find for purchase
   - "Build Similar" CTA to copy setup

## Database Schema

### Tables Added

**profiles (extended)**
- `is_panelist` - Boolean flag
- `panelist_slug` - URL-friendly slug (auto-generated)
- `panelist_bio` - Public bio text
- `panelist_photo_url` - Profile photo
- `specialty` - Area of expertise
- `website_url`, `twitter_handle`, `linkedin_url` - Social links

**panelist_gear (new)**
- `user_id` - Links to profiles
- `item_id` - References Studio Builder items.json
- `custom_name` - For gear not in catalog
- `notes` - Personal notes about gear
- `photo_url` - Actual gear photo
- `purchase_year` - When acquired
- `is_public` - Privacy control
- `display_order` - Manual ordering

### Views

**public_panelist_profiles**
- Aggregates profiles + gear for API
- Only public data
- No auth required to query

## API Endpoints

### Mindful Intake

**GET /api/public/panelists**
- Returns all panelist profiles with gear
- No authentication required
- Used by Studio Builder

**POST /api/public/panelists**
- Body: `{ slug: "john-doe" }`
- Returns single panelist by slug
- No authentication required

**PUT /api/panelist-profile**
- Update panelist profile
- Requires authentication
- Used by profile editor

**DELETE /api/panelist-profile/gear/[id]**
- Remove gear item
- Requires authentication

### Studio Builder

**GET /panelists**
- Lists all panelists
- Fetches from Mindful Intake API

**GET /panelists/[slug]**
- Individual panelist detail
- Fetches from Mindful Intake API

## Revenue Opportunities

### Affiliate Links
- Each gear item can have custom affiliate link
- Default Google search for purchase
- Future: Integrate B&H Photo, Amazon Associates

### Sponsored Placements
- Manufacturers can sponsor panelist profiles
- "Powered by [Brand]" gear showcases
- Featured panelist rotations

### Premium Panelist Profiles
- Enhanced profiles with video walkthroughs
- Downloadable preset files
- "Ask the panelist" Q&A feature

## Testing Checklist

### Before Friday Board Demo

- [ ] Apply migration to Supabase
- [ ] Deploy Mindful Intake dev
- [ ] Deploy Studio Builder
- [ ] Create test panelist profile
- [ ] Add 3-5 gear items
- [ ] Verify appears on /panelists
- [ ] Test individual detail page
- [ ] Test all social links work
- [ ] Test "Find this gear" links work

### Test Panelist Data

Create a test profile with:
- Bio: "Professional video producer for Office Hours Global. Specialized in multi-camera livestreams and hybrid events."
- Specialty: "Live Production"
- Gear:
  - Sony ZV-E10 II
  - Shure MV7+
  - ATEM Mini Pro
  - Elgato Stream Deck
  - PTZOptics 12X-NDI

## Maintenance

### Adding New Gear to Catalog

1. Update `studiobuilder/data/items.json`
2. Panelists can immediately select it
3. Automatic manufacturer link generation

### Moderating Panelist Content

- RLS policies ensure users only edit own profiles
- Admin can query `panelist_gear` table to review
- Set `is_public = false` to hide inappropriate items

### Data Cleanup

```sql
-- Find panelists with no gear
SELECT p.email, p.panelist_slug
FROM profiles p
LEFT JOIN panelist_gear pg ON p.id = pg.user_id
WHERE p.is_panelist = TRUE AND pg.id IS NULL;

-- Find inactive panelists (can disable)
UPDATE profiles
SET is_panelist = FALSE
WHERE panelist_slug = 'inactive-user';
```

## Security & Privacy

### Row Level Security (RLS)

- Users can only edit their own profiles/gear
- Public API only returns `is_public = true` gear
- Panelist can toggle entire profile on/off

### CORS

- Mindful Intake API allows requests from Studio Builder
- Public endpoints have no auth requirement
- Private endpoints require Supabase session

### Data Portability

- Panelists can export their gear list JSON
- Can disable profile anytime
- Data remains in their Mindful Intake account

## Future Enhancements

### Phase 2 (Post-Launch)
- [ ] Drag-drop gear reordering in editor
- [ ] Bulk import gear from CSV
- [ ] "Clone this setup" button (auto-fills build)
- [ ] Gear comparison tool (side-by-side panelists)

### Phase 3 (Advanced)
- [ ] Video studio tours embedded
- [ ] Panelist Q&A comment threads
- [ ] Upvote favorite setups
- [ ] "This gear is in X panelist studios" badges

### Phase 4 (Monetization)
- [ ] Affiliate tracking per-panelist
- [ ] Revenue share with panelists
- [ ] Sponsored gear partnerships
- [ ] Premium profile tier ($10/mo)

## Troubleshooting

### Panelists don't appear on Studio Builder

**Check:**
1. Migration applied? Query `panelist_gear` table exists
2. Profile has `is_panelist = true`
3. Profile has gear with `is_public = true`
4. API endpoint returns data: `curl https://mindful-dev.cochran.cloud/api/public/panelists`

### Gear items show as item_id instead of name

**Cause:** Item not in Studio Builder catalog

**Fix:** Add to `studiobuilder/data/items.json` or use `custom_name` field

### Photos not displaying

**Check:**
1. URL is publicly accessible (not behind auth)
2. HTTPS (not HTTP)
3. Correct CORS headers on image host

### Slug conflicts (two panelists same slug)

**Auto-handled:** Trigger appends `-2`, `-3`, etc.

**Manual fix:**
```sql
UPDATE profiles
SET panelist_slug = 'new-unique-slug'
WHERE id = '<user-id>';
```

## Contact & Support

- Questions: Office Hours Global Discord
- Bug reports: GitHub Issues on respective repos
- Feature requests: Community feedback channel

---

**Last Updated:** 2026-05-23
**Integration Status:** Ready for testing
**Deployment:** Pending migration application
