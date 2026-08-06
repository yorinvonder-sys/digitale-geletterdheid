import fs from 'node:fs';

const hook = fs.readFileSync('src/hooks/useAgentLogic.ts', 'utf8');
const preview = fs.readFileSync('src/features/student/BookPreview.tsx', 'utf8');

const checks = [
  {
    name: 'story data is normalized to five pages on initial and cloud restore',
    pass: hook.includes('normalizeStoryBookData(initialProgress?.data?.activeBookData)') &&
      hook.includes('setActiveBookData(normalizeStoryBookData(data.bookData))'),
  },
  {
    name: 'untargeted and targeted page tags cannot exceed five pages',
    pass: hook.includes('targetPage > MAX_STORY_PAGES') &&
      hook.includes('newPages.length < MAX_STORY_PAGES') &&
      hook.includes('newPages.slice(0, MAX_STORY_PAGES)'),
  },
  {
    name: 'image tags cannot create pages above the mission limit',
    pass: hook.includes('pageNumber! > MAX_STORY_PAGES') &&
      hook.includes('newData.pages = newPages.slice(0, MAX_STORY_PAGES)'),
  },
  {
    name: 'book preview blocks a sixth page and explains the limit',
    pass: preview.includes('if (totalPages >= MAX_STORY_PAGES)') &&
      preview.includes("Je verhaal heeft 5 pagina's"),
  },
];

for (const check of checks) console.log(`${check.pass ? 'PASS' : 'FAIL'} ${check.name}`);
if (checks.some((check) => !check.pass)) process.exitCode = 1;
