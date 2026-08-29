import React, { useRef } from 'react';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { TactileButton } from '../ui/TactileButton';

interface VolumeSliderProps {
  className?: string;
  showReadout?: boolean;
}

export const VolumeSlider: React.FC<VolumeSliderProps> = ({
  className = '',
  showReadout = true,
}) => {
  const { volume, isMuted, setVolume, toggleMute } = usePlayerStore();
  const trackRef = useRef<HTMLDivElement | null>(null);

  const effectiveVolume = isMuted ? 0 : volume;

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    setVolume(ratio);
  };

  const volumePercent = Math.round(effectiveVolume * 100);

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <TactileButton
        variant="ghost"
        size="icon-sm"
        onClick={toggleMute}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
        className="text-aura-400 hover:text-aura-100"
      >
        {isMuted || effectiveVolume === 0 ? (
          <VolumeX className="w-4 h-4 text-aura-500" />
        ) : effectiveVolume < 0.5 ? (
          <Volume1 className="w-4 h-4" />
        ) : (
          <Volume2 className="w-4 h-4" />
        )}
      </TactileButton>

      {/* Volume Slider Track */}
      <div
        ref={trackRef}
        onClick={handleSeek}
        role="slider"
        aria-label="Volume level"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={volumePercent}
        tabIndex={0}
        className="relative w-20 h-5 flex items-center cursor-pointer group"
      >
        <div className="w-full h-1 group-hover:h-1.5 bg-aura-800 rounded-full overflow-hidden transition-all duration-150 relative">
          <div
            style={{ width: `${volumePercent}%` }}
            className="absolute left-0 top-0 bottom-0 bg-aura-300 group-hover:bg-aura-accent rounded-full transition-all duration-75"
          />
        </div>

        {/* Thumb */}
        <div
          style={{ left: `${volumePercent}%` }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none"
        />
      </div>

      {showReadout && (
        <span className="text-[10px] font-mono text-aura-500 w-7 text-left">
          {volumePercent}%
        </span>
      )}
    </div>
  );
};
