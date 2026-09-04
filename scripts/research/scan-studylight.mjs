/**
 * StudyLight.org is a candidate FIFTH host: it aggregates many public-domain
 * commentators (Gill, Barnes, Vincent's Word Studies, Robertson's Word
 * Pictures, the Pulpit Commentary, the Expositor's Greek Testament) on
 * per-chapter pages, the same shape Bible Hub already supplies for Gill,
 * Poole and Bengel — so it would slot into the existing generator pattern
 * rather than needing a new one.
 *
 * None of this is confirmed. The exact commentary codes and URL shape below
 * are recalled, not verified today, so this tries several plausible
 * combinations for one well-known verse and reports only what a real fetch
 * confirms. Nothing here should become a catalog row until a hit shows up.
 */
import { politeGet, extractHeadings } from "./lib/fetch.mjs";

const CODE_GUESSES = ["geb", "rwp", "bnb", "vws", "pet", "egt"];
const URL_SHAPES = (code) => [
  `https://www.studylight.org/commentaries/eng/${code}/romans-9.html`,
  `https://www.studylight.org/commentaries/${code}/romans/9.html`,
  `https://www.studylight.org/commentary/romans/9.html?commentary=${code}`,
];

export async function probeStudyLight() {
  const hits = [];
  const tried = [];
  for (const code of CODE_GUESSES) {
    for (const url of URL_SHAPES(code)) {
      tried.push(url);
      const res = await politeGet(url, { delayMs: 300 });
      if (res.ok) {
        hits.push({ code, url: res.url, headings: extractHeadings(res.text, 10) });
      }
    }
  }
  return { host: "studylight.org", generatedAt: new Date().toISOString(), tried: tried.length, hits };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = await probeStudyLight();
  console.log(JSON.stringify(result, null, 2));
}
