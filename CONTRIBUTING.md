# Contributing to Theos Logos

Thank you for your interest in contributing. This project aims to be a rigorous, open-source tool for serious biblical study. Contributions that improve accuracy, scholarly grounding, and usability are warmly welcomed.

---

## How to Contribute

1. **Fork** the repository
2. **Create a branch**: `feature/your-description` or `fix/your-description`
3. **Make your changes** following the standards below
4. **Open a Pull Request** using the PR template

For significant changes, open an issue first to discuss the approach.

---

## Development Setup

```bash
git clone https://github.com/rardo711/Theos-Logos.git
cd Theos-Logos
npm install
cp .env.example .env.local
# Add your GEMINI_API_KEY to .env.local
npm run dev
```

Default branch is currently `New-Main-Branch`.

Type-check before submitting:

```bash
npm run lint
```

Do not commit production hostnames, API keys, or `.env.local`.

---

## Code Standards

- **TypeScript strict mode** — no `any`, no implicit `any`
- **React functional components** with hooks only
- **Tailwind CSS** for all styling; no inline styles or separate CSS files for new components
- **No unused imports** — the TypeScript compiler will catch these
- **Component files**: one component per file, named to match the export

---

## Scholarly Source Compliance

> This is the most important section for any change touching commentary, AI prompts, or theological content.

### The Core Rule

**Every substantive theological or historical claim must cite a verifiable, first-hand source.** The AI may not assert a fact about what Calvin, Augustine, or any other figure taught without citing the specific work, book, and chapter.

### Approved Primary Sources (First-Hand)

| Source | Access |
|--------|--------|
| Church Fathers (Patristics) | CCEL: [ccel.org](https://ccel.org) |
| John Calvin — *Commentaries*, *Institutes* | CCEL: [ccel.org/ccel/calvin](https://ccel.org/ccel/calvin) |
| Martin Luther — *Works* | CCEL / Internet Archive |
| Reformed Confessions (Westminster, Heidelberg, Belgic, Canons of Dort) | Public domain |
| Greek New Testament (NA28/UBS5 cited; Textus Receptus is public domain) | Various |
| Hebrew Old Testament (BHS cited; Westminster Leningrad Codex is public domain) | [tanach.us](https://tanach.us/) |

### Approved Lexical Authorities

| Lexicon | Notes |
|---------|-------|
| BDAG (Bauer-Danker-Arndt-Gingrich, 3rd ed., 2000) | Commercial — AI approximates methodology |
| HALOT (Koehler-Baumgartner, 2001) | Commercial — AI approximates methodology |
| Thayer's Greek Lexicon (1889) | Public domain |
| LSJ — Liddell-Scott-Jones | Public domain ([Perseus](https://perseus.tufts.edu/)) |
| Strong's Concordance | Public domain |
| Gesenius' Hebrew Grammar | Public domain |

### Approved Digital Archives

- [CCEL](https://ccel.org) — Christian Classics Ethereal Library
- [Perseus Digital Library](https://perseus.tufts.edu/) — Greek and Latin texts
- [Internet Archive](https://archive.org) — Historical theological works
- [OpenAlex](https://openalex.org) — Open academic research index
- [Semantic Scholar](https://semanticscholar.org) — Peer-reviewed theology papers

### What Is NOT Acceptable

- Presenting an AI-generated summary as a direct quote from a historical figure
- Making lexical claims ("the Greek word X means Y") without citing BDAG, HALOT, Thayer's, or LSJ
- Asserting that a specific tradition holds a view without citing a confession, council decision, or named theologian with a verifiable work
- Paraphrasing a scholar's argument without attribution

### Modifying `geminiService.ts`

The `theologicalFraming` prompt is the core citation mandate. Any PR that weakens or removes citation requirements will not be merged. PRs that strengthen citation behavior — e.g., adding structured citation formats, adding new verified archives — are encouraged.

---

## Reporting Issues

- **Bugs**: Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md)
- **Feature requests**: Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md)
- **Scholarly errors** (wrong attribution, unverified quote, etc.): Open an issue with the `scholarly-error` label and provide the correct primary source reference

---

## Pull Request Checklist

Before submitting, verify:

- [ ] `npm run lint` passes (no TypeScript errors)
- [ ] If you changed commentary/AI behavior: all claims cite a primary source
- [ ] No API keys, secrets, `.env.local` files, or production hostnames committed
- [ ] PR description explains the change and its motivation

---

## Commit Messages

Use the imperative mood and keep the first line under 72 characters:

```
feat: add cross-reference panel with CCEL linking
fix: correct Strong's number for John 1:1 logos entry
chore: update gemini model to gemini-3.5-flash
docs: add Heidelberg Catechism to SOURCES.md
```

---

*Soli Deo Gloria*
