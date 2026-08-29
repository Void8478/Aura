import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, MapPin } from 'lucide-react';
import { CURATED_TRACKS, CURRENT_ISSUE } from '../data/mockData';
import { usePlayerStore } from '../store/usePlayerStore';
import { TrackRow } from '../components/common/TrackRow';
import { ArtworkImage } from '../components/ui/ArtworkImage';
import { Badge } from '../components/ui/Badge';
import { TactileButton } from '../components/ui/TactileButton';

export const ArtistDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { playTrack } = usePlayerStore();

  const artistTracks = CURATED_TRACKS.filter(
    (t) => t.artist.toLowerCase().replace(/\s+/g, '-') === id || t.id === id
  );

  const tracksToDisplay = artistTracks.length > 0 ? artistTracks : [CURATED_TRACKS[0], CURATED_TRACKS[3]];
  const artistName = tracksToDisplay[0]?.artist || 'Holloway & The Monolith';

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
            <ArtworkImage src={CURRENT_ISSUE.spotlightArtist.artworkUrl} alt={artistName} />
          </div>
        </div>

        <div className="md:col-span-8 space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="accent">Artist Spotlight</Badge>
            <span className="text-xs font-mono text-aura-500 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-aura-accent" />
              Sheffield, UK
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl text-aura-100 font-normal leading-tight">
            {artistName}
          </h1>

          <p className="text-base text-aura-300 font-sans leading-relaxed max-w-2xl">
            {CURRENT_ISSUE.spotlightArtist.bio}
          </p>

          <div className="pt-2 flex items-center gap-3">
            <TactileButton
              variant="primary"
              size="lg"
              onClick={() => playTrack(tracksToDisplay[0], tracksToDisplay)}
              className="gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              Play Top Dispatches ({tracksToDisplay.length})
            </TactileButton>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-aura-800 pb-3">
          <h3 className="font-serif text-xl text-aura-100 font-medium">Recordings & Stems</h3>
          <span className="text-xs font-mono text-aura-500">
            {tracksToDisplay.length} Works
          </span>
        </div>

        <div className="divide-y divide-aura-800/40">
          {tracksToDisplay.map((track, idx) => (
            <TrackRow
              key={track.id}
              track={track}
              index={idx}
              playlistContext={tracksToDisplay}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtistDetailPage;
