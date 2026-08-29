import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { VisualizerCanvas } from '../player/VisualizerCanvas';

export const Header: React.FC = () => {
  const { isPlaying, currentTrack, setIsSearchOpen, toggleVisualizer } = usePlayerStore();
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'The Journal' },
    { path: '/browse', label: 'Dispatches' },
    { path: '/radio', label: 'Atmosphere' },
    { path: '/library', label: 'Crates & Archive' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-aura-900/90 backdrop-blur-md border-b border-aura-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-6">
            <Link to="/" className="group flex items-center gap-2.5 select-none">
              <div className="w-8 h-8 rounded-lg bg-aura-800 border border-aura-700/80 flex items-center justify-center group-hover:border-aura-accent/60 transition-colors">
                <span className="font-serif text-lg font-bold text-aura-accent">A</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-aura-100 group-hover:text-aura-accent transition-colors">
                  AURA
                </span>
                <span className="text-[9px] font-mono tracking-widest text-aura-500 uppercase -mt-1 hidden sm:block">
                  Sonic Journal & Audio
                </span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-aura-850 border border-aura-800 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-aura-accent animate-ping" />
              <span className="font-mono text-[11px] text-aura-400">
                ISSUE #14:{' '}
                <strong className="text-aura-200 font-medium">Textures of the Subconscious</strong>
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 bg-aura-950/60 p-1.5 rounded-xl border border-aura-800/80">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-aura-850 text-aura-100 shadow-xs border border-aura-700/70 font-semibold'
                      : 'text-aura-400 hover:text-aura-200 hover:bg-aura-900/60'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-aura-850 border border-aura-700/80 text-aura-400 hover:text-aura-100 hover:border-aura-600 transition-all text-xs shadow-xs"
              aria-label="Open search palette"
            >
              <Search className="w-3.5 h-3.5 text-aura-400" />
              <span className="hidden sm:inline font-sans">Search catalog...</span>
              <kbd className="hidden sm:inline-block font-mono text-[10px] bg-aura-800 text-aura-400 px-1.5 py-0.5 rounded border border-aura-700">
                ⌘K
              </kbd>
            </button>

            {currentTrack && (
              <button
                onClick={toggleVisualizer}
                className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-aura-850 border border-aura-800 hover:border-aura-700 text-xs"
                title="View Master Deck"
              >
                <VisualizerCanvas mode="minimal-dots" width={32} height={14} barColor="#e07a5f" />
                <span className="font-mono text-[10px] text-aura-300 max-w-[90px] truncate">
                  {isPlaying ? 'PLAYING' : 'PAUSED'}
                </span>
              </button>
            )}
          </div>
        </div>

        <div className="flex md:hidden items-center justify-around py-2.5 border-t border-aura-800/60 overflow-x-auto">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'text-aura-accent font-semibold bg-aura-850'
                    : 'text-aura-400 hover:text-aura-200'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
};
