# Theos Logos

Personal web app for careful Bible study. Scripture first. Commentary is AI-assisted and must cite primary sources. It is a study aid, not a substitute for the text or for published lexicons.

> "The fear of the LORD is the beginning of wisdom." — Proverbs 9:10

**Repo:** [github.com/rardo711/Theos-Logos](https://github.com/rardo711/Theos-Logos)  
**Status:** v0.1.0, personal project  
**License:** MIT

There is no public demo URL in this repository. The running instance is hosted privately. GitHub Pages cannot run this app (Express + API keys). Run it locally or deploy a Node server yourself. Do not commit the production hostname.

---

## What it does

- Bible reader — ESV when an official key is set; otherwise Bolls Life. WEB fallback. Spanish: Reina-Valera 1960 + localized UI
- Commentary — Gemini, with citation rules aimed at Fathers, Reformers, and confessions
- Word study — lexical notes in a BDAG/HALOT *style* (approximated; verify against the printed works)
- Traditions panel — more than one confession, each from its own texts when possible
- PWA — dark/light, history, installable on a phone

Read **[SOURCES.md](SOURCES.md)** before trusting a generated claim.

---

## Requirements

- Node.js 18+ (20 recommended; see `.nvmrc`)
- [Gemini API key](https://aistudio.google.com/app/apikey)
- Optional: [Crossway ESV API key](https://api.esv.org/) for licensed ESV with section headings

## Setup

```bash
git clone https://github.com/rardo711/Theos-Logos.git
cd Theos-Logos
npm install
cp .env.example .env.local
```

Put `GEMINI_API_KEY` in `.env.local`. Add `ESV_API_KEY` if you have one.

```bash
npm run dev          # http://localhost:3000
npm run lint         # TypeScript check
npm run build && npm start
```

`dev` and `start` both run `tsx server.ts`.

## Deploy

Node host only. `render.yaml` and `railway.toml` are templates. Set keys in the host dashboard. Do not put the live hostname in git. Leave GitHub Pages off.

---

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · Express · Gemini (`@google/genai`)

## Layout

```
src/            UI and client services
server.ts       API proxy (Bible + Gemini). Keys stay here.
public/         PWA manifest and static data
legacy/         archived vanilla JS app
SOURCES.md      approved sources
DESIGN.md       visual system
CONTRIBUTING.md how to change code and prompts
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Changes to commentary or prompts must not weaken citation rules.

---

*Soli Deo Gloria*
