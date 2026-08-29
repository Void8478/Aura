import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Play } from 'lucide-react';
import type { Track, Album, Genre, Mood } from '../types/music';
import { getFeaturedTracks, getPopularTracks, getTracksByGenre, searchTracks } from '../services/jamendo';
import { MOCK_ARTISTS } from '../data/mockTracks';
import { usePlayerStore } from '../store/usePlayerStore';
import { ArtworkImage } from '../components/ui/ArtworkImage';
import { Badge } from '../components/ui/Badge';
import { TactileButton } from '../components/ui/TactileButton';
import { AlbumCard } from '../components/music/AlbumCard';
import { ArtistCard } from '../components/music/ArtistCard';
import { SectionHeader } from '../components/music/SectionHeader';
import { TrackRow } from '../components/common/TrackRow';
import { AlbumCardSkeleton, TrackRowSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';

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

const MOODS: Mood[] = [
  'Late Night',
  'Deep Focus',
  'Hypnotic',
  'Melancholic',
  'Ethereal',
  'Warm & Analog',
  'Meditative',
  'Urban Drift',
];

export const DiscoverPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { playTrack } = usePlayerStore();

  const [isLoading, setIsLoading] = useState(true);
  const [featuredTrack, setFeaturedTrack] = useState<Track | null>(null);
  const [trendingTracks, setTrendingTracks] = useState<Track[]>([]);
  const [newAlbums, setNewAlbums] = useState<Album[]>([]);
  const [genreTracks, setGenreTracks] = useState<Track[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<Genre>('Ambient');

  // Filter values if navigated with params
  const moodFilter = searchParams.get('mood') as Mood | null;
  const [filteredTracks, setFilteredTracks] = useState<Track[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadDiscoverContent() {
      setIsLoading(true);
      try {
        const [featured, popular, newReleaseStems] = await Promise.all([
          getFeaturedTracks(),
          getPopularTracks(),
          searchTracks('cinematic ambient neoclassic'),
        ]);

        if (!active) return;

        setFeaturedTrack(featured[0] || null);
        setTrendingTracks(popular.slice(0, 6));

        // Group stems into releases
        const albums: Album[] = [
          {
            id: 'album-discover-1',
            title: 'Granular Clouds & Waves',
            artist: newReleaseStems[0]?.artist || 'Elena Rostova',
            year: '2025',
            coverUrl: newReleaseStems[0]?.coverUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80',
            genre: 'Ambient',
            curatorEssay: 'A study in slow moving drone.',
            tracks: newReleaseStems.slice(0, 3),
          },
          {
            id: 'album-discover-2',
            title: 'Rhodes Study & Tape Flutter',
            artist: newReleaseStems[3]?.artist || 'Kaito Moriyama',
            year: '2025',
            coverUrl: newReleaseStems[3]?.coverUrl || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80',
            genre: 'Lo-Fi',
            curatorEssay: 'Warm analog felt tones.',
            tracks: newReleaseStems.slice(3, 6),
          },
        ];
        setNewAlbums(albums);
      } catch (err) {
        console.warn('Error loading discover page content:', err);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadDiscoverContent();
    return () => {
      active = false;
    };
  }, []);

  // Fetch genre tracks when selected genre changes
  useEffect(() => {
    let active = true;
    async function loadGenreTracks() {
      try {
        const tracks = await getTracksByGenre(selectedGenre);
        if (active) {
          setGenreTracks(tracks.slice(0, 5));
        }
      } catch (err) {
        console.warn('Error loading genre tracks:', err);
      }
    }
    loadGenreTracks();
    return () => {
      active = false;
    };
  }, [selectedGenre]);

  // Fetch mood filter tracks
  useEffect(() => {
    if (!moodFilter) {
      setFilteredTracks([]);
      return;
    }
    let active = true;
    async function loadMoodTracks() {
      setIsFiltering(true);
      try {
        const tracks = await searchTracks(moodFilter || '');
        if (active) {
          setFilteredTracks(tracks.slice(0, 10));
        }
      } catch (err) {
        console.warn('Error loading mood tracks:', err);
      } finally {
        if (active) setIsFiltering(false);
      }
    }
    loadMoodTracks();
    return () => {
      active = false;
    };
  }, [moodFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-16 sm:space-y-24">
      {/* Editorial Header */}
      <div>
        <span className="text-xs font-mono uppercase tracking-wider text-aura-accent">
          Exploration Guide
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-aura-100 font-normal mt-1">
          Catalog Explorer
        </h1>
        <p className="text-sm text-aura-400 font-sans mt-2 max-w-xl">
          Browse independent releases by acoustic atmosphere, genre textures, and modular study.
        </p>
      </div>

      {/* CONDITIONAL MOOD FILTER RESULTS */}
      {moodFilter && (
        <section className="space-y-6 animate-in fade-in-50 duration-200">
          <SectionHeader
            eyebrow={`Active Atmosphere: ${moodFilter}`}
            title="Atmospheric Results"
            subtitle={`Playlists curating pieces matching the ${moodFilter.toLowerCase()} acoustic profile.`}
            actionText="Clear Filter"
            onAction={() => navigate('/discover')}
          />

          {isFiltering ? (
            <div className="space-y-2 p-2 rounded-2xl bg-aura-850/40 border border-aura-800">
              <TrackRowSkeleton />
              <TrackRowSkeleton />
            </div>
          ) : filteredTracks.length === 0 ? (
            <EmptyState
              title="No atmospheric matches"
              description={`We did not find any current catalog releases tagged as ${moodFilter.toLowerCase()}.`}
            />
          ) : (
            <div className="p-2 rounded-2xl bg-aura-850/40 border border-aura-800 divide-y divide-aura-800/40">
              {filteredTracks.map((track, idx) => (
                <TrackRow key={track.id} track={track} index={idx} playlistContext={filteredTracks} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* 1. LARGE EDITORIAL SECTION (Featured Showcase) */}
      {!moodFilter && (
        <section className="relative border border-aura-800/90 rounded-3xl bg-gradient-to-br from-aura-850/80 to-aura-900/50 p-6 md:p-10 select-none">
          {isLoading || !featuredTrack ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-4 aspect-square bg-aura-800/30 rounded-2xl animate-pulse" />
              <div className="md:col-span-8 space-y-4">
                <div className="h-6 w-32 bg-aura-800/30 rounded animate-pulse" />
                <div className="h-10 w-2/3 bg-aura-800/30 rounded animate-pulse" />
                <div className="h-16 w-full bg-aura-800/30 rounded animate-pulse" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
              <div className="md:col-span-4 max-w-xs md:max-w-none mx-auto md:mx-0 w-full">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-aura-deck border border-white/5 relative group">
                  <ArtworkImage src={featuredTrack.coverUrl} alt={featuredTrack.title} />
                  <button
                    onClick={() => playTrack(featuredTrack, [featuredTrack])}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    aria-label="Play Featured Track"
                  >
                    <div className="w-12 h-12 rounded-full bg-aura-accent text-white flex items-center justify-center shadow-lg">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </button>
                </div>
              </div>

              <div className="md:col-span-8 space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="accent">Curator Spotlight</Badge>
                  <span className="text-xs font-mono text-aura-400">
                    {featuredTrack.genre} • {featuredTrack.bpm} BPM
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-4xl text-aura-100 font-normal leading-tight">
                  {featuredTrack.title}
                </h3>

                <p className="text-sm sm:text-base text-aura-300 font-sans leading-relaxed max-w-2xl">
                  {featuredTrack.curatorNote ||
                    'Discovered in the independent modular archives. This piece captures dynamic room resonance and tape hiss.'}
                </p>

                <div className="pt-2">
                  <TactileButton
                    variant="primary"
                    size="md"
                    onClick={() => playTrack(featuredTrack, [featuredTrack])}
                    className="gap-2"
                  >
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                    Listen Dispatch
                  </TactileButton>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* 2. HORIZONTAL MUSIC RAILS (New Compilation Releases) */}
      <section className="space-y-6">
        <SectionHeader
          eyebrow="Acoustic Compilations"
          title="New Releases"
          subtitle="Explore the latest multi-track soundscapes and master tapes added to the catalog."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {isLoading ? (
            <>
              <AlbumCardSkeleton />
              <AlbumCardSkeleton />
            </>
          ) : (
            newAlbums.map((album) => (
              <AlbumCard
                key={album.id}
                album={album}
                onClick={() => navigate(`/album/${album.id}`)}
              />
            ))
          )}
        </div>
      </section>

      {/* 3. COMPACT TRACK LISTS BY GENRE */}
      <section className="space-y-6">
        <div className="border-b border-aura-800 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-aura-accent">
              Genre Exploration
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-aura-100 font-medium">
              Browse by Genre
            </h3>
          </div>

          {/* Genre Chips */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3 py-1 rounded-xl text-xs font-mono border transition-all duration-150 cursor-pointer ${
                  selectedGenre === genre
                    ? 'border-aura-accent bg-aura-accent/10 text-aura-accent font-semibold'
                    : 'border-aura-800 hover:border-aura-700 text-aura-400'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        <div className="p-2 rounded-2xl bg-aura-850/40 border border-aura-800 divide-y divide-aura-800/40">
          {isLoading || genreTracks.length === 0 ? (
            <>
              <TrackRowSkeleton />
              <TrackRowSkeleton />
            </>
          ) : (
            genreTracks.map((track, idx) => (
              <TrackRow
                key={track.id}
                track={track}
                index={idx}
                playlistContext={genreTracks}
              />
            ))
          )}
        </div>
      </section>

      {/* 4. COMPOSER SPOTLIGHTS (Acoustic Artists) */}
      <section className="space-y-6">
        <SectionHeader
          eyebrow="Sonic Architects"
          title="Popular Artists"
          subtitle="Explore composer profiles, ambient bios, and their curated Creative Commons discographies."
        />

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
      </section>

      {/* 5. TRENDING TRACKS RAIL */}
      <section className="space-y-6">
        <SectionHeader
          eyebrow="Enduring Listening"
          title="Trending Tracks"
          subtitle="A selection of independent releases holding the highest playback counts this season."
        />

        <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4 select-none">
          {isLoading ? (
            <div className="flex gap-6">
              <div className="w-56 shrink-0 aspect-square rounded-2xl bg-aura-800/40 animate-pulse" />
              <div className="w-56 shrink-0 aspect-square rounded-2xl bg-aura-800/40 animate-pulse" />
            </div>
          ) : (
            trendingTracks.map((track) => (
              <div
                key={track.id}
                onClick={() => playTrack(track, trendingTracks)}
                className="w-56 shrink-0 cursor-pointer group p-4 rounded-2xl bg-aura-850/60 border border-aura-800/80 hover:border-aura-700 transition-all duration-200 tactile-card tactile-card-hover"
              >
                <div className="aspect-square rounded-xl overflow-hidden mb-3 border border-white/5 relative">
                  <ArtworkImage src={track.coverUrl} alt={track.title} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Play className="w-6 h-6 text-white fill-current ml-0.5" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-aura-500 mb-1">
                  <span>{track.genre}</span>
                  <span>{track.bpm} BPM</span>
                </div>

                <h4 className="font-serif text-base text-aura-100 font-medium group-hover:text-aura-accent transition-colors line-clamp-1">
                  {track.title}
                </h4>
                <p className="text-xs text-aura-400 font-sans mt-0.5 truncate">
                  {track.artist}
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 6. BROWSE BY MOOD */}
      <section className="space-y-6">
        <SectionHeader
          eyebrow="Resonance Spaces"
          title="Browse by Mood"
          subtitle="Navigate directly to soundscapes tailored for focus, isolation, or late hours."
        />

        <div className="flex flex-wrap gap-3">
          {MOODS.map((mood) => (
            <button
              key={mood}
              onClick={() => navigate(`/discover?mood=${encodeURIComponent(mood)}`)}
              className="px-4 py-2.5 rounded-xl border border-aura-850 hover:border-aura-accent hover:text-aura-accent text-xs font-medium font-mono transition-all duration-150 active:scale-95 cursor-pointer bg-aura-850/60"
            >
              {mood}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DiscoverPage;
