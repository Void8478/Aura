import React from 'react';
import { HelpCircle } from 'lucide-react';
import { usePlayerStore } from '../../store/usePlayerStore';

export const Footer: React.FC = () => {
  const { setIsShortcutsOpen } = usePlayerStore();

  return (
    <footer className="border-t border-aura-800/80 bg-aura-950/60 pb-28 pt-12 text-aura-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold text-aura-100">AURA</span>
              <span className="text-xs font-mono text-aura-500 uppercase tracking-wider">
                — Journal & Audio Lab
              </span>
            </div>
            <p className="text-xs text-aura-400 max-w-md leading-relaxed font-sans">
              An independent sound publication documenting the resurgence of analog tape warmth,
              intimate chamber acoustics, and conscious audio discovery. Designed with restraint,
              editorial care, and zero algorithmic noise.
            </p>
            <div className="flex items-center gap-4 text-[11px] font-mono text-aura-500 pt-1">
              <span>ISSN 2984-184X</span>
              <span>•</span>
              <span>Sheffield • Kyoto • Berlin</span>
            </div>
          </div>

          <div className="md:col-span-3 space-y-2">
            <h4 className="font-mono text-xs uppercase tracking-wider text-aura-300">
              Audio Telemetry
            </h4>
            <ul className="text-xs text-aura-500 space-y-1.5 font-sans">
              <li>Web Audio Analyser API</li>
              <li>Jamendo Open Protocol</li>
              <li>Zero Tracking / Local State</li>
              <li>Hi-Fi Creative Commons Stems</li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-2">
            <h4 className="font-mono text-xs uppercase tracking-wider text-aura-300">
              Tactile Access
            </h4>
            <p className="text-xs text-aura-500 leading-relaxed font-sans">
              Control playback without leaving your keyboard.
            </p>
            <button
              onClick={() => setIsShortcutsOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs text-aura-accent hover:underline font-medium pt-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              View Keyboard Shortcuts (?)
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-aura-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-aura-500 font-mono">
          <p>© 2026 AURA Audio Editions. All legal Creative Commons rights reserved to respective composers.</p>
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-aura-accent" />
            Designed for thoughtful listening
          </p>
        </div>
      </div>
    </footer>
  );
};
