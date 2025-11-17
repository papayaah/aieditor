import './Select.css';

export const Select = ({ 
  label, 
  value, 
  onChange, 
  options = [],
  placeholder,
  disabled = false,
  className = '',
  ...props 
}) => {
  return (
    <div className={`ui-select-wrapper ${className}`}>
      {label && <label className="ui-select-label">{label}</label>}
      <select
        className="ui-select"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
