import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'rounded';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rounded',
  ...props
}) => {
  const variants = {
    rectangular: 'rounded-none',
    circular: 'rounded-full',
    rounded: 'rounded-xl',
  };

  return (
    <div
      className={twMerge(
        clsx(
          'animate-pulse bg-aura-800/60 border border-white/5',
          variants[variant],
          className
        )
      )}
      {...props}
    />
  );
};

export const TrackRowSkeleton: React.FC = () => (
  <div className="flex items-center gap-3 p-3 rounded-xl">
    <Skeleton className="w-7 h-7 rounded-full shrink-0" />
    <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-1/4" />
    </div>
    <Skeleton className="h-4 w-12 shrink-0" />
  </div>
);

export const AlbumCardSkeleton: React.FC = () => (
  <div className="p-4 rounded-2xl bg-aura-850/40 border border-aura-800 space-y-3">
    <Skeleton className="aspect-square w-full rounded-xl" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-3 w-1/2" />
  </div>
);
