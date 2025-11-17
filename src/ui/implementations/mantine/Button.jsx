import { Button as MantineButton } from '@mantine/core';

export const Button = ({ 
  children, 
  onClick, 
  variant = 'default', 
  size = 'md',
  disabled = false,
  className = '',
  ...props 
}) => {
  // Map our variants to Mantine variants
  const variantMap = {
    default: 'filled',
    secondary: 'light',
    ghost: 'subtle',
    danger: 'filled'
  };

  // Map our sizes to Mantine sizes
  const sizeMap = {
    sm: 'xs',
    md: 'sm',
    lg: 'md'
  };

  return (
    <MantineButton
      variant={variantMap[variant]}
      size={sizeMap[size]}
      onClick={onClick}
      disabled={disabled}
      className={className}
      color={variant === 'danger' ? 'red' : 'violet'}
      {...props}
    >
      {children}
    </MantineButton>
  );
};
