import { useReducer } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowLeft,
    ArrowRight,
    Check,
    CheckCircle2,
    Code2,
    Eye,
    Gamepad2,
    LayoutDashboard,
    MousePointer2,
    ShieldCheck,
    Sparkles,
} from 'lucide-react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { KeesNarrator } from './KeesNarrator';
import {
    INITIAL_WALKTHROUGH_STATE,
    missionWalkthroughReducer,
    type MissionId,
    type WalkthroughStep,
} from './missionWalkthroughState';

type MissionDefinition = {
    id: MissionId;
    number: string;
    title: string;
    kicker: string;
    skill: string;
    output: string;
    briefing: string;
    instruction: string;
    narrator: Record<'briefing' | 'build' | 'proof', string>;
    options: ReadonlyArray<{ id: string; label: string; helper: string }>;
    correctChoice: string;
    icon: typeof Gamepad2;
};

const MISSIONS: ReadonlyArray<MissionDefinition> = [
    {
        id: 'game',
        number: '04',
        title: 'Game Programmeur',
        kicker: 'Code & computational thinking',
        skill: 'Logisch ordenen en testen',
        output: 'Een speelbaar level met een werkende route',
        briefing: 'Kees moet snelheid maken, over een obstakel springen en daarna de ster pakken. Jij ontwerpt de volgorde en test of die werkt.',
        instruction: 'Welke programmavolgorde brengt Kees veilig bij de ster?',
        narrator: {
            briefing: 'Lees eerst wat het einddoel is. Een goede bouwer weet waarvoor iedere stap nodig is.',
            build: 'Nu beslis jij. Kies de volgorde die je daarna in de echte mini-game wilt testen.',
            proof: 'Je ziet niet alleen een score: DGSkills bewaart welke denkstappen je hebt ontworpen en getest.',
        },
        options: [
            { id: 'boost-jump-collect', label: 'Boost → Spring → Pak ster', helper: 'Eerst snelheid, dan obstakel, dan doel' },
            { id: 'jump-boost-collect', label: 'Spring → Boost → Pak ster', helper: 'Begin direct met het obstakel' },
            { id: 'collect-boost-jump', label: 'Pak ster → Boost → Spring', helper: 'Begin bij het einddoel' },
        ],
        correctChoice: 'boost-jump-collect',
        icon: Gamepad2,
    },
    {
        id: 'website',
        number: '07',
        title: 'Website Bouwer',
        kicker: 'Design & informatievaardigheden',
        skill: 'Ontwerpen voor een echte gebruiker',
        output: 'Een responsive campagnepagina met duidelijke hiërarchie',
        briefing: 'Ontwerp een pagina voor een schoolactie. De bezoeker moet op telefoon direct begrijpen wat er gebeurt en hoe die kan meedoen.',
        instruction: 'Waarmee start een sterke websitebouwer?',
        narrator: {
            briefing: 'Je bouwt niet voor jezelf maar voor een bezoeker. Daarom begint deze opdracht met een doel en een schermformaat.',
            build: 'Kies de ontwerpbeslissing die eerst moet komen. Kleuren en animaties krijgen pas daarna betekenis.',
            proof: 'Je eindproduct laat zien dat je informatie kunt ordenen én voor verschillende schermen kunt ontwerpen.',
        },
        options: [
            { id: 'mobile-first', label: 'Eerst doel en mobiele indeling', helper: 'Bepaal wat de bezoeker direct nodig heeft' },
            { id: 'colors-first', label: 'Eerst alle kleuren kiezen', helper: 'Begin met de visuele details' },
            { id: 'animation-first', label: 'Eerst een grote animatie', helper: 'Begin met het opvallendste effect' },
        ],
        correctChoice: 'mobile-first',
        icon: LayoutDashboard,
    },
    {
        id: 'deepfake',
        number: '11',
        title: 'Deepfake Detector',
        kicker: 'Mediawijsheid & bronnen',
        skill: 'Digitale beelden onderbouwd beoordelen',
        output: 'Een bronnenanalyse met controleerbare aanwijzingen',
        briefing: 'Een opvallende video gaat rond in de klas. Onderzoek niet alleen hoe echt het beeld voelt, maar vooral waar het vandaan komt en wat andere bronnen bevestigen.',
        instruction: 'Welke controle levert het sterkste eerste bewijs?',
        narrator: {
            briefing: 'Een beeld kan overtuigend voelen en toch misleiden. In deze missie ga je van onderbuikgevoel naar controleerbaar bewijs.',
            build: 'Let op: populariteit en beeldkwaliteit zeggen weinig. Kies een stap die iemand anders ook kan controleren.',
            proof: 'Je conclusie telt omdat je laat zien welke bron, context en vergelijking je hebt gebruikt.',
        },
        options: [
            { id: 'source-check', label: 'Zoek de oorspronkelijke bron', helper: 'Controleer maker, datum en context' },
            { id: 'likes-check', label: 'Tel hoeveel likes de video heeft', helper: 'Meet hoe populair het bericht is' },
            { id: 'feeling-check', label: 'Ga af op hoe echt het voelt', helper: 'Gebruik je eerste indruk als bewijs' },
        ],
        correctChoice: 'source-check',
        icon: Eye,
    },
];

const STEP_LABELS: ReadonlyArray<{ id: WalkthroughStep; label: string }> = [
    { id: 'choose', label: 'Kies' },
    { id: 'briefing', label: 'Briefing' },
    { id: 'build', label: 'Bouw' },
    { id: 'proof', label: 'Bewijs' },
];

function MissionPicker({
    selected,
    onSelect,
}: {
    selected: MissionId | null;
    onSelect: (mission: MissionId) => void;
}) {
    return (
        <div className="grid gap-3 md:grid-cols-3" aria-label="Kies een voorbeeldmissie">
            {MISSIONS.map((mission) => {
                const Icon = mission.icon;
                const active = selected === mission.id;
                return (
                    <button
                        key={mission.id}
                        type="button"
                        onClick={() => onSelect(mission.id)}
                        aria-pressed={active}
                        className={`group min-h-[148px] rounded-[1.35rem] border-2 p-4 text-left transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-duck-error/30 ${active ? 'border-duck-ink bg-duck-acid shadow-[5px_6px_0_#202023]' : 'border-duck-ink/15 bg-white hover:border-duck-ink'}`}
                    >
                        <span className="flex items-start justify-between gap-4">
                            <span className="grid size-10 place-items-center rounded-xl bg-duck-ink text-duck-acid"><Icon className="size-5" aria-hidden="true" /></span>
                            <span className="font-mono text-xs font-black text-duck-ink/40">#{mission.number}</span>
                        </span>
                        <span className="mt-5 block text-lg font-extrabold leading-6 text-duck-ink">{mission.title}</span>
                        <span className="mt-1 block text-xs font-bold leading-5 text-duck-ink/52">{mission.kicker}</span>
                    </button>
                );
            })}
        </div>
    );
}

export function MissionWalkthrough() {
    const [state, dispatch] = useReducer(missionWalkthroughReducer, INITIAL_WALKTHROUGH_STATE);
    const reduceMotion = usePrefersReducedMotion();
    const mission = MISSIONS.find((item) => item.id === state.mission) ?? null;
    const selectedChoice = mission ? state.choices[mission.id] : undefined;
    const choiceIsCorrect = Boolean(mission && selectedChoice === mission.correctChoice);

    const goToStep = (step: WalkthroughStep) => {
        if (step === 'choose') dispatch({ type: 'reset' });
        else dispatch({ type: 'go-to-step', step });
    };

    const handlePrevious = () => {
        if (state.step === 'briefing') dispatch({ type: 'reset' });
        else dispatch({ type: 'previous' });
    };

    return (
        <section id="missies" className="scroll-mt-24 bg-duck-bg px-4 py-20 sm:px-6 md:py-28 lg:px-10">
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-end">
                    <div className="max-w-3xl">
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-duck-error">Klik zelf door een opdracht</p>
                        <h2 className="mt-4 text-balance font-display text-[clamp(2.75rem,6vw,5.7rem)] leading-[1.01] tracking-[-0.025em] text-duck-ink lg:leading-[0.96] lg:tracking-[-0.04em]">
                            Niet alleen kijken. Even leerling zijn.
                        </h2>
                    </div>
                    <p className="max-w-2xl text-pretty text-base font-semibold leading-7 text-duck-ink/65 md:text-lg md:leading-8 lg:justify-self-end">
                        Kies een missie en doorloop briefing, bouwkeuze en bewijs. Alles werkt hier direct, zonder account of opgeslagen leerlinggegevens.
                    </p>
                </div>

                <div className="mt-10 rounded-[2rem] border-2 border-duck-ink bg-duck-bgLight p-4 shadow-[8px_9px_0_#202023] sm:p-6 md:mt-14">
                    <MissionPicker
                        selected={state.mission}
                        onSelect={(missionId) => dispatch({ type: 'select-mission', mission: missionId })}
                    />

                    <nav className="mt-6 grid grid-cols-4 gap-1.5 rounded-2xl border border-duck-ink/10 bg-white p-1.5" aria-label="Stappen van de voorbeeldmissie">
                        {STEP_LABELS.map((step, index) => {
                            const active = state.step === step.id;
                            const disabled = step.id !== 'choose' && !mission;
                            return (
                                <button
                                    key={step.id}
                                    type="button"
                                    onClick={() => goToStep(step.id)}
                                    disabled={disabled}
                                    aria-current={active ? 'step' : undefined}
                                    className={`min-h-12 rounded-xl px-2 text-xs font-extrabold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink sm:text-sm ${active ? 'bg-duck-ink text-duck-acid' : 'text-duck-ink/50 hover:bg-duck-bg hover:text-duck-ink disabled:cursor-not-allowed disabled:opacity-30'}`}
                                >
                                    <span className="hidden sm:inline">{index + 1}. </span>{step.label}
                                </button>
                            );
                        })}
                    </nav>

                    <div className="mt-4 min-h-[420px] overflow-hidden rounded-[1.5rem] border border-duck-ink/10 bg-white p-4 sm:p-6 lg:p-8">
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={`${state.mission ?? 'choose'}-${state.step}`}
                                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
                                transition={{ duration: reduceMotion ? 0 : 0.28 }}
                                aria-live="polite"
                            >
                                {state.step === 'choose' && (
                                    <div className="grid gap-7 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
                                        <KeesNarrator
                                            eyebrow="Stap 1 · kies"
                                            message="Welke opdracht zou jij willen proberen? Kies er één; daarna neem ik je stap voor stap mee."
                                            tone="acid"
                                        />
                                        <div className="rounded-[1.4rem] bg-duck-ink p-5 text-white sm:p-7">
                                            <Sparkles className="size-6 text-duck-acid" aria-hidden="true" />
                                            <h3 className="mt-5 font-display text-3xl leading-[1.05]">Drie missies, drie soorten digitale makers.</h3>
                                            <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-white/60">Programmeren, ontwerpen of media onderzoeken: iedere route eindigt in iets dat je kunt laten zien én uitleggen.</p>
                                        </div>
                                    </div>
                                )}

                                {mission && state.step === 'briefing' && (
                                    <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
                                        <KeesNarrator eyebrow="Stap 2 · briefing" message={mission.narrator.briefing} tone="paper" />
                                        <div className="rounded-[1.4rem] bg-duck-ink p-5 text-white sm:p-7">
                                            <div className="flex flex-wrap items-start justify-between gap-4">
                                                <div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-duck-acid/65">Missie #{mission.number}</p><h3 className="mt-2 font-display text-3xl leading-[1.05] sm:text-4xl">{mission.title}</h3></div>
                                                <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-black text-duck-acid">± 45 min</span>
                                            </div>
                                            <p className="mt-6 max-w-2xl text-base font-semibold leading-7 text-white/72">{mission.briefing}</p>
                                            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                                <div className="rounded-2xl bg-white/[0.07] p-4"><Code2 className="size-5 text-duck-acid" aria-hidden="true" /><p className="mt-3 text-xs font-black uppercase tracking-[0.12em] text-white/42">Je oefent</p><p className="mt-1 text-sm font-extrabold">{mission.skill}</p></div>
                                                <div className="rounded-2xl bg-white/[0.07] p-4"><CheckCircle2 className="size-5 text-duck-acid" aria-hidden="true" /><p className="mt-3 text-xs font-black uppercase tracking-[0.12em] text-white/42">Je maakt</p><p className="mt-1 text-sm font-extrabold">{mission.output}</p></div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {mission && state.step === 'build' && (
                                    <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
                                        <KeesNarrator eyebrow="Stap 3 · bouw" message={mission.narrator.build} tone="acid" />
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-[0.14em] text-duck-error">Jouw beslissing</p>
                                            <h3 className="mt-2 text-balance text-2xl font-extrabold leading-8 text-duck-ink">{mission.instruction}</h3>
                                            <div className="mt-5 grid gap-2.5">
                                                {mission.options.map((option) => {
                                                    const selected = selectedChoice === option.id;
                                                    return (
                                                        <button
                                                            key={option.id}
                                                            type="button"
                                                            onClick={() => dispatch({ type: 'set-choice', key: mission.id, value: option.id })}
                                                            aria-pressed={selected}
                                                            className={`flex min-h-[72px] items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-duck-error/30 ${selected ? 'border-duck-ink bg-duck-acid shadow-[4px_5px_0_#202023]' : 'border-duck-ink/12 bg-duck-bg hover:border-duck-ink/40'}`}
                                                        >
                                                            <span className={`grid size-8 shrink-0 place-items-center rounded-full border-2 ${selected ? 'border-duck-ink bg-duck-ink text-duck-acid' : 'border-duck-ink/20 text-transparent'}`}><Check className="size-4" strokeWidth={3} aria-hidden="true" /></span>
                                                            <span><span className="block text-sm font-extrabold text-duck-ink sm:text-base">{option.label}</span><span className="mt-0.5 block text-xs font-semibold leading-5 text-duck-ink/50">{option.helper}</span></span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {mission && state.step === 'proof' && (
                                    <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
                                        <KeesNarrator eyebrow="Stap 4 · bewijs" message={mission.narrator.proof} tone="ink" />
                                        <div className={`rounded-[1.4rem] p-5 sm:p-7 ${selectedChoice && choiceIsCorrect ? 'bg-duck-acid' : 'bg-duck-bg'}`}>
                                            <div className="flex items-start gap-4">
                                                <span className={`grid size-12 shrink-0 place-items-center rounded-full ${selectedChoice && choiceIsCorrect ? 'bg-duck-ink text-duck-acid' : 'bg-white text-duck-error'}`}>{selectedChoice && choiceIsCorrect ? <CheckCircle2 className="size-6" aria-hidden="true" /> : <MousePointer2 className="size-5" aria-hidden="true" />}</span>
                                                <div>
                                                    <p className="text-xs font-black uppercase tracking-[0.14em] text-duck-ink/45">Resultaat van jouw keuze</p>
                                                    <h3 className="mt-2 font-display text-3xl leading-[1.05] text-duck-ink">{!selectedChoice ? 'Maak eerst een bouwkeuze.' : choiceIsCorrect ? 'Sterke keuze — je bewijs klopt.' : 'Goede poging — kijk nog één keer naar de briefing.'}</h3>
                                                    <p className="mt-3 text-sm font-semibold leading-6 text-duck-ink/62">{!selectedChoice ? 'Ga terug naar Bouw en kies welke aanpak jij zou testen.' : choiceIsCorrect ? `${mission.output}. Daarmee toon je: ${mission.skill.toLowerCase()}.` : 'In DGSkills mag je terug, aanpassen en opnieuw testen. Juist die verbetering wordt onderdeel van het leerproces.'}</p>
                                                </div>
                                            </div>
                                            {mission.id === 'game' && (
                                                <a href="#probeer-het" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-duck-ink px-5 text-sm font-extrabold text-duck-acid focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-duck-error/30">Bouw de echte route <ArrowRight className="size-4" aria-hidden="true" /></a>
                                            )}
                                            {mission.id === 'deepfake' && <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-extrabold text-duck-ink"><ShieldCheck className="size-4" aria-hidden="true" /> Bron · context · vergelijking</div>}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {mission && (
                        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <button type="button" onClick={handlePrevious} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-duck-ink bg-white px-5 text-sm font-extrabold text-duck-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-duck-error/30"><ArrowLeft className="size-4" aria-hidden="true" /> Vorige stap</button>
                            {state.step !== 'proof' ? (
                                <button type="button" onClick={() => dispatch({ type: 'next' })} disabled={state.step === 'build' && !selectedChoice} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-duck-ink px-6 text-sm font-extrabold text-duck-acid disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-duck-error/30">Volgende stap <ArrowRight className="size-4" aria-hidden="true" /></button>
                            ) : (
                                <button type="button" onClick={() => dispatch({ type: 'reset' })} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-duck-ink px-6 text-sm font-extrabold text-duck-acid focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-duck-error/30">Kies een andere missie <ArrowRight className="size-4" aria-hidden="true" /></button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
