import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Highlight from '@tiptap/extension-highlight'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import { Extension } from '@tiptap/core'
import { textblockTypeInputRule, wrappingInputRule, InputRule } from '@tiptap/core'
import { useEffect, useState, useRef } from 'preact/hooks'
import { AIBubbleMenu } from './AIBubbleMenu'
import { AIFloatingMenu } from './AIFloatingMenu'
import { Toolbar } from './Toolbar'
import { getAIStatus, AIStatus } from '../utils/chromeAI'
import { SpaceAIExtension } from './SpaceAIExtension'
import { DocumentSidebar } from './DocumentSidebar'
import { saveDocument, getDocumentTitle, Document } from '../utils/db'
import { FileText } from 'lucide-preact'

// Custom extension for markdown shortcuts
const MarkdownShortcuts = Extension.create({
  name: 'markdownShortcuts',
  
  addInputRules() {
    return [
      // Heading shortcuts
      textblockTypeInputRule({
        find: /^# $/,
        type: this.editor.schema.nodes.heading,
        getAttributes: () => ({ level: 1 }),
      }),
      textblockTypeInputRule({
        find: /^## $/,
        type: this.editor.schema.nodes.heading,
        getAttributes: () => ({ level: 2 }),
      }),
      textblockTypeInputRule({
        find: /^### $/,
        type: this.editor.schema.nodes.heading,
        getAttributes: () => ({ level: 3 }),
      }),
      textblockTypeInputRule({
        find: /^#### $/,
        type: this.editor.schema.nodes.heading,
        getAttributes: () => ({ level: 4 }),
      }),
      textblockTypeInputRule({
        find: /^##### $/,
        type: this.editor.schema.nodes.heading,
        getAttributes: () => ({ level: 5 }),
      }),
      textblockTypeInputRule({
        find: /^###### $/,
        type: this.editor.schema.nodes.heading,
        getAttributes: () => ({ level: 6 }),
      }),
      
      // Blockquote
      wrappingInputRule({
        find: /^> $/,
        type: this.editor.schema.nodes.blockquote,
      }),
      
      // Code block
      textblockTypeInputRule({
        find: /^``` $/,
        type: this.editor.schema.nodes.codeBlock,
      }),
      
      // Bullet list
      wrappingInputRule({
        find: /^[-*+] $/,
        type: this.editor.schema.nodes.bulletList,
      }),
      
      // Ordered list
      wrappingInputRule({
        find: /^(\d+)\. $/,
        type: this.editor.schema.nodes.orderedList,
      }),
      
      // Task list
      wrappingInputRule({
        find: /^\[\s?\] $/,
        type: this.editor.schema.nodes.taskList,
      }),
      
      // Horizontal rule
      new InputRule({
        find: /^---$/,
        handler: ({ range, commands }) => {
          commands.deleteRange(range)
          commands.insertContent({ type: 'horizontalRule' })
        },
      }),
      new InputRule({
        find: /^\*\*\*$/,
        handler: ({ range, commands }) => {
          commands.deleteRange(range)
          commands.insertContent({ type: 'horizontalRule' })
        },
      }),
    ]
  },
})

interface EditorProps {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
  editable?: boolean
}

export function Editor({ 
  content = '', 
  onChange, 
  placeholder = "Start writing... Type '/' for commands or select text for AI features",
  editable = true 
}: EditorProps) {
  const [aiStatus, setAIStatus] = useState<AIStatus>({
    writerAvailable: false,
    rewriterAvailable: false,
    writerCapabilities: null,
    rewriterCapabilities: null
  })
  const [showSpaceAIPrompt, setShowSpaceAIPrompt] = useState(false)
  const [spaceAIPosition, setSpaceAIPosition] = useState({ top: 0, left: 0 })
  const [spaceAIInsertAt, setSpaceAIInsertAt] = useState(0)
  const [showSidebar, setShowSidebar] = useState(false)
  const [currentDocumentId, setCurrentDocumentId] = useState<number | undefined>(undefined)
  const [documentTitle, setDocumentTitle] = useState('Untitled Document')
  const [isSaving, setIsSaving] = useState(false)
  const aiFloatingMenuRef = useRef<any>(null)
  const saveTimeoutRef = useRef<number | undefined>(undefined)
  const currentDocumentIdRef = useRef<number | undefined>(undefined)
  const lastSavedContentRef = useRef<string>('')

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      MarkdownShortcuts,
      SpaceAIExtension.configure({
        onSpacePressed: (position, insertAt) => {
          const newPosition = {
            top: position.top,
            left: position.left
          }
          setSpaceAIPosition(newPosition)
          setSpaceAIInsertAt(insertAt)
          setShowSpaceAIPrompt(true)
        }
      }),
      Placeholder.configure({
        placeholder,
        showOnlyWhenEditable: false,
      }),
      Typography,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline cursor-pointer',
        },
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TextStyle,
      Color,
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange?.(html)
      
      // Hide space AI prompt when there's a text selection (bubble menu should show instead)
      if (!editor.state.selection.empty && showSpaceAIPrompt) {
        setShowSpaceAIPrompt(false)
      }

      // Auto-save with debounce
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
      saveTimeoutRef.current = window.setTimeout(() => {
        handleAutoSave(html)
      }, 2000) // Save 2 seconds after user stops typing
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none max-w-none',
      },
    },
  })

  useEffect(() => {
    // Check AI capabilities on mount
    const checkAI = async () => {
      try {
        const status = await getAIStatus()
        setAIStatus(status)
      } catch (error) {
        console.warn('AI not available:', error)
      }
    }
    
    checkAI()

    // Cleanup auto-save timeout on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  const handleAutoSave = async (html: string) => {
    // Don't save empty documents
    if (!html || html === '<p></p>' || html.trim() === '') {
      return
    }

    // Don't save if content hasn't changed
    if (html === lastSavedContentRef.current) {
      return
    }

    try {
      setIsSaving(true)
      const title = await getDocumentTitle(html)
      setDocumentTitle(title)
      
      // Use ref to get the most current document ID
      const id = await saveDocument(title, html, currentDocumentIdRef.current)
      
      // Update both state and ref
      if (!currentDocumentIdRef.current) {
        currentDocumentIdRef.current = id
        setCurrentDocumentId(id)
        console.log('📝 New document created:', title, 'ID:', id)
      } else {
        console.log('📝 Document updated:', title, 'ID:', id)
      }

      // Store the saved content
      lastSavedContentRef.current = html
    } catch (error) {
      console.error('Failed to auto-save:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleLoadDocument = (doc: Document) => {
    if (editor) {
      editor.commands.setContent(doc.content)
      currentDocumentIdRef.current = doc.id
      setCurrentDocumentId(doc.id)
      setDocumentTitle(doc.title)
      lastSavedContentRef.current = doc.content
      console.log('📂 Loaded document:', doc.title, 'ID:', doc.id)
    }
  }

  const handleNewDocument = () => {
    if (editor) {
      editor.commands.setContent('')
      currentDocumentIdRef.current = undefined
      setCurrentDocumentId(undefined)
      setDocumentTitle('Untitled Document')
      lastSavedContentRef.current = ''
      console.log('📄 New document started')
    }
  }

  if (!editor) {
    return (
      <div class="flex items-center justify-center h-64">
        <div class="spinner"></div>
        <span class="ml-2 text-gray-600">Loading editor...</span>
      </div>
    )
  }



  return (
    <div class="relative">
      {/* Document Sidebar Toggle Button */}
      <button
        onClick={() => setShowSidebar(true)}
        class="fixed top-4 left-4 z-[100] p-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg shadow-lg transition-all"
        title="Open documents"
      >
        <FileText size={20} class="text-gray-700" />
      </button>

      {/* Document Sidebar */}
      <DocumentSidebar
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        onLoadDocument={handleLoadDocument}
        onNewDocument={handleNewDocument}
        currentDocumentId={currentDocumentId}
      />

      <Toolbar editor={editor} aiStatus={aiStatus} />
      
      <div class="relative min-h-screen bg-white">
        {/* Floating Menu for empty lines */}
        <AIFloatingMenu 
          ref={aiFloatingMenuRef}
          editor={editor} 
          aiStatus={aiStatus}
          showSpacePrompt={showSpaceAIPrompt}
          spacePromptPosition={spaceAIPosition}
          spaceInsertAt={spaceAIInsertAt}
          onCloseSpacePrompt={() => setShowSpaceAIPrompt(false)}
        />
        
        {/* Bubble Menu for text selection - hide when space prompt is showing */}
        {!showSpaceAIPrompt && (
          <AIBubbleMenu editor={editor} aiStatus={aiStatus} />
        )}
        
        {/* Main Editor */}
        <div class="max-w-4xl mx-auto px-6 py-8">
          <EditorContent 
            editor={editor} 
            class="focus-within:outline-none min-h-screen"
          />
        </div>
      </div>
      
      {/* Status Indicators */}
      <div class="fixed bottom-4 right-4 flex flex-col items-end space-y-2">
        {/* Save Status */}
        {isSaving && (
          <div class="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm shadow-lg">
            <div class="flex items-center space-x-2">
              <div class="spinner"></div>
              <span>Saving...</span>
            </div>
          </div>
        )}

        {/* Document Title */}
        {currentDocumentId && (
          <div class="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg text-sm shadow-lg">
            <div class="flex items-center space-x-2">
              <FileText size={14} />
              <span class="max-w-xs truncate">{documentTitle}</span>
            </div>
          </div>
        )}

        {/* AI Status */}
        {(aiStatus.writerAvailable || aiStatus.rewriterAvailable) && (
          <div class="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm shadow-lg">
            <div class="flex items-center space-x-2">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>AI Ready</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}