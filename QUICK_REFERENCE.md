# Quick Reference Card

## 🚀 View UI Themes in Storybook

```bash
npm run storybook
```

Navigate to:
- **UI Adapter → 🎨 All Components (Switchable)**
- **Components → PostSettings → 🚀 Interactive Demo**

Click buttons to switch between Native and Mantine!

## 🎨 Switch UI in Your App

Edit `src/ui/index.js`:

```javascript
// Native (HTML/CSS, 5 KB)
export * from './implementations/native';

// Mantine (Modern, 80 KB, already installed)
export * from './implementations/mantine';
```

Restart: `npm run dev`

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/ui/index.js` | Change ONE line to swap UIs |
| `src/ui/UIShowcase.stories.jsx` | Storybook demo |
| `src/components/posts/PostSettings.adapter.jsx` | Refactored example |
| `VIEW_UI_THEMES_IN_STORYBOOK.md` | Full guide |

## ✅ What You Got

- ✅ Interactive Storybook demos
- ✅ Live UI switching
- ✅ Native + Mantine implementations
- ✅ Complete documentation
- ✅ Zero new dependencies

## 🎯 Next Steps

1. Run `npm run storybook`
2. Try switching implementations
3. Choose your favorite
4. Update `src/ui/index.js`
5. Enjoy!
