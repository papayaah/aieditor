import { ActionIcon } from '@mantine/core';

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
  // Map our variants to Mantine variants
  const variantMap = {
    ghost: 'subtle',
    default: 'filled'
  };

  // Map our sizes to Mantine sizes
  const sizeMap = {
    sm: 'sm',
    md: 'md',
    lg: 'lg'
  };

  return (
    <ActionIcon
      variant={variantMap[variant]}
      size={sizeMap[size]}
      onClick={onClick}
      disabled={disabled}
      className={className}
      aria-label={ariaLabel}
      color="violet"
      {...props}
    >
      {children}
    </ActionIcon>
  );
};
