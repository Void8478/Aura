import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'ghost' | 'secondary' | 'primary' | 'accent' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  shape?: 'circle' | 'square';
  active?: boolean;
  'aria-label': string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant = 'ghost',
      size = 'md',
      shape = 'circle',
      active = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aura-accent focus-visible:ring-offset-2 focus-visible:ring-offset-aura-900 disabled:opacity-30 disabled:pointer-events-none select-none active:scale-95 shrink-0';

    const variants = {
      ghost: 'text-aura-400 hover:text-aura-100 hover:bg-aura-850/80 border border-transparent',
      secondary:
        'bg-aura-850 text-aura-300 hover:text-aura-100 hover:bg-aura-800 border border-aura-700/80 shadow-xs',
      primary:
        'bg-aura-100 text-aura-950 hover:bg-white border border-white/20 shadow-sm font-semibold',
      accent:
        'bg-aura-accent text-white hover:bg-aura-accent-hover border border-aura-accent/30 shadow-sm',
      outline:
        'bg-transparent text-aura-400 hover:text-aura-100 border border-aura-700 hover:border-aura-600',
    };

    const sizes = {
      xs: 'w-7 h-7 p-1 text-xs',
      sm: 'w-8 h-8 p-1.5 text-xs',
      md: 'w-10 h-10 p-2 text-sm',
      lg: 'w-12 h-12 p-3 text-base',
    };

    const shapes = {
      circle: 'rounded-full',
      square: 'rounded-xl',
    };

    const activeStyles = active
      ? variant === 'ghost' || variant === 'outline'
        ? 'bg-aura-800 text-aura-accent border-aura-accent/40'
        : 'ring-2 ring-aura-accent/60'
      : '';

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={twMerge(
          clsx(
            baseStyles,
            variants[variant],
            sizes[size],
            shapes[shape],
            activeStyles,
            className
          )
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
