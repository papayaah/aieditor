import { useEffect, useState } from 'react';
import { BlockNoteView } from '@blocknote/mantine';
import { useCreateBlockNote } from '@blocknote/react';
import '@blocknote/mantine/style.css';
import { saveDocument, loadDocument, getAllDocuments, createDocument, deleteDocument } from './db';
import './App.css';

function Editor({ docId, onSave }) {
  const [initialContent, setInitialContent] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(false);
    setInitialContent(null);
    loadDocument(docId).then((content) => {
      setInitialContent(content || []);
      setIsReady(true);
    });
  }, [docId]);

  const editor = useCreateBlockNote();

  useEffect(() => {
    if (isReady && editor && initialContent !== null) {
      editor.replaceBlocks(editor.document, initialContent);
    }
  }, [isReady, initialContent, editor]);

  const handleChange = () => {
    if (!editor || !isReady) return;
    const content = editor.document;
    onSave(content);
  };

  if (!isReady) {
    return <div style={{ padding: '60px', color: '#9b9a97' }}>Loading...</div>;
  }

  return <BlockNoteView editor={editor} onChange={handleChange} />;
}

function App() {
  const [currentDocId, setCurrentDocId] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [markdown, setMarkdown] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    const docs = await getAllDocuments();
    setDocuments(docs);
    if (docs.length > 0 && !currentDocId) {
      setCurrentDocId(docs[0].id);
    } else if (docs.length === 0) {
      const newDoc = await createDocument();
      setDocuments([newDoc]);
      setCurrentDocId(newDoc.id);
    }
  };

  const handleSave = async (content) => {
    if (!currentDocId) return;
    await saveDocument(currentDocId, content);
    // Don't reload documents on every save to prevent reordering
  };



  const handleNewDocument = async () => {
    const newDoc = await createDocument();
    await loadDocuments();
    setCurrentDocId(newDoc.id);
  };

  const handleSelectDocument = (docId) => {
    setCurrentDocId(docId);
    setShowMarkdown(false);
  };

  const handleDeleteDocument = async (docId) => {
    if (documents.length === 1) {
      alert('Cannot delete the last document');
      return;
    }
    if (confirm('Delete this document?')) {
      await deleteDocument(docId);
      await loadDocuments();
      if (currentDocId === docId) {
        const docs = await getAllDocuments();
        setCurrentDocId(docs[0]?.id || null);
      }
    }
  };

  const toggleMarkdown = async () => {
    if (!showMarkdown && currentDocId) {
      const content = await loadDocument(currentDocId);
      // Simple markdown conversion
      const md = content.map(block => {
        if (block.type === 'heading') {
          const level = '#'.repeat(block.props?.level || 1);
          return `${level} ${block.content?.[0]?.text || ''}\n`;
        }
        return block.content?.[0]?.text || '';
      }).join('\n');
      setMarkdown(md);
    }
    setShowMarkdown(!showMarkdown);
  };

  const copyMarkdown = async () => {
    await navigator.clipboard.writeText(markdown);
    alert('Markdown copied to clipboard!');
  };

  const getDocTitle = (doc) => {
    if (doc.title && doc.title !== 'Untitled Document') {
      return doc.title;
    }
    const content = JSON.parse(doc.content || '[]');
    if (content.length > 0 && content[0].content) {
      const firstBlock = content[0].content;
      if (Array.isArray(firstBlock) && firstBlock.length > 0) {
        return firstBlock[0].text || 'Untitled';
      }
    }
    return 'Untitled';
  };

  if (!currentDocId) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <div className={`sidebar ${showSidebar ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Documents</h2>
          <button onClick={handleNewDocument} className="new-doc-btn">+ New</button>
        </div>
        <div className="document-list">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className={`doc-item ${currentDocId === doc.id ? 'active' : ''}`}
              onClick={() => handleSelectDocument(doc.id)}
            >
              <span className="doc-title">{getDocTitle(doc)}</span>
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteDocument(doc.id);
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="main-content">
        <div className="toolbar">
          <button onClick={() => setShowSidebar(!showSidebar)} className="toolbar-btn">
            {showSidebar ? '◀' : '▶'} Docs
          </button>
          <button onClick={toggleMarkdown} className="toolbar-btn">
            {showMarkdown ? '📝 Editor' : '📄 Markdown'}
          </button>
          <button onClick={copyMarkdown} className="toolbar-btn">
            📋 Copy
          </button>
        </div>
        <div className="editor-container">
          <div className="editor-wrapper">
            {showMarkdown ? (
              <div className="markdown-preview">
                <pre>{markdown}</pre>
              </div>
            ) : (
              <Editor key={currentDocId} docId={currentDocId} onSave={handleSave} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
