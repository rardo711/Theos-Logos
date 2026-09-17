import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  hasHebrewBdbChip,
  hebrewBdbAttribution,
  lookupHebrewBdbByGloss,
  lookupHebrewBdbByStrongs,
  lookupHebrewBdbWordNow,
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
