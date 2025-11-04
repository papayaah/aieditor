import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'


interface SpaceAIOptions {
  onSpacePressed: (position: { top: number; left: number }, insertAt: number) => void
}

export const SpaceAIExtension = Extension.create<SpaceAIOptions>({
  name: 'spaceAI',

  addOptions() {
    return {
      onSpacePressed: () => {
        console.log('⚠️ Default onSpacePressed callback called - this should be overridden!')
      },
    }
  },

  onCreate() {
    console.log('🚀 SpaceAI Extension created!')
  },

  addProseMirrorPlugins() {
    console.log('🔧 Adding SpaceAI ProseMirror plugins...')
    
    return [
      new Plugin({
        key: new PluginKey('spaceAI'),
        
        props: {
          handleKeyDown: (view, event) => {
            // Only handle space key
            if (event.key !== ' ') {
              return false
            }

            const { state } = view
            const { selection } = state
            
            if (!selection) return false
            
            const { $from } = selection
            const currentNode = $from.parent
            const currentText = state.doc.textBetween($from.start(), $from.pos)
            
            console.log('🚀 Space detected! Current text:', JSON.stringify(currentText))
            console.log('🎯 Node type:', currentNode.type.name)
            console.log('🎯 Is paragraph?', currentNode.type.name === 'paragraph')
            
            // Check if we're at the start of an empty paragraph or line with only spaces (like Notion)
            const isEmptyParagraph = currentNode.type.name === 'paragraph' && 
              (currentText.trim().length === 0 || currentText === ' ')
            
            console.log('✨ Should trigger AI (empty paragraph)?', isEmptyParagraph)
            
            if (isEmptyParagraph) {
              console.log('✅ Triggering AI prompt!')
              
              // Let the space be inserted first, then show the AI prompt
              setTimeout(() => {
                try {
                  const updatedView = this.editor?.view || view
                  const updatedState = updatedView.state
                  const updatedSelection = updatedState.selection
                  
                  // Get coordinates of the current cursor position
                  const coords = updatedView.coordsAtPos(updatedSelection.from)
                  
                  // Calculate position relative to the page
                  const scrollTop = window.pageYOffset
                  const scrollLeft = window.pageXOffset
                  
                  const pageCoords = {
                    top: coords.top + scrollTop,
                    left: coords.left + scrollLeft
                  }
                  
                  console.log('🎯 SPACE AI WRITER PROMPT POSITIONING:')
                  console.log('  Cursor viewport coords:', { top: coords.top, left: coords.left })
                  console.log('  Current scroll:', { scrollTop, scrollLeft })
                  console.log('  Cursor page coords:', pageCoords)
                  console.log('  Prompt will render at viewport position:', {
                    top: coords.top,
                    left: coords.left
                  })
                  
                  // Call the callback with page position and insertion point
                  this.options.onSpacePressed(
                    pageCoords,
                    updatedSelection.from
                  )
                  
                  console.log('🎉 AI prompt callback called!')
                } catch (error) {
                  console.error('❌ Could not get cursor coordinates:', error)
                }
              }, 10)
            } else {
              console.log('❌ Not triggering - not an empty paragraph')
            }

            return false // Let the space character be inserted normally
          }
        }
      })
    ]
  }
})