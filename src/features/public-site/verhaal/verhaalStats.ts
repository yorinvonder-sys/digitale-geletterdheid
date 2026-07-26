import { CURRICULUM } from '@/config/curriculum';
import { SLO_KERNDOELEN } from '@/config/sloKerndoelen';
import { ROLES } from '@/config/agents';

/**
 * Cijfers voor de verhaalpagina, afgeleid uit de configuratie van het product
 * zelf. Bewust niet met de hand ingetypt: `src/features/public-site/CLAUDE.md`
 * eist dat elke claim onderbouwd is, en zo verouderen de getallen nooit als het
 * curriculum groeit.
 */

/**
 * Unieke missies over alle leerjaren en periodes.
 *
 * Bewust alleen missies die én in het curriculum staan én een agent-rol hebben:
 * een curriculum-ID zonder implementatie is geen missie die een school kan
 * draaien, en zou de claim dus opblazen.
 */
function countMissions(): number {
    const implemented = new Set<string>(ROLES.map((r) => r.id));
    const ids = new Set<string>();
    for (const year of Object.values(CURRICULUM.yearGroups)) {
        for (const period of Object.values(year.periods)) {
            for (const id of [...period.missions, ...(period.reviewMissions ?? [])]) {
                if (implemented.has(id)) ids.add(id);
            }
        }
    }
    return ids.size;
}

/** Leerjaren die het curriculum dekt. */
function countYearGroups(): number {
    return Object.keys(CURRICULUM.yearGroups).length;
}

/** Periodes per leerjaar. */
function countPeriodsPerYear(): number {
    return CURRICULUM.defaultPeriodsPerYear;
}

/** SLO-kerndoelcodes, gesplitst naar regulier VO en functioneel VSO. */
function countKerndoelen(): { totaal: number; regulier: number; vso: number } {
    const all = Object.values(SLO_KERNDOELEN);
    const vso = all.filter((k) => k.isVso).length;
    return { totaal: all.length, regulier: all.length - vso, vso };
}

/** Unieke SLO-domeinen die in het curriculum daadwerkelijk aan bod komen. */
function countDomeinen(): number {
    return new Set(Object.values(SLO_KERNDOELEN).map((k) => k.domeinNummer)).size;
}

const kerndoelen = countKerndoelen();

export const VERHAAL_STATS = {
    missies: countMissions(),
    leerjaren: countYearGroups(),
    periodesPerJaar: countPeriodsPerYear(),
    kerndoelen: kerndoelen.totaal,
    kerndoelenRegulier: kerndoelen.regulier,
    kerndoelenVso: kerndoelen.vso,
    domeinen: countDomeinen(),
} as const;
