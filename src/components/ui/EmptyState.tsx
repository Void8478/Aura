import React from 'react';
import { Music2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <Music2 className="w-10 h-10 text-aura-500 stroke-[1.2]" />,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'p-12 sm:p-16 text-center bg-aura-850/40 rounded-3xl border border-aura-800/80 text-aura-400 space-y-3 flex flex-col items-center justify-center select-none',
          className
        )
      )}
    >
      <div className="mb-1 p-3 rounded-2xl bg-aura-900 border border-aura-800/80 shadow-xs">
        {icon}
      </div>

      <h4 className="font-serif text-xl sm:text-2xl text-aura-100 font-normal">{title}</h4>

      {description && (
        <p className="text-xs sm:text-sm text-aura-400 font-sans max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
      )}

      {action && <div className="pt-2">{action}</div>}
    </div>
  );
};
