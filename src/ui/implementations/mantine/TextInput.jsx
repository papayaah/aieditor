import { TextInput as MantineTextInput } from '@mantine/core';

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
    <MantineTextInput
      label={label}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}  // Convert to our format
      placeholder={placeholder}
      type={type}
      disabled={disabled}
      className={className}
      size="sm"
      {...props}
    />
  );
};
