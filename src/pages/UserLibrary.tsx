import React, { useState } from 'react';
import {
  Heart,
  FolderPlus,
  History,
  BookOpen,
  Play,
  Trash2,
  Plus,
} from 'lucide-react';
import { useLibraryStore } from '../store/useLibraryStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { CURATED_TRACKS } from '../services/mockCatalog';
import { TrackRow } from '../components/common/TrackRow';
import { TactileButton } from '../components/ui/TactileButton';
import { Modal } from '../components/ui/Modal';

export const UserLibrary: React.FC = () => {
  const {
    favorites,
    crates,
    recentlyPlayed,
    trackNotes,
    createCrate,
    deleteCrate,
    clearHistory,
  } = useLibraryStore();
  const { playTrack } = usePlayerStore();

  const [activeTab, setActiveTab] = useState<'favorites' | 'crates' | 'history' | 'journal'>(
    'favorites'
  );
  const [isNewCrateOpen, setIsNewCrateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newColor, setNewColor] = useState('#e07a5f');
  const [selectedCrateId, setSelectedCrateId] = useState<string | null>(null);

  const favoriteTracks = CURATED_TRACKS.filter((t) => favorites.includes(t.id));

  const handleCreateCrateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createCrate(newTitle.trim(), newDesc.trim(), newColor);
    setNewTitle('');
    setNewDesc('');
    setIsNewCrateOpen(false);
  };

  const selectedCrate = crates.find((c) => c.id === selectedCrateId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-aura-800/80 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-aura-accent">
            Personal Repository
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-aura-100 font-normal mt-1">
            Crates & Archive
          </h1>
          <p className="text-sm text-aura-400 font-sans mt-2 max-w-xl">
            Your saved auditory treasures, custom-assembled crates, listening history, and personal
            liner notes.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-aura-850 p-1.5 rounded-2xl border border-aura-700/80 overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab('favorites');
              setSelectedCrateId(null);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'favorites' && !selectedCrateId
                ? 'bg-aura-800 text-aura-100 shadow-xs border border-aura-700 font-semibold'
                : 'text-aura-400 hover:text-aura-200'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-aura-accent" />
            Favorites ({favoriteTracks.length})
          </button>

          <button
            onClick={() => setActiveTab('crates')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'crates'
                ? 'bg-aura-800 text-aura-100 shadow-xs border border-aura-700 font-semibold'
                : 'text-aura-400 hover:text-aura-200'
            }`}
          >
            <FolderPlus className="w-3.5 h-3.5 text-aura-amber" />
            Crates ({crates.length})
          </button>

          <button
            onClick={() => {
              setActiveTab('history');
              setSelectedCrateId(null);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'history' && !selectedCrateId
                ? 'bg-aura-800 text-aura-100 shadow-xs border border-aura-700 font-semibold'
                : 'text-aura-400 hover:text-aura-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            History ({recentlyPlayed.length})
          </button>

          <button
            onClick={() => {
              setActiveTab('journal');
              setSelectedCrateId(null);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'journal' && !selectedCrateId
                ? 'bg-aura-800 text-aura-100 shadow-xs border border-aura-700 font-semibold'
                : 'text-aura-400 hover:text-aura-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Liner Journal
          </button>
        </div>
      </div>

      {activeTab === 'favorites' && !selectedCrateId && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl text-aura-100 font-medium">Liked Recordings</h3>
            {favoriteTracks.length > 0 && (
              <TactileButton
                variant="primary"
                size="sm"
                onClick={() => playTrack(favoriteTracks[0], favoriteTracks)}
                className="gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Play All Favorites
              </TactileButton>
            )}
          </div>

          {favoriteTracks.length === 0 ? (
            <div className="p-16 text-center bg-aura-850/40 rounded-3xl border border-aura-800 text-aura-400 space-y-2">
              <Heart className="w-8 h-8 mx-auto text-aura-600 stroke-[1.2]" />
              <h4 className="font-serif text-lg text-aura-200">No favorite recordings yet</h4>
              <p className="text-xs text-aura-500 max-w-sm mx-auto">
                Press the heart icon or hit <kbd className="font-mono bg-aura-800 px-1 py-0.5 rounded">L</kbd> on any track to save it here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-aura-800/40">
              {favoriteTracks.map((track, idx) => (
                <TrackRow
                  key={track.id}
                  track={track}
                  index={idx}
                  playlistContext={favoriteTracks}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'crates' && !selectedCrateId && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl text-aura-100 font-medium">Custom Crates</h3>
            <TactileButton
              variant="primary"
              size="sm"
              onClick={() => setIsNewCrateOpen(true)}
              className="gap-1.5"
            >
              <Plus className="w-4 h-4" />
              New Crate
            </TactileButton>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {crates.map((crate) => (
              <div
                key={crate.id}
                onClick={() => setSelectedCrateId(crate.id)}
                className="group cursor-pointer rounded-2xl p-5 bg-aura-850 border border-aura-800/80 hover:border-aura-700 transition-all tactile-card tactile-card-hover flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      style={{ backgroundColor: `${crate.colorTag || '#e07a5f'}20`, color: crate.colorTag || '#e07a5f' }}
                      className="text-[10px] font-mono px-2 py-0.5 rounded border border-white/10 uppercase"
                    >
                      {crate.tracks.length} {crate.tracks.length === 1 ? 'Track' : 'Tracks'}
                    </span>
                    <span className="text-[10px] font-mono text-aura-500">{crate.createdAt}</span>
                  </div>

                  <h4 className="font-serif text-xl text-aura-100 font-medium group-hover:text-aura-accent transition-colors">
                    {crate.title}
                  </h4>
                  <p className="text-xs text-aura-400 font-sans mt-1.5 leading-relaxed line-clamp-2">
                    {crate.description || 'Curated personal listening selection.'}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-aura-800 flex items-center justify-between">
                  <div className="flex -space-x-2 overflow-hidden">
                    {crate.tracks.slice(0, 3).map((t, i) => (
                      <img
                        key={i}
                        src={t.coverUrl}
                        alt={t.title}
                        className="inline-block h-6 w-6 rounded-full ring-2 ring-aura-900 object-cover"
                      />
                    ))}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (crate.tracks.length > 0) playTrack(crate.tracks[0], crate.tracks);
                    }}
                    className="p-2 rounded-full bg-aura-800 group-hover:bg-aura-accent text-white transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedCrate && (
        <div className="space-y-8">
          <div>
            <button
              onClick={() => setSelectedCrateId(null)}
              className="text-xs font-mono text-aura-400 hover:text-aura-200 mb-4 inline-block"
            >
              ← Back to All Crates
            </button>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-aura-800 pb-4">
              <div>
                <span className="text-xs font-mono text-aura-accent uppercase">
                  Crate Collection
                </span>
                <h2 className="font-serif text-3xl text-aura-100 font-medium mt-1">
                  {selectedCrate.title}
                </h2>
                <p className="text-xs text-aura-400 mt-1 max-w-lg">
                  {selectedCrate.description}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {selectedCrate.tracks.length > 0 && (
                  <TactileButton
                    variant="primary"
                    size="sm"
                    onClick={() => playTrack(selectedCrate.tracks[0], selectedCrate.tracks)}
                    className="gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Play Crate
                  </TactileButton>
                )}
                <TactileButton
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => {
                    deleteCrate(selectedCrate.id);
                    setSelectedCrateId(null);
                  }}
                  className="text-aura-500 hover:text-aura-accent"
                  title="Delete Crate"
                >
                  <Trash2 className="w-4 h-4" />
                </TactileButton>
              </div>
            </div>
          </div>

          {selectedCrate.tracks.length === 0 ? (
            <div className="p-12 text-center bg-aura-850/40 rounded-2xl border border-aura-800 text-aura-500">
              <p>This crate is currently empty.</p>
              <p className="text-xs text-aura-600 mt-1">
                Browse the catalog to add records to this crate.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-aura-800/40">
              {selectedCrate.tracks.map((track, idx) => (
                <TrackRow
                  key={track.id}
                  track={track}
                  index={idx}
                  playlistContext={selectedCrate.tracks}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && !selectedCrateId && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl text-aura-100 font-medium">Listening History</h3>
            {recentlyPlayed.length > 0 && (
              <TactileButton
                variant="ghost"
                size="sm"
                onClick={clearHistory}
                className="text-xs text-aura-500 hover:text-aura-300"
              >
                Clear History
              </TactileButton>
            )}
          </div>

          {recentlyPlayed.length === 0 ? (
            <div className="p-12 text-center bg-aura-850/40 rounded-2xl border border-aura-800 text-aura-500">
              No recent listening history recorded.
            </div>
          ) : (
            <div className="divide-y divide-aura-800/40">
              {recentlyPlayed.map((track, idx) => (
                <TrackRow
                  key={`${track.id}-${idx}`}
                  track={track}
                  index={idx}
                  playlistContext={recentlyPlayed}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'journal' && !selectedCrateId && (
        <div className="space-y-6">
          <h3 className="font-serif text-2xl text-aura-100 font-medium">Personal Liner Journal</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(trackNotes).map(([trackId, note]) => {
              const track = CURATED_TRACKS.find((t) => t.id === trackId);
              if (!track) return null;

              return (
                <div
                  key={trackId}
                  className="p-5 rounded-2xl bg-aura-850 border border-aura-800 space-y-3 tactile-card"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-medium text-aura-100 truncate">{track.title}</h4>
                      <p className="text-xs text-aura-400 truncate">{track.artist}</p>
                    </div>
                    <button
                      onClick={() => playTrack(track)}
                      className="p-1.5 rounded-full bg-aura-800 hover:bg-aura-accent text-white"
                    >
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </button>
                  </div>

                  <p className="text-xs text-aura-300 italic font-serif leading-relaxed bg-aura-900/60 p-3 rounded-xl border border-aura-800">
                    "{note}"
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Modal
        isOpen={isNewCrateOpen}
        onClose={() => setIsNewCrateOpen(false)}
        title="Assemble New Crate"
        subtitle="Create a bespoke sonic archive with custom tags"
        maxWidth="md"
      >
        <form onSubmit={handleCreateCrateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-aura-400 mb-1">
              Crate Title
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Midnight Highway & Rain"
              className="w-full bg-aura-950 border border-aura-700/80 rounded-xl px-3.5 py-2 text-sm text-aura-100 placeholder:text-aura-600 focus:outline-none focus:border-aura-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-aura-400 mb-1">
              Curator Notes / Description
            </label>
            <textarea
              rows={2}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Describe the sonic intention or context..."
              className="w-full bg-aura-950 border border-aura-700/80 rounded-xl px-3.5 py-2 text-sm text-aura-100 placeholder:text-aura-600 focus:outline-none focus:border-aura-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-aura-400 mb-2">
              Color Tag
            </label>
            <div className="flex items-center gap-3">
              {['#e07a5f', '#d4a373', '#819875', '#686675', '#3d251e'].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewColor(color)}
                  style={{ backgroundColor: color }}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    newColor === color ? 'scale-125 ring-2 ring-white' : 'opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <TactileButton
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => setIsNewCrateOpen(false)}
            >
              Cancel
            </TactileButton>
            <TactileButton variant="primary" size="sm" type="submit">
              Save Crate
            </TactileButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};
