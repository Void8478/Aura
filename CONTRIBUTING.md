# Contributing to AURA 🎧

Thank you for your interest in contributing to **AURA**! We welcome contributions of all kinds—from refining tactile CSS micro-animations, expanding acoustic filtering algorithms, optimizing Web Audio memory usage, to improving documentation and accessibility.

Please take a moment to review this document to ensure a smooth collaboration process.

---

## 📜 Code of Conduct

By participating in this project, you agree to abide by the standards outlined in our [Code of Conduct](./CODE_OF_CONDUCT.md). Please treat all contributors and maintainers with kindness and respect.

---

## 🛠️ Development Setup

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Node.js**: `v18.0.0` or later (tested on Node `20.x` & `22.x`)
- **npm**: `v9.0.0` or later (or `pnpm` / `yarn`)
- **Git**: Latest version

### 2. Fork and Clone
```bash
# 1. Fork the repository on GitHub: https://github.com/Void8478/Aura/fork
# 2. Clone your fork locally
git clone https://github.com/<your-username>/Aura.git
cd Aura
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Setup Environment Variables
```bash
cp .env.example .env
```
*(The repository is pre-configured with a public Jamendo Client ID so the music catalog works immediately out of the box).*

### 5. Launch Development Server
```bash
npm run dev
```
Visit `http://localhost:5173/` in your browser.

---

## 🌿 Branching Strategy

Always create a dedicated feature branch from `main`:

```bash
git checkout -b <type>/<short-description>
```

### Branch Types:
- `feat/`: New feature or user-facing capability (e.g., `feat/tape-saturation-filter`)
- `fix/`: Bug fix (e.g., `fix/visualizer-canvas-resize`)
- `perf/`: Performance optimization (e.g., `perf/fft-buffer-recycling`)
- `docs/`: Documentation additions or revisions (e.g., `docs/keyboard-shortcuts-table`)
- `refactor/`: Code reorganization without functional changes (e.g., `refactor/audio-context-hook`)
- `style/`: Visual or design system updates (e.g., `style/tactile-button-shadows`)

---

## 📝 Commit Conventions

AURA adheres to the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```text
<type>(<scope>): <short description in present tense>

[optional body explaining context and motivation]
```

### Examples:
- `feat(audio): add analog tape saturation curve to deck visualizer`
- `fix(player): resolve audio buffer race condition during rapid track skips`
- `docs(readme): add detailed system architecture diagram`
- `perf(bundle): split heavy detail routes with React.lazy`

---

## 🧪 Quality Standards & Verification

Before committing your changes or opening a pull request, you **must** run the local verification checks:

### 1. Static Analysis (Oxlint)
```bash
npm run lint
```
Fix any reported errors or warnings.

### 2. TypeScript & Production Build
```bash
npm run build
```
This runs `tsc -b` for strict type verification followed by Vite's production bundling.

### 3. Preview Production Bundle
```bash
npm run preview
```
Verify that the compiled application functions identically to development mode.

---

## 🎨 Architectural Principles to Respect

When adding new code to AURA:
1. **Offline-First & Resilient**: All views must gracefully handle network failures or API rate limits using `src/services/mockCatalog.ts`.
2. **Audio Singleton Integrity**: Never instantiate raw `<audio>` elements or independent `AudioContext` instances inside React components. All audio routing must flow through `src/services/audioService.ts`.
3. **Tactile Aesthetic Consistency**: Respect the design system tokens defined in `src/index.css` (e.g., `#0e0e11` obsidian background, `#e07a5f` terracotta accent, Fraunces serif headings, JetBrains Mono telemetry).
4. **Data Sovereignty**: Never introduce third-party trackers, analytics beacons, or remote logging services. User data belongs strictly in local `localStorage`.

---

## 🚀 Submitting a Pull Request

1. Push your branch to your fork:
   ```bash
   git push origin <type>/<short-description>
   ```
2. Open a Pull Request against the `main` branch of [Void8478/Aura](https://github.com/Void8478/Aura).
3. Fill out the PR template completely:
   - Describe what problem this PR solves.
   - Explain how you tested it across desktop and responsive viewports.
   - Attach screenshots or screen recordings for UI/visual changes.
4. Ensure CI checks pass.

Thank you for building AURA with us! 🎧
