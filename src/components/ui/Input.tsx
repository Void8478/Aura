import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, error, leftIcon, rightIcon, id, disabled, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full space-y-1.5 font-sans">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-mono uppercase tracking-wider text-aura-300 font-medium"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-aura-500">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={twMerge(
              clsx(
                'w-full bg-aura-850 border rounded-xl py-2.5 text-sm text-aura-100 placeholder:text-aura-500 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-aura-accent/30',
                leftIcon ? 'pl-10' : 'pl-3.5',
                rightIcon ? 'pr-10' : 'pr-3.5',
                error
                  ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-aura-700/80 focus:border-aura-accent',
                disabled && 'opacity-40 cursor-not-allowed bg-aura-900',
                className
              )
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3.5 flex items-center text-aura-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error && <p className="text-xs text-rose-400 font-sans">{error}</p>}
        {!error && helperText && <p className="text-xs text-aura-500 font-sans">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
