import fs from 'node:fs';

const files = {
  hook: fs.readFileSync('src/hooks/useAgentLogic.ts', 'utf8'),
  preview: fs.readFileSync('src/features/ai-lab/previews/TrainerPreview.tsx', 'utf8'),
  agent: fs.readFileSync('src/config/agents/year1.tsx', 'utf8'),
};

const checks = [
  {
    name: 'AI Trainer starts with Plastic/Papier labels',
    pass: files.hook.includes("classALabel: 'Plastic'") && files.hook.includes("classBLabel: 'Papier'"),
  },
  {
    name: 'AI Trainer parses [PREDICT] into testItem before cleanup',
    pass: files.hook.includes('predictMatches') &&
      files.hook.includes('setActiveTrainerData(prev => ({') &&
      files.hook.includes('testItem: {') &&
      files.hook.indexOf('predictMatches') < files.hook.indexOf('responseText = responseText.replace(/\\[PREDICT\\]'),
  },
  {
    name: 'Klaar requires at least 3 examples per category',
    pass: files.preview.includes('const canCompleteMission = data.classAItems.length >= 3 && data.classBItems.length >= 3;') &&
      files.preview.includes('{canCompleteMission && ('),
  },
  {
    name: 'Visible buckets fall back to Plastic/Papier',
    pass: files.preview.includes("data.classALabel && data.classALabel !== 'A' ? data.classALabel : 'Plastic'") &&
      files.preview.includes("data.classBLabel && data.classBLabel !== 'B' ? data.classBLabel : 'Papier'") &&
      files.preview.includes('<Trash2 size={12} /> {classALabel}') &&
      files.preview.includes('<FileText size={12} /> {classBLabel}'),
  },
  {
    name: 'Agent instruction keeps the prediction tag contract',
    pass: files.agent.includes('[PREDICT]Het testwoord[/PREDICT]'),
  },
  {
    name: 'Agent instruction does not force a wrong-example detour before testing',
    pass: !files.agent.includes('Vraag de leerling expres om een FOUT voorbeeld'),
  },
  {
    name: 'Agent instruction ends the flow after a successful test question',
    pass: files.agent.includes('Vraag na een testvraag niet om extra trainingsvoorbeelden'),
  },
  {
    name: 'AI Trainer has a text fallback when [PREDICT] is missing',
    pass: files.hook.includes('inferTrainerPredictionFromText') &&
      files.hook.includes('isTrainerTestQuestion(textInput)') &&
      files.hook.includes('hasTrainerPredictionTag'),
  },
];

const failed = checks.filter(check => !check.pass);

for (const check of checks) {
  console.log(`${check.pass ? 'PASS' : 'FAIL'} ${check.name}`);
}

if (failed.length > 0) {
  process.exitCode = 1;
}
