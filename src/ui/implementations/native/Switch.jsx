import './Switch.css';

export const Switch = ({ 
  label, 
  checked, 
  onChange, 
  disabled = false,
  className = '',
  ...props 
}) => {
  return (
    <label className={`ui-switch-wrapper ${className}`}>
      <input
        type="checkbox"
        className="ui-switch-input"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
        {...props}
      />
      <span className="ui-switch-slider"></span>
      {label && <span className="ui-switch-label">{label}</span>}
    </label>
  );
};
