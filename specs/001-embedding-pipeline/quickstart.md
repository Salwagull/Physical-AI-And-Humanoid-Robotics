# Quickstart: Embedding Pipeline

## Prerequisites

1. **Python 3.11+** installed
2. **UV package manager** installed:
   ```powershell
   # Windows PowerShell
   powershell -ExecutionPolicy Bypass -c "irm https://astral.sh/uv/install.ps1 | iex"
   ```
3. **Cohere API Key**: Get from https://dashboard.cohere.com/api-keys
4. **Qdrant** running locally or cloud instance

## Setup

### 1. Start Qdrant (Docker)

```bash
docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant
```

Or use Qdrant Cloud: https://cloud.qdrant.io/

### 2. Initialize Backend Project

```bash
cd physical-AI-and-Humanoid-Robotics
mkdir backend
cd backend
uv init
uv add cohere qdrant-client httpx beautifulsoup4 lxml
```

### 3. Configure Environment

Create `.env` in `backend/`:
```
COHERE_API_KEY=your_cohere_api_key
QDRANT_URL=http://localhost:6333
```

### 4. Run the Pipeline

```bash
cd backend
uv run python main.py
```

## Expected Output

```
Fetching URLs from https://salwagull.github.io/Physical-AI-And-Humanoid-Robotics/...
Found 15 pages
Processing: /docs/intro
  Extracted 2500 characters
  Created 5 chunks
  Generated embeddings
  Saved to Qdrant
...
Complete! Ingested 15 pages, 75 chunks total.
```

## Verify in Qdrant

Open http://localhost:6333/dashboard and check:
- Collection `rag_embedding` exists
- Points contain vectors and payloads

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Cohere rate limit | Add retry with backoff; check API quota |
| Qdrant connection refused | Ensure Docker is running; check port 6333 |
| Empty text extraction | Verify Docusaurus site structure; check selectors |
