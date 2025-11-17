# Migration Guide: Using the UI Adapter

This guide shows how to migrate your existing components to use the UI adapter layer.

## Current State

Your app currently has minimal UI library dependencies:
- **Mantine** - Only used by BlockNote editor (isolated)
- **Lucide React** - Icons (keep this, it's UI-agnostic)
- **Custom CSS** - Most components already use custom styling

Good news: Most of your components are already UI-library agnostic! They just need minor updates to use the adapter.

## Migration Strategy

### Option 1: Keep Current Approach (Recommended)

Your current components are already well-structured. You can:

1. **Keep using custom CSS** for your existing components
2. **Use the UI adapter** only for new components
3. **Gradually migrate** existing components when you need to change them

This is the least disruptive approach.

### Option 2: Full Migration

Migrate all components to use the UI adapter for maximum flexibility.

## Example Migrations

### SettingsMenu Component

**Current (already good!):**
```javascript
// Your current SettingsMenu.jsx already uses custom CSS
// No changes needed! It's already UI-agnostic
```

Your `SettingsMenu` component is already perfect - it uses:
- Custom CSS classes
- Lucide icons
- No UI library dependencies

**Optional enhancement with adapter:**
```javascript
import { Menu, MenuItem, IconButton } from '../ui';

// Replace your custom menu with adapter components
<Menu
  trigger={
    <IconButton aria-label="Open settings menu">
      <Settings size={20} />
    </IconButton>
  }
>
  <MenuItem icon={<FileText size={16} />} onClick={onToggleMarkdown}>
    {showMarkdown ? 'Editor' : 'Markdown'}
  </MenuItem>
  {/* ... more items */}
</Menu>
```

### Sidebar Component

**Current (already good!):**
Your Sidebar is already UI-agnostic with custom CSS.

**Optional enhancement:**
```javascript
import { Button, IconButton } from '../ui';

// Replace button elements with adapter components
<Button variant="default" size="sm" onClick={onNewDocument}>
  <Plus size={16} /> New
</Button>
```

## What About BlockNote/Mantine?

BlockNote requires Mantine as a peer dependency. You have three options:

### Option 1: Keep It (Recommended)
- Keep Mantine installed for BlockNote
- Use the UI adapter for everything else
- Mantine is only loaded in the editor component (lazy loaded)
- Minimal impact on bundle size

### Option 2: Use BlockNote Headless
```javascript
import { useCreateBlockNote } from '@blocknote/react';

// Build your own UI without Mantine
const editor = useCreateBlockNote({
  // Custom schema
});
```

### Option 3: Replace BlockNote
Switch to another editor:
- **TipTap** - Headless, very flexible
- **Slate** - Fully customizable
- **Lexical** - Facebook's editor framework
- **ProseMirror** - Low-level, powerful

## Quick Start: Using the Adapter

### 1. Import from the adapter
```javascript
import { Button, Modal, TextInput } from '../ui';
```

### 2. Use consistent props
```javascript
<Button variant="default" size="md" onClick={handler}>
  Click me
</Button>
```

### 3. Swap implementations anytime
```javascript
// src/ui/index.js
export * from './implementations/native';  // or shadcn, mui, etc.
```

## Recommended Approach for Your App

Based on your current architecture, I recommend:

1. **Keep your current components as-is** - They're already well-structured
2. **Use the UI adapter for new features** - Get the benefits without disruption
3. **Keep Mantine for BlockNote** - It's isolated and lazy-loaded
4. **Document the pattern** - So your team knows they can swap UIs later

## Benefits You Get

Even without migrating existing components:

✅ **Future-proof** - New components can use any UI library
✅ **No vendor lock-in** - Easy to switch later
✅ **Consistent interface** - Same API across implementations
✅ **Team flexibility** - Different developers can use different UIs
✅ **Easy testing** - Mock the entire UI layer

## Next Steps

1. Try the adapter in a new component
2. See `src/ui/examples/ExampleUsage.jsx` for examples
3. Read `UI_ADAPTER_GUIDE.md` for full documentation
4. Migrate existing components gradually (optional)

## Questions?

- Want to use shadcn/ui? See the shadcn implementation example
- Want to use Material-UI? See the MUI implementation example
- Want to create your own? Copy the native implementation as a template
