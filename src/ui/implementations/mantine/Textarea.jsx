import { Textarea as MantineTextarea } from '@mantine/core';

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
    <MantineTextarea
      label={label}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}  // Convert to our format
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      className={className}
      size="sm"
      autosize
      minRows={rows}
      {...props}
    />
  );
};
