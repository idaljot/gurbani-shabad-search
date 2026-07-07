// sargam.js — reference parser for the SARGAM canonical notation (see SARGAM.md)
// Zero dependencies. Runs in the browser (ES module) and in Node.
//
//   import { parse, stringify } from './sargam.js';
//   const events = parse('S r r P , m P N S.');
//   stringify(events);  // semantic round-trip
//
// parse() returns an array of events:
//   { type:'note',    note:'Ma', variant:'shuddh', octave:0, raw:'m' }
//   { type:'group',   swaras:[ <note>, <note> ], raw:'(S R)' }
//   { type:'sustain', raw:'-' }
//   { type:'rest',    raw:'_' }
//   { type:'label',   text:'Waheguru' }   // vocal interjection, passed through verbatim
//   { type:'phrase' }        // ,
//   { type:'section' }       // |
//
// octave: 0 = madhya, -1 mandra, -2 ati-mandra, +1 tar, +2 ati-tar.

const SWARA = {
  S: { note: 'Sa',  variant: 'shuddh' },
  r: { note: 'Re',  variant: 'komal'  },
  R: { note: 'Re',  variant: 'shuddh' },
  g: { note: 'Ga',  variant: 'komal'  },
  G: { note: 'Ga',  variant: 'shuddh' },
  // --- CONTESTED: there is no industry standard for Ma. This spec uses the "pitch-height"
  // convention (majority usage): m = shuddh Ma, M = teevra Ma. To use the Parrikar /
  // "shuddha-set" convention instead (M = shuddh, m = teevra), swap the two variants below.
  // Nothing else in the file depends on this choice.
  m: { note: 'Ma',  variant: 'shuddh' },   // pitch-height convention (default)
  M: { note: 'Ma',  variant: 'teevra' },
  P: { note: 'Pa',  variant: 'shuddh' },
  d: { note: 'Dha', variant: 'komal'  },
  D: { note: 'Dha', variant: 'shuddh' },
  n: { note: 'Ni',  variant: 'komal'  },
  N: { note: 'Ni',  variant: 'shuddh' },
};

export function parseSwara(tok) {
  const m = tok.match(/^(\.{0,2})([SrRgGmMPdDnN])(\.{0,2})$/);
  if (!m) throw new Error(`Invalid swara token: "${tok}"`);
  const [, lead, letter, trail] = m;
  if (lead && trail) throw new Error(`"${tok}" cannot be both mandra and tar`);
  const octave = trail.length - lead.length; // -2..+2
  const base = SWARA[letter];
  return { type: 'note', note: base.note, variant: base.variant, octave, raw: tok };
}

// A token is "label-shaped" if it's a bare multi-letter word that cannot be a
// swara token — e.g. a vocal interjection written inline ("Waheguru", "Satnam").
// Requiring length >= 3 and a strict majority of non-swara letters keeps this
// from swallowing a short typo next to a real swara letter (e.g. "Sx", which
// should still raise a parse error so it gets caught by validation) while
// still accepting real words, which are overwhelmingly non-swara letters.
const SWARA_LETTERS = new Set(Object.keys(SWARA));
function isLabelToken(tok) {
  if (!/^[A-Za-z]+$/.test(tok) || tok.length < 3) return false;
  let nonSwara = 0, swara = 0;
  for (const ch of tok) (SWARA_LETTERS.has(ch) ? swara++ : nonSwara++);
  return nonSwara > swara;
}

function tokenize(src) {
  const tokens = [];
  const STRUCT = ' \t\n|,(';
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === ' ' || c === '\t' || c === '\n') { i++; continue; }
    if (c === '|' || c === ',') { tokens.push(c); i++; continue; }
    if (c === '(') {
      const j = src.indexOf(')', i);
      if (j === -1) throw new Error('Unclosed "(" in notation');
      tokens.push(src.slice(i, j + 1)); // keep the parens
      i = j + 1; continue;
    }
    let j = i;
    while (j < src.length && !STRUCT.includes(src[j]) && src[j] !== ')') j++;
    tokens.push(src.slice(i, j));
    i = j;
  }
  return tokens;
}

export function parse(src) {
  const events = [];
  for (const tok of tokenize(src)) {
    if (tok === '|') { events.push({ type: 'section' }); continue; }
    if (tok === ',') { events.push({ type: 'phrase' });  continue; }
    if (tok === '-') { events.push({ type: 'sustain', raw: '-' }); continue; }
    if (tok === '_') { events.push({ type: 'rest',    raw: '_' }); continue; }
    if (tok.startsWith('(')) {
      const inner = tok.slice(1, -1).trim().split(/\s+/).filter(Boolean);
      if (inner.length < 2) throw new Error(`Beat-group "${tok}" needs 2+ swaras`);
      events.push({ type: 'group', swaras: inner.map(parseSwara), raw: tok });
      continue;
    }
    if (isLabelToken(tok)) { events.push({ type: 'label', text: tok }); continue; }
    events.push(parseSwara(tok));
  }
  return events;
}

const LETTER_OF = (note, variant) =>
  Object.keys(SWARA).find(k => SWARA[k].note === note && SWARA[k].variant === variant);

export function stringifySwara(s) {
  const letter = LETTER_OF(s.note, s.variant);
  if (!letter) throw new Error(`Unknown swara ${s.note}/${s.variant}`);
  const dots = '.'.repeat(Math.abs(s.octave || 0));
  return s.octave < 0 ? dots + letter : letter + dots;
}

export function stringify(events) {
  const out = [];
  for (const e of events) {
    switch (e.type) {
      case 'section': out.push('|'); break;
      case 'phrase':  out.push(','); break;
      case 'sustain': out.push('-'); break;
      case 'rest':    out.push('_'); break;
      case 'label':   out.push(e.text); break;
      case 'group':   out.push('(' + e.swaras.map(stringifySwara).join(' ') + ')'); break;
      default:        out.push(stringifySwara(e));
    }
  }
  return out.join(' ');
}

// --- self-test (Node only) -------------------------------------------------
// Run:  node src/lib/sargam.js
if (typeof process !== 'undefined' && process.argv?.[1]?.endsWith('sargam.js')) {
  const assert = (c, m) => { if (!c) { console.error('FAIL:', m); process.exitCode = 1; } };
  const deepEq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  const ma = parseSwara('m'), Ma = parseSwara('M');
  assert(ma.variant === 'shuddh', 'm is shuddh Ma');
  assert(Ma.variant === 'teevra', 'M is teevra Ma');
  assert(parseSwara('.N').octave === -1, '.N is mandra');
  assert(parseSwara('S.').octave === +1, 'S. is tar');
  assert(parseSwara('N..').octave === +2, 'N.. is ati-tar');

  const samples = [
    'S r r P , m P N S.',
    'S. N d P , m D m G R , R R P R G G R S',
    '(S R) (g m) P - _ N.',
    'S - G - | P _ N. -',
    'P D N S. | Waheguru | S. N D P',
  ];
  for (const s of samples) {
    const round = parse(stringify(parse(s)));
    assert(deepEq(round, parse(s)), `semantic round-trip: "${s}"`);
  }

  let threw = false;
  try { parseSwara('s'); } catch { threw = true; }
  assert(threw, 'lowercase s is invalid');

  const labelEvents = parse('S Waheguru R');
  assert(labelEvents[1].type === 'label' && labelEvents[1].text === 'Waheguru', 'bare word parses as a label token');

  threw = false;
  try { parse('Sx'); } catch { threw = true; }
  assert(threw, '"Sx" (letter + garbage) is not a label — still a parse error');

  if (!process.exitCode) console.log('All SARGAM parser tests passed.');
}
