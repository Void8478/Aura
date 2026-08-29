import { create } from 'zustand';
import type { Track, Crate } from '../types/music';
import { CURATED_TRACKS } from '../services/mockCatalog';

interface LibraryStore {
  favorites: string[];
  crates: Crate[];
  recentlyPlayed: Track[];
  trackNotes: Record<string, string>;

  // Actions
  toggleFavorite: (trackId: string) => void;
  isFavorite: (trackId: string) => boolean;
  createCrate: (title: string, description?: string, colorTag?: string) => Crate;
  deleteCrate: (crateId: string) => void;
  addTrackToCrate: (crateId: string, track: Track) => void;
  removeTrackFromCrate: (crateId: string, trackId: string) => void;
  setTrackNote: (trackId: string, note: string) => void;
  addToRecentlyPlayed: (track: Track) => void;
  clearHistory: () => void;
}

const STORAGE_KEY = 'aura_library_v1';

const INITIAL_CRATES: Crate[] = [
  {
    id: 'crate-midnight',
    title: 'Midnight Driving & Tape Loops',
    description: 'Analog synthesizers, rain-slicked windshields, and long highway journeys.',
    createdAt: '2025-01-10',
    colorTag: '#e07a5f',
    tracks: [CURATED_TRACKS[0], CURATED_TRACKS[4], CURATED_TRACKS[8]],
    coverUrl: CURATED_TRACKS[4].coverUrl,
  },
  {
    id: 'crate-focus',
    title: 'Felt Pianos & Heavy Focus',
    description: 'Acoustic minimalism for code architectures and deep writing sessions.',
    createdAt: '2025-02-01',
    colorTag: '#d4a373',
    tracks: [CURATED_TRACKS[1], CURATED_TRACKS[6], CURATED_TRACKS[2]],
    coverUrl: CURATED_TRACKS[1].coverUrl,
  },
];

function loadSavedLibrary(): {
  favorites: string[];
  crates: Crate[];
  trackNotes: Record<string, string>;
} {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        favorites: ['aura-01', 'aura-03', 'aura-05'],
        crates: INITIAL_CRATES,
        trackNotes: {
          'aura-01': 'Sublime tape decay. Perfect for late evening code reviews.',
          'aura-03': 'The sub-bass vibration in the second half is extraordinary.',
        },
      };
    }
    return JSON.parse(raw);
  } catch {
    return {
      favorites: ['aura-01', 'aura-03'],
      crates: INITIAL_CRATES,
      trackNotes: {},
    };
  }
}

function saveLibrary(data: {
  favorites: string[];
  crates: Crate[];
  trackNotes: Record<string, string>;
}) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('Failed to persist library to localStorage', err);
  }
}

const saved = loadSavedLibrary();

export const useLibraryStore = create<LibraryStore>((set, get) => ({
  favorites: saved.favorites,
  crates: saved.crates,
  recentlyPlayed: [CURATED_TRACKS[0], CURATED_TRACKS[1], CURATED_TRACKS[4]],
  trackNotes: saved.trackNotes,

  toggleFavorite: (trackId: string) => {
    const { favorites, crates, trackNotes } = get();
    const exists = favorites.includes(trackId);
    const updated = exists ? favorites.filter((id) => id !== trackId) : [...favorites, trackId];

    set({ favorites: updated });
    saveLibrary({ favorites: updated, crates, trackNotes });
  },

  isFavorite: (trackId: string) => {
    return get().favorites.includes(trackId);
  },

  createCrate: (title: string, description = '', colorTag = '#e07a5f') => {
    const newCrate: Crate = {
      id: `crate-${Date.now()}`,
      title,
      description,
      createdAt: new Date().toISOString().split('T')[0],
      colorTag,
      tracks: [],
    };

    const { favorites, crates, trackNotes } = get();
    const updated = [newCrate, ...crates];
    set({ crates: updated });
    saveLibrary({ favorites, crates: updated, trackNotes });
    return newCrate;
  },

  deleteCrate: (crateId: string) => {
    const { favorites, crates, trackNotes } = get();
    const updated = crates.filter((c) => c.id !== crateId);
    set({ crates: updated });
    saveLibrary({ favorites, crates: updated, trackNotes });
  },

  addTrackToCrate: (crateId: string, track: Track) => {
    const { favorites, crates, trackNotes } = get();
    const updated = crates.map((c) => {
      if (c.id === crateId) {
        if (c.tracks.some((t) => t.id === track.id)) return c;
        return {
          ...c,
          tracks: [...c.tracks, track],
          coverUrl: c.coverUrl || track.coverUrl,
        };
      }
      return c;
    });

    set({ crates: updated });
    saveLibrary({ favorites, crates: updated, trackNotes });
  },

  removeTrackFromCrate: (crateId: string, trackId: string) => {
    const { favorites, crates, trackNotes } = get();
    const updated = crates.map((c) => {
      if (c.id === crateId) {
        return {
          ...c,
          tracks: c.tracks.filter((t) => t.id !== trackId),
        };
      }
      return c;
    });

    set({ crates: updated });
    saveLibrary({ favorites, crates: updated, trackNotes });
  },

  setTrackNote: (trackId: string, note: string) => {
    const { favorites, crates, trackNotes } = get();
    const updated = { ...trackNotes, [trackId]: note };
    set({ trackNotes: updated });
    saveLibrary({ favorites, crates, trackNotes: updated });
  },

  addToRecentlyPlayed: (track: Track) => {
    set((state) => {
      const filtered = state.recentlyPlayed.filter((t) => t.id !== track.id);
      return {
        recentlyPlayed: [track, ...filtered].slice(0, 30),
      };
    });
  },

  clearHistory: () => {
    set({ recentlyPlayed: [] });
  },
}));
