import type { Track, Artist, Album, Genre, Mood } from '../types/music';
import { CURATED_TRACKS, CURATED_ALBUMS, MOCK_ARTISTS } from '../data/mockTracks';

const CLIENT_ID = import.meta.env.VITE_JAMENDO_CLIENT_ID || 'e7beea4a';
const BASE_URL = 'https://api.jamendo.com/v3.0';

// Helper to map Jamendo genres to AURA genres
function mapToAuraGenre(rawGenre?: string): Genre {
  if (!rawGenre) return 'Ambient';
  const g = rawGenre.toLowerCase();
  if (g.includes('ambient') || g.includes('drone') || g.includes('meditation')) return 'Ambient';
  if (g.includes('lofi') || g.includes('lo-fi') || g.includes('hiphop') || g.includes('chill')) return 'Lo-Fi';
  if (g.includes('classical') || g.includes('piano') || g.includes('orchestral')) return 'Neo-Classical';
  if (g.includes('electronic') || g.includes('techno') || g.includes('synth')) return 'Electronic';
  if (g.includes('jazz') || g.includes('fusion') || g.includes('blues')) return 'Jazz Fusion';
  if (g.includes('minimal')) return 'Minimalism';
  if (g.includes('downtempo') || g.includes('trip') || g.includes('lounge')) return 'Downtempo';
  if (g.includes('postrock') || g.includes('post-rock')) return 'Post-Rock';
  return 'Ambient';
}

// Helper to map genres to mood spaces
function mapToAuraMood(genre: Genre): Mood {
  switch (genre) {
    case 'Ambient':
      return 'Meditative';
    case 'Lo-Fi':
      return 'Deep Focus';
    case 'Neo-Classical':
      return 'Melancholic';
    case 'Electronic':
      return 'Hypnotic';
    case 'Jazz Fusion':
      return 'Warm & Analog';
    case 'Post-Rock':
      return 'Ethereal';
    case 'Downtempo':
      return 'Late Night';
    default:
      return 'Urban Drift';
  }
}

// Helper to normalize a Jamendo track item
function normalizeTrack(item: any, index: number): Track {
  const genres = item.musicinfo?.tags?.genres || [];
  const genre = mapToAuraGenre(genres[0]);
  const mood = mapToAuraMood(genre);

  return {
    id: `jamendo-${item.id}`,
    title: item.name || 'Untitled Dispatch',
    artist: item.artist_name || 'Independent Artist',
    artistId: item.artist_id,
    album: item.album_name || 'Aura Archive',
    albumId: item.album_id,
    duration: item.duration || 180,
    audioUrl: item.audio,
    coverUrl: item.image || CURATED_TRACKS[index % CURATED_TRACKS.length].coverUrl,
    bpm: item.musicinfo?.speed === 'fast' ? 120 : item.musicinfo?.speed === 'medium' ? 90 : 70,
    musicalKey: ['D Minor', 'A Minor', 'F Major', 'C Major', 'G Major'][index % 5],
    genre,
    mood,
    tags: [...(item.musicinfo?.tags?.genres || []), ...(item.musicinfo?.tags?.instruments || [])].slice(0, 4),
    curatorNote: `Discovered from the Jamendo legal creative archives. Original composer: ${item.artist_name || 'unknown'}.`,
    storyQuote: `“An organic capture of resonance and timing in space.”`,
    releaseDate: item.releasedate || '2024-01-01',
    license: 'Creative Commons Free Streaming License',
    waveform: [15, 25, 45, 60, 80, 90, 85, 75, 60, 50, 40, 55, 75, 90, 95, 80, 60, 40, 25, 15],
    playsCount: item.stats?.playcount || 1200 + index * 50,
  };
}

// 1. Search tracks
export async function searchTracks(query: string): Promise<Track[]> {
  if (!query || query.trim() === '') {
    return CURATED_TRACKS;
  }

  try {
    const url = `${BASE_URL}/tracks/?client_id=${CLIENT_ID}&format=json&limit=20&namesearch=${encodeURIComponent(
      query
    )}&include=musicinfo+stats&audioformat=mp32`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);

    const data = await res.json();
    if (!data.results || data.results.length === 0) {
      return CURATED_TRACKS.filter(
        (t) =>
          t.title.toLowerCase().includes(query.toLowerCase()) ||
          t.artist.toLowerCase().includes(query.toLowerCase())
      );
    }

    return data.results.map((item: any, idx: number) => normalizeTrack(item, idx));
  } catch {
    return CURATED_TRACKS.filter(
      (t) =>
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.artist.toLowerCase().includes(query.toLowerCase())
    );
  }
}

// 2. Get featured tracks
export async function getFeaturedTracks(): Promise<Track[]> {
  try {
    const url = `${BASE_URL}/tracks/?client_id=${CLIENT_ID}&format=json&limit=10&featured=true&include=musicinfo+stats&audioformat=mp32`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);

    const data = await res.json();
    if (!data.results || data.results.length === 0) return CURATED_TRACKS;

    return data.results.map((item: any, idx: number) => normalizeTrack(item, idx));
  } catch {
    return CURATED_TRACKS;
  }
}

// 3. Get popular tracks
export async function getPopularTracks(): Promise<Track[]> {
  try {
    const url = `${BASE_URL}/tracks/?client_id=${CLIENT_ID}&format=json&limit=15&order=popularity_month&include=musicinfo+stats&audioformat=mp32`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);

    const data = await res.json();
    if (!data.results || data.results.length === 0) return CURATED_TRACKS;

    return data.results.map((item: any, idx: number) => normalizeTrack(item, idx));
  } catch {
    return CURATED_TRACKS;
  }
}

// 4. Get tracks by genre
export async function getTracksByGenre(genre: Genre): Promise<Track[]> {
  try {
    const searchGenre = genre.toLowerCase().replace(/[^a-z]/g, '');
    const url = `${BASE_URL}/tracks/?client_id=${CLIENT_ID}&format=json&limit=15&tags=${searchGenre}&include=musicinfo+stats&audioformat=mp32`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);

    const data = await res.json();
    if (!data.results || data.results.length === 0) {
      return CURATED_TRACKS.filter((t) => t.genre === genre);
    }

    return data.results.map((item: any, idx: number) => normalizeTrack(item, idx));
  } catch {
    return CURATED_TRACKS.filter((t) => t.genre === genre);
  }
}

// 5. Get Artist details
export async function getArtist(id: string): Promise<Artist | null> {
  const localArtist = MOCK_ARTISTS.find((a) => a.id === id || a.name.toLowerCase().replace(/\s+/g, '-') === id);
  if (localArtist) return localArtist;

  try {
    const cleanId = id.replace('artist-', '');
    const url = `${BASE_URL}/artists/?client_id=${CLIENT_ID}&format=json&id=${cleanId}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);

    const data = await res.json();
    if (!data.results || data.results.length === 0) return null;

    const artist = data.results[0];
    return {
      id: `artist-${artist.id}`,
      name: artist.name,
      bio: `Independent artist joining Jamendo archives on ${artist.joindate || '2020'}. Preserving CC distributions.`,
      artworkUrl: artist.image || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
      popularity: 70,
    };
  } catch {
    return MOCK_ARTISTS[0];
  }
}

// 6. Get Album details
export async function getAlbum(id: string): Promise<Album | null> {
  const localAlbum = CURATED_ALBUMS.find((a) => a.id === id);
  if (localAlbum) return localAlbum;

  try {
    const cleanId = id.replace('album-', '');
    const url = `${BASE_URL}/albums/?client_id=${CLIENT_ID}&format=json&id=${cleanId}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);

    const data = await res.json();
    if (!data.results || data.results.length === 0) return null;

    const album = data.results[0];

    // Fetch album tracks
    const tracksUrl = `${BASE_URL}/tracks/?client_id=${CLIENT_ID}&format=json&album_id=${album.id}&include=musicinfo`;
    const tracksRes = await fetch(tracksUrl);
    let tracks: Track[] = [];
    if (tracksRes.ok) {
      const tracksData = await tracksRes.json();
      tracks = (tracksData.results || []).map((item: any, idx: number) => normalizeTrack(item, idx));
    }

    return {
      id: `album-${album.id}`,
      title: album.name,
      artist: album.artist_name,
      year: album.releasedate ? album.releasedate.split('-')[0] : '2024',
      coverUrl: album.image || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
      genre: 'Ambient',
      curatorEssay: `An independent recording edition released on Jamendo under Creative Commons licensing.`,
      tracks,
    };
  } catch {
    return CURATED_ALBUMS[0];
  }
}
