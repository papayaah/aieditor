import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useComponentsContext, useBlockNoteEditor } from '@blocknote/react';

export const RewriteButton = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [isRewriting, setIsRewriting] = useState(false);
  const [rewriterAvailable, setRewriterAvailable] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState('checking');
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const Components = useComponentsContext();
  const editor = useBlockNoteEditor();

  const rewriteOptions = [
    { 
      label: "Make it shorter", 
      options: { tone: 'as-is', format: 'as-is', length: 'shorter' },
      context: "Make this text more concise while keeping the same meaning."
    },
    { 
      label: "Make it longer", 
      options: { tone: 'as-is', format: 'as-is', length: 'longer' },
      context: "Expand this text with more detail and explanation."
    },
    { 
      label: "Simplify", 
      options: { tone: 'more-casual', format: 'as-is', length: 'as-is' },
      context: "Make this text simpler and easier to understand."
    },
    { 
      label: "Professional tone", 
      options: { tone: 'more-formal', format: 'as-is', length: 'as-is' },
      context: "Make this text more professional and formal."
    },
    { 
      label: "Casual tone", 
      options: { tone: 'more-casual', format: 'as-is', length: 'as-is' },
      context: "Make this text more casual and conversational."
    },
    { 
      label: "Fix grammar", 
      options: { tone: 'as-is', format: 'as-is', length: 'as-is' },
      context: "Fix any grammar, spelling, or punctuation errors in this text."
    }
  ];

  // Check if Chrome AI Rewriter is available
  useEffect(() => {
    const checkRewriter = async () => {
      if (typeof self !== 'undefined' && 'Rewriter' in self) {
        try {
          const availability = await self.Rewriter.availability();
          setAvailabilityStatus(availability);
          const isAvailable = availability === 'available' || availability === 'downloadable';
          setRewriterAvailable(isAvailable);
          console.log('Chrome AI Rewriter availability:', availability);
        } catch (error) {
          console.log('Chrome AI Rewriter not available:', error);
          setAvailabilityStatus('unavailable');
          setRewriterAvailable(false);
        }
      } else {
        setAvailabilityStatus('unavailable');
        setRewriterAvailable(false);
      }
    };
    checkRewriter();
  }, []);

  const handleButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Rewrite button clicked, current state:', showDropdown);
    
    if (!showDropdown && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.left
      });
    }
    
    setShowDropdown(!showDropdown);
  };

  const handleRewrite = async (rewriteOptions) => {
    if (!rewriterAvailable || isRewriting) return;

    setIsRewriting(true);
    setShowDropdown(false);

    let rewriter = null;

    try {
      // Get current text cursor position and block
      const currentBlock = editor.getTextCursorPosition().block;
      if (!currentBlock) {
        alert('Please place cursor in text to rewrite');
        return;
      }

      // Extract text from current block
      let selectedText = '';
      if (currentBlock.content && Array.isArray(currentBlock.content)) {
        currentBlock.content.forEach(item => {
          if (item.type === 'text' && item.text) {
            selectedText += item.text + ' ';
          }
        });
      }

      selectedText = selectedText.trim();
      if (!selectedText) {
        alert('No text found to rewrite');
        return;
      }

      console.log('Block to rewrite:', currentBlock);
      console.log('Text to rewrite:', selectedText);
      console.log('Starting AI rewrite with options:', rewriteOptions);

      // Create a fresh rewriter for this operation with only the valid API options
      const rewriterConfig = {
        tone: rewriteOptions.tone,
        format: rewriteOptions.format,
        length: rewriteOptions.length,
        sharedContext: 'This is a document editor where users want to improve their writing.'
      };

      if (availabilityStatus === 'available') {
        rewriter = await self.Rewriter.create(rewriterConfig);
      } else if (availabilityStatus === 'downloadable') {
        rewriter = await self.Rewriter.create(rewriterConfig);
        rewriter.addEventListener('downloadprogress', (e) => {
          console.log(`Downloading AI model: ${Math.round((e.loaded / e.total) * 100)}%`);
        });
      } else {
        throw new Error('Rewriter API is unavailable');
      }

      // Clear the current block for streaming
      editor.updateBlock(currentBlock, {
        ...currentBlock,
        content: [{
          type: "text",
          text: ""
        }]
      });

      // Stream the rewrite with specific context for this operation
      const stream = rewriter.rewriteStreaming(selectedText, {
        context: rewriteOptions.context || "Rewrite this text while maintaining its core meaning and structure."
      });

      let fullRewrittenText = '';
      
      for await (const chunk of stream) {
        // Each chunk is incremental text to append
        fullRewrittenText += chunk;
        
        // Update the block with the accumulated text
        try {
          editor.updateBlock(currentBlock, {
            ...currentBlock,
            content: [{
              type: "text",
              text: fullRewrittenText
            }]
          });
        } catch (error) {
          console.log('Error updating streaming block:', error);
        }
      }

      console.log('AI rewrite complete. Final text:', fullRewrittenText);

      // After streaming is complete, format the final text if it contains markdown
      if (fullRewrittenText.includes('**') || fullRewrittenText.startsWith('#') || fullRewrittenText.includes('*') || fullRewrittenText.includes('`')) {
        try {
          // Parse the final text as markdown
          const formattedBlocks = editor.tryParseMarkdownToBlocks(fullRewrittenText);
          
          if (formattedBlocks && formattedBlocks.length > 0) {
            // Replace with formatted blocks
            editor.replaceBlocks([currentBlock], formattedBlocks);
          }
        } catch (error) {
          console.log('Error formatting final rewritten text:', error);
        }
      }

    } catch (error) {
      console.error('AI rewrite failed:', error);
      alert(`Rewrite failed: ${error.message}`);
    } finally {
      // Always clean up the rewriter after use
      if (rewriter) {
        try {
          rewriter.destroy();
        } catch (error) {
          console.log('Error destroying rewriter:', error);
        }
      }
      setIsRewriting(false);
    }
  };



  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target) &&
          dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDropdown]);

  console.log('RewriteButton render, showDropdown:', showDropdown, 'position:', dropdownPosition);

  return (
    <>
      <div 
        ref={buttonRef}
        style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
      >
        <Components.FormattingToolbar.Button
          onClick={handleButtonClick}
          isSelected={showDropdown}
          mainTooltip="Rewrite with AI"
        >
          Rewrite ▾
        </Components.FormattingToolbar.Button>
      </div>
      
      {showDropdown && createPortal(
        <div
          ref={dropdownRef}
          style={{
            position: 'fixed',
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            backgroundColor: 'white',
            border: '1px solid #e5e5e5',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            minWidth: '200px',
            zIndex: 99999,
            overflow: 'hidden',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {rewriteOptions.map((option, index) => (
            <div
              key={index}
              onClick={() => handleRewrite(option)}
              style={{
                padding: '10px 14px',
                cursor: isRewriting ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                borderBottom: index < rewriteOptions.length - 1 ? '1px solid #f0f0f0' : 'none',
                transition: 'background-color 0.15s',
                opacity: isRewriting ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => !isRewriting && (e.currentTarget.style.backgroundColor = '#f5f5f5')}
              onMouseLeave={(e) => !isRewriting && (e.currentTarget.style.backgroundColor = 'white')}
            >
              {isRewriting && (
                <div style={{
                  width: '12px',
                  height: '12px',
                  border: '2px solid #a78bfa',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 0.6s linear infinite'
                }} />
              )}
              <span>{option.label}</span>
              {!rewriterAvailable && (
                <span style={{ fontSize: '10px', color: '#9ca3af' }}>
                  ({availabilityStatus === 'checking' ? 'Checking...' : 'AI unavailable'})
                </span>
              )}
            </div>
          ))}
        </div>,
        document.body
      )}
    </>
  );
};
