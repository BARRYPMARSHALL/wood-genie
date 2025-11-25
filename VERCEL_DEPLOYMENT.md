# Vercel Deployment Guide - Wood Genie

## Prerequisites
- GitHub account with repository: https://github.com/BARRYPMARSHALL/wood-genie
- Vercel account connected to GitHub

## Deployment Steps

### Option 1: Automatic Deployment (GitHub Connected)
If Vercel is already connected to your GitHub repo, simply push the latest changes:

```bash
# Add all changes
git add -A

# Commit
git commit -m "fix: rebuild app with cleaned components and production-ready build"

# Push to main branch (triggers Vercel auto-deploy)
git push origin main
```

Vercel will automatically:
1. Detect the push to main branch
2. Run `npm run build` 
3. Deploy dist/ folder to https://wood-genie.vercel.app

### Option 2: Manual Vercel Deployment
If GitHub is not connected or you prefer manual deployment:

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Select "Import Git Repository"
4. Enter: `https://github.com/BARRYPMARSHALL/wood-genie`
5. Configure project settings:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add Environment Variable:
   - **Name**: `VITE_API_KEY`
   - **Value**: `AIzaSyCsBKEHlrxPkHdsiKWzTDOBFOOp_ROX4Nw`
7. Click "Deploy"

### Option 3: Deploy from dist/ Folder
If you have a built dist/ folder ready:

```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Deploy
vercel --prod

# Follow prompts to configure and deploy
```

## Deployment Configuration

### Required Environment Variables
**In Vercel Settings** (Project → Settings → Environment Variables):

```
VITE_API_KEY = AIzaSyCsBKEHlrxPkHdsiKWzTDOBFOOp_ROX4Nw
```

### Build Settings
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 18.x or higher (default is fine)

## Verification After Deployment

1. **Check Deployment Status**
   - Go to https://vercel.com/barrys-projects-eeeb8313/wood-genie
   - Look for green checkmark and "Ready" status

2. **Test Live URL**
   - Visit: https://wood-genie.vercel.app/
   - Verify app loads without errors

3. **Full E2E Test on Live**
   - Upload a furniture image
   - Wait for AI analysis loading screen
   - Check results display correctly
   - Test PDF download
   - Verify email modal doesn't auto-submit on Enter

4. **Check Browser Console**
   - Open DevTools (F12)
   - Console tab should show:
     - "✅ Successfully parsed plan: [planTitle]"
     - No red error messages
     - Gemini API logs with 📤, 📡, ✅ markers

## Current Build Status

✅ Production build ready:
- **Build size**: ~305 KB gzipped
- **Build time**: 8.43 seconds
- **Status**: 0 errors, all modules transformed
- **API Key**: Embedded in production bundle

## Troubleshooting

### Build Fails on Vercel
1. Check that `.env.production` contains the API key
2. Verify `vite.config.ts` is loading `.env.production`
3. Check build logs in Vercel dashboard for specific error

### API Key Not Working
1. Verify `VITE_API_KEY` is set in Vercel environment variables
2. Check that the key is correct (starts with `AIzaSy...`)
3. Rebuild and redeploy

### App Loads but No AI Response
1. Check browser console for API errors
2. Verify Gemini API key is valid and quota not exceeded
3. Check that `.env.production` is being loaded at build time
4. Try uploading a simple furniture image first

## Post-Deployment Steps

### 1. Monitor Performance
- Set up analytics in Vercel dashboard
- Watch for build/deployment errors
- Monitor response times

### 2. Set Up Error Tracking (Optional)
- Add Sentry for error monitoring
- Add Google Analytics for user tracking

### 3. Update Documentation
- Update README.md with deployment info
- Document API key rotation process
- Create runbook for troubleshooting

## Important Notes

1. **API Key Security**: 
   - `.env.production` is in the repo (for build-time injection)
   - Also set `VITE_API_KEY` in Vercel for redundancy
   - Monitor API key usage at https://console.cloud.google.com

2. **Build Artifacts**:
   - dist/ folder contains all files needed for deployment
   - Vercel will auto-build when you push to main
   - No manual build step needed if using GitHub auto-deploy

3. **Custom Domain** (Optional):
   - Go to Vercel Settings → Domains
   - Add custom domain (e.g., wood-genie.yourcompany.com)
   - Update DNS records as instructed

## Quick Deployment Checklist

- [ ] Latest code committed to GitHub main branch
- [ ] Production build passes (`npm run build`)
- [ ] `VITE_API_KEY` set in Vercel environment variables
- [ ] Vercel project configured for Vite
- [ ] Deployment triggered (auto or manual)
- [ ] Live URL tested and working
- [ ] E2E flow verified on live site
- [ ] Console logs checked for errors

---

**Status**: Ready for deployment ✅

Once you push to GitHub, Vercel will automatically build and deploy within 1-2 minutes.
