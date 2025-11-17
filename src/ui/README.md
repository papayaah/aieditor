# UI Adapter Layer

This directory contains UI component adapters that allow you to swap UI libraries without changing application code.

## How to Swap UI Libraries

1. Choose your implementation in `src/ui/implementations/`
2. Update the import in `src/ui/index.js` to point to your chosen implementation
3. Install the required dependencies for that implementation

## Available Implementations

- **native** - Pure HTML/CSS (no dependencies)
- **mantine** - Mantine UI components (current default for BlockNote compatibility)
- **shadcn** - shadcn/ui components (example)
- **mui** - Material-UI components (example)

## Creating Your Own Implementation

Copy any implementation folder and modify the components to use your preferred UI library. All implementations must export the same component interface.
