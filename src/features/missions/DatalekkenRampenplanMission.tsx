import React, { useState, useMemo } from 'react';
import { ArrowLeft, Trophy, ChevronRight, Search, ListOrdered, Mail, PiggyBank, Check, X, RotateCcw, Sparkles, Shield, AlertTriangle, Clock } from 'lucide-react';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';
import { getMissionGoal } from '@/config/missionGoals';
import { MissionGoalBanner } from './templates/shared/MissionGoalBanner';

interface Props {
    onBack: () => void;
    onComplete: (success: boolean) => void;
    stats?: any;
    vsoProfile?: any;
}

interface DatalekkenState {
    phase: 'intro' | 'evidence' | 'priorities' | 'letter' | 'budget' | 'results';
    evidenceSelected: number[];
    evidenceSubmitted: boolean;
    priorityOrder: number[];
    prioritySubmitted: boolean;
    letterSelected: number[];
    letterSubmitted: boolean;
    budgetAllocations: Record<number, number>;
    budgetSubmitted: boolean;
}

const INITIAL_STATE: DatalekkenState = {
    phase: 'intro',
    evidenceSelected: [],
    evidenceSubmitted: false,
    priorityOrder: [],
    prioritySubmitted: false,
    letterSelected: [],
    letterSubmitted: false,
    budgetAllocations: {},
    budgetSubmitted: false,
};

// === PHASE 1: Evidence items ===
interface EvidenceItem {
    id: number;
    icon: string;
    title: string;
    description: string;
    relevant: boolean;
    explanation: string;
}

const EVIDENCE_ITEMS: EvidenceItem[] = [
    { id: 0, icon: '🖥️', title: 'Serverlog 03:14', description: 'Onbekend IP-adres heeft 47.000 queries uitgevoerd op de leerlingdatabase in 12 minuten.', relevant: true, explanation: 'Dit is een duidelijk teken van data-exfiltratie — veel te veel queries in korte tijd.' },
    { id: 1, icon: '📧', title: 'E-mail van leverancier', description: 'De softwareleverancier meldt een geplande update voor volgende week.', relevant: false, explanation: 'Dit is een normale update-mail en heeft niks met het incident te maken.' },
    { id: 2, icon: '🔑', title: 'Wachtwoordlog', description: 'Het admin-account "beheerder01" is 340 keer geprobeerd in te loggen vanaf verschillende locaties.', relevant: true, explanation: 'Brute-force aanval! Honderden inlogpogingen wijzen op een geautomatiseerde aanval op het admin-account.' },
    { id: 3, icon: '📱', title: 'Bericht op X (Twitter)', description: 'Een anoniem account claimt leerlinggegevens te hebben en plaatst een screenshot van namen en cijfers.', relevant: true, explanation: 'Bewijs dat de data daadwerkelijk gelekt is — het staat al online.' },
    { id: 4, icon: '🔧', title: 'Systeemmelding', description: 'De printer op de 2e verdieping heeft een papierstoring.', relevant: false, explanation: 'Een papierstoring is gewoon een papierstoring. Niet alles is een hack.' },
    { id: 5, icon: '📊', title: 'Exportlog database', description: 'Er is een CSV-export van 800 leerlingrecords gemaakt om 03:17, 3 minuten na de verdachte queries.', relevant: true, explanation: 'Direct na de verdachte queries is een volledige export gemaakt — dit bevestigt de datadiefstal.' },
];

const CORRECT_EVIDENCE = EVIDENCE_ITEMS.filter(e => e.relevant).map(e => e.id);

// === PHASE 2: Priority actions ===
interface PriorityAction {
    id: number;
    icon: string;
    text: string;
    correctPosition: number;
}

const PRIORITY_ACTIONS: PriorityAction[] = [
    { id: 0, icon: '🔒', text: 'Alle wachtwoorden resetten en het lek dichten', correctPosition: 1 },
    { id: 1, icon: '📞', text: 'Autoriteit Persoonsgegevens (AP) bellen', correctPosition: 3 },
    { id: 2, icon: '🔍', text: 'Omvang van het lek in kaart brengen', correctPosition: 2 },
    { id: 3, icon: '📋', text: 'Intern crisisteam bij elkaar roepen', correctPosition: 0 },
    { id: 4, icon: '✉️', text: 'Ouders en leerlingen informeren', correctPosition: 4 },
    { id: 5, icon: '📰', text: 'Persverklaring voorbereiden', correctPosition: 5 },
];

const CORRECT_ORDER = [...PRIORITY_ACTIONS].sort((a, b) => a.correctPosition - b.correctPosition).map(a => a.id);

// === PHASE 3: Letter blocks ===
interface LetterBlock {
    id: number;
    icon: string;
    title: string;
    content: string;
    belongsInLetter: boolean;
    explanation: string;
}

const LETTER_BLOCKS: LetterBlock[] = [
    { id: 0, icon: '📌', title: 'Wat is er gebeurd', content: 'Op [datum] is ons leerlingvolgsysteem gehackt. Onbevoegden hebben toegang gekregen tot persoonsgegevens.', belongsInLetter: true, explanation: 'Essentieel — betrokkenen moeten weten WAT er is gebeurd.' },
    { id: 1, icon: '📋', title: 'Welke gegevens', content: 'Het gaat om namen, e-mailadressen, cijfers en BSN-nummers van alle leerlingen.', belongsInLetter: true, explanation: 'Verplicht — mensen moeten weten WELKE data is gelekt zodat ze zich kunnen beschermen.' },
    { id: 2, icon: '🛡️', title: 'Wat wij doen', content: 'Wij hebben het lek gedicht, alle wachtwoorden gereset, en melding gedaan bij de Autoriteit Persoonsgegevens.', belongsInLetter: true, explanation: 'Geeft vertrouwen — laat zien dat de school actie onderneemt.' },
    { id: 3, icon: '✅', title: 'Wat u kunt doen', content: 'Controleer uw bankafschriften, meld identiteitsfraude bij het Centraal Meldpunt en wijzig gedeelde wachtwoorden.', belongsInLetter: true, explanation: 'Cruciaal — geeft ouders concrete stappen om zichzelf te beschermen.' },
    { id: 4, icon: '😤', title: 'Schuld toewijzen', content: 'De ICT-beheerder had een zwak wachtwoord. Hij is inmiddels op non-actief gezet.', belongsInLetter: false, explanation: 'Niet doen! Schuld toewijzen in een crisisbericht is onprofessioneel en mogelijk juridisch problematisch.' },
    { id: 5, icon: '📞', title: 'Contactinformatie', content: 'Voor vragen kunt u contact opnemen met ons crisisteam via [telefoonnummer] of [e-mail].', belongsInLetter: true, explanation: 'Belangrijk — mensen moeten weten waar ze terecht kunnen met vragen.' },
    { id: 6, icon: '🤫', title: 'Bagatelliseren', content: 'Het valt allemaal wel mee. Dit soort dingen gebeurt overal. Maakt u zich geen zorgen.', belongsInLetter: false, explanation: 'Nooit bagatelliseren! Dit ondermijnt vertrouwen en is niet transparant.' },
    { id: 7, icon: '💰', title: 'Schadeclaim aanbod', content: 'Als compensatie bieden wij elke leerling een waardebon van €50 aan.', belongsInLetter: false, explanation: 'Dit is geen goed idee in een eerste crisisbericht — het impliceert schuld en kan juridisch tegen je werken.' },
];

const CORRECT_LETTER = LETTER_BLOCKS.filter(b => b.belongsInLetter).map(b => b.id);

// === PHASE 4: Budget items ===
interface BudgetItem {
    id: number;
    icon: string;
    title: string;
    description: string;
    cost: number;
    effectiveness: number; // 1-5 stars
    explanation: string;
}

const BUDGET_ITEMS: BudgetItem[] = [
    { id: 0, icon: '🔐', title: 'Tweefactorauthenticatie (2FA)', description: 'Alle accounts krijgen verplichte 2FA via een authenticator-app.', cost: 1500, effectiveness: 5, explanation: '2FA blokkeert 99% van alle account-hackpogingen. Beste investering.' },
    { id: 1, icon: '🎓', title: 'Security-training personeel', description: 'Elk kwartaal een interactieve cybersecurity workshop voor alle medewerkers.', cost: 3000, effectiveness: 4, explanation: 'Menselijke fouten zijn de #1 oorzaak van datalekken. Training is essentieel.' },
    { id: 2, icon: '🔍', title: 'Penetratietest', description: 'Een extern bedrijf test alle systemen op kwetsbaarheden.', cost: 5000, effectiveness: 4, explanation: 'Vindt zwakke plekken voordat hackers dat doen. Belangrijk maar duur.' },
    { id: 3, icon: '💾', title: 'Dagelijkse encrypted backups', description: 'Automatische versleutelde back-ups met off-site opslag.', cost: 2000, effectiveness: 3, explanation: 'Beschermt tegen ransomware en dataverlies. Goede basis-maatregel.' },
    { id: 4, icon: '🧱', title: 'Enterprise firewall upgrade', description: 'Geavanceerde firewall met intrusion detection en DDoS-bescherming.', cost: 8000, effectiveness: 3, explanation: 'Goede verdediging maar duur. De huidige firewall is al redelijk, dus de meerwaarde is beperkt.' },
];

const TOTAL_BUDGET = 10000;

// === Scoring functions ===
function scoreEvidence(selected: number[]): { score: number; max: number } {
    const correctSelected = selected.filter(id => CORRECT_EVIDENCE.includes(id)).length;
    const incorrectSelected = selected.filter(id => !CORRECT_EVIDENCE.includes(id)).length;
    const score = Math.max(0, (correctSelected / CORRECT_EVIDENCE.length) * 25 - (incorrectSelected * 5));
    return { score: Math.round(score), max: 25 };
}

function scorePriorities(order: number[]): { score: number; max: number } {
    if (order.length !== PRIORITY_ACTIONS.length) return { score: 0, max: 25 };
    let correct = 0;
    for (let i = 0; i < order.length; i++) {
        const action = PRIORITY_ACTIONS.find(a => a.id === order[i])!;
        if (action.correctPosition === i) correct++;
        else if (Math.abs(action.correctPosition - i) === 1) correct += 0.5;
    }
    return { score: Math.round((correct / PRIORITY_ACTIONS.length) * 25), max: 25 };
}

function scoreLetter(selected: number[]): { score: number; max: number } {
    const correctSelected = selected.filter(id => CORRECT_LETTER.includes(id)).length;
    const incorrectSelected = selected.filter(id => !CORRECT_LETTER.includes(id)).length;
    const score = Math.max(0, (correctSelected / CORRECT_LETTER.length) * 25 - (incorrectSelected * 6));
    return { score: Math.round(score), max: 25 };
}

function scoreBudget(allocations: Record<number, number>): { score: number; max: number } {
    const totalSpent = Object.values(allocations).reduce((a, b) => a + b, 0);
    if (totalSpent > TOTAL_BUDGET) return { score: 0, max: 25 };
    let effectivenessScore = 0;
    let maxPossible = 0;
    for (const item of BUDGET_ITEMS) {
        if (allocations[item.id] && allocations[item.id] >= item.cost) {
            effectivenessScore += item.effectiveness;
        }
        maxPossible += item.effectiveness;
    }
    // Normalize: best possible within budget = 2FA(5) + Training(4) + Backups(3) = 12, cost = 6500
    // Or 2FA(5) + Training(4) + Pentest(4) = 13, cost = 9500
    const bestRealistic = 13; // 2FA + training + pentest within 10k
    const score = Math.round((effectivenessScore / bestRealistic) * 25);
    return { score: Math.min(25, score), max: 25 };
}

// === Phase components ===

const PhaseHeader: React.FC<{
    currentPhase: number;
    totalPhases: number;
    totalScore: number;
    onBack: () => void;
}> = ({ currentPhase, totalPhases, totalScore, onBack }) => (
    <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-[#445865] hover:text-[#08283B] transition-all duration-300">
            <ArrowLeft size={18} />
        </button>
        <div className="flex gap-1.5">
            {Array.from({ length: totalPhases }).map((_, i) => (
                <div key={i} className={`w-8 h-1.5 rounded-full transition-all duration-300 ${
                    i < currentPhase ? 'bg-[#5F947D]'
                    : i === currentPhase ? 'bg-gradient-to-r from-[#D97848] to-[#D97848]'
                    : 'bg-[#E7D8BD]'
                }`} />
            ))}
        </div>
        <div className="bg-[#D97848]/10 px-3 py-1 rounded-full border border-[#D97848]/20">
            <span className="text-xs font-black text-[#D97848]">{totalScore} pts</span>
        </div>
    </div>
);

const PhaseCard: React.FC<{
    icon: React.ReactNode;
    phaseNumber: number;
    totalPhases: number;
    title: string;
    description: string;
    children: React.ReactNode;
}> = ({ icon, phaseNumber, totalPhases, title, description, children }) => (
    <div className="bg-white rounded-2xl border border-[#E7D8BD] p-5 mb-6">
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#D97848]/10 rounded-xl flex items-center justify-center text-[#D97848]">
                {icon}
            </div>
            <div>
                <span className="text-[10px] font-black text-[#D97848] uppercase tracking-widest" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                    Fase {phaseNumber}/{totalPhases}
                </span>
                <h3 className="text-lg font-black text-[#08283B]" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                    {title}
                </h3>
            </div>
        </div>
        <p className="text-sm text-[#445865] leading-relaxed" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
            {description}
        </p>
        {children}
    </div>
);

// Phase 1: Evidence
const EvidencePhase: React.FC<{
    selected: number[];
    submitted: boolean;
    onToggle: (id: number) => void;
    onSubmit: () => void;
}> = ({ selected, submitted, onToggle, onSubmit }) => (
    <>
        <div className="grid gap-3 mb-4">
            {EVIDENCE_ITEMS.map((item) => {
                const isSelected = selected.includes(item.id);
                const showResult = submitted;
                let borderClass = 'border-[#E7D8BD]';
                let bgClass = 'bg-white';

                if (isSelected && !showResult) {
                    borderClass = 'border-[#D97848] ring-1 ring-[#D97848]/20';
                    bgClass = 'bg-[#D97848]/5';
                }
                if (showResult && isSelected) {
                    borderClass = item.relevant ? 'border-[#5F947D]' : 'border-lab-coral';
                    bgClass = item.relevant ? 'bg-[#5F947D]/5' : 'bg-lab-coral';
                }
                if (showResult && !isSelected && item.relevant) {
                    borderClass = 'border-[#5F947D]/40';
                    bgClass = 'bg-[#5F947D]/5';
                }
                if (showResult && !isSelected && !item.relevant) {
                    bgClass = 'bg-[#E7D8BD]';
                }

                return (
                    <button
                        key={item.id}
                        onClick={() => !submitted && onToggle(item.id)}
                        disabled={submitted}
                        className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 ${borderClass} ${bgClass}`}
                    >
                        <div className="flex items-start gap-3">
                            <span className="text-xl mt-0.5">{item.icon}</span>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-bold text-[#08283B]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                        {item.title}
                                    </span>
                                    {isSelected && !showResult && (
                                        <span className="text-[10px] bg-[#D97848]/10 text-[#D97848] px-2 py-0.5 rounded-full font-bold">geselecteerd</span>
                                    )}
                                    {showResult && isSelected && (
                                        item.relevant
                                            ? <Check size={14} className="text-[#5F947D]" />
                                            : <X size={14} className="text-lab-muted" />
                                    )}
                                    {showResult && !isSelected && item.relevant && (
                                        <span className="text-[10px] text-[#5F947D] font-bold">gemist!</span>
                                    )}
                                </div>
                                <p className="text-xs text-[#445865] leading-relaxed" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                    {item.description}
                                </p>
                                {showResult && (isSelected || item.relevant) && (
                                    <p className="text-[11px] text-[#445865] mt-2 italic" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                        {item.explanation}
                                    </p>
                                )}
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
        {!submitted && selected.length > 0 && (
            <p className="text-center text-xs text-[#445865] mb-3" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                {selected.length} bewijsstuk{selected.length !== 1 ? 'ken' : ''} geselecteerd
            </p>
        )}
        {!submitted && (
            <button
                onClick={onSubmit}
                disabled={selected.length === 0}
                className={`w-full py-3 rounded-full font-black text-sm transition-all duration-300 ${
                    selected.length > 0
                        ? 'bg-[#D97848] hover:bg-[#D97848] text-white'
                        : 'bg-[#E7D8BD] text-[#445865] cursor-not-allowed'
                }`}
            >
                Dien analyse in
            </button>
        )}
    </>
);

// Phase 2: Priorities
const PrioritiesPhase: React.FC<{
    order: number[];
    submitted: boolean;
    onAdd: (id: number) => void;
    onReset: () => void;
    onSubmit: () => void;
}> = ({ order, submitted, onAdd, onReset, onSubmit }) => {
    const remaining = PRIORITY_ACTIONS.filter(a => !order.includes(a.id));

    return (
        <>
            {/* Selected order */}
            {order.length > 0 && (
                <div className="bg-[#FCF6EA] rounded-xl p-3 mb-4 border border-[#E7D8BD]">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-[#445865] uppercase tracking-widest" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            Jouw volgorde
                        </span>
                        {!submitted && (
                            <button onClick={onReset} className="text-[#445865] hover:text-[#D97848] transition-colors">
                                <RotateCcw size={14} />
                            </button>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        {order.map((id, i) => {
                            const action = PRIORITY_ACTIONS.find(a => a.id === id)!;
                            const isCorrectPos = submitted && action.correctPosition === i;
                            const isClosePos = submitted && !isCorrectPos && Math.abs(action.correctPosition - i) === 1;
                            return (
                                <div key={id} className={`flex items-center gap-2 p-2 rounded-lg text-xs transition-all ${
                                    submitted
                                        ? isCorrectPos ? 'bg-[#5F947D]/10 text-[#5F947D]'
                                        : isClosePos ? 'bg-lab-gold text-lab-ink'
                                        : 'bg-lab-coral text-white'
                                        : 'bg-white text-[#445865]'
                                }`} style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                    <span className="w-5 h-5 rounded-full bg-[#D97848]/10 text-[#D97848] flex items-center justify-center text-[10px] font-black shrink-0">
                                        {i + 1}
                                    </span>
                                    <span>{action.icon} {action.text}</span>
                                    {submitted && isCorrectPos && <Check size={12} className="ml-auto shrink-0" />}
                                    {submitted && !isCorrectPos && (
                                        <span className="ml-auto text-[10px] shrink-0">→ #{action.correctPosition + 1}</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Remaining actions */}
            {!submitted && remaining.length > 0 && (
                <div className="grid gap-2 mb-4">
                    <span className="text-[10px] font-black text-[#445865] uppercase tracking-widest" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        Klik in volgorde van prioriteit
                    </span>
                    {remaining.map((action) => (
                        <button
                            key={action.id}
                            onClick={() => onAdd(action.id)}
                            className="w-full p-3 rounded-xl border-2 border-[#E7D8BD] bg-white text-left hover:border-[#D97848]/40 transition-all duration-200"
                        >
                            <span className="text-sm text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                {action.icon} {action.text}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            {submitted && (
                <div className="bg-[#FCF6EA] rounded-xl p-3 mb-4 border border-[#E7D8BD]">
                    <p className="text-xs text-[#445865] leading-relaxed" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        <strong>De juiste volgorde:</strong> Eerst het crisisteam bijeen, dan het lek dichten, omvang bepalen, AP melden, ouders informeren, en als laatste de pers.
                        In de praktijk lopen sommige stappen parallel, maar deze volgorde voorkomt dat je informatie deelt voordat je weet wat er precies aan de hand is.
                    </p>
                </div>
            )}

            {!submitted && order.length === PRIORITY_ACTIONS.length && (
                <button
                    onClick={onSubmit}
                    className="w-full py-3 rounded-full font-black text-sm bg-[#D97848] hover:bg-[#D97848] text-white transition-all duration-300"
                >
                    Bevestig volgorde
                </button>
            )}
        </>
    );
};

// Phase 3: Letter builder
const LetterPhase: React.FC<{
    selected: number[];
    submitted: boolean;
    onToggle: (id: number) => void;
    onSubmit: () => void;
}> = ({ selected, submitted, onToggle, onSubmit }) => {
    const selectedBlocks = LETTER_BLOCKS.filter(b => selected.includes(b.id));

    return (
        <>
            {/* Letter preview */}
            {selectedBlocks.length > 0 && (
                <div className="bg-white rounded-xl p-4 mb-4 border-2 border-dashed border-[#E7D8BD]">
                    <div className="flex items-center gap-2 mb-3">
                        <Mail size={14} className="text-[#D97848]" />
                        <span className="text-[10px] font-black text-[#445865] uppercase tracking-widest" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            Jouw brief aan ouders
                        </span>
                    </div>
                    <div className="text-xs text-[#445865] space-y-2 leading-relaxed italic" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        <p className="text-[#445865]">Geachte ouders/verzorgers,</p>
                        {selectedBlocks.map((block) => (
                            <p key={block.id} className={submitted ? (block.belongsInLetter ? 'text-[#5F947D]' : 'text-lab-muted line-through') : ''}>
                                {block.content}
                            </p>
                        ))}
                        <p className="text-[#445865]">Met vriendelijke groet,<br />Het crisisteam</p>
                    </div>
                </div>
            )}

            {/* Block options */}
            <div className="grid gap-2 mb-4">
                <span className="text-[10px] font-black text-[#445865] uppercase tracking-widest" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                    {submitted ? 'Beoordeling' : 'Selecteer wat er in de brief moet'}
                </span>
                {LETTER_BLOCKS.map((block) => {
                    const isSelected = selected.includes(block.id);
                    let borderClass = 'border-[#E7D8BD]';
                    let bgClass = 'bg-white';

                    if (isSelected && !submitted) {
                        borderClass = 'border-[#D97848] ring-1 ring-[#D97848]/20';
                        bgClass = 'bg-[#D97848]/5';
                    }
                    if (submitted && isSelected) {
                        borderClass = block.belongsInLetter ? 'border-[#5F947D]' : 'border-lab-coral';
                        bgClass = block.belongsInLetter ? 'bg-[#5F947D]/5' : 'bg-lab-coral';
                    }
                    if (submitted && !isSelected && block.belongsInLetter) {
                        borderClass = 'border-[#5F947D]/40';
                        bgClass = 'bg-[#5F947D]/5';
                    }
                    if (submitted && !isSelected && !block.belongsInLetter) {
                        bgClass = 'bg-[#E7D8BD]';
                    }

                    return (
                        <button
                            key={block.id}
                            onClick={() => !submitted && onToggle(block.id)}
                            disabled={submitted}
                            className={`w-full p-3 rounded-xl border-2 text-left transition-all duration-200 ${borderClass} ${bgClass}`}
                        >
                            <div className="flex items-start gap-2">
                                <span className="text-base mt-0.5">{block.icon}</span>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-[#08283B]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                            {block.title}
                                        </span>
                                        {submitted && isSelected && (
                                            block.belongsInLetter
                                                ? <Check size={12} className="text-[#5F947D]" />
                                                : <X size={12} className="text-lab-muted" />
                                        )}
                                        {submitted && !isSelected && block.belongsInLetter && (
                                            <span className="text-[10px] text-[#5F947D] font-bold">gemist!</span>
                                        )}
                                    </div>
                                    {submitted && (isSelected || block.belongsInLetter) && (
                                        <p className="text-[11px] text-[#445865] mt-1" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                            {block.explanation}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {!submitted && (
                <button
                    onClick={onSubmit}
                    disabled={selected.length === 0}
                    className={`w-full py-3 rounded-full font-black text-sm transition-all duration-300 ${
                        selected.length > 0
                            ? 'bg-[#D97848] hover:bg-[#D97848] text-white'
                            : 'bg-[#E7D8BD] text-[#445865] cursor-not-allowed'
                    }`}
                >
                    Verstuur brief
                </button>
            )}
        </>
    );
};

// Phase 4: Budget
const BudgetPhase: React.FC<{
    allocations: Record<number, number>;
    submitted: boolean;
    onToggle: (id: number) => void;
    onSubmit: () => void;
}> = ({ allocations, submitted, onToggle, onSubmit }) => {
    const totalSpent = Object.values(allocations).reduce((a, b) => a + b, 0);
    const remaining = TOTAL_BUDGET - totalSpent;

    return (
        <>
            {/* Budget bar */}
            <div className="bg-[#FCF6EA] rounded-xl p-3 mb-4 border border-[#E7D8BD]">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-[#445865] uppercase tracking-widest" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        Beschikbaar budget
                    </span>
                    <span className={`text-sm font-black ${remaining < 0 ? 'text-lab-muted' : remaining === 0 ? 'text-[#5F947D]' : 'text-[#D97848]'}`} style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        €{remaining.toLocaleString('nl-NL')} van €{TOTAL_BUDGET.toLocaleString('nl-NL')}
                    </span>
                </div>
                <div className="h-2 bg-[#E7D8BD] rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${remaining < 0 ? 'bg-lab-coral' : 'bg-gradient-to-r from-[#D97848] to-[#D97848]'}`}
                        style={{ width: `${Math.min(100, (totalSpent / TOTAL_BUDGET) * 100)}%` }}
                    />
                </div>
            </div>

            {/* Budget items */}
            <div className="grid gap-3 mb-4">
                {BUDGET_ITEMS.map((item) => {
                    const isAllocated = allocations[item.id] && allocations[item.id] >= item.cost;
                    const canAfford = remaining >= item.cost || isAllocated;

                    return (
                        <button
                            key={item.id}
                            onClick={() => !submitted && onToggle(item.id)}
                            disabled={submitted || (!isAllocated && !canAfford)}
                            className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                                isAllocated
                                    ? submitted
                                        ? 'border-[#5F947D] bg-[#5F947D]/5'
                                        : 'border-[#D97848] bg-[#D97848]/5'
                                    : !canAfford && !submitted
                                        ? 'border-[#E7D8BD] bg-[#E7D8BD] opacity-50'
                                        : 'border-[#E7D8BD] bg-white hover:border-[#D97848]/40'
                            }`}
                        >
                            <div className="flex items-start gap-3">
                                <span className="text-xl mt-0.5">{item.icon}</span>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-bold text-[#08283B]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                            {item.title}
                                        </span>
                                        <span className={`text-xs font-bold ${isAllocated ? 'text-[#D97848]' : 'text-[#445865]'}`} style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                            €{item.cost.toLocaleString('nl-NL')}
                                        </span>
                                    </div>
                                    <p className="text-xs text-[#445865] leading-relaxed mb-2" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                        {item.description}
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <span className="text-[10px] text-[#445865] mr-1" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Impact:</span>
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <div key={i} className={`w-2 h-2 rounded-full ${i < item.effectiveness ? 'bg-[#D97848]' : 'bg-[#E7D8BD]'}`} />
                                        ))}
                                    </div>
                                    {submitted && (
                                        <p className="text-[11px] text-[#445865] mt-2 italic" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                            {item.explanation}
                                        </p>
                                    )}
                                </div>
                                {isAllocated && (
                                    <div className="shrink-0">
                                        <Check size={16} className={submitted ? 'text-[#5F947D]' : 'text-[#D97848]'} />
                                    </div>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            {remaining < 0 && !submitted && (
                <p className="text-center text-xs text-lab-muted mb-3 font-bold" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                    Je bent over budget! Deselecteer een maatregel.
                </p>
            )}

            {!submitted && (
                <button
                    onClick={onSubmit}
                    disabled={totalSpent === 0 || remaining < 0}
                    className={`w-full py-3 rounded-full font-black text-sm transition-all duration-300 ${
                        totalSpent > 0 && remaining >= 0
                            ? 'bg-[#D97848] hover:bg-[#D97848] text-white'
                            : 'bg-[#E7D8BD] text-[#445865] cursor-not-allowed'
                    }`}
                >
                    Beveiligingsplan indienen
                </button>
            )}
        </>
    );
};

// === Main component ===
export const DatalekkenRampenplanMission: React.FC<Props> = ({ onBack, onComplete }) => {
    const { state: saved, setState: setSaved, clearSave } = useMissionAutoSave<DatalekkenState>(
        'datalekken-rampenplan',
        INITIAL_STATE
    );

    const phase = saved.phase;
    const setPhase = (p: DatalekkenState['phase']) => setSaved(prev => ({ ...prev, phase: p }));

    // Phase navigation
    const PHASE_SEQUENCE: DatalekkenState['phase'][] = ['evidence', 'priorities', 'letter', 'budget'];
    const currentPhaseIndex = PHASE_SEQUENCE.indexOf(phase);

    const goNext = () => {
        if (currentPhaseIndex < PHASE_SEQUENCE.length - 1) {
            setPhase(PHASE_SEQUENCE[currentPhaseIndex + 1]);
        } else {
            setPhase('results');
        }
    };

    const goBackPhase = () => {
        if (currentPhaseIndex === 0) setPhase('intro');
        // Don't allow going back to previous phases after submission
    };

    // Scores
    const evidenceScore = scoreEvidence(saved.evidenceSelected);
    const priorityScore = scorePriorities(saved.priorityOrder);
    const letterScore = scoreLetter(saved.letterSelected);
    const budgetScore = scoreBudget(saved.budgetAllocations);
    const totalScore = evidenceScore.score + priorityScore.score + letterScore.score + budgetScore.score;

    const currentRunningScore = useMemo(() => {
        let s = 0;
        if (saved.evidenceSubmitted) s += evidenceScore.score;
        if (saved.prioritySubmitted) s += priorityScore.score;
        if (saved.letterSubmitted) s += letterScore.score;
        if (saved.budgetSubmitted) s += budgetScore.score;
        return s;
    }, [saved, evidenceScore, priorityScore, letterScore, budgetScore]);

    // Phase-specific submitted check
    const isCurrentPhaseSubmitted = () => {
        switch (phase) {
            case 'evidence': return saved.evidenceSubmitted;
            case 'priorities': return saved.prioritySubmitted;
            case 'letter': return saved.letterSubmitted;
            case 'budget': return saved.budgetSubmitted;
            default: return false;
        }
    };

    // === INTRO ===
    if (phase === 'intro') {
        return (
            <div className="min-h-screen bg-[#FCF6EA] text-[#08283B] overflow-y-auto p-4 pb-safe">
                <button onClick={onBack} className="flex items-center gap-2 text-[#445865] hover:text-[#08283B] transition-all duration-300 mb-6">
                    <ArrowLeft size={18} />
                    <span className="text-sm font-bold" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Terug</span>
                </button>
                <div className="max-w-lg mx-auto text-center space-y-6">
                    <div className="w-20 h-20 bg-[#D97848]/10 rounded-3xl flex items-center justify-center mx-auto border border-[#D97848]/20 animate-pulse">
                        <span className="text-4xl">🚨</span>
                    </div>
                    <h1 className="text-3xl font-black" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                        Datalekken Rampenplan
                    </h1>
                    <p className="text-[#445865] text-sm leading-relaxed max-w-sm mx-auto" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        <span className="text-[#D97848] font-bold">BREAKING:</span> De school is gehackt! 800 leerlinggegevens liggen op straat.
                        Analyseer bewijs, stel prioriteiten, schrijf de crisiscommunicatie en verdeel het beveiligingsbudget.
                    </p>
                    <MissionGoalBanner goal={getMissionGoal('datalekken-rampenplan')!} compact />
                    <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
                        {[
                            { icon: <Search size={16} />, label: 'Bewijs analyseren' },
                            { icon: <ListOrdered size={16} />, label: 'Prioriteiten stellen' },
                            { icon: <Mail size={16} />, label: 'Brief schrijven' },
                            { icon: <PiggyBank size={16} />, label: 'Budget verdelen' },
                        ].map((item, i) => (
                            <div key={i} className="bg-white border border-[#E7D8BD] rounded-2xl p-3 flex items-center gap-2">
                                <div className="text-[#D97848]">{item.icon}</div>
                                <span className="text-xs font-bold text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => setPhase('evidence')}
                        className="px-8 py-4 bg-[#D97848] hover:bg-[#D97848] text-white rounded-full font-black text-lg transition-all duration-300 active:scale-95 shadow-xl shadow-[#D97848]/30 focus-visible:ring-2 focus-visible:ring-[#D97848]"
                    >
                        Start de crisis →
                    </button>
                </div>
            </div>
        );
    }

    // === RESULTS ===
    if (phase === 'results') {
        const getBadge = () => {
            if (totalScore >= 80) return { emoji: '🛡️', title: 'Crisis Commander', color: 'from-[#5F947D] to-[#5F947D]' };
            if (totalScore >= 55) return { emoji: '📋', title: 'Noodplan Specialist', color: 'from-[#5F947D] to-[#D97848]' };
            return { emoji: '🔰', title: 'Crisis Trainee', color: 'from-[#D97848] to-[#D97848]' };
        };
        const badge = getBadge();

        const phases = [
            { icon: '🔍', title: 'Bewijs analyse', ...evidenceScore },
            { icon: '📋', title: 'Prioriteiten', ...priorityScore },
            { icon: '✉️', title: 'Crisisbrief', ...letterScore },
            { icon: '💰', title: 'Budget', ...budgetScore },
        ];

        return (
            <div className="min-h-screen bg-[#FCF6EA] text-[#08283B] overflow-y-auto">
                <div className="min-h-full flex items-center justify-center p-4 pb-safe">
                    <div className="max-w-sm w-full text-center space-y-6">
                        <div className={`w-24 h-24 mx-auto bg-gradient-to-br ${badge.color} rounded-3xl flex items-center justify-center shadow-2xl`}>
                            <span className="text-5xl">{badge.emoji}</span>
                        </div>
                        <h1 className="text-2xl font-black" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                            {badge.title}
                        </h1>

                        <div className="bg-white rounded-2xl p-4 border border-[#E7D8BD]">
                            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#D97848] to-[#D97848]">
                                {totalScore}/100
                            </div>
                            <p className="text-[#445865] text-xs mt-1" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                Crisis Score
                            </p>
                        </div>

                        {/* Phase breakdown */}
                        <div className="bg-white rounded-2xl p-4 text-left space-y-3 border border-[#E7D8BD]">
                            <p className="text-xs font-bold text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                Score per fase
                            </p>
                            {phases.map((p, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <span className="text-base">{p.icon}</span>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                                {p.title}
                                            </span>
                                            <span className="text-xs font-bold text-[#D97848]">{p.score}/{p.max}</span>
                                        </div>
                                        <div className="h-1.5 bg-[#E7D8BD] rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-[#D97848] to-[#D97848] transition-all duration-700"
                                                style={{ width: `${(p.score / p.max) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Key takeaways */}
                        <div className="bg-white rounded-2xl p-4 text-left space-y-2 border border-[#E7D8BD]">
                            <p className="text-xs font-bold text-[#445865] mb-2" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                Wat je moet onthouden
                            </p>
                            <p className="text-xs text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                🔍 Niet elk signaal is een hack — analyseer bewijs kritisch
                            </p>
                            <p className="text-xs text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                📋 Volgorde doet ertoe: eerst team, dan techniek, dan communicatie
                            </p>
                            <p className="text-xs text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                ✉️ Eerlijk, concreet, en actiegerichte communicatie wint vertrouwen
                            </p>
                            <p className="text-xs text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                💰 Budget is beperkt — kies impact boven compleetheid
                            </p>
                        </div>

                        <button
                            onClick={() => { clearSave(); onComplete(true); }}
                            className="w-full py-4 bg-[#5F947D] hover:bg-[#5F947D] text-white rounded-full font-black text-lg transition-all duration-300 active:scale-95 shadow-xl flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#5F947D]"
                        >
                            <Trophy size={20} /> Missie Voltooid!
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // === INTERACTIVE PHASES ===
    const phaseConfigs = {
        evidence: {
            icon: <Search size={20} />,
            title: 'Bewijs Analyseren',
            description: 'Maandagochtend 08:00. Er zijn meldingen van een mogelijke hack. Bekijk de bewijsstukken en selecteer welke wijzen op een echt datalek. Let op: niet alles is wat het lijkt!',
        },
        priorities: {
            icon: <ListOrdered size={20} />,
            title: 'Actieplan Opstellen',
            description: 'Het lek is bevestigd. Je hebt 6 acties die je moet uitvoeren. Klik ze aan in de juiste volgorde van prioriteit. Wat doe je EERST?',
        },
        letter: {
            icon: <Mail size={20} />,
            title: 'De Crisisbrief',
            description: 'Je moet een bericht sturen naar alle ouders en leerlingen. Selecteer welke onderdelen in de brief horen. Je ziet een live preview van je brief.',
        },
        budget: {
            icon: <PiggyBank size={20} />,
            title: 'Beveiligingsbudget',
            description: `De directeur geeft je €${TOTAL_BUDGET.toLocaleString('nl-NL')} om de school beter te beveiligen. Niet alles past in het budget — waar investeer je in?`,
        },
    };

    const config = phaseConfigs[phase as keyof typeof phaseConfigs];
    if (!config) return null;

    return (
        <div className="min-h-screen bg-[#FCF6EA] text-[#08283B] overflow-y-auto p-4 pb-safe">
            <div className="max-w-lg mx-auto">
                <PhaseHeader
                    currentPhase={currentPhaseIndex}
                    totalPhases={4}
                    totalScore={currentRunningScore}
                    onBack={goBackPhase}
                />

                <PhaseCard
                    icon={config.icon}
                    phaseNumber={currentPhaseIndex + 1}
                    totalPhases={4}
                    title={config.title}
                    description={config.description}
                >
                    <div className="mt-4" />
                </PhaseCard>

                {phase === 'evidence' && (
                    <EvidencePhase
                        selected={saved.evidenceSelected}
                        submitted={saved.evidenceSubmitted}
                        onToggle={(id) => setSaved(prev => ({
                            ...prev,
                            evidenceSelected: prev.evidenceSelected.includes(id)
                                ? prev.evidenceSelected.filter(x => x !== id)
                                : [...prev.evidenceSelected, id],
                        }))}
                        onSubmit={() => setSaved(prev => ({ ...prev, evidenceSubmitted: true }))}
                    />
                )}

                {phase === 'priorities' && (
                    <PrioritiesPhase
                        order={saved.priorityOrder}
                        submitted={saved.prioritySubmitted}
                        onAdd={(id) => setSaved(prev => ({
                            ...prev,
                            priorityOrder: [...prev.priorityOrder, id],
                        }))}
                        onReset={() => setSaved(prev => ({ ...prev, priorityOrder: [] }))}
                        onSubmit={() => setSaved(prev => ({ ...prev, prioritySubmitted: true }))}
                    />
                )}

                {phase === 'letter' && (
                    <LetterPhase
                        selected={saved.letterSelected}
                        submitted={saved.letterSubmitted}
                        onToggle={(id) => setSaved(prev => ({
                            ...prev,
                            letterSelected: prev.letterSelected.includes(id)
                                ? prev.letterSelected.filter(x => x !== id)
                                : [...prev.letterSelected, id],
                        }))}
                        onSubmit={() => setSaved(prev => ({ ...prev, letterSubmitted: true }))}
                    />
                )}

                {phase === 'budget' && (
                    <BudgetPhase
                        allocations={saved.budgetAllocations}
                        submitted={saved.budgetSubmitted}
                        onToggle={(id) => setSaved(prev => {
                            const item = BUDGET_ITEMS.find(b => b.id === id)!;
                            const current = prev.budgetAllocations[id] || 0;
                            const newAllocations = { ...prev.budgetAllocations };
                            if (current >= item.cost) {
                                delete newAllocations[id];
                            } else {
                                newAllocations[id] = item.cost;
                            }
                            return { ...prev, budgetAllocations: newAllocations };
                        })}
                        onSubmit={() => setSaved(prev => ({ ...prev, budgetSubmitted: true }))}
                    />
                )}

                {isCurrentPhaseSubmitted() && (
                    <button
                        onClick={goNext}
                        className="w-full mt-4 py-3 bg-[#D97848] hover:bg-[#D97848] text-white rounded-full font-black text-sm flex items-center justify-center gap-2 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#D97848]"
                    >
                        {currentPhaseIndex < PHASE_SEQUENCE.length - 1
                            ? <>Volgende fase <ChevronRight size={16} /></>
                            : <>Bekijk resultaat <Trophy size={16} /></>
                        }
                    </button>
                )}
            </div>
        </div>
    );
};
