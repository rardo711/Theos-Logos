import type { Tradition } from "../bible/types.ts";

export interface ReceptionSource {
  id: string;
  author: string;
  shortName: string;
  title: string;
  year: number;
  era: "patristic" | "medieval" | "reformation" | "puritan";
  tradition:
    | "eastern-patristic"
    | "western-patristic"
    | "scholastic"
    | "reformed"
    | "lutheran";
  coverage: {
    book: string;
    chapters: number[];
    verseByVerse: boolean;
  };
  license: "public-domain";
  /**
   * Public page for the edition. Omitted when no public-domain edition has
   * been verified: the desk prints no link rather than a wrong one.
   */
  sourceUrl?: string;
  /** Provenance caveat for the docs. Not shown in the reader. */
  sourceNote?: string;
}

export const RECEPTION_SOURCES: ReceptionSource[] = [
  // ---------------------------------------------------------------- Romans
  {
    id: "chrysostom-romans-homilies",
    author: "John Chrysostom",
    shortName: "Chrysostom",
    title: "Homilies on the Epistle of St. Paul to the Romans",
    year: 391,
    era: "patristic",
    tradition: "eastern-patristic",
    coverage: { book: "ROM", chapters: Array.from({ length: 16 }, (_, i) => i + 1), verseByVerse: true },
    license: "public-domain",
    sourceNote:
      "Thirty-two homilies, NPNF 1/11, tr. J. B. Morris and W. H. Simcox, rev. George B. Stevens (1889). Indexed on New Advent one page per homily.",
  },
  {
    id: "augustine-simplicianum",
    author: "Augustine of Hippo",
    shortName: "Augustine",
    title: "To Simplician, On Various Questions, Book I",
    year: 396,
    era: "patristic",
    tradition: "western-patristic",
    coverage: { book: "ROM", chapters: [7, 9], verseByVerse: false },
    license: "public-domain",
    sourceNote:
      "The work in which Augustine abandoned election on foreseen faith, by his own account in Retractations II.1. Question 2 treats Romans 9 directly.",
  },
  {
    id: "aquinas-romans",
    author: "Thomas Aquinas",
    shortName: "Aquinas",
    title: "Lectures on the Letter to the Romans",
    year: 1273,
    era: "medieval",
    tradition: "scholastic",
    coverage: { book: "ROM", chapters: Array.from({ length: 16 }, (_, i) => i + 1), verseByVerse: true },
    license: "public-domain",
    sourceNote:
      "Super Epistolam ad Romanos, a reportatio of Aquinas's own lectures and his own commentary, not the compiled Catena. Cite it as his voice, unlike the Catena Aurea.",
  },
  {
    id: "luther-romans",
    author: "Martin Luther",
    shortName: "Luther",
    title: "Lectures on Romans",
    year: 1516,
    era: "reformation",
    tradition: "lutheran",
    coverage: { book: "ROM", chapters: Array.from({ length: 16 }, (_, i) => i + 1), verseByVerse: true },
    license: "public-domain",
    sourceNote:
      "The 1515-16 Wittenberg lectures (WA 56), rediscovered in 1908. The widely used Pauck translation is under copyright; the German and Latin text is not.",
  },
  {
    id: "calvin-romans",
    author: "John Calvin",
    shortName: "Calvin",
    title: "Commentary on the Epistle to the Romans",
    year: 1540,
    era: "reformation",
    tradition: "reformed",
    coverage: { book: "ROM", chapters: Array.from({ length: 16 }, (_, i) => i + 1), verseByVerse: true },
    license: "public-domain",
    sourceNote:
      "Calvin's first commentary. Tr. John Owen for the Calvin Translation Society (1849); CCEL calcom38, split by pericope rather than by chapter.",
  },
  {
    id: "poole-annotations",
    author: "Matthew Poole",
    shortName: "Poole",
    title: "Annotations upon the Holy Bible",
    year: 1685,
    era: "puritan",
    tradition: "reformed",
    coverage: { book: "ROM", chapters: Array.from({ length: 16 }, (_, i) => i + 1), verseByVerse: true },
    license: "public-domain",
    sourceNote:
      "Published posthumously; Poole died in 1679 having reached Isaiah 58, and colleagues completed the New Testament from his notes.",
  },

  {
    id: "chrysostom-matthew",
    author: "John Chrysostom",
    shortName: "Chrysostom",
    title: "Homilies on the Gospel of Saint Matthew",
    year: 390,
    era: "patristic",
    tradition: "eastern-patristic",
    coverage: {
      book: "MAT",
      chapters: Array.from({ length: 28 }, (_, i) => i + 1),
      verseByVerse: true,
    },
    license: "public-domain",
    sourceUrl: "https://www.ccel.org/ccel/schaff/npnf110.html",
  },
  {
    id: "augustine-sermon-mount",
    author: "Augustine of Hippo",
    shortName: "Augustine",
    title: "Our Lord's Sermon on the Mount",
    year: 393,
    era: "patristic",
    tradition: "western-patristic",
    coverage: {
      book: "MAT",
      chapters: [5, 6, 7],
      verseByVerse: true,
    },
    license: "public-domain",
    sourceUrl: "https://www.ccel.org/ccel/schaff/npnf106.html",
  },
  {
    id: "aquinas-catena-matthew",
    author: "Thomas Aquinas",
    shortName: "Aquinas",
    title: "Catena Aurea on the Gospel of Matthew",
    year: 1263,
    era: "medieval",
    tradition: "scholastic",
    coverage: {
      book: "MAT",
      chapters: Array.from({ length: 28 }, (_, i) => i + 1),
      verseByVerse: true,
    },
    license: "public-domain",
    sourceUrl: "https://www.ccel.org/ccel/aquinas/catena1.ii.xi.html",
  },
  {
    id: "calvin-harmony-matthew",
    author: "John Calvin",
    shortName: "Calvin",
    title: "Commentary on a Harmony of the Evangelists (Matthew)",
    year: 1555,
    era: "reformation",
    tradition: "reformed",
    coverage: {
      book: "MAT",
      chapters: Array.from({ length: 28 }, (_, i) => i + 1),
      verseByVerse: true,
    },
    license: "public-domain",
    sourceUrl: "https://ccel.org/ccel/calvin/calcom31/calcom31.i.html",
  },
  {
    id: "luther-sermon-mount",
    author: "Martin Luther",
    shortName: "Luther",
    title: "Commentary on the Sermon on the Mount",
    year: 1532,
    era: "reformation",
    tradition: "lutheran",
    coverage: {
      book: "MAT",
      chapters: [5, 6, 7],
      verseByVerse: true,
    },
    license: "public-domain",
    sourceNote:
      "Wochenpredigten uber Matth. 5-7 (WA 32), preached 1530-32. No verified public page: the CCEL path good_works.ii.html is the 1520 Treatise on Good Works, a different work, and is deliberately not linked. The 1892 Charles A. Hay translation is public domain in print; the LW 21 rendering is not.",
  },
  {
    id: "poole-annotations-matthew",
    author: "Matthew Poole",
    shortName: "Poole",
    title: "Annotations upon the Holy Bible: Matthew",
    year: 1685,
    era: "puritan",
    tradition: "reformed",
    coverage: {
      book: "MAT",
      chapters: Array.from({ length: 28 }, (_, i) => i + 1),
      verseByVerse: true,
    },
    license: "public-domain",
    sourceUrl: "https://www.ccel.org/ccel/poole/annotations.html",
  },
  // Mark
  {
    id: "aquinas-catena-mark",
    author: "Thomas Aquinas",
    shortName: "Aquinas",
    title: "Catena Aurea on the Gospel of Mark",
    year: 1263,
    era: "medieval",
    tradition: "scholastic",
    coverage: {
      book: "MRK",
      chapters: Array.from({ length: 16 }, (_, i) => i + 1),
      verseByVerse: true,
    },
    license: "public-domain",
    sourceUrl: "https://www.ccel.org/ccel/aquinas/catena2.iii.iv.html",
  },
  {
    id: "calvin-mark",
    author: "John Calvin",
    shortName: "Calvin",
    title: "Commentary on a Harmony of the Evangelists (Mark)",
    year: 1555,
    era: "reformation",
    tradition: "reformed",
    coverage: {
      book: "MRK",
      chapters: Array.from({ length: 16 }, (_, i) => i + 1),
      verseByVerse: true,
    },
    license: "public-domain",
    sourceUrl: "https://ccel.org/ccel/calvin/calcom31/calcom31.i.html",
  },
  {
    id: "poole-mark",
    author: "Matthew Poole",
    shortName: "Poole",
    title: "Annotations upon the Holy Bible: Mark",
    year: 1685,
    era: "puritan",
    tradition: "reformed",
    coverage: {
      book: "MRK",
      chapters: Array.from({ length: 16 }, (_, i) => i + 1),
      verseByVerse: true,
    },
    license: "public-domain",
    sourceUrl: "https://www.ccel.org/ccel/poole/annotations.html",
  },
  // Luke
  {
    id: "cyril-luke",
    author: "Cyril of Alexandria",
    shortName: "Cyril",
    title: "Commentary on the Gospel of Saint Luke",
    year: 430,
    era: "patristic",
    tradition: "eastern-patristic",
    coverage: {
      book: "LUK",
      chapters: Array.from({ length: 24 }, (_, i) => i + 1),
      verseByVerse: true,
    },
    license: "public-domain",
    sourceUrl:
      "https://www.ccel.org/ccel/pearse/morefathers/files/cyril_on_luke_13_sermons_135_145.htm",
  },
  {
    id: "ambrose-luke",
    author: "Ambrose of Milan",
    shortName: "Ambrose",
    title: "Exposition of the Holy Gospel according to Saint Luke",
    year: 389,
    era: "patristic",
    tradition: "western-patristic",
    coverage: {
      book: "LUK",
      chapters: Array.from({ length: 24 }, (_, i) => i + 1),
      verseByVerse: true,
    },
    license: "public-domain",
    sourceUrl: "https://www.ccel.org/ccel/schaff/npnf210.html",
  },
  {
    id: "aquinas-catena-luke",
    author: "Thomas Aquinas",
    shortName: "Aquinas",
    title: "Catena Aurea on the Gospel of Luke",
    year: 1263,
    era: "medieval",
    tradition: "scholastic",
    coverage: {
      book: "LUK",
      chapters: Array.from({ length: 24 }, (_, i) => i + 1),
      verseByVerse: true,
    },
    license: "public-domain",
    sourceUrl: "https://www.ccel.org/ccel/aquinas/catena3.html",
  },
  {
    id: "calvin-luke",
    author: "John Calvin",
    shortName: "Calvin",
    title: "Commentary on a Harmony of the Evangelists (Luke)",
    year: 1555,
    era: "reformation",
    tradition: "reformed",
    coverage: {
      book: "LUK",
      chapters: Array.from({ length: 24 }, (_, i) => i + 1),
      verseByVerse: true,
    },
    license: "public-domain",
    sourceUrl: "https://ccel.org/ccel/calvin/calcom31/calcom31.i.html",
  },
  {
    id: "luther-magnificat",
    author: "Martin Luther",
    shortName: "Luther",
    title: "Exposition of the Magnificat (Luke 1:46-55)",
    year: 1521,
    era: "reformation",
    tradition: "lutheran",
    coverage: {
      book: "LUK",
      chapters: [1],
      verseByVerse: true,
    },
    license: "public-domain",
    sourceUrl: "https://www.ccel.org/ccel/luther/magnificat.html",
  },
  {
    id: "poole-luke",
    author: "Matthew Poole",
    shortName: "Poole",
    title: "Annotations: Luke",
    year: 1685,
    era: "puritan",
    tradition: "reformed",
    coverage: {
      book: "LUK",
      chapters: Array.from({ length: 24 }, (_, i) => i + 1),
      verseByVerse: true,
    },
    license: "public-domain",
    sourceUrl: "https://www.ccel.org/ccel/poole/annotations.html",
  },
  // John
  {
    id: "chrysostom-john",
    author: "John Chrysostom",
    shortName: "Chrysostom",
    title: "Homilies on the Gospel of Saint John",
    year: 391,
    era: "patristic",
    tradition: "eastern-patristic",
    coverage: {
      book: "JHN",
      chapters: Array.from({ length: 21 }, (_, i) => i + 1),
      verseByVerse: true,
    },
    license: "public-domain",
    sourceUrl: "https://www.ccel.org/ccel/schaff/npnf114.html",
  },
  {
    id: "augustine-john",
    author: "Augustine of Hippo",
    shortName: "Augustine",
    title: "Tractates on the Gospel of John",
    year: 416,
    era: "patristic",
    tradition: "western-patristic",
    coverage: {
      book: "JHN",
      chapters: Array.from({ length: 21 }, (_, i) => i + 1),
      verseByVerse: true,
    },
    license: "public-domain",
    sourceUrl: "https://www.ccel.org/ccel/schaff/npnf107.ii.html",
  },
  {
    id: "aquinas-catena-john",
    author: "Thomas Aquinas",
    shortName: "Aquinas",
    title: "Catena Aurea on the Gospel of John",
    year: 1263,
    era: "medieval",
    tradition: "scholastic",
    coverage: {
      book: "JHN",
      chapters: Array.from({ length: 21 }, (_, i) => i + 1),
      verseByVerse: true,
    },
    license: "public-domain",
    sourceUrl: "https://www.ccel.org/ccel/aquinas/catena4.html",
  },
  {
    id: "calvin-john",
    author: "John Calvin",
    shortName: "Calvin",
    title: "Commentary on the Gospel According to John",
    year: 1553,
    era: "reformation",
    tradition: "reformed",
    coverage: {
      book: "JHN",
      chapters: Array.from({ length: 21 }, (_, i) => i + 1),
      verseByVerse: true,
    },
    license: "public-domain",
    sourceUrl: "https://www.ccel.org/ccel/calvin/calcom34.html",
  },
  {
    id: "luther-john",
    author: "Martin Luther",
    shortName: "Luther",
    title: "Sermons on the Gospel of St. John (Chapters 1-4, 6-8)",
    year: 1538,
    era: "reformation",
    tradition: "lutheran",
    coverage: {
      book: "JHN",
      chapters: [1, 2, 3, 4, 6, 7, 8],
      verseByVerse: true,
    },
    license: "public-domain",
    sourceUrl: "https://www.ccel.org/ccel/luther/john_sermons.html",
  },
  {
    id: "poole-john",
    author: "Matthew Poole",
    shortName: "Poole",
    title: "Annotations: John",
    year: 1685,
    era: "puritan",
    tradition: "reformed",
    coverage: {
      book: "JHN",
      chapters: Array.from({ length: 21 }, (_, i) => i + 1),
      verseByVerse: true,
    },
    license: "public-domain",
    sourceUrl: "https://www.ccel.org/ccel/poole/annotations.html",
  },
];

/** Committed public-page index. Nothing is downloaded at build time. */
export type CatalogEntry = {
  id: string;
  voice: string;
  work: string;
  tradition: Tradition;
  locus: string;
  url: string;
  altUrl?: string;
  tags: string[];
  books?: string[];
  chapters?: number[];
  /**
   * Inclusive verse range this page actually covers, when the page is one
   * pericope rather than a whole chapter. CCEL splits Calvin this way, so a
   * chapter-level row lands on the wrong page for most of the chapter.
   */
  verses?: [number, number];
};

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

const HAND: CatalogEntry[] = [
  // John — Gospel of the Word
  e("augustine-john-tr1", "Augustine", "Tractates on the Gospel of John 1", "patristic", "Tractate 1", "https://www.newadvent.org/fathers/1701001.htm", ["word", "logos", "beginning", "john", "incarnation"], ["JHN"], [1]),
  e("augustine-john-tr3", "Augustine", "Tractates on the Gospel of John 3", "patristic", "Tractate 3", "https://www.newadvent.org/fathers/1701003.htm", ["word", "light", "john", "witness"], ["JHN"], [1]),
  e("augustine-john-tr12", "Augustine", "Tractates on the Gospel of John 12", "patristic", "Tractate 12", "https://www.newadvent.org/fathers/1701012.htm", ["born", "spirit", "nicodemus", "love", "world", "john"], ["JHN"], [3]),
  e("augustine-john-tr26", "Augustine", "Tractates on the Gospel of John 26", "patristic", "Tractate 26", "https://www.newadvent.org/fathers/1701026.htm", ["bread", "life", "eat", "flesh", "john"], ["JHN"], [6]),
  e("augustine-john-tr80", "Augustine", "Tractates on the Gospel of John 80", "patristic", "Tractate 80", "https://www.newadvent.org/fathers/1701080.htm", ["vine", "abide", "fruit", "john"], ["JHN"], [15]),
  e("chrysostom-john-h1", "John Chrysostom", "Homilies on John 1", "patristic", "Homily 1", "https://www.newadvent.org/fathers/240101.htm", ["word", "logos", "beginning", "john"], ["JHN"], [1]),
  e("chrysostom-john-h2", "John Chrysostom", "Homilies on John 2", "patristic", "Homily 2", "https://www.newadvent.org/fathers/240102.htm", ["word", "was", "eternity", "john"], ["JHN"], [1]),
  e("calvin-john-1", "John Calvin", "Commentary on John", "reformed", "John 1:1–5", "https://ccel.org/ccel/calvin/calcom34/calcom34.vii.i.html", ["word", "logos", "beginning", "john", "calvin"], ["JHN"], [1]),
  e("calvin-john-3", "John Calvin", "Commentary on John", "reformed", "John 3", "https://ccel.org/ccel/calvin/calcom34/calcom34.ix.i.html", ["born", "spirit", "love", "world", "john", "calvin"], ["JHN"], [3]),
  e("henry-john-1", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "John 1", "https://ccel.org/ccel/henry/mhc5/mhc5.John.ii.html", ["word", "beginning", "john", "henry"], ["JHN"], [1]),
  e("athanasius-incarnation", "Athanasius", "On the Incarnation", "patristic", "De Incarnatione", "https://www.newadvent.org/fathers/2802.htm", ["word", "flesh", "incarnation", "made", "athanasius"], ["JHN"], [1]),
  e("origen-john-1", "Origen", "Commentary on John, Book 1", "patristic", "In Joannem 1", "https://www.newadvent.org/fathers/101501.htm", ["word", "logos", "beginning", "origen", "john"], ["JHN"], [1]),
  e("justin-dialogue-logos", "Justin Martyr", "Dialogue with Trypho 55–68", "patristic", "Dial. 55–68", "https://www.newadvent.org/fathers/01285.htm", ["word", "logos", "christ", "justin", "prophecy"], ["JHN"], [1]),
  e("justin-apology", "Justin Martyr", "First Apology", "patristic", "1 Apol.", "https://www.newadvent.org/fathers/0126.htm", ["logos", "word", "reason", "justin", "incarnation"]),

  // Synoptics / Hebrews / Genesis / Romans
  e("chrysostom-matt-h1", "John Chrysostom", "Homilies on Matthew 1", "patristic", "Homily 1", "https://www.newadvent.org/fathers/200101.htm", ["matthew", "son", "david", "gospel"], ["MAT"], [1]),

  // Mark

  // Luke
  e("luther-magnificat-1", "Martin Luther", "Exposition of the Magnificat (1521)", "lutheran", "The Magnificat (1521)", "https://www.ccel.org/ccel/luther/magnificat.html", ["magnificat", "mary", "lowliness", "mercy", "grace", "luke"], ["LUK"], [1]),
  e("cyril-luke-18", "Cyril of Alexandria", "Commentary on the Gospel of Saint Luke", "patristic", "Homily 120 on Luke", "https://www.ccel.org/ccel/pearse/morefathers/files/cyril_on_luke_13_sermons_135_145.htm", ["pharisee", "publican", "pride", "humility", "justified", "luke"], ["LUK"], [18]),

  // John additions
  e("calvin-john-6", "John Calvin", "Commentary on John 6", "reformed", "John 6:44", "https://ccel.org/ccel/calvin/calcom34/calcom34.xii.vii.html", ["draw", "father", "faith", "regeneration", "john"], ["JHN"], [6]),
  e("calvin-john-10", "John Calvin", "Commentary on John 10", "reformed", "John 10:11–15", "https://ccel.org/ccel/calvin/calcom34/calcom34.xvi.iii.html", ["shepherd", "sheep", "hireling", "life", "wolf", "john"], ["JHN"], [10]),
  e("augustine-john-tr46", "Augustine of Hippo", "Tractates on the Gospel of John 46", "patristic", "Tractate 46", "https://www.newadvent.org/fathers/1701046.htm", ["shepherd", "door", "sheep", "life", "wolf", "hireling", "john"], ["JHN"], [10]),
  e("chrysostom-john-h59", "John Chrysostom", "Homilies on the Gospel of Saint John 59", "patristic", "Homily 59", "https://www.newadvent.org/fathers/240159.htm", ["shepherd", "door", "sheep", "pastor", "john"], ["JHN"], [10]),
  e("calvin-john-11", "John Calvin", "Commentary on John 11", "reformed", "John 11:33–37", "https://ccel.org/ccel/calvin/calcom34/calcom34.xvii.i.html", ["wept", "lazarus", "tears", "humanity", "compassion", "john"], ["JHN"], [11]),
  e("augustine-john-tr49", "Augustine of Hippo", "Tractates on the Gospel of John 49", "patristic", "Tractate 49", "https://www.newadvent.org/fathers/1701049.htm", ["wept", "lazarus", "tears", "resurrection", "humanity", "john"], ["JHN"], [11]),
  e("calvin-john-14", "John Calvin", "Commentary on John 14", "reformed", "John 14:6", "https://ccel.org/ccel/calvin/calcom35/calcom35.iv.i.html", ["way", "truth", "life", "father", "mediator", "john"], ["JHN"], [14]),
  e("augustine-john-tr69", "Augustine of Hippo", "Tractates on the Gospel of John 69", "patristic", "Tractate 69", "https://www.newadvent.org/fathers/1701069.htm", ["way", "truth", "life", "walk", "john"], ["JHN"], [14]),
  e("calvin-john-19", "John Calvin", "Commentary on John 19", "reformed", "John 19:30", "https://ccel.org/ccel/calvin/calcom35/calcom35.ix.vii.html", ["finished", "redemption", "sacrifice", "cross", "satisfaction", "john"], ["JHN"], [19]),
  e("augustine-john-tr119", "Augustine of Hippo", "Tractates on the Gospel of John 119", "patristic", "Tractate 119", "https://www.newadvent.org/fathers/1701119.htm", ["finished", "fulfilled", "prophecy", "cross", "john"], ["JHN"], [19]),
  e("chrysostom-rom-h1", "John Chrysostom", "Homilies on Romans 1", "patristic", "Homily 1", "https://www.newadvent.org/fathers/210201.htm", ["romans", "gospel", "paul", "faith"], ["ROM"], [1]),
  e("chrysostom-rom-h2", "John Chrysostom", "Homilies on Romans 2", "patristic", "Homily 2", "https://www.newadvent.org/fathers/210202.htm", ["romans", "wrath", "sin", "gentile"], ["ROM"], [1, 2]),
  e("chrysostom-heb-h1", "John Chrysostom", "Homilies on Hebrews 1", "patristic", "Homily 1", "https://www.newadvent.org/fathers/240201.htm", ["hebrews", "son", "angels", "word"], ["HEB"], [1]),
  e("calvin-gen-1", "John Calvin", "Commentary on Genesis", "reformed", "Genesis 1", "https://ccel.org/ccel/calvin/calcom01/calcom01.viii.i.html", ["creation", "beginning", "god", "calvin", "genesis"], ["GEN"], [1]),
  e("calvin-matt-1", "John Calvin", "Commentary on a Harmony of the Evangelists", "reformed", "Matthew 1:1–17", "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.xiv.html", ["matthew", "son", "david", "calvin"], ["MAT"], [1]),
  e("calvin-rom-8", "John Calvin", "Commentary on Romans", "reformed", "Romans 8", "https://ccel.org/ccel/calvin/calcom38/calcom38.xii.i.html", ["spirit", "adoption", "predestination", "romans", "calvin"], ["ROM"], [8]),
  e("calvin-rom-9", "John Calvin", "Commentary on Romans", "reformed", "Romans 9", "https://ccel.org/ccel/calvin/calcom38/calcom38.xiii.i.html", ["election", "reprobation", "mercy", "romans", "calvin"], ["ROM"], [9]),
  e("chrysostom-rom-h16", "John Chrysostom", "Homilies on Romans 16", "patristic", "Homily 16", "https://www.newadvent.org/fathers/210216.htm", ["election", "mercy", "will", "potter", "romans", "chrysostom"], ["ROM"], [9]),
  e("augustine-enchiridion-rom9", "Augustine", "Enchiridion", "patristic", "Enchiridion 98", "https://www.newadvent.org/fathers/1302.htm", ["mercy", "will", "romans", "predestination", "augustine"], ["ROM"], [9]),
  e("henry-gen-1", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "Genesis 1", "https://ccel.org/ccel/henry/mhc1/mhc1.Gen.ii.html", ["creation", "beginning", "genesis", "henry"], ["GEN"], [1]),
  e("basil-hexaemeron-1", "Basil of Caesarea", "Hexaemeron, Homily 1", "patristic", "Homily 1", "https://www.newadvent.org/fathers/32011.htm", ["creation", "beginning", "genesis", "basil"], ["GEN"], [1]),

  // Trinity, Christology, Spirit
  e("irenaeus-ah-3-1", "Irenaeus", "Against Heresies 3.1", "patristic", "Adv. Haer. 3.1", "https://www.newadvent.org/fathers/0103301.htm", ["gospel", "apostles", "tradition", "irenaeus"], ["JHN", "MAT", "MRK", "LUK"]),
  e("irenaeus-ah-3-9", "Irenaeus", "Against Heresies 3.9", "patristic", "Adv. Haer. 3.9", "https://www.newadvent.org/fathers/0103309.htm", ["christ", "prophets", "son", "irenaeus"]),
  e("irenaeus-ah-3-18", "Irenaeus", "Against Heresies 3.18", "patristic", "Adv. Haer. 3.18", "https://www.newadvent.org/fathers/0103318.htm", ["incarnation", "recapitulation", "adam", "christ", "irenaeus"], ["JHN"], [1]),
  e("ignatius-ephesians", "Ignatius of Antioch", "Epistle to the Ephesians", "patristic", "Eph.", "https://www.newadvent.org/fathers/0104.htm", ["incarnation", "flesh", "bishop", "ignatius", "unity"]),
  e("tertullian-prescription", "Tertullian", "Prescription Against Heretics", "patristic", "De praescriptione", "https://www.newadvent.org/fathers/0311.htm", ["rule", "faith", "heresy", "tradition", "tertullian"]),
  e("tertullian-praxeas", "Tertullian", "Against Praxeas", "patristic", "Adv. Praxean", "https://www.newadvent.org/fathers/0317.htm", ["trinity", "son", "father", "spirit", "tertullian"]),
  e("origen-principiis-1", "Origen", "On First Principles, Book 1", "patristic", "De Principiis 1", "https://www.newadvent.org/fathers/04121.htm", ["trinity", "father", "son", "origen", "first"]),
  e("athanasius-arians-1", "Athanasius", "Orations Against the Arians 1", "patristic", "Or. 1", "https://www.newadvent.org/fathers/28161.htm", ["son", "homoousios", "arian", "begotten", "athanasius"]),
  e("basil-holy-spirit", "Basil of Caesarea", "On the Holy Spirit", "patristic", "De Spiritu Sancto", "https://www.newadvent.org/fathers/3203.htm", ["spirit", "trinity", "glory", "basil"]),
  e("gregory-naz-or29", "Gregory of Nazianzus", "Theological Oration 3 (Or. 29)", "patristic", "Or. 29", "https://www.newadvent.org/fathers/310229.htm", ["son", "trinity", "begotten", "gregory"]),
  e("gregory-naz-or31", "Gregory of Nazianzus", "Theological Oration 5 (Or. 31)", "patristic", "Or. 31", "https://www.newadvent.org/fathers/310231.htm", ["spirit", "trinity", "gregory"]),
  e("gregory-nyssa-not-three", "Gregory of Nyssa", "Not Three Gods", "patristic", "Ad Ablabium", "https://www.newadvent.org/fathers/2905.htm", ["trinity", "god", "persons", "gregory"]),
  e("cyril-jerusalem-cat4", "Cyril of Jerusalem", "Catechetical Lecture 4", "patristic", "Cat. 4", "https://www.newadvent.org/fathers/310104.htm", ["faith", "trinity", "creed", "cyril"]),
  e("ambrose-spirit-1", "Ambrose", "On the Holy Spirit, Book 1", "patristic", "De Spiritu Sancto 1", "https://www.newadvent.org/fathers/34041.htm", ["spirit", "trinity", "ambrose"]),
  e("augustine-trinity-1", "Augustine", "On the Trinity, Book 1", "patristic", "De Trinitate 1", "https://www.newadvent.org/fathers/130101.htm", ["trinity", "father", "son", "spirit", "augustine"]),
  e("augustine-city-11", "Augustine", "City of God, Book 11", "patristic", "De civ. Dei 11", "https://www.newadvent.org/fathers/120111.htm", ["creation", "trinity", "beginning", "city", "augustine"], ["GEN"], [1]),
  e("leo-tome", "Leo the Great", "Tome to Flavian (Letter 28)", "patristic", "Ep. 28", "https://www.newadvent.org/fathers/3604028.htm", ["incarnation", "natures", "chalcedon", "leo", "christ"]),
  e("nicaea-325", "First Council of Nicaea", "Nicene documents", "confession", "Nicaea 325", "https://www.newadvent.org/fathers/3801.htm", ["trinity", "son", "begotten", "creed", "nicaea"]),
  e("chalcedon-451", "Council of Chalcedon", "Definition of Chalcedon", "confession", "Chalcedon 451", "https://www.newadvent.org/fathers/3811.htm", ["incarnation", "natures", "chalcedon", "christ"]),
  e("nicene-creed-schaff", "Nicene Creed", "Nicene-Constantinopolitan Creed", "confession", "Schaff, Creeds II", "https://www.ccel.org/ccel/schaff/creeds2.iv.i.i.html", ["trinity", "creed", "nicene", "son", "spirit"]),

  // Grace, sin, predestination, justification
  e("augustine-predestination", "Augustine", "On the Predestination of the Saints", "patristic", "Book 1", "https://www.newadvent.org/fathers/15121.htm", ["predestination", "election", "grace", "saints", "augustine"]),
  e("augustine-spirit-letter", "Augustine", "On the Spirit and the Letter", "patristic", "De spiritu et littera", "https://www.newadvent.org/fathers/1502.htm", ["grace", "law", "letter", "spirit", "sin", "justification"]),
  e("augustine-nature-grace", "Augustine", "On Nature and Grace", "patristic", "De natura et gratia", "https://www.newadvent.org/fathers/1503.htm", ["grace", "nature", "sin", "pelagius", "augustine"]),
  e("augustine-grace-freewill", "Augustine", "On Grace and Free Will", "patristic", "De gratia et libero arbitrio", "https://www.newadvent.org/fathers/1510.htm", ["grace", "will", "free", "sin", "augustine"]),
  e("aquinas-st-doctrine", "Thomas Aquinas", "Summa Theologiae I q.1", "catholic", "ST I q.1", "https://www.newadvent.org/summa/1001.htm", ["sacred", "doctrine", "theology", "aquinas", "thomas"]),
  e("aquinas-st-god", "Thomas Aquinas", "Summa Theologiae I q.2", "catholic", "ST I q.2", "https://www.newadvent.org/summa/1002.htm", ["god", "existence", "proofs", "aquinas", "thomas"]),
  e("aquinas-st-names", "Thomas Aquinas", "Summa Theologiae I q.13", "catholic", "ST I q.13", "https://www.newadvent.org/summa/1013.htm", ["names", "god", "analogy", "aquinas", "thomas"]),
  e("aquinas-st-knowledge", "Thomas Aquinas", "Summa Theologiae I q.14", "catholic", "ST I q.14", "https://www.newadvent.org/summa/1014.htm", ["knowledge", "god", "providence", "aquinas", "thomas"]),
  e("aquinas-st-providence", "Thomas Aquinas", "Summa Theologiae I q.22", "catholic", "ST I q.22", "https://www.newadvent.org/summa/1022.htm", ["providence", "governance", "aquinas", "thomas"]),
  e("aquinas-st-predestination", "Thomas Aquinas", "Summa Theologiae I q.23", "catholic", "ST I q.23", "https://www.newadvent.org/summa/1023.htm", ["predestination", "election", "providence", "reprobation", "aquinas", "thomas"]),
  e("aquinas-st-processions", "Thomas Aquinas", "Summa Theologiae I q.27", "catholic", "ST I q.27", "https://www.newadvent.org/summa/1027.htm", ["trinity", "processions", "son", "spirit", "aquinas", "thomas"]),
  e("aquinas-st-missions", "Thomas Aquinas", "Summa Theologiae I q.43", "catholic", "ST I q.43", "https://www.newadvent.org/summa/1043.htm", ["trinity", "mission", "incarnation", "spirit", "aquinas", "thomas"]),
  e("aquinas-st-original-sin", "Thomas Aquinas", "Summa Theologiae I-II q.82", "catholic", "ST I-II q.82", "https://www.newadvent.org/summa/2082.htm", ["sin", "original", "adam", "aquinas", "thomas"]),
  e("aquinas-st-grace", "Thomas Aquinas", "Summa Theologiae I-II q.109", "catholic", "ST I-II q.109", "https://www.newadvent.org/summa/2109.htm", ["grace", "nature", "need", "aquinas", "thomas"]),
  e("aquinas-st-cause-grace", "Thomas Aquinas", "Summa Theologiae I-II q.112", "catholic", "ST I-II q.112", "https://www.newadvent.org/summa/2112.htm", ["grace", "cause", "god", "aquinas", "thomas"]),
  e("aquinas-st-incarnation", "Thomas Aquinas", "Summa Theologiae III q.1", "catholic", "ST III q.1", "https://www.newadvent.org/summa/4001.htm", ["incarnation", "fitting", "flesh", "aquinas", "thomas"], ["JHN"], [1, 14]),
  e("aquinas-st-union", "Thomas Aquinas", "Summa Theologiae III q.2", "catholic", "ST III q.2", "https://www.newadvent.org/summa/4002.htm", ["incarnation", "union", "natures", "aquinas", "thomas"]),
  e("aquinas-st-passion", "Thomas Aquinas", "Summa Theologiae III q.48", "catholic", "ST III q.48", "https://www.newadvent.org/summa/4048.htm", ["atonement", "passion", "cross", "merit", "aquinas", "thomas"]),
  e("aquinas-st-resurrection", "Thomas Aquinas", "Summa Theologiae III q.53", "catholic", "ST III q.53", "https://www.newadvent.org/summa/4053.htm", ["resurrection", "christ", "aquinas", "thomas"]),

  // Reformers
  e("calvin-inst-knowledge", "John Calvin", "Institutes of the Christian Religion", "reformed", "Institutes 1.1", "https://ccel.org/ccel/calvin/institutes/institutes.iii.ii.html", ["knowledge", "god", "self", "calvin"]),
  e("calvin-inst-trinity", "John Calvin", "Institutes of the Christian Religion", "reformed", "Institutes 1.13", "https://ccel.org/ccel/calvin/institutes/institutes.iv.xiii.html", ["trinity", "son", "spirit", "calvin"]),
  e("calvin-inst-trinity-14", "John Calvin", "Institutes of the Christian Religion", "reformed", "Institutes 1.13 cont.", "https://ccel.org/ccel/calvin/institutes/institutes.iv.xiv.html", ["trinity", "persons", "calvin"]),
  e("calvin-inst-predestination", "John Calvin", "Institutes of the Christian Religion", "reformed", "Institutes 3.21", "https://ccel.org/ccel/calvin/institutes/institutes.v.xxii.html", ["predestination", "election", "reprobation", "providence", "calvin"]),
  e("luther-bondage", "Martin Luther", "On the Bondage of the Will", "lutheran", "De servo arbitrio", "https://ccel.org/ccel/luther/bondage/bondage.iii.html", ["will", "grace", "free", "sin", "luther", "bondage"]),
  e("luther-galatians", "Martin Luther", "Commentary on Galatians", "lutheran", "Galatians", "https://ccel.org/ccel/luther/galatians/galatians.iii.html", ["justification", "faith", "law", "gospel", "luther", "galatians"], ["GAL"]),
  e("owen-death", "John Owen", "The Death of Death in the Death of Christ", "reformed", "Book 1", "https://ccel.org/ccel/owen/deathofdeath/deathofdeath.i.ii.html", ["atonement", "death", "election", "owen", "particular"]),

  // Confessions
  e("helvetic-first", "First Helvetic Confession", "First Helvetic Confession", "confession", "Schaff, Creeds III", "https://www.ccel.org/ccel/schaff/creeds3.iv.iv.html", ["confession", "helvetic", "scripture", "faith"]),
  e("heidelberg", "Heidelberg Catechism", "Heidelberg Catechism", "confession", "Schaff, Creeds III", "https://www.ccel.org/ccel/schaff/creeds3.iv.vii.html", ["comfort", "grace", "sin", "heidelberg", "catechism", "justification"]),
  e("thirty-nine", "Thirty-Nine Articles", "Thirty-Nine Articles of Religion", "confession", "Schaff, Creeds III", "https://www.ccel.org/ccel/schaff/creeds3.iv.xiii.html", ["articles", "justification", "scripture", "anglican", "grace"]),
  e("dort-first-head", "Canons of Dort", "Canons of Dort, First Head", "confession", "First Head of Doctrine", "https://www.ccel.org/ccel/schaff/creeds3.iv.xvi.html", ["election", "predestination", "grace", "dort"]),
  e("wcf-larger", "Westminster Larger Catechism", "Westminster Larger Catechism", "confession", "Schaff, Creeds III", "https://www.ccel.org/ccel/schaff/creeds3.iv.xvii.html", ["catechism", "westminster", "god", "sin", "grace"]),
  e("wcf-schaff", "Westminster Confession", "Westminster Confession of Faith", "confession", "Schaff, Creeds III", "https://ccel.org/ccel/schaff/creeds3.iv.xviii.html", ["election", "predestination", "son", "incarnation", "westminster", "scripture"]),
  e("augsburg", "Augsburg Confession", "Augsburg Confession", "lutheran", "CA", "https://bookofconcord.org/augsburg-confession/", ["grace", "sin", "justification", "luther", "augsburg", "concord"]),
  e("augsburg-ii", "Augsburg Confession", "Augsburg Confession, Article II", "lutheran", "CA II", "https://bookofconcord.org/augsburg-confession/article-ii/", ["sin", "original", "adam", "augsburg", "luther"]),
  e("augsburg-iv", "Augsburg Confession", "Augsburg Confession, Article IV", "lutheran", "CA IV", "https://bookofconcord.org/augsburg-confession/article-iv/", ["justification", "faith", "grace", "augsburg", "luther"]),
  e("large-catechism", "Martin Luther", "Large Catechism", "lutheran", "LC", "https://bookofconcord.org/large-catechism/", ["commandments", "creed", "prayer", "luther", "catechism"]),
  e("small-catechism", "Martin Luther", "Small Catechism", "lutheran", "SC", "https://bookofconcord.org/small-catechism/", ["commandments", "creed", "baptism", "luther", "catechism"]),
  e("formula-concord", "Formula of Concord", "Formula of Concord, Epitome", "lutheran", "FC Epitome", "https://bookofconcord.org/formula-of-concord-epitome/", ["justification", "law", "gospel", "will", "concord", "luther"]),

  // NT book floor — Calvin + Henry Arguments/intros (fallback only; chapter pages below treat the verse as subject)
  e("calvin-matthew", "John Calvin", "Commentary on a Harmony of the Evangelists", "reformed", "Argument", "https://ccel.org/ccel/calvin/calcom31/calcom31.viii.html", ["matthew", "gospel", "calvin"], ["MAT"]),
  e("henry-matthew", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "Matthew intro", "https://ccel.org/ccel/henry/mhc5/mhc5.Matt.i.html", ["matthew", "gospel", "henry"], ["MAT"]),

  e("calvin-mark", "John Calvin", "Commentary on a Harmony of the Evangelists", "reformed", "Mark 1:1–6", "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.xxvii.html", ["mark", "gospel", "calvin"], ["MRK"], [1]),
  e("henry-mark", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "Mark intro", "https://ccel.org/ccel/henry/mhc5/mhc5.Mark.i.html", ["mark", "gospel", "henry"], ["MRK"]),

  e("calvin-luke", "John Calvin", "Commentary on a Harmony of the Evangelists", "reformed", "Luke 1:1–4", "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.i.html", ["luke", "gospel", "calvin"], ["LUK"], [1]),
  e("henry-luke", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "Luke intro", "https://ccel.org/ccel/henry/mhc5/mhc5.Luke.i.html", ["luke", "gospel", "henry"], ["LUK"]),

  e("calvin-john", "John Calvin", "Commentary on John", "reformed", "Argument", "https://ccel.org/ccel/calvin/calcom34/calcom34.vi.html", ["john", "gospel", "calvin"], ["JHN"]),
  e("henry-john", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "John intro", "https://ccel.org/ccel/henry/mhc5/mhc5.John.i.html", ["john", "gospel", "henry"], ["JHN"]),

  e("calvin-acts", "John Calvin", "Commentary on Acts", "reformed", "Argument", "https://ccel.org/ccel/calvin/calcom36/calcom36.vii.html", ["acts", "apostles", "calvin"], ["ACT"]),
  e("henry-acts", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "Acts intro", "https://ccel.org/ccel/henry/mhc6/mhc6.Acts.i.html", ["acts", "apostles", "henry"], ["ACT"]),
  e("chrysostom-acts", "John Chrysostom", "Homilies on Acts 1", "patristic", "Homily 1", "https://www.newadvent.org/fathers/210101.htm", ["acts", "apostles", "chrysostom"], ["ACT"], [1]),

  e("calvin-romans", "John Calvin", "Commentary on Romans", "reformed", "Argument", "https://ccel.org/ccel/calvin/calcom38/calcom38.iv.html", ["romans", "paul", "calvin"], ["ROM"]),
  e("henry-romans", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "Romans intro", "https://ccel.org/ccel/henry/mhc6/mhc6.Rom.i.html", ["romans", "paul", "henry"], ["ROM"]),

  e("calvin-1corinthians", "John Calvin", "Commentary on 1 Corinthians", "reformed", "Argument", "https://ccel.org/ccel/calvin/calcom39/calcom39.vii.html", ["corinthians", "paul", "calvin"], ["1CO"]),
  e("henry-1corinthians", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "1 Corinthians intro", "https://ccel.org/ccel/henry/mhc6/mhc6.iCor.i.html", ["corinthians", "paul", "henry"], ["1CO"]),
  e("chrysostom-1corinthians", "John Chrysostom", "Homilies on First Corinthians 1", "patristic", "Homily 1", "https://www.newadvent.org/fathers/220101.htm", ["corinthians", "paul", "chrysostom"], ["1CO"], [1]),

  e("calvin-2corinthians", "John Calvin", "Commentary on 2 Corinthians", "reformed", "Argument", "https://ccel.org/ccel/calvin/calcom40/calcom40.vi.html", ["corinthians", "paul", "calvin"], ["2CO"]),
  e("henry-2corinthians", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "2 Corinthians intro", "https://ccel.org/ccel/henry/mhc6/mhc6.iiCor.i.html", ["corinthians", "paul", "henry"], ["2CO"]),
  e("chrysostom-2corinthians", "John Chrysostom", "Homilies on Second Corinthians 1", "patristic", "Homily 1", "https://www.newadvent.org/fathers/220201.htm", ["corinthians", "paul", "chrysostom"], ["2CO"], [1]),

  e("calvin-galatians", "John Calvin", "Commentary on Galatians", "reformed", "Argument", "https://ccel.org/ccel/calvin/calcom41/calcom41.iii.ii.html", ["galatians", "paul", "calvin"], ["GAL"]),
  e("henry-galatians", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "Galatians intro", "https://ccel.org/ccel/henry/mhc6/mhc6.Gal.i.html", ["galatians", "paul", "henry"], ["GAL"]),
  e("chrysostom-galatians", "John Chrysostom", "Homilies on Galatians 1", "patristic", "Homily 1", "https://www.newadvent.org/fathers/23101.htm", ["galatians", "paul", "chrysostom"], ["GAL"], [1]),

  e("calvin-ephesians", "John Calvin", "Commentary on Ephesians", "reformed", "Argument", "https://ccel.org/ccel/calvin/calcom41/calcom41.iv.i.html", ["ephesians", "paul", "calvin"], ["EPH"]),
  e("henry-ephesians", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "Ephesians intro", "https://ccel.org/ccel/henry/mhc6/mhc6.Eph.i.html", ["ephesians", "paul", "henry"], ["EPH"]),
  e("chrysostom-ephesians", "John Chrysostom", "Homilies on Ephesians 1", "patristic", "Homily 1", "https://www.newadvent.org/fathers/230101.htm", ["ephesians", "paul", "chrysostom", "blessed", "spiritual", "blessing", "heavenly"], ["EPH"], [1]),

  e("calvin-philippians", "John Calvin", "Commentary on Philippians", "reformed", "Argument", "https://ccel.org/ccel/calvin/calcom42/calcom42.iv.i.html", ["philippians", "paul", "calvin"], ["PHP"]),
  e("henry-philippians", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "Philippians intro", "https://ccel.org/ccel/henry/mhc6/mhc6.Phi.i.html", ["philippians", "paul", "henry"], ["PHP"]),
  e("chrysostom-philippians", "John Chrysostom", "Homilies on Philippians 1", "patristic", "Homily 1", "https://www.newadvent.org/fathers/230201.htm", ["philippians", "paul", "chrysostom"], ["PHP"], [1]),

  e("calvin-colossians", "John Calvin", "Commentary on Colossians", "reformed", "Argument", "https://ccel.org/ccel/calvin/calcom42/calcom42.v.i.html", ["colossians", "col", "paul", "calvin"], ["COL"]),
  e("henry-colossians", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "Colossians intro", "https://ccel.org/ccel/henry/mhc6/mhc6.Col.i.html", ["colossians", "col", "paul", "henry"], ["COL"]),
  e("chrysostom-colossians", "John Chrysostom", "Homilies on Colossians 1", "patristic", "Homily 1", "https://www.newadvent.org/fathers/230301.htm", ["colossians", "col", "paul", "chrysostom", "apostle"], ["COL"], [1]),

  e("calvin-1thessalonians", "John Calvin", "Commentary on 1 Thessalonians", "reformed", "Argument", "https://ccel.org/ccel/calvin/calcom42/calcom42.vi.ii.html", ["thessalonians", "paul", "calvin"], ["1TH"]),
  e("henry-1thessalonians", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "1 Thessalonians intro", "https://ccel.org/ccel/henry/mhc6/mhc6.iTh.i.html", ["thessalonians", "paul", "henry"], ["1TH"]),
  e("chrysostom-1thessalonians", "John Chrysostom", "Homilies on First Thessalonians 1", "patristic", "Homily 1", "https://www.newadvent.org/fathers/230401.htm", ["thessalonians", "paul", "chrysostom"], ["1TH"], [1]),

  e("calvin-2thessalonians", "John Calvin", "Commentary on 2 Thessalonians", "reformed", "Argument", "https://ccel.org/ccel/calvin/calcom42/calcom42.vii.ii.html", ["thessalonians", "paul", "calvin"], ["2TH"]),
  e("henry-2thessalonians", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "2 Thessalonians intro", "https://ccel.org/ccel/henry/mhc6/mhc6.iiTh.i.html", ["thessalonians", "paul", "henry"], ["2TH"]),
  e("chrysostom-2thessalonians", "John Chrysostom", "Homilies on Second Thessalonians 1", "patristic", "Homily 1", "https://www.newadvent.org/fathers/23051.htm", ["thessalonians", "paul", "chrysostom"], ["2TH"], [1]),

  e("calvin-1timothy", "John Calvin", "Commentary on 1 Timothy", "reformed", "Argument", "https://ccel.org/ccel/calvin/calcom43/calcom43.iii.ii.html", ["timothy", "paul", "calvin"], ["1TI"]),
  e("henry-1timothy", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "1 Timothy intro", "https://ccel.org/ccel/henry/mhc6/mhc6.iTim.i.html", ["timothy", "paul", "henry"], ["1TI"]),
  e("chrysostom-1timothy", "John Chrysostom", "Homilies on First Timothy 1", "patristic", "Homily 1", "https://www.newadvent.org/fathers/230601.htm", ["timothy", "paul", "chrysostom"], ["1TI"], [1]),

  e("calvin-2timothy", "John Calvin", "Commentary on 2 Timothy", "reformed", "Argument", "https://ccel.org/ccel/calvin/calcom43/calcom43.iv.i.html", ["timothy", "paul", "calvin"], ["2TI"]),
  e("henry-2timothy", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "2 Timothy intro", "https://ccel.org/ccel/henry/mhc6/mhc6.iiTim.i.html", ["timothy", "paul", "henry"], ["2TI"]),
  e("chrysostom-2timothy", "John Chrysostom", "Homilies on Second Timothy 1", "patristic", "Homily 1", "https://www.newadvent.org/fathers/230701.htm", ["timothy", "paul", "chrysostom"], ["2TI"], [1]),

  e("calvin-titus", "John Calvin", "Commentary on Titus", "reformed", "Argument", "https://ccel.org/ccel/calvin/calcom43/calcom43.v.ii.html", ["titus", "paul", "calvin"], ["TIT"]),
  e("henry-titus", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "Titus intro", "https://ccel.org/ccel/henry/mhc6/mhc6.Tit.i.html", ["titus", "paul", "henry"], ["TIT"]),
  e("chrysostom-titus", "John Chrysostom", "Homilies on Titus 1", "patristic", "Homily 1", "https://www.newadvent.org/fathers/23081.htm", ["titus", "paul", "chrysostom"], ["TIT"], [1]),

  e("calvin-philemon", "John Calvin", "Commentary on Philemon", "reformed", "Philemon 1–7", "https://ccel.org/ccel/calvin/calcom43/calcom43.vi.i.html", ["philemon", "paul", "calvin"], ["PHM"], [1]),
  e("henry-philemon", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "Philemon intro", "https://ccel.org/ccel/henry/mhc6/mhc6.Phm.i.html", ["philemon", "paul", "henry"], ["PHM"]),
  e("chrysostom-philemon", "John Chrysostom", "Homilies on Philemon 1", "patristic", "Homily 1", "https://www.newadvent.org/fathers/23091.htm", ["philemon", "paul", "chrysostom"], ["PHM"], [1]),

  e("calvin-hebrews", "John Calvin", "Commentary on Hebrews", "reformed", "Argument", "https://ccel.org/ccel/calvin/calcom44/calcom44.vi.html", ["hebrews", "calvin"], ["HEB"]),
  e("henry-hebrews", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "Hebrews intro", "https://ccel.org/ccel/henry/mhc6/mhc6.Heb.i.html", ["hebrews", "henry"], ["HEB"]),

  e("calvin-james", "John Calvin", "Commentary on James", "reformed", "Argument", "https://ccel.org/ccel/calvin/calcom45/calcom45.vi.i.html", ["james", "calvin"], ["JAS"]),
  e("henry-james", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "James intro", "https://ccel.org/ccel/henry/mhc6/mhc6.Jam.i.html", ["james", "henry"], ["JAS"]),

  e("calvin-1peter", "John Calvin", "Commentary on 1 Peter", "reformed", "Argument", "https://ccel.org/ccel/calvin/calcom45/calcom45.iv.i.html", ["peter", "calvin"], ["1PE"]),
  e("henry-1peter", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "1 Peter intro", "https://ccel.org/ccel/henry/mhc6/mhc6.iPet.i.html", ["peter", "henry"], ["1PE"]),

  e("calvin-2peter", "John Calvin", "Commentary on 2 Peter", "reformed", "Argument", "https://ccel.org/ccel/calvin/calcom45/calcom45.vii.i.html", ["peter", "calvin"], ["2PE"]),
  e("henry-2peter", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "2 Peter intro", "https://ccel.org/ccel/henry/mhc6/mhc6.iiPet.i.html", ["peter", "henry"], ["2PE"]),

  e("calvin-1john", "John Calvin", "Commentary on 1 John", "reformed", "Argument", "https://ccel.org/ccel/calvin/calcom45/calcom45.v.i.html", ["john", "calvin"], ["1JN"]),
  e("henry-1john", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "1 John intro", "https://ccel.org/ccel/henry/mhc6/mhc6.iJo.i.html", ["john", "henry"], ["1JN"]),
  e("augustine-1john", "Augustine", "Homilies on the First Epistle of John 1", "patristic", "Homily 1", "https://www.newadvent.org/fathers/170201.htm", ["john", "love", "augustine"], ["1JN"], [1]),

  e("henry-2john", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "2 John intro", "https://ccel.org/ccel/henry/mhc6/mhc6.iiJo.i.html", ["john", "henry"], ["2JN"]),
  e("henry-3john", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "3 John intro", "https://ccel.org/ccel/henry/mhc6/mhc6.iiiJo.i.html", ["john", "henry"], ["3JN"]),

  e("calvin-jude", "John Calvin", "Commentary on Jude", "reformed", "Argument", "https://ccel.org/ccel/calvin/calcom45/calcom45.viii.i.html", ["jude", "calvin"], ["JUD"]),
  e("henry-jude", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "Jude intro", "https://ccel.org/ccel/henry/mhc6/mhc6.Ju.i.html", ["jude", "henry"], ["JUD"]),

  e("henry-revelation", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "Revelation intro", "https://ccel.org/ccel/henry/mhc6/mhc6.Rev.i.html", ["revelation", "henry"], ["REV"]),


  // NT chapter pages — Arguments/intros are not enough; inquire needs CHAPTER public pages
  e("henry-matthew-1", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "Matthew 1", "https://ccel.org/ccel/henry/mhc5/mhc5.Matt.ii.html", ["matthew", "gospel", "henry", "genealogy", "david"], ["MAT"], [1]),
  e("henry-mark-1", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "Mark 1", "https://ccel.org/ccel/henry/mhc5/mhc5.Mark.ii.html", ["mark", "gospel", "henry", "baptist", "wilderness"], ["MRK"], [1]),
  e("henry-luke-1", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "Luke 1", "https://ccel.org/ccel/henry/mhc5/mhc5.Luke.ii.html", ["luke", "gospel", "henry", "theophilus", "forerunner"], ["LUK"], [1]),
  e("calvin-acts-1", "John Calvin", "Commentary on Acts", "reformed", "Acts 1:1–2", "https://ccel.org/ccel/calvin/calcom36/calcom36.viii.i.html", ["acts", "apostles", "calvin", "theophilus", "began"], ["ACT"], [1]),
  e("henry-acts-1", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "Acts 1", "https://ccel.org/ccel/henry/mhc6/mhc6.Acts.ii.html", ["acts", "apostles", "henry", "theophilus", "holy"], ["ACT"], [1]),
  e("calvin-romans-1", "John Calvin", "Commentary on Romans", "reformed", "Romans 1:1–7", "https://ccel.org/ccel/calvin/calcom38/calcom38.v.i.html", ["romans", "paul", "calvin", "gospel", "apostle"], ["ROM"], [1]),
  e("henry-romans-1", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "Romans 1", "https://ccel.org/ccel/henry/mhc6/mhc6.Rom.ii.html", ["romans", "paul", "henry", "gospel", "apostle"], ["ROM"], [1]),
  e("calvin-1corinthians-1", "John Calvin", "Commentary on 1 Corinthians", "reformed", "1 Corinthians 1:1–3", "https://ccel.org/ccel/calvin/calcom39/calcom39.viii.i.html", ["corinthians", "paul", "calvin", "called", "apostle"], ["1CO"], [1]),
  e("henry-1corinthians-1", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "1 Corinthians 1", "https://ccel.org/ccel/henry/mhc6/mhc6.iCor.ii.html", ["corinthians", "paul", "henry", "called", "wisdom"], ["1CO"], [1]),
  e("calvin-2corinthians-1", "John Calvin", "Commentary on 2 Corinthians", "reformed", "2 Corinthians 1:1–5", "https://ccel.org/ccel/calvin/calcom40/calcom40.vii.i.html", ["corinthians", "paul", "calvin", "comfort", "affliction"], ["2CO"], [1]),
  e("henry-2corinthians-1", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "2 Corinthians 1", "https://ccel.org/ccel/henry/mhc6/mhc6.iiCor.ii.html", ["corinthians", "paul", "henry", "comfort", "affliction"], ["2CO"], [1]),
  e("calvin-galatians-1", "John Calvin", "Commentary on Galatians", "reformed", "Galatians 1:1–5", "https://ccel.org/ccel/calvin/calcom41/calcom41.iii.iii.i.html", ["galatians", "paul", "calvin", "apostle", "gospel"], ["GAL"], [1]),
  e("henry-galatians-1", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "Galatians 1", "https://ccel.org/ccel/henry/mhc6/mhc6.Gal.ii.html", ["galatians", "paul", "henry", "apostle", "gospel"], ["GAL"], [1]),
  e("calvin-ephesians-1", "John Calvin", "Commentary on Ephesians", "reformed", "Ephesians 1:1–3", "https://ccel.org/ccel/calvin/calcom41/calcom41.iv.ii.i.html", ["ephesians", "paul", "calvin", "blessed", "spiritual", "blessing", "heavenly"], ["EPH"], [1]),
  e("henry-ephesians-1", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "Ephesians 1", "https://ccel.org/ccel/henry/mhc6/mhc6.Eph.ii.html", ["ephesians", "paul", "henry", "blessed", "spiritual", "blessing", "heavenly"], ["EPH"], [1]),
  e("calvin-ephesians-2", "John Calvin", "Commentary on Ephesians", "reformed", "Ephesians 2", "https://ccel.org/ccel/calvin/calcom41/calcom41.iv.iii.i.html", ["ephesians", "paul", "calvin", "dead", "trespasses", "grace"], ["EPH"], [2]),
  e("henry-ephesians-2", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "Ephesians 2", "https://ccel.org/ccel/henry/mhc6/mhc6.Eph.iii.html", ["ephesians", "paul", "henry", "dead", "trespasses", "grace"], ["EPH"], [2]),
  e("calvin-ephesians-3", "John Calvin", "Commentary on Ephesians", "reformed", "Ephesians 3", "https://ccel.org/ccel/calvin/calcom41/calcom41.iv.iv.i.html", ["ephesians", "paul", "calvin", "mystery", "gentiles"], ["EPH"], [3]),
  e("henry-ephesians-3", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "Ephesians 3", "https://ccel.org/ccel/henry/mhc6/mhc6.Eph.iv.html", ["ephesians", "paul", "henry", "mystery", "gentiles"], ["EPH"], [3]),
  e("henry-ephesians-4", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "Ephesians 4", "https://ccel.org/ccel/henry/mhc6/mhc6.Eph.v.html", ["ephesians", "paul", "henry", "walk", "worthy", "unity"], ["EPH"], [4]),
  e("henry-ephesians-5", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "Ephesians 5", "https://ccel.org/ccel/henry/mhc6/mhc6.Eph.vi.html", ["ephesians", "paul", "henry", "walk", "love", "light"], ["EPH"], [5]),
  e("henry-ephesians-6", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "Ephesians 6", "https://ccel.org/ccel/henry/mhc6/mhc6.Eph.vii.html", ["ephesians", "paul", "henry", "armor", "stand", "prayer"], ["EPH"], [6]),
  e("chrysostom-ephesians-h2", "John Chrysostom", "Homilies on Ephesians 2", "patristic", "Homily 2", "https://www.newadvent.org/fathers/230102.htm", ["ephesians", "paul", "chrysostom", "truth", "salvation", "gospel"], ["EPH"], [1]),
  e("calvin-philippians-1", "John Calvin", "Commentary on Philippians", "reformed", "Philippians 1:1–6", "https://ccel.org/ccel/calvin/calcom42/calcom42.iv.ii.i.html", ["philippians", "paul", "calvin", "saints", "gospel"], ["PHP"], [1]),
  e("henry-philippians-1", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "Philippians 1", "https://ccel.org/ccel/henry/mhc6/mhc6.Phi.ii.html", ["philippians", "paul", "henry", "saints", "gospel"], ["PHP"], [1]),
  e("calvin-1thessalonians-1", "John Calvin", "Commentary on 1 Thessalonians", "reformed", "1 Thessalonians 1:1", "https://ccel.org/ccel/calvin/calcom42/calcom42.vi.iii.i.html", ["thessalonians", "paul", "calvin", "grace", "church"], ["1TH"], [1]),
  e("henry-1thessalonians-1", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "1 Thessalonians 1", "https://ccel.org/ccel/henry/mhc6/mhc6.iTh.ii.html", ["thessalonians", "paul", "henry", "grace", "faith"], ["1TH"], [1]),
  e("calvin-2thessalonians-1", "John Calvin", "Commentary on 2 Thessalonians", "reformed", "2 Thessalonians 1:1–7", "https://ccel.org/ccel/calvin/calcom42/calcom42.vii.iii.i.html", ["thessalonians", "paul", "calvin", "grace", "affliction"], ["2TH"], [1]),
  e("henry-2thessalonians-1", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "2 Thessalonians 1", "https://ccel.org/ccel/henry/mhc6/mhc6.iiTh.ii.html", ["thessalonians", "paul", "henry", "grace", "patience"], ["2TH"], [1]),
  e("calvin-1timothy-1", "John Calvin", "Commentary on 1 Timothy", "reformed", "1 Timothy 1:1–4", "https://ccel.org/ccel/calvin/calcom43/calcom43.iii.iii.i.html", ["timothy", "paul", "calvin", "charge", "doctrine"], ["1TI"], [1]),
  e("henry-1timothy-1", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "1 Timothy 1", "https://ccel.org/ccel/henry/mhc6/mhc6.iTim.ii.html", ["timothy", "paul", "henry", "charge", "doctrine"], ["1TI"], [1]),
  e("calvin-2timothy-1", "John Calvin", "Commentary on 2 Timothy", "reformed", "2 Timothy 1:1–2", "https://ccel.org/ccel/calvin/calcom43/calcom43.iv.ii.i.html", ["timothy", "paul", "calvin", "promise", "life"], ["2TI"], [1]),
  e("henry-2timothy-1", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "2 Timothy 1", "https://ccel.org/ccel/henry/mhc6/mhc6.iiTim.ii.html", ["timothy", "paul", "henry", "gift", "fear"], ["2TI"], [1]),
  e("calvin-titus-1", "John Calvin", "Commentary on Titus", "reformed", "Titus 1:1–4", "https://ccel.org/ccel/calvin/calcom43/calcom43.v.iii.i.html", ["titus", "paul", "calvin", "elect", "truth"], ["TIT"], [1]),
  e("henry-titus-1", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "Titus 1", "https://ccel.org/ccel/henry/mhc6/mhc6.Tit.ii.html", ["titus", "paul", "henry", "elders", "sound"], ["TIT"], [1]),
  e("henry-philemon-1", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "Philemon", "https://ccel.org/ccel/henry/mhc6/mhc6.Phm.ii.html", ["philemon", "paul", "henry", "onesimus", "prisoner"], ["PHM"], [1]),
  e("calvin-hebrews-1", "John Calvin", "Commentary on Hebrews", "reformed", "Hebrews 1:1–2", "https://ccel.org/ccel/calvin/calcom44/calcom44.vii.i.html", ["hebrews", "calvin", "prophets", "son"], ["HEB"], [1]),
  e("henry-hebrews-1", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "Hebrews 1", "https://ccel.org/ccel/henry/mhc6/mhc6.Heb.ii.html", ["hebrews", "henry", "prophets", "son"], ["HEB"], [1]),
  e("calvin-james-1", "John Calvin", "Commentary on James", "reformed", "James 1:1–4", "https://ccel.org/ccel/calvin/calcom45/calcom45.vi.ii.i.html", ["james", "calvin", "trials", "patience"], ["JAS"], [1]),
  e("henry-james-1", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "James 1", "https://ccel.org/ccel/henry/mhc6/mhc6.Jam.ii.html", ["james", "henry", "trials", "patience"], ["JAS"], [1]),
  e("calvin-1peter-1", "John Calvin", "Commentary on 1 Peter", "reformed", "1 Peter 1:1–2", "https://ccel.org/ccel/calvin/calcom45/calcom45.iv.ii.i.html", ["peter", "calvin", "elect", "strangers"], ["1PE"], [1]),
  e("henry-1peter-1", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "1 Peter 1", "https://ccel.org/ccel/henry/mhc6/mhc6.iPet.ii.html", ["peter", "henry", "elect", "hope"], ["1PE"], [1]),
  e("calvin-2peter-1", "John Calvin", "Commentary on 2 Peter", "reformed", "2 Peter 1:1–4", "https://ccel.org/ccel/calvin/calcom45/calcom45.vii.ii.i.html", ["peter", "calvin", "precious", "faith"], ["2PE"], [1]),
  e("henry-2peter-1", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "2 Peter 1", "https://ccel.org/ccel/henry/mhc6/mhc6.iiPet.ii.html", ["peter", "henry", "precious", "faith"], ["2PE"], [1]),
  e("calvin-1john-1", "John Calvin", "Commentary on 1 John", "reformed", "1 John 1:1–2", "https://ccel.org/ccel/calvin/calcom45/calcom45.v.ii.i.html", ["john", "calvin", "beginning", "life"], ["1JN"], [1]),
  e("henry-1john-1", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "1 John 1", "https://ccel.org/ccel/henry/mhc6/mhc6.iJo.ii.html", ["john", "henry", "beginning", "light"], ["1JN"], [1]),
  e("henry-2john-1", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "2 John", "https://ccel.org/ccel/henry/mhc6/mhc6.iiJo.ii.html", ["john", "henry", "elect", "lady", "truth"], ["2JN"], [1]),
  e("henry-3john-1", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "3 John", "https://ccel.org/ccel/henry/mhc6/mhc6.iiiJo.ii.html", ["john", "henry", "gaius", "truth"], ["3JN"], [1]),
  e("calvin-jude-1", "John Calvin", "Commentary on Jude", "reformed", "Jude 1", "https://ccel.org/ccel/calvin/calcom45/calcom45.viii.ii.i.html", ["jude", "calvin", "ungodly", "faith"], ["JUD"], [1]),
  e("henry-jude-1", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "Jude", "https://ccel.org/ccel/henry/mhc6/mhc6.Ju.ii.html", ["jude", "henry", "ungodly", "faith"], ["JUD"], [1]),
  e("henry-revelation-1", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "Revelation 1", "https://ccel.org/ccel/henry/mhc6/mhc6.Rev.ii.html", ["revelation", "henry", "apocalypse", "alpha"], ["REV"], [1]),

  // Colossians chapter pages — all four chapters, not only 1:24
  e("calvin-colossians-1-open", "John Calvin", "Commentary on Colossians", "reformed", "Colossians 1:1–8", "https://ccel.org/ccel/calvin/calcom42/calcom42.v.ii.i.html", ["colossians", "col", "calvin", "apostle", "paul", "faith"], ["COL"], [1]),
  e("calvin-colossians-1-hymn", "John Calvin", "Commentary on Colossians", "reformed", "Colossians 1:15–18", "https://ccel.org/ccel/calvin/calcom42/calcom42.v.ii.iii.html", ["colossians", "col", "calvin", "image", "invisible", "firstborn", "fullness", "dwell"], ["COL"], [1]),
  e("calvin-colossians-1", "John Calvin", "Commentary on Colossians", "reformed", "Colossians 1:24–29", "https://ccel.org/ccel/calvin/calcom42/calcom42.v.ii.vi.html", ["colossians", "col", "calvin", "sufferings", "afflictions", "church", "flesh"], ["COL"], [1]),
  e("henry-colossians-1", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "Colossians 1", "https://ccel.org/ccel/henry/mhc6/mhc6.Col.ii.html", ["colossians", "col", "henry", "image", "firstborn", "fullness", "sufferings", "afflictions", "church"], ["COL"], [1]),
  e("chrysostom-col-h3", "John Chrysostom", "Homilies on Colossians 3", "patristic", "Homily 3", "https://www.newadvent.org/fathers/230303.htm", ["colossians", "col", "chrysostom", "image", "invisible", "firstborn"], ["COL"], [1]),
  e("chrysostom-colossians-h4", "John Chrysostom", "Homilies on Colossians 4", "patristic", "Homily 4", "https://www.newadvent.org/fathers/230304.htm", ["colossians", "col", "chrysostom", "sufferings", "afflictions", "church", "flesh"], ["COL"], [1]),
  e("calvin-colossians-2", "John Calvin", "Commentary on Colossians", "reformed", "Colossians 2:1", "https://ccel.org/ccel/calvin/calcom42/calcom42.v.iii.i.html", ["colossians", "col", "calvin", "philosophy", "deceit", "captive", "fullness"], ["COL"], [2]),
  e("chrysostom-col-h6", "John Chrysostom", "Homilies on Colossians 6", "patristic", "Homily 6", "https://www.newadvent.org/fathers/230306.htm", ["colossians", "col", "chrysostom", "philosophy", "walk", "rooted"], ["COL"], [2]),
  e("chrysostom-col-h7", "John Chrysostom", "Homilies on Colossians 7", "patristic", "Homily 7", "https://www.newadvent.org/fathers/230307.htm", ["colossians", "col", "chrysostom", "shadow", "body", "christ"], ["COL"], [2]),
  e("calvin-colossians-3", "John Calvin", "Commentary on Colossians", "reformed", "Colossians 3:1", "https://ccel.org/ccel/calvin/calcom42/calcom42.v.iv.i.html", ["colossians", "col", "calvin", "hidden", "christ", "life", "above"], ["COL"], [3]),
  e("chrysostom-col-h8", "John Chrysostom", "Homilies on Colossians 8", "patristic", "Homily 8", "https://www.newadvent.org/fathers/230308.htm", ["colossians", "col", "chrysostom", "hidden", "christ", "life"], ["COL"], [3]),
  e("chrysostom-col-h9", "John Chrysostom", "Homilies on Colossians 9", "patristic", "Homily 9", "https://www.newadvent.org/fathers/230309.htm", ["colossians", "col", "chrysostom", "word", "sing", "peace"], ["COL"], [3]),
  e("calvin-colossians-4", "John Calvin", "Commentary on Colossians", "reformed", "Colossians 4:1", "https://ccel.org/ccel/calvin/calcom42/calcom42.v.v.i.html", ["colossians", "col", "calvin", "prayer", "speech", "grace"], ["COL"], [4]),
  e("chrysostom-col-h11", "John Chrysostom", "Homilies on Colossians 11", "patristic", "Homily 11", "https://www.newadvent.org/fathers/230311.htm", ["colossians", "col", "chrysostom", "prayer", "speech"], ["COL"], [4]),

  // Distinctive mid-book pages and sermons — not a per-chapter dump
  e("henry-hebrews-4", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "Hebrews 4", "https://ccel.org/ccel/henry/mhc6/mhc6.Heb.v.html", ["hebrews", "henry", "word", "logos", "sword", "rest"], ["HEB"], [4]),
  e("calvin-hebrews-4", "John Calvin", "Commentary on Hebrews", "reformed", "Heb 4:1", "https://ccel.org/ccel/calvin/calcom44/calcom44.x.i.html", ["hebrews", "calvin", "word", "logos", "rest", "faith"], ["HEB"], [4]),
  e("henry-revelation-19", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "Revelation 19", "https://ccel.org/ccel/henry/mhc6/mhc6.Rev.xx.html", ["revelation", "henry", "word", "logos", "blood", "king"], ["REV"], [19]),
  e("augustine-sotm-1", "Augustine", "On the Sermon on the Mount, Book 1", "patristic", "Matthew 5", "https://www.newadvent.org/fathers/16011.htm", ["matthew", "beatitudes", "sermon", "mount", "augustine"], ["MAT"], [5]),
  e("augustine-sotm-2", "Augustine", "On the Sermon on the Mount, Book 2", "patristic", "Matthew 6–7", "https://www.newadvent.org/fathers/16012.htm", ["matthew", "prayer", "sermon", "mount", "augustine"], ["MAT"], [6, 7]),
  e("luther-sermon-tares", "Martin Luther", "Assorted Sermons", "lutheran", "The Wheat and the Tares", "https://ccel.org/ccel/luther/sermons/sermons.i.iii.html", ["matthew", "tares", "wheat", "kingdom", "luther"], ["MAT"], [13]),
  e("luther-sermon-sower", "Martin Luther", "Assorted Sermons", "lutheran", "Luke 8:4–15", "https://ccel.org/ccel/luther/sermons/sermons.ii.ii.html", ["luke", "sower", "word", "luther"], ["LUK"], [8]),
  e("luther-sermon-high-priest", "Martin Luther", "Assorted Sermons", "lutheran", "Hebrews 9:11–15", "https://ccel.org/ccel/luther/sermons/sermons.iii.i.html", ["hebrews", "priest", "blood", "luther"], ["HEB"], [9]),
  e("luther-sermon-law-gospel", "Martin Luther", "Assorted Sermons", "lutheran", "2 Corinthians 3:4–11", "https://ccel.org/ccel/luther/sermons/sermons.v.i.html", ["corinthians", "law", "gospel", "spirit", "luther"], ["2CO"], [3]),
  e("luther-sermon-john-6", "Martin Luther", "Assorted Sermons", "lutheran", "John 6:44–55", "https://ccel.org/ccel/luther/sermons/sermons.vii.iii.html", ["john", "bread", "faith", "luther"], ["JHN"], [6]),
  e("luther-sermon-john-10", "Martin Luther", "Assorted Sermons", "lutheran", "John 10:1–11", "https://ccel.org/ccel/luther/sermons/sermons.viii.iii.html", ["john", "shepherd", "door", "preaching", "luther"], ["JHN"], [10]),
  e("aquinas-catena-matthew-1", "Thomas Aquinas", "Catena Aurea on Matthew", "catholic", "Matthew 1", "https://www.ccel.org/ccel/aquinas/catena1.ii.i.html", ["matthew", "gospel", "aquinas", "thomas", "catena"], ["MAT"], [1]),
  e("owen-hebrews-6", "John Owen", "Nature and Causes of Apostasy from the Gospel", "reformed", "Hebrews 6:4–6", "https://ccel.org/ccel/owen/apostasy/apostasy.i.v.html", ["hebrews", "apostasy", "owen", "gospel"], ["HEB"], [6]),
];

/** MHC chapter N is roman(N+1) because .i.html is the book intro. */
const ROMAN = [
  "", "i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x",
  "xi", "xii", "xiii", "xiv", "xv", "xvi", "xvii", "xviii", "xix", "xx",
  "xxi", "xxii", "xxiii", "xxiv", "xxv", "xxvi", "xxvii", "xxviii", "xxix",
] as const;

const HENRY_NT = [
  ["matthew", "MAT", "Matt", "mhc5", "Matthew", 28],
  ["mark", "MRK", "Mark", "mhc5", "Mark", 16],
  ["luke", "LUK", "Luke", "mhc5", "Luke", 24],
  ["john", "JHN", "John", "mhc5", "John", 21],
  ["acts", "ACT", "Acts", "mhc6", "Acts", 28],
  ["romans", "ROM", "Rom", "mhc6", "Romans", 16],
  ["1corinthians", "1CO", "iCor", "mhc6", "1 Corinthians", 16],
  ["2corinthians", "2CO", "iiCor", "mhc6", "2 Corinthians", 13],
  ["galatians", "GAL", "Gal", "mhc6", "Galatians", 6],
  ["ephesians", "EPH", "Eph", "mhc6", "Ephesians", 6],
  ["philippians", "PHP", "Phi", "mhc6", "Philippians", 4],
  ["colossians", "COL", "Col", "mhc6", "Colossians", 4],
  ["1thessalonians", "1TH", "iTh", "mhc6", "1 Thessalonians", 5],
  ["2thessalonians", "2TH", "iiTh", "mhc6", "2 Thessalonians", 3],
  ["1timothy", "1TI", "iTim", "mhc6", "1 Timothy", 6],
  ["2timothy", "2TI", "iiTim", "mhc6", "2 Timothy", 4],
  ["titus", "TIT", "Tit", "mhc6", "Titus", 3],
  ["philemon", "PHM", "Phm", "mhc6", "Philemon", 1],
  ["hebrews", "HEB", "Heb", "mhc6", "Hebrews", 13],
  ["james", "JAS", "Jam", "mhc6", "James", 5],
  ["1peter", "1PE", "iPet", "mhc6", "1 Peter", 5],
  ["2peter", "2PE", "iiPet", "mhc6", "2 Peter", 3],
  ["1john", "1JN", "iJo", "mhc6", "1 John", 5],
  ["2john", "2JN", "iiJo", "mhc6", "2 John", 1],
  ["3john", "3JN", "iiiJo", "mhc6", "3 John", 1],
  ["jude", "JUD", "Ju", "mhc6", "Jude", 1],
  ["revelation", "REV", "Rev", "mhc6", "Revelation", 22],
] as const;

function henryNtChapters(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const [stem, bookId, slug, vol, name, chapters] of HENRY_NT) {
    const tag = name.toLowerCase().replace(/^\d+\s+/, "");
    for (let ch = 1; ch <= chapters; ch++) {
      const id = `henry-${stem}-${ch}`;
      if (have.has(id)) continue;
      const file = ROMAN[ch + 1];
      if (!file) continue;
      out.push(
        e(
          id,
          "Matthew Henry",
          "Commentary on the Whole Bible",
          "reformed",
          `${name} ${ch}`,
          `https://ccel.org/ccel/henry/${vol}/${vol}.${slug}.${file}.html`,
          [tag, "henry"],
          [bookId],
          [ch],
        ),
      );
    }
  }
  return out;
}

/** Sacred-texts / BibleHub NT book rows: stem, bookId, display name, chapters, sacred code, biblehub slug. */
const WAVE1_NT = [
  ["matthew", "MAT", "Matthew", 28, "mat", "matthew"],
  ["mark", "MRK", "Mark", 16, "mar", "mark"],
  ["luke", "LUK", "Luke", 24, "luk", "luke"],
  ["john", "JHN", "John", 21, "joh", "john"],
  ["acts", "ACT", "Acts", 28, "act", "acts"],
  ["romans", "ROM", "Romans", 16, "rom", "romans"],
  ["1corinthians", "1CO", "1 Corinthians", 16, "co1", "1_corinthians"],
  ["2corinthians", "2CO", "2 Corinthians", 13, "co2", "2_corinthians"],
  ["galatians", "GAL", "Galatians", 6, "gal", "galatians"],
  ["ephesians", "EPH", "Ephesians", 6, "eph", "ephesians"],
  ["philippians", "PHP", "Philippians", 4, "phi", "philippians"],
  ["colossians", "COL", "Colossians", 4, "col", "colossians"],
  ["1thessalonians", "1TH", "1 Thessalonians", 5, "th1", "1_thessalonians"],
  ["2thessalonians", "2TH", "2 Thessalonians", 3, "th2", "2_thessalonians"],
  ["1timothy", "1TI", "1 Timothy", 6, "ti1", "1_timothy"],
  ["2timothy", "2TI", "2 Timothy", 4, "ti2", "2_timothy"],
  ["titus", "TIT", "Titus", 3, "tit", "titus"],
  ["philemon", "PHM", "Philemon", 1, "phm", "philemon"],
  ["hebrews", "HEB", "Hebrews", 13, "heb", "hebrews"],
  ["james", "JAS", "James", 5, "jam", "james"],
  ["1peter", "1PE", "1 Peter", 5, "pe1", "1_peter"],
  ["2peter", "2PE", "2 Peter", 3, "pe2", "2_peter"],
  ["1john", "1JN", "1 John", 5, "jo1", "1_john"],
  ["2john", "2JN", "2 John", 1, "jo2", "2_john"],
  ["3john", "3JN", "3 John", 1, "jo3", "3_john"],
  ["jude", "JUD", "Jude", 1, "jde", "jude"],
  ["revelation", "REV", "Revelation", 22, "rev", "revelation"],
] as const;

function pad3(n: number): string {
  return String(n).padStart(3, "0");
}

function gillNtChapters(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const [stem, bookId, name, chapters, code, hub] of WAVE1_NT) {
    const tag = name.toLowerCase().replace(/^\d+\s+/, "");
    for (let ch = 1; ch <= chapters; ch++) {
      const id = `gill-${stem}-${ch}`;
      if (have.has(id)) continue;
      const entry = e(
        id,
        "John Gill",
        "Exposition of the Old and New Testament",
        "reformed",
        `${name} ${ch}`,
        `https://archive.sacred-texts.com/bib/cmt/gill/${code}${pad3(ch)}.htm`,
        [tag, "gill", "baptist"],
        [bookId],
        [ch],
      );
      entry.altUrl = `https://biblehub.com/commentaries/gill/${hub}/${ch}.htm`;
      out.push(entry);
    }
  }
  return out;
}

function genevaNtChapters(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const [stem, bookId, name, chapters, code, hub] of WAVE1_NT) {
    const tag = name.toLowerCase().replace(/^\d+\s+/, "");
    for (let ch = 1; ch <= chapters; ch++) {
      const id = `geneva-${stem}-${ch}`;
      if (have.has(id)) continue;
      const entry = e(
        id,
        "Geneva Bible",
        "1599 Geneva Bible Notes",
        "reformed",
        `${name} ${ch}`,
        `https://archive.sacred-texts.com/bib/cmt/geneva/${code}${pad3(ch)}.htm`,
        [tag, "geneva"],
        [bookId],
        [ch],
      );
      entry.altUrl = `https://biblehub.com/commentaries/gsb/${hub}/${ch}.htm`;
      out.push(entry);
    }
  }
  return out;
}

function pooleNtChapters(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const [stem, bookId, name, chapters, , hub] of WAVE1_NT) {
    const tag = name.toLowerCase().replace(/^\d+\s+/, "");
    for (let ch = 1; ch <= chapters; ch++) {
      const id = `poole-${stem}-${ch}`;
      if (have.has(id)) continue;
      out.push(
        e(
          id,
          "Matthew Poole",
          "Annotations upon the Holy Bible",
          "reformed",
          `${name} ${ch}`,
          `https://biblehub.com/commentaries/poole/${hub}/${ch}.htm`,
          [tag, "poole"],
          [bookId],
          [ch],
        ),
      );
    }
  }
  return out;
}

function jfbNtChapters(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const [stem, bookId, name, chapters, code, hub] of WAVE1_NT) {
    const tag = name.toLowerCase().replace(/^\d+\s+/, "");
    for (let ch = 1; ch <= chapters; ch++) {
      const id = `jfb-${stem}-${ch}`;
      if (have.has(id)) continue;
      const entry = e(
        id,
        "Jamieson-Fausset-Brown",
        "Commentary Critical and Explanatory on the Whole Bible",
        "reformed",
        `${name} ${ch}`,
        `https://archive.sacred-texts.com/bib/cmt/jfb/${code}${pad3(ch)}.htm`,
        [tag, "jfb"],
        [bookId],
        [ch],
      );
      entry.altUrl = `https://biblehub.com/commentaries/jfb/${hub}/${ch}.htm`;
      out.push(entry);
    }
  }
  return out;
}

function langeNtChapters(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const [stem, bookId, name, chapters, , hub] of WAVE1_NT) {
    const tag = name.toLowerCase().replace(/^\d+\s+/, "");
    for (let ch = 1; ch <= chapters; ch++) {
      const id = `lange-${stem}-${ch}`;
      if (have.has(id)) continue;
      out.push(
        e(
          id,
          "John Peter Lange",
          "Commentary on the Holy Scriptures",
          "reformed",
          `${name} ${ch}`,
          `https://biblehub.com/commentaries/lange/${hub}/${ch}.htm`,
          [tag, "lange"],
          [bookId],
          [ch],
        ),
      );
    }
  }
  return out;
}


function barnesNtChapters(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const [stem, bookId, name, chapters, code, hub] of WAVE1_NT) {
    const tag = name.toLowerCase().replace(/^\d+\s+/, "");
    for (let ch = 1; ch <= chapters; ch++) {
      const id = `barnes-${stem}-${ch}`;
      if (have.has(id)) continue;
      const entry = e(
        id,
        "Albert Barnes",
        "Notes on the New Testament",
        "reformed",
        `${name} ${ch}`,
        `https://biblehub.com/commentaries/barnes/${hub}/${ch}.htm`,
        [tag, "barnes"],
        [bookId],
        [ch],
      );
      entry.altUrl = `https://archive.sacred-texts.com/bib/cmt/barnes/${code}${pad3(ch)}.htm`;
      out.push(entry);
    }
  }
  return out;
}

function maclarenNtChapters(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const [stem, bookId, name, chapters, , hub] of WAVE1_NT) {
    const tag = name.toLowerCase().replace(/^\d+\s+/, "");
    for (let ch = 1; ch <= chapters; ch++) {
      const id = `maclaren-${stem}-${ch}`;
      if (have.has(id)) continue;
      out.push(
        e(
          id,
          "Alexander MacLaren",
          "Expositions of Holy Scripture",
          "reformed",
          `${name} ${ch}`,
          `https://biblehub.com/commentaries/maclaren/${hub}/${ch}.htm`,
          [tag, "maclaren"],
          [bookId],
          [ch],
        ),
      );
    }
  }
  return out;
}

function vwsNtChapters(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const [stem, bookId, name, chapters, code, hub] of WAVE1_NT) {
    const tag = name.toLowerCase().replace(/^\d+\s+/, "");
    for (let ch = 1; ch <= chapters; ch++) {
      const id = `vws-${stem}-${ch}`;
      if (have.has(id)) continue;
      const entry = e(
        id,
        "Marvin Vincent",
        "Word Studies in the New Testament",
        "reformed",
        `${name} ${ch}`,
        `https://biblehub.com/commentaries/vws/${hub}/${ch}.htm`,
        [tag, "vws"],
        [bookId],
        [ch],
      );
      entry.altUrl = `https://archive.sacred-texts.com/bib/cmt/vws/${code}${pad3(ch)}.htm`;
      out.push(entry);
    }
  }
  return out;
}

/** BibliaPlus book path: Hub slug with underscores → hyphens (1_corinthians → 1-corinthians). */
function bibliaplusBookSlug(hub: string): string {
  return hub.replace(/_/g, "-");
}

function hawkerNtChapters(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const [stem, bookId, name, chapters, , hub] of WAVE1_NT) {
    const tag = name.toLowerCase().replace(/^\d+\s+/, "");
    const bookSlug = bibliaplusBookSlug(hub);
    for (let ch = 1; ch <= chapters; ch++) {
      const id = `hawker-${stem}-${ch}`;
      if (have.has(id)) continue;
      out.push(
        e(
          id,
          "Robert Hawker",
          "Poor Man's Commentary",
          "reformed",
          `${name} ${ch}`,
          `https://www.bibliaplus.org/en/commentaries/96/hawkers-poor-mans-commentary/${bookSlug}/${ch}/1`,
          [tag, "hawker"],
          [bookId],
          [ch],
        ),
      );
    }
  }
  return out;
}

function trappNtChapters(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const [stem, bookId, name, chapters, , hub] of WAVE1_NT) {
    const tag = name.toLowerCase().replace(/^\d+\s+/, "");
    const bookSlug = bibliaplusBookSlug(hub);
    for (let ch = 1; ch <= chapters; ch++) {
      const id = `trapp-${stem}-${ch}`;
      if (have.has(id)) continue;
      out.push(
        e(
          id,
          "John Trapp",
          "Complete Commentary",
          "puritan",
          `${name} ${ch}`,
          `https://www.bibliaplus.org/en/commentaries/192/john-trapp-complete-commentary/${bookSlug}/${ch}/1`,
          [tag, "trapp"],
          [bookId],
          [ch],
        ),
      );
    }
  }
  return out;
}

function burkittNtChapters(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const [stem, bookId, name, chapters, , hub] of WAVE1_NT) {
    const tag = name.toLowerCase().replace(/^\d+\s+/, "");
    const bookSlug = bibliaplusBookSlug(hub);
    for (let ch = 1; ch <= chapters; ch++) {
      const id = `burkitt-${stem}-${ch}`;
      if (have.has(id)) continue;
      out.push(
        e(
          id,
          "William Burkitt",
          "Expository Notes",
          "puritan",
          `${name} ${ch}`,
          `https://www.bibliaplus.org/en/commentaries/494/william-burkitts-expository-notes/${bookSlug}/${ch}/1`,
          [tag, "burkitt"],
          [bookId],
          [ch],
        ),
      );
    }
  }
  return out;
}

function cambridgeNtChapters(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const [stem, bookId, name, chapters, , hub] of WAVE1_NT) {
    const tag = name.toLowerCase().replace(/^\d+\s+/, "");
    for (let ch = 1; ch <= chapters; ch++) {
      const id = `cambridge-${stem}-${ch}`;
      if (have.has(id)) continue;
      out.push(
        e(
          id,
          "Cambridge Bible",
          "Cambridge Bible for Schools and Colleges",
          "reformed",
          `${name} ${ch}`,
          `https://biblehub.com/commentaries/cambridge/${hub}/${ch}.htm`,
          [tag, "cambridge"],
          [bookId],
          [ch],
        ),
      );
    }
  }
  return out;
}

function ellicottNtChapters(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const [stem, bookId, name, chapters, , hub] of WAVE1_NT) {
    const tag = name.toLowerCase().replace(/^\d+\s+/, "");
    for (let ch = 1; ch <= chapters; ch++) {
      const id = `ellicott-${stem}-${ch}`;
      if (have.has(id)) continue;
      out.push(
        e(
          id,
          "Charles Ellicott",
          "Commentary for English Readers",
          "reformed",
          `${name} ${ch}`,
          `https://biblehub.com/commentaries/ellicott/${hub}/${ch}.htm`,
          [tag, "ellicott"],
          [bookId],
          [ch],
        ),
      );
    }
  }
  return out;
}

function pulpitNtChapters(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const [stem, bookId, name, chapters, , hub] of WAVE1_NT) {
    const tag = name.toLowerCase().replace(/^\d+\s+/, "");
    for (let ch = 1; ch <= chapters; ch++) {
      const id = `pulpit-${stem}-${ch}`;
      if (have.has(id)) continue;
      out.push(
        e(
          id,
          "Pulpit Commentary",
          "The Pulpit Commentary",
          "reformed",
          `${name} ${ch}`,
          `https://biblehub.com/commentaries/pulpit/${hub}/${ch}.htm`,
          [tag, "pulpit"],
          [bookId],
          [ch],
        ),
      );
    }
  }
  return out;
}

function meyerNtChapters(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const [stem, bookId, name, chapters, , hub] of WAVE1_NT) {
    const tag = name.toLowerCase().replace(/^\d+\s+/, "");
    for (let ch = 1; ch <= chapters; ch++) {
      const id = `meyer-${stem}-${ch}`;
      if (have.has(id)) continue;
      out.push(
        e(
          id,
          "Heinrich Meyer",
          "Critical and Exegetical Commentary on the New Testament",
          "lutheran",
          `${name} ${ch}`,
          `https://biblehub.com/commentaries/meyer/${hub}/${ch}.htm`,
          [tag, "meyer"],
          [bookId],
          [ch],
        ),
      );
    }
  }
  return out;
}

function egtNtChapters(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const [stem, bookId, name, chapters, , hub] of WAVE1_NT) {
    const tag = name.toLowerCase().replace(/^\d+\s+/, "");
    for (let ch = 1; ch <= chapters; ch++) {
      const id = `egt-${stem}-${ch}`;
      if (have.has(id)) continue;
      out.push(
        e(
          id,
          "Expositor's Greek Testament",
          "The Expositor's Greek Testament",
          "reformed",
          `${name} ${ch}`,
          `https://biblehub.com/commentaries/egt/${hub}/${ch}.htm`,
          [tag, "egt", "nicoll"],
          [bookId],
          [ch],
        ),
      );
    }
  }
  return out;
}

function owenHebrewsChapters(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (let ch = 1; ch <= 13; ch++) {
    const id = `owen-hebrews-${ch}`;
    if (have.has(id)) continue;
    out.push(
      e(
        id,
        "John Owen",
        "Exposition of the Epistle to the Hebrews",
        "puritan",
        `Hebrews ${ch}`,
        `https://www.bibliaplus.org/en/commentaries/446/john-owens-exposition-of-the-epistle-to-the-hebrews7-vols/hebrews/${ch}`,
        ["hebrews", "owen", "puritan"],
        ["HEB"],
        [ch],
      ),
    );
  }
  return out;
}

function kretzmannNtChapters(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const [stem, bookId, name, chapters, , hub] of WAVE1_NT) {
    const tag = name.toLowerCase().replace(/^\d+\s+/, "");
    const bookSlug = bibliaplusBookSlug(hub);
    for (let ch = 1; ch <= chapters; ch++) {
      const id = `kretzmann-${stem}-${ch}`;
      if (have.has(id)) continue;
      out.push(
        e(
          id,
          "Paul Kretzmann",
          "Popular Commentary of the Bible",
          "lutheran",
          `${name} ${ch}`,
          `https://www.bibliaplus.org/en/commentaries/114/kretzmanns-popular-commentary-of-the-bible/${bookSlug}/${ch}`,
          [tag, "kretzmann", "lutheran"],
          [bookId],
          [ch],
        ),
      );
    }
  }
  return out;
}


/** Hodge Ephesians only — CCEL chapters i–vi → Eph 1–6. */
const HODGE_EPH_ROMAN = ["i", "ii", "iii", "iv", "v", "vi"] as const;

function hodgeEphesiansChapters(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (let ch = 1; ch <= 6; ch++) {
    const id = `hodge-eph-${ch}`;
    if (have.has(id)) continue;
    const roman = HODGE_EPH_ROMAN[ch - 1]!;
    out.push(
      e(
        id,
        "Charles Hodge",
        "Commentary on the Epistle to the Ephesians",
        "reformed",
        `Ephesians ${ch}`,
        `https://ccel.org/ccel/hodge/ephesians/ephesians.iii.${roman}.html`,
        ["ephesians", "hodge", "reformed"],
        ["EPH"],
        [ch],
      ),
    );
  }
  return out;
}

/**
 * A.T. Robertson Word Pictures (godrules) — scoped NT chapters.
 * Skip joh / heb / rev book codes (no aliases for those).
 */
function robertsonNtChapters(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  const SKIP_CODES = new Set(["joh", "heb", "rev"]);
  for (const [stem, bookId, name, chapters, code] of WAVE1_NT) {
    if (SKIP_CODES.has(code)) continue;
    const tag = name.toLowerCase().replace(/^\d+\s+/, "");
    for (let ch = 1; ch <= chapters; ch++) {
      const id = `robertson-${stem}-${ch}`;
      if (have.has(id)) continue;
      out.push(
        e(
          id,
          "A. T. Robertson",
          "Word Pictures in the New Testament",
          "reformed",
          `${name} ${ch}`,
          `https://godrules.net/library/robert/robert${code}${ch}.htm`,
          [tag, "robertson", "word-pictures"],
          [bookId],
          [ch],
        ),
      );
    }
  }
  return out;
}

/**
 * Expositor's Bible (Bible Hub). Skip Colossians — MacLaren volume already
 * covered by maclaren- entries.
 */
function expositorNtChapters(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const [stem, bookId, name, chapters, , hub] of WAVE1_NT) {
    if (stem === "colossians") continue;
    const tag = name.toLowerCase().replace(/^\d+\s+/, "");
    for (let ch = 1; ch <= chapters; ch++) {
      const id = `expositors-${stem}-${ch}`;
      if (have.has(id)) continue;
      out.push(
        e(
          id,
          "Expositor's Bible",
          "The Expositor's Bible",
          "reformed",
          `${name} ${ch}`,
          `https://biblehub.com/commentaries/expositors/${hub}/${ch}.htm`,
          [tag, "expositors", "expositor"],
          [bookId],
          [ch],
        ),
      );
    }
  }
  return out;
}

function bengelNtChapters(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const [stem, bookId, name, chapters, , hub] of WAVE1_NT) {
    const tag = name.toLowerCase().replace(/^\d+\s+/, "");
    for (let ch = 1; ch <= chapters; ch++) {
      const id = `bengel-${stem}-${ch}`;
      if (have.has(id)) continue;
      out.push(
        e(
          id,
          "Johann Albrecht Bengel",
          "Gnomon of the New Testament",
          "lutheran",
          `${name} ${ch}`,
          `https://biblehub.com/commentaries/bengel/${hub}/${ch}.htm`,
          [tag, "bengel", "gnomon"],
          [bookId],
          [ch],
        ),
      );
    }
  }
  return out;
}

function spurgeonNtChapters(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const [stem, bookId, name, chapters, , hub] of WAVE1_NT) {
    const tag = name.toLowerCase().replace(/^\d+\s+/, "");
    const bookSlug = bibliaplusBookSlug(hub);
    for (let ch = 1; ch <= chapters; ch++) {
      const id = `spurgeon-${stem}-${ch}`;
      if (have.has(id)) continue;
      out.push(
        e(
          id,
          "Charles Spurgeon",
          "Spurgeon's Bible Commentary",
          "reformed",
          `${name} ${ch}`,
          `https://www.bibliaplus.org/en/commentaries/9/spurgeon-bible-commentary/${bookSlug}/${ch}`,
          [tag, "spurgeon"],
          [bookId],
          [ch],
        ),
      );
    }
  }
  return out;
}

const SI = "https://www.sermonindex.net";

/** SI commentary chapter pages probed 200 on 2026-09-06. Matthew 1–4, 16, 17, 28 404. */
const RYLE_GOSPELS = [
  ["matthew", "MAT", "Matthew", 28],
  ["mark", "MRK", "Mark", 16],
  ["luke", "LUK", "Luke", 24],
  ["john", "JHN", "John", 21],
] as const;
const RYLE_SKIP_MAT = new Set([1, 2, 3, 4, 16, 17, 28]);

function ryleNtChapters(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const [stem, bookId, name, chapters] of RYLE_GOSPELS) {
    const tag = name.toLowerCase();
    for (let ch = 1; ch <= chapters; ch++) {
      if (bookId === "MAT" && RYLE_SKIP_MAT.has(ch)) continue;
      const id = `ryle-${stem}-${ch}`;
      if (have.has(id)) continue;
      out.push(
        e(
          id,
          "J. C. Ryle",
          "Expository Thoughts on the Gospels",
          "reformed",
          `${name} ${ch}`,
          `${SI}/commentary/ryle-expository-thoughts/${bookId}/${ch}/`,
          [tag, "ryle"],
          [bookId],
          [ch],
        ),
      );
    }
  }
  return out;
}

const GODET_BOOKS = [
  ["luke", "LUK", "Luke", 24, "Commentary on Luke"],
  ["john", "JHN", "John", 21, "Commentary on John"],
  ["romans", "ROM", "Romans", 16, "Commentary on Romans"],
  ["1corinthians", "1CO", "1 Corinthians", 16, "Commentary on First Corinthians"],
] as const;

function godetNtChapters(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const [stem, bookId, name, chapters, work] of GODET_BOOKS) {
    const tag = name.toLowerCase().replace(/^\d+\s+/, "");
    for (let ch = 1; ch <= chapters; ch++) {
      const id = `godet-${stem}-${ch}`;
      if (have.has(id)) continue;
      out.push(
        e(
          id,
          "Frédéric Godet",
          work,
          "reformed",
          `${name} ${ch}`,
          `${SI}/commentary/godet/${bookId}/${ch}/`,
          [tag, "godet"],
          [bookId],
          [ch],
        ),
      );
    }
  }
  return out;
}

/**
 * Haldane SI book pages. TOC n=1 preface, n=2 introduction, n=21 conclusion omitted.
 * ch1→n3 (alt n4), ch2→n5, ch3→n6 (alt n7), chN→n=N+4 through ch16→n20.
 */
const HALDANE_PAGES: Record<number, number[]> = {
  1: [3, 4],
  2: [5],
  3: [6, 7],
  4: [8],
  5: [9],
  6: [10],
  7: [11],
  8: [12],
  9: [13],
  10: [14],
  11: [15],
  12: [16],
  13: [17],
  14: [18],
  15: [19],
  16: [20],
};

function haldaneRomansChapters(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (let ch = 1; ch <= 16; ch++) {
    const pages = HALDANE_PAGES[ch];
    if (!pages?.length) continue;
    const id = `haldane-romans-${ch}`;
    if (have.has(id)) continue;
    const entry = e(
      id,
      "Robert Haldane",
      "Exposition of the Epistle to the Romans",
      "reformed",
      `Romans ${ch}`,
      `${SI}/books/haldane-robert-exposition-on-the-epistle-to-the-romans/${pages[0]}/`,
      ["romans", "haldane"],
      ["ROM"],
      [ch],
    );
    if (pages[1] != null) {
      entry.altUrl = `${SI}/books/haldane-robert-exposition-on-the-epistle-to-the-romans/${pages[1]}/`;
    }
    out.push(entry);
  }
  return out;
}

function broadusMatthewChapters(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (let ch = 1; ch <= 28; ch++) {
    const id = `broadus-matthew-${ch}`;
    if (have.has(id)) continue;
    out.push(
      e(
        id,
        "John A. Broadus",
        "Commentary on the Gospel of Matthew",
        "reformed",
        `Matthew ${ch}`,
        `${SI}/commentary/broadus/MAT/${ch}/`,
        ["matthew", "broadus"],
        ["MAT"],
        [ch],
      ),
    );
  }
  return out;
}

/** Hodge SI Romans + 1 Corinthians. Skip Eph — CCEL hodge-eph-* already indexed. */
const HODGE_SI_BOOKS = [
  ["romans", "ROM", "Romans", 16, "Commentary on the Epistle to the Romans"],
  ["1corinthians", "1CO", "1 Corinthians", 16, "Commentary on First Corinthians"],
] as const;

function hodgeSiChapters(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const [stem, bookId, name, chapters, work] of HODGE_SI_BOOKS) {
    const tag = name.toLowerCase().replace(/^\d+\s+/, "");
    for (let ch = 1; ch <= chapters; ch++) {
      const id = `hodge-${stem}-${ch}`;
      if (have.has(id)) continue;
      out.push(
        e(
          id,
          "Charles Hodge",
          work,
          "reformed",
          `${name} ${ch}`,
          `${SI}/commentary/hodge/${bookId}/${ch}/`,
          [tag, "hodge"],
          [bookId],
          [ch],
        ),
      );
    }
  }
  return out;
}

function alfordNtChapters(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const [stem, bookId, name, chapters, , hub] of WAVE1_NT) {
    const tag = name.toLowerCase().replace(/^\d+\s+/, "");
    for (let ch = 1; ch <= chapters; ch++) {
      const id = `alford-${stem}-${ch}`;
      if (have.has(id)) continue;
      out.push(
        e(
          id,
          "Henry Alford",
          "Greek Testament Critical Exegetical Commentary",
          "reformed",
          `${name} ${ch}`,
          `https://biblehub.com/commentaries/alford/${hub}/${ch}.htm`,
          [tag, "alford"],
          [bookId],
          [ch],
        ),
      );
    }
  }
  return out;
}

/** Luther Epistle Postils (Bible Hub library) — lectionary grain from published Text: lines. */
const LUTHER_EPISTLE_POSTILS: Array<{
  id: string;
  slug: string;
  vol: "ii" | "iii";
  locus: string;
  bookId: string;
  chapter: number;
  verses: [number, number];
}> = [
  { id: "luther-epistle-rom12-1", slug: "first_sunday_after_epiphany", vol: "ii", locus: "Romans 12:1-6", bookId: "ROM", chapter: 12, verses: [1, 6] },
  { id: "luther-epistle-rom12-6", slug: "second_sunday_after_epiphany", vol: "ii", locus: "Romans 12:6-16", bookId: "ROM", chapter: 12, verses: [6, 16] },
  { id: "luther-epistle-rom12-16", slug: "third_sunday_after_epiphany", vol: "ii", locus: "Romans 12:16-21", bookId: "ROM", chapter: 12, verses: [16, 21] },
  { id: "luther-epistle-rom13-8", slug: "fourth_sunday_after_epiphany", vol: "ii", locus: "Romans 13:8-10", bookId: "ROM", chapter: 13, verses: [8, 10] },
  { id: "luther-epistle-col3-12", slug: "fifth_sunday_after_epiphany", vol: "ii", locus: "Colossians 3:12-17", bookId: "COL", chapter: 3, verses: [12, 17] },
  { id: "luther-epistle-1co9-24", slug: "third_sunday_before_lent", vol: "ii", locus: "1 Corinthians 9:24–10:5", bookId: "1CO", chapter: 9, verses: [24, 27] },
  { id: "luther-epistle-2co11-19", slug: "second_sunday_before_lent", vol: "ii", locus: "2 Corinthians 11:19–12:9", bookId: "2CO", chapter: 11, verses: [19, 33] },
  { id: "luther-epistle-1co13", slug: "sunday_before_lent", vol: "ii", locus: "1 Corinthians 13", bookId: "1CO", chapter: 13, verses: [1, 13] },
  { id: "luther-epistle-2co6-1", slug: "first_sunday_in_lent", vol: "ii", locus: "2 Corinthians 6:1-10", bookId: "2CO", chapter: 6, verses: [1, 10] },
  { id: "luther-epistle-1th4-1", slug: "second_sunday_in_lent", vol: "ii", locus: "1 Thessalonians 4:1-7", bookId: "1TH", chapter: 4, verses: [1, 7] },
  { id: "luther-epistle-eph5-1", slug: "third_sunday_in_lent", vol: "ii", locus: "Ephesians 5:1-9", bookId: "EPH", chapter: 5, verses: [1, 9] },
  { id: "luther-epistle-gal4-21", slug: "fourth_sunday_in_lent", vol: "ii", locus: "Galatians 4:21-31", bookId: "GAL", chapter: 4, verses: [21, 31] },
  { id: "luther-epistle-heb9-11", slug: "fifth_sunday_in_lent", vol: "ii", locus: "Hebrews 9:11-15", bookId: "HEB", chapter: 9, verses: [11, 15] },
  { id: "luther-epistle-php2-5", slug: "palm_sunday", vol: "ii", locus: "Philippians 2:5-11", bookId: "PHP", chapter: 2, verses: [5, 11] },
  { id: "luther-epistle-1co5-6", slug: "easter_sunday", vol: "ii", locus: "1 Corinthians 5:6-8", bookId: "1CO", chapter: 5, verses: [6, 8] },
  { id: "luther-epistle-act10-34", slug: "easter_monday", vol: "ii", locus: "Acts 10:34-43", bookId: "ACT", chapter: 10, verses: [34, 43] },
  { id: "luther-epistle-act13-26", slug: "easter_tuesday", vol: "ii", locus: "Acts 13:26-39", bookId: "ACT", chapter: 13, verses: [26, 39] },
  { id: "luther-epistle-col3-1", slug: "easter_wednesday_also_suited_to", vol: "ii", locus: "Colossians 3:1-7", bookId: "COL", chapter: 3, verses: [1, 7] },
  { id: "luther-epistle-1jn5-4", slug: "sunday_after_easter", vol: "ii", locus: "1 John 5:4-12", bookId: "1JN", chapter: 5, verses: [4, 12] },
  { id: "luther-epistle-1pe2-20", slug: "second_sunday_after_easter", vol: "ii", locus: "1 Peter 2:20-25", bookId: "1PE", chapter: 2, verses: [20, 25] },
  { id: "luther-epistle-1pe2-11", slug: "third_sunday_after_easter", vol: "ii", locus: "1 Peter 2:11-20", bookId: "1PE", chapter: 2, verses: [11, 20] },
  { id: "luther-epistle-1co15-20", slug: "third_sunday_after_easter_second", vol: "ii", locus: "1 Corinthians 15:20-28", bookId: "1CO", chapter: 15, verses: [20, 28] },
  { id: "luther-epistle-1co15-35", slug: "fourth_sunday_after_easter", vol: "ii", locus: "1 Corinthians 15:35-50", bookId: "1CO", chapter: 15, verses: [35, 50] },
  { id: "luther-epistle-jas1-16", slug: "fourth_sunday_after_easter_second", vol: "ii", locus: "James 1:16-21", bookId: "JAS", chapter: 1, verses: [16, 21] },
  { id: "luther-epistle-1co15-51", slug: "fifth_sunday_after_easter", vol: "ii", locus: "1 Corinthians 15:51-58", bookId: "1CO", chapter: 15, verses: [51, 58] },
  { id: "luther-epistle-act1-1", slug: "ascension_day", vol: "ii", locus: "Acts 1:1-11", bookId: "ACT", chapter: 1, verses: [1, 11] },
  { id: "luther-epistle-1pe4-7", slug: "sunday_after_ascension_day", vol: "ii", locus: "1 Peter 4:7-11", bookId: "1PE", chapter: 4, verses: [7, 11] },
  { id: "luther-epistle-act2-1", slug: "pentecost", vol: "ii", locus: "Acts 2:1-13", bookId: "ACT", chapter: 2, verses: [1, 13] },
  { id: "luther-epistle-act2-14", slug: "pentecost_monday", vol: "ii", locus: "Acts 2:14-28", bookId: "ACT", chapter: 2, verses: [14, 28] },
  { id: "luther-epistle-act2-29", slug: "pentecost_tuesday", vol: "ii", locus: "Acts 2:29-36", bookId: "ACT", chapter: 2, verses: [29, 36] },
  { id: "luther-epistle-rom11-33", slug: "trinity_sunday_the_article_of", vol: "iii", locus: "Romans 11:33-36", bookId: "ROM", chapter: 11, verses: [33, 36] },
  { id: "luther-epistle-1jn4-16", slug: "first_sunday_after_trinity_god", vol: "iii", locus: "1 John 4:16-21", bookId: "1JN", chapter: 4, verses: [16, 21] },
  { id: "luther-epistle-1jn3-13", slug: "second_sunday_after_trinity_exhortation", vol: "iii", locus: "1 John 3:13-18", bookId: "1JN", chapter: 3, verses: [13, 18] },
  { id: "luther-epistle-1pe5-5", slug: "third_sunday_after_trinity_humility", vol: "iii", locus: "1 Peter 5:5-11", bookId: "1PE", chapter: 5, verses: [5, 11] },
  { id: "luther-epistle-rom8-18", slug: "fourth_sunday_after_trinity_consolation", vol: "iii", locus: "Romans 8:18-22", bookId: "ROM", chapter: 8, verses: [18, 22] },
  { id: "luther-epistle-1pe3-8", slug: "fifth_sunday_after_trinity_exhortation", vol: "iii", locus: "1 Peter 3:8-15", bookId: "1PE", chapter: 3, verses: [8, 15] },
  { id: "luther-epistle-rom6-3", slug: "sixth_sunday_after_trinity_exhortation", vol: "iii", locus: "Romans 6:3-11", bookId: "ROM", chapter: 6, verses: [3, 11] },
  { id: "luther-epistle-rom6-19", slug: "seventh_sunday_after_trinity_exhortation", vol: "iii", locus: "Romans 6:19-23", bookId: "ROM", chapter: 6, verses: [19, 23] },
  { id: "luther-epistle-rom8-12", slug: "eighth_sunday_after_trinity_living", vol: "iii", locus: "Romans 8:12-17", bookId: "ROM", chapter: 8, verses: [12, 17] },
  { id: "luther-epistle-1co10-6", slug: "ninth_sunday_after_trinity_carnal", vol: "iii", locus: "1 Corinthians 10:6-13", bookId: "1CO", chapter: 10, verses: [6, 13] },
  { id: "luther-epistle-1co12-1", slug: "tenth_sunday_after_trinity_spiritual", vol: "iii", locus: "1 Corinthians 12:1-11", bookId: "1CO", chapter: 12, verses: [1, 11] },
  { id: "luther-epistle-1co15-1", slug: "eleventh_sunday_after_trinity_pauls", vol: "iii", locus: "1 Corinthians 15:1-10", bookId: "1CO", chapter: 15, verses: [1, 10] },
  { id: "luther-epistle-2co3-4", slug: "twelfth_sunday_after_trinity_gospel", vol: "iii", locus: "2 Corinthians 3:4-11", bookId: "2CO", chapter: 3, verses: [4, 11] },
  { id: "luther-epistle-gal3-15", slug: "thirteenth_sunday_after_trinity_gods", vol: "iii", locus: "Galatians 3:15-22", bookId: "GAL", chapter: 3, verses: [15, 22] },
  { id: "luther-epistle-gal5-16", slug: "fourteenth_sunday_after_trinity_works", vol: "iii", locus: "Galatians 5:16-24", bookId: "GAL", chapter: 5, verses: [16, 24] },
  { id: "luther-epistle-gal5-25", slug: "fifteenth_sunday_after_trinity_church", vol: "iii", locus: "Galatians 5:25–6:10", bookId: "GAL", chapter: 5, verses: [25, 26] },
  { id: "luther-epistle-eph3-13", slug: "sixteenth_sunday_after_trinity_pauls", vol: "iii", locus: "Ephesians 3:13-21", bookId: "EPH", chapter: 3, verses: [13, 21] },
  { id: "luther-epistle-eph4-1", slug: "seventeenth_sunday_after_trinity_the", vol: "iii", locus: "Ephesians 4:1-6", bookId: "EPH", chapter: 4, verses: [1, 6] },
  { id: "luther-epistle-1co1-4", slug: "eighteenth_sunday_after_trinity_treasure", vol: "iii", locus: "1 Corinthians 1:4-9", bookId: "1CO", chapter: 1, verses: [4, 9] },
  { id: "luther-epistle-eph4-22", slug: "nineteenth_sunday_after_trinity_duty", vol: "iii", locus: "Ephesians 4:22-28", bookId: "EPH", chapter: 4, verses: [22, 28] },
  { id: "luther-epistle-eph5-15", slug: "twentieth_sunday_after_trinity_the", vol: "iii", locus: "Ephesians 5:15-21", bookId: "EPH", chapter: 5, verses: [15, 21] },
  { id: "luther-epistle-eph6-10", slug: "twenty_first_sunday_after_trinity", vol: "iii", locus: "Ephesians 6:10-17", bookId: "EPH", chapter: 6, verses: [10, 17] },
  { id: "luther-epistle-php1-3", slug: "twenty_second_sunday_after_trinity", vol: "iii", locus: "Philippians 1:3-11", bookId: "PHP", chapter: 1, verses: [3, 11] },
  { id: "luther-epistle-php3-17", slug: "twenty_third_sunday_after_trinity", vol: "iii", locus: "Philippians 3:17-21", bookId: "PHP", chapter: 3, verses: [17, 21] },
  { id: "luther-epistle-col1-3", slug: "twenty_fourth_sunday_after_trinity", vol: "iii", locus: "Colossians 1:3-14", bookId: "COL", chapter: 1, verses: [3, 14] },
  { id: "luther-epistle-1th4-13", slug: "twenty_fifth_sunday_after_trinity", vol: "iii", locus: "1 Thessalonians 4:13-18", bookId: "1TH", chapter: 4, verses: [13, 18] },
  { id: "luther-epistle-2th1-3", slug: "twenty_sixth_sunday_after_trinity", vol: "iii", locus: "2 Thessalonians 1:3-10", bookId: "2TH", chapter: 1, verses: [3, 10] },
  { id: "luther-epistle-2pe3-3", slug: "twenty_seventh_sunday_after_trinity", vol: "iii", locus: "2 Peter 3:3-7", bookId: "2PE", chapter: 3, verses: [3, 7] },
];

function lutherEpistlePostils(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const row of LUTHER_EPISTLE_POSTILS) {
    if (have.has(row.id)) continue;
    const entry = e(
      row.id,
      "Martin Luther",
      "Epistle Sermons (Postils)",
      "lutheran",
      row.locus,
      `https://biblehub.com/library/luther/epistle_sermons_vol_${row.vol}/${row.slug}.htm`,
      ["luther", "postil", "epistle", row.bookId.toLowerCase()],
      [row.bookId],
      [row.chapter],
    );
    entry.verses = row.verses;
    out.push(entry);
  }
  return out;
}

/** Cyril on John — CCEL pearse mirror; tertullian alt. Book→chapter ranges from Pusey lemmas. */
const CYRIL_JOHN_BOOKS: Array<{ nn: string; book: number; chapters: number[] }> = [
  { nn: "01", book: 1, chapters: [1] },
  { nn: "02", book: 2, chapters: [1, 2, 3] },
  { nn: "03", book: 3, chapters: [4, 5] },
  { nn: "04", book: 4, chapters: [6] },
  { nn: "05", book: 5, chapters: [7] },
  { nn: "06", book: 6, chapters: [8, 9] },
  { nn: "07", book: 7, chapters: [10, 11] },
  { nn: "08", book: 8, chapters: [12] },
  { nn: "09", book: 9, chapters: [12, 13] },
  { nn: "10", book: 10, chapters: [14, 15, 16] },
  { nn: "11", book: 11, chapters: [16, 17] },
  { nn: "12", book: 12, chapters: [18, 19, 20, 21] },
];

function cyrilJohnBooks(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const row of CYRIL_JOHN_BOOKS) {
    const id = `cyril-john-book${row.book}`;
    if (have.has(id)) continue;
    const entry = e(
      id,
      "Cyril of Alexandria",
      `Commentary on John, Book ${row.book}`,
      "patristic",
      `John Book ${row.book}`,
      `https://www.ccel.org/ccel/pearse/morefathers/files/cyril_on_john_${row.nn}_book${row.book}.htm`,
      ["john", "cyril", "patristic"],
      ["JHN"],
      row.chapters,
    );
    entry.altUrl = `https://www.tertullian.org/fathers/cyril_on_john_${row.nn}_book${row.book}.htm`;
    out.push(entry);
  }
  return out;
}

const CYRIL_LUKE_FILES: Array<{
  nn: string;
  a: string;
  b: string;
  chapters: number[];
}> = [
  { nn: "01", a: "01", b: "11", chapters: [1, 2, 3] },
  { nn: "02", a: "12", b: "25", chapters: [4, 5] },
  { nn: "03", a: "26", b: "38", chapters: [6] },
  { nn: "04", a: "39", b: "46", chapters: [7, 8] },
  { nn: "05", a: "47", b: "56", chapters: [8, 9] },
  { nn: "06", a: "57", b: "65", chapters: [9] },
  { nn: "07", a: "66", b: "80", chapters: [10] },
  { nn: "08", a: "81", b: "88", chapters: [11] },
  { nn: "09", a: "89", b: "98", chapters: [12] },
  { nn: "10", a: "99", b: "109", chapters: [13, 14, 15] },
  { nn: "11", a: "110", b: "123", chapters: [16, 17] },
  { nn: "12", a: "124", b: "134", chapters: [18, 19] },
  { nn: "13", a: "135", b: "145", chapters: [18, 19, 20, 21] },
  { nn: "14", a: "146", b: "156", chapters: [22, 23, 24] },
];

function cyrilLukeSermons(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const row of CYRIL_LUKE_FILES) {
    const id = `cyril-luke-sermons-${row.a}-${row.b}`;
    if (have.has(id)) continue;
    // Skip colliding with hand-curated cyril-luke-18 (same sermons_135_145 URL).
    if (row.nn === "13" && have.has("cyril-luke-18")) continue;
    const entry = e(
      id,
      "Cyril of Alexandria",
      "Commentary on the Gospel of Saint Luke",
      "patristic",
      `Luke sermons ${Number(row.a)}–${Number(row.b)}`,
      `https://www.ccel.org/ccel/pearse/morefathers/files/cyril_on_luke_${row.nn}_sermons_${row.a}_${row.b}.htm`,
      ["luke", "cyril", "patristic"],
      ["LUK"],
      row.chapters,
    );
    entry.altUrl = `https://www.tertullian.org/fathers/cyril_on_luke_${row.nn}_sermons_${row.a}_${row.b}.htm`;
    out.push(entry);
  }
  return out;
}

/** Augustine Homilies on 1 John — fill remaining New Advent 170201… pages. */
const AUGUSTINE_1JN_HOMILIES: Array<{ n: number; chapter: number }> = [
  { n: 1, chapter: 1 },
  { n: 2, chapter: 2 },
  { n: 3, chapter: 2 },
  { n: 4, chapter: 3 },
  { n: 5, chapter: 3 },
  { n: 6, chapter: 3 },
  { n: 7, chapter: 4 },
  { n: 8, chapter: 4 },
  { n: 9, chapter: 5 },
  { n: 10, chapter: 5 },
];

function augustine1JohnHomilies(have: Set<string>): CatalogEntry[] {
  // HAND already has 170201; weak-nt covers 170202/04/07/10. Fill the gaps only.
  const skipHomilies = new Set([1, 2, 4, 7, 10]);
  const out: CatalogEntry[] = [];
  for (const row of AUGUSTINE_1JN_HOMILIES) {
    if (skipHomilies.has(row.n)) continue;
    const id = `augustine-1jn-h${row.n}`;
    if (have.has(id)) continue;
    const url = `https://www.newadvent.org/fathers/1702${String(row.n).padStart(2, "0")}.htm`;
    out.push(
      e(
        id,
        "Augustine",
        `Homilies on the First Epistle of John ${row.n}`,
        "patristic",
        `Homily ${row.n}`,
        url,
        ["john", "love", "augustine", "1john"],
        ["1JN"],
        [row.chapter],
      ),
    );
  }
  return out;
}

/** Augustine Selected NT Sermons (NPNF) — book/chapter from New Advent bible links. */
const AUGUSTINE_NT_SERMONS: Array<[number, string, number]> = [
  [1, "MAT", 5],
  [2, "MAT", 3],
  [3, "MAT", 5],
  [4, "MAT", 5],
  [5, "MAT", 5],
  [6, "MAT", 6],
  [7, "MAT", 6],
  [8, "MAT", 6],
  [9, "MAT", 6],
  [10, "MAT", 6],
  [11, "MAT", 7],
  [12, "MAT", 8],
  [13, "MAT", 8],
  [14, "MAT", 10],
  [15, "MAT", 10],
  [16, "MAT", 11],
  [17, "MAT", 11],
  [18, "MAT", 11],
  [19, "MAT", 19],
  [20, "MAT", 11],
  [21, "MAT", 12],
  [22, "MAT", 12],
  [23, "MAT", 13],
  [24, "MAT", 13],
  [25, "MAT", 14],
  [26, "MAT", 14],
  [27, "MAT", 15],
  [28, "MAT", 17],
  [29, "MAT", 17],
  [30, "MAT", 17],
  [31, "MAT", 18],
  [32, "MAT", 18],
  [33, "MAT", 17],
  [34, "MAT", 19],
  [35, "MAT", 19],
  [36, "MAT", 19],
  [37, "MAT", 20],
  [38, "MAT", 20],
  [39, "MAT", 21],
  [40, "MAT", 22],
  [41, "MAT", 22],
  [42, "MAT", 22],
  [43, "MAT", 25],
  [44, "MAT", 25],
  [45, "MRK", 8],
  [46, "MRK", 8],
  [47, "MRK", 13],
  [48, "LUK", 7],
  [49, "LUK", 7],
  [50, "LUK", 9],
  [51, "LUK", 10],
  [52, "LUK", 10],
  [53, "LUK", 10],
  [54, "LUK", 10],
  [55, "LUK", 11],
  [56, "LUK", 11],
  [57, "LUK", 12],
  [58, "LUK", 12],
  [59, "LUK", 12],
  [60, "LUK", 13],
  [61, "LUK", 13],
  [62, "LUK", 14],
  [63, "LUK", 16],
  [64, "LUK", 17],
  [65, "LUK", 18],
  [66, "LUK", 24],
  [67, "JHN", 1],
  [68, "JHN", 1],
  [69, "JHN", 1],
  [70, "JHN", 1],
  [71, "JHN", 1],
  [72, "JHN", 1],
  [73, "JHN", 2],
  [74, "JHN", 5],
  [75, "JHN", 5],
  [76, "JHN", 5],
  [77, "JHN", 5],
  [78, "JHN", 5],
  [79, "JHN", 5],
  [80, "JHN", 6],
  [81, "JHN", 6],
  [82, "JHN", 6],
  [83, "JHN", 7],
  [84, "JHN", 8],
  [85, "JHN", 9],
  [86, "JHN", 9],
  [87, "JHN", 10],
  [88, "JHN", 10],
  [89, "JHN", 10],
  [90, "JHN", 12],
  [91, "JHN", 14],
  [92, "JHN", 14],
  [93, "JHN", 16],
  [94, "JHN", 16],
  [95, "JHN", 16],
  [96, "JHN", 21],
  [97, "JHN", 21],
];

function augustineNtSermons(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const [n, bookId, chapter] of AUGUSTINE_NT_SERMONS) {
    const id = `augustine-nt-sermon-${n}`;
    if (have.has(id)) continue;
    out.push(
      e(
        id,
        "Augustine",
        `Sermons on the New Testament ${n}`,
        "patristic",
        `Sermon ${n}`,
        `https://www.newadvent.org/fathers/1603${String(n).padStart(2, "0")}.htm`,
        ["augustine", "sermon", bookId.toLowerCase()],
        [bookId],
        [chapter],
      ),
    );
  }
  return out;
}

/** Augustine Harmony of the Gospels — New Advent 1602{book}{ch}.htm children. */
const AUGUSTINE_HARMONY_BOOKS: Array<{ book: number; chapters: number[] }> = [
  { book: 1, chapters: Array.from({ length: 35 }, (_, i) => i + 1) },
  { book: 2, chapters: Array.from({ length: 81 }, (_, i) => i) }, // includes 0 preface
  { book: 3, chapters: Array.from({ length: 26 }, (_, i) => i) },
  { book: 4, chapters: Array.from({ length: 11 }, (_, i) => i) },
];

function augustineHarmonyGospels(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const row of AUGUSTINE_HARMONY_BOOKS) {
    for (const ch of row.chapters) {
      const id = `augustine-harmony-${row.book}-${ch}`;
      if (have.has(id)) continue;
      const pad = String(ch).padStart(2, "0");
      out.push(
        e(
          id,
          "Augustine",
          `Harmony of the Gospels ${row.book}.${ch}`,
          "patristic",
          `Harmony ${row.book}.${ch}`,
          `https://www.newadvent.org/fathers/1602${row.book}${pad}.htm`,
          ["augustine", "harmony", "gospel", "matthew", "mark", "luke", "john"],
          ["MAT", "MRK", "LUK", "JHN"],
        ),
      );
    }
  }
  return out;
}

function theodoretRomans(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  const parts: Array<{ part: "01" | "02"; chapters: number[] }> = [
    { part: "01", chapters: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
    { part: "02", chapters: [10, 11, 12, 13, 14, 15, 16] },
  ];
  for (const row of parts) {
    const id = `theodoret-romans-${row.part}`;
    if (have.has(id)) continue;
    const entry = e(
      id,
      "Theodoret of Cyrus",
      "Commentary on Romans",
      "patristic",
      `Romans (part ${Number(row.part)})`,
      `https://tertullian.org/fathers/theodoret_commentary_on_romans_${row.part}.htm`,
      ["romans", "theodoret", "patristic"],
      ["ROM"],
      row.chapters,
    );
    entry.altUrl = `https://www.tertullian.org/fathers/theodoret_commentary_on_romans_${row.part}.htm`;
    out.push(entry);
  }
  return out;
}

/**
 * Victorinus Apocalypse is one New Advent page (0712.htm) with "From the Nth
 * Chapter" markers. Duplicate URL rows are banned (fetch-slot waste), so the
 * chapter split lives on the single weak-nt row `victorinus-revelation-more`
 * (all REV chapters). This generator is a no-op reserved for future alt hosts.
 */
function victorinusRevelationChapters(_have: Set<string>): CatalogEntry[] {
  return [];
}


// ---------------------------------------------------------------------------
// Wave 1 OT: the Pentateuch (Genesis–Deuteronomy), 187 chapters.
//
// Table columns: url stem, book id, display name, chapter count, Henry CCEL
// volume, Henry slug (read off the volume .toc.html — e.g. mhc1 lists Gen,
// Ex, Lev, Num, Deu), sacred-texts 3-letter code, BibleHub slug. Later waves
// extend this table book by book.
const OT_PENTATEUCH = [
  ["genesis", "GEN", "Genesis", 50, "mhc1", "Gen", "gen", "genesis"],
  ["exodus", "EXO", "Exodus", 40, "mhc1", "Ex", "exo", "exodus"],
  ["leviticus", "LEV", "Leviticus", 27, "mhc1", "Lev", "lev", "leviticus"],
  ["numbers", "NUM", "Numbers", 36, "mhc1", "Num", "num", "numbers"],
  ["deuteronomy", "DEU", "Deuteronomy", 34, "mhc1", "Deu", "deu", "deuteronomy"],
] as const;

function otTag(name: string): string {
  return name.toLowerCase().replace(/^\d+\s+/, "");
}

/**
 * Lowercase roman numerals. The module-level ROMAN table only reaches xxix
 * (the NT's longest book is 28 chapters); the OT needs up to cli (Psalms 150
 * -> index 151), so the OT builders use this instead of ROMAN[ch + 1].
 */
function romanNumeral(n: number): string {
  const table: Array<[number, string]> = [
    [100, "c"],
    [90, "xc"],
    [50, "l"],
    [40, "xl"],
    [10, "x"],
    [9, "ix"],
    [5, "v"],
    [4, "iv"],
    [1, "i"],
  ];
  let out = "";
  for (const [value, numeral] of table) {
    while (n >= value) {
      out += numeral;
      n -= value;
    }
  }
  return out;
}

/**
 * Pages already indexed by HAND rows. Builders skip these URLs: the catalog
 * test "never indexes one page under two ids" rejects duplicate URLs, and a
 * duplicate burns a fetch slot on a page already read. (Wave 1 case: the
 * henry-gen-1 hand row is the same page the generator would emit for
 * henry-genesis-1.)
 */
const HAND_URLS = new Set(HAND.map((x) => x.url));

function henryOtPentateuch(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const [stem, bookId, name, chapters, vol, slug] of OT_PENTATEUCH) {
    const tag = otTag(name);
    for (let ch = 1; ch <= chapters; ch++) {
      const id = `henry-${stem}-${ch}`;
      if (have.has(id)) continue;
      // CCEL numbers Henry's chapters one past the roman numeral: .ii.html is
      // chapter 1 (verified against page content, Genesis–Deuteronomy).
      // romanNumeral (not the ROMAN table) because the OT exceeds xxix.
      const url = `https://ccel.org/ccel/henry/${vol}/${vol}.${slug}.${romanNumeral(ch + 1)}.html`;
      if (HAND_URLS.has(url)) continue;
      out.push(
        e(
          id,
          "Matthew Henry",
          "Commentary on the Whole Bible",
          "reformed",
          `${name} ${ch}`,
          url,
          [tag, "henry"],
          [bookId],
          [ch],
        ),
      );
    }
  }
  return out;
}

function gillOtPentateuch(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const [stem, bookId, name, chapters, , , code, hub] of OT_PENTATEUCH) {
    const tag = otTag(name);
    for (let ch = 1; ch <= chapters; ch++) {
      const id = `gill-${stem}-${ch}`;
      if (have.has(id)) continue;
      const url = `https://archive.sacred-texts.com/bib/cmt/gill/${code}${pad3(ch)}.htm`;
      if (HAND_URLS.has(url)) continue;
      const entry = e(
        id,
        "John Gill",
        "Exposition of the Old and New Testament",
        "reformed",
        `${name} ${ch}`,
        url,
        [tag, "gill", "baptist"],
        [bookId],
        [ch],
      );
      entry.altUrl = `https://biblehub.com/commentaries/gill/${hub}/${ch}.htm`;
      out.push(entry);
    }
  }
  return out;
}

function jfbOtPentateuch(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const [stem, bookId, name, chapters, , , code, hub] of OT_PENTATEUCH) {
    const tag = otTag(name);
    for (let ch = 1; ch <= chapters; ch++) {
      const id = `jfb-${stem}-${ch}`;
      if (have.has(id)) continue;
      const url = `https://archive.sacred-texts.com/bib/cmt/jfb/${code}${pad3(ch)}.htm`;
      if (HAND_URLS.has(url)) continue;
      const entry = e(
        id,
        "Jamieson-Fausset-Brown",
        "Commentary Critical and Explanatory on the Whole Bible",
        "reformed",
        `${name} ${ch}`,
        url,
        [tag, "jfb"],
        [bookId],
        [ch],
      );
      entry.altUrl = `https://biblehub.com/commentaries/jfb/${hub}/${ch}.htm`;
      out.push(entry);
    }
  }
  return out;
}

function pooleOtPentateuch(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const [stem, bookId, name, chapters, , , , hub] of OT_PENTATEUCH) {
    const tag = otTag(name);
    for (let ch = 1; ch <= chapters; ch++) {
      const id = `poole-${stem}-${ch}`;
      if (have.has(id)) continue;
      const url = `https://biblehub.com/commentaries/poole/${hub}/${ch}.htm`;
      if (HAND_URLS.has(url)) continue;
      out.push(
        e(
          id,
          "Matthew Poole",
          "Annotations upon the Holy Bible",
          "reformed",
          `${name} ${ch}`,
          url,
          [tag, "poole"],
          [bookId],
          [ch],
        ),
      );
    }
  }
  return out;
}

function clarkeOtPentateuch(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const [stem, bookId, name, chapters, , , , hub] of OT_PENTATEUCH) {
    const tag = otTag(name);
    for (let ch = 1; ch <= chapters; ch++) {
      const id = `clarke-${stem}-${ch}`;
      if (have.has(id)) continue;
      const url = `https://biblehub.com/commentaries/clarke/${hub}/${ch}.htm`;
      if (HAND_URLS.has(url)) continue;
      out.push(
        e(
          id,
          "Adam Clarke",
          "Clarke's Commentary on the Bible",
          "arminian",
          `${name} ${ch}`,
          url,
          [tag, "clarke", "methodist"],
          [bookId],
          [ch],
        ),
      );
    }
  }
  return out;
}

function kadOtPentateuch(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const [stem, bookId, name, chapters, , , , hub] of OT_PENTATEUCH) {
    const tag = otTag(name);
    for (let ch = 1; ch <= chapters; ch++) {
      const id = `kad-${stem}-${ch}`;
      if (have.has(id)) continue;
      const url = `https://biblehub.com/commentaries/kad/${hub}/${ch}.htm`;
      if (HAND_URLS.has(url)) continue;
      out.push(
        e(
          id,
          "Keil & Delitzsch",
          "Commentary on the Old Testament",
          "lutheran",
          `${name} ${ch}`,
          url,
          [tag, "kad", "keil-delitzsch"],
          [bookId],
          [ch],
        ),
      );
    }
  }
  return out;
}

function langeOtPentateuch(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const [stem, bookId, name, chapters, , , , hub] of OT_PENTATEUCH) {
    const tag = otTag(name);
    for (let ch = 1; ch <= chapters; ch++) {
      const id = `lange-${stem}-${ch}`;
      if (have.has(id)) continue;
      const url = `https://biblehub.com/commentaries/lange/${hub}/${ch}.htm`;
      if (HAND_URLS.has(url)) continue;
      out.push(
        e(
          id,
          "John Peter Lange",
          "Commentary on the Holy Scriptures",
          "reformed",
          `${name} ${ch}`,
          url,
          [tag, "lange"],
          [bookId],
          [ch],
        ),
      );
    }
  }
  return out;
}

function ellicottOtPentateuch(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const [stem, bookId, name, chapters, , , , hub] of OT_PENTATEUCH) {
    const tag = otTag(name);
    for (let ch = 1; ch <= chapters; ch++) {
      const id = `ellicott-${stem}-${ch}`;
      if (have.has(id)) continue;
      const url = `https://biblehub.com/commentaries/ellicott/${hub}/${ch}.htm`;
      if (HAND_URLS.has(url)) continue;
      out.push(
        e(
          id,
          "Charles Ellicott",
          "Commentary for English Readers",
          "reformed",
          `${name} ${ch}`,
          url,
          [tag, "ellicott"],
          [bookId],
          [ch],
        ),
      );
    }
  }
  return out;
}

function cambridgeOtPentateuch(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const [stem, bookId, name, chapters, , , , hub] of OT_PENTATEUCH) {
    const tag = otTag(name);
    for (let ch = 1; ch <= chapters; ch++) {
      const id = `cambridge-${stem}-${ch}`;
      if (have.has(id)) continue;
      const url = `https://biblehub.com/commentaries/cambridge/${hub}/${ch}.htm`;
      if (HAND_URLS.has(url)) continue;
      out.push(
        e(
          id,
          "Cambridge Bible",
          "Cambridge Bible for Schools and Colleges",
          "reformed",
          `${name} ${ch}`,
          url,
          [tag, "cambridge"],
          [bookId],
          [ch],
        ),
      );
    }
  }
  return out;
}

function pulpitOtPentateuch(have: Set<string>): CatalogEntry[] {
  const out: CatalogEntry[] = [];
  for (const [stem, bookId, name, chapters, , , , hub] of OT_PENTATEUCH) {
    const tag = otTag(name);
    for (let ch = 1; ch <= chapters; ch++) {
      const id = `pulpit-${stem}-${ch}`;
      if (have.has(id)) continue;
      const url = `https://biblehub.com/commentaries/pulpit/${hub}/${ch}.htm`;
      if (HAND_URLS.has(url)) continue;
      out.push(
        e(
          id,
          "Pulpit Commentary",
          "The Pulpit Commentary",
          "reformed",
          `${name} ${ch}`,
          url,
          [tag, "pulpit"],
          [bookId],
          [ch],
        ),
      );
    }
  }
  return out;
}

export const CATALOG: CatalogEntry[] = (() => {
  const have = new Set(HAND.map((x) => x.id));
  const out = [...HAND];
  for (const gen of [
    henryNtChapters,
    gillNtChapters,
    genevaNtChapters,
    pooleNtChapters,
    jfbNtChapters,
    langeNtChapters,
    barnesNtChapters,
    maclarenNtChapters,
    vwsNtChapters,
    hawkerNtChapters,
    trappNtChapters,
    burkittNtChapters,
    cambridgeNtChapters,
    ellicottNtChapters,
    pulpitNtChapters,
    meyerNtChapters,
    egtNtChapters,
    owenHebrewsChapters,
    kretzmannNtChapters,
    hodgeEphesiansChapters,
    robertsonNtChapters,
    expositorNtChapters,
    bengelNtChapters,
    spurgeonNtChapters,
    ryleNtChapters,
    godetNtChapters,
    haldaneRomansChapters,
    broadusMatthewChapters,
    hodgeSiChapters,
    alfordNtChapters,
    lutherEpistlePostils,
    cyrilJohnBooks,
    cyrilLukeSermons,
    augustine1JohnHomilies,
    augustineNtSermons,
    augustineHarmonyGospels,
    theodoretRomans,
    victorinusRevelationChapters,
    // Wave 1 OT: Pentateuch (Genesis–Deuteronomy), 10 voices per chapter.
    henryOtPentateuch,
    gillOtPentateuch,
    jfbOtPentateuch,
    pooleOtPentateuch,
    clarkeOtPentateuch,
    kadOtPentateuch,
    langeOtPentateuch,
    ellicottOtPentateuch,
    cambridgeOtPentateuch,
    pulpitOtPentateuch,
  ]) {
    const more = gen(have);
    for (const x of more) have.add(x.id);
    out.push(...more);
  }
  return out;
})();

const STOP = new Set([
  "the", "and", "of", "to", "a", "in", "that", "is", "was", "he", "for", "it",
  "with", "as", "his", "on", "be", "at", "by", "this", "what", "did", "say",
  "about", "every", "source", "quote", "find", "from",
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w));
}

export function isBookIntro(entry: CatalogEntry): boolean {
  const locus = entry.locus.toLowerCase();
  return (
    locus === "argument" ||
    locus.endsWith("intro") ||
    locus === "intro" ||
    entry.tags.includes("argument") ||
    entry.tags.includes("intro")
  );
}

export function scoreEntry(
  entry: CatalogEntry,
  tokens: string[],
  bookId?: string,
  chapter?: number,
  questionTokens?: string[],
  verse?: number | null,
  verseEnd?: number | null,
): number {
  // Declared books that are not the inquired book cannot drown REV / 1JN / 2JN / 3JN / HEB.
  if (bookId && entry.books?.length && !entry.books.includes(bookId)) {
    return 0;
  }
  // If a specific chapter is requested, entries restricted to other chapters must never match.
  if (
    chapter != null &&
    entry.chapters?.length &&
    !entry.chapters.includes(chapter)
  ) {
    return 0;
  }
  // A pericope page that does not reach the requested verse cannot answer it,
  // however well its wording happens to overlap. With a range selected the
  // test is overlap rather than containment: a page covering 14-18 answers a
  // selection of 16-20, since the two share verses 16-18.
  if (verse != null && entry.verses) {
    const [start, end] = entry.verses;
    const selEnd = verseEnd ?? verse;
    if (end < verse || start > selEnd) return 0;
  }
  // Book introductions, prefaces, and "Arguments" are scoped to chapter 1 / whole-book overview.
  // They must not match mid-book chapters (> 1).
  if (chapter != null && chapter > 1 && isBookIntro(entry)) {
    return 0;
  }
  // Unscoped dogmatic / topical treatises (no books specified):
  // When a specific biblical book is inquired, unscoped treatises must NEVER match purely based
  // on coincidental English words in the verse text (e.g., "will", "grace", "faith", "sin").
  // They may only match if the user explicitly queried the author, work, or topic in questionTokens.
  if (bookId && (!entry.books || entry.books.length === 0)) {
    const qToks = questionTokens ?? [];
    if (!qToks.length) return 0;
    const hasExplicitQueryHit = qToks.some(
      (t) =>
        entry.voice.toLowerCase().includes(t) ||
        entry.tags.includes(t) ||
        entry.work.toLowerCase().includes(t),
    );
    if (!hasExplicitQueryHit) return 0;
  }
  // Multi-book general treatises without chapters (e.g. Adv. Haer. with books: ["JHN", "MAT", "MRK", "LUK"])
  // must not match mid-book chapters (> 1) unless explicit tokens hit.
  if (
    chapter != null &&
    chapter > 1 &&
    entry.books &&
    entry.books.length > 1 &&
    (!entry.chapters || !entry.chapters.length)
  ) {
    const hasExplicitHit = tokens.some(
      (t) =>
        entry.voice.toLowerCase().includes(t) ||
        entry.tags.includes(t) ||
        entry.work.toLowerCase().includes(t),
    );
    if (!hasExplicitHit) return 0;
  }

  let score = 0;
  const tags = new Set(entry.tags);
  const voice = entry.voice.toLowerCase();
  const work = entry.work.toLowerCase();
  for (const t of tokens) {
    if (tags.has(t)) score += 4;
    if (voice.includes(t)) score += 5;
    if (work.includes(t)) score += 1;
  }
  if (bookId && entry.books?.length === 1 && entry.books.includes(bookId)) {
    score += 8;
  } else if (
    bookId &&
    entry.books &&
    entry.books.length > 1 &&
    entry.books.includes(bookId) &&
    (chapter == null || chapter === 1)
  ) {
    score += 2;
  }
  if (
    bookId &&
    chapter != null &&
    entry.books?.includes(bookId) &&
    entry.chapters?.includes(chapter)
  ) {
    score += 20;
    // A book that covers only this chapter beats a multi-chapter volume that
    // also happens to include it (Cyril John Book 1 vs Book 2 on 1:1).
    if (entry.chapters.length === 1) score += 4;
  }
  if (verse != null && entry.verses) {
    score += 30;
  }
  return score;
}

export function mapCatalog(opts: {
  question: string;
  bookId?: string;
  chapter?: number;
  verse?: number | null;
  verseEnd?: number | null;
  verseText?: string;
  mode?: "reception" | "traditions";
  limit?: number;
}): CatalogEntry[] {
  const limit = opts.limit ?? 5;
  const questionTokens = tokenize(opts.question);
  const tokens = tokenize(
    [opts.question, opts.verseText, opts.bookId, String(opts.chapter ?? "")].join(
      " ",
    ),
  );
  const ranked = CATALOG.map((entry) => ({
    entry,
    score: scoreEntry(
      entry,
      tokens,
      opts.bookId,
      opts.chapter,
      questionTokens,
      opts.verse,
      opts.verseEnd,
    ),
  }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);

  const picked: CatalogEntry[] = [];
  const voices = new Set<string>();
  const needDiverse = opts.mode === "traditions";
  const chapterMatch = (entry: CatalogEntry) =>
    Boolean(
      opts.bookId &&
        opts.chapter != null &&
        entry.books?.includes(opts.bookId) &&
        entry.chapters?.includes(opts.chapter),
    );
  const hasChapterPage = ranked.some((r) => chapterMatch(r.entry));
  const bookMatch = (entry: CatalogEntry) =>
    Boolean(
      opts.bookId &&
        entry.books?.includes(opts.bookId) &&
        (opts.chapter == null ||
          ((opts.chapter === 1 || !isBookIntro(entry)) &&
            (!entry.chapters?.length || entry.chapters.includes(opts.chapter)))),
    );
  const hasBookPage = ranked.some((r) => bookMatch(r.entry));

  const consider = (r: { entry: CatalogEntry; score: number }) => {
    if (picked.length >= limit) return;
    if (needDiverse && voices.has(r.entry.voice)) return;
    voices.add(r.entry.voice);
    picked.push(r.entry);
  };

  // Chapter pages first so Argument/intro rows are not the only hit.
  // One page per voice here so three Calvin slices cannot crowd Henry out.
  // At desk limits (>=7: empty Inquire / focused), reserve Gill/Geneva/Lange
  // then seat wave-2 (Barnes/MacLaren/VWS/Hawker/Trapp/Burkitt) alongside,
  // then preferred wave-3 (Cambridge/Ellicott/Kretzmann/Cyril John),
  // then interleave remaining wave pages with classics so first-wave reserved
  // seats are never starved. Default mapCatalog(limit 5) keeps score order
  // for Henry/Calvin tests.
  if (hasChapterPage) {
    const WAVE1_RE = /^(gill|geneva|poole|jfb|lange)-/;
    const WAVE2_RE = /^(barnes|maclaren|vws|hawker|trapp|burkitt)-/;
    const WAVE3_RE =
      /^(cambridge|ellicott|owen|kretzmann|luther-epistle|cyril-john|cyril-luke-sermons|augustine-1jn-h|augustine-nt-sermon|augustine-harmony|theodoret|victorinus-rev|hodge-eph|robertson|bengel|spurgeon)-/;
    const WAVE4_RE = /^(pulpit|meyer|egt|expositors)-/;
    const WAVE5_RE =
      /^(ryle|godet|haldane|broadus|alford|hodge-romans|hodge-1corinthians)-/;
    const RESERVED_WAVE1 = ["gill-", "geneva-", "lange-"] as const;
    const RESERVED_WAVE2 = [
      "barnes-",
      "maclaren-",
      "vws-",
      "hawker-",
      "trapp-",
      "burkitt-",
    ] as const;
    // Prefer these when desk seats allow (limit 9: up to 3 preferred wave-3).
    const PREFERRED_WAVE3 = [
      "cambridge-",
      "ellicott-",
      "kretzmann-",
      "cyril-john-",
    ] as const;
    const PREFERRED_WAVE4 = ["pulpit-"] as const;
    const isWaveId = (id: string) =>
      WAVE1_RE.test(id) ||
      WAVE2_RE.test(id) ||
      WAVE3_RE.test(id) ||
      WAVE4_RE.test(id) ||
      WAVE5_RE.test(id);
    const chapterRanked = ranked.filter((r) => chapterMatch(r.entry));
    const deskLimit = limit >= 7 && Boolean(opts.bookId) && opts.chapter != null;
    if (deskLimit) {
      for (const prefix of RESERVED_WAVE1) {
        if (picked.length >= limit) break;
        const hit = chapterRanked.find(
          (r) => r.entry.id.startsWith(prefix) && !voices.has(r.entry.voice),
        );
        if (!hit) continue;
        voices.add(hit.entry.voice);
        picked.push(hit.entry);
      }
      // Seat wave-2 after wave1; leave at least one seat for a classic page.
      const wave2Budget = Math.min(
        3,
        Math.max(0, limit - picked.length - 1),
      );
      let wave2Seated = 0;
      for (const prefix of RESERVED_WAVE2) {
        if (wave2Seated >= wave2Budget || picked.length >= limit) break;
        const hit = chapterRanked.find(
          (r) => r.entry.id.startsWith(prefix) && !voices.has(r.entry.voice),
        );
        if (!hit) continue;
        voices.add(hit.entry.voice);
        picked.push(hit.entry);
        wave2Seated++;
      }
      // Prefer up to 3 wave-3 seats (Cambridge/Ellicott/Kretzmann) when room remains.
      // With limit 9 after wave1+wave2 (~6), fill remaining seats with preferred wave-3.
      const wave3Budget = Math.min(
        3,
        Math.max(0, limit - picked.length),
      );
      let wave3Seated = 0;
      for (const prefix of PREFERRED_WAVE3) {
        if (wave3Seated >= wave3Budget || picked.length >= limit) break;
        const hit = chapterRanked.find(
          (r) => r.entry.id.startsWith(prefix) && !voices.has(r.entry.voice),
        );
        if (!hit) continue;
        voices.add(hit.entry.voice);
        picked.push(hit.entry);
        wave3Seated++;
      }
      // Wave-4 (Pulpit/Meyer/EGT) only if a seat remains. No promote:
      // do not displace wave-1/2/3.
      const wave4Budget = Math.min(
        1,
        Math.max(0, limit - picked.length - 1),
      );
      let wave4Seated = 0;
      for (const prefix of PREFERRED_WAVE4) {
        if (wave4Seated >= wave4Budget || picked.length >= limit) break;
        const hit = chapterRanked.find(
          (r) => r.entry.id.startsWith(prefix) && !voices.has(r.entry.voice),
        );
        if (!hit) continue;
        voices.add(hit.entry.voice);
        picked.push(hit.entry);
        wave4Seated++;
      }
      const remaining = chapterRanked.filter(
        (r) => !picked.some((e) => e.id === r.entry.id),
      );
      const wave = remaining.filter((r) => isWaveId(r.entry.id));
      const rest = remaining.filter((r) => !isWaveId(r.entry.id));
      let iRest = 0;
      let iWave = 0;
      let takeRest = true;
      while (
        picked.length < limit &&
        (iRest < rest.length || iWave < wave.length)
      ) {
        const pool = takeRest ? rest : wave;
        let i = takeRest ? iRest : iWave;
        let added = false;
        while (i < pool.length) {
          const r = pool[i++];
          if (voices.has(r.entry.voice)) continue;
          voices.add(r.entry.voice);
          picked.push(r.entry);
          added = true;
          break;
        }
        if (takeRest) iRest = i;
        else iWave = i;
        if (!added) {
          takeRest = !takeRest;
          continue;
        }
        takeRest = !takeRest;
      }
      // Hard guarantee only for first-wave reserved seats. Wave-2 already
      // received a budgeted pass; do not displace classics to force more.
      for (const prefix of RESERVED_WAVE1) {
        if (picked.some((e) => e.id.startsWith(prefix))) continue;
        const miss = chapterRanked.find(
          (r) => r.entry.id.startsWith(prefix) && r.score > 0,
        );
        if (!miss) continue;
        if (picked.length < limit && !voices.has(miss.entry.voice)) {
          voices.add(miss.entry.voice);
          picked.push(miss.entry);
          continue;
        }
        let replaceAt = -1;
        for (let i = picked.length - 1; i >= 0; i--) {
          const e = picked[i];
          if (RESERVED_WAVE1.some((p) => e.id.startsWith(p))) continue;
          if (e.voice === miss.entry.voice) continue;
          // Prefer displacing a classic over a wave-2 seat.
          if (!isWaveId(e.id)) {
            replaceAt = i;
            break;
          }
          if (WAVE2_RE.test(e.id) && replaceAt < 0) replaceAt = i;
        }
        if (replaceAt < 0) continue;
        voices.delete(picked[replaceAt].voice);
        voices.add(miss.entry.voice);
        picked[replaceAt] = miss.entry;
      }
      // Guarantee cambridge / ellicott / kretzmann when a chapter page exists
      // (score>0), displacing classics only — never wave1/wave2.
      const GUARANTEED_WAVE3 = ["cambridge-", "ellicott-", "kretzmann-"] as const;
      for (const prefix of GUARANTEED_WAVE3) {
        if (picked.some((e) => e.id.startsWith(prefix))) continue;
        const miss = chapterRanked.find(
          (r) => r.entry.id.startsWith(prefix) && r.score > 0,
        );
        if (!miss || voices.has(miss.entry.voice)) continue;
        let replaceAt = -1;
        for (let i = picked.length - 1; i >= 0; i--) {
          const e = picked[i];
          if (RESERVED_WAVE1.some((p) => e.id.startsWith(p))) continue;
          if (WAVE2_RE.test(e.id)) continue;
          if (isWaveId(e.id)) continue;
          replaceAt = i;
          break;
        }
        if (replaceAt >= 0) {
          voices.delete(picked[replaceAt].voice);
          voices.add(miss.entry.voice);
          picked[replaceAt] = miss.entry;
        } else if (picked.length < limit) {
          voices.add(miss.entry.voice);
          picked.push(miss.entry);
        }
      }
    } else {
      for (const r of chapterRanked) {
        if (picked.length >= limit) break;
        // Wave-5B is spare/interleave only (desk limit >=7). Keep default
        // mapCatalog(limit 5) on Henry/Calvin/classics — Godet/Haldane/Broadus
        // work titles contain the book name and would otherwise outscore them.
        if (WAVE5_RE.test(r.entry.id)) continue;
        if (voices.has(r.entry.voice)) continue;
        voices.add(r.entry.voice);
        picked.push(r.entry);
      }
    }
  }
  // Same-book pages next so unbooked "christ/god" treatises cannot drown Colossians.
  if (hasBookPage) {
    for (const r of ranked) {
      if (picked.some((e) => e.id === r.entry.id)) continue;
      if (bookMatch(r.entry)) consider(r);
    }
  }
  for (const r of ranked) {
    if (picked.some((e) => e.id === r.entry.id)) continue;
    consider(r);
  }

  if (!picked.length && opts.bookId) {
    return CATALOG.filter((e) => {
      if (!e.books?.includes(opts.bookId!)) return false;
      if (opts.verse != null && e.verses) {
        const [start, end] = e.verses;
        const selEnd = opts.verseEnd ?? opts.verse;
        if (end < opts.verse || start > selEnd) return false;
      }
      if (opts.chapter == null || !e.chapters?.length) {
        if (opts.chapter != null && opts.chapter > 1 && isBookIntro(e)) return false;
        return true;
      }
      return e.chapters.includes(opts.chapter);
    }).slice(0, limit);
  }
  return picked;
}