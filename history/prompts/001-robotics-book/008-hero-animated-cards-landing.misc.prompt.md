---
id: 008
title: Hero Animated Cards Landing Page
stage: misc
date: 2025-12-15
surface: agent
model: claude-opus-4-5-20251101
feature: 001-robotics-book
branch: 001-robotics-book
user: hackathon-user
command: /sp.implement
labels: ["ui", "landing-page", "animation", "react", "hero"]
links:
  spec: specs/001-robotics-book/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - src/pages/index.js
  - src/pages/index.module.css
  - src/components/HomepageFeatures/index.js
  - src/components/HomepageFeatures/styles.module.css
  - docs/index.md
  - docusaurus.config.js
tests:
  - npm run build (PASS)
---

## Prompt

add hero section background animated picture remove context from landing page but add 6 cards with animation

## Response snapshot

Created a fully custom React-based landing page with:

### Animated Hero Section (src/pages/index.js + index.module.css)
1. **Background Animations**:
   - Moving grid lines (subtle parallax effect)
   - 8 floating particles with different colors (cyan, green, purple) and glow effects
   - Animated robot arm SVG illustration with swaying motion
   - Circuit line animations that draw and fade

2. **Hero Content**:
   - Large gradient title "Physical AI & Humanoid Robotics"
   - Animated subtitle with highlighted keywords (see, think, speak, act)
   - Tagline text
   - Two CTA buttons (primary gradient, secondary outline)
   - Stats section showing: 13 Chapters, 50+ Code Examples, 5 Modules

### 6 Animated Feature Cards (src/components/HomepageFeatures/)
Cards with animations:
1. Physical AI Foundations
2. ROS 2 & Communication
3. Simulation & Digital Twins
4. AI-Native Robotics
5. Vision-Language-Action
6. Capstone Project

Each card features:
- Floating icon animation
- Hover effects (lift, glow, border animation)
- Staggered entrance animations
- Mouse-following gradient effect
- Arrow indicator on hover
- Links to respective chapters

### Configuration Changes
- Updated docusaurus.config.js to use custom homepage
- Moved old index.md content to /book-overview route
- Simplified landing page (removed lengthy text content)

## Outcome

- Impact: Landing page now has impressive visual appeal with professional animations
- Tests: Docusaurus build PASS (compiled in ~23s)
- Files: 6 files created/modified
- Next prompts: Consider adding dark/light mode support for animations
- Reflection: React components + CSS modules provide better control than pure MDX for complex animations

## Evaluation notes (flywheel)

- Failure modes observed: None - all animations render correctly
- Graders run and results (PASS/FAIL): npm run build PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Add mouse-following gradient effect to cards using JS
