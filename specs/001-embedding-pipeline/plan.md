# Implementation Plan: Embedding Pipeline Setup

**Branch**: `001-embedding-pipeline` | **Date**: 2025-12-23 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-embedding-pipeline/spec.md`

## Summary

Build a single-file Python pipeline (`main.py`) that:
1. Crawls the deployed Docusaurus site at https://salwagull.github.io/Physical-AI-And-Humanoid-Robotics/
2. Extracts and cleans text content from each page
3. Chunks text into embedding-sized segments
4. Generates embeddings using Cohere's API
5. Stores embeddings with metadata in Qdrant vector database

**Key Constraint**: All functionality in ONE file (`main.py`) with these functions:
- `get_all_urls(base_url)` - Discover all documentation pages
- `extract_text_from_url(url)` - Fetch and clean page content
- `chunk_text(text)` - Split into embedding-sized chunks
- `embed(chunks)` - Generate Cohere embeddings
- `create_collection(name)` - Initialize Qdrant collection
- `save_chunk_to_qdrant(...)` - Upsert embeddings
- `ingest_book(base_url)` - Main orchestration function

## Technical Context

**Language/Version**: Python 3.11+
**Primary Dependencies**: cohere, qdrant-client, httpx, beautifulsoup4, lxml
**Package Manager**: UV
**Storage**: Qdrant (local Docker or cloud)
**Testing**: Manual verification via Qdrant dashboard
**Target Platform**: Local development / server deployment
**Performance Goals**: Process all pages in under 5 minutes
**Constraints**: Single file implementation, respect Cohere rate limits
**Scale/Scope**: ~15-50 documentation pages, ~100-500 text chunks

## Constitution Check

*GATE: Verified against `.specify/memory/constitution.md`*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Beginner-First Accessibility | PASS | Single-file design with clear function names |
| II. Spec-Driven Technical Accuracy | PASS | Using current best practices (UV, Cohere v3, Qdrant) |
| III. Consistent Structure | PASS | Clear function signatures, consistent patterns |
| IV. Actionable Examples | PASS | Complete runnable code with inline comments |
| V. Modular, Maintainable | PASS | Each function is self-contained and testable |

**Gate Status**: PASS - No violations

## Project Structure

### Documentation (this feature)

```text
specs/001-embedding-pipeline/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Technology decisions
├── data-model.md        # Entity definitions
├── quickstart.md        # Setup guide
└── checklists/
    └── requirements.md  # Quality checklist
```

### Source Code (repository root)

```text
backend/
├── pyproject.toml       # UV project config
├── uv.lock              # Dependency lockfile
├── .python-version      # Python version pin
├── .env                 # Environment variables (not committed)
├── .env.example         # Template for env vars
└── main.py              # ALL pipeline code (single file)
```

**Structure Decision**: Single-project layout with all code in `main.py` as explicitly requested. No src/ directory needed for this simple pipeline.

## Implementation Details

### Function Specifications

#### 1. `get_all_urls(base_url: str) -> list[str]`

**Purpose**: Discover all documentation page URLs from the Docusaurus site.

**Approach**:
1. Fetch sitemap.xml from `{base_url}/sitemap.xml`
2. Parse XML to extract all `<loc>` URLs
3. Filter to only include docs pages (exclude static assets, images, etc.)
4. Fallback: If sitemap unavailable, parse homepage and follow internal links

**Sitemap URL**: https://salwagull.github.io/Physical-AI-And-Humanoid-Robotics/sitemap.xml

**Returns**: List of absolute URLs to process

---

#### 2. `extract_text_from_url(url: str) -> str`

**Purpose**: Fetch a page and extract clean text content.

**Approach**:
1. HTTP GET with httpx (handle redirects, timeouts)
2. Parse HTML with BeautifulSoup
3. Target selectors: `article.markdown`, `main article`, `.theme-doc-markdown`
4. Remove script/style tags, navigation elements
5. Extract text with whitespace normalization

**Returns**: Clean text string (empty string on error)

---

#### 3. `chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]`

**Purpose**: Split text into overlapping chunks for embedding.

**Approach**:
1. If text length <= chunk_size, return as single chunk
2. Otherwise, slide window with overlap
3. Try to break at sentence/paragraph boundaries when possible

**Returns**: List of text chunks

---

#### 4. `embed(chunks: list[str]) -> list[list[float]]`

**Purpose**: Generate Cohere embeddings for text chunks.

**Approach**:
1. Initialize Cohere client with API key from env
2. Call embed endpoint with:
   - model: `embed-english-v3.0`
   - input_type: `search_document`
   - embedding_types: `["float"]`
3. Handle rate limiting with exponential backoff

**Returns**: List of 1024-dimensional embedding vectors

---

#### 5. `create_collection(name: str = "rag_embedding") -> None`

**Purpose**: Create or verify Qdrant collection exists.

**Approach**:
1. Check if collection exists
2. If not, create with:
   - Vector size: 1024
   - Distance: Cosine
3. Log collection status

---

#### 6. `save_chunk_to_qdrant(chunk: str, embedding: list[float], url: str, position: int) -> None`

**Purpose**: Upsert a single embedding with metadata to Qdrant.

**Approach**:
1. Generate UUID for point ID
2. Create PointStruct with vector and payload
3. Upsert to collection
4. Log success/failure

**Payload Schema**:
```python
{
    "text": chunk,
    "url": url,
    "position": position,
    "created_at": datetime.utcnow().isoformat()
}
```

---

#### 7. `ingest_book(base_url: str) -> None`

**Purpose**: Main orchestration function - run the full pipeline.

**Flow**:
```python
def ingest_book(base_url: str) -> None:
    # 1. Ensure collection exists
    create_collection("rag_embedding")

    # 2. Discover all pages
    urls = get_all_urls(base_url)
    print(f"Found {len(urls)} pages")

    # 3. Process each page
    total_chunks = 0
    for url in urls:
        print(f"Processing: {url}")

        # Extract text
        text = extract_text_from_url(url)
        if not text:
            continue

        # Chunk text
        chunks = chunk_text(text)

        # Generate embeddings
        embeddings = embed(chunks)

        # Store in Qdrant
        for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
            save_chunk_to_qdrant(chunk, embedding, url, position=i)
            total_chunks += 1

    print(f"Complete! Ingested {len(urls)} pages, {total_chunks} chunks")
```

---

## Environment Configuration

### .env.example

```
COHERE_API_KEY=your_cohere_api_key_here
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=optional_for_cloud
```

### pyproject.toml

```toml
[project]
name = "embedding-pipeline"
version = "0.1.0"
description = "RAG embedding pipeline for Docusaurus documentation"
requires-python = ">=3.11"
dependencies = [
    "cohere>=5.0.0",
    "qdrant-client>=1.7.0",
    "httpx>=0.25.0",
    "beautifulsoup4>=4.12.0",
    "lxml>=5.0.0",
    "python-dotenv>=1.0.0",
]
```

## Target URL

**Base URL**: https://salwagull.github.io/Physical-AI-And-Humanoid-Robotics/

**SiteMap URL**: https://salwagull.github.io/Physical-AI-And-Humanoid-Robotics/sitemap.xml

This is the deployed Docusaurus site for the Physical AI and Humanoid Robotics book. The sitemap provides a complete list of all pages for efficient crawling.

## Complexity Tracking

No violations requiring justification. Single-file design keeps complexity minimal.

## Next Steps

Run `/sp.tasks` to generate the implementation task list from this plan.
