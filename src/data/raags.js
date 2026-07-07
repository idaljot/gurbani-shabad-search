// Raag reference data for Gurbani Kirtan Swar Notation, keyed by the exact
// `raag` string as it appears in src/data/shabads.json (the GurbaniNow API's
// raag.english field — its transliteration scheme differs from common
// spellings, e.g. "Raag Gauree" not "Gauri", "Siree Raag" not "Sri Raag").
//
// The content below started as a hand-compiled seed file using common
// spellings for keys (e.g. "Maajh", "Gauri", "Devgandhari") — none of those
// matched the data as-is. Reconciled against a fresh scan of shabads.json on
// 2026-07-07: every real raag key in the data uses the "Raag X" (or "Siree
// Raag") form, so every seed key below has been corrected to match,
// including several where the transliteration differs more than just the
// "Raag " prefix (e.g. "Devgandhari" -> "Raag Dayv Gandhaaree", "Todi" ->
// "Raag Todee", "Gaund" -> "Raag Gond", "Ramkali" -> "Raag Raamkalee").
// Playlist URLs were cross-checked against the previously-existing file and
// matched exactly for every raag both covered, so nothing was lost there.
//
// IMPORTANT — data granularity mismatch: the API's raag field does not
// distinguish sub-raags, so four seed entries have no data key to attach to
// and are NOT included in RAAGS below (their content is preserved in these
// comments so it isn't lost, just not silently misapplied to a raag it
// doesn't fully describe):
//   - "Gauri Guareri", "Gauri Bairagan", "Gauri Cheti" — shabads.json only
//     has a single "Raag Gauree" key, no sub-raag distinction. Their content:
//       Gauri Guareri: varjit ["Pa"], komal ["Re"], teevra ["Ma"],
//         aroh "S G m D N S'", avroh "S' N D m G r S", mood "A mixture of
//         calmness and control in feeling; open and truthful in approach.",
//         playlist https://www.youtube.com/playlist?list=PLQSK-tQ7aj4Wj_pVKKqRtMlIRMnOZrlEB
//         (sourceNote: "Swar data from class notes; pending ustaad review")
//       Gauri Bairagan: varjit ["Ga","Pa"], komal ["Re","Dha"],
//         aroh "S r M d N S'", avroh "S' N d M r S", tukda "M d n d M",
//         playlist https://www.youtube.com/playlist?list=PLO3A2VVMcycY
//         (sourceNote: "Swar data from class notes; pending ustaad review")
//       Gauri Cheti: mood "Compound (Mishrat) raag of the Gauri family;
//         contemplative character.",
//         playlist https://www.youtube.com/playlist?list=PLQSK-tQ7aj4V7UXD6-p8vngCdS_5481zc
//   - "Nat" — the seed data describes this as musically distinct from "Nat
//     Narayan" ("melodious night raag; distinct from Nat Narayan"), but
//     shabads.json has no bare "Raag Nat" key, only "Raag Nat Naaraayan" —
//     confirmed absent in an earlier crawl too. Attaching this content to
//     "Raag Nat Naaraayan" would misrepresent it as the same raag the seed
//     data itself treats as different, so it's left out. Content: mood
//     "Melodious night raag; distinct from Nat Narayan.", playlist
//     https://www.youtube.com/playlist?list=PLQSK-tQ7aj4W0ghceU51okYf8mKoV7pF0
//
// NOTE ON TIME: In Gurmat Sangeet, raags express MOOD and are traditionally
// NOT restricted to specific clock times (unlike Hindustani classical). The
// `time` values below reflect traditional associations, not hard rules —
// the raag page surfaces this caveat wherever a time is shown.
//
// STATUS: every entry is 'draft' — compiled from credible public Gurbani
// sources (SikhiWiki / Raj Academy, SearchGurbani, SikhRoots) plus class
// notes, none of it yet confirmed by Bhai Jaspal Singh Ji. Swar-technical
// fields (thaat, jati, aroh, avroh, vadi, samvadi, komal, teevra, varjit,
// tukda) are intentionally left blank for almost every raag — these must be
// confirmed by him before being filled in or marked 'approved'. Do NOT fill
// them with guesses.

/**
 * @typedef {Object} RaagInfo
 * @property {'draft'|'approved'} [status] default 'draft' if absent
 * @property {string} [thaat]
 * @property {string} [jati]
 * @property {string} [aroh]      ascending scale, e.g. "S G m D N S'"
 * @property {string} [avroh]     descending scale
 * @property {string} [vadi]      most prominent swar
 * @property {string} [samvadi]   second most prominent swar
 * @property {string[]} [komal]   e.g. ['Re','Dha']
 * @property {string[]} [teevra]  e.g. ['Ma']
 * @property {string[]} [varjit]  omitted swars
 * @property {string} [tukda]     characteristic phrase / pakad
 * @property {string} [time]
 * @property {string} [mood]
 * @property {string} [notes]
 * @property {string} [youtubePlaylist]
 * @property {string} [sourceNote]
 */

/** @type {Record<string, RaagInfo>} */
export const RAAGS = {
  'Siree Raag': {
    status: 'draft',
    thaat: '', jati: '', aroh: '', avroh: '', vadi: '', samvadi: '',
    komal: [], teevra: [], varjit: [], tukda: '',
    time: 'First quarter of night, 6pm-9pm (Sandhi-Prakash / dusk)',
    mood: 'Majesty combined with prayerful meditation; serious and thought-provoking. Themes of Maya and detachment, satisfaction and balance.',
    notes: 'First raag in Sri Guru Granth Sahib Ji. Old, melodious and complex. Guru Amar Das ji regarded it as the highest raag.',
    youtubePlaylist: 'https://www.youtube.com/playlist?list=PLQSK-tQ7aj4XP3WcG-eWQ3Q20_Wo3v7mr',
    sourceNote: 'Compiled from public sources',
  },
  'Raag Maajh': {
    status: 'draft',
    thaat: '', jati: '', aroh: '', avroh: '', vadi: '', samvadi: '',
    komal: [], teevra: [], varjit: [], tukda: '',
    time: 'First quarter of night, 6pm-9pm (some sources: 3pm-6pm)',
    mood: 'Yearning to merge with the Lord; extreme love heightened by the sorrow of separation; giving up of negative values.',
    notes: 'A pure Punjabi raag attributed to Guru Nanak Dev ji, born from the folk tunes of the Majha/Malwa region. Barah Maha is written in this raag.',
    youtubePlaylist: 'https://www.youtube.com/playlist?list=PLQSK-tQ7aj4UB0Ll1z0-9xr5vFlSIg5u9',
    sourceNote: 'Compiled from public sources',
  },
  'Raag Gauree': {
    status: 'draft',
    thaat: '', jati: '', aroh: '', avroh: '', vadi: '', samvadi: '',
    komal: [], teevra: [], varjit: [], tukda: '',
    time: 'First quarter of night, 6pm-9pm (some sources: 3pm-6pm)',
    mood: 'Contemplative; serious, thoughtful and composed. Principles and seriousness.',
    notes: 'Has the largest number of compositions in SGGS. Contains Sukhmani Sahib and Bavan Akhri. Data does not distinguish Gauri sub-raags (Guareri, Bairagan, Cheti) — this entry, and its playlist, cover the plain Gauri only; see the file header comment for the sub-raag seed content (varjit/komal/teevra/aroh/avroh from class notes) that has nowhere to attach.',
    youtubePlaylist: 'https://www.youtube.com/playlist?list=PLQSK-tQ7aj4XeLBdayRmcgLZyZgNmZexv',
    sourceNote: 'Compiled from public sources',
  },
  'Raag Aasaa': {
    status: 'draft',
    thaat: '', jati: '', aroh: '', avroh: '', vadi: '', samvadi: '',
    komal: [], teevra: [], varjit: [], tukda: '',
    time: 'Fourth quarter of night before daybreak, 3am-6am (also around dusk)',
    mood: "Hope - literally 'the melody of hope'. Inspiration, courage and determination; passion and zeal to succeed even when difficult.",
    notes: 'Considered an original gift of Guru Nanak Dev ji (no mention in ancient/medieval texts). Aasa-di-Vaar is sung in this raag.',
    youtubePlaylist: 'https://www.youtube.com/playlist?list=PLQSK-tQ7aj4Uf7a9xa6O_mGozB7M4qtVM',
    sourceNote: 'Compiled from public sources',
  },
  'Raag Gujri': {
    status: 'draft',
    thaat: '', jati: '', aroh: '', avroh: '', vadi: '', samvadi: '',
    komal: [], teevra: [], varjit: [], tukda: '',
    time: 'Second quarter of day, 9am-12pm',
    mood: 'Prayer (pooja); satisfaction and softness of heart with a tinge of sadness. Awareness of passing time and mortality, leading one to value life.',
    notes: '',
    youtubePlaylist: '',
    sourceNote: 'Compiled from public sources',
  },
  'Raag Dayv Gandhaaree': {
    status: 'draft',
    thaat: '', jati: '', aroh: '', avroh: '', vadi: '', samvadi: '',
    komal: [], teevra: [], varjit: [], tukda: '',
    time: 'Second quarter of day, ~6am-9am (a few hours after sunrise)',
    mood: 'Softness; merging with the beloved and self-realization. No single strong feeling but a gentle softness.',
    notes: 'A very melodious, ancient raag. Around 10 pages in SGGS.',
    youtubePlaylist: 'https://www.youtube.com/playlist?list=PLQSK-tQ7aj4UQjr-iGwBYH_qKnRvaHbg5',
    sourceNote: 'Compiled from public sources',
  },
  'Raag Bihaagraa': {
    status: 'draft',
    thaat: '', jati: '', aroh: '', avroh: '', vadi: '', samvadi: '',
    komal: [], teevra: [], varjit: [], tukda: '',
    time: 'Second quarter of night, 9pm-12am',
    mood: 'Yearning from separation and the happiness of meeting the Lord; a sweet nature and an inclination to seek unity.',
    notes: 'Similar to raag Bihaag. Sung in the calm, quiet environment of the night.',
    youtubePlaylist: 'https://www.youtube.com/playlist?list=PLQSK-tQ7aj4Vrs2yi_ddI6Mqjej4yQsrm',
    sourceNote: 'Compiled from public sources',
  },
  'Raag Vadhans': {
    status: 'draft',
    thaat: '', jati: '', aroh: '', avroh: '', vadi: '', samvadi: '',
    komal: [], teevra: [], varjit: [], tukda: '',
    time: '',
    mood: 'Used for both classical and folk forms - Ghorian (reflecting joy) and Alaahania (reflecting sorrow/mourning).',
    notes: '',
    youtubePlaylist: '',
    sourceNote: 'Compiled from public sources',
  },
  'Raag Sorath': {
    status: 'draft',
    thaat: '', jati: '', aroh: '', avroh: '', vadi: '', samvadi: '',
    komal: [], teevra: [], varjit: [], tukda: '',
    time: 'Evening / night',
    mood: 'Draws the mind toward the Lord; conviction and contentment.',
    notes: '',
    youtubePlaylist: 'https://www.youtube.com/playlist?list=PLQSK-tQ7aj4VxEZb97Cc3Tq4rYOk9PuNm',
    sourceNote: 'Compiled from public sources',
  },
  'Raag Dhanaasree': {
    status: 'draft',
    thaat: '', jati: '', aroh: '', avroh: '', vadi: '', samvadi: '',
    komal: [], teevra: [], varjit: [], tukda: '',
    time: 'Afternoon',
    mood: 'A carefree sense; devotional inspiration that encourages effort without anxiety.',
    notes: '',
    youtubePlaylist: 'https://www.youtube.com/playlist?list=PLQSK-tQ7aj4Xp8uNmuBnUS5pnG9J5py0D',
    sourceNote: 'Compiled from public sources',
  },
  'Raag Jaithsree': {
    status: 'draft',
    thaat: '', jati: '', aroh: '', avroh: '', vadi: '', samvadi: '',
    komal: [], teevra: [], varjit: [], tukda: '',
    time: 'Late afternoon / early evening',
    mood: 'Tenderness and humility; a plea and longing.',
    notes: '',
    youtubePlaylist: 'https://www.youtube.com/playlist?list=PLQSK-tQ7aj4U4wdlsQnuaZ-gJnlPHidun',
    sourceNote: 'Compiled from public sources',
  },
  'Raag Todee': {
    status: 'draft',
    thaat: '', jati: '', aroh: '', avroh: '', vadi: '', samvadi: '',
    komal: [], teevra: [], varjit: [], tukda: '',
    time: 'Late morning',
    mood: 'Attraction and charm; drawing the listener toward the divine.',
    notes: '',
    youtubePlaylist: 'https://www.youtube.com/playlist?list=PLQSK-tQ7aj4WfBBx8O3CsqrWqbMPMyN0O',
    sourceNote: 'Compiled from public sources',
  },
  'Raag Bairaaree': {
    status: 'draft',
    thaat: '', jati: '', aroh: '', avroh: '', vadi: '', samvadi: '',
    komal: [], teevra: [], varjit: [], tukda: '',
    time: '',
    mood: 'Yearning and seeking.',
    notes: '',
    youtubePlaylist: '',
    sourceNote: 'Compiled from public sources',
  },
  'Raag Tilang': {
    status: 'draft',
    thaat: '', jati: '', aroh: '', avroh: '', vadi: '', samvadi: '',
    komal: [], teevra: [], varjit: [], tukda: '',
    time: 'Evening',
    mood: 'A raag with Muslim/Persian influence; longing and beauty.',
    notes: '',
    youtubePlaylist: 'https://www.youtube.com/playlist?list=PLQSK-tQ7aj4XxP1wIfstzOTFWrN3Ym9E6',
    sourceNote: 'Compiled from public sources',
  },
  'Raag Soohee': {
    status: 'draft',
    thaat: '', jati: '', aroh: '', avroh: '', vadi: '', samvadi: '',
    komal: [], teevra: [], varjit: [], tukda: '',
    time: 'Late morning / midday',
    mood: 'The joy of union and the ache of separation; devotion and love.',
    notes: '',
    youtubePlaylist: 'https://www.youtube.com/playlist?list=PLQSK-tQ7aj4WuTcYVkzfeBDgRb7gnzW7P',
    sourceNote: 'Compiled from public sources',
  },
  'Raag Bilaaval': {
    status: 'draft',
    thaat: 'Bilawal', jati: 'Sampurna (7 notes)', aroh: '', avroh: '', vadi: '', samvadi: '',
    komal: [], teevra: [], varjit: [], tukda: '',
    time: 'Morning, 9am-12pm',
    mood: 'Happiness, stability and contentment.',
    notes: 'Associated with Bilawal thaat - all shuddh (natural) swars.',
    youtubePlaylist: 'https://www.youtube.com/playlist?list=PLQSK-tQ7aj4V6n7LvKWA-gXbLSVBobSZ9',
    sourceNote: 'Compiled from public sources',
  },
  'Raag Gond': {
    status: 'draft',
    thaat: '', jati: '', aroh: '', avroh: '', vadi: '', samvadi: '',
    komal: [], teevra: [], varjit: [], tukda: '',
    time: '',
    mood: 'Wonder; a sense of surprise and awe.',
    notes: '',
    youtubePlaylist: '',
    sourceNote: 'Compiled from public sources',
  },
  'Raag Raamkalee': {
    status: 'draft',
    thaat: '', jati: '', aroh: '', avroh: '', vadi: '', samvadi: '',
    komal: [], teevra: [], varjit: [], tukda: '',
    time: 'First quarter of day, 6am-9am',
    mood: 'Compassion; aimed at charming the Lord. Popular with yogis.',
    notes: 'Guru Nanak Dev ji composed Sidh-Gosht in this raag. Anand Sahib, Ramkali Sad and Ramkali ki Vaar are in this raag; 300+ shabads.',
    youtubePlaylist: 'https://www.youtube.com/playlist?list=PLQSK-tQ7aj4WKJaB34HQpCcrr0mjFQ17q',
    sourceNote: 'Compiled from public sources',
  },
  'Raag Nat Naaraayan': {
    status: 'draft',
    thaat: '', jati: '', aroh: '', avroh: '', vadi: '', samvadi: '',
    komal: [], teevra: [], varjit: [], tukda: '',
    time: 'Second quarter of night, 9pm-12am',
    mood: 'Very melodious; an effective night raag.',
    notes: 'Nat and Nat Narayan appear as distinct, independent forms in SGGS. A separate "Nat" mood/playlist exists in the seed data but has no matching key in shabads.json (no bare "Raag Nat" appears in the crawl) — see the file header comment for its content rather than attaching it here.',
    youtubePlaylist: 'https://www.youtube.com/playlist?list=PLQSK-tQ7aj4Viv8XT_LYRLU_qgU--A_kM',
    sourceNote: 'Compiled from public sources',
  },
  'Raag Maalee Gauraa': {
    status: 'draft',
    thaat: '', jati: '', aroh: '', avroh: '', vadi: '', samvadi: '',
    komal: [], teevra: [], varjit: [], tukda: '',
    time: '',
    mood: 'An uncommon, complex measure.',
    notes: '',
    youtubePlaylist: '',
    sourceNote: 'Compiled from public sources',
  },
  'Raag Maaroo': {
    status: 'draft',
    thaat: '', jati: '', aroh: '', avroh: '', vadi: '', samvadi: '',
    komal: [], teevra: [], varjit: [], tukda: '',
    time: 'Midday / noon',
    mood: 'Bravery, sacrifice and fearlessness; battlefield courage and renunciation.',
    notes: '',
    youtubePlaylist: 'https://www.youtube.com/playlist?list=PLQSK-tQ7aj4VxP8T8c-DfkulZzOV1niPV',
    sourceNote: 'Compiled from public sources',
  },
  'Raag Tukhaari': {
    status: 'draft',
    thaat: '', jati: '', aroh: '', avroh: '', vadi: '', samvadi: '',
    komal: [], teevra: [], varjit: [], tukda: '',
    time: '',
    mood: 'Beauty and longing.',
    notes: 'Barah Maha of Guru Nanak Dev ji is in this raag.',
    youtubePlaylist: '',
    sourceNote: 'Compiled from public sources',
  },
  'Raag Kaydaaraa': {
    status: 'draft',
    thaat: '', jati: '', aroh: '', avroh: '', vadi: '', samvadi: '',
    komal: [], teevra: [], varjit: [], tukda: '',
    time: 'First quarter of night',
    mood: 'Sweetness; devotion and love.',
    notes: '',
    youtubePlaylist: '',
    sourceNote: 'Compiled from public sources',
  },
  'Raag Bhairao': {
    status: 'draft',
    thaat: '', jati: '', aroh: '', avroh: '', vadi: '', samvadi: '',
    komal: [], teevra: [], varjit: [], tukda: '',
    time: 'Early morning / dawn',
    mood: 'Seriousness, awe and reverence; solemn morning devotion.',
    notes: '',
    youtubePlaylist: '',
    sourceNote: 'Compiled from public sources',
  },
  'Raag Basant': {
    status: 'draft',
    thaat: '', jati: '', aroh: '', avroh: '', vadi: '', samvadi: '',
    komal: [], teevra: [], varjit: [], tukda: '',
    time: 'Spring season (seasonal - not time-bound)',
    mood: 'The joy of spring; renewal, celebration and hope.',
    notes: 'Data does not distinguish a separate Basant Hindol; this is the plain Basant playlist.',
    youtubePlaylist: 'https://www.youtube.com/playlist?list=PLQSK-tQ7aj4VoPD_ug-5YfxwSnh_3SrLY',
    sourceNote: 'Compiled from public sources',
  },
  'Raag Saarang': {
    status: 'draft',
    thaat: '', jati: '', aroh: '', avroh: '', vadi: '', samvadi: '',
    komal: [], teevra: [], varjit: [], tukda: '',
    time: 'Midday / noon',
    mood: 'Yearning and poignancy; the pain of separation.',
    notes: '',
    youtubePlaylist: 'https://www.youtube.com/playlist?list=PLQSK-tQ7aj4UBn3zSdUkLfrIB2-Pf0bsk',
    sourceNote: 'Compiled from public sources',
  },
  'Raag Malaar': {
    status: 'draft',
    thaat: '', jati: '', aroh: '', avroh: '', vadi: '', samvadi: '',
    komal: [], teevra: [], varjit: [], tukda: '',
    time: 'Rainy season (seasonal); night',
    mood: 'Associated with rain; longing, and the joy of union like rain after drought.',
    notes: '',
    youtubePlaylist: 'https://www.youtube.com/playlist?list=PLQSK-tQ7aj4XNm37dqWBDz9ECgiLG0mWJ',
    sourceNote: 'Compiled from public sources',
  },
  'Raag Kaanraa': {
    status: 'draft',
    thaat: '', jati: '', aroh: '', avroh: '', vadi: '', samvadi: '',
    komal: [], teevra: [], varjit: [], tukda: '',
    time: 'Night',
    mood: 'Serious and majestic; deep devotion.',
    notes: '',
    youtubePlaylist: 'https://www.youtube.com/playlist?list=PLQSK-tQ7aj4VB3QRiP6V97DRjHNmdSFT-',
    sourceNote: 'Compiled from public sources',
  },
  'Raag Kalyaan': {
    status: 'draft',
    thaat: '', jati: '', aroh: '', avroh: '', vadi: '', samvadi: '',
    komal: [], teevra: [], varjit: [], tukda: '',
    time: 'Early night, first quarter',
    mood: 'Peace, serenity and auspiciousness; prayerful calm.',
    notes: '',
    youtubePlaylist: '',
    sourceNote: 'Compiled from public sources',
  },
  'Raag Prabhaatee': {
    status: 'draft',
    thaat: '', jati: '', aroh: '', avroh: '', vadi: '', samvadi: '',
    komal: [], teevra: [], varjit: [], tukda: '',
    time: 'Early morning before/at dawn, 3am-6am / 6am-9am',
    mood: 'Devotion at daybreak; a call to remember the Divine as day breaks.',
    notes: 'Two accepted forms exist - one in Bhairav thaat, one (more widely accepted) in Kalyan thaat.',
    youtubePlaylist: 'https://www.youtube.com/playlist?list=PLQSK-tQ7aj4XCQSmGKwbDHBV8bH-Zt40P',
    sourceNote: 'Compiled from public sources',
  },
  'Raag Jaijaavantee': {
    status: 'draft',
    thaat: '', jati: '', aroh: '', avroh: '', vadi: '', samvadi: '',
    komal: [], teevra: [], varjit: [], tukda: '',
    time: 'Night',
    mood: 'Joy of achievement mixed with the sorrow of loss; putting duty first, and stability found by balancing opposite emotions.',
    notes: 'Introduced via the hymns of Guru Tegh Bahadur ji - the last raag added to SGGS.',
    youtubePlaylist: 'https://www.youtube.com/playlist?list=PLQSK-tQ7aj4Vz_zKNC2f852UgIDLp9-d3',
    sourceNote: 'Compiled from public sources',
  },
};

// Playlists that don't map to any raag but are useful class resources —
// surfaced separately in the site footer, not per-shabad.
export const RESOURCE_PLAYLISTS = {
  'Sur Sadhna': 'https://www.youtube.com/playlist?list=PLQSK-tQ7aj4Ws_RDwVvKcFW9GR4OueZLg',
  'Rehras Sahib': 'https://www.youtube.com/playlist?list=PLQSK-tQ7aj4WUAuVPVyXwGiOcs2jn_PpR',
};
