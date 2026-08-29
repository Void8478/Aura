# AURA — Independent Music Discovery & Audio Journal

A modern, editorial music streaming web application crafted with a focus on tactile interaction, typography, and acoustic soundscapes.

## Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite 8](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Audio**: HTML5 Audio API & Web Audio API (real-time FFT frequency analyser)
- **Catalog**: Jamendo Music Open API & Curated Creative Commons audio archive

---

## Project Structure

```
AURA/
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── assets/       # Static media assets & icons
    ├── components/   # Reusable UI primitives & player components
    ├── data/         # Mock data & curated music catalog
    ├── hooks/        # Custom React hooks (audio, shortcuts, storage)
    ├── layouts/      # Application layout shells & navigation
    ├── pages/        # Route page components
    ├── services/     # AudioService engine & Jamendo API integration
    ├── store/        # Zustand stores (playback, queue, library)
    ├── types/        # TypeScript data models & interfaces
    └── utils/        # Formatters & helper functions
```

---

## Initial Routes

| Route | Page | Description |
| :--- | :--- | :--- |
| `/` | `HomePage` | Magazine issue masthead, curator dispatches & featured tracks |
| `/discover` | `DiscoverPage` | Sonic catalog exploration by genre, mood, and tempo |
| `/search` | `SearchPage` | Real-time catalog search & query filter palette |
| `/library` | `LibraryPage` | User crates, playlists, and personal listening archives |
| `/favorites` | `FavoritesPage` | Starred recordings with batch playback |
| `/recent` | `RecentPage` | Listening timeline history |
| `/about` | `AboutPage` | Publication colophon, audio telemetry specs, and philosophy |
| `/album/:id` | `AlbumDetailPage` | Full album liner notes, tracklist, and recording notes |
| `/artist/:id` | `ArtistDetailPage` | Artist profile, bio, discography, and acoustic specs |
| `/playlist/:id` | `PlaylistDetailPage` | Curated playlist / crate detail view |

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```
