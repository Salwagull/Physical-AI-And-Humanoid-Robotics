# Tasks: Embedding Pipeline Setup

**Input**: Design documents from `/specs/001-embedding-pipeline/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md

**Tests**: Manual verification via Qdrant dashboard (no automated tests requested)

**Organization**: Tasks grouped by user story for independent implementation

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- All code in single file: `backend/main.py`

## Path Conventions

- **Backend**: `backend/` at repository root
- **Single file**: `backend/main.py` contains all functions
- **Config**: `backend/.env`, `backend/.env.example`, `backend/pyproject.toml`

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Create backend project with UV and install dependencies

- [x] T001 Create `backend/` directory at repository root
- [x] T002 Initialize UV project with `uv init` in `backend/`
- [x] T003 Add dependencies with UV: cohere, qdrant-client, httpx, beautifulsoup4, lxml, python-dotenv in `backend/`
- [x] T004 Create `backend/.env.example` with COHERE_API_KEY, QDRANT_URL, QDRANT_API_KEY placeholders
- [x] T005 Create `backend/.gitignore` to exclude .env, .venv/, __pycache__/
- [x] T006 Create skeleton `backend/main.py` with imports and empty function signatures for all 7 functions

**Checkpoint**: Project structure ready, dependencies installed, can run `uv run python main.py` without errors

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Environment loading and client initialization that ALL user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Implement environment loading with python-dotenv at top of `backend/main.py`
- [x] T008 Add Cohere client initialization (lazy or global) in `backend/main.py`
- [x] T009 Add Qdrant client initialization (lazy or global) in `backend/main.py`
- [x] T010 Add constants for CONTENT_SELECTORS, CHUNK_SIZE, OVERLAP, COLLECTION_NAME in `backend/main.py`

**Checkpoint**: Foundation ready - clients can connect, environment loaded, constants defined

---

## Phase 3: User Story 1 - Crawl and Extract Text (Priority: P1)

**Goal**: Extract all textual content from deployed Docusaurus site for RAG processing

**Independent Test**: Run `get_all_urls()` and `extract_text_from_url()` against https://salwagull.github.io/Physical-AI-And-Humanoid-Robotics/ and verify clean text is returned and printed

### Implementation for User Story 1

- [x] T011 [US1] Implement `get_all_urls(base_url: str) -> list[str]` in `backend/main.py`:
  - Fetch sitemap.xml from `{base_url}/sitemap.xml`
  - Parse XML to extract all `<loc>` URLs
  - Filter to include only doc pages (exclude images, assets)
  - Handle sitemap fetch errors gracefully
- [x] T012 [US1] Implement `extract_text_from_url(url: str) -> str` in `backend/main.py`:
  - HTTP GET with httpx (timeout=30s, follow_redirects=True)
  - Parse HTML with BeautifulSoup and lxml
  - Target selectors: `article.markdown`, `main article`, `.theme-doc-markdown`, `main`
  - Remove script/style/nav tags
  - Extract and normalize whitespace in text
  - Return empty string on error (log warning)
- [x] T013 [US1] Implement `chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]` in `backend/main.py`:
  - If text length <= chunk_size, return as single-item list
  - Otherwise, slide window with overlap
  - Skip chunks with < 50 characters
  - Return list of text chunks
- [x] T014 [US1] Add standalone test block at bottom of `backend/main.py` to test US1 functions:
  - Call `get_all_urls()` with base URL
  - Print count of URLs found
  - Call `extract_text_from_url()` on first URL
  - Print extracted text length
  - Call `chunk_text()` on extracted text
  - Print chunk count

**Checkpoint**: User Story 1 complete - can crawl site, extract text, and chunk it. Run `uv run python main.py` to verify.

---

## Phase 4: User Story 2 - Generate Embeddings with Cohere (Priority: P2)

**Goal**: Convert text chunks into 1024-dimensional vector embeddings using Cohere API

**Independent Test**: Pass sample text chunks to `embed()` and verify embeddings are returned with correct dimensions (1024)

### Implementation for User Story 2

- [x] T015 [US2] Implement `embed(chunks: list[str]) -> list[list[float]]` in `backend/main.py`:
  - Initialize Cohere client with API key from env
  - Call `co.embed()` with model="embed-english-v3.0", input_type="search_document"
  - Handle empty chunks list (return empty list)
  - Implement basic retry with exponential backoff for rate limiting
  - Return list of 1024-dim embedding vectors
- [x] T016 [US2] Add error handling for Cohere API failures in `embed()`:
  - Catch rate limit errors (429) and retry after delay
  - Log errors and skip failed chunks
  - Continue processing remaining chunks
- [x] T017 [US2] Update test block in `backend/main.py` to test US2:
  - Take chunks from US1 test
  - Call `embed()` with first 3 chunks
  - Print embedding count and vector dimensions
  - Verify dimensions are 1024

**Checkpoint**: User Story 2 complete - can generate embeddings from text chunks. US1 + US2 work together.

---

## Phase 5: User Story 3 - Store Embeddings in Qdrant (Priority: P3)

**Goal**: Store embeddings with metadata in Qdrant for RAG retrieval

**Independent Test**: Create collection, upsert sample embeddings, verify points exist in Qdrant dashboard at http://localhost:6333/dashboard

### Implementation for User Story 3

- [x] T018 [US3] Implement `create_collection(name: str = "rag_embedding") -> None` in `backend/main.py`:
  - Check if collection exists using client.collection_exists()
  - If not, create with VectorParams(size=1024, distance=Distance.COSINE)
  - Log collection status (created or already exists)
- [x] T019 [US3] Implement `save_chunk_to_qdrant(chunk: str, embedding: list[float], url: str, position: int) -> None` in `backend/main.py`:
  - Generate UUID for point ID using uuid.uuid4()
  - Create PointStruct with vector and payload (text, url, position, created_at)
  - Upsert to collection
  - Log success or error
- [x] T020 [US3] Update test block in `backend/main.py` to test US3:
  - Call `create_collection()`
  - Take embeddings from US2 test
  - Call `save_chunk_to_qdrant()` for each embedding
  - Print confirmation message
  - Include instruction to verify in Qdrant dashboard

**Checkpoint**: User Story 3 complete - can create collection and store embeddings. US1 + US2 + US3 work together.

---

## Phase 6: User Story 4 - End-to-End Pipeline (Priority: P4)

**Goal**: Orchestrate complete pipeline with single function call

**Independent Test**: Run `ingest_book()` with base URL and verify all pages processed, embeddings stored in Qdrant

### Implementation for User Story 4

- [x] T021 [US4] Implement `ingest_book(base_url: str) -> None` in `backend/main.py`:
  - Call `create_collection()` to ensure collection exists
  - Call `get_all_urls(base_url)` to discover pages
  - Print page count
  - Loop through each URL:
    - Print current URL being processed
    - Call `extract_text_from_url(url)`
    - Skip if empty text
    - Call `chunk_text(text)`
    - Call `embed(chunks)`
    - Loop and call `save_chunk_to_qdrant()` for each
    - Track total chunks processed
  - Print completion summary (pages, chunks)
- [x] T022 [US4] Add progress feedback in `ingest_book()`:
  - Print "Processing X of Y: {url}" for each page
  - Print chunk count per page
  - Print running total
- [x] T023 [US4] Update `if __name__ == "__main__"` block in `backend/main.py`:
  - Set BASE_URL = "https://salwagull.github.io/Physical-AI-And-Humanoid-Robotics/"
  - Call `ingest_book(BASE_URL)`
  - Remove test code from earlier phases (or keep commented)

**Checkpoint**: User Story 4 complete - full pipeline runs end-to-end with single command.

---

## Phase 7: Polish & Final Validation

**Purpose**: Final cleanup and validation

- [x] T024 [P] Add inline comments explaining each function in `backend/main.py`
- [x] T025 [P] Add docstrings with parameter descriptions to all functions in `backend/main.py`
- [x] T026 Validate against quickstart.md - run full pipeline and verify:
  - All pages discovered from sitemap
  - Text extracted and chunked
  - Embeddings generated
  - Points visible in Qdrant dashboard
- [x] T027 Update `backend/.env.example` with any additional configuration discovered

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational
- **User Story 2 (Phase 4)**: Depends on User Story 1 (needs chunks to embed)
- **User Story 3 (Phase 5)**: Depends on User Story 2 (needs embeddings to store)
- **User Story 4 (Phase 6)**: Depends on all previous user stories
- **Polish (Phase 7)**: Depends on User Story 4

### User Story Dependencies

```
Setup → Foundational → US1 (Crawl) → US2 (Embed) → US3 (Store) → US4 (Pipeline)
                                                                      ↓
                                                                   Polish
```

**Note**: Due to single-file architecture and sequential data flow, user stories are NOT parallelizable. Each depends on the previous.

### Within Each Phase

- Tasks without [P] marker must be done sequentially
- Tasks with [P] marker can run in parallel (T024, T025 in Polish phase)

---

## Parallel Opportunities

Due to single-file design and sequential data flow (crawl → chunk → embed → store), parallelization is limited:

```bash
# Phase 7 only - can run in parallel:
Task: "Add inline comments" (T024)
Task: "Add docstrings" (T025)
```

All other tasks are sequential within the single `backend/main.py` file.

---

## Implementation Strategy

### MVP First (User Stories 1-3)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (Crawl/Extract)
4. **VALIDATE**: Run and verify URLs discovered, text extracted
5. Complete Phase 4: User Story 2 (Embed)
6. **VALIDATE**: Verify embeddings generated with 1024 dimensions
7. Complete Phase 5: User Story 3 (Store)
8. **VALIDATE**: Check Qdrant dashboard for stored points

### Full Pipeline (User Story 4)

1. Complete Phase 6: User Story 4
2. **VALIDATE**: Run `ingest_book()` end-to-end
3. Complete Phase 7: Polish
4. **FINAL VALIDATION**: Full quickstart.md walkthrough

---

## Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| Phase 1: Setup | T001-T006 (6) | Project initialization |
| Phase 2: Foundation | T007-T010 (4) | Environment and clients |
| Phase 3: US1 | T011-T014 (4) | Crawl and extract |
| Phase 4: US2 | T015-T017 (3) | Generate embeddings |
| Phase 5: US3 | T018-T020 (3) | Store in Qdrant |
| Phase 6: US4 | T021-T023 (3) | Pipeline orchestration |
| Phase 7: Polish | T024-T027 (4) | Final validation |
| **Total** | **27 tasks** | |

### Tasks per User Story

- US1 (Crawl/Extract): 4 tasks
- US2 (Embed): 3 tasks
- US3 (Store): 3 tasks
- US4 (Pipeline): 3 tasks
- Setup/Foundation/Polish: 14 tasks

### MVP Scope

**Minimum viable**: Complete through Phase 5 (US3) = 20 tasks
- Can manually call individual functions to process content
- Embeddings stored and searchable in Qdrant

**Full feature**: Complete all 27 tasks
- Single `ingest_book()` call runs entire pipeline

---

## Notes

- All code in single file `backend/main.py` as specified
- No automated tests - manual verification via Qdrant dashboard
- Each checkpoint allows validation before proceeding
- Commit after each phase completion
- Target URL: https://salwagull.github.io/Physical-AI-And-Humanoid-Robotics/
- Sitemap: https://salwagull.github.io/Physical-AI-And-Humanoid-Robotics/sitemap.xml
