import React, { useEffect } from 'react';
import { History, Trash2, Play } from 'lucide-react';
import { useLibraryStore } from '../store/useLibraryStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { TrackRow } from '../components/common/TrackRow';
import { TactileButton } from '../components/ui/TactileButton';

export const RecentPage: React.FC = () => {
  const { recentlyPlayed, clearHistory } = useLibraryStore();
  const { playTrack } = usePlayerStore();

  useEffect(() => {
    document.title = 'Recent — AURA';
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-aura-800 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-aura-accent">
            Playback Timeline
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-aura-100 font-normal mt-1">
            Recently Played Dispatches
          </h1>
          <p className="text-sm text-aura-400 font-sans mt-2">
            Chronological listening history preserved in local storage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {recentlyPlayed.length > 0 && (
            <>
              <TactileButton
                variant="primary"
                size="sm"
                onClick={() => playTrack(recentlyPlayed[0], recentlyPlayed)}
                className="gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Resume Queue
              </TactileButton>
              <TactileButton
                variant="ghost"
                size="sm"
                onClick={clearHistory}
                className="text-aura-500 hover:text-aura-300 gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </TactileButton>
            </>
          )}
        </div>
      </div>

      {recentlyPlayed.length === 0 ? (
        <div className="p-16 text-center bg-aura-850/40 rounded-3xl border border-aura-800 text-aura-500 space-y-2">
          <History className="w-8 h-8 mx-auto text-aura-600 stroke-[1.2]" />
          <h4 className="font-serif text-lg text-aura-200">No recent playback history</h4>
          <p className="text-xs text-aura-500">
            Start listening to any record to populate your timeline.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-aura-800/40">
          {recentlyPlayed.map((track, idx) => (
            <TrackRow
              key={`${track.id}-${idx}`}
              track={track}
              index={idx}
              playlistContext={recentlyPlayed}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentPage;
