# Security Policy 🔐

## Supported Versions

Security updates are actively maintained on the latest release of the `main` branch.

| Version | Supported          |
| ------- | ------------------ |
| `main`  | :white_check_mark: |
| `< 1.0` | :white_check_mark: |

---

## Reporting a Vulnerability

We take the security of AURA and the privacy of its users seriously. If you discover a security vulnerability or privacy flaw:

1. **Do NOT open a public GitHub issue** to report suspected vulnerabilities.
2. Please report the issue privately by contacting the maintainer via GitHub Security Advisories at:
   `https://github.com/Void8478/Aura/security/advisories/new`
3. Include detailed reproduction steps, browser/OS versions, and potential impact.
4. We will acknowledge your report within 48 hours and work with you to coordinate a responsible disclosure and patch.

---

## Security & Privacy Architecture Principles

AURA is intentionally designed with an offline-first, privacy-respecting client architecture:

- **Zero Analytics or Telemetry**: AURA contains no external tracking scripts, cookies, analytics SDKs, or behavioral monitoring.
- **Client-Side Data Sovereignty**: All user crates, personal listening journal notes, liked tracks, and playback history are stored exclusively on the user's device in browser `localStorage` (`aura_library_v2`). No user data is transmitted to remote servers.
- **No Secret Credentials in Client Code**: All environment variables exposed to Vite must be prefixed with `VITE_`. No backend database connection strings or private signing keys are packaged into the client distribution.
- **CORS Audio Handling**: Remote media streams are loaded using `crossOrigin = "anonymous"`. If a remote host enforces strict CORS policies preventing Web Audio buffer inspection, AURA degrades gracefully to avoid exposing internal audio buffers.
