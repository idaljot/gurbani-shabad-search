/**
 * fetch-shabads.mjs
 * ------------------
 * Build script. Walks every Ang of Sri Guru Granth Sahib Ji via the public
 * GurbaniNow API, collects every unique Shabad with its full text, Raag,
 * Writer, and precomputed first-letters (for roman->gurmukhi search), then
 * merges in Sur/Taal notation from your published Google Sheet.
 *
 * Run it with:  npm run fetch-data
 */

import { writeFile, readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import pkg from 'gurmukhi-utils';
const { firstLetters, toUnicode } = pkg;
const API_BASE = 'https://api.gurbaninow.com/v2';
const TOTAL_ANGS = 1430;
const CONCURRENCY = 8;
const OUT_FILE = path.join('src', 'data', 'shabads.json');

// Your published Google Sheet (Form responses), CSV format.
const SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vSUXqLcvoPkqgjSZVF5loJYuOHIwuJ_pS8sOZisOWydQCLXTL1kG2r3t4hiTQIpIloGGUAH4b_-srgH/pub?output=csv';

async function fetchAng(pageNum) {
  const res = await fetch(`${API_BASE}/ang/${pageNum}/G`);
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
    };
  }
  return map;
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
            textLines: [],
            taal: null,
            tempo: null,
            sthayi: null,
            antara: null,
          });
        }
        // Append every line's text (full shabad, in order).
        shabadMap.get(l.shabadId).textLines.push(l.gurmukhi);
      }
    } catch (err) {
      console.error(`Skipping Ang ${pageNum}: ${err.message}`);
    } finally {
      done++;
      if (done % 100 === 0) console.log(`  ...${done}/${TOTAL_ANGS} Angs processed`);
    }
  });

  // Precompute first-letters for each shabad (concatenated across all its lines).
  for (const shabad of shabadMap.values()) {
    shabad.firstLetters = shabad.textLines
      .map((line) => firstLetters(line))
      .join(' ');
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
