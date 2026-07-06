// Display order for the "Source" filter — the order sources were added to
// the site (see scripts/fetch-shabads.mjs's SOURCES), not alphabetical.
// Alphabetical sort was putting "Bhai Nand Lal Ji" first, ahead of the much
// larger/older Guru Granth Sahib Ji entry, which read as if it were the
// primary source. Any future source not listed here just sorts after all
// of these, alphabetically among themselves.
export const SOURCE_ORDER = [
  'Guru Granth Sahib Ji',
  'Sri Dasam Granth',
  'Vaaran Bhai Gurdas Ji',
  'Bhai Nand Lal Ji',
];

export function bySourceOrder(a, b) {
  const rankA = SOURCE_ORDER.indexOf(a);
  const rankB = SOURCE_ORDER.indexOf(b);
  if (rankA === -1 && rankB === -1) return a.localeCompare(b);
  if (rankA === -1) return 1;
  if (rankB === -1) return -1;
  return rankA - rankB;
}
