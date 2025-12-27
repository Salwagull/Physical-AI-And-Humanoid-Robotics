# Implementation Plan: RAG Retrieval Testing

**Branch**: `002-rag-retrieval-test` | **Date**: 2025-12-23 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-rag-retrieval-test/spec.md`

## Summary

Extend the existing embedding pipeline with retrieval and testing capabilities. Add 3 new functions (`search`, `format_results_json`, `run_retrieval_tests`) to `backend/main.py` for querying Qdrant, formatting JSON output, and validating the complete RAG pipeline.

## Technical Context

**Language/Version**: Python 3.11+ (matches 001-embedding-pipeline)
**Primary Dependencies**: cohere, qdrant-client, python-dotenv (existing - no new deps)
**Storage**: Qdrant Cloud (existing collection: `rag_embedding`, 309 chunks)
**Testing**: Manual validation via test function + exit codes
**Target Platform**: Windows/Linux CLI
**Project Type**: Single file extension (backend/main.py)
**Performance Goals**: Query response < 2s for top-5 retrieval
**Constraints**: Single file architecture; no breaking changes to existing functions
**Scale/Scope**: 309 stored chunks; 5 test queries

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status |
|-----------|-------------|--------|
| I. Beginner-First | Code examples clear with comments | PASS - extends existing patterns |
| II. Technical Accuracy | Code tested and runnable | PASS - will validate with test queries |
| III. Consistent Structure | Follows existing patterns | PASS - same style as main.py |
| IV. Actionable Examples | Complete, runnable code | PASS - test function included |
| V. Modular Content | Self-contained additions | PASS - 3 new functions only |

**Gate Status**: PASS - All principles satisfied

## Project Structure

### Documentation (this feature)

```text
specs/002-rag-retrieval-test/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/sp.tasks command)
```

### Source Code (repository root)

```text
backend/
├── main.py              # Existing file - ADD 3 new functions
├── pyproject.toml       # No changes needed
├── .env                 # Existing credentials
└── .env.example         # No changes needed
```

**Structure Decision**: Single file extension - add functions to existing `backend/main.py`. No new files or directories required for source code.

## Complexity Tracking

No violations - feature fits within existing architecture.

---

## Implementation Design

### Function Signatures

```python
# New constants
TOP_K_DEFAULT = 5
MIN_SCORE_THRESHOLD = 0.5

# New functions
def search(query: str, top_k: int = TOP_K_DEFAULT) -> list[dict]:
    """
    Search Qdrant collection for semantically similar chunks.

    Args:
        query: Natural language search query
        top_k: Number of results to return (default: 5)

    Returns:
        List of dicts with keys: text, url, position, score, created_at
    """

def format_results_json(
    query: str,
    results: list[dict],
    pretty: bool = True
) -> str:
    """
    Format search results as JSON string.

    Args:
        query: Original search query
        results: List of result dicts from search()
        pretty: Whether to pretty-print JSON (default: True)

    Returns:
        JSON string with query metadata and results
    """

def run_retrieval_tests() -> bool:
    """
    Execute predefined test queries and validate results.

    Returns:
        True if all tests pass, False otherwise
    """
```

### Data Flow

```
User Query (str)
    ↓
search()
    ├─ embed([query]) with input_type="search_query"
    ├─ qdrant.search(collection, vector, limit=top_k)
    └─ Transform ScoredPoints to list[dict]
    ↓
format_results_json()
    ├─ Add query metadata
    ├─ Add timestamp
    └─ json.dumps(indent=2 if pretty else None)
    ↓
JSON Output (str)
```

### Qdrant Search Integration

```python
# Search uses existing client
client = get_qdrant_client()

# Query vector
query_embedding = embed([query])[0]  # Reuse existing embed function

# Qdrant search call
results = client.search(
    collection_name=COLLECTION_NAME,
    query_vector=query_embedding,
    limit=top_k,
)

# Results are ScoredPoint objects:
# - id: str
# - score: float (0-1 for cosine)
# - payload: dict with text, url, position, created_at
```

### JSON Output Schema

```json
{
  "query": "string",
  "top_k": "integer",
  "collection": "string",
  "results": [
    {
      "text": "string",
      "url": "string",
      "position": "integer",
      "score": "float",
      "created_at": "string (ISO 8601)"
    }
  ],
  "result_count": "integer",
  "timestamp": "string (ISO 8601)"
}
```

### Test Queries and Validation

| Query | Expected Behavior |
|-------|-------------------|
| "What is humanoid robotics?" | Results about humanoid robots |
| "How do robots learn to walk?" | Results about locomotion |
| "What sensors are used in robots?" | Results about sensors |
| "How does physical AI work?" | Results about physical AI |
| "What is reinforcement learning in robotics?" | Results about RL |

**Validation Criteria**:
- Results non-empty
- All scores > MIN_SCORE_THRESHOLD (0.5)
- All results have complete metadata

---

## Cohere Query Embedding Note

**Critical**: When generating embeddings for search queries (not documents), use:

```python
response = client.embed(
    texts=[query],
    model="embed-english-v3.0",
    input_type="search_query",  # NOT "search_document"
    embedding_types=["float"],
)
```

The `input_type` parameter matters for retrieval quality:
- `search_document`: Used when embedding content to store
- `search_query`: Used when embedding queries for retrieval

---

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Empty collection | Low | High | Check collection exists before search |
| No matching results | Medium | Medium | Lower threshold or expand test queries |
| API rate limiting | Low | Medium | Reuse exponential backoff from embed() |
| Inconsistent embeddings | Low | High | Use same model for query and document |

---

## Dependencies

### External Services
- Cohere API (embed-english-v3.0)
- Qdrant Cloud (existing collection)

### Internal Dependencies
- `backend/main.py` existing functions:
  - `get_cohere_client()`
  - `get_qdrant_client()`
  - `embed()` - modify to support input_type parameter

### Required Credentials (existing in .env)
- COHERE_API_KEY
- QDRANT_URL
- QDRANT_API_KEY
