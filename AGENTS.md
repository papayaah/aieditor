# Agent Development Rules

## Project Overview
This is a Notion-style document editor built with React, BlockNote, and Dexie (IndexedDB). The goal is to maintain a minimal, clean codebase by leveraging BlockNote's built-in features.

## Core Principles

### 1. Use BlockNote's Built-in Features
- **DO NOT** implement custom markdown parsing - BlockNote has `blocksToMarkdownLossy()` and `markdownToBlocks()`
- **DO NOT** implement custom block manipulation - BlockNote handles drag/drop, selection menus, and block operations
- **DO NOT** implement custom formatting menus - BlockNote provides hover menus and slash commands
- **DO NOT** implement custom inline markdown - BlockNote supports `##`, `*`, `-`, etc. natively

### 2. Minimal Code Philosophy
- Only write code that BlockNote doesn't already provide
- Keep components small and focused
- Avoid over-engineering or premature optimization
- If a feature exists in BlockNote's API, use it

### 3. What We Actually Need to Implement
- Document management (create, save, load, delete, switch)
- IndexedDB persistence via Dexie
- UI for document switching (sidebar)
- Toolbar for app-level actions (markdown view, copy)

## Technical Stack

### Dependencies
```json
{
  "@blocknote/core": "^0.41.1",
  "@blocknote/mantine": "^0.41.1",
  "@blocknote/react": "^0.41.1",
  "dexie": "^4.0.1",
  "react": "^18.3.1",
  "react-dom": "^18.3.1"
}
```

### Key BlockNote APIs Used
- `useCreateBlockNote()` - Initialize editor
- `editor.document` - Get current content
- `editor.blocksToMarkdownLossy()` - Convert to markdown
- `BlockNoteView` - Render the editor

### Database Schema (Dexie)
```javascript
documents: {
  id: number (auto-increment),
  title: string,
  content: string (JSON),
  updatedAt: Date
}
```

## Design Guidelines

### Aesthetics
- Clean, minimal Notion-inspired design
- Neutral color palette: `#37352f` (text), `#f7f7f5` (backgrounds), `#e5e5e5` (borders)
- Max content width: 900px
- Generous padding: 60px vertical, 96px horizontal
- Subtle hover states and transitions
- System fonts: -apple-system, BlinkMacSystemFont, etc.

### Layout
- Sidebar (260px) for document list
- Main content area with toolbar and editor
- Collapsible sidebar
- Responsive design for mobile

## Auto-save Behavior
- Save on every editor change via `onChange` handler
- Debouncing is NOT needed - Dexie/IndexedDB is fast enough
- Console logs for debugging save/load operations

## Document Management
- Documents sorted by `updatedAt` (most recent first)
- Document titles extracted from first block content
- Fallback to "Untitled" if no content
- Cannot delete the last document
- Confirmation before deletion

## Future Development Rules

### When Adding Features
1. Check BlockNote documentation first
2. Use BlockNote's API if available
3. Only add custom code if absolutely necessary
4. Keep styling consistent with Notion aesthetic
5. Test auto-save after changes

### When Debugging
1. Check browser console for save/load logs
2. Inspect IndexedDB in browser DevTools
3. Verify BlockNote version compatibility
4. Check BlockNote changelog for API changes

### When Refactoring
1. Remove code, don't add it
2. Consolidate duplicate logic
3. Simplify state management
4. Keep components under 200 lines

## Common Pitfalls to Avoid
- ❌ Implementing custom markdown parser
- ❌ Building custom block drag/drop
- ❌ Creating custom formatting toolbar
- ❌ Over-complicating state management
- ❌ Adding unnecessary dependencies
- ❌ Ignoring BlockNote's built-in features
- ❌ Breaking the minimal aesthetic with busy UI

## Testing Checklist
- [ ] Create new document
- [ ] Switch between documents
- [ ] Delete document (with confirmation)
- [ ] Auto-save on typing
- [ ] Content persists after reload
- [ ] Markdown view shows correct output
- [ ] Copy markdown to clipboard works
- [ ] Sidebar toggle works
- [ ] Responsive on mobile
- [ ] All BlockNote features work (drag, slash commands, formatting)
