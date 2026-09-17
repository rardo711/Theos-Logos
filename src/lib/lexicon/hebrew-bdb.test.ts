import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  hasHebrewBdbChip,
  hebrewBdbAttribution,
  lookupHebrewBdbByGloss,
  lookupHebrewBdbByStrongs,
  lookupHebrewBdbWordNow,
  verseSenseLine,
  clearestBlockGloss,
} from "./hebrew-bdb.ts";
import hebrewBdbJson from "./data/hebrew-bdb.json" with { type: "json" };

describe("hebrew BDB lexicon", () => {
  it("H7225 returns BDB beginning/chief", () => {
    const hit = lookupHebrewBdbByStrongs("H7225");
    assert.ok(hit);
    assert.equal(hit?.strongs, "H7225");
    assert.equal(hit?.lemma, "רֵאשִׁית");
    assert.match(hit?.gloss ?? "", /beginning/i);
    assert.match(hit?.attribution ?? "", /Brown-Driver-Briggs/);
    assert.match(hebrewBdbAttribution, /Brown-Driver-Briggs/);
    assert.equal(hit?.isAramaic, false);
  });

  it("H1254 is create (I), not be fat (II)", () => {
    const hit = lookupHebrewBdbByStrongs("H1254");
    assert.ok(hit);
    assert.equal(hit?.lemma, "בָּרָא");
    assert.match(hit?.gloss ?? "", /create/i);
    assert.ok((hit?.senses ?? []).length > 5);
  });

  it("H430 is elohim (God), not halal", () => {
    const hit = lookupHebrewBdbByStrongs("H430");
    assert.ok(hit);
    assert.equal(hit?.lemma, "אֱלֹהִים");
    // BDB's first sense block glosses it "rulers, judges"; "God" appears in
    // the fuller sense glosses below.
    assert.equal(hit?.gloss, "rulers, judges");
    assert.ok(
      (hit?.senses ?? []).some((s) =>
        s.glosses.some((g) => /god/i.test(g)),
      ),
    );
  });

  it("H216 is light", () => {
    const hit = lookupHebrewBdbByStrongs("H216");
    assert.ok(hit);
    assert.equal(hit?.lemma, "אוֺר");
    assert.match(hit?.gloss ?? "", /light/i);
  });

  it("H1254 + Genesis 2:4 selects the Niphal 'be created' sense by verse", () => {
    const hit = lookupHebrewBdbByStrongs("H1254", "Genesis 2:4");
    assert.ok(hit);
    assert.equal(hit?.senseMatchedByReference, true);
    assert.equal(hit?.selectedSenseIndex, 6);
    assert.match(hit?.sense ?? "", /be created/i);
    assert.equal(hit?.senses[6]?.matchedByReference, true);
  });

  it("H1254 without a verse falls back to the head block", () => {
    const hit = lookupHebrewBdbByStrongs("H1254");
    assert.ok(hit);
    assert.equal(hit?.senseMatchedByReference, false);
    assert.equal(hit?.selectedSenseIndex, 0);
  });

  it("surface 'love' resolves to H157 (aheb)", () => {
    assert.equal(hasHebrewBdbChip("love"), true);
    const hit = lookupHebrewBdbWordNow("love");
    assert.ok(hit);
    assert.equal(hit?.strongs, "H157");
    assert.equal(hit?.lemma, "אָהֵב");
  });

  it("accepts zero-padded Strong's H0430", () => {
    const hit = lookupHebrewBdbByStrongs("H0430");
    assert.equal(hit?.strongs, "H430");
    assert.equal(hit?.lemma, "אֱלֹהִים");
  });

  it("unknown Strong's returns null", () => {
    assert.equal(lookupHebrewBdbByStrongs("H99999"), null);
    assert.equal(lookupHebrewBdbByStrongs(""), null);
    assert.equal(hasHebrewBdbChip("xyzzyplugh"), false);
  });

  it("H2 is flagged Biblical Aramaic", () => {
    const hit = lookupHebrewBdbByStrongs("H2");
    assert.ok(hit);
    assert.equal(hit?.isAramaic, true);
    // BDB's Aramaic headword is אַב (the Hebrew cognate אָב is a cross-ref).
    assert.equal(hit?.lemma, "אַב");
  });

  it("gloss lookup returns Strong's ids for 'light'", () => {
    const hits = lookupHebrewBdbByGloss("light");
    assert.ok(hits.length > 0);
    assert.ok(hits.some((h) => h.strongs === "H216"));
  });

  it("Habakkuk 1:1 'oracle' resolves to H4853 (utterance, oracle), not H2374 seer", () => {
    assert.equal(hasHebrewBdbChip("oracle"), true);
    const hit = lookupHebrewBdbWordNow("oracle", "Habakkuk 1:1");
    assert.ok(hit);
    assert.equal(hit?.strongs, "H4853");
    assert.equal(hit?.senseMatchedByReference, true);
    assert.match(hit?.gloss ?? "", /utterance, oracle/i);
  });

  it("H4853 keeps both BDB homograph sections (load AND utterance, oracle)", () => {
    const hit = lookupHebrewBdbByStrongs("H4853");
    assert.ok(hit);
    assert.match(hit?.headwordGloss ?? "", /load, burden/i);
    assert.match(hit?.headwordGloss ?? "", /utterance, oracle/i);
  });

  it("Habakkuk 1:1 'saw' reaches H2372 via the see variant", () => {
    const hit = lookupHebrewBdbWordNow("saw", "Habakkuk 1:1");
    assert.ok(hit);
    assert.equal(hit?.strongs, "H2372");
    assert.equal(hit?.senseMatchedByReference, true);
  });

  it("H1254 stays create-first after the homograph merge (not be fat)", () => {
    const hit = lookupHebrewBdbByStrongs("H1254");
    assert.ok(hit);
    assert.match(hit?.gloss ?? "", /create/i);
    assert.ok(!(hit?.gloss ?? "").toLowerCase().startsWith("be fat"));
  });

  it("no shipped BDB text carries backslash formatting artifacts", () => {
    const by = (hebrewBdbJson as { by: Record<string, { hw?: string; ss: { t: string; g: string[] }[] }> }).by;
    let checked = 0;
    for (const e of Object.values(by)) {
      if (e.hw) assert.ok(!e.hw.includes("\\"), `backslash in hw: ${e.hw}`);
      for (const s of e.ss || []) {
        assert.ok(!s.t.includes("\\"), `backslash in sense: ${s.t.slice(0, 60)}`);
        for (const g of s.g || []) {
          assert.ok(!g.includes("\\"), `backslash in gloss: ${g}`);
        }
        checked++;
      }
    }
    assert.ok(checked > 10000, `only checked ${checked} senses`);
  });
});

describe("hebrew BDB OT sweep regressions", () => {
  it("H4 is the אֵב 'fruit' article, not the Aramaic preface", () => {
    const hit = lookupHebrewBdbByStrongs("H4");
    assert.ok(hit);
    assert.equal(hit?.lemma, "אֵב");
    assert.equal(hit?.headwordGloss, "fruit");
    assert.deepEqual(hit?.pos, ["noun masculine"]);
    assert.equal(hit?.isAramaic, true);
    // Head block cites Daniel 4:9, 4:11, 4:18 (SIL keys 027004009 …).
    const refs = hit?.senses[0]?.refs ?? [];
    assert.ok(refs.includes("027004009"), "Dan 4:9 cited");
    assert.ok(refs.includes("027004011"), "Dan 4:11 cited");
    assert.ok(refs.includes("027004018"), "Dan 4:18 cited");
  });

  it("H3 stays the Hebrew אֵב 'freshness', not the H4 fruit article", () => {
    const hit = lookupHebrewBdbByStrongs("H3");
    assert.ok(hit);
    assert.equal(hit?.lemma, "אֵב");
    assert.match(hit?.headwordGloss ?? "", /freshness, fresh green/);
    assert.equal(hit?.isAramaic, false);
  });

  it("H8 leads with אֹבֵד 'destruction' (BDB7) before the אָבַד verb article", () => {
    const hit = lookupHebrewBdbByStrongs("H8");
    assert.ok(hit);
    assert.equal(hit?.lemma, "אֹבֵד");
    assert.match(hit?.headwordGloss ?? "", /^destruction/);
    assert.match(hit?.headwordGloss ?? "", /perish/);
  });

  it("bare English 'see' ranks Hebrew H2372 over Aramaic H2370", () => {
    const hit = lookupHebrewBdbWordNow("see");
    assert.ok(hit);
    assert.equal(hit?.strongs, "H2372");
    assert.equal(hit?.isAramaic, false);
  });

  it("H433 and H988 ship the Hebrew articles, not the Aramaic companions", () => {
    const h433 = lookupHebrewBdbByStrongs("H433");
    assert.ok(h433);
    assert.equal(h433?.isAramaic, false);
    assert.match(h433?.headwordGloss ?? "", /god, God/i);
    const h988 = lookupHebrewBdbByStrongs("H988");
    assert.ok(h988);
    assert.equal(h988?.lemma, "בָּטַל");
    assert.equal(h988?.isAramaic, false);
  });

  it("singular 'heaven' falls back to the plural index key 'heavens'", () => {
    const hit = lookupHebrewBdbWordNow("heaven");
    assert.ok(hit);
    assert.equal(hit?.strongs, "H8064");
    assert.match(hit?.headwordGloss ?? "", /heavens/i);
  });

  it("entity-encoded metadata tags never ship in card text", () => {
    const by = (
      hebrewBdbJson as {
        by: Record<
          string,
          { m?: string; hw?: string; pos?: string[]; ss: { t: string; g: string[] }[] }
        >;
      }
    ).by;
    const strings: string[] = [];
    for (const e of Object.values(by)) {
      if (e.m) strings.push(e.m);
      if (e.hw) strings.push(e.hw);
      for (const p of e.pos || []) strings.push(p);
      for (const s of e.ss || []) {
        strings.push(s.t);
        for (const g of s.g || []) strings.push(g);
      }
    }
    assert.ok(strings.length > 60000, `only saw ${strings.length} strings`);
    for (const v of strings) {
      assert.ok(!/<[A-Za-z][^>]*>/.test(v), `tag remnant in ${v.slice(0, 70)}`);
      assert.ok(!/>BIBLE:[^<>]*>/.test(v), `metadata remnant in ${v.slice(0, 70)}`);
    }
    // The three rows that originally leaked metadata are clean.
    for (const id of ["H3654", "H3678", "H5782"]) {
      const text = (by[id].ss || []).map((s) => s.t).join(" ");
      assert.ok(!/TOPIC:|Times New Roman|BIBLE:/.test(text), `${id} leaks metadata`);
    }
  });

  it("sliced POS/headword values are trimmed (H4601, H4714)", () => {
    const by = (
      hebrewBdbJson as {
        by: Record<string, { m?: string; hw?: string; pos?: string[] }>;
      }
    ).by;
    for (const id of ["H4601", "H4714"]) {
      for (const p of by[id].pos || []) assert.equal(p, p.trim(), `${id} pos`);
    }
    let checked = 0;
    for (const [id, e] of Object.entries(by)) {
      if (e.m) {
        assert.equal(e.m, e.m.trim(), `${id} lemma`);
        checked++;
      }
      if (e.hw) assert.equal(e.hw, e.hw.trim(), `${id} hw`);
      for (const p of e.pos || []) assert.equal(p, p.trim(), `${id} pos`);
    }
    assert.ok(checked > 8000, `only checked ${checked} lemmas`);
  });

  it("no bare sense label ships as a part of speech (H1276 regression)", () => {
    const by = (
      hebrewBdbJson as { by: Record<string, { pos?: string[] }> }
    ).by;
    const labelRe = /^([a-z]+\.|[a-z]?\d+\s?[a-z]?\.?)$/i;
    for (const [id, e] of Object.entries(by)) {
      for (const p of e.pos || [])
        assert.ok(!labelRe.test(p), `${id} pos is a sense label: ${p}`);
    }
    // H1276 is בֵּרִים (2 Sam 20:14), not the בְּרִית cross-reference stub.
    const h1276 = lookupHebrewBdbByStrongs("H1276");
    assert.ok(h1276);
    assert.equal(h1276?.lemma, "בֵּרִים");
    assert.match(h1276?.senses[0]?.text ?? "", /2Sam 20:14/);
  });

  it("no head block is a 'see below/above' cross-reference stub", () => {
    const by = (
      hebrewBdbJson as {
        by: Record<string, { ss: { t: string }[] }>;
      }
    ).by;
    for (const [id, e] of Object.entries(by)) {
      const t0 = e.ss[0]?.t || "";
      assert.ok(
        !/^[\u0590-\u05ea]+\s+see (below|above)/i.test(t0),
        `${id} head is a stub: ${t0.slice(0, 60)}`,
      );
    }
  });
});
describe("verse sense one-liner", () => {
  it("H3605 at Haggai 1:12 shows 'the whole, all', not the wall of text", () => {
    const hit = lookupHebrewBdbByStrongs("H3605", "Haggai 1:12");
    assert.ok(hit);
    // Glossless head block -> BDB's verbatim headword gloss is the line.
    assert.equal(hit?.senseLine, "the whole, all");
    // The full verbatim entry text is still shipped for the expander.
    assert.match(hit?.sense ?? "", /Moabite/);
    assert.ok((hit?.senseLine.length ?? 0) < (hit?.sense.length ?? 0));
  });

  it("H1254 at Genesis 2:4 shows the matched block's first gloss verbatim", () => {
    const hit = lookupHebrewBdbByStrongs("H1254", "Genesis 2:4");
    assert.ok(hit);
    assert.equal(hit?.senseMatchedByReference, true);
    assert.equal(hit?.senseLine, "be created:");
    assert.equal(hit?.senseLine, hit?.senses[hit.selectedSenseIndex]?.glosses[0]);
  });

  it("Meaning hero prefers the verse-pinned sense's gloss over the headword default", () => {
    const hit = lookupHebrewBdbByStrongs("H1254", "Genesis 2:4");
    assert.ok(hit);
    assert.equal(hit?.senseMatchedByReference, true);
    // Not the headword default ("create"); the Niphal sense for this verse.
    assert.equal(hit?.gloss, "be created:");
    assert.notEqual(hit?.gloss, hit?.headwordGloss);
  });

  it("first gloss wins over the headword gloss", () => {
    assert.equal(
      verseSenseLine("long block text here", ["the whole of", "all"], "the whole, all"),
      "the whole of",
    );
  });

  it("headword gloss is the fallback for any block without a usable gloss", () => {
    const text = "Note . — When the genitive after כל is a noun feminine or plural";
    assert.equal(verseSenseLine(text, [], "the whole, all"), "the whole, all");
    // Paradigm blocks (labels only) fall back to the headword gloss too.
    assert.equal(
      verseSenseLine("Qal paradigm table", ["Perfect", "Imperfect"], "sow, scatter seed"),
      "sow, scatter seed",
    );
  });

  it("glossless block with no headword falls back to a verbatim truncated prefix", () => {
    const text =
      "Note . — When the genitive after כל is a noun feminine or plural, the predicate usually agrees with this (as being the really important idea), e.g. Gen 5:5 ויהיו כל ימי אדם , Num 14:1 and on and on past one hundred and sixty characters of BDB detail";
    const line = verseSenseLine(text, [], "");
    assert.ok(line.endsWith("…"), "truncated prefix signals continuation");
    assert.ok(line.length <= 165, `line too long: ${line.length}`);
    assert.ok(text.replace(/\s+/g, " ").startsWith(line.replace(/…$/, "").trimEnd()));
  });

  it("short glossless text is returned whole with no ellipsis", () => {
    assert.equal(verseSenseLine("Qal be fat", [], ""), "Qal be fat");
  });

  it("empty block yields an empty line", () => {
    assert.equal(verseSenseLine("", [], ""), "");
  });
});

describe("clearestBlockGloss", () => {
  it("prefers the identical restatement without BDB's trailing-colon marker", () => {
    assert.equal(clearestBlockGloss(["sow:", "sow"]), "sow");
    assert.equal(clearestBlockGloss(["except:", "except"]), "except");
    assert.equal(clearestBlockGloss(["against:", "against"]), "against");
  });

  it("never promotes an alternative parsing over the block's opening gloss", () => {
    // H384: "I have wearied myself" is the moderns' repointing, not the name's meaning.
    assert.equal(
      clearestBlockGloss(["with me is God:", "I have wearied myself"]),
      "with me is God:",
    );
  });

  it("never promotes a verse quotation over the gloss it illustrates", () => {
    assert.equal(
      clearestBlockGloss(["be sown:", "no more of thy name be sown"]),
      "be sown:",
    );
  });

  it("replaces a bare grammar label with the block's plain gloss", () => {
    // H430 sense 1: "plural" hides "rulers, judges".
    assert.equal(
      clearestBlockGloss(["plural", "rulers, judges", "gods", "God"]),
      "rulers, judges",
    );
  });

  it("paradigm-only blocks yield no gloss", () => {
    assert.equal(clearestBlockGloss(["Perfect", "Imperfect", "Imperative"]), "");
    assert.equal(clearestBlockGloss([]), "");
  });

  it("plain first gloss is returned untouched", () => {
    assert.equal(clearestBlockGloss(["the whole of", "all", "every:"]), "the whole of");
    assert.equal(clearestBlockGloss(["be created:"]), "be created:");
  });
});
