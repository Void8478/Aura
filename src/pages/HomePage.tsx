import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Heart } from 'lucide-react';
import type { Track, Album, Mood } from '../types/music';
import { getFeaturedTracks, getPopularTracks, searchTracks } from '../services/jamendo';
import { MOCK_ARTISTS } from '../data/mockTracks';
import { usePlayerStore } from '../store/usePlayerStore';
import { useLibraryStore } from '../store/useLibraryStore';
import { ArtworkImage } from '../components/ui/ArtworkImage';
import { Badge } from '../components/ui/Badge';
import { TactileButton } from '../components/ui/TactileButton';
import { AlbumCard } from '../components/music/AlbumCard';
import { ArtistCard } from '../components/music/ArtistCard';
import { SectionHeader } from '../components/music/SectionHeader';
import { TrackRow } from '../components/common/TrackRow';
import { AlbumCardSkeleton, TrackRowSkeleton } from '../components/ui/Skeleton';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { playTrack } = usePlayerStore();
  const { recentlyPlayed, toggleFavorite, isFavorite } = useLibraryStore();

  const [isLoading, setIsLoading] = useState(true);
  const [featuredTrack, setFeaturedTrack] = useState<Track | null>(null);
  const [popularTracks, setPopularTracks] = useState<Track[]>([]);

  // Curated Albums to show in "New in Your Orbit"
  const [curatedAlbums, setCuratedAlbums] = useState<Album[]>([]);

  const moodsList: { name: Mood; color: string }[] = [
    { name: 'Late Night', color: 'border-aura-700 hover:border-aura-accent hover:text-aura-accent' },
    { name: 'Deep Focus', color: 'border-aura-700 hover:border-aura-amber hover:text-aura-amber' },
    { name: 'Hypnotic', color: 'border-aura-700 hover:border-aura-accent hover:text-aura-accent' },
    { name: 'Melancholic', color: 'border-aura-700 hover:border-blue-400 hover:text-blue-400' },
    { name: 'Ethereal', color: 'border-aura-700 hover:border-purple-400 hover:text-purple-400' },
    { name: 'Warm & Analog', color: 'border-aura-700 hover:border-aura-amber hover:text-aura-amber' },
    { name: 'Meditative', color: 'border-aura-700 hover:border-aura-accent hover:text-aura-accent' },
    { name: 'Urban Drift', color: 'border-aura-700 hover:border-emerald-400 hover:text-emerald-400' },
  ];

  useEffect(() => {
    document.title = 'AURA — Discover your next sound.';
    let active = true;

    async function loadHomeContent() {
      setIsLoading(true);
      try {
        const [featured, popular, orbit] = await Promise.all([
          getFeaturedTracks(),
          getPopularTracks(),
          searchTracks('chillout ambient piano'),
        ]);

        if (!active) return;

        setFeaturedTrack(featured[0] || null);
        setPopularTracks(popular.slice(0, 5));

        // Group orbit tracks into dummy albums for cards
        const albums: Album[] = [
          {
            id: 'album-orbit-1',
            title: 'Reel-to-Reel Tape Fragments',
            artist: orbit[0]?.artist || 'Elena Rostova',
            year: '2025',
            coverUrl: orbit[0]?.coverUrl || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80',
            genre: 'Ambient',
            curatorEssay: 'Preserving natural decay.',
            tracks: orbit.slice(0, 4),
          },
          {
            id: 'album-orbit-2',
            title: 'Geometries of Dusk',
            artist: orbit[4]?.artist || 'Kaito Moriyama',
            year: '2024',
            coverUrl: orbit[4]?.coverUrl || 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80',
            genre: 'Lo-Fi',
            curatorEssay: 'Late night felt study.',
            tracks: orbit.slice(4, 8),
          },
        ];
        setCuratedAlbums(albums);
      } catch (err) {
        console.warn('Error loading homepage API content:', err);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadHomeContent();
    return () => {
      active = false;
    };
  }, []);

  const handleMoodClick = (mood: Mood) => {
    navigate(`/discover?mood=${encodeURIComponent(mood)}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-16 sm:space-y-24">
      {/* 1. FEATURED RELEASE (Hero Area) */}
      <section className="relative border-b border-aura-800/80 pb-12">
        {isLoading || !featuredTrack ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5 aspect-square rounded-3xl bg-aura-800/40 animate-pulse border border-white/5" />
            <div className="md:col-span-7 space-y-4">
              <div className="h-6 w-32 bg-aura-800/40 rounded-md animate-pulse" />
              <div className="h-12 w-3/4 bg-aura-800/40 rounded-md animate-pulse" />
              <div className="h-20 w-full bg-aura-800/40 rounded-md animate-pulse" />
              <div className="h-10 w-40 bg-aura-800/40 rounded-md animate-pulse" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            {/* Artwork Container */}
            <div className="md:col-span-5">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-aura-deck border border-white/10 relative group">
                <ArtworkImage src={featuredTrack.coverUrl} alt={featuredTrack.title} />
                <button
                  onClick={() => playTrack(featuredTrack, [featuredTrack])}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 pointer-events-none sm:pointer-events-auto"
                  aria-label="Play Featured Track"
                >
                  <div className="w-16 h-16 rounded-full bg-aura-accent text-white flex items-center justify-center shadow-lg transform scale-95 group-hover:scale-100 transition-transform duration-300">
                    <Play className="w-6 h-6 fill-current ml-1" />
                  </div>
                </button>
              </div>
            </div>

            {/* Editorial copy */}
            <div className="md:col-span-7 space-y-5">
              <div className="flex items-center gap-2.5">
                <Badge variant="accent" size="md">
                  Sonic Dispatch
                </Badge>
                <span className="text-xs font-mono text-aura-500">
                  {featuredTrack.genre} • {featuredTrack.bpm} BPM
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-aura-100 font-normal tracking-tight leading-[1.06] text-balance">
                {featuredTrack.title}
              </h1>

              <p className="text-base sm:text-lg text-aura-300 font-sans leading-relaxed max-w-2xl text-balance">
                An intimate composition constructed using tape degradation and natural room acoustics.
                Preserving background artifacts rather than cleaning them allows the composition to hold its raw physical presence.
              </p>

              <div className="flex items-center gap-3 pt-2">
                <TactileButton
                  variant="primary"
                  size="lg"
                  onClick={() => playTrack(featuredTrack, [featuredTrack])}
                  className="gap-2 shadow-aura-subtle"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                  Listen Now
                </TactileButton>

                <TactileButton
                  variant="secondary"
                  size="lg"
                  onClick={() => toggleFavorite(featuredTrack.id)}
                  className="p-3"
                  aria-label="Save to favorites"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFavorite(featuredTrack.id)
                        ? 'fill-aura-accent text-aura-accent'
                        : 'text-aura-400'
                    }`}
                  />
                </TactileButton>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 2. RECENTLY PLAYED (Render conditionally if user has history) */}
      {recentlyPlayed.length > 0 && (
        <section className="space-y-6">
          <SectionHeader
            eyebrow="Playback Log"
            title="Recently Listened"
            subtitle="Chronological timeline of your listening history."
            actionText="View Complete Archive"
            onAction={() => navigate('/recent')}
          />
          <div className="flex gap-6 overflow-x-auto no-scrollbar pb-3">
            {recentlyPlayed.slice(0, 6).map((track) => (
              <div
                key={track.id}
                onClick={() => playTrack(track, recentlyPlayed)}
                className="w-36 shrink-0 cursor-pointer group select-none"
              >
                <div className="aspect-square rounded-xl overflow-hidden mb-2.5 border border-white/5 relative">
                  <ArtworkImage src={track.coverUrl} alt={track.title} />
                  <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                    <Play className="w-5 h-5 text-white fill-current" />
                  </div>
                </div>
                <h5 className="font-sans text-xs font-semibold text-aura-100 truncate group-hover:text-aura-accent transition-colors">
                  {track.title}
                </h5>
                <p className="text-[10px] font-mono text-aura-400 truncate mt-0.5">{track.artist}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. NEW IN YOUR ORBIT (Curated Albums/Releases) */}
      <section className="space-y-6">
        <SectionHeader
          eyebrow="Curated Sound Editions"
          title="New in Your Orbit"
          subtitle="Explore quarterly compilations exploring acoustic dynamics and tape textures."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {isLoading ? (
            <>
              <AlbumCardSkeleton />
              <AlbumCardSkeleton />
            </>
          ) : (
            curatedAlbums.map((album) => (
              <AlbumCard
                key={album.id}
                album={album}
                onClick={() => navigate(`/album/${album.id}`)}
              />
            ))
          )}
        </div>
      </section>

      {/* 4. WORTH A REPEAT (Popular TrackRows) */}
      <section className="space-y-6">
        <SectionHeader
          eyebrow="Curator Recommendations"
          title="Worth a Repeat"
          subtitle="A selection of high-fidelity tracks holding enduring acoustic value."
        />

        <div className="divide-y divide-aura-800/45 pt-1">
          {isLoading ? (
            <>
              <TrackRowSkeleton />
              <TrackRowSkeleton />
              <TrackRowSkeleton />
            </>
          ) : (
            popularTracks.map((track, idx) => (
              <TrackRow
                key={track.id}
                track={track}
                index={idx}
                playlistContext={popularTracks}
              />
            ))
          )}
        </div>
      </section>

      {/* 5. POPULAR ARTISTS (Round Cards) */}
      <section className="space-y-6">
        <SectionHeader
          eyebrow="Composer Spotlights"
          title="Acoustic Artists"
          subtitle="The independent musicians shaping contemporary minimalist soundscapes."
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-6">
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

      {/* 6. BROWSE BY MOOD (Editorial Chips) */}
      <section className="space-y-6">
        <SectionHeader
          eyebrow="Acoustic Spaces"
          title="Browse by Mood"
          subtitle="Navigate directly to soundscapes tailored for focus, isolation, or late hours."
        />

        <div className="flex flex-wrap gap-3 pt-2">
          {moodsList.map((mood) => (
            <button
              key={mood.name}
              onClick={() => handleMoodClick(mood.name)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-medium font-mono transition-all duration-150 active:scale-95 cursor-pointer bg-aura-850/60 ${mood.color}`}
            >
              {mood.name}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
