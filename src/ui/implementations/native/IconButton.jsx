import './IconButton.css';

export const IconButton = ({ 
  children, 
  onClick, 
  variant = 'ghost',
  size = 'md',
  disabled = false,
  className = '',
  'aria-label': ariaLabel,
  ...props 
}) => {
  return (
    <button
      className={`ui-icon-button ui-icon-button-${variant} ui-icon-button-${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </button>
  );
};
