/**
 * Runs every scan-*.mjs, writes each result to scripts/research/output/, and
 * writes a SUMMARY.md that separates confirmed hits from things still
 * needing a human or a follow-up Claude session to look at the diff before
 * any of it is turned into catalog rows. This script only fetches and
 * reports; it never edits src/lib/reception/** itself.
 */
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { scanCcel } from "./scan-ccel.mjs";
import { scanNewAdvent } from "./scan-newadvent.mjs";
import { scanBibleHub } from "./scan-biblehub.mjs";
import { scanGodrules } from "./scan-godrules.mjs";
import { probeStudyLight } from "./scan-studylight.mjs";

const OUT_DIR = new URL("./output/", import.meta.url).pathname;

async function runSafely(name, fn) {
  try {
    return { name, ok: true, data: await fn() };
  } catch (err) {
    return { name, ok: false, error: err instanceof Error ? err.stack : String(err) };
  }
}

function countCcelSections(ccel) {
  const total = (rows) => rows.reduce((sum, r) => sum + (r.sections?.length ?? 0), 0);
  return { calvinSections: total(ccel.calvin), catenaSections: total(ccel.catena) };
}

function summarize(results) {
  const byName = Object.fromEntries(results.map((r) => [r.name, r]));
  const lines = [
    "# Reception source discovery — run summary",
    "",
    `Generated ${new Date().toISOString()} by \`scripts/research/run-all.mjs\` in GitHub Actions.`,
    "",
    "This is a research report, not a catalog change. Nothing under",
    "`src/lib/reception/` was touched by this run. Turning a finding below",
    "into a catalog row is a separate, deliberate step — see",
    "`RECEPTION-PLAN.md` Phase C for the rules (no volume-index pages, no",
    "duplicate URLs, every row backed by a real 200).",
    "",
    "## CCEL — Calvin and Catena Aurea",
    "",
  ];

  if (byName.ccel?.ok) {
    const { calvin, catena } = byName.ccel.data;
    const { calvinSections, catenaSections } = countCcelSections(byName.ccel.data);
    lines.push(`Found a working table-of-contents for ${calvin.filter((v) => v.status !== "no-root-found").length}/${calvin.length} Calvin volumes, ${calvinSections} candidate section links total.`);
    lines.push(`Found a working table-of-contents for ${catena.filter((v) => v.status !== "no-root-found").length}/${catena.length} Catena volumes, ${catenaSections} candidate section links total.`);
    lines.push("");
    lines.push("| Volume | Books | Status | Sections |");
    lines.push("|---|---|---|---|");
    for (const v of [...calvin, ...catena]) {
      lines.push(`| ${v.volume} | ${v.books.join(", ")} | ${v.status} | ${v.sections?.length ?? 0} |`);
    }
  } else {
    lines.push(`Scan failed: ${byName.ccel?.error ?? "unknown error"}`);
  }

  lines.push("", "**Before trusting any CCEL section link above:** the `anchorText` on a", "table-of-contents page is not always \"Book Chapter:Verse\" — some CCEL", "volumes label sections by argument/theme instead. Check `parsed` is", "non-null for a row before using it; a null `parsed` means the anchor text", "didn't match the chapter:verse regex and needs a human to read it.", "");

  lines.push("## New Advent — Chrysostom and Augustine", "");
  if (byName.newadvent?.ok) {
    const { chrysostomNumeric, chrysostomFromIndex, augustineSermonOnTheMount } = byName.newadvent.data;
    for (const work of chrysostomNumeric) {
      lines.push(`- **${work.work}**: extended to ${work.homilies.length} confirmed homily page(s) by incrementing the known seed.`);
    }
    if (chrysostomFromIndex.status === "ok") {
      lines.push(`- Fathers index matched ${chrysostomFromIndex.matchedLinks} Chrysostom link(s); ${chrysostomFromIndex.works.filter((w) => w.status === "contents-page").length} resolved to a per-homily contents page for a still-uncovered book.`);
      for (const w of chrysostomFromIndex.works) {
        lines.push(`  - "${w.anchorText}" (${w.books.join(", ") || "book unclear"}) -> ${w.status}${w.homilies ? `, ${w.homilies.length} homily link(s)` : ""}`);
      }
    } else {
      lines.push(`- Fathers index scan: ${chrysostomFromIndex.status}`);
    }
    lines.push(
      augustineSermonOnTheMount.hits.length
        ? `- Augustine Sermon on the Mount: found ${augustineSermonOnTheMount.hits.length} matching page(s): ${augustineSermonOnTheMount.hits.map((h) => h.url).join(", ")}`
        : `- Augustine Sermon on the Mount: no match in the ${augustineSermonOnTheMount.candidatesChecked} candidate pages checked. Needs a different code range or a search of the Fathers index.`,
    );
  } else {
    lines.push(`Scan failed: ${byName.newadvent?.error ?? "unknown error"}`);
  }

  lines.push("", "## Bible Hub", "");
  if (byName.biblehub?.ok) {
    const { newSlugVerification, versePageProbe } = byName.biblehub.data;
    const bad = newSlugVerification.filter((r) => !r.ok);
    lines.push(
      bad.length
        ? `**${bad.length}/${newSlugVerification.length} of the 7 new book slugs added this session are BROKEN and should be removed from catalog-weak-nt.ts:**`
        : `All ${newSlugVerification.length} of the 7 new book slugs added this session resolve.`,
    );
    for (const r of bad) lines.push(`  - ${r.voice}/${r.slug} -> ${r.url} (status ${r.status})`);
    lines.push(
      versePageProbe.found
        ? `- Per-verse page confirmed at ${versePageProbe.url} (${versePageProbe.bodyLength} bytes). Headings found: ${versePageProbe.headings.join(" | ") || "(none matched h1-h4)"}. A human should open this URL and decide whether the markup is stable enough for a splitter (Phase C6).`
        : `- No per-verse page found at the candidate URLs tried. Phase C6 (Bible Hub verse pages) is not viable with the current guesses; skip it.`,
    );
  } else {
    lines.push(`Scan failed: ${byName.biblehub?.error ?? "unknown error"}`);
  }

  lines.push("", "## Godrules", "");
  if (byName.godrules?.ok) {
    const { existingRevelationRows, otherBookProbe } = byName.godrules.data;
    const bad = existingRevelationRows.filter((r) => !r.ok);
    lines.push(bad.length ? `${bad.length}/22 existing Wesley Revelation rows are now broken.` : "All 22 existing Wesley Revelation rows still resolve.");
    const hits = otherBookProbe.filter((r) => r.ok);
    lines.push(
      hits.length
        ? `Wesley's Notes on other NT books found at the same naming pattern: ${hits.map((h) => `${h.bookId} (${h.url})`).join(", ")}. This is a real expansion opportunity — worth building a full per-chapter generator the same way Revelation already has one.`
        : "No other book matched the guessed filename pattern; Wesley coverage beyond Revelation would need a different discovery approach (e.g. reading Godrules' own book index).",
    );
  } else {
    lines.push(`Scan failed: ${byName.godrules?.error ?? "unknown error"}`);
  }

  lines.push("", "## StudyLight.org (candidate fifth host)", "");
  if (byName.studylight?.ok) {
    const { hits, tried } = byName.studylight.data;
    lines.push(
      hits.length
        ? `${hits.length}/${tried} guessed URL(s) resolved. Candidate pattern confirmed enough to design a generator on, following the Bible Hub model: ${hits.map((h) => h.url).join(", ")}`
        : `None of the ${tried} guessed URL/code combinations resolved. The commentary codes and path shape used here were recalled, not sourced — this needs someone to actually open studylight.org and read a real commentary URL rather than more guessing.`,
    );
  } else {
    lines.push(`Scan failed: ${byName.studylight?.error ?? "unknown error"}`);
  }

  lines.push(
    "",
    "## Other candidate sources not scanned here",
    "",
    "- **Internet Archive (archive.org)** has full-text OCR editions of several",
    "  major public-domain commentary sets not covered anywhere in this catalog",
    "  (Alford's Greek Testament, Meyer's Critical and Exegetical Commentary,",
    "  Vincent's Word Studies as a standalone set, Lightfoot). Worth pursuing,",
    "  but OCR'd scanned-book text has no per-verse HTML anchors the way CCEL",
    "  or Bible Hub do, so it needs a different ingestion approach (locate the",
    "  verse in running OCR text) rather than an extension of this scanner.",
    "- **Bible Study Tools** and **sacred-texts.com** are the same shape as",
    "  Bible Hub / StudyLight and would slot into the same generator pattern;",
    "  neither has been probed yet.",
    "",
  );

  return lines.join("\n");
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const results = await Promise.all([
    runSafely("ccel", scanCcel),
    runSafely("newadvent", scanNewAdvent),
    runSafely("biblehub", scanBibleHub),
    runSafely("godrules", scanGodrules),
    runSafely("studylight", probeStudyLight),
  ]);

  for (const r of results) {
    const file = path.join(OUT_DIR, `${r.name}.json`);
    await writeFile(file, JSON.stringify(r.ok ? r.data : { error: r.error }, null, 2));
  }

  const summary = summarize(results);
  await writeFile(path.join(OUT_DIR, "SUMMARY.md"), summary);

  const failed = results.filter((r) => !r.ok);
  console.log(summary);
  if (failed.length) {
    console.error(`\n${failed.length} scanner(s) threw: ${failed.map((f) => f.name).join(", ")}`);
  }
}

main();
