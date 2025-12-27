# Research: RAG Retrieval Testing

**Feature**: 002-rag-retrieval-test
**Date**: 2025-12-23
**Status**: Complete

---

## Research Tasks

### 1. Cohere Embed API - Query vs Document Embeddings

**Question**: How does Cohere's embed API differentiate between document and query embeddings?

**Decision**: Use `input_type="search_query"` for query embeddings

**Rationale**: Cohere's embed-english-v3.0 model is trained to optimize retrieval when:
- Documents are embedded with `input_type="search_document"`
- Queries are embedded with `input_type="search_query"`

The model applies different internal transformations based on the input type to maximize cosine similarity between relevant query-document pairs.

**Alternatives Considered**:
- Using `search_document` for both (rejected - reduces retrieval quality)
- Using a separate query model (rejected - unnecessary complexity)

**Source**: Cohere Embed API documentation

---

### 2. Qdrant Search API

**Question**: What is the correct method to search vectors in Qdrant?

**Decision**: Use `client.search()` with `query_vector` parameter

**Rationale**: Qdrant's Python client provides a simple search interface:
```python
results = client.search(
    collection_name="rag_embedding",
    query_vector=embedding,
    limit=5
)
```

Returns `ScoredPoint` objects containing:
- `id`: Point UUID
- `score`: Similarity score (0-1 for cosine)
- `payload`: Stored metadata dict

**Alternatives Considered**:
- Using `client.query()` (rejected - `search()` is simpler for basic retrieval)
- Using `client.search_batch()` (rejected - unnecessary for single query)

**Source**: Qdrant Python client documentation

---

### 3. Modifying Existing embed() Function

**Question**: Should we modify the existing `embed()` function or create a new one for queries?

**Decision**: Modify existing `embed()` to accept optional `input_type` parameter

**Rationale**:
- Maintains single function for all embedding operations
- Defaults to `search_document` for backward compatibility
- Allows `search_query` for retrieval use cases
- Minimizes code duplication

**New Signature**:
```python
def embed(
    chunks: list[str],
    input_type: str = "search_document"
) -> list[list[float]]:
```

**Alternatives Considered**:
- Creating separate `embed_query()` function (rejected - violates DRY)
- Hardcoding input_type in search function (rejected - less flexible)

---

### 4. JSON Serialization in Python

**Question**: What's the best approach for JSON serialization with optional pretty-printing?

**Decision**: Use `json.dumps()` with `indent` parameter

**Rationale**: Python's built-in json module handles:
- Pretty-printing via `indent=2`
- Compact output via `indent=None`
- Unicode handling
- ISO 8601 timestamps (strings, not datetime objects)

**Implementation**:
```python
import json

def format_results_json(query, results, pretty=True):
    output = {
        "query": query,
        "results": results,
        # ... other fields
    }
    return json.dumps(output, indent=2 if pretty else None)
```

**Alternatives Considered**:
- Using `orjson` (rejected - no need for new dependency)
- Using `pydantic` models (rejected - overkill for simple schema)

---

### 5. Exit Codes for Test Function

**Question**: How should the test function signal success/failure to the shell?

**Decision**: Use `sys.exit()` with code 0 (success) or 1 (failure)

**Rationale**: Standard Unix convention:
- Exit code 0: All tests passed
- Exit code 1: One or more tests failed

Allows CI/CD integration and scripting.

**Implementation**:
```python
import sys

def run_retrieval_tests() -> bool:
    success = True
    # ... run tests ...
    if not success:
        sys.exit(1)
    return True

# In __main__:
if args.test:
    run_retrieval_tests()
    sys.exit(0)
```

---

### 6. Score Threshold for Validation

**Question**: What's an appropriate minimum similarity threshold for valid results?

**Decision**: Use 0.5 as default threshold for testing

**Rationale**:
- Cosine similarity ranges from -1 to 1 (0 to 1 for normalized vectors)
- Score > 0.5 indicates meaningful semantic similarity
- Score < 0.5 suggests weak or no relevance
- Threshold is configurable for different use cases

**Alternatives Considered**:
- Using 0.7 (rejected - too strict for exploratory queries)
- Using 0.3 (rejected - too permissive, includes noise)
- No threshold (rejected - can't validate quality)

---

## Resolved Clarifications

All technical questions have been resolved. No NEEDS CLARIFICATION items remain.

| Item | Resolution |
|------|------------|
| Query embedding type | `search_query` |
| Qdrant search method | `client.search()` |
| Function modification | Add `input_type` param to existing `embed()` |
| JSON library | Built-in `json` module |
| Exit codes | 0 for success, 1 for failure |
| Score threshold | 0.5 default |

---

## Summary

This feature requires minimal research as it builds directly on the existing embedding pipeline. The key insight is using `input_type="search_query"` for query embeddings to optimize retrieval quality with Cohere's embed-english-v3.0 model.
