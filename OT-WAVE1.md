# OT Wave 1 — Pentateuch (Genesis–Deuteronomy)

**Scope:** 187 chapters × 10 voices = **1,869 catalog rows** (+ 4 pre-existing
hand-curated Genesis 1 rows: Calvin pericope, Henry, Basil's Hexaemeron,
Augustine's City of God XI).

**Status:** built on branch `commentaries-ot`, URLs verified, tests green.

## Voices (10 per chapter)

| # | Voice | Work | Pub. dates | Tradition | License basis |
|---|-------|------|-----------|-----------|---------------|
| 1 | Keil & Delitzsch | Commentary on the Old Testament | 1864–1873 (Eng. tr.) | lutheran | Pre-1928, public domain |
| 2 | Matthew Henry | Commentary on the Whole Bible | 1706–1721 | reformed | Pre-1928, public domain |
| 3 | John Gill | Exposition of the Old and New Testament | 1746–1763 | reformed | Pre-1928, public domain |
| 4 | Jamieson-Fausset-Brown | Commentary Critical and Explanatory on the Whole Bible | 1871 | reformed | Pre-1928, public domain |
| 5 | Matthew Poole | Annotations upon the Holy Bible | 1683–1685 | reformed | Pre-1928, public domain |
| 6 | Adam Clarke | Clarke's Commentary on the Bible | 1810–1826 | arminian | Pre-1928, public domain |
| 7 | John Peter Lange | Commentary on the Holy Scriptures (Schaff Eng. ed.) | 1865–1872 | reformed | Pre-1928, public domain |
| 8 | Charles Ellicott | Commentary for English Readers | 1877–1884 | reformed | Pre-1928, public domain |
| 9 | Cambridge Bible | Cambridge Bible for Schools and Colleges | Series 1882–1915 | reformed | Pre-1928, public domain |
| 10 | Pulpit Commentary | The Pulpit Commentary (Exell, ed.) | 1880–1897 | reformed | Pre-1928, public domain |

Clarke is labeled `arminian` (Methodist) rather than `reformed` — the
tradition union already supports it (`tradArminian` in i18n). K&D are labeled
`lutheran`, which matches their confessional identity.

## URL patterns (all verified)

| Voice | Pattern | Host |
|-------|---------|------|
| Henry | `https://ccel.org/ccel/henry/mhc1/mhc1.{Gen,Ex,Lev,Num,Deu}.{roman}.html` | CCEL |
| Gill | `https://archive.sacred-texts.com/bib/cmt/gill/{gen,exo,lev,num,deu}{001…}.htm` | sacred-texts |
| JFB | `https://archive.sacred-texts.com/bib/cmt/jfb/{gen,exo,lev,num,deu}{001…}.htm` | sacred-texts |
| Poole | `https://biblehub.com/commentaries/poole/{genesis,…,deuteronomy}/{1…}.htm` | BibleHub |
| Clarke | `https://biblehub.com/commentaries/clarke/…` | BibleHub |
| K&D | `https://biblehub.com/commentaries/kad/…` | BibleHub |
| Lange | `https://biblehub.com/commentaries/lange/…` | BibleHub |
| Ellicott | `https://biblehub.com/commentaries/ellicott/…` | BibleHub |
| Cambridge | `https://biblehub.com/commentaries/cambridge/…` | BibleHub |
| Pulpit | `https://biblehub.com/commentaries/pulpit/…` | BibleHub |

Gill/JFB carry a BibleHub `altUrl` fallback (same convention as the NT
builders). Henry has no fallback — CCEL is the stable host.

### How each pattern was verified (not just status codes)

- **Henry slugs**: read off the volume table of contents
  (`mhc1.toc.html` → `Gen, Ex, Lev, Num, Deu`). CCEL returns HTTP 200 for
  *any* slug, so slugs were taken from the TOC, not guessed. Chapter offset
  (`.ii.html` = chapter 1) confirmed against page content for Genesis 1 and
  Genesis 50 ("Chapter L", Joseph narrative).
- **Gill/JFB sacred-texts codes**: `{gen,exo,lev,num,deu}{001…}` confirmed
  with a browser user-agent (the host blocks default curl UAs).
- **BibleHub paths**: spot-checked with real 200s (Genesis 1 for
  gill/jfb/poole/kad/lange/ellicott, Psalms 23 for barnes/cambridge,
  Isaiah 53 for clarke/pulpit), then the full set was swept by
  `npm run verify:urls`.
- **No page twice**: the whole-catalog duplicate-URL test passes
  (`retrieve.test.ts` → "never indexes one page under two ids"). The
  generator skips the one collision (the `henry-gen-1` hand row is the same
  page as the generated `henry-genesis-1`).

## Engineering notes

- The module-level `ROMAN` table only reached `xxix` (the NT's longest book
  is 28 chapters). The OT builders use a new `romanNumeral()` helper instead
  (needed up to `cli` for Psalms in a later wave).
- Exactly 10 builder voices per chapter = the approved cap, structurally.
  The 4 Genesis 1 hand rows are grandfathered (they are the highest-quality
  curated rows; the cap applies to wave-generated rows).
- **Deferred**: Geneva Bible Notes (1599) — sacred-texts URLs verified 200,
  queued as the Wave 1 alternate if any voice's pages fail later.
- **Excluded**: Albert Barnes — BibleHub hosts his Notes on the *New*
  Testament only; no verified OT Barnes chapter pages exist there, so no
  rows were built (no guessing).
- Retrieval supports the depth: `retrieveExtracts` fetches up to 10 pages
  (focused) / 9 (unfocused), and `mapCatalog`'s wave seating already reserves
  gill/lange + prefers cambridge/ellicott + seats pulpit for chapter queries.
  The old "seven pages" note in COMMENTARY-GUIDE.md is stale.

## Validation (2026-09-17)

- URL sweep (Wave-1 rows only): **2,244 distinct URLs, 0 failing**
  (1,870 rows incl. the `henry-gen-1` hand row; primaries + altUrls)
- `npm test` — 528 pass, 1 pre-existing failure
  (`scripts/migration-plan.test.mjs`, unrelated, fails on baseline too)
- `npx tsc --noEmit` — 3 pre-existing errors (2 library-drawer, 1
  error-component); none in reception/catalog changes
- `npm run build` — production build passing
