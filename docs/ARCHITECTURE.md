# Portfolio Architecture Guide

## Overview

The Mohan Kumar B.H Portfolio follows a **Modular Layered React + TypeScript + Vite Architecture** that separates UI presentation, reusable hooks, domain services, API transport, and validated environment configuration.

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                          UI Presentation Layer                          │
│  src/components/hero/*      (HeroWorkbench)                             │
│  src/components/sections/*  (About, Skills, Publications, Projects,     │
│                              Experience, Contact)                       │
│  src/components/modals/*    (ProjectModal, PdfViewerModal)              │
│  src/components/common/*    (SectionHeading, ToastBanner)               │
│  src/components/motion-primitives/* (TextEffect, TextMorph, Sliding... )│
└──────────────────────────┬───────────────────────────┬──────────────────┘
                           │ calls actions             │ reads hook state
                           ▼                           │
┌──────────────────────────────────────┐               │
│   Application Hooks & State Layer    │───────────────┘
│  src/hooks/usePortfolioServices.ts   │
│  src/hooks/useModalLifecycle.ts      │
└──────────────────────────┬───────────┘
                           │ orchestrates domain services
                           ▼
┌──────────────────────────────────────┐
│      Pure Business Logic Layer       │
│  src/services/{contact,project,      │
│                navigation,clipboard} │
│  (Zero DOM access; unit-tested)      │
└──────────────────────────┬───────────┘
                           │ calls repositories
                           ▼
┌──────────────────────────────────────┐
│        Scalable API Layer            │
│  src/api/{client,endpoints,          │
│           repositories/contactRepo}  │
└──────────────────────────┬───────────┘
                           │ reads validated config & helpers
                           ▼
┌──────────────────────────────────────┐
│    Core Infrastructure & Config      │
│  src/core/{errors,logger,storage,    │
│            sanitize}                 │
│  src/config/{env,runtimeEnv}         │
└──────────────────────────────────────┘
```

---

## Dependency Direction Rules

1. **`src/config` & `src/core`**: Leaf modules with zero dependencies on services, hooks, API, or UI.
2. **`src/data`**: Pure frozen domain datasets (`profile.js`, `skills.js`, `publications.js`, `projects.js`) serving as the Single Source of Truth.
3. **`src/api`**: Depends only on `src/core` and `config`. Never reads DOM or React state.
4. **`src/services`**: Encapsulates all validation, rate-limiting, project lookup, scroll-spy math, and clipboard rules without touching React or DOM APIs.
5. **`src/hooks`**: Bridges domain services, browser lifecycle (`useModalLifecycle`, scroll-spy, clipboard), and memoized React state cleanly into `App.tsx`.
6. **`src/components`**: Pure React + Tailwind + Motion Primitives UI components receiving typed props from `App.tsx`.
7. **`src/main.tsx`**: Application mount importing self-hosted `@fontsource*` typography and `src/styles/app.css`.

---

## Error Handling & Resilience Strategy

- **Typed Operational Errors** (`src/core/errors.js`): `AppError`, `ConfigError`, `ValidationError`, `RateLimitError`, `NetworkError`, `TimeoutError`, `ApiError`, and `NotFoundError`.
- **Resilient Persistence**: `createStorageService` automatically falls back to an in-memory `Map` if `localStorage` is blocked (`SecurityError`) or full (`QuotaExceededError`) and safely recovers from malformed JSON.
- **URL Hardening & XSS Safety**: React JSX escapes rendered text automatically; external/document links pass `sanitizeUrl()` (`https:`, `http:`, `mailto:`, `tel:`, and relative paths), and backend Apps Script escapes HTML (`escapeHtml_`).

---

## Environment Configuration

1. Default settings live in [`config/env.defaults.json`](../config/env.defaults.json).
2. Environment overrides live in `.env` (gitignored; documented in [`.env.example`](../.env.example)).
3. `npm run env:build` ([`scripts/generate-env.mjs`](../scripts/generate-env.mjs)) compiles `.env` + `process.env` + defaults into `src/config/runtimeEnv.js`.
4. [`src/config/env.js`](../src/config/env.js) resolves the active profile (`development`, `staging`, `production`), validates schemas/URLs/timeouts, and recursively freezes the resulting config object.
