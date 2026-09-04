import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  hasLongQuotedSpan,
  hasUrl,
  orientationSystem,
  orientationUser,
  parseOrientation,
} from "./orient.ts";

const good = JSON.stringify({
  question:
    "Whether the choice announced before the twins are born is of individuals to salvation or of nations to historical role.",
  divides: [
    {
      tradition: "Reformed",
      position:
        "The clause turns on God's purpose according to election standing apart from works, which is read as unconditional and individual.",
    },
    {
      tradition: "Eastern Orthodox",
      position:
        "Read corporately and through foreknowledge, with Jacob and Esau standing for peoples whose histories God orders.",
    },
  ],
  read_next: ["Chrysostom, Homilies on Romans", "Calvin, Commentary on Romans"],
});

describe("parseOrientation", () => {
  test("accepts an orientation that names the question without quoting anyone", () => {
    const out = parseOrientation(good);
    assert.ok(out);
    assert.equal(out.divides.length, 2);
    assert.equal(out.readNext.length, 2);
    assert.match(out.question, /^Whether the choice/);
  });

  test("rejects a fabricated quotation", () => {
    // The failure this module exists to prevent: a sentence in a Father's
    // voice that was never fetched from any page.
    const raw = JSON.stringify({
      question: "What does election mean here?",
      divides: [
        {
          tradition: "Patristic",
          position:
            'Chrysostom writes, "God did not choose Jacob because of any merit foreseen, but that the purpose of God according to election might stand firm forever."',
        },
      ],
      read_next: [],
    });
    assert.equal(parseOrientation(raw), null);
  });

  test("allows a short quoted technical term", () => {
    const raw = JSON.stringify({
      question: 'The dispute turns on how "eph’ ho" in verse 12 is construed.',
      divides: [],
      read_next: [],
    });
    const out = parseOrientation(raw);
    assert.ok(out);
    assert.match(out.question, /eph/);
  });

  test("rejects an invented URL", () => {
    const raw = JSON.stringify({
      question: "What is at stake here?",
      divides: [],
      read_next: ["Calvin, Commentary on Romans, https://ccel.org/ccel/calvin/calcom38.html"],
    });
    assert.equal(parseOrientation(raw), null);
  });

  test("rejects an empty question", () => {
    // The model is told to return an empty question for a verse with no
    // interpretive history. That must produce no orientation at all.
    assert.equal(
      parseOrientation(JSON.stringify({ question: "", divides: [], read_next: [] })),
      null,
    );
  });

  test("rejects unparseable output", () => {
    assert.equal(parseOrientation("I'm sorry, I cannot help with that."), null);
  });

  test("caps the number of divides and works", () => {
    const raw = JSON.stringify({
      question: "A contested verse.",
      divides: Array.from({ length: 9 }, (_, i) => ({
        tradition: `T${i}`,
        position: `P${i}`,
      })),
      read_next: Array.from({ length: 9 }, (_, i) => `W${i}`),
    });
    const out = parseOrientation(raw);
    assert.ok(out);
    assert.equal(out.divides.length, 4);
    assert.equal(out.readNext.length, 5);
  });

  test("drops malformed divide rows rather than the whole response", () => {
    const raw = JSON.stringify({
      question: "A contested verse.",
      divides: [{ tradition: "Reformed" }, null, { tradition: "Lutheran", position: "Stated." }],
      read_next: [],
    });
    const out = parseOrientation(raw);
    assert.ok(out);
    assert.deepEqual(out.divides, [{ tradition: "Lutheran", position: "Stated." }]);
  });
});

describe("orientation guards", () => {
  test("hasLongQuotedSpan distinguishes a term from a sentence", () => {
    assert.equal(hasLongQuotedSpan('the word "katertismena" is passive'), false);
    assert.equal(
      hasLongQuotedSpan(
        '"He says that the vessels of wrath were fitted for destruction by their own choosing, not by God’s decree."',
      ),
      true,
    );
  });

  test("hasUrl catches bare hosts as well as schemes", () => {
    assert.equal(hasUrl("https://ccel.org/x"), true);
    assert.equal(hasUrl("www.newadvent.org/fathers"), true);
    assert.equal(hasUrl("Calvin, Commentary on Romans"), false);
  });
});

describe("orientation prompt", () => {
  test("forbids quotation, invented citations, and verdicts", () => {
    const sys = orientationSystem("en");
    assert.match(sys, /NO QUOTATION/);
    assert.match(sys, /NO INVENTED CITATIONS/);
    assert.match(sys, /NO VERDICT/);
    assert.match(sys, /fetched NOTHING/);
  });

  test("asks opposing traditions to be stated in their own categories", () => {
    assert.match(orientationSystem("en"), /OWN CATEGORIES/);
    assert.match(orientationSystem("en"), /Never a caricature/);
  });

  test("routes locale to the output language", () => {
    assert.match(orientationSystem("es"), /in Spanish/);
    assert.match(orientationSystem("en"), /in English/);
  });

  test("carries the verse and the reader's question into the user turn", () => {
    const user = orientationUser({
      reference: "Romans 9:11",
      verseText: "For the children being not yet born...",
      question: "Is this about nations or individuals?",
    });
    assert.match(user, /Romans 9:11/);
    assert.match(user, /children being not yet born/);
    assert.match(user, /nations or individuals/);
  });

  test("omits the question line when the reader only selected a verse", () => {
    const user = orientationUser({ reference: "Romans 9:11", verseText: "For the children..." });
    assert.doesNotMatch(user, /The reader asked/);
  });
});
