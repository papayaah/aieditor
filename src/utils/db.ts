import Dexie, { Table } from 'dexie'

export interface Document {
  id?: number
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export class EditorDatabase extends Dexie {
  documents!: Table<Document>

  constructor() {
    super('EditorDatabase')
    this.version(1).stores({
      documents: '++id, title, createdAt, updatedAt'
    })
  }
}

export const db = new EditorDatabase()

// Helper functions
export async function saveDocument(title: string, content: string, id?: number): Promise<number> {
  const now = new Date()
  
  if (id) {
    // Update existing document
    await db.documents.update(id, {
      title,
      content,
      updatedAt: now
    })
    return id
  } else {
    // Create new document
    return await db.documents.add({
      title,
      content,
      createdAt: now,
      updatedAt: now
    })
  }
}

export async function getDocument(id: number): Promise<Document | undefined> {
  return await db.documents.get(id)
}

export async function getAllDocuments(): Promise<Document[]> {
  return await db.documents.orderBy('updatedAt').reverse().toArray()
}

export async function deleteDocument(id: number): Promise<void> {
  await db.documents.delete(id)
}

export async function getDocumentTitle(content: string): Promise<string> {
  // Extract title from content (first heading or first line)
  const lines = content.split('\n').filter(line => line.trim())
  if (lines.length === 0) return 'Untitled Document'
  
  // Try to find first heading
  const headingMatch = lines[0].match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/)
  if (headingMatch) {
    return headingMatch[1].replace(/<[^>]*>/g, '').trim() || 'Untitled Document'
  }
  
  // Use first line of text
  const firstLine = lines[0].replace(/<[^>]*>/g, '').trim()
  return firstLine.substring(0, 50) + (firstLine.length > 50 ? '...' : '') || 'Untitled Document'
}
