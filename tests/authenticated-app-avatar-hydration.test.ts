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
