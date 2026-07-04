// Theka references verified against ragajunglism.org/ragas/talas (2026-07-03).
// Keys must match the exact taal spelling used in shabads.json — the notated
// data (from the class's Google Form) spells the 8-beat taal "Kaherva", not
// the more common "Keherwa", so per-shabad taal lookup depends on this.
//
// `beats` has one entry per matra (used both for scheduling audio and for
// rendering the visual beat indicator). A small number of matras carry a
// compound/rest syllable ("DhaGi", "Terekita", "-") — "-" means a silent
// beat, and compound syllables are approximated to one of the ~7 sampled
// bols via BOL_ALIASES below for playback purposes.
//
// By convention beat index 0 is treated as "sam" (the downbeat) for the
// visual indicator. This is a simplification — Rupak traditionally places
// khali on its first vibhag with sam falling elsewhere — but a uniform rule
// keeps the beat indicator logic simple for a nice-to-have visual.
export const TAALS = {
  Teentaal: {
    beats: ['Dha', 'Dhin', 'Dhin', 'Dha', 'Dha', 'Dhin', 'Dhin', 'Dha', 'Dha', 'Tin', 'Tin', 'Na', 'Na', 'Dhin', 'Dhin', 'Dha'],
    vibhags: [4, 4, 4, 4],
    defaultTempo: 100,
  },
  Kaherva: {
    beats: ['Ge', 'Tha', 'Ti', 'Na', 'Na', 'Dha', 'Dhin', 'Na'],
    vibhags: [4, 4],
    defaultTempo: 90,
  },
  Rupak: {
    beats: ['Tin', 'Tin', 'Na', 'Dhin', 'Dha', 'Dhin', 'Dha'],
    vibhags: [3, 2, 2],
    defaultTempo: 80,
  },
  Ektaal: {
    beats: ['Dhin', 'Dhin', 'Na', 'Terekita', 'Tun', 'Na', 'Te', 'Te', 'DhaGi', 'TeTe', 'GiTa', 'KiTe'],
    vibhags: [2, 2, 2, 2, 2, 2],
    defaultTempo: 70,
  },
  Dadra: {
    beats: ['Dha', 'Dhin', 'Na', 'Dha', 'Tun', 'Na'],
    vibhags: [3, 3],
    defaultTempo: 90,
  },
  Deepchandi: {
    beats: ['Dha', 'Dhin', '-', 'Dha', 'Dha', 'Tin', '-', 'Ta', 'Tin', '-', 'Dha', 'Dha', 'Dhin', '-'],
    vibhags: [3, 4, 3, 4],
    defaultTempo: 75,
  },
};

export const DEFAULT_TAAL = 'Teentaal';

// The launch set only ships samples/synth voices for these 7 base bols.
// Any other syllable appearing in a theka above is approximated to the
// closest one here for audio playback (the visual beat indicator still
// shows the authentic syllable). See CREDITS.md for sample sourcing status.
export const BOL_ALIASES = {
  Dha: 'dha',
  Dhin: 'dhin',
  Tin: 'tin',
  Na: 'na',
  Ge: 'ge',
  Ta: 'ta',
  Tha: 'ta',
  Ti: 'ke',
  Tun: 'tin',
  Te: 'ke',
  Terekita: 'ke',
  DhaGi: 'dha',
  TeTe: 'ke',
  GiTa: 'ke',
  KiTe: 'ke',
};

export const BASE_BOLS = ['dha', 'dhin', 'na', 'tin', 'ta', 'ge', 'ke'];
