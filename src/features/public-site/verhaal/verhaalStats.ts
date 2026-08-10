import { CURRICULUM } from '@/config/curriculum';
import { SLO_KERNDOELEN } from '@/config/sloKerndoelen';
import { KERNDOEL_MISSIONS } from '@/config/slo-kerndoelen-mapping';
import { MISSION_SCREENSHOTS } from '@/config/missionThumbnails';
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

/**
 * De onderwerpen waar de missies over gaan, met hoeveel missies er per
 * onderwerp zijn. Afgeleid uit de SLO-mapping, niet met de hand geteld: de
 * homepage laat hiermee zien wat leerlingen doen zonder dat het getal kan
 * verouderen als er een missie bijkomt.
 */
function countOnderwerpen(): { label: string; aantal: number; thumbnail?: string }[] {
    const implemented = new Set<string>(ROLES.map((r) => r.id));
    const perLabel = new Map<string, number>();
    // Per onderwerp één echte missie-illustratie, zodat de homepage kan tonen
    // hoe een missie eruitziet in plaats van alleen te vertellen dat hij bestaat.
    const thumbPerLabel = new Map<string, string>();

    for (const mission of KERNDOEL_MISSIONS) {
        if (!implemented.has(mission.id)) continue;
        // Eén missie hangt vaak aan meerdere kerndoelen binnen hetzelfde
        // onderwerp; die mag maar één keer meetellen.
        const labels = new Set<string>();
        for (const code of mission.sloKerndoelen ?? []) {
            const label = SLO_KERNDOELEN[code]?.label;
            // De config kent "Veiligheid & privacy" en "Veiligheid & Privacy"
            // naast elkaar; zonder normalisatie staat dat twee keer in de lijst.
            if (label) labels.add(label.replace(/&\s+Privacy/, '& privacy'));
        }
        const thumb = MISSION_SCREENSHOTS[mission.id];
        for (const label of labels) {
            perLabel.set(label, (perLabel.get(label) ?? 0) + 1);
            if (thumb && !thumbPerLabel.has(label)) thumbPerLabel.set(label, thumb);
        }
    }

    return [...perLabel.entries()]
        .map(([label, aantal]) => ({ label, aantal, thumbnail: thumbPerLabel.get(label) }))
        .sort((a, b) => b.aantal - a.aantal || a.label.localeCompare(b.label));
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
    onderwerpen: countOnderwerpen(),
} as const;
