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
    next,
    previous,
    repeat,
    toggleRepeat,
    shuffle,
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 overflow-hidden select-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVisualizerExpanded(false)}
            className="fixed inset-0 bg-aura-950/98 backdrop-blur-lg"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 30 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full h-full md:h-auto md:max-h-[92vh] md:max-w-4xl bg-aura-900 border-0 md:border md:border-aura-800 md:rounded-3xl shadow-aura-deck flex flex-col overflow-hidden z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-aura-800/80 bg-aura-950/60">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-aura-accent" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-aura-400">
                  Tactile Audio Deck
                </span>
              </div>

              {/* Tabs (Desktop) */}
              <div className="hidden sm:flex items-center gap-1 bg-aura-900 p-1 rounded-lg border border-aura-800">
                <button
                  onClick={() => setActiveTab('deck')}
                  className={`px-3 py-1 text-xs rounded-md transition-all font-medium cursor-pointer ${
                    activeTab === 'deck'
                      ? 'bg-aura-800 text-aura-100 border border-aura-700 shadow-xs'
                      : 'text-aura-400 hover:text-aura-200'
                  }`}
                >
                  <Disc3 className="w-3.5 h-3.5 inline mr-1.5" />
                  Tactile Deck
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`px-3 py-1 text-xs rounded-md transition-all font-medium cursor-pointer ${
                    activeTab === 'notes'
                      ? 'bg-aura-800 text-aura-100 border border-aura-700 shadow-xs'
                      : 'text-aura-400 hover:text-aura-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 inline mr-1.5" />
                  Liner Notes
                </button>
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`px-3 py-1 text-xs rounded-md transition-all font-medium cursor-pointer ${
                    activeTab === 'specs'
                      ? 'bg-aura-800 text-aura-100 border border-aura-700 shadow-xs'
                      : 'text-aura-400 hover:text-aura-200'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5 inline mr-1.5" />
                  Specs
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
                  className="hover:bg-aura-800"
                >
                  <X className="w-4 h-4" />
                </TactileButton>
              </div>
            </div>

            {/* Tabs (Mobile Navigation) */}
            <div className="flex sm:hidden border-b border-aura-800 bg-aura-900/80 px-4 py-2 gap-2">
              {(['deck', 'notes', 'specs'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-1.5 text-xs rounded-md font-medium capitalize cursor-pointer ${
                    activeTab === tab
                      ? 'bg-aura-800 text-aura-100 border border-aura-700 shadow-xs'
                      : 'text-aura-400'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10">
              {activeTab === 'deck' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center h-full">
                  {/* Left Column: Artwork (Framer Motion Continuous Transition) */}
                  <div className="md:col-span-6 flex flex-col items-center justify-center relative">
                    <div className="w-64 h-64 sm:w-80 sm:h-80 max-w-full flex items-center justify-center">
                      <motion.div
                        layoutId="player-artwork"
                        className="w-full h-full rounded-3xl shadow-aura-deck overflow-hidden border border-white/10"
                      >
                        <ArtworkImage
                          src={currentTrack.coverUrl}
                          alt={currentTrack.title}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    </div>

                    {/* Minimal FFT Visualizer Canvas */}
                    <div className="mt-8 w-full max-w-sm flex flex-col items-center bg-aura-950/40 p-4 rounded-2xl border border-aura-800/85">
                      <div className="flex items-center justify-between w-full mb-2 px-1">
                        <span className="text-[9px] font-mono text-aura-500 uppercase tracking-wider">
                          Real-time Spectrum
                        </span>
                        <span className="text-[9px] font-mono text-aura-accent">
                          {isPlaying ? 'Live Emulation' : 'Suspended'}
                        </span>
                      </div>
                      <VisualizerCanvas
                        mode="bars"
                        height={40}
                        width={280}
                        barColor="#e07a5f"
                        className="w-full opacity-80"
                      />
                    </div>
                  </div>

                  {/* Right Column: Track Details & Controls */}
                  <div className="md:col-span-6 flex flex-col justify-between space-y-6">
                    <div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="accent">{currentTrack.genre}</Badge>
                        <Badge variant="amber">{currentTrack.mood}</Badge>
                        {currentTrack.bpm && <Badge variant="mono">{formatBpm(currentTrack.bpm)} BPM</Badge>}
                      </div>

                      <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-aura-100 font-normal leading-tight">
                        {currentTrack.title}
                      </h2>
                      <p className="text-base sm:text-lg text-aura-400 mt-1.5 font-sans">
                        {currentTrack.artist}
                      </p>
                      <p className="text-xs text-aura-500 mt-1 font-mono">
                        Source: <span className="text-aura-350">{currentTrack.album}</span>
                      </p>

                      {currentTrack.storyQuote && (
                        <div className="mt-6 p-4 rounded-2xl bg-aura-850/60 border border-aura-800 text-xs text-aura-300 italic font-serif leading-relaxed">
                          {currentTrack.storyQuote}
                        </div>
                      )}
                    </div>

                    {/* Progress Slider & Controls */}
                    <div className="space-y-4 pt-4 border-t border-aura-800/60">
                      <TrackProgress showTimestamps={true} />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <TactileButton
                            variant="ghost"
                            size="icon-sm"
                            onClick={toggleShuffle}
                            active={shuffle}
                            aria-label="Toggle shuffle"
                          >
                            <Shuffle className="w-4 h-4" />
                          </TactileButton>
                          <TactileButton
                            variant="ghost"
                            size="icon-sm"
                            onClick={toggleRepeat}
                            active={repeat !== 'off'}
                            aria-label="Cycle repeat mode"
                          >
                            <Repeat className="w-4 h-4" />
                          </TactileButton>
                        </div>

                        <div className="flex items-center gap-3">
                          <TactileButton
                            variant="secondary"
                            size="icon-md"
                            onClick={previous}
                            aria-label="Previous track"
                          >
                            <SkipBack className="w-4 h-4 text-aura-300" />
                          </TactileButton>

                          <TactileButton
                            variant="primary"
                            size="icon-lg"
                            onClick={togglePlay}
                            aria-label={isPlaying ? 'Pause' : 'Play'}
                            className="bg-aura-100 text-aura-950 hover:bg-white w-12 h-12 rounded-full"
                          >
                            {isPlaying ? (
                              <Pause className="w-5 h-5 fill-current" />
                            ) : (
                              <Play className="w-5 h-5 fill-current ml-0.5" />
                            )}
                          </TactileButton>

                          <TactileButton
                            variant="secondary"
                            size="icon-md"
                            onClick={next}
                            aria-label="Next track"
                          >
                            <SkipForward className="w-4 h-4 text-aura-300" />
                          </TactileButton>
                        </div>

                        <div className="flex items-center gap-2">
                          <TactileButton
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => toggleFavorite(currentTrack.id, currentTrack)}
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
                <div className="max-w-2xl mx-auto space-y-8">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-aura-accent font-medium">
                      Curator Dispatch Liner Notes
                    </span>
                    <h3 className="font-serif text-2xl text-aura-100 mt-1">
                      {currentTrack.title}
                    </h3>
                  </div>

                  <div className="text-aura-300 font-sans leading-relaxed space-y-4">
                    <p className="text-sm sm:text-base text-aura-205">
                      {currentTrack.curatorNote ||
                        'Recorded with close mic placements to preserve woody harmonics and natural room dynamics.'}
                    </p>

                    <div className="p-5 rounded-2xl bg-aura-850 border border-aura-800">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-aura-400 block mb-2">
                        Composer Vision Statement
                      </span>
                      <p className="italic font-serif text-aura-300 text-sm">
                        {currentTrack.storyQuote ||
                          '“Conceived in isolation, exploring the threshold where sound merges with ambient stillness.”'}
                      </p>
                      <span className="block mt-2 text-[10px] font-mono text-aura-500">
                        — {currentTrack.artist}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-aura-950/80 border border-aura-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <label htmlFor="user-note" className="text-xs font-mono uppercase text-aura-300 font-medium">
                        Sonic Journal Notes
                      </label>
                      <span className="text-[9px] font-mono text-aura-500">Saved locally</span>
                    </div>
                    <textarea
                      id="user-note"
                      rows={3}
                      value={userNote}
                      onChange={(e) => setUserNote(e.target.value)}
                      placeholder="Add listening notes, details, reflections, or local tape contexts..."
                      className="w-full bg-aura-900 border border-aura-700/80 rounded-xl p-3 text-sm text-aura-200 placeholder:text-aura-600 focus:outline-none focus:border-aura-accent resize-none font-sans"
                    />
                    <div className="flex justify-end">
                      <TactileButton variant="secondary" size="sm" onClick={handleSaveNote}>
                        Save to Repository
                      </TactileButton>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="max-w-2xl mx-auto space-y-6">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-aura-amber">
                      Audio Telemetry
                    </span>
                    <h3 className="font-serif text-2xl text-aura-100 mt-1">
                      Sonic Specifications
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-aura-850 border border-aura-800">
                      <span className="text-[10px] font-mono text-aura-500 uppercase">Tempo</span>
                      <p className="text-lg font-mono text-aura-100 mt-1">{formatBpm(currentTrack.bpm)} BPM</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-aura-850 border border-aura-800">
                      <span className="text-[10px] font-mono text-aura-500 uppercase">Musical Scale</span>
                      <p className="text-lg font-mono text-aura-100 mt-1">{currentTrack.musicalKey || 'D Minor'}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-aura-850 border border-aura-800">
                      <span className="text-[10px] font-mono text-aura-500 uppercase">Dispatch Date</span>
                      <p className="text-lg font-mono text-aura-100 mt-1">{formatDate(currentTrack.releaseDate)}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-aura-850 border border-aura-800">
                      <span className="text-[10px] font-mono text-aura-500 uppercase">Stream Bitrate</span>
                      <p className="text-lg font-mono text-aura-100 mt-1">AAC / 320 kbps</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-aura-850 border border-aura-800">
                      <span className="text-[10px] font-mono text-aura-500 uppercase">Acoustic Mode</span>
                      <p className="text-sm font-mono text-aura-200 mt-1">Free Creative Commons</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-aura-850 border border-aura-800">
                      <span className="text-[10px] font-mono text-aura-500 uppercase">Descriptors</span>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {currentTrack.tags.map((tag) => (
                          <span key={tag} className="text-[9px] font-mono bg-aura-800 text-aura-350 px-2 py-0.5 rounded-md">
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
                Dispatch link copied
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ExpandedPlayerModal;
