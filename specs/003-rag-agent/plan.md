# Implementation Plan: RAG Agent Backend

**Branch**: `003-rag-agent` | **Date**: 2025-12-23 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-rag-agent/spec.md`

## Summary

Build a FastAPI-based RAG Agent that exposes a `/ask` endpoint. The agent accepts user queries, retrieves relevant context from Qdrant using Cohere embeddings (reusing existing infrastructure from 002-rag-retrieval-test), and generates grounded responses using OpenAI's Agents SDK. Response format includes answer, sources, and matched chunks.

## Technical Context

**Language/Version**: Python 3.11+ (matches existing backend)
**Primary Dependencies**: FastAPI, uvicorn, openai-agents-sdk, cohere, qdrant-client (extend existing)
**Storage**: Qdrant Cloud (existing collection: `rag_embedding`, 309 chunks)
**Testing**: Manual API testing via curl/httpie; pytest for unit tests if needed
**Target Platform**: Windows/Linux server (local development)
**Project Type**: Backend API service (extends existing backend/)
**Performance Goals**: Response time < 15 seconds per query
**Constraints**: No frontend, no deployment scripts, no auth
**Scale/Scope**: Single endpoint, 10 concurrent users

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status |
|-----------|-------------|--------|
| I. Beginner-First | Code with clear comments | PASS - API code will be well-documented |
| II. Technical Accuracy | Code tested and runnable | PASS - Manual API testing planned |
| III. Consistent Structure | Follows existing patterns | PASS - Extends backend/main.py patterns |
| IV. Actionable Examples | Complete, runnable code | PASS - Full API endpoint implementation |
| V. Modular Content | Self-contained additions | PASS - New file, reuses existing functions |

**Gate Status**: PASS - All principles satisfied

## Project Structure

### Documentation (this feature)

```text
specs/003-rag-agent/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/sp.tasks command)
```

### Source Code (repository root)

```text
backend/
├── main.py              # Existing - embedding pipeline + retrieval functions
├── agent.py             # NEW - FastAPI app with /ask endpoint + OpenAI Agent
├── pyproject.toml       # Update - add FastAPI, uvicorn, openai deps
├── .env                 # Existing - add OPENAI_API_KEY
└── .env.example         # Update - document OPENAI_API_KEY
```

**Structure Decision**: Extend existing backend/ with new agent.py file. Reuse functions from main.py (search, embed). Keep FastAPI separate from CLI pipeline.

## Complexity Tracking

No violations - feature fits within existing architecture.

---

## Implementation Design

### API Endpoint

**POST /ask**

Request:
```json
{
  "query": "What is humanoid robotics?"
}
```

Success Response (HTTP 200):
```json
{
  "query": "What is humanoid robotics?",
  "answer": "Humanoid robotics is the field of...",
  "sources": [
    "https://salwagull.github.io/.../glossary",
    "https://salwagull.github.io/.../intro"
  ],
  "chunks": [
    {
      "text": "A robot designed with a human-like body...",
      "url": "https://...",
      "score": 0.55
    }
  ],
  "timestamp": "2025-12-23T12:00:00Z"
}
```

Error Response (HTTP 400/503):
```json
{
  "error": "ValidationError",
  "detail": "Query is required"
}
```

### Component Flow

```
POST /ask
    ↓
FastAPI endpoint
    ↓
Validate query (non-empty)
    ↓
search(query, top_k=5) [from main.py]
    ↓
Build context from chunks
    ↓
OpenAI Agent with context
    ↓
Format response JSON
    ↓
Return response
```

### OpenAI Agents SDK Integration

```python
from openai import OpenAI

client = OpenAI()

def generate_answer(query: str, context: str) -> str:
    """Generate grounded answer using OpenAI."""
    system_prompt = """You are a helpful assistant answering questions about
    Physical AI and Humanoid Robotics. Use ONLY the provided context to answer.
    If the context doesn't contain relevant information, say so clearly.
    Always cite which source your answer comes from."""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {query}"}
        ],
        temperature=0.3,
    )
    return response.choices[0].message.content
```

### Error Handling

| Error Type | HTTP Code | Response |
|------------|-----------|----------|
| Missing/empty query | 400 | `{"error": "ValidationError", "detail": "Query is required"}` |
| Qdrant unavailable | 503 | `{"error": "ServiceUnavailable", "detail": "Vector database unavailable"}` |
| Cohere API failure | 503 | `{"error": "ServiceUnavailable", "detail": "Embedding service unavailable"}` |
| OpenAI API failure | 503 | `{"error": "ServiceUnavailable", "detail": "Generation service unavailable"}` |
| No results found | 200 | Normal response with informative message |

---

## Dependencies

### New Dependencies (add to pyproject.toml)

```toml
[project.dependencies]
fastapi = ">=0.109.0"
uvicorn = ">=0.27.0"
openai = ">=1.0.0"
# Existing: cohere, qdrant-client, httpx, beautifulsoup4, lxml, python-dotenv
```

### Environment Variables

```bash
# Existing
COHERE_API_KEY=...
QDRANT_URL=...
QDRANT_API_KEY=...

# New
OPENAI_API_KEY=...  # Required for agent
```

### Internal Dependencies

Reuse from `backend/main.py`:
- `search(query, top_k)` - Qdrant retrieval
- `embed(chunks, input_type)` - Cohere embeddings (used internally by search)
- `get_qdrant_client()` - Client initialization
- `get_cohere_client()` - Client initialization
- Constants: `COLLECTION_NAME`, `TOP_K_DEFAULT`, `MIN_SCORE_THRESHOLD`

---

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| OpenAI API latency | Medium | Medium | Set 15s timeout, use gpt-4o-mini |
| Rate limiting | Low | Medium | Reuse existing exponential backoff |
| Context too long | Low | Medium | Limit to top-k chunks, truncate if needed |
| Import issues | Low | Low | Structure imports carefully |
