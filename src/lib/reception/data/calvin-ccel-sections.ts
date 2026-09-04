/** Calvin Translation Society pericopes, crawled from each volume's .toc.html on 2026-09-04. One row per unique URL; harmony pages keep later gospels in `parallels`. Regenerate with scripts/research/build-phase-c-data.mjs. */
export type CalvinCcelSection = {
  book: string;
  chapter: number;
  start: number;
  end: number;
  url: string;
  locus: string;
  parallels: Array<{
    book: string;
    chapter: number;
    start: number;
    end: number;
    locus: string;
  }>;
};

export const CALVIN_CCEL_SECTIONS: CalvinCcelSection[] = [
  {
    "book": "LUK",
    "chapter": 1,
    "start": 1,
    "end": 4,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.i.html",
    "locus": "Luke 1:1-4",
    "parallels": []
  },
  {
    "book": "LUK",
    "chapter": 1,
    "start": 5,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.ii.html",
    "locus": "Luke 1:5-13",
    "parallels": []
  },
  {
    "book": "LUK",
    "chapter": 1,
    "start": 14,
    "end": 17,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.iii.html",
    "locus": "Luke 1:14-17",
    "parallels": []
  },
  {
    "book": "LUK",
    "chapter": 1,
    "start": 18,
    "end": 20,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.iv.html",
    "locus": "Luke 1:18-20",
    "parallels": []
  },
  {
    "book": "LUK",
    "chapter": 1,
    "start": 21,
    "end": 25,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.v.html",
    "locus": "Luke 1:21-25",
    "parallels": []
  },
  {
    "book": "LUK",
    "chapter": 1,
    "start": 26,
    "end": 33,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.vi.html",
    "locus": "Luke 1:26-33",
    "parallels": []
  },
  {
    "book": "LUK",
    "chapter": 1,
    "start": 34,
    "end": 38,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.vii.html",
    "locus": "Luke 1:34-38",
    "parallels": []
  },
  {
    "book": "LUK",
    "chapter": 1,
    "start": 39,
    "end": 45,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.viii.html",
    "locus": "Luke 1:39-45",
    "parallels": []
  },
  {
    "book": "LUK",
    "chapter": 1,
    "start": 46,
    "end": 50,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.ix.html",
    "locus": "Luke 1:46-50",
    "parallels": []
  },
  {
    "book": "LUK",
    "chapter": 1,
    "start": 51,
    "end": 55,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.x.html",
    "locus": "Luke 1:51-55",
    "parallels": []
  },
  {
    "book": "LUK",
    "chapter": 1,
    "start": 56,
    "end": 66,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.xi.html",
    "locus": "Luke 1:56-66",
    "parallels": []
  },
  {
    "book": "LUK",
    "chapter": 1,
    "start": 67,
    "end": 75,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.xii.html",
    "locus": "Luke 1:67-75",
    "parallels": []
  },
  {
    "book": "LUK",
    "chapter": 1,
    "start": 76,
    "end": 80,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.xiii.html",
    "locus": "Luke 1:76-80",
    "parallels": []
  },
  {
    "book": "MAT",
    "chapter": 1,
    "start": 1,
    "end": 17,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.xiv.html",
    "locus": "Matthew 1:1-17",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 3,
        "start": 23,
        "end": 38,
        "locus": "Luke 3:23-38"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 1,
    "start": 18,
    "end": 25,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.xv.html",
    "locus": "Matthew 1:18-25",
    "parallels": []
  },
  {
    "book": "LUK",
    "chapter": 2,
    "start": 1,
    "end": 7,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.xvi.html",
    "locus": "Luke 2:1-7",
    "parallels": []
  },
  {
    "book": "LUK",
    "chapter": 2,
    "start": 8,
    "end": 14,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.xvii.html",
    "locus": "Luke 2:8-14",
    "parallels": []
  },
  {
    "book": "LUK",
    "chapter": 2,
    "start": 15,
    "end": 21,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.xviii.html",
    "locus": "Luke 2:15-21",
    "parallels": []
  },
  {
    "book": "MAT",
    "chapter": 2,
    "start": 1,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.xix.html",
    "locus": "Matthew 2:1-6",
    "parallels": []
  },
  {
    "book": "MAT",
    "chapter": 2,
    "start": 7,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.xx.html",
    "locus": "Matthew 2:7-12",
    "parallels": []
  },
  {
    "book": "LUK",
    "chapter": 2,
    "start": 22,
    "end": 32,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.xxi.html",
    "locus": "Luke 2:22-32",
    "parallels": []
  },
  {
    "book": "LUK",
    "chapter": 2,
    "start": 33,
    "end": 39,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.xxii.html",
    "locus": "Luke 2:33-39",
    "parallels": []
  },
  {
    "book": "MAT",
    "chapter": 2,
    "start": 13,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.xxiii.html",
    "locus": "Matthew 2:13-18",
    "parallels": []
  },
  {
    "book": "MAT",
    "chapter": 2,
    "start": 19,
    "end": 23,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.xxiv.html",
    "locus": "Matthew 2:19-23",
    "parallels": []
  },
  {
    "book": "LUK",
    "chapter": 2,
    "start": 40,
    "end": 47,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.xxv.html",
    "locus": "Luke 2:40-47",
    "parallels": []
  },
  {
    "book": "LUK",
    "chapter": 2,
    "start": 48,
    "end": 52,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.xxvi.html",
    "locus": "Luke 2:48-52",
    "parallels": []
  },
  {
    "book": "MAT",
    "chapter": 3,
    "start": 1,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.xxvii.html",
    "locus": "Matthew 3:1-6",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 1,
        "start": 1,
        "end": 6,
        "locus": "Mark 1:1-6"
      },
      {
        "book": "LUK",
        "chapter": 3,
        "start": 1,
        "end": 6,
        "locus": "Luke 3:1-6"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 3,
    "start": 7,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.xxviii.html",
    "locus": "Matthew 3:7-10",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 3,
        "start": 7,
        "end": 14,
        "locus": "Luke 3:7-14"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 3,
    "start": 11,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.xxix.html",
    "locus": "Matthew 3:11-12",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 1,
        "start": 7,
        "end": 8,
        "locus": "Mark 1:7-8"
      },
      {
        "book": "LUK",
        "chapter": 3,
        "start": 15,
        "end": 18,
        "locus": "Luke 3:15-18"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 3,
    "start": 13,
    "end": 17,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.xxx.html",
    "locus": "Matthew 3:13-17",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 1,
        "start": 9,
        "end": 11,
        "locus": "Mark 1:9-11"
      },
      {
        "book": "LUK",
        "chapter": 3,
        "start": 21,
        "end": 23,
        "locus": "Luke 3:21-23"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 4,
    "start": 1,
    "end": 4,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.xxxi.html",
    "locus": "Matthew 4:1-4",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 1,
        "start": 12,
        "end": 13,
        "locus": "Mark 1:12-13"
      },
      {
        "book": "LUK",
        "chapter": 4,
        "start": 1,
        "end": 4,
        "locus": "Luke 4:1-4"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 4,
    "start": 5,
    "end": 11,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.xxxii.html",
    "locus": "Matthew 4:5-11",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 1,
        "start": 13,
        "end": 13,
        "locus": "Mark 1:13"
      },
      {
        "book": "LUK",
        "chapter": 4,
        "start": 5,
        "end": 13,
        "locus": "Luke 4:5-13"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 4,
    "start": 12,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.xxxiii.html",
    "locus": "Matthew 4:12",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 1,
        "start": 14,
        "end": 15,
        "locus": "Mark 1:14-15"
      },
      {
        "book": "LUK",
        "chapter": 3,
        "start": 19,
        "end": 20,
        "locus": "Luke 3:19-20"
      }
    ]
  },
  {
    "book": "LUK",
    "chapter": 4,
    "start": 16,
    "end": 22,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.xxxiv.html",
    "locus": "Luke 4:16-22",
    "parallels": []
  },
  {
    "book": "LUK",
    "chapter": 4,
    "start": 23,
    "end": 30,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.xxxv.html",
    "locus": "Luke 4:23-30",
    "parallels": []
  },
  {
    "book": "MAT",
    "chapter": 4,
    "start": 13,
    "end": 16,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.xxxvi.html",
    "locus": "Matthew 4:13-16",
    "parallels": []
  },
  {
    "book": "MAT",
    "chapter": 4,
    "start": 18,
    "end": 25,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.xxxvii.html",
    "locus": "Matthew 4:18-25",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 1,
        "start": 16,
        "end": 20,
        "locus": "Mark 1:16-20"
      },
      {
        "book": "LUK",
        "chapter": 5,
        "start": 1,
        "end": 11,
        "locus": "Luke 5:1-11"
      }
    ]
  },
  {
    "book": "MRK",
    "chapter": 1,
    "start": 21,
    "end": 28,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.xxxviii.html",
    "locus": "Mark 1:21-28",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 4,
        "start": 31,
        "end": 36,
        "locus": "Luke 4:31-36"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 8,
    "start": 14,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.xxxix.html",
    "locus": "Matthew 8:14-18",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 1,
        "start": 29,
        "end": 39,
        "locus": "Mark 1:29-39"
      },
      {
        "book": "LUK",
        "chapter": 4,
        "start": 38,
        "end": 44,
        "locus": "Luke 4:38-44"
      }
    ]
  },
  {
    "book": "MRK",
    "chapter": 3,
    "start": 13,
    "end": 19,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.xl.html",
    "locus": "Mark 3:13-19",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 6,
        "start": 12,
        "end": 19,
        "locus": "Luke 6:12-19"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 5,
    "start": 1,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.xli.html",
    "locus": "Matthew 5:1-12",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 6,
        "start": 20,
        "end": 26,
        "locus": "Luke 6:20-26"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 5,
    "start": 13,
    "end": 16,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.xlii.html",
    "locus": "Matthew 5:13-16",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 9,
        "start": 49,
        "end": 50,
        "locus": "Mark 9:49-50"
      },
      {
        "book": "LUK",
        "chapter": 14,
        "start": 34,
        "end": 35,
        "locus": "Luke 14:34-35"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 5,
    "start": 17,
    "end": 19,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.xliii.html",
    "locus": "Matthew 5:17-19",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 16,
        "start": 17,
        "end": 17,
        "locus": "Luke 16:17"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 5,
    "start": 20,
    "end": 22,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.xliv.html",
    "locus": "Matthew 5:20-22",
    "parallels": []
  },
  {
    "book": "MAT",
    "chapter": 5,
    "start": 23,
    "end": 26,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.xlv.html",
    "locus": "Matthew 5:23-26",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 12,
        "start": 58,
        "end": 59,
        "locus": "Luke 12:58-59"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 5,
    "start": 27,
    "end": 30,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.xlvi.html",
    "locus": "Matthew 5:27-30",
    "parallels": []
  },
  {
    "book": "MAT",
    "chapter": 5,
    "start": 31,
    "end": 32,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.xlvii.html",
    "locus": "Matthew 5:31-32",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 16,
        "start": 18,
        "end": 18,
        "locus": "Luke 16:18"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 5,
    "start": 33,
    "end": 37,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.xlviii.html",
    "locus": "Matthew 5:33-37",
    "parallels": []
  },
  {
    "book": "MAT",
    "chapter": 5,
    "start": 38,
    "end": 41,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.xlix.html",
    "locus": "Matthew 5:38-41",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 6,
        "start": 29,
        "end": 30,
        "locus": "Luke 6:29-30"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 5,
    "start": 42,
    "end": 42,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.l.html",
    "locus": "Matthew 5:42",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 6,
        "start": 34,
        "end": 35,
        "locus": "Luke 6:34-35"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 5,
    "start": 43,
    "end": 48,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.li.html",
    "locus": "Matthew 5:43-48",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 6,
        "start": 27,
        "end": 36,
        "locus": "Luke 6:27-36"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 6,
    "start": 1,
    "end": 4,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.lii.html",
    "locus": "Matthew 6:1-4",
    "parallels": []
  },
  {
    "book": "MAT",
    "chapter": 6,
    "start": 5,
    "end": 8,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.liii.html",
    "locus": "Matthew 6:5-8",
    "parallels": []
  },
  {
    "book": "MAT",
    "chapter": 6,
    "start": 9,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.liv.html",
    "locus": "Matthew 6:9-13",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 11,
        "start": 1,
        "end": 4,
        "locus": "Luke 11:1-4"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 6,
    "start": 14,
    "end": 15,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.lv.html",
    "locus": "Matthew 6:14-15",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 11,
        "start": 25,
        "end": 26,
        "locus": "Mark 11:25-26"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 6,
    "start": 16,
    "end": 19,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.lvi.html",
    "locus": "Matthew 6:16-19",
    "parallels": []
  },
  {
    "book": "MAT",
    "chapter": 6,
    "start": 19,
    "end": 21,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.lvii.html",
    "locus": "Matthew 6:19-21",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 12,
        "start": 33,
        "end": 34,
        "locus": "Luke 12:33-34"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 6,
    "start": 22,
    "end": 24,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.lviii.html",
    "locus": "Matthew 6:22-24",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 11,
        "start": 34,
        "end": 36,
        "locus": "Luke 11:34-36"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 6,
    "start": 25,
    "end": 30,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.lix.html",
    "locus": "Matthew 6:25-30",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 12,
        "start": 22,
        "end": 28,
        "locus": "Luke 12:22-28"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 6,
    "start": 31,
    "end": 34,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.lx.html",
    "locus": "Matthew 6:31-34",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 12,
        "start": 29,
        "end": 32,
        "locus": "Luke 12:29-32"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 7,
    "start": 1,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.lxi.html",
    "locus": "Matthew 7:1-5",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 4,
        "start": 24,
        "end": 24,
        "locus": "Mark 4:24"
      },
      {
        "book": "LUK",
        "chapter": 6,
        "start": 37,
        "end": 42,
        "locus": "Luke 6:37-42"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 7,
    "start": 6,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.lxii.html",
    "locus": "Matthew 7:6",
    "parallels": []
  },
  {
    "book": "MAT",
    "chapter": 7,
    "start": 7,
    "end": 11,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.lxiii.html",
    "locus": "Matthew 7:7-11",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 11,
        "start": 5,
        "end": 13,
        "locus": "Luke 11:5-13"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 7,
    "start": 12,
    "end": 14,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.lxiv.html",
    "locus": "Matthew 7:12-14",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 6,
        "start": 31,
        "end": 31,
        "locus": "Luke 6:31"
      }
    ]
  },
  {
    "book": "LUK",
    "chapter": 13,
    "start": 23,
    "end": 24,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.lxv.html",
    "locus": "Luke 13:23-24",
    "parallels": []
  },
  {
    "book": "LUK",
    "chapter": 13,
    "start": 25,
    "end": 30,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.lxvi.html",
    "locus": "Luke 13:25-30",
    "parallels": []
  },
  {
    "book": "MAT",
    "chapter": 7,
    "start": 15,
    "end": 20,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.lxvii.html",
    "locus": "Matthew 7:15-20",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 6,
        "start": 43,
        "end": 45,
        "locus": "Luke 6:43-45"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 7,
    "start": 21,
    "end": 23,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.lxviii.html",
    "locus": "Matthew 7:21-23",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 6,
        "start": 46,
        "end": 46,
        "locus": "Luke 6:46"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 7,
    "start": 24,
    "end": 29,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.lxix.html",
    "locus": "Matthew 7:24-29",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 6,
        "start": 47,
        "end": 49,
        "locus": "Luke 6:47-49"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 8,
    "start": 1,
    "end": 4,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.lxx.html",
    "locus": "Matthew 8:1-4",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 1,
        "start": 40,
        "end": 45,
        "locus": "Mark 1:40-45"
      },
      {
        "book": "LUK",
        "chapter": 5,
        "start": 12,
        "end": 16,
        "locus": "Luke 5:12-16"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 8,
    "start": 5,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.lxxi.html",
    "locus": "Matthew 8:5-13",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 7,
        "start": 1,
        "end": 10,
        "locus": "Luke 7:1-10"
      }
    ]
  },
  {
    "book": "LUK",
    "chapter": 7,
    "start": 11,
    "end": 17,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.lxxii.html",
    "locus": "Luke 7:11-17",
    "parallels": []
  },
  {
    "book": "MAT",
    "chapter": 8,
    "start": 19,
    "end": 22,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.lxxiii.html",
    "locus": "Matthew 8:19-22",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 9,
        "start": 57,
        "end": 62,
        "locus": "Luke 9:57-62"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 9,
    "start": 1,
    "end": 8,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.lxxiv.html",
    "locus": "Matthew 9:1-8",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 2,
        "start": 1,
        "end": 12,
        "locus": "Mark 2:1-12"
      },
      {
        "book": "LUK",
        "chapter": 5,
        "start": 17,
        "end": 26,
        "locus": "Luke 5:17-26"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 9,
    "start": 9,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.lxxv.html",
    "locus": "Matthew 9:9-13",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 2,
        "start": 13,
        "end": 17,
        "locus": "Mark 2:13-17"
      },
      {
        "book": "LUK",
        "chapter": 5,
        "start": 27,
        "end": 32,
        "locus": "Luke 5:27-32"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 9,
    "start": 14,
    "end": 17,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.lxxvi.html",
    "locus": "Matthew 9:14-17",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 2,
        "start": 18,
        "end": 22,
        "locus": "Mark 2:18-22"
      },
      {
        "book": "LUK",
        "chapter": 5,
        "start": 33,
        "end": 39,
        "locus": "Luke 5:33-39"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 9,
    "start": 18,
    "end": 22,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.lxxvii.html",
    "locus": "Matthew 9:18-22",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 5,
        "start": 22,
        "end": 34,
        "locus": "Mark 5:22-34"
      },
      {
        "book": "LUK",
        "chapter": 8,
        "start": 40,
        "end": 48,
        "locus": "Luke 8:40-48"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 9,
    "start": 23,
    "end": 26,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.lxxviii.html",
    "locus": "Matthew 9:23-26",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 5,
        "start": 35,
        "end": 43,
        "locus": "Mark 5:35-43"
      },
      {
        "book": "LUK",
        "chapter": 8,
        "start": 49,
        "end": 56,
        "locus": "Luke 8:49-56"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 9,
    "start": 27,
    "end": 34,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.lxxix.html",
    "locus": "Matthew 9:27-34",
    "parallels": []
  },
  {
    "book": "MAT",
    "chapter": 9,
    "start": 35,
    "end": 38,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.lxxx.html",
    "locus": "Matthew 9:35-38",
    "parallels": []
  },
  {
    "book": "MAT",
    "chapter": 8,
    "start": 23,
    "end": 27,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.lxxxi.html",
    "locus": "Matthew 8:23-27",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 4,
        "start": 35,
        "end": 41,
        "locus": "Mark 4:35-41"
      },
      {
        "book": "LUK",
        "chapter": 8,
        "start": 22,
        "end": 25,
        "locus": "Luke 8:22-25"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 8,
    "start": 28,
    "end": 34,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.lxxxii.html",
    "locus": "Matthew 8:28-34",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 5,
        "start": 1,
        "end": 20,
        "locus": "Mark 5:1-20"
      },
      {
        "book": "LUK",
        "chapter": 8,
        "start": 26,
        "end": 39,
        "locus": "Luke 8:26-39"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 10,
    "start": 1,
    "end": 8,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.lxxxiii.html",
    "locus": "Matthew 10:1-8",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 6,
        "start": 7,
        "end": 7,
        "locus": "Mark 6:7"
      },
      {
        "book": "LUK",
        "chapter": 9,
        "start": 1,
        "end": 2,
        "locus": "Luke 9:1-2"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 10,
    "start": 9,
    "end": 15,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.lxxxiv.html",
    "locus": "Matthew 10:9-15",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 6,
        "start": 8,
        "end": 11,
        "locus": "Mark 6:8-11"
      },
      {
        "book": "LUK",
        "chapter": 9,
        "start": 3,
        "end": 5,
        "locus": "Luke 9:3-5"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 10,
    "start": 16,
    "end": 20,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.lxxxv.html",
    "locus": "Matthew 10:16-20",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 12,
        "start": 11,
        "end": 12,
        "locus": "Luke 12:11-12"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 10,
    "start": 21,
    "end": 25,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.lxxxvi.html",
    "locus": "Matthew 10:21-25",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 6,
        "start": 40,
        "end": 40,
        "locus": "Luke 6:40"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 10,
    "start": 26,
    "end": 31,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.lxxxvii.html",
    "locus": "Matthew 10:26-31",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 4,
        "start": 22,
        "end": 23,
        "locus": "Mark 4:22-23"
      },
      {
        "book": "LUK",
        "chapter": 8,
        "start": 17,
        "end": 17,
        "locus": "Luke 8:17"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 10,
    "start": 32,
    "end": 35,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.lxxxviii.html",
    "locus": "Matthew 10:32-35",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 8,
        "start": 38,
        "end": 38,
        "locus": "Mark 8:38"
      },
      {
        "book": "LUK",
        "chapter": 9,
        "start": 26,
        "end": 26,
        "locus": "Luke 9:26"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 10,
    "start": 37,
    "end": 42,
    "url": "https://ccel.org/ccel/calvin/calcom31/calcom31.ix.lxxxix.html",
    "locus": "Matthew 10:37-42",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 9,
        "start": 41,
        "end": 41,
        "locus": "Mark 9:41"
      },
      {
        "book": "LUK",
        "chapter": 14,
        "start": 25,
        "end": 33,
        "locus": "Luke 14:25-33"
      }
    ]
  },
  {
    "book": "MRK",
    "chapter": 6,
    "start": 12,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.i.html",
    "locus": "Mark 6:12-13",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 9,
        "start": 6,
        "end": 6,
        "locus": "Luke 9:6"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 11,
    "start": 1,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.ii.html",
    "locus": "Matthew 11:1-6",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 7,
        "start": 18,
        "end": 23,
        "locus": "Luke 7:18-23"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 11,
    "start": 7,
    "end": 15,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.iii.html",
    "locus": "Matthew 11:7-15",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 7,
        "start": 24,
        "end": 28,
        "locus": "Luke 7:24-28"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 11,
    "start": 16,
    "end": 19,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.iv.html",
    "locus": "Matthew 11:16-19",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 7,
        "start": 29,
        "end": 35,
        "locus": "Luke 7:29-35"
      }
    ]
  },
  {
    "book": "LUK",
    "chapter": 10,
    "start": 1,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.v.html",
    "locus": "Luke 10:1-12",
    "parallels": []
  },
  {
    "book": "MAT",
    "chapter": 11,
    "start": 20,
    "end": 24,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.vi.html",
    "locus": "Matthew 11:20-24",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 10,
        "start": 13,
        "end": 16,
        "locus": "Luke 10:13-16"
      }
    ]
  },
  {
    "book": "LUK",
    "chapter": 10,
    "start": 17,
    "end": 20,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.vii.html",
    "locus": "Luke 10:17-20",
    "parallels": []
  },
  {
    "book": "MAT",
    "chapter": 11,
    "start": 25,
    "end": 30,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.viii.html",
    "locus": "Matthew 11:25-30",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 10,
        "start": 21,
        "end": 22,
        "locus": "Luke 10:21-22"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 12,
    "start": 1,
    "end": 8,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.ix.html",
    "locus": "Matthew 12:1-8",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 2,
        "start": 23,
        "end": 28,
        "locus": "Mark 2:23-28"
      },
      {
        "book": "LUK",
        "chapter": 6,
        "start": 1,
        "end": 5,
        "locus": "Luke 6:1-5"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 12,
    "start": 9,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.x.html",
    "locus": "Matthew 12:9-13",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 3,
        "start": 1,
        "end": 5,
        "locus": "Mark 3:1-5"
      },
      {
        "book": "LUK",
        "chapter": 6,
        "start": 6,
        "end": 10,
        "locus": "Luke 6:6-10"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 12,
    "start": 14,
    "end": 21,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.xi.html",
    "locus": "Matthew 12:14-21",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 3,
        "start": 6,
        "end": 12,
        "locus": "Mark 3:6-12"
      },
      {
        "book": "LUK",
        "chapter": 6,
        "start": 11,
        "end": 11,
        "locus": "Luke 6:11"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 12,
    "start": 22,
    "end": 24,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.xii.html",
    "locus": "Matthew 12:22-24",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 3,
        "start": 20,
        "end": 22,
        "locus": "Mark 3:20-22"
      },
      {
        "book": "LUK",
        "chapter": 11,
        "start": 14,
        "end": 15,
        "locus": "Luke 11:14-15"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 12,
    "start": 25,
    "end": 32,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.xiii.html",
    "locus": "Matthew 12:25-32",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 3,
        "start": 23,
        "end": 30,
        "locus": "Mark 3:23-30"
      },
      {
        "book": "LUK",
        "chapter": 11,
        "start": 16,
        "end": 23,
        "locus": "Luke 11:16-23"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 12,
    "start": 33,
    "end": 37,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.xiv.html",
    "locus": "Matthew 12:33-37",
    "parallels": []
  },
  {
    "book": "MAT",
    "chapter": 12,
    "start": 43,
    "end": 45,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.xv.html",
    "locus": "Matthew 12:43-45",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 11,
        "start": 24,
        "end": 26,
        "locus": "Luke 11:24-26"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 12,
    "start": 46,
    "end": 50,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.xvi.html",
    "locus": "Matthew 12:46-50",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 3,
        "start": 31,
        "end": 35,
        "locus": "Mark 3:31-35"
      },
      {
        "book": "LUK",
        "chapter": 11,
        "start": 27,
        "end": 28,
        "locus": "Luke 11:27-28"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 12,
    "start": 38,
    "end": 42,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.xvii.html",
    "locus": "Matthew 12:38-42",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 11,
        "start": 16,
        "end": 16,
        "locus": "Luke 11:16"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 13,
    "start": 1,
    "end": 17,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.xviii.html",
    "locus": "Matthew 13:1-17",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 4,
        "start": 1,
        "end": 12,
        "locus": "Mark 4:1-12"
      },
      {
        "book": "LUK",
        "chapter": 8,
        "start": 1,
        "end": 10,
        "locus": "Luke 8:1-10"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 13,
    "start": 18,
    "end": 23,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.xix.html",
    "locus": "Matthew 13:18-23",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 4,
        "start": 13,
        "end": 20,
        "locus": "Mark 4:13-20"
      },
      {
        "book": "LUK",
        "chapter": 8,
        "start": 11,
        "end": 15,
        "locus": "Luke 8:11-15"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 13,
    "start": 24,
    "end": 30,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.xx.html",
    "locus": "Matthew 13:24-30",
    "parallels": []
  },
  {
    "book": "MAT",
    "chapter": 13,
    "start": 31,
    "end": 35,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.xxi.html",
    "locus": "Matthew 13:31-35",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 4,
        "start": 26,
        "end": 34,
        "locus": "Mark 4:26-34"
      },
      {
        "book": "LUK",
        "chapter": 13,
        "start": 18,
        "end": 22,
        "locus": "Luke 13:18-22"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 13,
    "start": 44,
    "end": 52,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.xxii.html",
    "locus": "Matthew 13:44-52",
    "parallels": []
  },
  {
    "book": "LUK",
    "chapter": 7,
    "start": 36,
    "end": 50,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.xxiii.html",
    "locus": "Luke 7:36-50",
    "parallels": []
  },
  {
    "book": "LUK",
    "chapter": 10,
    "start": 38,
    "end": 42,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.xxiv.html",
    "locus": "Luke 10:38-42",
    "parallels": []
  },
  {
    "book": "LUK",
    "chapter": 12,
    "start": 13,
    "end": 21,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.xxv.html",
    "locus": "Luke 12:13-21",
    "parallels": []
  },
  {
    "book": "LUK",
    "chapter": 13,
    "start": 1,
    "end": 9,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.xxvi.html",
    "locus": "Luke 13:1-9",
    "parallels": []
  },
  {
    "book": "LUK",
    "chapter": 13,
    "start": 10,
    "end": 17,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.xxvii.html",
    "locus": "Luke 13:10-17",
    "parallels": []
  },
  {
    "book": "LUK",
    "chapter": 13,
    "start": 31,
    "end": 33,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.xxviii.html",
    "locus": "Luke 13:31-33",
    "parallels": []
  },
  {
    "book": "LUK",
    "chapter": 11,
    "start": 37,
    "end": 41,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.xxix.html",
    "locus": "Luke 11:37-41",
    "parallels": []
  },
  {
    "book": "LUK",
    "chapter": 14,
    "start": 1,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.xxx.html",
    "locus": "Luke 14:1-6",
    "parallels": []
  },
  {
    "book": "LUK",
    "chapter": 14,
    "start": 7,
    "end": 14,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.xxxi.html",
    "locus": "Luke 14:7-14",
    "parallels": []
  },
  {
    "book": "MAT",
    "chapter": 22,
    "start": 1,
    "end": 24,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.xxxii.html",
    "locus": "Matthew 22:1-24",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 14,
        "start": 15,
        "end": 24,
        "locus": "Luke 14:15-24"
      }
    ]
  },
  {
    "book": "LUK",
    "chapter": 16,
    "start": 1,
    "end": 15,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.xxxiii.html",
    "locus": "Luke 16:1-15",
    "parallels": []
  },
  {
    "book": "LUK",
    "chapter": 16,
    "start": 19,
    "end": 31,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.xxxiv.html",
    "locus": "Luke 16:19-31",
    "parallels": []
  },
  {
    "book": "LUK",
    "chapter": 17,
    "start": 7,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.xxxv.html",
    "locus": "Luke 17:7-10",
    "parallels": []
  },
  {
    "book": "LUK",
    "chapter": 18,
    "start": 1,
    "end": 8,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.xxxvi.html",
    "locus": "Luke 18:1-8",
    "parallels": []
  },
  {
    "book": "LUK",
    "chapter": 18,
    "start": 9,
    "end": 14,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.xxxvii.html",
    "locus": "Luke 18:9-14",
    "parallels": []
  },
  {
    "book": "LUK",
    "chapter": 17,
    "start": 11,
    "end": 21,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.xxxviii.html",
    "locus": "Luke 17:11-21",
    "parallels": []
  },
  {
    "book": "MAT",
    "chapter": 13,
    "start": 53,
    "end": 58,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.xxxix.html",
    "locus": "Matthew 13:53-58",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 6,
        "start": 1,
        "end": 6,
        "locus": "Mark 6:1-6"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 14,
    "start": 1,
    "end": 2,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.xl.html",
    "locus": "Matthew 14:1-2",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 6,
        "start": 14,
        "end": 16,
        "locus": "Mark 6:14-16"
      },
      {
        "book": "LUK",
        "chapter": 9,
        "start": 7,
        "end": 9,
        "locus": "Luke 9:7-9"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 14,
    "start": 3,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.xli.html",
    "locus": "Matthew 14:3-12",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 6,
        "start": 17,
        "end": 29,
        "locus": "Mark 6:17-29"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 14,
    "start": 13,
    "end": 21,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.xlii.html",
    "locus": "Matthew 14:13-21",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 6,
        "start": 30,
        "end": 44,
        "locus": "Mark 6:30-44"
      },
      {
        "book": "LUK",
        "chapter": 9,
        "start": 10,
        "end": 17,
        "locus": "Luke 9:10-17"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 14,
    "start": 22,
    "end": 33,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.xliii.html",
    "locus": "Matthew 14:22-33",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 6,
        "start": 45,
        "end": 52,
        "locus": "Mark 6:45-52"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 14,
    "start": 34,
    "end": 36,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.xliv.html",
    "locus": "Matthew 14:34-36",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 6,
        "start": 53,
        "end": 56,
        "locus": "Mark 6:53-56"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 15,
    "start": 1,
    "end": 9,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.xlv.html",
    "locus": "Matthew 15:1-9",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 7,
        "start": 1,
        "end": 13,
        "locus": "Mark 7:1-13"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 15,
    "start": 10,
    "end": 20,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.xlvi.html",
    "locus": "Matthew 15:10-20",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 7,
        "start": 14,
        "end": 23,
        "locus": "Mark 7:14-23"
      },
      {
        "book": "LUK",
        "chapter": 6,
        "start": 39,
        "end": 39,
        "locus": "Luke 6:39"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 15,
    "start": 21,
    "end": 28,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.xlvii.html",
    "locus": "Matthew 15:21-28",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 7,
        "start": 24,
        "end": 30,
        "locus": "Mark 7:24-30"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 15,
    "start": 29,
    "end": 39,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.xlviii.html",
    "locus": "Matthew 15:29-39",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 7,
        "start": 31,
        "end": 37,
        "locus": "Mark 7:31-37"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 16,
    "start": 1,
    "end": 4,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.xlix.html",
    "locus": "Matthew 16:1-4",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 8,
        "start": 11,
        "end": 13,
        "locus": "Mark 8:11-13"
      },
      {
        "book": "LUK",
        "chapter": 12,
        "start": 54,
        "end": 57,
        "locus": "Luke 12:54-57"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 16,
    "start": 5,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.l.html",
    "locus": "Matthew 16:5-12",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 8,
        "start": 14,
        "end": 21,
        "locus": "Mark 8:14-21"
      },
      {
        "book": "LUK",
        "chapter": 12,
        "start": 1,
        "end": 1,
        "locus": "Luke 12:1"
      }
    ]
  },
  {
    "book": "MRK",
    "chapter": 8,
    "start": 22,
    "end": 26,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.li.html",
    "locus": "Mark 8:22-26",
    "parallels": []
  },
  {
    "book": "MAT",
    "chapter": 16,
    "start": 13,
    "end": 19,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.lii.html",
    "locus": "Matthew 16:13-19",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 8,
        "start": 27,
        "end": 29,
        "locus": "Mark 8:27-29"
      },
      {
        "book": "LUK",
        "chapter": 9,
        "start": 18,
        "end": 20,
        "locus": "Luke 9:18-20"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 16,
    "start": 20,
    "end": 28,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.liii.html",
    "locus": "Matthew 16:20-28",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 8,
        "start": 30,
        "end": 38,
        "locus": "Mark 8:30-38"
      },
      {
        "book": "LUK",
        "chapter": 9,
        "start": 21,
        "end": 27,
        "locus": "Luke 9:21-27"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 17,
    "start": 1,
    "end": 8,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.liv.html",
    "locus": "Matthew 17:1-8",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 9,
        "start": 2,
        "end": 8,
        "locus": "Mark 9:2-8"
      },
      {
        "book": "LUK",
        "chapter": 9,
        "start": 28,
        "end": 36,
        "locus": "Luke 9:28-36"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 17,
    "start": 9,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.lv.html",
    "locus": "Matthew 17:9-13",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 9,
        "start": 36,
        "end": 36,
        "locus": "Luke 9:36"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 17,
    "start": 14,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.lvi.html",
    "locus": "Matthew 17:14-18",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 9,
        "start": 14,
        "end": 27,
        "locus": "Mark 9:14-27"
      },
      {
        "book": "LUK",
        "chapter": 9,
        "start": 37,
        "end": 43,
        "locus": "Luke 9:37-43"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 17,
    "start": 19,
    "end": 21,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.lvii.html",
    "locus": "Matthew 17:19-21",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 9,
        "start": 28,
        "end": 29,
        "locus": "Mark 9:28-29"
      },
      {
        "book": "LUK",
        "chapter": 17,
        "start": 5,
        "end": 6,
        "locus": "Luke 17:5-6"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 17,
    "start": 22,
    "end": 23,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.lviii.html",
    "locus": "Matthew 17:22-23",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 9,
        "start": 30,
        "end": 37,
        "locus": "Mark 9:30-37"
      },
      {
        "book": "LUK",
        "chapter": 9,
        "start": 43,
        "end": 48,
        "locus": "Luke 9:43-48"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 18,
    "start": 6,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.lix.html",
    "locus": "Matthew 18:6-10",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 9,
        "start": 42,
        "end": 48,
        "locus": "Mark 9:42-48"
      },
      {
        "book": "LUK",
        "chapter": 17,
        "start": 1,
        "end": 2,
        "locus": "Luke 17:1-2"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 18,
    "start": 11,
    "end": 14,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.lx.html",
    "locus": "Matthew 18:11-14",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 15,
        "start": 1,
        "end": 10,
        "locus": "Luke 15:1-10"
      }
    ]
  },
  {
    "book": "LUK",
    "chapter": 15,
    "start": 11,
    "end": 24,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.lxi.html",
    "locus": "Luke 15:11-24",
    "parallels": []
  },
  {
    "book": "LUK",
    "chapter": 15,
    "start": 25,
    "end": 32,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.lxii.html",
    "locus": "Luke 15:25-32",
    "parallels": []
  },
  {
    "book": "MAT",
    "chapter": 18,
    "start": 15,
    "end": 20,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.lxiii.html",
    "locus": "Matthew 18:15-20",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 17,
        "start": 3,
        "end": 3,
        "locus": "Luke 17:3"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 18,
    "start": 21,
    "end": 35,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.lxiv.html",
    "locus": "Matthew 18:21-35",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 17,
        "start": 4,
        "end": 4,
        "locus": "Luke 17:4"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 17,
    "start": 24,
    "end": 27,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.lxv.html",
    "locus": "Matthew 17:24-27",
    "parallels": []
  },
  {
    "book": "MAT",
    "chapter": 19,
    "start": 1,
    "end": 2,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.lxvi.html",
    "locus": "Matthew 19:1-2",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 9,
        "start": 38,
        "end": 40,
        "locus": "Mark 9:38-40"
      },
      {
        "book": "LUK",
        "chapter": 9,
        "start": 49,
        "end": 56,
        "locus": "Luke 9:49-56"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 19,
    "start": 3,
    "end": 9,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.lxvii.html",
    "locus": "Matthew 19:3-9",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 10,
        "start": 2,
        "end": 12,
        "locus": "Mark 10:2-12"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 19,
    "start": 10,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.lxviii.html",
    "locus": "Matthew 19:10-12",
    "parallels": []
  },
  {
    "book": "MAT",
    "chapter": 19,
    "start": 13,
    "end": 15,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.lxix.html",
    "locus": "Matthew 19:13-15",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 10,
        "start": 13,
        "end": 16,
        "locus": "Mark 10:13-16"
      },
      {
        "book": "LUK",
        "chapter": 18,
        "start": 15,
        "end": 17,
        "locus": "Luke 18:15-17"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 19,
    "start": 16,
    "end": 22,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.lxx.html",
    "locus": "Matthew 19:16-22",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 10,
        "start": 17,
        "end": 22,
        "locus": "Mark 10:17-22"
      },
      {
        "book": "LUK",
        "chapter": 18,
        "start": 18,
        "end": 23,
        "locus": "Luke 18:18-23"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 19,
    "start": 23,
    "end": 26,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.lxxi.html",
    "locus": "Matthew 19:23-26",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 10,
        "start": 23,
        "end": 27,
        "locus": "Mark 10:23-27"
      },
      {
        "book": "LUK",
        "chapter": 18,
        "start": 24,
        "end": 27,
        "locus": "Luke 18:24-27"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 19,
    "start": 27,
    "end": 30,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.lxxii.html",
    "locus": "Matthew 19:27-30",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 10,
        "start": 28,
        "end": 31,
        "locus": "Mark 10:28-31"
      },
      {
        "book": "LUK",
        "chapter": 18,
        "start": 28,
        "end": 30,
        "locus": "Luke 18:28-30"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 20,
    "start": 1,
    "end": 16,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.lxxiii.html",
    "locus": "Matthew 20:1-16",
    "parallels": []
  },
  {
    "book": "MAT",
    "chapter": 20,
    "start": 17,
    "end": 19,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.lxxiv.html",
    "locus": "Matthew 20:17-19",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 10,
        "start": 32,
        "end": 34,
        "locus": "Mark 10:32-34"
      },
      {
        "book": "LUK",
        "chapter": 18,
        "start": 31,
        "end": 34,
        "locus": "Luke 18:31-34"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 20,
    "start": 20,
    "end": 23,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.lxxv.html",
    "locus": "Matthew 20:20-23",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 10,
        "start": 35,
        "end": 40,
        "locus": "Mark 10:35-40"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 20,
    "start": 24,
    "end": 28,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.lxxvi.html",
    "locus": "Matthew 20:24-28",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 10,
        "start": 41,
        "end": 45,
        "locus": "Mark 10:41-45"
      },
      {
        "book": "LUK",
        "chapter": 22,
        "start": 24,
        "end": 27,
        "locus": "Luke 22:24-27"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 20,
    "start": 29,
    "end": 34,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.lxxvii.html",
    "locus": "Matthew 20:29-34",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 10,
        "start": 46,
        "end": 52,
        "locus": "Mark 10:46-52"
      },
      {
        "book": "LUK",
        "chapter": 18,
        "start": 35,
        "end": 43,
        "locus": "Luke 18:35-43"
      }
    ]
  },
  {
    "book": "LUK",
    "chapter": 19,
    "start": 1,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.lxxviii.html",
    "locus": "Luke 19:1-10",
    "parallels": []
  },
  {
    "book": "MAT",
    "chapter": 25,
    "start": 14,
    "end": 30,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.lxxix.html",
    "locus": "Matthew 25:14-30",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 19,
        "start": 11,
        "end": 28,
        "locus": "Luke 19:11-28"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 21,
    "start": 1,
    "end": 9,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.lxxx.html",
    "locus": "Matthew 21:1-9",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 11,
        "start": 1,
        "end": 10,
        "locus": "Mark 11:1-10"
      },
      {
        "book": "LUK",
        "chapter": 19,
        "start": 29,
        "end": 38,
        "locus": "Luke 19:29-38"
      }
    ]
  },
  {
    "book": "LUK",
    "chapter": 19,
    "start": 41,
    "end": 44,
    "url": "https://ccel.org/ccel/calvin/calcom32/calcom32.ii.lxxxi.html",
    "locus": "Luke 19:41-44",
    "parallels": []
  },
  {
    "book": "MAT",
    "chapter": 21,
    "start": 10,
    "end": 22,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.i.html",
    "locus": "Matthew 21:10-22",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 11,
        "start": 11,
        "end": 24,
        "locus": "Mark 11:11-24"
      },
      {
        "book": "LUK",
        "chapter": 19,
        "start": 39,
        "end": 48,
        "locus": "Luke 19:39-48"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 21,
    "start": 23,
    "end": 27,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.ii.html",
    "locus": "Matthew 21:23-27",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 11,
        "start": 27,
        "end": 33,
        "locus": "Mark 11:27-33"
      },
      {
        "book": "LUK",
        "chapter": 20,
        "start": 1,
        "end": 8,
        "locus": "Luke 20:1-8"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 21,
    "start": 28,
    "end": 32,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.iii.html",
    "locus": "Matthew 21:28-32",
    "parallels": []
  },
  {
    "book": "MAT",
    "chapter": 21,
    "start": 33,
    "end": 46,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.iv.html",
    "locus": "Matthew 21:33-46",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 12,
        "start": 1,
        "end": 12,
        "locus": "Mark 12:1-12"
      },
      {
        "book": "LUK",
        "chapter": 20,
        "start": 9,
        "end": 19,
        "locus": "Luke 20:9-19"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 22,
    "start": 15,
    "end": 22,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.v.html",
    "locus": "Matthew 22:15-22",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 12,
        "start": 13,
        "end": 17,
        "locus": "Mark 12:13-17"
      },
      {
        "book": "LUK",
        "chapter": 20,
        "start": 20,
        "end": 26,
        "locus": "Luke 20:20-26"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 22,
    "start": 23,
    "end": 33,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.vi.html",
    "locus": "Matthew 22:23-33",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 12,
        "start": 18,
        "end": 27,
        "locus": "Mark 12:18-27"
      },
      {
        "book": "LUK",
        "chapter": 20,
        "start": 27,
        "end": 40,
        "locus": "Luke 20:27-40"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 22,
    "start": 34,
    "end": 40,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.vii.html",
    "locus": "Matthew 22:34-40",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 12,
        "start": 28,
        "end": 34,
        "locus": "Mark 12:28-34"
      },
      {
        "book": "LUK",
        "chapter": 10,
        "start": 25,
        "end": 37,
        "locus": "Luke 10:25-37"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 22,
    "start": 41,
    "end": 46,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.viii.html",
    "locus": "Matthew 22:41-46",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 12,
        "start": 35,
        "end": 37,
        "locus": "Mark 12:35-37"
      },
      {
        "book": "LUK",
        "chapter": 20,
        "start": 41,
        "end": 44,
        "locus": "Luke 20:41-44"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 23,
    "start": 1,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.ix.html",
    "locus": "Matthew 23:1-12",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 12,
        "start": 38,
        "end": 39,
        "locus": "Mark 12:38-39"
      },
      {
        "book": "LUK",
        "chapter": 11,
        "start": 43,
        "end": 43,
        "locus": "Luke 11:43"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 23,
    "start": 13,
    "end": 15,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.x.html",
    "locus": "Matthew 23:13-15",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 12,
        "start": 40,
        "end": 40,
        "locus": "Mark 12:40"
      },
      {
        "book": "LUK",
        "chapter": 11,
        "start": 52,
        "end": 52,
        "locus": "Luke 11:52"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 23,
    "start": 16,
    "end": 16,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.xi.html",
    "locus": "Matthew 23:16",
    "parallels": []
  },
  {
    "book": "MAT",
    "chapter": 23,
    "start": 23,
    "end": 28,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.xii.html",
    "locus": "Matthew 23:23-28",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 11,
        "start": 42,
        "end": 42,
        "locus": "Luke 11:42"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 23,
    "start": 29,
    "end": 39,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.xiii.html",
    "locus": "Matthew 23:29-39",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 11,
        "start": 47,
        "end": 51,
        "locus": "Luke 11:47-51"
      }
    ]
  },
  {
    "book": "MRK",
    "chapter": 12,
    "start": 41,
    "end": 44,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.xiv.html",
    "locus": "Mark 12:41-44",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 21,
        "start": 1,
        "end": 4,
        "locus": "Luke 21:1-4"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 24,
    "start": 1,
    "end": 8,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.xv.html",
    "locus": "Matthew 24:1-8",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 13,
        "start": 1,
        "end": 8,
        "locus": "Mark 13:1-8"
      },
      {
        "book": "LUK",
        "chapter": 21,
        "start": 5,
        "end": 11,
        "locus": "Luke 21:5-11"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 24,
    "start": 9,
    "end": 14,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.xvi.html",
    "locus": "Matthew 24:9-14",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 13,
        "start": 9,
        "end": 13,
        "locus": "Mark 13:9-13"
      },
      {
        "book": "LUK",
        "chapter": 21,
        "start": 12,
        "end": 19,
        "locus": "Luke 21:12-19"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 24,
    "start": 15,
    "end": 28,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.xvii.html",
    "locus": "Matthew 24:15-28",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 13,
        "start": 14,
        "end": 23,
        "locus": "Mark 13:14-23"
      },
      {
        "book": "LUK",
        "chapter": 21,
        "start": 20,
        "end": 24,
        "locus": "Luke 21:20-24"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 24,
    "start": 29,
    "end": 31,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.xviii.html",
    "locus": "Matthew 24:29-31",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 13,
        "start": 24,
        "end": 27,
        "locus": "Mark 13:24-27"
      },
      {
        "book": "LUK",
        "chapter": 21,
        "start": 25,
        "end": 28,
        "locus": "Luke 21:25-28"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 24,
    "start": 32,
    "end": 36,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.xix.html",
    "locus": "Matthew 24:32-36",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 13,
        "start": 28,
        "end": 32,
        "locus": "Mark 13:28-32"
      },
      {
        "book": "LUK",
        "chapter": 21,
        "start": 29,
        "end": 33,
        "locus": "Luke 21:29-33"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 24,
    "start": 37,
    "end": 42,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.xx.html",
    "locus": "Matthew 24:37-42",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 13,
        "start": 33,
        "end": 33,
        "locus": "Mark 13:33"
      },
      {
        "book": "LUK",
        "chapter": 17,
        "start": 26,
        "end": 37,
        "locus": "Luke 17:26-37"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 24,
    "start": 43,
    "end": 51,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.xxi.html",
    "locus": "Matthew 24:43-51",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 13,
        "start": 34,
        "end": 37,
        "locus": "Mark 13:34-37"
      },
      {
        "book": "LUK",
        "chapter": 12,
        "start": 35,
        "end": 50,
        "locus": "Luke 12:35-50"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 25,
    "start": 1,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.xxii.html",
    "locus": "Matthew 25:1-13",
    "parallels": []
  },
  {
    "book": "MAT",
    "chapter": 25,
    "start": 31,
    "end": 46,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.xxiii.html",
    "locus": "Matthew 25:31-46",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 21,
        "start": 37,
        "end": 38,
        "locus": "Luke 21:37-38"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 26,
    "start": 1,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.xxiv.html",
    "locus": "Matthew 26:1-13",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 14,
        "start": 1,
        "end": 9,
        "locus": "Mark 14:1-9"
      },
      {
        "book": "LUK",
        "chapter": 22,
        "start": 1,
        "end": 2,
        "locus": "Luke 22:1-2"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 26,
    "start": 14,
    "end": 20,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.xxv.html",
    "locus": "Matthew 26:14-20",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 14,
        "start": 10,
        "end": 17,
        "locus": "Mark 14:10-17"
      },
      {
        "book": "LUK",
        "chapter": 22,
        "start": 3,
        "end": 14,
        "locus": "Luke 22:3-14"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 26,
    "start": 21,
    "end": 25,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.xxvi.html",
    "locus": "Matthew 26:21-25",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 14,
        "start": 18,
        "end": 21,
        "locus": "Mark 14:18-21"
      },
      {
        "book": "LUK",
        "chapter": 22,
        "start": 15,
        "end": 16,
        "locus": "Luke 22:15-16"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 26,
    "start": 26,
    "end": 30,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.xxvii.html",
    "locus": "Matthew 26:26-30",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 14,
        "start": 22,
        "end": 26,
        "locus": "Mark 14:22-26"
      },
      {
        "book": "LUK",
        "chapter": 22,
        "start": 17,
        "end": 20,
        "locus": "Luke 22:17-20"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 26,
    "start": 31,
    "end": 35,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.xxviii.html",
    "locus": "Matthew 26:31-35",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 14,
        "start": 27,
        "end": 31,
        "locus": "Mark 14:27-31"
      },
      {
        "book": "LUK",
        "chapter": 22,
        "start": 31,
        "end": 34,
        "locus": "Luke 22:31-34"
      }
    ]
  },
  {
    "book": "LUK",
    "chapter": 22,
    "start": 35,
    "end": 38,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.xxix.html",
    "locus": "Luke 22:35-38",
    "parallels": []
  },
  {
    "book": "MAT",
    "chapter": 26,
    "start": 36,
    "end": 44,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.xxx.html",
    "locus": "Matthew 26:36-44",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 14,
        "start": 32,
        "end": 40,
        "locus": "Mark 14:32-40"
      },
      {
        "book": "LUK",
        "chapter": 22,
        "start": 39,
        "end": 46,
        "locus": "Luke 22:39-46"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 26,
    "start": 45,
    "end": 50,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.xxxi.html",
    "locus": "Matthew 26:45-50",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 14,
        "start": 41,
        "end": 46,
        "locus": "Mark 14:41-46"
      },
      {
        "book": "LUK",
        "chapter": 22,
        "start": 47,
        "end": 48,
        "locus": "Luke 22:47-48"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 26,
    "start": 51,
    "end": 56,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.xxxii.html",
    "locus": "Matthew 26:51-56",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 14,
        "start": 47,
        "end": 52,
        "locus": "Mark 14:47-52"
      },
      {
        "book": "LUK",
        "chapter": 22,
        "start": 49,
        "end": 53,
        "locus": "Luke 22:49-53"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 26,
    "start": 57,
    "end": 61,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.xxxiii.html",
    "locus": "Matthew 26:57-61",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 14,
        "start": 53,
        "end": 59,
        "locus": "Mark 14:53-59"
      },
      {
        "book": "LUK",
        "chapter": 22,
        "start": 54,
        "end": 54,
        "locus": "Luke 22:54"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 26,
    "start": 62,
    "end": 68,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.xxxiv.html",
    "locus": "Matthew 26:62-68",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 14,
        "start": 60,
        "end": 65,
        "locus": "Mark 14:60-65"
      },
      {
        "book": "LUK",
        "chapter": 22,
        "start": 63,
        "end": 71,
        "locus": "Luke 22:63-71"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 26,
    "start": 69,
    "end": 75,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.xxxv.html",
    "locus": "Matthew 26:69-75",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 14,
        "start": 66,
        "end": 72,
        "locus": "Mark 14:66-72"
      },
      {
        "book": "LUK",
        "chapter": 22,
        "start": 55,
        "end": 62,
        "locus": "Luke 22:55-62"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 27,
    "start": 1,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.xxxvi.html",
    "locus": "Matthew 27:1-10",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 15,
        "start": 1,
        "end": 1,
        "locus": "Mark 15:1"
      },
      {
        "book": "LUK",
        "chapter": 23,
        "start": 1,
        "end": 1,
        "locus": "Luke 23:1"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 27,
    "start": 11,
    "end": 14,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.xxxvii.html",
    "locus": "Matthew 27:11-14",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 15,
        "start": 2,
        "end": 5,
        "locus": "Mark 15:2-5"
      },
      {
        "book": "LUK",
        "chapter": 23,
        "start": 2,
        "end": 12,
        "locus": "Luke 23:2-12"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 27,
    "start": 15,
    "end": 23,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.xxxviii.html",
    "locus": "Matthew 27:15-23",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 15,
        "start": 6,
        "end": 14,
        "locus": "Mark 15:6-14"
      },
      {
        "book": "LUK",
        "chapter": 23,
        "start": 13,
        "end": 23,
        "locus": "Luke 23:13-23"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 27,
    "start": 24,
    "end": 32,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.xxxix.html",
    "locus": "Matthew 27:24-32",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 15,
        "start": 15,
        "end": 21,
        "locus": "Mark 15:15-21"
      },
      {
        "book": "LUK",
        "chapter": 23,
        "start": 24,
        "end": 32,
        "locus": "Luke 23:24-32"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 27,
    "start": 33,
    "end": 38,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.xl.html",
    "locus": "Matthew 27:33-38",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 15,
        "start": 22,
        "end": 28,
        "locus": "Mark 15:22-28"
      },
      {
        "book": "LUK",
        "chapter": 23,
        "start": 33,
        "end": 34,
        "locus": "Luke 23:33-34"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 27,
    "start": 39,
    "end": 44,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.xli.html",
    "locus": "Matthew 27:39-44",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 15,
        "start": 29,
        "end": 32,
        "locus": "Mark 15:29-32"
      },
      {
        "book": "LUK",
        "chapter": 23,
        "start": 35,
        "end": 37,
        "locus": "Luke 23:35-37"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 27,
    "start": 45,
    "end": 56,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.xlii.html",
    "locus": "Matthew 27:45-56",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 15,
        "start": 33,
        "end": 41,
        "locus": "Mark 15:33-41"
      },
      {
        "book": "LUK",
        "chapter": 23,
        "start": 44,
        "end": 49,
        "locus": "Luke 23:44-49"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 27,
    "start": 57,
    "end": 61,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.xliii.html",
    "locus": "Matthew 27:57-61",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 15,
        "start": 42,
        "end": 47,
        "locus": "Mark 15:42-47"
      },
      {
        "book": "LUK",
        "chapter": 23,
        "start": 50,
        "end": 56,
        "locus": "Luke 23:50-56"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 27,
    "start": 62,
    "end": 66,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.xliv.html",
    "locus": "Matthew 27:62-66",
    "parallels": []
  },
  {
    "book": "MAT",
    "chapter": 28,
    "start": 1,
    "end": 7,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.xlv.html",
    "locus": "Matthew 28:1-7",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 16,
        "start": 1,
        "end": 7,
        "locus": "Mark 16:1-7"
      },
      {
        "book": "LUK",
        "chapter": 24,
        "start": 1,
        "end": 8,
        "locus": "Luke 24:1-8"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 28,
    "start": 8,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.xlvi.html",
    "locus": "Matthew 28:8-10",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 16,
        "start": 8,
        "end": 11,
        "locus": "Mark 16:8-11"
      },
      {
        "book": "LUK",
        "chapter": 24,
        "start": 9,
        "end": 12,
        "locus": "Luke 24:9-12"
      }
    ]
  },
  {
    "book": "MAT",
    "chapter": 28,
    "start": 11,
    "end": 15,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.xlvii.html",
    "locus": "Matthew 28:11-15",
    "parallels": []
  },
  {
    "book": "MRK",
    "chapter": 16,
    "start": 12,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.xlviii.html",
    "locus": "Mark 16:12",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 24,
        "start": 13,
        "end": 30,
        "locus": "Luke 24:13-30"
      }
    ]
  },
  {
    "book": "MRK",
    "chapter": 16,
    "start": 13,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.xlix.html",
    "locus": "Mark 16:13",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 24,
        "start": 31,
        "end": 40,
        "locus": "Luke 24:31-40"
      }
    ]
  },
  {
    "book": "LUK",
    "chapter": 24,
    "start": 41,
    "end": 49,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.l.html",
    "locus": "Luke 24:41-49",
    "parallels": []
  },
  {
    "book": "MAT",
    "chapter": 28,
    "start": 16,
    "end": 20,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.li.html",
    "locus": "Matthew 28:16-20",
    "parallels": [
      {
        "book": "MRK",
        "chapter": 16,
        "start": 15,
        "end": 18,
        "locus": "Mark 16:15-18"
      }
    ]
  },
  {
    "book": "MRK",
    "chapter": 16,
    "start": 19,
    "end": 20,
    "url": "https://ccel.org/ccel/calvin/calcom33/calcom33.ii.lii.html",
    "locus": "Mark 16:19-20",
    "parallels": [
      {
        "book": "LUK",
        "chapter": 24,
        "start": 50,
        "end": 53,
        "locus": "Luke 24:50-53"
      }
    ]
  },
  {
    "book": "JHN",
    "chapter": 1,
    "start": 1,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.vii.i.html",
    "locus": "John 1:1-5",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 1,
    "start": 6,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.vii.ii.html",
    "locus": "John 1:6-13",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 1,
    "start": 14,
    "end": 14,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.vii.iii.html",
    "locus": "John 1:14",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 1,
    "start": 15,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.vii.iv.html",
    "locus": "John 1:15-18",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 1,
    "start": 19,
    "end": 23,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.vii.v.html",
    "locus": "John 1:19-23",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 1,
    "start": 24,
    "end": 28,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.vii.vi.html",
    "locus": "John 1:24-28",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 1,
    "start": 29,
    "end": 34,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.vii.vii.html",
    "locus": "John 1:29-34",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 1,
    "start": 35,
    "end": 39,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.vii.viii.html",
    "locus": "John 1:35-39",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 1,
    "start": 40,
    "end": 42,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.vii.ix.html",
    "locus": "John 1:40-42",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 1,
    "start": 43,
    "end": 46,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.vii.x.html",
    "locus": "John 1:43-46",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 1,
    "start": 47,
    "end": 51,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.vii.xi.html",
    "locus": "John 1:47-51",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 2,
    "start": 1,
    "end": 11,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.viii.i.html",
    "locus": "John 2:1-11",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 2,
    "start": 12,
    "end": 17,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.viii.ii.html",
    "locus": "John 2:12-17",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 2,
    "start": 18,
    "end": 22,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.viii.iii.html",
    "locus": "John 2:18-22",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 2,
    "start": 23,
    "end": 25,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.viii.iv.html",
    "locus": "John 2:23-25",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 3,
    "start": 1,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.ix.i.html",
    "locus": "John 3:1-6",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 3,
    "start": 7,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.ix.ii.html",
    "locus": "John 3:7-12",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 3,
    "start": 13,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.ix.iii.html",
    "locus": "John 3:13-18",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 3,
    "start": 19,
    "end": 21,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.ix.iv.html",
    "locus": "John 3:19-21",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 3,
    "start": 22,
    "end": 28,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.ix.v.html",
    "locus": "John 3:22-28",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 3,
    "start": 29,
    "end": 34,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.ix.vi.html",
    "locus": "John 3:29-34",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 3,
    "start": 35,
    "end": 36,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.ix.vii.html",
    "locus": "John 3:35-36",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 4,
    "start": 1,
    "end": 9,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.x.i.html",
    "locus": "John 4:1-9",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 4,
    "start": 10,
    "end": 15,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.x.ii.html",
    "locus": "John 4:10-15",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 4,
    "start": 16,
    "end": 21,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.x.iii.html",
    "locus": "John 4:16-21",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 4,
    "start": 22,
    "end": 26,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.x.iv.html",
    "locus": "John 4:22-26",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 4,
    "start": 27,
    "end": 34,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.x.v.html",
    "locus": "John 4:27-34",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 4,
    "start": 35,
    "end": 38,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.x.vi.html",
    "locus": "John 4:35-38",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 4,
    "start": 39,
    "end": 45,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.x.vii.html",
    "locus": "John 4:39-45",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 4,
    "start": 46,
    "end": 54,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.x.viii.html",
    "locus": "John 4:46-54",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 5,
    "start": 1,
    "end": 9,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xi.i.html",
    "locus": "John 5:1-9",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 5,
    "start": 10,
    "end": 15,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xi.ii.html",
    "locus": "John 5:10-15",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 5,
    "start": 17,
    "end": 19,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xi.iii.html",
    "locus": "John 5:17-19",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 5,
    "start": 20,
    "end": 24,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xi.iv.html",
    "locus": "John 5:20-24",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 5,
    "start": 25,
    "end": 29,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xi.v.html",
    "locus": "John 5:25-29",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 5,
    "start": 30,
    "end": 32,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xi.vi.html",
    "locus": "John 5:30-32",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 5,
    "start": 33,
    "end": 36,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xi.vii.html",
    "locus": "John 5:33-36",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 5,
    "start": 37,
    "end": 40,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xi.viii.html",
    "locus": "John 5:37-40",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 5,
    "start": 41,
    "end": 47,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xi.ix.html",
    "locus": "John 5:41-47",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 6,
    "start": 1,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xii.i.html",
    "locus": "John 6:1-13",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 6,
    "start": 14,
    "end": 21,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xii.ii.html",
    "locus": "John 6:14-21",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 6,
    "start": 22,
    "end": 25,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xii.iii.html",
    "locus": "John 6:22-25",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 6,
    "start": 26,
    "end": 29,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xii.iv.html",
    "locus": "John 6:26-29",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 6,
    "start": 30,
    "end": 33,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xii.v.html",
    "locus": "John 6:30-33",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 6,
    "start": 34,
    "end": 40,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xii.vi.html",
    "locus": "John 6:34-40",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 6,
    "start": 41,
    "end": 45,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xii.vii.html",
    "locus": "John 6:41-45",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 6,
    "start": 46,
    "end": 51,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xii.viii.html",
    "locus": "John 6:46-51",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 6,
    "start": 52,
    "end": 58,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xii.ix.html",
    "locus": "John 6:52-58",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 6,
    "start": 59,
    "end": 64,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xii.x.html",
    "locus": "John 6:59-64",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 6,
    "start": 65,
    "end": 71,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xii.xi.html",
    "locus": "John 6:65-71",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 7,
    "start": 1,
    "end": 8,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xiii.i.html",
    "locus": "John 7:1-8",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 7,
    "start": 9,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xiii.ii.html",
    "locus": "John 7:9-13",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 7,
    "start": 14,
    "end": 19,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xiii.iii.html",
    "locus": "John 7:14-19",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 7,
    "start": 20,
    "end": 24,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xiii.iv.html",
    "locus": "John 7:20-24",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 7,
    "start": 25,
    "end": 30,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xiii.v.html",
    "locus": "John 7:25-30",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 7,
    "start": 31,
    "end": 36,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xiii.vi.html",
    "locus": "John 7:31-36",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 7,
    "start": 37,
    "end": 39,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xiii.vii.html",
    "locus": "John 7:37-39",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 7,
    "start": 40,
    "end": 44,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xiii.viii.html",
    "locus": "John 7:40-44",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 7,
    "start": 45,
    "end": 53,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xiii.ix.html",
    "locus": "John 7:45-53",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 8,
    "start": 1,
    "end": 11,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xiv.i.html",
    "locus": "John 8:1-11",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 8,
    "start": 12,
    "end": 14,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xiv.ii.html",
    "locus": "John 8:12-14",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 8,
    "start": 15,
    "end": 20,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xiv.iii.html",
    "locus": "John 8:15-20",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 8,
    "start": 21,
    "end": 24,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xiv.iv.html",
    "locus": "John 8:21-24",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 8,
    "start": 25,
    "end": 29,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xiv.v.html",
    "locus": "John 8:25-29",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 8,
    "start": 30,
    "end": 38,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xiv.vi.html",
    "locus": "John 8:30-38",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 8,
    "start": 39,
    "end": 42,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xiv.vii.html",
    "locus": "John 8:39-42",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 8,
    "start": 43,
    "end": 45,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xiv.viii.html",
    "locus": "John 8:43-45",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 8,
    "start": 46,
    "end": 50,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xiv.ix.html",
    "locus": "John 8:46-50",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 8,
    "start": 51,
    "end": 55,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xiv.x.html",
    "locus": "John 8:51-55",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 8,
    "start": 56,
    "end": 59,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xiv.xi.html",
    "locus": "John 8:56-59",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 9,
    "start": 1,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xv.i.html",
    "locus": "John 9:1-5",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 9,
    "start": 6,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xv.ii.html",
    "locus": "John 9:6-12",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 9,
    "start": 13,
    "end": 17,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xv.iii.html",
    "locus": "John 9:13-17",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 9,
    "start": 18,
    "end": 23,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xv.iv.html",
    "locus": "John 9:18-23",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 9,
    "start": 24,
    "end": 33,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xv.v.html",
    "locus": "John 9:24-33",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 9,
    "start": 34,
    "end": 41,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xv.vi.html",
    "locus": "John 9:34-41",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 10,
    "start": 1,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xvi.i.html",
    "locus": "John 10:1-6",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 10,
    "start": 7,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xvi.ii.html",
    "locus": "John 10:7-10",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 10,
    "start": 11,
    "end": 15,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xvi.iii.html",
    "locus": "John 10:11-15",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 10,
    "start": 16,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xvi.iv.html",
    "locus": "John 10:16-18",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 10,
    "start": 19,
    "end": 30,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xvi.v.html",
    "locus": "John 10:19-30",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 10,
    "start": 31,
    "end": 36,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xvi.vi.html",
    "locus": "John 10:31-36",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 10,
    "start": 37,
    "end": 42,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xvi.vii.html",
    "locus": "John 10:37-42",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 11,
    "start": 1,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xvii.i.html",
    "locus": "John 11:1-10",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 11,
    "start": 11,
    "end": 17,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xvii.ii.html",
    "locus": "John 11:11-17",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 11,
    "start": 18,
    "end": 27,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xvii.iii.html",
    "locus": "John 11:18-27",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 11,
    "start": 28,
    "end": 38,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xvii.iv.html",
    "locus": "John 11:28-38",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 11,
    "start": 39,
    "end": 44,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xvii.v.html",
    "locus": "John 11:39-44",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 11,
    "start": 45,
    "end": 52,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xvii.vi.html",
    "locus": "John 11:45-52",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 11,
    "start": 53,
    "end": 57,
    "url": "https://ccel.org/ccel/calvin/calcom34/calcom34.xvii.vii.html",
    "locus": "John 11:53-57",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 12,
    "start": 1,
    "end": 8,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.ii.i.html",
    "locus": "John 12:1-8",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 12,
    "start": 9,
    "end": 15,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.ii.ii.html",
    "locus": "John 12:9-15",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 12,
    "start": 16,
    "end": 19,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.ii.iii.html",
    "locus": "John 12:16-19",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 12,
    "start": 20,
    "end": 26,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.ii.iv.html",
    "locus": "John 12:20-26",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 12,
    "start": 27,
    "end": 33,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.ii.v.html",
    "locus": "John 12:27-33",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 12,
    "start": 34,
    "end": 36,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.ii.vi.html",
    "locus": "John 12:34-36",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 12,
    "start": 37,
    "end": 41,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.ii.vii.html",
    "locus": "John 12:37-41",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 12,
    "start": 42,
    "end": 46,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.ii.viii.html",
    "locus": "John 12:42-46",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 12,
    "start": 47,
    "end": 50,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.ii.ix.html",
    "locus": "John 12:47-50",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 13,
    "start": 1,
    "end": 7,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.iii.i.html",
    "locus": "John 13:1-7",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 13,
    "start": 8,
    "end": 11,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.iii.ii.html",
    "locus": "John 13:8-11",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 13,
    "start": 12,
    "end": 17,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.iii.iii.html",
    "locus": "John 13:12-17",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 13,
    "start": 18,
    "end": 20,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.iii.iv.html",
    "locus": "John 13:18-20",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 13,
    "start": 21,
    "end": 29,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.iii.v.html",
    "locus": "John 13:21-29",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 13,
    "start": 30,
    "end": 35,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.iii.vi.html",
    "locus": "John 13:30-35",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 13,
    "start": 36,
    "end": 38,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.iii.vii.html",
    "locus": "John 13:36-38",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 14,
    "start": 1,
    "end": 7,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.iv.i.html",
    "locus": "John 14:1-7",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 14,
    "start": 8,
    "end": 14,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.iv.ii.html",
    "locus": "John 14:8-14",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 14,
    "start": 15,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.iv.iii.html",
    "locus": "John 14:15-18",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 14,
    "start": 19,
    "end": 20,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.iv.iv.html",
    "locus": "John 14:19-20",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 14,
    "start": 21,
    "end": 24,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.iv.v.html",
    "locus": "John 14:21-24",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 14,
    "start": 25,
    "end": 28,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.iv.vi.html",
    "locus": "John 14:25-28",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 14,
    "start": 29,
    "end": 31,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.iv.vii.html",
    "locus": "John 14:29-31",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 15,
    "start": 1,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.v.i.html",
    "locus": "John 15:1-6",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 15,
    "start": 7,
    "end": 11,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.v.ii.html",
    "locus": "John 15:7-11",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 15,
    "start": 12,
    "end": 15,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.v.iii.html",
    "locus": "John 15:12-15",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 15,
    "start": 16,
    "end": 21,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.v.iv.html",
    "locus": "John 15:16-21",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 15,
    "start": 22,
    "end": 27,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.v.v.html",
    "locus": "John 15:22-27",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 16,
    "start": 1,
    "end": 7,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.vi.i.html",
    "locus": "John 16:1-7",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 16,
    "start": 8,
    "end": 15,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.vi.ii.html",
    "locus": "John 16:8-15",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 16,
    "start": 16,
    "end": 20,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.vi.iii.html",
    "locus": "John 16:16-20",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 16,
    "start": 21,
    "end": 24,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.vi.iv.html",
    "locus": "John 16:21-24",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 16,
    "start": 25,
    "end": 28,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.vi.v.html",
    "locus": "John 16:25-28",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 16,
    "start": 29,
    "end": 33,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.vi.vi.html",
    "locus": "John 16:29-33",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 17,
    "start": 1,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.vii.i.html",
    "locus": "John 17:1-5",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 17,
    "start": 6,
    "end": 11,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.vii.ii.html",
    "locus": "John 17:6-11",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 17,
    "start": 12,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.vii.iii.html",
    "locus": "John 17:12-13",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 17,
    "start": 14,
    "end": 19,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.vii.iv.html",
    "locus": "John 17:14-19",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 17,
    "start": 20,
    "end": 23,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.vii.v.html",
    "locus": "John 17:20-23",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 17,
    "start": 24,
    "end": 26,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.vii.vi.html",
    "locus": "John 17:24-26",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 18,
    "start": 1,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.viii.i.html",
    "locus": "John 18:1-6",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 18,
    "start": 7,
    "end": 9,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.viii.ii.html",
    "locus": "John 18:7-9",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 18,
    "start": 10,
    "end": 14,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.viii.iii.html",
    "locus": "John 18:10-14",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 18,
    "start": 15,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.viii.iv.html",
    "locus": "John 18:15-18",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 18,
    "start": 19,
    "end": 24,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.viii.v.html",
    "locus": "John 18:19-24",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 18,
    "start": 25,
    "end": 27,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.viii.vi.html",
    "locus": "John 18:25-27",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 18,
    "start": 28,
    "end": 32,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.viii.vii.html",
    "locus": "John 18:28-32",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 18,
    "start": 33,
    "end": 36,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.viii.viii.html",
    "locus": "John 18:33-36",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 18,
    "start": 37,
    "end": 40,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.viii.ix.html",
    "locus": "John 18:37-40",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 19,
    "start": 1,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.ix.i.html",
    "locus": "John 19:1-6",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 19,
    "start": 7,
    "end": 11,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.ix.ii.html",
    "locus": "John 19:7-11",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 19,
    "start": 12,
    "end": 16,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.ix.iii.html",
    "locus": "John 19:12-16",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 19,
    "start": 17,
    "end": 22,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.ix.iv.html",
    "locus": "John 19:17-22",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 19,
    "start": 23,
    "end": 24,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.ix.v.html",
    "locus": "John 19:23-24",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 19,
    "start": 25,
    "end": 27,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.ix.vi.html",
    "locus": "John 19:25-27",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 19,
    "start": 28,
    "end": 30,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.ix.vii.html",
    "locus": "John 19:28-30",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 19,
    "start": 31,
    "end": 37,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.ix.viii.html",
    "locus": "John 19:31-37",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 19,
    "start": 38,
    "end": 42,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.ix.ix.html",
    "locus": "John 19:38-42",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 20,
    "start": 1,
    "end": 9,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.x.i.html",
    "locus": "John 20:1-9",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 20,
    "start": 10,
    "end": 15,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.x.ii.html",
    "locus": "John 20:10-15",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 20,
    "start": 16,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.x.iii.html",
    "locus": "John 20:16-18",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 20,
    "start": 19,
    "end": 23,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.x.iv.html",
    "locus": "John 20:19-23",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 20,
    "start": 24,
    "end": 29,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.x.v.html",
    "locus": "John 20:24-29",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 20,
    "start": 30,
    "end": 31,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.x.vi.html",
    "locus": "John 20:30-31",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 21,
    "start": 1,
    "end": 14,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.xi.i.html",
    "locus": "John 21:1-14",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 21,
    "start": 15,
    "end": 19,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.xi.ii.html",
    "locus": "John 21:15-19",
    "parallels": []
  },
  {
    "book": "JHN",
    "chapter": 21,
    "start": 20,
    "end": 25,
    "url": "https://ccel.org/ccel/calvin/calcom35/calcom35.xi.iii.html",
    "locus": "John 21:20-25",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 1,
    "start": 1,
    "end": 2,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.viii.i.html",
    "locus": "Acts 1:1-2",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 1,
    "start": 3,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.viii.ii.html",
    "locus": "Acts 1:3-5",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 1,
    "start": 6,
    "end": 8,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.viii.iii.html",
    "locus": "Acts 1:6-8",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 1,
    "start": 9,
    "end": 11,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.viii.iv.html",
    "locus": "Acts 1:9-11",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 1,
    "start": 12,
    "end": 14,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.viii.v.html",
    "locus": "Acts 1:12-14",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 1,
    "start": 15,
    "end": 22,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.viii.vi.html",
    "locus": "Acts 1:15-22",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 1,
    "start": 23,
    "end": 26,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.viii.vii.html",
    "locus": "Acts 1:23-26",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 2,
    "start": 1,
    "end": 4,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.ix.i.html",
    "locus": "Acts 2:1-4",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 2,
    "start": 14,
    "end": 21,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.ix.iii.html",
    "locus": "Acts 2:14-21",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 2,
    "start": 22,
    "end": 24,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.ix.iv.html",
    "locus": "Acts 2:22-24",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 2,
    "start": 25,
    "end": 31,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.ix.v.html",
    "locus": "Acts 2:25-31",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 2,
    "start": 32,
    "end": 36,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.ix.vi.html",
    "locus": "Acts 2:32-36",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 2,
    "start": 37,
    "end": 39,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.ix.vii.html",
    "locus": "Acts 2:37-39",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 2,
    "start": 40,
    "end": 42,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.ix.viii.html",
    "locus": "Acts 2:40-42",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 2,
    "start": 43,
    "end": 45,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.ix.ix.html",
    "locus": "Acts 2:43-45",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 2,
    "start": 46,
    "end": 47,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.ix.x.html",
    "locus": "Acts 2:46-47",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 3,
    "start": 1,
    "end": 11,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.x.i.html",
    "locus": "Acts 3:1-11",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 3,
    "start": 12,
    "end": 16,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.x.ii.html",
    "locus": "Acts 3:12-16",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 3,
    "start": 17,
    "end": 21,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.x.iii.html",
    "locus": "Acts 3:17-21",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 3,
    "start": 22,
    "end": 24,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.x.iv.html",
    "locus": "Acts 3:22-24",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 3,
    "start": 25,
    "end": 26,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.x.v.html",
    "locus": "Acts 3:25-26",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 4,
    "start": 1,
    "end": 4,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xi.i.html",
    "locus": "Acts 4:1-4",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 4,
    "start": 13,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xi.iii.html",
    "locus": "Acts 4:13-18",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 4,
    "start": 19,
    "end": 23,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xi.iv.html",
    "locus": "Acts 4:19-23",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 4,
    "start": 24,
    "end": 31,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xi.v.html",
    "locus": "Acts 4:24-31",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 4,
    "start": 32,
    "end": 37,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xi.vi.html",
    "locus": "Acts 4:32-37",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 5,
    "start": 1,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xii.i.html",
    "locus": "Acts 5:1-6",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 5,
    "start": 7,
    "end": 11,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xii.ii.html",
    "locus": "Acts 5:7-11",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 5,
    "start": 12,
    "end": 16,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xii.iii.html",
    "locus": "Acts 5:12-16",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 5,
    "start": 17,
    "end": 26,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xii.iv.html",
    "locus": "Acts 5:17-26",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 5,
    "start": 27,
    "end": 28,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xii.v.html",
    "locus": "Acts 5:27-28",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 5,
    "start": 29,
    "end": 33,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xii.vi.html",
    "locus": "Acts 5:29-33",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 5,
    "start": 34,
    "end": 39,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xii.vii.html",
    "locus": "Acts 5:34-39",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 5,
    "start": 40,
    "end": 42,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xii.viii.html",
    "locus": "Acts 5:40-42",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 6,
    "start": 1,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xiii.i.html",
    "locus": "Acts 6:1-6",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 6,
    "start": 7,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xiii.ii.html",
    "locus": "Acts 6:7-10",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 6,
    "start": 11,
    "end": 15,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xiii.iii.html",
    "locus": "Acts 6:11-15",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 7,
    "start": 1,
    "end": 4,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xiv.i.html",
    "locus": "Acts 7:1-4",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 7,
    "start": 9,
    "end": 16,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xiv.iii.html",
    "locus": "Acts 7:9-16",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 7,
    "start": 17,
    "end": 19,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xiv.iv.html",
    "locus": "Acts 7:17-19",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 7,
    "start": 20,
    "end": 29,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xiv.v.html",
    "locus": "Acts 7:20-29",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 7,
    "start": 30,
    "end": 34,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xiv.vi.html",
    "locus": "Acts 7:30-34",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 7,
    "start": 35,
    "end": 37,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xiv.vii.html",
    "locus": "Acts 7:35-37",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 7,
    "start": 38,
    "end": 41,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xiv.viii.html",
    "locus": "Acts 7:38-41",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 7,
    "start": 42,
    "end": 43,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xiv.ix.html",
    "locus": "Acts 7:42-43",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 7,
    "start": 44,
    "end": 50,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xiv.x.html",
    "locus": "Acts 7:44-50",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 7,
    "start": 54,
    "end": 58,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xiv.xii.html",
    "locus": "Acts 7:54-58",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 7,
    "start": 58,
    "end": 61,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xiv.xiii.html",
    "locus": "Acts 7:58-61",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 8,
    "start": 1,
    "end": 4,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xv.i.html",
    "locus": "Acts 8:1-4",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 8,
    "start": 5,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xv.ii.html",
    "locus": "Acts 8:5-13",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 8,
    "start": 14,
    "end": 17,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xv.iii.html",
    "locus": "Acts 8:14-17",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 8,
    "start": 18,
    "end": 25,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xv.iv.html",
    "locus": "Acts 8:18-25",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 8,
    "start": 26,
    "end": 31,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xv.v.html",
    "locus": "Acts 8:26-31",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 8,
    "start": 32,
    "end": 35,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xv.vi.html",
    "locus": "Acts 8:32-35",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 8,
    "start": 36,
    "end": 40,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xv.vii.html",
    "locus": "Acts 8:36-40",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 9,
    "start": 1,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xvi.i.html",
    "locus": "Acts 9:1-5",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 9,
    "start": 6,
    "end": 9,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xvi.ii.html",
    "locus": "Acts 9:6-9",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 9,
    "start": 10,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xvi.iii.html",
    "locus": "Acts 9:10-12",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 9,
    "start": 13,
    "end": 16,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xvi.iv.html",
    "locus": "Acts 9:13-16",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 9,
    "start": 17,
    "end": 19,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xvi.v.html",
    "locus": "Acts 9:17-19",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 9,
    "start": 19,
    "end": 25,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xvi.vi.html",
    "locus": "Acts 9:19-25",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 9,
    "start": 26,
    "end": 31,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xvi.vii.html",
    "locus": "Acts 9:26-31",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 9,
    "start": 32,
    "end": 35,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xvi.viii.html",
    "locus": "Acts 9:32-35",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 9,
    "start": 36,
    "end": 38,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xvi.ix.html",
    "locus": "Acts 9:36-38",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 9,
    "start": 39,
    "end": 43,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xvi.x.html",
    "locus": "Acts 9:39-43",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 10,
    "start": 1,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xvii.i.html",
    "locus": "Acts 10:1-6",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 10,
    "start": 7,
    "end": 16,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xvii.ii.html",
    "locus": "Acts 10:7-16",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 10,
    "start": 17,
    "end": 23,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xvii.iii.html",
    "locus": "Acts 10:17-23",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 10,
    "start": 23,
    "end": 29,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xvii.iv.html",
    "locus": "Acts 10:23-29",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 10,
    "start": 30,
    "end": 33,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xvii.v.html",
    "locus": "Acts 10:30-33",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 10,
    "start": 34,
    "end": 38,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xvii.vi.html",
    "locus": "Acts 10:34-38",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 10,
    "start": 39,
    "end": 43,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xvii.vii.html",
    "locus": "Acts 10:39-43",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 10,
    "start": 44,
    "end": 48,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xvii.viii.html",
    "locus": "Acts 10:44-48",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 11,
    "start": 1,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xviii.i.html",
    "locus": "Acts 11:1-18",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 11,
    "start": 19,
    "end": 24,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xviii.ii.html",
    "locus": "Acts 11:19-24",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 11,
    "start": 25,
    "end": 26,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xviii.iii.html",
    "locus": "Acts 11:25-26",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 11,
    "start": 27,
    "end": 30,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xviii.iv.html",
    "locus": "Acts 11:27-30",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 12,
    "start": 1,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xix.i.html",
    "locus": "Acts 12:1-5",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 12,
    "start": 6,
    "end": 11,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xix.ii.html",
    "locus": "Acts 12:6-11",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 12,
    "start": 12,
    "end": 19,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xix.iii.html",
    "locus": "Acts 12:12-19",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 12,
    "start": 19,
    "end": 25,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xix.iv.html",
    "locus": "Acts 12:19-25",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 13,
    "start": 1,
    "end": 3,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xx.i.html",
    "locus": "Acts 13:1-3",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 13,
    "start": 4,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xx.ii.html",
    "locus": "Acts 13:4-12",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 13,
    "start": 13,
    "end": 15,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xx.iii.html",
    "locus": "Acts 13:13-15",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 13,
    "start": 16,
    "end": 23,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xx.iv.html",
    "locus": "Acts 13:16-23",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 13,
    "start": 24,
    "end": 26,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xx.v.html",
    "locus": "Acts 13:24-26",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 13,
    "start": 27,
    "end": 31,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xx.vi.html",
    "locus": "Acts 13:27-31",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 13,
    "start": 32,
    "end": 37,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xx.vii.html",
    "locus": "Acts 13:32-37",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 13,
    "start": 38,
    "end": 42,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xx.viii.html",
    "locus": "Acts 13:38-42",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 13,
    "start": 42,
    "end": 45,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xx.ix.html",
    "locus": "Acts 13:42-45",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 13,
    "start": 46,
    "end": 52,
    "url": "https://ccel.org/ccel/calvin/calcom36/calcom36.xx.x.html",
    "locus": "Acts 13:46-52",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 14,
    "start": 1,
    "end": 4,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.ii.i.html",
    "locus": "Acts 14:1-4",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 14,
    "start": 5,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.ii.ii.html",
    "locus": "Acts 14:5-10",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 14,
    "start": 11,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.ii.iii.html",
    "locus": "Acts 14:11-13",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 14,
    "start": 14,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.ii.iv.html",
    "locus": "Acts 14:14-18",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 14,
    "start": 19,
    "end": 22,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.ii.v.html",
    "locus": "Acts 14:19-22",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 14,
    "start": 23,
    "end": 28,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.ii.vi.html",
    "locus": "Acts 14:23-28",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 15,
    "start": 1,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.iii.i.html",
    "locus": "Acts 15:1-5",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 15,
    "start": 6,
    "end": 11,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.iii.ii.html",
    "locus": "Acts 15:6-11",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 15,
    "start": 12,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.iii.iii.html",
    "locus": "Acts 15:12-18",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 15,
    "start": 19,
    "end": 21,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.iii.iv.html",
    "locus": "Acts 15:19-21",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 15,
    "start": 22,
    "end": 29,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.iii.v.html",
    "locus": "Acts 15:22-29",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 15,
    "start": 30,
    "end": 35,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.iii.vi.html",
    "locus": "Acts 15:30-35",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 15,
    "start": 36,
    "end": 41,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.iii.vii.html",
    "locus": "Acts 15:36-41",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 16,
    "start": 1,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.iv.i.html",
    "locus": "Acts 16:1-5",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 16,
    "start": 6,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.iv.ii.html",
    "locus": "Acts 16:6-10",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 16,
    "start": 11,
    "end": 15,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.iv.iii.html",
    "locus": "Acts 16:11-15",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 16,
    "start": 16,
    "end": 22,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.iv.iv.html",
    "locus": "Acts 16:16-22",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 16,
    "start": 23,
    "end": 28,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.iv.v.html",
    "locus": "Acts 16:23-28",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 16,
    "start": 29,
    "end": 34,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.iv.vi.html",
    "locus": "Acts 16:29-34",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 16,
    "start": 35,
    "end": 40,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.iv.vii.html",
    "locus": "Acts 16:35-40",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 17,
    "start": 1,
    "end": 4,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.v.i.html",
    "locus": "Acts 17:1-4",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 17,
    "start": 5,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.v.ii.html",
    "locus": "Acts 17:5-10",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 17,
    "start": 11,
    "end": 15,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.v.iii.html",
    "locus": "Acts 17:11-15",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 17,
    "start": 16,
    "end": 21,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.v.iv.html",
    "locus": "Acts 17:16-21",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 17,
    "start": 22,
    "end": 25,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.v.v.html",
    "locus": "Acts 17:22-25",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 17,
    "start": 26,
    "end": 29,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.v.vi.html",
    "locus": "Acts 17:26-29",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 17,
    "start": 30,
    "end": 34,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.v.vii.html",
    "locus": "Acts 17:30-34",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 18,
    "start": 1,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.vi.i.html",
    "locus": "Acts 18:1-5",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 18,
    "start": 6,
    "end": 11,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.vi.ii.html",
    "locus": "Acts 18:6-11",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 18,
    "start": 12,
    "end": 17,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.vi.iii.html",
    "locus": "Acts 18:12-17",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 18,
    "start": 18,
    "end": 23,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.vi.iv.html",
    "locus": "Acts 18:18-23",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 18,
    "start": 24,
    "end": 28,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.vi.v.html",
    "locus": "Acts 18:24-28",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 19,
    "start": 1,
    "end": 7,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.vii.i.html",
    "locus": "Acts 19:1-7",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 19,
    "start": 8,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.vii.ii.html",
    "locus": "Acts 19:8-12",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 19,
    "start": 13,
    "end": 17,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.vii.iii.html",
    "locus": "Acts 19:13-17",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 19,
    "start": 18,
    "end": 22,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.vii.iv.html",
    "locus": "Acts 19:18-22",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 19,
    "start": 23,
    "end": 28,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.vii.v.html",
    "locus": "Acts 19:23-28",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 19,
    "start": 29,
    "end": 34,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.vii.vi.html",
    "locus": "Acts 19:29-34",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 19,
    "start": 35,
    "end": 40,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.vii.vii.html",
    "locus": "Acts 19:35-40",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 20,
    "start": 1,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.viii.i.html",
    "locus": "Acts 20:1-6",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 20,
    "start": 7,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.viii.ii.html",
    "locus": "Acts 20:7-13",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 20,
    "start": 14,
    "end": 21,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.viii.iii.html",
    "locus": "Acts 20:14-21",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 20,
    "start": 22,
    "end": 27,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.viii.iv.html",
    "locus": "Acts 20:22-27",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 20,
    "start": 28,
    "end": 32,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.viii.v.html",
    "locus": "Acts 20:28-32",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 20,
    "start": 33,
    "end": 38,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.viii.vi.html",
    "locus": "Acts 20:33-38",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 21,
    "start": 1,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.ix.i.html",
    "locus": "Acts 21:1-6",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 21,
    "start": 7,
    "end": 14,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.ix.ii.html",
    "locus": "Acts 21:7-14",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 21,
    "start": 15,
    "end": 25,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.ix.iii.html",
    "locus": "Acts 21:15-25",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 21,
    "start": 26,
    "end": 30,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.ix.iv.html",
    "locus": "Acts 21:26-30",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 21,
    "start": 31,
    "end": 40,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.ix.v.html",
    "locus": "Acts 21:31-40",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 22,
    "start": 1,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.x.i.html",
    "locus": "Acts 22:1-5",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 22,
    "start": 6,
    "end": 11,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.x.ii.html",
    "locus": "Acts 22:6-11",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 22,
    "start": 12,
    "end": 15,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.x.iii.html",
    "locus": "Acts 22:12-15",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 22,
    "start": 17,
    "end": 22,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.x.iv.html",
    "locus": "Acts 22:17-22",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 22,
    "start": 23,
    "end": 30,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.x.v.html",
    "locus": "Acts 22:23-30",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 23,
    "start": 1,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.xi.i.html",
    "locus": "Acts 23:1-5",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 23,
    "start": 6,
    "end": 9,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.xi.ii.html",
    "locus": "Acts 23:6-9",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 23,
    "start": 10,
    "end": 16,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.xi.iii.html",
    "locus": "Acts 23:10-16",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 23,
    "start": 17,
    "end": 24,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.xi.iv.html",
    "locus": "Acts 23:17-24",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 23,
    "start": 25,
    "end": 35,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.xi.v.html",
    "locus": "Acts 23:25-35",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 24,
    "start": 1,
    "end": 9,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.xii.i.html",
    "locus": "Acts 24:1-9",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 24,
    "start": 10,
    "end": 21,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.xii.ii.html",
    "locus": "Acts 24:10-21",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 24,
    "start": 22,
    "end": 27,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.xii.iii.html",
    "locus": "Acts 24:22-27",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 25,
    "start": 1,
    "end": 8,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.xiii.i.html",
    "locus": "Acts 25:1-8",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 25,
    "start": 9,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.xiii.ii.html",
    "locus": "Acts 25:9-12",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 25,
    "start": 13,
    "end": 21,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.xiii.iii.html",
    "locus": "Acts 25:13-21",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 25,
    "start": 22,
    "end": 27,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.xiii.iv.html",
    "locus": "Acts 25:22-27",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 26,
    "start": 1,
    "end": 8,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.xiv.i.html",
    "locus": "Acts 26:1-8",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 26,
    "start": 9,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.xiv.ii.html",
    "locus": "Acts 26:9-18",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 26,
    "start": 19,
    "end": 23,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.xiv.iii.html",
    "locus": "Acts 26:19-23",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 26,
    "start": 24,
    "end": 32,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.xiv.iv.html",
    "locus": "Acts 26:24-32",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 27,
    "start": 1,
    "end": 8,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.xv.i.html",
    "locus": "Acts 27:1-8",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 27,
    "start": 9,
    "end": 20,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.xv.ii.html",
    "locus": "Acts 27:9-20",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 27,
    "start": 21,
    "end": 32,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.xv.iii.html",
    "locus": "Acts 27:21-32",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 27,
    "start": 33,
    "end": 44,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.xv.iv.html",
    "locus": "Acts 27:33-44",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 28,
    "start": 1,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.xvi.i.html",
    "locus": "Acts 28:1-6",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 28,
    "start": 7,
    "end": 14,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.xvi.ii.html",
    "locus": "Acts 28:7-14",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 28,
    "start": 15,
    "end": 20,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.xvi.iii.html",
    "locus": "Acts 28:15-20",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 28,
    "start": 21,
    "end": 24,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.xvi.iv.html",
    "locus": "Acts 28:21-24",
    "parallels": []
  },
  {
    "book": "ACT",
    "chapter": 28,
    "start": 25,
    "end": 31,
    "url": "https://ccel.org/ccel/calvin/calcom37/calcom37.xvi.v.html",
    "locus": "Acts 28:25-31",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 1,
    "start": 1,
    "end": 7,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.v.i.html",
    "locus": "Romans 1:1-7",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 1,
    "start": 1,
    "end": 1,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.v.ii.html",
    "locus": "Romans 1:1",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 1,
    "start": 8,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.v.iii.html",
    "locus": "Romans 1:8-12",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 1,
    "start": 13,
    "end": 15,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.v.iv.html",
    "locus": "Romans 1:13-15",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 1,
    "start": 16,
    "end": 17,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.v.v.html",
    "locus": "Romans 1:16-17",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 1,
    "start": 18,
    "end": 23,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.v.vi.html",
    "locus": "Romans 1:18-23",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 1,
    "start": 24,
    "end": 32,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.v.vii.html",
    "locus": "Romans 1:24-32",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 2,
    "start": 1,
    "end": 2,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.vi.i.html",
    "locus": "Romans 2:1-2",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 2,
    "start": 3,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.vi.ii.html",
    "locus": "Romans 2:3-10",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 2,
    "start": 11,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.vi.iii.html",
    "locus": "Romans 2:11-13",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 2,
    "start": 14,
    "end": 16,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.vi.iv.html",
    "locus": "Romans 2:14-16",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 2,
    "start": 17,
    "end": 24,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.vi.v.html",
    "locus": "Romans 2:17-24",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 2,
    "start": 25,
    "end": 29,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.vi.vi.html",
    "locus": "Romans 2:25-29",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 3,
    "start": 1,
    "end": 2,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.vii.i.html",
    "locus": "Romans 3:1-2",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 3,
    "start": 3,
    "end": 4,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.vii.ii.html",
    "locus": "Romans 3:3-4",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 3,
    "start": 5,
    "end": 8,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.vii.iii.html",
    "locus": "Romans 3:5-8",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 3,
    "start": 9,
    "end": 9,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.vii.iv.html",
    "locus": "Romans 3:9",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 3,
    "start": 10,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.vii.v.html",
    "locus": "Romans 3:10-18",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 3,
    "start": 19,
    "end": 20,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.vii.vi.html",
    "locus": "Romans 3:19-20",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 3,
    "start": 21,
    "end": 22,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.vii.vii.html",
    "locus": "Romans 3:21-22",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 3,
    "start": 23,
    "end": 26,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.vii.viii.html",
    "locus": "Romans 3:23-26",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 3,
    "start": 27,
    "end": 28,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.vii.ix.html",
    "locus": "Romans 3:27-28",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 3,
    "start": 29,
    "end": 30,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.vii.x.html",
    "locus": "Romans 3:29-30",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 3,
    "start": 31,
    "end": 31,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.vii.xi.html",
    "locus": "Romans 3:31",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 4,
    "start": 1,
    "end": 3,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.viii.i.html",
    "locus": "Romans 4:1-3",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 4,
    "start": 4,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.viii.ii.html",
    "locus": "Romans 4:4-5",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 4,
    "start": 6,
    "end": 8,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.viii.iii.html",
    "locus": "Romans 4:6-8",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 4,
    "start": 9,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.viii.iv.html",
    "locus": "Romans 4:9-10",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 4,
    "start": 11,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.viii.v.html",
    "locus": "Romans 4:11-12",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 4,
    "start": 13,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.viii.vi.html",
    "locus": "Romans 4:13",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 4,
    "start": 14,
    "end": 15,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.viii.vii.html",
    "locus": "Romans 4:14-15",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 4,
    "start": 16,
    "end": 17,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.viii.viii.html",
    "locus": "Romans 4:16-17",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 4,
    "start": 18,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.viii.ix.html",
    "locus": "Romans 4:18",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 4,
    "start": 19,
    "end": 22,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.viii.x.html",
    "locus": "Romans 4:19-22",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 4,
    "start": 23,
    "end": 25,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.viii.xi.html",
    "locus": "Romans 4:23-25",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 5,
    "start": 1,
    "end": 2,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.ix.i.html",
    "locus": "Romans 5:1-2",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 5,
    "start": 3,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.ix.ii.html",
    "locus": "Romans 5:3-5",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 5,
    "start": 6,
    "end": 9,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.ix.iii.html",
    "locus": "Romans 5:6-9",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 5,
    "start": 10,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.ix.iv.html",
    "locus": "Romans 5:10",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 5,
    "start": 11,
    "end": 11,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.ix.v.html",
    "locus": "Romans 5:11",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 5,
    "start": 12,
    "end": 14,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.ix.vi.html",
    "locus": "Romans 5:12-14",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 5,
    "start": 15,
    "end": 15,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.ix.vii.html",
    "locus": "Romans 5:15",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 5,
    "start": 16,
    "end": 16,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.ix.viii.html",
    "locus": "Romans 5:16",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 5,
    "start": 17,
    "end": 17,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.ix.ix.html",
    "locus": "Romans 5:17",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 5,
    "start": 18,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.ix.x.html",
    "locus": "Romans 5:18",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 5,
    "start": 19,
    "end": 19,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.ix.xi.html",
    "locus": "Romans 5:19",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 5,
    "start": 20,
    "end": 21,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.ix.xii.html",
    "locus": "Romans 5:20-21",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 6,
    "start": 1,
    "end": 2,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.x.i.html",
    "locus": "Romans 6:1-2",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 6,
    "start": 3,
    "end": 4,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.x.ii.html",
    "locus": "Romans 6:3-4",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 6,
    "start": 5,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.x.iii.html",
    "locus": "Romans 6:5-6",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 6,
    "start": 7,
    "end": 11,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.x.iv.html",
    "locus": "Romans 6:7-11",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 6,
    "start": 12,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.x.v.html",
    "locus": "Romans 6:12-13",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 6,
    "start": 14,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.x.vi.html",
    "locus": "Romans 6:14-18",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 6,
    "start": 19,
    "end": 19,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.x.vii.html",
    "locus": "Romans 6:19",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 6,
    "start": 20,
    "end": 23,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.x.viii.html",
    "locus": "Romans 6:20-23",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 7,
    "start": 1,
    "end": 4,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xi.i.html",
    "locus": "Romans 7:1-4",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 7,
    "start": 5,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xi.ii.html",
    "locus": "Romans 7:5-6",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 7,
    "start": 7,
    "end": 8,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xi.iii.html",
    "locus": "Romans 7:7-8",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 7,
    "start": 8,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xi.iv.html",
    "locus": "Romans 7:8-12",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 7,
    "start": 13,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xi.v.html",
    "locus": "Romans 7:13",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 7,
    "start": 14,
    "end": 17,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xi.vi.html",
    "locus": "Romans 7:14-17",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 7,
    "start": 18,
    "end": 20,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xi.vii.html",
    "locus": "Romans 7:18-20",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 7,
    "start": 21,
    "end": 23,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xi.viii.html",
    "locus": "Romans 7:21-23",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 7,
    "start": 24,
    "end": 25,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xi.ix.html",
    "locus": "Romans 7:24-25",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 8,
    "start": 1,
    "end": 4,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xii.i.html",
    "locus": "Romans 8:1-4",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 8,
    "start": 5,
    "end": 8,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xii.ii.html",
    "locus": "Romans 8:5-8",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 8,
    "start": 9,
    "end": 11,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xii.iii.html",
    "locus": "Romans 8:9-11",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 8,
    "start": 12,
    "end": 14,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xii.iv.html",
    "locus": "Romans 8:12-14",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 8,
    "start": 15,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xii.v.html",
    "locus": "Romans 8:15-18",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 8,
    "start": 19,
    "end": 22,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xii.vi.html",
    "locus": "Romans 8:19-22",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 8,
    "start": 23,
    "end": 25,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xii.vii.html",
    "locus": "Romans 8:23-25",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 8,
    "start": 26,
    "end": 27,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xii.viii.html",
    "locus": "Romans 8:26-27",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 8,
    "start": 28,
    "end": 30,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xii.ix.html",
    "locus": "Romans 8:28-30",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 8,
    "start": 31,
    "end": 34,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xii.x.html",
    "locus": "Romans 8:31-34",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 8,
    "start": 35,
    "end": 37,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xii.xi.html",
    "locus": "Romans 8:35-37",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 8,
    "start": 38,
    "end": 39,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xii.xii.html",
    "locus": "Romans 8:38-39",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 9,
    "start": 1,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xiii.i.html",
    "locus": "Romans 9:1-5",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 9,
    "start": 6,
    "end": 9,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xiii.ii.html",
    "locus": "Romans 9:6-9",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 9,
    "start": 10,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xiii.iii.html",
    "locus": "Romans 9:10-13",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 9,
    "start": 14,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xiii.iv.html",
    "locus": "Romans 9:14-18",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 9,
    "start": 19,
    "end": 21,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xiii.v.html",
    "locus": "Romans 9:19-21",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 9,
    "start": 22,
    "end": 23,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xiii.vi.html",
    "locus": "Romans 9:22-23",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 9,
    "start": 24,
    "end": 29,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xiii.vii.html",
    "locus": "Romans 9:24-29",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 9,
    "start": 30,
    "end": 33,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xiii.viii.html",
    "locus": "Romans 9:30-33",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 10,
    "start": 1,
    "end": 4,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xiv.i.html",
    "locus": "Romans 10:1-4",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 10,
    "start": 5,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xiv.ii.html",
    "locus": "Romans 10:5-10",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 10,
    "start": 11,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xiv.iii.html",
    "locus": "Romans 10:11-13",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 10,
    "start": 14,
    "end": 17,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xiv.iv.html",
    "locus": "Romans 10:14-17",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 10,
    "start": 18,
    "end": 21,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xiv.v.html",
    "locus": "Romans 10:18-21",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 11,
    "start": 1,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xv.i.html",
    "locus": "Romans 11:1-6",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 11,
    "start": 7,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xv.ii.html",
    "locus": "Romans 11:7-10",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 11,
    "start": 11,
    "end": 15,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xv.iii.html",
    "locus": "Romans 11:11-15",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 11,
    "start": 16,
    "end": 21,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xv.iv.html",
    "locus": "Romans 11:16-21",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 11,
    "start": 22,
    "end": 24,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xv.v.html",
    "locus": "Romans 11:22-24",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 11,
    "start": 25,
    "end": 27,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xv.vi.html",
    "locus": "Romans 11:25-27",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 11,
    "start": 28,
    "end": 32,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xv.vii.html",
    "locus": "Romans 11:28-32",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 11,
    "start": 33,
    "end": 36,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xv.viii.html",
    "locus": "Romans 11:33-36",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 12,
    "start": 1,
    "end": 2,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xvi.i.html",
    "locus": "Romans 12:1-2",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 12,
    "start": 3,
    "end": 3,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xvi.ii.html",
    "locus": "Romans 12:3",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 12,
    "start": 4,
    "end": 8,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xvi.iii.html",
    "locus": "Romans 12:4-8",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 12,
    "start": 9,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xvi.iv.html",
    "locus": "Romans 12:9-13",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 12,
    "start": 14,
    "end": 16,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xvi.v.html",
    "locus": "Romans 12:14-16",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 12,
    "start": 17,
    "end": 19,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xvi.vi.html",
    "locus": "Romans 12:17-19",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 12,
    "start": 20,
    "end": 21,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xvi.vii.html",
    "locus": "Romans 12:20-21",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 13,
    "start": 1,
    "end": 2,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xvii.i.html",
    "locus": "Romans 13:1-2",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 13,
    "start": 3,
    "end": 4,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xvii.ii.html",
    "locus": "Romans 13:3-4",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 13,
    "start": 5,
    "end": 7,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xvii.iii.html",
    "locus": "Romans 13:5-7",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 13,
    "start": 8,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xvii.iv.html",
    "locus": "Romans 13:8-10",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 13,
    "start": 11,
    "end": 14,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xvii.v.html",
    "locus": "Romans 13:11-14",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 14,
    "start": 1,
    "end": 4,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xviii.i.html",
    "locus": "Romans 14:1-4",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 14,
    "start": 5,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xviii.ii.html",
    "locus": "Romans 14:5-6",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 14,
    "start": 7,
    "end": 9,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xviii.iii.html",
    "locus": "Romans 14:7-9",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 14,
    "start": 10,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xviii.iv.html",
    "locus": "Romans 14:10-13",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 14,
    "start": 14,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xviii.v.html",
    "locus": "Romans 14:14-18",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 14,
    "start": 19,
    "end": 21,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xviii.vi.html",
    "locus": "Romans 14:19-21",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 14,
    "start": 22,
    "end": 23,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xviii.vii.html",
    "locus": "Romans 14:22-23",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 15,
    "start": 1,
    "end": 3,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xix.i.html",
    "locus": "Romans 15:1-3",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 15,
    "start": 4,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xix.ii.html",
    "locus": "Romans 15:4-6",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 15,
    "start": 7,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xix.iii.html",
    "locus": "Romans 15:7-12",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 15,
    "start": 13,
    "end": 16,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xix.iv.html",
    "locus": "Romans 15:13-16",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 15,
    "start": 17,
    "end": 21,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xix.v.html",
    "locus": "Romans 15:17-21",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 15,
    "start": 22,
    "end": 24,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xix.vi.html",
    "locus": "Romans 15:22-24",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 15,
    "start": 25,
    "end": 29,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xix.vii.html",
    "locus": "Romans 15:25-29",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 15,
    "start": 30,
    "end": 33,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xix.viii.html",
    "locus": "Romans 15:30-33",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 16,
    "start": 1,
    "end": 16,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xx.i.html",
    "locus": "Romans 16:1-16",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 16,
    "start": 17,
    "end": 20,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xx.ii.html",
    "locus": "Romans 16:17-20",
    "parallels": []
  },
  {
    "book": "ROM",
    "chapter": 16,
    "start": 21,
    "end": 27,
    "url": "https://ccel.org/ccel/calvin/calcom38/calcom38.xx.iii.html",
    "locus": "Romans 16:21-27",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 1,
    "start": 1,
    "end": 3,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.viii.i.html",
    "locus": "1 Corinthians 1:1-3",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 1,
    "start": 4,
    "end": 9,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.viii.ii.html",
    "locus": "1 Corinthians 1:4-9",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 1,
    "start": 10,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.viii.iii.html",
    "locus": "1 Corinthians 1:10-13",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 1,
    "start": 14,
    "end": 20,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.viii.iv.html",
    "locus": "1 Corinthians 1:14-20",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 1,
    "start": 21,
    "end": 25,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.viii.v.html",
    "locus": "1 Corinthians 1:21-25",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 1,
    "start": 26,
    "end": 31,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.viii.vi.html",
    "locus": "1 Corinthians 1:26-31",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 2,
    "start": 1,
    "end": 2,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.ix.i.html",
    "locus": "1 Corinthians 2:1-2",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 2,
    "start": 3,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.ix.ii.html",
    "locus": "1 Corinthians 2:3-5",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 2,
    "start": 6,
    "end": 9,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.ix.iii.html",
    "locus": "1 Corinthians 2:6-9",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 2,
    "start": 10,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.ix.iv.html",
    "locus": "1 Corinthians 2:10-13",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 2,
    "start": 14,
    "end": 16,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.ix.v.html",
    "locus": "1 Corinthians 2:14-16",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 3,
    "start": 1,
    "end": 4,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.x.i.html",
    "locus": "1 Corinthians 3:1-4",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 3,
    "start": 5,
    "end": 9,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.x.ii.html",
    "locus": "1 Corinthians 3:5-9",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 3,
    "start": 10,
    "end": 15,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.x.iii.html",
    "locus": "1 Corinthians 3:10-15",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 3,
    "start": 16,
    "end": 23,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.x.iv.html",
    "locus": "1 Corinthians 3:16-23",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 4,
    "start": 1,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xi.i.html",
    "locus": "1 Corinthians 4:1-5",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 4,
    "start": 6,
    "end": 8,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xi.ii.html",
    "locus": "1 Corinthians 4:6-8",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 4,
    "start": 9,
    "end": 15,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xi.iii.html",
    "locus": "1 Corinthians 4:9-15",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 4,
    "start": 16,
    "end": 21,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xi.iv.html",
    "locus": "1 Corinthians 4:16-21",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 5,
    "start": 1,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xii.i.html",
    "locus": "1 Corinthians 5:1-5",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 5,
    "start": 6,
    "end": 8,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xii.ii.html",
    "locus": "1 Corinthians 5:6-8",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 5,
    "start": 9,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xii.iii.html",
    "locus": "1 Corinthians 5:9-13",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 6,
    "start": 1,
    "end": 8,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xiii.i.html",
    "locus": "1 Corinthians 6:1-8",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 6,
    "start": 9,
    "end": 11,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xiii.ii.html",
    "locus": "1 Corinthians 6:9-11",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 6,
    "start": 12,
    "end": 20,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xiii.iii.html",
    "locus": "1 Corinthians 6:12-20",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 7,
    "start": 1,
    "end": 2,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xiv.i.html",
    "locus": "1 Corinthians 7:1-2",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 7,
    "start": 3,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xiv.ii.html",
    "locus": "1 Corinthians 7:3-5",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 7,
    "start": 6,
    "end": 9,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xiv.iii.html",
    "locus": "1 Corinthians 7:6-9",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 7,
    "start": 10,
    "end": 17,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xiv.iv.html",
    "locus": "1 Corinthians 7:10-17",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 7,
    "start": 18,
    "end": 24,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xiv.v.html",
    "locus": "1 Corinthians 7:18-24",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 7,
    "start": 25,
    "end": 28,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xiv.vi.html",
    "locus": "1 Corinthians 7:25-28",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 7,
    "start": 29,
    "end": 35,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xiv.vii.html",
    "locus": "1 Corinthians 7:29-35",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 7,
    "start": 36,
    "end": 38,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xiv.viii.html",
    "locus": "1 Corinthians 7:36-38",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 7,
    "start": 39,
    "end": 40,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xiv.ix.html",
    "locus": "1 Corinthians 7:39-40",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 8,
    "start": 1,
    "end": 7,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xv.i.html",
    "locus": "1 Corinthians 8:1-7",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 8,
    "start": 8,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xv.ii.html",
    "locus": "1 Corinthians 8:8-13",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 9,
    "start": 1,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xvi.i.html",
    "locus": "1 Corinthians 9:1-12",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 9,
    "start": 13,
    "end": 22,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xvi.ii.html",
    "locus": "1 Corinthians 9:13-22",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 9,
    "start": 23,
    "end": 27,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xvi.iii.html",
    "locus": "1 Corinthians 9:23-27",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 10,
    "start": 1,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xvii.i.html",
    "locus": "1 Corinthians 10:1-5",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 10,
    "start": 6,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xvii.ii.html",
    "locus": "1 Corinthians 10:6-12",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 10,
    "start": 13,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xvii.iii.html",
    "locus": "1 Corinthians 10:13-18",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 10,
    "start": 19,
    "end": 24,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xvii.iv.html",
    "locus": "1 Corinthians 10:19-24",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 10,
    "start": 25,
    "end": 33,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xvii.v.html",
    "locus": "1 Corinthians 10:25-33",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 11,
    "start": 1,
    "end": 16,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xviii.i.html",
    "locus": "1 Corinthians 11:1-16",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 11,
    "start": 17,
    "end": 22,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xviii.ii.html",
    "locus": "1 Corinthians 11:17-22",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 11,
    "start": 23,
    "end": 29,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xviii.iii.html",
    "locus": "1 Corinthians 11:23-29",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 11,
    "start": 30,
    "end": 34,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xviii.iv.html",
    "locus": "1 Corinthians 11:30-34",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 12,
    "start": 1,
    "end": 7,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xix.i.html",
    "locus": "1 Corinthians 12:1-7",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 12,
    "start": 8,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xix.ii.html",
    "locus": "1 Corinthians 12:8-13",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 12,
    "start": 14,
    "end": 27,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xix.iii.html",
    "locus": "1 Corinthians 12:14-27",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 12,
    "start": 28,
    "end": 31,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xix.iv.html",
    "locus": "1 Corinthians 12:28-31",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 13,
    "start": 1,
    "end": 3,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xx.i.html",
    "locus": "1 Corinthians 13:1-3",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 13,
    "start": 4,
    "end": 8,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xx.ii.html",
    "locus": "1 Corinthians 13:4-8",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 13,
    "start": 9,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xx.iii.html",
    "locus": "1 Corinthians 13:9-13",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 14,
    "start": 1,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xxi.i.html",
    "locus": "1 Corinthians 14:1-6",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 14,
    "start": 7,
    "end": 17,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xxi.ii.html",
    "locus": "1 Corinthians 14:7-17",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 14,
    "start": 18,
    "end": 25,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xxi.iii.html",
    "locus": "1 Corinthians 14:18-25",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 14,
    "start": 26,
    "end": 33,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xxi.iv.html",
    "locus": "1 Corinthians 14:26-33",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 14,
    "start": 34,
    "end": 40,
    "url": "https://ccel.org/ccel/calvin/calcom39/calcom39.xxi.v.html",
    "locus": "1 Corinthians 14:34-40",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 15,
    "start": 1,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.i.i.html",
    "locus": "1 Corinthians 15:1-10",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 15,
    "start": 11,
    "end": 19,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.i.ii.html",
    "locus": "1 Corinthians 15:11-19",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 15,
    "start": 20,
    "end": 28,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.i.iii.html",
    "locus": "1 Corinthians 15:20-28",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 15,
    "start": 29,
    "end": 34,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.i.iv.html",
    "locus": "1 Corinthians 15:29-34",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 15,
    "start": 35,
    "end": 50,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.i.v.html",
    "locus": "1 Corinthians 15:35-50",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 15,
    "start": 51,
    "end": 58,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.i.vi.html",
    "locus": "1 Corinthians 15:51-58",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 16,
    "start": 1,
    "end": 7,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.ii.i.html",
    "locus": "1 Corinthians 16:1-7",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 16,
    "start": 8,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.ii.ii.html",
    "locus": "1 Corinthians 16:8-12",
    "parallels": []
  },
  {
    "book": "1CO",
    "chapter": 16,
    "start": 13,
    "end": 24,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.ii.iii.html",
    "locus": "1 Corinthians 16:13-24",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 1,
    "start": 1,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.vii.i.html",
    "locus": "2 Corinthians 1:1-5",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 1,
    "start": 6,
    "end": 11,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.vii.ii.html",
    "locus": "2 Corinthians 1:6-11",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 1,
    "start": 12,
    "end": 14,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.vii.iii.html",
    "locus": "2 Corinthians 1:12-14",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 1,
    "start": 15,
    "end": 20,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.vii.iv.html",
    "locus": "2 Corinthians 1:15-20",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 1,
    "start": 21,
    "end": 22,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.vii.v.html",
    "locus": "2 Corinthians 1:21-22",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 2,
    "start": 1,
    "end": 1,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.viii.i.html",
    "locus": "2 Corinthians 2:1",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 2,
    "start": 3,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.viii.ii.html",
    "locus": "2 Corinthians 2:3-5",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 2,
    "start": 6,
    "end": 11,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.viii.iii.html",
    "locus": "2 Corinthians 2:6-11",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 2,
    "start": 12,
    "end": 17,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.viii.iv.html",
    "locus": "2 Corinthians 2:12-17",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 3,
    "start": 1,
    "end": 3,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.ix.i.html",
    "locus": "2 Corinthians 3:1-3",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 3,
    "start": 4,
    "end": 11,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.ix.ii.html",
    "locus": "2 Corinthians 3:4-11",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 3,
    "start": 12,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.ix.iii.html",
    "locus": "2 Corinthians 3:12-18",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 4,
    "start": 1,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.x.i.html",
    "locus": "2 Corinthians 4:1-6",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 4,
    "start": 7,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.x.ii.html",
    "locus": "2 Corinthians 4:7-12",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 4,
    "start": 13,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.x.iii.html",
    "locus": "2 Corinthians 4:13-18",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 5,
    "start": 1,
    "end": 8,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.xi.i.html",
    "locus": "2 Corinthians 5:1-8",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 5,
    "start": 9,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.xi.ii.html",
    "locus": "2 Corinthians 5:9-12",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 5,
    "start": 13,
    "end": 17,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.xi.iii.html",
    "locus": "2 Corinthians 5:13-17",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 5,
    "start": 18,
    "end": 21,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.xi.iv.html",
    "locus": "2 Corinthians 5:18-21",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 6,
    "start": 1,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.xii.i.html",
    "locus": "2 Corinthians 6:1-10",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 6,
    "start": 11,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.xii.ii.html",
    "locus": "2 Corinthians 6:11-18",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 7,
    "start": 1,
    "end": 1,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.xiii.i.html",
    "locus": "2 Corinthians 7:1",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 7,
    "start": 2,
    "end": 7,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.xiii.ii.html",
    "locus": "2 Corinthians 7:2-7",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 7,
    "start": 8,
    "end": 11,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.xiii.iii.html",
    "locus": "2 Corinthians 7:8-11",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 7,
    "start": 11,
    "end": 16,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.xiii.iv.html",
    "locus": "2 Corinthians 7:11-16",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 8,
    "start": 1,
    "end": 7,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.xiv.i.html",
    "locus": "2 Corinthians 8:1-7",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 8,
    "start": 8,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.xiv.ii.html",
    "locus": "2 Corinthians 8:8-12",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 8,
    "start": 13,
    "end": 17,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.xiv.iii.html",
    "locus": "2 Corinthians 8:13-17",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 8,
    "start": 18,
    "end": 24,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.xiv.iv.html",
    "locus": "2 Corinthians 8:18-24",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 9,
    "start": 1,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.xv.i.html",
    "locus": "2 Corinthians 9:1-5",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 9,
    "start": 6,
    "end": 9,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.xv.ii.html",
    "locus": "2 Corinthians 9:6-9",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 9,
    "start": 10,
    "end": 15,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.xv.iii.html",
    "locus": "2 Corinthians 9:10-15",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 10,
    "start": 1,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.xvi.i.html",
    "locus": "2 Corinthians 10:1-6",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 10,
    "start": 7,
    "end": 11,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.xvi.ii.html",
    "locus": "2 Corinthians 10:7-11",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 10,
    "start": 12,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.xvi.iii.html",
    "locus": "2 Corinthians 10:12-18",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 11,
    "start": 1,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.xvii.i.html",
    "locus": "2 Corinthians 11:1-6",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 11,
    "start": 7,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.xvii.ii.html",
    "locus": "2 Corinthians 11:7-12",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 11,
    "start": 13,
    "end": 15,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.xvii.iii.html",
    "locus": "2 Corinthians 11:13-15",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 11,
    "start": 16,
    "end": 21,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.xvii.iv.html",
    "locus": "2 Corinthians 11:16-21",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 11,
    "start": 22,
    "end": 29,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.xvii.v.html",
    "locus": "2 Corinthians 11:22-29",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 11,
    "start": 30,
    "end": 33,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.xvii.vi.html",
    "locus": "2 Corinthians 11:30-33",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 12,
    "start": 1,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.xviii.i.html",
    "locus": "2 Corinthians 12:1-5",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 12,
    "start": 6,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.xviii.ii.html",
    "locus": "2 Corinthians 12:6-10",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 12,
    "start": 11,
    "end": 15,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.xviii.iii.html",
    "locus": "2 Corinthians 12:11-15",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 12,
    "start": 16,
    "end": 21,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.xviii.iv.html",
    "locus": "2 Corinthians 12:16-21",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 13,
    "start": 1,
    "end": 4,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.xix.i.html",
    "locus": "2 Corinthians 13:1-4",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 13,
    "start": 5,
    "end": 9,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.xix.ii.html",
    "locus": "2 Corinthians 13:5-9",
    "parallels": []
  },
  {
    "book": "2CO",
    "chapter": 13,
    "start": 10,
    "end": 14,
    "url": "https://ccel.org/ccel/calvin/calcom40/calcom40.xix.iii.html",
    "locus": "2 Corinthians 13:10-14",
    "parallels": []
  },
  {
    "book": "GAL",
    "chapter": 1,
    "start": 1,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iii.iii.i.html",
    "locus": "Galatians 1:1-5",
    "parallels": []
  },
  {
    "book": "GAL",
    "chapter": 1,
    "start": 6,
    "end": 9,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iii.iii.ii.html",
    "locus": "Galatians 1:6-9",
    "parallels": []
  },
  {
    "book": "GAL",
    "chapter": 1,
    "start": 10,
    "end": 14,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iii.iii.iii.html",
    "locus": "Galatians 1:10-14",
    "parallels": []
  },
  {
    "book": "GAL",
    "chapter": 1,
    "start": 15,
    "end": 24,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iii.iii.iv.html",
    "locus": "Galatians 1:15-24",
    "parallels": []
  },
  {
    "book": "GAL",
    "chapter": 2,
    "start": 1,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iii.iv.i.html",
    "locus": "Galatians 2:1-5",
    "parallels": []
  },
  {
    "book": "GAL",
    "chapter": 2,
    "start": 6,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iii.iv.ii.html",
    "locus": "Galatians 2:6-10",
    "parallels": []
  },
  {
    "book": "GAL",
    "chapter": 2,
    "start": 11,
    "end": 16,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iii.iv.iii.html",
    "locus": "Galatians 2:11-16",
    "parallels": []
  },
  {
    "book": "GAL",
    "chapter": 2,
    "start": 17,
    "end": 21,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iii.iv.iv.html",
    "locus": "Galatians 2:17-21",
    "parallels": []
  },
  {
    "book": "GAL",
    "chapter": 3,
    "start": 1,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iii.v.i.html",
    "locus": "Galatians 3:1-5",
    "parallels": []
  },
  {
    "book": "GAL",
    "chapter": 3,
    "start": 6,
    "end": 9,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iii.v.ii.html",
    "locus": "Galatians 3:6-9",
    "parallels": []
  },
  {
    "book": "GAL",
    "chapter": 3,
    "start": 10,
    "end": 14,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iii.v.iii.html",
    "locus": "Galatians 3:10-14",
    "parallels": []
  },
  {
    "book": "GAL",
    "chapter": 3,
    "start": 15,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iii.v.iv.html",
    "locus": "Galatians 3:15-18",
    "parallels": []
  },
  {
    "book": "GAL",
    "chapter": 3,
    "start": 19,
    "end": 22,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iii.v.v.html",
    "locus": "Galatians 3:19-22",
    "parallels": []
  },
  {
    "book": "GAL",
    "chapter": 3,
    "start": 23,
    "end": 29,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iii.v.vi.html",
    "locus": "Galatians 3:23-29",
    "parallels": []
  },
  {
    "book": "GAL",
    "chapter": 4,
    "start": 1,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iii.vi.i.html",
    "locus": "Galatians 4:1-5",
    "parallels": []
  },
  {
    "book": "GAL",
    "chapter": 4,
    "start": 6,
    "end": 11,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iii.vi.ii.html",
    "locus": "Galatians 4:6-11",
    "parallels": []
  },
  {
    "book": "GAL",
    "chapter": 4,
    "start": 12,
    "end": 20,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iii.vi.iii.html",
    "locus": "Galatians 4:12-20",
    "parallels": []
  },
  {
    "book": "GAL",
    "chapter": 4,
    "start": 21,
    "end": 26,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iii.vi.iv.html",
    "locus": "Galatians 4:21-26",
    "parallels": []
  },
  {
    "book": "GAL",
    "chapter": 4,
    "start": 27,
    "end": 31,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iii.vi.v.html",
    "locus": "Galatians 4:27-31",
    "parallels": []
  },
  {
    "book": "GAL",
    "chapter": 5,
    "start": 1,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iii.vii.i.html",
    "locus": "Galatians 5:1-6",
    "parallels": []
  },
  {
    "book": "GAL",
    "chapter": 5,
    "start": 7,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iii.vii.ii.html",
    "locus": "Galatians 5:7-12",
    "parallels": []
  },
  {
    "book": "GAL",
    "chapter": 5,
    "start": 13,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iii.vii.iii.html",
    "locus": "Galatians 5:13-18",
    "parallels": []
  },
  {
    "book": "GAL",
    "chapter": 5,
    "start": 19,
    "end": 21,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iii.vii.iv.html",
    "locus": "Galatians 5:19-21",
    "parallels": []
  },
  {
    "book": "GAL",
    "chapter": 5,
    "start": 22,
    "end": 26,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iii.vii.v.html",
    "locus": "Galatians 5:22-26",
    "parallels": []
  },
  {
    "book": "GAL",
    "chapter": 6,
    "start": 1,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iii.viii.i.html",
    "locus": "Galatians 6:1-5",
    "parallels": []
  },
  {
    "book": "GAL",
    "chapter": 6,
    "start": 6,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iii.viii.ii.html",
    "locus": "Galatians 6:6-10",
    "parallels": []
  },
  {
    "book": "GAL",
    "chapter": 6,
    "start": 11,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iii.viii.iii.html",
    "locus": "Galatians 6:11-13",
    "parallels": []
  },
  {
    "book": "GAL",
    "chapter": 6,
    "start": 14,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iii.viii.iv.html",
    "locus": "Galatians 6:14-18",
    "parallels": []
  },
  {
    "book": "EPH",
    "chapter": 1,
    "start": 1,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iv.ii.i.html",
    "locus": "Ephesians 1:1-6",
    "parallels": []
  },
  {
    "book": "EPH",
    "chapter": 1,
    "start": 7,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iv.ii.ii.html",
    "locus": "Ephesians 1:7-12",
    "parallels": []
  },
  {
    "book": "EPH",
    "chapter": 1,
    "start": 13,
    "end": 14,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iv.ii.iii.html",
    "locus": "Ephesians 1:13-14",
    "parallels": []
  },
  {
    "book": "EPH",
    "chapter": 1,
    "start": 15,
    "end": 19,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iv.ii.iv.html",
    "locus": "Ephesians 1:15-19",
    "parallels": []
  },
  {
    "book": "EPH",
    "chapter": 1,
    "start": 20,
    "end": 23,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iv.ii.v.html",
    "locus": "Ephesians 1:20-23",
    "parallels": []
  },
  {
    "book": "EPH",
    "chapter": 2,
    "start": 1,
    "end": 3,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iv.iii.i.html",
    "locus": "Ephesians 2:1-3",
    "parallels": []
  },
  {
    "book": "EPH",
    "chapter": 2,
    "start": 4,
    "end": 7,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iv.iii.ii.html",
    "locus": "Ephesians 2:4-7",
    "parallels": []
  },
  {
    "book": "EPH",
    "chapter": 2,
    "start": 8,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iv.iii.iii.html",
    "locus": "Ephesians 2:8-10",
    "parallels": []
  },
  {
    "book": "EPH",
    "chapter": 2,
    "start": 11,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iv.iii.iv.html",
    "locus": "Ephesians 2:11-13",
    "parallels": []
  },
  {
    "book": "EPH",
    "chapter": 2,
    "start": 14,
    "end": 16,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iv.iii.v.html",
    "locus": "Ephesians 2:14-16",
    "parallels": []
  },
  {
    "book": "EPH",
    "chapter": 2,
    "start": 17,
    "end": 22,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iv.iii.vi.html",
    "locus": "Ephesians 2:17-22",
    "parallels": []
  },
  {
    "book": "EPH",
    "chapter": 3,
    "start": 1,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iv.iv.i.html",
    "locus": "Ephesians 3:1-6",
    "parallels": []
  },
  {
    "book": "EPH",
    "chapter": 3,
    "start": 7,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iv.iv.ii.html",
    "locus": "Ephesians 3:7-13",
    "parallels": []
  },
  {
    "book": "EPH",
    "chapter": 3,
    "start": 14,
    "end": 19,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iv.iv.iii.html",
    "locus": "Ephesians 3:14-19",
    "parallels": []
  },
  {
    "book": "EPH",
    "chapter": 3,
    "start": 20,
    "end": 21,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iv.iv.iv.html",
    "locus": "Ephesians 3:20-21",
    "parallels": []
  },
  {
    "book": "EPH",
    "chapter": 4,
    "start": 1,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iv.v.i.html",
    "locus": "Ephesians 4:1-6",
    "parallels": []
  },
  {
    "book": "EPH",
    "chapter": 4,
    "start": 7,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iv.v.ii.html",
    "locus": "Ephesians 4:7-10",
    "parallels": []
  },
  {
    "book": "EPH",
    "chapter": 4,
    "start": 11,
    "end": 14,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iv.v.iii.html",
    "locus": "Ephesians 4:11-14",
    "parallels": []
  },
  {
    "book": "EPH",
    "chapter": 4,
    "start": 15,
    "end": 16,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iv.v.iv.html",
    "locus": "Ephesians 4:15-16",
    "parallels": []
  },
  {
    "book": "EPH",
    "chapter": 4,
    "start": 17,
    "end": 19,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iv.v.v.html",
    "locus": "Ephesians 4:17-19",
    "parallels": []
  },
  {
    "book": "EPH",
    "chapter": 4,
    "start": 20,
    "end": 24,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iv.v.vi.html",
    "locus": "Ephesians 4:20-24",
    "parallels": []
  },
  {
    "book": "EPH",
    "chapter": 4,
    "start": 25,
    "end": 28,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iv.v.vii.html",
    "locus": "Ephesians 4:25-28",
    "parallels": []
  },
  {
    "book": "EPH",
    "chapter": 4,
    "start": 29,
    "end": 31,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iv.v.viii.html",
    "locus": "Ephesians 4:29-31",
    "parallels": []
  },
  {
    "book": "EPH",
    "chapter": 4,
    "start": 32,
    "end": 32,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iv.v.ix.html",
    "locus": "Ephesians 4:32",
    "parallels": []
  },
  {
    "book": "EPH",
    "chapter": 5,
    "start": 1,
    "end": 2,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iv.vi.i.html",
    "locus": "Ephesians 5:1-2",
    "parallels": []
  },
  {
    "book": "EPH",
    "chapter": 5,
    "start": 8,
    "end": 14,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iv.vi.iii.html",
    "locus": "Ephesians 5:8-14",
    "parallels": []
  },
  {
    "book": "EPH",
    "chapter": 5,
    "start": 15,
    "end": 20,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iv.vi.iv.html",
    "locus": "Ephesians 5:15-20",
    "parallels": []
  },
  {
    "book": "EPH",
    "chapter": 5,
    "start": 21,
    "end": 27,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iv.vi.v.html",
    "locus": "Ephesians 5:21-27",
    "parallels": []
  },
  {
    "book": "EPH",
    "chapter": 5,
    "start": 28,
    "end": 33,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iv.vi.vi.html",
    "locus": "Ephesians 5:28-33",
    "parallels": []
  },
  {
    "book": "EPH",
    "chapter": 6,
    "start": 1,
    "end": 4,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iv.vii.i.html",
    "locus": "Ephesians 6:1-4",
    "parallels": []
  },
  {
    "book": "EPH",
    "chapter": 6,
    "start": 5,
    "end": 9,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iv.vii.ii.html",
    "locus": "Ephesians 6:5-9",
    "parallels": []
  },
  {
    "book": "EPH",
    "chapter": 6,
    "start": 10,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iv.vii.iii.html",
    "locus": "Ephesians 6:10-13",
    "parallels": []
  },
  {
    "book": "EPH",
    "chapter": 6,
    "start": 14,
    "end": 20,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iv.vii.iv.html",
    "locus": "Ephesians 6:14-20",
    "parallels": []
  },
  {
    "book": "EPH",
    "chapter": 6,
    "start": 21,
    "end": 24,
    "url": "https://ccel.org/ccel/calvin/calcom41/calcom41.iv.vii.v.html",
    "locus": "Ephesians 6:21-24",
    "parallels": []
  },
  {
    "book": "PHP",
    "chapter": 1,
    "start": 1,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.iv.ii.i.html",
    "locus": "Philippians 1:1-6",
    "parallels": []
  },
  {
    "book": "PHP",
    "chapter": 1,
    "start": 7,
    "end": 11,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.iv.ii.ii.html",
    "locus": "Philippians 1:7-11",
    "parallels": []
  },
  {
    "book": "PHP",
    "chapter": 1,
    "start": 12,
    "end": 17,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.iv.ii.iii.html",
    "locus": "Philippians 1:12-17",
    "parallels": []
  },
  {
    "book": "PHP",
    "chapter": 1,
    "start": 18,
    "end": 21,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.iv.ii.iv.html",
    "locus": "Philippians 1:18-21",
    "parallels": []
  },
  {
    "book": "PHP",
    "chapter": 1,
    "start": 22,
    "end": 26,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.iv.ii.v.html",
    "locus": "Philippians 1:22-26",
    "parallels": []
  },
  {
    "book": "PHP",
    "chapter": 1,
    "start": 27,
    "end": 30,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.iv.ii.vi.html",
    "locus": "Philippians 1:27-30",
    "parallels": []
  },
  {
    "book": "PHP",
    "chapter": 2,
    "start": 5,
    "end": 11,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.iv.iii.ii.html",
    "locus": "Philippians 2:5-11",
    "parallels": []
  },
  {
    "book": "PHP",
    "chapter": 2,
    "start": 12,
    "end": 16,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.iv.iii.iii.html",
    "locus": "Philippians 2:12-16",
    "parallels": []
  },
  {
    "book": "PHP",
    "chapter": 2,
    "start": 17,
    "end": 24,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.iv.iii.iv.html",
    "locus": "Philippians 2:17-24",
    "parallels": []
  },
  {
    "book": "PHP",
    "chapter": 2,
    "start": 25,
    "end": 30,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.iv.iii.v.html",
    "locus": "Philippians 2:25-30",
    "parallels": []
  },
  {
    "book": "PHP",
    "chapter": 3,
    "start": 1,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.iv.iv.i.html",
    "locus": "Philippians 3:1-6",
    "parallels": []
  },
  {
    "book": "PHP",
    "chapter": 3,
    "start": 7,
    "end": 11,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.iv.iv.ii.html",
    "locus": "Philippians 3:7-11",
    "parallels": []
  },
  {
    "book": "PHP",
    "chapter": 3,
    "start": 12,
    "end": 17,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.iv.iv.iii.html",
    "locus": "Philippians 3:12-17",
    "parallels": []
  },
  {
    "book": "PHP",
    "chapter": 3,
    "start": 18,
    "end": 21,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.iv.iv.iv.html",
    "locus": "Philippians 3:18-21",
    "parallels": []
  },
  {
    "book": "PHP",
    "chapter": 4,
    "start": 1,
    "end": 3,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.iv.v.i.html",
    "locus": "Philippians 4:1-3",
    "parallels": []
  },
  {
    "book": "PHP",
    "chapter": 4,
    "start": 4,
    "end": 9,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.iv.v.ii.html",
    "locus": "Philippians 4:4-9",
    "parallels": []
  },
  {
    "book": "PHP",
    "chapter": 4,
    "start": 10,
    "end": 14,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.iv.v.iii.html",
    "locus": "Philippians 4:10-14",
    "parallels": []
  },
  {
    "book": "PHP",
    "chapter": 4,
    "start": 15,
    "end": 23,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.iv.v.iv.html",
    "locus": "Philippians 4:15-23",
    "parallels": []
  },
  {
    "book": "COL",
    "chapter": 1,
    "start": 1,
    "end": 8,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.v.ii.i.html",
    "locus": "Colossians 1:1-8",
    "parallels": []
  },
  {
    "book": "COL",
    "chapter": 1,
    "start": 9,
    "end": 11,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.v.ii.ii.html",
    "locus": "Colossians 1:9-11",
    "parallels": []
  },
  {
    "book": "COL",
    "chapter": 1,
    "start": 12,
    "end": 17,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.v.ii.iii.html",
    "locus": "Colossians 1:12-17",
    "parallels": []
  },
  {
    "book": "COL",
    "chapter": 1,
    "start": 18,
    "end": 20,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.v.ii.iv.html",
    "locus": "Colossians 1:18-20",
    "parallels": []
  },
  {
    "book": "COL",
    "chapter": 1,
    "start": 21,
    "end": 23,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.v.ii.v.html",
    "locus": "Colossians 1:21-23",
    "parallels": []
  },
  {
    "book": "COL",
    "chapter": 1,
    "start": 24,
    "end": 29,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.v.ii.vi.html",
    "locus": "Colossians 1:24-29",
    "parallels": []
  },
  {
    "book": "COL",
    "chapter": 2,
    "start": 1,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.v.iii.i.html",
    "locus": "Colossians 2:1-5",
    "parallels": []
  },
  {
    "book": "COL",
    "chapter": 2,
    "start": 6,
    "end": 7,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.v.iii.ii.html",
    "locus": "Colossians 2:6-7",
    "parallels": []
  },
  {
    "book": "COL",
    "chapter": 2,
    "start": 8,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.v.iii.iii.html",
    "locus": "Colossians 2:8-12",
    "parallels": []
  },
  {
    "book": "COL",
    "chapter": 2,
    "start": 13,
    "end": 15,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.v.iii.iv.html",
    "locus": "Colossians 2:13-15",
    "parallels": []
  },
  {
    "book": "COL",
    "chapter": 2,
    "start": 16,
    "end": 19,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.v.iii.v.html",
    "locus": "Colossians 2:16-19",
    "parallels": []
  },
  {
    "book": "COL",
    "chapter": 2,
    "start": 20,
    "end": 23,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.v.iii.vi.html",
    "locus": "Colossians 2:20-23",
    "parallels": []
  },
  {
    "book": "COL",
    "chapter": 3,
    "start": 1,
    "end": 4,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.v.iv.i.html",
    "locus": "Colossians 3:1-4",
    "parallels": []
  },
  {
    "book": "COL",
    "chapter": 3,
    "start": 5,
    "end": 8,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.v.iv.ii.html",
    "locus": "Colossians 3:5-8",
    "parallels": []
  },
  {
    "book": "COL",
    "chapter": 3,
    "start": 9,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.v.iv.iii.html",
    "locus": "Colossians 3:9-13",
    "parallels": []
  },
  {
    "book": "COL",
    "chapter": 3,
    "start": 14,
    "end": 17,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.v.iv.iv.html",
    "locus": "Colossians 3:14-17",
    "parallels": []
  },
  {
    "book": "COL",
    "chapter": 3,
    "start": 18,
    "end": 25,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.v.iv.v.html",
    "locus": "Colossians 3:18-25",
    "parallels": []
  },
  {
    "book": "COL",
    "chapter": 4,
    "start": 1,
    "end": 4,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.v.v.i.html",
    "locus": "Colossians 4:1-4",
    "parallels": []
  },
  {
    "book": "COL",
    "chapter": 4,
    "start": 5,
    "end": 9,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.v.v.ii.html",
    "locus": "Colossians 4:5-9",
    "parallels": []
  },
  {
    "book": "COL",
    "chapter": 4,
    "start": 10,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.v.v.iii.html",
    "locus": "Colossians 4:10-13",
    "parallels": []
  },
  {
    "book": "COL",
    "chapter": 4,
    "start": 14,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.v.v.iv.html",
    "locus": "Colossians 4:14-18",
    "parallels": []
  },
  {
    "book": "1TH",
    "chapter": 1,
    "start": 1,
    "end": 1,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.vi.iii.i.html",
    "locus": "1 Thessalonians 1:1",
    "parallels": []
  },
  {
    "book": "1TH",
    "chapter": 1,
    "start": 2,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.vi.iii.ii.html",
    "locus": "1 Thessalonians 1:2-5",
    "parallels": []
  },
  {
    "book": "1TH",
    "chapter": 1,
    "start": 6,
    "end": 8,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.vi.iii.iii.html",
    "locus": "1 Thessalonians 1:6-8",
    "parallels": []
  },
  {
    "book": "1TH",
    "chapter": 1,
    "start": 9,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.vi.iii.iv.html",
    "locus": "1 Thessalonians 1:9-10",
    "parallels": []
  },
  {
    "book": "1TH",
    "chapter": 2,
    "start": 1,
    "end": 4,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.vi.iv.i.html",
    "locus": "1 Thessalonians 2:1-4",
    "parallels": []
  },
  {
    "book": "1TH",
    "chapter": 2,
    "start": 5,
    "end": 8,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.vi.iv.ii.html",
    "locus": "1 Thessalonians 2:5-8",
    "parallels": []
  },
  {
    "book": "1TH",
    "chapter": 2,
    "start": 9,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.vi.iv.iii.html",
    "locus": "1 Thessalonians 2:9-12",
    "parallels": []
  },
  {
    "book": "1TH",
    "chapter": 2,
    "start": 13,
    "end": 16,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.vi.iv.iv.html",
    "locus": "1 Thessalonians 2:13-16",
    "parallels": []
  },
  {
    "book": "1TH",
    "chapter": 2,
    "start": 17,
    "end": 20,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.vi.iv.v.html",
    "locus": "1 Thessalonians 2:17-20",
    "parallels": []
  },
  {
    "book": "1TH",
    "chapter": 3,
    "start": 1,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.vi.v.i.html",
    "locus": "1 Thessalonians 3:1-5",
    "parallels": []
  },
  {
    "book": "1TH",
    "chapter": 3,
    "start": 6,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.vi.v.ii.html",
    "locus": "1 Thessalonians 3:6-10",
    "parallels": []
  },
  {
    "book": "1TH",
    "chapter": 3,
    "start": 11,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.vi.v.iii.html",
    "locus": "1 Thessalonians 3:11-13",
    "parallels": []
  },
  {
    "book": "1TH",
    "chapter": 4,
    "start": 1,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.vi.vi.i.html",
    "locus": "1 Thessalonians 4:1-5",
    "parallels": []
  },
  {
    "book": "1TH",
    "chapter": 4,
    "start": 6,
    "end": 8,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.vi.vi.ii.html",
    "locus": "1 Thessalonians 4:6-8",
    "parallels": []
  },
  {
    "book": "1TH",
    "chapter": 4,
    "start": 9,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.vi.vi.iii.html",
    "locus": "1 Thessalonians 4:9-12",
    "parallels": []
  },
  {
    "book": "1TH",
    "chapter": 4,
    "start": 13,
    "end": 14,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.vi.vi.iv.html",
    "locus": "1 Thessalonians 4:13-14",
    "parallels": []
  },
  {
    "book": "1TH",
    "chapter": 4,
    "start": 15,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.vi.vi.v.html",
    "locus": "1 Thessalonians 4:15-18",
    "parallels": []
  },
  {
    "book": "1TH",
    "chapter": 5,
    "start": 1,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.vi.vii.i.html",
    "locus": "1 Thessalonians 5:1-5",
    "parallels": []
  },
  {
    "book": "1TH",
    "chapter": 5,
    "start": 6,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.vi.vii.ii.html",
    "locus": "1 Thessalonians 5:6-10",
    "parallels": []
  },
  {
    "book": "1TH",
    "chapter": 5,
    "start": 11,
    "end": 11,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.vi.vii.iii.html",
    "locus": "1 Thessalonians 5:11",
    "parallels": []
  },
  {
    "book": "1TH",
    "chapter": 5,
    "start": 15,
    "end": 22,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.vi.vii.iv.html",
    "locus": "1 Thessalonians 5:15-22",
    "parallels": []
  },
  {
    "book": "1TH",
    "chapter": 5,
    "start": 23,
    "end": 28,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.vi.vii.v.html",
    "locus": "1 Thessalonians 5:23-28",
    "parallels": []
  },
  {
    "book": "2TH",
    "chapter": 1,
    "start": 1,
    "end": 7,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.vii.iii.i.html",
    "locus": "2 Thessalonians 1:1-7",
    "parallels": []
  },
  {
    "book": "2TH",
    "chapter": 1,
    "start": 7,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.vii.iii.ii.html",
    "locus": "2 Thessalonians 1:7-10",
    "parallels": []
  },
  {
    "book": "2TH",
    "chapter": 1,
    "start": 11,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.vii.iii.iii.html",
    "locus": "2 Thessalonians 1:11-12",
    "parallels": []
  },
  {
    "book": "2TH",
    "chapter": 2,
    "start": 1,
    "end": 2,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.vii.iv.i.html",
    "locus": "2 Thessalonians 2:1-2",
    "parallels": []
  },
  {
    "book": "2TH",
    "chapter": 2,
    "start": 3,
    "end": 4,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.vii.iv.ii.html",
    "locus": "2 Thessalonians 2:3-4",
    "parallels": []
  },
  {
    "book": "2TH",
    "chapter": 2,
    "start": 5,
    "end": 8,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.vii.iv.iii.html",
    "locus": "2 Thessalonians 2:5-8",
    "parallels": []
  },
  {
    "book": "2TH",
    "chapter": 2,
    "start": 9,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.vii.iv.iv.html",
    "locus": "2 Thessalonians 2:9-12",
    "parallels": []
  },
  {
    "book": "2TH",
    "chapter": 2,
    "start": 13,
    "end": 14,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.vii.iv.v.html",
    "locus": "2 Thessalonians 2:13-14",
    "parallels": []
  },
  {
    "book": "2TH",
    "chapter": 2,
    "start": 15,
    "end": 17,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.vii.iv.vi.html",
    "locus": "2 Thessalonians 2:15-17",
    "parallels": []
  },
  {
    "book": "2TH",
    "chapter": 3,
    "start": 1,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.vii.v.i.html",
    "locus": "2 Thessalonians 3:1-5",
    "parallels": []
  },
  {
    "book": "2TH",
    "chapter": 3,
    "start": 6,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.vii.v.ii.html",
    "locus": "2 Thessalonians 3:6-10",
    "parallels": []
  },
  {
    "book": "2TH",
    "chapter": 3,
    "start": 11,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.vii.v.iii.html",
    "locus": "2 Thessalonians 3:11-13",
    "parallels": []
  },
  {
    "book": "2TH",
    "chapter": 3,
    "start": 14,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom42/calcom42.vii.v.iv.html",
    "locus": "2 Thessalonians 3:14-18",
    "parallels": []
  },
  {
    "book": "1TI",
    "chapter": 1,
    "start": 1,
    "end": 4,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.iii.iii.i.html",
    "locus": "1 Timothy 1:1-4",
    "parallels": []
  },
  {
    "book": "1TI",
    "chapter": 1,
    "start": 5,
    "end": 11,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.iii.iii.ii.html",
    "locus": "1 Timothy 1:5-11",
    "parallels": []
  },
  {
    "book": "1TI",
    "chapter": 1,
    "start": 12,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.iii.iii.iii.html",
    "locus": "1 Timothy 1:12-13",
    "parallels": []
  },
  {
    "book": "1TI",
    "chapter": 1,
    "start": 14,
    "end": 17,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.iii.iii.iv.html",
    "locus": "1 Timothy 1:14-17",
    "parallels": []
  },
  {
    "book": "1TI",
    "chapter": 1,
    "start": 18,
    "end": 20,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.iii.iii.v.html",
    "locus": "1 Timothy 1:18-20",
    "parallels": []
  },
  {
    "book": "1TI",
    "chapter": 2,
    "start": 1,
    "end": 4,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.iii.iv.i.html",
    "locus": "1 Timothy 2:1-4",
    "parallels": []
  },
  {
    "book": "1TI",
    "chapter": 2,
    "start": 5,
    "end": 7,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.iii.iv.ii.html",
    "locus": "1 Timothy 2:5-7",
    "parallels": []
  },
  {
    "book": "1TI",
    "chapter": 2,
    "start": 8,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.iii.iv.iii.html",
    "locus": "1 Timothy 2:8-10",
    "parallels": []
  },
  {
    "book": "1TI",
    "chapter": 2,
    "start": 11,
    "end": 15,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.iii.iv.iv.html",
    "locus": "1 Timothy 2:11-15",
    "parallels": []
  },
  {
    "book": "1TI",
    "chapter": 3,
    "start": 1,
    "end": 7,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.iii.v.i.html",
    "locus": "1 Timothy 3:1-7",
    "parallels": []
  },
  {
    "book": "1TI",
    "chapter": 3,
    "start": 8,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.iii.v.ii.html",
    "locus": "1 Timothy 3:8-13",
    "parallels": []
  },
  {
    "book": "1TI",
    "chapter": 3,
    "start": 14,
    "end": 16,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.iii.v.iii.html",
    "locus": "1 Timothy 3:14-16",
    "parallels": []
  },
  {
    "book": "1TI",
    "chapter": 4,
    "start": 1,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.iii.vi.i.html",
    "locus": "1 Timothy 4:1-5",
    "parallels": []
  },
  {
    "book": "1TI",
    "chapter": 4,
    "start": 6,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.iii.vi.ii.html",
    "locus": "1 Timothy 4:6-10",
    "parallels": []
  },
  {
    "book": "1TI",
    "chapter": 4,
    "start": 11,
    "end": 16,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.iii.vi.iii.html",
    "locus": "1 Timothy 4:11-16",
    "parallels": []
  },
  {
    "book": "1TI",
    "chapter": 5,
    "start": 1,
    "end": 4,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.iii.vii.i.html",
    "locus": "1 Timothy 5:1-4",
    "parallels": []
  },
  {
    "book": "1TI",
    "chapter": 5,
    "start": 5,
    "end": 8,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.iii.vii.ii.html",
    "locus": "1 Timothy 5:5-8",
    "parallels": []
  },
  {
    "book": "1TI",
    "chapter": 5,
    "start": 9,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.iii.vii.iii.html",
    "locus": "1 Timothy 5:9-13",
    "parallels": []
  },
  {
    "book": "1TI",
    "chapter": 5,
    "start": 14,
    "end": 16,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.iii.vii.iv.html",
    "locus": "1 Timothy 5:14-16",
    "parallels": []
  },
  {
    "book": "1TI",
    "chapter": 5,
    "start": 17,
    "end": 21,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.iii.vii.v.html",
    "locus": "1 Timothy 5:17-21",
    "parallels": []
  },
  {
    "book": "1TI",
    "chapter": 5,
    "start": 22,
    "end": 25,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.iii.vii.vi.html",
    "locus": "1 Timothy 5:22-25",
    "parallels": []
  },
  {
    "book": "1TI",
    "chapter": 6,
    "start": 1,
    "end": 2,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.iii.viii.i.html",
    "locus": "1 Timothy 6:1-2",
    "parallels": []
  },
  {
    "book": "1TI",
    "chapter": 6,
    "start": 3,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.iii.viii.ii.html",
    "locus": "1 Timothy 6:3-5",
    "parallels": []
  },
  {
    "book": "1TI",
    "chapter": 6,
    "start": 6,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.iii.viii.iii.html",
    "locus": "1 Timothy 6:6-10",
    "parallels": []
  },
  {
    "book": "1TI",
    "chapter": 6,
    "start": 11,
    "end": 16,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.iii.viii.iv.html",
    "locus": "1 Timothy 6:11-16",
    "parallels": []
  },
  {
    "book": "1TI",
    "chapter": 6,
    "start": 17,
    "end": 21,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.iii.viii.v.html",
    "locus": "1 Timothy 6:17-21",
    "parallels": []
  },
  {
    "book": "2TI",
    "chapter": 1,
    "start": 1,
    "end": 2,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.iv.ii.i.html",
    "locus": "2 Timothy 1:1-2",
    "parallels": []
  },
  {
    "book": "2TI",
    "chapter": 1,
    "start": 3,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.iv.ii.ii.html",
    "locus": "2 Timothy 1:3-5",
    "parallels": []
  },
  {
    "book": "2TI",
    "chapter": 1,
    "start": 6,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.iv.ii.iii.html",
    "locus": "2 Timothy 1:6-12",
    "parallels": []
  },
  {
    "book": "2TI",
    "chapter": 1,
    "start": 13,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.iv.ii.iv.html",
    "locus": "2 Timothy 1:13-18",
    "parallels": []
  },
  {
    "book": "2TI",
    "chapter": 2,
    "start": 1,
    "end": 7,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.iv.iii.i.html",
    "locus": "2 Timothy 2:1-7",
    "parallels": []
  },
  {
    "book": "2TI",
    "chapter": 2,
    "start": 8,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.iv.iii.ii.html",
    "locus": "2 Timothy 2:8-13",
    "parallels": []
  },
  {
    "book": "2TI",
    "chapter": 2,
    "start": 14,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.iv.iii.iii.html",
    "locus": "2 Timothy 2:14-18",
    "parallels": []
  },
  {
    "book": "2TI",
    "chapter": 2,
    "start": 19,
    "end": 21,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.iv.iii.iv.html",
    "locus": "2 Timothy 2:19-21",
    "parallels": []
  },
  {
    "book": "2TI",
    "chapter": 2,
    "start": 22,
    "end": 26,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.iv.iii.v.html",
    "locus": "2 Timothy 2:22-26",
    "parallels": []
  },
  {
    "book": "2TI",
    "chapter": 3,
    "start": 1,
    "end": 7,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.iv.iv.i.html",
    "locus": "2 Timothy 3:1-7",
    "parallels": []
  },
  {
    "book": "2TI",
    "chapter": 3,
    "start": 8,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.iv.iv.ii.html",
    "locus": "2 Timothy 3:8-12",
    "parallels": []
  },
  {
    "book": "2TI",
    "chapter": 3,
    "start": 13,
    "end": 17,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.iv.iv.iii.html",
    "locus": "2 Timothy 3:13-17",
    "parallels": []
  },
  {
    "book": "2TI",
    "chapter": 4,
    "start": 1,
    "end": 4,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.iv.v.i.html",
    "locus": "2 Timothy 4:1-4",
    "parallels": []
  },
  {
    "book": "2TI",
    "chapter": 4,
    "start": 5,
    "end": 8,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.iv.v.ii.html",
    "locus": "2 Timothy 4:5-8",
    "parallels": []
  },
  {
    "book": "2TI",
    "chapter": 4,
    "start": 9,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.iv.v.iii.html",
    "locus": "2 Timothy 4:9-13",
    "parallels": []
  },
  {
    "book": "2TI",
    "chapter": 4,
    "start": 14,
    "end": 22,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.iv.v.iv.html",
    "locus": "2 Timothy 4:14-22",
    "parallels": []
  },
  {
    "book": "TIT",
    "chapter": 1,
    "start": 1,
    "end": 4,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.v.iii.i.html",
    "locus": "Titus 1:1-4",
    "parallels": []
  },
  {
    "book": "TIT",
    "chapter": 1,
    "start": 5,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.v.iii.ii.html",
    "locus": "Titus 1:5-6",
    "parallels": []
  },
  {
    "book": "TIT",
    "chapter": 1,
    "start": 7,
    "end": 9,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.v.iii.iii.html",
    "locus": "Titus 1:7-9",
    "parallels": []
  },
  {
    "book": "TIT",
    "chapter": 1,
    "start": 10,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.v.iii.iv.html",
    "locus": "Titus 1:10-12",
    "parallels": []
  },
  {
    "book": "TIT",
    "chapter": 1,
    "start": 13,
    "end": 16,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.v.iii.v.html",
    "locus": "Titus 1:13-16",
    "parallels": []
  },
  {
    "book": "TIT",
    "chapter": 2,
    "start": 1,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.v.iv.i.html",
    "locus": "Titus 2:1-5",
    "parallels": []
  },
  {
    "book": "TIT",
    "chapter": 2,
    "start": 6,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.v.iv.ii.html",
    "locus": "Titus 2:6-10",
    "parallels": []
  },
  {
    "book": "TIT",
    "chapter": 2,
    "start": 11,
    "end": 15,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.v.iv.iii.html",
    "locus": "Titus 2:11-15",
    "parallels": []
  },
  {
    "book": "TIT",
    "chapter": 3,
    "start": 1,
    "end": 3,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.v.v.i.html",
    "locus": "Titus 3:1-3",
    "parallels": []
  },
  {
    "book": "TIT",
    "chapter": 3,
    "start": 4,
    "end": 7,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.v.v.ii.html",
    "locus": "Titus 3:4-7",
    "parallels": []
  },
  {
    "book": "TIT",
    "chapter": 3,
    "start": 8,
    "end": 9,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.v.v.iii.html",
    "locus": "Titus 3:8-9",
    "parallels": []
  },
  {
    "book": "TIT",
    "chapter": 3,
    "start": 10,
    "end": 15,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.v.v.iv.html",
    "locus": "Titus 3:10-15",
    "parallels": []
  },
  {
    "book": "PHM",
    "chapter": 1,
    "start": 1,
    "end": 7,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.vi.i.html",
    "locus": "Philemon 1-7",
    "parallels": []
  },
  {
    "book": "PHM",
    "chapter": 1,
    "start": 8,
    "end": 14,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.vi.ii.html",
    "locus": "Philemon 8-14",
    "parallels": []
  },
  {
    "book": "PHM",
    "chapter": 1,
    "start": 15,
    "end": 19,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.vi.iii.html",
    "locus": "Philemon 15-19",
    "parallels": []
  },
  {
    "book": "PHM",
    "chapter": 1,
    "start": 20,
    "end": 25,
    "url": "https://ccel.org/ccel/calvin/calcom43/calcom43.vi.iv.html",
    "locus": "Philemon 20-25",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 1,
    "start": 1,
    "end": 2,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.vii.i.html",
    "locus": "Hebrews 1:1-2",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 1,
    "start": 3,
    "end": 3,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.vii.ii.html",
    "locus": "Hebrews 1:3",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 1,
    "start": 4,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.vii.iii.html",
    "locus": "Hebrews 1:4-6",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 1,
    "start": 7,
    "end": 9,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.vii.iv.html",
    "locus": "Hebrews 1:7-9",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 1,
    "start": 10,
    "end": 14,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.vii.v.html",
    "locus": "Hebrews 1:10-14",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 2,
    "start": 1,
    "end": 4,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.viii.i.html",
    "locus": "Hebrews 2:1-4",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 2,
    "start": 5,
    "end": 9,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.viii.ii.html",
    "locus": "Hebrews 2:5-9",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 2,
    "start": 10,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.viii.iii.html",
    "locus": "Hebrews 2:10-13",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 2,
    "start": 14,
    "end": 15,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.viii.iv.html",
    "locus": "Hebrews 2:14-15",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 2,
    "start": 16,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.viii.v.html",
    "locus": "Hebrews 2:16-18",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 3,
    "start": 1,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.ix.i.html",
    "locus": "Hebrews 3:1-6",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 3,
    "start": 7,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.ix.ii.html",
    "locus": "Hebrews 3:7-13",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 3,
    "start": 14,
    "end": 19,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.ix.iii.html",
    "locus": "Hebrews 3:14-19",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 4,
    "start": 1,
    "end": 2,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.x.i.html",
    "locus": "Hebrews 4:1-2",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 4,
    "start": 3,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.x.ii.html",
    "locus": "Hebrews 4:3-10",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 4,
    "start": 11,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.x.iii.html",
    "locus": "Hebrews 4:11-13",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 4,
    "start": 14,
    "end": 16,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.x.iv.html",
    "locus": "Hebrews 4:14-16",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 5,
    "start": 1,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xi.i.html",
    "locus": "Hebrews 5:1-6",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 5,
    "start": 7,
    "end": 11,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xi.ii.html",
    "locus": "Hebrews 5:7-11",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 5,
    "start": 12,
    "end": 14,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xi.iii.html",
    "locus": "Hebrews 5:12-14",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 6,
    "start": 1,
    "end": 2,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xii.i.html",
    "locus": "Hebrews 6:1-2",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 6,
    "start": 3,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xii.ii.html",
    "locus": "Hebrews 6:3-6",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 6,
    "start": 7,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xii.iii.html",
    "locus": "Hebrews 6:7-10",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 6,
    "start": 11,
    "end": 15,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xii.iv.html",
    "locus": "Hebrews 6:11-15",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 6,
    "start": 16,
    "end": 20,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xii.v.html",
    "locus": "Hebrews 6:16-20",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 7,
    "start": 1,
    "end": 3,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xiii.i.html",
    "locus": "Hebrews 7:1-3",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 7,
    "start": 4,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xiii.ii.html",
    "locus": "Hebrews 7:4-10",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 7,
    "start": 11,
    "end": 14,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xiii.iii.html",
    "locus": "Hebrews 7:11-14",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 7,
    "start": 15,
    "end": 22,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xiii.iv.html",
    "locus": "Hebrews 7:15-22",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 7,
    "start": 23,
    "end": 28,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xiii.v.html",
    "locus": "Hebrews 7:23-28",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 8,
    "start": 1,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xiv.i.html",
    "locus": "Hebrews 8:1-6",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 8,
    "start": 7,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xiv.ii.html",
    "locus": "Hebrews 8:7-13",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 9,
    "start": 1,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xv.i.html",
    "locus": "Hebrews 9:1-5",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 9,
    "start": 6,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xv.ii.html",
    "locus": "Hebrews 9:6-12",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 9,
    "start": 13,
    "end": 17,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xv.iii.html",
    "locus": "Hebrews 9:13-17",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 9,
    "start": 18,
    "end": 23,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xv.iv.html",
    "locus": "Hebrews 9:18-23",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 9,
    "start": 24,
    "end": 28,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xv.v.html",
    "locus": "Hebrews 9:24-28",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 10,
    "start": 1,
    "end": 4,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xvi.i.html",
    "locus": "Hebrews 10:1-4",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 10,
    "start": 5,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xvi.ii.html",
    "locus": "Hebrews 10:5-10",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 10,
    "start": 11,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xvi.iii.html",
    "locus": "Hebrews 10:11-18",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 10,
    "start": 19,
    "end": 23,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xvi.iv.html",
    "locus": "Hebrews 10:19-23",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 10,
    "start": 24,
    "end": 27,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xvi.v.html",
    "locus": "Hebrews 10:24-27",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 10,
    "start": 28,
    "end": 31,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xvi.vi.html",
    "locus": "Hebrews 10:28-31",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 10,
    "start": 32,
    "end": 35,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xvi.vii.html",
    "locus": "Hebrews 10:32-35",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 10,
    "start": 36,
    "end": 39,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xvi.viii.html",
    "locus": "Hebrews 10:36-39",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 11,
    "start": 1,
    "end": 1,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xvii.i.html",
    "locus": "Hebrews 11:1",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 11,
    "start": 2,
    "end": 4,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xvii.ii.html",
    "locus": "Hebrews 11:2-4",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 11,
    "start": 5,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xvii.iii.html",
    "locus": "Hebrews 11:5-6",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 11,
    "start": 7,
    "end": 7,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xvii.iv.html",
    "locus": "Hebrews 11:7",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 11,
    "start": 8,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xvii.v.html",
    "locus": "Hebrews 11:8-12",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 11,
    "start": 13,
    "end": 16,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xvii.vi.html",
    "locus": "Hebrews 11:13-16",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 11,
    "start": 17,
    "end": 22,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xvii.vii.html",
    "locus": "Hebrews 11:17-22",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 11,
    "start": 23,
    "end": 27,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xvii.viii.html",
    "locus": "Hebrews 11:23-27",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 11,
    "start": 28,
    "end": 31,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xvii.ix.html",
    "locus": "Hebrews 11:28-31",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 11,
    "start": 32,
    "end": 34,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xvii.x.html",
    "locus": "Hebrews 11:32-34",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 11,
    "start": 35,
    "end": 40,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xvii.xi.html",
    "locus": "Hebrews 11:35-40",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 12,
    "start": 1,
    "end": 3,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xviii.i.html",
    "locus": "Hebrews 12:1-3",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 12,
    "start": 4,
    "end": 8,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xviii.ii.html",
    "locus": "Hebrews 12:4-8",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 12,
    "start": 9,
    "end": 11,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xviii.iii.html",
    "locus": "Hebrews 12:9-11",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 12,
    "start": 12,
    "end": 17,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xviii.iv.html",
    "locus": "Hebrews 12:12-17",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 12,
    "start": 18,
    "end": 24,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xviii.v.html",
    "locus": "Hebrews 12:18-24",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 12,
    "start": 25,
    "end": 29,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xviii.vi.html",
    "locus": "Hebrews 12:25-29",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 13,
    "start": 1,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xix.i.html",
    "locus": "Hebrews 13:1-6",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 13,
    "start": 7,
    "end": 9,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xix.ii.html",
    "locus": "Hebrews 13:7-9",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 13,
    "start": 10,
    "end": 15,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xix.iii.html",
    "locus": "Hebrews 13:10-15",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 13,
    "start": 16,
    "end": 19,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xix.iv.html",
    "locus": "Hebrews 13:16-19",
    "parallels": []
  },
  {
    "book": "HEB",
    "chapter": 13,
    "start": 20,
    "end": 25,
    "url": "https://ccel.org/ccel/calvin/calcom44/calcom44.xix.v.html",
    "locus": "Hebrews 13:20-25",
    "parallels": []
  },
  {
    "book": "1PE",
    "chapter": 1,
    "start": 1,
    "end": 2,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.iv.ii.i.html",
    "locus": "1 Peter 1:1-2",
    "parallels": []
  },
  {
    "book": "1PE",
    "chapter": 1,
    "start": 3,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.iv.ii.ii.html",
    "locus": "1 Peter 1:3-5",
    "parallels": []
  },
  {
    "book": "1PE",
    "chapter": 1,
    "start": 6,
    "end": 9,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.iv.ii.iii.html",
    "locus": "1 Peter 1:6-9",
    "parallels": []
  },
  {
    "book": "1PE",
    "chapter": 1,
    "start": 10,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.iv.ii.iv.html",
    "locus": "1 Peter 1:10-12",
    "parallels": []
  },
  {
    "book": "1PE",
    "chapter": 1,
    "start": 13,
    "end": 16,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.iv.ii.v.html",
    "locus": "1 Peter 1:13-16",
    "parallels": []
  },
  {
    "book": "1PE",
    "chapter": 1,
    "start": 17,
    "end": 22,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.iv.ii.vi.html",
    "locus": "1 Peter 1:17-22",
    "parallels": []
  },
  {
    "book": "1PE",
    "chapter": 1,
    "start": 23,
    "end": 25,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.iv.ii.vii.html",
    "locus": "1 Peter 1:23-25",
    "parallels": []
  },
  {
    "book": "1PE",
    "chapter": 2,
    "start": 1,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.iv.iii.i.html",
    "locus": "1 Peter 2:1-5",
    "parallels": []
  },
  {
    "book": "1PE",
    "chapter": 2,
    "start": 6,
    "end": 8,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.iv.iii.ii.html",
    "locus": "1 Peter 2:6-8",
    "parallels": []
  },
  {
    "book": "1PE",
    "chapter": 2,
    "start": 9,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.iv.iii.iii.html",
    "locus": "1 Peter 2:9-10",
    "parallels": []
  },
  {
    "book": "1PE",
    "chapter": 2,
    "start": 11,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.iv.iii.iv.html",
    "locus": "1 Peter 2:11-12",
    "parallels": []
  },
  {
    "book": "1PE",
    "chapter": 2,
    "start": 13,
    "end": 16,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.iv.iii.v.html",
    "locus": "1 Peter 2:13-16",
    "parallels": []
  },
  {
    "book": "1PE",
    "chapter": 2,
    "start": 17,
    "end": 17,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.iv.iii.vi.html",
    "locus": "1 Peter 2:17",
    "parallels": []
  },
  {
    "book": "1PE",
    "chapter": 2,
    "start": 18,
    "end": 20,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.iv.iii.vii.html",
    "locus": "1 Peter 2:18-20",
    "parallels": []
  },
  {
    "book": "1PE",
    "chapter": 2,
    "start": 21,
    "end": 23,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.iv.iii.viii.html",
    "locus": "1 Peter 2:21-23",
    "parallels": []
  },
  {
    "book": "1PE",
    "chapter": 2,
    "start": 24,
    "end": 25,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.iv.iii.ix.html",
    "locus": "1 Peter 2:24-25",
    "parallels": []
  },
  {
    "book": "1PE",
    "chapter": 3,
    "start": 1,
    "end": 4,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.iv.iv.i.html",
    "locus": "1 Peter 3:1-4",
    "parallels": []
  },
  {
    "book": "1PE",
    "chapter": 3,
    "start": 5,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.iv.iv.ii.html",
    "locus": "1 Peter 3:5-6",
    "parallels": []
  },
  {
    "book": "1PE",
    "chapter": 3,
    "start": 5,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.iv.iv.iii.html",
    "locus": "1 Peter 3:5-6",
    "parallels": []
  },
  {
    "book": "1PE",
    "chapter": 3,
    "start": 8,
    "end": 9,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.iv.iv.iv.html",
    "locus": "1 Peter 3:8-9",
    "parallels": []
  },
  {
    "book": "1PE",
    "chapter": 3,
    "start": 10,
    "end": 15,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.iv.iv.v.html",
    "locus": "1 Peter 3:10-15",
    "parallels": []
  },
  {
    "book": "1PE",
    "chapter": 3,
    "start": 15,
    "end": 16,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.iv.iv.vi.html",
    "locus": "1 Peter 3:15-16",
    "parallels": []
  },
  {
    "book": "1PE",
    "chapter": 3,
    "start": 17,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.iv.iv.vii.html",
    "locus": "1 Peter 3:17-18",
    "parallels": []
  },
  {
    "book": "1PE",
    "chapter": 3,
    "start": 19,
    "end": 22,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.iv.iv.viii.html",
    "locus": "1 Peter 3:19-22",
    "parallels": []
  },
  {
    "book": "1PE",
    "chapter": 4,
    "start": 1,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.iv.v.i.html",
    "locus": "1 Peter 4:1-5",
    "parallels": []
  },
  {
    "book": "1PE",
    "chapter": 4,
    "start": 6,
    "end": 11,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.iv.v.ii.html",
    "locus": "1 Peter 4:6-11",
    "parallels": []
  },
  {
    "book": "1PE",
    "chapter": 4,
    "start": 12,
    "end": 17,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.iv.v.iii.html",
    "locus": "1 Peter 4:12-17",
    "parallels": []
  },
  {
    "book": "1PE",
    "chapter": 4,
    "start": 17,
    "end": 19,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.iv.v.iv.html",
    "locus": "1 Peter 4:17-19",
    "parallels": []
  },
  {
    "book": "1PE",
    "chapter": 5,
    "start": 1,
    "end": 4,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.iv.vi.i.html",
    "locus": "1 Peter 5:1-4",
    "parallels": []
  },
  {
    "book": "1PE",
    "chapter": 5,
    "start": 5,
    "end": 7,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.iv.vi.ii.html",
    "locus": "1 Peter 5:5-7",
    "parallels": []
  },
  {
    "book": "1PE",
    "chapter": 5,
    "start": 8,
    "end": 11,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.iv.vi.iii.html",
    "locus": "1 Peter 5:8-11",
    "parallels": []
  },
  {
    "book": "1PE",
    "chapter": 5,
    "start": 12,
    "end": 14,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.iv.vi.iv.html",
    "locus": "1 Peter 5:12-14",
    "parallels": []
  },
  {
    "book": "1JN",
    "chapter": 1,
    "start": 1,
    "end": 2,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.v.ii.i.html",
    "locus": "1 John 1:1-2",
    "parallels": [
      {
        "book": "JHN",
        "chapter": 1,
        "start": 1,
        "end": 2,
        "locus": "John 1:1-2"
      }
    ]
  },
  {
    "book": "1JN",
    "chapter": 1,
    "start": 3,
    "end": 7,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.v.ii.ii.html",
    "locus": "1 John 1:3-7",
    "parallels": [
      {
        "book": "JHN",
        "chapter": 1,
        "start": 3,
        "end": 7,
        "locus": "John 1:3-7"
      }
    ]
  },
  {
    "book": "1JN",
    "chapter": 1,
    "start": 8,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.v.ii.iii.html",
    "locus": "1 John 1:8-10",
    "parallels": [
      {
        "book": "JHN",
        "chapter": 1,
        "start": 8,
        "end": 10,
        "locus": "John 1:8-10"
      }
    ]
  },
  {
    "book": "1JN",
    "chapter": 2,
    "start": 1,
    "end": 2,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.v.iii.i.html",
    "locus": "1 John 2:1-2",
    "parallels": [
      {
        "book": "JHN",
        "chapter": 2,
        "start": 1,
        "end": 2,
        "locus": "John 2:1-2"
      }
    ]
  },
  {
    "book": "1JN",
    "chapter": 2,
    "start": 12,
    "end": 14,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.v.iii.iv.html",
    "locus": "1 John 2:12-14",
    "parallels": [
      {
        "book": "JHN",
        "chapter": 2,
        "start": 12,
        "end": 14,
        "locus": "John 2:12-14"
      }
    ]
  },
  {
    "book": "1JN",
    "chapter": 2,
    "start": 15,
    "end": 17,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.v.iii.v.html",
    "locus": "1 John 2:15-17",
    "parallels": [
      {
        "book": "JHN",
        "chapter": 2,
        "start": 15,
        "end": 17,
        "locus": "John 2:15-17"
      }
    ]
  },
  {
    "book": "1JN",
    "chapter": 2,
    "start": 18,
    "end": 19,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.v.iii.vi.html",
    "locus": "1 John 2:18-19",
    "parallels": [
      {
        "book": "JHN",
        "chapter": 2,
        "start": 18,
        "end": 19,
        "locus": "John 2:18-19"
      }
    ]
  },
  {
    "book": "1JN",
    "chapter": 2,
    "start": 20,
    "end": 23,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.v.iii.vii.html",
    "locus": "1 John 2:20-23",
    "parallels": [
      {
        "book": "JHN",
        "chapter": 2,
        "start": 20,
        "end": 23,
        "locus": "John 2:20-23"
      }
    ]
  },
  {
    "book": "1JN",
    "chapter": 2,
    "start": 24,
    "end": 29,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.v.iii.viii.html",
    "locus": "1 John 2:24-29",
    "parallels": [
      {
        "book": "JHN",
        "chapter": 2,
        "start": 24,
        "end": 29,
        "locus": "John 2:24-29"
      }
    ]
  },
  {
    "book": "1JN",
    "chapter": 3,
    "start": 1,
    "end": 3,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.v.iv.i.html",
    "locus": "1 John 3:1-3",
    "parallels": [
      {
        "book": "JHN",
        "chapter": 3,
        "start": 1,
        "end": 3,
        "locus": "John 3:1-3"
      }
    ]
  },
  {
    "book": "1JN",
    "chapter": 3,
    "start": 4,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.v.iv.ii.html",
    "locus": "1 John 3:4-6",
    "parallels": [
      {
        "book": "JHN",
        "chapter": 3,
        "start": 4,
        "end": 6,
        "locus": "John 3:4-6"
      }
    ]
  },
  {
    "book": "1JN",
    "chapter": 3,
    "start": 7,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.v.iv.iii.html",
    "locus": "1 John 3:7-10",
    "parallels": [
      {
        "book": "JHN",
        "chapter": 3,
        "start": 7,
        "end": 10,
        "locus": "John 3:7-10"
      }
    ]
  },
  {
    "book": "1JN",
    "chapter": 3,
    "start": 10,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.v.iv.iv.html",
    "locus": "1 John 3:10-13",
    "parallels": [
      {
        "book": "JHN",
        "chapter": 3,
        "start": 10,
        "end": 13,
        "locus": "John 3:10-13"
      }
    ]
  },
  {
    "book": "1JN",
    "chapter": 3,
    "start": 15,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.v.iv.v.html",
    "locus": "1 John 3:15-18",
    "parallels": [
      {
        "book": "JHN",
        "chapter": 3,
        "start": 15,
        "end": 18,
        "locus": "John 3:15-18"
      }
    ]
  },
  {
    "book": "1JN",
    "chapter": 3,
    "start": 19,
    "end": 22,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.v.iv.vi.html",
    "locus": "1 John 3:19-22",
    "parallels": [
      {
        "book": "JHN",
        "chapter": 3,
        "start": 19,
        "end": 22,
        "locus": "John 3:19-22"
      }
    ]
  },
  {
    "book": "1JN",
    "chapter": 3,
    "start": 23,
    "end": 24,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.v.iv.vii.html",
    "locus": "1 John 3:23-24",
    "parallels": [
      {
        "book": "JHN",
        "chapter": 3,
        "start": 23,
        "end": 24,
        "locus": "John 3:23-24"
      }
    ]
  },
  {
    "book": "1JN",
    "chapter": 4,
    "start": 1,
    "end": 3,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.v.v.i.html",
    "locus": "1 John 4:1-3",
    "parallels": [
      {
        "book": "JHN",
        "chapter": 4,
        "start": 1,
        "end": 3,
        "locus": "John 4:1-3"
      }
    ]
  },
  {
    "book": "1JN",
    "chapter": 4,
    "start": 4,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.v.v.ii.html",
    "locus": "1 John 4:4-6",
    "parallels": [
      {
        "book": "JHN",
        "chapter": 4,
        "start": 4,
        "end": 6,
        "locus": "John 4:4-6"
      }
    ]
  },
  {
    "book": "1JN",
    "chapter": 4,
    "start": 7,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.v.v.iii.html",
    "locus": "1 John 4:7-10",
    "parallels": [
      {
        "book": "JHN",
        "chapter": 4,
        "start": 7,
        "end": 10,
        "locus": "John 4:7-10"
      }
    ]
  },
  {
    "book": "1JN",
    "chapter": 4,
    "start": 11,
    "end": 16,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.v.v.iv.html",
    "locus": "1 John 4:11-16",
    "parallels": [
      {
        "book": "JHN",
        "chapter": 4,
        "start": 11,
        "end": 16,
        "locus": "John 4:11-16"
      }
    ]
  },
  {
    "book": "1JN",
    "chapter": 4,
    "start": 17,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.v.v.v.html",
    "locus": "1 John 4:17-18",
    "parallels": [
      {
        "book": "JHN",
        "chapter": 4,
        "start": 17,
        "end": 18,
        "locus": "John 4:17-18"
      }
    ]
  },
  {
    "book": "1JN",
    "chapter": 4,
    "start": 19,
    "end": 21,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.v.v.vi.html",
    "locus": "1 John 4:19-21",
    "parallels": [
      {
        "book": "JHN",
        "chapter": 4,
        "start": 19,
        "end": 21,
        "locus": "John 4:19-21"
      }
    ]
  },
  {
    "book": "1JN",
    "chapter": 5,
    "start": 1,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.v.vi.i.html",
    "locus": "1 John 5:1-5",
    "parallels": [
      {
        "book": "JHN",
        "chapter": 5,
        "start": 1,
        "end": 5,
        "locus": "John 5:1-5"
      }
    ]
  },
  {
    "book": "1JN",
    "chapter": 5,
    "start": 6,
    "end": 9,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.v.vi.ii.html",
    "locus": "1 John 5:6-9",
    "parallels": [
      {
        "book": "JHN",
        "chapter": 5,
        "start": 6,
        "end": 9,
        "locus": "John 5:6-9"
      }
    ]
  },
  {
    "book": "1JN",
    "chapter": 5,
    "start": 9,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.v.vi.iii.html",
    "locus": "1 John 5:9-12",
    "parallels": [
      {
        "book": "JHN",
        "chapter": 5,
        "start": 9,
        "end": 12,
        "locus": "John 5:9-12"
      }
    ]
  },
  {
    "book": "1JN",
    "chapter": 5,
    "start": 13,
    "end": 15,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.v.vi.iv.html",
    "locus": "1 John 5:13-15",
    "parallels": [
      {
        "book": "JHN",
        "chapter": 5,
        "start": 13,
        "end": 15,
        "locus": "John 5:13-15"
      }
    ]
  },
  {
    "book": "1JN",
    "chapter": 5,
    "start": 16,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.v.vi.v.html",
    "locus": "1 John 5:16-18",
    "parallels": [
      {
        "book": "JHN",
        "chapter": 5,
        "start": 16,
        "end": 18,
        "locus": "John 5:16-18"
      }
    ]
  },
  {
    "book": "1JN",
    "chapter": 5,
    "start": 19,
    "end": 21,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.v.vi.vi.html",
    "locus": "1 John 5:19-21",
    "parallels": [
      {
        "book": "JHN",
        "chapter": 5,
        "start": 19,
        "end": 21,
        "locus": "John 5:19-21"
      }
    ]
  },
  {
    "book": "JAS",
    "chapter": 1,
    "start": 1,
    "end": 4,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vi.ii.i.html",
    "locus": "James 1:1-4",
    "parallels": []
  },
  {
    "book": "JAS",
    "chapter": 1,
    "start": 5,
    "end": 8,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vi.ii.ii.html",
    "locus": "James 1:5-8",
    "parallels": []
  },
  {
    "book": "JAS",
    "chapter": 1,
    "start": 9,
    "end": 11,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vi.ii.iii.html",
    "locus": "James 1:9-11",
    "parallels": []
  },
  {
    "book": "JAS",
    "chapter": 1,
    "start": 12,
    "end": 15,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vi.ii.iv.html",
    "locus": "James 1:12-15",
    "parallels": []
  },
  {
    "book": "JAS",
    "chapter": 1,
    "start": 16,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vi.ii.v.html",
    "locus": "James 1:16-18",
    "parallels": []
  },
  {
    "book": "JAS",
    "chapter": 1,
    "start": 19,
    "end": 21,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vi.ii.vi.html",
    "locus": "James 1:19-21",
    "parallels": []
  },
  {
    "book": "JAS",
    "chapter": 1,
    "start": 22,
    "end": 27,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vi.ii.vii.html",
    "locus": "James 1:22-27",
    "parallels": []
  },
  {
    "book": "JAS",
    "chapter": 2,
    "start": 1,
    "end": 4,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vi.iii.i.html",
    "locus": "James 2:1-4",
    "parallels": []
  },
  {
    "book": "JAS",
    "chapter": 2,
    "start": 5,
    "end": 7,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vi.iii.ii.html",
    "locus": "James 2:5-7",
    "parallels": []
  },
  {
    "book": "JAS",
    "chapter": 2,
    "start": 8,
    "end": 11,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vi.iii.iii.html",
    "locus": "James 2:8-11",
    "parallels": []
  },
  {
    "book": "JAS",
    "chapter": 2,
    "start": 12,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vi.iii.iv.html",
    "locus": "James 2:12-13",
    "parallels": []
  },
  {
    "book": "JAS",
    "chapter": 2,
    "start": 14,
    "end": 17,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vi.iii.v.html",
    "locus": "James 2:14-17",
    "parallels": []
  },
  {
    "book": "JAS",
    "chapter": 2,
    "start": 18,
    "end": 19,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vi.iii.vi.html",
    "locus": "James 2:18-19",
    "parallels": []
  },
  {
    "book": "JAS",
    "chapter": 2,
    "start": 20,
    "end": 26,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vi.iii.vii.html",
    "locus": "James 2:20-26",
    "parallels": []
  },
  {
    "book": "JAS",
    "chapter": 3,
    "start": 1,
    "end": 5,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vi.iv.i.html",
    "locus": "James 3:1-5",
    "parallels": []
  },
  {
    "book": "JAS",
    "chapter": 3,
    "start": 5,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vi.iv.ii.html",
    "locus": "James 3:5-6",
    "parallels": []
  },
  {
    "book": "JAS",
    "chapter": 3,
    "start": 7,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vi.iv.iii.html",
    "locus": "James 3:7-12",
    "parallels": []
  },
  {
    "book": "JAS",
    "chapter": 3,
    "start": 13,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vi.iv.iv.html",
    "locus": "James 3:13-18",
    "parallels": []
  },
  {
    "book": "JAS",
    "chapter": 4,
    "start": 1,
    "end": 3,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vi.v.i.html",
    "locus": "James 4:1-3",
    "parallels": []
  },
  {
    "book": "JAS",
    "chapter": 4,
    "start": 4,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vi.v.ii.html",
    "locus": "James 4:4-6",
    "parallels": []
  },
  {
    "book": "JAS",
    "chapter": 4,
    "start": 7,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vi.v.iii.html",
    "locus": "James 4:7-10",
    "parallels": []
  },
  {
    "book": "JAS",
    "chapter": 4,
    "start": 11,
    "end": 12,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vi.v.iv.html",
    "locus": "James 4:11-12",
    "parallels": []
  },
  {
    "book": "JAS",
    "chapter": 4,
    "start": 13,
    "end": 17,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vi.v.v.html",
    "locus": "James 4:13-17",
    "parallels": []
  },
  {
    "book": "JAS",
    "chapter": 5,
    "start": 1,
    "end": 6,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vi.vi.i.html",
    "locus": "James 5:1-6",
    "parallels": []
  },
  {
    "book": "JAS",
    "chapter": 5,
    "start": 7,
    "end": 9,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vi.vi.ii.html",
    "locus": "James 5:7-9",
    "parallels": []
  },
  {
    "book": "JAS",
    "chapter": 5,
    "start": 10,
    "end": 11,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vi.vi.iii.html",
    "locus": "James 5:10-11",
    "parallels": []
  },
  {
    "book": "JAS",
    "chapter": 5,
    "start": 12,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vi.vi.iv.html",
    "locus": "James 5:12-13",
    "parallels": []
  },
  {
    "book": "JAS",
    "chapter": 5,
    "start": 14,
    "end": 15,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vi.vi.v.html",
    "locus": "James 5:14-15",
    "parallels": []
  },
  {
    "book": "JAS",
    "chapter": 5,
    "start": 16,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vi.vi.vi.html",
    "locus": "James 5:16-18",
    "parallels": []
  },
  {
    "book": "JAS",
    "chapter": 5,
    "start": 19,
    "end": 20,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vi.vi.vii.html",
    "locus": "James 5:19-20",
    "parallels": []
  },
  {
    "book": "2PE",
    "chapter": 1,
    "start": 1,
    "end": 4,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vii.ii.i.html",
    "locus": "2 Peter 1:1-4",
    "parallels": []
  },
  {
    "book": "2PE",
    "chapter": 1,
    "start": 5,
    "end": 9,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vii.ii.ii.html",
    "locus": "2 Peter 1:5-9",
    "parallels": []
  },
  {
    "book": "2PE",
    "chapter": 1,
    "start": 10,
    "end": 15,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vii.ii.iii.html",
    "locus": "2 Peter 1:10-15",
    "parallels": []
  },
  {
    "book": "2PE",
    "chapter": 1,
    "start": 16,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vii.ii.iv.html",
    "locus": "2 Peter 1:16-18",
    "parallels": []
  },
  {
    "book": "2PE",
    "chapter": 1,
    "start": 19,
    "end": 21,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vii.ii.v.html",
    "locus": "2 Peter 1:19-21",
    "parallels": []
  },
  {
    "book": "2PE",
    "chapter": 2,
    "start": 1,
    "end": 3,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vii.iii.i.html",
    "locus": "2 Peter 2:1-3",
    "parallels": []
  },
  {
    "book": "2PE",
    "chapter": 2,
    "start": 4,
    "end": 8,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vii.iii.ii.html",
    "locus": "2 Peter 2:4-8",
    "parallels": []
  },
  {
    "book": "2PE",
    "chapter": 2,
    "start": 9,
    "end": 11,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vii.iii.iii.html",
    "locus": "2 Peter 2:9-11",
    "parallels": []
  },
  {
    "book": "2PE",
    "chapter": 2,
    "start": 12,
    "end": 16,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vii.iii.iv.html",
    "locus": "2 Peter 2:12-16",
    "parallels": []
  },
  {
    "book": "2PE",
    "chapter": 2,
    "start": 17,
    "end": 19,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vii.iii.v.html",
    "locus": "2 Peter 2:17-19",
    "parallels": []
  },
  {
    "book": "2PE",
    "chapter": 2,
    "start": 20,
    "end": 22,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vii.iii.vi.html",
    "locus": "2 Peter 2:20-22",
    "parallels": []
  },
  {
    "book": "2PE",
    "chapter": 3,
    "start": 1,
    "end": 4,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vii.iv.i.html",
    "locus": "2 Peter 3:1-4",
    "parallels": []
  },
  {
    "book": "2PE",
    "chapter": 3,
    "start": 5,
    "end": 8,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vii.iv.ii.html",
    "locus": "2 Peter 3:5-8",
    "parallels": []
  },
  {
    "book": "2PE",
    "chapter": 3,
    "start": 9,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vii.iv.iii.html",
    "locus": "2 Peter 3:9-13",
    "parallels": []
  },
  {
    "book": "2PE",
    "chapter": 3,
    "start": 14,
    "end": 18,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.vii.iv.iv.html",
    "locus": "2 Peter 3:14-18",
    "parallels": []
  },
  {
    "book": "JUD",
    "chapter": 1,
    "start": 1,
    "end": 2,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.viii.ii.i.html",
    "locus": "Jude 1-2",
    "parallels": []
  },
  {
    "book": "JUD",
    "chapter": 1,
    "start": 3,
    "end": 4,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.viii.ii.ii.html",
    "locus": "Jude 3-4",
    "parallels": []
  },
  {
    "book": "JUD",
    "chapter": 1,
    "start": 5,
    "end": 7,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.viii.ii.iii.html",
    "locus": "Jude 5-7",
    "parallels": []
  },
  {
    "book": "JUD",
    "chapter": 1,
    "start": 8,
    "end": 10,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.viii.ii.iv.html",
    "locus": "Jude 8-10",
    "parallels": []
  },
  {
    "book": "JUD",
    "chapter": 1,
    "start": 11,
    "end": 13,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.viii.ii.v.html",
    "locus": "Jude 11-13",
    "parallels": []
  },
  {
    "book": "JUD",
    "chapter": 1,
    "start": 14,
    "end": 16,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.viii.ii.vi.html",
    "locus": "Jude 14-16",
    "parallels": []
  },
  {
    "book": "JUD",
    "chapter": 1,
    "start": 17,
    "end": 19,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.viii.ii.vii.html",
    "locus": "Jude 17-19",
    "parallels": []
  },
  {
    "book": "JUD",
    "chapter": 1,
    "start": 20,
    "end": 25,
    "url": "https://ccel.org/ccel/calvin/calcom45/calcom45.viii.ii.viii.html",
    "locus": "Jude 20-25",
    "parallels": []
  }
];
