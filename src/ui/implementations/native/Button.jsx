import './Button.css';

export const Button = ({ 
  children, 
  onClick, 
  variant = 'default', 
  size = 'md',
  disabled = false,
  className = '',
  ...props 
}) => {
  return (
    <button
      className={`ui-button ui-button-${variant} ui-button-${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
