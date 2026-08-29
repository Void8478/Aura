import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface WaveformPreviewProps {
  waveform?: number[];
  progress?: number; // 0 to 1
  barsCount?: number;
  interactive?: boolean;
  onSeekRatio?: (ratio: number) => void;
  className?: string;
  activeColor?: string;
  barWidth?: number;
}

export const WaveformPreview: React.FC<WaveformPreviewProps> = ({
  waveform,
  progress = 0,
  barsCount = 28,
  interactive = false,
  onSeekRatio,
  className,
  activeColor = 'bg-aura-accent',
}) => {
  // Generate consistent pseudo-random bars if waveform array is small
  const normalizedBars = React.useMemo(() => {
    if (waveform && waveform.length >= barsCount) {
      return waveform.slice(0, barsCount);
    }
    const seed = waveform ? waveform.reduce((acc, v) => acc + v, 0) : 42;
    const bars: number[] = [];
    for (let i = 0; i < barsCount; i++) {
      if (waveform && i < waveform.length) {
        bars.push(waveform[i]);
      } else {
        const val = 20 + Math.abs(Math.sin((i + seed) * 0.7) * 75);
        bars.push(Math.round(val));
      }
    }
    return bars;
  }, [waveform, barsCount]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !onSeekRatio) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeekRatio(ratio);
  };

  return (
    <div
      onClick={handleClick}
      role={interactive ? 'slider' : undefined}
      aria-valuemin={interactive ? 0 : undefined}
      aria-valuemax={interactive ? 100 : undefined}
      aria-valuenow={interactive ? Math.round(progress * 100) : undefined}
      tabIndex={interactive ? 0 : -1}
      className={twMerge(
        clsx(
          'flex items-center gap-[3px] h-8 w-full select-none',
          interactive && 'cursor-pointer group py-1',
          className
        )
      )}
    >
      {normalizedBars.map((heightPercent, index) => {
        const barProgressRatio = index / normalizedBars.length;
        const isPassed = barProgressRatio <= progress;

        return (
          <div
            key={index}
            className="flex-1 flex items-center justify-center h-full"
          >
            <div
              style={{ height: `${Math.max(15, heightPercent)}%` }}
              className={twMerge(
                clsx(
                  'w-full max-w-[4px] rounded-full transition-all duration-150',
                  isPassed
                    ? activeColor
                    : 'bg-aura-700/60 group-hover:bg-aura-600/70',
                  interactive && 'group-hover:scale-y-110'
                )
              )}
            />
          </div>
        );
      })}
    </div>
  );
};
