import React from 'react';
import { CheckCircle2, AlertTriangle, Flame, ShieldCheck, Euro, Bell, Coffee } from 'lucide-react';
import type { SchoolState } from '../types';

interface Props {
    stand: SchoolState;
    startStand: SchoolState;
    gebeurtenissen: string[]; // nieuwste eerst of laatst — kies zelf, maar wees consistent
    /** Hoeveel onderdelen van de ochtend af zijn. */
    stap: number;
    /** Hoeveel onderdelen de ochtend telt. */
    totaalStappen: number;
    /** Hoe scherp de leerling nog is, 0 tot 100. */
    focus: number;
}

/** Drie niveaus waarop de dienst ervoor kan staan. */
type Niveau = 'veilig' | 'zorgelijk' | 'kritiek';

/** Leidt het niveau af uit hoeveel de school is afgeweken van de beginstand. */
function bepaalNiveau(stand: SchoolState, startStand: SchoolState): Niveau {
    const accountsKwijt = Math.max(0, startStand.veiligeAccounts - stand.veiligeAccounts);
    if (accountsKwijt >= 3 || stand.verlorenGeld >= 500) return 'kritiek';
    if (accountsKwijt >= 1 || stand.verlorenGeld > 0) return 'zorgelijk';
    return 'veilig';
}

const NIVEAU_CONFIG: Record<Niveau, { label: string; klasse: string; Icoon: typeof CheckCircle2 }> = {
    veilig: {
        label: 'Alles nog veilig',
        klasse: 'bg-duck-acid/20 text-duck-ink border-duck-ink',
        Icoon: CheckCircle2,
    },
    zorgelijk: {
        label: 'Er is iets misgegaan',
        klasse: 'bg-duck-acid/20 text-duck-ink border-duck-ink/40',
        Icoon: AlertTriangle,
    },
    kritiek: {
        label: 'Het loopt uit de hand',
        klasse: 'bg-duck-error/10 text-duck-error border-duck-error',
        Icoon: Flame,
    },
};

interface MeterProps {
    Icoon: typeof ShieldCheck;
    label: string;
    waarde: string;
}

/** Eén compacte meter-tegel. Modulebereik, want puur presentationeel en herbruikbaar. */
const Meter: React.FC<MeterProps> = ({ Icoon, label, waarde }) => (
    <div className="flex flex-col items-center gap-0.5 rounded-xl bg-duck-bg px-2 py-1.5 text-center">
        <Icoon className="h-4 w-4 text-duck-ink/70" aria-hidden="true" />
        <span className="text-sm font-semibold text-duck-ink">{waarde}</span>
        <span className="text-[10px] leading-tight text-duck-ink/70">{label}</span>
    </div>
);

export const SchoolStatus: React.FC<Props> = ({
    stand,
    startStand,
    gebeurtenissen,
    stap,
    totaalStappen,
    focus,
}) => {
    const niveau = bepaalNiveau(stand, startStand);
    const { label, klasse, Icoon } = NIVEAU_CONFIG[niveau];
    const veiligeFocus = Math.max(0, Math.min(100, focus));

    return (
        <section
            data-qa="helpdesk-status"
            className="w-full max-w-md rounded-2xl border border-duck-gray bg-duck-bgLight p-3"
        >
            {/* Rustige voortgang: geen aftellen, geen druk */}
            <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-duck-ink/70">
                    Onderdeel {stap} van {totaalStappen}
                </span>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-duck-bg">
                    <div
                        className="h-full rounded-full bg-duck-ink/40"
                        style={{ width: `${totaalStappen > 0 ? (stap / totaalStappen) * 100 : 0}%` }}
                    />
                </div>
            </div>

            {/* Focusmeter: vermoeidheid is geen fout, dus geen alarmkleuren */}
            <div className="mt-2 flex flex-col gap-1">
                <span className="text-xs font-semibold text-duck-ink/70">Focus</span>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-duck-bg">
                    <div
                        className="h-full rounded-full bg-duck-ink/40"
                        style={{ width: `${veiligeFocus}%` }}
                    />
                </div>
                {veiligeFocus < 50 && (
                    <p className="flex items-center gap-1 text-[11px] text-duck-ink/70">
                        <Coffee className="h-3 w-3 shrink-0" aria-hidden="true" />
                        Je wordt een beetje moe. Een kop koffie kan helpen.
                    </p>
                )}
            </div>

            {/* Statusregel */}
            <div className={`mt-2 flex items-center gap-2 rounded-xl border px-2.5 py-1.5 text-sm font-semibold ${klasse}`}>
                <Icoon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{label}</span>
            </div>

            {/* Meters */}
            <div className="mt-2 grid grid-cols-3 gap-1.5">
                <Meter
                    Icoon={ShieldCheck}
                    label="Veilige accounts"
                    waarde={`${stand.veiligeAccounts}/${startStand.veiligeAccounts}`}
                />
                {stand.verlorenGeld > 0 && (
                    <Meter Icoon={Euro} label="Verloren geld" waarde={`€${stand.verlorenGeld}`} />
                )}
                <Meter Icoon={Bell} label="Terechte meldingen" waarde={`${stand.meldingen}`} />
            </div>

            {/* Gebeurtenissenlijst */}
            <div
                aria-live="polite"
                className="mt-2 max-h-24 space-y-1 overflow-y-auto rounded-xl bg-duck-bg p-2"
            >
                {gebeurtenissen.length === 0 ? (
                    <p className="text-xs text-duck-ink/70">Nog niets misgegaan.</p>
                ) : (
                    gebeurtenissen.map((regel, index) => (
                        <p key={index} className="text-xs text-duck-ink">
                            {regel}
                        </p>
                    ))
                )}
            </div>
        </section>
    );
};
