import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const authenticatedAppSource = readFileSync(
    new URL('../src/app/AuthenticatedApp.tsx', import.meta.url),
    'utf8',
);

test('avatar-onboarding sluit een eerder geplande gate zodra gehydrateerde stats completion bewijzen', () => {
    const effectStart = authenticatedAppSource.indexOf('// Onboarding triggers:');
    const effectEnd = authenticatedAppSource.indexOf('// Eindmeting:', effectStart);
    const onboardingEffects = authenticatedAppSource.slice(effectStart, effectEnd);

    assert.ok(effectStart >= 0 && effectEnd > effectStart);
    assert.match(
        onboardingEffects,
        /hasCompletedAvatarSetup === true[\s\S]*setShowAvatarSetup\(false\)/,
    );
});

test('avatar-onboarding rendert nooit wanneer de actuele stats completion bewijzen', () => {
    assert.match(
        authenticatedAppSource,
        /if \(showAvatarSetup && user\.role === 'student' && !hasCompletedAvatarSetup\)/,
    );
});

test('welkomscherm staat vóór de avatarbouwer in de eerste-login-keten', () => {
    const welcomeGate = authenticatedAppSource.indexOf("if (showStudentOnboarding && user.role === 'student'");
    const avatarGate = authenticatedAppSource.indexOf("if (showAvatarSetup && user.role === 'student'");

    assert.ok(welcomeGate >= 0, 'welkomspoort ontbreekt');
    assert.ok(avatarGate >= 0, 'avatarpoort ontbreekt');
    assert.ok(welcomeGate < avatarGate, 'welkomscherm moet vóór de avatarbouwer komen');
});

test('bestaande leerlingen krijgen het welkomscherm niet alsnog', () => {
    // hasCompletedAvatarSetup is het vangnet: de squash-historie bewijst niet dat
    // elke leerling met een avatar ook hasCompletedOnboarding heeft.
    assert.match(
        authenticatedAppSource,
        /hasSeenWelcome = user\.stats\?\.hasCompletedOnboarding === true \|\| hasCompletedAvatarSetup/,
    );
});

test('welkomspoort sluit zodra gehydrateerde stats completion bewijzen', () => {
    const effectStart = authenticatedAppSource.indexOf('// Onboarding triggers:');
    const effectEnd = authenticatedAppSource.indexOf('// Eindmeting:', effectStart);
    const onboardingEffects = authenticatedAppSource.slice(effectStart, effectEnd);

    assert.ok(effectStart >= 0 && effectEnd > effectStart);
    assert.match(onboardingEffects, /setShowStudentOnboarding\(false\)/);
});

test('het welkomscherm voegt geen tweede stats-schrijfactie toe', () => {
    // `update_student_stats` VERVANGT het hele stats-blok; een extra aanroep terwijl
    // stats nog niet gehydrateerd zijn wist voortgang. De vlag hoort mee te liften
    // op de ene RPC na de avatarsetup.
    const gateStart = authenticatedAppSource.indexOf('const handleWelcomeComplete');
    const gateEnd = authenticatedAppSource.indexOf('if (showAvatarSetup', gateStart);
    const welcomeGate = authenticatedAppSource.slice(gateStart, gateEnd);

    assert.ok(gateStart >= 0 && gateEnd > gateStart);
    assert.doesNotMatch(welcomeGate, /handleSaveProgress/);
});
