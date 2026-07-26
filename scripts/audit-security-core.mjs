const EXPIRES_ON = '2026-10-31';
const ALLOWED_ADVISORY = {
  source: 1124334,
  name: 'brace-expansion',
  dependency: 'brace-expansion',
  url: 'https://github.com/advisories/GHSA-mh99-v99m-4gvg',
  severity: 'high',
  range: '<=5.0.7',
};

const EXPECTED_VIA = {
  archiver: ['archiver-utils', 'readdir-glob', 'zip-stream'],
  'archiver-utils': ['glob'],
  'brace-expansion': [],
  exceljs: ['archiver', 'unzipper'],
  fstream: ['rimraf'],
  glob: ['minimatch'],
  minimatch: ['brace-expansion'],
  'readdir-glob': ['minimatch'],
  rimraf: ['glob'],
  unzipper: ['fstream'],
  'zip-stream': ['archiver-utils'],
};

const EXPECTED_NODES = {
  archiver: ['node_modules/archiver'],
  'archiver-utils': [
    'node_modules/archiver-utils',
    'node_modules/zip-stream/node_modules/archiver-utils',
  ],
  'brace-expansion': [
    'node_modules/archiver-utils/node_modules/brace-expansion',
    'node_modules/fstream/node_modules/brace-expansion',
    'node_modules/readdir-glob/node_modules/brace-expansion',
    'node_modules/zip-stream/node_modules/brace-expansion',
  ],
  exceljs: ['node_modules/exceljs'],
  fstream: ['node_modules/fstream'],
  glob: [
    'node_modules/archiver-utils/node_modules/glob',
    'node_modules/fstream/node_modules/glob',
    'node_modules/zip-stream/node_modules/glob',
  ],
  minimatch: [
    'node_modules/archiver-utils/node_modules/minimatch',
    'node_modules/fstream/node_modules/minimatch',
    'node_modules/readdir-glob/node_modules/minimatch',
    'node_modules/zip-stream/node_modules/minimatch',
  ],
  'readdir-glob': ['node_modules/readdir-glob'],
  rimraf: ['node_modules/fstream/node_modules/rimraf'],
  unzipper: ['node_modules/unzipper'],
  'zip-stream': ['node_modules/zip-stream'],
};

function sorted(values) {
  return [...values].sort();
}

function assertAllowedStrings(actual, allowed, message) {
  const unexpected = actual.filter((value) => !allowed.includes(value));
  if (unexpected.length > 0) {
    throw new Error(`${message}: ${JSON.stringify(sorted(unexpected))}`);
  }
}

function assertSameStrings(actual, expected, message) {
  if (JSON.stringify(sorted(actual)) !== JSON.stringify(sorted(expected))) {
    throw new Error(`${message}: ${JSON.stringify(sorted(actual))}`);
  }
}

function isAllowedAdvisory(advisory) {
  return Object.entries(ALLOWED_ADVISORY).every(
    ([key, value]) => advisory[key] === value,
  );
}

export function validateAuditReport(report, now = new Date()) {
  if (
    !report ||
    typeof report.vulnerabilities !== 'object' ||
    Array.isArray(report.vulnerabilities)
  ) {
    throw new Error('npm audit gaf geen geldig vulnerabilities-object terug');
  }

  const entries = Object.entries(report.vulnerabilities);
  if (entries.length === 0) {
    return { allowedAdvisories: 0 };
  }

  const today = now.toISOString().slice(0, 10);
  if (today > EXPIRES_ON) {
    throw new Error(`De tijdelijke audit-uitzondering is vervallen op ${EXPIRES_ON}`);
  }

  for (const [name, vulnerability] of entries) {
    if (!(name in EXPECTED_VIA)) {
      throw new Error(`Niet toegestane kwetsbare package: ${name}`);
    }
    if (vulnerability.name !== name || vulnerability.severity !== 'high') {
      throw new Error(`Onverwachte auditmetadata voor ${name}`);
    }
    if (vulnerability.isDirect !== (name === 'exceljs')) {
      throw new Error(`Onverwachte directe dependency-status voor ${name}`);
    }

    const advisoryEntries = vulnerability.via.filter((item) => typeof item === 'object');
    const dependencyEntries = vulnerability.via.filter((item) => typeof item === 'string');
    assertAllowedStrings(
      dependencyEntries,
      EXPECTED_VIA[name],
      `Onverwachte vulnerability-keten voor ${name}`,
    );
    assertSameStrings(
      vulnerability.nodes,
      EXPECTED_NODES[name],
      `Onverwachte dependency-node voor ${name}`,
    );

    for (const advisory of advisoryEntries) {
      if (!isAllowedAdvisory(advisory)) {
        throw new Error(`Advisory niet toegestaan: ${advisory.url ?? advisory.source ?? 'onbekend'}`);
      }
    }
    if (name === 'brace-expansion' && advisoryEntries.length !== 1) {
      throw new Error('De verwachte brace-expansion-advisory ontbreekt of komt dubbel voor');
    }
    if (name !== 'brace-expansion' && advisoryEntries.length !== 0) {
      throw new Error(`Onverwachte directe advisory voor ${name}`);
    }
  }

  if (!report.vulnerabilities['brace-expansion']) {
    throw new Error('De toegestane dependencyketen mist de brace-expansion-hoofdoorzaak');
  }

  const reachesAllowedRoot = (name, visited = new Set()) => {
    if (name === 'brace-expansion') return true;
    if (visited.has(name)) return false;
    visited.add(name);
    const vulnerability = report.vulnerabilities[name];
    if (!vulnerability) return false;
    return vulnerability.via
      .filter((item) => typeof item === 'string')
      .some((dependency) => reachesAllowedRoot(dependency, new Set(visited)));
  };

  for (const [name] of entries) {
    if (!reachesAllowedRoot(name)) {
      throw new Error(`${name} is niet herleidbaar tot de toegestane brace-expansion-advisory`);
    }
  }

  return { allowedAdvisories: 1, expiresOn: EXPIRES_ON };
}
