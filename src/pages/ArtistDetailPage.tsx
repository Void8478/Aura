import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Heart, MapPin, Disc } from 'lucide-react';
import type { Artist, Track, Album } from '../types/music';
import { getArtist, searchTracks } from '../services/jamendo';
import { MOCK_ARTISTS } from '../data/mockTracks';
import { usePlayerStore } from '../store/usePlayerStore';
import { useLibraryStore } from '../store/useLibraryStore';
import { ArtworkImage } from '../components/ui/ArtworkImage';
import { Badge } from '../components/ui/Badge';
import { TactileButton } from '../components/ui/TactileButton';
import { TrackRow } from '../components/common/TrackRow';
import { AlbumCard } from '../components/music/AlbumCard';
import { ErrorState } from '../components/ui/ErrorState';

export const ArtistDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { playTrack } = usePlayerStore();
  const { isFavorite, toggleFavorite } = useLibraryStore();

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [artist, setArtist] = useState<Artist | null>(null);
  const [artistTracks, setArtistTracks] = useState<Track[]>([]);
  const [artistAlbums, setArtistAlbums] = useState<Album[]>([]);

  useEffect(() => {
    if (!id) return;
    let active = true;

    async function loadArtistData() {
      setIsLoading(true);
      setHasError(false);
      try {
        const artistData = await getArtist(id || '');
        if (!active) return;

        if (artistData) {
          setArtist(artistData);
          document.title = `${artistData.name} — AURA`;

          // Fetch tracks by this artist's name
          const tracks = await searchTracks(artistData.name);
          if (!active) return;

          setArtistTracks(tracks.slice(0, 6));

          // Group tracks into derived albums for display
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
                curatorEssay: 'Acoustic dispatch archive.',
                tracks: [t],
              });
            }
          });
          setArtistAlbums(albums.slice(0, 2));
        } else {
          setHasError(true);
        }
      } catch (err) {
        console.warn('Error loading artist details:', err);
        if (active) setHasError(true);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadArtistData();
    return () => {
      active = false;
    };
  }, [id]);

  const handlePlayArtist = () => {
    if (artistTracks.length > 0) {
      playTrack(artistTracks[0], artistTracks);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 aspect-square bg-aura-800/40 rounded-3xl animate-pulse" />
          <div className="md:col-span-8 space-y-4">
            <div className="h-6 w-32 bg-aura-800/40 rounded animate-pulse" />
            <div className="h-12 w-2/3 bg-aura-800/40 rounded animate-pulse" />
            <div className="h-20 w-full bg-aura-800/40 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (hasError || !artist) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ErrorState
          title="Artist Record Missing"
          message="We were unable to resolve this composer record. Check your connection or explore another spotlight artist."
          onRetry={() => navigate('/discover')}
        />
      </div>
    );
  }

  // Get related/suggested artists, excluding this one
  const relatedArtists = MOCK_ARTISTS.filter((a) => a.id !== artist.id);
  const artistId = artist.id || '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-16">
      {/* Back navigation */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-mono text-aura-400 hover:text-aura-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* Artist Profile Header Section */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center border-b border-aura-800/80 pb-12">
        <div className="md:col-span-4">
          <div className="aspect-square rounded-3xl overflow-hidden shadow-aura-deck border border-white/10">
            <ArtworkImage src={artist.artworkUrl} alt={artist.name} />
          </div>
        </div>

        <div className="md:col-span-8 space-y-5">
          <div className="flex items-center gap-2">
            <Badge variant="accent">Spotlight Composer</Badge>
            {artist.location && (
              <span className="text-xs font-mono text-aura-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-aura-accent" />
                {artist.location}
              </span>
            )}
            {artist.genre && (
              <span className="text-xs font-mono text-aura-500">
                • {artist.genre}
              </span>
            )}
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl text-aura-100 font-normal leading-tight">
            {artist.name}
          </h1>

          <p className="text-base text-aura-300 font-sans leading-relaxed max-w-2xl text-justify">
            {artist.bio ||
              'An independent recording artist focusing on dynamic room acoustics, minimalist patterns, and acoustic authenticity.'}
          </p>

          <div className="pt-2 flex items-center gap-3">
            {artistTracks.length > 0 && (
              <TactileButton
                variant="primary"
                size="lg"
                onClick={handlePlayArtist}
                className="gap-2 shadow-aura-subtle"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
                Play Artist Queue
              </TactileButton>
            )}

            <TactileButton
              variant="secondary"
              size="lg"
              onClick={() => toggleFavorite(artistId)}
              className="p-3"
              aria-label="Favorite Artist"
            >
              <Heart
                className={`w-4 h-4 ${
                  isFavorite(artistId)
                    ? 'fill-aura-accent text-aura-accent'
                    : 'text-aura-400 hover:text-aura-100'
                }`}
              />
            </TactileButton>
          </div>
        </div>
      </section>

      {/* Top Recordings */}
      {artistTracks.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-aura-800 pb-3">
            <h3 className="font-serif text-xl text-aura-100 font-medium">Top Recordings</h3>
            <span className="text-xs font-mono text-aura-500">
              {artistTracks.length} Works
            </span>
          </div>

          <div className="divide-y divide-aura-800/40">
            {artistTracks.map((track, idx) => (
              <TrackRow
                key={track.id}
                track={track}
                index={idx}
                playlistContext={artistTracks}
              />
            ))}
          </div>
        </section>
      )}

      {/* Artist Albums */}
      {artistAlbums.length > 0 && (
        <section className="space-y-6">
          <div className="border-b border-aura-800 pb-3 flex items-center gap-2">
            <Disc className="w-4 h-4 text-aura-accent" />
            <h3 className="font-serif text-xl text-aura-100 font-medium">Derived Releases</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {artistAlbums.map((album) => (
              <AlbumCard
                key={album.id}
                album={album}
                onClick={() => navigate(`/album/${album.id}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Suggested Artists */}
      {relatedArtists.length > 0 && (
        <section className="space-y-6">
          <div className="border-b border-aura-800 pb-3">
            <h3 className="font-serif text-xl text-aura-100 font-medium">Suggested Composers</h3>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {relatedArtists.map((rel) => (
              <div
                key={rel.id}
                onClick={() => navigate(`/artist/${rel.id}`)}
                className="flex items-center gap-4 p-4 rounded-2xl bg-aura-850/40 border border-aura-800 hover:border-aura-accent cursor-pointer group transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-white/5">
                  <ArtworkImage src={rel.artworkUrl} alt={rel.name} />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-serif text-sm font-semibold text-aura-100 group-hover:text-aura-accent truncate transition-colors">
                    {rel.name}
                  </h4>
                  <p className="text-xs text-aura-400 font-sans truncate">{rel.location}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ArtistDetailPage;
