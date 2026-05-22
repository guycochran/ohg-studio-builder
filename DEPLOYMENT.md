# Deployment Guide - OHG Studio Builder

## Quick Deploy to studiobuilder.cochran.cloud

### Step 1: Push to GitHub

**Option A: Via Web (Recommended)**
1. Go to https://github.com/new
2. Repository name: `ohg-studio-builder`
3. Description: `Interactive studio configurator for Office Hours Global`
4. Public repository
5. Create repository
6. Copy the remote URL

**Then run:**
```bash
cd /home/guycochran/oh/studiobuilder
git remote add origin https://github.com/YOUR-USERNAME/ohg-studio-builder.git
git branch -M main
git push -u origin main
```

**Option B: Manual commands if you already have the repo:**
```bash
cd /home/guycochran/oh/studiobuilder
git remote add origin <your-repo-url>
git push -u origin master
```

### Step 2: Deploy via Coolify

1. **Go to Coolify Dashboard**
   - https://coolify.cochran.cloud

2. **Create New Application**
   - Click "New Resource" → "Application"
   - Select your GitHub repo: `ohg-studio-builder`
   - Branch: `main` or `master`
   - Build Pack: Dockerfile
   - Port: 3000

3. **Configure Environment Variables**

   Click "Environment Variables" and add:

   ```
   # Supabase Configuration (Shared with Mindful Intake Dev)
   NEXT_PUBLIC_SUPABASE_URL=https://xsmbaldyidtmxslmuenm.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzbWJhbGR5aWR0bXhzbG11ZW5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyMzkwMTIsImV4cCI6MjA1MDgxNTAxMn0.jJhALKn2U7xqzJ0FIVYbVPdx9eWJBmjqQPXbLCVSMo8

   # Site Configuration
   NEXT_PUBLIC_SITE_URL=https://studiobuilder.cochran.cloud
   NEXT_PUBLIC_SITE_NAME=OHG Studio Builder

   # YouTube API (from ohdashboard)
   YOUTUBE_CHANNEL_ID=UCLEcJk-kqz6kzpuoqFQrMPw

   # Environment
   NODE_ENV=production
   ```

4. **Configure Domain**
   - Go to "Domains" tab
   - Add domain: `studiobuilder.cochran.cloud`
   - DNS should already be configured via Cloudflare

5. **Deploy!**
   - Click "Deploy"
   - Wait ~2-3 minutes for build
   - Visit https://studiobuilder.cochran.cloud

### Step 3: Verify Deployment

```bash
# Check if site is live
curl -I https://studiobuilder.cochran.cloud

# Should return: HTTP/1.1 200 OK
```

### Troubleshooting

**Issue: 502 Bad Gateway**
- Check Coolify logs for build errors
- Verify environment variables are set
- Check Docker container is running:
  ```bash
  docker ps | grep studiobuilder
  ```

**Issue: Build Failed**
- Check Coolify deployment logs
- Common issues:
  - Missing environment variables
  - Node.js version mismatch (should be 22)
  - Port conflicts

**Issue: White Screen**
- Hard refresh: Ctrl+Shift+R
- Check browser console for errors
- Verify Supabase URL is correct

### Future Deployments

After initial setup, just push to GitHub:

```bash
git add .
git commit -m "Add new features"
git push origin main
```

Then click "Redeploy" in Coolify dashboard.

---

## Alternative: Vercel Deployment (Easier)

If Coolify gives issues, deploy to Vercel:

```bash
npm install -g vercel
vercel --prod
```

Then update DNS to point to Vercel:
- CNAME: studiobuilder.cochran.cloud → cname.vercel-dns.com

---

## Post-Deployment Checklist

- [ ] Site loads at https://studiobuilder.cochran.cloud
- [ ] Tier selector works (all 4 tiers)
- [ ] Use case selector works (all 4 cases)
- [ ] Items display correctly
- [ ] Budget sidebar calculates correctly
- [ ] No console errors in browser DevTools
- [ ] Mobile responsive (test on phone)
- [ ] SSL certificate valid (https works)

---

**Need Help?**
- Coolify Dashboard: https://coolify.cochran.cloud
- Supabase Dashboard: https://supabase.com/dashboard/project/xsmbaldyidtmxslmuenm
- GitHub Repo: (add link after creating)
