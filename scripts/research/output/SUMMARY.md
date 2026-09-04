# Reception source discovery — run summary

Generated 2026-09-04T10:56:05.227Z by `scripts/research/run-all.mjs` in GitHub Actions.

This is a research report, not a catalog change. Nothing under
`src/lib/reception/` was touched by this run. Turning a finding below
into a catalog row is a separate, deliberate step — see
`RECEPTION-PLAN.md` Phase C for the rules (no volume-index pages, no
duplicate URLs, every row backed by a real 200).

## CCEL — Calvin and Catena Aurea

Found a working table-of-contents for 15/15 Calvin volumes, 30 candidate section links total.
Found a working table-of-contents for 2/4 Catena volumes, 2 candidate section links total.

| Volume | Books | Status | Sections |
|---|---|---|---|
| calcom31 | MAT, MRK, LUK | root-found | 2 |
| calcom32 | MAT, MRK, LUK | root-found | 2 |
| calcom33 | MAT, MRK, LUK | root-found | 2 |
| calcom34 | JHN | root-found | 2 |
| calcom35 | JHN | root-found | 2 |
| calcom36 | ACT | root-found | 2 |
| calcom37 | ACT | root-found | 2 |
| calcom38 | ROM | root-found | 2 |
| calcom39 | 1CO | root-found | 2 |
| calcom40 | 2CO | root-found | 2 |
| calcom41 | GAL, EPH | root-found | 2 |
| calcom42 | PHP, COL, 1TH, 2TH | root-found | 2 |
| calcom43 | 1TI, 2TI, TIT, PHM | root-found | 2 |
| calcom44 | HEB | root-found | 2 |
| calcom45 | JAS, 1PE, 2PE, 1JN | root-found | 2 |
| catena1 | MAT | root-found | 1 |
| catena2 | MRK | root-found | 1 |
| catena3 | LUK | no-root-found | 0 |
| catena4 | JHN | no-root-found | 0 |

**Before trusting any CCEL section link above:** the `anchorText` on a
table-of-contents page is not always "Book Chapter:Verse" — some CCEL
volumes label sections by argument/theme instead. Check `parsed` is
non-null for a row before using it; a null `parsed` means the anchor text
didn't match the chapter:verse regex and needs a human to read it.

## New Advent — Chrysostom and Augustine

- **Chrysostom: Homilies on Matthew**: extended to 90 confirmed homily page(s) by incrementing the known seed.
- **Chrysostom: Homilies on John**: extended to 88 confirmed homily page(s) by incrementing the known seed.
- **Chrysostom: Homilies on Romans**: extended to 32 confirmed homily page(s) by incrementing the known seed.
- **Chrysostom: Homilies on 1 Corinthians**: extended to 44 confirmed homily page(s) by incrementing the known seed.
- **Chrysostom: Homilies on 2 Corinthians**: extended to 30 confirmed homily page(s) by incrementing the known seed.
- **Chrysostom: Homilies on Hebrews**: extended to 34 confirmed homily page(s) by incrementing the known seed.
- **Chrysostom: Homilies on Acts**: extended to 55 confirmed homily page(s) by incrementing the known seed.
- Fathers index matched 0 Chrysostom link(s); 0 resolved to a per-homily contents page for a still-uncovered book.
- Augustine Sermon on the Mount: found 1 matching page(s): https://www.newadvent.org/fathers/1601.htm

## Bible Hub

All 21 of the 7 new book slugs added this session resolve.
- Per-verse page confirmed at https://biblehub.com/commentaries/romans/9-11.htm (63935 bytes). Headings found: (none matched h1-h4). A human should open this URL and decide whether the markup is stable enough for a splitter (Phase C6).

## Godrules

All 22 existing Wesley Revelation rows still resolve.

## Adam Clarke (swapped in for Wesley-beyond-Revelation)

Wesley's Notes draw heavily on Bengel, already indexed separately, so
expanding Wesley coverage would mostly duplicate an existing voice.
Clarke is independent and the catalog has no Arminian/Methodist voice
at all yet. Checked against the two leads already recorded in
PUBLIC-COMMENTARY-SOURCES.md rather than fresh guesses:

- **Bible Hub**: confirmed at https://biblehub.com/commentaries/clarke/romans/9.htm. Same path shape already proven for Gill/Poole/Bengel — if this holds across books, it slots straight into the existing HUB_VOICES generator in catalog-weak-nt.ts.
- **CCEL**: none of the candidate landing-page URLs resolved (tried: https://ccel.org/ccel/clarke/commentary, https://ccel.org/ccel/clarke/commentary.html, https://ccel.org/ccel/clarke/commentary/commentary.html).
- **Godrules**: confirmed at https://www.godrules.net/library/clarke/clarkerom9.htm.

## StudyLight.org (candidate fifth host)

None of the 18 guessed URL/code combinations resolved. The commentary codes and path shape used here were recalled, not sourced — this needs someone to actually open studylight.org and read a real commentary URL rather than more guessing.

## Other candidate sources not scanned here

- **Internet Archive (archive.org)** has full-text OCR editions of several
  major public-domain commentary sets not covered anywhere in this catalog
  (Alford's Greek Testament, Meyer's Critical and Exegetical Commentary,
  Vincent's Word Studies as a standalone set, Lightfoot). Worth pursuing,
  but OCR'd scanned-book text has no per-verse HTML anchors the way CCEL
  or Bible Hub do, so it needs a different ingestion approach (locate the
  verse in running OCR text) rather than an extension of this scanner.
- **Bible Study Tools** and **sacred-texts.com** are the same shape as
  Bible Hub / StudyLight and would slot into the same generator pattern;
  neither has been probed yet.
