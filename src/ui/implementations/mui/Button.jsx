/**
 * Material-UI Button Adapter
 * Wraps MUI Button to match our interface
 */

// Uncomment when MUI is installed:
// import { Button as MuiButton } from '@mui/material';

export const Button = ({ 
  children, 
  onClick, 
  variant = 'default', 
  size = 'md',
  disabled = false,
  className = '',
  ...props 
}) => {
  // Map our variants to MUI variants
  const variantMap = {
    default: 'contained',
    secondary: 'contained',
    ghost: 'text',
    danger: 'contained'
  };

  // Map our sizes to MUI sizes
  const sizeMap = {
    sm: 'small',
    md: 'medium',
    lg: 'large'
  };

  // Uncomment when MUI is installed:
  // return (
  //   <MuiButton
  //     variant={variantMap[variant]}
  //     size={sizeMap[size]}
  //     onClick={onClick}
  //     disabled={disabled}
  //     className={className}
  //     color={variant === 'danger' ? 'error' : variant === 'secondary' ? 'secondary' : 'primary'}
  //     {...props}
  //   >
  //     {children}
  //   </MuiButton>
  // );

  // Placeholder until MUI is installed
  return (
    <button onClick={onClick} disabled={disabled} className={className} {...props}>
      {children}
    </button>
  );
};
