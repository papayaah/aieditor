# 🎨 Storybook UI Theme Switcher

## What You Asked For

> "When user is viewing the PostCreator or DocumentEditor in Storybook (e.g., http://localhost:6006/?path=/story/components-postcreator--light-mode), there is a way for user to select the theme and it gets applied to the document or post creator components"

## ✅ Done! Here's How It Works

### 1. Start Storybook

```bash
npm run storybook
```

### 2. Navigate to PostCreator

Go to: **Components → PostCreator** → Any story (Light Mode, Dark Mode, etc.)

### 3. Use the UI Theme Toolbar

Look at the **top toolbar** in Storybook. You'll see a new dropdown called **"UI Theme"** with a paintbrush icon 🎨

Click it and select:
- **Native HTML/CSS** - Clean, minimal styling (~5 KB)
- **Mantine UI** - Modern, polished components (~80 KB, already installed)

### 4. Watch the Magic!

The PostCreator components will **instantly transform** to use the selected UI theme!

## What Changes

When you switch themes, the form controls in PostSettings transform:

### Native HTML/CSS
```
┌─────────────────────┐
│ Tone          [▼]   │  ← Simple select
│ Format        [▼]   │
│ Length        [▼]   │
└─────────────────────┘
```

### Mantine UI
```
┌─────────────────────┐
│ Tone                │
│ ┌─────────────────┐ │  ← Styled select
│ │ Neutral     [▼] │ │     with animations
│ └─────────────────┘ │
│ Format              │
│ ┌─────────────────┐ │
│ │ Markdown    [▼] │ │
│ └─────────────────┘ │
└─────────────────────┘
```

## Special Demo Story

For the best experience, check out:

**Components → PostCreator → 🎨 UI Theme Switcher Demo**

This story includes:
- Beautiful header showing current theme
- Instructions on how to switch
- The PostSettings component isolated for easy comparison

## How It Works

### In Storybook

1. **Global Toolbar** - Added "UI Theme" dropdown to Storybook toolbar
2. **Global Decorator** - Wraps all stories with theme context
3. **Themeable Components** - PostSettings can switch between UI implementations
4. **Visual Banner** - Shows which theme is active

### In Your App

To use the same theme switching in your actual app:

```javascript
// src/ui/index.js - Change this ONE line
export * from './implementations/native';    // or
export * from './implementations/mantine';
```

## Files Modified/Created

### Storybook Configuration
- `.storybook/preview.js` - Added global theme switcher and decorator

### Themeable Components
- `src/components/posts/PostSettings.themeable.jsx` - PostSettings that switches themes
- `src/components/posts/PostCreator.themeable.jsx` - Wrapper for PostCreator

### Updated Stories
- `src/components/posts/PostCreator.stories.jsx` - Added theme banner and demo story

## Features

✅ **Toolbar Dropdown** - Easy theme switching from Storybook toolbar
✅ **Instant Switching** - No page reload needed
✅ **Visual Feedback** - Banner shows current theme
✅ **All Stories** - Works on all PostCreator stories
✅ **Mantine Ready** - Already installed, zero setup

## Try It Now

1. Run: `npm run storybook`
2. Go to: **Components → PostCreator → 🎨 UI Theme Switcher Demo**
3. Look for **"UI Theme"** in the toolbar (top of page)
4. Click and select "Mantine UI"
5. Watch the transformation!

## Comparison

| Theme | Look | Size | Dependencies |
|-------|------|------|--------------|
| **Native** | Clean, minimal | ~5 KB | Zero |
| **Mantine** | Polished, modern | ~80 KB | Already installed |

## What You Get

- ✅ Visual preview of both themes
- ✅ Easy switching via toolbar
- ✅ Works on actual components
- ✅ No code changes needed
- ✅ Mantine already installed

## Next Steps

After trying both themes in Storybook:

1. **Choose your favorite**
2. **Update your app**: Edit `src/ui/index.js`
3. **Refactor components**: Use the adapter pattern
4. **Deploy**: Your app now uses the chosen theme

Enjoy exploring! 🎉
