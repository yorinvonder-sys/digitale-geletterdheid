import { readFileSync } from 'node:fs';

const source = readFileSync('src/features/developer/DeveloperReviewChecklist.tsx', 'utf8');

const failures = [];

if (source.includes('className="sr-only"')) {
  failures.push('Checklist checkbox is hidden; it should be visibly clickable like a real checklist.');
}

if (source.includes('setChecked(checked);')) {
  failures.push('Save failure rolls back local checked state, so progress can visibly drop back to the old value.');
}

if (!source.includes('setChecked((currentChecked)')) {
  failures.push('Checked state should be updated from the latest React state with a functional setter.');
}

const lineThroughCount = (source.match(/line-through/g) || []).length;
if (lineThroughCount < 2) {
  failures.push('Reviewed rows need a clear line-through on both the readable name and slug text.');
}

if (!source.includes('accent-lab-sage')) {
  failures.push('Native checkboxes should use the DGSkills accent color when checked.');
}

if (failures.length > 0) {
  console.error('Review checklist behavior check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Review checklist behavior check passed.');
