# Public Domain Commentary Sources

A comprehensive guide to free, public domain theological commentary resources that can be added to your Bible study application.

## Overview

All sources listed here are in the **public domain** (primarily pre-1928 works in the US) and are freely available online. These are legitimate, historical theological works that can be legally used in your application.

---

## 🔷 Reformed Tradition

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
- Commentary on Romans
- Commentary on John
- Commentary on Genesis
- Institutes (theological, not commentary but invaluable)

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
   - Expositions on the Psalms
   - On the Predestination of the Saints
   - Against Pelagius

2. **John Chrysostom** (347-407)
   - Homilies on Matthew
   - Homilies on John
   - Homilies on Romans
   - Homilies on Hebrews
   - Extensive preaching commentary

3. **Athanasius** (296-373)
   - Against the Arians
   - On the Incarnation
   - Doctrinal works with Scripture exposition

4. **Jerome** (347-420)
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

### Adam Clarke's Commentary (1810-1826)
**Coverage:** Complete Bible
**Tradition:** Methodist/Arminian (not strictly Reformed but valuable)
**Access:** Free

**Where to find:**
- CCEL: https://ccel.org/ccel/clarke/commentary
- Bible Hub: https://biblehub.com/commentaries/clarke/

### Jamieson-Fausset-Brown Commentary (1871)
**Coverage:** Complete Bible
**Tradition:** Reformed/Presbyterian
**Access:** Free

**Where to find:**
- Bible Hub: https://biblehub.com/commentaries/jfb/
- StudyLight: https://www.studylight.org/commentaries/eng/jfb.html

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
