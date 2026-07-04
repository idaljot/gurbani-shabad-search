/**
 * fetch-shabads.mjs
 * ------------------
 * Build script. Walks every Ang of each configured source (Guru Granth Sahib,
 * Dasam Granth, Vaaran Bhai Gurdas, ...) via the public GurbaniNow API,
 * collects every unique Shabad with its full text, Raag, Writer, and
 * precomputed first-letters (for roman->gurmukhi search), then merges in
 * Sur/Taal notation from your published Google Sheet.
 *
 * Run it with:  npm run fetch-data
 */

import { writeFile, readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import pkg from 'gurmukhi-utils';
const { firstLetters, toUnicode } = pkg;
const API_BASE = 'https://api.gurbaninow.com/v2';
const CONCURRENCY = 8;
const OUT_FILE = path.join('src', 'data', 'shabads.json');

// Ang counts confirmed via each source's `source.length` field
// (curl https://api.gurbaninow.com/v2/ang/1/<code>). Different sources have
// different lengths — do not assume 1430 for all of them.
const SOURCES = [
  { code: 'G', name: 'Guru Granth Sahib Ji', angs: 1430 },
  { code: 'D', name: 'Sri Dasam Granth', angs: 1428 },
  { code: 'B', name: 'Vaaran Bhai Gurdas Ji', angs: 41 },
  // Easy to add later — confirm each source's ang count first:
  // { code: 'N', name: 'Bhai Nand Lal Ji', angs: 0 },
  // { code: 'A', name: 'Amrit Keertan', angs: 0 },
  // { code: 'U', name: 'Uggardanti', angs: 0 },
];

// Your published Google Sheet (Form responses), CSV format.
const SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vSUXqLcvoPkqgjSZVF5loJYuOHIwuJ_pS8sOZisOWydQCLXTL1kG2r3t4hiTQIpIloGGUAH4b_-srgH/pub?output=csv';

async function fetchAng(pageNum, sourceCode) {
  const res = await fetch(`${API_BASE}/ang/${pageNum}/${sourceCode}`);
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
    }));
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

/**
 * Minimal CSV parser that correctly handles quoted fields containing commas
 * and newlines (notation blocks are multi-line, so this matters).
 */
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\r') { /* ignore */ }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
      else field += c;
    }
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  return rows;
}

/**
 * Fetches the notation sheet and returns a map: shabadId -> {taal, tempo, sthayi, antara}.
 * Matches columns by header NAME (not position), so reordering form fields won't break it.
 * If the sheet can't be reached, returns null so the caller can fall back to existing data.
 */
async function fetchNotation() {
  let text;
  try {
    const res = await fetch(SHEET_CSV_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    text = await res.text();
  } catch (err) {
    console.warn(`\nCould not fetch notation sheet (${err.message}).`);
    return null;
  }

  const rows = parseCSV(text);
  if (rows.length === 0) return {};

  const header = rows[0].map((h) => h.trim().toLowerCase());
  const col = (name) => header.findIndex((h) => h.includes(name));
  const idCol = col('shabad id');
  const sthayiCol = col('sthayi');
  const antaraCol = col('antara');
  const taalCol = col('taal');
  const tempoCol = col('tempo');
  const timestampCol = col('timestamp');

  if (idCol === -1) {
    console.warn('\nNotation sheet has no "Shabad ID" column — skipping notation merge.');
    return {};
  }

  const map = {};
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const id = (row[idCol] || '').trim();
    if (!id) continue;
    // Last submission wins if the same shabad is submitted more than once.
    map[id] = {
      sthayi: sthayiCol !== -1 ? (row[sthayiCol] || '') : '',
      antara: antaraCol !== -1 ? (row[antaraCol] || '') : '',
      taal: taalCol !== -1 ? (row[taalCol] || '').trim() : '',
      tempo: tempoCol !== -1 ? (row[tempoCol] || '').trim() : '',
      notatedAt: parseTimestamp(timestampCol !== -1 ? row[timestampCol] : null),
    };
  }
  return map;
}

// Google Forms writes its own locale timestamp format into this column;
// normalize to ISO so the homepage can sort "recently notated" shabads.
function parseTimestamp(raw) {
  if (!raw) return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

async function main() {
  const shabadMap = new Map();
  let collisions = 0;

  for (const source of SOURCES) {
    console.log(`\nFetching ${source.angs} Angs of ${source.name} (${source.code}), concurrency ${CONCURRENCY}...`);

    const pages = Array.from({ length: source.angs }, (_, i) => i + 1);
    let done = 0;
    await withConcurrency(pages, CONCURRENCY, async (pageNum) => {
      try {
        const raw = await fetchAng(pageNum, source.code);
        const lines = extractLines(raw, pageNum);
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
              taal: null,
              tempo: null,
              sthayi: null,
              antara: null,
              notatedAt: null,
            });
          }
          // Append every line's text (full shabad, in order).
          shabadMap.get(l.shabadId).textLines.push(l.gurmukhi);
        }
      } catch (err) {
        console.error(`Skipping ${source.name} Ang ${pageNum}: ${err.message}`);
      } finally {
        done++;
        if (done % 100 === 0) console.log(`  ...${done}/${source.angs} Angs processed`);
      }
    });
  }

  if (collisions > 0) {
    console.warn(`\n${collisions} cross-source shabad ID collision(s) detected — see warnings above.`);
  }

  // Precompute per-line first-letters so search results can show the matched
  // line (not always the first line of the shabad).
  for (const shabad of shabadMap.values()) {
    shabad.lines = shabad.textLines.map((line) => ({
      t: line,
      fl: firstLetters(line),
    }));
    shabad.firstLine = shabad.textLines[0] || '';
  }

  // Merge notation from the Google Sheet, with safe fallback.
  const notation = await fetchNotation();
  let notationCount = 0;
  if (notation === null) {
    // Sheet unreachable: preserve any notation already in the committed file.
    console.warn('Falling back to existing notation in src/data/shabads.json (if any).');
    try {
      const prev = JSON.parse(await readFile(OUT_FILE, 'utf-8'));
      const prevMap = new Map(prev.map((s) => [s.shabadId, s]));
      for (const shabad of shabadMap.values()) {
        const old = prevMap.get(shabad.shabadId);
        if (old && (old.sthayi || old.antara || old.taal)) {
          shabad.sthayi = old.sthayi;
          shabad.antara = old.antara;
          shabad.taal = old.taal;
          shabad.tempo = old.tempo;
          shabad.notatedAt = old.notatedAt || null;
          notationCount++;
        }
      }
    } catch {
      console.warn('No previous file to fall back to; notation will be empty this run.');
    }
  } else {
    for (const shabad of shabadMap.values()) {
      const n = notation[shabad.shabadId];
      if (n && (n.sthayi || n.antara || n.taal)) {
        shabad.sthayi = n.sthayi || null;
        shabad.antara = n.antara || null;
        shabad.taal = n.taal || null;
        shabad.tempo = n.tempo || null;
        shabad.notatedAt = n.notatedAt || null;
        notationCount++;
      }
    }
  }

  const shabads = Array.from(shabadMap.values()).sort((a, b) => a.ang - b.ang);

  await mkdir(path.dirname(OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify(shabads), 'utf-8');

  console.log(`\nDone. Wrote ${shabads.length} unique shabads to ${OUT_FILE}`);
  console.log(`${notationCount} of them have Sur/Taal notation.`);
  console.log('Commit this file to git so the site builds without depending on live services.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
