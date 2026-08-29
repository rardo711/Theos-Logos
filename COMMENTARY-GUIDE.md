# Commentary Guide

A guide for adding theological commentary sources to your Bible study application.

## Overview

The commentary system is designed to organize insights from multiple theological traditions:
- **Reformed**: Scholastics, dogmatics (Calvin, Spurgeon, Turretin, etc.)
- **Patristic**: Church Fathers (Augustine, Chrysostom, Jerome, etc.)
- **Catholic**: Roman Catholic theology (Aquinas, modern catechism, etc.)
- **Orthodox**: Eastern Orthodox tradition
- **Mainline Protestant**: Conservative mainline scholars

## Current Commentary Sources

The app includes sample commentary from:
- John Calvin (Reformed)
- Charles Spurgeon (Reformed)
- Martin Luther (Reformed)
- Augustine of Hippo (Patristic)
- John Chrysostom (Patristic)
- Jerome (Patristic)

## How to Add Commentary

### Option 1: Edit commentaries.json (Recommended)

1. Open `commentaries.json`
2. Add new entries following this format:

```json
{
  "reference": "Romans 8:28",
  "tradition": "reformed",
  "author": "John Calvin",
  "source": "Commentary on Romans",
  "year": 1540,
  "text": "Full commentary text here..."
}
```

**Fields:**
- `reference`: Bible reference (e.g., "Romans 8:28", "John 3:16")
- `tradition`: One of: `reformed`, `patristic`, `catholic`, `orthodox`, `mainline`
- `author`: Scholar or church father's name
- `source`: Book or work title
- `year`: Year written/published (number)
- `text`: The actual commentary (can be multiple paragraphs)

### Option 2: Edit app.js directly

In `app.js`, find the `loadCommentaryDatabase()` method (around line 808) and add entries to the array.

### Option 3: Use the API (Future)

```javascript
app.addCommentary({
  reference: "John 1:1",
  tradition: "patristic",
  author: "Athanasius",
  source: "Against the Arians",
  year: 356,
  text: "Your commentary text here..."
});
```

## Reference Format

### Exact Verse References
```
"John 3:16"
"Romans 8:28"
"Genesis 1:1"
```

### Verse Ranges (Coming Soon)
```
"Romans 8:28-30"
"John 3:16-21"
```

### Chapter References (Coming Soon)
```
"Psalm 23"
"Romans 8"
```

## Tradition Color Coding

Each tradition has unique colors for easy identification:

| Tradition | Light Mode | Dark Mode |
|-----------|------------|-----------|
| Reformed | Blue | Light Blue |
| Patristic | Orange | Light Orange |
| Catholic | Purple | Light Purple |
| Orthodox | Green | Light Green |
| Mainline | Pink | Light Pink |

## Sources to Consider Adding

### Reformed Tradition
- **John Calvin** - Institutes, Bible Commentaries
- **Charles Spurgeon** - Metropolitan Tabernacle Pulpit
- **Francis Turretin** - Institutes of Elenctic Theology
- **Herman Bavinck** - Reformed Dogmatics
- **B.B. Warfield** - Various works
- **John Owen** - Works (esp. on Hebrews)
- **Matthew Henry** - Commentary on the Whole Bible
- **R.C. Sproul** - Modern Reformed commentary
- **Westminster Standards** - Confession & Catechisms with proof texts

### Patristic Sources
- **Augustine of Hippo** - On the Trinity, City of God, Anti-Pelagian works
- **John Chrysostom** - Homilies on various books
- **Athanasius** - On the Incarnation, Against the Arians
- **Basil the Great** - On the Holy Spirit
- **Gregory of Nazianzus** - Theological Orations
- **Jerome** - Bible Commentaries
- **Ambrose** - Various works
- **Irenaeus** - Against Heresies
- **Cyril of Alexandria** - Christological works
- **Gregory the Great** - Morals on Job

### Catholic Sources
- **Thomas Aquinas** - Summa Theologica
- **Catechism of the Catholic Church** - Official teaching
- **Pope Benedict XVI** - Jesus of Nazareth series
- **Hans Urs von Balthasar** - Theological works
- **Ignatius of Loyola** - Spiritual Exercises

### Orthodox Sources
- **John of Damascus** - Exact Exposition of the Orthodox Faith
- **Maximus the Confessor** - Various works
- **Gregory Palamas** - Triads, theological works
- **Vladimir Lossky** - Mystical Theology
- **John Meyendorff** - Byzantine Theology

### Mainline Protestant
- **Karl Barth** - Church Dogmatics (neo-orthodox)
- **Dietrich Bonhoeffer** - Ethics, Christ the Center
- **C.S. Lewis** - Mere Christianity, Reflections on the Psalms
- **N.T. Wright** - New Testament commentary
- **Richard Hays** - Moral Vision of the NT

## Future: AI-Powered Commentary Synthesis

### Planned Features

1. **Comparative Analysis**
   - Ask: "What do different traditions say about justification?"
   - Get synthesized answer with sources from each tradition

2. **Topic-Based Search**
   - Search across all commentary for theological themes
   - "Find all commentary on the Trinity"
   - "What did the church fathers teach about grace?"

3. **AI Integration**
   - Use Claude API to synthesize commentary
   - Generate summaries of different perspectives
   - Cross-reference with your personal notes

### Technical Approach

```javascript
// Future API integration
async function synthesizeCommentary(topic, traditions = ['all']) {
  // 1. Gather relevant commentary from database
  const relevant = findCommentaryByTopic(topic, traditions);

  // 2. Send to Claude API for synthesis
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': 'your-api-key',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      messages: [{
        role: 'user',
        content: `Synthesize these commentaries on ${topic}: ${relevant}`
      }]
    })
  });

  // 3. Display synthesis with source citations
  return formatSynthesis(response);
}
```

## Data Structure for Advanced Features

### Topic Tagging (Future)
```json
{
  "reference": "Romans 8:28",
  "tradition": "reformed",
  "author": "John Calvin",
  "source": "Commentary on Romans",
  "year": 1540,
  "topics": ["providence", "predestination", "perseverance"],
  "text": "..."
}
```

### Cross-References (Future)
```json
{
  "reference": "Romans 8:28",
  "crossReferences": ["Romans 8:29-30", "Ephesians 1:11", "Philippians 1:6"],
  "text": "..."
}
```

## Best Practices

1. **Accuracy**: Always verify quotes against original sources
2. **Context**: Include enough context to understand the point
3. **Citations**: Provide full source information
4. **Balance**: Try to represent each tradition fairly
5. **Organization**: Use consistent reference formatting
6. **Length**: Keep entries focused (1-3 paragraphs ideal)

## Copyright Considerations

- Public domain works (pre-1928 in US) are safe to include
- Modern works may require permission or fall under fair use
- Academic commentary is often copyrighted
- Consider paraphrasing modern sources with attribution
- Your personal notes and synthesis are always safe

## Export/Import

### Export Commentary Database
```javascript
// In browser console:
const data = JSON.stringify(app.commentaries, null, 2);
const blob = new Blob([data], {type: 'application/json'});
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'my-commentaries.json';
a.click();
```

### Import Commentary
```javascript
// Load external JSON file
fetch('my-commentaries.json')
  .then(r => r.json())
  .then(data => {
    app.commentaries = data;
    app.renderCommentary();
  });
```

## Resources for Finding Commentary

### Online Sources
- **Internet Archive** (archive.org) - Public domain works
- **Christian Classics Ethereal Library** (ccel.org)
- **Early Church Fathers** (newadvent.org/fathers)
- **Calvin's Commentaries** (various sites)
- **Project Gutenberg** - Public domain books

### Print Resources
- **The Reformation Commentary on Scripture** series
- **Ancient Christian Commentary on Scripture** series
- **IVP Bible Background Commentary**
- **New International Commentary** series
- **Word Biblical Commentary** series

---

**Questions or suggestions?** The commentary system is designed to grow with your study. Start small and add sources as you discover them!
