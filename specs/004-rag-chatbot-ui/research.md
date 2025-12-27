# Research: RAG Chatbot Frontend UI

**Feature**: 004-rag-chatbot-ui
**Date**: 2025-12-23
**Status**: Complete

---

## Research Tasks

### 1. Frontend Framework Selection

**Question**: What frontend framework best fits a minimal, clean chatbot UI?

**Decision**: React with Vite for fast development and minimal configuration

**Rationale**:
- User specified "React (or Next.js if preferred)"
- Vite provides fast development server and build
- No SSR needed - pure client-side app
- Minimal configuration required
- React is well-suited for component-based UI with state management

**Alternatives Considered**:
- Next.js (rejected - SSR/SSG overhead unnecessary for simple SPA)
- Vanilla JavaScript (rejected - harder to manage state and components)
- Vue/Svelte (rejected - user specified React)

---

### 2. HTTP Client for API Calls

**Question**: What HTTP client should be used for API calls to the backend?

**Decision**: Native Fetch API

**Rationale**:
- User specified "Fetch or Axios"
- Fetch is built into modern browsers - no additional dependency
- Simple API for basic POST requests
- Adequate error handling for our use case
- Reduces bundle size

**Alternatives Considered**:
- Axios (rejected - adds dependency for minimal benefit in this case)
- React Query (rejected - overkill for single endpoint)

---

### 3. Styling Approach

**Question**: How should the UI be styled?

**Decision**: Plain CSS with CSS Modules

**Rationale**:
- User specified "Basic styling only (no heavy UI frameworks)"
- CSS Modules provide scoped styles without external dependencies
- Vite has built-in support for CSS Modules
- Simple and maintainable for a minimal UI

**Alternatives Considered**:
- Tailwind CSS (rejected - additional configuration and learning curve)
- Styled Components (rejected - adds runtime overhead and dependency)
- Material UI/Chakra (rejected - user explicitly excluded heavy UI frameworks)

---

### 4. State Management

**Question**: How should application state be managed?

**Decision**: React useState and useReducer hooks

**Rationale**:
- Simple state: loading, error, response data
- No complex state interactions requiring external library
- Built-in React hooks are sufficient
- Reduces bundle size and complexity

**Alternatives Considered**:
- Redux (rejected - overkill for simple state)
- Zustand (rejected - unnecessary additional dependency)
- Context API (rejected - useState sufficient for single component tree)

---

### 5. Backend API Contract

**Question**: What is the exact API contract with the backend?

**Decision**: Use existing `/ask` endpoint contract from backend agent

**API Contract**:
```
POST /ask
Content-Type: application/json

Request:
{
  "query": "string (required, min 1 char)",
  "top_k": "number (optional, default 5, range 1-20)"
}

Response (200):
{
  "query": "string",
  "answer": "string",
  "sources": ["string"],
  "chunks": [
    {
      "text": "string",
      "url": "string",
      "score": "number"
    }
  ],
  "timestamp": "string (ISO 8601)"
}

Error Response (422):
{
  "detail": [
    {
      "type": "string",
      "loc": ["body", "field"],
      "msg": "string"
    }
  ]
}

Error Response (503):
{
  "detail": "string"
}
```

---

### 6. CORS Configuration

**Question**: How should CORS be handled?

**Decision**: Add CORS middleware to backend FastAPI app

**Rationale**:
- Frontend will run on different port during development (e.g., 5173)
- FastAPI has built-in CORS middleware
- Simple one-time configuration on backend

**Implementation**:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["POST", "GET"],
    allow_headers=["Content-Type"],
)
```

---

### 7. Project Structure

**Question**: Where should the frontend code live?

**Decision**: New `frontend/` directory at repository root

**Rationale**:
- Separates frontend from existing backend/
- Clear boundary between concerns
- Standard web application structure
- Can be independently built and deployed

**Structure**:
```
frontend/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── App.module.css
│   ├── components/
│   │   ├── QuestionInput.jsx
│   │   ├── AnswerDisplay.jsx
│   │   ├── SourcesList.jsx
│   │   ├── ChunksCollapsible.jsx
│   │   └── LoadingSpinner.jsx
│   └── api/
│       └── askApi.js
└── public/
```

---

## Resolved Clarifications

All technical questions have been resolved. No NEEDS CLARIFICATION items remain.

| Item | Resolution |
|------|------------|
| Frontend Framework | React with Vite |
| HTTP Client | Native Fetch API |
| Styling | CSS Modules |
| State Management | React hooks (useState, useReducer) |
| API Contract | Existing /ask endpoint |
| CORS | FastAPI middleware |
| Project Structure | frontend/ directory |

---

## Summary

The RAG Chatbot Frontend UI will be a simple React SPA built with Vite:
1. Single-page application with question input
2. Displays answer, sources (clickable), and collapsible chunks
3. Loading and error states handled with React state
4. Plain CSS with CSS Modules for styling
5. Native Fetch API for backend communication
6. CORS enabled on backend for local development
