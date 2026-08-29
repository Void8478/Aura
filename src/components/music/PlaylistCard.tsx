import React from 'react';
import { Play, FolderPlus } from 'lucide-react';
import type { Crate } from '../../types/music';
import { usePlayerStore } from '../../store/usePlayerStore';
import { ArtworkImage } from '../ui/ArtworkImage';

export interface PlaylistCardProps {
  crate: Crate;
  onClick?: () => void;
  className?: string;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({ crate, onClick, className = '' }) => {
  const { playTrack } = usePlayerStore();

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (crate.tracks.length > 0) {
      playTrack(crate.tracks[0], crate.tracks);
    }
  };

  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer rounded-2xl p-5 bg-aura-850/70 border border-aura-800/80 hover:border-aura-700 transition-all duration-200 tactile-card tactile-card-hover flex flex-col justify-between select-none ${className}`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <span
            style={{
              backgroundColor: `${crate.colorTag || '#e07a5f'}20`,
              color: crate.colorTag || '#e07a5f',
            }}
            className="text-[10px] font-mono px-2 py-0.5 rounded border border-white/10 uppercase"
          >
            {crate.tracks.length} {crate.tracks.length === 1 ? 'Track' : 'Tracks'}
          </span>
          <span className="text-[10px] font-mono text-aura-500">{crate.createdAt}</span>
        </div>

        <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-4 border border-white/5 bg-aura-900">
          {crate.coverUrl ? (
            <ArtworkImage src={crate.coverUrl} alt={crate.title} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-aura-600">
              <FolderPlus className="w-8 h-8 opacity-40" />
            </div>
          )}

          <button
            onClick={handlePlay}
            className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-aura-accent text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0"
            aria-label={`Play crate ${crate.title}`}
          >
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </button>
        </div>

        <h4 className="font-serif text-lg text-aura-100 font-medium group-hover:text-aura-accent transition-colors line-clamp-1">
          {crate.title}
        </h4>
        <p className="text-xs text-aura-400 font-sans mt-1 leading-relaxed line-clamp-2">
          {crate.description || 'Curated personal listening selection.'}
        </p>
      </div>

      <div className="pt-3 mt-3 border-t border-aura-800/60 flex items-center justify-between">
        <div className="flex -space-x-1.5 overflow-hidden">
          {crate.tracks.slice(0, 3).map((t, i) => (
            <img
              key={i}
              src={t.coverUrl}
              alt={t.title}
              className="inline-block h-5 w-5 rounded-full ring-2 ring-aura-900 object-cover"
            />
          ))}
        </div>

        <span className="text-[11px] font-mono text-aura-500">AURA Crate</span>
      </div>
    </div>
  );
};
