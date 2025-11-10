import { useEffect } from 'react';

export const useMarkdownPaste = (editor, isReady) => {
  useEffect(() => {
    if (!editor || !isReady) return;

    const handlePaste = async (event) => {
      const pastedText = event.clipboardData?.getData('text/plain');
      const pastedHtml = event.clipboardData?.getData('text/html');
      
      // Only intercept if it's plain text markdown (no HTML formatting)
      // Let BlockNote handle HTML paste natively for formatted content
      if (pastedHtml || !pastedText) return;

      // Check if pasted text looks like markdown (has markdown syntax)
      const hasMarkdownSyntax = /^#{1,6}\s|^\*\*|^\*|^-\s|^\d+\.\s|^>\s|^```/m.test(pastedText);

      if (hasMarkdownSyntax) {
        event.preventDefault();
        
        try {
          // Convert markdown to blocks using BlockNote's built-in parser
          const blocks = await editor.tryParseMarkdownToBlocks(pastedText);
          
          // Get current cursor position
          const currentBlock = editor.getTextCursorPosition().block;
          
          // Insert the blocks at current position
          await editor.insertBlocks(blocks, currentBlock, 'after');
          
          // Remove current block if it's empty
          const blockContent = currentBlock.content;
          if (!blockContent || (Array.isArray(blockContent) && blockContent.length === 0)) {
            await editor.removeBlocks([currentBlock]);
          }
        } catch (error) {
          console.error('Markdown paste error:', error);
          // If parsing fails, let default paste behavior happen
        }
      }
    };

    const editorElement = editor.domElement;
    if (editorElement) {
      editorElement.addEventListener('paste', handlePaste);
      return () => {
        editorElement.removeEventListener('paste', handlePaste);
      };
    }
  }, [editor, isReady]);
};
