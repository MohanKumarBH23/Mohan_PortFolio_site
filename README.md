# MOHAN KUMAR B.H | AI & Machine Learning Engineering Portfolio

[![Zero Runtime Dependencies](https://img.shields.io/badge/Runtime%20Dependencies-Zero%20(Pure%20ESM)-brightgreen?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
[![Tests](https://img.shields.io/badge/Tests-Node%20Test%20Runner-blue?style=flat-square)](tests/)
[![GitHub](https://img.shields.io/badge/GitHub-MohanKumarBH23-181717?style=flat-square&logo=github)](https://github.com/MohanKumarBH23)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-mohan--kumar--bh--mk23-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/mohan-kumar-bh-mk23)

An editorial, modular, and resilient personal portfolio website engineered for **Mohan Kumar B.H** — B.Tech CSE (AI & ML) graduate from **Sai Vidya Institute of Technology** (CGPA: 8.80 / 10.0), **IEEE ICNPCV 2026** published author, and AI Intern at **Digitaltransols AI Private Limited**.

Built with **zero external runtime dependencies** using native ES6+ Modules, modular CSS layers, a centralized reactive state store, separated pure business logic services, a resilient retry-capable API client, and enterprise edge security headers.

---

## Table of Contents

- [Key Engineering Features](#key-engineering-features)
- [Peer-Reviewed Publication (IEEE ICNPCV 2026)](#peer-reviewed-publication-ieee-icnpcv-2026)
- [Project Structure](#project-structure)
- [Architecture & State Management](#architecture--state-management)
- [Environment Configuration](#environment-configuration)
- [Quickstart, Build & Testing](#quickstart-build--testing)
- [Production Deployment](#production-deployment)
- [Further Documentation](#further-documentation)
- [Author](#author)

---

## Key Engineering Features

1. **Neo Kinpaku & Navy/Cream Dual-Theme Design System**:
   - **Dark Mineral Lacquer** (Kinpaku Gold + Verdigris Patina) and **Navy, Cream & Coral** light theme.
   - Pre-paint theme initialization (`src/bootstrap/themeInit.js`) prevents Flash of Unstyled Content (FOUC) without inline `<script>` tags, enabling a strict `script-src 'self'` Content Security Policy.
2. **Modular Reusable UI Components**:
   - Design primitives (`Icon`, `Button`, `Badge`, `SectionHeader`, `Modal`, `ToastContainer`) composed cleanly into domain sections (`Navbar`, `HeroSection`, `AboutSection`, `SkillsSection`, `PublicationsSection`, `ProjectsSection`, `ProjectDetailModal`, `PdfViewerModal`, `TimelineSection`, `ContactSection`, `Footer`).
3. **Centralized Reactive State Store**:
   - Redux-style immutable store (`src/state/`) managing `theme`, `navigation`, `modal`, `contact`, and `toasts` slices with fine-grained `store.select(...)` subscriptions and dev logger middleware.
4. **Separated Business Logic & Scalable API Layer**:
   - Pure, DOM-free business services (`src/services/`) for validation, rate-limiting, theme resolution, project lookup, scroll-spy math, and clipboard operations.
   - Resilient `ApiClient` (`src/api/client.js`) featuring `AbortController` timeouts, exponential backoff retries with jitter, request/response interceptors, and a centralized endpoint registry (`src/api/endpoints.js`).
5. **Comprehensive Error Handling & Security**:
   - Typed `AppError` hierarchy (`ConfigError`, `ValidationError`, `RateLimitError`, `NetworkError`, `TimeoutError`, `ApiError`, `NotFoundError`), global error boundaries, per-section `safeRender` fallback cards, `sanitizeUrl()` link validation, XSS-escaped Apps Script HTML emails, honeypot bot trap, and client-side rate limiting.

---

## Peer-Reviewed Publication (IEEE ICNPCV 2026)

- **Paper Title**: *Intelli-Eye: A Holistic Deep-Learning Architecture for Predictive Threat Analysis and Intelligent Alert Automation*
- **Conference**: 2026 International Conference on Natural Language Processing and Computer Vision (IEEE ICNPCV), Bangalore Section (July 17–18, 2026)
- **IEEE Catalog / ISBN**: `CFP26CV9-ART` &bull; `979-8-3315-9284-4`
- **Document**: [`assets/documents/intelli-eye-paper.pdf`](assets/documents/intelli-eye-paper.pdf)

---

## Project Structure

```text
Mohan PF/
├── index.html                        # Clean semantic entry shell (zero inline JS/handlers)
├── package.json                      # Scripts: start, dev, env:build, build, test
├── .env.example                      # Documented environment variable template
├── vercel.json / netlify.toml        # Production edge security headers & caching rules
├── _headers                          # Static host security headers
├── site.webmanifest                  # PWA manifest
├── robots.txt / sitemap.xml          # Search crawler configuration
│
├── api/
│   └── google-apps-script/
│       └── Code.gs                   # Serverless Apps Script handler using Script Properties
│
├── assets/
│   ├── documents/
│   │   ├── intelli-eye-paper.pdf     # IEEE ICNPCV 2026 research paper
│   │   └── Mohan_Resume.pdf          # Curriculum Vitae
│   └── images/
│       ├── ai_chess_board.png        # PyChess GUI preview
│       ├── maze_solution.png         # Maze-Runner BFS traversal preview
│       └── mohan-avatar.jpg          # Author headshot
│
├── config/
│   └── env.defaults.json             # Non-secret environment profile defaults
│
├── docs/
│   ├── ARCHITECTURE.md               # Layered architecture, state flow & error boundaries
│   ├── API.md                        # Scalable API client, endpoint catalog & webhook contract
│   ├── GOOGLE_SHEETS_SETUP.md        # Step-by-step Apps Script & Script Properties setup
│   ├── DESIGN.md                     # Visual tokens & anti-pattern rules
│   ├── PRODUCT.md                    # Portfolio product positioning
│   └── design-system/MASTER.md       # Extended design reference
│
├── scripts/
│   ├── build-dist.mjs                # Stages deployable static files into dist/
│   └── generate-env.mjs              # Zero-dependency .env -> runtimeEnv.js generator
│
├── src/
│   ├── main.js                       # Application bootstrap & composition root
│   ├── bootstrap/themeInit.js        # Pre-paint theme initializer
│   ├── config/                       # Validated frozen config & generated runtimeEnv
│   ├── core/                         # Errors, logger, safe storage, sanitizer, DOM helpers
│   ├── state/                        # Store engine, actions, reducers, selectors
│   ├── api/                          # ApiClient, endpoint registry, repositories
│   ├── services/                     # Pure business logic services (zero DOM coupling)
│   ├── data/                         # Single-source-of-truth domain datasets
│   ├── components/
│   │   ├── ui/                       # Reusable UI primitives (Icon, Button, Badge, Modal, Toast)
│   │   └── sections/                 # Portfolio section & modal components
│   └── styles/                       # Modular CSS layers (tokens, base, components, layout, sections)
│
└── tests/                            # Automated unit & integration tests (node --test)
    ├── api.test.mjs
    ├── config.test.mjs
    ├── services.test.mjs
    └── store.test.mjs
```

---

## Architecture & State Management

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and [`docs/API.md`](docs/API.md) for detailed diagrams, dependency rules, store slices, and instructions for adding new API endpoints.

---

## Environment Configuration

All endpoints, timeouts, rate-limit cooldowns, and storage keys are decoupled from application code:

1. Copy `.env.example` to `.env` (`.env` is gitignored).
2. Adjust values such as `APP_ENV`, `GOOGLE_APPS_SCRIPT_URL`, `FORMSUBMIT_ENDPOINT`, `API_BASE_URL`, or `API_TIMEOUT_MS`.
3. Regenerate browser runtime config:
   ```bash
   npm run env:build
   ```

---

## Quickstart, Build & Testing

### Local Development Server

Because the application uses native ES Modules (`<script type="module">`), serve it over HTTP rather than opening `file://`:

```bash
# Using Node.js (recommended)
npm run dev

# Or using Python
npm run serve:py
```

### Build Runtime Config & Run Test Suite

```bash
# Regenerate runtime environment config & build static dist/
npm run env:build
npm run build

# Run automated unit & integration tests (Node.js native test runner)
npm test
```

---

## Production Deployment

- **Vercel**: Import repository directly; [`vercel.json`](vercel.json) sets `framework: null`, skips unnecessary `npm install` (`installCommand: ""`), builds the clean static output via `node scripts/build-dist.mjs`, sets `outputDirectory` to `dist`, and enforces strict CSP, HSTS, and long-lived asset caching.
- **Netlify**: [`netlify.toml`](netlify.toml) automatically runs `npm run env:build`, publishes `.`, and enforces edge security headers.
- **GitHub Pages**: Serve directly from `main` `/ (root)` after committing generated `src/config/runtimeEnv.js` (keeping secrets out of git).

---

## Further Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — Layer boundaries, state slices, error handling
- [`docs/API.md`](docs/API.md) — `ApiClient`, endpoint registry, repository pattern, Apps Script contract
- [`docs/GOOGLE_SHEETS_SETUP.md`](docs/GOOGLE_SHEETS_SETUP.md) — Webhook & Script Properties guide

---

## Author

**Mohan Kumar B.H** &bull; *AI & Machine Learning Engineer*  
- **Degree**: B.Tech in Computer Science and Engineering (AIML), Sai Vidya Institute of Technology (CGPA: 8.80 / 10.0)
- **Experience**: AI Intern at Digitaltransols AI Private Limited, Bangalore
- **Phone**: [+91 9980507072](tel:+919980507072)
- **Email**: [mohankumarbh007@gmail.com](mailto:mohankumarbh007@gmail.com)
- **LinkedIn**: [linkedin.com/in/mohan-kumar-bh-mk23](https://www.linkedin.com/in/mohan-kumar-bh-mk23)
- **GitHub**: [github.com/MohanKumarBH23](https://github.com/MohanKumarBH23)
