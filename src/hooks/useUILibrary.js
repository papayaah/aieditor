import { useState, useEffect, useMemo } from 'react';
import { createPostCreator } from '../components/posts/createPostCreator';

// Lazy load Mantine components only when needed
let mantineComponents = null;
const loadMantine = async () => {
  if (!mantineComponents) {
    const mantine = await import('@mantine/core');
    mantineComponents = {
      Textarea: mantine.Textarea,
      Button: mantine.Button,
      Card: mantine.Card,
      Badge: mantine.Badge,
    };
  }
  return mantineComponents;
};

/**
 * Hook to manage UI library selection
 * Allows switching between native HTML and Mantine
 */
export const useUILibrary = () => {
  const [uiLibrary, setUILibrary] = useState(() => {
    try {
      return localStorage.getItem('postCreatorUILibrary') || 'native';
    } catch {
      return 'native';
    }
  });

  const [mantineLoaded, setMantineLoaded] = useState(false);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('postCreatorUILibrary', uiLibrary);
    } catch {}
  }, [uiLibrary]);

  // Load Mantine when selected
  useEffect(() => {
    if (uiLibrary === 'mantine' && !mantineLoaded) {
      loadMantine().then(() => setMantineLoaded(true));
    }
  }, [uiLibrary, mantineLoaded]);

  // Create PostCreator with selected UI library
  const PostCreator = useMemo(() => {
    if (uiLibrary === 'mantine' && mantineLoaded && mantineComponents) {
      return createPostCreator(mantineComponents);
    }
    // Default: native HTML
    return createPostCreator();
  }, [uiLibrary, mantineLoaded]);

  const availableLibraries = [
    { value: 'native', label: 'Native HTML' },
    { value: 'mantine', label: 'Mantine UI' },
  ];

  return {
    uiLibrary,
    setUILibrary,
    PostCreator,
    availableLibraries,
    isLoading: uiLibrary === 'mantine' && !mantineLoaded,
  };
};
