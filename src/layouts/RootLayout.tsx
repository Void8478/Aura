import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  Search,
  HelpCircle,
  Home,
  Compass,
  Heart,
  FolderHeart,
  History,
  Info,
  Menu,
  X,
  Disc3
} from 'lucide-react';
import { AudioPlayer } from '../components/player/AudioPlayer';
import { QueueDrawer } from '../components/player/QueueDrawer';
import { ExpandedPlayerModal } from '../components/player/ExpandedPlayerModal';
import { SearchPalette } from '../components/search/SearchPalette';
import { KeyboardShortcutsModal } from '../components/common/KeyboardShortcutsModal';
import { ToastContainer } from '../components/ui/Toast';
import { VisualizerCanvas } from '../components/player/VisualizerCanvas';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { usePlayerStore } from '../store/usePlayerStore';

export const RootLayout: React.FC = () => {
  useKeyboardShortcuts();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isPlaying, currentTrack, setIsSearchOpen, toggleVisualizer, setIsShortcutsOpen } =
    usePlayerStore();

  const navLinks = [
    { path: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { path: '/discover', label: 'Discover', icon: <Compass className="w-4 h-4" /> },
    { path: '/search', label: 'Search', icon: <Search className="w-4 h-4" /> },
  ];

  const libraryLinks = [
    { path: '/favorites', label: 'Liked', icon: <Heart className="w-4 h-4" /> },
    { path: '/library', label: 'Playlists', icon: <FolderHeart className="w-4 h-4" /> },
    { path: '/recent', label: 'Recently Played', icon: <History className="w-4 h-4" /> },
  ];

  const secondaryLinks = [
    { path: '/about', label: 'About', icon: <Info className="w-4 h-4" /> },
    { path: '/design-test', label: 'Design System', icon: <Disc3 className="w-4 h-4" /> },
  ];

  const checkActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-aura-900 text-aura-200 flex relative font-sans overflow-x-hidden selection:bg-aura-accent selection:text-white">
      {/* Background grain texture */}
      <div className="fixed inset-0 pointer-events-none bg-grain opacity-40 z-0" />

      {/* 1. DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 bg-aura-950/80 border-r border-aura-800/80 shrink-0 h-screen sticky top-0 z-20 select-none">
        {/* Sidebar Header / Masthead */}
        <div className="p-6 border-b border-aura-800/50 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-aura-800 border border-aura-700/80 flex items-center justify-center group-hover:border-aura-accent/60 transition-colors">
              <span className="font-serif text-lg font-bold text-aura-accent">A</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold tracking-tight text-aura-100 group-hover:text-aura-accent transition-colors">
                AURA
              </span>
              <span className="text-[9px] font-mono tracking-widest text-aura-500 uppercase -mt-0.5">
                SONIC JOURNAL
              </span>
            </div>
          </Link>
        </div>

        {/* Sidebar Nav Area */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-7">
          {/* Group 1: Navigation */}
          <div className="space-y-2">
            <span className="px-3 text-[10px] font-mono uppercase tracking-wider text-aura-500 font-medium">
              Navigation
            </span>
            <ul className="space-y-1">
              {navLinks.map((link) => {
                const active = checkActive(link.path);
                return (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        active
                          ? 'bg-aura-850 text-aura-100 border border-aura-700/60 font-semibold'
                          : 'text-aura-400 hover:text-aura-100 hover:bg-aura-900/40 border border-transparent'
                      }`}
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Group 2: Library */}
          <div className="space-y-2">
            <span className="px-3 text-[10px] font-mono uppercase tracking-wider text-aura-500 font-medium">
              Library
            </span>
            <ul className="space-y-1">
              {libraryLinks.map((link) => {
                const active = checkActive(link.path);
                return (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        active
                          ? 'bg-aura-850 text-aura-100 border border-aura-700/60 font-semibold'
                          : 'text-aura-400 hover:text-aura-100 hover:bg-aura-900/40 border border-transparent'
                      }`}
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Group 3: Curation Colophon */}
          <div className="space-y-2">
            <span className="px-3 text-[10px] font-mono uppercase tracking-wider text-aura-500 font-medium">
              Statement
            </span>
            <ul className="space-y-1">
              {secondaryLinks.map((link) => {
                const active = checkActive(link.path);
                return (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        active
                          ? 'bg-aura-850 text-aura-100 border border-aura-700/60 font-semibold'
                          : 'text-aura-400 hover:text-aura-100 hover:bg-aura-900/40 border border-transparent'
                      }`}
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-aura-800/50 flex items-center justify-between text-[11px] font-mono text-aura-500">
          <span>Sheffield • Kyoto</span>
          <span>ISSN 2984</span>
        </div>
      </aside>

      {/* 2. MAIN LAYOUT SHELL (fills rest of page width) */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* DESKTOP TOP HEADER */}
        <header className="hidden lg:flex items-center justify-between px-8 h-20 bg-aura-900/90 backdrop-blur-md sticky top-0 z-20 border-b border-aura-800/40">
          {/* Top header search trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-3 px-4 py-2 rounded-xl bg-aura-850 border border-aura-700/80 hover:border-aura-600 text-aura-400 hover:text-aura-100 transition-all text-xs w-72 shadow-xs text-left"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="flex-1 font-sans">Search compositions...</span>
            <kbd className="font-mono text-[10px] bg-aura-800 text-aura-500 px-1.5 py-0.5 rounded border border-aura-700 select-none">
              ⌘K
            </kbd>
          </button>

          {/* Right Header Controls */}
          <div className="flex items-center gap-4">
            {currentTrack && (
              <button
                onClick={toggleVisualizer}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-aura-850 border border-aura-800 hover:border-aura-700 text-xs shadow-xs"
                title="View Master Deck"
              >
                <VisualizerCanvas mode="minimal-dots" width={36} height={12} barColor="#e07a5f" />
                <span className="font-mono text-[9px] text-aura-400 tracking-wider">
                  {isPlaying ? 'PLAYING' : 'PAUSED'}
                </span>
              </button>
            )}

            <button
              onClick={() => setIsShortcutsOpen(true)}
              className="p-2 rounded-xl bg-aura-850 border border-aura-800 hover:border-aura-700 text-aura-400 hover:text-aura-100 transition-colors"
              title="Keyboard shortcuts"
              aria-label="View shortcuts"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* MOBILE COMPACT HEADER */}
        <header className="lg:hidden flex items-center justify-between px-4 h-16 bg-aura-900/90 backdrop-blur-md sticky top-0 z-20 border-b border-aura-800/80">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded bg-aura-800 border border-aura-700 flex items-center justify-center">
              <span className="font-serif text-sm font-bold text-aura-accent">A</span>
            </div>
            <span className="font-serif text-base font-bold text-aura-100">AURA</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-lg bg-aura-850 border border-aura-800 text-aura-400"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-aura-850 border border-aura-800 text-aura-400"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* MOBILE OVERLAY NAVIGATION MENU */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-16 bg-aura-950/95 backdrop-blur-md z-30 flex flex-col p-6 space-y-6 select-none animate-in fade-in-50">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-aura-500">
                Navigation
              </span>
              <ul className="space-y-1">
                {[...navLinks, ...libraryLinks, ...secondaryLinks].map((link) => {
                  const active = checkActive(link.path);
                  return (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          active
                            ? 'bg-aura-850 text-aura-100 font-semibold'
                            : 'text-aura-400 hover:text-aura-100'
                        }`}
                      >
                        {link.icon}
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="pt-6 border-t border-aura-800/60 flex items-center justify-between text-[10px] font-mono text-aura-500">
              <span>Sheffield • Kyoto</span>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsShortcutsOpen(true);
                }}
                className="text-aura-accent underline"
              >
                Shortcuts (?)
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area Container */}
        <div className="flex-1 flex flex-col relative z-10">
          <Outlet />
        </div>

        {/* MOBILE BOTTOM NAVIGATION BAR */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-aura-950/90 backdrop-blur-md border-t border-aura-800/80 py-2.5 px-6 flex items-center justify-around select-none pb-safe-bottom">
          <Link
            to="/"
            className={`flex flex-col items-center gap-1 text-[10px] ${
              checkActive('/') ? 'text-aura-accent font-semibold' : 'text-aura-400'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <Link
            to="/discover"
            className={`flex flex-col items-center gap-1 text-[10px] ${
              checkActive('/discover') ? 'text-aura-accent font-semibold' : 'text-aura-400'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Discover</span>
          </Link>
          <Link
            to="/search"
            className={`flex flex-col items-center gap-1 text-[10px] ${
              checkActive('/search') ? 'text-aura-accent font-semibold' : 'text-aura-400'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </Link>
          <Link
            to="/library"
            className={`flex flex-col items-center gap-1 text-[10px] ${
              checkActive('/library') || checkActive('/favorites') || checkActive('/recent')
                ? 'text-aura-accent font-semibold'
                : 'text-aura-400'
            }`}
          >
            <FolderHeart className="w-4 h-4" />
            <span>Library</span>
          </Link>
        </nav>
      </div>

      {/* Global Overlays & Persistent Player (Common across all views) */}
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
