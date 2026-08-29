import React from 'react';
import { Play, Pause, Heart, Plus } from 'lucide-react';
import type { Track } from '../../types/music';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useLibraryStore } from '../../store/useLibraryStore';
import { ArtworkImage } from '../ui/ArtworkImage';
import { Badge } from '../ui/Badge';
import { TactileButton } from '../ui/TactileButton';
import { formatTime, formatBpm } from '../../utils/formatters';

interface TrackRowProps {
  track: Track;
  index?: number;
  showCover?: boolean;
  showAlbum?: boolean;
  showBpm?: boolean;
  showWaveform?: boolean;
  playlistContext?: Track[];
}

export const TrackRow: React.FC<TrackRowProps> = ({
  track,
  index,
  showCover = true,
  showAlbum = true,
  showBpm = true,
  playlistContext,
}) => {
  const { currentTrack, isPlaying, playTrack, addToQueueNext } = usePlayerStore();
  const { isFavorite, toggleFavorite } = useLibraryStore();

  const isCurrent = currentTrack?.id === track.id;
  const isLiked = isFavorite(track.id);

  const handlePlayClick = () => {
    if (isCurrent) {
      usePlayerStore.getState().togglePlay();
    } else {
      playTrack(track, playlistContext);
    }
  };

  return (
    <div
      className={`group flex items-center justify-between p-2.5 sm:p-3 rounded-xl transition-all duration-150 select-none ${
        isCurrent
          ? 'bg-aura-850 border border-aura-accent/30 shadow-sm'
          : 'hover:bg-aura-850/70 border border-transparent'
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <div className="w-7 h-7 flex items-center justify-center shrink-0">
          <button
            onClick={handlePlayClick}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
              isCurrent
                ? 'bg-aura-accent text-white shadow-sm'
                : 'text-aura-400 group-hover:bg-aura-800 group-hover:text-aura-100'
            }`}
            aria-label={isCurrent && isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
          >
            {isCurrent && isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play
                className={`w-3.5 h-3.5 fill-current ${
                  !isCurrent ? 'hidden group-hover:block ml-0.5' : 'ml-0.5'
                }`}
              />
            )}
            {!isCurrent && (
              <span className="text-xs font-mono text-aura-500 group-hover:hidden">
                {index !== undefined ? (index + 1).toString().padStart(2, '0') : '—'}
              </span>
            )}
          </button>
        </div>

        {showCover && (
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg overflow-hidden shrink-0 border border-white/5 shadow-sm">
            <ArtworkImage src={track.coverUrl} alt={track.title} />
          </div>
        )}

        <div className="min-w-0 flex-1 pr-2">
          <div className="flex items-center gap-2">
            <span
              onClick={handlePlayClick}
              className={`text-sm sm:text-base font-medium truncate cursor-pointer hover:text-aura-accent transition-colors ${
                isCurrent ? 'text-aura-accent font-semibold' : 'text-aura-100'
              }`}
            >
              {track.title}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-aura-400 mt-0.5 truncate font-sans">
            <span>{track.artist}</span>
            {showAlbum && track.album && (
              <>
                <span className="text-aura-600">•</span>
                <span className="text-aura-500 hidden sm:inline truncate">{track.album}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2 shrink-0 px-3">
        <Badge variant="default">{track.genre}</Badge>
        {showBpm && track.bpm && <Badge variant="mono">{formatBpm(track.bpm)}</Badge>}
        {track.musicalKey && (
          <span className="text-[11px] font-mono text-aura-500 hidden lg:inline">
            {track.musicalKey}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <span className="text-xs font-mono text-aura-400 w-12 text-right">
          {formatTime(track.duration)}
        </span>

        <TactileButton
          variant="ghost"
          size="icon-sm"
          onClick={() => toggleFavorite(track.id)}
          aria-label="Favorite"
          className={isLiked ? 'text-aura-accent' : 'text-aura-500 group-hover:text-aura-300'}
        >
          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
        </TactileButton>

        <TactileButton
          variant="ghost"
          size="icon-sm"
          onClick={() => addToQueueNext(track)}
          aria-label="Play Next"
          title="Play next in queue"
          className="hidden sm:flex text-aura-500 hover:text-aura-200"
        >
          <Plus className="w-3.5 h-3.5" />
        </TactileButton>
      </div>
    </div>
  );
};
