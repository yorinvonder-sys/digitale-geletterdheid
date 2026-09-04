import assert from 'node:assert/strict';
import test from 'node:test';

import {
    LEERLIJN,
    COVERAGE,
    COVERED_KERNDOEL_COUNT,
    TOTAL_MISSION_COUNT,
    REGULIER_VO_CODES,
} from '../../src/features/seo/leerlijnData.ts';
import { getAllMissionIds } from '../../src/config/curriculum.ts';
import { getMissionMeta } from '../../src/config/slo-kerndoelen-mapping.ts';

/*
 * De publieke leerlijn-pagina rendert deze data rechtstreeks. Ze mag daarom niet
 * stilzwijgend uit de pas lopen met het curriculum — dat is precies wat er met
 * ScholenLandingMissionShowcase gebeurde, waar een handmatige kopie een opdracht
 * bleef tonen die allang uit het curriculum was gehaald.
 */

test('elke curriculum-opdracht heeft een titel en kerndoelen in de SLO-mapping', () => {
    const zonderMeta = getAllMissionIds().filter((id) => !getMissionMeta(id));

    assert.deepEqual(
        zonderMeta,
        [],
        `Deze opdrachten staan in curriculum.ts maar niet in slo-kerndoelen-mapping.ts, ` +
            `waardoor de publieke pagina hun ID zou tonen in plaats van hun titel: ${zonderMeta.join(', ')}`,
    );
});

test('geen enkele opdracht op de pagina toont een rauw ID of een lege kerndoellijst', () => {
    const missions = LEERLIJN.flatMap((year) => year.periods.flatMap((period) => period.missions));

    assert.ok(missions.length > 0, 'leerlijn bevat geen opdrachten');

    for (const mission of missions) {
        assert.notEqual(mission.title, mission.id, `opdracht ${mission.id} valt terug op zijn ID als titel`);
        assert.ok(mission.kerndoelen.length > 0, `opdracht ${mission.id} heeft geen kerndoelen`);
    }
});

test('alle reguliere VO-kerndoelen worden door minstens één opdracht gedekt', () => {
    const ongedekt = COVERAGE.filter((row) => row.total === 0).map((row) => row.code);

    // De pagina toont "x van de 9 kerndoelen" uit deze telling. Zakt de dekking,
    // dan moet deze test rood worden voordat de claim onwaar op de site staat.
    assert.deepEqual(ongedekt, [], `kerndoelen zonder opdracht: ${ongedekt.join(', ')}`);
    assert.equal(COVERED_KERNDOEL_COUNT, REGULIER_VO_CODES.length);
});

test('de dekkingsmatrix telt dezelfde opdrachten als de leerjaaroverzichten', () => {
    for (const row of COVERAGE) {
        assert.equal(row.perYear.length, LEERLIJN.length, `rij ${row.code} mist een leerjaarkolom`);
        assert.equal(
            row.total,
            row.perYear.reduce((a, b) => a + b, 0),
            `totaal van ${row.code} klopt niet met de leerjaarkolommen`,
        );
    }

    const uitLeerjaren = LEERLIJN.reduce((acc, year) => acc + year.missionCount, 0);
    assert.equal(TOTAL_MISSION_COUNT, uitLeerjaren);
});
