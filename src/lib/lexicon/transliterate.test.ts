import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  transliterateGreek,
  transliterateHebrew,
  transliterateLemma,
} from "./transliterate.ts";

describe("hebrew transliteration (SBL-style)", () => {
  const cases: Array<[string, string]> = [
    ["בָּרָא", "bārāʾ"],
    ["אֱלֹהִים", "ʾĕlōhîm"],
    ["רֵאשִׁית", "rēʾšîṯ"],
    ["אָב", "ʾāḇ"],
    ["בַּעֲלָה", "baʿălâ"],
    ["חֲיָא", "ḥăyāʾ"],
    ["נוּמָה", "nûmâ"],
    ["תְּדִירָא", "tĕḏîrāʾ"],
    ["עֵשֶׂב", "ʿēśeḇ"],
    ["שָׁלוּ", "šālû"],
    ["יַרְמוּת", "yarmûṯ"],
    ["גֵּיחֲזִי", "gêḥăzî"],
    ["אָרַשׂ", "ʾāraś"],
    ["בּוּזִי", "bûzî"],
    ["תּוֹרָה", "tôrâ"],
    ["מַלְאָךְ", "malʾāḵ"],
    ["רוּחַ", "rûaḥ"], // furtive patah
    ["שָׁמַיִם", "šāmayim"],
    ["בְּרֵאשִׁית", "bĕrēʾšîṯ"],
    ["הַלְלוּ", "hallû"], // dagesh forte doubles
    ["עָוַל", "ʿāwal"],
  ];
  for (const [hebrew, expected] of cases) {
    it(`${hebrew} → ${expected}`, () => {
      assert.equal(transliterateHebrew(hebrew), expected);
    });
  }
  it("strips cantillation marks", () => {
    assert.equal(transliterateHebrew("עֵ֫שֶׂב"), "ʿēśeḇ");
    assert.equal(transliterateHebrew("שָׁ֫לוּ"), "šālû");
  });
});

describe("greek transliteration (SBL-style)", () => {
  const cases: Array<[string, string]> = [
    ["Ἀαρών", "aarōn"],
    ["λόγιος", "logios"],
    ["λῃστής", "lēistēs"],
    ["ἑκατονταπλασίων", "hekatontaplasiōn"],
    ["φυγαδεία", "phugadeia"],
    ["θεός", "theos"],
    ["ἀγάπη", "agapē"],
    ["ἄγγελος", "angelos"], // smooth breathing: no h; gamma nasal
    ["ἅγγελος", "hangelos"], // rough breathing: h
    ["ῥῆμα", "rhēma"], // initial rho with rough breathing
    ["Χριστός", "christos"],
    ["καταρρεμβεύω", "katarrembeuō"],
    ["αἱ", "ai"], // smooth breathing: no h
    ["ἁ", "ha"], // rough breathing: h
    ["λόγος", "logos"],
    ["ψυχή", "psuchē"],
  ];
  for (const [greek, expected] of cases) {
    it(`${greek} → ${expected}`, () => {
      assert.equal(transliterateGreek(greek), expected);
    });
  }
});

describe("transliterateLemma dispatch", () => {
  it("routes by script", () => {
    assert.equal(transliterateLemma("בָּרָא"), "bārāʾ");
    assert.equal(transliterateLemma("λόγος"), "logos");
  });
  it("returns empty for empty or latin input", () => {
    assert.equal(transliterateLemma(""), "");
    assert.equal(transliterateLemma("Aaron"), "");
  });
});
