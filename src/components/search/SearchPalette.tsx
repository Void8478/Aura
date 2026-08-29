import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Play, Heart, Plus, Loader2, Music } from 'lucide-react';
import type { Track, Genre } from '../../types/music';
import { searchJamendoTracks } from '../../services/jamendoApi';
import { CURATED_TRACKS } from '../../services/mockCatalog';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useLibraryStore } from '../../store/useLibraryStore';
import { ArtworkImage } from '../ui/ArtworkImage';
import { Badge } from '../ui/Badge';
import { formatTime } from '../../utils/formatters';

const GENRE_FILTERS: (Genre | 'All')[] = [
  'All',
  'Ambient',
  'Lo-Fi',
  'Neo-Classical',
  'Electronic',
  'Jazz Fusion',
  'Downtempo',
  'Minimalism',
];

export const SearchPalette: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, playTrack, addToQueueNext } = usePlayerStore();
  const { isFavorite, toggleFavorite } = useLibraryStore();

  const [query, setQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<Genre | 'All'>('All');
  const [results, setResults] = useState<Track[]>(CURATED_TRACKS);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedGenre('All');
      setResults(CURATED_TRACKS);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) return;

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        let tracks: Track[];
        if (!query.trim()) {
          tracks = CURATED_TRACKS;
        } else {
          tracks = await searchJamendoTracks(query, 20);
        }

        if (selectedGenre !== 'All') {
          tracks = tracks.filter((t) => t.genre === selectedGenre);
        }

        setResults(tracks);
      } catch (err) {
        console.warn('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, selectedGenre, isSearchOpen]);

  const handleSelectTrack = (track: Track) => {
    playTrack(track, results);
    setIsSearchOpen(false);
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSearchOpen(false)}
            className="fixed inset-0 bg-aura-950/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl bg-aura-900 border border-aura-700/80 rounded-2xl shadow-aura-deck overflow-hidden z-10 flex flex-col max-h-[80vh]"
          >
            <div className="flex items-center px-5 py-4 border-b border-aura-800 bg-aura-950/50 gap-3">
              {isSearching ? (
                <Loader2 className="w-5 h-5 text-aura-accent animate-spin shrink-0" />
              ) : (
                <Search className="w-5 h-5 text-aura-400 shrink-0" />
              )}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by artist, title, sonic mood, or instrument..."
                className="w-full bg-transparent text-base text-aura-100 placeholder:text-aura-500 focus:outline-none font-sans"
              />
              <kbd className="hidden sm:inline-block px-2 py-0.5 bg-aura-800 border border-aura-700 text-aura-400 font-mono text-[11px] rounded">
                ESC
              </kbd>
            </div>

            <div className="flex items-center gap-1.5 px-5 py-3 border-b border-aura-800/60 overflow-x-auto bg-aura-900/90 no-scrollbar">
              {GENRE_FILTERS.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    selectedGenre === genre
                      ? 'bg-aura-100 text-aura-950 font-semibold'
                      : 'bg-aura-850 text-aura-400 hover:text-aura-200 border border-aura-800'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1 divide-y divide-aura-800/30">
              {results.length === 0 ? (
                <div className="py-12 text-center text-aura-500">
                  <Music className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No dispatches found matching "{query}"</p>
                  <p className="text-xs text-aura-600 mt-1">
                    Try searching for terms like "Tape", "Kyoto", "Modular", "Rain", or "Piano".
                  </p>
                </div>
              ) : (
                results.map((track) => {
                  const isLiked = isFavorite(track.id);
                  return (
                    <div
                      key={track.id}
                      className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-aura-850 transition-colors"
                    >
                      <div
                        onClick={() => handleSelectTrack(track)}
                        className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 relative">
                          <ArtworkImage src={track.coverUrl} alt={track.title} />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          </div>
                        </div>

                        <div className="min-w-0 flex-1 pr-2">
                          <h4 className="text-sm font-medium text-aura-100 group-hover:text-aura-accent truncate transition-colors">
                            {track.title}
                          </h4>
                          <p className="text-xs text-aura-400 truncate">
                            {track.artist} • <span className="text-aura-500">{track.album}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="default" className="hidden sm:inline-flex">
                          {track.genre}
                        </Badge>
                        <span className="text-xs font-mono text-aura-400 w-10 text-right">
                          {formatTime(track.duration)}
                        </span>

                        <button
                          onClick={() => toggleFavorite(track.id)}
                          className={`p-1.5 rounded-full hover:bg-aura-800 transition-colors ${
                            isLiked ? 'text-aura-accent' : 'text-aura-500'
                          }`}
                          title="Favorite"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                        </button>

                        <button
                          onClick={() => addToQueueNext(track)}
                          className="p-1.5 rounded-full text-aura-500 hover:text-aura-200 hover:bg-aura-800 transition-colors"
                          title="Play Next"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="px-5 py-3 bg-aura-950/80 border-t border-aura-800 flex items-center justify-between text-[11px] font-mono text-aura-500">
              <span>Jamendo Live API + Curated Master Archive</span>
              <span>{results.length} records available</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
