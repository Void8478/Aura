import { create } from 'zustand';
import type { Track, RepeatMode } from '../types/music';
import { CURATED_TRACKS } from '../services/mockCatalog';
import { audioService } from '../services/audioService';
import { useLibraryStore } from './useLibraryStore';


interface PlayerStore {
  // State variables
  currentTrack: Track | null;
  queue: Track[];
  currentIndex: number;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  buffered: number;
  volume: number;
  prevVolume: number;
  isMuted: boolean;
  shuffle: boolean;
  repeat: RepeatMode;
  playbackRate: number;
  frequencyData: number[];

  // UI Panels
  isVisualizerExpanded: boolean;
  isQueueOpen: boolean;
  isLinerNotesOpen: boolean;
  isSearchOpen: boolean;
  isShortcutsOpen: boolean;

  // Actions
  playTrack: (track: Track, newQueue?: Track[]) => void;
  togglePlay: () => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  previous: () => void;
  seek: (seconds: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;

  // Legacy/Compatibility support (to avoid breaking other pages)
  nextTrack: () => void;
  prevTrack: () => void;
  cycleRepeatMode: () => void;
  setRepeatMode: (mode: RepeatMode) => void;
  setQueue: (queue: Track[]) => void;
  addToQueueNext: (track: Track) => void;
  playbackRateSetting: (rate: number) => void;
  isShuffled: boolean;
  repeatMode: RepeatMode;
  queueIndex: number;
  toggleVisualizer: () => void;
  setIsVisualizerExpanded: (expanded: boolean) => void;
  setIsQueueOpen: (open: boolean) => void;
  toggleQueue: () => void;
  setIsLinerNotesOpen: (open: boolean) => void;
  toggleLinerNotes: () => void;
  setIsSearchOpen: (open: boolean) => void;
  setIsShortcutsOpen: (open: boolean) => void;
}

// Persisted configuration loaders
const loadSavedQueue = (): Track[] => {
  try {
    const raw = localStorage.getItem('aura_queue');
    return raw ? JSON.parse(raw) : [...CURATED_TRACKS];
  } catch {
    return [...CURATED_TRACKS];
  }
};

const SAVED_VOLUME = parseFloat(localStorage.getItem('aura_volume') || '0.85');
const SAVED_SHUFFLE = localStorage.getItem('aura_shuffle') === 'true';
const SAVED_REPEAT = (localStorage.getItem('aura_repeat') || 'off') as RepeatMode;
const SAVED_QUEUE = loadSavedQueue();
const INITIAL_TRACK = SAVED_QUEUE[0] || CURATED_TRACKS[0];

export const usePlayerStore = create<PlayerStore>((set, get) => {
  // Wire up audio service callbacks
  audioService.setCallbacks({
    onStateChange: ({ currentTime, duration, isPlaying, isLoading, buffered }) => {
      set({ currentTime, duration, isPlaying, isLoading, buffered });
    },
    onFrequencyChange: (data) => {
      const normalized = Array.from(data).slice(0, 32);
      set({ frequencyData: normalized });
    },
    onTrackEnded: () => {
      const { repeat, currentTrack, next } = get();
      if (repeat === 'one' && currentTrack) {
        audioService.seek(0);
        audioService.play();
      } else {
        next();
      }
    },
    onError: (err) => {
      console.warn('Playback error:', err);
      set({ isPlaying: false, isLoading: false });
    },
  });

  // Initialize Volume
  audioService.setVolume(SAVED_VOLUME);

  const saveQueueToStorage = (q: Track[]) => {
    localStorage.setItem('aura_queue', JSON.stringify(q));
  };

  return {
    currentTrack: INITIAL_TRACK,
    queue: SAVED_QUEUE,
    currentIndex: 0,
    isPlaying: false,
    isLoading: false,
    currentTime: 0,
    duration: INITIAL_TRACK ? INITIAL_TRACK.duration : 0,
    buffered: 0,
    volume: SAVED_VOLUME,
    prevVolume: SAVED_VOLUME,
    isMuted: false,
    shuffle: SAVED_SHUFFLE,
    repeat: SAVED_REPEAT,
    playbackRate: 1.0,
    frequencyData: new Array(32).fill(0),

    // Compat variables
    isShuffled: SAVED_SHUFFLE,
    repeatMode: SAVED_REPEAT,
    queueIndex: 0,

    isVisualizerExpanded: false,
    isQueueOpen: false,
    isLinerNotesOpen: false,
    isSearchOpen: false,
    isShortcutsOpen: false,

    playTrack: (track: Track, newQueue?: Track[]) => {
      const state = get();
      let updatedQueue = newQueue || state.queue;
      let targetIndex = updatedQueue.findIndex((t) => t.id === track.id);

      if (targetIndex === -1) {
        updatedQueue = [track, ...state.queue];
        targetIndex = 0;
      }

      set({
        currentTrack: track,
        queue: updatedQueue,
        currentIndex: targetIndex,
        queueIndex: targetIndex,
        isLoading: true,
      });

      saveQueueToStorage(updatedQueue);
      useLibraryStore.getState().addToRecentlyPlayed(track);
      audioService.loadAndPlay(track.audioUrl, 0);
    },

    togglePlay: () => {
      const { isPlaying, currentTrack } = get();
      if (!currentTrack) return;

      if (isPlaying) {
        audioService.pause();
      } else {
        audioService.play();
      }
    },

    pause: () => {
      audioService.pause();
    },

    resume: () => {
      audioService.play();
    },

    next: () => {
      const { queue, currentIndex, repeat, shuffle, playTrack } = get();
      if (queue.length === 0) return;

      let nextIndex = currentIndex + 1;

      if (shuffle) {
        nextIndex = Math.floor(Math.random() * queue.length);
      } else if (nextIndex >= queue.length) {
        if (repeat === 'all') {
          nextIndex = 0;
        } else {
          audioService.pause();
          return;
        }
      }

      const nextTrack = queue[nextIndex];
      if (nextTrack) {
        playTrack(nextTrack);
      }
    },

    previous: () => {
      const { queue, currentIndex, currentTime, playTrack } = get();
      if (currentTime > 3) {
        audioService.seek(0);
        return;
      }

      const prevIndex = currentIndex > 0 ? currentIndex - 1 : queue.length - 1;
      const prevTrack = queue[prevIndex];
      if (prevTrack) {
        playTrack(prevTrack);
      }
    },

    seek: (seconds: number) => {
      audioService.seek(seconds);
      set({ currentTime: seconds });
    },

    setVolume: (vol: number) => {
      const clamped = Math.max(0, Math.min(1, vol));
      audioService.setVolume(clamped);
      localStorage.setItem('aura_volume', clamped.toString());
      set({ volume: clamped, isMuted: clamped === 0 });
    },

    toggleMute: () => {
      const { isMuted, volume, prevVolume } = get();
      if (isMuted) {
        const restored = prevVolume > 0 ? prevVolume : 0.75;
        audioService.setVolume(restored);
        set({ isMuted: false, volume: restored });
      } else {
        audioService.setVolume(0);
        set({ isMuted: true, prevVolume: volume, volume: 0 });
      }
    },

    toggleShuffle: () => {
      const nextShuffleState = !get().shuffle;
      localStorage.setItem('aura_shuffle', nextShuffleState.toString());
      set({ shuffle: nextShuffleState, isShuffled: nextShuffleState });
    },

    toggleRepeat: () => {
      const { repeat } = get();
      const cycleMap: Record<RepeatMode, RepeatMode> = {
        off: 'all',
        all: 'one',
        one: 'off',
      };
      const nextRepeatState = cycleMap[repeat];
      localStorage.setItem('aura_repeat', nextRepeatState);
      set({ repeat: nextRepeatState, repeatMode: nextRepeatState });
    },

    addToQueue: (track: Track) => {
      const newQueue = [...get().queue, track];
      saveQueueToStorage(newQueue);
      set({ queue: newQueue });
    },

    removeFromQueue: (trackId: string) => {
      const { queue, currentIndex } = get();
      const targetIndex = queue.findIndex((t) => t.id === trackId);
      if (targetIndex === -1) return;

      const newQueue = queue.filter((t) => t.id !== trackId);
      let newIndex = currentIndex;
      if (targetIndex < currentIndex) {
        newIndex = Math.max(0, currentIndex - 1);
      }

      saveQueueToStorage(newQueue);
      set({ queue: newQueue, currentIndex: newIndex, queueIndex: newIndex });
    },

    clearQueue: () => {
      const { currentTrack } = get();
      const newQueue = currentTrack ? [currentTrack] : [];
      saveQueueToStorage(newQueue);
      set({
        queue: newQueue,
        currentIndex: 0,
        queueIndex: 0,
      });
    },

    // Compat Actions
    nextTrack: () => get().next(),
    prevTrack: () => get().previous(),
    cycleRepeatMode: () => get().toggleRepeat(),
    setRepeatMode: (mode: RepeatMode) => {
      localStorage.setItem('aura_repeat', mode);
      set({ repeat: mode, repeatMode: mode });
    },
    setQueue: (q: Track[]) => {
      saveQueueToStorage(q);
      set({ queue: q });
    },
    addToQueueNext: (track: Track) => {
      const { queue, currentIndex } = get();
      const newQueue = [...queue];
      newQueue.splice(currentIndex + 1, 0, track);
      saveQueueToStorage(newQueue);
      set({ queue: newQueue });
    },
    playbackRateSetting: (rate: number) => {
      audioService.setPlaybackRate(rate);
      set({ playbackRate: rate });
    },

    toggleVisualizer: () => {
      set((state) => ({ isVisualizerExpanded: !state.isVisualizerExpanded }));
    },
    setIsVisualizerExpanded: (expanded: boolean) => {
      set({ isVisualizerExpanded: expanded });
    },
    setIsQueueOpen: (open: boolean) => {
      set({ isQueueOpen: open });
    },
    toggleQueue: () => {
      set((state) => ({ isQueueOpen: !state.isQueueOpen }));
    },
    setIsLinerNotesOpen: (open: boolean) => {
      set({ isLinerNotesOpen: open });
    },
    toggleLinerNotes: () => {
      set((state) => ({ isLinerNotesOpen: !state.isLinerNotesOpen }));
    },
    setIsSearchOpen: (open: boolean) => {
      set({ isSearchOpen: open });
    },
    setIsShortcutsOpen: (open: boolean) => {
      set({ isShortcutsOpen: open });
    },
  };
});
