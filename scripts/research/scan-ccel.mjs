/**
 * Discovers per-pericope Calvin pages and per-chapter Catena Aurea pages on
 * CCEL by reading each volume's own table-of-contents page — not by guessing
 * a numbering scheme. CCEL's own numbering is not uniform enough to trust:
 * calcom31's TOC is at "calcom31.i.html" but calcom34's is at "calcom34.html"
 * (both confirmed working URLs already in the catalog), so this tries both
 * shapes per volume and keeps whichever one actually resolves.
 *
 * catena3.html and catena4.html (Luke, John) were removed from the citable
 * catalog in an earlier pass because they're volume roots, not commentary —
 * but a volume root is exactly what a discovery crawler wants: it's the page
 * whose whole job is linking to every chapter section.
 */
import { politeGet, extractLinks, parseChapterVerse } from "./lib/fetch.mjs";

// era: which book(s) live in the volume, per the Calvin Translation Society's
// own front matter, as recorded in RECEPTION-PLAN.md Phase C2. Only calcom38
// (Romans) has been hand-verified against a real fetch in this project so
// far; the rest is carried over from that plan, unverified until this runs.
const CALVIN_VOLUMES = [
  { vol: "calcom31", books: ["MAT", "MRK", "LUK"], label: "Harmony of the Evangelists, vol. 1" },
  { vol: "calcom32", books: ["MAT", "MRK", "LUK"], label: "Harmony of the Evangelists, vol. 2" },
  { vol: "calcom33", books: ["MAT", "MRK", "LUK"], label: "Harmony of the Evangelists, vol. 3" },
  { vol: "calcom34", books: ["JHN"], label: "John, vol. 1" },
  { vol: "calcom35", books: ["JHN"], label: "John, vol. 2" },
  { vol: "calcom36", books: ["ACT"], label: "Acts, vol. 1" },
  { vol: "calcom37", books: ["ACT"], label: "Acts, vol. 2" },
  { vol: "calcom38", books: ["ROM"], label: "Romans" },
  { vol: "calcom39", books: ["1CO"], label: "1 Corinthians" },
  { vol: "calcom40", books: ["2CO"], label: "2 Corinthians" },
  { vol: "calcom41", books: ["GAL", "EPH"], label: "Galatians and Ephesians" },
  { vol: "calcom42", books: ["PHP", "COL", "1TH", "2TH"], label: "Philippians, Colossians, Thessalonians" },
  { vol: "calcom43", books: ["1TI", "2TI", "TIT", "PHM"], label: "Timothy, Titus, Philemon" },
  { vol: "calcom44", books: ["HEB"], label: "Hebrews" },
  { vol: "calcom45", books: ["JAS", "1PE", "2PE", "1JN"], label: "Catholic Epistles" },
];

const CATENA_VOLUMES = [
  { vol: "catena1", books: ["MAT"], label: "Catena Aurea on Matthew" },
  { vol: "catena2", books: ["MRK"], label: "Catena Aurea on Mark" },
  { vol: "catena3", books: ["LUK"], label: "Catena Aurea on Luke" },
  { vol: "catena4", books: ["JHN"], label: "Catena Aurea on John" },
];

const ROOT_CANDIDATES = (vol) => [`https://ccel.org/ccel/calvin/${vol}.html`, `https://ccel.org/ccel/calvin/${vol}/${vol}.i.html`];
const CATENA_ROOT_CANDIDATES = (vol) => [`https://www.ccel.org/ccel/aquinas/${vol}.html`];

async function findRoot(candidates) {
  for (const url of candidates) {
    const res = await politeGet(url);
    if (res.ok) return { url: res.url, html: res.text };
  }
  return null;
}

function samVolumeLink(vol) {
  return (href) => href.includes(`/${vol}/`) || href.includes(`/${vol}.`);
}

async function scanVolume(entry, rootCandidates, hostLabel) {
  const root = await findRoot(rootCandidates);
  if (!root) {
    return {
      volume: entry.vol,
      label: entry.label,
      books: entry.books,
      status: "no-root-found",
      triedRoots: rootCandidates,
      sections: [],
    };
  }
  const links = extractLinks(root.html, root.url, samVolumeLink(entry.vol)).filter(
    (l) => /\.html?$/.test(l.href) && l.text.length > 0,
  );
  const seen = new Set();
  const sections = [];
  for (const l of links) {
    if (seen.has(l.href)) continue;
    seen.add(l.href);
    sections.push({ url: l.href, anchorText: l.text, parsed: parseChapterVerse(l.text) });
  }
  return {
    volume: entry.vol,
    label: entry.label,
    books: entry.books,
    status: sections.length ? "root-found" : "root-found-no-links",
    rootUrl: root.url,
    sectionCount: sections.length,
    sections,
  };
}

export async function scanCcel() {
  const calvin = [];
  for (const v of CALVIN_VOLUMES) {
    calvin.push(await scanVolume(v, ROOT_CANDIDATES(v.vol), "ccel"));
  }
  const catena = [];
  for (const v of CATENA_VOLUMES) {
    catena.push(await scanVolume(v, CATENA_ROOT_CANDIDATES(v.vol), "ccel-aquinas"));
  }
  return { host: "ccel.org", generatedAt: new Date().toISOString(), calvin, catena };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = await scanCcel();
  console.log(JSON.stringify(result, null, 2));
}
