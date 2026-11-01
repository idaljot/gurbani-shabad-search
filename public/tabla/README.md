# Tabla bol samples

`dha.wav`, `dhin.wav`, `na.wav`, `tin.wav`, `ta.wav`, `ge.wav`, `ke.wav`,
`tun.wav`, `te.wav` are the bols the player loads. See `CREDITS.md` at the
repo root for sourcing and licensing.

Extra takes of a bol are named `<bol>-2.wav`, `<bol>-3.wav`, … and listed in
`SAMPLE_TAKES` in `src/data/taals.js`; the player rotates between takes so
repeated strokes don't sound identical, and only loads them on first play.
Currently: `tun-2.wav`, `tun-3.wav`, `te-2.wav` (same mmiron recordings as
`tun.wav`/`te.wav`). Only add takes recorded on the same tabla as take 1.

The player checks for these at page load and automatically uses whichever
ones it finds — any bol without a matching file falls back to a synthesized
placeholder, so files can be replaced or added one at a time with no code
changes needed.

`bell.wav` is a separate, optional effect played on the sam (beat 1) when the
"Bell on beat 1" toggle is checked — not a tabla bol, no fallback needed
(it's silent if the file is missing). Its provenance isn't documented in
`CREDITS.md`; it wasn't sourced from either of the two Freesound packs
referenced there, so double-check its license before relying on this repo's
existing attributions to cover it.
