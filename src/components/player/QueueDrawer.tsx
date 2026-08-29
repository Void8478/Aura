import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Trash2, Music2, ArrowUp, ArrowDown } from 'lucide-react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { ArtworkImage } from '../ui/ArtworkImage';
import { TactileButton } from '../ui/TactileButton';
import { formatTime } from '../../utils/formatters';

export const QueueDrawer: React.FC = () => {
  const {
    isQueueOpen,
    setIsQueueOpen,
    queue,
    queueIndex,
    playTrack,
    removeFromQueue,
    clearQueue,
    setQueue,
  } = usePlayerStore();

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const newQueue = [...queue];
    const item = newQueue[index];
    newQueue[index] = newQueue[index - 1];
    newQueue[index - 1] = item;
    setQueue(newQueue);
  };

  const handleMoveDown = (index: number) => {
    if (index >= queue.length - 1) return;
    const newQueue = [...queue];
    const item = newQueue[index];
    newQueue[index] = newQueue[index + 1];
    newQueue[index + 1] = item;
    setQueue(newQueue);
  };

  return (
    <AnimatePresence>
      {isQueueOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsQueueOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs"
          />

          {/* Drawer Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-24 w-full sm:w-96 md:w-[420px] z-50 bg-aura-900 border-l border-aura-700/80 shadow-aura-deck flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-aura-800">
              <div className="flex items-center gap-2.5">
                <Music2 className="w-4 h-4 text-aura-accent" />
                <h3 className="font-serif text-lg text-aura-100 font-medium">
                  Listening Queue
                </h3>
                <span className="text-[11px] font-mono bg-aura-800 text-aura-400 px-2 py-0.5 rounded-full border border-aura-700">
                  {queue.length} {queue.length === 1 ? 'track' : 'tracks'}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {queue.length > 1 && (
                  <TactileButton
                    variant="ghost"
                    size="sm"
                    onClick={clearQueue}
                    className="text-xs text-aura-500 hover:text-aura-300"
                  >
                    Clear
                  </TactileButton>
                )}
                <TactileButton
                  variant="icon"
                  size="icon-sm"
                  onClick={() => setIsQueueOpen(false)}
                  aria-label="Close queue drawer"
                >
                  <X className="w-4 h-4" />
                </TactileButton>
              </div>
            </div>

            {/* Track List */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1.5 divide-y divide-aura-800/40">
              {queue.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-aura-500">
                  <Music2 className="w-10 h-10 stroke-[1.2] mb-3 opacity-40" />
                  <p className="text-sm font-medium text-aura-300">The queue is empty</p>
                  <p className="text-xs text-aura-500 mt-1">
                    Select any track from the journal or catalog to begin playback.
                  </p>
                </div>
              ) : (
                queue.map((track, idx) => {
                  const isCurrent = idx === queueIndex;
                  return (
                    <div
                      key={`${track.id}-${idx}`}
                      className={`group flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                        isCurrent
                          ? 'bg-aura-800/90 border border-aura-accent/30 shadow-sm'
                          : 'hover:bg-aura-850/60'
                      }`}
                    >
                      {/* Track artwork */}
                      <div className="relative w-11 h-11 shrink-0 rounded-lg overflow-hidden">
                        <ArtworkImage src={track.coverUrl} alt={track.title} />
                        <button
                          onClick={() => playTrack(track)}
                          className={`absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity ${
                            isCurrent ? 'opacity-100 text-aura-accent' : 'opacity-0 group-hover:opacity-100 text-white'
                          }`}
                        >
                          <Play className="w-4 h-4 fill-current" />
                        </button>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-sm truncate font-medium ${
                              isCurrent ? 'text-aura-accent font-semibold' : 'text-aura-200'
                            }`}
                          >
                            {track.title}
                          </p>
                        </div>
                        <p className="text-xs text-aura-400 truncate mt-0.5">
                          {track.artist}
                        </p>
                      </div>

                      {/* Duration / Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-[11px] font-mono text-aura-500 group-hover:hidden pr-1">
                          {formatTime(track.duration)}
                        </span>

                        {/* Order controls */}
                        <div className="hidden group-hover:flex items-center gap-0.5">
                          <button
                            onClick={() => handleMoveUp(idx)}
                            disabled={idx === 0}
                            className="p-1 text-aura-400 hover:text-aura-100 disabled:opacity-20"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveDown(idx)}
                            disabled={idx === queue.length - 1}
                            className="p-1 text-aura-400 hover:text-aura-100 disabled:opacity-20"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => removeFromQueue(track.id)}
                            className="p-1 text-aura-400 hover:text-aura-accent"
                            title="Remove from queue"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer summary */}
            {queue.length > 0 && (
              <div className="px-6 py-4 bg-aura-950/80 border-t border-aura-800/80 flex items-center justify-between text-xs text-aura-400">
                <span>
                  Total duration:{' '}
                  <strong className="font-mono text-aura-200">
                    {Math.round(queue.reduce((acc, t) => acc + t.duration, 0) / 60)} mins
                  </strong>
                </span>
                <span className="text-[11px] text-aura-500">
                  Continuous loop: On
                </span>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
