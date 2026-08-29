import React from 'react';
import { Play, MapPin } from 'lucide-react';
import { ArtworkImage } from '../ui/ArtworkImage';
import { Badge } from '../ui/Badge';

export interface ArtistCardProps {
  name: string;
  location?: string;
  genre?: string;
  artworkUrl: string;
  tracksCount?: number;
  onClick?: () => void;
  className?: string;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({
  name,
  location,
  genre,
  artworkUrl,
  tracksCount,
  onClick,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer p-4 rounded-2xl bg-aura-850/60 border border-aura-800/80 hover:border-aura-700 transition-all duration-200 tactile-card tactile-card-hover flex flex-col items-center text-center select-none ${className}`}
    >
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-4 border-2 border-aura-700/80 shadow-md">
        <ArtworkImage src={artworkUrl} alt={name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <div className="w-10 h-10 rounded-full bg-aura-accent text-white flex items-center justify-center shadow-lg">
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </div>
        </div>
      </div>

      <h4 className="font-serif text-base text-aura-100 font-medium group-hover:text-aura-accent transition-colors line-clamp-1">
        {name}
      </h4>

      {location && (
        <p className="text-xs text-aura-400 font-sans mt-0.5 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-aura-accent" />
          {location}
        </p>
      )}

      <div className="flex items-center gap-2 mt-3">
        {genre && <Badge variant="default" size="sm">{genre}</Badge>}
        {tracksCount !== undefined && (
          <span className="text-[10px] font-mono text-aura-500">
            {tracksCount} {tracksCount === 1 ? 'Cut' : 'Cuts'}
          </span>
        )}
      </div>
    </div>
  );
};
