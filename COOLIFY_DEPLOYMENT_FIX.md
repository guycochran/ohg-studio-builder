# Coolify Deployment Fix - OHG Studio Builder

## Problem

Deployment failed with error:
```
fatal: unable to access 'https://guycochran/ohg-studio-builder.git/': Could not resolve host: guycochran
```

**Root Cause:** Coolify has an incomplete GitHub URL.

- ❌ Wrong: `https://guycochran/ohg-studio-builder.git/`
- ✅ Correct: `https://github.com/guycochran/ohg-studio-builder.git`

---

## Solution 1: Edit Repository URL (Fastest)

1. Go to: https://coolify.cochran.cloud
2. Click on your **"ohg-studio-builder"** application
3. Navigate to **"Source"** or **"Repository"** tab
4. Find the repository URL field
5. Change it to the FULL GitHub URL:
   ```
   https://github.com/guycochran/ohg-studio-builder.git
   ```
6. Save changes
7. Click **"Redeploy"**

---

## Solution 2: Delete and Recreate (Recommended if editing doesn't work)

### Step 1: Delete Failed Application
1. Go to: https://coolify.cochran.cloud
2. Find: **"ohg-studio-builder"**
3. Click: **"Delete Application"**
4. Confirm deletion

### Step 2: Create New Application

1. Click: **"New Application"**
2. Select: **"Public GitHub Repository"**
3. Repository URL: **COPY THIS EXACTLY**
   ```
   https://github.com/guycochran/ohg-studio-builder.git
   ```
4. Branch: **main**
5. Click: **"Continue"**

### Step 3: Configure Build Settings

Coolify should auto-detect Nixpacks. Verify these settings:

**Build Configuration:**
- Build Pack: **Nixpacks** (auto-detected)
- Base Directory: **(leave empty)**
- Build Command: `npm run build`
- Install Command: `npm ci`
- Start Command: `node server.js`

### Step 4: Set Environment Variables

Click **"Environment Variables"** tab and add these:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xsmbaldyidtmxslmuenm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzbWJhbGR5aWR0bXhzbG11ZW5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyMzkwMTIsImV4cCI6MjA1MDgxNTAxMn0.jJhALKn2U7xqzJ0FIVYbVPdx9eWJBmjqQPXbLCVSMo8
NEXT_PUBLIC_SITE_URL=https://studiobuilder.cochran.cloud
NEXT_PUBLIC_SITE_NAME=OHG Studio Builder
YOUTUBE_CHANNEL_ID=UCLEcJk-kqz6kzpuoqFQrMPw
```

### Step 5: Configure Domain

1. Click **"Domains"** tab
2. Add domain: **studiobuilder.cochran.cloud**
3. Enable HTTPS: ✓ (Let's Encrypt auto-configured)
4. Save

### Step 6: Deploy

1. Click **"Deploy"** button
2. Watch the deployment logs
3. Wait for: **"Application is ready"** (2-3 minutes)

---

## Verification After Deployment

### Check 1: Deployment Logs
Look for these success indicators:
```
✓ Compiled successfully
✓ Generating static pages
✓ Finalizing page optimization
Route (app)
┌ ○ /
└ ○ /_not-found
```

### Check 2: Test the URL
```bash
curl -I https://studiobuilder.cochran.cloud
# Should return: HTTP/2 200 OK
```

### Check 3: Open in Browser
1. Go to: https://studiobuilder.cochran.cloud
2. Should see: OHG Studio Builder homepage
3. Should load: 4 budget tiers, 4 use cases
4. Test features:
   - Click tier buttons
   - Select use case
   - Toggle Rack View
   - Click "Mentioned in 3 episodes"

### Check 4: Verify No Console Errors
1. Press F12 (DevTools)
2. Check Console tab
3. Should have no red errors

---

## Expected Build Output

When deployment succeeds, you'll see:

```
▲ Next.js 16.2.6 (Turbopack)
- Environments: .env.local

  Creating an optimized production build ...
✓ Compiled successfully in 2000ms
  Running TypeScript ...
  Finished TypeScript in 2.1s ...
  Collecting page data using 5 workers ...
  Generating static pages using 5 workers (0/4) ...
✓ Generating static pages using 5 workers (4/4) in 320ms
  Finalizing page optimization ...

Route (app)
┌ ○ /
└ ○ /_not-found

○  (Static)  prerendered as static content

Application is ready
```

---

## Troubleshooting Common Issues

### Issue 1: "Repository not found"
- Verify the repository is public: https://github.com/guycochran/ohg-studio-builder
- Check you're using the full URL with `github.com` domain

### Issue 2: "Build failed" or "TypeScript errors"
- This should NOT happen (build verified locally)
- Check Coolify logs for specific error
- Verify all environment variables are set

### Issue 3: "502 Bad Gateway" after successful deployment
- Wait 30 seconds (container might still be starting)
- Hard refresh browser: Ctrl+Shift+R
- Check Coolify logs for port binding errors

### Issue 4: Domain not resolving
- Verify DNS settings for studiobuilder.cochran.cloud
- Check Cloudflare Tunnel configuration
- Wait 5 minutes for DNS propagation

---

## Quick Reference: Correct GitHub URL

**HTTPS (recommended for Coolify):**
```
https://github.com/guycochran/ohg-studio-builder.git
```

**SSH (alternative):**
```
git@github.com:guycochran/ohg-studio-builder.git
```

**Repository page (for viewing):**
```
https://github.com/guycochran/ohg-studio-builder
```

---

## Support Resources

**GitHub Repository:**
- URL: https://github.com/guycochran/ohg-studio-builder
- Branch: main
- Commits: 5 (all verified)
- Status: ✅ Public and accessible

**Documentation in Repo:**
- PRODUCTION_READY.md - Deployment verification
- DEPLOYMENT.md - Detailed Coolify guide
- DEMO_READY.md - Board demo script
- README.md - Project overview

**Coolify Dashboard:**
- URL: https://coolify.cochran.cloud
- Application name: ohg-studio-builder
- Domain: studiobuilder.cochran.cloud

---

**Once deployment succeeds, you'll have a production-ready studio configurator live at https://studiobuilder.cochran.cloud ready for your board demo! 🚀**
