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
            { text: 'Direct alle wachtwoorden resetten en het lek dichten', correct: true, feedback: '✅ Goed! Eerste stap: stop het lek. Reset alle wachtwoorden en sluit de kwetsbaarheid.' },
            { text: 'Eerst uitzoeken wie het heeft gedaan', correct: false, feedback: '❌ De dader zoeken is belangrijk, maar EERST moet je het lek dichten. Elke minuut lekt er meer data.' },
            { text: 'Niks doen, misschien valt het mee', correct: false, feedback: '❌ Bij een datalek met BSN-nummers is niks doen NOOIT een optie. Dit is wettelijk verplicht te melden!' },
            { text: 'De school sluiten tot het opgelost is', correct: false, feedback: '❌ Dat is overdreven. Het digitale systeem moet afgesloten worden, niet de fysieke school.' }
        ]
    },
    {
        title: 'Wie moet je informeren?',
        emoji: '📢',
        description: 'Het lek is gedicht. Nu moet je beslissen wie je informeert. Bij een datalek met BSN-nummers heb je 72 uur om te melden bij de Autoriteit Persoonsgegevens (AP).',
        details: ['Meldplicht: 72 uur', 'BSN = hoog risico', 'Betrokkenen informeren', 'Documentatie vereist'],
        actions: [
            { text: 'Melden bij de AP + alle ouders/leerlingen informeren', correct: true, feedback: '✅ Correct! Bij hoog risico (BSN-nummers) MOET je: 1) AP melden binnen 72 uur, 2) betrokkenen direct informeren.' },
            { text: 'Alleen de AP melden, ouders hoeven het niet te weten', correct: false, feedback: '❌ Bij hoog risico (zoals BSN-nummers) ben je verplicht OOK de betrokkenen te informeren. Dat staat in de AVG.' },
            { text: 'Alleen ouders informeren, de AP hoeft het niet te weten', correct: false, feedback: '❌ De AP-melding is wettelijk verplicht bij een datalek van deze omvang. Beide zijn nodig!' },
            { text: 'Niemand informeren, dat veroorzaakt alleen maar paniek', correct: false, feedback: '❌ Niet melden is een overtreding van de AVG en kan leiden tot boetes tot €20 miljoen!' }
        ]
    },
    {
        title: 'Het communicatieplan',
        emoji: '✉️',
        description: 'Je moet een bericht sturen naar alle ouders en leerlingen. Wat moet er in staan?',
        details: ['Eerlijk en transparant', 'Concrete acties', 'Contactgegevens helpdesk', 'Geen paniekzaaierij'],
        actions: [
            { text: 'Wat er is gebeurd + welke data is gelekt + wat school doet + wat ouders zelf kunnen doen', correct: true, feedback: '✅ Perfect! Een goed bericht bevat: WAT (is er gebeurd), WELKE data, WAT de school doet, en WAT ouders/leerlingen zelf kunnen doen (bijv. BSN-fraude check).' },
            { text: 'Alleen zeggen "er was een klein probleempje maar het is opgelost"', correct: false, feedback: '❌ Dit is niet transparant genoeg. Betrokkenen hebben recht op VOLLEDIGE informatie over welke data is gelekt, zodat ze zichzelf kunnen beschermen.' },
            { text: 'Een technisch rapport sturen met alle details van de hack', correct: false, feedback: '❌ Te technisch. Ouders moeten begrijpen wat het voor HEN betekent, niet hoe de SQL-injectie werkte.' },
            { text: 'Wachten tot ouders zelf vragen stellen', correct: false, feedback: '❌ Proactief communiceren is verplicht en bouwt vertrouwen. Wachten maakt het erger.' }
        ]
    },
    {
        title: 'Het noodplan',
        emoji: '📋',
        description: 'De directeur vraagt je om een Datalekken Noodplan te maken zodat de school in de toekomst voorbereid is. Welke stap hoort er NIET in een noodplan?',
        details: ['Preventie', 'Detectie', 'Respons', 'Herstel'],
        actions: [
            { text: 'Alle leerlingdata op papier bewaren in plaats van digitaal', correct: false, feedback: '❌ Maar dit is WEL het foute antwoord — en dus de juiste keuze hier! Papier is NIET veiliger dan digitaal. Een goed noodplan gaat over betere beveiliging, niet over terug naar papier.' },
            { text: 'Tweefactorauthenticatie installeren op alle systemen', correct: true, feedback: '✅ Dit hoort er zeker in! 2FA is een van de beste manieren om accounts te beschermen.' },
            { text: 'Een vast contactpersoon aanwijzen voor datalekken', correct: true, feedback: '✅ Correct! Een Functionaris Gegevensbescherming (FG) of vast aanspreekpunt is essentieel.' },
            { text: 'Regelmatig personeel trainen in cyberveiligheid', correct: true, feedback: '✅ Absoluut! De meeste hacks komen door menselijke fouten. Training is cruciaal.' }
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
        if (score >= 75) return { emoji: '🛡️', title: 'Crisis Commander', color: 'from-emerald-500 to-teal-600' };
        if (score >= 50) return { emoji: '📋', title: 'Noodplan Specialist', color: 'from-blue-500 to-cyan-500' };
        return { emoji: '🔰', title: 'Crisis Trainee', color: 'from-amber-500 to-orange-500' };
    };

    if (phase === 'intro') {
        return (
            <div className="min-h-screen bg-gradient-to-b from-red-950 via-slate-950 to-slate-950 text-white p-4 pb-safe">
                <button onClick={onBack} className="flex items-center gap-2 text-white/60 hover:text-white mb-6"><ArrowLeft size={18} /> <span className="text-sm font-bold">Terug</span></button>
                <div className="max-w-lg mx-auto text-center space-y-6">
                    <div className="w-20 h-20 bg-red-500/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto border border-red-500/30 animate-pulse"><span className="text-4xl">🚨</span></div>
                    <h1 className="text-3xl font-black">Datalekken Rampenplan</h1>
                    <p className="text-white/70 text-sm leading-relaxed max-w-sm mx-auto">
                        <span className="text-red-400 font-bold">BREAKING:</span> De school is gehackt! 800 leerlinggegevens liggen op straat. Kun jij de crisis managen?
                    </p>
                    <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
                        {[{ icon: <AlertTriangle size={16} />, label: '800 leerlingen' }, { icon: <Clock size={16} />, label: '72 uur deadline' }, { icon: <Users size={16} />, label: 'BSN gelekt' }, { icon: <Shield size={16} />, label: 'AVG meldplicht' }].map((item, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-2">
                                <div className="text-red-400">{item.icon}</div>
                                <span className="text-xs font-bold text-white/80">{item.label}</span>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => setPhase('scenarios')} className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl font-black text-lg hover:scale-105 transition-transform active:scale-95 shadow-xl shadow-red-500/30">Start de crisis →</button>
                </div>
            </div>
        );
    }

    if (phase === 'scenarios') {
        const scenario = SCENARIOS[currentScenario];
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white p-4 pb-safe">
                <div className="max-w-lg mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <button onClick={() => currentScenario === 0 ? setPhase('intro') : setCurrentScenario(c => c - 1)} className="text-white/40 hover:text-white"><ArrowLeft size={18} /></button>
                        <div className="flex gap-1.5">{SCENARIOS.map((_, i) => (<div key={i} className={`w-8 h-1.5 rounded-full ${i < currentScenario ? 'bg-emerald-500' : i === currentScenario ? 'bg-red-500' : 'bg-white/10'}`} />))}</div>
                        <div className="bg-red-500/20 px-3 py-1 rounded-full"><span className="text-xs font-black text-red-400">{score} pts</span></div>
                    </div>

                    <div className="bg-white/5 rounded-3xl border border-white/10 p-5 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">{scenario.emoji}</span>
                            <div>
                                <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Fase {currentScenario + 1}/{SCENARIOS.length}</span>
                                <h3 className="text-lg font-black">{scenario.title}</h3>
                            </div>
                        </div>
                        <p className="text-sm text-white/70 leading-relaxed mb-4">{scenario.description}</p>
                        <div className="flex flex-wrap gap-2">
                            {scenario.details.map((d, i) => (
                                <span key={i} className="text-[10px] bg-white/10 px-2 py-1 rounded-full text-white/60">{d}</span>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        {scenario.actions.map((action, i) => {
                            const isSelected = selectedAction === i;
                            const done = selectedAction !== null;
                            let bg = 'bg-white/5 border-white/10 hover:border-white/30';
                            if (done && isSelected) {
                                const isCorrect = currentScenario === 3 ? i === 0 : action.correct;
                                bg = isCorrect ? 'bg-emerald-500/20 border-emerald-500/50' : 'bg-red-500/20 border-red-500/50';
                            } else if (done) {
                                bg = 'bg-white/5 border-white/5 opacity-40';
                            }
                            return (
                                <button key={i} onClick={() => handleAction(i)} disabled={done} className={`w-full p-4 rounded-2xl border text-left transition-all ${bg}`}>
                                    <span className="text-sm text-white/90">{action.text}</span>
                                    {done && isSelected && <p className="text-xs mt-2 text-white/60">{action.feedback}</p>}
                                </button>
                            );
                        })}
                    </div>

                    {selectedAction !== null && (
                        <button onClick={nextScenario} className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-colors">
                            {currentScenario < SCENARIOS.length - 1 ? <>Volgende fase <ChevronRight size={16} /></> : <>Bekijk resultaat <Trophy size={16} /></>}
                        </button>
                    )}
                </div>
            </div>
        );
    }

    const badge = getBadge();
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 to-emerald-950 text-white p-4 pb-safe flex items-center justify-center">
            <div className="max-w-sm w-full text-center space-y-6">
                <div className={`w-24 h-24 mx-auto bg-gradient-to-br ${badge.color} rounded-3xl flex items-center justify-center shadow-2xl`}><span className="text-5xl">{badge.emoji}</span></div>
                <h1 className="text-2xl font-black">{badge.title}</h1>
                <p className="text-white/60 text-sm">{answers.filter(a => a).length}/{SCENARIOS.length} fases correct</p>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                    <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">{score}/100</div>
                    <p className="text-white/50 text-xs mt-1">Crisis Score</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 text-left space-y-2 border border-white/10">
                    <p className="text-xs font-bold text-white/80 mb-2">📋 Jouw Noodplan samenvatting:</p>
                    <p className="text-xs text-white/60">1. STOP het lek — dicht de kwetsbaarheid direct</p>
                    <p className="text-xs text-white/60">2. MELD bij AP binnen 72 uur + informeer betrokkenen</p>
                    <p className="text-xs text-white/60">3. COMMUNICEER eerlijk, transparant en concreet</p>
                    <p className="text-xs text-white/60">4. VOORKOM met 2FA, training en een vast aanspreekpunt</p>
                </div>
                <button onClick={() => onComplete(true)} className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl font-black text-lg hover:scale-105 transition-transform active:scale-95 shadow-xl flex items-center justify-center gap-2"><Trophy size={20} /> Missie Voltooid!</button>
            </div>
        </div>
    );
};
