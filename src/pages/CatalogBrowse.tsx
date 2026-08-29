import React, { useState, useMemo } from 'react';
import { Search, Play, Grid, List, RotateCcw, Music } from 'lucide-react';
import type { Genre, Mood, Track } from '../types/music';
import { CURATED_TRACKS } from '../services/mockCatalog';
import { searchJamendoTracks } from '../services/jamendoApi';
import { usePlayerStore } from '../store/usePlayerStore';
import { TrackRow } from '../components/common/TrackRow';
import { EditorialCard } from '../components/common/EditorialCard';
import { TactileButton } from '../components/ui/TactileButton';

const GENRES: (Genre | 'All')[] = [
  'All',
  'Ambient',
  'Lo-Fi',
  'Neo-Classical',
  'Electronic',
  'Jazz Fusion',
  'Downtempo',
  'Minimalism',
  'Post-Rock',
];

const MOODS: (Mood | 'All')[] = [
  'All',
  'Late Night',
  'Deep Focus',
  'Hypnotic',
  'Melancholic',
  'Ethereal',
  'Warm & Analog',
  'Meditative',
  'Urban Drift',
];

export const CatalogBrowse: React.FC = () => {
  const { playTrack } = usePlayerStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<Genre | 'All'>('All');
  const [selectedMood, setSelectedMood] = useState<Mood | 'All'>('All');
  const [maxBpm, setMaxBpm] = useState<number>(140);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [liveTracks, setLiveTracks] = useState<Track[]>(CURATED_TRACKS);

  React.useEffect(() => {
    if (!searchQuery.trim()) {
      setLiveTracks(CURATED_TRACKS);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const results = await searchJamendoTracks(searchQuery, 25);
        setLiveTracks(results);
      } catch (err) {
        console.warn('Search failed:', err);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredTracks = useMemo(() => {
    return liveTracks.filter((track) => {
      const matchGenre = selectedGenre === 'All' || track.genre === selectedGenre;
      const matchMood = selectedMood === 'All' || track.mood === selectedMood;
      const matchBpm = !track.bpm || track.bpm <= maxBpm;
      return matchGenre && matchMood && matchBpm;
    });
  }, [liveTracks, selectedGenre, selectedMood, maxBpm]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedGenre('All');
    setSelectedMood('All');
    setMaxBpm(140);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-aura-800/80 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-aura-accent">
            The Sound Archive
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-aura-100 font-normal mt-1">
            Dispatches & Audio Catalog
          </h1>
          <p className="text-sm text-aura-400 font-sans mt-2 max-w-xl">
            Explore conscious releases filtered by acoustic genre, mood resonance, and tempo.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {filteredTracks.length > 0 && (
            <TactileButton
              variant="primary"
              size="md"
              onClick={() => playTrack(filteredTracks[0], filteredTracks)}
              className="gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              Stream Filtered ({filteredTracks.length})
            </TactileButton>
          )}

          <div className="flex items-center gap-1 bg-aura-850 p-1 rounded-xl border border-aura-700/80">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-aura-800 text-aura-100 border border-aura-700'
                  : 'text-aura-400 hover:text-aura-200'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-aura-800 text-aura-100 border border-aura-700'
                  : 'text-aura-400 hover:text-aura-200'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-aura-850/70 border border-aura-800/80 rounded-2xl p-5 md:p-6 space-y-6 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-aura-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audio archive by keyword, instrument, or composer..."
            className="w-full bg-aura-900 border border-aura-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-aura-100 placeholder:text-aura-500 focus:outline-none focus:border-aura-accent"
          />
        </div>

        <div>
          <span className="block text-[11px] font-mono uppercase tracking-wider text-aura-400 mb-2">
            Acoustic Genre
          </span>
          <div className="flex flex-wrap gap-1.5">
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedGenre === genre
                    ? 'bg-aura-100 text-aura-950 font-semibold'
                    : 'bg-aura-900 text-aura-400 hover:text-aura-200 border border-aura-800'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2 border-t border-aura-800/60">
          <div className="md:col-span-8">
            <span className="block text-[11px] font-mono uppercase tracking-wider text-aura-400 mb-2">
              Atmosphere & Mood
            </span>
            <div className="flex flex-wrap gap-1.5">
              {MOODS.map((mood) => (
                <button
                  key={mood}
                  onClick={() => setSelectedMood(mood)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedMood === mood
                      ? 'bg-aura-accent text-white font-semibold'
                      : 'bg-aura-900 text-aura-400 hover:text-aura-200 border border-aura-800'
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-aura-400">
                Max Tempo
              </span>
              <span className="font-mono text-xs text-aura-200">{maxBpm} BPM</span>
            </div>
            <input
              type="range"
              min="50"
              max="140"
              step="5"
              value={maxBpm}
              onChange={(e) => setMaxBpm(Number(e.target.value))}
              className="w-full accent-aura-accent cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-aura-500 mt-1">
              <span>50 BPM (Ambient)</span>
              <span>140 BPM (Fast)</span>
            </div>
          </div>
        </div>

        {(selectedGenre !== 'All' || selectedMood !== 'All' || maxBpm < 140 || searchQuery) && (
          <div className="flex items-center justify-between pt-3 border-t border-aura-800/40 text-xs text-aura-400">
            <span>
              Filtering: <strong className="text-aura-200">{filteredTracks.length}</strong> matching records
            </span>
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-aura-accent hover:underline font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset filters
            </button>
          </div>
        )}
      </div>

      {filteredTracks.length === 0 ? (
        <div className="p-16 text-center bg-aura-850/40 rounded-3xl border border-aura-800/80 text-aura-400 space-y-3">
          <Music className="w-10 h-10 mx-auto text-aura-600 stroke-[1.2]" />
          <h3 className="font-serif text-xl text-aura-200">No matching audio records</h3>
          <p className="text-xs text-aura-500 max-w-sm mx-auto">
            Try adjusting your tempo limit or selecting "All" to browse the full master archive.
          </p>
          <TactileButton variant="secondary" size="sm" onClick={handleResetFilters} className="mt-2">
            Reset Filters
          </TactileButton>
        </div>
      ) : viewMode === 'list' ? (
        <div className="space-y-1 divide-y divide-aura-800/40">
          {filteredTracks.map((track, index) => (
            <TrackRow
              key={track.id}
              track={track}
              index={index}
              playlistContext={filteredTracks}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTracks.map((track) => (
            <EditorialCard key={track.id} track={track} layout="dispatch-split" />
          ))}
        </div>
      )}
    </div>
  );
};
