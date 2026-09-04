// Leerlijn-overzicht: opdrachten per leerjaar/periode met hun SLO-kerndoelen.
// Bouwt één keer op moduleniveau uit bestaande config, zodat de publieke pagina
// niet uit de pas kan lopen met het curriculum (zoals de handmatig gekopieerde
// data in ScholenLandingMissionShowcase wél deed).
//
// Bewust NIET geïmporteerd: ROLES / src/config/agents/* (≈528 KB, JSX-icons en
// volledige AI-systeemprompts) en missionBuilder. Daarom geen description of
// difficulty per opdracht op deze pagina.

import { CURRICULUM } from '@/config/curriculum';
import type { EducationLevel } from '@/config/curriculum';
import { getMissionMeta } from '@/config/slo-kerndoelen-mapping';
import { SLO_KERNDOELEN } from '@/config/sloKerndoelen';
import type { SloKerndoelCode } from '@/config/sloKerndoelen';
import { getMissionDurationLabel } from '@/config/missionDurations';

/** Reguliere VO-kerndoelen (domeinen 21-23), SLO conceptkerndoelen sept. 2025. */
export const REGULIER_VO_CODES: SloKerndoelCode[] = [
    '21A', '21B', '21C', '21D', '22A', '22B', '23A', '23B', '23C',
];

/** VSO functionele kerndoelen (domeinen 18-20), nov. 2025. */
export const VSO_CODES: SloKerndoelCode[] = ['18A', '18B', '18C', '19A', '20A', '20B'];

export interface LeerlijnMission {
    id: string;
    title: string;
    kerndoelen: SloKerndoelCode[];
    duration?: string;
    isReview: boolean;
}

export interface LeerlijnPeriod {
    number: number;
    title: string;
    subtitle: string;
    sloFocus: SloKerndoelCode[];
    missions: LeerlijnMission[];
}

export interface LeerlijnYear {
    year: number;
    title: string;
    subtitle: string;
    description: string;
    levels: EducationLevel[];
    periods: LeerlijnPeriod[];
    missionCount: number;
}

export interface CoverageRow {
    code: SloKerndoelCode;
    label: string;
    domein: string;
    domeinNummer: number;
    omschrijving: string;
    /** Aantal opdrachten per leerjaar, index 0 = leerjaar 1. */
    perYear: number[];
    total: number;
}

function buildMission(missionId: string, isReview: boolean): LeerlijnMission {
    const meta = getMissionMeta(missionId);
    return {
        id: missionId,
        // Valt terug op de ID zodat een ontbrekende mapping zichtbaar is in plaats
        // van de opdracht te laten verdwijnen; tests/leerlijn dekt dit af.
        title: meta?.title ?? missionId,
        kerndoelen: meta?.sloKerndoelen ?? [],
        duration: getMissionDurationLabel(missionId),
        isReview,
    };
}

function buildYears(): LeerlijnYear[] {
    return Object.entries(CURRICULUM.yearGroups)
        .map(([yearStr, yearConfig]) => {
            const year = Number(yearStr);
            const periods = Object.entries(yearConfig.periods)
                .map(([periodStr, periodConfig]) => ({
                    number: Number(periodStr),
                    title: periodConfig.title,
                    subtitle: periodConfig.subtitle,
                    sloFocus: periodConfig.sloFocus,
                    missions: [
                        ...periodConfig.missions.map((id) => buildMission(id, false)),
                        ...(periodConfig.reviewMissions ?? []).map((id) => buildMission(id, true)),
                    ],
                }))
                .sort((a, b) => a.number - b.number);

            return {
                year,
                title: yearConfig.title,
                subtitle: yearConfig.subtitle,
                description: yearConfig.description,
                levels: yearConfig.availableLevels,
                periods,
                missionCount: periods.reduce((acc, p) => acc + p.missions.length, 0),
            };
        })
        .sort((a, b) => a.year - b.year);
}

export const LEERLIJN: LeerlijnYear[] = buildYears();

export const YEAR_NUMBERS: number[] = LEERLIJN.map((y) => y.year);

function buildCoverage(): CoverageRow[] {
    return REGULIER_VO_CODES.map((code) => {
        const kerndoel = SLO_KERNDOELEN[code];
        const perYear = LEERLIJN.map((year) =>
            year.periods.reduce(
                (acc, period) => acc + period.missions.filter((m) => m.kerndoelen.includes(code)).length,
                0,
            ),
        );
        return {
            code,
            label: kerndoel.label,
            domein: kerndoel.domein,
            domeinNummer: kerndoel.domeinNummer,
            omschrijving: kerndoel.omschrijving,
            perYear,
            total: perYear.reduce((a, b) => a + b, 0),
        };
    });
}

export const COVERAGE: CoverageRow[] = buildCoverage();

/** Aantal reguliere kerndoelen waar minstens één opdracht aan gekoppeld is. */
export const COVERED_KERNDOEL_COUNT: number = COVERAGE.filter((row) => row.total > 0).length;

export const TOTAL_MISSION_COUNT: number = LEERLIJN.reduce((acc, y) => acc + y.missionCount, 0);

/** Unieke opdrachten; een opdracht kan in principe in meerdere periodes staan. */
export const UNIQUE_MISSION_COUNT: number = new Set(
    LEERLIJN.flatMap((y) => y.periods.flatMap((p) => p.missions.map((m) => m.id))),
).size;

/** Domeinen in weergavevolgorde, met de kerndoelen die eronder vallen. */
export interface CoverageDomain {
    domeinNummer: number;
    domein: string;
    rows: CoverageRow[];
}

export const COVERAGE_BY_DOMAIN: CoverageDomain[] = COVERAGE.reduce<CoverageDomain[]>((acc, row) => {
    const existing = acc.find((d) => d.domeinNummer === row.domeinNummer);
    if (existing) {
        existing.rows.push(row);
    } else {
        acc.push({ domeinNummer: row.domeinNummer, domein: row.domein, rows: [row] });
    }
    return acc;
}, []);
