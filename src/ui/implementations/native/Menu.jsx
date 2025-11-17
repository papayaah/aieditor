import { useState, useEffect, useRef } from 'react';
import './Menu.css';

export const Menu = ({ trigger, children, open, onOpenChange }) => {
  const [isOpen, setIsOpen] = useState(open || false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        const newState = false;
        setIsOpen(newState);
        onOpenChange?.(newState);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onOpenChange]);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onOpenChange?.(newState);
  };

  return (
    <div className="ui-menu" ref={menuRef}>
      <div onClick={handleToggle}>
        {trigger}
      </div>
      {isOpen && (
        <div className="ui-menu-content">
          {children}
        </div>
      )}
    </div>
  );
};

export const MenuItem = ({ children, onClick, icon, variant = 'default', className = '' }) => {
  return (
    <button 
      className={`ui-menu-item ui-menu-item-${variant} ${className}`}
      onClick={onClick}
    >
      {icon && <span className="ui-menu-item-icon">{icon}</span>}
      <span className="ui-menu-item-label">{children}</span>
    </button>
  );
};
