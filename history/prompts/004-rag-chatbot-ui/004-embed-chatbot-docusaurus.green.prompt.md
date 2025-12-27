---
id: 004
title: Embed RAG Chatbot in Docusaurus Book
stage: green
date: 2025-12-24
surface: agent
model: claude-opus-4-5-20251101
feature: 004-rag-chatbot-ui
branch: 004-rag-chatbot-ui
user: architect
command: /sp.implement (custom)
labels: ["implementation", "docusaurus", "chatbot", "widget", "embedded"]
links:
  spec: specs/004-rag-chatbot-ui/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - src/components/ChatWidget/index.js
  - src/components/ChatWidget/styles.module.css
  - src/theme/Root.js
tests:
  - null
---

## Prompt

I have a Docusaurus-based online book.
I want to embed a RAG chatbot UI directly inside the book pages.

Requirements:
- Chatbot UI must appear INSIDE the book layout (not external page)
- Floating chat widget OR fixed bottom-right panel
- Available on every documentation page
- Uses React (Docusaurus compatible)
- Clean, minimal, textbook-style UI
- Mobile responsive

The chatbot must feel like:
"A built-in study assistant for the book"

Do NOT change the book content.
Only add chatbot UI components.

## Response snapshot

Created a floating RAG chatbot widget integrated into the Docusaurus book:

**Components Created:**

1. **ChatWidget Component** (`src/components/ChatWidget/index.js`)
   - Floating action button (bottom-right)
   - Expandable chat panel
   - Message history with user/assistant bubbles
   - Source citations display
   - Typing indicator during loading
   - Error handling
   - Keyboard support (Enter to send)

2. **ChatWidget Styles** (`src/components/ChatWidget/styles.module.css`)
   - Dark theme matching book's robotics aesthetic
   - Light theme support via CSS custom properties
   - Mobile responsive (full-width on small screens)
   - Smooth animations (slide up, fade in)
   - Scrollable message history
   - Reduced motion preference support
   - Print style (hides widget)

3. **Root Theme Wrapper** (`src/theme/Root.js`)
   - Uses Docusaurus swizzling pattern
   - Injects ChatWidget on every page
   - No modification to existing book content

**Features:**
- Floating button with chat icon (toggles to X when open)
- "Study Assistant" branded header with book icon
- Gradient styling matching teal/green theme
- Source links from RAG responses
- Responsive: full panel on mobile, fixed width on desktop
- Works in both dark and light themes

## Outcome

- Impact: Users can now ask questions about the textbook from any page
- Tests: Build verified successfully (npm run build passed)
- Files: 3 files created
- Next prompts: Start backend, start Docusaurus dev server, test end-to-end
- Reflection: Used Docusaurus Root wrapper pattern for clean integration without modifying book content

## Evaluation notes (flywheel)

- Failure modes observed: None - build passed on first attempt
- Graders run and results (PASS/FAIL): Build PASS
- Prompt variant (if applicable): N/A
- Next experiment: N/A
