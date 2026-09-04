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
  e("aquinas-catena-john-1", "Thomas Aquinas", "Catena Aurea on John", "catholic", "John 1", "https://www.ccel.org/ccel/aquinas/catena2.ii.i.html", ["word", "logos", "john", "aquinas", "thomas"], ["JHN"], [1]),
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
  e("calvin-matt-1", "John Calvin", "Commentary on a Harmony of the Evangelists", "reformed", "Matthew 1", "https://ccel.org/ccel/calvin/calcom31/calcom31.ii.i.html", ["matthew", "son", "david", "calvin"], ["MAT"], [1]),
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

export const CATALOG: CatalogEntry[] = (() => {
  const have = new Set(HAND.map((x) => x.id));
  return [...HAND, ...henryNtChapters(have)];
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
  if (hasChapterPage) {
    for (const r of ranked) {
      if (!chapterMatch(r.entry)) continue;
      if (picked.length >= limit) break;
      if (voices.has(r.entry.voice)) continue;
      voices.add(r.entry.voice);
      picked.push(r.entry);
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
