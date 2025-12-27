# Data Model: RAG Agent Backend

**Feature**: 003-rag-agent
**Date**: 2025-12-23

---

## Overview

This feature adds API request/response models for the RAG Agent. It reuses existing data stored in Qdrant (from 001-embedding-pipeline) and does not introduce new persistent storage.

## Existing Data (from 001-embedding-pipeline)

### Qdrant Collection: `rag_embedding`

**Configuration**:
- Vector size: 1024 (Cohere embed-english-v3.0)
- Distance metric: Cosine
- Point count: 309 chunks

**Point Structure**:
```python
{
    "id": "uuid-string",
    "vector": [float, ...],  # 1024 dimensions
    "payload": {
        "text": "chunk text content",
        "url": "https://source-url.com/page",
        "position": 0,  # chunk index within page
        "created_at": "2025-12-23T10:00:00+00:00"
    }
}
```

---

## New Data Structures (API Models)

### QueryRequest

Request body for POST /ask endpoint.

```python
from pydantic import BaseModel, Field

class QueryRequest(BaseModel):
    """User query input for the RAG agent."""

    query: str = Field(
        ...,
        min_length=1,
        max_length=2000,
        description="Natural language question to answer"
    )

    # Optional parameters for advanced usage
    top_k: int = Field(
        default=5,
        ge=1,
        le=20,
        description="Number of chunks to retrieve"
    )
```

**Validation Rules**:
- `query`: Required, 1-2000 characters
- `top_k`: Optional, default 5, range 1-20

---

### ChunkResult

Individual retrieved chunk in the response.

```python
class ChunkResult(BaseModel):
    """A single retrieved chunk with metadata."""

    text: str = Field(description="Content of the retrieved chunk")
    url: str = Field(description="Source URL of the original page")
    score: float = Field(description="Similarity score (0-1)")
```

**Fields**:
- `text`: Chunk content from Qdrant payload
- `url`: Source URL for attribution
- `score`: Cosine similarity score

---

### QueryResponse

Success response from POST /ask endpoint.

```python
from datetime import datetime

class QueryResponse(BaseModel):
    """Successful response with answer and sources."""

    query: str = Field(description="Original user query")
    answer: str = Field(description="AI-generated answer grounded in context")
    sources: list[str] = Field(description="List of source URLs used")
    chunks: list[ChunkResult] = Field(description="Retrieved chunks with scores")
    timestamp: str = Field(description="ISO 8601 timestamp of response")
```

**Fields**:
- `query`: Echo of original query
- `answer`: LLM-generated response
- `sources`: Deduplicated list of URLs from chunks
- `chunks`: Full chunk details with scores
- `timestamp`: Response generation time

---

### ErrorResponse

Error response for failures.

```python
class ErrorResponse(BaseModel):
    """Error response structure."""

    error: str = Field(description="Error type (e.g., ValidationError)")
    detail: str = Field(description="Specific error message")
```

**Error Types**:
- `ValidationError`: Invalid request (HTTP 400)
- `ServiceUnavailable`: Backend service failure (HTTP 503)

---

## Data Flow

```
QueryRequest
    │
    ├─ Validate (Pydantic)
    │
    ▼
Search Query
    │
    ├─ embed(query, "search_query")
    ├─ Qdrant query_points()
    │
    ▼
list[SearchResult] (from main.py)
    │
    ├─ Transform to ChunkResult[]
    ├─ Build context string
    │
    ▼
OpenAI Chat Completion
    │
    ├─ Generate answer
    │
    ▼
QueryResponse
    │
    ├─ JSON serialize
    │
    ▼
HTTP Response
```

---

## Relationships

```
QueryRequest ──────────────────────────────────────→ QueryResponse
     │                                                    │
     │                                                    │
     ▼                                                    ▼
search(query)                                      ChunkResult[]
     │                                                    │
     │                                                    │
     ▼                                                    │
Qdrant Collection ←────────────────────────────────────────┘
(rag_embedding)
```

---

## No Schema Changes Required

This feature is:
- Read-only against existing Qdrant collection
- Does not create new persistent storage
- Uses in-memory Pydantic models only
