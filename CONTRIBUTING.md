# Contributing to Theos Logos

Accuracy and source discipline matter more than new features.

## Setup

```bash
git clone https://github.com/rardo711/Theos-Logos.git
cd Theos-Logos
npm install
cp .env.example .env.local
npm run dev
npm run lint
```

Default branch is `main`. Do not commit production hostnames, API keys, or `.env.local`.

## Code

- TypeScript strict — no `any`
- React function components and hooks
- Tailwind for new UI
- One component per file

## Scholarly source rule

Every substantive historical or theological claim needs a first-hand citation (work, book, chapter). The model may not invent Calvin, Augustine, or a lexicon gloss.

Approved starting list: [SOURCES.md](SOURCES.md).

Not acceptable:

- AI paraphrase presented as a verbatim quote
- "Greek X means Y" with no lexicon named
- A tradition's view with no confession, council, or named work

Do not weaken the system prompt citation rules.

## PR checklist

- [ ] `npm run lint` passes
- [ ] Commentary/prompt changes still require primary sources
- [ ] No secrets or hostnames committed

Commit subject: imperative, under 72 characters (`fix:`, `feat:`, `docs:`, `chore:`).

---

*Soli Deo Gloria*
