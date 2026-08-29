import React, { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { User } from 'lucide-react';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy' | 'none';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  status = 'none',
  className,
}) => {
  const [hasError, setHasError] = useState(false);

  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl font-serif',
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  };

  const getInitials = (str?: string) => {
    if (!str) return '';
    return str
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className={twMerge(clsx('relative inline-block shrink-0 select-none', className))}>
      <div
        className={twMerge(
          clsx(
            'rounded-full overflow-hidden flex items-center justify-center font-medium bg-aura-800 text-aura-200 border border-aura-700/80 shadow-xs',
            sizes[size]
          )
        )}
      >
        {src && !hasError ? (
          <img
            src={src}
            alt={alt}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover"
          />
        ) : name ? (
          <span>{getInitials(name)}</span>
        ) : (
          <User className="w-1/2 h-1/2 text-aura-500" />
        )}
      </div>

      {status !== 'none' && (
        <span
          className={twMerge(
            clsx(
              'absolute bottom-0 right-0 rounded-full ring-2 ring-aura-900',
              statusSizes[size],
              status === 'online' && 'bg-emerald-500',
              status === 'offline' && 'bg-aura-600',
              status === 'busy' && 'bg-aura-accent'
            )
          )}
        />
      )}
    </div>
  );
};
