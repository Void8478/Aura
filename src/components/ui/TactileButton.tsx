import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface TactileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'icon-sm' | 'icon-md' | 'icon-lg';
  active?: boolean;
}

export const TactileButton = React.forwardRef<HTMLButtonElement, TactileButtonProps>(
  ({ className, variant = 'secondary', size = 'md', active, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aura-accent focus-visible:ring-offset-2 focus-visible:ring-offset-aura-900 disabled:opacity-40 disabled:pointer-events-none select-none active:scale-[0.97]';

    const variants = {
      primary:
        'bg-aura-100 text-aura-950 hover:bg-aura-50 shadow-sm border border-white/20 font-semibold',
      secondary:
        'bg-aura-850 text-aura-200 border border-aura-700/70 hover:bg-aura-800 hover:text-aura-100 hover:border-aura-600 shadow-sm',
      accent:
        'bg-aura-accent text-white hover:bg-aura-accent-hover shadow-sm border border-aura-accent/30',
      ghost:
        'text-aura-400 hover:text-aura-100 hover:bg-aura-800/60 border border-transparent',
      icon:
        'text-aura-400 hover:text-aura-100 hover:bg-aura-800/80 border border-transparent rounded-full',
    };

    const activeStyles = active
      ? variant === 'ghost' || variant === 'icon'
        ? 'bg-aura-800 text-aura-accent border-aura-700'
        : 'ring-1 ring-aura-accent/50 border-aura-accent/40 text-aura-accent'
      : '';

    const sizes = {
      sm: 'text-xs px-2.5 py-1.5 rounded-md gap-1.5 tracking-wide',
      md: 'text-sm px-3.5 py-2 rounded-lg gap-2',
      lg: 'text-base px-5 py-2.5 rounded-lg gap-2.5 font-medium',
      'icon-sm': 'w-8 h-8 rounded-full p-1.5',
      'icon-md': 'w-10 h-10 rounded-full p-2',
      'icon-lg': 'w-12 h-12 rounded-full p-3',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={twMerge(clsx(baseStyles, variants[variant], sizes[size], activeStyles, className))}
        {...props}
      >
        {children}
      </button>
    );
  }
);

TactileButton.displayName = 'TactileButton';
