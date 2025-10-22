# JobBoard Pro - Vercel Deployment Guide

## 🚀 Complete Deployment Steps

### Prerequisites

Before deploying, ensure you have:
1. ✅ A Supabase account with your database configured
2. ✅ A GitHub account
3. ✅ A Vercel account (free tier is fine)
4. ✅ Your `.env` file configured locally

---

## Step 1: Prepare Your Project

### 1.1 Test Locally First

Make sure everything works locally:

```bash
cd jobboard_pro

# Install dependencies
npm install

# Create .env file (if not already done)
# Copy contents from ENV_SETUP.md

# Test the app
npm run dev
```

Visit http://localhost:4028 and verify:
- ✅ Homepage shows jobs from database
- ✅ Job search and filtering works
- ✅ Job details page loads
- ✅ Admin login works
- ✅ Resume builder generates content

### 1.2 Update Configuration

Update `package.json` build script:

```json
{
  "scripts": {
    "start": "vite",
    "build": "vite build",
    "serve": "vite preview"
  }
}
```

### 1.3 Environment Variables

Create `.env.production` file:

```env
VITE_SUPABASE_URL=https://eugxmctvpxfqcnsmfmfd.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
OPENAI_API_KEY=your-openai-api-key
```

---

## Step 2: Push to GitHub

### 2.1 Initialize Git Repository

```bash
cd jobboard_pro

# Initialize git (if not already done)
git init

# Add gitignore
echo "node_modules
.env
.env.local
.env.production
dist
.DS_Store" > .gitignore

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit - JobBoard Pro"
```

### 2.2 Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository:
   - **Name**: `jobboard-pro`
   - **Visibility**: Private (recommended) or Public
   - **Don't** initialize with README, .gitignore, or license
3. Click **Create repository**

### 2.3 Push Code to GitHub

```bash
# Add remote origin (replace USERNAME with your GitHub username)
git remote add origin https://github.com/USERNAME/jobboard-pro.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy to Vercel

### 3.1 Connect Repository

1. Go to https://vercel.com
2. Click **Add New** → **Project**
3. Click **Import Git Repository**
4. Select your `jobboard-pro` repository
5. Click **Import**

### 3.2 Configure Project Settings

#### Framework Preset
- **Framework**: Vite

#### Root Directory
- **Root Directory**: `jobboard_pro` (if your React app is in a subdirectory)
- If your package.json is in the root, leave this empty

#### Build & Output Settings
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3.3 Add Environment Variables

In the **Environment Variables** section, add:

```
VITE_SUPABASE_URL=https://eugxmctvpxfqcnsmfmfd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ... (your actual anon key)
OPENAI_API_KEY=sk-proj-... (your actual OpenAI key)
```

**Important**: 
- Copy-paste these values exactly
- Make sure there are no extra spaces
- Don't use quotes around the values

### 3.4 Deploy

Click **Deploy** and wait for the build to complete (usually 2-3 minutes).

---

## Step 4: Configure Vercel Serverless Functions

The AI Resume Builder backend is now running as Vercel Serverless Functions in the `/api` directory.

### Verify API Routes

After deployment, your API endpoints will be available at:
- `https://your-app.vercel.app/api/generate-resume`
- `https://your-app.vercel.app/api/extract-resume`

These are automatically handled by Vercel using the files in the `/api` directory.

---

## Step 5: Test Production Deployment

### 5.1 Basic Testing

Visit your deployed URL (e.g., `https://jobboard-pro.vercel.app`) and test:

1. **Homepage**:
   - ✅ Jobs are loading from Supabase
   - ✅ Featured jobs display correctly
   - ✅ Categories are showing

2. **Job Search**:
   - ✅ Search functionality works
   - ✅ Filters apply correctly
   - ✅ Pagination works

3. **Job Details**:
   - ✅ Click on a job shows details
   - ✅ Application form is visible
   - ✅ Related jobs load

4. **Admin Login**:
   - ✅ Visit `/admin-login`
   - ✅ Login with your admin credentials
   - ✅ Redirects to dashboard

5. **Admin Dashboard**:
   - ✅ Shows statistics
   - ✅ Lists applications
   - ✅ Job management works

6. **Resume Builder**:
   - ✅ AI generation works
   - ✅ PDF download functions
   - ✅ File upload works

### 5.2 Check for Errors

Open browser console (F12) and check for:
- ❌ No 404 errors
- ❌ No CORS errors
- ❌ No authentication errors

---

## Step 6: Custom Domain (Optional)

### 6.1 Add Custom Domain

1. In Vercel Dashboard, go to your project
2. Click **Settings** → **Domains**
3. Click **Add Domain**
4. Enter your domain (e.g., `jobs.yourcompany.com`)
5. Follow DNS configuration instructions

### 6.2 DNS Configuration

Add these DNS records in your domain provider:

**For subdomain** (e.g., jobs.yourcompany.com):
```
Type: CNAME
Name: jobs
Value: cname.vercel-dns.com
```

**For root domain** (e.g., yourcompany.com):
```
Type: A
Name: @
Value: 76.76.19.19
```

---

## Step 7: Configure Supabase for Production

### 7.1 Update Supabase URL Redirect

1. Go to Supabase Dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. Add your Vercel URL to:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: Add `https://your-app.vercel.app/**`

### 7.2 Update CORS Settings

In Supabase SQL Editor, run:

```sql
-- Allow requests from your Vercel domain
ALTER DATABASE postgres SET app.cors_allowed_origins = 'https://your-app.vercel.app';
```

---

## Step 8: Continuous Deployment

### 8.1 Automatic Deployments

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes to your code
git add .
git commit -m "Update feature X"
git push origin main
```

Vercel will:
1. Detect the push
2. Build your project
3. Deploy automatically
4. Send you a notification

### 8.2 Preview Deployments

For branches other than `main`:

```bash
git checkout -b feature-new-feature
# Make changes
git add .
git commit -m "Add new feature"
git push origin feature-new-feature
```

Vercel creates a preview URL for each branch.

---

## Troubleshooting

### Build Fails

**Error**: `Module not found`
- **Solution**: Make sure all dependencies are in `package.json`
- Run `npm install` locally first to update package-lock.json
- Commit and push changes

**Error**: `Build exceeded maximum duration`
- **Solution**: Optimize your build:
  - Remove unused dependencies
  - Check for infinite loops in build scripts

### Jobs Not Loading

**Error**: No jobs appearing on homepage
- **Solution**: 
  - Check environment variables in Vercel
  - Verify Supabase credentials are correct
  - Check browser console for API errors
  - Verify database has sample data

### Admin Login Not Working

**Error**: Cannot login to admin panel
- **Solution**:
  - Verify admin user exists in Supabase Auth
  - Check Supabase redirect URLs include your Vercel domain
  - Clear browser cookies and try again

### API Errors (Resume Builder)

**Error**: AI generation fails
- **Solution**:
  - Verify `OPENAI_API_KEY` is set in Vercel environment variables
  - Check OpenAI API key is valid and has credits
  - Check serverless function logs in Vercel

### CORS Errors

**Error**: CORS policy blocking requests
- **Solution**:
  - Verify API functions have CORS headers
  - Check Supabase CORS settings
  - Add your Vercel domain to allowed origins

---

## Performance Optimization

### 1. Enable Caching

Add to `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 2. Optimize Images

Use Vercel Image Optimization:

```jsx
import Image from 'next/image';

<Image 
  src="/logo.png" 
  alt="Logo" 
  width={200} 
  height={50}
  priority
/>
```

### 3. Enable Analytics

1. Go to Vercel Dashboard
2. Click **Analytics**
3. Enable Web Analytics (free)

---

## Monitoring & Maintenance

### Check Deployment Status

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Deployment Logs**: Click on any deployment to see logs
- **Runtime Logs**: View serverless function logs

### Monitor Database

- **Supabase Dashboard**: https://app.supabase.com
- **Table Editor**: View and edit data
- **API Logs**: Monitor API usage
- **Auth Logs**: Track authentication events

### Backup Database

Regular backups in Supabase:
1. Go to **Database** → **Backups**
2. Enable **Daily Backups**
3. Download backups as needed

---

## Security Best Practices

### 1. Environment Variables

- ✅ Never commit `.env` files to Git
- ✅ Use different keys for development and production
- ✅ Rotate API keys regularly

### 2. Supabase Security

- ✅ Enable Row Level Security (RLS) on all tables
- ✅ Use proper authentication policies
- ✅ Don't expose admin credentials
- ✅ Enable 2FA on Supabase account

### 3. Vercel Security

- ✅ Enable Vercel Authentication Protection for staging environments
- ✅ Use environment-specific configurations
- ✅ Monitor deployment logs for suspicious activity

---

## Next Steps After Deployment

1. **Add Real Content**:
   - Replace sample jobs with real ones
   - Add actual company information
   - Create proper job categories

2. **Customize Branding**:
   - Update company name and logo
   - Customize color scheme
   - Add custom domain

3. **Set Up Email**:
   - Configure email notifications for applications
   - Set up admin email alerts
   - Add confirmation emails for applicants

4. **Analytics**:
   - Enable Vercel Analytics
   - Add Google Analytics
   - Track job application conversions

5. **SEO**:
   - Submit sitemap to Google
   - Optimize meta tags
   - Add structured data

---

## Support & Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Supabase Documentation**: https://supabase.com/docs
- **React Documentation**: https://react.dev
- **Vite Documentation**: https://vitejs.dev

---

## Congratulations! 🎉

Your JobBoard Pro is now live and running on Vercel!

**Your deployment URL**: `https://your-app.vercel.app`

Share this URL with your team and start posting jobs!

