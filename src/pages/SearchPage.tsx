import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Compass, Music, Disc } from 'lucide-react';
import type { Track, Album, Artist, Genre } from '../types/music';
import { searchTracks } from '../services/jamendo';
import { MOCK_ARTISTS } from '../data/mockTracks';
import { SearchInput } from '../components/ui/SearchInput';
import { ArtistCard } from '../components/music/ArtistCard';
import { AlbumCard } from '../components/music/AlbumCard';
import { TrackRow } from '../components/common/TrackRow';
import { TrackRowSkeleton, AlbumCardSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';

const GENRES: Genre[] = [
  'Ambient',
  'Lo-Fi',
  'Neo-Classical',
  'Electronic',
  'Jazz Fusion',
  'Downtempo',
  'Minimalism',
  'Post-Rock',
];

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Search Results
  const [results, setResults] = useState<{
    tracks: Track[];
    albums: Album[];
    artists: Artist[];
  }>({ tracks: [], albums: [], artists: [] });

  // Recent Searches list
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('aura_recent_searches');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Hotkey listener: Ctrl/Cmd + K focuses search input
  useEffect(() => {
    document.title = 'Search — AURA';
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  // Fetch results when debounced query updates
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults({ tracks: [], albums: [], artists: [] });
      setHasError(false);
      return;
    }

    let active = true;
    async function performSearch() {
      setIsLoading(true);
      setHasError(false);
      try {
        const tracks = await searchTracks(debouncedQuery);

        if (!active) return;

        // Group tracks into dummy albums for categories
        const albums: Album[] = [];
        const seenAlbums = new Set<string>();
        tracks.forEach((t) => {
          if (t.album && t.albumId && !seenAlbums.has(t.albumId)) {
            seenAlbums.add(t.albumId);
            albums.push({
              id: t.albumId,
              title: t.album,
              artist: t.artist,
              year: '2024',
              coverUrl: t.coverUrl,
              genre: t.genre,
              curatorEssay: 'Discovered in catalog.',
              tracks: [t],
            });
          }
        });

        // Group tracks into dummy artists for categories
        const artists: Artist[] = [];
        const seenArtists = new Set<string>();
        tracks.forEach((t) => {
          if (t.artist && t.artistId && !seenArtists.has(t.artistId)) {
            seenArtists.add(t.artistId);
            artists.push({
              id: t.artistId,
              name: t.artist,
              bio: 'Independent composer.',
              artworkUrl: t.coverUrl,
              genre: t.genre,
            });
          }
        });

        setResults({
          tracks: tracks.slice(0, 10),
          albums: albums.slice(0, 4),
          artists: artists.slice(0, 3),
        });

        // Save to recent searches if search returned tracks
        if (tracks.length > 0) {
          saveRecentSearch(debouncedQuery);
        }
      } catch (err) {
        console.warn('Search API failed:', err);
        setHasError(true);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    performSearch();
    return () => {
      active = false;
    };
  }, [debouncedQuery]);

  const saveRecentSearch = (searchVal: string) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== searchVal.toLowerCase());
      const updated = [searchVal, ...filtered].slice(0, 5);
      localStorage.setItem('aura_recent_searches', JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearRecent = () => {
    localStorage.removeItem('aura_recent_searches');
    setRecentSearches([]);
  };

  const handleGenreClick = (genre: Genre) => {
    navigate(`/discover?genre=${encodeURIComponent(genre)}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
      {/* 1. SEARCH INPUT CONTROL */}
      <div className="border-b border-aura-800/80 pb-6">
        <span className="text-xs font-mono uppercase tracking-wider text-aura-accent">
          Instant Discovery
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-aura-100 font-normal mt-1">
          Catalog Search
        </h1>

        <div className="mt-6 max-w-2xl">
          <SearchInput
            ref={searchInputRef}
            value={query}
            onChange={(val) => setQuery(val)}
            placeholder="Search by title, composer, instrument, or atmosphere..."
            shortcutHint="Ctrl+K"
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* 2. LOADING STATE SKELETON */}
      {isLoading && (
        <div className="space-y-8">
          <div className="p-2 rounded-2xl bg-aura-850/40 border border-aura-800 space-y-2">
            <TrackRowSkeleton />
            <TrackRowSkeleton />
            <TrackRowSkeleton />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <AlbumCardSkeleton />
            <AlbumCardSkeleton />
          </div>
        </div>
      )}

      {/* 3. API ERROR STATE */}
      {hasError && !isLoading && (
        <ErrorState
          title="Search Dispatch Failed"
          message="We encountered an issue querying the Jamendo databases. Please check your internet connection."
          onRetry={() => setDebouncedQuery(query)}
        />
      )}

      {/* 4. BEFORE SEARCH (Empty Query State) */}
      {!query && !isLoading && (
        <div className="space-y-12">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-aura-800/50 pb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-aura-500 font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Recent Searches
                </span>
                <button
                  onClick={handleClearRecent}
                  className="text-[10px] font-mono text-aura-accent hover:underline cursor-pointer"
                >
                  Clear History
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => setQuery(search)}
                    className="px-3 py-1.5 rounded-xl border border-aura-800 hover:border-aura-700 text-xs font-sans text-aura-300 transition-colors bg-aura-850/40 cursor-pointer"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Genres Grid */}
          <div className="space-y-4">
            <span className="block text-[10px] font-mono uppercase tracking-wider text-aura-500 font-medium border-b border-aura-800/50 pb-2">
              Browse by Genre Timbre
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {GENRES.map((g) => (
                <button
                  key={g}
                  onClick={() => handleGenreClick(g)}
                  className="flex items-center justify-between p-4 rounded-2xl bg-aura-850/60 border border-aura-800/80 hover:border-aura-accent hover:text-aura-accent transition-all text-sm font-sans text-aura-200 cursor-pointer text-left"
                >
                  <span>{g}</span>
                  <Compass className="w-4 h-4 text-aura-500 opacity-60" />
                </button>
              ))}
            </div>
          </div>

          {/* Suggested Artists */}
          <div className="space-y-4">
            <span className="block text-[10px] font-mono uppercase tracking-wider text-aura-500 font-medium border-b border-aura-800/50 pb-2">
              Suggested Composers
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {MOCK_ARTISTS.map((artist) => (
                <ArtistCard
                  key={artist.id}
                  name={artist.name}
                  location={artist.location}
                  genre={artist.genre}
                  artworkUrl={artist.artworkUrl}
                  tracksCount={artist.tracksCount}
                  onClick={() => navigate(`/artist/${artist.id}`)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. SEARCH RESULTS STATE */}
      {query && !isLoading && !hasError && (
        <div className="space-y-12 animate-in fade-in-50 duration-200">
          {results.tracks.length === 0 ? (
            <EmptyState
              title="No recordings found"
              description={`We did not find any matching recordings for "${query}" in the catalog.`}
            />
          ) : (
            <>
              {/* Tracks Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-aura-800/50 pb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-aura-500 font-medium flex items-center gap-1.5">
                    <Music className="w-3.5 h-3.5" />
                    Tracks Discovered
                  </span>
                  <span className="text-[10px] font-mono text-aura-500">
                    {results.tracks.length} results
                  </span>
                </div>
                <div className="p-2 rounded-2xl bg-aura-850/40 border border-aura-800 divide-y divide-aura-800/40">
                  {results.tracks.map((track, idx) => (
                    <TrackRow
                      key={track.id}
                      track={track}
                      index={idx}
                      playlistContext={results.tracks}
                    />
                  ))}
                </div>
              </div>

              {/* Albums Section */}
              {results.albums.length > 0 && (
                <div className="space-y-4">
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-aura-500 font-medium border-b border-aura-800/50 pb-2 flex items-center gap-1.5">
                    <Disc className="w-3.5 h-3.5" />
                    Compilation Releases
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {results.albums.map((album) => (
                      <AlbumCard
                        key={album.id}
                        album={album}
                        onClick={() => navigate(`/album/${album.id}`)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Artists Section */}
              {results.artists.length > 0 && (
                <div className="space-y-4">
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-aura-500 font-medium border-b border-aura-800/50 pb-2 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5" />
                    Composers & Artists
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    {results.artists.map((artist) => (
                      <ArtistCard
                        key={artist.id}
                        name={artist.name}
                        artworkUrl={artist.artworkUrl}
                        genre={artist.genre}
                        onClick={() => navigate(`/artist/${artist.id}`)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
