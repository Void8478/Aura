import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Disc, ArrowRight } from 'lucide-react';
import { CURRENT_ISSUE, CURATED_TRACKS, CURATED_ALBUMS } from '../services/mockCatalog';
import { usePlayerStore } from '../store/usePlayerStore';
import { ArtworkImage } from '../components/ui/ArtworkImage';
import { Badge } from '../components/ui/Badge';
import { TactileButton } from '../components/ui/TactileButton';
import { TrackRow } from '../components/common/TrackRow';
import { EditorialCard } from '../components/common/EditorialCard';
import { CuratorNote } from '../components/common/CuratorNote';

export const EditorialFeed: React.FC = () => {
  const { playTrack } = usePlayerStore();
  const navigate = useNavigate();

  const featuredTrack = CURRENT_ISSUE.featuredTracks[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-16 sm:space-y-24">
      <section className="relative border-b border-aura-800/80 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <Badge variant="accent" size="md">
                ISSUE #{CURRENT_ISSUE.issueNumber}
              </Badge>
              <span className="text-xs font-mono text-aura-400">
                {CURRENT_ISSUE.seasonYear}
              </span>
              <span className="text-aura-600 hidden sm:inline">•</span>
              <span className="text-xs text-aura-500 hidden sm:inline">
                Curated by {CURRENT_ISSUE.curatorName} ({CURRENT_ISSUE.curatorRole})
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-aura-100 font-normal tracking-tight leading-[1.08] text-balance">
              {CURRENT_ISSUE.title}
            </h1>
            <p className="font-serif text-lg sm:text-xl text-aura-300 italic mt-3 max-w-2xl text-balance">
              {CURRENT_ISSUE.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <TactileButton
              variant="primary"
              size="lg"
              onClick={() => playTrack(featuredTrack, CURRENT_ISSUE.featuredTracks)}
              className="gap-2 shadow-aura-subtle"
            >
              <Play className="w-4 h-4 fill-current" />
              Play Issue #14
            </TactileButton>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6 border-t border-aura-800/50">
          <div className="lg:col-span-8 text-aura-300 font-sans text-base sm:text-lg leading-relaxed space-y-4">
            {CURRENT_ISSUE.leadArticle.split('\n\n').map((para, i) => (
              <p key={i} className="text-justify sm:text-left">
                {para}
              </p>
            ))}
          </div>

          <div className="lg:col-span-4 p-6 rounded-2xl bg-aura-850 border border-aura-800/90 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={CURRENT_ISSUE.curatorAvatar}
                alt={CURRENT_ISSUE.curatorName}
                className="w-12 h-12 rounded-full object-cover border border-aura-700"
              />
              <div>
                <h4 className="text-sm font-semibold text-aura-100">{CURRENT_ISSUE.curatorName}</h4>
                <p className="text-xs text-aura-400">{CURRENT_ISSUE.curatorRole}</p>
              </div>
            </div>
            <p className="text-xs text-aura-400 italic font-serif leading-relaxed">
              "We choose sound not based on chart metrics, but on how much acoustic honesty is preserved in the recording chain."
            </p>
            <div className="pt-2 border-t border-aura-800 flex items-center justify-between text-[11px] font-mono text-aura-500">
              <span>Sheffield Archives</span>
              <span>10 Master Tracks</span>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-aura-accent" />
            <h2 className="font-serif text-2xl sm:text-3xl text-aura-100 font-medium">
              Featured Recording Dispatch
            </h2>
          </div>
          <span className="text-xs font-mono text-aura-500 uppercase tracking-wider hidden sm:inline">
            Master Audio Edition
          </span>
        </div>

        <EditorialCard
          track={featuredTrack}
          layout="feature-large"
          onSelectRelease={() => navigate(`/release/album-01`)}
        />
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-aura-accent">
              AURA Sound Series
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-aura-100 font-medium mt-1">
              Curator's Sonic Dispatches
            </h2>
          </div>
          <button
            onClick={() => navigate('/browse')}
            className="text-xs font-medium text-aura-300 hover:text-aura-accent flex items-center gap-1 transition-colors"
          >
            View all 30+ dispatches <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <EditorialCard
            track={CURATED_TRACKS[1]}
            layout="dispatch-split"
            curatorQuote="Recorded in Tokyo dusk with felt piano hammers and light rain."
          />
          <EditorialCard
            track={CURATED_TRACKS[2]}
            layout="dispatch-split"
            curatorQuote="Two vintage Italian cellos paired with a subterranean 43.6 Hz sine wave."
          />
          <EditorialCard
            track={CURATED_TRACKS[4]}
            layout="dispatch-split"
            curatorQuote="Late night Rhodes MK II jazz improvisations tracked in one take."
          />
        </div>
      </section>

      <CuratorNote
        quote="Silence is not an absence of sound, but the space where subtle textures finally breathe."
        author="Holloway & The Monolith"
        role="Tape Archivist, Sheffield UK"
      />

      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-aura-800 pb-3">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-aura-amber">
              Curated Tracklist
            </span>
            <h2 className="font-serif text-2xl text-aura-100 font-medium mt-0.5">
              Issue #14 Audio Program
            </h2>
          </div>
          <span className="text-xs font-mono text-aura-400">
            {CURRENT_ISSUE.featuredTracks.length} Essential Cuts
          </span>
        </div>

        <div className="divide-y divide-aura-800/40">
          {CURRENT_ISSUE.featuredTracks.map((track, idx) => (
            <TrackRow
              key={track.id}
              track={track}
              index={idx}
              showCover={true}
              showAlbum={true}
              showBpm={true}
              playlistContext={CURRENT_ISSUE.featuredTracks}
            />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-aura-accent">
              Editions & Records
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-aura-100 font-medium mt-1">
              Sonic Architecture Editions
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CURATED_ALBUMS.map((album) => (
            <div
              key={album.id}
              onClick={() => navigate(`/release/${album.id}`)}
              className="group cursor-pointer rounded-2xl p-4 bg-aura-850/60 border border-aura-800/80 hover:border-aura-700 transition-all tactile-card tactile-card-hover"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden mb-3 border border-white/5">
                <ArtworkImage src={album.coverUrl} alt={album.title} />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-aura-accent text-white flex items-center justify-center shadow-lg">
                    <Disc className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-aura-500 mb-1">
                <span>{album.genre}</span>
                <span>{album.year}</span>
              </div>

              <h4 className="font-serif text-base text-aura-100 font-medium group-hover:text-aura-accent transition-colors line-clamp-1">
                {album.title}
              </h4>
              <p className="text-xs text-aura-400 font-sans mt-0.5 truncate">
                {album.artist}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
