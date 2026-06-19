#!/usr/bin/env node
// Merge a wave-results file into review-status.json (the living quality scoreboard).
// Reusable by the dgskills-batch-review orchestrator after each review wave.
// Usage: node scripts/apply-wave-results.mjs business/dgskills-reviews/_wave-YYYY-MM-DD.json

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const wavePath = process.argv[2];
if (!wavePath) {
  console.error('Usage: node scripts/apply-wave-results.mjs <wave-results.json>');
  process.exit(1);
}

const STATUS_PATH = resolve('business/dgskills-reviews/review-status.json');
const wave = JSON.parse(readFileSync(resolve(wavePath), 'utf8'));
const raw = JSON.parse(readFileSync(STATUS_PATH, 'utf8'));

// Support either an array of records or an object keyed by missionId; preserve shape on write.
const isArray = Array.isArray(raw);
const records = isArray ? raw : Object.values(raw);
const byId = new Map(records.map((r) => [r.missionId, r]));

let updated = 0;
const missing = [];
for (const res of wave.results) {
  const rec = byId.get(res.missionId);
  if (!rec) { missing.push(res.missionId); continue; }
  rec.reviewStatus = 'reviewed';
  rec.lastReviewed = wave.date;
  rec.reportPath = res.reportPath;
  rec.reviewScores = res.reviewScores;
  rec.goalClear = res.goalClear;
  rec.goalAchieved = res.goalAchieved;
  rec.proposedFixes = res.autoFixableCount;     // proposals only until a fix-wave applies them
  rec.escalationCount = res.escalationCount;
  rec.topIssues = res.topIssues;
  updated += 1;
}

const out = isArray
  ? records
  : Object.fromEntries(records.map((r) => [r.missionId, r]));
writeFileSync(STATUS_PATH, JSON.stringify(out, null, 2) + '\n', 'utf8');

const reviewed = records.filter((r) => r.reviewStatus === 'reviewed').length;
console.log(`wave=${wave.wave} date=${wave.date} updated=${updated} missing=${missing.length ? missing.join(',') : 'none'}`);
console.log(`review-status.json: ${records.length} missions, ${reviewed} now reviewed`);
