import React, { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Disc3 } from 'lucide-react';

interface ArtworkImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
  showSpinEffect?: boolean;
}

export const ArtworkImage: React.FC<ArtworkImageProps> = ({
  src,
  alt = 'Album artwork',
  className,
  aspectRatio = 'square',
  showSpinEffect = false,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    auto: '',
  };

  return (
    <div
      className={twMerge(
        clsx(
          'relative overflow-hidden bg-aura-850 rounded-lg border border-white/5 select-none',
          aspectClasses[aspectRatio],
          className
        )
      )}
    >
      {/* Fallback placeholder state */}
      {(!isLoaded || hasError) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-aura-850 text-aura-600 animate-pulse">
          <Disc3 className="w-8 h-8 opacity-40 animate-spin-slow" />
        </div>
      )}

      {/* Actual Artwork */}
      {!hasError && src && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={twMerge(
            clsx(
              'w-full h-full object-cover transition-opacity duration-300',
              isLoaded ? 'opacity-100' : 'opacity-0',
              showSpinEffect && 'rounded-full'
            )
          )}
          {...props}
        />
      )}

      {/* Subtle paper / sheen overlay for tactile realism */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 via-transparent to-white/5 opacity-60" />
    </div>
  );
};
