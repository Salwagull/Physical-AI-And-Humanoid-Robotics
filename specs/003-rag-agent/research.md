# Research: RAG Agent Backend

**Feature**: 003-rag-agent
**Date**: 2025-12-23
**Status**: Complete

---

## Research Tasks

### 1. FastAPI for RAG Endpoints

**Question**: What is the best approach for building a RAG API endpoint with FastAPI?

**Decision**: Use FastAPI with Pydantic models for request/response validation

**Rationale**: FastAPI provides:
- Automatic OpenAPI documentation
- Pydantic-based request/response validation
- Async support for concurrent requests
- Built-in error handling with HTTPException
- Easy integration with existing Python code

**Implementation Pattern**:
```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

class QueryRequest(BaseModel):
    query: str = Field(..., min_length=1, description="User's question")

class QueryResponse(BaseModel):
    query: str
    answer: str
    sources: list[str]
    chunks: list[dict]
    timestamp: str

app = FastAPI()

@app.post("/ask", response_model=QueryResponse)
async def ask(request: QueryRequest):
    # Process query
    pass
```

**Alternatives Considered**:
- Flask (rejected - less async support, no built-in validation)
- Django REST Framework (rejected - too heavy for single endpoint)
- Starlette (rejected - FastAPI provides better DX)

---

### 2. OpenAI SDK for Grounded Response Generation

**Question**: How to use OpenAI SDK to generate responses grounded in retrieved context?

**Decision**: Use `openai` Python SDK with Chat Completions API and explicit context injection

**Rationale**:
- Chat Completions API is the recommended approach for RAG
- System prompt establishes grounding rules
- User message includes context + question
- Temperature 0.3 for more deterministic responses

**Implementation Pattern**:
```python
from openai import OpenAI

client = OpenAI()  # Uses OPENAI_API_KEY env var

def generate_answer(query: str, context: str) -> str:
    response = client.chat.completions.create(
        model="gpt-4o-mini",  # Fast, cost-effective
        messages=[
            {
                "role": "system",
                "content": "Answer based ONLY on the provided context. Cite sources."
            },
            {
                "role": "user",
                "content": f"Context:\n{context}\n\nQuestion: {query}"
            }
        ],
        temperature=0.3,
        max_tokens=1000,
    )
    return response.choices[0].message.content
```

**Model Selection**: gpt-4o-mini
- Faster than gpt-4
- Lower cost
- Sufficient quality for RAG with good context
- Supports 128k context window

**Alternatives Considered**:
- OpenAI Assistants API (rejected - overkill for simple RAG)
- Agents SDK (rejected - Chat Completions is simpler for this use case)
- Claude API (rejected - spec mentions OpenAI)

---

### 3. Reusing Existing Retrieval Functions

**Question**: How to import and reuse functions from main.py in agent.py?

**Decision**: Direct import from main module

**Rationale**:
- main.py already has all retrieval logic
- No need to duplicate code
- Functions are designed to be reusable

**Import Pattern**:
```python
# In agent.py
from main import search, TOP_K_DEFAULT, COLLECTION_NAME
```

**Functions to Reuse**:
- `search(query, top_k)` - Returns list of {text, url, position, score, created_at}
- `embed(chunks, input_type)` - Used internally by search
- Constants: `TOP_K_DEFAULT`, `MIN_SCORE_THRESHOLD`, `COLLECTION_NAME`

---

### 4. Context Building for LLM

**Question**: How to format retrieved chunks as context for the LLM?

**Decision**: Numbered chunks with source URLs

**Rationale**:
- Clear structure for LLM to reference
- Source attribution enabled by including URLs
- Truncate if needed to fit context window

**Context Format**:
```
[1] Source: https://...
Content: Humanoid robotics is the field of...

[2] Source: https://...
Content: Robots learn to walk through...
```

**Implementation**:
```python
def build_context(chunks: list[dict]) -> str:
    context_parts = []
    for i, chunk in enumerate(chunks, 1):
        context_parts.append(
            f"[{i}] Source: {chunk['url']}\n"
            f"Content: {chunk['text']}\n"
        )
    return "\n".join(context_parts)
```

---

### 5. Error Handling Strategy

**Question**: How to handle different failure modes in the RAG pipeline?

**Decision**: Specific HTTPException for each failure type

**Implementation**:
```python
from fastapi import HTTPException

# Query validation
if not request.query.strip():
    raise HTTPException(status_code=400, detail="Query is required")

# Service failures
try:
    results = search(query)
except Exception as e:
    if "qdrant" in str(e).lower():
        raise HTTPException(status_code=503, detail="Vector database unavailable")
    if "cohere" in str(e).lower():
        raise HTTPException(status_code=503, detail="Embedding service unavailable")
    raise HTTPException(status_code=503, detail="Service unavailable")

# OpenAI failure
try:
    answer = generate_answer(query, context)
except Exception:
    raise HTTPException(status_code=503, detail="Generation service unavailable")
```

---

### 6. Running the FastAPI Server

**Question**: How to run the FastAPI server for development?

**Decision**: Use uvicorn with auto-reload

**Command**:
```bash
cd backend
uv run uvicorn agent:app --reload --host 0.0.0.0 --port 8000
```

**Testing**:
```bash
# Using curl
curl -X POST http://localhost:8000/ask \
  -H "Content-Type: application/json" \
  -d '{"query": "What is humanoid robotics?"}'

# Using httpie
http POST localhost:8000/ask query="What is humanoid robotics?"
```

---

## Resolved Clarifications

All technical questions have been resolved. No NEEDS CLARIFICATION items remain.

| Item | Resolution |
|------|------------|
| API Framework | FastAPI with Pydantic |
| LLM Integration | OpenAI Chat Completions API |
| Model Choice | gpt-4o-mini |
| Code Reuse | Import from main.py |
| Context Format | Numbered chunks with sources |
| Error Handling | HTTPException with specific codes |
| Server | uvicorn with --reload |

---

## Summary

The RAG Agent will be a simple FastAPI application that:
1. Receives queries via POST /ask
2. Uses existing `search()` function for retrieval
3. Formats chunks as numbered context
4. Calls OpenAI gpt-4o-mini for grounded response
5. Returns structured JSON with answer, sources, chunks
