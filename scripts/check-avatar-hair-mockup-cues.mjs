import { readFileSync } from 'node:fs';

const source = readFileSync('src/features/profile/avatar/AvatarViewer.tsx', 'utf8');

function getCaseBody(style) {
  const start = source.indexOf(`case '${style}':`);
  if (start === -1) throw new Error(`Missing HairLayer case for "${style}"`);
  const nextCase = source.indexOf('\n        case ', start + 1);
  const nextSection = source.indexOf('\n        // === FEMALE', start + 1);
  const candidates = [nextCase, nextSection].filter(index => index !== -1);
  const end = candidates.length ? Math.min(...candidates) : source.indexOf('\n    }', start + 1);
  return source.slice(start, end);
}

function extractBlocks(body) {
  const blocks = [];
  const pattern = /\[(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?),\s*'(base|dark|light)'\]/g;
  for (const match of body.matchAll(pattern)) {
    blocks.push({
      gx: Number(match[1]),
      gy: Number(match[2]),
      gz: Number(match[3]),
      sx: Number(match[4]),
      sy: Number(match[5]),
      sz: Number(match[6]),
      shade: match[7],
    });
  }
  return blocks;
}

function requireIncludes(body, style, cues) {
  for (const cue of cues) {
    if (!body.includes(cue)) {
      throw new Error(`${style} is missing semantic cue: ${cue}`);
    }
  }
}

function maxTop(blocks) {
  return Math.max(...blocks.map(block => block.gy + block.sy / 2));
}

const expectations = {
  short: {
    minBlocks: 24,
    minTop: 5.6,
    maxTop: 6.15,
    cues: [
      'Final mockup: short crop',
      'stepped tile crown',
      'low crown grid',
      'square micro-bangs',
      'visible ears',
    ],
  },
  spiky: {
    minBlocks: 24,
    minTop: 7,
    maxTop: 8.2,
    forbidden: ['rotation={'],
    cues: [
      'Final mockup: spiky crop',
      'connected spike bed',
      'distributed spike field',
      'front row spikes',
      'crown spikes',
      'not a mohawk',
    ],
  },
  messy: {
    minBlocks: 49,
    minTop: 7,
    maxTop: 7.6,
    cues: [
      'Final mockup: wild bedhead',
      'reference-image full voxel bedhead',
      'dense block halo',
      'oversized visible crown clumps',
      'front readable bedhead clumps',
      'layered top texture',
      'chunky side mass',
      'asymmetric fringe',
      'side locks',
      'raised crown',
      'no floating blocks',
    ],
  },
};

for (const [style, expected] of Object.entries(expectations)) {
  const body = getCaseBody(style);
  const blocks = extractBlocks(body);

  if (blocks.length < expected.minBlocks) {
    throw new Error(`${style} has ${blocks.length} voxel blocks; expected at least ${expected.minBlocks}`);
  }

  const top = maxTop(blocks);
  if (expected.minTop !== undefined && top < expected.minTop) {
    throw new Error(`${style} top silhouette is too low (${top}); expected at least ${expected.minTop}`);
  }
  if (expected.maxTop !== undefined && top > expected.maxTop) {
    throw new Error(`${style} top silhouette is too tall (${top}); expected at most ${expected.maxTop}`);
  }

  for (const forbidden of expected.forbidden ?? []) {
    if (body.includes(forbidden)) {
      throw new Error(`${style} contains forbidden cue: ${forbidden}`);
    }
  }

  requireIncludes(body, style, expected.cues);
}

console.log('Avatar hair mockup cues OK: short, spiky, messy.');
