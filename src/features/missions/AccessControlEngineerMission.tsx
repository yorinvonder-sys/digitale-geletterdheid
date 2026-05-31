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
    launchCase?: 'student-grades' | 'guest-login' | 'teacher-admin';
    // Stap 1: analyse
    gevondenProblemen: string[];
    // Stap 2: regels aanpassen
    aangepasteRegels: Record<string, ('leerling' | 'docent' | 'admin' | 'gast')[]>;
    // Stap 3: testen
    testResultaten: Record<string, 'correct' | 'fout' | null>;
    testVoorspellingen?: Record<string, 'toegang' | 'geblokkeerd'>;
    afgerond: boolean;
}

interface Props {
    onBack: () => void;
    onComplete: (success: boolean) => void;
    stats?: { missionsCompleted?: string[]; vsoProfile?: string };
    vsoProfile?: string;
}

const MISSION_GOAL: MissionGoal = {
    primaryGoal: 'Beveilig het schoolsysteem door onveilige toegangsregels te vinden, te verbeteren en te testen.',
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
    leerling: 'bg-lab-teal text-white',
    docent: 'bg-lab-sage text-white',
    admin: 'bg-lab-teal text-white',
    gast: 'bg-lab-cream text-lab-muted',
};

const LAUNCH_CASES = [
    {
        id: 'student-grades',
        icon: Eye,
        role: 'Leerling',
        resource: 'Cijfers',
        question: 'Kan een leerling cijfers van anderen zien?',
        feedback: 'Sterke start: privacygevoelige cijfers horen nooit voor iedereen open te staan.',
    },
    {
        id: 'guest-login',
        icon: Lock,
        role: 'Gast',
        resource: 'Inloggen',
        question: 'Kan een gast zonder wachtwoord binnenkomen?',
        feedback: 'Goed gekozen: zonder wachtwoord weet het systeem niet wie er echt binnenkomt.',
    },
    {
        id: 'teacher-admin',
        icon: Shield,
        role: 'Docent',
        resource: 'Admin reset',
        question: 'Mag een docent een admin-wachtwoord resetten?',
        feedback: 'Scherp: admin-rechten zijn krachtig en moeten extra streng beschermd zijn.',
    },
] as const;

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
            launchCase: undefined,
            gevondenProblemen: [],
            aangepasteRegels: {},
            testResultaten: {},
            testVoorspellingen: {},
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
    const testVoorspellingen = state.testVoorspellingen ?? {};
    const aantalTestsMetVoorspelling = TEST_SCENARIOS.filter(scenario => Boolean(testVoorspellingen[scenario.id])).length;
    const selectedLaunchCase = LAUNCH_CASES.find(item => item.id === state.launchCase);
    const kanRegelsInspecteren = Boolean(state.launchCase) || aantalProblemen > 0;

    const stap1Klaar = aantalProblemen >= 3;
    const stap2Klaar = aantalRegelsIngesteld >= 4;
    const stap3Klaar = aantalTestsGedaan >= 5 && aantalTestsCorrect >= 4 && aantalTestsMetVoorspelling >= 5;

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
        if (!testVoorspellingen[scenarioId]) return;

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

    const kiesTestVoorspelling = (scenarioId: string, voorspelling: 'toegang' | 'geblokkeerd') => {
        setState({
            ...state,
            testVoorspellingen: {
                ...testVoorspellingen,
                [scenarioId]: voorspelling,
            },
        });
    };

    const handleVoltooi = () => {
        setState(prev => ({ ...prev, afgerond: true }));
        setCoachMessage(getCoachHint('voltooiing'));
    };

    const handleBevestigAfronding = () => {
        clearSave();
        onComplete(true);
    };

    const naarStap = (stap: number) => {
        setState({ ...state, currentStep: stap });
    };

    const kiesLaunchCase = (launchCase: MissionState['launchCase']) => {
        setState({ ...state, launchCase });
    };

    // ---------------------------------------------------------------------------
    // Render
    // ---------------------------------------------------------------------------

    if (state.afgerond) {
        const gevondenRisicos = state.gevondenProblemen
            .map(id => ONVEILIGE_REGELS.find(regel => regel.id === id))
            .filter((regel): regel is Regel => Boolean(regel));
        const ingesteldeRegels = RESOURCES.map(resource => ({
            resource: resource.resource,
            rollen: state.aangepasteRegels[resource.id] ?? resource.toegestaanVoor,
        }));

        return (
            <div className="min-h-screen overflow-y-auto bg-lab-cream px-4 py-6">
                <div className="mx-auto w-full max-w-2xl space-y-4">
                    <div className="rounded-2xl border border-lab-line bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-start gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-lab-sage text-white">
                                <Shield size={22} />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-lab-coral">
                                    Leerlingbewijs / docentbewijs
                                </p>
                                <h1 className="mt-1 text-xl font-black leading-tight text-lab-ink">
                                    Access Control Engineer afgerond
                                </h1>
                                <p className="mt-2 text-sm leading-relaxed text-lab-muted">
                                    Je hebt risico's gevonden, toegangsregels ingesteld en de configuratie getest. Dit overzicht is het bewijs dat een docent kan beoordelen.
                                </p>
                            </div>
                        </div>

                        <MissionGoalBanner goal={MISSION_GOAL} className="mb-4" />

                        <div className="grid gap-3 md:grid-cols-3">
                            <div className="rounded-xl border border-lab-line bg-lab-cream p-3">
                                <p className="text-xs font-bold uppercase tracking-wide text-lab-muted">Risico's</p>
                                <p className="mt-1 text-2xl font-black text-lab-ink">{gevondenRisicos.length}</p>
                                <p className="text-xs text-lab-muted">gevonden problemen</p>
                            </div>
                            <div className="rounded-xl border border-lab-line bg-lab-cream p-3">
                                <p className="text-xs font-bold uppercase tracking-wide text-lab-muted">Regels</p>
                                <p className="mt-1 text-2xl font-black text-lab-ink">{aantalRegelsIngesteld}</p>
                                <p className="text-xs text-lab-muted">resources ingesteld</p>
                            </div>
                            <div className="rounded-xl border border-lab-line bg-lab-cream p-3">
                                <p className="text-xs font-bold uppercase tracking-wide text-lab-muted">Tests</p>
                                <p className="mt-1 text-2xl font-black text-lab-ink">{aantalTestsCorrect}/{aantalTestsGedaan}</p>
                                <p className="text-xs text-lab-muted">correct uitgevoerd</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-lab-line bg-white p-4">
                        <h2 className="mb-3 text-sm font-black text-lab-ink">Gevonden risico's</h2>
                        <div className="space-y-2">
                            {gevondenRisicos.map(regel => (
                                <div key={regel.id} className="rounded-xl bg-lab-cream p-3">
                                    <p className="text-sm font-semibold text-lab-ink">{regel.beschrijving}</p>
                                    <p className="mt-1 text-xs text-lab-muted">{regel.uitleg}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-lab-line bg-white p-4">
                        <h2 className="mb-3 text-sm font-black text-lab-ink">Ingestelde toegangsregels</h2>
                        <div className="space-y-2">
                            {ingesteldeRegels.map(regel => (
                                <div key={regel.resource} className="flex flex-col gap-2 rounded-xl bg-lab-cream p-3 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-sm font-semibold text-lab-ink">{regel.resource}</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {regel.rollen.map(rol => (
                                            <span key={rol} className={`rounded-full px-2 py-1 text-xs font-bold ${ROLLEN_KLEUREN[rol]}`}>
                                                {rol}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-lab-line bg-white p-4">
                        <h2 className="mb-3 text-sm font-black text-lab-ink">Testresultaten</h2>
                        <div className="space-y-2">
                            {TEST_SCENARIOS.map(scenario => {
                                const resultaat = state.testResultaten[scenario.id];
                                return (
                                    <div key={scenario.id} className="flex items-start gap-3 rounded-xl bg-lab-cream p-3">
                                        {resultaat === 'correct'
                                            ? <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-lab-sage" />
                                            : <XCircle size={18} className="mt-0.5 shrink-0 text-lab-coral" />
                                        }
                                        <div>
                                            <p className="text-sm font-semibold text-lab-ink">
                                                {scenario.gebruiker.naam} - {scenario.resource}
                                            </p>
                                            <p className="mt-1 text-xs font-bold text-lab-ink">
                                                Voorspelling: {testVoorspellingen[scenario.id] === 'toegang' ? 'toestaan' : testVoorspellingen[scenario.id] === 'geblokkeerd' ? 'blokkeren' : 'niet vastgelegd'}
                                            </p>
                                            <p className="mt-1 text-xs text-lab-muted">{scenario.uitleg}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <button
                        onClick={handleBevestigAfronding}
                        data-qa="confirm-completion"
                        className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-lab-sage px-4 text-sm font-black text-white transition-colors hover:bg-lab-sage hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-sage focus-visible:ring-offset-2"
                    >
                        <Shield size={18} />
                        Bevestig bewijs en voltooi missie
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen min-h-screen flex-col overflow-hidden bg-lab-cream">
            {/* Header */}
            <div className="sticky top-0 z-20 flex shrink-0 items-center gap-3 border-b border-lab-line bg-white px-4 py-3">
                <button onClick={onBack} className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg transition-colors hover:bg-lab-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-coral" aria-label="Terug">
                    <ArrowLeft size={20} className="text-lab-muted" />
                </button>
                <div className="flex items-center gap-2 flex-1">
                    <div className="w-8 h-8 bg-lab-coral rounded-lg flex items-center justify-center">
                        <Shield size={18} className="text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lab-ink text-sm leading-tight">Access Control Engineer</h1>
                        <p className="text-xs text-lab-muted">Beveilig het schoolsysteem</p>
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
                                    ? 'bg-lab-coral text-white'
                                    : (s === 0 && stap1Klaar) || (s === 1 && stap2Klaar) || (s === 2 && stap3Klaar)
                                    ? 'bg-lab-sage text-white'
                                    : 'bg-lab-cream text-lab-muted'
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
            <div className={`mx-auto min-h-0 w-full max-w-2xl flex-1 overflow-y-auto p-4 ${coachMessage ? 'pb-40' : 'pb-24'}`}>
                {/* Introductie */}
                {state.currentStep === 0 && (
                    <div className="space-y-4">
                        <MissionGoalBanner goal={MISSION_GOAL} />

                        <div className="bg-lab-gold/10 border border-lab-gold/40 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <AlertTriangle size={20} className="text-lab-coral shrink-0 mt-0.5" />
                                <div>
                                    <h2 className="font-bold text-lab-ink text-sm">Melding van {SCHOOL_NAAM}</h2>
                                    <p className="text-lab-muted text-sm mt-1">
                                        {isVso
                                            ? `Het schoolsysteem heeft problemen. Niet iedereen mag alles zien, maar de regels kloppen niet. Kijk welke regels onveilig zijn.`
                                            : `Het inlogportaal van de school is onveilig: leerlingen kunnen bij cijfers van anderen, gasten loggen zonder wachtwoord in, en roosters zijn aanpasbaar door de verkeerde mensen. Analyseer de beveiligingsregels en vind de problemen.`
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-lab-line bg-white p-4 shadow-sm" data-qa="access-launch-console">
                            <div className="mb-3 flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-lab-coral">Eerste toegangstest</p>
                                    <h2 className="mt-1 text-lg font-black leading-tight text-lab-ink">Kies welke situatie je als eerste test.</h2>
                                </div>
                                <span className="shrink-0 rounded-full border border-lab-line bg-lab-cream px-3 py-1 text-xs font-black text-lab-muted">1/3</span>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-3">
                                {LAUNCH_CASES.map(item => {
                                    const Icon = item.icon;
                                    const selected = state.launchCase === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => kiesLaunchCase(item.id)}
                                            data-qa="access-launch-case"
                                            aria-pressed={selected}
                                            className={`rounded-xl border p-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-coral active:scale-[0.98] ${
                                                selected
                                                    ? 'border-lab-coral bg-lab-coral/10 shadow-sm'
                                                    : 'border-lab-line bg-lab-cream hover:border-lab-coral/60'
                                            }`}
                                        >
                                            <Icon size={22} className={selected ? 'text-lab-coral' : 'text-lab-teal'} />
                                            <p className="mt-2 text-sm font-black text-lab-ink">{item.role} → {item.resource}</p>
                                            <p className="mt-1 text-xs leading-snug text-lab-muted">{item.question}</p>
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="mt-3 rounded-xl border border-lab-sage/25 bg-lab-sage/10 p-3" data-qa="access-launch-feedback">
                                <p className="text-xs font-bold leading-relaxed text-lab-ink">
                                    {selectedLaunchCase?.feedback ?? 'Kies eerst een testcase. Daarna inspecteer je welke regels het systeem onveilig maken.'}
                                </p>
                            </div>
                        </div>

                        {kanRegelsInspecteren ? (
                            <>
                                <h3 className="font-bold text-lab-ink">Stap 1: Vind de problemen</h3>
                                <p className="text-sm text-lab-muted">
                                    Hieronder staan de huidige beveiligingsregels van het schoolsysteem.
                                    Tik op de regels die <strong>onveilig</strong> zijn.
                                    {isVso && ' Tip: kijk welke regels iedereen overal bij laten.'}
                                </p>

                                <div className="space-y-2">
                                    {ONVEILIGE_REGELS.map(regel => {
                                        const geselecteerd = state.gevondenProblemen.includes(regel.id);
                                        const toonUitleg = showUitleg === regel.id;
                                        return (
                                            <div key={regel.id} className="bg-white rounded-xl border border-lab-line overflow-hidden">
                                                <button
                                                    onClick={() => toggleProbleem(regel.id)}
                                                    data-qa={`step1-problem-${regel.id}`}
                                                    className={`w-full text-left p-3 flex items-center gap-3 transition-colors ${
                                                        geselecteerd
                                                            ? regel.isVeilig
                                                                ? 'bg-lab-coral border-l-4 border-lab-coral'
                                                                : 'bg-lab-sage border-l-4 border-lab-sage'
                                                            : 'hover:bg-lab-cream'
                                                    }`}
                                                >
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                                                        geselecteerd ? (regel.isVeilig ? 'bg-lab-coral' : 'bg-lab-sage') : 'bg-lab-cream'
                                                    }`}>
                                                        {geselecteerd ? (
                                                            regel.isVeilig
                                                                ? <XCircle size={14} className="text-lab-muted" />
                                                                : <CheckCircle2 size={14} className="text-lab-muted" />
                                                        ) : (
                                                            <Eye size={14} className="text-lab-muted" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm text-lab-ink">{regel.beschrijving}</p>
                                                        <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
                                                            regel.risicoType === 'privacy' ? 'bg-lab-teal text-white' :
                                                            regel.risicoType === 'authenticatie' ? 'bg-lab-coral text-white' :
                                                            'bg-lab-teal text-white'
                                                        }`}>
                                                            {regel.risicoType}
                                                        </span>
                                                    </div>
                                                </button>
                                                {geselecteerd && (
                                                    <div className="px-3 pb-3">
                                                        <button
                                                            onClick={() => setShowUitleg(toonUitleg ? null : regel.id)}
                                                            className="flex min-h-[44px] items-center rounded-lg px-2 text-xs text-lab-coral hover:underline"
                                                        >
                                                            {toonUitleg ? 'Verberg uitleg' : 'Bekijk uitleg'}
                                                        </button>
                                                        {toonUitleg && (
                                                            <p className="text-xs text-lab-muted mt-1 bg-lab-cream rounded-lg p-2">
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

                                <div className="bg-lab-cream rounded-xl p-3 flex items-center justify-between">
                                    <p className="text-sm text-lab-muted">
                                        Gevonden: <strong>{aantalProblemen}</strong> / minstens 3 problemen
                                    </p>
                                    {stap1Klaar && (
                                        <button
                                            onClick={() => naarStap(1)}
                                            data-qa="step1-next"
                                            className="flex min-h-[44px] items-center gap-1 rounded-lg bg-lab-coral px-4 text-sm font-medium text-white transition-colors hover:bg-lab-coral hover:text-white"
                                        >
                                            Volgende <ArrowRight size={16} />
                                        </button>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="rounded-xl border border-lab-line bg-white p-4 text-center" data-qa="access-launch-gate">
                                <p className="text-sm font-bold text-lab-ink">Nog geen regels zichtbaar.</p>
                                <p className="mt-1 text-xs leading-relaxed text-lab-muted">
                                    Start als engineer met één concrete testcase. Daarna weet je waar je in de regels op moet letten.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Stap 2: Regels aanpassen */}
                {state.currentStep === 1 && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-lab-ink">Stap 2: Stel de juiste rechten in</h3>
                        <p className="text-sm text-lab-muted">
                            {isVso
                                ? 'Kies voor elke actie wie dat mag doen. Vink de juiste rollen aan.'
                                : 'Nu je de problemen kent, ga je de toegangsrechten correct instellen. Bepaal per resource welke rollen er toegang toe moeten hebben.'
                            }
                        </p>

                        <div className="space-y-3">
                            {RESOURCES.map(resource => {
                                const huidigeRollen = state.aangepasteRegels[resource.id] ?? [];
                                return (
                                    <div key={resource.id} className="bg-white rounded-xl border border-lab-line p-4">
                                        <div className="flex items-start gap-2 mb-2">
                                            <Lock size={16} className="text-lab-muted shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-semibold text-lab-ink">{resource.resource}</p>
                                                <p className="text-xs text-lab-muted">{resource.beschrijving}</p>
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
                                                        data-qa={`step2-role-${resource.id}-${rol}`}
                                                        className={`min-h-[44px] rounded-full px-3 text-xs font-medium transition-all ${
                                                            actief
                                                                ? ROLLEN_KLEUREN[rol] + ' ring-2 ring-offset-1 ring-lab-coral'
                                                                : 'bg-lab-cream text-lab-muted hover:bg-lab-creamDeep'
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

                        <div className="bg-lab-cream rounded-xl p-3 flex items-center justify-between">
                            <p className="text-sm text-lab-muted">
                                Ingesteld: <strong>{aantalRegelsIngesteld}</strong> / {RESOURCES.length} resources
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => naarStap(0)}
                                    className="flex min-h-[44px] items-center gap-1 rounded-lg px-3 text-sm text-lab-muted transition-colors hover:bg-lab-creamDeep"
                                >
                                    <ArrowLeft size={16} /> Terug
                                </button>
                                {stap2Klaar && (
                                    <button
                                        onClick={() => naarStap(2)}
                                        data-qa="step2-next"
                                        className="flex min-h-[44px] items-center gap-1 rounded-lg bg-lab-coral px-4 text-sm font-medium text-white transition-colors hover:bg-lab-coral hover:text-white"
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
                        <h3 className="font-bold text-lab-ink">Stap 3: Test je configuratie</h3>
                        <p className="text-sm text-lab-muted">
                            {isVso
                                ? 'Controleer of jouw regels goed werken. Druk op "Test" en kijk of de juiste mensen de juiste toegang krijgen.'
                                : 'Voer de testscenario\'s uit om te controleren of jouw toegangsregels correct werken. Elke test simuleert een echte gebruiker die iets probeert te doen.'
                            }
                        </p>

                        <div className="space-y-3">
                            {TEST_SCENARIOS.map(scenario => {
                                const resultaat = state.testResultaten[scenario.id];
                                const toonDetail = showTestResult === scenario.id;
                                const voorspelling = testVoorspellingen[scenario.id];
                                return (
                                    <div key={scenario.id} className={`bg-white rounded-xl border overflow-hidden transition-colors ${
                                        resultaat === 'correct' ? 'border-lab-sage' :
                                        resultaat === 'fout' ? 'border-lab-coral' :
                                        'border-lab-line'
                                    }`}>
                                        <div className="p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ROLLEN_KLEUREN[scenario.gebruiker.rol]}`}>
                                                    {scenario.gebruiker.rol}
                                                </span>
                                                <span className="text-sm font-medium text-lab-muted">{scenario.gebruiker.naam}</span>
                                            </div>
                                            <p className="text-sm text-lab-muted mb-3">
                                                Wil: <strong>{scenario.resource}</strong>
                                            </p>
                                            <div className="mb-3 rounded-xl border border-lab-line bg-lab-cream p-3" data-qa={`step3-prediction-${scenario.id}`}>
                                                <p className="mb-2 text-xs font-black uppercase tracking-widest text-lab-muted">
                                                    Voorspel eerst de juiste uitkomst
                                                </p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {(['toegang', 'geblokkeerd'] as const).map(optie => {
                                                        const selected = voorspelling === optie;
                                                        return (
                                                            <button
                                                                key={optie}
                                                                type="button"
                                                                onClick={() => kiesTestVoorspelling(scenario.id, optie)}
                                                                disabled={resultaat !== null && resultaat !== undefined && Boolean(voorspelling)}
                                                                aria-pressed={selected}
                                                                data-qa={`step3-predict-${scenario.id}-${optie}`}
                                                                className={`min-h-[44px] rounded-lg border px-3 text-xs font-black transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-coral disabled:cursor-default ${
                                                                    selected
                                                                        ? optie === 'toegang'
                                                                            ? 'border-lab-sage bg-lab-sage text-white'
                                                                            : 'border-lab-coral bg-lab-coral text-white'
                                                                        : 'border-lab-line bg-white text-lab-muted hover:border-lab-coral/50'
                                                                }`}
                                                            >
                                                                {optie === 'toegang' ? 'Toestaan' : 'Blokkeren'}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                                <p className="mt-2 text-xs leading-relaxed text-lab-muted">
                                                    {voorspelling
                                                        ? `Bewijs gepind: jij verwacht ${voorspelling === 'toegang' ? 'toegang' : 'blokkade'} voor deze rol/resource-combinatie.`
                                                        : 'Pin je verwachting. Daarna mag je de test-run starten.'}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {resultaat === null || resultaat === undefined ? (
                                                    <button
                                                        onClick={() => voerTestUit(scenario.id)}
                                                        disabled={!voorspelling}
                                                        data-qa={`step3-run-test-${scenario.id}`}
                                                        className="min-h-[44px] rounded-lg bg-lab-coral px-3 text-xs font-medium text-white transition-colors hover:bg-lab-coral hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {voorspelling ? 'Test uitvoeren' : 'Voorspel eerst'}
                                                    </button>
                                                ) : (
                                                    <>
                                                        <div className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold ${
                                                            resultaat === 'correct' ? 'bg-lab-sage text-white' : 'bg-lab-coral text-white'
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
                                                            className="flex min-h-[44px] items-center gap-1 rounded-lg px-3 text-xs text-lab-muted hover:text-lab-muted"
                                                        >
                                                            <RotateCcw size={12} /> Opnieuw
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => setShowTestResult(toonDetail ? null : scenario.id)}
                                                    className="ml-auto flex min-h-[44px] items-center rounded-lg px-3 text-xs text-lab-coral hover:underline"
                                                >
                                                    {toonDetail ? 'Verberg' : 'Uitleg'}
                                                </button>
                                            </div>
                                        </div>
                                        {toonDetail && (
                                            <div className="bg-lab-cream px-4 py-3 border-t border-lab-line">
                                                <p className="text-xs text-lab-muted">
                                                    <strong>Jouw voorspelling:</strong> {voorspelling === 'toegang' ? 'Toegang verlenen' : voorspelling === 'geblokkeerd' ? 'Geblokkeerd' : 'Niet gekozen'}
                                                </p>
                                                <p className="text-xs text-lab-muted">
                                                    <strong>Verwacht:</strong> {scenario.verwachtResultaat === 'toegang' ? 'Toegang verlenen' : 'Geblokkeerd'}
                                                </p>
                                                <p className="text-xs text-lab-muted mt-1">{scenario.uitleg}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="bg-lab-cream rounded-xl p-3">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-lab-muted">
                                    Tests: <strong>{aantalTestsCorrect}</strong> correct / {aantalTestsGedaan} uitgevoerd
                                    <span className="block text-xs">Voorspellingen: {aantalTestsMetVoorspelling} / 5 nodig</span>
                                </p>
                                <button
                                    onClick={() => naarStap(1)}
                                    className="flex min-h-[44px] items-center gap-1 rounded-lg px-3 text-sm text-lab-muted transition-colors hover:bg-lab-creamDeep"
                                >
                                    <ArrowLeft size={16} /> Terug
                                </button>
                            </div>
                            {stap3Klaar && (
                                <button
                                    onClick={handleVoltooi}
                                    data-qa="step3-finish"
                                    className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-lab-sage px-4 text-sm font-bold text-white transition-colors hover:bg-lab-sage hover:text-white"
                                >
                                    <Shield size={18} />
                                    Missie afronden — systeem beveiligd!
                                </button>
                            )}
                            {!stap3Klaar && aantalTestsGedaan > 0 && (
                                <p className="text-xs text-lab-gold mt-1">
                                    {aantalTestsMetVoorspelling < 5
                                        ? `Pin eerst bij minstens 5 tests je voorspelling (nu: ${aantalTestsMetVoorspelling}).`
                                        : aantalTestsCorrect < 4
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
                <div className="fixed bottom-4 left-4 right-4 z-30 mx-auto max-w-lg animate-in slide-in-from-bottom-4" data-qa="security-coach">
                    <div className="flex items-start gap-3 rounded-xl border border-lab-coral/35 bg-white p-3 shadow-xl shadow-lab-coral/10">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lab-coral/12 text-lab-coral">
                            <MessageCircle size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="mb-0.5 text-xs font-black uppercase tracking-wide text-lab-coral">Security Coach</p>
                            <p className="text-sm leading-relaxed text-lab-ink">{coachMessage}</p>
                        </div>
                        <button
                            onClick={() => setCoachMessage(null)}
                            className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full text-lab-muted transition-colors hover:bg-lab-cream hover:text-lab-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-coral"
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
