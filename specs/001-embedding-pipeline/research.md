# Research: Embedding Pipeline Setup

**Date**: 2025-12-23
**Feature**: 001-embedding-pipeline
**Status**: Complete

## Technology Decisions

### 1. Package Manager: UV

**Decision**: Use UV for Python project initialization and dependency management.

**Rationale**:
- Modern, fast Python package manager (10-100x faster than pip)
- Native lockfile support (`uv.lock`) for reproducible builds
- Simple project initialization with `uv init`
- Built-in virtual environment management

**Alternatives Considered**:
- pip + venv: Slower, no lockfile, manual venv management
- Poetry: Slower, more complex configuration
- PDM: Less adoption, similar features to UV

**Usage**:
```bash
# Initialize project
uv init backend

# Add dependencies
uv add cohere qdrant-client httpx beautifulsoup4 lxml
```

---

### 2. Embedding Provider: Cohere

**Decision**: Use Cohere's `embed-english-v3.0` model (or `embed-multilingual-v3.0` for non-English).

**Rationale**:
- State-of-the-art embedding quality for retrieval tasks
- 1024-dimension output (default) - good balance of quality and storage
- Supports `input_type` parameter for optimal retrieval:
  - `search_document`: For documents being indexed
  - `search_query`: For user queries
- Batch embedding support for efficiency

**Key Parameters**:
- Model: `embed-english-v3.0`
- Dimensions: 1024 (default)
- Input type: `search_document` for indexing
- Max tokens: ~512 per text (chunk accordingly)

**Python Client**:
```python
import cohere

co = cohere.ClientV2(api_key="COHERE_API_KEY")

response = co.embed(
    texts=["text chunk 1", "text chunk 2"],
    model="embed-english-v3.0",
    input_type="search_document",
    embedding_types=["float"]
)
embeddings = response.embeddings.float_
```

**Rate Limits**:
- Trial: 5 calls/min
- Production: 10,000 calls/min (varies by plan)
- Implement exponential backoff for safety

---

### 3. Vector Database: Qdrant

**Decision**: Use Qdrant with local Docker instance or Qdrant Cloud.

**Rationale**:
- Purpose-built for vector similarity search
- Excellent Python client with async support
- Payload filtering for metadata queries
- Simple REST/gRPC API

**Collection Configuration**:
```python
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

client = QdrantClient(url="http://localhost:6333")

# Create collection
client.create_collection(
    collection_name="rag_embedding",
    vectors_config=VectorParams(size=1024, distance=Distance.COSINE)
)

# Upsert with metadata
client.upsert(
    collection_name="rag_embedding",
    points=[
        PointStruct(
            id="chunk_uuid",
            vector=[...],  # 1024-dim embedding
            payload={
                "url": "https://...",
                "text": "chunk text",
                "position": 0
            }
        )
    ]
)
```

**Distance Metric**: COSINE (standard for text embeddings)

---

### 4. Web Scraping: httpx + BeautifulSoup

**Decision**: Use httpx for HTTP requests, BeautifulSoup for HTML parsing.

**Rationale**:
- httpx: Modern async-capable HTTP client, handles redirects
- BeautifulSoup + lxml: Fast, reliable HTML parsing
- Docusaurus-specific: Target `article` or `main` content areas

**Content Extraction Strategy**:
```python
# Docusaurus content selectors (priority order)
CONTENT_SELECTORS = [
    "article.markdown",    # Main content wrapper
    "main article",        # Fallback
    ".theme-doc-markdown", # Docs page
    "main"                 # Last resort
]
```

---

### 5. Text Chunking Strategy

**Decision**: Fixed-size chunking with overlap.

**Parameters**:
- Chunk size: 500 characters (~100-125 tokens)
- Overlap: 50 characters
- Preserve code blocks as single units when possible

**Rationale**:
- Simple, predictable chunk sizes
- Overlap prevents context loss at boundaries
- Fits within Cohere's token limits

---

## Architecture Summary

```
main.py
├── get_all_urls(base_url) → List[str]
│   └── Crawl sitemap or discover links from base URL
├── extract_text_from_url(url) → str
│   └── Fetch HTML, parse with BeautifulSoup, extract main content
├── chunk_text(text, chunk_size=500, overlap=50) → List[str]
│   └── Split text into overlapping chunks
├── embed(chunks) → List[List[float]]
│   └── Call Cohere API to generate embeddings
├── create_collection(name="rag_embedding")
│   └── Initialize Qdrant collection if not exists
├── save_chunk_to_qdrant(chunk, embedding, metadata)
│   └── Upsert single point to Qdrant
└── ingest_book(base_url)
    └── Orchestrate full pipeline: crawl → extract → chunk → embed → store
```

## Dependencies

```toml
[project]
dependencies = [
    "cohere>=5.0.0",
    "qdrant-client>=1.7.0",
    "httpx>=0.25.0",
    "beautifulsoup4>=4.12.0",
    "lxml>=5.0.0",
]
```

## Environment Variables

```
COHERE_API_KEY=your_cohere_api_key
QDRANT_URL=http://localhost:6333  # or Qdrant Cloud URL
QDRANT_API_KEY=optional_for_cloud
```
