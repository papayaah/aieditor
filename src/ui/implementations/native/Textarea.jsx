import './Textarea.css';

export const Textarea = ({ 
  label, 
  value, 
  onChange, 
  placeholder,
  rows = 4,
  disabled = false,
  className = '',
  ...props 
}) => {
  return (
    <div className={`ui-textarea-wrapper ${className}`}>
      {label && <label className="ui-textarea-label">{label}</label>}
      <textarea
        className="ui-textarea"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        {...props}
      />
    </div>
  );
};
