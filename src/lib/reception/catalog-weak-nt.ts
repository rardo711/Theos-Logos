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
