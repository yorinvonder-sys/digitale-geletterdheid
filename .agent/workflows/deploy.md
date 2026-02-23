---
description: Deploy the app to Vercel
---

# Vercel Deployment Workflow

## Prerequisites
1. Ensure Vercel CLI is installed:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel (one-time):
   ```bash
   vercel login
   ```

## Deployment Steps

### Production Deployment
```bash
npm run build:prod && vercel --prod
```

### Preview Deployment
```bash
vercel
```

## Post-Deployment Checklist
- [ ] Test login functionality
- [ ] Verify Supabase data access
- [ ] Check Storage uploads work
- [ ] Test on mobile devices

## View Deployed Site
https://dgskills.app
