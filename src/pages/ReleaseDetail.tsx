import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Shuffle, Heart, MapPin, Disc, Clock } from 'lucide-react';
import type { Album } from '../types/music';
import { getAlbum } from '../services/jamendo';
import { usePlayerStore } from '../store/usePlayerStore';
import { useLibraryStore } from '../store/useLibraryStore';
import { ArtworkImage } from '../components/ui/ArtworkImage';
import { Badge } from '../components/ui/Badge';
import { TactileButton } from '../components/ui/TactileButton';
import { TrackRow } from '../components/common/TrackRow';
import { AlbumCardSkeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';

export const ReleaseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { playTrack, toggleShuffle } = usePlayerStore();
  const { isFavorite, toggleFavorite } = useLibraryStore();

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [album, setAlbum] = useState<Album | null>(null);

  useEffect(() => {
    if (!id) return;
    let active = true;

    async function loadAlbumDetails() {
      setIsLoading(true);
      setHasError(false);
      try {
        const data = await getAlbum(id || '');
        if (active) {
          if (data) {
            setAlbum(data);
            document.title = `${data.title} — AURA`;
          } else {
            setHasError(true);
          }
        }
      } catch (err) {
        console.warn('Error loading album details:', err);
        if (active) setHasError(true);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadAlbumDetails();
    return () => {
      active = false;
    };
  }, [id]);

  const handlePlayAll = () => {
    if (album && album.tracks.length > 0) {
      playTrack(album.tracks[0], album.tracks);
    }
  };

  const handleShufflePlay = () => {
    if (album && album.tracks.length > 0) {
      const shuffled = [...album.tracks].sort(() => Math.random() - 0.5);
      playTrack(shuffled[0], shuffled);
      toggleShuffle();
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <AlbumCardSkeleton />
          </div>
          <div className="md:col-span-8 space-y-4">
            <div className="h-6 w-32 bg-aura-800/40 rounded animate-pulse" />
            <div className="h-10 w-2/3 bg-aura-800/40 rounded animate-pulse" />
            <div className="h-24 w-full bg-aura-800/40 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (hasError || !album) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ErrorState
          title="Release Dispatch Missing"
          message="We were unable to locate this specific compiled audio archive. Check your connection or explore another edition."
          onRetry={() => navigate('/discover')}
        />
      </div>
    );
  }

  const albumId = album.id || '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-mono text-aura-400 hover:text-aura-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pb-12 border-b border-aura-800/80">
        <div className="md:col-span-5 lg:col-span-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden shadow-aura-deck border border-white/10">
            <ArtworkImage src={album.coverUrl} alt={album.title} />
          </div>
        </div>

        <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="accent">Aura Sound Edition</Badge>
              <Badge variant="default">{album.genre}</Badge>
              <span className="text-xs font-mono text-aura-500">{album.year}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-aura-100 font-normal leading-tight">
              {album.title}
            </h1>
            <p className="text-lg sm:text-xl text-aura-300 font-sans mt-2">
              Composed by <strong className="text-aura-100 font-semibold">{album.artist}</strong>
            </p>

            <div className="flex flex-wrap gap-4 text-xs font-mono text-aura-400 mt-4 pt-4 border-t border-aura-800/60">
              {album.recordingLocation && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-aura-accent" />
                  {album.recordingLocation}
                </span>
              )}
              {album.label && (
                <span className="flex items-center gap-1.5">
                  <Disc className="w-3.5 h-3.5 text-aura-amber" />
                  {album.label}
                </span>
              )}
              {album.totalDuration && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {album.totalDuration}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <TactileButton
              variant="primary"
              size="lg"
              onClick={handlePlayAll}
              className="gap-2 shadow-aura-subtle"
            >
              <Play className="w-4 h-4 fill-current ml-0.5" />
              Play All ({album.tracks.length})
            </TactileButton>

            <TactileButton
              variant="secondary"
              size="lg"
              onClick={handleShufflePlay}
              className="gap-2"
            >
              <Shuffle className="w-4 h-4" />
              Shuffle
            </TactileButton>

            <TactileButton
              variant="secondary"
              size="lg"
              onClick={() => toggleFavorite(albumId)}
              className="p-3"
              aria-label="Favorite Album"
            >
              <Heart
                className={`w-4 h-4 ${
                  isFavorite(albumId)
                    ? 'fill-aura-accent text-aura-accent'
                    : 'text-aura-400 hover:text-aura-100'
                }`}
              />
            </TactileButton>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-aura-800 pb-3">
          <h3 className="font-serif text-xl text-aura-100 font-medium">Recordings & Timeline</h3>
          <span className="text-xs font-mono text-aura-500">
            {album.tracks.length} Cuts
          </span>
        </div>

        <div className="divide-y divide-aura-800/40">
          {album.tracks.map((track, idx) => (
            <TrackRow
              key={track.id}
              track={track}
              index={idx}
              playlistContext={album.tracks}
            />
          ))}
        </div>
      </section>

      {album.curatorEssay && (
        <section className="p-6 md:p-8 rounded-3xl bg-aura-850/60 border border-aura-800 space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-aura-accent font-medium">
            Liner Notes & Background Curation
          </span>
          <p className="text-sm text-aura-300 font-sans leading-relaxed text-justify">
            {album.curatorEssay}
          </p>
        </section>
      )}
    </div>
  );
};

export default ReleaseDetail;
