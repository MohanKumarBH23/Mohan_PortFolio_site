# MOHAN KUMAR B.H | AI & Machine Learning Engineering Portfolio

[![Tests](https://img.shields.io/badge/Tests-Node%20Test%20Runner-blue?style=flat-square)](tests/)
[![GitHub](https://img.shields.io/badge/GitHub-MohanKumarBH23-181717?style=flat-square&logo=github)](https://github.com/MohanKumarBH23)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-mohan--kumar--bh--mk23-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/mohan-kumar-bh-mk23)

An editorial, modular, and resilient personal portfolio website engineered for **Mohan Kumar B.H** — B.Tech CSE (AI & ML) graduate from **Sai Vidya Institute of Technology** (CGPA: 8.80 / 10.0), **IEEE ICNPCV 2026** published author, and AI Intern at **Digitaltransols AI Private Limited**.

Built with **React 19, TypeScript, Vite, Tailwind CSS v4, and Motion Primitives** backed by separated pure business logic services, a resilient retry-capable API client, self-hosted typography, and strict Vercel edge security headers.

---

## Key Engineering Features

1. **The Centre-Rail Monograph Design System** ([`docs/DESIGN.md`](docs/DESIGN.md)):
   - Editorial Bone (`#F8F5E8`) and Recessed Vellum Fold (`#F3EEE3`) surfaces paired with Graphite Carbon Ink (`#0F100F`), Archival Slate Olive (`#5C5B4F`), and Rubric Vermilion (`#B3371E`).
   - Self-hosted fonts (`Newsreader`, `Petrona Variable`, `IBM Plex Sans`, `IBM Plex Mono`) bundled into `dist/` for deterministic CSP compliance.
2. **Modular React Components & Motion Primitives**:
   - Interactive workbench hero (`HeroWorkbench`), collapsible academic ledger (`Disclosure`), filterable capability matrix (`AnimatedBackground`, `SlidingNumber`), IEEE metrics board, 6-project case studies (`ProjectModal` with `TransitionPanel`), and inline `PdfViewerModal`.
3. **Separated Business Logic & Scalable API Layer**:
   - Pure, DOM-free business services (`src/services/`) bridged through `usePortfolioServices` and `useModalLifecycle` hooks.
   - Resilient `ApiClient` (`src/api/client.js`) featuring `AbortController` timeouts, exponential backoff retries with jitter, request/response interceptors, and centralized endpoints (`src/api/endpoints.js`).
4. **Comprehensive Error Handling & Security**:
   - Typed `AppError` hierarchy (`ConfigError`, `ValidationError`, `RateLimitError`, `NetworkError`, `TimeoutError`, `ApiError`, `NotFoundError`), `sanitizeUrl()` link validation, XSS-escaped Apps Script HTML emails, honeypot bot trap, and client-side rate limiting.

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
├── index.html                        # Vite entry shell (zero inline executable JS)
├── package.json                      # Scripts: dev, env:build, build, test, preview
├── tsconfig.json                     # Strict TypeScript compiler configuration
├── vite.config.ts                    # Vite + React + Tailwind v4 configuration
├── .env.example                      # Documented environment variable template
├── vercel.json / _headers            # Production edge security headers & caching rules
├── site.webmanifest                  # PWA manifest
├── robots.txt / sitemap.xml          # Search crawler configuration
│
├── api/google-apps-script/Code.gs    # Serverless Apps Script handler using Script Properties
├── assets/
│   ├── documents/                    # IEEE paper PDF & Resume PDF
│   ├── images/                       # Project previews & favicon portrait
│   └── plates/portrait-plate.png     # Hero portrait specimen plate
├── config/env.defaults.json          # Non-secret environment profile defaults
├── docs/
│   ├── ARCHITECTURE.md               # Layered architecture & error handling
│   ├── API.md                        # ApiClient, endpoint registry & Apps Script contract
│   ├── DESIGN.md                     # Centre-Rail Monograph design system specification
│   ├── GOOGLE_SHEETS_SETUP.md        # Webhook & Script Properties guide
│   └── PRODUCT.md                    # Portfolio product positioning
├── scripts/
│   ├── copy-static.mjs               # Copies assets/, manifest, headers & SEO files into dist/
│   └── generate-env.mjs              # Zero-dependency .env -> runtimeEnv.js generator
├── src/
│   ├── main.tsx / App.tsx            # React mount & application shell
│   ├── config/                       # Validated frozen config & generated runtimeEnv
│   ├── core/                         # Errors, logger, safe storage, sanitizer
│   ├── api/                          # ApiClient, endpoint registry, contactRepository
│   ├── services/                     # Pure business logic services
│   ├── hooks/                        # usePortfolioServices & useModalLifecycle
│   ├── data/                         # Single-source-of-truth domain datasets
│   ├── components/                   # Hero, Sections, Modals, Common & Motion Primitives
│   └── styles/app.css                # Tailwind v4 entry, tokens & base rules
└── tests/                            # Automated unit, config, API & bundle tests (node --test)
```

---

## Quickstart, Build & Testing

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Typecheck
npx tsc --noEmit

# Generate runtime env config, build Vite bundle & stage static assets into dist/
npm run build

# Preview production bundle locally
npm run preview

# Run automated tests (Node.js native test runner)
npm test
```

---

## Production Deployment

- **Vercel**: [`vercel.json`](vercel.json) runs `npm install` + `npm run build`, publishes `dist/`, enforces strict CSP (`frame-ancestors 'self'` for inline PDF preview), HSTS, and long-lived asset caching headers.

---

## Author

**Mohan Kumar B.H** &bull; *AI & Machine Learning Engineer*
- **Degree**: B.Tech in Computer Science and Engineering (AIML), Sai Vidya Institute of Technology (CGPA: 8.80 / 10.0)
- **Experience**: AI Intern at Digitaltransols AI Private Limited, Bangalore
- **Phone**: [+91 9980507072](tel:+919980507072)
- **Email**: [mohankumarbh007@gmail.com](mailto:mohankumarbh007@gmail.com)
- **LinkedIn**: [linkedin.com/in/mohan-kumar-bh-mk23](https://www.linkedin.com/in/mohan-kumar-bh-mk23)
- **GitHub**: [github.com/MohanKumarBH23](https://github.com/MohanKumarBH23)
