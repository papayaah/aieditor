# Mantine Implementation

Mantine UI components adapter for the UI layer.

## Already Installed!

Mantine is already installed in your project (used by BlockNote), so you can use this implementation immediately with zero additional dependencies.

## How to Use

Edit `src/ui/index.js`:

```javascript
export * from './implementations/mantine';
```

That's it! Your entire app now uses Mantine components.

## Features

- ✅ Already installed (via BlockNote)
- ✅ Modern, polished look
- ✅ Excellent accessibility
- ✅ Built-in animations
- ✅ Dark mode support
- ✅ ~80 KB (already in your bundle)

## Components

All components are wrapped to match the adapter interface:

- `Button` - Maps to Mantine Button
- `IconButton` - Maps to Mantine ActionIcon
- `Menu` / `MenuItem` - Maps to Mantine Menu
- `Modal` - Maps to Mantine Modal
- `TextInput` - Maps to Mantine TextInput
- `Select` - Maps to Mantine Select
- `Textarea` - Maps to Mantine Textarea
- `Switch` - Maps to Mantine Switch

## Customization

Mantine uses a theme provider. You can customize colors, spacing, and more:

```javascript
import { MantineProvider } from '@mantine/core';

<MantineProvider theme={{
  primaryColor: 'violet',
  defaultRadius: 'md',
}}>
  <App />
</MantineProvider>
```

## View in Storybook

```bash
npm run storybook
```

Navigate to "UI Adapter → Showcase" and switch to Mantine to see all components.
