import type { Tradition } from "../bible/types.ts";

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

export const CATALOG: CatalogEntry[] = [
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
  e("aquinas-catena-john-1", "Thomas Aquinas", "Catena Aurea on John", "catholic", "John 1", "https://www.ccel.org/ccel/aquinas/catena2.ii.i.html", ["word", "logos", "john", "aquinas", "thomas"], ["JHN"], [1]),
  e("henry-john-1", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "John 1", "https://ccel.org/ccel/henry/mhc5/mhc5.John.ii.html", ["word", "beginning", "john", "henry"], ["JHN"], [1]),
  e("athanasius-incarnation", "Athanasius", "On the Incarnation", "patristic", "De Incarnatione", "https://www.newadvent.org/fathers/2802.htm", ["word", "flesh", "incarnation", "made", "athanasius"], ["JHN"], [1]),
  e("origen-john-1", "Origen", "Commentary on John, Book 1", "patristic", "In Joannem 1", "https://www.newadvent.org/fathers/101501.htm", ["word", "logos", "beginning", "origen", "john"], ["JHN"], [1]),
  e("justin-dialogue-logos", "Justin Martyr", "Dialogue with Trypho 55–68", "patristic", "Dial. 55–68", "https://www.newadvent.org/fathers/01285.htm", ["word", "logos", "christ", "justin", "prophecy"], ["JHN"], [1]),
  e("justin-apology", "Justin Martyr", "First Apology", "patristic", "1 Apol.", "https://www.newadvent.org/fathers/0126.htm", ["logos", "word", "reason", "justin", "incarnation"]),

  // Synoptics / Hebrews / Genesis / Romans
  e("chrysostom-matt-h1", "John Chrysostom", "Homilies on Matthew 1", "patristic", "Homily 1", "https://www.newadvent.org/fathers/200101.htm", ["matthew", "son", "david", "gospel"], ["MAT"], [1]),
  e("chrysostom-rom-h1", "John Chrysostom", "Homilies on Romans 1", "patristic", "Homily 1", "https://www.newadvent.org/fathers/210201.htm", ["romans", "gospel", "paul", "faith"], ["ROM"], [1]),
  e("chrysostom-rom-h2", "John Chrysostom", "Homilies on Romans 2", "patristic", "Homily 2", "https://www.newadvent.org/fathers/210202.htm", ["romans", "wrath", "sin", "gentile"], ["ROM"], [1, 2]),
  e("chrysostom-heb-h1", "John Chrysostom", "Homilies on Hebrews 1", "patristic", "Homily 1", "https://www.newadvent.org/fathers/240201.htm", ["hebrews", "son", "angels", "word"], ["HEB"], [1]),
  e("calvin-gen-1", "John Calvin", "Commentary on Genesis", "reformed", "Genesis 1", "https://ccel.org/ccel/calvin/calcom01/calcom01.viii.i.html", ["creation", "beginning", "god", "calvin", "genesis"], ["GEN"], [1]),
  e("calvin-matt-1", "John Calvin", "Commentary on a Harmony of the Evangelists", "reformed", "Matthew 1", "https://ccel.org/ccel/calvin/calcom31/calcom31.ii.i.html", ["matthew", "son", "david", "calvin"], ["MAT"], [1]),
  e("calvin-rom-8", "John Calvin", "Commentary on Romans", "reformed", "Romans 8", "https://ccel.org/ccel/calvin/calcom38/calcom38.xii.i.html", ["spirit", "adoption", "predestination", "romans", "calvin"], ["ROM"], [8]),
  e("calvin-rom-9", "John Calvin", "Commentary on Romans", "reformed", "Romans 9", "https://ccel.org/ccel/calvin/calcom38/calcom38.xiii.i.html", ["election", "reprobation", "mercy", "romans", "calvin"], ["ROM"], [9]),
  e("henry-gen-1", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "Genesis 1", "https://ccel.org/ccel/henry/mhc1/mhc1.Gen.ii.html", ["creation", "beginning", "genesis", "henry"], ["GEN"], [1]),
  e("henry-rom-9", "Matthew Henry", "Commentary on the Whole Bible", "reformed", "Romans 9", "https://ccel.org/ccel/henry/mhc5/mhc5.Rom.ix.html", ["election", "mercy", "romans", "henry"], ["ROM"], [9]),
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
  e("augustine-enchiridion", "Augustine", "Enchiridion", "patristic", "Enchiridion", "https://www.newadvent.org/fathers/1302.htm", ["faith", "hope", "love", "sin", "grace", "augustine"]),
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
];

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

export function scoreEntry(
  entry: CatalogEntry,
  tokens: string[],
  bookId?: string,
  chapter?: number,
): number {
  let score = 0;
  const tags = new Set(entry.tags);
  const voice = entry.voice.toLowerCase();
  const work = entry.work.toLowerCase();
  for (const t of tokens) {
    if (tags.has(t)) score += 4;
    if (voice.includes(t)) score += 5;
    if (work.includes(t)) score += 1;
  }
  if (bookId && entry.books?.includes(bookId)) score += 3;
  if (
    bookId &&
    chapter != null &&
    entry.books?.includes(bookId) &&
    entry.chapters?.includes(chapter)
  ) {
    score += 3;
  }
  return score;
}

export function mapCatalog(opts: {
  question: string;
  bookId?: string;
  chapter?: number;
  verseText?: string;
  mode?: "reception" | "traditions";
  limit?: number;
}): CatalogEntry[] {
  const limit = opts.limit ?? 5;
  const tokens = tokenize(
    [opts.question, opts.verseText, opts.bookId, String(opts.chapter ?? "")].join(
      " ",
    ),
  );
  const ranked = CATALOG.map((entry) => ({
    entry,
    score: scoreEntry(entry, tokens, opts.bookId, opts.chapter),
  }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);

  const picked: CatalogEntry[] = [];
  const voices = new Set<string>();
  const needDiverse = opts.mode === "traditions";

  for (const r of ranked) {
    if (picked.length >= limit) break;
    if (needDiverse && voices.has(r.entry.voice)) continue;
    voices.add(r.entry.voice);
    picked.push(r.entry);
  }

  if (!picked.length && opts.bookId) {
    return CATALOG.filter((e) => {
      if (!e.books?.includes(opts.bookId!)) return false;
      if (opts.chapter == null || !e.chapters?.length) return true;
      return e.chapters.includes(opts.chapter);
    }).slice(0, limit);
  }
  return picked;
}
