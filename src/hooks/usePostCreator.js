import { useState, useEffect, useRef } from 'react';
import { useRewriter } from './useRewriter';
import { useWriter } from './useWriter';
import { getAllPostEntries, savePostEntry, repairCorruptedEntries } from './usePostEntries';

/**
 * Headless hook for PostCreator business logic
 * UI-agnostic - can be used with any UI library
 */
export const usePostCreator = ({ 
  currentEntryId,
  onEntrySaved,
  onSettingsExport
}) => {
  const [inputText, setInputText] = useState('');
  const [currentEntry, setCurrentEntry] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [lastGeneratedText, setLastGeneratedText] = useState('');
  const textareaRef = useRef(null);

  // Settings state
  const [tone, setTone] = useState(() => {
    try {
      const stored = localStorage.getItem('postHelperTone');
      const apiMode = localStorage.getItem('postHelperApiMode') || 'writer';
      if (!stored) return apiMode === 'writer' ? 'neutral' : 'as-is';
      if (apiMode === 'writer') {
        if (['casual', 'neutral', 'formal'].includes(stored)) return stored;
        if (stored === 'more-casual') return 'casual';
        if (stored === 'more-formal') return 'formal';
        if (stored === 'as-is') return 'neutral';
        return 'neutral';
      } else {
        if (['more-casual', 'as-is', 'more-formal'].includes(stored)) return stored;
        if (stored === 'casual') return 'more-casual';
        if (stored === 'formal') return 'more-formal';
        if (stored === 'neutral') return 'as-is';
        return 'as-is';
      }
    } catch {
      const apiMode = localStorage.getItem('postHelperApiMode') || 'writer';
      return apiMode === 'writer' ? 'neutral' : 'as-is';
    }
  });

  const [useEmoticons, setUseEmoticons] = useState(() => {
    try {
      return localStorage.getItem('postHelperEmoticons') === 'true';
    } catch {
      return false;
    }
  });

  const [temperature, setTemperature] = useState(() => {
    try {
      return localStorage.getItem('postHelperTemperature') || '0.7';
    } catch {
      return '0.7';
    }
  });

  const [topP, setTopP] = useState(() => {
    try {
      return localStorage.getItem('postHelperTopP') || '0.9';
    } catch {
      return '0.9';
    }
  });

  const [seed, setSeed] = useState(() => {
    try {
      return localStorage.getItem('postHelperSeed') || '';
    } catch {
      return '';
    }
  });

  const [stream, setStream] = useState(() => {
    try {
      return localStorage.getItem('postHelperStream') !== 'false';
    } catch {
      return true;
    }
  });

  const [apiMode, setApiMode] = useState(() => {
    try {
      return localStorage.getItem('postHelperApiMode') || 'writer';
    } catch {
      return 'writer';
    }
  });

  const [style, setStyle] = useState(() => {
    try {
      return localStorage.getItem('postHelperStyle') || 'default';
    } catch {
      return 'default';
    }
  });

  const [customStyle, setCustomStyle] = useState(() => {
    try {
      return localStorage.getItem('postHelperCustomStyle') || '';
    } catch {
      return '';
    }
  });

  const [useCurrentSettings, setUseCurrentSettings] = useState(() => {
    try {
      return localStorage.getItem('postHelperUseCurrentSettings') === 'true';
    } catch {
      return false;
    }
  });

  const [format, setFormat] = useState(() => {
    try {
      const stored = localStorage.getItem('postHelperFormat');
      const apiMode = localStorage.getItem('postHelperApiMode') || 'writer';
      if (!stored) return apiMode === 'writer' ? 'markdown' : 'as-is';
      if (apiMode === 'writer') {
        return ['markdown', 'plain-text'].includes(stored) ? stored : 'markdown';
      } else {
        return ['as-is', 'markdown', 'plain-text'].includes(stored) ? stored : 'as-is';
      }
    } catch {
      const apiMode = localStorage.getItem('postHelperApiMode') || 'writer';
      return apiMode === 'writer' ? 'markdown' : 'as-is';
    }
  });

  const [length, setLength] = useState(() => {
    try {
      const stored = localStorage.getItem('postHelperLength');
      const apiMode = localStorage.getItem('postHelperApiMode') || 'writer';
      if (!stored) return apiMode === 'writer' ? 'short' : 'as-is';
      if (apiMode === 'writer') {
        return ['short', 'medium', 'long'].includes(stored) ? stored : 'short';
      } else {
        return ['shorter', 'as-is', 'longer'].includes(stored) ? stored : 'as-is';
      }
    } catch {
      const apiMode = localStorage.getItem('postHelperApiMode') || 'writer';
      return apiMode === 'writer' ? 'short' : 'as-is';
    }
  });

  const { rewriterAvailable, rewriteText } = useRewriter();
  const {
    writerAvailable,
    tone: writerTone,
    setTone: setWriterTone,
    format: writerFormat,
    setFormat: setWriterFormat,
    length: writerLength,
    setLength: setWriterLength,
    generateText,
  } = useWriter('postHelper');

  const aiAvailable = apiMode === 'writer' ? writerAvailable : rewriterAvailable;
  const isGenerating = currentEntry?.isGenerating || false;

  // Repair corrupted entries on mount
  useEffect(() => {
    repairCorruptedEntries();
  }, []);

  // Load current entry
  useEffect(() => {
    const loadCurrentEntry = async () => {
      if (!currentEntryId) {
        setCurrentEntry(null);
        setInputText('');
        setLastGeneratedText('');
        return;
      }
      
      const allEntries = await getAllPostEntries();
      const entry = allEntries.find(e => e.id === currentEntryId);
      
      if (entry) {
        setCurrentEntry(entry);
        setInputText(entry.text || '');
        setLastGeneratedText(entry.text || '');
        
        if (entry.settings) {
          const savedSettings = entry.settings;
          if (savedSettings.apiMode) setApiMode(savedSettings.apiMode);
          if (savedSettings.tone) setTone(savedSettings.tone);
          if (savedSettings.format) setFormat(savedSettings.format);
          if (savedSettings.length) setLength(savedSettings.length);
          if (savedSettings.style) setStyle(savedSettings.style);
          if (savedSettings.customStyle !== undefined) setCustomStyle(savedSettings.customStyle);
          if (savedSettings.useEmoticons !== undefined) setUseEmoticons(savedSettings.useEmoticons);
          if (savedSettings.stream !== undefined) setStream(savedSettings.stream);
        }
      } else {
        setCurrentEntry(null);
        setInputText('');
        setLastGeneratedText('');
      }
    };
    
    loadCurrentEntry();
  }, [currentEntryId]);

  // Save entry when it changes
  useEffect(() => {
    const saveCurrentEntry = async () => {
      if (!currentEntry || !currentEntryId) return;
      
      if (currentEntry.text || (currentEntry.suggestions && currentEntry.suggestions.some(s => s && s.trim().length > 0))) {
        await savePostEntry(currentEntry);
        if (onEntrySaved) onEntrySaved();
      }
    };
    
    if (currentEntry && !currentEntry.isGenerating) {
      const timeoutId = setTimeout(() => {
        saveCurrentEntry();
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [currentEntry, currentEntryId, onEntrySaved]);

  // Sync format and length with Writer hook
  useEffect(() => {
    if (apiMode === 'writer') {
      if (format !== writerFormat) setWriterFormat(format);
      if (length !== writerLength) setWriterLength(length);
    }
  }, [apiMode, format, length, writerFormat, writerLength, setWriterFormat, setWriterLength]);

  // Save settings to localStorage
  useEffect(() => { try { localStorage.setItem('postHelperFormat', format); } catch {} }, [format]);
  useEffect(() => { try { localStorage.setItem('postHelperLength', length); } catch {} }, [length]);
  useEffect(() => { try { localStorage.setItem('postHelperTone', tone); } catch {} }, [tone]);
  useEffect(() => { try { localStorage.setItem('postHelperEmoticons', useEmoticons.toString()); } catch {} }, [useEmoticons]);
  useEffect(() => { try { localStorage.setItem('postHelperTemperature', temperature); } catch {} }, [temperature]);
  useEffect(() => { try { localStorage.setItem('postHelperTopP', topP); } catch {} }, [topP]);
  useEffect(() => { try { localStorage.setItem('postHelperSeed', seed); } catch {} }, [seed]);
  useEffect(() => { try { localStorage.setItem('postHelperStream', stream.toString()); } catch {} }, [stream]);
  useEffect(() => { try { localStorage.setItem('postHelperApiMode', apiMode); } catch {} }, [apiMode]);
  useEffect(() => { try { localStorage.setItem('postHelperStyle', style); } catch {} }, [style]);
  useEffect(() => { try { localStorage.setItem('postHelperCustomStyle', customStyle); } catch {} }, [customStyle]);
  useEffect(() => { try { localStorage.setItem('postHelperUseCurrentSettings', useCurrentSettings.toString()); } catch {} }, [useCurrentSettings]);

  // Convert values when switching between APIs
  useEffect(() => {
    if (apiMode === 'writer') {
      if (tone === 'more-casual') setTone('casual');
      else if (tone === 'more-formal') setTone('formal');
      else if (tone === 'as-is') setTone('neutral');
      else if (!['casual', 'neutral', 'formal'].includes(tone)) setTone('neutral');
      
      if (format === 'as-is') setFormat('markdown');
      else if (!['markdown', 'plain-text'].includes(format)) setFormat('markdown');
      
      if (length === 'shorter') setLength('short');
      else if (length === 'longer') setLength('long');
      else if (length === 'as-is') setLength('medium');
      else if (!['short', 'medium', 'long'].includes(length)) setLength('short');
    } else {
      if (tone === 'casual') setTone('more-casual');
      else if (tone === 'formal') setTone('more-formal');
      else if (tone === 'neutral') setTone('as-is');
      else if (!['more-casual', 'as-is', 'more-formal'].includes(tone)) setTone('as-is');
      
      if (!['as-is', 'markdown', 'plain-text'].includes(format)) setFormat('as-is');
      
      if (length === 'short') setLength('shorter');
      else if (length === 'long') setLength('longer');
      else if (length === 'medium') setLength('as-is');
      else if (!['shorter', 'as-is', 'longer'].includes(length)) setLength('as-is');
    }
  }, [apiMode]);

  // Export settings to parent
  useEffect(() => {
    if (onSettingsExport) {
      onSettingsExport({
        apiMode, setApiMode,
        tone, setTone,
        format, setFormat,
        length, setLength,
        style, setStyle,
        customStyle, setCustomStyle,
        useEmoticons, setUseEmoticons,
        stream, setStream,
        temperature, setTemperature,
        topP, setTopP,
        seed, setSeed,
        useCurrentSettings, setUseCurrentSettings,
        isGenerating
      });
    }
  }, [apiMode, tone, format, length, style, customStyle, useEmoticons, stream, temperature, topP, seed, useCurrentSettings, isGenerating, onSettingsExport]);

  // Sync Writer API tone
  useEffect(() => {
    if (apiMode === 'writer') {
      const writerToneMap = {
        'more-casual': 'casual',
        'as-is': 'neutral',
        'more-formal': 'formal'
      };
      setWriterTone(writerToneMap[tone] || 'casual');
    }
  }, [tone, apiMode, setWriterTone]);

  // Generate suggestions function (extracted from original component)
  const generateSuggestions = async (text, targetEntryId = null, forceNewSubmission = false) => {
    // ... (implementation continues in next message due to length)
    // This would contain the full generateSuggestions logic from the original component
  };

  const handleCopy = (text, entryId, index) => {
    navigator.clipboard.writeText(text);
    setCopiedId(`${entryId}-${index}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRegenerate = async () => {
    // ... (regenerate logic from original)
  };

  const handleSubmit = () => {
    const trimmedText = inputText.trim();
    if (trimmedText && !isGenerating) {
      generateSuggestions(trimmedText, currentEntryId, true);
      setLastGeneratedText(trimmedText);
      setInputText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.shiftKey || e.metaKey) && inputText.trim()) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Computed values
  const charCount = inputText.length;
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;

  return {
    // State
    inputText,
    setInputText,
    currentEntry,
    copiedId,
    isGenerating,
    aiAvailable,
    textareaRef,
    
    // Settings
    settings: {
      apiMode, setApiMode,
      tone, setTone,
      format, setFormat,
      length, setLength,
      style, setStyle,
      customStyle, setCustomStyle,
      useEmoticons, setUseEmoticons,
      stream, setStream,
      temperature, setTemperature,
      topP, setTopP,
      seed, setSeed,
      useCurrentSettings, setUseCurrentSettings,
    },
    
    // Actions
    handleSubmit,
    handleKeyDown,
    handleCopy,
    handleRegenerate,
    generateSuggestions,
    
    // Computed
    charCount,
    wordCount,
  };
};
