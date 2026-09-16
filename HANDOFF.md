# Theos Logos — living handoff (updated 2026-09-07 ~11:17 ET)

**Grok: start here.** Repo `HANDOFF.md` + `BUGS-PLAN.md` on `scholar-desk`.

## Reception + gloss sheet motion/polish (2026-09-15 ~22:10 ET) — PREVIEW ONLY
- Design brief `LOOK-BRIEF-gloss-reception-motion-v1.md` on `scholar-desk` (content hierarchy unchanged).
- Shared sheet tokens: enter ~250ms slide+fade ease-out; exit ~220ms slide+fade ease-in; no bounce.
- Backdrop dim 36% (`data-sheet`); tap outside dismisses (BUG-8) — same path as ✕.
- Gloss slip spacing/type polish; Glosa still largest; quiet gold hairline; Strong pills 30px, max 2+N.
- In-place gloss crossfade ~160ms; prefers-reduced-motion → fade only ≤150ms, no slide.
- Logo / seal / icons untouched. **NO promote.**
- SHA `df6ff9a` · preview https://theos-logos-official-8m6sawe73-castanedag2001-1468.vercel.app · dpl `dpl_HTDMRB8tzEGtb6Wwem32Dx5D4D89`
- Branch alias: https://theos-logos-official-git-scholar-desk-castanedag2001-1468.vercel.app

## Production (LIVE)
- SHA `d18ba5c` · https://theos-logos-official.vercel.app · dpl `dpl_7ZgVQAckC5QiHX4EP5ZdaAUZ31nV`
- Wave-5B + BUG-11 + catalogs live. **NO promote from previews without Rardo go.**

## In preview — richer-gold / no-cream-rim icons READY (await QC / Rardo)
- Supersedes prior book-edge wire `3db067e` / docs `ce557de`.
- App icons only: oxblood full-bleed edge-to-edge (NO cream rim/frame); **richer dual-tone gold** TL cross outline.
- Header seal **UNCHANGED** (`public/seal.png` / LOCKED-header — do not touch).
- SW cache `theos-logos-icons-v5` (PNG precache; no favicon.svg).
- Lexicon tip still held (`342c0fc` / `8b5c41a`): Rom 8:28 love→G25; Heb 1:1 spoke→G2980. Quintilius PASS. Holding promote.
- **NO promote** until Rardo QC. Preview-only.

## Wave-5B — DONE (live)
See prior HANDOFF table. Banned: Scofield / Darby / Kelly / Bellett / Pink / Stier = 0.

## Spanish lexicon sense fidelity (2026-09-15 ~21:45 ET) — PREVIEW ONLY (await deploy)
- Improves on Spanish gloss pack `24ef49f` / docs `d569bac`.
- **Bugfix:** Juan 1:1 *principio* / G746 → UBS **67.65 Tiempo** (Sentido “punto de tiempo que indica el principio de una duración”; Glosa hero **principio**; Dominio Tiempo · Principio/Fin subdomain), not first meaning 68.1 Aspecto / empezar.
- **Mechanism:** importer keeps per-sense SIL `rv` (BBBCCCVVV), `LEXEntryCode`, Domain/SubDomain; `lookupSpanish*` picks sense by verse ref (fallback = first).
- **UI:** Dominio shows source Domain · SubDomain; quiet entry-code meta. Hierarchy unchanged. Logo untouched.
- **Tests:** G746 + Juan 1:1 → 67.65 / principio (also Marcos 1:1 stays 68.1).
- **NO promote.** No RV1909. No RI grid. Chip tap never Gemini.
- SHA / preview URL: fill after push + Vercel READY.

## Spanish lexicon data + gloss card UI (2026-09-15 ~20:45 ET) — PREVIEW READY
- SHA `24ef49f` · preview https://theos-logos-official-qsre6hnd5-castanedag2001-1468.vercel.app · dpl `dpl_7KJukxZ223Ry2FVfn9qFfZ4ZZmWh`
- Branch alias: https://theos-logos-official-git-scholar-desk-castanedag2001-1468.vercel.app
- **Data:** UBS ES compact `src/lib/lexicon/data/spanish.json` (5312 Strong’s; CC BY-SA 4.0).
- **Importer:** `scripts/import-ubs-es-lexicon.mjs` (local only — no Vercel-build download).
- **Secondary:** spa.tsv filtered `lexicon|ubs-dict` only; llm-only excluded (10288 skipped at import).
- **Lookup:** `lookupSpanishByStrongs("G3056")` → palabra / dicho / mensaje… + DefinitionShort.
- **API:** `askSpanishLexicon` + client sync; chip tap never Gemini.
- **UI:** `SpanishGlossCard` on locale=es Reception word-tap — Sentido → Glosa hero → Lema/Morfología → Strong footer → UBS micro attribution.
- **Attribution:** `ATTRIBUTION.md` + `SOURCES.md`.
- **NO promote.** Logo untouched. No RV1909. No RI grid. Prod freeze unchanged.
- Smoke: switch locale Español → open NT verse → tap lexicon chip (e.g. palabra) → card shows Glosa largest, Sentido present, Strong footer-only.

