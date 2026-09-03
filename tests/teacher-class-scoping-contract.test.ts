import assert from 'node:assert/strict';
import test from 'node:test';

import {
    teachersWithoutClass,
    classesWithoutTeacher,
    strictReadiness,
    type ClassScopingOverview,
} from '../src/services/teacherClassScopingContract.ts';

/**
 * De opzet gebruikt bewust twee docenten, drie klassen en een leerling zonder
 * klas door elkaar. Met één docent en één klas zou elke afleiding hieronder
 * groen zijn zonder iets te bewijzen.
 */
const overzicht = (patch: Partial<ClassScopingOverview> = {}): ClassScopingOverview => ({
    links: [
        { id: 'l1', teacherId: 't1', schoolId: 's1', studentClass: 'MH1A', source: 'manual', createdAt: '2026-09-01' },
        { id: 'l2', teacherId: 't1', schoolId: 's1', studentClass: 'MH1B', source: 'roster_import', createdAt: '2026-09-01' },
    ],
    teachers: [
        { id: 't1', name: 'Docent met klassen' },
        { id: 't2', name: 'Docent zonder klassen' },
    ],
    classes: ['MH1A', 'MH1B', 'MH1C'],
    studentsWithoutClass: [{ id: 's-zonder', name: 'Leerling zonder klas' }],
    scope: 'school',
    ...patch,
});

test('een docent zonder toewijzing valt op, een docent met toewijzingen niet', () => {
    assert.deepEqual(
        teachersWithoutClass(overzicht()).map(t => t.id),
        ['t2'],
    );
});

test('een klas zonder docent valt op, ook als andere klassen wel gedekt zijn', () => {
    // MH1A en MH1B zijn gedekt door t1; MH1C door niemand.
    assert.deepEqual(classesWithoutTeacher(overzicht()), ['MH1C']);
});

test('twee docenten op dezelfde klas laten die klas niet dubbel opduiken', () => {
    const gedeeld = overzicht({
        links: [
            { id: 'l1', teacherId: 't1', schoolId: 's1', studentClass: 'MH1C', source: 'manual', createdAt: '2026-09-01' },
            { id: 'l2', teacherId: 't2', schoolId: 's1', studentClass: 'MH1C', source: 'manual', createdAt: '2026-09-01' },
        ],
    });
    assert.deepEqual(classesWithoutTeacher(gedeeld), ['MH1A', 'MH1B']);
    assert.deepEqual(teachersWithoutClass(gedeeld), []);
});

test('de strenge stand is niet klaar zolang er een docent of leerling los staat', () => {
    const nogNiet = strictReadiness(overzicht());
    assert.equal(nogNiet.ready, false);
    assert.equal(nogNiet.teachersWithoutClass, 1);
    assert.equal(nogNiet.studentsWithoutClass, 1);
});

test('alleen een docent zonder klas is al genoeg om niet klaar te zijn', () => {
    // Leerlingen zijn hier wél allemaal ingedeeld; de docent is het obstakel.
    const alleenDocent = strictReadiness(overzicht({ studentsWithoutClass: [] }));
    assert.equal(alleenDocent.ready, false);
    assert.equal(alleenDocent.teachersWithoutClass, 1);
});

test('alleen een leerling zonder klas is ook genoeg om niet klaar te zijn', () => {
    const alleenLeerling = strictReadiness(overzicht({
        links: [
            { id: 'l1', teacherId: 't1', schoolId: 's1', studentClass: 'MH1A', source: 'manual', createdAt: '2026-09-01' },
            { id: 'l2', teacherId: 't2', schoolId: 's1', studentClass: 'MH1B', source: 'manual', createdAt: '2026-09-01' },
        ],
    }));
    assert.equal(alleenLeerling.ready, false);
    assert.equal(alleenLeerling.teachersWithoutClass, 0);
    assert.equal(alleenLeerling.studentsWithoutClass, 1);
});

test('klaar is klaar: elke docent een klas en elke leerling ingedeeld', () => {
    const klaar = strictReadiness(overzicht({
        links: [
            { id: 'l1', teacherId: 't1', schoolId: 's1', studentClass: 'MH1A', source: 'manual', createdAt: '2026-09-01' },
            { id: 'l2', teacherId: 't2', schoolId: 's1', studentClass: 'MH1B', source: 'manual', createdAt: '2026-09-01' },
        ],
        studentsWithoutClass: [],
    }));
    assert.equal(klaar.ready, true);
});
