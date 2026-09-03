# Agent Guidelines & Project Context

> **Note for AI Assistants (Grok, Google AI Studio, Claude, Cursor, Copilot, etc.):**
> The author vibe-codes this project across multiple AI tools and environments. Please read this file to ensure seamless cross-environment collaboration and avoid regressing setup or infrastructure across platforms.

---

## 🛠️ Multi-Tool Vibe Coding Workflow

This repository is actively developed using a multi-tool setup:
- **Grok (xAI)**: Uses a sandbox environment expecting dev server on `0.0.0.0:8080` with host `*.grok-sandbox.com`.
- **Google AI Studio**: Uses a Cloud Run sandbox expecting dev server on `0.0.0.0:3000` with host `*.run.app`.
- **Local Dev / Deployment**: Node 22+, Vercel Hobby, or Render.

### Preserving Cross-Environment Compatibility:
1. **Ports (`3000` vs `8080`)**:
   - If running in Grok: Grok may run on port `8080`.
   - If running in Google AI Studio: Cloud Run proxy routes through port `3000`.
   - In `src/lib/auth/server.ts` and `src/lib/auth/preview.ts`, origins for **both** `3000` and `8080` as well as `*.grok-sandbox.com` and `*.run.app` are whitelisted so authentication works seamlessly in either environment.
   - If switching between environments, only update the port in `vite.config.ts` and `package.json` if needed by that specific runtime.
2. **Package Manager & Lockfiles**:
   - Standard `npm` with Node 22.
   - Do not generate conflicting lockfiles (`yarn.lock`, `pnpm-lock.yaml`, `bun.lockb`).
3. **Environment Variables (`.env.example`)**:
   - Document any new environment variables in `.env.example`.
   - Secrets are loaded from local environment files or platform settings (`ESV_API_KEY`, `GEMINI_API_KEY`, `DATABASE_URL`, `VITE_AUTH_ENABLED`).

---

## 🏛️ Architecture & Invariants

Do not arbitrarily replace or restructure these foundational layers:

1. **Framework & Engine**:
   - TanStack Start (React 19, Nitro server engine, Vite, Tailwind CSS v4).
   - Zustand for client state management (`src/lib/study-store.ts`).
2. **Database**:
   - In-memory / WASM PostgreSQL via **`@electric-sql/pglite`** with Kysely query builder.
   - Transparent fallback: PGLite operates when `DATABASE_URL` is omitted, and standard PostgreSQL operates when `DATABASE_URL` is configured.
   - Do not remove PGLite or migrations in `/migrations/`.
3. **Authentication**:
   - **Better Auth** with the custom PGLite dialect (`src/lib/auth/pglite-dialect.ts`), session isolation, and popup/redirect auth handlers.
4. **PWA & Mobile Install**:
   - PWA middleware and asset handlers are in `server/middleware/grok-pwa.ts` and `scripts/grok-pwa-plugin.mjs`. Preserve these features.

---

## 📖 Scholarly Mission & Design Principles

Theos Logos is a **scholarly Bible study desk**, not a generic chatbot or conversational AI:
- **Scripture First**: Scripture text remains on the screen. The user selects/marks verses to inspect historic commentary.
- **Historic Reception**: Commentary cards are drawn from Church Fathers, Reformers, and historic Confessions with primary source citations.
- **Strict Anti-Slop**:
  - No synthetic chatbot overlays, generic marketing copy, or unrequested landing hero sections.
  - Strict scholarly typography and styling: Playfair Display + Source Serif 4 on warm paper / oxblood accents.
  - Never fabricate quotes or theological claims; always ground citations in reputable historic sources (see `SOURCES.md` and `COMMENTARY-GUIDE.md`).
