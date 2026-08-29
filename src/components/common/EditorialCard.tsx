import React from 'react';
import { Play, Disc, ArrowUpRight } from 'lucide-react';
import type { Track } from '../../types/music';
import { usePlayerStore } from '../../store/usePlayerStore';
import { ArtworkImage } from '../ui/ArtworkImage';
import { Badge } from '../ui/Badge';
import { TactileButton } from '../ui/TactileButton';

interface EditorialCardProps {
  track: Track;
  layout?: 'feature-large' | 'dispatch-split' | 'compact-rail';
  curatorQuote?: string;
  onSelectRelease?: () => void;
}

export const EditorialCard: React.FC<EditorialCardProps> = ({
  track,
  layout = 'dispatch-split',
  curatorQuote,
  onSelectRelease,
}) => {
  const { playTrack } = usePlayerStore();

  if (layout === 'feature-large') {
    return (
      <div className="relative group rounded-3xl overflow-hidden bg-aura-850 border border-aura-700/80 shadow-aura-elevated tactile-card tactile-card-hover">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8 items-center">
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <ArtworkImage src={track.coverUrl} alt={track.title} />
              <button
                onClick={() => playTrack(track)}
                className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-aura-accent text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                aria-label={`Play ${track.title}`}
              >
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="accent">Featured Selection</Badge>
                <Badge variant="default">{track.genre}</Badge>
                {track.mood && <Badge variant="amber">{track.mood}</Badge>}
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-aura-100 font-medium leading-tight">
                {track.title}
              </h3>
              <p className="text-base text-aura-300 font-sans mt-1">
                By <strong className="text-aura-100 font-semibold">{track.artist}</strong>
              </p>
              <p className="text-xs text-aura-500 font-mono mt-0.5">
                Album: {track.album}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-aura-900/80 border border-aura-800 text-sm text-aura-300 italic font-serif leading-relaxed">
              {curatorQuote || track.curatorNote || track.storyQuote}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <TactileButton
                variant="primary"
                size="md"
                onClick={() => playTrack(track)}
                className="gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                Listen Now
              </TactileButton>

              {onSelectRelease && (
                <TactileButton
                  variant="secondary"
                  size="md"
                  onClick={onSelectRelease}
                  className="gap-1.5"
                >
                  <Disc className="w-4 h-4" />
                  View Liner Notes
                </TactileButton>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group rounded-2xl overflow-hidden bg-aura-850/80 border border-aura-700/60 hover:border-aura-600 transition-all duration-200 flex flex-col justify-between p-5 tactile-card tactile-card-hover">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="default">{track.genre}</Badge>
          <span className="text-[11px] font-mono text-aura-500">{track.mood}</span>
        </div>

        <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/5">
          <ArtworkImage src={track.coverUrl} alt={track.title} />
          <button
            onClick={() => playTrack(track)}
            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label={`Play ${track.title}`}
          >
            <div className="w-12 h-12 rounded-full bg-aura-accent text-white flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>
          </button>
        </div>

        <div>
          <h4 className="font-serif text-lg text-aura-100 font-medium group-hover:text-aura-accent transition-colors line-clamp-1">
            {track.title}
          </h4>
          <p className="text-xs text-aura-400 font-sans mt-0.5">
            {track.artist}
          </p>
        </div>

        {track.curatorNote && (
          <p className="text-xs text-aura-400 line-clamp-2 leading-relaxed italic font-serif">
            "{track.curatorNote}"
          </p>
        )}
      </div>

      <div className="pt-4 mt-2 border-t border-aura-800 flex items-center justify-between text-[11px] font-mono text-aura-500">
        <span>{track.bpm ? `${track.bpm} BPM` : 'Ambient'}</span>
        <button
          onClick={() => playTrack(track)}
          className="flex items-center gap-1 text-aura-400 hover:text-aura-accent font-sans font-medium"
        >
          Stream <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
