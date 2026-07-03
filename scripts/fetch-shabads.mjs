/**
 * fetch-shabads.mjs
 * ------------------
 * One-time / occasional build script. Walks every Ang (page) of Sri Guru
 * Granth Sahib Ji via the public GurbaniNow API, collects every unique
 * Shabad along with its Raag and Writer, merges in your own Taal mapping
 * (data/taal-mapping.json), and writes the result to src/data/shabads.json.
 *
 * Run it with:  npm run fetch-data
 */

import { writeFile, readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const API_BASE = 'https://api.gurbaninow.com/v2';
const TOTAL_ANGS = 1430; // Sri Guru Granth Sahib Ji has 1430 Angs
const CONCURRENCY = 8; // be a good citizen of a free public API
const OUT_FILE = path.join('src', 'data', 'shabads.json');
const TAAL_FILE = path.join('data', 'taal-mapping.json');

async function fetchAng(pageNum) {
  const res = await fetch(`${API_BASE}/ang/${pageNum}/G`);
  if (!res.ok) {
    throw new Error(`Ang ${pageNum} failed: HTTP ${res.status}`);
  }
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
    }));
}

async function withConcurrency(items, limit, worker) {
  const results = [];
  let i = 0;
  async function next() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await worker(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: limit }, next));
  return results;
}

async function main() {
  console.log(`Fetching ${TOTAL_ANGS} Angs from GurbaniNow (concurrency ${CONCURRENCY})...`);

  const pages = Array.from({ length: TOTAL_ANGS }, (_, i) => i + 1);
  const shabadMap = new Map();

  let done = 0;
  await withConcurrency(pages, CONCURRENCY, async (pageNum) => {
    try {
      const raw = await fetchAng(pageNum);
      const lines = extractLines(raw, pageNum);
      for (const l of lines) {
        if (!l.shabadId) continue;
        if (!shabadMap.has(l.shabadId)) {
          shabadMap.set(l.shabadId, {
            shabadId: l.shabadId,
            ang: l.ang,
            raag: l.raag,
            writer: l.writer,
            firstLine: l.gurmukhi,
            translationEn: l.translationEn,
            taal: null,
          });
        }
      }
    } catch (err) {
      console.error(`Skipping Ang ${pageNum}: ${err.message}`);
    } finally {
      done++;
      if (done % 50 === 0) console.log(`  ...${done}/${TOTAL_ANGS} Angs processed`);
    }
  });

  let taalMapping = {};
  try {
    const raw = await readFile(TAAL_FILE, 'utf-8');
    taalMapping = JSON.parse(raw);
  } catch {
    console.warn(`No taal mapping found at ${TAAL_FILE} — shabads will have taal: null until you add one.`);
  }

  let taalMatches = 0;
  for (const shabad of shabadMap.values()) {
    if (taalMapping[shabad.shabadId]) {
      shabad.taal = taalMapping[shabad.shabadId];
      taalMatches++;
    }
  }

  const shabads = Array.from(shabadMap.values()).sort((a, b) => a.ang - b.ang);

  await mkdir(path.dirname(OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify(shabads, null, 2), 'utf-8');

  console.log(`\nDone. Wrote ${shabads.length} unique shabads to ${OUT_FILE}`);
  console.log(`${taalMatches} of them have a Taal tag from ${TAAL_FILE}.`);
  console.log('Commit this file to git so the site builds without depending on the live API.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});