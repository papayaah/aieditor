import { Switch as MantineSwitch } from '@mantine/core';

export const Switch = ({ 
  label, 
  checked, 
  onChange, 
  disabled = false,
  className = '',
  ...props 
}) => {
  return (
    <MantineSwitch
      label={label}
      checked={checked}
      onChange={(e) => onChange?.(e.target.checked)}  // Convert to our format
      disabled={disabled}
      className={className}
      size="sm"
      {...props}
    />
  );
};
