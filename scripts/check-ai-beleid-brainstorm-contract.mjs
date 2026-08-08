import assert from 'node:assert/strict';
import fs from 'node:fs';

const files = {
  preview: fs.readFileSync('src/features/ai-lab/previews/AiBeleidBrainstormPreview.tsx', 'utf8'),
  lab: fs.readFileSync('src/features/ai-lab/AiLab.tsx', 'utf8'),
};

assert.equal(
  /gegevens worden[\s\S]{0,120}anoniem/i.test(files.preview),
  false,
  'AI policy survey must not claim account-linked responses are anonymous',
);
assert.match(
  files.preview,
  /antwoorden worden gekoppeld aan je account en school opgeslagen/,
  'AI policy survey must accurately disclose account and school linkage',
);
assert.match(
  files.preview,
  /export const isCompleteRuleIdea[\s\S]*REASON_WORDS\.test\(text\)[\s\S]*SCHOOL_CONTEXT_WORDS\.test\(text\)/,
  'AI policy completion must validate a reason and school context',
);
assert.match(
  files.preview,
  /ownRuleIdeas = myIdeeen\.filter\(isCompleteRuleIdea\)[\s\S]*const canComplete = ownRuleIdeas\.length >= 2/,
  'AI policy completion must require two complete learner-authored rule proposals',
);
assert.match(
  files.preview,
  /waarom die nodig is en wanneer die op school geldt/,
  'AI policy rule prompt must ask for reason and school context',
);
assert.match(
  files.lab,
  /completeMission[\s\S]*await completeMission\('ai-beleid-brainstorm'\)[\s\S]*: devPreviewMode;[\s\S]*return completed;/,
  'AI policy mission must receive the durable completion outcome',
);
assert.match(
  files.preview,
  /if \(!user\?\.schoolId\) \{[\s\S]*setIdeeen\(\[\]\);[\s\S]*setMyIdeeen\(\[\]\)/,
  'AI policy reads must fail closed when school identity is unavailable',
);
assert.match(
  files.preview,
  /if \(!user\.schoolId\) \{[\s\S]*setSubmitError\('Je schoolkoppeling ontbreekt/,
  'AI policy writes must fail closed when school identity is unavailable',
);
assert.match(
  files.preview,
  /const handleSurveySubmit = async \(\) => \{[\s\S]*if \(!user\.schoolId\)[\s\S]*setSurveyError\('Je schoolkoppeling ontbreekt/,
  'AI policy survey writes must fail closed when school identity is unavailable',
);
assert.match(
  files.preview,
  /\[phase, user\?\.uid, user\?\.schoolId\]/,
  'AI policy ideas must reload when learner or school identity changes',
);

console.log('AI policy brainstorm contract checks passed');
