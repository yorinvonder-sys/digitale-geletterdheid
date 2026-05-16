import fs from 'node:fs';

const checks = [];

const read = (path) => fs.readFileSync(path, 'utf8');

const expectIncludes = (path, needle, label) => {
  const content = read(path);
  if (!content.includes(needle)) {
    checks.push(`${path}: mist ${label}`);
  }
};

const templateGoals = [
  ['algorithm-architect', 'src/features/missions/templates/simulation-lab/configs/algorithm-architect.ts'],
  ['web-developer', 'src/features/missions/templates/builder-canvas/configs/web-developer.ts'],
  ['app-prototyper', 'src/features/missions/templates/builder-canvas/configs/app-prototyper.ts'],
  ['bug-hunter', 'src/features/missions/templates/simulation-lab/configs/bug-hunter.ts'],
  ['automation-engineer', 'src/features/missions/templates/builder-canvas/configs/automation-engineer.ts'],
  ['code-reviewer', 'src/features/missions/templates/simulation-lab/configs/code-reviewer.ts'],
  ['code-review-2', 'src/features/missions/templates/review-arena/configs/code-review-2.ts'],
  ['privacy-by-design', 'src/features/missions/templates/simulation-lab/configs/privacy-by-design.ts'],
  ['network-navigator', 'src/features/missions/templates/data-viewer/configs/network-navigator.ts'],
  ['wachtwoord-warrior', 'src/features/missions/templates/puzzle-lab/configs/wachtwoord-warrior.ts'],
  ['website-bouwer', 'src/features/missions/templates/builder-canvas/configs/website-bouwer.ts'],
  ['schermtijd-coach', 'src/features/missions/templates/debate-arena/configs/schermtijd-coach.ts'],
  ['data-speurder', 'src/features/missions/templates/scenario-engine/configs/data-speurder.ts'],
];

const dedicatedGoals = [
  ['game-director', 'src/features/missions/GameDirectorMission.tsx'],
  ['prompt-master', 'src/features/missions/PromptMasterMission.tsx'],
  ['data-detective', 'src/features/missions/DataDetectiveMission.tsx'],
  ['deepfake-detector', 'src/features/missions/DeepfakeDetectorMission.tsx'],
  ['access-control-engineer', 'src/features/missions/AccessControlEngineerMission.tsx'],
];

expectIncludes('src/features/missions/templates/shared/types.ts', 'export interface MissionGoal', 'gedeeld MissionGoal type');
expectIncludes('src/features/missions/templates/shared/MissionGoalBanner.tsx', '/goal', 'zichtbare /goal copy in gedeelde banner');

for (const [missionId, path] of templateGoals) {
  expectIncludes(path, 'missionGoal:', `missionGoal voor ${missionId}`);
  expectIncludes(path, 'primaryGoal:', `primaryGoal voor ${missionId}`);
  expectIncludes(path, 'criteria:', `criteria voor ${missionId}`);
}

for (const [missionId, path] of dedicatedGoals) {
  expectIncludes(path, 'MISSION_GOAL', `MISSION_GOAL voor ${missionId}`);
  expectIncludes(path, 'MissionGoalBanner', `MissionGoalBanner voor ${missionId}`);
}

expectIncludes(
  'src/app/AuthenticatedApp.tsx',
  "if (success) handleMissionComplete('game-director')",
  'game-director completion via handleMissionComplete'
);

if (checks.length > 0) {
  console.error('Mission goal contract check failed:');
  for (const check of checks) console.error(`- ${check}`);
  process.exit(1);
}

console.log(`Mission goal contract check passed for ${templateGoals.length + dedicatedGoals.length} missions.`);
