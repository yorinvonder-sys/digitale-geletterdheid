import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { parseMissionCompletion } from '../src/services/missionCompletionContract.ts';
import { toScorePercent } from '../src/features/missions/templates/shared/scorePercent.ts';

test('accepteert alleen een duurzaam bevestigde missiecompletion', () => {
    assert.deepEqual(
        parseMissionCompletion(
            {
                completed: true,
                missionId: 'magister-master',
                missionsCompleted: ['cloud-commander', 'magister-master'],
            },
            'magister-master',
        ),
        ['cloud-commander', 'magister-master'],
    );
});

test('weigert een RPC-resultaat waarin de gevraagde missie ontbreekt', () => {
    assert.throws(
        () =>
            parseMissionCompletion(
                {
                    completed: true,
                    missionId: 'magister-master',
                    missionsCompleted: [],
                },
                'magister-master',
            ),
        /did not persist/,
    );
});

test('slaat completion duurzaam op voordat XP wordt toegekend', () => {
    const source = readFileSync(
        new URL('../src/app/AuthenticatedApp.tsx', import.meta.url),
        'utf8',
    );
    const handlerStart = source.indexOf('async function handleMissionComplete');
    const handlerEnd = source.indexOf('// Peer feedback overlay', handlerStart);
    const handler = source.slice(handlerStart, handlerEnd);

    assert.ok(handlerStart >= 0 && handlerEnd > handlerStart);
    assert.match(handler, /markMissionCompleted/);
    assert.match(handler, /awardXP/);
    assert.match(handler, /setPeerFeedbackMissionId/);
    assert.equal(handler.includes('handleSaveProgress'), false);
    assert.ok(handler.indexOf('markMissionCompleted') < handler.indexOf('awardXP'));
    assert.ok(handler.indexOf('awardXP') < handler.indexOf('setPeerFeedbackMissionId'));
});

test('de score is een percentage en blijft binnen 0-100', () => {
    assert.equal(toScorePercent(0, 60), 0);
    assert.equal(toScorePercent(30, 60), 50);
    assert.equal(toScorePercent(60, 60), 100);
    // Een opdracht met een ander maximum levert hetzelfde signaal op.
    assert.equal(toScorePercent(50, 100), 50);
    assert.equal(toScorePercent(12.5, 25), 50);
    // Een motor die zich verrekent mag geen onzin naar de docent sturen.
    assert.equal(toScorePercent(999, 60), 100);
    assert.equal(toScorePercent(-5, 60), 0);
    // Geen zinnig maximum: niets vastleggen is beter dan een nul.
    assert.equal(toScorePercent(10, 0), undefined);
    assert.equal(toScorePercent(Number.NaN, 60), undefined);
});

test('de leerling schrijft status noch score op de eigen voortgangsrij', () => {
    const source = readFileSync(
        new URL('../src/services/missionService.ts', import.meta.url),
        'utf8',
    );
    const start = source.indexOf('export const saveMissionProgress');
    const end = source.indexOf('export const loadMissionProgress', start);
    const save = source.slice(start, end);

    assert.ok(start >= 0 && end > start);
    // Deze twee kolommen zijn ingetrokken voor de rol `authenticated`
    // (migratie 20260808120000). Wie ze hier terugzet, breekt het opslaan van
    // leerlingwerk met een permissiefout -- niet zichtbaar in de typecheck.
    assert.equal(/\bstatus:/.test(save), false);
    assert.equal(/\bscore:/.test(save), false);
    // Het eigen werk moet wel bewaard blijven.
    assert.match(save, /progress_data/);
});

test('alle tien de sjablonen geven een score mee bij afronden', () => {
    const templates = [
        ['data-viewer', 'DataViewer'],
        ['scenario-engine', 'ScenarioEngine'],
        ['review-arena', 'ReviewArena'],
        ['builder-canvas', 'BuilderCanvas'],
        ['simulation-lab', 'SimulationLab'],
        ['tool-guide', 'ToolGuide'],
        ['debate-arena', 'DebateArena'],
        ['puzzle-lab', 'PuzzleLab'],
        ['ethics-council', 'EthicsCouncil'],
        ['password-fortress', 'PasswordFortress'],
    ];

    for (const [dir, name] of templates) {
        const source = readFileSync(
            new URL(`../src/features/missions/templates/${dir}/${name}.tsx`, import.meta.url),
            'utf8',
        );
        assert.match(
            source,
            /onComplete\([^)]*,\s*toScorePercent\(/,
            `${name} geeft geen score mee aan onComplete`,
        );
    }
});

test('voortgang wordt via de server bewaard, vóór de rechtstreekse weg', () => {
    const source = readFileSync(
        new URL('../src/services/missionService.ts', import.meta.url),
        'utf8',
    );
    const start = source.indexOf('export const saveMissionProgress');
    const end = source.indexOf('export const loadMissionProgress', start);
    const save = source.slice(start, end);

    assert.ok(start >= 0 && end > start);
    // Een rij op 'completed' is door de leerling zelf niet meer bij te werken:
    // de RLS-regel filtert hem weg in de USING-clausule. Zonder deze aanroep
    // verdwijnt al het werk dat na de automatische voltooiing wordt gemaakt.
    assert.match(save, /rpc\('save_mission_progress'/);
    // De rechtstreekse weg mag alleen nog de terugval zijn zolang de migratie
    // niet overal draait -- dus ná de serveraanroep.
    assert.ok(save.indexOf("rpc('save_mission_progress'") < save.indexOf('.upsert('));
});

test('de opslagfunctie raakt status, score en attempts niet aan', () => {
    const sql = readFileSync(
        new URL('../supabase/migrations/20260808180000_save_progress_after_completion.sql', import.meta.url),
        'utf8',
    );
    const start = sql.indexOf('CREATE OR REPLACE FUNCTION public.save_mission_progress');
    const body = sql.slice(start);

    assert.ok(start >= 0);
    assert.match(body, /SECURITY DEFINER/);
    // Zonder deze guard zou de uitzondering de verwerkingsbeperking omzeilen die
    // de RLS-regels wel afdwingen (AVG art. 18).
    assert.match(body, /current_user_processing_restricted/);
    // De kolommen die de docent ziet horen bij mark_mission_completed en mogen
    // niet langs deze weg beweegbaar zijn.
    const setClause = body.slice(body.indexOf('DO UPDATE SET'), body.indexOf('END;'));
    for (const kolom of ['status', 'score', 'attempts']) {
        assert.equal(
            new RegExp(`\\b${kolom}\\s*=`).test(setClause),
            false,
            `save_mission_progress schrijft ${kolom}`,
        );
    }
});
