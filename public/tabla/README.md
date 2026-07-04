# Tabla bol samples

`dha.wav`, `dhin.wav`, `na.wav`, `tin.wav`, `ta.wav`, `ge.wav`, `ke.wav`,
`tun.wav`, `te.wav` are the bols the player loads. See `CREDITS.md` at the
repo root for sourcing and licensing.

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
