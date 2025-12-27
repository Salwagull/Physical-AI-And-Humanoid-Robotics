# Tasks: RAG Chatbot Frontend UI

**Input**: Design documents from `/specs/004-rag-chatbot-ui/`
**Prerequisites**: spec.md, research.md, data-model.md, quickstart.md

**Tests**: No tests explicitly requested in the feature specification. Implementation tasks only.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app structure**: `frontend/src/` for React components
- **Backend**: `backend/agent.py` for CORS configuration

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create Vite React project and configure development environment

- [x] T001 Create frontend project with Vite React template using `npm create vite@latest frontend -- --template react`
- [x] T002 Install dependencies and verify dev server starts in frontend/
- [x] T003 [P] Create API config file in frontend/src/config.js with API_BASE_URL

**Checkpoint**: Vite React project runs at http://localhost:5173

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Add CORS middleware to backend/agent.py for localhost:5173 origin
- [x] T005 Create API service layer in frontend/src/api/askApi.js with fetch POST to /ask endpoint
- [x] T006 [P] Create base App component structure in frontend/src/App.jsx with state management hooks
- [x] T007 [P] Create main CSS module in frontend/src/App.module.css with container layout
- [x] T008 Clear default Vite boilerplate from frontend/src/App.jsx and frontend/src/App.css

**Checkpoint**: Foundation ready - API service can POST to backend, App component has state structure

---

## Phase 3: User Story 1 - Ask a Question (Priority: P1)

**Goal**: User can type a question, submit it, and see the answer displayed

**Independent Test**: Type "What is humanoid robotics?" and click submit - answer should appear

### Implementation for User Story 1

- [x] T009 [P] [US1] Create QuestionInput component in frontend/src/components/QuestionInput.jsx with text input and submit button
- [x] T010 [P] [US1] Create QuestionInput styles in frontend/src/components/QuestionInput.module.css
- [x] T011 [P] [US1] Create AnswerDisplay component in frontend/src/components/AnswerDisplay.jsx to show query and answer text
- [x] T012 [P] [US1] Create AnswerDisplay styles in frontend/src/components/AnswerDisplay.module.css
- [x] T013 [US1] Integrate QuestionInput and AnswerDisplay in frontend/src/App.jsx with state binding
- [x] T014 [US1] Add Enter key submission handler in frontend/src/components/QuestionInput.jsx
- [x] T015 [US1] Connect form submission to askApi service in frontend/src/App.jsx

**Checkpoint**: User Story 1 complete - users can ask questions and see answers

---

## Phase 4: User Story 2 - View Sources and Citations (Priority: P1)

**Goal**: User can see clickable source URLs that open in new tabs

**Independent Test**: Ask a question - source links should appear below answer and open in new tabs when clicked

### Implementation for User Story 2

- [x] T016 [P] [US2] Create SourcesList component in frontend/src/components/SourcesList.jsx with clickable links (target="_blank")
- [x] T017 [P] [US2] Create SourcesList styles in frontend/src/components/SourcesList.module.css
- [x] T018 [US2] Integrate SourcesList into AnswerDisplay in frontend/src/components/AnswerDisplay.jsx

**Checkpoint**: User Stories 1 AND 2 complete - answers display with clickable source links

---

## Phase 5: User Story 3 - View Retrieved Chunks (Priority: P2)

**Goal**: User can optionally expand/collapse to view the text chunks used for the answer

**Independent Test**: Ask a question - click "View retrieved chunks (N)" to expand, see chunk texts, click again to collapse

### Implementation for User Story 3

- [x] T019 [P] [US3] Create ChunksCollapsible component in frontend/src/components/ChunksCollapsible.jsx with expand/collapse toggle
- [x] T020 [P] [US3] Create ChunksCollapsible styles in frontend/src/components/ChunksCollapsible.module.css
- [x] T021 [US3] Integrate ChunksCollapsible into AnswerDisplay in frontend/src/components/AnswerDisplay.jsx

**Checkpoint**: User Stories 1, 2, AND 3 complete - full answer display with sources and expandable chunks

---

## Phase 6: User Story 4 - Loading State Feedback (Priority: P2)

**Goal**: User sees visual feedback while question is being processed

**Independent Test**: Submit a question - loading indicator appears, disappears when answer loads, submit button is disabled during loading

### Implementation for User Story 4

- [x] T022 [P] [US4] Create LoadingSpinner component in frontend/src/components/LoadingSpinner.jsx
- [x] T023 [P] [US4] Create LoadingSpinner styles in frontend/src/components/LoadingSpinner.module.css with animation
- [x] T024 [US4] Integrate LoadingSpinner in frontend/src/App.jsx showing during isLoading state
- [x] T025 [US4] Disable submit button during loading in frontend/src/components/QuestionInput.jsx

**Checkpoint**: Loading states work - spinner shows during API call, button disabled

---

## Phase 7: User Story 5 - Error Handling (Priority: P2)

**Goal**: User sees clear error messages when something goes wrong

**Independent Test**: Stop backend and submit question - error message appears. Submit empty question - validation message appears.

### Implementation for User Story 5

- [x] T026 [P] [US5] Create ErrorMessage component in frontend/src/components/ErrorMessage.jsx with dismiss button
- [x] T027 [P] [US5] Create ErrorMessage styles in frontend/src/components/ErrorMessage.module.css
- [x] T028 [US5] Add client-side validation for empty query in frontend/src/App.jsx
- [x] T029 [US5] Add error state handling from API failures in frontend/src/App.jsx
- [x] T030 [US5] Integrate ErrorMessage component in frontend/src/App.jsx

**Checkpoint**: All error states handled - network errors, validation errors show friendly messages

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final styling and validation

- [x] T031 [P] Apply responsive styling in frontend/src/App.module.css for mobile/desktop
- [x] T032 [P] Add consistent color scheme and typography across all component CSS modules
- [x] T033 Validate quickstart.md scenarios work end-to-end
- [x] T034 Test all edge cases from spec.md (empty answer, long answers, timeout)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - US1 and US2 are both P1 priority - implement in order (US1 first, US2 builds on it)
  - US3, US4, US5 are P2 priority - can proceed after P1 stories complete
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Depends on US1 (AnswerDisplay component) - Extends US1's display
- **User Story 3 (P2)**: Depends on US1 (AnswerDisplay component) - Extends US1's display
- **User Story 4 (P2)**: Can start after Foundational - Independently testable
- **User Story 5 (P2)**: Can start after Foundational - Independently testable

### Within Each User Story

- Components before integration
- Base component before styles
- Create before integrate
- Story complete before moving to next priority

### Parallel Opportunities

- T003 can run in parallel with T001-T002
- T006, T007 can run in parallel (within Phase 2)
- T009-T012 can all run in parallel (different component files)
- T016-T017 can run in parallel
- T019-T020 can run in parallel
- T022-T023 can run in parallel
- T026-T027 can run in parallel
- T031-T032 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all components for User Story 1 together:
Task: T009 "Create QuestionInput component in frontend/src/components/QuestionInput.jsx"
Task: T010 "Create QuestionInput styles in frontend/src/components/QuestionInput.module.css"
Task: T011 "Create AnswerDisplay component in frontend/src/components/AnswerDisplay.jsx"
Task: T012 "Create AnswerDisplay styles in frontend/src/components/AnswerDisplay.module.css"

# Then sequentially integrate:
Task: T013 "Integrate QuestionInput and AnswerDisplay in frontend/src/App.jsx"
Task: T014 "Add Enter key submission handler"
Task: T015 "Connect form submission to askApi service"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T008)
3. Complete Phase 3: User Story 1 (T009-T015)
4. **STOP and VALIDATE**: Test asking questions and seeing answers
5. Demo MVP if ready

### Incremental Delivery

1. Setup + Foundational (T001-T008) -> Foundation ready
2. Add User Story 1 (T009-T015) -> Can ask questions, see answers (MVP!)
3. Add User Story 2 (T016-T018) -> Sources now clickable
4. Add User Story 3 (T019-T021) -> Chunks now viewable
5. Add User Story 4 (T022-T025) -> Loading states polished
6. Add User Story 5 (T026-T030) -> Errors handled gracefully
7. Polish (T031-T034) -> Production ready

### Component File Map

| Component | File | User Story |
|-----------|------|------------|
| App | frontend/src/App.jsx | Core container |
| QuestionInput | frontend/src/components/QuestionInput.jsx | US1 |
| AnswerDisplay | frontend/src/components/AnswerDisplay.jsx | US1 |
| SourcesList | frontend/src/components/SourcesList.jsx | US2 |
| ChunksCollapsible | frontend/src/components/ChunksCollapsible.jsx | US3 |
| LoadingSpinner | frontend/src/components/LoadingSpinner.jsx | US4 |
| ErrorMessage | frontend/src/components/ErrorMessage.jsx | US5 |
| askApi | frontend/src/api/askApi.js | Foundational |
| config | frontend/src/config.js | Setup |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- No tests included (not requested in spec) - add if needed later
