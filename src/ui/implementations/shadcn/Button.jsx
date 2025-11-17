/**
 * shadcn/ui Button Adapter
 * Wraps shadcn Button to match our interface
 */

// Uncomment when shadcn is installed:
// import { Button as ShadcnButton } from '@/components/ui/button';

export const Button = ({ 
  children, 
  onClick, 
  variant = 'default', 
  size = 'md',
  disabled = false,
  className = '',
  ...props 
}) => {
  // Map our variants to shadcn variants
  const variantMap = {
    default: 'default',
    secondary: 'secondary',
    ghost: 'ghost',
    danger: 'destructive'
  };

  // Map our sizes to shadcn sizes
  const sizeMap = {
    sm: 'sm',
    md: 'default',
    lg: 'lg'
  };

  // Uncomment when shadcn is installed:
  // return (
  //   <ShadcnButton
  //     variant={variantMap[variant]}
  //     size={sizeMap[size]}
  //     onClick={onClick}
  //     disabled={disabled}
  //     className={className}
  //     {...props}
  //   >
  //     {children}
  //   </ShadcnButton>
  // );

  // Placeholder until shadcn is installed
  return (
    <button onClick={onClick} disabled={disabled} className={className} {...props}>
      {children}
    </button>
  );
};
