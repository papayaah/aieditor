# Native Implementation

Pure HTML/CSS implementation with zero dependencies.

## Features

- No external UI library required
- Lightweight and fast
- Full control over styling
- CSS variables for theming
- Dark mode support via CSS variables

## Theming

All components use CSS variables that can be customized in your global CSS:

```css
:root {
  /* Buttons */
  --button-bg: #3b82f6;
  --button-bg-hover: #2563eb;
  --button-text: white;
  --button-secondary-bg: #6b7280;
  --button-secondary-bg-hover: #4b5563;
  --button-danger-bg: #ef4444;
  --button-danger-bg-hover: #dc2626;
  --button-ghost-bg-hover: rgba(0, 0, 0, 0.05);
  
  /* Text */
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --text-tertiary: #9ca3af;
  
  /* Inputs */
  --input-bg: white;
  --input-border: #d1d5db;
  --input-border-focus: #3b82f6;
  
  /* Menu */
  --menu-bg: white;
  --menu-border: #e5e7eb;
  --menu-item-hover: rgba(0, 0, 0, 0.05);
  
  /* Modal */
  --modal-bg: white;
  --modal-border: #e5e7eb;
  
  /* Switch */
  --switch-bg: #d1d5db;
  --switch-bg-checked: #3b82f6;
  
  /* Status colors */
  --warning-text: #f59e0b;
  --danger-text: #ef4444;
}

/* Dark mode */
[data-theme="dark"] {
  --button-ghost-bg-hover: rgba(255, 255, 255, 0.1);
  --text-primary: #f9fafb;
  --text-secondary: #d1d5db;
  --text-tertiary: #9ca3af;
  --input-bg: #1f2937;
  --input-border: #374151;
  --menu-bg: #1f2937;
  --menu-border: #374151;
  --menu-item-hover: rgba(255, 255, 255, 0.1);
  --modal-bg: #1f2937;
  --modal-border: #374151;
}
```

## Components

All components follow a consistent API:

- **Button** - Primary action button with variants
- **IconButton** - Icon-only button for toolbars
- **Menu/MenuItem** - Dropdown menu with items
- **Modal** - Dialog overlay
- **TextInput** - Single-line text input
- **Select** - Dropdown select
- **Textarea** - Multi-line text input
- **Switch** - Toggle switch

## Customization

You can customize individual components by:

1. Adding custom CSS classes via `className` prop
2. Overriding CSS variables
3. Modifying the component files directly (they're yours!)
