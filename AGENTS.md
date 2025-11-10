# Agent Development Rules

Minimal document editor with React, BlockNote, Dexie, and Chrome's built-in AI.

## Core Principles
- Use BlockNote's built-in features (markdown, drag/drop, formatting menus)
- Keep it minimal - remove code, don't add it
- Components under 200 lines

## What We Implement
- Document management (CRUD operations)
- IndexedDB persistence via Dexie (database: `NanoEditorDB`)
- Sidebar for document switching
- Settings menu (dark mode, markdown export, PDF export)
- Chrome AI integration (Writer/Rewriter APIs)

## Key APIs
- `useCreateBlockNote()` - Initialize editor
- `editor.blocksToMarkdownLossy()` - Convert to markdown
- `BlockNoteView` - Render editor

## Design
- Colors: `#37352f` (text), `#f7f7f5` (bg), `#e5e5e5` (borders)
- Max width: 1400px, responsive padding
- Sidebar: 260px, collapsible
- Dark mode support via CSS variables
