# FOUND THE ISSUE! Port Mismatch

## 🔍 Problem

**Cloudflare tunnel expects:** `http://localhost:3010`
**Container is published to:** `http://localhost:3011`

**Result:** Tunnel routes to port 3010 (nothing there) → HTTP 404 → White screen

## ✅ Evidence

```bash
# Container port mapping
docker ps | grep studio
# Shows: 0.0.0.0:3011->3000/tcp

# Cloudflare tunnel config (from NETWORK_ARCHITECTURE.md line 122-124)
- hostname: studiobuilder.cochran.cloud
  service: http://localhost:3010

# Testing ports
curl http://localhost:3010  # Connection refused (nothing there)
curl http://localhost:3011  # App is here! (but tunnel isn't routing here)
```

## 🔧 Fix Options

### Option 1: Change Coolify Port to 3010 (Recommended)

**Why:** Matches your NETWORK_ARCHITECTURE.md standard

**Steps:**
1. Go to: https://coolify.cochran.cloud
2. Find: "OHG Studio Builder"
3. Click: "Configuration" or "Settings"
4. Find: "Port Mappings"
5. Change: `3011:3000` → `3010:3000`
6. Click: "Redeploy"
7. Wait: ~2 minutes
8. Test: `curl https://studiobuilder.cochran.cloud`

### Option 2: Update Cloudflare Tunnel Config (Alternative)

**Why:** Matches current Coolify config

**Steps:**
1. Edit tunnel config:
   ```bash
   sudo nano /etc/cloudflared/config.yml
   ```

2. Find this section:
   ```yaml
   - hostname: studiobuilder.cochran.cloud
     service: http://localhost:3010
   ```

3. Change to:
   ```yaml
   - hostname: studiobuilder.cochran.cloud
     service: http://localhost:3011
   ```

4. Restart cloudflared:
   ```bash
   sudo systemctl restart cloudflared
   ```

5. Test:
   ```bash
   curl https://studiobuilder.cochran.cloud
   ```

## 📋 Recommended: Option 1 (Change to 3010)

This keeps your infrastructure consistent with NETWORK_ARCHITECTURE.md documentation.

**After fix:**
- ✅ App on port 3010 (matches docs)
- ✅ Tunnel routes to 3010
- ✅ Everything aligned with your port allocation map

## 🧪 Verification After Fix

```bash
# Test localhost
curl -I http://localhost:3010
# Should return: HTTP/1.1 200 OK

# Test external
curl -I https://studiobuilder.cochran.cloud
# Should return: HTTP/2 200

# Test in browser
# Visit: https://studiobuilder.cochran.cloud
# Hard refresh: Ctrl+Shift+R
# Should see: Full OHG Studio Builder page
```

## 📊 Port Status

```
Assigned in NETWORK_ARCHITECTURE.md: 3010 ✅
Coolify current setting: 3011 ❌ MISMATCH
Cloudflare tunnel config: 3010 ✅
Container published to: 3011 ❌ MISMATCH
```

**Fix the mismatch = Site works!**

---

**Your app is perfect. Just need port alignment.** 🎯
