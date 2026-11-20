# TIMELOOP AI – Deployment & Production Guide

This guide explains how to deploy **TIMELOOP AI – Entertainment Edition** to **Vercel** and **Supabase**.

---

## 1. Supabase Setup

### Step 1: Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Note your **Project URL**, **Anon API Key**, and **Service Role Key**.

### Step 2: Run Database Migrations
In your Supabase project's **SQL Editor**, run the following scripts in order:
1. `supabase/migrations/20261120000000_init_timeloop_schema.sql` (Creates all 15 core tables, indexes, and constraints).
2. `supabase/migrations/20261120000001_rls_and_storage.sql` (Enables Row Level Security and owner-only access policies).
3. `supabase/seed.sql` (Seeds the 8 initial historical and fictional time eras).

### Step 3: Configure Storage Buckets
Create the following public storage buckets in Supabase Storage:
- `character-portraits`
- `scene-artwork`
- `movie-posters`

---

## 2. NVIDIA NIM Configuration

1. Obtain an API key from the [NVIDIA API Catalog](https://build.nvidia.com).
2. Ensure you have access to `mistralai/mistral-large-4-1t-a52b` or a compatible model.
3. Test connectivity locally:
```bash
curl https://integrate.api.nvidia.com/v1/chat/completions \
  -H "Authorization: Bearer $NVIDIA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "mistralai/mistral-large-4-1t-a52b",
    "messages": [{"role": "user", "content": "Ping"}]
  }'
```

---

## 3. Vercel Deployment

### Method A: Vercel CLI
```bash
npm install -g vercel
vercel
```

### Method B: Git Integration
1. Push your repository to GitHub or GitLab.
2. In the Vercel Dashboard, import the repository.
3. Add the following **Environment Variables**:
   - `NVIDIA_API_KEY`: Your NVIDIA API Key (`nvapi-...`).
   - `NVIDIA_BASE_URL`: `https://integrate.api.nvidia.com/v1`
   - `NVIDIA_MODEL`: `mistralai/mistral-large-4-1t-a52b`
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Key.
   - `APP_URL`: Your Vercel production domain (e.g. `https://timeloop-ai.vercel.app`).
   - `NODE_ENV`: `production`

4. Deploy!

---

## 4. Health Check Verification
After deployment, verify that the health endpoint returns `status: "ok"`:
```bash
curl https://your-domain.vercel.app/api/health
```
Expected response:
```json
{
  "status": "ok",
  "app": "TIMELOOP AI – Entertainment Edition",
  "version": "1.0.0",
  "nvidia_nim": {
    "configured": true,
    "default_model": "mistralai/mistral-large-4-1t-a52b",
    "verification": { "success": true, "message": "NVIDIA NIM connection verified successfully." }
  },
  "database": {
    "live_supabase": true,
    "loaded_eras": 8
  }
}
```
