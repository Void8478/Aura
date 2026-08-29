import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { AudioPlayer } from '../player/AudioPlayer';
import { QueueDrawer } from '../player/QueueDrawer';
import { ExpandedPlayerModal } from '../player/ExpandedPlayerModal';
import { SearchPalette } from '../search/SearchPalette';
import { KeyboardShortcutsModal } from '../common/KeyboardShortcutsModal';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

export const Layout: React.FC = () => {
  // Initialize global keyboard controls
  useKeyboardShortcuts();

  return (
    <div className="min-h-screen bg-aura-900 text-aura-200 flex flex-col selection:bg-aura-accent selection:text-white relative font-sans">
      {/* Background grain texture */}
      <div className="fixed inset-0 pointer-events-none bg-grain opacity-40 z-0" />

      <Header />

      <main className="flex-1 relative z-10">
        <Outlet />
      </main>

      <Footer />

      {/* Global Persistent Audio Elements & Overlays */}
      <AudioPlayer />
      <QueueDrawer />
      <ExpandedPlayerModal />
      <SearchPalette />
      <KeyboardShortcutsModal />
    </div>
  );
};
