import { useState, useEffect } from 'preact/hooks'
import { FileText, Plus, Trash2, X } from 'lucide-preact'
import { Document, getAllDocuments, deleteDocument } from '../utils/db'

interface DocumentSidebarProps {
  isOpen: boolean
  onClose: () => void
  onLoadDocument: (doc: Document) => void
  onNewDocument: () => void
  currentDocumentId?: number
}

export function DocumentSidebar({ 
  isOpen, 
  onClose, 
  onLoadDocument, 
  onNewDocument,
  currentDocumentId 
}: DocumentSidebarProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      loadDocuments()
    }
  }, [isOpen])

  const loadDocuments = async () => {
    setLoading(true)
    try {
      const docs = await getAllDocuments()
      setDocuments(docs)
    } catch (error) {
      console.error('Failed to load documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number, e: Event) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this document?')) {
      try {
        await deleteDocument(id)
        await loadDocuments()
      } catch (error) {
        console.error('Failed to delete document:', error)
      }
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    
    return new Date(date).toLocaleDateString()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        class="fixed inset-0 bg-black bg-opacity-50 z-[300]"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div class="fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-[301] flex flex-col animate-slide-in-left">
        {/* Header */}
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Documents</h2>
          <button
            onClick={onClose}
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} class="text-gray-600" />
          </button>
        </div>

        {/* New Document Button */}
        <div class="p-4 border-b border-gray-200">
          <button
            onClick={() => {
              onNewDocument()
              onClose()
            }}
            class="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus size={20} />
            <span class="font-medium">New Document</span>
          </button>
        </div>

        {/* Documents List */}
        <div class="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div class="flex items-center justify-center py-8">
              <div class="spinner"></div>
              <span class="ml-2 text-gray-600">Loading...</span>
            </div>
          ) : documents.length === 0 ? (
            <div class="text-center py-8">
              <FileText size={48} class="mx-auto text-gray-300 mb-3" />
              <p class="text-gray-500 text-sm">No documents yet</p>
              <p class="text-gray-400 text-xs mt-1">Create your first document to get started</p>
            </div>
          ) : (
            <div class="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => {
                    onLoadDocument(doc)
                    onClose()
                  }}
                  class={`group relative p-3 rounded-lg border transition-all cursor-pointer ${
                    doc.id === currentDocumentId
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center space-x-2 mb-1">
                        <FileText size={16} class={doc.id === currentDocumentId ? 'text-blue-600' : 'text-gray-400'} />
                        <h3 class="text-sm font-medium text-gray-900 truncate">
                          {doc.title}
                        </h3>
                      </div>
                      <p class="text-xs text-gray-500">
                        {formatDate(doc.updatedAt)}
                      </p>
                    </div>
                    
                    <button
                      onClick={(e) => handleDelete(doc.id!, e)}
                      class="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition-all"
                    >
                      <Trash2 size={14} class="text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
