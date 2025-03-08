import React from 'react';

type IconButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type IconButtonSize = 'sm' | 'md' | 'lg';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  isLoading?: boolean;
  isActive?: boolean;
  tooltip?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  variant = 'ghost',
  size = 'md',
  isLoading = false,
  isActive = false,
  tooltip = '',
  className = '',
  disabled,
  ...props
}) => {
  // Base classes
  const baseClasses = 'rounded-full flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Size classes
  const sizeClasses = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3'
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };
  
  // Active state
  const activeClasses = isActive 
    ? variant === 'ghost' || variant === 'outline'
      ? 'bg-gray-200 text-gray-900'
      : 'opacity-90'
    : '';
  
  // Loading and disabled state
  const stateClasses = (isLoading || disabled) 
    ? 'opacity-70 cursor-not-allowed' 
    : 'cursor-pointer';
  
  // Combined classes
  const combinedClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${activeClasses}
    ${stateClasses}
    ${className}
  `;
  
  return (
    <button
      className={combinedClasses}
      disabled={isLoading || disabled}
      title={tooltip}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        icon
      )}
    </button>
  );
};

export default IconButton;