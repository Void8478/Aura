import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Heart,
  Repeat,
  Shuffle,
  Sliders,
  FileText,
  Disc3,
  Share2,
  Sparkles,
} from 'lucide-react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useLibraryStore } from '../../store/useLibraryStore';
import { ArtworkImage } from '../ui/ArtworkImage';
import { TactileButton } from '../ui/TactileButton';
import { Badge } from '../ui/Badge';
import { TrackProgress } from './TrackProgress';
import { VolumeSlider } from './VolumeSlider';
import { VisualizerCanvas } from './VisualizerCanvas';
import { formatBpm, formatDate } from '../../utils/formatters';

export const ExpandedPlayerModal: React.FC = () => {
  const {
    isVisualizerExpanded,
    setIsVisualizerExpanded,
    currentTrack,
    isPlaying,
    togglePlay,
    nextTrack,
    prevTrack,
    repeatMode,
    cycleRepeatMode,
    isShuffled,
    toggleShuffle,
  } = usePlayerStore();

  const { isFavorite, toggleFavorite, trackNotes, setTrackNote } = useLibraryStore();
  const [activeTab, setActiveTab] = useState<'deck' | 'notes' | 'specs'>('deck');
  const [userNote, setUserNote] = useState('');
  const [showCopied, setShowCopied] = useState(false);

  React.useEffect(() => {
    if (currentTrack) {
      setUserNote(trackNotes[currentTrack.id] || '');
    }
  }, [currentTrack, trackNotes]);

  if (!currentTrack) return null;

  const isLiked = isFavorite(currentTrack.id);

  const handleSaveNote = () => {
    if (currentTrack) {
      setTrackNote(currentTrack.id, userNote);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Listening to "${currentTrack.title}" by ${currentTrack.artist} on AURA.`
      );
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2500);
    }
  };

  return (
    <AnimatePresence>
      {isVisualizerExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVisualizerExpanded(false)}
            className="fixed inset-0 bg-aura-950/95 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full h-full md:h-auto md:max-h-[90vh] md:max-w-5xl bg-aura-900 border-0 md:border md:border-aura-700/80 md:rounded-3xl shadow-aura-deck flex flex-col overflow-hidden z-10"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-aura-800/80 bg-aura-950/60">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-aura-accent animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-widest text-aura-400">
                  AURA MASTER AUDIO DECK — HI-RES ANALOG EMULATION
                </span>
              </div>

              <div className="hidden sm:flex items-center gap-1 bg-aura-900 p-1 rounded-lg border border-aura-800">
                <button
                  onClick={() => setActiveTab('deck')}
                  className={`px-3 py-1 text-xs rounded-md transition-all font-medium ${
                    activeTab === 'deck'
                      ? 'bg-aura-800 text-aura-100 shadow-sm border border-aura-700'
                      : 'text-aura-400 hover:text-aura-200'
                  }`}
                >
                  <Disc3 className="w-3.5 h-3.5 inline mr-1.5" />
                  Tactile Deck
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`px-3 py-1 text-xs rounded-md transition-all font-medium ${
                    activeTab === 'notes'
                      ? 'bg-aura-800 text-aura-100 shadow-sm border border-aura-700'
                      : 'text-aura-400 hover:text-aura-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 inline mr-1.5" />
                  Liner Notes
                </button>
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`px-3 py-1 text-xs rounded-md transition-all font-medium ${
                    activeTab === 'specs'
                      ? 'bg-aura-800 text-aura-100 shadow-sm border border-aura-700'
                      : 'text-aura-400 hover:text-aura-200'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5 inline mr-1.5" />
                  Sonic Specs
                </button>
              </div>

              <div className="flex items-center gap-2">
                <TactileButton
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleShare}
                  aria-label="Share track"
                >
                  <Share2 className="w-4 h-4" />
                </TactileButton>
                <TactileButton
                  variant="icon"
                  size="icon-sm"
                  onClick={() => setIsVisualizerExpanded(false)}
                  aria-label="Close expanded deck"
                >
                  <X className="w-4 h-4" />
                </TactileButton>
              </div>
            </div>

            <div className="flex sm:hidden border-b border-aura-800 bg-aura-900/80 px-4 py-2 gap-2">
              {(['deck', 'notes', 'specs'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-1.5 text-xs rounded-md font-medium capitalize ${
                    activeTab === tab
                      ? 'bg-aura-800 text-aura-100 border border-aura-700'
                      : 'text-aura-400'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              {activeTab === 'deck' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center h-full">
                  <div className="md:col-span-6 flex flex-col items-center justify-center relative">
                    <div className="relative w-64 h-64 sm:w-80 sm:h-80 max-w-full flex items-center justify-center">
                      <motion.div
                        animate={{
                          rotate: isPlaying ? 360 : 0,
                          x: 28,
                        }}
                        transition={{
                          rotate: {
                            repeat: Infinity,
                            duration: 12,
                            ease: 'linear',
                          },
                          x: { duration: 0.4 },
                        }}
                        className="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-[#111115] border-4 border-[#1c1c24] shadow-2xl flex items-center justify-center overflow-hidden"
                      >
                        <div className="absolute inset-2 rounded-full border border-white/5" />
                        <div className="absolute inset-6 rounded-full border border-white/5" />
                        <div className="absolute inset-10 rounded-full border border-white/5" />
                        <div className="absolute inset-14 rounded-full border border-white/5" />
                        <div className="absolute inset-18 rounded-full border border-white/5" />

                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-aura-accent/90 border-2 border-aura-900 flex flex-col items-center justify-center p-2 text-center select-none shadow-inner">
                          <span className="text-[8px] font-mono uppercase text-white/80 tracking-widest">
                            AURA 33 RPM
                          </span>
                          <span className="text-[10px] font-serif text-white font-bold leading-tight line-clamp-1">
                            {currentTrack.album}
                          </span>
                          <div className="w-2 h-2 rounded-full bg-aura-950 mt-1" />
                        </div>
                      </motion.div>

                      <div className="relative z-10 w-56 h-56 sm:w-72 sm:h-72 rounded-2xl shadow-aura-deck overflow-hidden border border-white/10">
                        <ArtworkImage
                          src={currentTrack.coverUrl}
                          alt={currentTrack.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="mt-8 w-full max-w-sm flex flex-col items-center bg-aura-950/60 p-3.5 rounded-2xl border border-aura-800/80">
                      <div className="flex items-center justify-between w-full mb-2 px-1">
                        <span className="text-[10px] font-mono text-aura-500 uppercase tracking-wider">
                          Real-time FFT Spectrum
                        </span>
                        <span className="text-[10px] font-mono text-aura-accent">
                          {isPlaying ? 'Live Stream Active' : 'Suspended'}
                        </span>
                      </div>
                      <VisualizerCanvas
                        mode="bars"
                        height={40}
                        width={280}
                        barColor="#e07a5f"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-6 flex flex-col justify-between space-y-6">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="accent">{currentTrack.genre}</Badge>
                        <Badge variant="amber">{currentTrack.mood}</Badge>
                        {currentTrack.bpm && <Badge variant="mono">{formatBpm(currentTrack.bpm)}</Badge>}
                      </div>

                      <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-aura-100 font-medium leading-tight">
                        {currentTrack.title}
                      </h2>
                      <p className="text-base sm:text-lg text-aura-400 mt-1.5 font-sans">
                        {currentTrack.artist}
                      </p>
                      <p className="text-xs text-aura-500 mt-0.5 font-mono">
                        From the album: <span className="text-aura-300">{currentTrack.album}</span>
                      </p>

                      {currentTrack.storyQuote && (
                        <div className="mt-6 p-4 rounded-xl bg-aura-850/60 border border-aura-800 text-sm text-aura-300 italic font-serif leading-relaxed">
                          {currentTrack.storyQuote}
                        </div>
                      )}
                    </div>

                    <div className="space-y-4 pt-4 border-t border-aura-800/60">
                      <TrackProgress showTimestamps={true} />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TactileButton
                            variant="ghost"
                            size="icon-sm"
                            onClick={toggleShuffle}
                            active={isShuffled}
                            aria-label="Toggle shuffle"
                          >
                            <Shuffle className="w-4 h-4" />
                          </TactileButton>
                          <TactileButton
                            variant="ghost"
                            size="icon-sm"
                            onClick={cycleRepeatMode}
                            active={repeatMode !== 'off'}
                            aria-label="Cycle repeat mode"
                          >
                            <Repeat className="w-4 h-4" />
                          </TactileButton>
                        </div>

                        <div className="flex items-center gap-3">
                          <TactileButton
                            variant="secondary"
                            size="icon-md"
                            onClick={prevTrack}
                            aria-label="Previous track"
                          >
                            <SkipBack className="w-4 h-4" />
                          </TactileButton>

                          <TactileButton
                            variant="primary"
                            size="icon-lg"
                            onClick={togglePlay}
                            aria-label={isPlaying ? 'Pause' : 'Play'}
                            className="bg-aura-100 text-aura-950 hover:bg-white"
                          >
                            {isPlaying ? (
                              <Pause className="w-6 h-6 fill-current" />
                            ) : (
                              <Play className="w-6 h-6 fill-current ml-0.5" />
                            )}
                          </TactileButton>

                          <TactileButton
                            variant="secondary"
                            size="icon-md"
                            onClick={nextTrack}
                            aria-label="Next track"
                          >
                            <SkipForward className="w-4 h-4" />
                          </TactileButton>
                        </div>

                        <div className="flex items-center gap-2">
                          <TactileButton
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => toggleFavorite(currentTrack.id)}
                            aria-label="Favorite track"
                            className={isLiked ? 'text-aura-accent hover:text-aura-accent' : ''}
                          >
                            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                          </TactileButton>

                          <div className="hidden sm:block">
                            <VolumeSlider showReadout={false} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="max-w-3xl mx-auto space-y-8">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-aura-accent">
                      Curator Commentary & Field Recordings
                    </span>
                    <h3 className="font-serif text-2xl text-aura-100 mt-1">
                      {currentTrack.title} — Liner Notes
                    </h3>
                  </div>

                  <div className="prose prose-invert max-w-none text-aura-300 font-sans leading-relaxed space-y-4">
                    <p className="text-base text-aura-200">
                      {currentTrack.curatorNote ||
                        'Recorded with intimate mic placement to preserve natural wooden harmonics and ambient acoustic space.'}
                    </p>

                    <div className="p-5 rounded-2xl bg-aura-850 border border-aura-800">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-aura-400 mb-2">
                        Author Statement
                      </h4>
                      <p className="italic font-serif text-aura-300 text-base">
                        {currentTrack.storyQuote ||
                          '“Music composed in stillness, holding back excess so every frequency counts.”'}
                      </p>
                      <span className="block mt-2 text-xs font-mono text-aura-500">
                        — {currentTrack.artist}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-aura-950/80 border border-aura-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <label htmlFor="user-note" className="text-xs font-mono uppercase text-aura-300 font-medium">
                        Your Personal Listening Journal
                      </label>
                      <span className="text-[10px] text-aura-500">Saved locally</span>
                    </div>
                    <textarea
                      id="user-note"
                      rows={3}
                      value={userNote}
                      onChange={(e) => setUserNote(e.target.value)}
                      placeholder="Add personal notes, reflections, or where you were when you heard this..."
                      className="w-full bg-aura-900 border border-aura-700/80 rounded-xl p-3 text-sm text-aura-200 placeholder:text-aura-600 focus:outline-none focus:border-aura-accent"
                    />
                    <div className="flex justify-end">
                      <TactileButton variant="secondary" size="sm" onClick={handleSaveNote}>
                        Save to Crate Archive
                      </TactileButton>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="max-w-3xl mx-auto space-y-6">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-aura-amber">
                      Acoustic Topology & Technical Telemetry
                    </span>
                    <h3 className="font-serif text-2xl text-aura-100 mt-1">
                      Audio Engineering Specifications
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-aura-850 border border-aura-800">
                      <span className="text-[11px] font-mono text-aura-500 uppercase">Tempo</span>
                      <p className="text-lg font-mono text-aura-100 mt-1">{formatBpm(currentTrack.bpm)}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-aura-850 border border-aura-800">
                      <span className="text-[11px] font-mono text-aura-500 uppercase">Harmonic Key</span>
                      <p className="text-lg font-mono text-aura-100 mt-1">{currentTrack.musicalKey || 'A Minor'}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-aura-850 border border-aura-800">
                      <span className="text-[11px] font-mono text-aura-500 uppercase">Release Date</span>
                      <p className="text-lg font-mono text-aura-100 mt-1">{formatDate(currentTrack.releaseDate)}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-aura-850 border border-aura-800">
                      <span className="text-[11px] font-mono text-aura-500 uppercase">Stream Encoding</span>
                      <p className="text-lg font-mono text-aura-100 mt-1">MPEG-4 AAC / 320 kbps</p>
                    </div>

                    <div className="p-4 rounded-xl bg-aura-850 border border-aura-800">
                      <span className="text-[11px] font-mono text-aura-500 uppercase">License</span>
                      <p className="text-sm font-mono text-aura-200 mt-1">{currentTrack.license || 'Creative Commons'}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-aura-850 border border-aura-800">
                      <span className="text-[11px] font-mono text-aura-500 uppercase">Tags</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {currentTrack.tags.map((tag) => (
                          <span key={tag} className="text-[10px] bg-aura-800 text-aura-300 px-1.5 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {showCopied && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-aura-100 text-aura-950 font-mono text-xs px-4 py-2 rounded-full shadow-lg border border-white/20 z-30 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-aura-accent" />
                Track dispatch link copied to clipboard
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
