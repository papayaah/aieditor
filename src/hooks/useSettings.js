import { useState, useEffect } from 'react';

export const useSettings = () => {
  const [showSidebar, setShowSidebar] = useState(() => {
    const saved = localStorage.getItem('showSidebar');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [docInfoCollapsed, setDocInfoCollapsed] = useState(() => {
    const saved = localStorage.getItem('docInfoCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('showSidebar', JSON.stringify(showSidebar));
  }, [showSidebar]);

  useEffect(() => {
    localStorage.setItem('docInfoCollapsed', JSON.stringify(docInfoCollapsed));
  }, [docInfoCollapsed]);

  return {
    showSidebar,
    setShowSidebar,
    darkMode,
    setDarkMode,
    docInfoCollapsed,
    setDocInfoCollapsed,
  };
};
