import { readFileSync } from 'node:fs';

const registerPath = 'docs/compliance/legal-evidence-register.md';
const sourcePath = 'docs/compliance/legal-claim-source-of-truth.md';

const register = readFileSync(registerPath, 'utf8');
const source = readFileSync(sourcePath, 'utf8');

const failures = [];
const requireText = (text, needle, label) => {
  if (!text.includes(needle)) failures.push(label);
};

for (const [needle, label] of [
  ['https://www.autoriteitpersoonsgegevens.nl/themas/basis-avg', 'missing AP basis AVG source'],
  ['https://www.autoriteitpersoonsgegevens.nl/themas/basis-avg/privacyrechten-avg/data-protection-impact-assessment-dpia', 'missing AP DPIA source'],
  ['https://www.autoriteitpersoonsgegevens.nl/themas/internet-slimme-apparaten/cookies', 'missing AP cookies source'],
  ['https://wetten.overheid.nl/BWBR0040940', 'missing UAVG source'],
  ['https://www.privacyconvenant.nl/', 'missing Privacyconvenant source'],
  ['https://eur-lex.europa.eu/eli/reg/2016/679/oj', 'missing GDPR source'],
  ['https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai', 'missing European Commission AI Act source'],
]) {
  requireText(source, needle, label);
  requireText(register, needle.split('/')[2] ?? needle, `register ${label}`);
}

for (const id of [
  'AVG-001',
  'AVG-002',
  'AVG-003',
  'AVG-004',
  'AI-001',
  'AI-002',
  'PROVIDER-001',
  'PROVIDER-002',
  'DATA-001',
  'RIGHTS-001',
  'RETENTION-001',
]) {
  requireText(register, `| ${id} |`, `missing evidence row ${id}`);
}

for (const phrase of [
  'Needs DPO',
  'Needs Provider Proof',
  'Needs Live Proof',
]) {
  requireText(register, phrase, `missing evidence status ${phrase}`);
}

if (!/Needs Technical Proof|Technical Control Added/.test(register)) {
  failures.push('missing evidence status Needs Technical Proof or Technical Control Added');
}

if (/Status \| Owner \| Next review[\s\S]*\|\s*Verified\s*\|/i.test(register)) {
  failures.push('register may not use Verified status without signed/legal evidence convention');
}

if (failures.length) {
  console.error(`Legal evidence check failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Legal evidence register passed');
