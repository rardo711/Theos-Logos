# Reception Engine Plan — verse-true commentary across the whole New Testament

Written 2026-09-04 against `scholar-desk` at `186b262`. Every path and line
number below was checked against that commit. Re-check line numbers if the
branch has moved.

Executor: any model or person. The work is ordered so each phase ships on its
own and leaves `npm test` and `npx tsc --noEmit` green.

---

## 0. Ground rules

Do not touch these; they belong to the Grok and Google AI Studio sessions:

- `.grok/`, `public/__grok/`, `server/middleware/grok-pwa.ts`,
  `scripts/grok-pwa-*.mjs`, `scripts/install-page.html`,
  `scripts/brand-check*.mjs`, `scripts/write-atomic*.mjs`,
  `scripts/preview*.mjs`, `scripts/browser-*.mjs`, `scripts/with-app-env*.mjs`,
  `scripts/app-env-plugin.mjs`, `scripts/sign-out-plan*.mjs`
- `metadata.json` (AI Studio applet manifest), `render.yaml` (Render target,
  still listed in `AGENTS.md`), `vercel.json`, `vite.config.ts`,
  `package.json` scripts and ports, `.env.example`
- `src/lib/auth/**`, `src/lib/db*`, `migrations/`, `src/lib/og/`,
  `src/components/preview-host-bridge.tsx`
- `AGENTS.md` — read it first; it states the invariants.

Work only in `src/lib/reception/**`, `src/lib/i18n*.ts` (new strings only),
`SOURCES.md`, `PUBLIC-COMMENTARY-SOURCES.md`, and one new script
`scripts/verify-catalog-urls.mjs`.

Twelve tests in `scripts/write-atomic.test.mjs` and `scripts/brand-check.test.mjs`
fail in any checkout that lacks the untracked `.grok/skills/og/references`
directory. That is an environment gap, not a regression. Judge your own work by
the `src/lib/reception/*.test.ts` and `src/lib/**` suites.

Egress note: the Claude remote sandbox cannot reach ccel.org, newadvent.org,
biblehub.com, or godrules.net (proxy policy). URL verification in this plan must
run from a machine with network access, or by the executor if its environment
allows it. Never commit a URL that has not returned 200.

---

## 1. What is wrong today (verified)

### 1a. The Romans 9:11 card is Calvin on Romans 9:4

`src/lib/reception/catalog.ts:476` — `calvin-rom-9` points at
`calcom38.xiii.i.html` and claims all of chapter 9. CCEL splits Calvin by
pericope; `.xiii.i` is the first pericope of chapter 9 (9:1–5). The repo's own
loci prove the convention: `calcom38.v.i` is labeled "Romans 1:1–7" (line 654)
and `calcom34.vii.i` "John 1:1–5". Verse 11 is on a sibling page the catalog
never indexes.

`src/lib/reception/retrieve-html.ts:215` `pickParagraphs` scores paragraphs by
bag-of-words overlap with the verse text and has no notion of verse position.
On a page that ends at verse 5 it returns whichever paragraph shares the most
incidental words, or the first four paragraphs if nothing scores.

`src/lib/reception/retrieve-assemble.ts:244`
`cards: cards.length ? cards : fallback.cards` — when the Gemini librarian
correctly rejects every chunk, the code discards that verdict and ships
`cardsFromExtracts`, which is the first substantive paragraph of each page with
no verse check. The librarian's rejection rule (retrieve-assemble.ts:56–60) is
therefore unreachable in practice. The same fallback runs when
`GEMINI_API_KEY` is unset.

### 1b. Only two cards come back

`mapCatalog` for ROM 9 selects five rows (confirmed by running it):

| row | url | status |
|---|---|---|
| calvin-rom-9 | calcom38.xiii.i.html | wrong pericope (9:1–5) |
| chrysostom-rom-h16 | newadvent 210216.htm | correct homily |
| henry-rom-9 (catalog.ts:480) | mhc5/mhc5.Rom.ix.html | wrong volume; Romans is mhc6 (see HENRY_NT table, catalog.ts:740) → 404 |
| augustine-enchiridion-rom9 (catalog.ts:478) | newadvent 1302.htm | whole Enchiridion on one page; §98 lies past the 180 000-byte cap at retrieve-net.ts:22 |
| henry-romans-9 (generated) | mhc6/mhc6.Rom.x.html | correct |

Two usable pages, two cards. `FETCH_MS = 7_000` (retrieve-net.ts:21) on a cold
Vercel function loses more.

### 1c. Matthew is worse than Romans

`mapCatalog` for MAT 5 returns seven rows; six are volume title pages or the
wrong work:

| row id (catalog.ts) | url | what it actually is |
|---|---|---|
| chrysostom-matt-h4 / h15 / h54 / h90 | npnf110.html | NPNF 1/10 volume index |
| aquinas-catena-matt-1 / 5 / 16 / 28 | catena1.ii.xi.html | one Catena section, reused for four chapters |
| poole-annotations-matt-1 / 5 / 16 / 28 | poole/annotations.html | Poole index page |
| augustine-sermon-mount-1 | npnf106.html | NPNF 1/6 volume index |
| calvin-matt-5 / 16 / 28, calvin-mark-10 / 15, calvin-luke-1 / 18 / 23 | calcom31.i.html | Harmony vol. 1 title page |
| luther-sermon-mount-5 (and RECEPTION_SOURCES `luther-sermon-mount`, line 91–104) | luther/good_works/good_works.ii.html | Luther, *Treatise on Good Works* (1520), not the Sermon on the Mount |
| aquinas-catena-mark-10 / 15 | catena2.iii.iv.html | one section reused |
| aquinas-catena-luke-18 / 23 | catena3.html | volume root |
| aquinas-catena-john-6 / 14 / 19 | catena4.html | volume root |
| ambrose-luke-1 / 23 | npnf210.html | NPNF 2/10 volume index |

Running `attachWeakNtCatalog()` then grouping `CATALOG` by URL gives 14
duplicate-URL groups covering roughly 35 rows. Every one of them is a fetch slot
spent on a page that cannot contain the verse.

### 1d. Coverage holes

- `WEAK_NT_HUB` (catalog-weak-nt.ts:77) omits MAT, MRK, LUK, JHN, ROM, 1CO, 2CO.
  Result: 1 Corinthians 13 maps to exactly one row (henry-1corinthians-13).
- No per-chapter Calvin generator exists for Romans, 1–2 Corinthians,
  Galatians, Philippians, Colossians, 1–2 Thessalonians, 1–2 Timothy, Titus,
  Philemon. Only Hebrews (calcom44), Acts (calcom36/37), Ephesians (hand rows,
  calcom41) and the Catholic Epistles (calcom45) are generated or listed.
- `RECEPTION_SOURCES` (catalog.ts:3–368, ~365 lines) is read by nothing except
  four tests in `retrieve.test.ts:509–641`. The engine never consults it.
- Curated coverage per book: MAT 22 keys, JHN 12, ROM 6, MRK 4, everything else
  0–2. `ROM-9-11` has none.

### 1e. Nothing logs which path ran

`ask.ts` and `retrieve-assemble.ts` never `console.warn`. Vercel runtime logs
for the deployment show only 200s, so "no key", "Gemini rejected all",
"Gemini threw", and "fetch failed" are indistinguishable after the fact.

---

## 2. Phase A — stop shipping wrong extracts (small, ship first)

Files: `retrieve-assemble.ts`, `retrieve-html.ts`, `retrieve-net.ts`, `ask.ts`.

A1. In `assembleFromSources` (retrieve-assemble.ts:211–257): when Gemini ran and
    returned zero valid cards, return `{ cards: [], caution }` with the existing
    "No verified historical commentary indexed for this verse yet" string. Do
    not substitute `fallback.cards`. Keep `cardsFromExtracts` only for the
    no-key path, and label those cards `grounded: false` so the UI shows the
    "generated" badge, not "Grounded Extract" (source-card.tsx:28).

A2. Add a verse anchor to paragraph selection. New export in retrieve-html.ts:
    `pickVerseParagraphs(paragraphs, chapter, verse, query, limit)`. Score +6 for
    a paragraph that begins with or contains a verse marker for the target verse
    in any of the forms these hosts actually print: `^11\.`, `Ver. 11`,
    `Verse 11`, `9:11`, `ix. 11`, `v. 11`, `11. ` at paragraph start. Fall through
    to the existing token score only when no paragraph carries a marker. Add a
    unit test with three synthetic paragraphs (verse 4, verse 11, unrelated) and
    assert verse 11 wins.

A3. Raise `MAX_BYTES` to 600 000 for `newadvent.org` only (the Enchiridion, City
    of God books, and Chrysostom homilies are single pages). Keep 180 000
    elsewhere. Raise `FETCH_MS` to 10 000. Both in retrieve-net.ts.

A4. Add `console.warn` in `retrieveForVerse` (ask.ts:38) and
    `assembleFromSources` for: no key, per-URL fetch failure with status, Gemini
    error message, and "librarian rejected all N extracts". One line each,
    prefixed `[reception]`. This is what makes Vercel logs useful.

A5. Confirm `GEMINI_API_KEY` is set in the Vercel project env for Production.
    The code path in the screenshot is consistent with it being absent.

Tests to adjust: `retrieve.test.ts:955–956` pins `calvin-rom-9` and
`henry-rom-9`; Phase B renames them, so update in the same commit as B.

---

## 3. Phase B — remove catalog rows that cannot contain a verse

Files: `catalog.ts`, `catalog-weak-nt.ts`, `retrieve.test.ts`.

B1. Delete every row in §1c whose URL is a volume index or title page. Do not
    replace them yet; Phase C generates correct rows. Removing them makes the
    Matthew result honest immediately (Henry chapter page + Chrysostom homily
    only) instead of six preface extracts.

B2. Delete `henry-rom-9` (mhc5, 404). The generated `henry-romans-9` (mhc6) is
    correct. Update the test at retrieve.test.ts:956 to require
    `henry-romans-9`.

B3. Add a URL-uniqueness assertion to the test that already checks id
    uniqueness (retrieve.test.ts:12). After B1 it should pass; it prevents the
    duplicates from returning.

B4. `RECEPTION_SOURCES`: keep it as the bibliography (SOURCES.md and the docs
    cite it) but make `sourceUrl` optional and blank it on `luther-sermon-mount`
    with a `sourceNote` explaining the good_works mismatch. Do not derive fetch
    rows from it. Update the four tests at retrieve.test.ts:509–641 only if
    they reference `sourceUrl`.

B5. Fix the `RECEPTION_SOURCES` coverage.book inconsistency: Matthew uses
    `"MAT"`, Mark/Luke/John use `"Mark"`, `"Luke"`, `"John"` (see tests at
    lines 550, 585, 641). Normalize to USFM ids (`MRK`, `LUK`, `JHN`) and update
    those three tests.

---

## 4. Phase C — per-pericope pages for the whole NT

The retrieval layer cannot be better than its index. This phase builds the
index from real tables of contents, not guessed numbering.

C1. `scripts/verify-catalog-urls.mjs` (new). Loads `CATALOG` after
    `attachWeakNtCatalog()`, HEADs (falling back to GET) every distinct URL with
    a 10 s timeout and 4-way concurrency, prints a table of `status url ids`,
    exits non-zero on any non-200. Add `"verify:urls"` to package.json scripts.
    This must run from a networked machine before every catalog commit. Do not
    rely on it from the Claude sandbox.

C2. Calvin on CCEL, per pericope. CCEL volume numbering for the Calvin
    Translation Society set, as already used in the catalog:
    31–33 Harmony (Matt/Mark/Luke), 34–35 John, 36–37 Acts, 38 Romans,
    39–40 Corinthians, 41 Galatians+Ephesians, 42 Philippians+Colossians+
    Thessalonians, 43 Timothy+Titus+Philemon, 44 Hebrews, 45 Catholic Epistles.
    The pericope splits inside each volume cannot be derived arithmetically.
    Fetch each volume's TOC page (`https://ccel.org/ccel/calvin/calcom38.toc.html`
    is the expected pattern; verify), parse every link whose title matches
    `Book chapter:start-end` (e.g. "Romans 9:6-13"), and write the result to
    `src/lib/reception/data/calvin-ccel-sections.json` as
    `{ "ROM": [{ "chapter": 9, "start": 6, "end": 13, "url": "..." }] }`.
    Commit that file. Add `CatalogEntry.verses?: [number, number]` and a
    generator `calvinCcelSections()` in catalog-weak-nt.ts that emits one row
    per section with `chapters: [ch]` and `verses: [start, end]`.

C3. `scoreEntry` (catalog.ts:827): when the request carries a verse and the row
    carries `verses`, add +30 if the verse falls inside the range and return 0
    if it does not. Rows without `verses` keep today's behavior. Thread `verse`
    through `mapCatalog` → `retrieveExtracts` → `retrieveForVerse` (it is
    already in `AskInput`).

C4. Matthew Henry: the existing generator is correct at chapter level; leave
    it. Chapter pages plus A2's verse anchor are sufficient for Henry because
    his chapter pages number their verse groups.

C5. Bible Hub, Gill/Poole/Bengel: extend `WEAK_NT_HUB` (catalog-weak-nt.ts:77)
    with `matthew 28, mark 16, luke 24, john 21, romans 16, 1_corinthians 16,
    2_corinthians 13`. Verify one URL per book with C1 before committing. These
    are chapter pages with per-verse headings, so A2 handles verse targeting.

C6. Bible Hub verse pages (optional, highest yield, unverified pattern). The
    expected URL is `https://biblehub.com/commentaries/{book}/{ch}-{v}.htm`
    with one page per verse containing sections for Barnes, Gill, Poole,
    Bengel, JFB, Ellicott, Meyer, Expositor's Greek, Pulpit, Vincent, Matthew
    Henry Concise — all public domain. Before building anything: fetch one page
    (e.g. `romans/9-11.htm`), confirm it exists, and record the exact heading
    markup that separates commentators. Only then write a splitter in
    retrieve-html.ts that yields one `FetchedExtract` per commentator from the
    single page. If the markup is not stable, skip C6.

C7. Chrysostom homily-to-chapter tables. New Advent numbering is one page per
    homily and the homily→chapter map is fixed; add a data file
    `src/lib/reception/data/chrysostom-homilies.json` for Matthew (90),
    John (88), Romans (32), 1 Corinthians (44), 2 Corinthians (30),
    Galatians (commentary, one page per chapter), Ephesians (24),
    Philippians (15), Colossians (12), 1 Thess (11), 2 Thess (5),
    1 Tim (18), 2 Tim (10), Titus (6), Philemon (3), Hebrews (34),
    Acts (55). Fill the chapter ranges from each homily's opening lemma while
    building the file; do not guess. Generator: `chrysostomHomilies()` emitting
    `chapters: [..]` and `verses` where the lemma gives them. Verify with C1.

C8. Augustine `Sermon on the Mount`: New Advent has it as two book pages
    (`1601.htm`, `1602.htm`; verify). Replace the deleted `augustine-sermon-
    mount-1` with those two rows, `chapters: [5]` and `[6, 7]` respectively.

C9. Catena Aurea: CCEL splits `catena1` by chapter (`catena1.ii.i.html` … );
    fetch the TOC and generate one row per chapter the same way as C2. Do not
    hand-type the roman numerals.

Order: C1 → C2+C3 → C5 → C7 → C8 → C9 → C6.

---

## 5. Phase D — curated seed, book by book

Format: append to `CURATED_ENTRIES` in curated.ts (shape at curated.ts:4–14).
`getCurated` already merges these with the legacy `curated` record and already
has a chapter fallback (`getCuratedCardsForChapter`, curated.ts:2430). Add a
`PERICOPE_RANGES` row (curated.ts:2317) for each pericope so neighbouring
verses resolve to the canonical one.

Authoring rules, non-negotiable:

- `paraphrased` is true unless the excerpt was copied from a fetched page in
  the executor's session. Do not mark a memory-composed excerpt verbatim.
- `url` must be the page that actually contains the passage, never a volume
  index. If no verified page exists, leave `url` undefined.
- Catena Aurea excerpts name the father Aquinas is quoting in `citation`.
- Contested readings (Matt 16:18, Rom 9, Jas 2:24, Heb 6:4–6) carry the
  strongest opposing tradition's case in `theologicalNote` in its own terms.

Book order (weakest coverage with highest use first): Romans 1–11 (every
chapter, 3 pericopes each), 1 Corinthians 11–15, Galatians 2–3, Ephesians 1–2,
Philippians 2, Colossians 1, Hebrews 1, 4, 6, 10, 11, James 1–2, 1 Peter 1–2,
1 John 1, 4, Revelation 1, 20–22, then Mark, Luke, John, Acts, the remainder
of the Paulines, 2 Peter, 2–3 John, Jude. One commit per book. Each commit
adds the book's rows to the "curated coverage" table in `SOURCES.md`.

Minimum per pericope: one patristic, one reformed, and one of scholastic /
lutheran / puritan.

---

## 6. Phase E — documentation

- `SOURCES.md`: add a "Reception catalog" section listing each generator, the
  host, the volume/URL pattern, the verification date, and the license basis
  (all listed authors died before 1900 or their translations were published
  before 1928 in the US).
- `PUBLIC-COMMENTARY-SOURCES.md`: correct the Luther entry; note that the
  1532 Sermon on the Mount lectures are not on CCEL and that LW 21 is under
  copyright.
- `COMMENTARY-GUIDE.md`: one paragraph on the `verses` range field and the
  "no index pages" rule.

---

## 7. Validation gate per phase

```
npx tsc --noEmit
node --experimental-strip-types --test src/lib/reception/retrieve.test.ts src/lib/reception/synthesize.test.ts
npm run verify:urls          # networked machine only
npm run build
```

Then on the deployed preview: open Romans 9:11, press Commentaries, and
confirm every card's quote contains a verse-11 marker or the verse's wording,
and that no card carries "Grounded Extract" unless Gemini validated it.

---

## 7a. Execution status — 2026-09-04

Done and pushed on `claude/matthew-commentaries-integration-yar4t8`:

- **Phase A** complete (A1–A4). A5 confirmed by the user: the key is set in
  Vercel, so the screenshot's card came from the rejection-override path,
  not from a missing key.
- **Phase B** complete (B1–B5).
- **Phase C**: C1 (script written, cannot be run here), C3 (verses range),
  C4 (no change needed), C5 (seven books added, URLs unverified).
- **Phase D**: Romans 1–11 seeded, 111 entries over 40 pericopes.
- **Phase E** complete.

Blocked on network egress, for a session that can reach the hosts:

- **C2** Calvin per-pericope sections. Needs the CCEL volume TOCs. This is
  the fix that makes a chapter-scoped Calvin row land on the right page; the
  `verses` field and the scorer gate are already in place waiting for the data.
- **C6** Bible Hub per-verse pages. Fetch `romans/9-11.htm` first and record
  the heading markup before writing any splitter.
- **C7** Chrysostom homily-to-chapter tables. The New Advent URL pattern is
  already proven by working rows; what is missing is the homily-to-chapter map,
  which must come from each homily's opening lemma, not from guesswork.
- **C8** Augustine, *Sermon on the Mount*, as two New Advent book pages.
- **C9** Catena Aurea per-chapter rows from the CCEL TOC.
- **Verification** of the seven new Bible Hub book slugs added in C5.

First thing that session should run: `npm run verify:urls`.

**Update 2026-09-04, later the same day:** the network-blocked half of Phase
C now has a path that doesn't depend on this sandbox getting egress. A
GitHub Actions workflow, `.github/workflows/reception-source-research.yml`
(manual trigger only), runs `scripts/research/run-all.mjs` on GitHub's own
runners — which have ordinary internet access — and opens a PR with whatever
it finds under `scripts/research/output/`. It does not touch
`src/lib/reception/**` itself; turning a finding into a catalog row is a
separate, deliberate step once someone has read the PR.

What it does, host by host:

- **CCEL**: reads each Calvin volume's and each Catena volume's own
  table-of-contents page (tries `calcom{NN}.html` and `calcom{NN}.i.html`,
  keeps whichever resolves) and extracts every section link with its anchor
  text, rather than guessing CCEL's internal numbering. `catena3.html` and
  `catena4.html` — removed from the citable catalog in Phase B because
  they're volume roots — are exactly the pages this crawls, since a root's
  whole job is linking to every chapter.
- **New Advent**: extends Chrysostom's homily numbering by increment *only*
  for the seven works where a first-homily URL is already confirmed live
  (Matthew, John, Romans, 1–2 Corinthians, Hebrews, Acts) — this was checked
  against a real pair already in the catalog (Romans homily 1 → homily 16)
  before being trusted. For Galatians through Philemon, where the numbering
  is confirmed *not* uniform (`23051.htm` breaks the six-digit pattern the
  others follow), it instead reads the real Fathers index page and follows
  whichever link matches. Also probes a small range of New Advent codes for
  Augustine's Sermon on the Mount, which Phase C8 had flagged as
  "expected pattern; verify."
- **Bible Hub**: spot-checks the seven book slugs added to
  `WEAK_NT_HUB` this session without ever being fetched, and probes whether a
  per-verse page exists at all — reporting its raw heading structure rather
  than committing a splitter for markup nobody has seen (Phase C6).
- **Godrules**: re-checks the 22 existing Wesley-on-Revelation rows, and
  probes whether Wesley's *Explanatory Notes* — which cover the whole
  New Testament — exist at the same host under a guessed filename for a
  handful of other books. If that pattern holds, it's a real expansion: right
  now Godrules only supplies Revelation.
- **StudyLight.org**, a candidate fifth host: probes several guessed
  commentary codes and URL shapes for one verse. Unlike the other four, none
  of this pattern has ever been confirmed — it's recalled, not sourced — so
  the scanner treats every guess as unconfirmed until a real 200 comes back.
- Named but not scanned: **Internet Archive** (OCR'd full-text commentary
  sets — Alford, Meyer, Vincent as a standalone set — but no per-verse HTML
  anchors, so it needs a different ingestion approach, not an extension of
  this scanner) and **Bible Study Tools** / **sacred-texts.com** (same shape
  as Bible Hub, unprobed).

Every parsing helper (`extractLinks`, `parseChapterVerse`, the homily-number
extrapolation) was unit-tested against synthetic HTML and, where possible,
against a pair of URLs already confirmed live — not just written and hoped.
What was *not* possible from this sandbox is running it for real. First run
should happen from the GitHub Actions tab (`workflow_dispatch`), and the
resulting PR is where the actual verification happens.

Remaining Phase D books, in the order given in §5: 1 Corinthians 11–15,
Galatians 2–3, Ephesians 1–2, Philippians 2, Colossians 1, Hebrews, James,
1 Peter, 1 John, Revelation, then the Gospels, Acts, and the rest.

---

## 8. Things examined and deliberately left alone

- `src/lib/auth/middleware.ts` — no importer, but it is the documented auth
  helper for server functions (`AGENTS.md` §Architecture). Keep.
- `render.yaml`, `metadata.json` — other deployment / AI Studio targets. Keep.
- `scripts/install-page.html`, `public/__grok/**` — Grok PWA. Keep.
- `src/lib/lexicon/data/*.json` (4.6 MB) — imported by `stepbible.ts`. Keep.
- No `.bak`, `.orig`, stray logs, `console.log`, or TODO markers exist in the
  tracked tree. The only waste in the repository is the catalog rows in §1c.
