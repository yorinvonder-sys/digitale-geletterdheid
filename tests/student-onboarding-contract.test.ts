import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const onboardingSource = readFileSync(
    new URL('../src/features/student/StudentOnboarding.tsx', import.meta.url),
    'utf8',
);
const tutorialSource = readFileSync(
    new URL('../src/contexts/TutorialContext.tsx', import.meta.url),
    'utf8',
);
const authServiceSource = readFileSync(
    new URL('../src/services/authService.ts', import.meta.url),
    'utf8',
);
const avatarSetupSource = readFileSync(
    new URL('../src/features/profile/avatar/AvatarSetup.tsx', import.meta.url),
    'utf8',
);

test('welkomscherm telt precies twee stappen', () => {
    const ids = [...onboardingSource.matchAll(/^\s{8}id: '([a-z]+)',$/gm)].map(m => m[1]);
    assert.deepEqual(ids, ['welcome', 'xp']);
});

test('welkomscherm bevat geen onbronde percentage-claims', () => {
    // "85% van banen gebruikt digitale tools" en "3x effectiever" stonden hier
    // zonder bron. School-facing cijfers moeten herleidbaar zijn.
    assert.doesNotMatch(onboardingSource, /value: '\d+%'/);
    assert.doesNotMatch(onboardingSource, /85%/);
});

test('beloofde XP overschrijdt de servergrens van 25 per missie niet', () => {
    // De server kapt elke toekenning af met LEAST(p_amount, 25) — zie
    // supabase/migrations/20260222020000_server_side_xp.sql. De oude tekst
    // beloofde +100 XP, wat nooit werd uitgekeerd.
    const promised = [...onboardingSource.matchAll(/xp: '\+(\d+) XP'/g)].map(m => Number(m[1]));

    assert.ok(promised.length > 0, 'geen XP-voorbeelden gevonden');
    for (const amount of promised) {
        assert.ok(amount <= 25, `belooft +${amount} XP, server keert maximaal 25 uit`);
    }
});

test('rondleiding gebruikt de merknaam DGSkills', () => {
    assert.doesNotMatch(tutorialSource, /Project DG/);
});

test('de rondleidingsvlag hoort bij de leerling, niet bij het apparaat', () => {
    // Gedeelde schoolapparaten: zonder persistLocally={false} kreeg de volgende
    // leerling op dezelfde laptop nooit een rondleiding.
    const authenticatedAppSource = readFileSync(
        new URL('../src/app/AuthenticatedApp.tsx', import.meta.url),
        'utf8',
    );
    assert.match(authenticatedAppSource, /persistLocally=\{false\}/);
});

test('de opruimlijst bij uitloggen matcht de echte tutorial-sleutel', () => {
    const key = tutorialSource.match(/STUDENT_STORAGE_KEY = '([^']+)'/)?.[1];
    assert.ok(key, 'STUDENT_STORAGE_KEY niet gevonden');

    const prefixes = [...authServiceSource.matchAll(/^\s+'([^']+)',\s+\/\//gm)].map(m => m[1]);
    assert.ok(
        prefixes.some(prefix => key!.startsWith(prefix)),
        `geen enkele opruim-prefix matcht '${key}' — de vlag blijft dan staan na uitloggen`,
    );
});

test('de avatarbouwer toont de 3D-figuur, niet de oude 2D-eend', () => {
    assert.match(avatarSetupSource, /<LazyAvatarViewer/);
    assert.doesNotMatch(avatarSetupSource, /AvatarViewer2D/);
    // avatarKind was de eend/mens-schakelaar; die hoort nergens meer terug te komen.
    assert.doesNotMatch(avatarSetupSource, /avatarKind/);
});
