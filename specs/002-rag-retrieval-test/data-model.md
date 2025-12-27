# Data Model: RAG Retrieval Testing

**Feature**: 002-rag-retrieval-test
**Date**: 2025-12-23

---

## Overview

This feature does not introduce new data models. It operates on the existing Qdrant collection created by the embedding pipeline.

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

## New Data Structures (Runtime Only)

### SearchResult (dict)

Returned by `search()` function - not persisted.

```python
{
    "text": str,        # Original chunk text from payload
    "url": str,         # Source URL from payload
    "position": int,    # Chunk position from payload
    "score": float,     # Cosine similarity (0-1)
    "created_at": str   # ISO 8601 timestamp from payload
}
```

### SearchResponse (dict)

Returned by `format_results_json()` - JSON output structure.

```python
{
    "query": str,              # Original search query
    "top_k": int,              # Number of results requested
    "collection": str,         # Qdrant collection name
    "results": list[SearchResult],  # List of search results
    "result_count": int,       # Actual number of results
    "timestamp": str           # ISO 8601 timestamp of search
}
```

---

## Data Flow

```
Qdrant Collection (existing)
    │
    ├─ Vector Search
    │
    ▼
ScoredPoint (Qdrant SDK)
    │
    ├─ Transform in search()
    │
    ▼
SearchResult (dict)
    │
    ├─ Format in format_results_json()
    │
    ▼
SearchResponse (JSON string)
```

---

## No Schema Changes Required

This feature is read-only against the existing Qdrant collection:
- No new collections
- No schema modifications
- No new indexes
- No data migrations
