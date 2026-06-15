import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Shield, CheckCircle2, XCircle, Lock, Unlock, AlertTriangle, Eye, RotateCcw, Lightbulb, MessageCircle } from 'lucide-react';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';
import { MissionGoalBanner } from './templates/shared/MissionGoalBanner';
import type { MissionGoal } from './templates/shared/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface User {
    id: string;
    naam: string;
    rol: 'leerling' | 'docent' | 'admin' | 'gast';
    klas?: string;
}

interface Regel {
    id: string;
    beschrijving: string;
    isVeilig: boolean;
    uitleg: string;
    risicoType: 'toegang' | 'privacy' | 'authenticatie';
}

interface ToegangsRegel {
    id: string;
    resource: string;
    beschrijving: string;
    toegestaanVoor: ('leerling' | 'docent' | 'admin' | 'gast')[];
    isCorrect?: boolean;
}

interface TestScenario {
    id: string;
    gebruiker: User;
    resource: string;
    verwachtResultaat: 'toegang' | 'geblokkeerd';
    uitleg: string;
}

interface MissionState {
    currentStep: number;
    // Stap 1: analyse
    gevondenProblemen: string[];
    // Stap 2: regels aanpassen
    aangepasteRegels: Record<string, ('leerling' | 'docent' | 'admin' | 'gast')[]>;
    // Stap 3: testen
    testResultaten: Record<string, 'correct' | 'fout' | null>;
    afgerond: boolean;
}

interface Props {
    onBack: () => void;
    onComplete: (success: boolean) => void;
    stats?: { missionsCompleted?: string[]; vsoProfile?: string };
    vsoProfile?: string;
}

const MISSION_GOAL: MissionGoal = {
    primaryGoal: 'Ik beveilig het schoolsysteem door onveilige toegangsregels te vinden, te verbeteren en te testen.',
    criteria: {
        type: 'steps-complete',
        min: 3,
        description: 'Problemen vinden, veilige regels bouwen en testscenario’s doorstaan.',
    },
    evidence: 'Gevonden risico’s, aangepaste regels en geslaagde toegangstesten.',
};

// ---------------------------------------------------------------------------
// Data — De school-login-omgeving
// ---------------------------------------------------------------------------

const SCHOOL_NAAM = 'Het Rijnlands Lyceum';

const GEBRUIKERS: User[] = [
    { id: 'u1', naam: 'Emma de Vries', rol: 'leerling', klas: '2B' },
    { id: 'u2', naam: 'Dhr. Bakker', rol: 'docent' },
    { id: 'u3', naam: 'Mw. Jansen', rol: 'admin' },
    { id: 'u4', naam: 'Ouder (bezoeker)', rol: 'gast' },
];

const ONVEILIGE_REGELS: Regel[] = [
    {
        id: 'r1',
        beschrijving: 'Iedereen kan cijfers van alle leerlingen bekijken',
        isVeilig: false,
        uitleg: 'Cijfers zijn privacygevoelig. Alleen de docent en de leerling zelf mogen deze zien.',
        risicoType: 'privacy',
    },
    {
        id: 'r2',
        beschrijving: 'Gasten kunnen inloggen zonder wachtwoord',
        isVeilig: false,
        uitleg: 'Zonder authenticatie kan iedereen zomaar het systeem in — dat is een groot beveiligingslek.',
        risicoType: 'authenticatie',
    },
    {
        id: 'r3',
        beschrijving: 'Leerlingen kunnen roosters van andere klassen aanpassen',
        isVeilig: false,
        uitleg: 'Leerlingen mogen alleen hun eigen rooster bekijken, niet andermans rooster wijzigen.',
        risicoType: 'toegang',
    },
    {
        id: 'r4',
        beschrijving: 'Docenten kunnen het wachtwoord van de admin resetten',
        isVeilig: false,
        uitleg: 'Wachtwoord-reset van een admin moet alleen door een andere admin kunnen, anders is het hele systeem kwetsbaar.',
        risicoType: 'authenticatie',
    },
    {
        id: 'r5',
        beschrijving: 'Alleen admins kunnen nieuwe gebruikers aanmaken',
        isVeilig: true,
        uitleg: 'Dit is correct — gebruikersbeheer hoort bij de admin.',
        risicoType: 'toegang',
    },
    {
        id: 'r6',
        beschrijving: 'Leerlingen kunnen hun eigen profiel bekijken',
        isVeilig: true,
        uitleg: 'Dit is correct — je mag je eigen gegevens inzien.',
        risicoType: 'privacy',
    },
];

const RESOURCES: ToegangsRegel[] = [
    {
        id: 'res1',
        resource: 'Eigen cijfers bekijken',
        beschrijving: 'Een leerling wil zijn/haar eigen cijfers inzien.',
        toegestaanVoor: ['leerling', 'docent', 'admin'],
    },
    {
        id: 'res2',
        resource: 'Cijfers van ALLE leerlingen bekijken',
        beschrijving: 'Iemand wil de cijferlijst van de hele klas zien.',
        toegestaanVoor: ['docent', 'admin'],
    },
    {
        id: 'res3',
        resource: 'Rooster wijzigen',
        beschrijving: 'Het lesrooster aanpassen (uren, lokalen, docenten).',
        toegestaanVoor: ['admin'],
    },
    {
        id: 'res4',
        resource: 'Eigen wachtwoord wijzigen',
        beschrijving: 'Je eigen wachtwoord veranderen.',
        toegestaanVoor: ['leerling', 'docent', 'admin'],
    },
    {
        id: 'res5',
        resource: 'Leerling-accounts aanmaken',
        beschrijving: 'Nieuwe leerlingen toevoegen aan het systeem.',
        toegestaanVoor: ['admin'],
    },
    {
        id: 'res6',
        resource: 'Schoolwebsite bekijken',
        beschrijving: 'De openbare schoolwebsite bezoeken.',
        toegestaanVoor: ['leerling', 'docent', 'admin', 'gast'],
    },
];

const TEST_SCENARIOS: TestScenario[] = [
    {
        id: 't1',
        gebruiker: GEBRUIKERS[0], // Emma, leerling
        resource: 'Eigen cijfers bekijken',
        verwachtResultaat: 'toegang',
        uitleg: 'Emma is een leerling en mag haar eigen cijfers zien.',
    },
    {
        id: 't2',
        gebruiker: GEBRUIKERS[3], // Gast
        resource: 'Cijfers van ALLE leerlingen bekijken',
        verwachtResultaat: 'geblokkeerd',
        uitleg: 'Een gast heeft geen recht om cijfers te zien — die zijn vertrouwelijk.',
    },
    {
        id: 't3',
        gebruiker: GEBRUIKERS[0], // Emma, leerling
        resource: 'Rooster wijzigen',
        verwachtResultaat: 'geblokkeerd',
        uitleg: 'Leerlingen mogen het rooster niet aanpassen, dat is een admin-taak.',
    },
    {
        id: 't4',
        gebruiker: GEBRUIKERS[1], // Dhr. Bakker, docent
        resource: 'Cijfers van ALLE leerlingen bekijken',
        verwachtResultaat: 'toegang',
        uitleg: 'Docenten moeten de cijfers van hun leerlingen kunnen bekijken.',
    },
    {
        id: 't5',
        gebruiker: GEBRUIKERS[2], // Mw. Jansen, admin
        resource: 'Leerling-accounts aanmaken',
        verwachtResultaat: 'toegang',
        uitleg: 'Admins beheren de accounts, dus zij mogen nieuwe leerlingen aanmaken.',
    },
    {
        id: 't6',
        gebruiker: GEBRUIKERS[1], // Dhr. Bakker, docent
        resource: 'Leerling-accounts aanmaken',
        verwachtResultaat: 'geblokkeerd',
        uitleg: 'Docenten mogen geen accounts aanmaken — dat hoort bij de admin.',
    },
];

// ---------------------------------------------------------------------------
// AI Coach hints — contextafhankelijke tips per stap
// ---------------------------------------------------------------------------

const COACH_HINTS: Record<string, string[]> = {
    stap1_start: [
        'Tip: kijk goed naar wie er overal bij kan. Heeft een gast dezelfde rechten als een admin?',
        'Denk na: welke gegevens op school zijn privacygevoelig? Cijfers, adressen, wachtwoorden?',
    ],
    stap1_fout_veilig: [
        'Hmm, deze regel is eigenlijk prima! Niet elke regel is onveilig. Lees nog eens goed: wie heeft er toegang en is dat logisch?',
        'Tip van je Security Coach: soms is een regel gewoon correct. Dat herkennen is ook een skill!',
    ],
    stap2_start: [
        'Denk aan het "principe van minimale rechten": geef alleen toegang die echt nodig is voor iemands taak.',
        'Stel jezelf de vraag: wat is de ROL van deze persoon, en wat MOET die persoon kunnen doen?',
    ],
    stap2_teveel_rechten: [
        'Let op: als je een gast overal toegang geeft, is er geen verschil meer met een admin. Dat is een beveiligingsrisico!',
        'Minder is meer bij rechten. Een leerling hoeft geen accounts aan te kunnen maken — dat is een admin-taak.',
    ],
    stap3_fout: [
        'Deze test mislukt! Ga terug naar Stap 2 en controleer de rechten voor deze resource. Wie mag er eigenlijk bij?',
        'Tip: bekijk de uitleg bij het testscenario. Daar staat precies wie er wél en niet bij mag.',
    ],
    stap3_goed: [
        'Correct! Jouw rechtenmodel beschermt de juiste gegevens.',
        'Goed gedaan! Dit scenario klopt met het principle of least privilege.',
    ],
    voltooiing: [
        'Je hebt als Access Control Engineer het schoolsysteem beveiligd. Dit is precies wat echte beveiligingsexperts doen!',
    ],
};

function getCoachHint(context: string): string {
    const hints = COACH_HINTS[context] || [];
    return hints[Math.floor(Math.random() * hints.length)] || '';
}

const ROLLEN_KLEUREN: Record<string, string> = {
    leerling: 'bg-duck-ink text-white',
    docent: 'bg-duck-ink text-white',
    admin: 'bg-duck-ink text-white',
    gast: 'bg-duck-bg text-duck-ink/60',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const AccessControlEngineerMission: React.FC<Props> = ({
    onBack,
    onComplete,
    vsoProfile,
}) => {
    const { state, setState, clearSave } = useMissionAutoSave<MissionState>(
        'access-control-engineer',
        {
            currentStep: 0,
            gevondenProblemen: [],
            aangepasteRegels: {},
            testResultaten: {},
            afgerond: false,
        }
    );

    // Transient UI state
    const [showUitleg, setShowUitleg] = useState<string | null>(null);
    const [showTestResult, setShowTestResult] = useState<string | null>(null);
    const [coachMessage, setCoachMessage] = useState<string | null>(null);

    // Bereken voortgang
    const aantalProblemen = state.gevondenProblemen.length;
    const aantalOnveilig = ONVEILIGE_REGELS.filter(r => !r.isVeilig).length;
    const aantalRegelsIngesteld = Object.keys(state.aangepasteRegels).length;
    const aantalTestsGedaan = Object.values(state.testResultaten).filter(v => v !== null).length;
    const aantalTestsCorrect = Object.values(state.testResultaten).filter(v => v === 'correct').length;

    const stap1Klaar = aantalProblemen >= 3;
    const stap2Klaar = aantalRegelsIngesteld >= 4;
    const stap3Klaar = aantalTestsGedaan >= 5 && aantalTestsCorrect >= 4;

    const isVso = vsoProfile === 'dagbesteding';

    // Stap 1: Analyseer de regels
    const toggleProbleem = (regelId: string) => {
        const regel = ONVEILIGE_REGELS.find(r => r.id === regelId);
        if (!regel) return;

        const al = state.gevondenProblemen.includes(regelId);
        const nieuw = al
            ? state.gevondenProblemen.filter(id => id !== regelId)
            : [...state.gevondenProblemen, regelId];

        // Coach hint bij fout selecteren van veilige regel
        if (!al && regel.isVeilig) {
            setCoachMessage(getCoachHint('stap1_fout_veilig'));
        } else if (!al && !regel.isVeilig) {
            setCoachMessage(null); // Goed gevonden, geen hint nodig
        }

        setState({ ...state, gevondenProblemen: nieuw });
    };

    // Stap 2: Pas de toegangsregels aan
    const updateToegangsRegel = (resourceId: string, rollen: ('leerling' | 'docent' | 'admin' | 'gast')[]) => {
        setState({
            ...state,
            aangepasteRegels: { ...state.aangepasteRegels, [resourceId]: rollen },
        });
    };

    // Stap 3: Test de scenario's
    const voerTestUit = (scenarioId: string) => {
        const scenario = TEST_SCENARIOS.find(s => s.id === scenarioId);
        if (!scenario) return;

        const resource = RESOURCES.find(r => r.resource === scenario.resource);
        if (!resource) return;

        // Gebruik de aangepaste regels, of val terug op de standaard
        const actieveRollen = state.aangepasteRegels[resource.id] ?? resource.toegestaanVoor;
        const heeftToegang = actieveRollen.includes(scenario.gebruiker.rol);
        const uitkomst = heeftToegang ? 'toegang' : 'geblokkeerd';
        const isCorrect = uitkomst === scenario.verwachtResultaat ? 'correct' : 'fout';

        setState({
            ...state,
            testResultaten: { ...state.testResultaten, [scenarioId]: isCorrect },
        });
        setShowTestResult(scenarioId);

        // Coach hint bij fout of goed
        setCoachMessage(getCoachHint(isCorrect === 'correct' ? 'stap3_goed' : 'stap3_fout'));
    };

    const handleVoltooi = () => {
        setState({ ...state, afgerond: true });
        clearSave();
        onComplete(true);
    };

    const naarStap = (stap: number) => {
        setState({ ...state, currentStep: stap });
    };

    // ---------------------------------------------------------------------------
    // Render
    // ---------------------------------------------------------------------------

    return (
        <div className="flex h-screen min-h-screen flex-col overflow-hidden bg-duck-bg">
            {/* Header */}
            <div className="sticky top-0 z-20 flex shrink-0 items-center gap-3 border-b border-duck-ink/15 bg-white px-4 py-3">
                <button onClick={onBack} className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg transition-colors hover:bg-duck-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid" aria-label="Terug">
                    <ArrowLeft size={20} className="text-duck-ink/60" />
                </button>
                <div className="flex items-center gap-2 flex-1">
                    <div className="w-8 h-8 bg-duck-acid rounded-lg flex items-center justify-center">
                        <Shield size={18} className="text-duck-ink" />
                    </div>
                    <div>
                        <h1 className="font-bold text-duck-ink text-sm leading-tight">Access Control Engineer</h1>
                        <p className="text-xs text-duck-ink/60">Beveilig het schoolsysteem</p>
                    </div>
                </div>
                {/* Stap-indicator */}
                <div className="flex gap-1">
                    {[0, 1, 2].map(s => (
                        <button
                            key={s}
                            onClick={() => naarStap(s)}
                            className={`min-h-[44px] min-w-[44px] rounded-full text-xs font-bold transition-all ${
                                state.currentStep === s
                                    ? 'bg-duck-acid text-duck-ink'
                                    : (s === 0 && stap1Klaar) || (s === 1 && stap2Klaar) || (s === 2 && stap3Klaar)
                                    ? 'bg-duck-ink text-white'
                                    : 'bg-duck-bg text-duck-ink/60'
                            }`}
                            aria-label={`Stap ${s + 1}`}
                        >
                            {(s === 0 && stap1Klaar) || (s === 1 && stap2Klaar) || (s === 2 && stap3Klaar)
                                ? <CheckCircle2 size={16} className="mx-auto" />
                                : s + 1}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="mx-auto min-h-0 w-full max-w-2xl flex-1 overflow-y-auto p-4 pb-24">
                {/* Introductie */}
                {state.currentStep === 0 && (
                    <div className="space-y-4">
                        <MissionGoalBanner goal={MISSION_GOAL} />

                        <div className="bg-duck-acid/20 border border-duck-acid rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <AlertTriangle size={20} className="text-duck-ink shrink-0 mt-0.5" />
                                <div>
                                    <h2 className="font-bold text-duck-ink text-sm">Melding van {SCHOOL_NAAM}</h2>
                                    <p className="text-duck-ink text-sm mt-1">
                                        {isVso
                                            ? `Het schoolsysteem heeft problemen. Niet iedereen mag alles zien, maar de regels kloppen niet. Kijk welke regels onveilig zijn.`
                                            : `Het inlogportaal van de school is onveilig: leerlingen kunnen bij cijfers van anderen, gasten loggen zonder wachtwoord in, en roosters zijn aanpasbaar door de verkeerde mensen. Analyseer de beveiligingsregels en vind de problemen.`
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        <h3 className="font-bold text-duck-ink">Stap 1: Vind de problemen</h3>
                        <p className="text-sm text-duck-ink/60">
                            Hieronder staan de huidige beveiligingsregels van het schoolsysteem.
                            Tik op de regels die <strong>onveilig</strong> zijn.
                            {isVso && ' Tip: kijk welke regels iedereen overal bij laten.'}
                        </p>

                        <div className="space-y-2">
                            {ONVEILIGE_REGELS.map(regel => {
                                const geselecteerd = state.gevondenProblemen.includes(regel.id);
                                const toonUitleg = showUitleg === regel.id;
                                return (
                                    <div key={regel.id} className="bg-white rounded-xl border border-duck-ink/15 overflow-hidden">
                                        <button
                                            onClick={() => toggleProbleem(regel.id)}
                                            className={`w-full text-left p-3 flex items-center gap-3 transition-colors ${
                                                geselecteerd
                                                    ? regel.isVeilig
                                                        ? 'bg-duck-error/10 border-l-4 border-duck-error'
                                                        : 'bg-duck-ink/10 border-l-4 border-duck-ink'
                                                    : 'hover:bg-duck-bg'
                                            }`}
                                        >
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                                                geselecteerd ? (regel.isVeilig ? 'bg-duck-error' : 'bg-duck-ink') : 'bg-duck-bg'
                                            }`}>
                                                {geselecteerd ? (
                                                    regel.isVeilig
                                                        ? <XCircle size={14} className="text-white" />
                                                        : <CheckCircle2 size={14} className="text-white" />
                                                ) : (
                                                    <Eye size={14} className="text-duck-ink/60" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-duck-ink">{regel.beschrijving}</p>
                                                <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
                                                    regel.risicoType === 'privacy' ? 'bg-duck-ink text-white' :
                                                    regel.risicoType === 'authenticatie' ? 'bg-duck-acid text-duck-ink' :
                                                    'bg-duck-ink text-white'
                                                }`}>
                                                    {regel.risicoType}
                                                </span>
                                            </div>
                                        </button>
                                        {geselecteerd && (
                                            <div className="px-3 pb-3">
                                                <button
                                                    onClick={() => setShowUitleg(toonUitleg ? null : regel.id)}
                                                    className="flex min-h-[44px] items-center rounded-lg px-2 text-xs text-duck-acid hover:underline"
                                                >
                                                    {toonUitleg ? 'Verberg uitleg' : 'Bekijk uitleg'}
                                                </button>
                                                {toonUitleg && (
                                                    <p className="text-xs text-duck-ink/60 mt-1 bg-duck-bg rounded-lg p-2">
                                                        {geselecteerd && regel.isVeilig
                                                            ? `Oeps! Deze regel is eigenlijk veilig. ${regel.uitleg}`
                                                            : regel.uitleg
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="bg-duck-bg rounded-xl p-3 flex items-center justify-between">
                            <p className="text-sm text-duck-ink/60">
                                Gevonden: <strong>{aantalProblemen}</strong> / minstens 3 problemen
                            </p>
                            {stap1Klaar && (
                                <button
                                    onClick={() => naarStap(1)}
                                    className="flex min-h-[44px] items-center gap-1 rounded-full bg-duck-acid px-4 text-sm font-medium text-duck-ink transition-colors hover:bg-duck-ink hover:text-duck-ink"
                                >
                                    Volgende <ArrowRight size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Stap 2: Regels aanpassen */}
                {state.currentStep === 1 && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-duck-ink">Stap 2: Stel de juiste rechten in</h3>
                        <p className="text-sm text-duck-ink/60">
                            {isVso
                                ? 'Kies voor elke actie wie dat mag doen. Vink de juiste rollen aan.'
                                : 'Nu je de problemen kent, ga je de toegangsrechten correct instellen. Bepaal per resource welke rollen er toegang toe moeten hebben.'
                            }
                        </p>

                        <div className="space-y-3">
                            {RESOURCES.map(resource => {
                                const huidigeRollen = state.aangepasteRegels[resource.id] ?? [];
                                return (
                                    <div key={resource.id} className="bg-white rounded-xl border border-duck-ink/15 p-4">
                                        <div className="flex items-start gap-2 mb-2">
                                            <Lock size={16} className="text-duck-ink/60 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-semibold text-duck-ink">{resource.resource}</p>
                                                <p className="text-xs text-duck-ink/60">{resource.beschrijving}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {(['leerling', 'docent', 'admin', 'gast'] as const).map(rol => {
                                                const actief = huidigeRollen.includes(rol);
                                                return (
                                                    <button
                                                        key={rol}
                                                        onClick={() => {
                                                            const nieuw = actief
                                                                ? huidigeRollen.filter(r => r !== rol)
                                                                : [...huidigeRollen, rol];
                                                            updateToegangsRegel(resource.id, nieuw);
                                                        }}
                                                        className={`min-h-[44px] rounded-full px-3 text-xs font-medium transition-all ${
                                                            actief
                                                                ? ROLLEN_KLEUREN[rol] + ' ring-2 ring-offset-1 ring-duck-acid'
                                                                : 'bg-duck-bg text-duck-ink/60 hover:bg-duck-ink/10'
                                                        }`}
                                                    >
                                                        {actief ? <Unlock size={12} className="inline mr-1" /> : <Lock size={12} className="inline mr-1" />}
                                                        {rol}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="bg-duck-bg rounded-xl p-3 flex items-center justify-between">
                            <p className="text-sm text-duck-ink/60">
                                Ingesteld: <strong>{aantalRegelsIngesteld}</strong> / {RESOURCES.length} resources
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => naarStap(0)}
                                    className="flex min-h-[44px] items-center gap-1 rounded-full px-3 text-sm text-duck-ink/60 transition-colors hover:bg-duck-ink/10"
                                >
                                    <ArrowLeft size={16} /> Terug
                                </button>
                                {stap2Klaar && (
                                    <button
                                        onClick={() => naarStap(2)}
                                        className="flex min-h-[44px] items-center gap-1 rounded-full bg-duck-acid px-4 text-sm font-medium text-duck-ink transition-colors hover:bg-duck-ink hover:text-duck-ink"
                                    >
                                        Volgende <ArrowRight size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Stap 3: Testen */}
                {state.currentStep === 2 && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-duck-ink">Stap 3: Test je configuratie</h3>
                        <p className="text-sm text-duck-ink/60">
                            {isVso
                                ? 'Controleer of jouw regels goed werken. Druk op "Test" en kijk of de juiste mensen de juiste toegang krijgen.'
                                : 'Voer de testscenario\'s uit om te controleren of jouw toegangsregels correct werken. Elke test simuleert een echte gebruiker die iets probeert te doen.'
                            }
                        </p>

                        <div className="space-y-3">
                            {TEST_SCENARIOS.map(scenario => {
                                const resultaat = state.testResultaten[scenario.id];
                                const toonDetail = showTestResult === scenario.id;
                                return (
                                    <div key={scenario.id} className={`bg-white rounded-xl border overflow-hidden transition-colors ${
                                        resultaat === 'correct' ? 'border-duck-ink' :
                                        resultaat === 'fout' ? 'border-duck-error' :
                                        'border-duck-ink/15'
                                    }`}>
                                        <div className="p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ROLLEN_KLEUREN[scenario.gebruiker.rol]}`}>
                                                    {scenario.gebruiker.rol}
                                                </span>
                                                <span className="text-sm font-medium text-duck-ink/60">{scenario.gebruiker.naam}</span>
                                            </div>
                                            <p className="text-sm text-duck-ink/60 mb-3">
                                                Wil: <strong>{scenario.resource}</strong>
                                            </p>
                                            <div className="flex items-center gap-2">
                                                {resultaat === null || resultaat === undefined ? (
                                                    <button
                                                        onClick={() => voerTestUit(scenario.id)}
                                                        className="min-h-[44px] rounded-full bg-duck-acid px-3 text-xs font-medium text-duck-ink transition-colors hover:bg-duck-ink hover:text-duck-ink"
                                                    >
                                                        Test uitvoeren
                                                    </button>
                                                ) : (
                                                    <>
                                                        <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${
                                                            resultaat === 'correct' ? 'bg-duck-ink text-white' : 'bg-duck-error text-white'
                                                        }`}>
                                                            {resultaat === 'correct'
                                                                ? <><CheckCircle2 size={14} /> Correct</>
                                                                : <><XCircle size={14} /> Fout</>
                                                            }
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                setState({
                                                                    ...state,
                                                                    testResultaten: { ...state.testResultaten, [scenario.id]: null },
                                                                });
                                                            }}
                                                            className="flex min-h-[44px] items-center gap-1 rounded-full px-3 text-xs text-duck-ink/60 hover:text-duck-ink"
                                                        >
                                                            <RotateCcw size={12} /> Opnieuw
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => setShowTestResult(toonDetail ? null : scenario.id)}
                                                    className="ml-auto flex min-h-[44px] items-center rounded-full px-3 text-xs text-duck-acid hover:underline"
                                                >
                                                    {toonDetail ? 'Verberg' : 'Uitleg'}
                                                </button>
                                            </div>
                                        </div>
                                        {toonDetail && (
                                            <div className="bg-duck-bg px-4 py-3 border-t border-duck-ink/15">
                                                <p className="text-xs text-duck-ink/60">
                                                    <strong>Verwacht:</strong> {scenario.verwachtResultaat === 'toegang' ? 'Toegang verlenen' : 'Geblokkeerd'}
                                                </p>
                                                <p className="text-xs text-duck-ink/60 mt-1">{scenario.uitleg}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="bg-duck-bg rounded-xl p-3">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-duck-ink/60">
                                    Tests: <strong>{aantalTestsCorrect}</strong> correct / {aantalTestsGedaan} uitgevoerd
                                </p>
                                <button
                                    onClick={() => naarStap(1)}
                                    className="flex min-h-[44px] items-center gap-1 rounded-full px-3 text-sm text-duck-ink/60 transition-colors hover:bg-duck-ink/10"
                                >
                                    <ArrowLeft size={16} /> Terug
                                </button>
                            </div>
                            {stap3Klaar && (
                                <button
                                    onClick={handleVoltooi}
                                    className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-duck-acid px-4 text-sm font-bold text-duck-ink transition-colors hover:bg-duck-ink hover:text-duck-ink"
                                >
                                    <Shield size={18} />
                                    Missie afronden — systeem beveiligd!
                                </button>
                            )}
                            {!stap3Klaar && aantalTestsGedaan > 0 && (
                                <p className="text-xs text-duck-acid mt-1">
                                    {aantalTestsCorrect < 4
                                        ? 'Sommige tests mislukken. Ga terug naar Stap 2 en pas de rechten aan.'
                                        : `Voer minstens 5 tests uit (nu: ${aantalTestsGedaan}).`
                                    }
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* AI Coach bubble — sticky onderaan */}
            {coachMessage && (
                <div className="fixed bottom-4 left-4 right-4 max-w-lg mx-auto z-30 animate-in slide-in-from-bottom-4">
                    <div className="bg-duck-acid border border-duck-acid rounded-xl p-3 shadow-duck-soft flex items-start gap-3">
                        <div className="w-8 h-8 bg-duck-ink rounded-full flex items-center justify-center shrink-0">
                            <MessageCircle size={16} className="text-duck-acid" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-duck-ink mb-0.5">Security Coach</p>
                            <p className="text-sm text-duck-ink">{coachMessage}</p>
                        </div>
                        <button
                            onClick={() => setCoachMessage(null)}
                            className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full text-duck-ink hover:text-duck-ink/60"
                            aria-label="Sluit hint"
                        >
                            <XCircle size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
