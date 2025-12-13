# Physical AI and Humanoid Robotics Book Constitution

<!--
Sync Impact Report:
- Version change: Initial → 1.0.0
- Added sections: 5 Core Principles + Quality Standards + Development Workflow + Governance
- Ratified: 2025-12-13
- Templates requiring review: spec-template.md, plan-template.md, tasks-template.md
-->

## Core Principles

### I. Beginner-First Accessibility
Every chapter must be written for students new to AI-native development. Non-negotiable: Flesch reading grade 8–10; concepts explained in plain language before technical depth; real-world analogies; step-by-step progressions; no assumption of prior knowledge beyond basic programming. Rationale: The book's core mission is educational—clarity and accessibility determine learning outcomes.

### II. Spec-Driven Technical Accuracy
All content, code examples, and explanations must be technically correct and verified against current industry standards (2025 AI/web dev practices). Every chapter must reference authoritative sources; code examples must be tested and runnable; architectural patterns must align with modern spec-driven engineering practices. Rationale: Credibility and practitioner value depend on accuracy; outdated or incorrect information damages learning and professional development.

### III. Consistent Structure & Tone
Every chapter follows the Chapter Specification template: learning objectives, introduction, body sections (300–500 words each), code examples (with explanations), key takeaways, and next chapter preview. Writing tone: conversational but professional; active voice preferred; jargon introduced with definition; cultural sensitivity in examples. Rationale: Consistency reduces cognitive load; students know what to expect; easier to maintain and update across contributors.

### IV. Actionable Examples Over Theory
Code examples must be complete, runnable, and tied directly to chapter learning objectives. Every code block includes inline comments explaining why (not just what). Diagrams, screenshots, and visuals support key concepts. No "left as exercise to the reader" without scaffolding. Rationale: Hands-on practice accelerates learning; working examples build confidence; passive reading alone fails to cement technical understanding.

### V. Modular, Maintainable Content
Each chapter is a self-contained Markdown file with metadata; chapter dependencies are explicit (see Chapter N for prerequisite knowledge). Content must be easy to update as technologies evolve (e.g., new AI frameworks, updated web APIs). Version-controlled alongside code; changes tracked in git history. Rationale: Rapid iteration and maintenance reduce technical debt; modularity supports future translations, adaptations, and course variants.

## Quality Standards

**Code Quality**: All code examples must:
- Run without errors in the stated environment (Node.js version, Python version, etc.)
- Include necessary imports and setup instructions
- Be concise and pedagogically clear (not production-hardened unless the lesson is hardening)
- Include one success path + one error-handling example per major concept
- Have inline comments on non-obvious logic

**Writing Quality**: All chapters must:
- Pass plagiarism check (original voice, properly cited sources)
- Use consistent terminology (define once, reuse)
- Include at least one diagram or visual per major section
- Link to external resources for deep dives (not required reading, but available)
- Be reviewed for technical accuracy by at least one domain expert before publication

**Testing & Validation**: Before chapter acceptance:
- All code examples executed successfully in the target environment
- Chapter tested against learning objectives (does it teach what it promises?)
- Docusaurus build succeeds with no warnings
- Sidebar and cross-references verified

## Development Workflow

**Chapter Authoring**:
1. Create feature branch: `chapters/<chapter-number>-<slug>`
2. Generate Chapter Spec using `/sp.specify` or manual template
3. Write chapter content in `docs/chapters/<number>-<title>.md`
4. Submit for technical review (code verification + accuracy audit)
5. Address feedback; push updates
6. Merge to main; deploy to staging
7. Final validation on GitHub Pages before live publication

**Change Management**:
- All chapter updates (>10% content change) require corresponding version bump (patch/minor/major in book metadata)
- Breaking changes to chapter structure (e.g., renaming sections, moving prerequisites) require deprecation notice and migration guide
- Dependency updates (new Node/Python/library versions) documented with impact on all code examples

**Content Deprecation**:
- Deprecated sections marked with ⚠️ banner: "This section covers [old tech]. See Chapter X for current approach."
- Sunset date communicated 2 chapters in advance (rough guideline)
- Old content archived in `docs/deprecated/` with explanation

## Governance

The constitution is the source of truth for all development decisions. Amendments require:
1. Clear rationale documenting why current principle is insufficient
2. Proposed new/amended language
3. Impact assessment: which chapters/processes are affected?
4. Sign-off from project lead and at least one technical reviewer

All contributors must verify compliance with applicable principles in code review. Principle violations (e.g., inaccessible code, inaccurate explanations) block merge.

Use `CLAUDE.md` (this directory) for runtime development guidance; supplement with project-specific ADRs for architecturally significant decisions (e.g., "Should the book cover custom LLM fine-tuning?" or "Which AI frameworks to prioritize?").

**Version**: 1.0.0 | **Ratified**: 2025-12-13 | **Last Amended**: 2025-12-13
