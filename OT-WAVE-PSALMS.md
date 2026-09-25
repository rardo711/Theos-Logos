# OT Wave — Psalms (PSA)

Date: 2026-09-18. Branch: `commentaries-ot`. Generated from `~/workspace/ot-waves/psalms.json`
via `gen-waves.mjs` → `src/lib/reception/ot/wave-psalms.ts`.

## Scope

- PSA, 150 chapters × 11 voices = 1,650 chapter rows + 32 special rows = **1,682 rows
  generated**; the catalog's OT 10-voice cap (`capOtVoices` in catalog.ts) trims
  this to **1,500 rows shipped** (exactly 10 per chapter).
- Voices: Keil & Delitzsch, Matthew Henry, John Gill, Jamieson-Fausset-Brown,
  Matthew Poole, Adam Clarke, John Peter Lange, Charles Ellicott, Albert Barnes,
  Cambridge Bible, Pulpit Commentary.
- Trim behavior (verified against the built catalog, 2026-09-18):
  - 134 regular chapters (11 voices): **Pulpit Commentary** trims by priority —
    shipped set is the other 10 incl. Barnes.
  - 16 special chapters (1, 8, 19, 22, 23, 42, 46, 51, 90, 91, 110, 121, 130,
    133, 139, 150 — 13 rows: 11 voices + Augustine + Spurgeon): Augustine
    (priority 2) and Spurgeon (priority 4) survive; **Barnes, Cambridge Bible,
    and Pulpit Commentary** trim. Shipped set: Augustine, Spurgeon, K&D, Henry,
    Gill, JFB, Poole, Clarke, Lange, Ellicott.

## Special rows (32, each URL individually verified)

- 16× Augustine, *Expositions of the Psalms* — sacred-texts.com NPNF vol. VIII,
  `/read/psalm-<roman>` scheme confirmed on the real index
  (sacred-texts.com/chr/ecf/108/index.htm); each of the 16 fetched (200 + exposition
  content + correct psalm title). Psalms covered: 1, 8, 19, 22, 23, 42, 46, 51,
  90, 91, 110, 121, 130, 133, 139, 150.
- 16× Spurgeon, *Treasury of David* — biblebb.com/files/spurgeon/TOD/chstp<n>.htm
  (no zero-padding; chstp01 404s, chstp1 works); each fetched (200 + "TREASURY OF
  DAVID" content). Same 16 psalms.
- Augustine d. 430; Spurgeon 1834–1892, Treasury 1869–1885 — both PD.

## Barnes (page-level authorship verification, 2026-09-18)

- biblehub.com/commentaries/barnes/psalms/<n>.htm pages titled "Psalm N Barnes' Notes"
  with genuine Barnes commentary (17–240KB); ch. 1/75/150 → 200, 151 → 404.
- Albert Barnes (1798–1870, Presbyterian); genuine OT corpus = Job, Psalms, Isaiah,
  Daniel (Wikipedia/Wikisource bibliography). PD.

## URL verification

- Pattern checks per (voice, book): ch. 1, 75, 150 → 200 with real commentary content;
  ch. 151 → 404.
- Henry: mhc3, slug `Ps` read from the live volume .toc.html; mhc3.Ps.ii.html = Ps 1
  ("PSALM I."), mhc3.Ps.cli.html = Ps 150 ("PSALM CL.").
- sacred-texts codes (browser UA): gill/psa, jfb/psa — psa001/psa075/psa150 → 200.
- BibleHub `psalms` slug verified for all 10 hub voices.
- Full sweep of every served URL (primary + altUrl): see wave commit validation.

## Dropped

- Pulpit Commentary trims by the 10-cap on all 150 Psalm chapters (lowest priority).
- Barnes and Cambridge Bible additionally trim on the 16 special chapters only
  (Augustine + Spurgeon outrank them); both ship on the other 134 chapters.
- None of the 10 regular voices is dropped outright — every voice ships on at
  least 134 of 150 chapters.
