import React from 'react';
import { Play } from 'lucide-react';
import type { Album } from '../../types/music';
import { usePlayerStore } from '../../store/usePlayerStore';
import { ArtworkImage } from '../ui/ArtworkImage';
import { Badge } from '../ui/Badge';

export interface AlbumCardProps {
  album: Album;
  onClick?: () => void;
  className?: string;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({ album, onClick, className = '' }) => {
  const { playTrack } = usePlayerStore();

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (album.tracks.length > 0) {
      playTrack(album.tracks[0], album.tracks);
    }
  };

  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer rounded-2xl p-4 bg-aura-850/60 border border-aura-800/80 hover:border-aura-700 transition-all duration-200 tactile-card tactile-card-hover flex flex-col justify-between select-none ${className}`}
    >
      <div>
        <div className="relative aspect-square rounded-xl overflow-hidden mb-3 border border-white/5">
          <ArtworkImage src={album.coverUrl} alt={album.title} />

          {/* Hover Play Action */}
          <button
            onClick={handlePlayClick}
            className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-aura-accent text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0"
            aria-label={`Play album ${album.title}`}
          >
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </button>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-aura-500 mb-1.5">
          <Badge variant="default" size="sm">
            {album.genre}
          </Badge>
          <span>{album.year}</span>
        </div>

        <h4 className="font-serif text-base text-aura-100 font-medium group-hover:text-aura-accent transition-colors line-clamp-1">
          {album.title}
        </h4>
        <p className="text-xs text-aura-400 font-sans mt-0.5 truncate">
          {album.artist}
        </p>
      </div>

      <div className="pt-3 mt-3 border-t border-aura-800/60 flex items-center justify-between text-[11px] font-mono text-aura-500">
        <span>{album.tracks.length} Tracks</span>
        {album.totalDuration && <span>{album.totalDuration}</span>}
      </div>
    </div>
  );
};
