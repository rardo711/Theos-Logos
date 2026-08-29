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

## Deploy this branch (Vercel)

`main` is a different stack. Point a Vercel project at **`scholar-desk`**.

1. [Import the GitHub repo](https://vercel.com/new) (or add this repo to an existing project).
2. Set **Production Branch** to `scholar-desk` *for this test project only* — or leave production on `main` and open a Preview deployment of `scholar-desk`.
3. Framework: Vite / Other. Build command: `npm run build`. Output is Nitro’s `.vercel/output`.
4. Environment (optional):
   - `XAI_API_KEY` — Inquire / Compare only
   - `VITE_AUTH_ENABLED=false`
5. Node 22.

Without `XAI_API_KEY`, the reader and every curated desk note still work. Inquire will say reception is unavailable.

Do not use the `render.yaml` / `railway.toml` on `main` for this branch.

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
