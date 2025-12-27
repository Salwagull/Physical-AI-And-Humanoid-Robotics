# Quickstart: RAG Chatbot Frontend UI

**Feature**: 004-rag-chatbot-ui
**Date**: 2025-12-23

---

## Prerequisites

1. **Backend running**: The RAG Agent backend must be running at `http://localhost:8000`
   ```bash
   cd backend
   uv run uvicorn agent:app --reload --host 127.0.0.1 --port 8000
   ```

2. **Node.js installed**: Node.js 18+ required
   ```bash
   node --version  # Should be v18.0.0 or higher
   ```

3. **CORS configured**: Backend must allow frontend origin (see Setup section)

---

## Setup

### 1. Create Frontend Project

```bash
# From repository root
npm create vite@latest frontend -- --template react
cd frontend
npm install
```

### 2. Configure Backend CORS

Add to `backend/agent.py` after app initialization:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["POST", "GET"],
    allow_headers=["Content-Type"],
)
```

### 3. Configure API Base URL

Create `frontend/src/config.js`:

```javascript
export const API_BASE_URL = 'http://localhost:8000';
```

---

## Running the Application

### Start Backend (Terminal 1)

```bash
cd backend
uv run uvicorn agent:app --reload --host 127.0.0.1 --port 8000
```

### Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

**Access**: Open http://localhost:5173 in your browser

---

## Usage

### Ask a Question

1. Type your question in the input field
2. Click "Ask" or press Enter
3. Wait for the loading indicator to complete
4. View the answer displayed below

### View Sources

- Source URLs appear below the answer
- Click any source to open in a new tab

### View Retrieved Chunks

1. Click "View retrieved chunks (N)" to expand
2. See the text content and source URL for each chunk
3. Click again to collapse

---

## Example Interactions

### Valid Question

```
Input: "What is humanoid robotics?"

Expected Output:
- Answer with explanation
- Sources: List of URLs
- Chunks: Collapsible section with 5 chunks
```

### Empty Question

```
Input: ""

Expected Output:
- Error message: "Please enter a question"
- No API call made
```

### Backend Unavailable

```
Input: Any question (backend stopped)

Expected Output:
- Error message: "Unable to reach the server. Please try again."
```

---

## Troubleshooting

### "Failed to fetch" Error

**Cause**: CORS not configured or backend not running

**Solution**:
1. Verify backend is running at http://localhost:8000
2. Confirm CORS middleware is added to agent.py
3. Restart backend after adding CORS

### "Network Error"

**Cause**: Backend URL misconfigured

**Solution**:
1. Check `frontend/src/config.js` has correct URL
2. Ensure backend is accessible via curl:
   ```bash
   curl http://localhost:8000/
   ```

### Slow Responses

**Cause**: OpenRouter API latency

**Solution**:
- Normal behavior - RAG pipeline takes 5-15 seconds
- Loading indicator should be visible during this time

---

## Development Tips

### Hot Reload

- Frontend: Changes auto-reload via Vite
- Backend: Changes auto-reload via uvicorn --reload

### Testing Error States

1. **Stop backend**: Trigger network error
2. **Send empty query**: Trigger validation error
3. **Query unrelated topic**: Trigger "no results" response

### Browser DevTools

- Network tab: Inspect API requests/responses
- Console: View any JavaScript errors
- React DevTools: Inspect component state
