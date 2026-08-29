import { create } from 'zustand';
import type { Track, RepeatMode } from '../types/music';
import { CURATED_TRACKS } from '../services/mockCatalog';
import { audioService } from '../services/audioService';

interface PlayerStore {
  currentTrack: Track | null;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  buffered: number;
  volume: number;
  prevVolume: number;
  isMuted: boolean;
  repeatMode: RepeatMode;
  isShuffled: boolean;
  playbackRate: number;
  
  // Queue & History
  queue: Track[];
  queueIndex: number;
  history: Track[];
  
  // Real-time audio spectrum
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
  nextTrack: () => void;
  prevTrack: () => void;
  seek: (seconds: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  setRepeatMode: (mode: RepeatMode) => void;
  cycleRepeatMode: () => void;
  toggleShuffle: () => void;
  setPlaybackRate: (rate: number) => void;
  
  // Queue Actions
  addToQueue: (track: Track) => void;
  addToQueueNext: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  setQueue: (queue: Track[]) => void;
  
  // UI Toggle Actions
  setIsVisualizerExpanded: (expanded: boolean) => void;
  toggleVisualizer: () => void;
  setIsQueueOpen: (open: boolean) => void;
  toggleQueue: () => void;
  setIsLinerNotesOpen: (open: boolean) => void;
  toggleLinerNotes: () => void;
  setIsSearchOpen: (open: boolean) => void;
  setIsShortcutsOpen: (open: boolean) => void;
}

const SAVED_VOLUME = parseFloat(localStorage.getItem('aura_volume') || '0.85');

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
      const { repeatMode, currentTrack, nextTrack } = get();
      if (repeatMode === 'one' && currentTrack) {
        audioService.seek(0);
        audioService.play();
      } else {
        nextTrack();
      }
    },
    onError: (err) => {
      console.warn('Playback error:', err);
      set({ isPlaying: false, isLoading: false });
    },
  });

  audioService.setVolume(SAVED_VOLUME);

  return {
    currentTrack: CURATED_TRACKS[0],
    isPlaying: false,
    isLoading: false,
    currentTime: 0,
    duration: CURATED_TRACKS[0].duration,
    buffered: 0,
    volume: SAVED_VOLUME,
    prevVolume: SAVED_VOLUME,
    isMuted: false,
    repeatMode: 'off',
    isShuffled: false,
    playbackRate: 1.0,

    queue: [...CURATED_TRACKS],
    queueIndex: 0,
    history: [],
    frequencyData: new Array(32).fill(0),

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
        queueIndex: targetIndex,
        history: state.currentTrack ? [state.currentTrack, ...state.history.slice(0, 20)] : state.history,
        isLoading: true,
      });

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

    nextTrack: () => {
      const { queue, queueIndex, repeatMode, isShuffled, playTrack } = get();
      if (queue.length === 0) return;

      let nextIndex = queueIndex + 1;

      if (isShuffled) {
        nextIndex = Math.floor(Math.random() * queue.length);
      } else if (nextIndex >= queue.length) {
        if (repeatMode === 'all') {
          nextIndex = 0;
        } else {
          audioService.pause();
          return;
        }
      }

      const next = queue[nextIndex];
      if (next) {
        playTrack(next);
      }
    },

    prevTrack: () => {
      const { queue, queueIndex, currentTime, playTrack } = get();
      if (currentTime > 3) {
        audioService.seek(0);
        return;
      }

      const prevIndex = queueIndex > 0 ? queueIndex - 1 : queue.length - 1;
      const prev = queue[prevIndex];
      if (prev) {
        playTrack(prev);
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

    setRepeatMode: (mode: RepeatMode) => {
      set({ repeatMode: mode });
    },

    cycleRepeatMode: () => {
      const { repeatMode } = get();
      const cycleMap: Record<RepeatMode, RepeatMode> = {
        off: 'all',
        all: 'one',
        one: 'off',
      };
      set({ repeatMode: cycleMap[repeatMode] });
    },

    toggleShuffle: () => {
      set((state) => ({ isShuffled: !state.isShuffled }));
    },

    setPlaybackRate: (rate: number) => {
      audioService.setPlaybackRate(rate);
      set({ playbackRate: rate });
    },

    addToQueue: (track: Track) => {
      set((state) => ({
        queue: [...state.queue, track],
      }));
    },

    addToQueueNext: (track: Track) => {
      set((state) => {
        const newQueue = [...state.queue];
        newQueue.splice(state.queueIndex + 1, 0, track);
        return { queue: newQueue };
      });
    },

    removeFromQueue: (index: number) => {
      set((state) => {
        const newQueue = state.queue.filter((_, i) => i !== index);
        let newIndex = state.queueIndex;
        if (index < state.queueIndex) {
          newIndex = Math.max(0, state.queueIndex - 1);
        }
        return { queue: newQueue, queueIndex: newIndex };
      });
    },

    clearQueue: () => {
      const { currentTrack } = get();
      set({
        queue: currentTrack ? [currentTrack] : [],
        queueIndex: 0,
      });
    },

    setQueue: (queue: Track[]) => {
      set({ queue });
    },

    setIsVisualizerExpanded: (expanded: boolean) => {
      set({ isVisualizerExpanded: expanded });
    },

    toggleVisualizer: () => {
      set((state) => ({ isVisualizerExpanded: !state.isVisualizerExpanded }));
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
