import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:pointer-events-none cursor-pointer hover:scale-[1.02] active:scale-[0.98]';
  
  const variants = {
    primary: 'glass-btn-primary bg-blue-600/90 hover:bg-blue-600 text-white shadow-[0_4px_16px_rgba(37,99,235,0.2)] border border-blue-400/25',
    secondary: 'glass-btn-secondary bg-white/40 backdrop-blur-md hover:bg-white/60 text-slate-800 border border-white/30 shadow-xs',
    outline: 'border border-white/30 bg-white/20 backdrop-blur-md hover:bg-white/30 text-slate-700 shadow-xs',
    ghost: 'hover:bg-white/20 text-slate-600 hover:text-slate-900',
    danger: 'bg-red-600/90 hover:bg-red-600 text-white shadow-xs border border-red-400/20',
  };

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base',
  };

  const spinner = (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading && spinner}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};
