import { Select as MantineSelect } from '@mantine/core';

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
  // Convert our options format to Mantine format
  const mantineData = options.map(opt => ({
    value: opt.value,
    label: opt.label
  }));

  return (
    <MantineSelect
      label={label}
      value={value}
      onChange={onChange}  // Mantine passes value directly
      data={mantineData}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      size="sm"
      {...props}
    />
  );
};
