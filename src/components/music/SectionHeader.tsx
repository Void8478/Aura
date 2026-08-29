import React from 'react';
import { ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  subtitle,
  actionText,
  onAction,
  className,
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-aura-800/80 pb-4 mb-6 select-none',
          className
        )
      )}
    >
      <div>
        {eyebrow && (
          <span className="block text-[11px] font-mono uppercase tracking-wider text-aura-accent mb-1 font-medium">
            {eyebrow}
          </span>
        )}
        <h3 className="font-serif text-2xl sm:text-3xl text-aura-100 font-medium leading-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs sm:text-sm text-aura-400 font-sans mt-1 max-w-xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {actionText && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-aura-300 hover:text-aura-accent transition-colors shrink-0 group self-start sm:self-auto"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
};
