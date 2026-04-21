# Deployment Guide for Eco-Globe

## Prerequisites

- Node.js v20.19.0 or v22.12.0+
- PM2 installed globally (`npm install -g pm2`)
- Access to your production server

## Production Environment Setup

### 1. Create Environment File

Create a `.env` file in the project root with your production values:

```bash
# Laravel API Base URL (with /api suffix)
NUXT_PUBLIC_API_BASE_URL=https://your-api-domain.com/api

# Laravel Backend URL (without /api suffix, for Sanctum CSRF)
NUXT_PUBLIC_BACKEND_URL=https://your-api-domain.com
```

**Important:** Replace the URLs with your actual production API URLs.

### 2. Install Dependencies

```bash
npm install
```

### 3. Build the Application

```bash
npm run build
```

This will create a `.output` directory with the production build.

### 4. Start with PM2

```bash
pm2 start ecosystem.config.cjs
```

Or manually:

```bash
pm2 start .output/server/index.mjs --name eco-globe
```

### 5. Save PM2 Configuration

```bash
pm2 save
pm2 startup
```

## Troubleshooting

### 500 Error on Production

If you encounter a 500 error, check the following:

1. **Environment Variables Not Set**
   - Ensure `.env` file exists with correct values
   - Verify PM2 is loading the environment variables

2. **Check PM2 Logs**
   ```bash
   pm2 logs eco-globe
   ```

3. **Verify Node Version**
   ```bash
   node --version
   ```
   Should be v20.19.0+ or v22.12.0+

4. **Check Build Output**
   - Ensure `.output` directory exists
   - Verify `node_modules` are installed

### Common Issues

#### localStorage is not defined
This has been fixed by adding `import.meta.client` checks. If you still see this error:
- Clear the `.nuxt` and `.output` directories
- Rebuild the application
- Restart PM2

#### CSRF Token Issues
- Ensure `NUXT_PUBLIC_BACKEND_URL` points to your Laravel backend
- Verify CORS is properly configured on your Laravel API
- Check that Sanctum is properly configured

## PM2 Commands

```bash
# View logs
pm2 logs eco-globe

# Restart application
pm2 restart eco-globe

# Stop application
pm2 stop eco-globe

# Delete from PM2
pm2 delete eco-globe

# Monitor
pm2 monit
```

## Production Checklist

- [ ] Environment variables are set correctly
- [ ] Dependencies are installed (`npm install`)
- [ ] Application is built (`npm run build`)
- [ ] PM2 is running the application
- [ ] Logs show no errors (`pm2 logs`)
- [ ] Application is accessible via browser
- [ ] API calls are working correctly
- [ ] Authentication flow works
- [ ] CSRF tokens are being handled properly

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NUXT_PUBLIC_API_BASE_URL` | Full URL to your Laravel API with /api suffix | `https://api.example.com/api` |
| `NUXT_PUBLIC_BACKEND_URL` | Full URL to your Laravel backend without /api | `https://api.example.com` |

## Additional Notes

- The application uses Server-Side Rendering (SSR)
- All localStorage access is client-side only
- CSRF tokens are handled automatically for state-changing requests
- The application requires a Laravel backend with Sanctum authentication
