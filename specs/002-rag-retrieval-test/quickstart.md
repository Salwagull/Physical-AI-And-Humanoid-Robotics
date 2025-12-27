# Quickstart: RAG Retrieval Testing

**Feature**: 002-rag-retrieval-test
**Date**: 2025-12-23

---

## Prerequisites

1. **Completed embedding pipeline** (001-embedding-pipeline)
   - `rag_embedding` collection exists in Qdrant
   - 309 chunks stored from book content

2. **Environment configured** (`.env` file in `backend/`)
   - COHERE_API_KEY
   - QDRANT_URL
   - QDRANT_API_KEY

---

## Usage

### Basic Search

```bash
cd backend
uv run python main.py --search "What is humanoid robotics?"
```

**Expected Output** (JSON):
```json
{
  "query": "What is humanoid robotics?",
  "top_k": 5,
  "collection": "rag_embedding",
  "results": [
    {
      "text": "Humanoid robotics is the field of...",
      "url": "https://salwagull.github.io/.../intro",
      "position": 0,
      "score": 0.92,
      "created_at": "2025-12-23T10:00:00Z"
    }
  ],
  "result_count": 5,
  "timestamp": "2025-12-23T12:00:00Z"
}
```

### Custom Top-K

```bash
uv run python main.py --search "sensors in robots" --top-k 10
```

### Compact JSON Output

```bash
uv run python main.py --search "reinforcement learning" --compact
```

### Run Validation Tests

```bash
uv run python main.py --test
```

**Expected Output**:
```
Running RAG retrieval tests...

Test 1: "What is humanoid robotics?"
  ✓ Returned 5 results
  ✓ Top score: 0.89 (above threshold 0.5)

Test 2: "How do robots learn to walk?"
  ✓ Returned 5 results
  ✓ Top score: 0.84 (above threshold 0.5)

...

SUMMARY: 5/5 tests passed
```

---

## Function Reference

### search(query, top_k=5)

Search for semantically similar chunks.

```python
from main import search

results = search("What is humanoid robotics?", top_k=5)
for r in results:
    print(f"Score: {r['score']:.2f} - {r['url']}")
```

### format_results_json(query, results, pretty=True)

Format results as JSON.

```python
from main import search, format_results_json

results = search("sensors")
json_output = format_results_json("sensors", results, pretty=True)
print(json_output)
```

### run_retrieval_tests()

Run validation suite.

```python
from main import run_retrieval_tests

success = run_retrieval_tests()
# Returns True if all tests pass
```

---

## Troubleshooting

### "Collection not found" Error

Run the ingestion pipeline first:
```bash
uv run python main.py  # Runs ingest_book() by default
```

### Low Similarity Scores

- Verify query is relevant to robotics content
- Try more specific queries
- Check Cohere API key is valid

### Empty Results

- Verify collection has points: Check Qdrant dashboard
- Verify search query is not empty
- Try broader search terms
