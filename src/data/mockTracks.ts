import type { Artist } from '../types/music';
import { CURATED_TRACKS, CURATED_ALBUMS } from '../services/mockCatalog';

export { CURATED_TRACKS, CURATED_ALBUMS };

// Realistic Mock Artists
export const MOCK_ARTISTS: Artist[] = [
  {
    id: 'artist-holloway',
    name: 'Holloway & The Monolith',
    bio: 'Independent modular synthesis researcher and ambient architect based in Sheffield. Holloway pairs tape loops with field recordings of abandoned industrial architecture.',
    location: 'Sheffield, UK',
    genre: 'Ambient',
    artworkUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    tracksCount: 6,
    popularity: 84,
  },
  {
    id: 'artist-kaito',
    name: 'Kaito Moriyama',
    bio: 'Pianist and sound sculptor Kaito Moriyama records dusty keys, lo-fi textures, and rain foley in his quiet studio in Yoyogi, Tokyo.',
    location: 'Tokyo, Japan',
    genre: 'Lo-Fi',
    artworkUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    tracksCount: 4,
    popularity: 91,
  },
  {
    id: 'artist-elena',
    name: 'Elena Rostova',
    bio: 'Chamber musician and experimental neo-classical composer Elena Rostova performs acoustic string arrangements paired with sub-bass drone synthesis.',
    location: 'Tampere, Finland',
    genre: 'Neo-Classical',
    artworkUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=800&auto=format&fit=crop',
    tracksCount: 5,
    popularity: 76,
  },
];
