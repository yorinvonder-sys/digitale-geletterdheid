/**
 * PrintInstructiesMission.tsx
 *
 * "Print Troubleshooter" — leerlingen diagnosticeren printproblemen en kiezen
 * de juiste oplossing. 5 scenario's, multiple choice met feedback en retry.
 *
 * Bloom niveau 3 (toepassen): leerlingen passen kennis over printerinstellingen
 * toe op realistische probleemsituaties.
 *
 * SLO-doelen: Digitale basisvaardigheden, probleemoplossend denken
 */

import React, { useState } from 'react';
import { ArrowLeft, Printer, ChevronRight, Check, X, RotateCcw, Trophy, Sparkles, Lightbulb } from 'lucide-react';
import type { VsoProfile } from '../../types';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';

interface Props {
    onBack: () => void;
    onComplete: (success: boolean) => void;
    vsoProfile?: VsoProfile;
}

interface Option {
    id: string;
    text: string;
    isCorrect: boolean;
    feedback: string;
}

interface Scenario {
    id: number;
    emoji: string;
    title: string;
    description: string;
    visual: string;
    options: Option[];
    tip: string;
}

interface PrintTroubleshooterState {
    currentScenario: number;
    score: number;
    attemptsPerScenario: Record<number, number>;
    correctScenarios: number[];
    showIntro: boolean;
    showComplete: boolean;
}

const SCENARIOS: Scenario[] = [
    {
        id: 0,
        emoji: '🖨️',
        title: 'Mijn document print niet!',
        description: 'Je drukt op "Printen", maar er gebeurt niks. De printer reageert helemaal niet. Je ziet dat het WiFi-icoontje op de printer uit staat.',
        visual: 'wifi-off',
        options: [
            { id: 'a', text: 'Controleer de WiFi-verbinding van de printer', isCorrect: true, feedback: 'Goed gezien! Als het WiFi-icoontje uit staat, is de printer niet verbonden met het netwerk. Zonder verbinding kan je computer de printer niet bereiken.' },
            { id: 'b', text: 'Installeer de printer opnieuw op je computer', isCorrect: false, feedback: 'Dat is niet nodig. De printer was al eerder geinstalleerd — het probleem zit bij de verbinding, niet bij de installatie.' },
            { id: 'c', text: 'Vervang de inktcartridges', isCorrect: false, feedback: 'Inkt heeft niks te maken met het probleem. De printer reageert helemaal niet, dus het gaat om de verbinding.' },
        ],
        tip: 'Check altijd eerst of de printer verbonden is met WiFi of een kabel voordat je andere dingen probeert.',
    },
    {
        id: 1,
        emoji: '🎨',
        title: 'Het print alleen zwart-wit!',
        description: 'Je hebt een kleurrijke presentatie gemaakt, maar als je hem print komt alles er in zwart-wit uit. De printer heeft wel kleurenpatronen.',
        visual: 'grayscale',
        options: [
            { id: 'a', text: 'Koop een nieuwe kleurenprinter', isCorrect: false, feedback: 'De printer kan wel kleuren printen — het probleem zit in de instellingen, niet in de hardware.' },
            { id: 'b', text: 'Wijzig de printerinstellingen naar "Kleur" in plaats van "Grijswaarden"', isCorrect: true, feedback: 'Precies! In de printerinstellingen staat de kleuroptie waarschijnlijk op "Grijswaarden" of "Zwart-wit". Verander dit naar "Kleur" en je presentatie print in vol kleur.' },
            { id: 'c', text: 'Sla het bestand op als PDF en probeer opnieuw', isCorrect: false, feedback: 'Het bestandsformaat verandert de printerinstelling niet. Het probleem zit in de kleurinstelling van de printer zelf.' },
        ],
        tip: 'Kijk voor het printen altijd even bij "Printerinstellingen" of de juiste kleuroptie is geselecteerd.',
    },
    {
        id: 2,
        emoji: '📄',
        title: 'De tekst wordt afgesneden!',
        description: 'Je print een werkstuk, maar de rechterrand van de tekst valt steeds van de pagina af. Het lijkt alsof het papierformaat niet klopt.',
        visual: 'paper-size',
        options: [
            { id: 'a', text: 'Maak het lettertype kleiner', isCorrect: false, feedback: 'Dat lost het symptoom misschien deels op, maar het echte probleem is het papierformaat. Bij een ander document heb je dan weer hetzelfde probleem.' },
            { id: 'b', text: 'Print alles dubbelzijdig', isCorrect: false, feedback: 'Dubbelzijdig printen verandert niks aan de paginabreedte. De tekst wordt nog steeds afgesneden.' },
            { id: 'c', text: 'Wijzig het papierformaat van "Letter" naar "A4"', isCorrect: true, feedback: 'Klopt! "Letter" is het Amerikaanse formaat dat iets breder en korter is dan A4. In Nederland gebruiken we A4, dus je moet het papierformaat goed instellen.' },
        ],
        tip: 'In Nederland is A4 de standaard. Check bij afgeknipte tekst altijd of het papierformaat op A4 staat.',
    },
    {
        id: 3,
        emoji: '📚',
        title: 'Er komen 10 kopieën uit!',
        description: 'Je wilde 1 kopie printen van je huiswerk, maar de printer stopt niet. Er komen maar pagina\'s uit — je telt er al 10!',
        visual: 'copies',
        options: [
            { id: 'a', text: 'Trek de stekker uit de printer', isCorrect: false, feedback: 'Dat is een noodoplossing, maar geen slimme. Je verliest de printwachtrij en moet mogelijk de printer opnieuw opstarten. Beter: annuleer de opdracht.' },
            { id: 'b', text: 'Controleer het aantal exemplaren in de printerinstellingen', isCorrect: true, feedback: 'Goed gedacht! Iemand (of jijzelf per ongeluk) heeft het aantal kopieën op 10 gezet. Altijd even checken voordat je op "Printen" drukt.' },
            { id: 'c', text: 'De printer is kapot en moet gerepareerd worden', isCorrect: false, feedback: 'De printer doet precies wat er gevraagd is — 10 kopieën printen. Het probleem zit bij de instelling, niet bij de printer.' },
        ],
        tip: 'Check voor het printen ALTIJD het aantal kopieën. Standaard staat dit op 1, maar het kan per ongeluk veranderd zijn.',
    },
    {
        id: 4,
        emoji: '🔍',
        title: 'Het document past niet op 1 pagina!',
        description: 'Je wilt een overzichtelijke tabel printen op 1 pagina, maar hij wordt over 3 pagina\'s verdeeld. De tabel is niet eens zo groot.',
        visual: 'margins',
        options: [
            { id: 'a', text: 'Knip de tabel in 3 delen en print elk deel apart', isCorrect: false, feedback: 'Dat is veel werk en onnodig. Het probleem zit in de schaal of marges — niet in de tabel zelf.' },
            { id: 'b', text: 'Gebruik een grotere papiersoort (A3)', isCorrect: false, feedback: 'A3 is vaak niet beschikbaar op schoolprinters en ook niet nodig. Het probleem zit in de instellingen.' },
            { id: 'c', text: 'Pas de marges aan of zet de schaal op "Passend op 1 pagina"', isCorrect: true, feedback: 'Precies! Grote marges of een te hoge schaal (bijv. 150%) zorgen ervoor dat de inhoud niet past. Met "Passend op 1 pagina" schaalt de printer het automatisch.' },
        ],
        tip: 'De optie "Passend op 1 pagina" of "Fit to Page" is je beste vriend bij tabellen en overzichten.',
    },
];

const PrinterVisual: React.FC<{ scenario: Scenario; showCorrect: boolean }> = ({ scenario, showCorrect }) => {
    const borderColor = showCorrect ? '#10B981' : '#E8E6DF';

    return (
        <div className="rounded-2xl p-5 mx-auto max-w-xs" style={{ backgroundColor: '#FFFFFF', border: `2px solid ${borderColor}` }}>
            <div className="text-center mb-3">
                <span className="text-5xl">{scenario.emoji}</span>
            </div>
            <div className="rounded-xl p-3" style={{ backgroundColor: '#FAF9F0', border: '1px solid #E8E6DF' }}>
                {scenario.visual === 'wifi-off' && (
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2">
                            <Printer size={24} style={{ color: '#6B6B66' }} />
                            <span className="text-xs font-bold line-through" style={{ color: '#EF4444', fontFamily: "'Outfit', system-ui, sans-serif" }}>WiFi</span>
                        </div>
                        <div className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            Geen verbinding
                        </div>
                    </div>
                )}
                {scenario.visual === 'grayscale' && (
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex gap-1">
                            <div className="w-6 h-6 rounded bg-gray-800" />
                            <div className="w-6 h-6 rounded bg-gray-500" />
                            <div className="w-6 h-6 rounded bg-gray-300" />
                        </div>
                        <div className="text-[10px] font-bold" style={{ color: '#6B6B66', fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            Alleen grijstinten...
                        </div>
                    </div>
                )}
                {scenario.visual === 'paper-size' && (
                    <div className="flex items-end justify-center gap-3">
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-10 rounded border-2" style={{ borderColor: '#EF4444' }} />
                            <span className="text-[9px] mt-1 font-bold" style={{ color: '#EF4444', fontFamily: "'Outfit', system-ui, sans-serif" }}>Letter</span>
                        </div>
                        <span className="text-xs font-bold mb-3" style={{ color: '#6B6B66' }}>→</span>
                        <div className="flex flex-col items-center">
                            <div className="w-7 h-11 rounded border-2" style={{ borderColor: '#10B981' }} />
                            <span className="text-[9px] mt-1 font-bold" style={{ color: '#10B981', fontFamily: "'Outfit', system-ui, sans-serif" }}>A4</span>
                        </div>
                    </div>
                )}
                {scenario.visual === 'copies' && (
                    <div className="flex flex-col items-center gap-1">
                        <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="w-4 h-5 rounded-sm bg-white border" style={{ borderColor: '#D97757', marginLeft: i > 0 ? '-2px' : '0' }} />
                            ))}
                        </div>
                        <div className="text-[10px] font-bold" style={{ color: '#D97757', fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            Kopieën: 10 !!
                        </div>
                    </div>
                )}
                {scenario.visual === 'margins' && (
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-12 h-14 rounded border-2 relative" style={{ borderColor: '#D97757' }}>
                            <div className="absolute inset-2 border border-dashed rounded-sm" style={{ borderColor: '#6B6B66' }}>
                                <div className="text-[6px] text-center mt-1" style={{ color: '#6B6B66' }}>tabel</div>
                            </div>
                        </div>
                        <div className="text-[10px] font-bold" style={{ color: '#D97757', fontFamily: "'Outfit', system-ui, sans-serif" }}>
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
        }
    );

    const { currentScenario, score, attemptsPerScenario, correctScenarios, showIntro, showComplete } = state;

    // Transient UI state — niet opgeslagen
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);

    const scenario = SCENARIOS[currentScenario];
    const currentAttempts = attemptsPerScenario[currentScenario] || 0;
    const isCorrect = selectedAnswer ? scenario.options.find(o => o.id === selectedAnswer)?.isCorrect : false;
    const canRetry = showFeedback && !isCorrect && currentAttempts < 2;

    const handleAnswer = (optionId: string) => {
        if (showFeedback) return;
        setSelectedAnswer(optionId);
        setShowFeedback(true);

        const option = scenario.options.find(o => o.id === optionId);
        const attempts = (attemptsPerScenario[currentScenario] || 0) + 1;

        setState(prev => ({
            ...prev,
            attemptsPerScenario: { ...prev.attemptsPerScenario, [currentScenario]: attempts },
        }));

        if (option?.isCorrect) {
            // Eerste poging: 20 punten, tweede poging: 10 punten
            const points = attempts === 1 ? 20 : 10;
            setState(prev => ({
                ...prev,
                score: prev.score + points,
                correctScenarios: [...prev.correctScenarios, currentScenario],
            }));
        }
    };

    const handleRetry = () => {
        setSelectedAnswer(null);
        setShowFeedback(false);
    };

    const handleNext = () => {
        setSelectedAnswer(null);
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
            <div className="min-h-screen overflow-y-auto" style={{ backgroundColor: '#FAF9F0' }}>
                <div className="min-h-full flex items-center justify-center p-4">
                    <div className="max-w-lg w-full text-center space-y-8">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 transition-all duration-300 font-bold text-sm uppercase tracking-widest mx-auto"
                            style={{ color: '#6B6B66', fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            <ArrowLeft size={16} /> Terug
                        </button>

                        <div className="relative inline-block">
                            <div className="absolute inset-0 blur-3xl rounded-full animate-pulse" style={{ backgroundColor: 'rgba(217, 119, 87, 0.2)' }} />
                            <div className="relative w-32 h-32 rounded-3xl flex items-center justify-center shadow-2xl" style={{ background: 'linear-gradient(to bottom right, #D97757, #C46849)' }}>
                                <Printer size={64} className="text-white" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-4xl font-black" style={{ fontFamily: "'Newsreader', Georgia, serif", color: '#1A1A19' }}>
                                Print Troubleshooter
                            </h1>
                            <p className="text-lg" style={{ fontFamily: "'Outfit', system-ui, sans-serif", color: '#3D3D38' }}>
                                Er gaat van alles mis met de printer! Kun jij elk probleem oplossen?
                            </p>
                            <p className="text-sm font-semibold" style={{ fontFamily: "'Outfit', system-ui, sans-serif", color: '#6B6B66' }}>
                                5 printproblemen — diagnosticeer het probleem en kies de juiste oplossing
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="rounded-2xl p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E6DF' }}>
                                <span className="text-2xl block mb-2">🔍</span>
                                <p className="font-bold text-sm" style={{ color: '#1A1A19', fontFamily: "'Outfit', system-ui, sans-serif" }}>Diagnose</p>
                            </div>
                            <div className="rounded-2xl p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E6DF' }}>
                                <span className="text-2xl block mb-2">🛠️</span>
                                <p className="font-bold text-sm" style={{ color: '#1A1A19', fontFamily: "'Outfit', system-ui, sans-serif" }}>Oplossen</p>
                            </div>
                            <div className="rounded-2xl p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E6DF' }}>
                                <span className="text-2xl block mb-2">💡</span>
                                <p className="font-bold text-sm" style={{ color: '#1A1A19', fontFamily: "'Outfit', system-ui, sans-serif" }}>Onthouden</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setState(prev => ({ ...prev, showIntro: false }))}
                            className="w-full py-4 text-white rounded-full font-black uppercase tracking-wide transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#D97757]"
                            style={{ backgroundColor: '#D97757', fontFamily: "'Outfit', system-ui, sans-serif" }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#C46849')}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#D97757')}
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
            <div className="min-h-screen overflow-y-auto" style={{ backgroundColor: '#FAF9F0' }}>
                <div className="min-h-full flex items-center justify-center p-4">
                    <div className="max-w-lg w-full text-center space-y-8">
                        <div className="relative inline-block">
                            <div className="absolute inset-0 blur-3xl rounded-full animate-pulse" style={{ backgroundColor: allCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(217, 119, 87, 0.2)' }} />
                            <div className="relative w-32 h-32 rounded-3xl flex items-center justify-center shadow-2xl animate-bounce" style={{ background: allCorrect ? 'linear-gradient(to bottom right, #10B981, #2A9D8F)' : 'linear-gradient(to bottom right, #D97757, #C46849)' }}>
                                {allCorrect ? <Trophy size={64} className="text-white" /> : <Sparkles size={64} className="text-white" />}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-4xl font-black" style={{ fontFamily: "'Newsreader', Georgia, serif", color: '#1A1A19' }}>
                                {allCorrect ? 'Print Expert!' : 'Missie Voltooid!'}
                            </h1>
                            <p className="text-lg" style={{ fontFamily: "'Outfit', system-ui, sans-serif", color: '#3D3D38' }}>
                                {allCorrect
                                    ? 'Alle printproblemen opgelost — je bent een echte troubleshooter!'
                                    : 'Je hebt alle scenario\'s doorlopen. Bekijk de tips hieronder om het te onthouden.'}
                            </p>
                        </div>

                        <div className="rounded-2xl p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E6DF' }}>
                            <div className="flex justify-around">
                                <div>
                                    <p className="text-3xl font-black" style={{ color: '#10B981' }}>{correctScenarios.length}/{SCENARIOS.length}</p>
                                    <p className="text-sm" style={{ color: '#6B6B66', fontFamily: "'Outfit', system-ui, sans-serif" }}>Opgelost</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-black" style={{ color: '#D97757' }}>{score}/{maxScore}</p>
                                    <p className="text-sm" style={{ color: '#6B6B66', fontFamily: "'Outfit', system-ui, sans-serif" }}>Punten</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-black" style={{ color: '#2A9D8F' }}>{percentage}%</p>
                                    <p className="text-sm" style={{ color: '#6B6B66', fontFamily: "'Outfit', system-ui, sans-serif" }}>Score</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl p-6 text-left" style={{ backgroundColor: 'rgba(42, 157, 143, 0.06)', border: '1px solid rgba(42, 157, 143, 0.2)' }}>
                            <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: '#2A9D8F', fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                <Lightbulb size={20} /> Tips om te onthouden
                            </h3>
                            <ul className="space-y-2">
                                {SCENARIOS.map((s, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <span className="text-sm flex-shrink-0">{s.emoji}</span>
                                        <span className="text-sm" style={{ color: '#3D3D38', fontFamily: "'Outfit', system-ui, sans-serif" }}>{s.tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button
                            onClick={() => { clearSave(); onComplete(true); }}
                            className="w-full py-4 text-white rounded-full font-black uppercase tracking-wide transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#D97757]"
                            style={{ backgroundColor: '#D97757', fontFamily: "'Outfit', system-ui, sans-serif" }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#C46849')}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#D97757')}
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
        <div className="min-h-screen" style={{ backgroundColor: '#FAF9F0' }}>
            {/* Header */}
            <div className="sticky top-0 z-20 backdrop-blur-md" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderBottom: '1px solid #E8E6DF' }}>
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="p-2 transition-colors"
                        style={{ color: '#6B6B66' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#1A1A19')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#6B6B66')}
                    >
                        <ArrowLeft size={24} />
                    </button>

                    <div className="flex items-center gap-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold" style={{
                            backgroundColor: 'rgba(217, 119, 87, 0.1)',
                            color: '#D97757',
                            border: '1px solid rgba(217, 119, 87, 0.2)',
                            fontFamily: "'Outfit', system-ui, sans-serif",
                        }}>
                            Scenario {currentScenario + 1}/{SCENARIOS.length}
                        </span>

                        <div className="flex items-center gap-1 px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(42, 157, 143, 0.1)', border: '1px solid rgba(42, 157, 143, 0.2)' }}>
                            <Printer size={14} style={{ color: '#2A9D8F' }} />
                            <span className="font-bold text-sm" style={{ color: '#2A9D8F', fontFamily: "'Outfit', system-ui, sans-serif" }}>{score} pts</span>
                        </div>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="h-1.5" style={{ backgroundColor: '#F0EEE8' }}>
                    <div
                        className="h-full transition-all duration-500"
                        style={{
                            width: `${((currentScenario + (showFeedback && isCorrect ? 1 : 0)) / SCENARIOS.length) * 100}%`,
                            background: 'linear-gradient(to right, #D97757, #C46849)',
                        }}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
                {/* Scenario card */}
                <div className="rounded-2xl p-5" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E6DF' }}>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl">{scenario.emoji}</span>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#D97757', fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                Probleem {currentScenario + 1}
                            </span>
                            <h2 className="text-xl font-black" style={{ fontFamily: "'Newsreader', Georgia, serif", color: '#1A1A19' }}>
                                {scenario.title}
                            </h2>
                        </div>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: '#3D3D38', fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        {scenario.description}
                    </p>
                </div>

                {/* Visual */}
                <PrinterVisual scenario={scenario} showCorrect={showFeedback && !!isCorrect} />

                {/* Question */}
                <div className="rounded-2xl p-4 text-center" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E6DF' }}>
                    <p className="font-bold" style={{ color: '#1A1A19', fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        Wat is de juiste oplossing?
                    </p>
                    {currentAttempts === 1 && !isCorrect && showFeedback && (
                        <p className="text-xs mt-1" style={{ color: '#D97757', fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            Nog 1 poging over
                        </p>
                    )}
                </div>

                {/* Options */}
                <div className="space-y-3">
                    {scenario.options.map((option) => {
                        const isSelected = selectedAnswer === option.id;
                        const showResult = showFeedback && isSelected;

                        return (
                            <button
                                key={option.id}
                                onClick={() => handleAnswer(option.id)}
                                disabled={showFeedback}
                                className="w-full p-4 rounded-2xl text-left transition-all duration-300"
                                style={{
                                    backgroundColor: showResult
                                        ? option.isCorrect ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)'
                                        : '#FFFFFF',
                                    border: `2px solid ${showResult
                                        ? option.isCorrect ? '#10B981' : '#EF4444'
                                        : '#E8E6DF'}`,
                                    opacity: showFeedback && !isSelected ? 0.4 : 1,
                                }}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{
                                        backgroundColor: showResult
                                            ? option.isCorrect ? '#10B981' : '#EF4444'
                                            : '#F0EEE8',
                                    }}>
                                        {showResult ? (
                                            option.isCorrect ? <Check size={16} className="text-white" /> : <X size={16} className="text-white" />
                                        ) : (
                                            <span className="font-bold text-sm" style={{ color: '#6B6B66', fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                                {option.id.toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium" style={{ color: '#1A1A19', fontFamily: "'Outfit', system-ui, sans-serif" }}>{option.text}</p>
                                        {showResult && (
                                            <p className="text-sm mt-2" style={{ color: option.isCorrect ? '#10B981' : '#EF4444', fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                                {option.feedback}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Feedback actions */}
                {showFeedback && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        {/* Tip bij correct antwoord */}
                        {isCorrect && (
                            <div className="rounded-2xl p-4" style={{ backgroundColor: 'rgba(42, 157, 143, 0.06)', border: '1px solid rgba(42, 157, 143, 0.2)' }}>
                                <div className="flex items-start gap-3">
                                    <Lightbulb className="flex-shrink-0 mt-1" size={20} style={{ color: '#2A9D8F' }} />
                                    <div>
                                        <p className="font-bold text-sm mb-1" style={{ color: '#2A9D8F', fontFamily: "'Outfit', system-ui, sans-serif" }}>Tip om te onthouden</p>
                                        <p className="text-sm" style={{ color: '#3D3D38', fontFamily: "'Outfit', system-ui, sans-serif" }}>{scenario.tip}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Retry of Volgende */}
                        {canRetry ? (
                            <button
                                onClick={handleRetry}
                                className="w-full py-4 rounded-full font-black uppercase tracking-wide transition-all duration-300 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#D97757]"
                                style={{ backgroundColor: '#D97757', color: '#FFFFFF', fontFamily: "'Outfit', system-ui, sans-serif" }}
                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#C46849')}
                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#D97757')}
                            >
                                <RotateCcw size={18} /> Probeer opnieuw
                            </button>
                        ) : (
                            <>
                                {/* Toon tip ook bij fout na alle pogingen */}
                                {!isCorrect && (
                                    <div className="rounded-2xl p-4" style={{ backgroundColor: 'rgba(42, 157, 143, 0.06)', border: '1px solid rgba(42, 157, 143, 0.2)' }}>
                                        <div className="flex items-start gap-3">
                                            <Lightbulb className="flex-shrink-0 mt-1" size={20} style={{ color: '#2A9D8F' }} />
                                            <div>
                                                <p className="font-bold text-sm mb-1" style={{ color: '#2A9D8F', fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                                    Het juiste antwoord was: {scenario.options.find(o => o.isCorrect)?.text}
                                                </p>
                                                <p className="text-sm" style={{ color: '#3D3D38', fontFamily: "'Outfit', system-ui, sans-serif" }}>{scenario.tip}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <button
                                    onClick={handleNext}
                                    className="w-full py-4 rounded-full font-black uppercase tracking-wide transition-all duration-300 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#D97757]"
                                    style={{ backgroundColor: '#D97757', color: '#FFFFFF', fontFamily: "'Outfit', system-ui, sans-serif" }}
                                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#C46849')}
                                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#D97757')}
                                >
                                    {currentScenario < SCENARIOS.length - 1
                                        ? <>Volgend probleem <ChevronRight size={20} /></>
                                        : <>Bekijk resultaat <Trophy size={20} /></>}
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PrintInstructiesMission;
