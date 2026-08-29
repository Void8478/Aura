import React, { useState } from 'react';
import { Search as SearchIcon, Music } from 'lucide-react';
import { searchJamendoTracks } from '../services/jamendoApi';
import { CURATED_TRACKS } from '../data/mockData';
import type { Track } from '../types/music';
import { TrackRow } from '../components/common/TrackRow';
import { usePlayerStore } from '../store/usePlayerStore';
import { TactileButton } from '../components/ui/TactileButton';

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>(CURATED_TRACKS);
  const [isSearching, setIsSearching] = useState(false);
  const { playTrack } = usePlayerStore();

  React.useEffect(() => {
    if (!query.trim()) {
      setResults(CURATED_TRACKS);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await searchJamendoTracks(query, 20);
        setResults(data);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      <div className="border-b border-aura-800 pb-6">
        <span className="text-xs font-mono uppercase tracking-wider text-aura-accent">
          Query Palette
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-aura-100 font-normal mt-1">
          Catalog Search
        </h1>
        <p className="text-sm text-aura-400 mt-2">
          Search the entire sonic archive by title, composer, instrument, or acoustic timbre.
        </p>

        <div className="mt-6 relative max-w-2xl">
          <SearchIcon className="w-4 h-4 text-aura-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type artist, genre, instrument, or atmosphere..."
            className="w-full bg-aura-850 border border-aura-700 rounded-xl pl-10 pr-4 py-3 text-sm text-aura-100 placeholder:text-aura-500 focus:outline-none focus:border-aura-accent"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono text-aura-400">
            {isSearching ? 'Searching...' : `${results.length} Dispatches Found`}
          </span>
          {results.length > 0 && (
            <TactileButton
              variant="secondary"
              size="sm"
              onClick={() => playTrack(results[0], results)}
            >
              Play Results
            </TactileButton>
          )}
        </div>

        {results.length === 0 ? (
          <div className="p-16 text-center bg-aura-850/40 rounded-2xl border border-aura-800 text-aura-500">
            <Music className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>No results found for "{query}"</p>
          </div>
        ) : (
          <div className="divide-y divide-aura-800/40">
            {results.map((track, idx) => (
              <TrackRow
                key={track.id}
                track={track}
                index={idx}
                playlistContext={results}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
