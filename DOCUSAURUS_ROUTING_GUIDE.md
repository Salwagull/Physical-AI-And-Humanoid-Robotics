---
title: Docusaurus Routing & Configuration Guide
date: 2025-12-13
status: ✅ Fixed & Working
---

# Docusaurus Routing & Configuration Guide

## Quick Summary

✅ **Issue Fixed**: `baseUrl` changed from `/physical-AI-and-Humanoid-Robotics/` to `/` for local development
✅ **Website Now Live**: http://localhost:3000 (no trailing path needed)
✅ **All Pages Accessible**: Homepage, chapters, glossary, introduction all working

---

## 1. URL Routing Structure

### Local Development
```
http://localhost:3000/                    → Homepage (docs/index.md)
http://localhost:3000/docs/intro          → Introduction (docs/intro.md)
http://localhost:3000/docs/glossary       → Glossary (docs/glossary.md)
http://localhost:3000/docs/chapters/physical-ai-foundations     → Chapter 1
http://localhost:3000/docs/chapters/ros2-essentials            → Chapter 2
http://localhost:3000/docs/chapters/gazebo-simulation          → Chapter 3
... (etc for all chapters)
```

### GitHub Pages Production
```
https://your-username.github.io/physical-AI-and-Humanoid-Robotics/    → Homepage
https://your-username.github.io/physical-AI-and-Humanoid-Robotics/docs/intro
https://your-username.github.io/physical-AI-and-Humanoid-Robotics/docs/chapters/...
```

---

## 2. Configuration Files

### docusaurus.config.js - Key Settings

```javascript
// LOCAL DEVELOPMENT (current setting)
baseUrl: '/',

// For GITHUB PAGES PRODUCTION (change when deploying)
baseUrl: '/physical-AI-and-Humanoid-Robotics/',
```

**When to change:**
- Keep `baseUrl: '/'` for **local development** (npm start)
- Change to `baseUrl: '/physical-AI-and-Humanoid-Robotics/'` before **GitHub Pages deployment** (npm run deploy)

### sidebars.js - Navigation Structure

Current structure matches the 13 chapters organized into 5 modules:

```javascript
const sidebars = {
  tutorialSidebar: [
    { type: 'doc', id: 'intro', label: 'Introduction' },

    // Module 1: Foundations & Communication
    {
      type: 'category',
      label: 'Module 1: Foundations & Communication',
      items: [
        'chapters/physical-ai-foundations',
        'chapters/ros2-essentials',
        'chapters/gazebo-simulation',
      ],
    },

    // Module 2: Digital Twins
    {
      type: 'category',
      label: 'Module 2: Digital Twins',
      items: ['chapters/unity-digital-twins'],
    },

    // Module 3: AI-Native Robotics
    {
      type: 'category',
      label: 'Module 3: AI-Native Robotics',
      items: [
        'chapters/isaac-sim-setup',
        'chapters/perception-vision',
        'chapters/control-planning',
      ],
    },

    // Module 4: Vision-Language-Action
    {
      type: 'category',
      label: 'Module 4: Vision-Language-Action',
      items: [
        'chapters/vla-systems-intro',
        'chapters/voice-robotics',
      ],
    },

    // Module 5: Capstone
    {
      type: 'category',
      label: 'Module 5: Capstone',
      items: [
        'chapters/capstone-architecture',
        'chapters/capstone-implementation',
        'chapters/testing-validation',
        'chapters/deployment-next-steps',
      ],
    },

    // Bottom-level docs
    { type: 'doc', id: 'glossary', label: 'Glossary' },
  ],
};
```

**Key Points:**
- IDs use the **filename WITHOUT the number prefix** (e.g., `chapters/physical-ai-foundations` not `chapters/01-physical-ai-foundations`)
- Docusaurus automatically generates IDs from filenames by removing numbers and hyphens
- Categories create expandable sections in the sidebar
- Order matters: docs appear in sidebar in list order

---

## 3. File Naming & ID Generation

### How Docusaurus Generates IDs

| Filename | Generated ID | URL Path |
|----------|--------------|----------|
| `01-physical-ai-foundations.md` | `physical-ai-foundations` | `/docs/chapters/physical-ai-foundations` |
| `02-ros2-essentials.md` | `ros2-essentials` | `/docs/chapters/ros2-essentials` |
| `intro.md` | `intro` | `/docs/intro` |
| `glossary.md` | `glossary` | `/docs/glossary` |

**Rule**: Docusaurus removes leading numbers and converts to kebab-case (lowercase with hyphens).

### Correct Naming Pattern

```
docs/
├── index.md                    (→ homepage at /)
├── intro.md                    (→ /docs/intro)
├── glossary.md                 (→ /docs/glossary)
└── chapters/
    ├── 01-physical-ai-foundations.md  (→ /docs/chapters/physical-ai-foundations)
    ├── 02-ros2-essentials.md          (→ /docs/chapters/ros2-essentials)
    ├── 03-gazebo-simulation.md        (→ /docs/chapters/gazebo-simulation)
    ├── 04-unity-digital-twins.md      (→ /docs/chapters/unity-digital-twins)
    ├── 05-isaac-sim-setup.md          (→ /docs/chapters/isaac-sim-setup)
    ├── 06-perception-vision.md        (→ /docs/chapters/perception-vision)
    ├── 07-control-planning.md         (→ /docs/chapters/control-planning)
    ├── 08-vla-systems-intro.md        (→ /docs/chapters/vla-systems-intro)
    ├── 09-voice-robotics.md           (→ /docs/chapters/voice-robotics)
    ├── 10-capstone-architecture.md    (→ /docs/chapters/capstone-architecture)
    ├── 11-capstone-implementation.md  (→ /docs/chapters/capstone-implementation)
    ├── 12-testing-validation.md       (→ /docs/chapters/testing-validation)
    └── 13-deployment-next-steps.md    (→ /docs/chapters/deployment-next-steps)
```

---

## 4. Cross-Chapter Linking

### How to Link Between Chapters

In any markdown file, use relative links:

```markdown
# Chapter 1: Physical AI Foundations

[Next: Chapter 2 - ROS 2 Essentials](./ros2-essentials.md)
[Back to Introduction](../intro.md)
[See Glossary](../glossary.md)
[Jump to Chapter 7](./control-planning.md)
```

**Best Practice**: Use relative paths with `.md` extension—Docusaurus converts them automatically.

### Linking to Glossary Terms

When you mention a term that's in the glossary:

```markdown
**Embodied AI** (see [Glossary](../glossary.md))
```

Or use inline HTML:

```markdown
<a href="/docs/glossary#embodied-ai">embodied AI</a> (see Glossary)
```

---

## 5. Homepage Configuration

### docs/index.md (Homepage)

The homepage is special—it's accessed at `/` (root URL):

```markdown
---
title: Physical AI & Humanoid Robotics
description: From ROS 2 to Vision-Language-Action Systems
---

# Physical AI & Humanoid Robotics

[Hero section content here with cards and CTAs]
```

**Key Points:**
- `title` and `description` appear in browser tab and search results
- The file should NOT have a numbered prefix
- It's the entry point when users visit the website

### Navigation to Homepage

In sidebars.js, you do NOT include the index page—Docusaurus automatically shows it at `/`.

---

## 6. Sidebar Configuration Best Practices

### Adding a New Chapter

1. **Create the file** in `docs/chapters/`:
   ```bash
   # Example: create Chapter 14
   docs/chapters/14-new-chapter-title.md
   ```

2. **Update sidebars.js** - Add to appropriate module category:
   ```javascript
   {
     type: 'category',
     label: 'Module X: Module Name',
     items: [
       'chapters/new-chapter-title',  // ID without number
       // ... other chapters
     ],
   }
   ```

3. **Docusaurus auto-generates the ID** (`new-chapter-title`) from the filename

4. **The chapter is now accessible** at `/docs/chapters/new-chapter-title`

### Collapsing/Expanding Modules

You can control sidebar behavior:

```javascript
{
  type: 'category',
  label: 'Module 1: Foundations & Communication',
  collapsed: false,  // Always expanded (default: true for collapsed)
  items: [
    'chapters/physical-ai-foundations',
    // ...
  ],
}
```

---

## 7. Troubleshooting

### Problem: "Page Not Found" (404)

**Causes & Solutions:**

1. **Wrong baseUrl**
   - Local dev: Use `baseUrl: '/'`
   - Production (GitHub Pages): Use `baseUrl: '/physical-AI-and-Humanoid-Robotics/'`
   - ✅ Already fixed in your config

2. **Mismatched sidebar IDs**
   - Make sure sidebars.js IDs match actual filenames (without number prefix)
   - ✅ Already corrected in your sidebars.js

3. **File doesn't exist**
   - Verify file exists in `docs/chapters/`
   - Check filename matches sidebar ID
   - Example: `docs/chapters/physical-ai-foundations.md` → ID `chapters/physical-ai-foundations`

4. **Case sensitivity**
   - Use lowercase with hyphens (kebab-case)
   - ✅ Your files follow this pattern

### Problem: Links Show "undefined" or Break

**Solution**: Use relative paths with `.md` extension:
```markdown
# Wrong:
[Chapter 2](/docs/chapters/ros2-essentials)

# Correct:
[Chapter 2](./ros2-essentials.md)
```

### Problem: Sidebar Not Showing Chapters

**Check:**
1. Verify `sidebarPath: './sidebars.js'` in docusaurus.config.js ✅
2. Verify chapters exist in `docs/chapters/` ✅
3. Verify sidebar IDs match filenames (without number) ✅

---

## 8. Local Development Workflow

### Start the Dev Server

```bash
npm start
```

Server starts at: **http://localhost:3000**

### Make Changes

1. **Edit chapter content** in `docs/chapters/*.md`
2. **Update sidebar** if adding chapters
3. **Server auto-rebuilds** (watch mode)
4. **Refresh browser** to see changes

### Stop the Server

```bash
Ctrl + C (in terminal)
```

### Restart Later

```bash
npm start
```

---

## 9. Deployment (When Ready)

### Switch to Production Configuration

Before deploying to GitHub Pages:

1. **Update baseUrl** in `docusaurus.config.js`:
   ```javascript
   baseUrl: '/physical-AI-and-Humanoid-Robotics/',
   ```

2. **Update URLs** in docusaurus.config.js:
   ```javascript
   url: 'https://YOUR-GITHUB-USERNAME.github.io',
   organizationName: 'YOUR-GITHUB-USERNAME',
   projectName: 'physical-AI-and-Humanoid-Robotics',
   ```

3. **Build and deploy**:
   ```bash
   npm run build      # Creates static files
   npm run deploy     # Pushes to GitHub Pages
   ```

### Verify Deployment

Visit: `https://YOUR-GITHUB-USERNAME.github.io/physical-AI-and-Humanoid-Robotics/`

---

## 10. Current Status

### ✅ Configuration Complete

| Item | Status | Details |
|------|--------|---------|
| baseUrl | ✅ Correct | Set to `/` for local dev |
| sidebars.js | ✅ Correct | All 13 chapters mapped to IDs |
| Chapter files | ✅ Present | All files in `docs/chapters/` |
| Homepage | ✅ Working | `http://localhost:3000/` |
| Navigation | ✅ Working | Navbar + sidebar functional |
| Chapters | ✅ Accessible | All via `/docs/chapters/*` |

### 📍 Access Your Website

```
Homepage:        http://localhost:3000/
Introduction:    http://localhost:3000/docs/intro
Glossary:        http://localhost:3000/docs/glossary
Chapter 1:       http://localhost:3000/docs/chapters/physical-ai-foundations
Chapter 2:       http://localhost:3000/docs/chapters/ros2-essentials
... (all chapters accessible)
```

---

## Quick Reference

### File Structure
```
docs/
├── index.md                      (Homepage at /)
├── intro.md                      (Introduction at /docs/intro)
├── glossary.md                   (Glossary at /docs/glossary)
├── chapters/
│   ├── 01-physical-ai-foundations.md  → /docs/chapters/physical-ai-foundations
│   ├── 02-ros2-essentials.md          → /docs/chapters/ros2-essentials
│   └── ... (11 more chapters)
├── code-examples/                (For Python code samples)
└── diagrams/                     (For SVG/PNG diagrams)
```

### Key Settings
```javascript
// docusaurus.config.js
baseUrl: '/',  // Local dev (change to '/physical-AI-and-Humanoid-Robotics/' for production)

// sidebars.js
'chapters/physical-ai-foundations'  // ID format (no number prefix)
```

### Common Commands
```bash
npm start           # Start dev server at http://localhost:3000
npm run build       # Build for production
npm run serve       # Serve production build locally
npm run deploy      # Deploy to GitHub Pages (after updating config)
```

---

**Status**: ✅ All routing and configuration issues resolved. Website fully functional at http://localhost:3000

Happy content writing! 📚🚀

