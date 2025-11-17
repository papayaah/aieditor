# Quick Start: Theme Switcher in Storybook

## ✅ What You Wanted

> "When viewing PostCreator in Storybook, there's a way to select the theme and it gets applied"

**Done!** Here's how to use it:

## 3 Steps

### 1. Start Storybook
```bash
npm run storybook
```

### 2. Find the Theme Switcher
Look at the **top toolbar** in Storybook:
```
┌─────────────────────────────────────────────────────┐
│ Storybook Toolbar                                   │
│ [Zoom] [Background] [Viewport] [UI Theme 🎨] ...   │
│                                    ↑                 │
│                              Click here!             │
└─────────────────────────────────────────────────────┘
```

### 3. Switch Themes
Click **"UI Theme"** dropdown and select:
- **Native HTML/CSS** (minimal)
- **Mantine UI** (polished)

Watch the components transform instantly!

## Where to See It

### Best Demo
**Components → PostCreator → 🎨 UI Theme Switcher Demo**

### All Stories Work
- Light Mode
- Dark Mode  
- With Instructions
- Interactive Demo

All PostCreator stories now have the theme switcher!

## What Changes

The form controls (selects, inputs, buttons) in PostSettings will transform between:
- **Native**: Simple HTML styling
- **Mantine**: Modern, animated components

## Visual Guide

```
Storybook Page
├── Top Toolbar (look here!)
│   └── UI Theme dropdown 🎨
│       ├── Native HTML/CSS
│       └── Mantine UI
├── Story Canvas
│   └── PostCreator (transforms when you switch!)
└── Controls Panel
```

## That's It!

No configuration needed. Just:
1. Run Storybook
2. Click "UI Theme" in toolbar
3. Select a theme
4. See the magic!

🎉 Enjoy!
