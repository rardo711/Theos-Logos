/** Chrysostom homily (or Galatians chapter) pages from New Advent, lemmas parsed from each page's opening bible link on 2026-09-04. End verse is inferred from the next homily's start. Regenerate with scripts/research/build-phase-c-data.mjs. */
export type ChrysostomHomily = {
  book: string;
  homily: number;
  kind: "homily" | "chapter";
  url: string;
  chapters: number[];
  verses?: [number, number];
  locus: string;
  work: string;
};

export const CHRYSOSTOM_HOMILIES: ChrysostomHomily[] = [
  {
    "book": "MAT",
    "homily": 1,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200101.htm",
    "chapters": [
      1
    ],
    "locus": "Homily 1",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 2,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200102.htm",
    "chapters": [
      1
    ],
    "verses": [
      1,
      16
    ],
    "locus": "Matthew 1:1-16",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 3,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200103.htm",
    "chapters": [
      1
    ],
    "verses": [
      1,
      16
    ],
    "locus": "Matthew 1:1-16",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 4,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200104.htm",
    "chapters": [
      1
    ],
    "verses": [
      17,
      21
    ],
    "locus": "Matthew 1:17-21",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 5,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200105.htm",
    "chapters": [
      1
    ],
    "verses": [
      22,
      999
    ],
    "locus": "Matthew 1:22–end",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 6,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200106.htm",
    "chapters": [
      2
    ],
    "verses": [
      1,
      3
    ],
    "locus": "Matthew 2:1-3",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 7,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200107.htm",
    "chapters": [
      2
    ],
    "verses": [
      4,
      15
    ],
    "locus": "Matthew 2:4-15",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 8,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200108.htm",
    "chapters": [
      2
    ],
    "verses": [
      2,
      15
    ],
    "locus": "Matthew 2:2-15",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 9,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200109.htm",
    "chapters": [
      2
    ],
    "verses": [
      16,
      999
    ],
    "locus": "Matthew 2:16–end",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 10,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200110.htm",
    "chapters": [
      3
    ],
    "verses": [
      1,
      6
    ],
    "locus": "Matthew 3:1-6",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 11,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200111.htm",
    "chapters": [
      3
    ],
    "verses": [
      7,
      12
    ],
    "locus": "Matthew 3:7-12",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 12,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200112.htm",
    "chapters": [
      3
    ],
    "verses": [
      13,
      999
    ],
    "locus": "Matthew 3:13–end",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 13,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200113.htm",
    "chapters": [
      4
    ],
    "verses": [
      1,
      11
    ],
    "locus": "Matthew 4:1-11",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 14,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200114.htm",
    "chapters": [
      4
    ],
    "verses": [
      12,
      999
    ],
    "locus": "Matthew 4:12–end",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 15,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200115.htm",
    "chapters": [
      5
    ],
    "verses": [
      1,
      16
    ],
    "locus": "Matthew 5:1-16",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 16,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200116.htm",
    "chapters": [
      5
    ],
    "verses": [
      17,
      26
    ],
    "locus": "Matthew 5:17-26",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 17,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200117.htm",
    "chapters": [
      5
    ],
    "verses": [
      27,
      37
    ],
    "locus": "Matthew 5:27-37",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 18,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200118.htm",
    "chapters": [
      5
    ],
    "verses": [
      38,
      999
    ],
    "locus": "Matthew 5:38–end",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 19,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200119.htm",
    "chapters": [
      6
    ],
    "verses": [
      1,
      15
    ],
    "locus": "Matthew 6:1-15",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 20,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200120.htm",
    "chapters": [
      6
    ],
    "verses": [
      16,
      23
    ],
    "locus": "Matthew 6:16-23",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 21,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200121.htm",
    "chapters": [
      6
    ],
    "verses": [
      24,
      999
    ],
    "locus": "Matthew 6:24–end",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 22,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200122.htm",
    "chapters": [
      5,
      6
    ],
    "locus": "Homily 22 (Matthew 5–6)",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 23,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200123.htm",
    "chapters": [
      7
    ],
    "verses": [
      1,
      20
    ],
    "locus": "Matthew 7:1-20",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 24,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200124.htm",
    "chapters": [
      7
    ],
    "verses": [
      21,
      27
    ],
    "locus": "Matthew 7:21-27",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 25,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200125.htm",
    "chapters": [
      7,
      8
    ],
    "locus": "Homily 25 (Matthew 7–8)",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 26,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200126.htm",
    "chapters": [
      8
    ],
    "verses": [
      5,
      13
    ],
    "locus": "Matthew 8:5-13",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 27,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200127.htm",
    "chapters": [
      8
    ],
    "verses": [
      14,
      22
    ],
    "locus": "Matthew 8:14-22",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 28,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200128.htm",
    "chapters": [
      8
    ],
    "verses": [
      23,
      999
    ],
    "locus": "Matthew 8:23–end",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 29,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200129.htm",
    "chapters": [
      9
    ],
    "verses": [
      1,
      8
    ],
    "locus": "Matthew 9:1-8",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 30,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200130.htm",
    "chapters": [
      9
    ],
    "verses": [
      9,
      17
    ],
    "locus": "Matthew 9:9-17",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 31,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200131.htm",
    "chapters": [
      9
    ],
    "verses": [
      18,
      26
    ],
    "locus": "Matthew 9:18-26",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 32,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200132.htm",
    "chapters": [
      9,
      10
    ],
    "locus": "Homily 32 (Matthew 9–10)",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 33,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200133.htm",
    "chapters": [
      10
    ],
    "verses": [
      16,
      22
    ],
    "locus": "Matthew 10:16-22",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 34,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200134.htm",
    "chapters": [
      10
    ],
    "verses": [
      23,
      33
    ],
    "locus": "Matthew 10:23-33",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 35,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200135.htm",
    "chapters": [
      10
    ],
    "verses": [
      34,
      999
    ],
    "locus": "Matthew 10:34–end",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 36,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200136.htm",
    "chapters": [
      11
    ],
    "verses": [
      1,
      6
    ],
    "locus": "Matthew 11:1-6",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 37,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200137.htm",
    "chapters": [
      11
    ],
    "verses": [
      7,
      24
    ],
    "locus": "Matthew 11:7-24",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 38,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200138.htm",
    "chapters": [
      11
    ],
    "verses": [
      25,
      999
    ],
    "locus": "Matthew 11:25–end",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 39,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200139.htm",
    "chapters": [
      12
    ],
    "verses": [
      1,
      8
    ],
    "locus": "Matthew 12:1-8",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 40,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200140.htm",
    "chapters": [
      12
    ],
    "verses": [
      9,
      24
    ],
    "locus": "Matthew 12:9-24",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 41,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200141.htm",
    "chapters": [
      12
    ],
    "verses": [
      25,
      32
    ],
    "locus": "Matthew 12:25-32",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 42,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200142.htm",
    "chapters": [
      12
    ],
    "verses": [
      33,
      37
    ],
    "locus": "Matthew 12:33-37",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 43,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200143.htm",
    "chapters": [
      12
    ],
    "verses": [
      38,
      45
    ],
    "locus": "Matthew 12:38-45",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 44,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200144.htm",
    "chapters": [
      12,
      13
    ],
    "locus": "Homily 44 (Matthew 12–13)",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 45,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200145.htm",
    "chapters": [
      13
    ],
    "verses": [
      10,
      23
    ],
    "locus": "Matthew 13:10-23",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 46,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200146.htm",
    "chapters": [
      13
    ],
    "verses": [
      24,
      33
    ],
    "locus": "Matthew 13:24-33",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 47,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200147.htm",
    "chapters": [
      13
    ],
    "verses": [
      34,
      52
    ],
    "locus": "Matthew 13:34-52",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 48,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200148.htm",
    "chapters": [
      13,
      14
    ],
    "locus": "Homily 48 (Matthew 13–14)",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 49,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200149.htm",
    "chapters": [
      14
    ],
    "verses": [
      13,
      22
    ],
    "locus": "Matthew 14:13-22",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 50,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200150.htm",
    "chapters": [
      14
    ],
    "verses": [
      23,
      999
    ],
    "locus": "Matthew 14:23–end",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 51,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200151.htm",
    "chapters": [
      15
    ],
    "verses": [
      1,
      20
    ],
    "locus": "Matthew 15:1-20",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 52,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200152.htm",
    "chapters": [
      15
    ],
    "verses": [
      21,
      31
    ],
    "locus": "Matthew 15:21-31",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 53,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200153.htm",
    "chapters": [
      15,
      16
    ],
    "locus": "Homily 53 (Matthew 15–16)",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 54,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200154.htm",
    "chapters": [
      14
    ],
    "verses": [
      13,
      999
    ],
    "locus": "Matthew 14:13–end",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 55,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200155.htm",
    "chapters": [
      16
    ],
    "verses": [
      24,
      27
    ],
    "locus": "Matthew 16:24-27",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 56,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200156.htm",
    "chapters": [
      16,
      17
    ],
    "locus": "Homily 56 (Matthew 16–17)",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 57,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200157.htm",
    "chapters": [
      17
    ],
    "verses": [
      10,
      21
    ],
    "locus": "Matthew 17:10-21",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 58,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200158.htm",
    "chapters": [
      17,
      18
    ],
    "locus": "Homily 58 (Matthew 17–18)",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 59,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200159.htm",
    "chapters": [
      18
    ],
    "verses": [
      7,
      14
    ],
    "locus": "Matthew 18:7-14",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 60,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200160.htm",
    "chapters": [
      18
    ],
    "verses": [
      15,
      20
    ],
    "locus": "Matthew 18:15-20",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 61,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200161.htm",
    "chapters": [
      18
    ],
    "verses": [
      21,
      999
    ],
    "locus": "Matthew 18:21–end",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 62,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200162.htm",
    "chapters": [
      19
    ],
    "verses": [
      1,
      15
    ],
    "locus": "Matthew 19:1-15",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 63,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200163.htm",
    "chapters": [
      19
    ],
    "verses": [
      16,
      26
    ],
    "locus": "Matthew 19:16-26",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 64,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200164.htm",
    "chapters": [
      19,
      20
    ],
    "locus": "Homily 64 (Matthew 19–20)",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 65,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200165.htm",
    "chapters": [
      20
    ],
    "verses": [
      17,
      28
    ],
    "locus": "Matthew 20:17-28",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 66,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200166.htm",
    "chapters": [
      20,
      21
    ],
    "locus": "Homily 66 (Matthew 20–21)",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 67,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200167.htm",
    "chapters": [
      21
    ],
    "verses": [
      12,
      32
    ],
    "locus": "Matthew 21:12-32",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 68,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200168.htm",
    "chapters": [
      21
    ],
    "verses": [
      33,
      999
    ],
    "locus": "Matthew 21:33–end",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 69,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200169.htm",
    "chapters": [
      22
    ],
    "verses": [
      1,
      14
    ],
    "locus": "Matthew 22:1-14",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 70,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200170.htm",
    "chapters": [
      22
    ],
    "verses": [
      15,
      33
    ],
    "locus": "Matthew 22:15-33",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 71,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200171.htm",
    "chapters": [
      22
    ],
    "verses": [
      34,
      999
    ],
    "locus": "Matthew 22:34–end",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 72,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200172.htm",
    "chapters": [
      23
    ],
    "verses": [
      1,
      13
    ],
    "locus": "Matthew 23:1-13",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 73,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200173.htm",
    "chapters": [
      23
    ],
    "verses": [
      14,
      999
    ],
    "locus": "Matthew 23:14–end",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 75,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200175.htm",
    "chapters": [
      24
    ],
    "verses": [
      1,
      15
    ],
    "locus": "Matthew 24:1-15",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 76,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200176.htm",
    "chapters": [
      24
    ],
    "verses": [
      16,
      32
    ],
    "locus": "Matthew 24:16-32",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 77,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200177.htm",
    "chapters": [
      24
    ],
    "verses": [
      33,
      999
    ],
    "locus": "Matthew 24:33–end",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 78,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200178.htm",
    "chapters": [
      25
    ],
    "verses": [
      1,
      30
    ],
    "locus": "Matthew 25:1-30",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 79,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200179.htm",
    "chapters": [
      25,
      26
    ],
    "locus": "Homily 79 (Matthew 25–26)",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 80,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200180.htm",
    "chapters": [
      26
    ],
    "verses": [
      6,
      16
    ],
    "locus": "Matthew 26:6-16",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 81,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200181.htm",
    "chapters": [
      26
    ],
    "verses": [
      17,
      25
    ],
    "locus": "Matthew 26:17-25",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 82,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200182.htm",
    "chapters": [
      26
    ],
    "verses": [
      26,
      35
    ],
    "locus": "Matthew 26:26-35",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 83,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200183.htm",
    "chapters": [
      26
    ],
    "verses": [
      36,
      50
    ],
    "locus": "Matthew 26:36-50",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 84,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200184.htm",
    "chapters": [
      26
    ],
    "verses": [
      51,
      66
    ],
    "locus": "Matthew 26:51-66",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 85,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200185.htm",
    "chapters": [
      26,
      27
    ],
    "locus": "Homily 85 (Matthew 26–27)",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 86,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200186.htm",
    "chapters": [
      27
    ],
    "verses": [
      11,
      26
    ],
    "locus": "Matthew 27:11-26",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 87,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200187.htm",
    "chapters": [
      27
    ],
    "verses": [
      27,
      44
    ],
    "locus": "Matthew 27:27-44",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 88,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200188.htm",
    "chapters": [
      27
    ],
    "verses": [
      45,
      61
    ],
    "locus": "Matthew 27:45-61",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 89,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200189.htm",
    "chapters": [
      27,
      28
    ],
    "locus": "Homily 89 (Matthew 27–28)",
    "work": "Homilies on Matthew"
  },
  {
    "book": "MAT",
    "homily": 90,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/200190.htm",
    "chapters": [
      28
    ],
    "verses": [
      11,
      999
    ],
    "locus": "Matthew 28:11–end",
    "work": "Homilies on Matthew"
  },
  {
    "book": "JHN",
    "homily": 1,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/240101.htm",
    "chapters": [
      1
    ],
    "locus": "Homily 1",
    "work": "Homilies on John"
  },
  {
    "book": "ROM",
    "homily": 1,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210201.htm",
    "chapters": [
      1
    ],
    "verses": [
      1,
      7
    ],
    "locus": "Romans 1:1-7",
    "work": "Homilies on Romans"
  },
  {
    "book": "ROM",
    "homily": 2,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210202.htm",
    "chapters": [
      1
    ],
    "verses": [
      8,
      17
    ],
    "locus": "Romans 1:8-17",
    "work": "Homilies on Romans"
  },
  {
    "book": "ROM",
    "homily": 3,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210203.htm",
    "chapters": [
      1
    ],
    "verses": [
      18,
      25
    ],
    "locus": "Romans 1:18-25",
    "work": "Homilies on Romans"
  },
  {
    "book": "ROM",
    "homily": 4,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210204.htm",
    "chapters": [
      1
    ],
    "verses": [
      26,
      27
    ],
    "locus": "Romans 1:26-27",
    "work": "Homilies on Romans"
  },
  {
    "book": "ROM",
    "homily": 5,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210205.htm",
    "chapters": [
      1,
      2
    ],
    "locus": "Homily 5 (Romans 1–2)",
    "work": "Homilies on Romans"
  },
  {
    "book": "ROM",
    "homily": 6,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210206.htm",
    "chapters": [
      2,
      3
    ],
    "locus": "Homily 6 (Romans 2–3)",
    "work": "Homilies on Romans"
  },
  {
    "book": "ROM",
    "homily": 7,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210207.htm",
    "chapters": [
      3
    ],
    "verses": [
      9,
      999
    ],
    "locus": "Romans 3:9–end",
    "work": "Homilies on Romans"
  },
  {
    "book": "ROM",
    "homily": 8,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210208.htm",
    "chapters": [
      4
    ],
    "verses": [
      1,
      22
    ],
    "locus": "Romans 4:1-22",
    "work": "Homilies on Romans"
  },
  {
    "book": "ROM",
    "homily": 9,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210209.htm",
    "chapters": [
      4,
      5
    ],
    "locus": "Homily 9 (Romans 4–5)",
    "work": "Homilies on Romans"
  },
  {
    "book": "ROM",
    "homily": 10,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210210.htm",
    "chapters": [
      5,
      6
    ],
    "locus": "Homily 10 (Romans 5–6)",
    "work": "Homilies on Romans"
  },
  {
    "book": "ROM",
    "homily": 11,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210211.htm",
    "chapters": [
      6
    ],
    "verses": [
      5,
      18
    ],
    "locus": "Romans 6:5-18",
    "work": "Homilies on Romans"
  },
  {
    "book": "ROM",
    "homily": 12,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210212.htm",
    "chapters": [
      6,
      7
    ],
    "locus": "Homily 12 (Romans 6–7)",
    "work": "Homilies on Romans"
  },
  {
    "book": "ROM",
    "homily": 13,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210213.htm",
    "chapters": [
      7,
      8
    ],
    "locus": "Homily 13 (Romans 7–8)",
    "work": "Homilies on Romans"
  },
  {
    "book": "ROM",
    "homily": 14,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210214.htm",
    "chapters": [
      8
    ],
    "verses": [
      12,
      27
    ],
    "locus": "Romans 8:12-27",
    "work": "Homilies on Romans"
  },
  {
    "book": "ROM",
    "homily": 15,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210215.htm",
    "chapters": [
      8
    ],
    "verses": [
      28,
      999
    ],
    "locus": "Romans 8:28–end",
    "work": "Homilies on Romans"
  },
  {
    "book": "ROM",
    "homily": 16,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210216.htm",
    "chapters": [
      9
    ],
    "verses": [
      1,
      999
    ],
    "locus": "Romans 9:1–end",
    "work": "Homilies on Romans"
  },
  {
    "book": "ROM",
    "homily": 17,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210217.htm",
    "chapters": [
      10
    ],
    "verses": [
      1,
      13
    ],
    "locus": "Romans 10:1-13",
    "work": "Homilies on Romans"
  },
  {
    "book": "ROM",
    "homily": 18,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210218.htm",
    "chapters": [
      10,
      11
    ],
    "locus": "Homily 18 (Romans 10–11)",
    "work": "Homilies on Romans"
  },
  {
    "book": "ROM",
    "homily": 19,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210219.htm",
    "chapters": [
      11
    ],
    "verses": [
      7,
      999
    ],
    "locus": "Romans 11:7–end",
    "work": "Homilies on Romans"
  },
  {
    "book": "ROM",
    "homily": 20,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210220.htm",
    "chapters": [
      12
    ],
    "verses": [
      1,
      3
    ],
    "locus": "Romans 12:1-3",
    "work": "Homilies on Romans"
  },
  {
    "book": "ROM",
    "homily": 21,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210221.htm",
    "chapters": [
      12
    ],
    "verses": [
      4,
      13
    ],
    "locus": "Romans 12:4-13",
    "work": "Homilies on Romans"
  },
  {
    "book": "ROM",
    "homily": 22,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210222.htm",
    "chapters": [
      12
    ],
    "verses": [
      14,
      999
    ],
    "locus": "Romans 12:14–end",
    "work": "Homilies on Romans"
  },
  {
    "book": "ROM",
    "homily": 23,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210223.htm",
    "chapters": [
      13
    ],
    "verses": [
      1,
      10
    ],
    "locus": "Romans 13:1-10",
    "work": "Homilies on Romans"
  },
  {
    "book": "ROM",
    "homily": 24,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210224.htm",
    "chapters": [
      13
    ],
    "verses": [
      11,
      999
    ],
    "locus": "Romans 13:11–end",
    "work": "Homilies on Romans"
  },
  {
    "book": "ROM",
    "homily": 25,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210225.htm",
    "chapters": [
      14
    ],
    "verses": [
      1,
      13
    ],
    "locus": "Romans 14:1-13",
    "work": "Homilies on Romans"
  },
  {
    "book": "ROM",
    "homily": 26,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210226.htm",
    "chapters": [
      14
    ],
    "verses": [
      14,
      24
    ],
    "locus": "Romans 14:14-24",
    "work": "Homilies on Romans"
  },
  {
    "book": "ROM",
    "homily": 27,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210227.htm",
    "chapters": [
      14,
      15
    ],
    "locus": "Homily 27 (Romans 14–15)",
    "work": "Homilies on Romans"
  },
  {
    "book": "ROM",
    "homily": 28,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210228.htm",
    "chapters": [
      15
    ],
    "verses": [
      8,
      13
    ],
    "locus": "Romans 15:8-13",
    "work": "Homilies on Romans"
  },
  {
    "book": "ROM",
    "homily": 29,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210229.htm",
    "chapters": [
      15
    ],
    "verses": [
      14,
      24
    ],
    "locus": "Romans 15:14-24",
    "work": "Homilies on Romans"
  },
  {
    "book": "ROM",
    "homily": 30,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210230.htm",
    "chapters": [
      15,
      16
    ],
    "locus": "Homily 30 (Romans 15–16)",
    "work": "Homilies on Romans"
  },
  {
    "book": "ROM",
    "homily": 31,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210231.htm",
    "chapters": [
      16
    ],
    "verses": [
      5,
      16
    ],
    "locus": "Romans 16:5-16",
    "work": "Homilies on Romans"
  },
  {
    "book": "ROM",
    "homily": 32,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210232.htm",
    "chapters": [
      16
    ],
    "verses": [
      17,
      999
    ],
    "locus": "Romans 16:17–end",
    "work": "Homilies on Romans"
  },
  {
    "book": "1CO",
    "homily": 1,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/220101.htm",
    "chapters": [
      1
    ],
    "locus": "Homily 1",
    "work": "Homilies on First Corinthians"
  },
  {
    "book": "2CO",
    "homily": 1,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/220201.htm",
    "chapters": [
      1
    ],
    "locus": "Homily 1",
    "work": "Homilies on Second Corinthians"
  },
  {
    "book": "2CO",
    "homily": 7,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/220207.htm",
    "chapters": [
      3
    ],
    "verses": [
      7,
      999
    ],
    "locus": "2 Corinthians 3:7–end",
    "work": "Homilies on Second Corinthians"
  },
  {
    "book": "2CO",
    "homily": 28,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/220228.htm",
    "chapters": [
      12
    ],
    "verses": [
      16,
      999
    ],
    "locus": "2 Corinthians 12:16–end",
    "work": "Homilies on Second Corinthians"
  },
  {
    "book": "HEB",
    "homily": 1,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/240201.htm",
    "chapters": [
      1
    ],
    "locus": "Homily 1",
    "work": "Homilies on Hebrews"
  },
  {
    "book": "ACT",
    "homily": 1,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210101.htm",
    "chapters": [
      1
    ],
    "verses": [
      1,
      5
    ],
    "locus": "Acts 1:1-5",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 2,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210102.htm",
    "chapters": [
      1
    ],
    "verses": [
      6,
      11
    ],
    "locus": "Acts 1:6-11",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 3,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210103.htm",
    "chapters": [
      1
    ],
    "verses": [
      12,
      999
    ],
    "locus": "Acts 1:12–end",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 4,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210104.htm",
    "chapters": [
      2
    ],
    "verses": [
      1,
      13
    ],
    "locus": "Acts 2:1-13",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 5,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210105.htm",
    "chapters": [
      2
    ],
    "verses": [
      14,
      21
    ],
    "locus": "Acts 2:14-21",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 6,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210106.htm",
    "chapters": [
      2
    ],
    "verses": [
      22,
      36
    ],
    "locus": "Acts 2:22-36",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 7,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210107.htm",
    "chapters": [
      2
    ],
    "verses": [
      37,
      999
    ],
    "locus": "Acts 2:37–end",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 8,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210108.htm",
    "chapters": [
      3
    ],
    "verses": [
      1,
      11
    ],
    "locus": "Acts 3:1-11",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 9,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210109.htm",
    "chapters": [
      3
    ],
    "verses": [
      12,
      999
    ],
    "locus": "Acts 3:12–end",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 10,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210110.htm",
    "chapters": [
      4
    ],
    "verses": [
      1,
      22
    ],
    "locus": "Acts 4:1-22",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 11,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210111.htm",
    "chapters": [
      4
    ],
    "verses": [
      23,
      35
    ],
    "locus": "Acts 4:23-35",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 12,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210112.htm",
    "chapters": [
      4,
      5
    ],
    "locus": "Homily 12 (Acts 4–5)",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 13,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210113.htm",
    "chapters": [
      5
    ],
    "verses": [
      17,
      33
    ],
    "locus": "Acts 5:17-33",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 14,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210114.htm",
    "chapters": [
      5,
      6
    ],
    "locus": "Homily 14 (Acts 5–6)",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 15,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210115.htm",
    "chapters": [
      6,
      7
    ],
    "locus": "Homily 15 (Acts 6–7)",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 16,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210116.htm",
    "chapters": [
      7
    ],
    "verses": [
      6,
      34
    ],
    "locus": "Acts 7:6-34",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 17,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210117.htm",
    "chapters": [
      7
    ],
    "verses": [
      35,
      53
    ],
    "locus": "Acts 7:35-53",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 18,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210118.htm",
    "chapters": [
      7,
      8
    ],
    "locus": "Homily 18 (Acts 7–8)",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 19,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210119.htm",
    "chapters": [
      8,
      9
    ],
    "locus": "Homily 19 (Acts 8–9)",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 20,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210120.htm",
    "chapters": [
      9
    ],
    "verses": [
      10,
      25
    ],
    "locus": "Acts 9:10-25",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 21,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210121.htm",
    "chapters": [
      9
    ],
    "verses": [
      26,
      999
    ],
    "locus": "Acts 9:26–end",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 22,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210122.htm",
    "chapters": [
      10
    ],
    "verses": [
      1,
      22
    ],
    "locus": "Acts 10:1-22",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 23,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210123.htm",
    "chapters": [
      10
    ],
    "verses": [
      23,
      43
    ],
    "locus": "Acts 10:23-43",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 24,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210124.htm",
    "chapters": [
      10,
      11
    ],
    "locus": "Homily 24 (Acts 10–11)",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 25,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210125.htm",
    "chapters": [
      11
    ],
    "verses": [
      19,
      999
    ],
    "locus": "Acts 11:19–end",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 26,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210126.htm",
    "chapters": [
      12
    ],
    "verses": [
      1,
      17
    ],
    "locus": "Acts 12:1-17",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 27,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210127.htm",
    "chapters": [
      12,
      13
    ],
    "locus": "Homily 27 (Acts 12–13)",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 28,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210128.htm",
    "chapters": [
      13
    ],
    "verses": [
      4,
      15
    ],
    "locus": "Acts 13:4-15",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 29,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210129.htm",
    "chapters": [
      13
    ],
    "verses": [
      16,
      41
    ],
    "locus": "Acts 13:16-41",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 30,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210130.htm",
    "chapters": [
      13,
      14
    ],
    "locus": "Homily 30 (Acts 13–14)",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 31,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210131.htm",
    "chapters": [
      14
    ],
    "verses": [
      14,
      999
    ],
    "locus": "Acts 14:14–end",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 32,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210132.htm",
    "chapters": [
      15
    ],
    "verses": [
      1,
      12
    ],
    "locus": "Acts 15:1-12",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 33,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210133.htm",
    "chapters": [
      15
    ],
    "verses": [
      13,
      34
    ],
    "locus": "Acts 15:13-34",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 34,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210134.htm",
    "chapters": [
      15,
      16
    ],
    "locus": "Homily 34 (Acts 15–16)",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 35,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210135.htm",
    "chapters": [
      16
    ],
    "verses": [
      13,
      24
    ],
    "locus": "Acts 16:13-24",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 36,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210136.htm",
    "chapters": [
      16
    ],
    "verses": [
      25,
      999
    ],
    "locus": "Acts 16:25–end",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 37,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210137.htm",
    "chapters": [
      17
    ],
    "verses": [
      1,
      15
    ],
    "locus": "Acts 17:1-15",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 38,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210138.htm",
    "chapters": [
      17
    ],
    "verses": [
      16,
      31
    ],
    "locus": "Acts 17:16-31",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 39,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210139.htm",
    "chapters": [
      17,
      18
    ],
    "locus": "Homily 39 (Acts 17–18)",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 40,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210140.htm",
    "chapters": [
      18,
      19
    ],
    "locus": "Homily 40 (Acts 18–19)",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 41,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210141.htm",
    "chapters": [
      19
    ],
    "verses": [
      8,
      20
    ],
    "locus": "Acts 19:8-20",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 42,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210142.htm",
    "chapters": [
      19
    ],
    "verses": [
      21,
      999
    ],
    "locus": "Acts 19:21–end",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 43,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210143.htm",
    "chapters": [
      20
    ],
    "verses": [
      1,
      16
    ],
    "locus": "Acts 20:1-16",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 44,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210144.htm",
    "chapters": [
      20
    ],
    "verses": [
      17,
      31
    ],
    "locus": "Acts 20:17-31",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 45,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210145.htm",
    "chapters": [
      20,
      21
    ],
    "locus": "Homily 45 (Acts 20–21)",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 46,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210146.htm",
    "chapters": [
      21
    ],
    "verses": [
      18,
      38
    ],
    "locus": "Acts 21:18-38",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 47,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210147.htm",
    "chapters": [
      21,
      22
    ],
    "locus": "Homily 47 (Acts 21–22)",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 48,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210148.htm",
    "chapters": [
      22,
      23
    ],
    "locus": "Homily 48 (Acts 22–23)",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 49,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210149.htm",
    "chapters": [
      23
    ],
    "verses": [
      6,
      30
    ],
    "locus": "Acts 23:6-30",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 50,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210150.htm",
    "chapters": [
      23,
      24
    ],
    "locus": "Homily 50 (Acts 23–24)",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 51,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210151.htm",
    "chapters": [
      24,
      25
    ],
    "locus": "Homily 51 (Acts 24–25)",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 52,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210152.htm",
    "chapters": [
      25,
      26
    ],
    "locus": "Homily 52 (Acts 25–26)",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 53,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210153.htm",
    "chapters": [
      26,
      27
    ],
    "locus": "Homily 53 (Acts 26–27)",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 54,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210154.htm",
    "chapters": [
      28
    ],
    "verses": [
      1,
      16
    ],
    "locus": "Acts 28:1-16",
    "work": "Homilies on Acts"
  },
  {
    "book": "ACT",
    "homily": 55,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/210155.htm",
    "chapters": [
      28
    ],
    "verses": [
      17,
      999
    ],
    "locus": "Acts 28:17–end",
    "work": "Homilies on Acts"
  },
  {
    "book": "GAL",
    "homily": 1,
    "kind": "chapter",
    "url": "https://www.newadvent.org/fathers/23101.htm",
    "chapters": [
      1
    ],
    "locus": "Galatians 1",
    "work": "Commentary on Galatians"
  },
  {
    "book": "GAL",
    "homily": 2,
    "kind": "chapter",
    "url": "https://www.newadvent.org/fathers/23102.htm",
    "chapters": [
      2
    ],
    "locus": "Galatians 2",
    "work": "Commentary on Galatians"
  },
  {
    "book": "GAL",
    "homily": 3,
    "kind": "chapter",
    "url": "https://www.newadvent.org/fathers/23103.htm",
    "chapters": [
      3
    ],
    "locus": "Galatians 3",
    "work": "Commentary on Galatians"
  },
  {
    "book": "GAL",
    "homily": 4,
    "kind": "chapter",
    "url": "https://www.newadvent.org/fathers/23104.htm",
    "chapters": [
      4
    ],
    "locus": "Galatians 4",
    "work": "Commentary on Galatians"
  },
  {
    "book": "GAL",
    "homily": 5,
    "kind": "chapter",
    "url": "https://www.newadvent.org/fathers/23105.htm",
    "chapters": [
      5
    ],
    "locus": "Galatians 5",
    "work": "Commentary on Galatians"
  },
  {
    "book": "GAL",
    "homily": 6,
    "kind": "chapter",
    "url": "https://www.newadvent.org/fathers/23106.htm",
    "chapters": [
      6
    ],
    "locus": "Galatians 6",
    "work": "Commentary on Galatians"
  },
  {
    "book": "EPH",
    "homily": 1,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230101.htm",
    "chapters": [
      1
    ],
    "verses": [
      1,
      10
    ],
    "locus": "Ephesians 1:1-10",
    "work": "Homilies on Ephesians"
  },
  {
    "book": "EPH",
    "homily": 2,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230102.htm",
    "chapters": [
      1
    ],
    "verses": [
      11,
      14
    ],
    "locus": "Ephesians 1:11-14",
    "work": "Homilies on Ephesians"
  },
  {
    "book": "EPH",
    "homily": 3,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230103.htm",
    "chapters": [
      1
    ],
    "verses": [
      15,
      999
    ],
    "locus": "Ephesians 1:15–end",
    "work": "Homilies on Ephesians"
  },
  {
    "book": "EPH",
    "homily": 4,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230104.htm",
    "chapters": [
      2
    ],
    "verses": [
      1,
      10
    ],
    "locus": "Ephesians 2:1-10",
    "work": "Homilies on Ephesians"
  },
  {
    "book": "EPH",
    "homily": 5,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230105.htm",
    "chapters": [
      2
    ],
    "verses": [
      11,
      16
    ],
    "locus": "Ephesians 2:11-16",
    "work": "Homilies on Ephesians"
  },
  {
    "book": "EPH",
    "homily": 6,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230106.htm",
    "chapters": [
      2,
      3
    ],
    "locus": "Homily 6 (Ephesians 2–3)",
    "work": "Homilies on Ephesians"
  },
  {
    "book": "EPH",
    "homily": 7,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230107.htm",
    "chapters": [
      3
    ],
    "verses": [
      8,
      999
    ],
    "locus": "Ephesians 3:8–end",
    "work": "Homilies on Ephesians"
  },
  {
    "book": "EPH",
    "homily": 8,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230108.htm",
    "chapters": [
      4
    ],
    "verses": [
      1,
      3
    ],
    "locus": "Ephesians 4:1-3",
    "work": "Homilies on Ephesians"
  },
  {
    "book": "EPH",
    "homily": 9,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230109.htm",
    "chapters": [
      4
    ],
    "verses": [
      1,
      3
    ],
    "locus": "Ephesians 4:1-3",
    "work": "Homilies on Ephesians"
  },
  {
    "book": "EPH",
    "homily": 10,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230110.htm",
    "chapters": [
      4
    ],
    "verses": [
      4,
      16
    ],
    "locus": "Ephesians 4:4-16",
    "work": "Homilies on Ephesians"
  },
  {
    "book": "EPH",
    "homily": 11,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230111.htm",
    "chapters": [
      4
    ],
    "verses": [
      4,
      16
    ],
    "locus": "Ephesians 4:4-16",
    "work": "Homilies on Ephesians"
  },
  {
    "book": "EPH",
    "homily": 12,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230112.htm",
    "chapters": [
      4
    ],
    "verses": [
      17,
      24
    ],
    "locus": "Ephesians 4:17-24",
    "work": "Homilies on Ephesians"
  },
  {
    "book": "EPH",
    "homily": 13,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230113.htm",
    "chapters": [
      4
    ],
    "verses": [
      17,
      24
    ],
    "locus": "Ephesians 4:17-24",
    "work": "Homilies on Ephesians"
  },
  {
    "book": "EPH",
    "homily": 14,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230114.htm",
    "chapters": [
      4
    ],
    "verses": [
      25,
      30
    ],
    "locus": "Ephesians 4:25-30",
    "work": "Homilies on Ephesians"
  },
  {
    "book": "EPH",
    "homily": 15,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230115.htm",
    "chapters": [
      4
    ],
    "verses": [
      31,
      31
    ],
    "locus": "Ephesians 4:31",
    "work": "Homilies on Ephesians"
  },
  {
    "book": "EPH",
    "homily": 16,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230116.htm",
    "chapters": [
      4
    ],
    "verses": [
      31,
      31
    ],
    "locus": "Ephesians 4:31",
    "work": "Homilies on Ephesians"
  },
  {
    "book": "EPH",
    "homily": 17,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230117.htm",
    "chapters": [
      4,
      5
    ],
    "locus": "Homily 17 (Ephesians 4–5)",
    "work": "Homilies on Ephesians"
  },
  {
    "book": "EPH",
    "homily": 18,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230118.htm",
    "chapters": [
      5
    ],
    "verses": [
      5,
      14
    ],
    "locus": "Ephesians 5:5-14",
    "work": "Homilies on Ephesians"
  },
  {
    "book": "EPH",
    "homily": 19,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230119.htm",
    "chapters": [
      5
    ],
    "verses": [
      15,
      21
    ],
    "locus": "Ephesians 5:15-21",
    "work": "Homilies on Ephesians"
  },
  {
    "book": "EPH",
    "homily": 20,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230120.htm",
    "chapters": [
      5
    ],
    "verses": [
      22,
      999
    ],
    "locus": "Ephesians 5:22–end",
    "work": "Homilies on Ephesians"
  },
  {
    "book": "EPH",
    "homily": 21,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230121.htm",
    "chapters": [
      6
    ],
    "verses": [
      1,
      4
    ],
    "locus": "Ephesians 6:1-4",
    "work": "Homilies on Ephesians"
  },
  {
    "book": "EPH",
    "homily": 22,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230122.htm",
    "chapters": [
      6
    ],
    "verses": [
      5,
      13
    ],
    "locus": "Ephesians 6:5-13",
    "work": "Homilies on Ephesians"
  },
  {
    "book": "EPH",
    "homily": 23,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230123.htm",
    "chapters": [
      6
    ],
    "verses": [
      14,
      999
    ],
    "locus": "Ephesians 6:14–end",
    "work": "Homilies on Ephesians"
  },
  {
    "book": "EPH",
    "homily": 24,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230124.htm",
    "chapters": [
      6
    ],
    "verses": [
      14,
      999
    ],
    "locus": "Ephesians 6:14–end",
    "work": "Homilies on Ephesians"
  },
  {
    "book": "PHP",
    "homily": 1,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230201.htm",
    "chapters": [
      1
    ],
    "verses": [
      1,
      7
    ],
    "locus": "Philippians 1:1-7",
    "work": "Homilies on Philippians"
  },
  {
    "book": "PHP",
    "homily": 2,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230202.htm",
    "chapters": [
      1
    ],
    "verses": [
      8,
      17
    ],
    "locus": "Philippians 1:8-17",
    "work": "Homilies on Philippians"
  },
  {
    "book": "PHP",
    "homily": 3,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230203.htm",
    "chapters": [
      1
    ],
    "verses": [
      18,
      21
    ],
    "locus": "Philippians 1:18-21",
    "work": "Homilies on Philippians"
  },
  {
    "book": "PHP",
    "homily": 4,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230204.htm",
    "chapters": [
      1
    ],
    "verses": [
      22,
      999
    ],
    "locus": "Philippians 1:22–end",
    "work": "Homilies on Philippians"
  },
  {
    "book": "PHP",
    "homily": 5,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230205.htm",
    "chapters": [
      2
    ],
    "verses": [
      1,
      4
    ],
    "locus": "Philippians 2:1-4",
    "work": "Homilies on Philippians"
  },
  {
    "book": "PHP",
    "homily": 6,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230206.htm",
    "chapters": [
      2
    ],
    "verses": [
      5,
      11
    ],
    "locus": "Philippians 2:5-11",
    "work": "Homilies on Philippians"
  },
  {
    "book": "PHP",
    "homily": 7,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230207.htm",
    "chapters": [
      2
    ],
    "verses": [
      5,
      11
    ],
    "locus": "Philippians 2:5-11",
    "work": "Homilies on Philippians"
  },
  {
    "book": "PHP",
    "homily": 8,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230208.htm",
    "chapters": [
      2
    ],
    "verses": [
      12,
      18
    ],
    "locus": "Philippians 2:12-18",
    "work": "Homilies on Philippians"
  },
  {
    "book": "PHP",
    "homily": 9,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230209.htm",
    "chapters": [
      2
    ],
    "verses": [
      19,
      999
    ],
    "locus": "Philippians 2:19–end",
    "work": "Homilies on Philippians"
  },
  {
    "book": "PHP",
    "homily": 10,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230210.htm",
    "chapters": [
      3
    ],
    "verses": [
      1,
      6
    ],
    "locus": "Philippians 3:1-6",
    "work": "Homilies on Philippians"
  },
  {
    "book": "PHP",
    "homily": 11,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230211.htm",
    "chapters": [
      3
    ],
    "verses": [
      7,
      12
    ],
    "locus": "Philippians 3:7-12",
    "work": "Homilies on Philippians"
  },
  {
    "book": "PHP",
    "homily": 12,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230212.htm",
    "chapters": [
      3
    ],
    "verses": [
      13,
      17
    ],
    "locus": "Philippians 3:13-17",
    "work": "Homilies on Philippians"
  },
  {
    "book": "PHP",
    "homily": 13,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230213.htm",
    "chapters": [
      3,
      4
    ],
    "locus": "Homily 13 (Philippians 3–4)",
    "work": "Homilies on Philippians"
  },
  {
    "book": "PHP",
    "homily": 14,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230214.htm",
    "chapters": [
      4
    ],
    "verses": [
      4,
      9
    ],
    "locus": "Philippians 4:4-9",
    "work": "Homilies on Philippians"
  },
  {
    "book": "PHP",
    "homily": 15,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230215.htm",
    "chapters": [
      4
    ],
    "verses": [
      10,
      999
    ],
    "locus": "Philippians 4:10–end",
    "work": "Homilies on Philippians"
  },
  {
    "book": "COL",
    "homily": 1,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230301.htm",
    "chapters": [
      1
    ],
    "verses": [
      1,
      8
    ],
    "locus": "Colossians 1:1-8",
    "work": "Homilies on Colossians"
  },
  {
    "book": "COL",
    "homily": 2,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230302.htm",
    "chapters": [
      1
    ],
    "verses": [
      9,
      14
    ],
    "locus": "Colossians 1:9-14",
    "work": "Homilies on Colossians"
  },
  {
    "book": "COL",
    "homily": 3,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230303.htm",
    "chapters": [
      1
    ],
    "verses": [
      15,
      20
    ],
    "locus": "Colossians 1:15-20",
    "work": "Homilies on Colossians"
  },
  {
    "book": "COL",
    "homily": 4,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230304.htm",
    "chapters": [
      1
    ],
    "verses": [
      21,
      25
    ],
    "locus": "Colossians 1:21-25",
    "work": "Homilies on Colossians"
  },
  {
    "book": "COL",
    "homily": 5,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230305.htm",
    "chapters": [
      1,
      2
    ],
    "locus": "Homily 5 (Colossians 1–2)",
    "work": "Homilies on Colossians"
  },
  {
    "book": "COL",
    "homily": 6,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230306.htm",
    "chapters": [
      2
    ],
    "verses": [
      6,
      15
    ],
    "locus": "Colossians 2:6-15",
    "work": "Homilies on Colossians"
  },
  {
    "book": "COL",
    "homily": 7,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230307.htm",
    "chapters": [
      2,
      3
    ],
    "locus": "Homily 7 (Colossians 2–3)",
    "work": "Homilies on Colossians"
  },
  {
    "book": "COL",
    "homily": 8,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230308.htm",
    "chapters": [
      3
    ],
    "verses": [
      5,
      15
    ],
    "locus": "Colossians 3:5-15",
    "work": "Homilies on Colossians"
  },
  {
    "book": "COL",
    "homily": 9,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230309.htm",
    "chapters": [
      3
    ],
    "verses": [
      16,
      17
    ],
    "locus": "Colossians 3:16-17",
    "work": "Homilies on Colossians"
  },
  {
    "book": "COL",
    "homily": 10,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230310.htm",
    "chapters": [
      3,
      4
    ],
    "locus": "Homily 10 (Colossians 3–4)",
    "work": "Homilies on Colossians"
  },
  {
    "book": "COL",
    "homily": 11,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230311.htm",
    "chapters": [
      4
    ],
    "verses": [
      5,
      11
    ],
    "locus": "Colossians 4:5-11",
    "work": "Homilies on Colossians"
  },
  {
    "book": "COL",
    "homily": 12,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230312.htm",
    "chapters": [
      4
    ],
    "verses": [
      12,
      999
    ],
    "locus": "Colossians 4:12–end",
    "work": "Homilies on Colossians"
  },
  {
    "book": "1TH",
    "homily": 1,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230401.htm",
    "chapters": [
      1
    ],
    "verses": [
      1,
      7
    ],
    "locus": "1 Thessalonians 1:1-7",
    "work": "Homilies on First Thessalonians"
  },
  {
    "book": "1TH",
    "homily": 2,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230402.htm",
    "chapters": [
      1,
      2
    ],
    "locus": "Homily 2 (1 Thessalonians 1–2)",
    "work": "Homilies on First Thessalonians"
  },
  {
    "book": "1TH",
    "homily": 3,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230403.htm",
    "chapters": [
      2,
      3
    ],
    "locus": "Homily 3 (1 Thessalonians 2–3)",
    "work": "Homilies on First Thessalonians"
  },
  {
    "book": "1TH",
    "homily": 4,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230404.htm",
    "chapters": [
      3
    ],
    "verses": [
      5,
      999
    ],
    "locus": "1 Thessalonians 3:5–end",
    "work": "Homilies on First Thessalonians"
  },
  {
    "book": "1TH",
    "homily": 5,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230405.htm",
    "chapters": [
      4
    ],
    "verses": [
      1,
      8
    ],
    "locus": "1 Thessalonians 4:1-8",
    "work": "Homilies on First Thessalonians"
  },
  {
    "book": "1TH",
    "homily": 6,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230406.htm",
    "chapters": [
      4
    ],
    "verses": [
      9,
      12
    ],
    "locus": "1 Thessalonians 4:9-12",
    "work": "Homilies on First Thessalonians"
  },
  {
    "book": "1TH",
    "homily": 7,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230407.htm",
    "chapters": [
      4
    ],
    "verses": [
      13,
      14
    ],
    "locus": "1 Thessalonians 4:13-14",
    "work": "Homilies on First Thessalonians"
  },
  {
    "book": "1TH",
    "homily": 8,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230408.htm",
    "chapters": [
      4
    ],
    "verses": [
      15,
      999
    ],
    "locus": "1 Thessalonians 4:15–end",
    "work": "Homilies on First Thessalonians"
  },
  {
    "book": "1TH",
    "homily": 9,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230409.htm",
    "chapters": [
      5
    ],
    "verses": [
      1,
      11
    ],
    "locus": "1 Thessalonians 5:1-11",
    "work": "Homilies on First Thessalonians"
  },
  {
    "book": "1TH",
    "homily": 10,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230410.htm",
    "chapters": [
      5
    ],
    "verses": [
      12,
      18
    ],
    "locus": "1 Thessalonians 5:12-18",
    "work": "Homilies on First Thessalonians"
  },
  {
    "book": "1TH",
    "homily": 11,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230411.htm",
    "chapters": [
      5
    ],
    "verses": [
      19,
      999
    ],
    "locus": "1 Thessalonians 5:19–end",
    "work": "Homilies on First Thessalonians"
  },
  {
    "book": "2TH",
    "homily": 1,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/23051.htm",
    "chapters": [
      1
    ],
    "locus": "Homily 1",
    "work": "Homilies on Second Thessalonians"
  },
  {
    "book": "2TH",
    "homily": 2,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/23052.htm",
    "chapters": [
      1
    ],
    "verses": [
      1,
      8
    ],
    "locus": "2 Thessalonians 1:1-8",
    "work": "Homilies on Second Thessalonians"
  },
  {
    "book": "2TH",
    "homily": 3,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/23053.htm",
    "chapters": [
      1,
      2
    ],
    "locus": "Homily 3 (2 Thessalonians 1–2)",
    "work": "Homilies on Second Thessalonians"
  },
  {
    "book": "2TH",
    "homily": 4,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/23054.htm",
    "chapters": [
      2,
      3
    ],
    "locus": "Homily 4 (2 Thessalonians 2–3)",
    "work": "Homilies on Second Thessalonians"
  },
  {
    "book": "2TH",
    "homily": 5,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/23055.htm",
    "chapters": [
      3
    ],
    "verses": [
      3,
      999
    ],
    "locus": "2 Thessalonians 3:3–end",
    "work": "Homilies on Second Thessalonians"
  },
  {
    "book": "1TI",
    "homily": 1,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230601.htm",
    "chapters": [
      1
    ],
    "verses": [
      1,
      4
    ],
    "locus": "1 Timothy 1:1-4",
    "work": "Homilies on First Timothy"
  },
  {
    "book": "1TI",
    "homily": 2,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230602.htm",
    "chapters": [
      1
    ],
    "verses": [
      5,
      11
    ],
    "locus": "1 Timothy 1:5-11",
    "work": "Homilies on First Timothy"
  },
  {
    "book": "1TI",
    "homily": 3,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230603.htm",
    "chapters": [
      1
    ],
    "verses": [
      12,
      14
    ],
    "locus": "1 Timothy 1:12-14",
    "work": "Homilies on First Timothy"
  },
  {
    "book": "1TI",
    "homily": 4,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230604.htm",
    "chapters": [
      1
    ],
    "verses": [
      15,
      17
    ],
    "locus": "1 Timothy 1:15-17",
    "work": "Homilies on First Timothy"
  },
  {
    "book": "1TI",
    "homily": 5,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230605.htm",
    "chapters": [
      1
    ],
    "verses": [
      18,
      999
    ],
    "locus": "1 Timothy 1:18–end",
    "work": "Homilies on First Timothy"
  },
  {
    "book": "1TI",
    "homily": 6,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230606.htm",
    "chapters": [
      2
    ],
    "verses": [
      1,
      1
    ],
    "locus": "1 Timothy 2:1",
    "work": "Homilies on First Timothy"
  },
  {
    "book": "1TI",
    "homily": 7,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230607.htm",
    "chapters": [
      2
    ],
    "verses": [
      2,
      7
    ],
    "locus": "1 Timothy 2:2-7",
    "work": "Homilies on First Timothy"
  },
  {
    "book": "1TI",
    "homily": 8,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230608.htm",
    "chapters": [
      2
    ],
    "verses": [
      8,
      10
    ],
    "locus": "1 Timothy 2:8-10",
    "work": "Homilies on First Timothy"
  },
  {
    "book": "1TI",
    "homily": 9,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230609.htm",
    "chapters": [
      2
    ],
    "verses": [
      11,
      999
    ],
    "locus": "1 Timothy 2:11–end",
    "work": "Homilies on First Timothy"
  },
  {
    "book": "1TI",
    "homily": 10,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230610.htm",
    "chapters": [
      3
    ],
    "verses": [
      1,
      7
    ],
    "locus": "1 Timothy 3:1-7",
    "work": "Homilies on First Timothy"
  },
  {
    "book": "1TI",
    "homily": 11,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230611.htm",
    "chapters": [
      3
    ],
    "verses": [
      8,
      999
    ],
    "locus": "1 Timothy 3:8–end",
    "work": "Homilies on First Timothy"
  },
  {
    "book": "1TI",
    "homily": 12,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230612.htm",
    "chapters": [
      4
    ],
    "verses": [
      1,
      10
    ],
    "locus": "1 Timothy 4:1-10",
    "work": "Homilies on First Timothy"
  },
  {
    "book": "1TI",
    "homily": 13,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230613.htm",
    "chapters": [
      4,
      5
    ],
    "locus": "Homily 13 (1 Timothy 4–5)",
    "work": "Homilies on First Timothy"
  },
  {
    "book": "1TI",
    "homily": 14,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230614.htm",
    "chapters": [
      5
    ],
    "verses": [
      8,
      10
    ],
    "locus": "1 Timothy 5:8-10",
    "work": "Homilies on First Timothy"
  },
  {
    "book": "1TI",
    "homily": 15,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230615.htm",
    "chapters": [
      5
    ],
    "verses": [
      11,
      20
    ],
    "locus": "1 Timothy 5:11-20",
    "work": "Homilies on First Timothy"
  },
  {
    "book": "1TI",
    "homily": 16,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230616.htm",
    "chapters": [
      5,
      6
    ],
    "locus": "Homily 16 (1 Timothy 5–6)",
    "work": "Homilies on First Timothy"
  },
  {
    "book": "1TI",
    "homily": 17,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230617.htm",
    "chapters": [
      6
    ],
    "verses": [
      2,
      12
    ],
    "locus": "1 Timothy 6:2-12",
    "work": "Homilies on First Timothy"
  },
  {
    "book": "1TI",
    "homily": 18,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230618.htm",
    "chapters": [
      6
    ],
    "verses": [
      13,
      999
    ],
    "locus": "1 Timothy 6:13–end",
    "work": "Homilies on First Timothy"
  },
  {
    "book": "2TI",
    "homily": 1,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230701.htm",
    "chapters": [
      1
    ],
    "verses": [
      1,
      7
    ],
    "locus": "2 Timothy 1:1-7",
    "work": "Homilies on Second Timothy"
  },
  {
    "book": "2TI",
    "homily": 2,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230702.htm",
    "chapters": [
      1
    ],
    "verses": [
      8,
      12
    ],
    "locus": "2 Timothy 1:8-12",
    "work": "Homilies on Second Timothy"
  },
  {
    "book": "2TI",
    "homily": 3,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230703.htm",
    "chapters": [
      1
    ],
    "verses": [
      13,
      999
    ],
    "locus": "2 Timothy 1:13–end",
    "work": "Homilies on Second Timothy"
  },
  {
    "book": "2TI",
    "homily": 4,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230704.htm",
    "chapters": [
      2
    ],
    "verses": [
      1,
      10
    ],
    "locus": "2 Timothy 2:1-10",
    "work": "Homilies on Second Timothy"
  },
  {
    "book": "2TI",
    "homily": 5,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230705.htm",
    "chapters": [
      2
    ],
    "verses": [
      11,
      19
    ],
    "locus": "2 Timothy 2:11-19",
    "work": "Homilies on Second Timothy"
  },
  {
    "book": "2TI",
    "homily": 6,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230706.htm",
    "chapters": [
      2
    ],
    "verses": [
      20,
      999
    ],
    "locus": "2 Timothy 2:20–end",
    "work": "Homilies on Second Timothy"
  },
  {
    "book": "2TI",
    "homily": 7,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230707.htm",
    "chapters": [
      3
    ],
    "verses": [
      1,
      15
    ],
    "locus": "2 Timothy 3:1-15",
    "work": "Homilies on Second Timothy"
  },
  {
    "book": "2TI",
    "homily": 8,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230708.htm",
    "chapters": [
      3
    ],
    "verses": [
      1,
      15
    ],
    "locus": "2 Timothy 3:1-15",
    "work": "Homilies on Second Timothy"
  },
  {
    "book": "2TI",
    "homily": 9,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230709.htm",
    "chapters": [
      3,
      4
    ],
    "locus": "Homily 9 (2 Timothy 3–4)",
    "work": "Homilies on Second Timothy"
  },
  {
    "book": "2TI",
    "homily": 10,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/230710.htm",
    "chapters": [
      4
    ],
    "verses": [
      9,
      999
    ],
    "locus": "2 Timothy 4:9–end",
    "work": "Homilies on Second Timothy"
  },
  {
    "book": "TIT",
    "homily": 1,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/23081.htm",
    "chapters": [
      1
    ],
    "verses": [
      1,
      4
    ],
    "locus": "Titus 1:1-4",
    "work": "Homilies on Titus"
  },
  {
    "book": "TIT",
    "homily": 2,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/23082.htm",
    "chapters": [
      1
    ],
    "verses": [
      5,
      11
    ],
    "locus": "Titus 1:5-11",
    "work": "Homilies on Titus"
  },
  {
    "book": "TIT",
    "homily": 3,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/23083.htm",
    "chapters": [
      1,
      2
    ],
    "locus": "Homily 3 (Titus 1–2)",
    "work": "Homilies on Titus"
  },
  {
    "book": "TIT",
    "homily": 4,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/23084.htm",
    "chapters": [
      2
    ],
    "verses": [
      2,
      10
    ],
    "locus": "Titus 2:2-10",
    "work": "Homilies on Titus"
  },
  {
    "book": "TIT",
    "homily": 5,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/23085.htm",
    "chapters": [
      2,
      3
    ],
    "locus": "Homily 5 (Titus 2–3)",
    "work": "Homilies on Titus"
  },
  {
    "book": "TIT",
    "homily": 6,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/23086.htm",
    "chapters": [
      3
    ],
    "verses": [
      8,
      999
    ],
    "locus": "Titus 3:8–end",
    "work": "Homilies on Titus"
  },
  {
    "book": "PHM",
    "homily": 1,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/23091.htm",
    "chapters": [
      1
    ],
    "verses": [
      1,
      3
    ],
    "locus": "Philemon 1:1-3",
    "work": "Homilies on Philemon"
  },
  {
    "book": "PHM",
    "homily": 2,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/23092.htm",
    "chapters": [
      1
    ],
    "verses": [
      4,
      16
    ],
    "locus": "Philemon 1:4-16",
    "work": "Homilies on Philemon"
  },
  {
    "book": "PHM",
    "homily": 3,
    "kind": "homily",
    "url": "https://www.newadvent.org/fathers/23093.htm",
    "chapters": [
      1
    ],
    "verses": [
      17,
      999
    ],
    "locus": "Philemon 1:17–end",
    "work": "Homilies on Philemon"
  }
];
