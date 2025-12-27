# Railway Deployment Guide

Complete guide for deploying your FastAPI backend with Claude API on Railway's free plan.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Start (5 minutes)](#quick-start)
3. [Step-by-Step Deployment](#step-by-step-deployment)
4. [Environment Variables](#environment-variables)
5. [Free Plan Tips & Limits](#free-plan-tips--limits)
6. [Claude API Integration](#claude-api-integration)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- GitHub account (connected to Railway)
- Railway account: https://railway.app (sign up with GitHub)
- API keys:
  - Claude API: https://console.anthropic.com/
  - Cohere: https://dashboard.cohere.com/api-keys
  - Qdrant Cloud: https://cloud.qdrant.io/
  - OpenRouter (optional): https://openrouter.ai/keys

---

## Quick Start

```bash
# 1. Install Railway CLI (optional but helpful)
npm install -g @railway/cli

# 2. Login to Railway
railway login

# 3. Deploy from your repo
cd backend
railway init
railway up
```

Or use the web dashboard (recommended for first-time):
1. Go to https://railway.app/new
2. Click "Deploy from GitHub repo"
3. Select `Salwagull/Physical-AI-And-Humanoid-Robotics`
4. Set Root Directory to `backend`
5. Add environment variables
6. Deploy!

---

## Step-by-Step Deployment

### Step 1: Create Railway Project

1. Go to **https://railway.app/dashboard**
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub (if not done)
5. Search and select: `Physical-AI-And-Humanoid-Robotics`

### Step 2: Configure Service

After selecting the repo:

1. **Set Root Directory**:
   - Click on the service card
   - Go to **Settings** tab
   - Under "Source", set **Root Directory** to: `backend`

2. **Verify Build Settings**:
   - Builder: Nixpacks (auto-detected)
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn agent:app --host 0.0.0.0 --port $PORT`

### Step 3: Add Environment Variables

Click on your service → **Variables** tab → **Add Variable**:

| Variable | Value | Required |
|----------|-------|----------|
| `JWT_SECRET_KEY` | Generate: `python -c "import secrets; print(secrets.token_urlsafe(64))"` | Yes |
| `FRONTEND_URL` | `https://salwagull.github.io/Physical-AI-And-Humanoid-Robotics` | Yes |
| `ANTHROPIC_API_KEY` | Your Claude API key (sk-ant-...) | For Claude |
| `COHERE_API_KEY` | Your Cohere key | For RAG |
| `QDRANT_URL` | Your Qdrant cluster URL | For RAG |
| `QDRANT_API_KEY` | Your Qdrant API key | For RAG |
| `OPENROUTER_API_KEY` | Your OpenRouter key | Optional |
| `CLAUDE_MODEL` | `claude-3-haiku-20240307` | Optional |
| `CLAUDE_MAX_TOKENS` | `1024` | Optional |

**Pro Tip**: Use Railway's "RAW Editor" to paste multiple variables at once:
```
JWT_SECRET_KEY=your-secret-here
FRONTEND_URL=https://salwagull.github.io/Physical-AI-And-Humanoid-Robotics
ANTHROPIC_API_KEY=sk-ant-your-key
COHERE_API_KEY=your-cohere-key
QDRANT_URL=https://your-cluster.cloud.qdrant.io:6333
QDRANT_API_KEY=your-qdrant-key
```

### Step 4: Deploy

1. Click **"Deploy"** button
2. Wait for build to complete (2-3 minutes)
3. Once deployed, click **"Generate Domain"** to get your URL
4. Your backend is now live at: `https://your-project.up.railway.app`

### Step 5: Update Frontend

Update your frontend to use the Railway backend URL:

**Edit `docusaurus.config.js`:**
```javascript
customFields: {
  apiUrl: 'https://your-project.up.railway.app',
},
```

**Edit `.github/workflows/deploy.yml`:**
```yaml
- name: Build Docusaurus site
  env:
    API_URL: https://your-project.up.railway.app
  run: npm run build
```

---

## Environment Variables

### Required Variables

```bash
# Authentication
JWT_SECRET_KEY=<generate-secure-64-char-secret>

# Frontend URL for CORS
FRONTEND_URL=https://salwagull.github.io/Physical-AI-And-Humanoid-Robotics
```

### Claude API (Choose One)

```bash
# Option 1: Direct Claude API (Recommended)
ANTHROPIC_API_KEY=sk-ant-api03-...

# Option 2: Via OpenRouter (if you prefer)
OPENROUTER_API_KEY=sk-or-v1-...
```

### RAG Services

```bash
# Cohere for embeddings
COHERE_API_KEY=your-cohere-key

# Qdrant for vector storage
QDRANT_URL=https://your-cluster.cloud.qdrant.io:6333
QDRANT_API_KEY=your-qdrant-key
```

### Optional Configuration

```bash
# Claude model selection
CLAUDE_MODEL=claude-3-haiku-20240307  # Most cost-effective
# CLAUDE_MODEL=claude-3-sonnet-20240229  # Better quality
# CLAUDE_MODEL=claude-3-opus-20240229  # Best quality

# Token limits
CLAUDE_MAX_TOKENS=1024

# Token expiration
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```

---

## Free Plan Tips & Limits

### Railway Free Plan ($5/month credit)

| Resource | Limit | Notes |
|----------|-------|-------|
| Monthly credit | $5 | Generous for small projects |
| RAM | 512 MB (soft) | Can burst higher |
| CPU | Shared | Sufficient for APIs |
| Execution | 500 hours/month | ~16 hrs/day |
| Sleep mode | After 5 min idle | Auto-wakes on request |

### Optimization Tips

1. **Minimize Cold Starts**:
   ```python
   # Use lifespan to pre-initialize clients
   @asynccontextmanager
   async def lifespan(app: FastAPI):
       # Startup: Initialize clients once
       get_claude_client()  # Pre-warm
       yield
       # Shutdown: cleanup
   ```

2. **Handle Sleep Mode**:
   - First request after sleep takes 10-30 seconds
   - Add loading states in your frontend
   - Consider a "wake-up" ping endpoint

3. **Use Haiku for Cost Efficiency**:
   ```bash
   CLAUDE_MODEL=claude-3-haiku-20240307
   CLAUDE_MAX_TOKENS=512  # Reduce for simple queries
   ```

4. **Monitor Usage**:
   - Railway dashboard shows real-time usage
   - Set up alerts at 80% of budget
   - Logs available in dashboard

5. **Caching**:
   ```python
   from functools import lru_cache

   @lru_cache(maxsize=100)
   def cached_embed(text: str):
       return generate_embedding(text)
   ```

### Preventing Unexpected Costs

```python
# Add rate limiting
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.post("/ask")
@limiter.limit("10/minute")
async def ask(request: Request, ...):
    ...
```

---

## Claude API Integration

### Using the Claude Client

The `claude_client.py` module provides ready-to-use Claude integration:

```python
from claude_client import get_claude_response, is_claude_configured

# Check if configured
if is_claude_configured():
    # Simple usage
    response = get_claude_response(
        query="What is ROS 2?",
        context="ROS 2 is a robotics middleware..."
    )
    print(response)
```

### Switching from OpenRouter to Claude

In your `agent.py`, you can add Claude as an alternative:

```python
from claude_client import get_claude_response, is_claude_configured

def generate_answer(query: str, context: str) -> str:
    """Generate answer using Claude or OpenRouter."""

    # Prefer Claude if configured
    if is_claude_configured():
        return get_claude_response(query, context)

    # Fallback to OpenRouter
    return generate_answer_openrouter(query, context)
```

### Async Usage in FastAPI

```python
from claude_client import get_claude_response_async

@app.post("/ask")
async def ask(request: QueryRequest):
    # Use async version for better performance
    answer = await get_claude_response_async(
        query=request.query,
        context=build_context(results)
    )
    return {"answer": answer}
```

---

## Troubleshooting

### Build Fails

**Error**: `No module named 'xxx'`
- Check `requirements.txt` includes all dependencies
- Verify Python version in `nixpacks.toml`

**Error**: `Port already in use`
- Railway sets `$PORT` automatically
- Ensure start command uses `--port $PORT`

### Runtime Errors

**Error**: `ANTHROPIC_API_KEY not set`
- Verify environment variable in Railway dashboard
- Check spelling: `ANTHROPIC_API_KEY` not `ANTHROPIC_KEY`

**Error**: `Connection refused`
- Service might be sleeping (free plan)
- Wait 10-30 seconds for cold start

### CORS Errors

```python
# Ensure your FRONTEND_URL is in allowed origins
ALLOWED_ORIGINS = [
    os.getenv("FRONTEND_URL", ""),
    "https://salwagull.github.io",
    "http://localhost:3000",
]
```

### Checking Logs

```bash
# Via CLI
railway logs

# Or in dashboard:
# Project → Service → Logs tab
```

---

## Comparison: Railway vs Render

| Feature | Railway | Render |
|---------|---------|--------|
| Free tier | $5 credit/month | 750 hours/month |
| Sleep after | 5 min | 15 min |
| Cold start | 10-30s | 30-60s |
| Custom domains | Yes (free) | Yes (free) |
| GitHub integration | Excellent | Good |
| CLI tool | Yes | Yes |
| Pricing model | Usage-based | Instance-based |

**Recommendation**: Use Railway for development/small projects, Render for stable production.

---

## Quick Reference Commands

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up

# View logs
railway logs

# Open dashboard
railway open

# Set environment variable
railway variables set KEY=value

# Run command in Railway environment
railway run python main.py --ingest
```

---

## Example: Complete Deployment Script

```powershell
# Windows PowerShell deployment script

# 1. Navigate to backend
cd backend

# 2. Test locally first
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn agent:app --reload --port 8000

# 3. Deploy to Railway (after testing)
railway login
railway init
railway variables set JWT_SECRET_KEY=(python -c "import secrets; print(secrets.token_urlsafe(64))")
railway variables set FRONTEND_URL=https://salwagull.github.io/Physical-AI-And-Humanoid-Robotics
railway variables set ANTHROPIC_API_KEY=sk-ant-your-key
railway up

# 4. Get your URL
railway domain
```

---

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Anthropic Docs: https://docs.anthropic.com
- Project Issues: https://github.com/Salwagull/Physical-AI-And-Humanoid-Robotics/issues
