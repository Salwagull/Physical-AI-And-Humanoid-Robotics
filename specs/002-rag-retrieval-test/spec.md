# Specification: RAG Retrieval Testing

**Feature**: 002-rag-retrieval-test
**Status**: Draft
**Created**: 2025-12-23
**Branch**: 002-rag-retrieval-test

---

## Overview

Implement retrieval functionality and comprehensive testing for the RAG embedding pipeline. This feature validates that vectors stored in Qdrant can be accurately retrieved using semantic search, with proper metadata and formatted JSON output.

## Problem Statement

The embedding pipeline (001-embedding-pipeline) successfully ingests content into Qdrant, but there is no way to:
1. Query the stored vectors for semantic similarity search
2. Verify the stored embeddings return accurate top-k matches
3. Validate that metadata (URL, position) is correctly preserved
4. Get clean JSON output for integration with downstream systems

## Goals

- Implement semantic search retrieval against Qdrant collection
- Validate retrieval accuracy against stored embeddings
- Verify metadata integrity in returned results
- Provide JSON-formatted output for RAG pipeline integration

## Non-Goals

- LLM integration (answer generation from retrieved context)
- Web UI for search
- Advanced query parsing or filtering
- Performance benchmarking at scale

---

## User Stories

### US1: Query and Retrieve Top-K Matches (Priority: P1)

**As a** developer testing the RAG pipeline
**I want to** query Qdrant with a text input and receive top-k similar chunks
**So that** I can verify semantic search works correctly

**Acceptance Criteria**:
- [ ] Accept natural language query as input
- [ ] Generate query embedding using Cohere (same model as ingestion)
- [ ] Search Qdrant collection with configurable top-k (default: 5)
- [ ] Return list of matching chunks with similarity scores
- [ ] Handle empty results gracefully

**Technical Notes**:
- Use `input_type="search_query"` for Cohere (different from `search_document` used in ingestion)
- Similarity scores should be between 0 and 1 (Cosine distance)

---

### US2: Validate Retrieved Chunk Content (Priority: P2)

**As a** developer testing the RAG pipeline
**I want to** verify that retrieved chunks contain relevant text
**So that** I can confirm embedding quality and retrieval accuracy

**Acceptance Criteria**:
- [ ] Each result includes the original text chunk
- [ ] Text matches what was stored during ingestion
- [ ] Results are ordered by similarity score (descending)
- [ ] Similarity score threshold is configurable (optional filter)

---

### US3: Verify Metadata Integrity (Priority: P2)

**As a** developer testing the RAG pipeline
**I want to** verify that metadata is correctly returned with each chunk
**So that** I can trace results back to source documents

**Acceptance Criteria**:
- [ ] Each result includes source URL
- [ ] Each result includes chunk position within page
- [ ] Each result includes creation timestamp
- [ ] Metadata matches stored payload in Qdrant

---

### US4: JSON Output Format (Priority: P1)

**As a** developer integrating the RAG pipeline
**I want to** receive search results in clean JSON format
**So that** I can easily parse and use results in downstream systems

**Acceptance Criteria**:
- [ ] Output is valid JSON
- [ ] Schema includes: query, results array, metadata
- [ ] Each result contains: text, url, position, score, created_at
- [ ] Supports both pretty-print and compact JSON options
- [ ] Can write output to file or stdout

**Example Output**:
```json
{
  "query": "What is humanoid robotics?",
  "top_k": 5,
  "collection": "rag_embedding",
  "results": [
    {
      "text": "Humanoid robotics is the field of...",
      "url": "https://example.com/docs/intro",
      "position": 0,
      "score": 0.92,
      "created_at": "2025-12-23T10:00:00Z"
    }
  ],
  "result_count": 5,
  "timestamp": "2025-12-23T12:00:00Z"
}
```

---

### US5: End-to-End Pipeline Test (Priority: P3)

**As a** developer validating the complete RAG system
**I want to** run an end-to-end test with sample queries
**So that** I can verify the full pipeline works correctly

**Acceptance Criteria**:
- [ ] Test with 3-5 predefined sample queries
- [ ] Verify each query returns non-empty results
- [ ] Verify similarity scores are above minimum threshold (0.5)
- [ ] Print summary report with pass/fail status
- [ ] Return exit code 0 for success, 1 for failure

**Sample Test Queries**:
1. "What is humanoid robotics?"
2. "How do robots learn to walk?"
3. "What sensors are used in robots?"
4. "How does physical AI work?"
5. "What is reinforcement learning in robotics?"

---

## Technical Requirements

### Dependencies

- Existing: cohere, qdrant-client, python-dotenv (from 001-embedding-pipeline)
- No new dependencies required

### Implementation Approach

- Add new functions to existing `backend/main.py`
- Maintain single-file architecture
- Reuse existing client initialization (lazy loading)

### New Functions

1. `search(query: str, top_k: int = 5) -> list[dict]`
   - Generate query embedding
   - Search Qdrant collection
   - Return list of results with metadata

2. `format_results_json(query: str, results: list[dict], pretty: bool = True) -> str`
   - Format results as JSON string
   - Include query metadata and timestamp

3. `run_retrieval_tests() -> bool`
   - Execute predefined test queries
   - Validate results
   - Return success/failure

### Configuration

- `TOP_K_DEFAULT = 5` - Default number of results
- `MIN_SCORE_THRESHOLD = 0.5` - Minimum similarity for valid result (testing only)

---

## Constraints

1. **Single File**: All code remains in `backend/main.py`
2. **Existing Collection**: Use `rag_embedding` collection from previous ingestion
3. **Same Model**: Use `embed-english-v3.0` for query embeddings (consistency)
4. **No Breaking Changes**: Existing pipeline functions must remain unchanged

---

## Success Metrics

1. **Retrieval Accuracy**: All test queries return relevant results (score > 0.5)
2. **Metadata Integrity**: 100% of returned chunks have complete metadata
3. **JSON Validity**: All output passes JSON schema validation
4. **End-to-End**: 5/5 sample queries pass validation

---

## Out of Scope

- Filtering by metadata fields
- Pagination for large result sets
- Query caching
- Rate limiting for search API
- Answer generation with LLM

---

## Dependencies

- Requires completed 001-embedding-pipeline
- Requires Qdrant collection with stored embeddings (309 chunks from previous ingestion)
- Requires valid Cohere and Qdrant API credentials

---

## Risks

| Risk | Mitigation |
|------|------------|
| Empty collection | Check collection exists and has points before search |
| API rate limiting | Reuse exponential backoff from embed function |
| Low similarity scores | Validate embedding model consistency |

---

## Revision History

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2025-12-23 | 1.0 | Agent | Initial specification |
