import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  hasHebrewBdbChip,
  hebrewBdbAttribution,
  lookupHebrewBdbByGloss,
  lookupHebrewBdbByStrongs,
  lookupHebrewBdbWordNow,
  strongsAttribution,
  verseSenseLine,
  clearestBlockGloss,
} from "./hebrew-bdb.ts";
import hebrewBdbJson from "./data/hebrew-bdb.json" with { type: "json" };

describe("hebrew BDB lexicon", () => {
  it("H7225 hero is the Strong's definition (BDB chain stays as fallback data)", () => {
    const hit = lookupHebrewBdbByStrongs("H7225");
    assert.ok(hit);
    assert.equal(hit?.strongs, "H7225");
    assert.equal(hit?.lemma, "רֵאשִׁית");
    assert.ok(hit?.strongsDefinition, "H7225 should carry a Strong's definition");
    assert.equal(hit?.gloss, hit?.strongsDefinition);
    assert.match(hit?.gloss ?? "", /first/i);
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

  it("H430 is elohim (God), not halal — Strong's hero, BDB chain intact", () => {
    const hit = lookupHebrewBdbByStrongs("H430");
    assert.ok(hit);
    assert.equal(hit?.lemma, "אֱלֹהִים");
    // The hero is now Strong's own definition; BDB's "rulers, judges" stays
    // in the BDB chain (headword gloss / sense glosses), not the hero.
    assert.ok(hit?.strongsDefinition, "H430 should carry a Strong's definition");
    assert.equal(hit?.gloss, hit?.strongsDefinition);
    assert.match(hit?.gloss ?? "", /God/);
    assert.ok(!/halal/i.test(hit?.gloss ?? ""));
    assert.equal(hit?.headwordGloss, "rulers, judges");
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
    // "utterance, oracle" is BDB's wording — it lives in the BDB chain now,
    // not the Strong's hero.
    assert.match(hit?.headwordGloss ?? "", /utterance, oracle/i);
  });

  it("H4853 splits the homographs: primary is utterance/oracle (BDB5391), H4853b is load/burden (BDB5390)", () => {
    const hit = lookupHebrewBdbByStrongs("H4853");
    assert.ok(hit);
    assert.match(hit?.headwordGloss ?? "", /utterance, oracle/i);
    assert.equal(hit?.splitKey, "H4853");
    assert.equal(hit?.isSplit, false);
    const split = lookupHebrewBdbByStrongs("H4853b");
    assert.ok(split);
    assert.match(split?.headwordGloss ?? "", /load, burden/i);
    assert.equal(split?.splitKey, "H4853b");
    assert.equal(split?.isSplit, true);
    // Plain canonical lookup still resolves to the primary.
    assert.equal(lookupHebrewBdbByStrongs("h4853")?.splitKey, "H4853");
  });

  it("Habakkuk 1:1 'saw' reaches H2372 via the see variant", () => {
    const hit = lookupHebrewBdbWordNow("saw", "Habakkuk 1:1");
    assert.ok(hit);
    assert.equal(hit?.strongs, "H2372");
    assert.equal(hit?.senseMatchedByReference, true);
  });

  it("homograph routing: 1 Samuel 2:29 with H1254 routes to H1254b (be fat)", () => {
    const hit = lookupHebrewBdbByStrongs("H1254", "1 Samuel 2:29");
    assert.ok(hit);
    assert.equal(hit?.splitKey, "H1254b");
    assert.equal(hit?.strongs, "H1254");
    assert.equal(hit?.isSplit, true);
    assert.equal(hit?.sec, "II");
    assert.equal(hit?.senseMatchedByReference, true);
    // Decision 1: the verse-matched BDB sense outranks Strong's on a split —
    // Strong's "to create" would be wrong on the "be fat" lexeme.
    assert.match(hit?.gloss ?? "", /fat/i);
    assert.equal(hit?.glossSource, "bdb");
    assert.ok(
      !(hit?.gloss ?? "").toLowerCase().includes("create"),
      "Strong's create-definition must not lead on H1254b",
    );
  });

  it("homograph routing: Genesis 2:4 with H1254 stays the create lexeme", () => {
    const hit = lookupHebrewBdbByStrongs("H1254", "Genesis 2:4");
    assert.ok(hit);
    assert.equal(hit?.splitKey, "H1254");
    assert.equal(hit?.isSplit, false);
    assert.equal(hit?.sec, "I");
    // Strong's own definition leads the hero on the primary.
    assert.match(hit?.gloss ?? "", /create/i);
    assert.equal(hit?.glossSource, "strongs");
    assert.equal(hit?.gloss, hit?.strongsDefinition);
  });

  it("homograph routing: plain H1254 (no verse) resolves to the primary", () => {
    const hit = lookupHebrewBdbByStrongs("H1254");
    assert.ok(hit);
    assert.equal(hit?.splitKey, "H1254");
    assert.equal(hit?.sec, "I");
    assert.match(hit?.headwordGloss ?? "", /shape, create/);
  });

  it("homograph routing: suffixed keys resolve directly", () => {
    for (const raw of ["H1254b", "H1254B", "h1254b", "H01254b"]) {
      const hit = lookupHebrewBdbByStrongs(raw);
      assert.ok(hit, raw);
      assert.equal(hit?.splitKey, "H1254b");
      assert.match(hit?.headwordGloss ?? "", /be fat/);
    }
  });

  it("H1101 splits mingle (BDB1138) from provender (BDB1140)", () => {
    const primary = lookupHebrewBdbByStrongs("H1101");
    assert.ok(primary);
    assert.match(primary?.headwordGloss ?? "", /mingle/);
    assert.equal(primary?.sec, "I");
    const split = lookupHebrewBdbByStrongs("H1101b");
    assert.ok(split);
    assert.match(split?.headwordGloss ?? "", /provender/);
    assert.equal(split?.sec, "II");
    // Sibling enumerator lists both under the same Strong's number.
    const sibs = (primary?.siblings ?? []).map((s) => s.key);
    assert.ok(sibs.includes("H1101") && sibs.includes("H1101b"));
  });

  it("H219 splits light (BDB243) from herb (BDB244): both carry their own refs", () => {
    const primary = lookupHebrewBdbByStrongs("H219");
    assert.ok(primary);
    assert.match(primary?.headwordGloss ?? "", /light/);
    assert.equal(primary?.sec, "I");
    const split = lookupHebrewBdbByStrongs("H219b", "Genesis 1:11");
    assert.ok(split);
    // Head-only BUT with its own verse references — a real lexeme entry,
    // not a stub: it resolves directly to its own card.
    assert.equal(split?.splitKey, "H219b");
    assert.equal(split?.sec, "II");
    assert.match(split?.headwordGloss ?? "", /herb/);
    assert.equal(split?.senseMatchedByReference, true);
  });

  it("head-only stubs redirect to the primary and stay in the disclosure", () => {
    const hit = lookupHebrewBdbByStrongs("H369b");
    assert.ok(hit);
    // Stubs never render as their own card: redirect to the primary.
    assert.equal(hit?.splitKey, "H369");
    assert.equal(hit?.redirectedFromStub, "H369b");
    // But the lexeme stays visible in the primary's related-lexemes disclosure.
    const sib = (hit?.siblings ?? []).find((s) => s.key === "H369b");
    assert.ok(sib);
    assert.equal(sib?.stub, true);
  });

  it("H4116 splits hasten from the under-review second lexeme", () => {
    const primary = lookupHebrewBdbByStrongs("H4116");
    assert.ok(primary);
    assert.match(primary?.headwordGloss ?? "", /hasten/);
    const split = lookupHebrewBdbByStrongs("H4116b");
    assert.ok(split);
    assert.equal(split?.needsReview, true);
    assert.match(split?.needsReviewReason ?? "", /head paragraphs|homograph/);
  });

  it("all 8618 canonical Strong's numbers still resolve", () => {
    const by = (hebrewBdbJson as { by: Record<string, unknown> }).by;
    const canonical = Object.keys(by).filter((id) => /^H\d+$/.test(id));
    assert.equal(canonical.length, 8618);
    for (const id of canonical) {
      assert.ok(
        lookupHebrewBdbByStrongs(id),
        `canonical Strong's number no longer resolves: ${id}`,
      );
    }
  });

  it("the 62 hand-review rows stay traceable: needsReview on the entry or its seeAlso target", () => {
    const by = (
      hebrewBdbJson as {
        by: Record<
          string,
          { s?: string; needsReview?: boolean; seeAlso?: string[] }
        >;
      }
    ).by;
    const handIds = [
      "H8", "H1167", "H1197", "H1254", "H1984", "H2151", "H2342", "H2470",
      "H2490", "H2502", "H2505", "H2603", "H2617", "H2763", "H2764", "H2790",
      "H3068", "H3069", "H3373", "H3581", "H3588", "H3722", "H4116", "H4229",
      "H4482", "H4541", "H4794", "H4835", "H4888", "H4994", "H5035", "H5090",
      "H5257", "H5493", "H5494", "H5608", "H5646", "H5674", "H5800", "H6031",
      "H6213", "H6327", "H6331", "H6544", "H6565", "H6601", "H6692", "H6731",
      "H6732", "H6957", "H7136", "H7203", "H7235", "H7489", "H7503", "H7605",
      "H7673", "H7845", "H7931", "H7933", "H7999", "H9003",
    ];
    assert.equal(handIds.length, 62);
    for (const hid of handIds) {
      const entries = Object.values(by).filter((e) => e.s === hid);
      assert.ok(entries.length > 0, `${hid} has no entries`);
      const flaggedHere = entries.some((e) => e.needsReview);
      const targets = entries.flatMap((e) => e.seeAlso ?? []);
      const flaggedViaTarget = targets.some((t) => by[t]?.needsReview);
      assert.ok(
        flaggedHere || flaggedViaTarget,
        `${hid}: needsReview flag lost after the split`,
      );
    }
  });

  it("H1254 stays create-first after the homograph merge (not be fat)", () => {
    const hit = lookupHebrewBdbByStrongs("H1254");
    assert.ok(hit);
    // Strong's own definition leads the hero: "to create, shape, form".
    assert.match(hit?.gloss ?? "", /create/i);
    assert.ok(!(hit?.gloss ?? "").toLowerCase().startsWith("be fat"));
    assert.equal(hit?.gloss, hit?.strongsDefinition);
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

  it("H8 is destruction only (BDB7); the אָבַד verb article lives at H6 via seeAlso", () => {
    const hit = lookupHebrewBdbByStrongs("H8");
    assert.ok(hit);
    assert.equal(hit?.lemma, "אֹבֵד");
    assert.match(hit?.headwordGloss ?? "", /^destruction/);
    // No verb senses leak in: exactly one noun sense block.
    assert.equal(hit?.senses.length, 1);
    assert.ok(!(hit?.headwordGloss ?? "").includes("perish"));
    assert.ok((hit?.seeAlso ?? []).includes("H6"));
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

  it("Meaning hero is the Strong's definition; the verse nuance stays in the sense line", () => {
    const hit = lookupHebrewBdbByStrongs("H1254", "Genesis 2:4");
    assert.ok(hit);
    assert.equal(hit?.senseMatchedByReference, true);
    // The hero is the dictionary definition (Strong's), verse-independent;
    // the verse-pinned BDB nuance ("be created:") is the one-liner.
    assert.ok(hit?.strongsDefinition, "H1254 should carry a Strong's definition");
    assert.equal(hit?.gloss, hit?.strongsDefinition);
    assert.match(hit?.gloss ?? "", /create/i);
    assert.equal(hit?.senseLine, "be created:");
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

describe("Strong's concise definitions", () => {
  it("H2377 ships Strong's definition verbatim as the Meaning hero", () => {
    const hit = lookupHebrewBdbByStrongs("H2377");
    assert.ok(hit);
    assert.equal(hit?.strongs, "H2377");
    assert.ok(
      (hit?.strongsDefinition ?? "").startsWith(
        "a sight (mentally), i.e. a dream, revelation, or oracle",
      ),
      `unexpected Strong's text: ${hit?.strongsDefinition}`,
    );
    assert.equal(hit?.gloss, hit?.strongsDefinition);
    // BDB's own wording is untouched and still present underneath.
    assert.equal(hit?.headwordGloss, "vision");
    assert.equal(hit?.senseLine, "vision");
  });

  it("coverage: nearly every entry carries a Strong's definition", () => {
    const by = (
      hebrewBdbJson as {
        by: Record<string, { sd?: string; s?: string; stub?: boolean }>;
      }
    ).by;
    const ids = Object.keys(by);
    const canonical = ids.filter((id) => /^H\d+$/.test(id));
    const splits = ids.filter((id) => /^H\d+[b-z]$/.test(id));
    assert.equal(canonical.length, 8618);
    // Pinned after the split import's reported count: every canonical
    // Strong's number keeps its own entry, plus the homograph splits.
    assert.ok(
      ids.length > 9000,
      `expected > 9000 entries, got ${ids.length}`,
    );
    assert.ok(splits.length > 0, "expected homograph split entries");
    const withSd = ids.filter((id) => by[id].sd);
    // Pinned after the import's reported count; the import itself refuses
    // to ship a thin layer (< 8500 parsed definitions).
    assert.ok(
      withSd.length >= 8550,
      `only ${withSd.length}/${ids.length} entries have a Strong's definition`,
    );
    // Every stub is head-only behind a primary; every split carries its
    // canonical Strong's number.
    for (const id of splits) {
      assert.match(by[id].s ?? "", /^H\d+$/);
    }
    for (const id of ids.filter((i) => by[i].stub)) {
      assert.match(by[id].s ?? "", /^H\d+$/);
    }
  });

  it("entries without a Strong's definition fall back to the BDB hero", () => {
    const by = (
      hebrewBdbJson as { by: Record<string, { sd?: string }> }
    ).by;
    const missing = Object.keys(by).filter((id) => !by[id].sd);
    // Vacuous if Strong's ever reaches 100% coverage; the coverage test
    // above pins the count either way.
    for (const id of missing.slice(0, 25)) {
      const hit = lookupHebrewBdbByStrongs(id);
      assert.ok(hit, `${id} lookup failed`);
      assert.equal(hit?.strongsDefinition, "");
      assert.ok(hit?.gloss, `${id} fallback hero is empty`);
      assert.notEqual(hit?.gloss, "", `${id} hero should be the BDB chain`);
    }
  });

  it("Strong's layer is attributed separately from BDB", () => {
    assert.match(strongsAttribution, /Strong/);
    assert.match(strongsAttribution, /1890/);
    assert.match(strongsAttribution, /public domain/i);
    assert.match(hebrewBdbAttribution, /Brown-Driver-Briggs/);
    const top = hebrewBdbJson as {
      strongsSource?: string;
      strongsLicense?: string;
      provenance?: string;
    };
    assert.ok(
      top.strongsSource?.includes("openscriptures/strongs"),
      `strongsSource: ${top.strongsSource}`,
    );
    assert.equal(top.strongsLicense, "Public domain");
    assert.match(top.provenance ?? "", /openscriptures\/strongs/);
  });

  it("no Strong's definition carries markup or entity artifacts", () => {
    const by = (
      hebrewBdbJson as { by: Record<string, { sd?: string }> }
    ).by;
    let checked = 0;
    for (const [id, e] of Object.entries(by)) {
      if (!e.sd) continue;
      assert.equal(e.sd, e.sd.trim(), `${id} sd not trimmed`);
      assert.ok(!/<[A-Za-z][^>]*>/.test(e.sd), `${id} tag remnant: ${e.sd.slice(0, 70)}`);
      assert.ok(!/&(?:amp|lt|gt|quot|#39);/.test(e.sd), `${id} entity remnant: ${e.sd.slice(0, 70)}`);
      assert.ok(!e.sd.includes("\\"), `${id} backslash: ${e.sd.slice(0, 70)}`);
      checked++;
    }
    assert.ok(checked >= 8550, `only checked ${checked} Strong's definitions`);
  });
});
