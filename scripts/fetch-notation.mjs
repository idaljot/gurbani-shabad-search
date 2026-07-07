/**
 * fetch-notation.mjs
 * ------------------
 * Reads the committed src/data/shabads-base.json (produced by
 * fetch-base.mjs — this script never touches the GurbaniNow API), fetches
 * ONLY the notation Google Sheet, merges Taal/Tempo/Key/Sthayi/Antara/Alaap
 * onto the base data, and writes the final src/data/shabads.json.
 *
 * This is the fast, routine script — one CSV fetch, no crawl — meant to
 * run every time someone submits new notation through the form (multiple
 * times a week). For the interactive version with a pre-publish diff and
 * confirmation prompt, use `npm run publish-notation` instead, which
 * imports fetchNotation() and mergeNotation() from this file.
 *
 * Run it with:  npm run fetch-notation
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { normalizeLegacyNotation } from './legacy-notation.mjs';
import { parse as parseSargam } from '../src/lib/sargam.js';

const BASE_FILE = path.join('src', 'data', 'shabads-base.json');
const OUT_FILE = path.join('src', 'data', 'shabads.json');

// Your published Google Sheet (Form responses), CSV format.
// The original sheet got corrupted; the form was remapped to a new sheet on
// 2026-07-06 — this URL points at that replacement.
const SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTOoQ5b4OoX5FDij7GProOjg5j-HeD_C76ryLQpYldkZRYeO4xnUdn_D7kAm4mVGyMrbQwiOqFsOCo_/pub?output=csv';

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

// Google Forms writes its own locale timestamp format into this column;
// normalize to ISO so the homepage can sort "recently notated" shabads.
function parseTimestamp(raw) {
  if (!raw) return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/**
 * Fetches the notation sheet and returns a map:
 * shabadId -> {taal, tempo, key, sthayi, antara, alaap, notatedAt}.
 * Matches columns by header NAME (not position), so reordering form fields
 * (or adding new ones, like Key/Alaap) won't break it.
 *
 * Returns null if the sheet can't be reached OR can't be parsed into
 * anything usable (no "Shabad ID" column) — either way, the caller should
 * treat this as "couldn't get valid data" rather than "sheet is empty",
 * since blindly proceeding with an unparseable sheet would silently wipe
 * every shabad's notation on the next merge.
 */
export async function fetchNotation() {
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
  const keyCol = col('key');
  const alaapCol = col('alaap');
  const timestampCol = col('timestamp');

  if (idCol === -1) {
    console.warn('\nNotation sheet has no "Shabad ID" column — treating as unreachable rather than risk wiping every shabad\'s notation.');
    return null;
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
      key: keyCol !== -1 ? (row[keyCol] || '').trim() : '',
      alaap: alaapCol !== -1 ? (row[alaapCol] || '') : '',
      notatedAt: parseTimestamp(timestampCol !== -1 ? row[timestampCol] : null),
    };
  }
  return map;
}

const NOTATION_FIELDS = ['sthayi', 'antara', 'taal', 'tempo', 'key', 'alaap'];
// These three (not taal/tempo/key) hold SARGAM notation strings, so they're
// the ones run through the legacy normalizer and the sargam.js validator.
const SARGAM_FIELDS = ['sthayi', 'antara', 'alaap'];

function hasNotation(n) {
  return Boolean(n && (n.sthayi || n.antara || n.taal || n.key || n.alaap));
}

/**
 * Merges notation onto base shabads. If `notation` is null (sheet
 * unreachable/unparseable), falls back to whatever notation each shabad
 * already had in `existingShabads` (the currently-committed shabads.json)
 * instead of wiping it — the one thing this pipeline must never do is
 * produce a notation-less result just because the sheet was briefly
 * unreachable.
 */
export function mergeNotation(base, notation, existingShabads = []) {
  const existingMap = new Map(existingShabads.map((s) => [s.shabadId, s]));
  let notationCount = 0;

  const shabads = base.map((shabad) => {
    const source = notation ? notation[shabad.shabadId] : existingMap.get(shabad.shabadId);
    const notated = hasNotation(source);
    if (notated) notationCount++;

    const merged = { ...shabad };
    for (const field of NOTATION_FIELDS) {
      let value = notated ? (source[field] || null) : null;
      if (value && SARGAM_FIELDS.includes(field)) {
        value = normalizeLegacyNotation(value, (msg) => console.warn(`  [legacy] ${shabad.shabadId} ${field}: ${msg}`));
      }
      merged[field] = value;
    }
    merged.notatedAt = notated ? (source.notatedAt || null) : null;
    return merged;
  });

  return { shabads, notationCount };
}

/**
 * Validates every sargam field against the real parser and logs a warning
 * (shabad ID + the exact error) for anything that doesn't parse, so it can
 * be fixed by hand in the Google Sheet before the next publish. This never
 * blocks the build — notation is contributor-submitted free text, and a bad
 * entry shouldn't take the whole site down.
 */
export function validateNotation(shabads) {
  let invalidCount = 0;
  for (const shabad of shabads) {
    for (const field of SARGAM_FIELDS) {
      const value = shabad[field];
      if (!value) continue;
      try {
        parseSargam(value);
      } catch (err) {
        console.warn(`  [sargam] ${shabad.shabadId} ${field}: ${err.message}`);
        invalidCount++;
      }
    }
  }
  return invalidCount;
}

async function main() {
  const base = JSON.parse(await readFile(BASE_FILE, 'utf-8'));

  const notation = await fetchNotation();
  let existingShabads = [];
  if (notation === null) {
    console.warn('Falling back to existing notation in src/data/shabads.json (if any).');
    try {
      existingShabads = JSON.parse(await readFile(OUT_FILE, 'utf-8'));
    } catch {
      console.warn('No previous file to fall back to; notation will be empty this run.');
    }
  }

  const { shabads, notationCount } = mergeNotation(base, notation, existingShabads);

  console.log('\nValidating sargam notation...');
  const invalidCount = validateNotation(shabads);

  await writeFile(OUT_FILE, JSON.stringify(shabads), 'utf-8');

  console.log(`\nDone. Wrote ${shabads.length} shabads to ${OUT_FILE}`);
  console.log(`${notationCount} of them have Sur/Taal notation.`);
  if (invalidCount) {
    console.log(`${invalidCount} sargam field(s) above don't parse — fix them in the Sheet before publishing.`);
  } else {
    console.log('All sargam notation fields parse cleanly.');
  }
  console.log('Commit this file to git so the site builds without depending on live services.');
}

// Only run the CLI flow when this file is executed directly (`node
// scripts/fetch-notation.mjs`), not when publish-notation.mjs imports
// fetchNotation()/mergeNotation() from it.
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
