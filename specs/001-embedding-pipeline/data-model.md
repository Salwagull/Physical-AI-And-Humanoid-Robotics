# Data Model: Embedding Pipeline

**Feature**: 001-embedding-pipeline
**Date**: 2025-12-23

## Entities

### 1. Page

Represents a single documentation page from the Docusaurus site.

| Field | Type | Description |
|-------|------|-------------|
| url | string | Full URL of the page |
| title | string | Page title extracted from HTML |
| raw_html | string | Original HTML content |
| clean_text | string | Extracted main content text |
| crawled_at | datetime | Timestamp of last crawl |

**Relationships**: One Page → Many TextChunks

---

### 2. TextChunk

A segment of text from a page, sized for embedding.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique identifier (for Qdrant point ID) |
| text | string | The chunk text content |
| position | int | Order index within the page (0-based) |
| source_url | string | URL of the parent page |
| char_count | int | Number of characters in chunk |

**Validation Rules**:
- text must be non-empty
- char_count >= 50 (skip tiny chunks)
- position >= 0

---

### 3. Embedding (Qdrant Point)

Vector representation stored in Qdrant.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Point ID in Qdrant (matches TextChunk.id) |
| vector | float[1024] | Cohere embedding vector |
| payload.text | string | Original chunk text |
| payload.url | string | Source page URL |
| payload.position | int | Chunk position in page |
| payload.created_at | string | ISO timestamp |

**Qdrant Collection Config**:
- Name: `rag_embedding`
- Vector size: 1024
- Distance: Cosine

---

## Data Flow

```
Page (HTML)
    ↓ extract_text_from_url()
Clean Text
    ↓ chunk_text()
TextChunks[]
    ↓ embed()
Embeddings[]
    ↓ save_chunk_to_qdrant()
Qdrant Points (vector + payload)
```

## Qdrant Payload Schema

```json
{
  "text": "The chunk text content...",
  "url": "https://salwagull.github.io/Physical-AI-And-Humanoid-Robotics/docs/chapter-1",
  "position": 0,
  "created_at": "2025-12-23T12:00:00Z"
}
```

## Query Pattern

For RAG retrieval:
```python
results = client.search(
    collection_name="rag_embedding",
    query_vector=query_embedding,  # From embed() with input_type="search_query"
    limit=5,
    with_payload=True
)
# Returns: top 5 chunks with text and source URLs
```
