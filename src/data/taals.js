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
  // The 5 taals below were added 2026-07-04, verified against
  // ragajunglism.org/ragas/talas (same source as the original 6). Gurmat
  // Sangeet commonly calls the 12-beat taal "Chartaal" — the page lists it
  // as "Chautal" (its Hindustani/dhrupad name); same theka, kirtan-context
  // name used here as the key.
  Chartaal: {
    beats: ['Dha', 'Dha', 'Dhin', 'Ta', 'KiTa', 'Dha', 'Dhin', 'Ta', 'TiTa', 'KaTa', 'GaDhi', 'GheNa'],
    vibhags: [4, 4, 2, 2],
    defaultTempo: 60,
  },
  Jhaptaal: {
    beats: ['Dhin', 'Na', 'Dhin', 'Dhin', 'Na', 'Tin', 'Na', 'Dhin', 'Dhin', 'Na'],
    vibhags: [2, 3, 2, 3],
    defaultTempo: 80,
  },
  Tilwada: {
    beats: ['Dha', 'Terekita', 'Dhin', 'Dhin', 'Dha', 'Dha', 'Tin', 'Tin', 'Ta', 'Terekita', 'Dhin', 'Dhin', 'Dha', 'Dha', 'Dhin', 'Dhin'],
    vibhags: [4, 4, 4, 4],
    defaultTempo: 70,
  },
  Dhamaar: {
    beats: ['Ka', 'Dhe', 'Ta', 'Dhi', 'Ta', 'Dha', '-', 'Gi', 'Ti', 'Ta', 'Ti', 'Te', 'Ta', '-'],
    vibhags: [5, 2, 3, 4],
    defaultTempo: 55,
  },
  Sooltaal: {
    beats: ['Dha', 'Dha', 'Dhin', 'Ta', 'TiTe', 'Dha', 'TiTe', 'KaTa', 'GaDi', 'GeNe'],
    vibhags: [2, 2, 2, 2, 2],
    defaultTempo: 50,
  },
};

export const DEFAULT_TAAL = 'Teentaal';

// The launch set ships real samples for these base bols; any other syllable
// appearing in a theka above is approximated to the closest one here for
// audio playback (the visual beat indicator still shows the authentic
// syllable). See CREDITS.md for sample sourcing status.
//
// Tun and Te used to be approximated to tin/ke respectively; real samples
// for both were added 2026-07-04 (from mmiron's CC0 Freesound pack, see
// CREDITS.md) once the new taals below made them referenced bols in their
// own right, not just approximation targets.
export const BOL_ALIASES = {
  Dha: 'dha',
  Dhin: 'dhin',
  Tin: 'tin',
  Na: 'na',
  Ge: 'ge',
  Ta: 'ta',
  Tha: 'ta',
  Ti: 'ke',
  Tun: 'tun',
  Te: 'te',
  Terekita: 'ke',
  DhaGi: 'dha',
  TeTe: 'ke',
  GiTa: 'ke',
  KiTe: 'ke',
  // Compound/ornamental syllables introduced by Chartaal, Dhamaar, and
  // Sooltaal — approximated to the closest base bol, same convention as
  // the Terekita/DhaGi/TeTe/GiTa/KiTe entries above.
  KiTa: 'ke',
  TiTa: 'ke',
  GaDhi: 'ge',
  GheNa: 'ge',
  Ka: 'ke',
  Dhe: 'dha',
  Dhi: 'ke',
  Gi: 'ke',
  TiTe: 'ke',
  KaTa: 'ke',
  GaDi: 'ge',
  GeNe: 'ge',
};

export const BASE_BOLS = ['dha', 'dhin', 'na', 'tin', 'ta', 'ge', 'ke', 'tun', 'te'];
