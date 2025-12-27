# Tasks: RAG Retrieval Testing

**Input**: Design documents from `/specs/002-rag-retrieval-test/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Manual verification via test function (no automated unit tests requested)

**Organization**: Tasks grouped by user story for independent implementation

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4, US5)
- All code in single file: `backend/main.py`

## Path Conventions

- **Backend**: `backend/` at repository root
- **Single file**: `backend/main.py` contains all functions
- **No new files**: Only modify existing `backend/main.py`

---

## Phase 1: Setup (Constants and Imports)

**Purpose**: Add new imports and constants needed for retrieval functionality

- [x] T001 Add `json` import to existing imports section in `backend/main.py`
- [x] T002 Add `sys` import for exit codes in `backend/main.py`
- [x] T003 Add `TOP_K_DEFAULT = 5` constant in `backend/main.py` configuration section
- [x] T004 Add `MIN_SCORE_THRESHOLD = 0.5` constant in `backend/main.py` configuration section
- [x] T005 Add `TEST_QUERIES` list with 5 sample queries in `backend/main.py` configuration section

**Checkpoint**: New constants and imports added, existing code unchanged

---

## Phase 2: Foundational (Modify Existing Function)

**Purpose**: Update existing `embed()` function to support query embeddings

**CRITICAL**: This modification is required before user story implementation

- [x] T006 Modify `embed()` function signature to add `input_type: str = "search_document"` parameter in `backend/main.py`
- [x] T007 Update `embed()` function body to pass `input_type` to Cohere API call in `backend/main.py`
- [x] T008 Verify existing `ingest_book()` pipeline still works after modification (backward compatibility)

**Checkpoint**: `embed()` function updated, existing pipeline unaffected

---

## Phase 3: User Story 1 - Query and Retrieve Top-K Matches (Priority: P1)

**Goal**: Search Qdrant collection with natural language query and return top-k results

**Independent Test**: Run `search("What is humanoid robotics?")` and verify results returned with scores

### Implementation for User Story 1

- [x] T009 [US1] Implement `search(query: str, top_k: int = TOP_K_DEFAULT) -> list[dict]` function skeleton in `backend/main.py`:
  - Function signature with docstring
  - Empty results list initialization
- [x] T010 [US1] Add query embedding generation in `search()` using `embed([query], input_type="search_query")` in `backend/main.py`
- [x] T011 [US1] Add Qdrant search call in `search()` using `client.search(collection_name, query_vector, limit=top_k)` in `backend/main.py`
- [x] T012 [US1] Add result transformation in `search()` to convert ScoredPoints to list[dict] with keys: text, url, position, score, created_at in `backend/main.py`
- [x] T013 [US1] Add empty results handling in `search()` - return empty list gracefully in `backend/main.py`
- [x] T014 [US1] Add error handling in `search()` for API failures with try/except in `backend/main.py`

**Checkpoint**: US1 complete - `search()` returns results from Qdrant. Run `search("What is humanoid robotics?")` to verify.

---

## Phase 4: User Story 2 & 3 - Validate Content and Metadata (Priority: P2)

**Goal**: Ensure results contain correct text content and complete metadata

**Note**: US2 and US3 are satisfied by the `search()` implementation - metadata and content are already included in results

**Independent Test**: Verify each result dict has all required keys: text, url, position, score, created_at

### Implementation for User Story 2 & 3

- [x] T015 [US2] Verify `search()` results include `text` field with chunk content in `backend/main.py`
- [x] T016 [US2] Verify results are sorted by score descending (Qdrant default) in `backend/main.py`
- [x] T017 [US3] Verify `search()` results include `url` field from payload in `backend/main.py`
- [x] T018 [US3] Verify `search()` results include `position` field from payload in `backend/main.py`
- [x] T019 [US3] Verify `search()` results include `created_at` field from payload in `backend/main.py`

**Checkpoint**: US2 & US3 complete - Results contain all required fields. Verify by printing a search result.

---

## Phase 5: User Story 4 - JSON Output Format (Priority: P1)

**Goal**: Format search results as clean JSON for downstream integration

**Independent Test**: Run `format_results_json("test", results)` and verify valid JSON output

### Implementation for User Story 4

- [x] T020 [US4] Implement `format_results_json(query: str, results: list[dict], pretty: bool = True) -> str` function skeleton in `backend/main.py`:
  - Function signature with docstring
  - Output dict initialization
- [x] T021 [US4] Add query and metadata fields to output dict in `format_results_json()`: query, top_k, collection in `backend/main.py`
- [x] T022 [US4] Add results array to output dict in `format_results_json()` in `backend/main.py`
- [x] T023 [US4] Add result_count and timestamp fields to output dict in `format_results_json()` in `backend/main.py`
- [x] T024 [US4] Add JSON serialization with `json.dumps(output, indent=2 if pretty else None)` in `backend/main.py`
- [x] T025 [US4] Add standalone test in main block to verify JSON output format in `backend/main.py`

**Checkpoint**: US4 complete - JSON output is valid and matches schema. Run format_results_json() to verify.

---

## Phase 6: User Story 5 - End-to-End Pipeline Test (Priority: P3)

**Goal**: Run predefined test queries and validate complete pipeline

**Independent Test**: Run `run_retrieval_tests()` and verify 5/5 tests pass

### Implementation for User Story 5

- [x] T026 [US5] Implement `run_retrieval_tests() -> bool` function skeleton in `backend/main.py`:
  - Function signature with docstring
  - Success flag initialization
- [x] T027 [US5] Add loop through TEST_QUERIES list in `run_retrieval_tests()` in `backend/main.py`
- [x] T028 [US5] Add result validation for each query in `run_retrieval_tests()`: non-empty results, score > threshold in `backend/main.py`
- [x] T029 [US5] Add per-query status printing in `run_retrieval_tests()` (checkmark or X) in `backend/main.py`
- [x] T030 [US5] Add summary report at end of `run_retrieval_tests()` (X/5 tests passed) in `backend/main.py`
- [x] T031 [US5] Add sys.exit(0) for success, sys.exit(1) for failure after tests in `backend/main.py`

**Checkpoint**: US5 complete - Test suite runs and reports results. Run run_retrieval_tests() to verify.

---

## Phase 7: Polish & CLI Integration

**Purpose**: Add CLI argument handling and final documentation

- [x] T032 [P] Add argument parsing to `if __name__ == "__main__"` block for --search, --top-k, --test flags in `backend/main.py`
- [x] T033 [P] Add --compact flag support for non-pretty JSON output in `backend/main.py`
- [x] T034 Add docstrings to all new functions with parameter descriptions in `backend/main.py`
- [x] T035 Add inline comments explaining key logic in new functions in `backend/main.py`
- [x] T036 Run full validation: search query, JSON output, test suite all working in `backend/main.py`

**Checkpoint**: Feature complete - CLI works with all flags, tests pass.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational
- **User Story 2 & 3 (Phase 4)**: Depends on User Story 1 (verifies search results)
- **User Story 4 (Phase 5)**: Depends on User Story 1 (needs results to format)
- **User Story 5 (Phase 6)**: Depends on User Stories 1 & 4 (needs search + JSON)
- **Polish (Phase 7)**: Depends on all user stories

### User Story Dependencies

```
Setup → Foundational → US1 (Search) → US2/US3 (Validation)
                          ↓                    ↓
                       US4 (JSON) ←────────────┘
                          ↓
                       US5 (Tests)
                          ↓
                       Polish
```

### Within Each Phase

- Tasks without [P] marker must be done sequentially
- Tasks with [P] marker can run in parallel (only in Polish phase)

---

## Parallel Opportunities

Due to single-file design and sequential data flow, parallelization is limited:

```bash
# Phase 7 only - can run in parallel:
Task: "Add argument parsing" (T032)
Task: "Add --compact flag" (T033)
```

All other tasks are sequential within the single `backend/main.py` file.

---

## Implementation Strategy

### MVP First (User Story 1 + 4)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (Search)
4. **VALIDATE**: Run `search()` and verify results
5. Complete Phase 5: User Story 4 (JSON)
6. **VALIDATE**: Run `format_results_json()` and verify output

### Full Feature (All User Stories)

1. Complete Phase 4: User Story 2 & 3 (Validation)
2. Complete Phase 6: User Story 5 (Tests)
3. Complete Phase 7: Polish
4. **FINAL VALIDATION**: Run full test suite

---

## Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| Phase 1: Setup | T001-T005 (5) | Constants and imports |
| Phase 2: Foundational | T006-T008 (3) | Modify embed() function |
| Phase 3: US1 | T009-T014 (6) | Search implementation |
| Phase 4: US2/US3 | T015-T019 (5) | Result validation |
| Phase 5: US4 | T020-T025 (6) | JSON output |
| Phase 6: US5 | T026-T031 (6) | Test suite |
| Phase 7: Polish | T032-T036 (5) | CLI and docs |
| **Total** | **36 tasks** | |

### Tasks per User Story

- US1 (Search): 6 tasks
- US2 (Content): 2 tasks
- US3 (Metadata): 3 tasks
- US4 (JSON): 6 tasks
- US5 (Tests): 6 tasks
- Setup/Foundational/Polish: 13 tasks

### MVP Scope

**Minimum viable**: Complete through Phase 5 (US4) = 25 tasks
- Can search and get JSON output
- Core retrieval functionality working

**Full feature**: Complete all 36 tasks
- Test suite validates pipeline
- CLI supports all options

---

## Notes

- All code in single file `backend/main.py` as specified
- No automated unit tests - manual verification via test function
- Each checkpoint allows validation before proceeding
- Commit after each phase completion
- Existing `ingest_book()` pipeline must remain unchanged
