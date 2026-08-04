# 🚀 GRAYMARK AI — Deployment & Ownership Guide

Follow this 3-step guide to push **GRAYMARK AI** to your personal GitHub account and deploy it for free on Vercel or Netlify.

---

## Step 1: Create a GitHub Repository

1. Go to [github.com/new](https://github.com/new).
2. Name your repository: `graymark-ai` (or `ai-career-coach`).
3. Set visibility to **Public** (recommended for portfolio showcases).
4. Click **Create repository** (do *not* initialize with README, as we already have one).

---

## Step 2: Push Your Local Repository to GitHub

Open terminal in `C:\Users\hp\.gemini\antigravity\scratch\ai-resume-career-coach` and run:

```bash
# Add your new GitHub remote
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/graymark-ai.git

# Set main branch and push
git branch -M main
git push -u origin main
```

---

## Step 3: 1-Click Free Deployment

### Option A: Vercel (Recommended)
1. Go to [vercel.com/new](https://vercel.com/new) and log in with your GitHub account.
2. Select your `graymark-ai` repository and click **Import**.
3. Keep default build settings (`Framework Preset: Vite`, `Build Command: npm run build`, `Output Directory: dist`).
4. Click **Deploy**.
5. Your live app URL (e.g., `https://graymark-ai.vercel.app`) will be ready in under 60 seconds!

### Option B: Netlify
1. Go to [app.netlify.com/start](https://app.netlify.com/start) and connect GitHub.
2. Choose your `graymark-ai` repository.
3. Build command: `npm run build` | Publish directory: `dist`.
4. Click **Deploy Site**.

---

## Optional: Custom Domain & API Key

- **Custom Domain**: In Vercel or Netlify project settings, click **Domains** to connect a custom domain (e.g. `graymark.ai` or `yourname.com/graymark`).
- **Live Gemini API**: Portfolio visitors can enter their own Google Gemini key in the top nav bar, or you can add a default key in environment variables if desired.
