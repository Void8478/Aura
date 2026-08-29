import { create } from 'zustand';
import type { Track, Album, Artist, Crate } from '../types/music';
import { CURATED_TRACKS, CURATED_ALBUMS, MOCK_ARTISTS } from '../data/mockTracks';

interface LibraryStore {
  favorites: string[]; // holds all favorited IDs (compatibility)
  favoriteTracks: Track[];
  favoriteAlbums: Album[];
  favoriteArtists: Artist[];
  crates: Crate[];
  recentlyPlayed: Track[];
  trackNotes: Record<string, string>;

  // Actions
  toggleFavorite: (id: string, item?: Track | Album | Artist) => void;
  isFavorite: (id: string) => boolean;
  createCrate: (title: string, description?: string, colorTag?: string) => Crate;
  renameCrate: (crateId: string, title: string, description?: string) => void;
  deleteCrate: (crateId: string) => void;
  addTrackToCrate: (crateId: string, track: Track) => void;
  removeTrackFromCrate: (crateId: string, trackId: string) => void;
  reorderCrateTracks: (crateId: string, startIndex: number, endIndex: number) => void;
  setTrackNote: (trackId: string, note: string) => void;
  addToRecentlyPlayed: (track: Track) => void;
  clearHistory: () => void;
}

const STORAGE_KEY = 'aura_library_v2';

const INITIAL_CRATES: Crate[] = [
  {
    id: 'crate-midnight',
    title: 'Midnight Driving & Tape Loops',
    description: 'Analog synthesizers, rain-slicked windshields, and long highway journeys.',
    createdAt: '2025-01-10',
    colorTag: '#e07a5f',
    tracks: [CURATED_TRACKS[0], CURATED_TRACKS[4], CURATED_TRACKS[2]],
    coverUrl: CURATED_TRACKS[4].coverUrl,
  },
];

function loadSavedLibrary() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        favorites: [],
        favoriteTracks: [],
        favoriteAlbums: [],
        favoriteArtists: [],
        crates: INITIAL_CRATES,
        recentlyPlayed: [],
        trackNotes: {},
      };
    }
    const data = JSON.parse(raw);
    return {
      favorites: data.favorites || [],
      favoriteTracks: data.favoriteTracks || [],
      favoriteAlbums: data.favoriteAlbums || [],
      favoriteArtists: data.favoriteArtists || [],
      crates: data.crates || INITIAL_CRATES,
      recentlyPlayed: data.recentlyPlayed || [],
      trackNotes: data.trackNotes || {},
    };
  } catch {
    return {
      favorites: [],
      favoriteTracks: [],
      favoriteAlbums: [],
      favoriteArtists: [],
      crates: INITIAL_CRATES,
      recentlyPlayed: [],
      trackNotes: {},
    };
  }
}

function saveLibrary(data: {
  favorites: string[];
  favoriteTracks: Track[];
  favoriteAlbums: Album[];
  favoriteArtists: Artist[];
  crates: Crate[];
  recentlyPlayed: Track[];
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
  favoriteTracks: saved.favoriteTracks,
  favoriteAlbums: saved.favoriteAlbums,
  favoriteArtists: saved.favoriteArtists,
  crates: saved.crates,
  recentlyPlayed: saved.recentlyPlayed,
  trackNotes: saved.trackNotes,

  toggleFavorite: (id: string, item?: Track | Album | Artist) => {
    const { favorites, favoriteTracks, favoriteAlbums, favoriteArtists, crates, recentlyPlayed, trackNotes } = get();
    const exists = favorites.includes(id);

    let updatedFavorites = [...favorites];
    let updatedTracks = [...favoriteTracks];
    let updatedAlbums = [...favoriteAlbums];
    let updatedArtists = [...favoriteArtists];

    if (exists) {
      updatedFavorites = favorites.filter((fid) => fid !== id);
      if (id.startsWith('jamendo-') || id.startsWith('aura-')) {
        updatedTracks = favoriteTracks.filter((t) => t.id !== id);
      } else if (id.startsWith('album-')) {
        updatedAlbums = favoriteAlbums.filter((a) => a.id !== id);
      } else if (id.startsWith('artist-')) {
        updatedArtists = favoriteArtists.filter((a) => a.id !== id);
      }
    } else {
      updatedFavorites.push(id);
      if (id.startsWith('jamendo-') || id.startsWith('aura-')) {
        const trackObj = (item as Track) || CURATED_TRACKS.find((t) => t.id === id);
        if (trackObj) updatedTracks.push(trackObj);
      } else if (id.startsWith('album-')) {
        const albumObj = (item as Album) || CURATED_ALBUMS.find((a) => a.id === id);
        if (albumObj) updatedAlbums.push(albumObj);
      } else if (id.startsWith('artist-')) {
        const artistObj = (item as Artist) || MOCK_ARTISTS.find((a) => a.id === id);
        if (artistObj) updatedArtists.push(artistObj);
      }
    }

    set({
      favorites: updatedFavorites,
      favoriteTracks: updatedTracks,
      favoriteAlbums: updatedAlbums,
      favoriteArtists: updatedArtists,
    });

    saveLibrary({
      favorites: updatedFavorites,
      favoriteTracks: updatedTracks,
      favoriteAlbums: updatedAlbums,
      favoriteArtists: updatedArtists,
      crates,
      recentlyPlayed,
      trackNotes,
    });
  },

  isFavorite: (id: string) => {
    return get().favorites.includes(id);
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

    const { favorites, favoriteTracks, favoriteAlbums, favoriteArtists, crates, recentlyPlayed, trackNotes } = get();
    const updated = [newCrate, ...crates];
    set({ crates: updated });
    saveLibrary({
      favorites,
      favoriteTracks,
      favoriteAlbums,
      favoriteArtists,
      crates: updated,
      recentlyPlayed,
      trackNotes,
    });
    return newCrate;
  },

  renameCrate: (crateId: string, title: string, description = '') => {
    const { favorites, favoriteTracks, favoriteAlbums, favoriteArtists, crates, recentlyPlayed, trackNotes } = get();
    const updated = crates.map((c) => {
      if (c.id === crateId) {
        return {
          ...c,
          title,
          description,
        };
      }
      return c;
    });

    set({ crates: updated });
    saveLibrary({
      favorites,
      favoriteTracks,
      favoriteAlbums,
      favoriteArtists,
      crates: updated,
      recentlyPlayed,
      trackNotes,
    });
  },

  deleteCrate: (crateId: string) => {
    const { favorites, favoriteTracks, favoriteAlbums, favoriteArtists, crates, recentlyPlayed, trackNotes } = get();
    const updated = crates.filter((c) => c.id !== crateId);
    set({ crates: updated });
    saveLibrary({
      favorites,
      favoriteTracks,
      favoriteAlbums,
      favoriteArtists,
      crates: updated,
      recentlyPlayed,
      trackNotes,
    });
  },

  addTrackToCrate: (crateId: string, track: Track) => {
    const { favorites, favoriteTracks, favoriteAlbums, favoriteArtists, crates, recentlyPlayed, trackNotes } = get();
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
    saveLibrary({
      favorites,
      favoriteTracks,
      favoriteAlbums,
      favoriteArtists,
      crates: updated,
      recentlyPlayed,
      trackNotes,
    });
  },

  removeTrackFromCrate: (crateId: string, trackId: string) => {
    const { favorites, favoriteTracks, favoriteAlbums, favoriteArtists, crates, recentlyPlayed, trackNotes } = get();
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
    saveLibrary({
      favorites,
      favoriteTracks,
      favoriteAlbums,
      favoriteArtists,
      crates: updated,
      recentlyPlayed,
      trackNotes,
    });
  },

  reorderCrateTracks: (crateId: string, startIndex: number, endIndex: number) => {
    const { favorites, favoriteTracks, favoriteAlbums, favoriteArtists, crates, recentlyPlayed, trackNotes } = get();
    const updated = crates.map((c) => {
      if (c.id === crateId) {
        const reordered = [...c.tracks];
        const [removed] = reordered.splice(startIndex, 1);
        reordered.splice(endIndex, 0, removed);
        return {
          ...c,
          tracks: reordered,
        };
      }
      return c;
    });

    set({ crates: updated });
    saveLibrary({
      favorites,
      favoriteTracks,
      favoriteAlbums,
      favoriteArtists,
      crates: updated,
      recentlyPlayed,
      trackNotes,
    });
  },

  setTrackNote: (trackId: string, note: string) => {
    const { favorites, favoriteTracks, favoriteAlbums, favoriteArtists, crates, recentlyPlayed, trackNotes } = get();
    const updated = { ...trackNotes, [trackId]: note };
    set({ trackNotes: updated });
    saveLibrary({
      favorites,
      favoriteTracks,
      favoriteAlbums,
      favoriteArtists,
      crates,
      recentlyPlayed,
      trackNotes: updated,
    });
  },

  addToRecentlyPlayed: (track: Track) => {
    const { favorites, favoriteTracks, favoriteAlbums, favoriteArtists, crates, recentlyPlayed, trackNotes } = get();
    const filtered = recentlyPlayed.filter((t) => t.id !== track.id);
    const updated = [track, ...filtered].slice(0, 50);

    set({ recentlyPlayed: updated });
    saveLibrary({
      favorites,
      favoriteTracks,
      favoriteAlbums,
      favoriteArtists,
      crates,
      recentlyPlayed: updated,
      trackNotes,
    });
  },

  clearHistory: () => {
    const { favorites, favoriteTracks, favoriteAlbums, favoriteArtists, crates, trackNotes } = get();
    set({ recentlyPlayed: [] });
    saveLibrary({
      favorites,
      favoriteTracks,
      favoriteAlbums,
      favoriteArtists,
      crates,
      recentlyPlayed: [],
      trackNotes,
    });
  },
}));
