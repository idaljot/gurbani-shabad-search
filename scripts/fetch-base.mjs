/**
 * fetch-base.mjs
 * ------------------
 * Crawls the GurbaniNow API for every shabad's Ang/Raag/Writer/text across
 * all configured sources (Guru Granth Sahib Ji, Sri Dasam Granth, Vaaran
 * Bhai Gurdas Ji, Bhai Nand Lal Ji's four works) and writes the result —
 * everything EXCEPT notation — to src/data/shabads-base.json.
 *
 * Gurbani text itself never changes, so this only needs to run when a
 * source is added or something about the crawl changes — maybe once a
 * year, not for routine notation updates. For those, see fetch-notation.mjs
 * (or `npm run publish-notation`), which reads the file this script
 * produces and merges in Sur/Taal/Alaap/Key from the Sheet without
 * touching this API at all.
 *
 * Run it with:  npm run fetch-base
 */

import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import pkg from 'gurmukhi-utils';
const { firstLetters } = pkg;
const API_BASE = 'https://api.gurbaninow.com/v2';
const CONCURRENCY = 8;
const OUT_FILE = path.join('src', 'data', 'shabads-base.json');

// Ang counts confirmed via each source's `source.length` field
// (curl https://api.gurbaninow.com/v2/ang/1/<code>, or for sourceId-based
// entries below, curl "https://api.gurbaninow.com/v2/ang/1?source=<id>").
// Different sources have different lengths — do not assume 1430 for all of them.
const SOURCES = [
  { code: 'G', name: 'Guru Granth Sahib Ji', angs: 1430 },
  { code: 'D', name: 'Sri Dasam Granth', angs: 1428 },
  { code: 'B', name: 'Vaaran Bhai Gurdas Ji', angs: 41 },
  // Bhai Nand Lal Ji has no single composition in the API and no letter
  // `code` — each of his four works is its own numeric source id, reachable
  // only via /v2/ang/<page>?source=<id> (confirmed by probing ids 1-30).
  // There's no "Vaaran" among them (that's Bhai Gurdas Ji's genre, above);
  // all four are pulled and merged under one shared `name` so the site's
  // Source filter shows a single "Bhai Nand Lal Ji" option rather than four.
  // Ang numbers restart at 1 within each underlying composition, so they
  // aren't globally unique across this merged source — an accepted nuance
  // of combining four distinct works under one filter, per request.
  { sourceId: 5, name: 'Bhai Nand Lal Ji', angs: 65 }, // Ghazals (Diwan-e-Goya)
  { sourceId: 6, name: 'Bhai Nand Lal Ji', angs: 1 }, // Zindagi Nama
  { sourceId: 7, name: 'Bhai Nand Lal Ji', angs: 10 }, // Ganj Nama
  { sourceId: 8, name: 'Bhai Nand Lal Ji', angs: 2 }, // Jot Bigas
  // Easy to add later — confirm each source's ang count first:
  // { code: 'A', name: 'Amrit Keertan', angs: 0 },
  // { code: 'U', name: 'Uggardanti', angs: 0 },
];

async function fetchAng(pageNum, source) {
  // Most sources have a short letter `code` usable as a path segment; a few
  // (the four Bhai Nand Lal Ji works) only have a numeric source id, which
  // the API takes as a query param instead — confirmed by probing directly.
  const url = source.code
    ? `${API_BASE}/ang/${pageNum}/${source.code}`
    : `${API_BASE}/ang/${pageNum}?source=${source.sourceId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Ang ${pageNum} failed: HTTP ${res.status}`);
  return res.json();
}

function extractLines(raw, pageNum) {
  const pageArr = raw?.page;
  if (!Array.isArray(pageArr)) {
    console.error(`\nCould not find a page array on Ang ${pageNum}. Raw shape was:`);
    console.error(JSON.stringify(raw, null, 2).slice(0, 2000));
    throw new Error('Unrecognized API response shape — see printed sample above.');
  }
  return pageArr
    .map((item) => item.line)
    .filter(Boolean)
    .map((line) => ({
      shabadId: line.shabadid,
      ang: line.pageno ?? pageNum,
      raag: line.raag?.english ?? 'Unknown',
      writer: line.writer?.english ?? 'Unknown',
      gurmukhi: line.gurmukhi?.unicode ?? '',
      translationEn: line.translation?.english?.default ?? '',
      // The API's line `type` marks structural roles; type 3 is rahaao
      // (confirmed by inspecting real angs — rahaao is always a 2-line
      // couplet, both lines carry type 3, only the second literally ends
      // in "ਰਹਾਉ"). Other structural labels (Paudi/Salok/Dohra headers)
      // share type 4 with ordinary body lines, so they aren't detectable
      // via `type` — see isFillerLine below for the text-based fallback.
      type: line.type,
    }));
}

// Lines the API marks type 4 (ordinary body text) but that are actually
// structural labels rather than real Gurbani content, e.g. "ਪਉੜੀ ੧੯"
// (Paudi 19), "ਦੋਹਰਾ" (Dohra), "ਸਲੋਕੁ" (Salok) headers. These caused an
// earlier bug where search previews showed the label instead of real text.
const FILLER_PREFIXES = ['ਪਉੜੀ', 'ਸਲੋਕ', 'ਦੋਹਰਾ', 'ਦੋਹਾ'];
function isFillerLine(text) {
  const t = (text || '').trim();
  if (!t) return true;
  if (t.includes('ਮਹਲਾ')) return true;
  if (t === 'ੴ ਸਤਿਗੁਰ ਪ੍ਰਸਾਦਿ ॥') return true;
  const firstWord = t.split(/\s+/)[0] || '';
  if (FILLER_PREFIXES.some((p) => firstWord.startsWith(p))) return true;
  return false;
}

async function withConcurrency(items, limit, worker) {
  let i = 0;
  async function next() {
    while (i < items.length) {
      const idx = i++;
      await worker(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: limit }, next));
}

async function main() {
  const shabadMap = new Map();
  let collisions = 0;

  for (const source of SOURCES) {
    const sourceLabel = source.code || `source=${source.sourceId}`;
    console.log(`\nFetching ${source.angs} Angs of ${source.name} (${sourceLabel}), concurrency ${CONCURRENCY}...`);

    const pages = Array.from({ length: source.angs }, (_, i) => i + 1);

    // Fetch concurrently for speed, but DON'T merge each Ang's lines into
    // shabadMap as soon as its fetch resolves — parallel requests complete
    // in nondeterministic order, and a shabad whose lines span an Ang
    // boundary (e.g. shabad EWS, whose first 5 lines are on Ang 2 and whose
    // final line is the first line of Ang 3) would get assembled out of
    // order depending purely on network timing. Two runs of an identical
    // crawl disagreed on ~800 shabads for exactly this reason.
    //
    // Instead, stash each Ang's already-extracted lines indexed by page
    // number, then merge them into shabadMap in a second pass, strictly in
    // ascending Ang order (below) — regardless of which fetch actually
    // finished first. Within a single Ang's response the API's own array
    // order is the reading order and is stable across repeated fetches
    // (verified directly against the live API); a per-line `lineno` field
    // exists but ties across sub-tuks of the same printed line, so it can't
    // serve as a full sort key on its own — ascending-Ang merge order
    // combined with each Ang's already-correct internal order is what
    // actually makes the assembly deterministic.
    const pageResults = new Array(pages.length);
    let done = 0;
    await withConcurrency(pages, CONCURRENCY, async (pageNum) => {
      try {
        const raw = await fetchAng(pageNum, source);
        pageResults[pageNum - 1] = extractLines(raw, pageNum);
      } catch (err) {
        console.error(`Skipping ${source.name} Ang ${pageNum}: ${err.message}`);
        pageResults[pageNum - 1] = [];
      } finally {
        done++;
        if (done % 100 === 0) console.log(`  ...${done}/${source.angs} Angs processed`);
      }
    });

    for (const lines of pageResults) {
      for (const l of lines) {
        if (!l.shabadId) continue;
        const existing = shabadMap.get(l.shabadId);
        if (existing && existing.source !== source.name) {
          // Shabad IDs were sampled and found unique across sources, but the
          // full crawl covers many more angs than that sample — guard against
          // silently merging two different shabads from different sources.
          collisions++;
          console.warn(
            `\nWARNING: shabad ID ${l.shabadId} appears in both "${existing.source}" and "${source.name}" — skipping the second occurrence to avoid corrupting data.`
          );
          continue;
        }
        if (!existing) {
          shabadMap.set(l.shabadId, {
            shabadId: l.shabadId,
            source: source.name,
            ang: l.ang,
            raag: l.raag,
            writer: l.writer,
            textLines: [],
            lineTypes: [],
          });
        }
        // Append every line's text (full shabad, in order), alongside its
        // API `type` so rahaao (type 3) can be identified later.
        const entry = shabadMap.get(l.shabadId);
        entry.textLines.push(l.gurmukhi);
        entry.lineTypes.push(l.type);
      }
    }
  }

  if (collisions > 0) {
    console.warn(`\n${collisions} cross-source shabad ID collision(s) detected — see warnings above.`);
  }

  // Precompute per-line first-letters so search results can show the matched
  // line (not always the first line of the shabad), and mark rahaao lines
  // (API type 3) so previews can prefer the refrain over a random opening line.
  for (const shabad of shabadMap.values()) {
    shabad.lines = shabad.textLines.map((line, i) => ({
      t: line,
      fl: firstLetters(line),
      r: shabad.lineTypes[i] === 3,
    }));
    shabad.firstLine = shabad.textLines[0] || '';

    // Paudis (and other rahaao-less compositions) read better previewed by
    // their closing line — usually the couplet's payoff — than by whichever
    // line happens to come first after the "ਪਉੜੀ ੧੯"-style label.
    const rahaaoLine = shabad.lines.find((l) => l.r);
    const lastRealLine = shabad.textLines.findLast((t) => !isFillerLine(t));
    shabad.previewLine = (rahaaoLine && rahaaoLine.t) || lastRealLine || shabad.firstLine || '';

    delete shabad.lineTypes;
  }

  const shabads = Array.from(shabadMap.values()).sort((a, b) => a.ang - b.ang);

  await mkdir(path.dirname(OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify(shabads), 'utf-8');

  console.log(`\nDone. Wrote ${shabads.length} unique shabads (base text only, no notation) to ${OUT_FILE}`);
  console.log('Run `npm run fetch-notation` (or `npm run publish-notation`) next to merge in Sur/Taal/Alaap/Key from the Sheet and produce shabads.json.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
