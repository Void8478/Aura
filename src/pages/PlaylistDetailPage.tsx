import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play } from 'lucide-react';
import { useLibraryStore } from '../store/useLibraryStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { TrackRow } from '../components/common/TrackRow';
import { ArtworkImage } from '../components/ui/ArtworkImage';
import { TactileButton } from '../components/ui/TactileButton';
import { Badge } from '../components/ui/Badge';

export const PlaylistDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { crates } = useLibraryStore();
  const { playTrack } = usePlayerStore();

  const crate = crates.find((c) => c.id === id) || crates[0];

  if (!crate) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-mono text-aura-400 hover:text-aura-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-aura-800 pb-12">
        <div className="md:col-span-4">
          <div className="aspect-square rounded-3xl overflow-hidden shadow-aura-deck border border-white/10">
            <ArtworkImage src={crate.coverUrl || crate.tracks[0]?.coverUrl} alt={crate.title} />
          </div>
        </div>

        <div className="md:col-span-8 space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="amber">Curated Crate</Badge>
            <span className="text-xs font-mono text-aura-500">{crate.createdAt}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl text-aura-100 font-normal leading-tight">
            {crate.title}
          </h1>

          <p className="text-base text-aura-300 font-sans leading-relaxed max-w-2xl">
            {crate.description || 'Personal listening curation assembled in AURA.'}
          </p>

          <div className="pt-2 flex items-center gap-3">
            {crate.tracks.length > 0 && (
              <TactileButton
                variant="primary"
                size="lg"
                onClick={() => playTrack(crate.tracks[0], crate.tracks)}
                className="gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                Play Crate ({crate.tracks.length} Cuts)
              </TactileButton>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-aura-800 pb-3">
          <h3 className="font-serif text-xl text-aura-100 font-medium">Crate Tracklist</h3>
          <span className="text-xs font-mono text-aura-500">
            {crate.tracks.length} Tracks
          </span>
        </div>

        {crate.tracks.length === 0 ? (
          <div className="p-12 text-center bg-aura-850/40 rounded-2xl border border-aura-800 text-aura-500">
            This crate has no tracks yet.
          </div>
        ) : (
          <div className="divide-y divide-aura-800/40">
            {crate.tracks.map((track, idx) => (
              <TrackRow
                key={track.id}
                track={track}
                index={idx}
                playlistContext={crate.tracks}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetailPage;
