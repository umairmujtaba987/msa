# Production 500 Error Fixes

## Issues Identified

Based on the PM2 logs showing a 500 error, the following issues were identified and fixed:

### 1. Server-Side Rendering (SSR) Issues

**Problem:** The application was trying to access browser-only APIs (`localStorage`) during server-side rendering, causing crashes.

**Files Fixed:**
- `app/composables/useAxios.ts`
- `app/middleware/guest.ts`

**Changes:**
- Added `import.meta.client` checks before accessing `localStorage`
- Moved route access inside client-only blocks
- Added proper SSR guards for all browser-specific code

### 2. Missing Environment Variables

**Problem:** Production URLs were hardcoded to `localhost:8000`, causing API calls to fail in production.

**Files Fixed:**
- `nuxt.config.ts`

**Changes:**
- Replaced hardcoded URLs with environment variables
- Added fallback to localhost for development
- Created `.env.example` for documentation

### 3. Configuration Files

**Files Created:**
- `.env.example` - Environment variable template
- `ecosystem.config.cjs` - PM2 configuration
- `deploy.sh` - Deployment automation script
- `DEPLOYMENT.md` - Comprehensive deployment guide

## What Was Changed

### `nuxt.config.ts`
```typescript
// Before
apiBaseUrl: 'http://localhost:8000/api',
backendUrl: 'http://localhost:8000',

// After
apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
backendUrl: process.env.NUXT_PUBLIC_BACKEND_URL || 'http://localhost:8000',
```

### `app/composables/useAxios.ts`
```typescript
// Before
const token = typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;

// After
let token = null;
if (import.meta.client && typeof localStorage !== "undefined") {
  token = localStorage.getItem("token");
}
```

Also wrapped route access and navigation in `import.meta.client` checks.

### `app/middleware/guest.ts`
```typescript
// Before
const token = localStorage.getItem('token')?.trim();

// After
const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token')?.trim() : null;
```

## How to Deploy

1. **Create `.env` file on your production server:**
   ```bash
   NUXT_PUBLIC_API_BASE_URL=https://your-api-domain.com/api
   NUXT_PUBLIC_BACKEND_URL=https://your-api-domain.com
   ```

2. **Run the deployment script:**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

   Or manually:
   ```bash
   npm install
   npm run build
   pm2 restart ecosystem.config.cjs
   ```

3. **Check logs:**
   ```bash
   pm2 logs eco-globe
   ```

## Testing Checklist

After deployment, verify:

- [ ] Application loads without 500 errors
- [ ] Homepage renders correctly
- [ ] Login page is accessible
- [ ] Registration page is accessible
- [ ] API calls work (check network tab)
- [ ] No console errors
- [ ] PM2 logs show no errors

## Additional Notes

- All `localStorage` access is now client-side only
- The application properly handles SSR
- Environment variables are properly loaded
- PM2 configuration includes error logging
- The deployment script includes validation checks

## Rollback Plan

If issues persist:

1. Check PM2 logs: `pm2 logs eco-globe --lines 100`
2. Verify environment variables: `pm2 env 0`
3. Check Node version: `node --version` (should be v20.19.0+ or v22.12.0+)
4. Rebuild: `npm run build && pm2 restart eco-globe`
5. Check Laravel backend is accessible from the server
6. Verify CORS settings on Laravel backend
