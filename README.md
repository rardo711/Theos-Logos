# Theos Logos

**An open-source, scholarly Bible study application.**

Theos Logos is a mobile-first web application for deep biblical study. It combines a clean Bible text reader with AI-powered theological commentary grounded in verified primary sources — Church Fathers, Reformers, Reformed Confessions, and classical lexicons.

> "The fear of the LORD is the beginning of wisdom." — Proverbs 9:10

---

## Features

- **Bible Text Viewer** — ESV (via Bolls Life proxy) with World English Bible fallback (public domain)
- **Spanish Mode (ES)** — one-tap language toggle: Reina-Valera 1960 scripture text and a fully localized scholarly UI
- **AI Commentary Engine** — Powered by Google Gemini, grounded in Google Search and primary source citations
- **Greek & Hebrew Notes** — Structured lexical entries in BDAG/HALOT methodology
- **Historical Voices** — Quotes from Church Fathers, Calvin, Luther, and other Reformers
- **Multi-tradition Perspective** — Reformed, Catholic, Orthodox, Lutheran, and Anabaptist views presented side-by-side
- **Scholarly Source Citations** — All commentary cites CCEL, Reformers' works, or classical lexicons
- **Dark / Light Mode** — Stone palette with Oxblood Red accent
- **Mobile-First PWA** — Optimized for one-handed reading; installable to home screen

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- A [Google Gemini API key](https://aistudio.google.com/app/apikey) (free tier available)

### Installation

```bash
git clone https://github.com/yfr4mjzfzh-boop/bible-study-app-or-theological-research-tool.git
cd bible-study-app-or-theological-research-tool
npm install
```

### Configuration

```bash
cp .env.example .env.local
# Edit .env.local and add your Gemini API key:
# GEMINI_API_KEY=your_key_here
```

### Run Locally

```bash
npm run dev
# Open http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

---

## Scholarly Sources

All AI-generated commentary is required to cite a verifiable primary or secondary source. See **[SOURCES.md](SOURCES.md)** for the full list of approved sources, including:

- **CCEL** (Christian Classics Ethereal Library) — Church Fathers and Reformers
- **Lexicons** — BDAG, HALOT, Thayer's Greek Lexicon, LSJ, Strong's
- **Confessions** — Westminster, Heidelberg, Belgic, Canons of Dort
- **Digital Archives** — Perseus Digital Library, Internet Archive, OpenAlex

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS v4 |
| Server | Express (Node.js) |
| AI | Google Gemini (via `@google/genai`) |
| Bible Text | Bolls Life API (ESV · RVR1960) / bible-api.com (WEB) |
| Scholarly Archive | CCEL (ccel.org) |

---

## Project Structure

```
theos-logos/
├── src/
│   ├── components/       # React components (BibleViewer, CommentaryPanel, etc.)
│   ├── services/         # API services (bibleService, geminiService)
│   ├── types.ts          # TypeScript types and Bible book list
│   ├── App.tsx           # Root application component
│   └── main.tsx          # Entry point
├── public/
│   ├── data/             # Curated commentary JSON
│   └── manifest.json     # PWA manifest
├── resources/            # Research materials (not committed — see .gitignore)
├── legacy/               # Previous vanilla JS version (archived)
├── server.ts             # Express server with Bible API proxy
├── SOURCES.md            # Verified scholarly sources
├── CONTRIBUTING.md       # Contribution guidelines
└── DESIGN.md             # Design system documentation
```

---

## Contributing

Contributions are welcome! Please read **[CONTRIBUTING.md](CONTRIBUTING.md)** before submitting a pull request — especially the **Scholarly Source Compliance** section, which governs any changes to commentary or AI prompts.

---

## License

MIT — see [LICENSE](LICENSE).

---

*Soli Deo Gloria*
