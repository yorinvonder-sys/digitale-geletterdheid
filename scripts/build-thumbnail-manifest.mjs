import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const read = (filePath) => fs.readFileSync(path.join(root, filePath), 'utf8');

const curriculumSource = read('src/config/curriculum.ts');
const thumbnailsSource = read('src/config/missionThumbnails.ts');
const agentFiles = [
  'src/config/agents/year1.tsx',
  'src/config/agents/year2.tsx',
  'src/config/agents/year3.tsx',
];
const agentSources = agentFiles.map((filePath) => read(filePath));

const thumbnailByMission = Object.fromEntries(
  [...thumbnailsSource.matchAll(/'([^']+)':\s*'([^']+)'/g)].map((match) => [match[1], match[2]]),
);

const agentByMission = new Map();
for (const source of agentSources) {
  for (const match of source.matchAll(/id:\s*'([^']+)'/g)) {
    const id = match[1];
    const end = source.indexOf('\n    },', match.index);
    const block = source.slice(match.index, end === -1 ? undefined : end);
    const title = block.match(/title:\s*'([^']+)'/)?.[1] ?? id;
    const description = block.match(/description:\s*'([^']+)'/)?.[1] ?? '';
    const problemScenario = block.match(/problemScenario:\s*'([^']+)'/)?.[1] ?? '';
    if (!agentByMission.has(id)) {
      agentByMission.set(id, { title, description, problemScenario });
    }
  }
}

const periods = [];
for (const yearMatch of curriculumSource.matchAll(/\n\s{8}(\d):\s*\{([\s\S]*?)(?=\n\s{8}\d:\s*\{|\n\s{4}\},\n\s*\};)/g)) {
  const yearGroup = Number(yearMatch[1]);
  const yearBlock = yearMatch[2];
  const yearTitle = yearBlock.match(/title:\s*'([^']+)'/)?.[1] ?? `Leerjaar ${yearGroup}`;

  for (const periodMatch of yearBlock.matchAll(/\n\s{16}(\d):\s*\{([\s\S]*?)(?=\n\s{16}\d:\s*\{|\n\s{12}\},)/g)) {
    const period = Number(periodMatch[1]);
    const periodBlock = periodMatch[2];
    const periodTitle = periodBlock.match(/title:\s*'([^']+)'/)?.[1] ?? `Periode ${period}`;
    const missionBlock = periodBlock.match(/missions:\s*\[([\s\S]*?)\]/)?.[1] ?? '';
    const reviewBlock = periodBlock.match(/reviewMissions:\s*\[([\s\S]*?)\]/)?.[1] ?? '';
    const missions = [...missionBlock.matchAll(/'([^']+)'/g)].map((entry) => ({ id: entry[1], isReview: false }));
    const reviews = [...reviewBlock.matchAll(/'([^']+)'/g)].map((entry) => ({ id: entry[1], isReview: true }));
    periods.push({ yearGroup, yearTitle, period, periodTitle, missions: [...missions, ...reviews] });
  }
}

const sceneByKind = {
  ai: 'a changing AI workshop, model-testing corner, prop table, lab cart, or experiment floor where abstract model widgets misbehave quietly',
  code: 'a changing maker-space, floor-level prototype area, bug-hunt bench, cable maze, or build corner with code props as objects rather than screens',
  data: 'a changing data investigation scene with chart fragments, evidence boards, measuring tools, sample cards, or oversized graph props',
  media: 'a changing creative production set, audio booth, storyboard wall, mini studio, editing table, or awkward prop corner',
  privacy: 'a changing privacy-and-consent scene with locked boxes, curtains, consent stamps, file cabinets, or careful boundary markers',
  security: 'a changing cyber investigation scene with evidence strings, locks, decoy mail props, shields, or forensic trays',
  school: 'a changing school workflow scene with lockers, printer corner, backpack pile, agenda cards, cloud boxes, or classroom supply chaos',
  project: 'a changing project scene with prototypes, launch crates, test stations, blueprint rolls, or a tiny crisis made of stationery',
};

const postureByIndex = [
  'duck crouching beside an object on the floor, inspecting it like a participant rather than teaching',
  'duck leaning around a stack of props, caught mid-task with one wing holding a tool',
  'duck walking through the scene carrying mission materials, not presenting to an audience',
  'duck kneeling at a low workbench, focused on fixing or sorting something',
  'duck peeking from behind a large prop with a dry, unimpressed expression',
  'duck sitting on a stool sideways, working with objects at arm height instead of facing a class',
  'duck reaching up to adjust an overhead or wall-mounted object, full body visible',
  'duck balancing too many relevant props, quietly regretting the logistics',
  'duck observing from a corner while a small robot or object creates the visual joke',
  'duck in over-the-shoulder view actively manipulating a prop, not explaining it',
  'duck standing outdoors or in a non-classroom interior when the mission allows, interacting with the environment',
  'duck half-hidden by foreground equipment, scene-first composition with the duck as the doer',
];

const roleByKind = {
  ai: ['experiment subject', 'model trainer', 'prompt mechanic', 'AI lab tester', 'ethics referee'],
  code: ['bug hunter', 'prototype mechanic', 'systems tinkerer', 'logic explorer', 'tool builder'],
  data: ['evidence sorter', 'graph detective', 'field researcher', 'measurement skeptic', 'dashboard mechanic'],
  media: ['producer', 'editor', 'storyboard wrangler', 'brand tester', 'camera-shy creator'],
  privacy: ['boundary inspector', 'consent checker', 'file locksmith', 'privacy architect', 'digital rights scout'],
  security: ['forensic investigator', 'lock tester', 'phishing trap spotter', 'security auditor', 'incident responder'],
  school: ['student workflow survivor', 'printer negotiator', 'file organizer', 'agenda wrangler', 'cloud box mover'],
  project: ['prototype tester', 'launch assistant', 'impact explorer', 'portfolio curator', 'future scout'],
};

const locationByKind = {
  ai: [
    'a tiny model-testing greenhouse with labeled-looking but unreadable plant tags and AI widgets on rolling carts',
    'a school hallway pop-up AI repair booth with cables, crates, and a slightly dramatic help bell',
    'a quiet attic-like invention corner with sketch papers, model parts, and a window of warm daylight',
    'a miniature lab floor with test lanes, sample bins, and a model checkpoint gate',
  ],
  code: [
    'a makerspace floor with pegboards, tool crates, cable reels, and prototype parts',
    'a backstage game-arcade repair corner with cabinets shown only as abstract shapes',
    'a rooftop-like network test area with antennas, cable boxes, and wind-blown sketch papers',
    'a workshop alley between shelves of components, bug traps, and repair labels drawn as blank marks',
  ],
  data: [
    'a field-research tent with clipboards, sample jars, measuring tape, and graph flags',
    'a small newsroom corner with chart clippings, camera tripod, and evidence pins',
    'a museum-like data archive with drawers, magnifying glass, and oversized graph fragments',
    'a lab bench covered in scales, sample cards, and one suspiciously confident chart prop',
  ],
  media: [
    'a podcast blanket-fort studio with microphones, cushions, and cable trails',
    'a tiny film set with light stands, taped floor marks, props, and a clapperboard with no text',
    'a street-poster paste-up wall with blank poster frames, paint rollers, and brand swatches',
    'a costume-and-prop rack corner with storyboards, camera gear, and awkwardly serious props',
  ],
  privacy: [
    'a library privacy archive with curtains, lockboxes, and file carts',
    'a public-service counter with consent stamps, envelopes, and privacy screens',
    'a quiet bedroom digital-boundaries scene with devices in small lockboxes and a window seat',
    'a courthouse hallway made of symbolic scales, folders, and closed doors',
  ],
  security: [
    'a detective evidence room with string lines, decoy envelopes, locks, and a desk lamp',
    'a server-basement corridor with cable bundles, shields, and forensic trays',
    'a rainy bus-stop phishing trap scene with suspicious blank posters and a locked mailbox',
    'a night-shift security checkpoint with magnifiers, keycards, and sealed evidence bags',
  ],
  school: [
    'a locker hallway with backpacks, agenda cards, cloud boxes, and scattered school supplies',
    'a school library table island with folders, printer tickets, and a sleepy supply cart',
    'a printer corner near classroom cabinets with paper stacks, bins, and a plant trying to help',
    'a bike-shed style school entrance with timetable cards, bags, and weathered noticeboards with no text',
  ],
  project: [
    'a garage-style prototype bay with crates, blueprint rolls, test cones, and launch tape',
    'a mini trade-fair booth with blank panels, demo props, and a nervous spotlight',
    'a community workshop with round tables, toolboxes, sketches, and test objects',
    'a future-planning observatory corner with telescopes, timeline cards, and model buildings',
  ],
};

const friendCast = [
  'a small round robot friend with one camera eye and stick-like legs',
  'a careful beaver friend wearing tiny work goggles and carrying a clipboard with unreadable marks',
  'a lanky frog friend with a satchel, excellent posture, and a skeptical expression',
  'a tiny turtle friend with a shell backpack and calm project-manager energy',
  'a sparrow-like messenger friend with a scarf and a bundle of blank cards',
  'a hedgehog friend with round glasses, holding a magnifying glass or tool',
];

const inferKind = (id, title, description, problemScenario) => {
  const source = `${id} ${title} ${description} ${problemScenario}`.toLowerCase();
  if (/magister|cloud|word-wizard|print|printer|ipad|onedrive/.test(source)) return 'school';
  if (/privacy|avg|datalek|rechten|consent/.test(source)) return 'privacy';
  if (/security|cyber|phishing|wachtwoord|encrypt|forensic|hack|login/.test(source)) return 'security';
  if (/code|program|(^|[^a-z])api([^a-z]|$)|bug|algorithm|automation|developer|web|ml|neural|pipeline|open source/.test(source)) return 'code';
  if (/data|dashboard|spreadsheet|grafiek|onderzoek|bias|factcheck/.test(source)) return 'data';
  if (/podcast|meme|video|story|verhaal|brand|media|ux|slide|pitch|word|document|print|printer/.test(source)) return 'media';
  if (/(^|[^a-z])ai([^a-z]|$)|prompt|chatbot|machine learning/.test(source)) return 'ai';
  return 'project';
};

const promptFor = ({ id, yearGroup, period, periodTitle, isReview, title, description, problemScenario, kind, index }) => {
  const scene = sceneByKind[kind] ?? sceneByKind.project;
  const reviewNote = isReview ? 'This is a review/checkpoint mission, so the scene should feel like a calm assessment checkpoint rather than a new adventure.' : '';
  const posture = postureByIndex[index % postureByIndex.length];
  const roles = roleByKind[kind] ?? roleByKind.project;
  const role = roles[index % roles.length];
  const locations = locationByKind[kind] ?? locationByKind.project;
  const location = locations[index % locations.length];
  const friendA = friendCast[index % friendCast.length];
  const friendB = friendCast[(index + 2) % friendCast.length];
  return [
    'Use case: illustration-story',
    'Asset type: 16:10 DGSkills assignment thumbnail for a student and teacher dashboard',
    `Primary request: Create a new thumbnail for the DGSkills mission "${title}" (${id}), leerjaar ${yearGroup}, periode ${period}: ${periodTitle}.`,
    `Scene/backdrop: ${location}; ${scene}. Make the environment mission-specific and noticeably different from nearby thumbnails.`,
    `Duck role: the duck is a ${role}, actively doing the mission or dealing with its consequences. The duck should not look like a teacher lecturing a class unless the mission explicitly requires presenting.`,
    `Subject: the DGSkills duck guide as the main character, drawn like the existing duck mascot: natural duck anatomy, sketchy feather texture, confident beak shape, graduate cap or small tech medallion when useful. Include duck friends in the same hand-drawn design language: ${friendA}; optionally ${friendB}. Friends should be active in the scene, not decorative stickers.`,
    'Style/medium: hand-drawn wooden pencil and black ink illustration on warm off-white paper, visible graphite shading, crosshatching, confident linework, a few acid-lime digital accent marks, mature education-tech editorial tone; absolutely not 3D, not plastic, not toy-like, not cartoon preschool.',
    `Duck pose/composition variation: ${posture}. Vary camera angle, posture, scale, and scene staging strongly from nearby thumbnails while keeping the same brand style.`,
    'Composition/framing: landscape 16:10, clear central action, generous safe margins, readable at small card size, no UI chrome, strong silhouette and simple background; use varied camera angles such as low angle, side view, top-down workspace, corner view, or close foreground prop.',
    'Perspective rule: if a desk or table appears, the duck must be clearly behind it, beside it, or in front of it with believable overlap; never standing in the desk, emerging from a tabletop, or intersecting furniture.',
    'Lighting/mood: calm, lightly deadpan humor; the duck looks capable, slightly unimpressed, and aware the assignment is more dramatic than necessary.',
    'Color palette: mostly graphite, black ink, warm paper, and controlled DGSkills acid-lime highlights; avoid saturated rainbow color and avoid purple-heavy looks.',
    `Mission context: ${description || problemScenario || title}`,
    reviewNote,
    'Constraints: no readable text, no logos, no watermarks, no real student faces, no photorealistic minors, no gore, no personal data, no screenshots of real services.',
    'Avoid: generic stock classroom imagery, same room every time, plain office desk setup, dark cyberpunk gloom, busy tiny details, fake brand names, misspelled words, visible typography, 3D render, glossy plastic, childish sticker style, round mascot toy proportions, repeated teacher-at-board pose, repeated presenter pose, repeated desk lecture composition.',
  ].filter(Boolean).join('\n');
};

const entries = [];
const seen = new Set();
for (const period of periods) {
  for (const mission of period.missions) {
    if (seen.has(mission.id)) continue;
    seen.add(mission.id);
    const agent = agentByMission.get(mission.id) ?? {};
    const title = agent.title ?? mission.id;
    const description = agent.description ?? '';
    const problemScenario = agent.problemScenario ?? '';
    const outputPath = thumbnailByMission[mission.id];
    const kind = inferKind(mission.id, title, description, problemScenario);
    entries.push({
      missionId: mission.id,
      yearGroup: period.yearGroup,
      yearTitle: period.yearTitle,
      period: period.period,
      periodTitle: period.periodTitle,
      isReview: mission.isReview,
      title,
      description,
      problemScenario,
      kind,
      outputPath,
      workspaceOutputPath: outputPath ? `public${outputPath}` : undefined,
      prompt: promptFor({
        id: mission.id,
        yearGroup: period.yearGroup,
        period: period.period,
        periodTitle: period.periodTitle,
        isReview: mission.isReview,
        title,
        description,
        problemScenario,
        kind,
        index: entries.length,
      }),
    });
  }
}

const missingOutput = entries.filter((entry) => !entry.outputPath);
if (entries.length !== 97 || missingOutput.length) {
  console.error(JSON.stringify({ count: entries.length, missingOutput }, null, 2));
  process.exit(1);
}

const manifest = {
  generatedAt: new Date().toISOString(),
  source: {
    curriculum: 'src/config/curriculum.ts',
    thumbnails: 'src/config/missionThumbnails.ts',
    agents: agentFiles,
  },
  imagegenMode: 'built-in image_gen',
  styleContract: 'DGSkills duck guide in the existing hand-drawn wooden-pencil/ink style, dry visual humor, no readable text, no real student faces, existing output paths preserved.',
  count: entries.length,
  entries,
};

const outPath = path.join(root, 'public/assets/previews/mission-thumbnail-manifest.json');
fs.writeFileSync(outPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Wrote ${entries.length} thumbnail prompts to ${path.relative(root, outPath)}`);
