# Deployment Guide

This guide covers deploying the Physical AI & Humanoid Robotics book with its backend services.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        GitHub Pages                              │
│              (Docusaurus Static Site - Frontend)                 │
│         https://salwagull.github.io/Physical-AI-And-...         │
└────────────────────────┬────────────────────────────────────────┘
                         │ API calls
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Render / Railway                              │
│                  (FastAPI Backend)                               │
│              https://physical-ai-backend.onrender.com            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ Auth Service │  │ RAG Chatbot  │  │ Embedding Pipeline   │   │
│  │ (JWT/OAuth)  │  │ (OpenRouter) │  │ (Cohere + Qdrant)    │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
    ┌──────────┐  ┌──────────┐  ┌──────────────┐
    │  Qdrant  │  │  Cohere  │  │  OpenRouter  │
    │  Cloud   │  │   API    │  │     API      │
    └──────────┘  └──────────┘  └──────────────┘
```

## Folder Structure

```
physical-AI-and-Humanoid-Robotics/
├── .github/workflows/deploy.yml   # GitHub Pages deployment
├── backend/                        # FastAPI backend
│   ├── agent.py                   # Main FastAPI app
│   ├── main.py                    # Embedding pipeline
│   ├── routers/auth.py            # Authentication routes
│   ├── requirements.txt           # Python dependencies
│   ├── render.yaml                # Render deployment config
│   ├── Procfile                   # Railway/Heroku config
│   ├── .env.example               # Dev environment template
│   └── .env.production            # Production template
├── docs/                          # Docusaurus content
├── src/                           # React components
│   ├── components/ChatWidget/     # AI chatbot widget
│   ├── components/HeaderAuth/     # Login/signup UI
│   ├── contexts/AuthContext.js    # Auth state management
│   └── theme/Root.js              # App wrapper
├── docusaurus.config.js           # Docusaurus config (apiUrl)
└── package.json                   # Node dependencies
```

---

## Step 1: Deploy Backend to Render (Recommended)

### 1.1 Prerequisites

- Render account: https://render.com (free tier available)
- API keys for:
  - Cohere: https://dashboard.cohere.com/api-keys
  - Qdrant Cloud: https://cloud.qdrant.io/
  - OpenRouter: https://openrouter.ai/keys

### 1.2 Deploy to Render

**Option A: One-Click Deploy (Recommended)**

1. Push your code to GitHub
2. Go to https://render.com/deploy
3. Connect your GitHub repository
4. Render will auto-detect `backend/render.yaml`
5. Configure environment variables (see below)
6. Click "Create Web Service"

**Option B: Manual Setup**

1. Log in to Render Dashboard
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `physical-ai-backend`
   - **Root Directory**: `backend`
   - **Runtime**: Python
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn agent:app --host 0.0.0.0 --port $PORT`

### 1.3 Configure Environment Variables in Render

In the Render dashboard, add these environment variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `JWT_SECRET_KEY` | Yes | Generate: `python -c "import secrets; print(secrets.token_urlsafe(64))"` |
| `FRONTEND_URL` | Yes | `https://salwagull.github.io/Physical-AI-And-Humanoid-Robotics` |
| `COHERE_API_KEY` | Yes | Your Cohere API key |
| `QDRANT_URL` | Yes | Your Qdrant cluster URL |
| `QDRANT_API_KEY` | Yes | Your Qdrant API key |
| `OPENROUTER_API_KEY` | Yes | Your OpenRouter API key |
| `GOOGLE_CLIENT_ID` | No | For Google OAuth (optional) |
| `GOOGLE_CLIENT_SECRET` | No | For Google OAuth (optional) |

### 1.4 Note Your Backend URL

After deployment, Render provides a URL like:
```
https://physical-ai-backend.onrender.com
```

Save this URL for Step 2.

---

## Step 2: Update Frontend with Backend URL

### 2.1 Update docusaurus.config.js

Edit `docusaurus.config.js` and update the `apiUrl`:

```javascript
customFields: {
  apiUrl: 'https://physical-ai-backend.onrender.com',  // Your Render URL
},
```

### 2.2 Update GitHub Workflow

Edit `.github/workflows/deploy.yml`:

```yaml
- name: Build Docusaurus site
  env:
    API_URL: https://physical-ai-backend.onrender.com  # Your Render URL
  run: npm run build
```

### 2.3 Commit and Push

```bash
git add docusaurus.config.js .github/workflows/deploy.yml
git commit -m "Update API URL to production backend"
git push origin 001-robotics-book
```

GitHub Actions will automatically rebuild and deploy the frontend.

---

## Step 3: Verify Deployment

### 3.1 Test Backend Health

```bash
curl https://physical-ai-backend.onrender.com/
# Should return: {"status":"ok"}
```

### 3.2 Test Authentication

```bash
# Signup
curl -X POST https://physical-ai-backend.onrender.com/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","display_name":"Test User"}'

# Login
curl -X POST https://physical-ai-backend.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 3.3 Test Frontend

1. Open https://salwagull.github.io/Physical-AI-And-Humanoid-Robotics/
2. Click "Sign In" in the header
3. Create an account with email/password
4. Open the chat widget (bottom-right corner)
5. Ask a question about the textbook

---

## Alternative: Deploy Backend to Railway

### Railway Deployment

1. Create account at https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Set **Root Directory** to `backend`
5. Railway auto-detects the `Procfile`
6. Add environment variables (same as Render)
7. Deploy!

Railway URL format: `https://your-project.up.railway.app`

---

## Local Development

### Backend (Windows)

```powershell
# Navigate to backend
cd backend

# Create virtual environment
python -m venv .venv
.\.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy and edit environment
copy .env.example .env
notepad .env  # Add your API keys

# Run server
uvicorn agent:app --reload --host 127.0.0.1 --port 8000
```

### Frontend (Windows)

```powershell
# From project root
npm install
npm start

# Opens http://localhost:3000
```

### With uv (faster Python package manager)

```powershell
cd backend
uv sync
uv run uvicorn agent:app --reload --host 127.0.0.1 --port 8000
```

---

## Environment Variables Summary

### Backend (.env)

```bash
# Required
JWT_SECRET_KEY=generate-a-secure-64-char-secret
FRONTEND_URL=https://salwagull.github.io/Physical-AI-And-Humanoid-Robotics
COHERE_API_KEY=your-cohere-key
QDRANT_URL=https://your-cluster.cloud.qdrant.io:6333
QDRANT_API_KEY=your-qdrant-key
OPENROUTER_API_KEY=sk-or-v1-your-key

# Optional
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```

### Frontend (via GitHub Actions)

```yaml
# In .github/workflows/deploy.yml
env:
  API_URL: https://physical-ai-backend.onrender.com
```

---

## Troubleshooting

### CORS Errors

If you see CORS errors in the browser console:
1. Verify `FRONTEND_URL` is set correctly in backend
2. Check that your frontend domain is in `ALLOWED_ORIGINS` in `backend/agent.py`
3. Redeploy the backend after changes

### Auth Not Working

1. Check browser DevTools Network tab for error responses
2. Verify JWT_SECRET_KEY is set in backend
3. Check backend logs in Render/Railway dashboard

### Chatbot Not Responding

1. Verify all RAG API keys are set (Cohere, Qdrant, OpenRouter)
2. Check if Qdrant collection has data (run ingestion pipeline first)
3. Check backend logs for specific errors

### Running the Embedding Pipeline

Before the chatbot works, you need to ingest the book content:

```bash
cd backend
# Activate virtual environment
python main.py --ingest
```

This crawls your GitHub Pages site and stores embeddings in Qdrant.

---

## Quick Reference Commands

```bash
# Clone repository
git clone https://github.com/Salwagull/Physical-AI-And-Humanoid-Robotics.git
cd Physical-AI-And-Humanoid-Robotics

# Install frontend dependencies
npm install

# Build frontend
npm run build

# Start frontend dev server
npm start

# Backend setup (Windows)
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn agent:app --reload --port 8000

# Run embedding ingestion
python main.py --ingest

# Test RAG retrieval
python main.py --search "What is ROS 2?"
```

---

## Security Notes

1. **Never commit `.env` files** - Use `.env.example` as template
2. **Generate secure JWT secrets** for production
3. **Use HTTPS** for all production endpoints
4. **Rotate API keys** periodically
5. **Review CORS settings** before deployment
