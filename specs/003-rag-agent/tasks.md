# Tasks: RAG Agent Backend

**Input**: Design documents from `/specs/003-rag-agent/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Manual API testing via curl/httpie (no automated unit tests requested)

**Organization**: Tasks grouped by user story for independent implementation

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Main file: `backend/agent.py` (NEW)

## Path Conventions

- **Backend**: `backend/` at repository root
- **New file**: `backend/agent.py` - FastAPI application
- **Existing**: `backend/main.py` - Reuse search() function
- **Config**: `backend/pyproject.toml`, `backend/.env`

---

## Phase 1: Setup (Dependencies and Configuration)

**Purpose**: Add new dependencies and configure environment for FastAPI + OpenAI

- [x] T001 Add `fastapi` dependency to `backend/pyproject.toml` using `uv add fastapi`
- [x] T002 Add `uvicorn` dependency to `backend/pyproject.toml` using `uv add uvicorn`
- [x] T003 Add `openai` dependency to `backend/pyproject.toml` using `uv add openai`
- [x] T004 Add `OPENAI_API_KEY` placeholder to `backend/.env.example` with documentation comment
- [x] T005 Add `OPENAI_API_KEY` to `backend/.env` with actual API key value

**Checkpoint**: Dependencies installed, environment configured

---

## Phase 2: Foundational (Create Agent File Structure)

**Purpose**: Create the new agent.py file with basic FastAPI app structure

**CRITICAL**: This phase creates the foundation for all user stories

- [x] T006 Create `backend/agent.py` with module docstring and imports (fastapi, pydantic, datetime, os)
- [x] T007 Add import for `search` function from `main` module in `backend/agent.py`
- [x] T008 Add import for OpenAI client in `backend/agent.py`
- [x] T009 Create FastAPI app instance with title and description in `backend/agent.py`
- [x] T010 Add OpenAI client initialization with environment variable in `backend/agent.py`
- [x] T011 Add health check endpoint `GET /` that returns `{"status": "ok"}` in `backend/agent.py`
- [x] T012 Verify server starts with `uv run uvicorn agent:app --reload` in `backend/`

**Checkpoint**: FastAPI server starts and responds to health check

---

## Phase 3: User Story 1 & 4 - Core RAG Endpoint + JSON Format (Priority: P1)

**Goal**: Implement POST /ask endpoint that retrieves context and generates grounded answers

**Independent Test**: Send POST /ask with query and verify JSON response with answer, sources, chunks

### Pydantic Models

- [x] T013 [US1] [US4] Create `QueryRequest` Pydantic model with `query: str` field (min_length=1) in `backend/agent.py`
- [x] T014 [US1] [US4] Create `ChunkResult` Pydantic model with fields: text, url, score in `backend/agent.py`
- [x] T015 [US1] [US4] Create `QueryResponse` Pydantic model with fields: query, answer, sources, chunks, timestamp in `backend/agent.py`
- [x] T016 [US1] [US4] Create `ErrorResponse` Pydantic model with fields: error, detail in `backend/agent.py`

### Context Building

- [x] T017 [US1] Implement `build_context(chunks: list[dict]) -> str` function that formats chunks with numbered sources in `backend/agent.py`

### OpenAI Integration

- [x] T018 [US1] Implement `generate_answer(query: str, context: str) -> str` function skeleton in `backend/agent.py`:
  - Function signature with docstring
  - System prompt for grounded answering
- [x] T019 [US1] Add OpenAI Chat Completions API call in `generate_answer()` with gpt-4o-mini model in `backend/agent.py`
- [x] T020 [US1] Add temperature=0.3 and max_tokens=1000 parameters to OpenAI call in `backend/agent.py`

### Main Endpoint

- [x] T021 [US1] [US4] Implement `POST /ask` endpoint skeleton with `QueryRequest` body in `backend/agent.py`
- [x] T022 [US1] Add call to `search(query)` to retrieve chunks in `/ask` endpoint in `backend/agent.py`
- [x] T023 [US1] Add context building from search results in `/ask` endpoint in `backend/agent.py`
- [x] T024 [US1] Add call to `generate_answer()` with query and context in `/ask` endpoint in `backend/agent.py`
- [x] T025 [US4] Build and return `QueryResponse` with answer, sources (unique URLs), chunks, timestamp in `backend/agent.py`
- [x] T026 [US1] [US4] Test endpoint with curl: `curl -X POST http://localhost:8000/ask -H "Content-Type: application/json" -d '{"query": "What is humanoid robotics?"}'`

**Checkpoint**: US1 & US4 complete - /ask endpoint returns grounded answer with JSON format

---

## Phase 4: User Story 2 - Handle Missing or Invalid Query (Priority: P2)

**Goal**: Add validation and error handling for invalid requests

**Independent Test**: Send empty/missing query and verify HTTP 400 error response

- [x] T027 [US2] Pydantic validation already handles empty query via min_length=1 - verify in `backend/agent.py`
- [x] T028 [US2] Test empty query returns HTTP 422 validation error with curl in `backend/agent.py`
- [x] T029 [US2] Test missing query field returns HTTP 422 validation error with curl in `backend/agent.py`
- [x] T030 [US2] Verify GET /ask returns HTTP 405 Method Not Allowed (FastAPI default) in `backend/agent.py`

**Checkpoint**: US2 complete - Invalid requests return appropriate error codes

---

## Phase 5: User Story 3 - Handle No Matching Results (Priority: P2)

**Goal**: Gracefully handle queries with no relevant results

**Independent Test**: Query for unrelated content and verify informative response

- [x] T031 [US3] Add check in `/ask` endpoint for empty search results in `backend/agent.py`
- [x] T032 [US3] When no results: generate response saying "no relevant information found" without context in `backend/agent.py`
- [x] T033 [US3] Return HTTP 200 with empty sources/chunks and informative answer in `backend/agent.py`
- [x] T034 [US3] Test with unrelated query to verify graceful handling in `backend/agent.py`

**Checkpoint**: US3 complete - No results returns informative message

---

## Phase 6: Error Handling (Service Failures)

**Purpose**: Handle service unavailability (Qdrant, Cohere, OpenAI)

- [x] T035 Add try/except around `search()` call to catch Qdrant/Cohere failures in `backend/agent.py`
- [x] T036 Add try/except around `generate_answer()` to catch OpenAI failures in `backend/agent.py`
- [x] T037 Return HTTP 503 with `ErrorResponse` for service failures in `backend/agent.py`
- [x] T038 Add specific error messages for each service type (vector database, embedding, generation) in `backend/agent.py`

**Checkpoint**: Service failures return HTTP 503 with appropriate error messages

---

## Phase 7: Polish & Documentation

**Purpose**: Add documentation, comments, and final validation

- [x] T039 [P] Add comprehensive docstrings to all functions in `backend/agent.py`
- [x] T040 [P] Add inline comments explaining key logic (context building, OpenAI integration) in `backend/agent.py`
- [x] T041 Add `top_k` optional parameter to `QueryRequest` (default 5, range 1-20) in `backend/agent.py`
- [x] T042 Update `/ask` endpoint to use `request.top_k` in search call in `backend/agent.py`
- [x] T043 Run full validation: valid query, empty query, unrelated query, service error simulation in `backend/agent.py`
- [x] T044 Verify OpenAPI docs at http://localhost:8000/docs show correct schema in `backend/agent.py`

**Checkpoint**: Feature complete - All tests pass, documentation complete

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **User Story 1 & 4 (Phase 3)**: Depends on Foundational - Core functionality
- **User Story 2 (Phase 4)**: Depends on Phase 3 - Validation
- **User Story 3 (Phase 5)**: Depends on Phase 3 - Empty results
- **Error Handling (Phase 6)**: Depends on Phase 3 - Service failures
- **Polish (Phase 7)**: Depends on all phases

### User Story Dependencies

```
Setup → Foundational → US1 & US4 (Core + JSON)
                            ↓
                      US2 (Validation)
                            ↓
                      US3 (No Results)
                            ↓
                      Error Handling
                            ↓
                         Polish
```

### Parallel Opportunities

Due to single-file design, most tasks are sequential. Only Polish phase has parallel tasks:

```bash
# Phase 7 only - can run in parallel:
Task: "Add docstrings" (T039)
Task: "Add inline comments" (T040)
```

---

## Implementation Strategy

### MVP First (User Story 1 + 4)

1. Complete Phase 1: Setup dependencies
2. Complete Phase 2: Create agent.py structure
3. Complete Phase 3: Core /ask endpoint with JSON response
4. **VALIDATE**: Test with curl to verify grounded answers

### Full Feature (All User Stories)

1. Complete Phase 4: User Story 2 (Validation)
2. Complete Phase 5: User Story 3 (No Results)
3. Complete Phase 6: Error Handling
4. Complete Phase 7: Polish
5. **FINAL VALIDATION**: Test all scenarios

---

## Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| Phase 1: Setup | T001-T005 (5) | Dependencies and config |
| Phase 2: Foundational | T006-T012 (7) | FastAPI app structure |
| Phase 3: US1 & US4 | T013-T026 (14) | Core endpoint + JSON |
| Phase 4: US2 | T027-T030 (4) | Validation handling |
| Phase 5: US3 | T031-T034 (4) | No results handling |
| Phase 6: Error Handling | T035-T038 (4) | Service failures |
| Phase 7: Polish | T039-T044 (6) | Docs and validation |
| **Total** | **44 tasks** | |

### Tasks per User Story

- US1 (Core RAG): 12 tasks
- US2 (Validation): 4 tasks
- US3 (No Results): 4 tasks
- US4 (JSON Format): 6 tasks (shared with US1)
- Setup/Foundational/Error/Polish: 22 tasks

### MVP Scope

**Minimum viable**: Complete through Phase 3 (US1 & US4) = 26 tasks
- POST /ask endpoint working
- Returns grounded answers with JSON format

**Full feature**: Complete all 44 tasks
- Error handling for all scenarios
- Complete documentation

---

## Testing Commands

```bash
# Start server
cd backend
uv run uvicorn agent:app --reload --host 0.0.0.0 --port 8000

# Test valid query
curl -X POST http://localhost:8000/ask \
  -H "Content-Type: application/json" \
  -d '{"query": "What is humanoid robotics?"}'

# Test empty query (should return 422)
curl -X POST http://localhost:8000/ask \
  -H "Content-Type: application/json" \
  -d '{"query": ""}'

# Test missing query (should return 422)
curl -X POST http://localhost:8000/ask \
  -H "Content-Type: application/json" \
  -d '{}'

# Test wrong method (should return 405)
curl http://localhost:8000/ask

# Test unrelated query
curl -X POST http://localhost:8000/ask \
  -H "Content-Type: application/json" \
  -d '{"query": "What is quantum entanglement?"}'
```

---

## Notes

- New file `backend/agent.py` keeps FastAPI separate from CLI pipeline
- Reuses `search()` function from `main.py` for retrieval
- No automated tests - manual validation via curl
- Each checkpoint allows validation before proceeding
- Commit after each phase completion
