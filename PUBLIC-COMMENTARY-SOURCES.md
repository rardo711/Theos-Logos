# Public Domain Commentary Sources

A comprehensive guide to free, public domain theological commentary resources that can be added to your Bible study application.

## Overview

All sources listed here are in the **public domain** (primarily pre-1928 works in the US) and are freely available online. These are legitimate, historical theological works that can be legally used in your application.

---

## 🔷 Medieval Scholastic Tradition

### Thomas Aquinas — Catena Aurea (Golden Chain) on the Gospels (1263)
**Coverage:** Matthew, Mark, Luke, John (verse-by-verse Patristic synthesis across all four Gospels)
**Tradition:** Medieval Scholastic / Patristic Retrieval
**Access:** Free, public domain

**Where to find:**
- CCEL: 
  - Volume 1 (Matthew): https://ccel.org/ccel/aquinas/catena1
  - Volume 2 (Mark): https://ccel.org/ccel/aquinas/catena2 (e.g. https://www.ccel.org/ccel/aquinas/catena2.iii.iv.html)
  - Volume 3 (Luke): https://ccel.org/ccel/aquinas/catena3 (e.g. https://www.ccel.org/ccel/aquinas/catena3.iii.i.html)
  - Volume 4 (John): https://ccel.org/ccel/aquinas/catena4 (e.g. https://www.ccel.org/ccel/aquinas/catena4.i.i.html)
- Internet Archive: "Catena Aurea Thomas Aquinas"

**Characteristics:** Exhaustive line-by-line synthesis of Greek and Latin Church Fathers (Chrysostom, Jerome, Augustine, Hilary, Cyril, Ambrose) compiled for Pope Urban IV. Widely respected in Reformed scholastic retrieval.

---

## 🔷 Reformed & Puritan Tradition

### Matthew Henry's Commentary (1706-1721)
**Coverage:** Complete Bible
**Tradition:** Reformed/Puritan
**Access:** Free at multiple sources

**Where to find:**
- Christian Classics Ethereal Library: https://ccel.org/ccel/henry/mhc
- Bible Hub: https://biblehub.com/commentaries/mhc/
- Internet Archive: Search "Matthew Henry Commentary"

**Format:** Text, some sites offer structured JSON/XML

**Sample Entry:**
```json
{
  "reference": "Genesis 1:1",
  "tradition": "reformed",
  "author": "Matthew Henry",
  "source": "Commentary on the Whole Bible",
  "year": 1706,
  "text": "[Full commentary text]"
}
```

### John Calvin's Commentaries (1540-1564)
**Coverage:** Most of Old Testament, all of New Testament
**Tradition:** Reformed
**Access:** Free, public domain

**Where to find:**
- CCEL: https://ccel.org/ccel/calvin
- Sacred Texts: http://www.sacred-texts.com/chr/calvin/
- Archive.org: Search "Calvin Commentary"

**Notable works:**
- Commentary on a Harmony of the Evangelists (Matthew, Mark, Luke; 1555)
- Commentary on the Gospel according to John (1553)
- Commentary on Romans
- Commentary on Genesis
- Institutes of the Christian Religion (1559)

### Matthew Poole's Annotations upon the Holy Bible (1683–1685)
**Coverage:** Complete Bible (Matthew, Mark, Luke, John completed by Poole)
**Tradition:** Puritan / English Reformed
**Access:** Free, public domain

**Where to find:**
- CCEL: https://www.ccel.org/ccel/poole/annotations.html
- Bible Hub: https://biblehub.com/commentaries/poole/

**Characteristics:** Scholarly, lucid, rigorous Puritan exposition reconciling difficult texts and refuting Socinian, Arminian, and Roman errors while drawing upon Hebrew and Greek idioms. Covers Matthew, Mark, Luke, and John.

### Charles Spurgeon's Works (1850s-1890s)
**Coverage:** Selective passages
**Tradition:** Reformed Baptist
**Access:** Free, public domain (died 1892)

**Where to find:**
- Spurgeon Gems: https://www.spurgeongems.org/
- The Spurgeon Archive: https://archive.spurgeon.org/
- Internet Archive: "Metropolitan Tabernacle Pulpit"

**Key resources:**
- Treasury of David (Psalms) - Complete
- Metropolitan Tabernacle Pulpit (Sermons on various texts)

### John Gill's Exposition (1746-1763)
**Coverage:** Complete Bible
**Tradition:** Reformed Baptist
**Access:** Free, comprehensive

**Where to find:**
- Bible Hub: https://biblehub.com/commentaries/gill/
- StudyLight: https://www.studylight.org/commentaries/eng/geb.html

**Characteristics:** Very detailed, doctrinally sound, sometimes verbose

### John Owen's Works (1600s)
**Coverage:** Hebrews (extensive), selective other books
**Tradition:** Puritan/Reformed
**Access:** Free

**Where to find:**
- CCEL: https://ccel.org/ccel/owen
- Monergism: https://www.monergism.com/thethreshold/sdg/owen.html

**Notable:** "Exposition of Hebrews" is exhaustive and excellent

---

## ⚠️ Attribution Cautions

Sources that are easy to cite wrongly. Each of these has already produced a
bad card on this desk.

### Luther on the Sermon on the Mount (1532)

**Do not cite** `ccel.org/ccel/luther/good_works/good_works.ii.html` for this.
That path is the *Treatise on Good Works* (1520), a different work of twelve
years earlier. The Sermon on the Mount material is the 1530–32 Wittenberg
weekday sermons on Matthew 5–7 (*Wochenpredigten über Matth. 5–7*, WA 32).

- **Public domain:** the German and Latin text, and the 1892 Charles A. Hay
  translation in print.
- **Not public domain:** the widely quoted *Luther's Works* vol. 21 rendering
  (Fortress Press).
- **Status here:** `RECEPTION_SOURCES` carries the work with a `sourceNote`
  and **no `sourceUrl`**, because no public-domain edition has been verified.

### Volume index pages are not commentary

CCEL and New Advent serve tables of contents at URLs that look like content:

| Looks like | Actually is |
|---|---|
| `ccel.org/ccel/schaff/npnf110.html` | NPNF 1/10 volume index |
| `ccel.org/ccel/schaff/npnf106.html` | NPNF 1/6 volume index |
| `ccel.org/ccel/aquinas/catena3.html` | *Catena Aurea* volume root |
| `ccel.org/ccel/poole/annotations.html` | Poole's index page |
| `ccel.org/ccel/calvin/calcom31/calcom31.i.html` | Harmony vol. 1 title page |

Fetching one of these returns a preface or a contents list, which the desk
then presents as commentary on the verse. 43 catalog rows and 49 curated
citations pointed at pages of this kind before they were removed. A test now
rejects them.

### Calvin on CCEL is split by pericope, not by chapter

`calcom38.xiii.i.html` is Romans **9:1–5**, not Romans 9. A row scoped to the
whole chapter answers for verses the page never reaches. Rows covering one
pericope carry a `verses` range so the scorer can drop them for other verses.

### Aquinas: two different works

The *Catena Aurea* is a **compilation** — Aquinas chaining Greek and Latin
fathers verse by verse. Attribute those excerpts to the father being quoted,
not to Aquinas. His own voice is in the lecture commentaries (*Super Epistolam
ad Romanos*, *Super Evangelium S. Ioannis*), which are separate works.

### Wesley's Notes are substantially Bengel

Wesley states in his own preface to the *Explanatory Notes upon the New
Testament* (1754) that he drew heavily on Bengel's *Gnomon Novi Testamenti*
(1742) — for long stretches, especially the more exegetical notes, Wesley is
translating and condensing Bengel rather than writing independently. Bengel
is already indexed on this desk (Bible Hub, `commentaries/bengel/`), so
indexing more of Wesley mostly re-serves a voice already present under a
different name. Cite Wesley for what is distinctively his — the Arminian
readings (perseverance, Christian perfection, the predestination texts) —
not as a general-purpose second voice on every verse. See the Wesleyan /
Arminian Tradition section below for the source substituted in its place.

---

## 🔶 Patristic Sources (Church Fathers)

### Early Church Fathers Collection
**Coverage:** Selective passages, theological discussions
**Period:** 100-500 AD
**Tradition:** Patristic
**Access:** Free, organized by author and topic

**Where to find:**
- New Advent: https://www.newadvent.org/fathers/
- CCEL: https://ccel.org/fathers
- Internet Archive: "Ante-Nicene Fathers" & "Nicene and Post-Nicene Fathers"

**Key Authors:**
1. **Augustine of Hippo** (354-430)
   - City of God
   - On the Trinity
   - Tractates on the Gospel of John (In Joannis Evangelium Tractatus)
   - Expositions on the Psalms
   - On the Predestination of the Saints
   - Against Pelagius

2. **John Chrysostom** (347-407)
   - Homilies on Matthew
   - Homilies on the Gospel of St. John
   - Homilies on Romans
   - Homilies on Hebrews
   - Extensive preaching commentary

3. **Cyril of Alexandria** (376-444)
   - Commentary on the Gospel of Saint Luke (Homilies on Luke; Syriac MS trans. R. Payne Smith; tertullian.org)
   - Commentary on the Gospel of Saint John

4. **Ambrose of Milan** (339-397)
   - Exposition of the Holy Gospel according to Saint Luke (Expositio Evangelii secundum Lucam)
   - Hexameron
   - Theological and sacramental treatises

5. **Athanasius** (296-373)
   - Against the Arians
   - On the Incarnation
   - Doctrinal works with Scripture exposition

6. **Jerome** (347-420)
   - Commentary on various books
   - Translator of the Vulgate
   - Letters with scriptural exposition

5. **Basil the Great** (330-379)
   - Hexaemeron (On the Six Days of Creation)
   - On the Holy Spirit

6. **Gregory of Nazianzus** (329-390)
   - Theological Orations
   - Various sermons

7. **Ambrose** (340-397)
   - Hexameron
   - Various ethical and doctrinal treatises

8. **Irenaeus** (130-202)
   - Against Heresies (extensive Scripture use)

9. **Tertullian** (155-220)
   - Various apologetic works with Scripture

10. **Origen** (184-253)
    - Commentaries on various books
    - *Note: Use with discernment; some views later rejected*

**Collection Resources:**
- **Ante-Nicene Fathers** (10 volumes) - Fathers before Nicaea (325 AD)
- **Nicene and Post-Nicene Fathers Series I** (14 volumes) - Augustine, Chrysostom, etc.
- **Nicene and Post-Nicene Fathers Series II** (14 volumes) - Eastern fathers

---

## 🔷 Additional Reformed Sources

### Albert Barnes' Notes (1834-1870)
**Coverage:** Complete New Testament, parts of Old Testament
**Tradition:** Presbyterian
**Access:** Free

**Where to find:**
- Bible Hub: https://biblehub.com/commentaries/barnes/
- StudyLight: https://www.studylight.org/commentaries/eng/bnb.html

**Characteristics:** Clear, practical, moderate Reformed

### Jamieson-Fausset-Brown Commentary (1871)
**Coverage:** Complete Bible
**Tradition:** Reformed/Presbyterian
**Access:** Free

**Where to find:**
- Bible Hub: https://biblehub.com/commentaries/jfb/
- StudyLight: https://www.studylight.org/commentaries/eng/jfb.html

---

## 🔥 Wesleyan / Arminian Tradition

The catalog otherwise has no non-Reformed Protestant voice: everything under
Reformed & Puritan, Additional Reformed, and the Lutheran confessional
sources reads the disputed texts (grace, election, perseverance) from one
side. Clarke is the one candidate that would actually change that, not just
add another name to the Reformed column — see the "Attribution Cautions"
section above on why John Wesley's own Notes don't do this as well as they
look like they should: he says in his own preface that he leaned heavily on
Bengel's Gnomon, which is already indexed.

### Adam Clarke's Commentary (1810-1826)
**Coverage:** Complete Bible
**Tradition:** Methodist/Arminian
**Access:** Free

**Where to find (unverified — see `scripts/research/scan-adam-clarke.mjs`):**
- CCEL: https://ccel.org/ccel/clarke/commentary
- Bible Hub: https://biblehub.com/commentaries/clarke/

Neither URL has been fetched from a session with real network access as of
this writing. The GitHub Actions research workflow
(`.github/workflows/reception-source-research.yml`) checks both, plus a
Godrules guess, and reports what actually resolves.

---

## 📚 How to Extract and Import Commentary

### Method 1: Manual Copy from Websites

1. Visit Bible Hub or similar site
2. Navigate to verse (e.g., biblehub.com/john/3-16.htm)
3. Find commentary section
4. Copy relevant portions
5. Format as JSON entry in `commentaries.json`

### Method 2: Web Scraping (Advanced)

For bulk importing, you can write a simple scraper:

```javascript
// Example scraper concept (requires implementation)
async function scrapeCommentary(reference, commentator) {
  const url = `https://biblehub.com/commentaries/${commentator}/${reference}.htm`;
  const response = await fetch(url);
  const html = await response.text();
  // Parse HTML to extract commentary text
  // Format as JSON
  return commentaryObject;
}
```

**Legal Note:** Always respect robots.txt and terms of service. For personal use only.

### Method 3: Download Complete Works

From Internet Archive or CCEL:
1. Download full text of commentary
2. Use text processing to extract relevant sections
3. Format into JSON structure
4. Import into `commentaries.json`

---

## 🌐 Online Commentary Aggregators

### Bible Hub
**URL:** https://biblehub.com
**Features:**
- Multiple commentaries side-by-side
- Easy verse-by-verse navigation
- Includes: Matthew Henry, Gill, Barnes, Clarke, JFB, and many others
- Free access, well-organized

### Study Light
**URL:** https://www.studylight.org
**Features:**
- Extensive commentary library
- Public domain works
- Easy to navigate by book/chapter/verse

### Bible Gateway (Limited)
**URL:** https://www.biblegateway.com
**Features:**
- Some public domain commentaries
- Matthew Henry available
- More limited than Bible Hub

---

## 📖 Systematic Theology Resources (Topical)

While not verse-by-verse commentary, these are invaluable for theological topics:

### Reformed Systematic Theologies
1. **Charles Hodge** - Systematic Theology (1872-1873)
2. **Louis Berkhof** - Systematic Theology (1938, may still be copyrighted)
3. **A.A. Hodge** - Outlines of Theology (1879)

### Confessions and Catechisms
1. **Westminster Confession** with Scripture proofs
2. **Westminster Larger/Shorter Catechisms**
3. **Heidelberg Catechism**
4. **Belgic Confession**
5. **Canons of Dort**

**Where to find:**
- CCEL: https://ccel.org
- Monergism: https://www.monergism.com

---

## 🛠️ Tools for Processing Commentary

### JSON Format Template

```json
{
  "reference": "Book Chapter:Verse",
  "tradition": "reformed|patristic|catholic|orthodox|mainline",
  "author": "Author Name",
  "source": "Book/Work Title",
  "year": 1706,
  "text": "Full commentary text here. Can be multiple paragraphs."
}
```

### Bulk Import Script Template

```javascript
// Save this as import-commentary.js
async function importFromFile(filename) {
  const fs = require('fs'); // Node.js
  const data = JSON.parse(fs.readFileSync(filename, 'utf8'));

  // Validate each entry
  const valid = data.every(entry =>
    entry.reference &&
    entry.author &&
    entry.text
  );

  if (valid) {
    // Merge with existing commentaries.json
    const existing = JSON.parse(fs.readFileSync('commentaries.json'));
    const merged = [...existing, ...data];
    fs.writeFileSync('commentaries.json', JSON.stringify(merged, null, 2));
    console.log(`Imported ${data.length} entries`);
  }
}
```

---

## 📋 Recommended Import Priority

Start with these for best coverage:

### Phase 1: Core Coverage
1. **Matthew Henry** - Complete Bible, excellent devotional commentary
2. **John Calvin** - Romans, John, Genesis (doctrinal foundation)
3. **Augustine** - Psalms, Romans passages (patristic foundation)
4. **Chrysostom** - John, Matthew (patristic preaching)

### Phase 2: Expansion
1. **John Gill** - Fill in gaps from Phase 1
2. **Spurgeon** - Psalms (Treasury of David) + favorite passages
3. **Barnes** - New Testament books not covered by Calvin

### Phase 3: Depth
1. **John Owen** - Hebrews (exhaustive)
2. **Additional church fathers** - Athanasius, Basil, Jerome
3. **Specific doctrinal passages** from systematic theologies

---

## ⚖️ Copyright Guidelines

### Safe to Use (Public Domain in US):
- Works published before 1928
- Church fathers (ancient)
- Reformers (16th-17th century)
- Most 18th-19th century works

### Be Careful:
- Works published 1928-present (may be copyrighted)
- Modern translations of ancient texts (translation may be copyrighted)
- Compilations and edited versions

### Fair Use Considerations:
- Personal study: Broad fair use
- Public distribution: More limited
- This app (personal use): Generally safe
- If sharing publicly: Stick to pre-1928 works

---

## 🔗 Quick Links to Get Started

1. **Matthew Henry Complete:** https://ccel.org/ccel/henry/mhc
2. **Calvin's Commentaries:** https://ccel.org/ccel/calvin
3. **Church Fathers:** https://www.newadvent.org/fathers/
4. **Spurgeon Archive:** https://archive.spurgeon.org/
5. **Bible Hub Multi-Commentary:** https://biblehub.com

---

## 📝 Example Workflow

1. **Choose a book** you're studying (e.g., Romans)
2. **Pick 2-3 commentators** (e.g., Calvin, Henry, Augustine)
3. **Go to Bible Hub:** https://biblehub.com/romans/8-28.htm
4. **Copy commentary** from each source
5. **Format as JSON** following template
6. **Add to commentaries.json**
7. **Refresh app** - commentary appears!

---

**Questions or need help finding specific sources? The resources above provide thousands of pages of high-quality, orthodox, public domain commentary ready to enhance your theological study!**
