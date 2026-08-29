import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'amber' | 'mono' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className,
}) => {
  const baseStyles = 'inline-flex items-center font-medium uppercase tracking-wider rounded';

  const variants = {
    default: 'bg-aura-800 text-aura-300 border border-aura-700/60',
    accent: 'bg-aura-accent/15 text-aura-accent border border-aura-accent/30',
    amber: 'bg-aura-amber/15 text-aura-amber border border-aura-amber/30',
    mono: 'bg-aura-950/80 text-aura-400 border border-aura-700 font-mono tracking-normal lowercase',
    outline: 'border border-aura-600/60 text-aura-300 bg-transparent',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 font-semibold',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}>
      {children}
    </span>
  );
};
