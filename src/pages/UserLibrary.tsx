import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderPlus,
  Play,
  Trash2,
  Edit2,
  FolderOpen,
  Calendar,
  Layers
} from 'lucide-react';
import { useLibraryStore } from '../store/useLibraryStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { TactileButton } from '../components/ui/TactileButton';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { toast } from '../store/useToastStore';
import { ArtworkImage } from '../components/ui/ArtworkImage';

export const UserLibrary: React.FC = () => {
  const navigate = useNavigate();
  const { crates, createCrate, renameCrate, deleteCrate } = useLibraryStore();
  const { playTrack } = usePlayerStore();

  useEffect(() => {
    document.title = 'Library — AURA';
  }, []);

  // Create Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createTitle, setCreateTitle] = useState('');
  const [createDesc, setCreateDesc] = useState('');

  // Rename Modal State
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameTitle, setRenameTitle] = useState('');
  const [renameDesc, setRenameDesc] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createTitle.trim()) return;

    createCrate(createTitle.trim(), createDesc.trim());
    toast.success('Playlist created successfully.');

    setCreateTitle('');
    setCreateDesc('');
    setIsCreateOpen(false);
  };

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameId || !renameTitle.trim()) return;

    renameCrate(renameId, renameTitle.trim(), renameDesc.trim());
    toast.success('Playlist updated successfully.');

    setRenameId(null);
    setRenameTitle('');
    setRenameDesc('');
    setIsRenameOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete the crate "${title}"?`)) {
      deleteCrate(id);
      toast.info('Playlist deleted.');
    }
  };

  const handlePlayCrate = (e: React.MouseEvent, tracks: any[]) => {
    e.stopPropagation();
    if (tracks.length > 0) {
      playTrack(tracks[0], tracks);
      toast.success('Playing playlist queue.');
    } else {
      toast.error('Crate has no recordings yet.');
    }
  };

  const openRenameModal = (e: React.MouseEvent, id: string, title: string, desc: string) => {
    e.stopPropagation();
    setRenameId(id);
    setRenameTitle(title);
    setRenameDesc(desc);
    setIsRenameOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-aura-800/85 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-aura-accent">
            Sonic Collections
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-aura-100 font-normal mt-1">
            My Crates
          </h1>
          <p className="text-sm text-aura-400 font-sans mt-2 max-w-xl">
            Custom-assembled listening archives and tapes preserved in your personal repository.
          </p>
        </div>

        <TactileButton
          variant="primary"
          size="md"
          onClick={() => setIsCreateOpen(true)}
          className="gap-2 shrink-0 shadow-aura-subtle"
        >
          <FolderPlus className="w-4 h-4" />
          Assemble Crate
        </TactileButton>
      </div>

      {/* Playlist Grid */}
      {crates.length === 0 ? (
        <div className="p-16 text-center bg-aura-850/40 rounded-3xl border border-aura-800 text-aura-400 space-y-3">
          <FolderOpen className="w-8 h-8 mx-auto text-aura-600 stroke-[1.2]" />
          <h4 className="font-serif text-lg text-aura-200">No playlists found</h4>
          <p className="text-xs text-aura-500 max-w-sm mx-auto">
            Assemble your first custom audio crate to currate and sequence independent releases.
          </p>
          <div className="pt-2">
            <TactileButton variant="secondary" size="sm" onClick={() => setIsCreateOpen(true)}>
              Create Playlist
            </TactileButton>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {crates.map((crate) => (
            <div
              key={crate.id}
              onClick={() => navigate(`/playlist/${crate.id}`)}
              className="p-5 rounded-3xl bg-aura-850 border border-aura-800 hover:border-aura-700/80 transition-all select-none cursor-pointer flex flex-col sm:flex-row gap-5 group"
            >
              {/* Cover Art */}
              <div className="w-full sm:w-32 aspect-square rounded-2xl overflow-hidden shrink-0 border border-white/5 relative">
                <ArtworkImage src={crate.coverUrl} alt={crate.title} />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Play className="w-8 h-8 text-white fill-current ml-0.5" />
                </div>
              </div>

              {/* Details & Actions */}
              <div className="flex-1 flex flex-col justify-between min-w-0 space-y-4">
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-serif text-lg text-aura-100 font-semibold group-hover:text-aura-accent transition-colors truncate">
                      {crate.title}
                    </h3>
                  </div>
                  <p className="text-xs text-aura-400 font-sans line-clamp-2">
                    {crate.description || 'Personal curation archive.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-aura-800/60 text-[10px] font-mono text-aura-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-aura-accent" />
                      {crate.tracks.length} Cuts
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {crate.createdAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {crate.tracks.length > 0 && (
                      <button
                        onClick={(e) => handlePlayCrate(e, crate.tracks)}
                        className="p-2 rounded-lg bg-aura-800 border border-aura-700 text-aura-accent hover:text-white hover:bg-aura-accent transition-all"
                        title="Play Playlist"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>
                    )}

                    <button
                      onClick={(e) =>
                        openRenameModal(e, crate.id, crate.title, crate.description || '')
                      }
                      className="p-2 rounded-lg bg-aura-800 border border-aura-700 text-aura-400 hover:text-aura-100 transition-colors"
                      title="Edit Crate Details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(crate.id, crate.title);
                      }}
                      className="p-2 rounded-lg bg-aura-800 border border-aura-700 text-aura-400 hover:text-aura-accent transition-colors"
                      title="Delete Crate"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE MODAL */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Assemble Crate">
        <form onSubmit={handleCreateSubmit} className="space-y-5">
          <Input
            label="Crate Title"
            value={createTitle}
            onChange={(e) => setCreateTitle(e.target.value)}
            placeholder="e.g. Late Night Modular Experiments"
            required
          />

          <div className="space-y-2">
            <label className="text-[11px] font-mono uppercase tracking-wider text-aura-400">
              Description
            </label>
            <textarea
              value={createDesc}
              onChange={(e) => setCreateDesc(e.target.value)}
              placeholder="Describe the atmosphere or tape parameters of this compilation..."
              className="w-full h-24 rounded-2xl bg-aura-900 border border-aura-700 text-aura-100 text-xs px-4 py-3 placeholder:text-aura-500 focus:outline-hidden focus:border-aura-accent transition-all resize-none font-sans"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <TactileButton variant="secondary" size="md" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </TactileButton>
            <TactileButton variant="primary" size="md" type="submit">
              Create Crate
            </TactileButton>
          </div>
        </form>
      </Modal>

      {/* RENAME MODAL */}
      <Modal isOpen={isRenameOpen} onClose={() => setIsRenameOpen(false)} title="Edit Crate Details">
        <form onSubmit={handleRenameSubmit} className="space-y-5">
          <Input
            label="Crate Title"
            value={renameTitle}
            onChange={(e) => setRenameTitle(e.target.value)}
            placeholder="e.g. Tape Fragments & Geometries"
            required
          />

          <div className="space-y-2">
            <label className="text-[11px] font-mono uppercase tracking-wider text-aura-400">
              Description
            </label>
            <textarea
              value={renameDesc}
              onChange={(e) => setRenameDesc(e.target.value)}
              placeholder="Describe the atmospheric parameters..."
              className="w-full h-24 rounded-2xl bg-aura-900 border border-aura-700 text-aura-100 text-xs px-4 py-3 placeholder:text-aura-500 focus:outline-hidden focus:border-aura-accent transition-all resize-none font-sans"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <TactileButton variant="secondary" size="md" onClick={() => setIsRenameOpen(false)}>
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

export default UserLibrary;
