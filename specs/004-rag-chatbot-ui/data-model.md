# Data Model: RAG Chatbot Frontend UI

**Feature**: 004-rag-chatbot-ui
**Date**: 2025-12-23

---

## Overview

This feature is a frontend-only UI that consumes the existing backend API. No persistent storage is added - all data flows through the API and is held in React component state.

## Data Structures (TypeScript Interfaces)

### Request Types

```typescript
/**
 * Request body sent to POST /ask endpoint
 */
interface QueryRequest {
  query: string;      // User's question (min 1 char)
  top_k?: number;     // Optional: Number of chunks to retrieve (1-20, default 5)
}
```

### Response Types

```typescript
/**
 * Individual retrieved chunk from the backend
 */
interface ChunkResult {
  text: string;       // Content of the retrieved chunk
  url: string;        // Source URL of the original page
  score: number;      // Similarity score (0-1)
}

/**
 * Successful response from POST /ask endpoint
 */
interface QueryResponse {
  query: string;              // Echo of the original query
  answer: string;             // AI-generated answer
  sources: string[];          // List of unique source URLs
  chunks: ChunkResult[];      // Retrieved chunks with scores
  timestamp: string;          // ISO 8601 timestamp
}

/**
 * Error response from backend
 */
interface ErrorResponse {
  detail: string | ValidationError[];
}

/**
 * Validation error detail (HTTP 422)
 */
interface ValidationError {
  type: string;
  loc: string[];
  msg: string;
}
```

### Application State

```typescript
/**
 * Main application state managed by React
 */
interface AppState {
  query: string;              // Current input value
  response: QueryResponse | null;  // Last successful response
  isLoading: boolean;         // Whether request is in flight
  error: string | null;       // Error message to display
}

/**
 * Initial state values
 */
const initialState: AppState = {
  query: '',
  response: null,
  isLoading: false,
  error: null,
};
```

---

## Data Flow

```
User Input (query)
    │
    ├─ Validate (non-empty)
    │
    ▼
AppState.isLoading = true
    │
    ├─ POST /ask with QueryRequest
    │
    ▼
Backend Response
    │
    ├─ Success (200)
    │   ├─ Parse QueryResponse
    │   └─ AppState.response = data
    │
    └─ Error (422/503/network)
        ├─ Parse error message
        └─ AppState.error = message
    │
    ▼
AppState.isLoading = false
    │
    ▼
Render UI
```

---

## Component Data Relationships

```
App (owns AppState)
 │
 ├─ QuestionInput
 │   └─ Props: query, onQueryChange, onSubmit, isLoading
 │
 ├─ LoadingSpinner
 │   └─ Props: isLoading
 │
 ├─ ErrorMessage
 │   └─ Props: error, onDismiss
 │
 └─ AnswerDisplay (when response exists)
     │
     ├─ Props: answer, query
     │
     ├─ SourcesList
     │   └─ Props: sources[]
     │
     └─ ChunksCollapsible
         └─ Props: chunks[], isExpanded, onToggle
```

---

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| query | Non-empty string | "Please enter a question" |
| query | Max 2000 chars | "Question is too long" |

*Note: Backend performs additional validation and returns HTTP 422 for invalid requests*

---

## No Persistent Storage

This feature:
- Does not create any database tables
- Does not use localStorage/sessionStorage
- All state is ephemeral React component state
- Refreshing the page clears all data
