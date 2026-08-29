import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Play,
  Shuffle,
  Heart,
  Edit3,
  Trash2,
  ChevronUp,
  ChevronDown,
  Layers,
  Calendar,
  XCircle,
  Pause
} from 'lucide-react';
import { useLibraryStore } from '../store/useLibraryStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { toast } from '../store/useToastStore';
import { ArtworkImage } from '../components/ui/ArtworkImage';
import { Badge } from '../components/ui/Badge';
import { TactileButton } from '../components/ui/TactileButton';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { formatTime } from '../utils/formatters';

export const PlaylistDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { crates, renameCrate, deleteCrate, removeTrackFromCrate, reorderCrateTracks, toggleFavorite, isFavorite } =
    useLibraryStore();
  const { currentTrack, isPlaying, playTrack, toggleShuffle } = usePlayerStore();

  const crate = crates.find((c) => c.id === id);

  // Edit Crate Modal State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  if (!crate) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="font-serif text-2xl text-aura-100">Playlist not found</h2>
        <TactileButton variant="primary" className="mt-4" onClick={() => navigate('/library')}>
          Go to Library
        </TactileButton>
      </div>
    );
  }

  const handlePlayCrate = () => {
    if (crate.tracks.length > 0) {
      playTrack(crate.tracks[0], crate.tracks);
      toast.success(`Playing "${crate.title}" queue.`);
    }
  };

  const handleShufflePlay = () => {
    if (crate.tracks.length > 0) {
      const shuffled = [...crate.tracks].sort(() => Math.random() - 0.5);
      playTrack(shuffled[0], shuffled);
      toggleShuffle();
      toast.success(`Shuffled and playing "${crate.title}".`);
    }
  };

  const handleOpenEdit = () => {
    setEditTitle(crate.title);
    setEditDesc(crate.description || '');
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    renameCrate(crate.id, editTitle.trim(), editDesc.trim());
    toast.success('Crate renamed successfully.');
    setIsEditOpen(false);
  };

  const handleDeleteCrate = () => {
    if (window.confirm(`Are you sure you want to permanently delete the crate "${crate.title}"?`)) {
      deleteCrate(crate.id);
      toast.info('Crate deleted.');
      navigate('/library');
    }
  };

  const handleRemoveTrack = (trackId: string, trackTitle: string) => {
    removeTrackFromCrate(crate.id, trackId);
    toast.info(`Removed "${trackTitle}" from crate.`);
  };

  const handleMoveUp = (idx: number) => {
    if (idx > 0) {
      reorderCrateTracks(crate.id, idx, idx - 1);
    }
  };

  const handleMoveDown = (idx: number) => {
    if (idx < crate.tracks.length - 1) {
      reorderCrateTracks(crate.id, idx, idx + 1);
    }
  };

  const handleTrackRowClick = (track: any) => {
    const isCurrent = currentTrack?.id === track.id;
    if (isCurrent) {
      usePlayerStore.getState().togglePlay();
    } else {
      playTrack(track, crate.tracks);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
      {/* Back link */}
      <div>
        <button
          onClick={() => navigate('/library')}
          className="inline-flex items-center gap-2 text-xs font-mono text-aura-400 hover:text-aura-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Library
        </button>
      </div>

      {/* Playlist Hero */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pb-12 border-b border-aura-800/80">
        <div className="md:col-span-5 lg:col-span-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden shadow-aura-deck border border-white/10">
            <ArtworkImage src={crate.coverUrl || (crate.tracks[0]?.coverUrl)} alt={crate.title} />
          </div>
        </div>

        <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="amber">Curated Crate</Badge>
              <span className="text-xs font-mono text-aura-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {crate.createdAt}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-aura-100 font-normal leading-tight">
              {crate.title}
            </h1>

            <p className="text-base text-aura-300 font-sans leading-relaxed max-w-2xl">
              {crate.description || 'Personal curation archive.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {crate.tracks.length > 0 ? (
              <>
                <TactileButton
                  variant="primary"
                  size="lg"
                  onClick={handlePlayCrate}
                  className="gap-2 shadow-aura-subtle"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                  Play Crate ({crate.tracks.length})
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
              </>
            ) : null}

            <TactileButton
              variant="secondary"
              size="lg"
              onClick={handleOpenEdit}
              className="gap-2"
              title="Edit Details"
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </TactileButton>

            <TactileButton
              variant="secondary"
              size="lg"
              onClick={handleDeleteCrate}
              className="gap-2 text-aura-accent hover:bg-aura-accent/10 border-aura-800"
              title="Delete Crate"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </TactileButton>
          </div>
        </div>
      </section>

      {/* Playlist Tracks List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-aura-800 pb-3">
          <h3 className="font-serif text-xl text-aura-100 font-medium">Crate Tracks</h3>
          <span className="text-xs font-mono text-aura-500 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-aura-accent" />
            {crate.tracks.length} Cuts
          </span>
        </div>

        {crate.tracks.length === 0 ? (
          <div className="p-16 text-center bg-aura-850/40 rounded-3xl border border-aura-800 text-aura-400">
            <h5 className="font-serif text-base text-aura-200">No tracks added to this playlist yet</h5>
            <p className="text-xs text-aura-500 max-w-sm mx-auto mt-1">
              Browse tracks on Home, Discover, or Search, and click the "+" action to add them to your crates.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-aura-800/40 select-none">
            {crate.tracks.map((track, idx) => {
              const isCurrent = currentTrack?.id === track.id;
              const isLiked = isFavorite(track.id);

              return (
                <div
                  key={`${track.id}-${idx}`}
                  className={`group flex items-center justify-between p-3.5 rounded-2xl transition-all border border-transparent ${
                    isCurrent ? 'bg-aura-850 border-aura-accent/30' : 'hover:bg-aura-850/40'
                  }`}
                >
                  {/* Left Column: Number / Play Indicator & Artwork / Title */}
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    {/* Index / Play / Pause Button */}
                    <button
                      onClick={() => handleTrackRowClick(track)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isCurrent
                          ? 'bg-aura-accent text-white'
                          : 'text-aura-400 hover:bg-aura-800 hover:text-aura-100'
                      }`}
                    >
                      {isCurrent && isPlaying ? (
                        <Pause className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Play
                          className={`w-3.5 h-3.5 fill-current ml-0.5 ${
                            !isCurrent ? 'hidden group-hover:block' : ''
                          }`}
                        />
                      )}
                      {!isCurrent && (
                        <span className="text-xs font-mono text-aura-500 group-hover:hidden">
                          {(idx + 1).toString().padStart(2, '0')}
                        </span>
                      )}
                    </button>

                    {/* Artwork thumbnail */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/5 shrink-0 shadow-xs">
                      <ArtworkImage src={track.coverUrl} alt={track.title} />
                    </div>

                    {/* Meta info */}
                    <div className="min-w-0 flex-1">
                      <h4
                        onClick={() => handleTrackRowClick(track)}
                        className={`text-sm sm:text-base font-semibold truncate cursor-pointer hover:text-aura-accent ${
                          isCurrent ? 'text-aura-accent' : 'text-aura-100'
                        }`}
                      >
                        {track.title}
                      </h4>
                      <p className="text-xs text-aura-400 font-sans truncate mt-0.5">
                        {track.artist}
                      </p>
                    </div>
                  </div>

                  {/* Actions column */}
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <span className="text-xs font-mono text-aura-400 mr-2">
                      {formatTime(track.duration)}
                    </span>

                    {/* Favorite heart */}
                    <button
                      onClick={() => toggleFavorite(track.id, track)}
                      className={`p-1.5 rounded-lg border border-transparent transition-colors ${
                        isLiked ? 'text-aura-accent' : 'text-aura-500 hover:text-aura-200'
                      }`}
                      title={isLiked ? 'Unlike' : 'Like'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                    </button>

                    {/* Reorder actions */}
                    <div className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1.5">
                      <button
                        onClick={() => handleMoveUp(idx)}
                        disabled={idx === 0}
                        className={`p-1 rounded-md text-aura-500 hover:text-aura-200 disabled:opacity-30 disabled:pointer-events-none transition-colors`}
                        title="Move Up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMoveDown(idx)}
                        disabled={idx === crate.tracks.length - 1}
                        className={`p-1 rounded-md text-aura-500 hover:text-aura-200 disabled:opacity-30 disabled:pointer-events-none transition-colors`}
                        title="Move Down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => handleRemoveTrack(track.id, track.title)}
                      className="p-1.5 rounded-lg text-aura-500 hover:text-aura-accent transition-colors"
                      title="Remove from playlist"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* EDIT MODAL */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Crate Details">
        <form onSubmit={handleEditSubmit} className="space-y-5">
          <Input
            label="Crate Title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="e.g. Ambient Archives Vol. 1"
            required
          />

          <div className="space-y-2">
            <label className="text-[11px] font-mono uppercase tracking-wider text-aura-400">
              Description
            </label>
            <textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              placeholder="Describe the mood or contents..."
              className="w-full h-24 rounded-2xl bg-aura-900 border border-aura-700 text-aura-100 text-xs px-4 py-3 placeholder:text-aura-500 focus:outline-hidden focus:border-aura-accent transition-all resize-none font-sans"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <TactileButton variant="secondary" size="md" onClick={() => setIsEditOpen(false)}>
              Cancel
            </TactileButton>
            <TactileButton variant="primary" size="md" type="submit">
              Save Changes
            </TactileButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PlaylistDetailPage;
