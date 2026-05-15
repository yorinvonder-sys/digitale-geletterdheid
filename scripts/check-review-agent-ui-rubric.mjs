import fs from 'node:fs';

const files = {
  claudeDesign: fs.readFileSync('.claude/skills/dgskills-design-reviewer/SKILL.md', 'utf8'),
  codexDesign: fs.readFileSync('/Users/yorinvonder/.codex/skills/dgskills-design-reviewer/SKILL.md', 'utf8'),
  claudeTech: fs.readFileSync('.claude/skills/dgskills-tech-reviewer/SKILL.md', 'utf8'),
  claudeOrchestrator: fs.readFileSync('.claude/skills/dgskills-mission-review/SKILL.md', 'utf8'),
  codexOrchestrator: fs.readFileSync('.agents/skills/dgskills-mission-review/SKILL.md', 'utf8'),
};

const requiredPhrases = [
  'Visual Precision Gate',
  'overlap',
  'alignment',
  'text-fit',
  'game/canvas-fit',
  'volledige flow',
  'blocking',
  'Chrome-plugin',
];

const checks = [
  {
    name: 'Claude design reviewer has strict visual precision criteria',
    pass: requiredPhrases.every(phrase => files.claudeDesign.toLowerCase().includes(phrase.toLowerCase())),
  },
  {
    name: 'Codex design reviewer has strict visual precision criteria',
    pass: requiredPhrases.every(phrase => files.codexDesign.toLowerCase().includes(phrase.toLowerCase())),
  },
  {
    name: 'Tech reviewer must inspect the whole flow with Chrome evidence',
    pass: files.claudeTech.toLowerCase().includes('volledige flow') &&
      files.claudeTech.toLowerCase().includes('overlap') &&
      files.claudeTech.toLowerCase().includes('game/canvas-fit') &&
      files.claudeTech.toLowerCase().includes('chrome-plugin'),
  },
  {
    name: 'Claude orchestrator performs final UI gate after subreviews',
    pass: files.claudeOrchestrator.includes('Finale UI-gate') &&
      files.claudeOrchestrator.includes('overlap') &&
      files.claudeOrchestrator.includes('alignment') &&
      files.claudeOrchestrator.includes('text-fit'),
  },
  {
    name: 'Codex orchestrator requires Chrome visual precision evidence',
    pass: files.codexOrchestrator.includes('Visual Precision Gate') &&
      files.codexOrchestrator.toLowerCase().includes('overlap') &&
      files.codexOrchestrator.toLowerCase().includes('alignment') &&
      files.codexOrchestrator.toLowerCase().includes('text-fit'),
  },
];

for (const check of checks) {
  console.log(`${check.pass ? 'PASS' : 'FAIL'} ${check.name}`);
}

if (checks.some(check => !check.pass)) {
  process.exitCode = 1;
}
