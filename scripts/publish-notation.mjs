/**
 * publish-notation.mjs
 * ------------------
 * The routine, weekly "I just got new Sur/Taal/Alaap/Key submissions,
 * publish them" command. Unlike fetch-notation.mjs (which is deliberately
 * forgiving — sheet unreachable? fall back to whatever notation already
 * exists, never wipe it), this script is meant to be run interactively and
 * treats "couldn't get valid notation data" as a hard stop: there's nothing
 * useful to publish, so it aborts before touching anything rather than
 * silently re-publishing stale data.
 *
 * Flow:
 *   1. Read the committed base + current shabads.json (for comparison).
 *   2. Fetch the notation Sheet directly. If unreachable/unparseable, abort
 *      immediately — no write, no diff, no commit.
 *   3. Merge notation onto the base data and write shabads.json (this DOES
 *      happen regardless of what happens next, so if you answer "n" below,
 *      the regenerated file is still there as an uncommitted change you can
 *      inspect with `git diff` or discard with `git checkout -- <file>`).
 *   4. Print a human-readable summary of what changed, prominently flagging
 *      any OVERWRITE (a shabad that already had notation and now has
 *      different notation — last-write-wins means a resubmission silently
 *      replaces prior work, so this is the one thing worth double-checking
 *      before publishing).
 *   5. Prompt for confirmation. Only "y" stages src/data/shabads.json
 *      specifically (never `git add -A` or any other file), commits, and
 *      pushes to whatever branch is currently checked out.
 *
 * This is manually triggered only — it is not wired into any schedule, git
 * hook, or CI, and shouldn't be.
 *
 * Run it with:  npm run publish-notation
 */

import { readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import readline from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { fetchNotation, mergeNotation } from './fetch-notation.mjs';

const BASE_FILE = path.join('src', 'data', 'shabads-base.json');
const OUT_FILE = path.join('src', 'data', 'shabads.json');

const SHORT_FIELDS = ['taal', 'tempo', 'key'];
const LONG_FIELDS = ['sthayi', 'antara', 'alaap'];
const ALL_FIELDS = [...SHORT_FIELDS, ...LONG_FIELDS];

function hasNotation(s) {
  return Boolean(s && (s.sthayi || s.antara || s.taal || s.key || s.alaap));
}

function truncate(text, max = 40) {
  const oneLine = (text || '').replace(/\s+/g, ' ').trim();
  return oneLine.length > max ? oneLine.slice(0, max) + '…' : oneLine;
}

function describeFieldChanges(oldShabad, newShabad) {
  const changes = [];
  for (const field of ALL_FIELDS) {
    const oldVal = oldShabad ? (oldShabad[field] || null) : null;
    const newVal = newShabad[field] || null;
    if (oldVal === newVal) continue;

    if (SHORT_FIELDS.includes(field)) {
      if (!oldVal) changes.push(`${field}: "${newVal}"`);
      else if (!newVal) changes.push(`${field} removed (was "${oldVal}")`);
      else changes.push(`${field}: "${oldVal}" → "${newVal}"`);
    } else {
      if (!oldVal) changes.push(`${field} added`);
      else if (!newVal) changes.push(`${field} removed`);
      else changes.push(`${field} changed`);
    }
  }
  return changes;
}

export function diffShabads(oldShabads, newShabads) {
  const oldMap = new Map(oldShabads.map((s) => [s.shabadId, s]));
  const entries = [];

  for (const newShabad of newShabads) {
    const oldShabad = oldMap.get(newShabad.shabadId);
    const changes = describeFieldChanges(oldShabad, newShabad);
    if (changes.length === 0) continue;

    const wasNotated = hasNotation(oldShabad);
    const isNotated = hasNotation(newShabad);
    entries.push({
      shabad: newShabad,
      changes,
      isOverwrite: wasNotated && isNotated,
      isRemoval: wasNotated && !isNotated,
    });
  }
  return entries;
}

function printHeader(title) {
  const line = '─'.repeat(Math.max(title.length + 4, 40));
  console.log(`\n${line}`);
  console.log(`  ${title}`);
  console.log(line);
}

export function printSummary(entries) {
  printHeader(`Notation changes (${entries.length} shabad${entries.length === 1 ? '' : 's'})`);
  console.log();

  for (const { shabad, changes, isOverwrite, isRemoval } of entries) {
    const label = `${shabad.shabadId} — ${truncate(shabad.previewLine)} (${shabad.raag}, ${shabad.writer})`;
    console.log(label);
    if (isOverwrite) console.log('  ⚠ OVERWRITES existing notation');
    if (isRemoval) console.log('  ✖ notation removed');
    console.log(`  ${changes.join(', ')}`);
    console.log();
  }

  const overwriteCount = entries.filter((e) => e.isOverwrite).length;
  const removalCount = entries.filter((e) => e.isRemoval).length;
  if (overwriteCount > 0) {
    console.log(`⚠ ${overwriteCount} overwrite${overwriteCount === 1 ? '' : 's'} detected — review carefully before publishing.`);
  }
  if (removalCount > 0) {
    console.log(`✖ ${removalCount} shabad${removalCount === 1 ? '' : 's'} lost notation entirely — confirm this is intentional.`);
  }
}

async function confirm(question) {
  const rl = readline.createInterface({ input: stdin, output: stdout });
  const answer = await rl.question(question);
  rl.close();
  return answer.trim().toLowerCase() === 'y';
}

function git(args) {
  return execFileSync('git', args, { encoding: 'utf-8' }).trim();
}

async function main() {
  printHeader('Publish Notation');

  let base;
  try {
    base = JSON.parse(await readFile(BASE_FILE, 'utf-8'));
  } catch {
    console.error(`\nCould not read ${BASE_FILE}.`);
    console.error('Run `npm run fetch-base` first (one-time / after a source change) to generate it.');
    process.exit(1);
  }

  let oldShabads = [];
  try {
    oldShabads = JSON.parse(await readFile(OUT_FILE, 'utf-8'));
  } catch {
    console.warn(`\nNo existing ${OUT_FILE} found — treating this as a first publish.`);
  }

  console.log('\nFetching notation Sheet...');
  const notation = await fetchNotation();
  if (notation === null) {
    console.error('\nAborting: could not fetch or parse the notation Sheet.');
    console.error('Nothing was written, committed, or pushed. Check the Sheet is published and reachable, then try again.');
    process.exit(1);
  }
  console.log('done.');

  const { shabads: newShabads, notationCount } = mergeNotation(base, notation, []);

  await writeFile(OUT_FILE, JSON.stringify(newShabads), 'utf-8');
  console.log(`Merged onto ${base.length} base shabads — ${notationCount} now have notation.`);

  const entries = diffShabads(oldShabads, newShabads);

  if (entries.length === 0) {
    console.log('\nNo notation changes detected — nothing to publish.');
    process.exit(0);
  }

  printSummary(entries);

  const proceed = await confirm('\nPublish these changes to src/data/shabads.json? (y/n) ');
  if (!proceed) {
    console.log('\nNot publishing. The regenerated file is left as an uncommitted local change —');
    console.log(`inspect it with \`git diff -- ${OUT_FILE}\` or discard it with \`git checkout -- ${OUT_FILE}\`.`);
    process.exit(0);
  }

  const branch = git(['rev-parse', '--abbrev-ref', 'HEAD']);
  const isoDate = new Date().toISOString().slice(0, 10);

  git(['add', OUT_FILE]);
  git(['commit', '-m', `Publish notation update ${isoDate}`]);
  git(['push', 'origin', branch]);

  console.log(`\nPublished and pushed to ${branch}.`);
}

// Only run when executed directly (`node scripts/publish-notation.mjs`),
// not if this file were ever imported elsewhere (e.g. for testing
// diffShabads()/printSummary() in isolation).
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error('\nUnexpected error — nothing was committed or pushed:');
    console.error(err);
    process.exit(1);
  });
}
