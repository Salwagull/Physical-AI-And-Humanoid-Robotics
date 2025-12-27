# Quickstart: RAG Agent Backend

**Feature**: 003-rag-agent
**Date**: 2025-12-23

---

## Prerequisites

1. **Completed previous pipelines**:
   - 001-embedding-pipeline: `rag_embedding` collection exists in Qdrant
   - 002-rag-retrieval-test: `search()` function available in main.py

2. **Environment configured** (`.env` file in `backend/`):
   ```bash
   COHERE_API_KEY=...      # Existing
   QDRANT_URL=...          # Existing
   QDRANT_API_KEY=...      # Existing
   OPENAI_API_KEY=...      # NEW - Required for agent
   ```

3. **Dependencies installed**:
   ```bash
   cd backend
   uv add fastapi uvicorn openai
   ```

---

## Running the Server

### Start the API Server

```bash
cd backend
uv run uvicorn agent:app --reload --host 0.0.0.0 --port 8000
```

**Output**:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345]
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### Access API Documentation

Open in browser: http://localhost:8000/docs

This shows the interactive Swagger UI with:
- POST /ask endpoint
- Request/response schemas
- Try it out functionality

---

## API Usage

### Basic Query

```bash
# Using curl
curl -X POST http://localhost:8000/ask \
  -H "Content-Type: application/json" \
  -d '{"query": "What is humanoid robotics?"}'

# Using httpie
http POST localhost:8000/ask query="What is humanoid robotics?"
```

### Expected Response

```json
{
  "query": "What is humanoid robotics?",
  "answer": "Based on the provided context, humanoid robotics refers to the field of robotics focused on designing and building robots with a human-like body structure, including a head, torso, arms, and legs. This human-like form enables more natural interaction with human environments and tools. [Source: glossary]\n\nKey aspects include:\n- Human-like body structure for natural movement\n- Ability to navigate human environments\n- Use of standard human tools and interfaces",
  "sources": [
    "https://salwagull.github.io/Physical-AI-And-Humanoid-Robotics/glossary"
  ],
  "chunks": [
    {
      "text": "A robot designed with a human-like body (head, torso, arms, legs). Enables us...",
      "url": "https://salwagull.github.io/Physical-AI-And-Humanoid-Robotics/glossary",
      "score": 0.55
    }
  ],
  "timestamp": "2025-12-23T14:30:00.000000+00:00"
}
```

### Custom Top-K

```bash
curl -X POST http://localhost:8000/ask \
  -H "Content-Type: application/json" \
  -d '{"query": "How do robots learn?", "top_k": 10}'
```

---

## Error Handling

### Missing Query

```bash
curl -X POST http://localhost:8000/ask \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response** (HTTP 422):
```json
{
  "detail": [
    {
      "type": "missing",
      "loc": ["body", "query"],
      "msg": "Field required"
    }
  ]
}
```

### Empty Query

```bash
curl -X POST http://localhost:8000/ask \
  -H "Content-Type: application/json" \
  -d '{"query": ""}'
```

**Response** (HTTP 422):
```json
{
  "detail": [
    {
      "type": "string_too_short",
      "loc": ["body", "query"],
      "msg": "String should have at least 1 character"
    }
  ]
}
```

### Service Unavailable

If Qdrant, Cohere, or OpenAI is unavailable:

**Response** (HTTP 503):
```json
{
  "error": "ServiceUnavailable",
  "detail": "Vector database unavailable"
}
```

---

## Code Examples

### Python Client

```python
import requests

def ask_question(query: str, top_k: int = 5) -> dict:
    """Send a question to the RAG agent."""
    response = requests.post(
        "http://localhost:8000/ask",
        json={"query": query, "top_k": top_k}
    )
    response.raise_for_status()
    return response.json()

# Example usage
result = ask_question("What is reinforcement learning in robotics?")
print(f"Answer: {result['answer']}")
print(f"Sources: {result['sources']}")
```

### JavaScript/TypeScript

```javascript
async function askQuestion(query) {
  const response = await fetch('http://localhost:8000/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

// Example usage
const result = await askQuestion('What sensors are used in robots?');
console.log(result.answer);
```

---

## Troubleshooting

### "Module not found: main"

Ensure you're running from the `backend/` directory:
```bash
cd backend
uv run uvicorn agent:app --reload
```

### "OPENAI_API_KEY not set"

Add to `.env` file:
```bash
OPENAI_API_KEY=sk-...
```

### Slow Responses

- Check OpenAI API status
- Reduce top_k to minimize context size
- Verify Qdrant connection is stable

### No Results Found

- Verify Qdrant collection has data: Check dashboard
- Try a more relevant query related to robotics
- Check similarity threshold (default 0.5)
