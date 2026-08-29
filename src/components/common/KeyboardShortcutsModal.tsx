import React from 'react';
import { Modal } from '../ui/Modal';
import { usePlayerStore } from '../../store/usePlayerStore';

export const KeyboardShortcutsModal: React.FC = () => {
  const { isShortcutsOpen, setIsShortcutsOpen } = usePlayerStore();

  const shortcuts = [
    { key: 'Space', desc: 'Play / Pause playback' },
    { key: 'N', desc: 'Skip to next track' },
    { key: 'P', desc: 'Skip to previous track' },
    { key: 'J / ←', desc: 'Seek backwards 5 seconds' },
    { key: 'K / →', desc: 'Seek forward 5 seconds' },
    { key: 'M', desc: 'Toggle mute' },
    { key: 'L', desc: 'Like / save track to favorites' },
    { key: 'V', desc: 'Toggle Tactile Master Deck & Visualizer' },
    { key: 'Q', desc: 'Toggle Listening Queue drawer' },
    { key: '/ or ⌘K', desc: 'Open Command Search Palette' },
    { key: 'Esc', desc: 'Close open dialogs & overlays' },
  ];

  return (
    <Modal
      isOpen={isShortcutsOpen}
      onClose={() => setIsShortcutsOpen(false)}
      title="Keyboard Navigation"
      subtitle="Tactile controls engineered for continuous listening"
      maxWidth="md"
    >
      <div className="space-y-2.5">
        {shortcuts.map((sc) => (
          <div
            key={sc.key}
            className="flex items-center justify-between py-2 border-b border-aura-800/50 last:border-0"
          >
            <span className="text-sm text-aura-300 font-sans">{sc.desc}</span>
            <kbd className="px-2.5 py-1 bg-aura-800 border border-aura-700 text-aura-100 font-mono text-xs rounded-md shadow-xs">
              {sc.key}
            </kbd>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-aura-800/80 flex items-center justify-between text-xs text-aura-500 font-mono">
        <span>AURA Audio Engine v1.0</span>
        <span>Zero Latency Web Audio</span>
      </div>
    </Modal>
  );
};
