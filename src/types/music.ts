export type Genre =
  | 'Ambient'
  | 'Lo-Fi'
  | 'Neo-Classical'
  | 'Electronic'
  | 'Jazz Fusion'
  | 'Indie'
  | 'Minimalism'
  | 'Downtempo'
  | 'Post-Rock'
  | 'Modular';

export type Mood =
  | 'Late Night'
  | 'Deep Focus'
  | 'Hypnotic'
  | 'Melancholic'
  | 'Ethereal'
  | 'Warm & Analog'
  | 'Meditative'
  | 'Urban Drift';

export interface Track {
  id: string;
  title: string;
  artist: string;
  artistId?: string;
  album: string;
  albumId?: string;
  duration: number; // in seconds
  audioUrl: string;
  coverUrl: string;
  bpm?: number;
  musicalKey?: string;
  genre: Genre;
  mood: Mood;
  tags: string[];
  curatorNote?: string;
  storyQuote?: string;
  releaseDate: string;
  license?: string;
  waveform?: number[];
  playsCount?: number;
  isFavorite?: boolean;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  year: string;
  coverUrl: string;
  genre: Genre;
  curatorEssay: string;
  label?: string;
  tracks: Track[];
  bpmRange?: string;
  totalDuration?: string;
  recordingLocation?: string;
}

export interface CuratorIssue {
  id: string;
  issueNumber: number;
  seasonYear: string;
  title: string;
  subtitle: string;
  curatorName: string;
  curatorRole: string;
  curatorAvatar?: string;
  leadArticle: string;
  coverHeroUrl: string;
  featuredTracks: Track[];
  spotlightArtist: {
    name: string;
    bio: string;
    location: string;
    quote: string;
    artworkUrl: string;
  };
  sonicThemes: {
    title: string;
    description: string;
    trackIds: string[];
  }[];
}

export interface Crate {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  tracks: Track[];
  coverUrl?: string;
  isDefault?: boolean;
  colorTag?: string;
}

export type RepeatMode = 'off' | 'all' | 'one';

export interface RadioStation {
  id: string;
  name: string;
  tagline: string;
  description: string;
  mood: Mood;
  coverUrl: string;
  curator: string;
  frequencies: string;
  tracks: Track[];
}
