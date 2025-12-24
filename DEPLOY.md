# Deployment Guide

## Deploy to Netlify

### 1. Connect Repository

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Select GitHub and choose `jasonsutter87/launch-planner`
4. Build settings will auto-detect from `netlify.toml`
5. Click "Deploy"

### 2. Set Environment Variables

In Netlify dashboard → Site settings → Environment variables, add:

| Variable | How to Get |
|----------|-----------|
| `AUTH_SECRET` | Run: `openssl rand -base64 32` |
| `GITHUB_ID` | GitHub OAuth App Client ID |
| `GITHUB_SECRET` | GitHub OAuth App Client Secret |
| `GOOGLE_ID` | Google OAuth Client ID |
| `GOOGLE_SECRET` | Google OAuth Client Secret |

### 3. Create GitHub OAuth App

1. Go to [github.com/settings/developers](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in:
   - **Application name:** Launch Planner
   - **Homepage URL:** `https://your-site.netlify.app`
   - **Authorization callback URL:** `https://your-site.netlify.app/api/auth/callback/github`
4. Copy Client ID and Client Secret to Netlify env vars

### 4. Create Google OAuth App

1. Go to [console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)
2. Create a new project (or select existing)
3. Click "Create Credentials" → "OAuth client ID"
4. Select "Web application"
5. Add Authorized redirect URI: `https://your-site.netlify.app/api/auth/callback/google`
6. Copy Client ID and Client Secret to Netlify env vars

### 5. Redeploy

After setting environment variables, trigger a redeploy in Netlify.

---

## Run Locally

```bash
cd /Users/jasonsutter/Documents/Companies/launch-planner
cp .env.example .env.local
# Edit .env.local with your OAuth credentials
pnpm dev
```

For local development, use callback URLs:
- `http://localhost:3000/api/auth/callback/github`
- `http://localhost:3000/api/auth/callback/google`
