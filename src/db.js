import Dexie from 'dexie';

export const db = new Dexie('NanoEditorDB');

db.version(2).stores({
  documents: '++id, title, content, updatedAt, createdAt'
});

db.version(3).stores({
  documents: '++id, title, content, updatedAt, createdAt',
  postEntries: 'id, text, suggestions, settings, isGenerating, createdAt, updatedAt'
});

db.version(4).stores({
  documents: '++id, title, content, updatedAt, createdAt',
  postEntries: 'id, text, suggestions, generations, settings, isGenerating, createdAt, updatedAt'
});

db.version(5).stores({
  documents: '++id, title, content, updatedAt, createdAt',
  postEntries: 'id, text, suggestions, generations, settings, submissions, isGenerating, createdAt, updatedAt'
});

export const createDocument = async () => {
  try {
    const now = new Date();
    const id = await db.documents.add({
      title: 'Untitled Document',
      content: JSON.stringify([]),
      createdAt: now,
      updatedAt: now
    });
    const doc = await db.documents.get(id);
    return doc;
  } catch (error) {
    console.error('Error creating document:', error);
    return null;
  }
};

export const saveDocument = async (docId, content, title) => {
  try {
    const updateData = {
      content: JSON.stringify(content),
      updatedAt: new Date()
    };
    
    // Only update title if provided
    if (title) {
      updateData.title = title;
    }
    
    await db.documents.update(docId, updateData);
  } catch (error) {
    console.error('Error saving document:', error);
  }
};

export const loadDocument = async (docId) => {
  try {
    const doc = await db.documents.get(docId);
    return doc ? JSON.parse(doc.content) : null;
  } catch (error) {
    console.error('Error loading document:', error);
    return null;
  }
};

export const getAllDocuments = async () => {
  try {
    const docs = await db.documents.orderBy('updatedAt').reverse().toArray();
    return docs;
  } catch (error) {
    console.error('Error loading documents:', error);
    return [];
  }
};

export const deleteDocument = async (docId) => {
  try {
    await db.documents.delete(docId);
  } catch (error) {
    console.error('Error deleting document:', error);
  }
};

export const incrementAIGenerations = async (docId) => {
  try {
    const doc = await db.documents.get(docId);
    if (doc) {
      const currentCount = doc.aiGenerations || 0;
      await db.documents.update(docId, {
        aiGenerations: currentCount + 1,
        updatedAt: new Date()
      });
    }
  } catch (error) {
    console.error('Error incrementing AI generations:', error);
  }
};
