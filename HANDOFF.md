# Theos Logos — living handoff (updated 2026-09-22 ~14:50 ET)

**Grok: start here.** Repo `HANDOFF.md` on `scholar-desk` (BUGS-PLAN.md retired 2026-09-16 — all items verified fixed on prod).

## Muse Spanish lexicon fix — index enrichment + curated edges (2026-09-22 ~14:50 ET) — PREVIEW ONLY
- **Problem (Muse audit):** `byGloss["ministro"] == ["G4166"]` so Col 1:7 tap never sees G1249; verse-rerank alone fixes **0%** of 704 events — correct Strong's missing from candidates.
- **Fix (index enrichment, not verse-rerank-only):**
  1. `scripts/import-ubs-es-lexicon.mjs` — singular/plural variants of every gloss key + whole tokens of multi-word keys (e.g. `evangelio` ← `el evangelio`); regenerates `spanish.json`.
  2. Curated key-only edges `scripts/data/spanish-gloss-edges.json` (reviewable) — `ministro`→G1249, `muerte`→G2288, `temor`→G5401, `esposo`→G3566, plus radioactive pairs (`palabras`, `ancianos`, `obra`, `evangelio`, `servidor`, …). Entry content untouched.
  3. Ranking hardening in `lookupSpanishWordNow`: when verse `reference` given and no candidate has `senseMatchedByReference`, still return surface hit for browse but set `unattestedInVerse` + card note “no atestiguado en este versículo”.
- **Success:** Colosenses 1:7 `ministro` → διάκονος **G1249** (SIL `051001007`), not ποιμήν G4166.
- **Repro:** locale=es → Colosenses 1:7 → tap **ministro** → Spanish gloss card shows G1249.
- **Tests:** `spanish.test.ts` — Col 1:7 pin + Muse regression set (palabras/ancianos/obra/evangelio/servidor/esposo/muerte/temor) + unattested flag. English UBS path unchanged (asymmetry Spanish-specific).
- **NO promote.** Chip tap never Gemini. No Scofield/Darby. Live prod logo untouched.
- SHA `TIP_SHA` · preview PREVIEW_URL · dpl DPL_ID
- Branch alias: https://theos-logos-official-git-scholar-desk-castanedag2001-1468.vercel.app

## English NT lexicon parity — UBS EN gloss pack (2026-09-16 ~07:50 ET) — PREVIEW ONLY
- **Goal:** locale=en NT word-tap matches Spanish UBS robustness (verse-sense, multi-gloss hero, N more senses, gold Strong → Midvash EN).
- **Data:** compact `src/lib/lexicon/data/english.json` from UBSGreekNTDic-v1.1-en.JSON (CC BY-SA 4.0) + eng.tsv filtered lexicon|ubs-dict (no LLM). Local import only — `node scripts/import-ubs-en-lexicon.mjs` (never at Vercel build).
- **Lookup:** `english.ts` — `lookupEnglishByStrongs` / verse-sense via SIL BBBCCCVVV / `byGloss` from UBS EN. Do **not** reuse STEPBible glosses.json for NT Greek.
- **UI:** `EnglishGlossCard` per `LOOK-BRIEF-english-gloss-card-v1.md` — Sense in this verse → Gloss hero → N more senses / Show less → Lemma/Morphology → Domain → gold Strong → Midvash EN → UBS · CC BY-SA. Reuses gloss sheet motion tokens. Logo untouched.
- **Reception:** locale=en NT → UBS EN path; OT Hebrew stays STEPBible/BDB. Chip tap never Gemini.
- **Fixes:** NT chip no Hebrew fallback (image/head/fullness); `local.ts` Johannine notes no longer leak to all NT.
- **Smoke:** Col 1:15 *image* / *firstborn* → UBS EN verse-sense (G1504 / G4416), not Hebrew, not Johannine.
- **Tests:** `english.test.ts` (G-lookup + verse-sense + NT-not-Hebrew). Attribution: `ATTRIBUTION.md` / `SOURCES.md`.
- **NO promote.** Live prod logo untouched. No Scofield/Darby.
- SHA `45ae4f8` · preview https://theos-logos-official-faxwamqqi-castanedag2001-1468.vercel.app · dpl `dpl_5pbQcWFJFz4msKSsWE74xp3YjMuk`
- Branch alias: https://theos-logos-official-git-scholar-desk-castanedag2001-1468.vercel.app


## Reception card QC — verse-ref spam + ES book names (2026-09-16 ~02:15 ET) — PREVIEW ONLY
- **Bug 1:** GENERADA bodies (e.g. Kretzmann on Juan 1:4) showed concatenated “John 1:1 John 1:2 …” spam. **QC:** `isMostlyVerseRefs` in `retrieve-html.ts` — high density of named book+ch:v tokens (EN+ES) or bare ch:v spam with little prose → `isSubstantiveQuote` false → reject/drop (EN and ES). Never ship spam cards.
- **Bug 2:** Geneva/Lange ES bodies still had “John 1:4” / “1 John 1:1” because NMT `protect` leaves verse refs intact. **`localizeBookNamesInBody`** (i18n-sources; uses `BIBLE_BOOKS` + `bookName(…,"es")` + extras Song of Songs/Psalm/Apocalypse) rewrites EN book names in quote/note/bridge after NMT and in `localizeCard` display; protects Greek/Hebrew/URLs and voice phrases like “John Calvin”. EN locale unchanged.
- Verify: Juan 1:4 Reception EN+ES — no verse-ref spam; ES refs use Juan not John.
- **NO promote.** Out of scope: GENERADA EN flip-back.
- SHA `a676a90` · preview https://theos-logos-official-lypsv26aj-castanedag2001-1468.vercel.app · dpl `dpl_EwSG2kjkp7oSfPnrn4u4UoyCPTgf`
- Branch alias: https://theos-logos-official-git-scholar-desk-castanedag2001-1468.vercel.app

## Curated quote NMT on open (2026-09-16 ~02:00 ET) — PREVIEW ONLY
- **Bug:** locale=es curated/CURADA cards showed Spanish chrome (Agustín via i18n-sources) but **quote bodies stayed English** — client `getDeskNotes` → `getCurated` never hit server NMT; `localizeCard` skips `quote`. Gather merge also kept prior EN quotes when cites matched.
- **Fix:** Reception auto-calls `askReception` (Google NMT + durable cache) when locale=es and desk is uncached curated; `mergeReceptionCards` prefers server quote/note for same voice+citation. EN switch still locale-keyed → English curated.
- **Field missed:** `quote` (and `note` when present; curated `excerpt` maps to `quote`).
- **Verify:** Juan 1:4–7 curated — Augustine “What was made…” → Spanish body; EN restores English.
- Keep Midvash Strong, onboarding as-is. **NO promote.**
- SHA `0870d46` · preview https://theos-logos-official-bmepyrd1q-castanedag2001-1468.vercel.app · dpl `dpl_8oXfsnZnJRbWW1VaseyGTVsBu4tn`
- Branch alias: https://theos-logos-official-git-scholar-desk-castanedag2001-1468.vercel.app

## Midvash Strong + curated NMT + locale switch (2026-09-16 ~01:50 ET) — PREVIEW ONLY
- **Strong pills:** gold, new tab, max 2+N; Midvash over BibleHub. ES desk: `https://midvash.com/es/concordancia-strong/griego/g{n}` (Hebrew `…/hebreo/h{n}`); EN: `…/strongs-concordance/greek/g{n}` (Hebrew `…/hebrew/h{n}`). Digits without leading zeros. UBS attribution kept on gloss card. Verified G3956 ES → “todo”.
- **NMT scope:** when `locale=es`, Google NMT translates **generated + curated/catalog** card bodies (quote / note / contextBridge). Voice/work/citations via notranslate + i18n-sources. Do not MT Scripture when RV1960 already on desk. Same durable cache (hash + engine + locale).
- **Locale switch:** client desk cache `theos-logos-reception-v2` keyed by verse **and** locale; open sheet reloads on locale change — EN shows English source (no sticky ES). Tests: `locale-switch.test.ts`, `midvash.test.ts`, updated `generated.test.ts`.
- **Out of scope:** onboarding ES v3 (untouched). **NO promote.**
- SHA `5db3b13` · preview https://theos-logos-official-puotazd7a-castanedag2001-1468.vercel.app · dpl `dpl_GdoFxvGsFqe8wRL7nMjCinGxZ3qA`
- Branch alias: https://theos-logos-official-git-scholar-desk-castanedag2001-1468.vercel.app

## Spanish onboarding refine v3 (2026-09-16 ~01:45 ET) — PREVIEW ONLY
- **Brief:** `LOOK-BRIEF-first-run-onboarding-es-v3.md` (builds on v2 structure/motion).
- **ES path:** clearer instructional copy — Abrir un versículo → Toca una palabra (Glosa / Strong oro) → Recepción y comentarios → Ya puedes empezar / **Empezar**.
- **Español card sub:** **Escritura, glosas y Recepción** (language gate still first; live prod seal).
- **Glossary:** Glosa / Strong / Recepción / «N sentidos más» — Strong never “Fuerte”.
- **Persist:** `ONBOARDING_VERSION = "3"` — v2 completers re-see once; then durable skip.
- **EN screens:** v2 EN kept; shared chrome (Español card sub) matches.
- **Motion:** v2 calm desk tokens (280–320ms language crossfade; 300ms pager).
- **NO promote.**
- SHA `4fa1124` · preview https://theos-logos-official-o3r2hj52z-castanedag2001-1468.vercel.app · dpl `dpl_FJtcxV4kf1m9XzUmhtiVVQBB46tL`
- Branch alias: https://theos-logos-official-git-scholar-desk-castanedag2001-1468.vercel.app

## Spanish NMT for AI-generated commentary (2026-09-16) — PREVIEW ONLY
- **Scope:** generated Inquire/reception cards + synthesis quote spans when `locale=es`. Catalog PD voices untouched.
- **Engine:** Google Cloud Translation NMT. Env: `GOOGLE_TRANSLATE_API_KEY` and/or `GOOGLE_APPLICATION_CREDENTIALS` (server only).
- **Cache:** memory + `.data/translation-cache/` + Neon `translation_cache` when `DATABASE_URL` set; key = content hash + `google-nmt` + locale.
- **Protect:** verse refs, Greek/Hebrew, Strong’s, URLs, voice/work via `notranslate` HTML.
- **Scripture:** reader already uses RV1960; pure verse quotes prefer `verseTextEs` over MT when EN verse is known.
- **QC:** `TRANSLATE-QC.md`. Tests: `src/lib/translate/*.test.ts` (mocked API).
- **NO promote.** Live translate on preview requires GCP key on Vercel (Chief/Rardo).
- SHA `304f83f` · preview https://theos-logos-official-6bjbmpuw7-castanedag2001-1468.vercel.app · dpl `dpl_HnAQyoaMbuuqkqJ2AH1an1eAXRiS`
- Branch alias: https://theos-logos-official-git-scholar-desk-castanedag2001-1468.vercel.app
- **Note:** Live ES NMT on preview needs `GOOGLE_TRANSLATE_API_KEY` (or credentials) set on Vercel by Chief/Rardo; without it, generated cards stay English (graceful skip).


## Spanish gloss card polish — sentidos más + gold Strong (2026-09-16 ~01:25 ET) — PREVIEW ONLY
- **Expand:** when `relatedSenseCount > 0`, control “N sentidos más” (Spanish chrome); tap expands other UBS LEXMeanings (DefinitionShort + Glosses + Domain/SubDomain); collapse via “Ocultar sentidos”. Verse-selected sense stays Sentido/Glosa hero.
- **Strong pills:** desk-gold (`tl-strong-pill--gold` / `--color-gold`); max 2 + overflow; each opens BibleHub `https://biblehub.com/greek/{n}.htm` in a **new tab** (strip leading zeros). No in-repo UBS viewer deep-link — UBS attribution footer kept.
- **Acceptance:** Juan 1:3 *todas* / G3956 → sense 59.23 totality; “6 sentidos más” expandable.
- Hierarchy / logo / verse-sense pick unchanged. **NO promote.**
- SHA `c2f9f0f` · preview https://theos-logos-official-2exww3ecn-castanedag2001-1468.vercel.app · dpl `dpl_5bAzNx6cXYAq9M6BUtqUozofA2sH`
- Branch alias: https://theos-logos-official-git-scholar-desk-castanedag2001-1468.vercel.app

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
- SHA `304f83f` · preview https://theos-logos-official-6bjbmpuw7-castanedag2001-1468.vercel.app · dpl `dpl_HnAQyoaMbuuqkqJ2AH1an1eAXRiS`
- Branch alias: https://theos-logos-official-git-scholar-desk-castanedag2001-1468.vercel.app
- **Note:** Live ES NMT on preview needs `GOOGLE_TRANSLATE_API_KEY` (or credentials) set on Vercel by Chief/Rardo; without it, generated cards stay English (graceful skip).

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

