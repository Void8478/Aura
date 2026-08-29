import React from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Heart,
  ListMusic,
  Maximize2,
  HelpCircle,
  Disc3,
  Loader2,
} from 'lucide-react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useLibraryStore } from '../../store/useLibraryStore';
import { ArtworkImage } from '../ui/ArtworkImage';
import { TactileButton } from '../ui/TactileButton';
import { TrackProgress } from './TrackProgress';
import { VolumeSlider } from './VolumeSlider';
import { VisualizerCanvas } from './VisualizerCanvas';

export const AudioPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    isLoading,
    togglePlay,
    next,
    previous,
    setIsQueueOpen,
    isQueueOpen,
    toggleVisualizer,
    setIsShortcutsOpen,
    queue,
  } = usePlayerStore();

  const { isFavorite, toggleFavorite } = useLibraryStore();

  if (!currentTrack) return null;

  const isLiked = isFavorite(currentTrack.id);

  return (
    <div className="fixed bottom-14 lg:bottom-0 left-0 right-0 z-40 bg-aura-950/95 backdrop-blur-md border-t border-aura-800/80 select-none shadow-aura-deck">
      {/* Top micro progress line for mobile */}
      <div className="md:hidden">
        <TrackProgress showTimestamps={false} className="h-0.5 gap-0 py-0" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 sm:h-22 flex items-center justify-between gap-4">
        {/* Left: Track Details & Like */}
        <div className="flex items-center gap-3.5 min-w-0 flex-1 md:flex-initial md:w-72">
          <div
            onClick={toggleVisualizer}
            className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden cursor-pointer group shadow-xs shrink-0 border border-white/10"
            title="Click to open Master Deck & Liner Notes"
          >
            <motion.div layoutId="player-artwork" className="w-full h-full">
              <ArtworkImage src={currentTrack.coverUrl} alt={currentTrack.title} />
            </motion.div>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Maximize2 className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <button
              onClick={toggleVisualizer}
              className="text-left w-full truncate block cursor-pointer"
              title={currentTrack.title}
            >
              <h4 className="text-sm font-medium text-aura-100 truncate hover:text-aura-accent transition-colors">
                {currentTrack.title}
              </h4>
            </button>
            <p className="text-xs text-aura-400 truncate mt-0.5 font-sans">
              {currentTrack.artist}
            </p>
          </div>

          <TactileButton
            variant="ghost"
            size="icon-sm"
            onClick={() => toggleFavorite(currentTrack.id, currentTrack)}
            aria-label="Favorite track"
            className={`hidden sm:flex shrink-0 ${isLiked ? 'text-aura-accent' : 'text-aura-500'}`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </TactileButton>
        </div>

        {/* Center: Playback Controls & Progress (Desktop) */}
        <div className="hidden md:flex flex-col items-center gap-1.5 flex-1 max-w-xl">
          <div className="flex items-center gap-2 sm:gap-4">
            <TactileButton
              variant="ghost"
              size="icon-sm"
              onClick={previous}
              aria-label="Previous track (P)"
            >
              <SkipBack className="w-4 h-4 text-aura-300" />
            </TactileButton>

            <TactileButton
              variant="primary"
              size="icon-md"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
              className="w-10 h-10 rounded-full bg-aura-100 text-aura-950 hover:bg-white hover:scale-105 transition-transform"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-aura-950" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </TactileButton>

            <TactileButton
              variant="ghost"
              size="icon-sm"
              onClick={next}
              aria-label="Next track (N)"
            >
              <SkipForward className="w-4 h-4 text-aura-300" />
            </TactileButton>
          </div>

          {/* Desktop Track Progress bar */}
          <div className="w-full">
            <TrackProgress showTimestamps={true} />
          </div>
        </div>

        {/* Right: Visualizer, Volume, Queue & Deck triggers (Desktop) */}
        <div className="hidden md:flex items-center justify-end gap-1.5 sm:gap-3 md:w-72">
          {/* Mini Real-Time Audio Visualizer trigger */}
          <button
            onClick={toggleVisualizer}
            className="hidden lg:flex items-center gap-2 px-2 py-1 rounded-lg bg-aura-900 border border-aura-800/80 hover:border-aura-700 transition-colors cursor-pointer"
            title="Open Tactile Deck & Spectrum"
          >
            <VisualizerCanvas
              mode="bars"
              height={18}
              width={40}
              barColor="#e07a5f"
            />
            <span className="text-[10px] font-mono text-aura-400">DECK</span>
          </button>

          {/* Volume Control */}
          <div className="hidden sm:block">
            <VolumeSlider showReadout={false} />
          </div>

          {/* Queue Drawer Toggle */}
          <TactileButton
            variant="ghost"
            size="icon-sm"
            onClick={() => setIsQueueOpen(!isQueueOpen)}
            active={isQueueOpen}
            aria-label="Listening queue (Q)"
            className="relative"
            title="Listening Queue (Q)"
          >
            <ListMusic className="w-4 h-4" />
            {queue.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-aura-accent" />
            )}
          </TactileButton>

          {/* Tactile Deck Fullscreen Toggle */}
          <TactileButton
            variant="ghost"
            size="icon-sm"
            onClick={toggleVisualizer}
            aria-label="Open Tactile Master Deck (V)"
            className="text-aura-400 hover:text-aura-100"
            title="Tactile Master Deck (V)"
          >
            <Disc3 className="w-4 h-4" />
          </TactileButton>

          {/* Keyboard Shortcuts Trigger */}
          <TactileButton
            variant="ghost"
            size="icon-sm"
            onClick={() => setIsShortcutsOpen(true)}
            aria-label="Keyboard shortcuts (?)"
            className="hidden sm:flex text-aura-500 hover:text-aura-300"
            title="Keyboard Shortcuts (?)"
          >
            <HelpCircle className="w-4 h-4" />
          </TactileButton>
        </div>

        {/* Mobile-Only Action controls (Visible on mobile, hidden on desktop) */}
        <div className="flex md:hidden items-center gap-2 shrink-0">
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-aura-100 text-aura-950 flex items-center justify-center cursor-pointer shadow-xs active:scale-95 transition-transform"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-aura-950" />
            ) : isPlaying ? (
              <Pause className="w-4.5 h-4.5 fill-current" />
            ) : (
              <Play className="w-4.5 h-4.5 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={next}
            className="p-2 text-aura-300 hover:text-aura-100 cursor-pointer active:scale-90 transition-transform"
            aria-label="Next track"
          >
            <SkipForward className="w-4.5 h-4.5" />
          </button>

          <button
            onClick={toggleVisualizer}
            className="p-2 text-aura-400 hover:text-aura-100 cursor-pointer"
            aria-label="Open fullscreen deck"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
