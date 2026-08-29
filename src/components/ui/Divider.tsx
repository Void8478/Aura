import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  label,
  className,
}) => {
  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={twMerge(clsx('w-[1px] h-full bg-aura-800 self-stretch shrink-0', className))}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        className={twMerge(clsx('relative flex items-center w-full my-4', className))}
      >
        <div className="flex-grow border-t border-aura-800" />
        <span className="shrink-0 px-3 text-[11px] font-mono uppercase tracking-wider text-aura-500">
          {label}
        </span>
        <div className="flex-grow border-t border-aura-800" />
      </div>
    );
  }

  return (
    <hr
      className={twMerge(clsx('w-full border-0 border-t border-aura-800 my-4 shrink-0', className))}
    />
  );
};
