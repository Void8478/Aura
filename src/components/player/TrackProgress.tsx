import React, { useState, useRef } from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { formatTime } from '../../utils/formatters';

interface TrackProgressProps {
  showTimestamps?: boolean;
  className?: string;
}

export const TrackProgress: React.FC<TrackProgressProps> = ({
  showTimestamps = true,
  className = '',
}) => {
  const { currentTime, duration, buffered, seek } = usePlayerStore();
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const barRef = useRef<HTMLDivElement | null>(null);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedPercent = duration > 0 ? (buffered / duration) * 100 : 0;

  const getPositionFromEvent = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!barRef.current) return 0;
    const rect = barRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    return Math.max(0, Math.min(1, clickX / rect.width));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const ratio = getPositionFromEvent(e);
    setHoverPosition(ratio);
    if (isDragging) {
      seek(ratio * duration);
    }
  };

  const handleMouseLeave = () => {
    setHoverPosition(null);
    setIsDragging(false);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const ratio = getPositionFromEvent(e);
    seek(ratio * duration);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className={`flex items-center gap-3 w-full select-none ${className}`}>
      {showTimestamps && (
        <span className="text-[11px] font-mono text-aura-400 w-10 text-right shrink-0">
          {formatTime(currentTime)}
        </span>
      )}

      {/* Progress Track */}
      <div
        ref={barRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        role="slider"
        aria-label="Track playback seeker"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(currentTime)}
        tabIndex={0}
        className="relative flex-1 h-6 flex items-center cursor-pointer group"
      >
        {/* Track background */}
        <div className="w-full h-1 group-hover:h-1.5 bg-aura-800 rounded-full overflow-hidden transition-all duration-150 relative">
          {/* Buffered Progress */}
          <div
            style={{ width: `${bufferedPercent}%` }}
            className="absolute left-0 top-0 bottom-0 bg-aura-700/60 rounded-full transition-all duration-300"
          />

          {/* Played Progress */}
          <div
            style={{ width: `${progressPercent}%` }}
            className="absolute left-0 top-0 bottom-0 bg-aura-100 group-hover:bg-aura-accent rounded-full transition-all duration-75"
          />
        </div>

        {/* Tactile Handle / Thumb */}
        <div
          style={{ left: `${progressPercent}%` }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none border border-black/20"
        />

        {/* Hover Time Tooltip */}
        {hoverPosition !== null && (
          <div
            style={{ left: `${hoverPosition * 100}%` }}
            className="absolute -top-7 -translate-x-1/2 bg-aura-950 text-aura-100 font-mono text-[10px] px-1.5 py-0.5 rounded border border-aura-700 shadow-md pointer-events-none"
          >
            {formatTime(hoverPosition * duration)}
          </div>
        )}
      </div>

      {showTimestamps && (
        <span className="text-[11px] font-mono text-aura-500 w-10 text-left shrink-0">
          {formatTime(duration)}
        </span>
      )}
    </div>
  );
};
