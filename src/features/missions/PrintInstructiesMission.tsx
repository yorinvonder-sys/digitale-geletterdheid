/**
 * PrintInstructiesMission.tsx
 *
 * "Print Troubleshooter" — leerlingen diagnosticeren printproblemen en maken
 * per storing een reparatiebon met route, bewijs en oplossing.
 *
 * Bloom niveau 3 (toepassen): leerlingen passen kennis over printerinstellingen
 * toe op realistische probleemsituaties.
 *
 * SLO-doelen: Digitale basisvaardigheden, probleemoplossend denken
 */

import React, { useState } from 'react';
import { ArrowLeft, Printer, ChevronRight, Check, Trophy, Sparkles, Lightbulb, Wifi, FileWarning, Settings } from 'lucide-react';
import type { VsoProfile } from '@/types';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';
import { getMissionGoal } from '@/config/missionGoals';
import { MissionGoalBanner } from './templates/shared/MissionGoalBanner';

interface Props {
    onBack: () => void;
    onComplete: (success: boolean) => void;
    vsoProfile?: VsoProfile;
}

type RepairRoute = 'connection' | 'settings' | 'paper';

interface Scenario {
    id: number;
    emoji: string;
    title: string;
    description: string;
    visual: string;
    route: RepairRoute;
    symptom: string;
    repairAction: string;
    explanation: string;
    tip: string;
}

interface PrintTroubleshooterState {
    currentScenario: number;
    score: number;
    attemptsPerScenario: Record<number, number>;
    correctScenarios: number[];
    showIntro: boolean;
    showComplete: boolean;
    reflectie: string;
    launchChoice?: 'connection' | 'settings' | 'paper';
}

const SCENARIOS: Scenario[] = [
    {
        id: 0,
        emoji: '🖨️',
        title: 'Mijn document print niet!',
        description: 'Je drukt op "Printen", maar er gebeurt niks. De printer reageert helemaal niet. Je ziet dat het WiFi-icoontje op de printer uit staat.',
        visual: 'wifi-off',
        route: 'connection',
        symptom: 'WiFi-icoon staat uit en de printer reageert niet.',
        repairAction: 'Controleer de WiFi-verbinding of netwerkkabel van de printer.',
        explanation: 'Als het WiFi-icoontje uit staat, is de printer niet verbonden met het netwerk. Zonder verbinding kan je computer de printer niet bereiken.',
        tip: 'Check altijd eerst of de printer verbonden is met WiFi of een kabel voordat je andere dingen probeert.',
    },
    {
        id: 1,
        emoji: '🎨',
        title: 'Het print alleen zwart-wit!',
        description: 'Je hebt een kleurrijke presentatie gemaakt, maar als je hem print komt alles er in zwart-wit uit. De printer heeft wel kleurenpatronen.',
        visual: 'grayscale',
        route: 'settings',
        symptom: 'Kleurenbestand komt uit de printer als zwart-wit.',
        repairAction: 'Wijzig de printerinstelling van grijswaarden naar kleur.',
        explanation: 'De printer kan kleuren printen. Het probleem zit waarschijnlijk in de kleurinstelling, niet in het bestand of de hardware.',
        tip: 'Kijk voor het printen altijd even bij "Printerinstellingen" of de juiste kleuroptie is geselecteerd.',
    },
    {
        id: 2,
        emoji: '📄',
        title: 'De tekst wordt afgesneden!',
        description: 'Je print een werkstuk, maar de rechterrand van de tekst valt steeds van de pagina af. Het lijkt alsof het papierformaat niet klopt.',
        visual: 'paper-size',
        route: 'paper',
        symptom: 'De rechterrand valt weg en het papierformaat lijkt niet te kloppen.',
        repairAction: 'Wijzig het papierformaat van Letter naar A4.',
        explanation: '"Letter" is een Amerikaans formaat. In Nederland gebruiken we A4, dus een verkeerd papierformaat kan tekst afsnijden.',
        tip: 'In Nederland is A4 de standaard. Check bij afgeknipte tekst altijd of het papierformaat op A4 staat.',
    },
    {
        id: 3,
        emoji: '📚',
        title: 'Er komen 10 kopieën uit!',
        description: 'Je wilde 1 kopie printen van je huiswerk, maar de printer stopt niet. Er komen maar pagina\'s uit — je telt er al 10!',
        visual: 'copies',
        route: 'settings',
        symptom: 'De printer blijft doorgaan en het aantal kopieën staat op 10.',
        repairAction: 'Annuleer zo nodig de opdracht en controleer het aantal exemplaren in de instellingen.',
        explanation: 'De printer doet wat er gevraagd is: 10 kopieën printen. Het probleem zit dus bij de opdrachtinstelling.',
        tip: 'Check voor het printen ALTIJD het aantal kopieën. Standaard staat dit op 1, maar het kan per ongeluk veranderd zijn.',
    },
    {
        id: 4,
        emoji: '🔍',
        title: 'Het document past niet op 1 pagina!',
        description: 'Je wilt een overzichtelijke tabel printen op 1 pagina, maar hij wordt over 3 pagina\'s verdeeld. De tabel is niet eens zo groot.',
        visual: 'margins',
        route: 'settings',
        symptom: 'De tabel splitst over 3 pagina\'s terwijl hij op 1 pagina zou moeten passen.',
        repairAction: 'Pas marges of schaal aan en kies passend op 1 pagina.',
        explanation: 'Grote marges of een te hoge schaal zorgen ervoor dat de inhoud niet past. Met passend op 1 pagina schaalt de printer automatisch.',
        tip: 'De optie "Passend op 1 pagina" of "Fit to Page" is je beste vriend bij tabellen en overzichten.',
    },
];

const LAUNCH_CHOICES = [
    {
        id: 'connection',
        icon: Wifi,
        title: 'Niets print',
        prompt: 'Check eerst de verbinding',
        feedback: 'Goed begin: als de printer niet reageert, controleer je eerst of je hem kunt bereiken.',
    },
    {
        id: 'settings',
        icon: Settings,
        title: 'Verkeerde afdruk',
        prompt: 'Check eerst de instellingen',
        feedback: 'Slim: kleur, kopieën en schaal zitten vaak verstopt in de printinstellingen.',
    },
    {
        id: 'paper',
        icon: FileWarning,
        title: 'Pagina klopt niet',
        prompt: 'Check eerst papier en formaat',
        feedback: 'Sterk: bij afgesneden of verspreide tekst is papierformaat vaak de oorzaak.',
    },
] as const;

const PrinterVisual: React.FC<{ scenario: Scenario; showCorrect: boolean }> = ({ scenario, showCorrect }) => {
    const borderColor = showCorrect ? '#5F947D' : '#E7D8BD';

    return (
        <div className="rounded-2xl p-5 mx-auto max-w-xs" style={{ backgroundColor: '#FFFFFF', border: `2px solid ${borderColor}` }}>
            <div className="text-center mb-3">
                <span className="text-5xl">{scenario.emoji}</span>
            </div>
            <div className="rounded-xl p-3" style={{ backgroundColor: '#FCF6EA', border: '1px solid #E7D8BD' }}>
                {scenario.visual === 'wifi-off' && (
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2">
                            <Printer size={24} style={{ color: '#445865' }} />
                            <span className="text-xs font-bold line-through" style={{ color: '#D97848', fontFamily: "'Outfit', system-ui, sans-serif" }}>WiFi</span>
                        </div>
                        <div className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(217, 120, 72, 0.1)', color: '#D97848', fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            Geen verbinding
                        </div>
                    </div>
                )}
                {scenario.visual === 'grayscale' && (
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex gap-1">
                            <div className="w-6 h-6 rounded bg-lab-ink" />
                            <div className="w-6 h-6 rounded bg-lab-coral" />
                            <div className="w-6 h-6 rounded bg-lab-creamDeep" />
                        </div>
                        <div className="text-[10px] font-bold" style={{ color: '#445865', fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            Alleen grijstinten...
                        </div>
                    </div>
                )}
                {scenario.visual === 'paper-size' && (
                    <div className="flex items-end justify-center gap-3">
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-10 rounded border-2" style={{ borderColor: '#D97848' }} />
                            <span className="text-[9px] mt-1 font-bold" style={{ color: '#D97848', fontFamily: "'Outfit', system-ui, sans-serif" }}>Letter</span>
                        </div>
                        <span className="text-xs font-bold mb-3" style={{ color: '#445865' }}>→</span>
                        <div className="flex flex-col items-center">
                            <div className="w-7 h-11 rounded border-2" style={{ borderColor: '#5F947D' }} />
                            <span className="text-[9px] mt-1 font-bold" style={{ color: '#5F947D', fontFamily: "'Outfit', system-ui, sans-serif" }}>A4</span>
                        </div>
                    </div>
                )}
                {scenario.visual === 'copies' && (
                    <div className="flex flex-col items-center gap-1">
                        <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="w-4 h-5 rounded-sm bg-white border" style={{ borderColor: '#D97848', marginLeft: i > 0 ? '-2px' : '0' }} />
                            ))}
                        </div>
                        <div className="text-[10px] font-bold" style={{ color: '#D97848', fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            Kopieën: 10 !!
                        </div>
                    </div>
                )}
                {scenario.visual === 'margins' && (
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-12 h-14 rounded border-2 relative" style={{ borderColor: '#D97848' }}>
                            <div className="absolute inset-2 border border-dashed rounded-sm" style={{ borderColor: '#445865' }}>
                                <div className="text-[6px] text-center mt-1" style={{ color: '#445865' }}>tabel</div>
                            </div>
                        </div>
                        <div className="text-[10px] font-bold" style={{ color: '#D97848', fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            Marges te groot
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const PrintInstructiesMission: React.FC<Props> = ({ onBack, onComplete }) => {
    const { state, setState, clearSave } = useMissionAutoSave<PrintTroubleshooterState>(
        'print-troubleshooter',
        {
            currentScenario: 0,
            score: 0,
            attemptsPerScenario: {},
            correctScenarios: [],
            showIntro: true,
            showComplete: false,
            reflectie: '',
            launchChoice: undefined,
        }
    );

    const { currentScenario, score, attemptsPerScenario, correctScenarios, showIntro, showComplete } = state;
    const launchChoice = LAUNCH_CHOICES.find(choice => choice.id === state.launchChoice);

    // Transient UI state — niet opgeslagen
    const [selectedRoute, setSelectedRoute] = useState<RepairRoute | null>(null);
    const [repairNote, setRepairNote] = useState('');
    const [showFeedback, setShowFeedback] = useState(false);

    const scenario = SCENARIOS[currentScenario];
    const routeIsCorrect = selectedRoute === scenario.route;

    const handleSubmitRepair = () => {
        if (showFeedback) return;
        if (!selectedRoute || repairNote.trim().length < 12) return;
        setShowFeedback(true);

        const attempts = (attemptsPerScenario[currentScenario] || 0) + 1;

        setState(prev => ({
            ...prev,
            attemptsPerScenario: { ...prev.attemptsPerScenario, [currentScenario]: attempts },
        }));

        const points = routeIsCorrect ? 20 : 10;
        setState(prev => ({
            ...prev,
            score: prev.score + points,
            correctScenarios: routeIsCorrect && !prev.correctScenarios.includes(currentScenario)
                ? [...prev.correctScenarios, currentScenario]
                : prev.correctScenarios,
        }));
    };

    const handleNext = () => {
        setSelectedRoute(null);
        setRepairNote('');
        setShowFeedback(false);

        if (currentScenario < SCENARIOS.length - 1) {
            setState(prev => ({ ...prev, currentScenario: prev.currentScenario + 1 }));
        } else {
            setState(prev => ({ ...prev, showComplete: true }));
        }
    };

    // Intro screen
    if (showIntro) {
        return (
            <div className="min-h-screen overflow-y-auto" style={{ backgroundColor: '#FCF6EA' }}>
                <div className="min-h-full flex items-center justify-center p-4">
                    <div className="max-w-lg w-full text-center space-y-8">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 transition-all duration-300 font-bold text-sm uppercase tracking-widest mx-auto"
                            style={{ color: '#445865', fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            <ArrowLeft size={16} /> Terug
                        </button>

                        <div className="relative inline-block">
                            <div className="absolute inset-0 blur-3xl rounded-full animate-pulse" style={{ backgroundColor: 'rgba(217, 120, 72, 0.2)' }} />
                            <div className="relative w-32 h-32 rounded-3xl flex items-center justify-center shadow-2xl" style={{ background: 'linear-gradient(to bottom right, #D97848, #D97848)' }}>
                                <Printer size={64} className="text-white" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-4xl font-black" style={{ fontFamily: "'Newsreader', Georgia, serif", color: '#08283B' }}>
                                Print Troubleshooter
                            </h1>
                            <p className="text-lg" style={{ fontFamily: "'Outfit', system-ui, sans-serif", color: '#445865' }}>
                                Er gaat van alles mis met de printer! Kun jij elk probleem oplossen?
                            </p>
                            <p className="text-sm font-semibold" style={{ fontFamily: "'Outfit', system-ui, sans-serif", color: '#445865' }}>
                                5 printproblemen — diagnosticeer het probleem en kies de juiste oplossing
                            </p>
                        </div>

                        <MissionGoalBanner goal={getMissionGoal('ipad-print-instructies')!} compact />

                        <div className="rounded-3xl p-4 text-left" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7D8BD' }} data-qa="print-crisis-console">
                            <div className="mb-4 flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#D97848', fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                        Eerste actie
                                    </p>
                                    <h2 className="mt-1 text-xl font-black leading-tight" style={{ fontFamily: "'Newsreader', Georgia, serif", color: '#08283B' }}>
                                        Er ligt een printcrisis. Wat check je eerst?
                                    </h2>
                                </div>
                                <span className="shrink-0 rounded-full px-3 py-1 text-xs font-black" style={{ border: '1px solid #E7D8BD', backgroundColor: '#FCF6EA', color: '#445865' }}>
                                    1/5
                                </span>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-3">
                                {LAUNCH_CHOICES.map(choice => {
                                    const Icon = choice.icon;
                                    const selected = state.launchChoice === choice.id;
                                    return (
                                        <button
                                            key={choice.id}
                                            type="button"
                                            onClick={() => setState(prev => ({ ...prev, launchChoice: choice.id }))}
                                            data-qa="print-crisis-choice"
                                            aria-pressed={selected}
                                            className="rounded-2xl p-3 text-left transition-all duration-200 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#D97848]"
                                            style={{
                                                backgroundColor: selected ? 'rgba(217, 120, 72, 0.08)' : '#FCF6EA',
                                                border: `1px solid ${selected ? '#D97848' : '#E7D8BD'}`,
                                            }}
                                        >
                                            <Icon size={22} style={{ color: selected ? '#D97848' : '#0B453F' }} />
                                            <p className="mt-2 text-sm font-black" style={{ color: '#08283B', fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                                {choice.title}
                                            </p>
                                            <p className="mt-1 text-xs leading-snug" style={{ color: '#445865', fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                                {choice.prompt}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="mt-4 rounded-2xl p-3" style={{ backgroundColor: 'rgba(95, 148, 125, 0.08)', border: '1px solid rgba(95, 148, 125, 0.2)' }} data-qa="print-crisis-feedback">
                                <p className="text-xs font-bold leading-relaxed" style={{ color: '#0B453F', fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                    {launchChoice?.feedback ?? 'Kies eerst een diagnose-route. Goede troubleshooter lossen niet willekeurig op.'}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setState(prev => ({ ...prev, showIntro: false }))}
                            disabled={!state.launchChoice}
                            data-qa="print-crisis-start"
                            className="w-full py-4 text-white rounded-full font-black uppercase tracking-wide transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#D97848]"
                            style={{
                                backgroundColor: state.launchChoice ? '#D97848' : '#E7D8BD',
                                color: state.launchChoice ? '#FFFFFF' : '#445865',
                                cursor: state.launchChoice ? 'pointer' : 'not-allowed',
                                fontFamily: "'Outfit', system-ui, sans-serif",
                            }}
                            onMouseEnter={e => { if (state.launchChoice) e.currentTarget.style.backgroundColor = '#D97848'; }}
                            onMouseLeave={e => { if (state.launchChoice) e.currentTarget.style.backgroundColor = '#D97848'; }}
                        >
                            Start Troubleshooting
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Complete screen
    if (showComplete) {
        const maxScore = SCENARIOS.length * 20;
        const percentage = Math.round((score / maxScore) * 100);
        const allCorrect = correctScenarios.length === SCENARIOS.length;

        return (
            <div className="min-h-screen overflow-y-auto" style={{ backgroundColor: '#FCF6EA' }}>
                <div className="min-h-full flex items-center justify-center p-4">
                    <div className="max-w-lg w-full text-center space-y-8">
                        <div className="relative inline-block">
                            <div className="absolute inset-0 blur-3xl rounded-full animate-pulse" style={{ backgroundColor: allCorrect ? 'rgba(95, 148, 125, 0.2)' : 'rgba(217, 120, 72, 0.2)' }} />
                            <div className="relative w-32 h-32 rounded-3xl flex items-center justify-center shadow-2xl animate-bounce" style={{ background: allCorrect ? 'linear-gradient(to bottom right, #5F947D, #5F947D)' : 'linear-gradient(to bottom right, #D97848, #D97848)' }}>
                                {allCorrect ? <Trophy size={64} className="text-white" /> : <Sparkles size={64} className="text-white" />}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-4xl font-black" style={{ fontFamily: "'Newsreader', Georgia, serif", color: '#08283B' }}>
                                {allCorrect ? 'Print Expert!' : 'Missie Voltooid!'}
                            </h1>
                            <p className="text-lg" style={{ fontFamily: "'Outfit', system-ui, sans-serif", color: '#445865' }}>
                                {allCorrect
                                    ? 'Alle printproblemen opgelost — je bent een echte troubleshooter!'
                                    : 'Je hebt alle scenario\'s doorlopen. Bekijk de tips hieronder om het te onthouden.'}
                            </p>
                        </div>

                        <div className="rounded-2xl p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7D8BD' }}>
                            <div className="flex justify-around">
                                <div>
                                    <p className="text-3xl font-black" style={{ color: '#5F947D' }}>{correctScenarios.length}/{SCENARIOS.length}</p>
                                    <p className="text-sm" style={{ color: '#445865', fontFamily: "'Outfit', system-ui, sans-serif" }}>Opgelost</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-black" style={{ color: '#D97848' }}>{score}/{maxScore}</p>
                                    <p className="text-sm" style={{ color: '#445865', fontFamily: "'Outfit', system-ui, sans-serif" }}>Punten</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-black" style={{ color: '#5F947D' }}>{percentage}%</p>
                                    <p className="text-sm" style={{ color: '#445865', fontFamily: "'Outfit', system-ui, sans-serif" }}>Score</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl p-6 text-left" style={{ backgroundColor: 'rgba(95, 148, 125, 0.06)', border: '1px solid rgba(95, 148, 125, 0.2)' }}>
                            <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: '#5F947D', fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                <Lightbulb size={20} /> Tips om te onthouden
                            </h3>
                            <ul className="space-y-2">
                                {SCENARIOS.map((s, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <span className="text-sm flex-shrink-0">{s.emoji}</span>
                                        <span className="text-sm" style={{ color: '#445865', fontFamily: "'Outfit', system-ui, sans-serif" }}>{s.tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Reflectie */}
                        <div className="rounded-2xl p-4 text-left space-y-3" style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(217, 120, 72, 0.2)' }}>
                            <div className="flex items-center gap-2">
                                <Sparkles size={16} style={{ color: '#D97848' }} />
                                <p className="text-xs font-black uppercase tracking-widest" style={{ color: '#D97848', fontFamily: "'Outfit', system-ui, sans-serif" }}>Reflectie</p>
                            </div>
                            <p className="text-xs" style={{ color: '#445865', fontFamily: "'Outfit', system-ui, sans-serif" }}>Wat heb je geleerd in deze missie? Waar zou je dit in het dagelijks leven tegenkomen?</p>
                            <textarea
                                value={state.reflectie}
                                onChange={e => setState(prev => ({ ...prev, reflectie: e.target.value }))}
                                placeholder="Wat heb je geleerd? Waar kom je dit nog meer tegen?"
                                className="w-full p-3 rounded-xl border-2 resize-none focus:outline-none transition-all duration-300"
                                style={{ minHeight: '80px', fontFamily: "'Outfit', system-ui, sans-serif", borderColor: '#E7D8BD', backgroundColor: '#FCF6EA', fontSize: '0.875rem' }}
                                onFocus={e => (e.currentTarget.style.borderColor = '#D97848')}
                                onBlur={e => (e.currentTarget.style.borderColor = '#E7D8BD')}
                            />
                        </div>

                        <button
                            onClick={() => { clearSave(); onComplete(true); }}
                            disabled={state.reflectie.trim().length < 10}
                            className="w-full py-4 text-white rounded-full font-black uppercase tracking-wide transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#D97848]"
                            style={{
                                backgroundColor: state.reflectie.trim().length < 10 ? '#E7D8BD' : '#D97848',
                                color: state.reflectie.trim().length < 10 ? '#E7D8BD' : '#FFFFFF',
                                cursor: state.reflectie.trim().length < 10 ? 'not-allowed' : 'pointer',
                                fontFamily: "'Outfit', system-ui, sans-serif",
                            }}
                            onMouseEnter={e => { if (state.reflectie.trim().length >= 10) e.currentTarget.style.backgroundColor = '#D97848'; }}
                            onMouseLeave={e => { if (state.reflectie.trim().length >= 10) e.currentTarget.style.backgroundColor = '#D97848'; }}
                        >
                            Terug naar Mission Control
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Main game screen
    return (
        <div className="min-h-screen" style={{ backgroundColor: '#FCF6EA' }}>
            {/* Header */}
            <div className="sticky top-0 z-20 backdrop-blur-md" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderBottom: '1px solid #E7D8BD' }}>
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="p-2 transition-colors"
                        style={{ color: '#445865' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#08283B')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#445865')}
                    >
                        <ArrowLeft size={24} />
                    </button>

                    <div className="flex items-center gap-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold" style={{
                            backgroundColor: 'rgba(217, 120, 72, 0.1)',
                            color: '#D97848',
                            border: '1px solid rgba(217, 120, 72, 0.2)',
                            fontFamily: "'Outfit', system-ui, sans-serif",
                        }}>
                            Scenario {currentScenario + 1}/{SCENARIOS.length}
                        </span>

                        <div className="flex items-center gap-1 px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(95, 148, 125, 0.1)', border: '1px solid rgba(95, 148, 125, 0.2)' }}>
                            <Printer size={14} style={{ color: '#5F947D' }} />
                            <span className="font-bold text-sm" style={{ color: '#5F947D', fontFamily: "'Outfit', system-ui, sans-serif" }}>{score} pts</span>
                        </div>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="h-1.5" style={{ backgroundColor: '#E7D8BD' }}>
                    <div
                        className="h-full transition-all duration-500"
                        style={{
                            width: `${((currentScenario + (showFeedback ? 1 : 0)) / SCENARIOS.length) * 100}%`,
                            background: 'linear-gradient(to right, #0B453F, #0B453F)',
                        }}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
                {/* Scenario card */}
                <div className="rounded-2xl p-5" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7D8BD' }}>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl">{scenario.emoji}</span>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#D97848', fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                Probleem {currentScenario + 1}
                            </span>
                            <h2 className="text-xl font-black" style={{ fontFamily: "'Newsreader', Georgia, serif", color: '#08283B' }}>
                                {scenario.title}
                            </h2>
                        </div>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: '#445865', fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        {scenario.description}
                    </p>
                </div>

                {/* Visual */}
                <PrinterVisual scenario={scenario} showCorrect={showFeedback && routeIsCorrect} />

                {/* Repair ticket */}
                <div className="rounded-2xl p-4 text-center" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7D8BD' }}>
                    <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#D97848', fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        Reparatiebon
                    </p>
                    <p className="font-bold" style={{ color: '#08283B', fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        Kies de diagnose-route en noteer je oplossing.
                    </p>
                </div>

                {/* Route + repair note */}
                <div className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-3" data-qa="print-repair-route-panel">
                        {LAUNCH_CHOICES.map(choice => {
                            const Icon = choice.icon;
                            const selected = selectedRoute === choice.id;

                            return (
                                <button
                                    key={choice.id}
                                    type="button"
                                    onClick={() => setSelectedRoute(choice.id)}
                                    disabled={showFeedback}
                                    data-qa={`print-repair-route-${choice.id}`}
                                    aria-pressed={selected}
                                    className="rounded-2xl p-4 text-left transition-all duration-200 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#D97848]"
                                    style={{
                                        backgroundColor: selected ? 'rgba(217, 120, 72, 0.08)' : '#FFFFFF',
                                        border: `2px solid ${selected ? '#D97848' : '#E7D8BD'}`,
                                        opacity: showFeedback && !selected ? 0.55 : 1,
                                    }}
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <Icon size={22} style={{ color: selected ? '#D97848' : '#0B453F' }} />
                                        {selected && <Check size={16} style={{ color: '#5F947D' }} />}
                                    </div>
                                    <p className="mt-2 text-sm font-black" style={{ color: '#08283B', fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                        {choice.title}
                                    </p>
                                    <p className="mt-1 text-xs leading-snug" style={{ color: '#445865', fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                        {choice.prompt}
                                    </p>
                                </button>
                            );
                        })}
                    </div>

                    <div className="rounded-2xl border p-4" style={{ backgroundColor: '#FFFFFF', borderColor: '#E7D8BD' }}>
                        <label className="text-xs font-black uppercase tracking-widest" style={{ color: selectedRoute ? '#0B453F' : '#445865', fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            Wat zet je op de reparatiebon?
                        </label>
                        <p className="mt-2 rounded-xl px-3 py-2 text-xs font-semibold leading-snug" style={{ backgroundColor: '#FCF6EA', color: '#445865', border: '1px solid #E7D8BD', fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            Storingbewijs: {scenario.symptom}
                        </p>
                        <textarea
                            value={repairNote}
                            onChange={event => setRepairNote(event.target.value)}
                            disabled={!selectedRoute || showFeedback}
                            data-qa="print-repair-note"
                            placeholder={selectedRoute ? 'Bijv: Ik check eerst...' : 'Kies eerst een diagnose-route.'}
                            className="mt-3 w-full rounded-2xl border-2 p-3 text-sm leading-relaxed outline-none transition-all duration-300 resize-none disabled:cursor-not-allowed disabled:opacity-70"
                            style={{
                                minHeight: '96px',
                                backgroundColor: selectedRoute ? '#FCF6EA' : '#F7EFE1',
                                borderColor: '#E7D8BD',
                                color: '#08283B',
                                fontFamily: "'Outfit', system-ui, sans-serif",
                            }}
                        />
                        <div className="mt-3 flex items-center justify-between gap-3">
                            <span className="text-[10px] font-semibold" style={{ color: '#445865', fontFamily: "'Outfit', system-ui, sans-serif" }}>{repairNote.trim().length}/12 tekens minimaal</span>
                            <button
                                type="button"
                                onClick={handleSubmitRepair}
                                disabled={!selectedRoute || repairNote.trim().length < 12 || showFeedback}
                                data-qa="print-submit-repair"
                                className="rounded-full px-4 py-2 text-xs font-black uppercase tracking-wide transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#D97848]"
                                style={{
                                    backgroundColor: selectedRoute && repairNote.trim().length >= 12 && !showFeedback ? '#D97848' : '#E7D8BD',
                                    color: selectedRoute && repairNote.trim().length >= 12 && !showFeedback ? '#FFFFFF' : '#445865',
                                    fontFamily: "'Outfit', system-ui, sans-serif",
                                }}
                            >
                                Dien reparatiebon in
                            </button>
                        </div>
                    </div>
                </div>

                {/* Feedback actions */}
                {showFeedback && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        <div className="rounded-2xl p-4" style={{ backgroundColor: 'rgba(95, 148, 125, 0.06)', border: '1px solid rgba(95, 148, 125, 0.2)' }} data-qa="print-repair-feedback">
                            <div className="flex items-start gap-3">
                                <Lightbulb className="flex-shrink-0 mt-1" size={20} style={{ color: '#5F947D' }} />
                                <div>
                                    <p className="font-bold text-sm mb-1" style={{ color: routeIsCorrect ? '#5F947D' : '#D97848', fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                        {routeIsCorrect ? 'Route klopt' : 'Andere route was sterker'}
                                    </p>
                                    <p className="text-sm font-bold" style={{ color: '#08283B', fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                        Modeloplossing: {scenario.repairAction}
                                    </p>
                                    <p className="mt-2 text-sm" style={{ color: '#445865', fontFamily: "'Outfit', system-ui, sans-serif" }}>{scenario.explanation}</p>
                                    <p className="mt-2 text-sm" style={{ color: '#445865', fontFamily: "'Outfit', system-ui, sans-serif" }}>{scenario.tip}</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleNext}
                            className="w-full py-4 rounded-full font-black uppercase tracking-wide transition-all duration-300 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#D97848]"
                            style={{ backgroundColor: '#D97848', color: '#FFFFFF', fontFamily: "'Outfit', system-ui, sans-serif" }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#D97848')}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#D97848')}
                        >
                            {currentScenario < SCENARIOS.length - 1
                                ? <>Volgend probleem <ChevronRight size={20} /></>
                                : <>Bekijk resultaat <Trophy size={20} /></>}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PrintInstructiesMission;
