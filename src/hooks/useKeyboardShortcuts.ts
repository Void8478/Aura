import { useEffect } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { useLibraryStore } from '../store/useLibraryStore';

export function useKeyboardShortcuts() {
  const {
    togglePlay,
    nextTrack,
    prevTrack,
    toggleMute,
    toggleVisualizer,
    toggleQueue,
    isSearchOpen,
    setIsSearchOpen,
    isShortcutsOpen,
    setIsShortcutsOpen,
    isVisualizerExpanded,
    setIsVisualizerExpanded,
    isQueueOpen,
    setIsQueueOpen,
    currentTrack,
    seek,
    currentTime,
  } = usePlayerStore();

  const { toggleFavorite } = useLibraryStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        if (e.key === 'Escape') {
          target.blur();
          setIsSearchOpen(false);
        }
        return;
      }

      // Cmd+K or Ctrl+K -> Search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
        return;
      }

      // Search with '/' key
      if (e.key === '/') {
        e.preventDefault();
        setIsSearchOpen(true);
        return;
      }

      // Escape -> close any open modal
      if (e.key === 'Escape') {
        if (isSearchOpen) setIsSearchOpen(false);
        if (isShortcutsOpen) setIsShortcutsOpen(false);
        if (isVisualizerExpanded) setIsVisualizerExpanded(false);
        if (isQueueOpen) setIsQueueOpen(false);
        return;
      }

      // Space -> Toggle Play/Pause
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
        return;
      }

      // J or Left Arrow -> Seek back 5s
      if (e.key === 'j' || e.key === 'J' || e.key === 'ArrowLeft') {
        e.preventDefault();
        seek(Math.max(0, currentTime - 5));
        return;
      }

      // K or Right Arrow -> Seek forward 5s
      if (e.key === 'k' || e.key === 'K' || e.key === 'ArrowRight') {
        e.preventDefault();
        seek(currentTime + 5);
        return;
      }

      // N -> Next Track
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        nextTrack();
        return;
      }

      // P -> Previous Track
      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        prevTrack();
        return;
      }

      // M -> Toggle Mute
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMute();
        return;
      }

      // L -> Favorite current track
      if (e.key === 'l' || e.key === 'L') {
        if (currentTrack) {
          e.preventDefault();
          toggleFavorite(currentTrack.id);
        }
        return;
      }

      // V -> Toggle Expanded Deck / Visualizer
      if (e.key === 'v' || e.key === 'V') {
        e.preventDefault();
        toggleVisualizer();
        return;
      }

      // Q -> Toggle Queue Drawer
      if (e.key === 'q' || e.key === 'Q') {
        e.preventDefault();
        toggleQueue();
        return;
      }

      // ? -> Open Shortcuts Cheat Sheet
      if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen(!isShortcutsOpen);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    togglePlay,
    nextTrack,
    prevTrack,
    toggleMute,
    toggleVisualizer,
    toggleQueue,
    isSearchOpen,
    setIsSearchOpen,
    isShortcutsOpen,
    setIsShortcutsOpen,
    isVisualizerExpanded,
    setIsVisualizerExpanded,
    isQueueOpen,
    setIsQueueOpen,
    currentTrack,
    seek,
    currentTime,
    toggleFavorite,
  ]);
}
