import type { Tradition } from "../bible/types.ts";
import { CATALOG, type CatalogEntry } from "./catalog.ts";

// package.json has sideEffects: false. A bare `import "./catalog-weak-nt"`
// is dropped from the Vercel server bundle. ask.ts must call attachWeakNtCatalog().

function e(
  id: string,
  voice: string,
  work: string,
  tradition: Tradition,
  locus: string,
  url: string,
  tags: string[],
  books?: string[],
  chapters?: number[],
): CatalogEntry {
  return { id, voice, work, tradition, locus, url, tags, books, chapters };
}

const ROMAN = [
  "", "i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x",
  "xi", "xii", "xiii", "xiv", "xv", "xvi", "xvii", "xviii", "xix", "xx",
  "xxi", "xxii", "xxiii", "xxiv", "xxv", "xxvi", "xxvii", "xxviii", "xxix",
] as const;

const REV_CHAPTERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

const HAND: CatalogEntry[] = [
  e("manton-james-1", "Thomas Manton", "Practical Commentary on James", "puritan", "James 1", "https://www.ccel.org/ccel/manton/manton04.iv.html", ["james", "manton", "trials", "patience", "servant"], ["JAS"], [1]),
  e("manton-james-2", "Thomas Manton", "Practical Commentary on James", "puritan", "James 2", "https://www.ccel.org/ccel/manton/manton04.v.html", ["james", "manton", "faith", "works", "poor"], ["JAS"], [2]),
  e("manton-james-3", "Thomas Manton", "Practical Commentary on James", "puritan", "James 3", "https://www.ccel.org/ccel/manton/manton04.vi.html", ["james", "manton", "tongue", "wisdom"], ["JAS"], [3]),
  e("manton-james-4", "Thomas Manton", "Practical Commentary on James", "puritan", "James 4", "https://www.ccel.org/ccel/manton/manton04.vii.html", ["james", "manton", "wars", "humble", "world"], ["JAS"], [4]),
  e("manton-james-5", "Thomas Manton", "Practical Commentary on James", "puritan", "James 5", "https://www.ccel.org/ccel/manton/manton04.viii.html", ["james", "manton", "patience", "prayer", "anoint"], ["JAS"], [5]),
  e("manton-jude-1", "Thomas Manton", "Practical Commentary on Jude", "puritan", "Jude", "https://www.ccel.org/ccel/manton/manton05.v.html", ["jude", "manton", "ungodly", "faith", "contend"], ["JUD"], [1]),
  e("augustine-1john-2", "Augustine", "Homilies on the First Epistle of John 2", "patristic", "Homily 2", "https://www.newadvent.org/fathers/170202.htm", ["john", "love", "world", "augustine"], ["1JN"], [2]),
  e("augustine-1john-3", "Augustine", "Homilies on the First Epistle of John 4", "patristic", "Homily 4", "https://www.newadvent.org/fathers/170204.htm", ["john", "love", "sin", "augustine"], ["1JN"], [3]),
  e("augustine-1john-4", "Augustine", "Homilies on the First Epistle of John 7", "patristic", "Homily 7", "https://www.newadvent.org/fathers/170207.htm", ["john", "love", "god", "augustine"], ["1JN"], [4]),
  e("augustine-1john-5", "Augustine", "Homilies on the First Epistle of John 10", "patristic", "Homily 10", "https://www.newadvent.org/fathers/170210.htm", ["john", "faith", "witness", "augustine"], ["1JN"], [5]),
  e("chrysostom-acts-h4", "John Chrysostom", "Homilies on Acts 4", "patristic", "Homily 4", "https://www.newadvent.org/fathers/210104.htm", ["acts", "pentecost", "spirit", "tongues", "chrysostom"], ["ACT"], [2]),
  e("chrysostom-acts-h19", "John Chrysostom", "Homilies on Acts 19", "patristic", "Homily 19", "https://www.newadvent.org/fathers/210119.htm", ["acts", "saul", "conversion", "damascus", "chrysostom"], ["ACT"], [9]),
  e("chrysostom-acts-h32", "John Chrysostom", "Homilies on Acts 32", "patristic", "Homily 32", "https://www.newadvent.org/fathers/210132.htm", ["acts", "council", "gentiles", "yoke", "chrysostom"], ["ACT"], [15]),
  e("chrysostom-acts-h38", "John Chrysostom", "Homilies on Acts 38", "patristic", "Homily 38", "https://www.newadvent.org/fathers/210138.htm", ["acts", "athens", "unknown", "altar", "chrysostom"], ["ACT"], [17]),
  e("chrysostom-acts-h55", "John Chrysostom", "Homilies on Acts 55", "patristic", "Homily 55", "https://www.newadvent.org/fathers/210155.htm", ["acts", "rome", "paul", "kingdom", "chrysostom"], ["ACT"], [28]),
  e("chrysostom-heb-h4", "John Chrysostom", "Homilies on Hebrews 4", "patristic", "Homily 4", "https://www.newadvent.org/fathers/240204.htm", ["hebrews", "angels", "salvation", "chrysostom"], ["HEB"], [2]),
  e("chrysostom-heb-h8", "John Chrysostom", "Homilies on Hebrews 8", "patristic", "Homily 8", "https://www.newadvent.org/fathers/240208.htm", ["hebrews", "priest", "melchizedek", "chrysostom"], ["HEB"], [5]),
  e("chrysostom-heb-h13", "John Chrysostom", "Homilies on Hebrews 13", "patristic", "Homily 13", "https://www.newadvent.org/fathers/240213.htm", ["hebrews", "priest", "oath", "chrysostom"], ["HEB"], [7]),
  e("chrysostom-heb-h15", "John Chrysostom", "Homilies on Hebrews 15", "patristic", "Homily 15", "https://www.newadvent.org/fathers/240215.htm", ["hebrews", "covenant", "blood", "chrysostom"], ["HEB"], [9]),
  e("chrysostom-heb-h19", "John Chrysostom", "Homilies on Hebrews 19", "patristic", "Homily 19", "https://www.newadvent.org/fathers/240219.htm", ["hebrews", "veil", "boldness", "chrysostom"], ["HEB"], [10]),
  e("chrysostom-heb-h22", "John Chrysostom", "Homilies on Hebrews 22", "patristic", "Homily 22", "https://www.newadvent.org/fathers/240222.htm", ["hebrews", "faith", "witnesses", "chrysostom"], ["HEB"], [11]),
  e("chrysostom-heb-h28", "John Chrysostom", "Homilies on Hebrews 28", "patristic", "Homily 28", "https://www.newadvent.org/fathers/240228.htm", ["hebrews", "discipline", "zion", "chrysostom"], ["HEB"], [12]),
  e("chrysostom-heb-h33", "John Chrysostom", "Homilies on Hebrews 33", "patristic", "Homily 33", "https://www.newadvent.org/fathers/240233.htm", ["hebrews", "altar", "outside", "chrysostom"], ["HEB"], [13]),
  e("victorinus-revelation-more", "Victorinus", "Commentary on the Apocalypse", "patristic", "In Apocalypsin", "https://www.newadvent.org/fathers/0712.htm", ["revelation", "apocalypse", "victorinus"], ["REV"], REV_CHAPTERS),
  e("hippolytus-antichrist-rev", "Hippolytus", "On Christ and Antichrist", "patristic", "De Christo et Antichristo", "https://www.newadvent.org/fathers/0516.htm", ["revelation", "apocalypse", "antichrist", "beast", "hippolytus"], ["REV"], [13, 17, 20]),
  e("irenaeus-ah5-30-rev", "Irenaeus", "Against Heresies 5.30", "patristic", "Adv. Haer. 5.30", "https://www.newadvent.org/fathers/0103530.htm", ["revelation", "beast", "number", "irenaeus"], ["REV"], [13]),
  e("irenaeus-ah5-36-rev", "Irenaeus", "Against Heresies 5.36", "patristic", "Adv. Haer. 5.36", "https://www.newadvent.org/fathers/0103536.htm", ["revelation", "new", "heaven", "earth", "irenaeus"], ["REV"], [21]),
  e("augustine-civdei-20-rev", "Augustine", "City of God 20", "patristic", "De civitate Dei 20", "https://www.newadvent.org/fathers/120120.htm", ["revelation", "millennium", "thousand", "augustine"], ["REV"], [20]),
];

const CALVIN_CATHOLIC_CHAPTERS: Array<[string, string, string, number, string]> = [
  ["calvin-james-2", "James", "JAS", 2, "calcom45.vi.iii.i.html"],
  ["calvin-james-3", "James", "JAS", 3, "calcom45.vi.iv.i.html"],
  ["calvin-james-4", "James", "JAS", 4, "calcom45.vi.v.i.html"],
  ["calvin-james-5", "James", "JAS", 5, "calcom45.vi.vi.i.html"],
  ["calvin-1peter-2", "1 Peter", "1PE", 2, "calcom45.iv.iii.i.html"],
  ["calvin-1peter-3", "1 Peter", "1PE", 3, "calcom45.iv.iv.i.html"],
  ["calvin-1peter-4", "1 Peter", "1PE", 4, "calcom45.iv.v.i.html"],
  ["calvin-1peter-5", "1 Peter", "1PE", 5, "calcom45.iv.vi.i.html"],
  ["calvin-2peter-2", "2 Peter", "2PE", 2, "calcom45.vii.iii.i.html"],
  ["calvin-2peter-3", "2 Peter", "2PE", 3, "calcom45.vii.iv.i.html"],
  ["calvin-1john-2", "1 John", "1JN", 2, "calcom45.v.iii.i.html"],
  ["calvin-1john-3", "1 John", "1JN", 3, "calcom45.v.iv.i.html"],
  ["calvin-1john-4", "1 John", "1JN", 4, "calcom45.v.v.i.html"],
  ["calvin-1john-5", "1 John", "1JN", 5, "calcom45.v.vi.i.html"],
];

const WEAK_NT_HUB = [
  // Gospels, Romans and the Corinthian letters. Before this they had only the
  // Matthew Henry chapter pages, so 1 Corinthians 13 mapped to a single row.
  ["matthew", "MAT", "Matthew", 28],
  ["mark", "MRK", "Mark", 16],
  ["luke", "LUK", "Luke", 24],
  ["john", "JHN", "John", 21],
  ["romans", "ROM", "Romans", 16],
  ["1_corinthians", "1CO", "1 Corinthians", 16],
  ["2_corinthians", "2CO", "2 Corinthians", 13],
  ["james", "JAS", "James", 5],
  ["1_peter", "1PE", "1 Peter", 5],
  ["2_peter", "2PE", "2 Peter", 3],
  ["1_john", "1JN", "1 John", 5],
  ["2_john", "2JN", "2 John", 1],
  ["3_john", "3JN", "3 John", 1],
  ["jude", "JUD", "Jude", 1],
  ["revelation", "REV", "Revelation", 22],
  ["hebrews", "HEB", "Hebrews", 13],
  ["acts", "ACT", "Acts", 28],
  ["galatians", "GAL", "Galatians", 6],
  ["ephesians", "EPH", "Ephesians", 6],
  ["philippians", "PHP", "Philippians", 4],
  ["colossians", "COL", "Colossians", 4],
  ["1_thessalonians", "1TH", "1 Thessalonians", 5],
  ["2_thessalonians", "2TH", "2 Thessalonians", 3],
  ["1_timothy", "1TI", "1 Timothy", 6],
  ["2_timothy", "2TI", "2 Timothy", 4],
  ["titus", "TIT", "Titus", 3],
  ["philemon", "PHM", "Philemon", 1],
] as const;

const HUB_VOICES = [
  ["gill", "John Gill", "Exposition of the Entire Bible", "reformed", "gill"],
  ["poole", "Matthew Poole", "Annotations upon the Holy Bible", "puritan", "poole"],
  ["bengel", "Johann Albrecht Bengel", "Gnomon of the New Testament", "lutheran", "bengel"],
] as const;

function generated(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const [id, name, bookId, ch, file] of CALVIN_CATHOLIC_CHAPTERS) {
    if (have.has(id)) continue;
    out.push(
      e(id, "John Calvin", `Commentary on ${name}`, "reformed", `${name} ${ch}`, `https://ccel.org/ccel/calvin/calcom45/${file}`, [name.toLowerCase().replace(/^\\d+\\s+/, ""), "calvin"], [bookId], [ch]),
    );
  }
  for (let ch = 1; ch <= 13; ch++) {
    const id = `calvin-hebrews-${ch}`;
    if (have.has(id)) continue;
    const file = ROMAN[ch + 6];
    if (!file) continue;
    out.push(e(id, "John Calvin", "Commentary on Hebrews", "reformed", `Hebrews ${ch}`, `https://ccel.org/ccel/calvin/calcom44/calcom44.${file}.i.html`, ["hebrews", "calvin"], ["HEB"], [ch]));
  }
  for (let ch = 1; ch <= 28; ch++) {
    const id = `calvin-acts-${ch}`;
    if (have.has(id)) continue;
    if (ch <= 13) {
      const file = ROMAN[ch + 7];
      if (!file) continue;
      out.push(e(id, "John Calvin", "Commentary on Acts", "reformed", `Acts ${ch}`, `https://ccel.org/ccel/calvin/calcom36/calcom36.${file}.i.html`, ["acts", "calvin", "apostles"], ["ACT"], [ch]));
    } else {
      const file = ROMAN[ch - 12];
      if (!file) continue;
      out.push(e(id, "John Calvin", "Commentary on Acts", "reformed", `Acts ${ch}`, `https://ccel.org/ccel/calvin/calcom37/calcom37.${file}.i.html`, ["acts", "calvin", "apostles"], ["ACT"], [ch]));
    }
  }
  // Revelation extras first so Wesley / Geneva are not crowded out by three Hub voices.
  for (const ch of REV_CHAPTERS) {
    const wesleyId = `wesley-revelation-${ch}`;
    if (!have.has(wesleyId)) {
      out.push(
        e(
          wesleyId,
          "John Wesley",
          "Explanatory Notes upon the New Testament",
          "reformed",
          `Revelation ${ch}`,
          `https://www.godrules.net/library/wesley/wesleyrev${ch}.htm`,
          ["revelation", "wesley"],
          ["REV"],
          [ch],
        ),
      );
    }
    const genevaId = `geneva-revelation-${ch}`;
    if (!have.has(genevaId)) {
      out.push(
        e(
          genevaId,
          "Geneva Bible",
          "Geneva Bible Notes",
          "reformed",
          `Revelation ${ch}`,
          `https://biblehub.com/geneva/revelation/${ch}.htm`,
          ["revelation", "geneva", "reformer"],
          ["REV"],
          [ch],
        ),
      );
    }
  }
  for (const [slug, bookId, name, chapters] of WEAK_NT_HUB) {
    const tag = name.toLowerCase().replace(/^\\d+\\s+/, "");
    for (const [stem, voice, work, tradition, voiceTag] of HUB_VOICES) {
      for (let ch = 1; ch <= chapters; ch++) {
        const id = `${stem}-${slug.replace(/_/g, "")}-${ch}`;
        if (have.has(id)) continue;
        out.push(
          e(id, voice, work, tradition, `${name} ${ch}`, `https://biblehub.com/commentaries/${stem}/${slug}/${ch}.htm`, [tag, voiceTag], [bookId], [ch]),
        );
      }
    }
  }
  return out;
}

/** Append weak-NT pointers onto the shared CATALOG array. mapCatalog reads CATALOG at call time. */
export function attachWeakNtCatalog(): void {
  const have = new Set(CATALOG.map((row) => row.id));
  for (const row of [...HAND, ...generated(have)]) {
    if (have.has(row.id)) continue;
    CATALOG.push(row);
    have.add(row.id);
  }
}
