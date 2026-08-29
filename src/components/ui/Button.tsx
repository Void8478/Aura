import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'secondary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aura-accent focus-visible:ring-offset-2 focus-visible:ring-offset-aura-900 disabled:opacity-40 disabled:pointer-events-none select-none active:scale-[0.98] font-sans';

    const variants = {
      primary:
        'bg-aura-100 text-aura-950 hover:bg-aura-50 border border-white/20 shadow-sm font-semibold',
      secondary:
        'bg-aura-850 text-aura-200 border border-aura-700/80 hover:bg-aura-800 hover:text-aura-100 hover:border-aura-600 shadow-sm',
      outline:
        'bg-transparent text-aura-200 border border-aura-700 hover:bg-aura-850 hover:border-aura-500 hover:text-aura-100',
      ghost:
        'bg-transparent text-aura-400 hover:text-aura-100 hover:bg-aura-850/80 border border-transparent',
      accent:
        'bg-aura-accent text-white hover:bg-aura-accent-hover border border-aura-accent/30 shadow-sm font-medium',
      danger:
        'bg-rose-950/80 text-rose-300 border border-rose-800 hover:bg-rose-900 hover:text-rose-100',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5 tracking-wide',
      md: 'text-sm px-4 py-2 rounded-xl gap-2',
      lg: 'text-base px-5 py-2.5 rounded-xl gap-2.5 font-medium',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
