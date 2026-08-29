import type { Track, Genre, Mood } from '../types/music';
import { CURATED_TRACKS } from './mockCatalog';

// Public free Jamendo Client ID for legal music access
const JAMENDO_CLIENT_ID = 'e7beea4a';
const BASE_URL = 'https://api.jamendo.com/v3.0';

interface JamendoTrackResponse {
  id: string;
  name: string;
  duration: number;
  artist_name: string;
  album_name: string;
  image: string;
  audio: string;
  audiodownload?: string;
  releasedate?: string;
  musicinfo?: {
    vocalinstrumental?: string;
    speed?: string;
    tags?: {
      genres?: string[];
      instruments?: string[];
      vartags?: string[];
    };
  };
}

export async function searchJamendoTracks(query: string, limit = 15): Promise<Track[]> {
  if (!query || query.trim() === '') {
    return CURATED_TRACKS;
  }

  try {
    const url = `${BASE_URL}/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=${limit}&namesearch=${encodeURIComponent(
      query
    )}&include=musicinfo&audioformat=mp32`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Jamendo API returned ${res.status}`);
    }

    const data = await res.json();
    if (!data.results || data.results.length === 0) {
      return filterLocalCatalog(query);
    }

    return data.results.map((item: JamendoTrackResponse, index: number) => {
      const genres = item.musicinfo?.tags?.genres || [];
      const genre = mapToAuraGenre(genres[0]);
      const mood = mapToAuraMood(genre);

      return {
        id: `jamendo-${item.id}`,
        title: item.name || 'Untitled Dispatch',
        artist: item.artist_name || 'Independent Artist',
        album: item.album_name || 'Aura Sound Editions',
        duration: item.duration || 180,
        audioUrl: item.audio,
        coverUrl: item.image || CURATED_TRACKS[index % CURATED_TRACKS.length].coverUrl,
        bpm: item.musicinfo?.speed === 'fast' ? 120 : item.musicinfo?.speed === 'medium' ? 90 : 70,
        musicalKey: ['C Major', 'A Minor', 'F# Minor', 'D Minor', 'G Major'][index % 5],
        genre,
        mood,
        tags: [...(item.musicinfo?.tags?.genres || []), ...(item.musicinfo?.tags?.instruments || [])].slice(0, 4),
        curatorNote: `Discovered through the Jamendo open catalog. Free creative license.`,
        storyQuote: `“Sound recorded in open air with independent devotion.”`,
        releaseDate: item.releasedate || '2024-01-01',
        license: 'Creative Commons (Jamendo Free License)',
        waveform: [20, 35, 60, 80, 75, 90, 85, 65, 50, 70, 85, 95, 80, 60, 45, 30, 20, 15, 10, 8],
      };
    });
  } catch {
    return filterLocalCatalog(query);
  }
}

function filterLocalCatalog(query: string): Track[] {
  const q = query.toLowerCase();
  const matched = CURATED_TRACKS.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.artist.toLowerCase().includes(q) ||
      t.album.toLowerCase().includes(q) ||
      t.genre.toLowerCase().includes(q) ||
      t.mood.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.toLowerCase().includes(q))
  );

  return matched.length > 0 ? matched : CURATED_TRACKS;
}

function mapToAuraGenre(rawGenre?: string): Genre {
  if (!rawGenre) return 'Ambient';
  const g = rawGenre.toLowerCase();
  if (g.includes('ambient') || g.includes('chillout') || g.includes('drone')) return 'Ambient';
  if (g.includes('lofi') || g.includes('lo-fi') || g.includes('chillhop')) return 'Lo-Fi';
  if (g.includes('classical') || g.includes('piano') || g.includes('strings')) return 'Neo-Classical';
  if (g.includes('electronic') || g.includes('synth') || g.includes('techno')) return 'Electronic';
  if (g.includes('jazz') || g.includes('fusion') || g.includes('rhodes')) return 'Jazz Fusion';
  if (g.includes('rock') || g.includes('postrock') || g.includes('indie')) return 'Indie';
  if (g.includes('minimal')) return 'Minimalism';
  return 'Downtempo';
}

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
    case 'Indie':
      return 'Urban Drift';
    default:
      return 'Late Night';
  }
}
