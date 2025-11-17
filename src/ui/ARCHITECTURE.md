# UI Adapter Architecture

## Visual Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Your Application                         │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ SettingsMenu │  │   Sidebar    │  │    Footer    │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                  │                  │              │
│         └──────────────────┼──────────────────┘              │
│                            │                                 │
│                            ▼                                 │
│                   ┌────────────────┐                        │
│                   │  src/ui/index  │  ◄── Change this line  │
│                   │   (Adapter)    │      to swap UIs       │
│                   └────────┬───────┘                        │
│                            │                                 │
│         ┌──────────────────┼──────────────────┐             │
│         │                  │                  │             │
│         ▼                  ▼                  ▼             │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐      │
│  │   Native    │   │  shadcn/ui  │   │ Material-UI │      │
│  │ (HTML/CSS)  │   │  (Radix)    │   │    (MUI)    │      │
│  └─────────────┘   └─────────────┘   └─────────────┘      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Component Flow

```
Application Component
        │
        │ import { Button } from '../ui'
        ▼
    src/ui/index.js
        │
        │ export * from './implementations/native'
        ▼
src/ui/implementations/native/Button.jsx
        │
        │ renders
        ▼
    <button class="ui-button">
```

## Swapping Implementations

### Before (Direct Import)
```javascript
// Component.jsx
import { Button } from '@mantine/core';  // ❌ Locked to Mantine

function MyComponent() {
  return <Button>Click</Button>;
}
```

### After (Adapter Pattern)
```javascript
// Component.jsx
import { Button } from '../ui';  // ✅ Can swap anytime

function MyComponent() {
  return <Button>Click</Button>;
}

// src/ui/index.js
export * from './implementations/native';  // Change this line
```

## Implementation Structure

Each implementation must export the same components:

```
implementations/
└── [implementation-name]/
    ├── index.js          # Exports all components
    ├── Button.jsx        # Button component
    ├── IconButton.jsx    # Icon button
    ├── Menu.jsx          # Dropdown menu
    ├── Modal.jsx         # Dialog
    ├── TextInput.jsx     # Text input
    ├── Select.jsx        # Dropdown select
    ├── Textarea.jsx      # Multi-line input
    ├── Switch.jsx        # Toggle switch
    └── *.css             # Styles (if needed)
```

## Data Flow

```
User Action
    │
    ▼
Component Handler
    │
    ▼
UI Component (from adapter)
    │
    ├─► Native Implementation
    │   └─► HTML + CSS
    │
    ├─► shadcn Implementation  
    │   └─► Radix Primitives + Tailwind
    │
    └─► MUI Implementation
        └─► Material-UI Components
```

## Dependency Graph

### Current (Native)
```
Your App
    │
    ├─► Lucide Icons (icons)
    ├─► Custom CSS (styling)
    └─► BlockNote
        └─► Mantine (isolated)
```

### With shadcn
```
Your App
    │
    ├─► Lucide Icons (icons)
    ├─► shadcn/ui (UI components)
    │   └─► Radix UI (primitives)
    ├─► Tailwind (styling)
    └─► BlockNote
        └─► Mantine (isolated)
```

### With Material-UI
```
Your App
    │
    ├─► Lucide Icons (icons)
    ├─► Material-UI (UI components)
    │   └─► Emotion (styling)
    └─► BlockNote
        └─► Mantine (isolated)
```

## Interface Contract

All implementations must support this interface:

```typescript
// Button
interface ButtonProps {
  variant?: 'default' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  children: ReactNode;
}

// TextInput
interface TextInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

// Modal
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

// ... etc for all components
```

## Benefits Visualization

```
Without Adapter:
Component ──► Mantine ──► Locked In ❌

With Adapter:
Component ──► Adapter ──┬──► Native ✅
                        ├──► shadcn ✅
                        ├──► MUI ✅
                        └──► Custom ✅
```

## Migration Strategy

```
Phase 1: Setup
├── Create adapter structure
├── Implement native version
└── Add documentation

Phase 2: Gradual Adoption
├── Use adapter in new components
├── Keep existing components as-is
└── Migrate when convenient

Phase 3: Full Adoption (Optional)
├── Migrate all components
├── Remove direct UI library imports
└── Enjoy flexibility!
```

## Testing Strategy

```
Unit Tests
    │
    ├─► Mock entire UI layer
    │   import * as UI from '../ui'
    │   jest.mock('../ui')
    │
    └─► Test business logic only
        (UI implementation doesn't matter)

Integration Tests
    │
    └─► Test with real UI implementation
        (swap implementations to test all)
```

## Performance Impact

```
Bundle Size Comparison:

Native:     App (50 KB) + Native (5 KB) = 55 KB
shadcn:     App (50 KB) + shadcn (30 KB) = 80 KB
MUI:        App (50 KB) + MUI (100 KB) = 150 KB

+ BlockNote/Mantine (80 KB, lazy loaded)
```

## Real-World Example

```javascript
// Before: Tightly coupled
import { Button } from '@mantine/core';
import { Modal } from '@mantine/core';

function Settings() {
  return (
    <Modal>
      <Button>Save</Button>
    </Modal>
  );
}

// After: Loosely coupled
import { Button, Modal } from '../ui';

function Settings() {
  return (
    <Modal>
      <Button>Save</Button>
    </Modal>
  );
}

// Now you can swap UI libraries without touching this code!
```

## Key Principles

1. **Single Entry Point**: All UI imports go through `src/ui/index.js`
2. **Consistent Interface**: All implementations expose the same API
3. **Zero Runtime Cost**: Just re-exports, no wrapper overhead
4. **Full Control**: You own the adapter code
5. **Gradual Adoption**: Use it when you want, where you want
