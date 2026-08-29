import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, ArrowLeft, Disc, MapPin, Clock, Share2 } from 'lucide-react';
import { CURATED_ALBUMS } from '../services/mockCatalog';
import { usePlayerStore } from '../store/usePlayerStore';
import { ArtworkImage } from '../components/ui/ArtworkImage';
import { Badge } from '../components/ui/Badge';
import { TactileButton } from '../components/ui/TactileButton';
import { TrackRow } from '../components/common/TrackRow';
import { WaveformPreview } from '../components/ui/WaveformPreview';

export const ReleaseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { playTrack } = usePlayerStore();
  const [copied, setCopied] = React.useState(false);

  const album = CURATED_ALBUMS.find((a) => a.id === id) || CURATED_ALBUMS[0];

  const handlePlayAlbum = () => {
    if (album.tracks.length > 0) {
      playTrack(album.tracks[0], album.tracks);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-mono text-aura-400 hover:text-aura-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dispatches
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

          <div className="flex items-center gap-3 pt-2">
            <TactileButton
              variant="primary"
              size="lg"
              onClick={handlePlayAlbum}
              className="gap-2 shadow-aura-subtle"
            >
              <Play className="w-4 h-4 fill-current" />
              Play Entire Release ({album.tracks.length} Cuts)
            </TactileButton>

            <TactileButton
              variant="secondary"
              size="lg"
              onClick={handleShare}
              className="gap-1.5"
            >
              <Share2 className="w-4 h-4" />
              {copied ? 'Link Copied' : 'Share Liner Notes'}
            </TactileButton>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-aura-accent">
              Curator Essay & Historical Context
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-aura-100 font-medium mt-1">
              Acoustic Architecture & Recording Log
            </h2>
          </div>

          <div className="prose prose-invert max-w-none text-aura-300 font-sans leading-relaxed text-base space-y-4">
            <p>{album.curatorEssay}</p>
            <p>
              Mastered strictly for high-fidelity spatial reproduction. No dynamic range compression
              has been applied to the master buss in order to retain the subtle organic transients of
              felt hammers and tape hiss.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-aura-850 border border-aura-800 space-y-2">
            <span className="text-[11px] font-mono uppercase text-aura-400">
              Master Composite Frequency Profile
            </span>
            <WaveformPreview barsCount={36} activeColor="bg-aura-amber" />
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between border-b border-aura-800 pb-3">
            <h3 className="font-serif text-xl text-aura-100 font-medium">Release Tracklist</h3>
            <span className="text-xs font-mono text-aura-500">
              {album.tracks.length} Tracks
            </span>
          </div>

          <div className="divide-y divide-aura-800/40">
            {album.tracks.map((track, idx) => (
              <TrackRow
                key={track.id}
                track={track}
                index={idx}
                showCover={false}
                showAlbum={false}
                showBpm={true}
                playlistContext={album.tracks}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
