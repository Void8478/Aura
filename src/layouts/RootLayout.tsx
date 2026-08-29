import { Outlet, Link, useLocation } from 'react-router-dom';
import { Search, HelpCircle } from 'lucide-react';
import { AudioPlayer } from '../components/player/AudioPlayer';
import { QueueDrawer } from '../components/player/QueueDrawer';
import { ExpandedPlayerModal } from '../components/player/ExpandedPlayerModal';
import { SearchPalette } from '../components/search/SearchPalette';
import { KeyboardShortcutsModal } from '../components/common/KeyboardShortcutsModal';
import { ToastContainer } from '../components/ui/Toast';
import { VisualizerCanvas } from '../components/player/VisualizerCanvas';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { usePlayerStore } from '../store/usePlayerStore';

export const RootLayout = () => {
  useKeyboardShortcuts();
  const location = useLocation();
  const { isPlaying, currentTrack, setIsSearchOpen, toggleVisualizer, setIsShortcutsOpen } =
    usePlayerStore();

  const navLinks = [
    { path: '/', label: 'Journal' },
    { path: '/discover', label: 'Discover' },
    { path: '/search', label: 'Search' },
    { path: '/library', label: 'Library' },
    { path: '/favorites', label: 'Favorites' },
    { path: '/recent', label: 'Recent' },
    { path: '/about', label: 'About' },
    { path: '/design-test', label: 'Design System' },
  ];

  return (
    <div className="min-h-screen bg-aura-900 text-aura-200 flex flex-col selection:bg-aura-accent selection:text-white relative font-sans">
      <div className="fixed inset-0 pointer-events-none bg-grain opacity-40 z-0" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-30 bg-aura-900/90 backdrop-blur-md border-b border-aura-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Masthead */}
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
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 bg-aura-950/60 p-1.5 rounded-xl border border-aura-800/80">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
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

            {/* Header Right Actions */}
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

          {/* Mobile / Tablet Horizontal Navigation Scroll */}
          <div className="flex lg:hidden items-center justify-start gap-1 py-2.5 border-t border-aura-800/60 overflow-x-auto no-scrollbar">
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

      {/* Main Content Area */}
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>

      {/* Footer */}
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
                intimate chamber acoustics, and conscious audio discovery.
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
            <p>© 2026 AURA Audio Editions. All rights reserved.</p>
            <p className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-aura-accent" />
              Designed for thoughtful listening
            </p>
          </div>
        </div>
      </footer>

      {/* Global Overlays & Persistent Player */}
      <AudioPlayer />
      <QueueDrawer />
      <ExpandedPlayerModal />
      <SearchPalette />
      <KeyboardShortcutsModal />
      <ToastContainer />
    </div>
  );
};

export default RootLayout;
