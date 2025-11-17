import { useEffect } from 'react';
import './Modal.css';

export const Modal = ({ open, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="ui-modal-overlay" onClick={onClose}>
      <div 
        className={`ui-modal-content ui-modal-${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="ui-modal-header">
            <h2 className="ui-modal-title">{title}</h2>
          </div>
        )}
        <div className="ui-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};
