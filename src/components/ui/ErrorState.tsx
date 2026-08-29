import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from './Button';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Acoustic Stream Disruption',
  message = 'We encountered an issue loading this recording stem. Check your connection or retry.',
  onRetry,
  className,
}) => {
  return (
    <div
      role="alert"
      className={twMerge(
        clsx(
          'p-10 sm:p-14 text-center bg-rose-950/20 border border-rose-900/50 rounded-3xl text-aura-300 space-y-4 flex flex-col items-center justify-center',
          className
        )
      )}
    >
      <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-rose-400">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <div>
        <h4 className="font-serif text-xl text-aura-100 font-medium">{title}</h4>
        <p className="text-xs sm:text-sm text-aura-400 font-sans mt-1.5 max-w-sm mx-auto leading-relaxed">
          {message}
        </p>
      </div>

      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          Retry Connection
        </Button>
      )}
    </div>
  );
};
