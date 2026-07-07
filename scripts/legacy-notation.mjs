/**
 * legacy-notation.mjs
 * --------------------
 * One-time-in-spirit, permanent-in-practice normalizer for notation entered
 * before SARGAM.md existed. The class's earliest submissions (see the
 * migration audit, 2026-07) used a different octave mark and ran same-beat
 * swaras together with no separator at all:
 *
 *   S'         tar (upper octave) written with a trailing apostrophe,
 *              not the canonical trailing dot
 *   S"         ati-tar written with a trailing double-quote,
 *              not the canonical double trailing dot
 *   GGGG       four same-beat swaras run together with no space —
 *              audited against each shabad's known taal (word lengths
 *              cleanly matching the taal's vibhag structure) to confirm
 *              one letter = one beat, so this becomes "G G G G"
 *   (mG)       existing parenthesized groups just needed the internal space
 *   *          an undocumented marker found in two legacy shabads (MN0,
 *              MNB); meaning was never confirmed, so it's stripped rather
 *              than guessed at — logged via `warn` so it stays visible
 *
 * This is safe to run on already-canonical text too: it operates word by
 * word, and a word that's already a single correctly-formed swara token
 * (the normal case for anything entered after the spec existed) matches the
 * "note run" pattern trivially and passes through unchanged. It is applied
 * on every merge (not just once) because src/data/shabads.json is fully
 * regenerated from the Google Sheet each run — there's no separate place to
 * apply a one-off fix that would survive the next `npm run fetch-notation`.
 */

const NOTE_RUN = /^(?:\.{0,2}[SrRgGmMPdDnN]["']?)+$/;
const NOTE = /\.{0,2}[SrRgGmMPdDnN]["']?/g;

function convertLegacyNote(tok) {
  const [, lead, , mark] = tok.match(/^(\.{0,2})([SrRgGmMPdDnN])(["']?)$/);
  const trail = mark === "'" ? '.' : mark === '"' ? '..' : '';
  return lead + tok.match(/[SrRgGmMPdDnN]/)[0] + trail;
}

function splitLegacyRun(word) {
  return (word.match(NOTE) || []).map(convertLegacyNote).join(' ');
}

/**
 * @param {string} raw
 * @param {(message: string) => void} [warn] called once per stripped `*`
 */
export function normalizeLegacyNotation(raw, warn = () => {}) {
  if (!raw) return raw;

  let s = raw.replace(/\r\n?/g, '\n');
  s = s.replace(/\*/g, () => { warn('stripped undocumented legacy "*" marker'); return ''; });
  s = s.replace(/[ \t]*\n[ \t\n]*/g, ' | '); // legacy line breaks -> section separator

  const words = s.split(' ').filter((w) => w.length);
  const out = [];
  for (const w of words) {
    if (w === '|' || w === ',' || w === '-' || w === '_') { out.push(w); continue; }
    if (w.startsWith('(') && w.endsWith(')')) {
      out.push('(' + splitLegacyRun(w.slice(1, -1)) + ')');
      continue;
    }
    if (NOTE_RUN.test(w)) { out.push(splitLegacyRun(w)); continue; }
    if (w.endsWith(',') && NOTE_RUN.test(w.slice(0, -1))) {
      out.push(splitLegacyRun(w.slice(0, -1)) + ' ,');
      continue;
    }
    out.push(w); // a label word (e.g. "Waheguru") or something validation should flag
  }
  return out.join(' ').replace(/\s+/g, ' ').trim();
}
