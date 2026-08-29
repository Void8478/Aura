import React, { useState } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  isLoading?: boolean;
  shortcutHint?: string;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className,
      value: controlledValue,
      onChange,
      onClear,
      isLoading = false,
      shortcutHint = '⌘K',
      placeholder = 'Search sonic catalog...',
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState('');
    const value = controlledValue !== undefined ? controlledValue : internalValue;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (controlledValue === undefined) setInternalValue(val);
      if (onChange) onChange(val);
    };

    const handleClear = () => {
      if (controlledValue === undefined) setInternalValue('');
      if (onChange) onChange('');
      if (onClear) onClear();
    };

    return (
      <div className={twMerge(clsx('relative flex items-center w-full', className))}>
        <div className="absolute left-3.5 flex items-center pointer-events-none text-aura-500">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-aura-accent" />
          ) : (
            <Search className="w-4 h-4 text-aura-400" />
          )}
        </div>

        <input
          ref={ref}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full bg-aura-850 border border-aura-700/80 rounded-xl pl-10 pr-16 py-2.5 text-sm text-aura-100 placeholder:text-aura-500 transition-all focus:outline-none focus:border-aura-accent focus:ring-2 focus:ring-aura-accent/20"
          {...props}
        />

        <div className="absolute right-3 flex items-center gap-1.5">
          {value ? (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-aura-500 hover:text-aura-200 rounded-md hover:bg-aura-800 transition-colors"
              aria-label="Clear search query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : shortcutHint ? (
            <kbd className="hidden sm:inline-block font-mono text-[10px] bg-aura-800 text-aura-400 px-1.5 py-0.5 rounded border border-aura-700 select-none">
              {shortcutHint}
            </kbd>
          ) : null}
        </div>
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
