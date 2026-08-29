import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';

// Lazy loaded page components
const HomePage = React.lazy(() => import('./pages/HomePage'));
const DiscoverPage = React.lazy(() => import('./pages/DiscoverPage'));
const SearchPage = React.lazy(() => import('./pages/SearchPage'));
const LibraryPage = React.lazy(() =>
  import('./pages/LibraryPage').then((m) => ({ default: m.LibraryPage }))
);
const FavoritesPage = React.lazy(() => import('./pages/FavoritesPage'));
const RecentPage = React.lazy(() => import('./pages/RecentPage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const AlbumDetailPage = React.lazy(() =>
  import('./pages/AlbumDetailPage').then((m) => ({ default: m.AlbumDetailPage }))
);
const ArtistDetailPage = React.lazy(() => import('./pages/ArtistDetailPage'));
const PlaylistDetailPage = React.lazy(() => import('./pages/PlaylistDetailPage'));
const DesignTestPage = React.lazy(() => import('./pages/DesignTestPage'));

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          {/* Initial Static Routes */}
          <Route index element={<HomePage />} />
          <Route path="discover" element={<DiscoverPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="library" element={<LibraryPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="recent" element={<RecentPage />} />
          <Route path="about" element={<AboutPage />} />

          {/* Design System Test Page */}
          <Route path="design-test" element={<DesignTestPage />} />

          {/* Dynamic Detail Routes */}
          <Route path="album/:id" element={<AlbumDetailPage />} />
          <Route path="artist/:id" element={<ArtistDetailPage />} />
          <Route path="playlist/:id" element={<PlaylistDetailPage />} />

          {/* Fallback Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
