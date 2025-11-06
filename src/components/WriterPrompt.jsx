import { useState, useEffect, useRef } from 'react';
import { incrementAIGenerations } from '../db';

export const WriterPrompt = ({ editor, isReady, onSave, currentDocId }) => {
  const [showInput, setShowInput] = useState(false);
  const [inputPosition, setInputPosition] = useState({ top: 0, left: 0 });
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [writerAvailable, setWriterAvailable] = useState(false);
  const inputRef = useRef(null);
  const writerRef = useRef(null);

  // Check if Chrome AI Writer is available
  useEffect(() => {
    const checkAI = async () => {
      try {
        // Check for Chrome's built-in AI Writer API
        if (typeof self !== 'undefined' && 'Writer' in self) {
          const availability = await self.Writer.availability();
          const isAvailable = availability === 'available' || availability === 'downloadable';
          setWriterAvailable(isAvailable);
          console.log('Chrome AI Writer availability:', availability);
          console.log('Writer available:', isAvailable);
        } else {
          console.log('Chrome AI Writer API not found (self.Writer)');
        }
      } catch (error) {
        console.log('Error checking Chrome AI Writer:', error);
      }
    };
    checkAI();
  }, []);

  // Intercept spacebar on empty lines
  useEffect(() => {
    if (!editor || !isReady) return;

    let editorElement = null;

    const handleKeyDown = (event) => {
      console.log('Key pressed:', event.key);
      if (event.key === ' ' && !event.shiftKey && !event.ctrlKey && !event.metaKey) {
        console.log('Spacebar detected!');
        // Check if current block is empty
        try {
          const currentBlock = editor.getTextCursorPosition().block;
          console.log('Current block:', currentBlock);
          const isEmpty = !currentBlock.content || 
                         currentBlock.content.length === 0 ||
                         (currentBlock.content.length === 1 && 
                          currentBlock.content[0].type === 'text' && 
                          currentBlock.content[0].text.trim() === '');

          console.log('Is empty?', isEmpty);
          if (isEmpty) {
            console.log('Showing input!');
            
            event.preventDefault(); // Prevent space from being added
            
            // Show input at cursor position
            setInputValue("");
            
            // Use a small delay to let the DOM settle, then get position
            setTimeout(() => {
              const selection = window.getSelection();
              if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                
                // Create a temporary span to get the exact cursor position
                const span = document.createElement('span');
                span.textContent = '\u200B'; // Zero-width space
                range.insertNode(span);
                
                const rect = span.getBoundingClientRect();
                span.remove();
                
                console.log('Cursor rect:', rect);
                
                if (rect.top > 0 || rect.left > 0) {
                  const inputHeight = 150;
                  const spaceBelow = window.innerHeight - rect.bottom;
                  const spaceAbove = rect.top;
                  const shouldPositionAbove = spaceBelow < inputHeight && spaceAbove > spaceBelow;
                  
                  const position = {
                    top: shouldPositionAbove ? rect.top - inputHeight - 5 : rect.bottom + 5,
                    left: rect.left
                  };
                  console.log('Setting position:', position);
                  setInputPosition(position);
                  setShowInput(true);
                } else {
                  console.log('Invalid rect position:', rect);
                }
              }
            }, 10);
          }
        } catch (error) {
          console.log('Error checking for spacebar:', error);
        }
      }
    };

    // Add event listener to editor's DOM element
    // Wait a bit for the editor to be fully mounted
    const timer = setTimeout(() => {
      try {
        editorElement = editor.domElement;
        if (editorElement) {
          editorElement.addEventListener('keydown', handleKeyDown, true);
          console.log('Spacebar listener attached');
        }
      } catch (error) {
        console.log('Editor not ready yet:', error);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (editorElement) {
        editorElement.removeEventListener('keydown', handleKeyDown, true);
        console.log('Spacebar listener removed');
      }
    };
  }, [editor, isReady]);

  const handleInputSubmit = async () => {
    if (!inputValue.trim()) {
      setShowInput(false);
      return;
    }

    if (!writerAvailable) {
      // Fallback: just insert the text as-is
      try {
        const currentBlock = editor.getTextCursorPosition().block;
        editor.updateBlock(currentBlock, {
          ...currentBlock,
          content: [{
            type: "text",
            text: inputValue + " "
          }]
        });
      } catch (error) {
        console.log('Error inserting text:', error);
      }
      setShowInput(false);
      setInputValue("");
      return;
    }



    // Use Chrome AI to generate content
    setIsGenerating(true);
    
    try {
      // Get or create writer instance
      if (!writerRef.current) {
        console.log('Creating new AI writer instance...');
        const availability = await self.Writer.availability();
        
        if (availability === 'available') {
          writerRef.current = await self.Writer.create({
            tone: 'neutral',
            format: 'markdown',
            length: 'medium'
          });
        } else if (availability === 'downloadable') {
          // Include monitor for download progress
          writerRef.current = await self.Writer.create({
            tone: 'neutral',
            format: 'markdown',
            length: 'medium',
            monitor(m) {
              m.addEventListener('downloadprogress', (e) => {
                console.log(`Downloading AI model: ${Math.round((e.loaded / e.total) * 100)}%`);
              });
            }
          });
        } else {
          throw new Error('Writer API is unavailable');
        }
        
        console.log('AI writer created successfully');
      }

      const currentBlock = editor.getTextCursorPosition().block;
      const blockId = currentBlock.id;
      
      console.log('Starting AI generation with prompt:', inputValue);
      
      // Get current document content as context for the AI
      const documentContext = editor.document
        .map(block => {
          if (block.content && Array.isArray(block.content)) {
            return block.content
              .filter(item => item.type === 'text')
              .map(item => item.text)
              .join('');
          }
          return '';
        })
        .join('\n') || 'New document';

      console.log('Document context length:', documentContext.length);

      // Stream the AI response with document context
      const stream = writerRef.current.writeStreaming(inputValue, {
        context: documentContext
      });
      let fullText = '';
      let currentBlockRef = { id: blockId };
      
      for await (const chunk of stream) {
        // Each chunk is incremental text to append
        fullText += chunk;
        
        // Check if we completed a block (double newline indicates block boundary)
        if (fullText.includes('\n\n')) {
          try {
            // Split into completed blocks and remaining text
            const parts = fullText.split('\n\n');
            const completedText = parts.slice(0, -1).join('\n\n');
            const remainingText = parts[parts.length - 1];
            
            if (completedText.trim()) {
              // Parse and insert completed blocks
              const formattedBlocks = editor.tryParseMarkdownToBlocks(completedText + '\n\n');
              
              if (formattedBlocks && formattedBlocks.length > 0) {
                const currentBlock = editor.getBlock(currentBlockRef.id);
                if (currentBlock) {
                  // Insert formatted blocks
                  editor.insertBlocks(formattedBlocks, currentBlock, 'after');
                  
                  // Create new block for remaining text
                  const newBlock = editor.insertBlocks([{
                    type: "paragraph",
                    content: [{
                      type: "text",
                      text: remainingText
                    }]
                  }], formattedBlocks[formattedBlocks.length - 1], 'after')[0];
                  
                  // Remove original block
                  editor.removeBlocks([currentBlock]);
                  
                  // Update reference to new block
                  currentBlockRef.id = newBlock.id;
                  
                  // Reset fullText to just remaining text
                  fullText = remainingText;
                }
              }
            }
          } catch (error) {
            console.log('Error in real-time formatting:', error);
          }
        }
        
        // Update current block with accumulated text
        try {
          const block = editor.getBlock(currentBlockRef.id);
          if (block) {
            editor.updateBlock(block, {
              ...block,
              content: [{
                type: "text",
                text: fullText
              }]
            });
          }
        } catch (error) {
          console.log('Error updating block:', error);
        }
      }

      console.log('AI generation complete. Generated text length:', fullText.length);

      // After streaming is complete, format any remaining unformatted text
      try {
        const currentBlock = editor.getBlock(currentBlockRef.id);
        if (currentBlock && fullText.trim()) {
          // Check if the remaining text has markdown formatting
          if (fullText.includes('**') || fullText.startsWith('#') || fullText.includes('*') || fullText.includes('`')) {
            // Parse the remaining text as markdown
            const markdownBlocks = editor.tryParseMarkdownToBlocks(fullText);
            
            if (markdownBlocks && markdownBlocks.length > 0) {
              // Insert formatted blocks
              editor.insertBlocks(markdownBlocks, currentBlock, 'after');
              
              // Remove the unformatted block
              editor.removeBlocks([currentBlock]);
              
              // Position cursor at the end of the last inserted block
              const lastBlock = markdownBlocks[markdownBlocks.length - 1];
              if (lastBlock) {
                editor.setTextCursorPosition(lastBlock, 'end');
              }
            } else {
              // Just add a space to the plain text
              editor.updateBlock(currentBlock, {
                ...currentBlock,
                content: [{
                  type: "text",
                  text: fullText + " "
                }]
              });
            }
          } else {
            // No markdown formatting needed, just add a space
            editor.updateBlock(currentBlock, {
              ...currentBlock,
              content: [{
                type: "text",
                text: fullText + " "
              }]
            });
          }
        }
      } catch (error) {
        console.log('Error formatting final block:', error);
      }

    } catch (error) {
      console.error('AI generation failed:', error);
      console.error('Error details:', error.message, error.stack);
      // Fallback: insert the prompt as text
      try {
        const currentBlock = editor.getTextCursorPosition().block;
        editor.updateBlock(currentBlock, {
          ...currentBlock,
          content: [{
            type: "text",
            text: `[AI Error: ${error.message}] ${inputValue} `
          }]
        });
      } catch (err) {
        console.log('Error inserting fallback text:', err);
      }
    } finally {
      setIsGenerating(false);
      setShowInput(false);
      setInputValue("");
      
      // Increment AI generation counter and save
      if (onSave && editor && currentDocId) {
        try {
          // Increment AI generation count
          await incrementAIGenerations(currentDocId);
          
          // Save document content
          const content = editor.document;
          onSave(content);
        } catch (error) {
          console.log('Error saving after AI generation:', error);
        }
      }
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleInputSubmit();
    } else if (e.key === 'Escape') {
      setShowInput(false);
      setInputValue("");
    }
  };

  // Close input when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowInput(false);
      }
    };

    if (showInput) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showInput]);

  // Cleanup writer on unmount
  useEffect(() => {
    return () => {
      if (writerRef.current && writerRef.current.destroy) {
        writerRef.current.destroy();
      }
    };
  }, []);

  if (!showInput) return null;

  return (
    <div
      ref={inputRef}
      style={{
        position: 'fixed',
        top: inputPosition.top,
        left: inputPosition.left,
        backgroundColor: 'white',
        border: writerAvailable ? '1px solid #a78bfa' : '1px solid #e5e5e5',
        borderRadius: '8px',
        padding: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        minWidth: '300px',
        zIndex: 1000,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        {writerAvailable && (
          <div style={{
            width: '24px',
            height: '24px',
            backgroundColor: '#f3e8ff',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px'
          }}>
            ✨
          </div>
        )}
        <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>
          {writerAvailable ? 'AI Writer' : 'Text Input'}
        </div>
      </div>
      
      <textarea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleInputKeyDown}
        placeholder={writerAvailable ? "Ask AI to write anything..." : "Type your text here..."}
        autoFocus
        rows={3}
        disabled={isGenerating}
        style={{
          border: '1px solid #e5e5e5',
          borderRadius: '4px',
          padding: '8px',
          width: '100%',
          fontFamily: 'inherit',
          fontSize: '14px',
          resize: 'vertical',
          outline: 'none',
          backgroundColor: isGenerating ? '#f9fafb' : 'white',
        }}
      />
      
      <div style={{ fontSize: '12px', color: '#9b9a97', marginTop: '8px' }}>
        {isGenerating ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              border: '2px solid #a78bfa',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 0.6s linear infinite'
            }} />
            AI is writing...
          </div>
        ) : (
          `Press Enter to ${writerAvailable ? 'generate' : 'insert'}, Esc to cancel`
        )}
      </div>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
