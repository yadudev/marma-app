import React from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react'; // Optional: use Lucide icon spinner

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  variant = 'danger',
  size = 'md',
  className,
  children,
  isLoading = false,
  loadingText,
  disabled,
  ...props
}: ButtonProps) => {
  const baseClasses =
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary: 'bg-blue-700 text-white hover:bg-blue-800 active:bg-blue-900',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
    warning: 'bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-100 active:bg-gray-200',
    ghost: 'bg-transparent hover:bg-gray-100 active:bg-gray-200',
  };

  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-6 text-lg',
  };

  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin mr-2 h-4 w-4" />
          {loadingText || 'Loading...'}
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
