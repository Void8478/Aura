import { CURATED_TRACKS } from '../services/mockCatalog';
import type { Crate } from '../types/music';

export * from '../services/mockCatalog';

export const MOCK_CRATES: Crate[] = [
  {
    id: 'crate-midnight',
    title: 'Midnight Driving & Tape Loops',
    description: 'Analog synthesizers, rain-slicked windshields, and long highway journeys.',
    createdAt: '2025-01-10',
    colorTag: '#e07a5f',
    tracks: [CURATED_TRACKS[0], CURATED_TRACKS[4], CURATED_TRACKS[8]],
    coverUrl: CURATED_TRACKS[4].coverUrl,
  },
  {
    id: 'crate-focus',
    title: 'Felt Pianos & Heavy Focus',
    description: 'Acoustic minimalism for code architectures and deep writing sessions.',
    createdAt: '2025-02-01',
    colorTag: '#d4a373',
    tracks: [CURATED_TRACKS[1], CURATED_TRACKS[6], CURATED_TRACKS[2]],
    coverUrl: CURATED_TRACKS[1].coverUrl,
  },
];
