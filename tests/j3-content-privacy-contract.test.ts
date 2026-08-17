import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const digitalForensics = readFileSync(
    new URL('../src/features/missions/templates/scenario-engine/configs/digital-forensics.ts', import.meta.url),
    'utf8',
);
const wellbeingResearcher = readFileSync(
    new URL('../src/features/missions/templates/data-viewer/configs/welzijnsonderzoeker.ts', import.meta.url),
    'utf8',
);
const missionGoals = readFileSync(
    new URL('../src/config/missionGoals.ts', import.meta.url),
    'utf8',
);

test('J3-content gebruikt alleen synthetische, privacyveilige deelnemersdata', () => {
    assert.match(wellbeingResearcher, /participant_id/);
    assert.match(wellbeingResearcher, /Deelnemer-ID/);
    assert.doesNotMatch(wellbeingResearcher, /\bkey:\s*'naam'|\blabel:\s*'Naam'|\bnaam\s*:/);

    for (const firstName of [
        'Yassin', 'Luna', 'Bram', 'Kai', 'Fenna', 'Dex', 'Roos', 'Isabelle',
        'Prem', 'Mila', 'Joren', 'Nadia', 'Aiko', 'Sofie', 'Lien',
    ]) {
        assert.doesNotMatch(wellbeingResearcher, new RegExp(`\\b${firstName}\\b`, 'i'));
    }

    assert.match(wellbeingResearcher, /synthetische oefendataset/i);
    assert.match(wellbeingResearcher, /geen echte leerlingen/i);
    assert.doesNotMatch(wellbeingResearcher, /de gemiddelde jongere/i);
    assert.match(wellbeingResearcher, /geen uitspraak over het werkelijke schermgebruik van jongeren/i);
    assert.match(wellbeingResearcher, /deel geen eigen welzijns-.*, naam-.*, contact-.*, gezondheids-.* of slaapgegevens/i);

    const wellbeingGoal = missionGoals.slice(
        missionGoals.indexOf("'welzijnsonderzoeker':"),
        missionGoals.indexOf("'tech-impact-analyst':"),
    );
    assert.match(wellbeingGoal, /synthetische oefendata/i);
    assert.doesNotMatch(wellbeingGoal, /CBS-statistieken|Trimbos|Harvard/i);
});

test('digital-forensics houdt de fictieve J3-incidenttelling en vaste antwoorden coherent', () => {
    assert.match(digitalForensics, /fictieve, synthetische incidentdata/i);
    assert.match(digitalForensics, /fictief, synthetisch ziekenhuisincident/i);
    assert.doesNotMatch(digitalForensics, /Vijf mislukte inlogpogingen binnen 10 seconden/);

    const bruteForce = digitalForensics.slice(
        digitalForensics.indexOf("id: 1,", digitalForensics.indexOf("id: 'verdachte-logregels'")),
        digitalForensics.indexOf("id: 2,", digitalForensics.indexOf("id: 'verdachte-logregels'")),
    );
    assert.match(bruteForce, /Vier mislukte inlogpogingen gevolgd door succes/);
    assert.equal((bruteForce.match(/LOGIN FAILED/g) ?? []).length, 4);
    assert.equal((bruteForce.match(/LOGIN SUCCESS/g) ?? []).length, 1);
    assert.match(bruteForce, /vier mislukte pogingen.*één succesvolle inlog.*vijf login-events in totaal/i);
    assert.match(bruteForce, /correct: true/);

    const timeline = digitalForensics.slice(
        digitalForensics.indexOf("id: 'tijdlijn-bouwen'"),
        digitalForensics.indexOf("id: 'feit-of-aanname'"),
    );
    assert.match(timeline, /22:54:17 en 22:54:19.*twee mislukte pogingen/s);
    assert.match(timeline, /22:54:22 \| LOGIN SUCCESS/);
    assert.match(timeline, /synthetic_patient_records/);
});
