# Theos Logos

A scholarly Bible study **desk**. Scripture stays on the page. Historic reception is a stack of named cards — Fathers, Reformers, confessions — not a chatbot.

> “The fear of the LORD is the beginning of wisdom.” — Proverbs 9:10

**Repo:** [github.com/rardo711/Theos-Logos](https://github.com/rardo711/Theos-Logos)  
**This branch:** `scholar-desk` — the hybrid desk (TanStack Start).  
**`main`:** still the previous Express + Gemini app. This branch does not replace it.

**License:** MIT

---

## What it does

- **Reader** — World English Bible (public domain). Mark a verse; the text never leaves the screen.
- **Desk notes** — curated historic cards on marked verses (red dots). No search required.
- **Aim the sources** — optional, user-initiated inquire / compare via xAI. Generated cards are cached on the verse.
- **Lexicon** — local student notes first; confirm lemmas in BDAG / BDB / HALOT.
- **Contents** — this book’s chapters, or the whole canon (search `Ps 119`, `mark 1`).

A research aid, not a teacher. Take what you find to the printed works and to your church.

Read **[SOURCES.md](SOURCES.md)** before citing a generated claim.

---

## Deploy (free, no sleep screen)

Render’s free web service **spins down after 15 minutes** idle, then shows the “Application loading / Welcome to Render” page for about a minute. That cannot be turned off on the free plan.

**Use Vercel Hobby instead.** This branch already builds with Nitro’s `vercel` preset. Hobby is free for personal projects and does not sleep — the first tap after a quiet stretch may take a second, but there is no interstitial.

1. Open [vercel.com](https://vercel.com) and sign in with GitHub.
2. **Add New → Project** → `rardo711/Theos-Logos`.
3. Root settings:
   - **Branch:** `scholar-desk` (not `main`)
   - **Framework Preset:** Other
   - **Build Command:** `npm run build`
   - **Install Command:** `npm install`
4. Environment variables:
   - `VITE_AUTH_ENABLED` = `false`
   - `XAI_API_KEY` — optional; only for Inquire / Compare
5. Deploy. You’ll get a `*.vercel.app` URL. Add your own domain under the project’s Domains tab if you want.

Without `XAI_API_KEY`, the reader and every curated desk note still work.

You can leave the Render service paused or deleted after Vercel is live. Do not use the Railway template on `main` for this branch.

### Render (not recommended on free)

If you stay on Render, expect that wake-up page. A paid **Starter** instance (~$7/mo) stays up. Point the existing web service at `scholar-desk` only if you accept sleep on free:

1. Branch: `scholar-desk`
2. Build: `npm install && npm run build`
3. Start: `npm start`
4. Node 22
5. `VITE_AUTH_ENABLED=false`, optional `XAI_API_KEY`, `NPM_CONFIG_PRODUCTION=false`


---

## Local

Node 22+.

```bash
git clone https://github.com/rardo711/Theos-Logos.git
cd Theos-Logos
git checkout scholar-desk
npm install
cp .env.example .env.local
npm run dev
```

Optional: put `XAI_API_KEY` in `.env.local`.

```bash
npm run typecheck
npm run build
```

---

## Stack

React 19 · TypeScript · TanStack Start · Tailwind CSS v4 · Zustand · xAI (`grok-4.5`, user-initiated only)

Bible text: [bible-api.com](https://bible-api.com/) World English Bible. Instant seed for John 1, Genesis 1, Romans 8, Psalm 119.

---

*Soli Deo Gloria*
