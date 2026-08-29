import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Music, Disc, Compass } from 'lucide-react';
import { useLibraryStore } from '../store/useLibraryStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { TrackRow } from '../components/common/TrackRow';
import { AlbumCard } from '../components/music/AlbumCard';
import { ArtistCard } from '../components/music/ArtistCard';
import { TactileButton } from '../components/ui/TactileButton';
import { EmptyState } from '../components/ui/EmptyState';

export const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { favoriteTracks, favoriteAlbums, favoriteArtists } = useLibraryStore();
  const { playTrack } = usePlayerStore();
  const [activeTab, setActiveTab] = useState<'tracks' | 'albums' | 'artists'>('tracks');

  const handlePlayTracks = () => {
    if (favoriteTracks.length > 0) {
      playTrack(favoriteTracks[0], favoriteTracks);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-aura-800/80 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-aura-accent">
            Curated Library
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-aura-100 font-normal mt-1">
            Favorites
          </h1>
          <p className="text-sm text-aura-400 font-sans mt-2">
            Your custom catalog of acoustic dispatches, records, and spotlights.
          </p>
        </div>

        {activeTab === 'tracks' && favoriteTracks.length > 0 && (
          <TactileButton
            variant="primary"
            size="md"
            onClick={handlePlayTracks}
            className="gap-2 shrink-0 shadow-aura-subtle"
          >
            <Play className="w-4 h-4 fill-current ml-0.5" />
            Play All ({favoriteTracks.length})
          </TactileButton>
        )}
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 border-b border-aura-800 pb-4 select-none overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('tracks')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
            activeTab === 'tracks'
              ? 'border-aura-accent bg-aura-accent/10 text-aura-accent font-semibold'
              : 'border-aura-800 text-aura-400 hover:text-aura-100'
          }`}
        >
          <Music className="w-3.5 h-3.5" />
          <span>Tracks ({favoriteTracks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('albums')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
            activeTab === 'albums'
              ? 'border-aura-accent bg-aura-accent/10 text-aura-accent font-semibold'
              : 'border-aura-800 text-aura-400 hover:text-aura-100'
          }`}
        >
          <Disc className="w-3.5 h-3.5" />
          <span>Albums ({favoriteAlbums.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('artists')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
            activeTab === 'artists'
              ? 'border-aura-accent bg-aura-accent/10 text-aura-accent font-semibold'
              : 'border-aura-800 text-aura-400 hover:text-aura-100'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Artists ({favoriteArtists.length})</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="animate-in fade-in-30 duration-200">
        {activeTab === 'tracks' && (
          favoriteTracks.length === 0 ? (
            <EmptyState
              title="No favorite tracks"
              description="Save tracks by clicking the heart icon on any composition grid or listing."
            />
          ) : (
            <div className="p-2 rounded-2xl bg-aura-850/40 border border-aura-800 divide-y divide-aura-800/40">
              {favoriteTracks.map((track, idx) => (
                <TrackRow
                  key={track.id}
                  track={track}
                  index={idx}
                  playlistContext={favoriteTracks}
                />
              ))}
            </div>
          )
        )}

        {activeTab === 'albums' && (
          favoriteAlbums.length === 0 ? (
            <EmptyState
              title="No favorite albums"
              description="Save compilation sound editions by clicking the heart button on their album pages."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {favoriteAlbums.map((album) => (
                <AlbumCard
                  key={album.id}
                  album={album}
                  onClick={() => navigate(`/album/${album.id}`)}
                />
              ))}
            </div>
          )
        )}

        {activeTab === 'artists' && (
          favoriteArtists.length === 0 ? (
            <EmptyState
              title="No favorite composers"
              description="Keep track of independent sound sculptors by liking them on their artist profiles."
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {favoriteArtists.map((artist) => (
                <ArtistCard
                  key={artist.id}
                  name={artist.name}
                  artworkUrl={artist.artworkUrl}
                  genre={artist.genre}
                  onClick={() => navigate(`/artist/${artist.id}`)}
                />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
