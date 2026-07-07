// sargam-render.js — display layer for SARGAM events (see sargam.js / SARGAM.md).
// Turns parsed events into markup for the three notation hands. No parsing logic here —
// that's the whole point of keeping data and display separate. Framework-agnostic: usable
// from a plain <script type="module"> or from inside any Astro/React/etc. component.

export const GUR = { Sa: 'ਸ', Re: 'ਰੇ', Ga: 'ਗ', Ma: 'ਮ', Pa: 'ਪ', Dha: 'ਧ', Ni: 'ਨੇ' };
export const ROMAN = { Sa: 'S', Re: 'R', Ga: 'G', Ma: 'M', Pa: 'P', Dha: 'D', Ni: 'N' };

// Komal/teevra/octave marks are CSS boxes positioned around the letter, never combining
// Unicode characters — Gurmukhi has no encoded komal/teevra diacritics (proposed 2013,
// never accepted), so a font glyph for them does not exist to depend on.
export function marksHTML(sw) {
  let h = '';
  if (sw.variant === 'komal') h += '<i class="komal"></i>';
  if (sw.variant === 'teevra') h += '<i class="teevra"></i>';
  const o = sw.octave;
  if (o > 0) h += `<span class="above${o > 1 ? ' hi' : ''}">` + '<i class="d"></i>'.repeat(Math.min(o, 2)) + '</span>';
  if (o < 0) h += `<span class="below${o < -1 ? ' lo' : ''}">` + '<i class="d"></i>'.repeat(Math.min(-o, 2)) + '</span>';
  return h;
}

export function glyphHTML(text, sw) {
  return `<span class="glyph">${text}${marksHTML(sw)}</span>`;
}
