# UI Adapter Layer Guide

This project uses a UI adapter pattern that allows you to easily swap UI libraries without changing application code.

## How It Works

All UI components are imported from `src/ui/index.js`, which acts as a single entry point. This file re-exports components from a specific implementation directory.

```javascript
// Application code imports from the adapter
import { Button, Modal, TextInput } from '../ui';

// The adapter forwards to the active implementation
// src/ui/index.js -> src/ui/implementations/native/
```

## Swapping UI Libraries

### Step 1: Choose Your Implementation

Available implementations:
- **native** - Pure HTML/CSS (no dependencies) ✅ Default
- **shadcn** - shadcn/ui components (requires setup)
- **mui** - Material-UI components (requires setup)
- **custom** - Create your own!

### Step 2: Install Dependencies (if needed)

**For shadcn/ui:**
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input select textarea switch
```

**For Material-UI:**
```bash
npm install @mui/material @emotion/react @emotion/styled
```

**For native:**
No dependencies needed! Already included.

### Step 3: Update the Adapter

Edit `src/ui/index.js`:

```javascript
// Change this line:
export * from './implementations/native';

// To this:
export * from './implementations/shadcn';
// or
export * from './implementations/mui';
```

### Step 4: Restart Dev Server

```bash
npm run dev
```

That's it! Your entire app now uses the new UI library.

## Creating Custom Implementations

### 1. Create Implementation Directory

```bash
mkdir -p src/ui/implementations/myui
```

### 2. Implement Required Components

Each implementation must export these components with the same interface:

- `Button` - Primary button component
- `IconButton` - Icon-only button
- `Menu` / `MenuItem` - Dropdown menu
- `Modal` - Modal dialog
- `TextInput` - Text input field
- `Select` - Dropdown select
- `Textarea` - Multi-line text input
- `Switch` - Toggle switch

### 3. Component Interface Examples

**Button:**
```javascript
<Button 
  variant="default|secondary|ghost|danger"
  size="sm|md|lg"
  onClick={handler}
  disabled={boolean}
>
  Click me
</Button>
```

**TextInput:**
```javascript
<TextInput
  label="Name"
  value={value}
  onChange={setValue}
  placeholder="Enter name"
/>
```

**Modal:**
```javascript
<Modal
  open={isOpen}
  onClose={handleClose}
  title="Modal Title"
  size="sm|md|lg"
>
  Modal content
</Modal>
```

### 4. Create index.js

```javascript
// src/ui/implementations/myui/index.js
export { Button } from './Button';
export { IconButton } from './IconButton';
// ... export all required components
```

### 5. Update Main Adapter

```javascript
// src/ui/index.js
export * from './implementations/myui';
```

## Architecture Benefits

1. **Zero Vendor Lock-in** - Switch UI libraries anytime
2. **Consistent Interface** - Same API across all implementations
3. **Easy Testing** - Mock the entire UI layer
4. **Gradual Migration** - Migrate one component at a time
5. **Team Flexibility** - Different teams can use different UIs

## BlockNote Editor Note

The document editor uses BlockNote, which has a peer dependency on Mantine. This is isolated to the editor component and doesn't affect the rest of your UI. You can:

1. Keep Mantine just for BlockNote (current approach)
2. Replace BlockNote with another editor (TipTap, Slate, etc.)
3. Use BlockNote's headless mode and build your own UI

## Example: Migrating a Component

**Before (direct Mantine usage):**
```javascript
import { Button } from '@mantine/core';

function MyComponent() {
  return <Button>Click me</Button>;
}
```

**After (using adapter):**
```javascript
import { Button } from '../ui';

function MyComponent() {
  return <Button>Click me</Button>;
}
```

Now you can swap the entire UI library by changing one line in `src/ui/index.js`!

## CSS Variables

The native implementation uses CSS variables for theming. Define these in your global CSS:

```css
:root {
  --button-bg: #3b82f6;
  --button-bg-hover: #2563eb;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --input-border: #d1d5db;
  --input-border-focus: #3b82f6;
  /* ... more variables */
}
```

Other implementations (shadcn, MUI) use their own theming systems.

## Need Help?

Check the implementation examples in `src/ui/implementations/` for reference. Each implementation shows how to wrap a UI library to match the adapter interface.
