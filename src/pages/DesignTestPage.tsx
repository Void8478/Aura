import React, { useState, useEffect } from 'react';
import {
  Play,
  Heart,
  Search,
  Disc3,
  Sliders,
  Plus,
} from 'lucide-react';
import {
  Display,
  PageTitle,
  SectionTitle,
  BodyText,
  MetadataText,
  LabelText,
} from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import { IconButton } from '../components/ui/IconButton';
import { Input } from '../components/ui/Input';
import { SearchInput } from '../components/ui/SearchInput';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Divider } from '../components/ui/Divider';
import { Modal } from '../components/ui/Modal';
import { toast } from '../store/useToastStore';
import { TrackRowSkeleton, AlbumCardSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { AlbumCard } from '../components/music/AlbumCard';
import { ArtistCard } from '../components/music/ArtistCard';
import { PlaylistCard } from '../components/music/PlaylistCard';
import { SectionHeader } from '../components/music/SectionHeader';
import { TrackRow } from '../components/common/TrackRow';
import { CURATED_TRACKS, CURATED_ALBUMS, CURRENT_ISSUE, MOCK_CRATES } from '../data/mockData';

export const DesignTestPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  useEffect(() => {
    document.title = 'Design System — AURA';
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 space-y-16">
      {/* Design System Header */}
      <div className="border-b border-aura-800 pb-8">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="accent">Component Architecture</Badge>
          <span className="text-xs font-mono text-aura-500">AURA Design System v1.0</span>
        </div>
        <Display>Visual Foundation & Primitives</Display>
        <BodyText size="lg" muted className="mt-3 max-w-3xl">
          Comprehensive design token showcase covering typography hierarchy, interactive button
          states, form primitives, music cards, skeletons, and accessible overlay dialogues.
        </BodyText>
      </div>

      {/* 1. Typography Hierarchy */}
      <section className="space-y-6">
        <SectionHeader
          eyebrow="Tokens & Hierarchy"
          title="1. Typography Scale"
          subtitle="Editorial Fraunces Serif paired with Plus Jakarta Sans and JetBrains Mono."
        />

        <div className="p-6 rounded-2xl bg-aura-850/60 border border-aura-800 space-y-6">
          <div className="space-y-1">
            <LabelText variant="accent">Display Heading (Hero / Masthead)</LabelText>
            <Display>Textures of the Subconscious</Display>
          </div>

          <Divider />

          <div className="space-y-1">
            <LabelText variant="amber">Page Title</LabelText>
            <PageTitle>Acoustic Dispatches & Liner Notes</PageTitle>
          </div>

          <Divider />

          <div className="space-y-1">
            <LabelText variant="muted">Section Title</LabelText>
            <SectionTitle>Curator's Sonic Architecture</SectionTitle>
          </div>

          <Divider />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <LabelText variant="muted">Body Text (Large)</LabelText>
              <BodyText size="lg" className="mt-1">
                Recorded on a restored Revox B77 1/4" tape machine in an abandoned textile mill.
              </BodyText>
            </div>
            <div>
              <LabelText variant="muted">Body Text (Base)</LabelText>
              <BodyText size="base" className="mt-1">
                Tape hiss is preserved as a harmonic foundation for the entire composition.
              </BodyText>
            </div>
            <div>
              <LabelText variant="muted">Body Text (Small / Muted)</LabelText>
              <BodyText size="sm" muted className="mt-1">
                All rights reserved under Creative Commons License BY-NC 4.0.
              </BodyText>
            </div>
          </div>

          <Divider />

          <div className="flex flex-wrap items-center gap-4">
            <div>
              <LabelText variant="muted" className="block mb-1">Metadata Text</LabelText>
              <MetadataText>68 BPM • D Minor • 320 kbps AAC</MetadataText>
            </div>
            <div>
              <LabelText variant="muted" className="block mb-1">Highlighted Metadata</LabelText>
              <MetadataText highlight>LIVE ANALOG STREAM • 43.6 Hz</MetadataText>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Button & Icon Button System */}
      <section className="space-y-6">
        <SectionHeader
          eyebrow="Interactive Controls"
          title="2. Button & Action System"
          subtitle="Tactile buttons with active micro-press scaling, focus rings, and loading indicators."
        />

        <div className="p-6 rounded-2xl bg-aura-850/60 border border-aura-800 space-y-6">
          <div className="space-y-3">
            <LabelText variant="muted">Button Variants (Medium Size)</LabelText>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" leftIcon={<Play className="w-4 h-4 fill-current" />}>
                Primary Action
              </Button>
              <Button variant="secondary">Secondary Action</Button>
              <Button variant="accent">Accent Action</Button>
              <Button variant="outline">Outline Action</Button>
              <Button variant="ghost">Ghost Action</Button>
              <Button variant="danger">Danger Action</Button>
            </div>
          </div>

          <Divider />

          <div className="space-y-3">
            <LabelText variant="muted">Button Sizes & Loading States</LabelText>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" size="sm">Small Action</Button>
              <Button variant="primary" size="md">Medium Action</Button>
              <Button variant="primary" size="lg">Large Action</Button>
              <Button
                variant="secondary"
                isLoading={isButtonLoading}
                onClick={() => {
                  setIsButtonLoading(true);
                  setTimeout(() => setIsButtonLoading(false), 2000);
                }}
              >
                {isButtonLoading ? 'Buffering...' : 'Click for Loading State'}
              </Button>
              <Button variant="secondary" disabled>Disabled Action</Button>
            </div>
          </div>

          <Divider />

          <div className="space-y-3">
            <LabelText variant="muted">Icon Buttons (Shapes & Sizes)</LabelText>
            <div className="flex flex-wrap items-center gap-3">
              <IconButton variant="primary" size="sm" aria-label="Play">
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              </IconButton>
              <IconButton variant="secondary" size="md" aria-label="Favorite" active>
                <Heart className="w-4 h-4 fill-current text-aura-accent" />
              </IconButton>
              <IconButton variant="accent" size="lg" shape="square" aria-label="Deck">
                <Disc3 className="w-5 h-5" />
              </IconButton>
              <IconButton variant="outline" size="md" aria-label="Settings">
                <Sliders className="w-4 h-4" />
              </IconButton>
              <IconButton variant="ghost" size="md" aria-label="Search">
                <Search className="w-4 h-4" />
              </IconButton>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Form Controls & Inputs */}
      <section className="space-y-6">
        <SectionHeader
          eyebrow="Form Primitives"
          title="3. Inputs & Search Controls"
          subtitle="Accessible inputs with label typography, helper hints, error validations, and shortcuts."
        />

        <div className="p-6 rounded-2xl bg-aura-850/60 border border-aura-800 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Standard Text Field"
              placeholder="e.g. Kyoto Midnight Variations"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              helperText="Saved automatically to local crate manifest."
            />

            <Input
              label="Field with Validation Error"
              defaultValue="Invalid Frequency String"
              error="The entered frequency does not fall within 40–160 Hz bounds."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <LabelText variant="muted" className="block mb-1.5">Interactive Search Input</LabelText>
              <SearchInput
                value={searchValue}
                onChange={(val) => setSearchValue(val)}
                placeholder="Search archive by keyword or composer..."
              />
            </div>

            <div>
              <LabelText variant="muted" className="block mb-1.5">Disabled State</LabelText>
              <Input
                disabled
                placeholder="Read-only audio telemetry"
                defaultValue="Stem stream locked by license"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Badges, Avatars & Dividers */}
      <section className="space-y-6">
        <SectionHeader
          eyebrow="Badges & Indicators"
          title="4. Badges, Avatars & Dividers"
          subtitle="Minimalist visual tags and curator profile tokens."
        />

        <div className="p-6 rounded-2xl bg-aura-850/60 border border-aura-800 space-y-6">
          <div className="space-y-3">
            <LabelText variant="muted">Badge Variants</LabelText>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Ambient</Badge>
              <Badge variant="accent">Featured Selection</Badge>
              <Badge variant="amber">Warm & Analog</Badge>
              <Badge variant="mono">68 BPM</Badge>
              <Badge variant="outline">Creative Commons</Badge>
            </div>
          </div>

          <Divider label="Curator Avatars & Status" />

          <div className="space-y-3">
            <LabelText variant="muted">Avatars (Sizes XS to XL)</LabelText>
            <div className="flex flex-wrap items-center gap-4">
              <Avatar size="xs" name="Dr. Vance" status="online" />
              <Avatar size="sm" src={CURRENT_ISSUE.curatorAvatar} status="online" />
              <Avatar size="md" src={CURRENT_ISSUE.curatorAvatar} status="busy" />
              <Avatar size="lg" name="Elena Rostova" status="offline" />
              <Avatar size="xl" src={CURRENT_ISSUE.curatorAvatar} />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Toasts & Modal Dialogs */}
      <section className="space-y-6">
        <SectionHeader
          eyebrow="Overlays & Feedback"
          title="5. Toasts & Modal Overlays"
          subtitle="Non-intrusive feedback toasts and accessible backdrop modal dialogs."
        />

        <div className="p-6 rounded-2xl bg-aura-850/60 border border-aura-800 flex flex-wrap gap-3">
          <Button
            variant="secondary"
            onClick={() => toast.success('Recording saved', 'Track added to Midnight Driving crate.')}
          >
            Trigger Success Toast
          </Button>

          <Button
            variant="secondary"
            onClick={() => toast.info('Now Playing', 'Holloway & The Monolith — Modular Tape Study #4')}
          >
            Trigger Info Toast
          </Button>

          <Button
            variant="secondary"
            onClick={() => toast.warning('High Impedance', 'Headphone volume exceeds recommended limit.')}
          >
            Trigger Warning Toast
          </Button>

          <Button
            variant="secondary"
            onClick={() => toast.error('Playback Error', 'Unable to stream stem from external CDN.')}
          >
            Trigger Error Toast
          </Button>

          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            Open Test Modal Dialog
          </Button>
        </div>
      </section>

      {/* 6. Skeletons & State Indicators */}
      <section className="space-y-6">
        <SectionHeader
          eyebrow="Asynchronous Loading"
          title="6. Skeletons, Empty & Error States"
          subtitle="Refined states when content is loading, absent, or failing to stream."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 space-y-4">
            <LabelText variant="muted">TrackRow & Album Skeletons</LabelText>
            <div className="p-4 rounded-2xl bg-aura-850/40 border border-aura-800 space-y-2">
              <TrackRowSkeleton />
              <TrackRowSkeleton />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <AlbumCardSkeleton />
              <AlbumCardSkeleton />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <EmptyState
              title="No Crates Assembled"
              description="You have not created any custom audio archives yet. Build a crate to group favorite records."
              action={
                <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                  Create First Crate
                </Button>
              }
            />

            <ErrorState
              title="Audio Network Interrupted"
              message="The streaming server did not respond in time. Tap retry to reconnect."
              onRetry={() => toast.info('Reconnecting...', 'Attempting to establish audio stream.')}
            />
          </div>
        </div>
      </section>

      {/* 7. Reusable Music Components */}
      <section className="space-y-6">
        <SectionHeader
          eyebrow="Audio Entities"
          title="7. Standardized Music Components"
          subtitle="AlbumCard, ArtistCard, PlaylistCard, and TrackRow components."
        />

        <div className="space-y-8">
          <div>
            <LabelText variant="muted" className="block mb-3">AlbumCards</LabelText>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {CURATED_ALBUMS.map((album) => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          </div>

          <div>
            <LabelText variant="muted" className="block mb-3">Playlist / Crate Cards</LabelText>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {MOCK_CRATES.map((crate) => (
                <PlaylistCard key={crate.id} crate={crate} />
              ))}
            </div>
          </div>

          <div>
            <LabelText variant="muted" className="block mb-3">ArtistCards</LabelText>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <ArtistCard
                name="Holloway & The Monolith"
                location="Sheffield, UK"
                genre="Ambient"
                artworkUrl={CURRENT_ISSUE.spotlightArtist.artworkUrl}
                tracksCount={6}
              />
              <ArtistCard
                name="Kaito Moriyama"
                location="Tokyo, Japan"
                genre="Lo-Fi"
                artworkUrl={CURATED_TRACKS[1].coverUrl}
                tracksCount={4}
              />
              <ArtistCard
                name="Elena Rostova"
                location="Tampere, Finland"
                genre="Neo-Classical"
                artworkUrl={CURATED_TRACKS[2].coverUrl}
                tracksCount={5}
              />
            </div>
          </div>

          <div>
            <LabelText variant="muted" className="block mb-3">TrackRows</LabelText>
            <div className="divide-y divide-aura-800/40 p-2 rounded-2xl bg-aura-850/40 border border-aura-800">
              {CURATED_TRACKS.slice(0, 3).map((track, idx) => (
                <TrackRow key={track.id} track={track} index={idx} playlistContext={CURATED_TRACKS} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Modal Demo */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tactile Modal Dialog"
        subtitle="Accessible dialog overlay with Escape key listener and backdrop blur"
        maxWidth="md"
      >
        <div className="space-y-4 font-sans">
          <p className="text-sm text-aura-300 leading-relaxed">
            This modal demonstrates the standard dialog shell with focus trap, backdrop dismissal,
            and keyboard support.
          </p>

          <div className="p-4 rounded-xl bg-aura-850 border border-aura-800">
            <span className="text-[11px] font-mono text-aura-500 uppercase">Modal State</span>
            <p className="text-sm text-aura-100 mt-0.5">ARIA role: dialog • Trapped: true</p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Dismiss
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                toast.success('Confirmed', 'Action was executed from the modal.');
                setIsModalOpen(false);
              }}
            >
              Confirm Action
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DesignTestPage;
