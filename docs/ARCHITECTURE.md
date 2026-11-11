# Portfolio Architecture Guide

## Overview

The Mohan Kumar B.H Portfolio follows a **Zero-Dependency Modular Layered Architecture** built on standard Web Platform ES Modules, CSS Custom Properties, and a strict unidirectional data-flow model.

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                          UI Components Layer                            │
│  src/components/ui/*  (Icon, Button, Badge, SectionHeader, Modal, Toast)│
│  src/components/sections/*  (Navbar, Hero, About, Skills, Projects, ...)│
└──────────────────────────┬───────────────────────────┬──────────────────┘
                           │ dispatches actions        │ subscribes slices
                           ▼                           │
┌──────────────────────────────────────┐               │
│     Centralized State Store          │───────────────┘
│  src/state/{createStore,actions,     │
│             reducers,selectors,store}│
└──────────────────────────┬───────────┘
                           │ invoked by UI / orchestration
                           ▼
┌──────────────────────────────────────┐
│      Pure Business Logic Layer       │
│  src/services/{contact,theme,project,│
│                navigation,clipboard} │
│  (Zero DOM access; fully testable)   │
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
│            sanitize,dom}             │
│  src/config/{env,runtimeEnv}         │
└──────────────────────────────────────┘
```

---

## Dependency Direction Rules

1. **`src/config` & `src/core`**: Leaf modules with zero dependencies on services, state, API, or UI.
2. **`src/data`**: Pure frozen domain datasets (`profile.js`, `skills.js`, `publications.js`, `projects.js`) serving as the Single Source of Truth.
3. **`src/api`**: Depends only on `src/core` and `config`. Never reads DOM or store state.
4. **`src/services`**: Encapsulates all validation, rate-limiting, persistence, and domain rules. Never touches `document`, `window`, or HTML templates.
5. **`src/state`**: Pure reducers, action creators, selectors, and reactive store (`createStore`).
6. **`src/components`**: Pure DOM rendering + store subscriptions + user event delegation.
7. **`src/main.js`**: Composition root wiring all layers together and wrapping every section mount in a `safeRender` error boundary.

---

## State Management Model

State is organized into five immutable slices inside `src/state/reducers.js`:

| Slice | Shape | Responsibility |
| :--- | :--- | :--- |
| `theme` | `{ current: 'dark' \| 'light', source: 'storage' \| 'system' \| 'default' \| 'user' }` | Visual theme & meta theme-color synchronization |
| `navigation` | `{ activeSection, isScrolled, isMobileMenuOpen }` | Active scroll-spy highlight, navbar elevation, responsive menu |
| `modal` | `{ active: null \| ProjectModal \| PdfModal, triggerElementId }` | Accessible dialog state & focus restoration |
| `contact` | `{ status, fieldErrors, errorMessage, lastSubmission, failedRefId, cooldownUntil, history }` | Contact form lifecycle, inline errors & local archive |
| `toasts` | `{ items: ToastItem[] }` | Auto-dismissing user notifications |

Components subscribe via `store.select(selector, listener)` so each component only updates when its specific slice changes.

---

## Error Handling Strategy

- **Typed Operational Errors** (`src/core/errors.js`): `AppError`, `ConfigError`, `ValidationError`, `RateLimitError`, `NetworkError`, `TimeoutError`, `ApiError`, `StorageError`, `NotFoundError`.
- **Global Error Boundary**: `installGlobalErrorHandlers` captures uncaught `error` and `unhandledrejection` events cleanly.
- **Section Error Boundaries**: `safeRender` isolates component render failures so a single broken section renders an accessible recovery banner without breaking the rest of the application.
- **Resilient Persistence**: `createStorageService` automatically falls back to an in-memory `Map` if `localStorage` is blocked (`SecurityError`) or full (`QuotaExceededError`) and safely recovers from malformed JSON.
- **XSS & URL Hardening**: UI components render text via `textContent` (`el()`), validate external/asset links via `sanitizeUrl()`, and backend Apps Script escapes HTML before building email templates (`escapeHtml_`).

---

## Environment Configuration

1. Default settings live in `config/env.defaults.json`.
2. Environment overrides live in `.env` (gitignored; documented in `.env.example`).
3. `npm run env:build` (`scripts/generate-env.mjs`) compiles `.env` + `process.env` + defaults into `src/config/runtimeEnv.js`.
4. `src/config/env.js` resolves the active profile (`development`, `staging`, `production`), validates schemas/URLs/timeouts, and recursively freezes the resulting config object.
5. `src/bootstrap/themeInit.js` reads `runtimeEnv.js` synchronously in `<head>` to eliminate Flash of Unstyled Content (FOUC) without inline `<script>` tags (allowing strict `script-src 'self'` CSP).

