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
    name: 'Klaar requires a balanced dataset and a model test',
    pass: files.preview.includes('const hasBalancedDataset = data.classAItems.length >= 3 && data.classBItems.length >= 3;') &&
      files.preview.includes('const hasTestedModel = Boolean(data.testItem);') &&
      files.preview.includes('const canCompleteMission = hasBalancedDataset && hasTestedModel;') &&
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
    name: 'Agent instruction requires a recovery-oriented follow-up after testing',
    pass: files.agent.includes('Na de eerste test geef je altijd een vervolgactie') &&
      files.agent.includes('klopt hij niet, voeg dan een beter gelabeld voorbeeld toe en test opnieuw'),
  },
  {
    name: 'AI Trainer has a text fallback when [PREDICT] is missing',
    pass: files.hook.includes('inferTrainerPredictionFromText') &&
      files.hook.includes('isTrainerTestQuestion(textInput)') &&
      files.hook.includes('hasTrainerPredictionTag'),
  },
  {
    name: 'AI Trainer conclusion waits for auth-bound completion',
    pass: files.preview.includes('onComplete?: () => boolean | void | Promise<boolean | void>') &&
      files.preview.includes('const completed = await onComplete?.();') &&
      files.preview.includes('if (completed !== false) setShowConclusion(false);'),
  },
  {
    name: 'AI Trainer reset clears trainer-specific data',
    pass: files.hook.includes("selectedRole.id === 'ai-trainer'") &&
      files.hook.includes('setActiveTrainerData(DEFAULT_TRAINER_DATA);'),
  },
  {
    name: 'AI Trainer restores locally persisted fallback data',
    pass: files.hook.includes('initialProgress?.data?.activeTrainerData') &&
      files.hook.includes('normalizeTrainerData(initialProgress.data.activeTrainerData)'),
  },
];

const failed = checks.filter(check => !check.pass);

for (const check of checks) {
  console.log(`${check.pass ? 'PASS' : 'FAIL'} ${check.name}`);
}

if (failed.length > 0) {
  process.exitCode = 1;
}
