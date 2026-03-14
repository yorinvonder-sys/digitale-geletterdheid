import React, { useState } from 'react';
import { ArrowLeft, Trophy, ChevronRight, Check, X, AlertTriangle, Clock, Users, Shield, FileText, Sparkles } from 'lucide-react';

interface Props {
    onBack: () => void;
    onComplete: (success: boolean) => void;
    stats?: any;
    vsoProfile?: any;
}

interface Scenario {
    title: string;
    emoji: string;
    description: string;
    details: string[];
    actions: { text: string; correct: boolean; feedback: string }[];
}

const SCENARIOS: Scenario[] = [
    {
        title: 'Het lek wordt ontdekt',
        emoji: '🚨',
        description: 'Maandagochtend 08:00. De ICT-beheerder van school ontdekt dat het leerlingvolgsysteem is gehackt. Alle namen, e-mails, cijfers en BSN-nummers van 800 leerlingen liggen op straat.',
        details: ['800 leerlingen getroffen', 'BSN-nummers gelekt', 'Cijfers en rapporten openbaar', 'Hack via zwak wachtwoord'],
        actions: [
            { text: 'Direct alle wachtwoorden resetten en het lek dichten', correct: true, feedback: 'Goed! Eerste stap: stop het lek. Reset alle wachtwoorden en sluit de kwetsbaarheid.' },
            { text: 'Eerst uitzoeken wie het heeft gedaan', correct: false, feedback: 'De dader zoeken is belangrijk, maar EERST moet je het lek dichten. Elke minuut lekt er meer data.' },
            { text: 'Niks doen, misschien valt het mee', correct: false, feedback: 'Bij een datalek met BSN-nummers is niks doen NOOIT een optie. Dit is wettelijk verplicht te melden!' },
            { text: 'De school sluiten tot het opgelost is', correct: false, feedback: 'Dat is overdreven. Het digitale systeem moet afgesloten worden, niet de fysieke school.' }
        ]
    },
    {
        title: 'Wie moet je informeren?',
        emoji: '📢',
        description: 'Het lek is gedicht. Nu moet je beslissen wie je informeert. Bij een datalek met BSN-nummers heb je 72 uur om te melden bij de Autoriteit Persoonsgegevens (AP).',
        details: ['Meldplicht: 72 uur', 'BSN = hoog risico', 'Betrokkenen informeren', 'Documentatie vereist'],
        actions: [
            { text: 'Melden bij de AP + alle ouders/leerlingen informeren', correct: true, feedback: 'Correct! Bij hoog risico (BSN-nummers) MOET je: 1) AP melden binnen 72 uur, 2) betrokkenen direct informeren.' },
            { text: 'Alleen de AP melden, ouders hoeven het niet te weten', correct: false, feedback: 'Bij hoog risico (zoals BSN-nummers) ben je verplicht OOK de betrokkenen te informeren. Dat staat in de AVG.' },
            { text: 'Alleen ouders informeren, de AP hoeft het niet te weten', correct: false, feedback: 'De AP-melding is wettelijk verplicht bij een datalek van deze omvang. Beide zijn nodig!' },
            { text: 'Niemand informeren, dat veroorzaakt alleen maar paniek', correct: false, feedback: 'Niet melden is een overtreding van de AVG en kan leiden tot boetes tot 20 miljoen!' }
        ]
    },
    {
        title: 'Het communicatieplan',
        emoji: '✉️',
        description: 'Je moet een bericht sturen naar alle ouders en leerlingen. Wat moet er in staan?',
        details: ['Eerlijk en transparant', 'Concrete acties', 'Contactgegevens helpdesk', 'Geen paniekzaaierij'],
        actions: [
            { text: 'Wat er is gebeurd + welke data is gelekt + wat school doet + wat ouders zelf kunnen doen', correct: true, feedback: 'Perfect! Een goed bericht bevat: WAT (is er gebeurd), WELKE data, WAT de school doet, en WAT ouders/leerlingen zelf kunnen doen (bijv. BSN-fraude check).' },
            { text: 'Alleen zeggen "er was een klein probleempje maar het is opgelost"', correct: false, feedback: 'Dit is niet transparant genoeg. Betrokkenen hebben recht op VOLLEDIGE informatie over welke data is gelekt, zodat ze zichzelf kunnen beschermen.' },
            { text: 'Een technisch rapport sturen met alle details van de hack', correct: false, feedback: 'Te technisch. Ouders moeten begrijpen wat het voor HEN betekent, niet hoe de SQL-injectie werkte.' },
            { text: 'Wachten tot ouders zelf vragen stellen', correct: false, feedback: 'Proactief communiceren is verplicht en bouwt vertrouwen. Wachten maakt het erger.' }
        ]
    },
    {
        title: 'Het noodplan',
        emoji: '📋',
        description: 'De directeur vraagt je om een Datalekken Noodplan te maken zodat de school in de toekomst voorbereid is. Welke stap hoort er NIET in een noodplan?',
        details: ['Preventie', 'Detectie', 'Respons', 'Herstel'],
        actions: [
            { text: 'Alle leerlingdata op papier bewaren in plaats van digitaal', correct: false, feedback: 'Maar dit is WEL het foute antwoord — en dus de juiste keuze hier! Papier is NIET veiliger dan digitaal. Een goed noodplan gaat over betere beveiliging, niet over terug naar papier.' },
            { text: 'Tweefactorauthenticatie installeren op alle systemen', correct: true, feedback: 'Dit hoort er zeker in! 2FA is een van de beste manieren om accounts te beschermen.' },
            { text: 'Een vast contactpersoon aanwijzen voor datalekken', correct: true, feedback: 'Correct! Een Functionaris Gegevensbescherming (FG) of vast aanspreekpunt is essentieel.' },
            { text: 'Regelmatig personeel trainen in cyberveiligheid', correct: true, feedback: 'Absoluut! De meeste hacks komen door menselijke fouten. Training is cruciaal.' }
        ]
    }
];

export const DatalekkenRampenplanMission: React.FC<Props> = ({ onBack, onComplete }) => {
    const [phase, setPhase] = useState<'intro' | 'scenarios' | 'results'>('intro');
    const [currentScenario, setCurrentScenario] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAction, setSelectedAction] = useState<number | null>(null);
    const [answers, setAnswers] = useState<boolean[]>([]);

    const handleAction = (index: number) => {
        if (selectedAction !== null) return;
        setSelectedAction(index);
        const scenario = SCENARIOS[currentScenario];
        // For scenario 4 (noodplan), the "wrong" answer (index 0) is actually the correct choice
        const isCorrect = currentScenario === 3 ? index === 0 : scenario.actions[index].correct;
        if (isCorrect) setScore(s => s + 25);
        setAnswers(prev => [...prev, isCorrect]);
    };

    const nextScenario = () => {
        setSelectedAction(null);
        if (currentScenario < SCENARIOS.length - 1) setCurrentScenario(c => c + 1);
        else setPhase('results');
    };

    const getBadge = () => {
        if (score >= 75) return { emoji: '🛡️', title: 'Crisis Commander', color: 'from-[#10B981] to-[#2A9D8F]' };
        if (score >= 50) return { emoji: '📋', title: 'Noodplan Specialist', color: 'from-[#2A9D8F] to-[#D97757]' };
        return { emoji: '🔰', title: 'Crisis Trainee', color: 'from-[#D97757] to-[#C46849]' };
    };

    if (phase === 'intro') {
        return (
            <div className="min-h-screen bg-[#FAF9F0] text-[#1A1A19] overflow-y-auto p-4 pb-safe">
                <button onClick={onBack} className="flex items-center gap-2 text-[#6B6B66] hover:text-[#1A1A19] transition-all duration-300 mb-6"><ArrowLeft size={18} /> <span className="text-sm font-bold" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Terug</span></button>
                <div className="max-w-lg mx-auto text-center space-y-6">
                    <div className="w-20 h-20 bg-[#D97757]/10 rounded-3xl flex items-center justify-center mx-auto border border-[#D97757]/20 animate-pulse"><span className="text-4xl">🚨</span></div>
                    <h1 className="text-3xl font-black" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>Datalekken Rampenplan</h1>
                    <p className="text-[#3D3D38] text-sm leading-relaxed max-w-sm mx-auto" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        <span className="text-[#D97757] font-bold">BREAKING:</span> De school is gehackt! 800 leerlinggegevens liggen op straat. Kun jij de crisis managen?
                    </p>
                    <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
                        {[{ icon: <AlertTriangle size={16} />, label: '800 leerlingen' }, { icon: <Clock size={16} />, label: '72 uur deadline' }, { icon: <Users size={16} />, label: 'BSN gelekt' }, { icon: <Shield size={16} />, label: 'AVG meldplicht' }].map((item, i) => (
                            <div key={i} className="bg-white border border-[#E8E6DF] rounded-2xl p-3 flex items-center gap-2">
                                <div className="text-[#D97757]">{item.icon}</div>
                                <span className="text-xs font-bold text-[#3D3D38]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{item.label}</span>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => setPhase('scenarios')} className="px-8 py-4 bg-[#D97757] hover:bg-[#C46849] text-white rounded-full font-black text-lg transition-all duration-300 active:scale-95 shadow-xl shadow-[#D97757]/30 focus-visible:ring-2 focus-visible:ring-[#D97757]">Start de crisis →</button>
                </div>
            </div>
        );
    }

    if (phase === 'scenarios') {
        const scenario = SCENARIOS[currentScenario];
        return (
            <div className="min-h-screen bg-[#FAF9F0] text-[#1A1A19] overflow-y-auto p-4 pb-safe">
                <div className="max-w-lg mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <button onClick={() => currentScenario === 0 ? setPhase('intro') : setCurrentScenario(c => c - 1)} className="text-[#6B6B66] hover:text-[#1A1A19] transition-all duration-300"><ArrowLeft size={18} /></button>
                        <div className="flex gap-1.5">{SCENARIOS.map((_, i) => (<div key={i} className={`w-8 h-1.5 rounded-full transition-all duration-300 ${i < currentScenario ? 'bg-[#10B981]' : i === currentScenario ? 'bg-gradient-to-r from-[#D97757] to-[#C46849]' : 'bg-[#E8E6DF]'}`} />))}</div>
                        <div className="bg-[#D97757]/10 px-3 py-1 rounded-full border border-[#D97757]/20"><span className="text-xs font-black text-[#D97757]">{score} pts</span></div>
                    </div>

                    <div className="bg-white rounded-2xl border border-[#E8E6DF] p-5 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">{scenario.emoji}</span>
                            <div>
                                <span className="text-[10px] font-black text-[#D97757] uppercase tracking-widest" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Fase {currentScenario + 1}/{SCENARIOS.length}</span>
                                <h3 className="text-lg font-black text-[#1A1A19]" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>{scenario.title}</h3>
                            </div>
                        </div>
                        <p className="text-sm text-[#3D3D38] leading-relaxed mb-4" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{scenario.description}</p>
                        <div className="flex flex-wrap gap-2">
                            {scenario.details.map((d, i) => (
                                <span key={i} className="inline-flex text-[10px] bg-[#FAF9F0] border border-[#E8E6DF] px-2 py-1 rounded-full text-[#6B6B66]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{d}</span>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        {scenario.actions.map((action, i) => {
                            const isSelected = selectedAction === i;
                            const done = selectedAction !== null;
                            let bg = 'bg-white border-[#E8E6DF] hover:border-[#D97757]/40';
                            if (done && isSelected) {
                                const isCorrect = currentScenario === 3 ? i === 0 : action.correct;
                                bg = isCorrect ? 'bg-[#10B981]/5 border-[#10B981]' : 'bg-red-50 border-red-400';
                            } else if (done) {
                                bg = 'bg-[#F0EEE8] border-[#F0EEE8] opacity-40';
                            }
                            return (
                                <button key={i} onClick={() => handleAction(i)} disabled={done} className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-300 ${bg}`}>
                                    <span className="text-sm text-[#3D3D38]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{action.text}</span>
                                    {done && isSelected && <p className="text-xs mt-2 text-[#6B6B66]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{action.feedback}</p>}
                                </button>
                            );
                        })}
                    </div>

                    {selectedAction !== null && (
                        <button onClick={nextScenario} className="w-full mt-6 py-3 bg-[#D97757] hover:bg-[#C46849] text-white rounded-full font-black text-sm flex items-center justify-center gap-2 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#D97757]">
                            {currentScenario < SCENARIOS.length - 1 ? <>Volgende fase <ChevronRight size={16} /></> : <>Bekijk resultaat <Trophy size={16} /></>}
                        </button>
                    )}
                </div>
            </div>
        );
    }

    const badge = getBadge();
    return (
        <div className="min-h-screen bg-[#FAF9F0] text-[#1A1A19] overflow-y-auto">
            <div className="min-h-full flex items-center justify-center p-4 pb-safe">
            <div className="max-w-sm w-full text-center space-y-6">
                <div className={`w-24 h-24 mx-auto bg-gradient-to-br ${badge.color} rounded-3xl flex items-center justify-center shadow-2xl`}><span className="text-5xl">{badge.emoji}</span></div>
                <h1 className="text-2xl font-black" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>{badge.title}</h1>
                <p className="text-[#6B6B66] text-sm" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{answers.filter(a => a).length}/{SCENARIOS.length} fases correct</p>
                <div className="bg-white rounded-2xl p-4 border border-[#E8E6DF]">
                    <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#D97757] to-[#C46849]">{score}/100</div>
                    <p className="text-[#6B6B66] text-xs mt-1" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Crisis Score</p>
                </div>
                <div className="bg-white rounded-2xl p-4 text-left space-y-2 border border-[#E8E6DF]">
                    <p className="text-xs font-bold text-[#3D3D38] mb-2" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Jouw Noodplan samenvatting:</p>
                    <p className="text-xs text-[#6B6B66]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>1. STOP het lek — dicht de kwetsbaarheid direct</p>
                    <p className="text-xs text-[#6B6B66]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>2. MELD bij AP binnen 72 uur + informeer betrokkenen</p>
                    <p className="text-xs text-[#6B6B66]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>3. COMMUNICEER eerlijk, transparant en concreet</p>
                    <p className="text-xs text-[#6B6B66]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>4. VOORKOM met 2FA, training en een vast aanspreekpunt</p>
                </div>
                <button onClick={() => onComplete(true)} className="w-full py-4 bg-[#10B981] hover:bg-[#059669] text-white rounded-full font-black text-lg transition-all duration-300 active:scale-95 shadow-xl flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#10B981]"><Trophy size={20} /> Missie Voltooid!</button>
            </div>
            </div>
        </div>
    );
};
