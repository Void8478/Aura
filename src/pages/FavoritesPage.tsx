import React from 'react';
import { Heart, Play } from 'lucide-react';
import { useLibraryStore } from '../store/useLibraryStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { CURATED_TRACKS } from '../data/mockData';
import { TrackRow } from '../components/common/TrackRow';
import { TactileButton } from '../components/ui/TactileButton';

export const FavoritesPage: React.FC = () => {
  const { favorites } = useLibraryStore();
  const { playTrack } = usePlayerStore();

  const favoriteTracks = CURATED_TRACKS.filter((t) => favorites.includes(t.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-aura-800 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-aura-accent">
            Saved Gems
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-aura-100 font-normal mt-1">
            Favorites & Starred Recordings
          </h1>
          <p className="text-sm text-aura-400 font-sans mt-2">
            Your personally curated selection of resonant audio pieces.
          </p>
        </div>

        {favoriteTracks.length > 0 && (
          <TactileButton
            variant="primary"
            size="md"
            onClick={() => playTrack(favoriteTracks[0], favoriteTracks)}
            className="gap-2 shrink-0"
          >
            <Play className="w-4 h-4 fill-current" />
            Play All ({favoriteTracks.length})
          </TactileButton>
        )}
      </div>

      {favoriteTracks.length === 0 ? (
        <div className="p-16 text-center bg-aura-850/40 rounded-3xl border border-aura-800 text-aura-400 space-y-2">
          <Heart className="w-8 h-8 mx-auto text-aura-600 stroke-[1.2]" />
          <h4 className="font-serif text-lg text-aura-200">No favorite recordings yet</h4>
          <p className="text-xs text-aura-500 max-w-sm mx-auto">
            Click the heart icon or press <kbd className="font-mono bg-aura-800 px-1 py-0.5 rounded">L</kbd> on any track to save it here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-aura-800/40">
          {favoriteTracks.map((track, idx) => (
            <TrackRow
              key={track.id}
              track={track}
              index={idx}
              playlistContext={favoriteTracks}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
