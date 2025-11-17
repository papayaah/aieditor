import './TextInput.css';

export const TextInput = ({ 
  label, 
  value, 
  onChange, 
  placeholder,
  type = 'text',
  disabled = false,
  className = '',
  ...props 
}) => {
  return (
    <div className={`ui-text-input-wrapper ${className}`}>
      {label && <label className="ui-text-input-label">{label}</label>}
      <input
        type={type}
        className="ui-text-input"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        {...props}
      />
    </div>
  );
};
