import React, { useState, useEffect, useCallback } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle, XCircle, BookOpen, MessageCircle } from 'lucide-react';
import type { TemplateMissionProps, FollowUpQuestion, MissionGoal } from '../shared/types';
import type { BadgeConfig } from '../shared/types';
import { PhaseHeader } from '../shared/PhaseHeader';
import { IntroScreen } from '../shared/IntroScreen';
import { CompletionScreen } from '../shared/CompletionScreen';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';
import { getMissionGoal } from '@/config/missionGoals';
import { InteractiveTable } from './sub/InteractiveTable';
import { SimpleChart } from './sub/SimpleChart';
import { ConfidenceRating, ConfidenceFeedback } from '../shared/ConfidenceRating';
import { FollowUpCard } from '../shared/FollowUpCard';
import { StudentAIChat } from '@/features/ai-chat/StudentAIChat';
import { WellbeingAlert } from '@/features/student/WellbeingAlert';
import { useWellbeingMonitor, type WellbeingMatch } from '@/hooks/useWellbeingMonitor';
import { useWellbeingTeacherAlert } from '@/hooks/useWellbeingTeacherAlert';
import { toScorePercent } from '../shared/scorePercent';

// ── Config types ──────────────────────────────────────────────────────────────

export interface DataQuestion {
    id: string;
    question: string;
    type: 'multiple-choice' | 'number-input' | 'text-observation';
    options?: string[];
    correctAnswer: string | number;
    explanation: string;
    points: number;
    showConfidence?: boolean;
    /** text-observation: begrippen die in een goed antwoord horen (los woord of woordgroep) */
    keywords?: string[];
    /** text-observation: hoeveel keywords nodig zijn voor volle punten (default 1) */
    minKeywords?: number;
    /** text-observation: minimale lengte in woorden (default 8) */
    minWords?: number;
}

export interface Dataset {
    id: string;
    title: string;
    description: string;
    type: 'table' | 'bar-chart' | 'pie-chart' | 'document-cards';
    // table
    columns?: Array<{ key: string; label: string; sortable?: boolean }>;
    rows?: Record<string, string | number>[];
    // chart
    chartData?: Array<{ label: string; value: number; color?: string }>;
    // document-cards
    cards?: Array<{ title: string; icon: string; content: string }>;
    /** Herkomst en beperkingen van de dataset, zichtbaar voor leerlingen. */
    source?: DatasetSource;
    questions: DataQuestion[];
    followUp?: FollowUpQuestion;
}

export interface DatasetSource {
    kind: 'synthetic' | 'external';
    label: string;
    url?: string;
    published?: string;
    accessed?: string;
    methodNote?: string;
}

export interface DataViewerConfig {
    missionId: string;
    title: string;
    introEmoji: string;
    introTitle: string;
    introDescription: string;
    missionGoal?: MissionGoal;
    introFeatures?: string[];
    datasets: Dataset[];
    maxScore: number;
    badges: BadgeConfig[];
    takeaways: string[];
    enableChat?: boolean;
    chatRoleId?: string;
    /** Toon een vast hulpblokje (mentor/vertrouwenspersoon, Kindertelefoon, 113) bij missies met een zwaar thema. */
    showWellbeingSupport?: boolean;
}

// ── State ─────────────────────────────────────────────────────────────────────

interface DataViewerState {
    phase: 'intro' | 'explore' | 'results';
    currentDataset: number;
    answers: Record<string, string | number>;
    submitted: Record<string, boolean>;
    textObservations: Record<string, string>;
    confidences: Record<string, 1 | 2 | 3>;
    followUpAnswered: Record<string, boolean>;
    followUpCorrect: Record<string, boolean>;
}

// ── Helper ────────────────────────────────────────────────────────────────────

const DEFAULT_MIN_WORDS = 8;
const DEFAULT_MIN_KEYWORDS = 1;

/**
 * Hoeveel eigen inhoudswoorden een antwoord naast de kernbegrippen moet delen met
 * de vraag en de uitleg. Eén treffer met opvultekst eromheen leverde eerst de volle
 * punten op ("moe ik weet het antwoord niet en gok maar wat" scoorde 10/10 bij
 * `data-journalist` q3); nu moet er ook echt iets over de data gezegd zijn. Het
 * aantal keywords zelf verhogen bleek te streng: een goed antwoord in eigen
 * woorden gebruikt lang niet altijd twee van de begrippen uit de config.
 */
const MIN_SUBSTANCE = 1;

/**
 * Zonder keywords is er geen enkel ander signaal, dus ligt de lat op twee gedeelde
 * inhoudswoorden. Daar gaf de terugval eerder altijd de volle punten, ook voor
 * "ik weet het antwoord niet en gok maar wat" bij `network-navigator` q3.
 */
const MIN_TOPIC_OVERLAP = 2;

/**
 * Standaardzinnen waarmee een leerling aangeeft niets te antwoorden. Ze worden uit
 * het antwoord geknipt vóór de lengte- en inhoudscontrole, zodat "geen idee" met
 * genoeg opvulwoorden eromheen niet meer als antwoord telt. Een echt antwoord dat
 * met "ik weet niet zeker of…" begint houdt gewoon zijn inhoud over.
 */
const NON_ANSWER_PATTERNS: RegExp[] = [
    /\bik weet (het |dit |de )?(antwoord |antwoorden )?niet\b/g,
    /\bweet ik (het )?niet\b/g,
    /\bweet ik veel\b/g,
    // Bewust GEEN kale `weet niet`: dat knipt ook echte inhoud weg. "Je weet niet
    // welke waarde bij welke key hoort" is bij `api-verkenner` q3 een correct
    // antwoord van negen woorden, en hield er zeven over — te kort voor de
    // bevestigknop. Alleen expliciete ik-vormen tellen als niet-antwoord.
    /\bgeen (flauw )?(idee|benul)\b/g,
    /\bgeen antwoord\b/g,
    /\bgok (maar )?(wat|iets)\b/g,
    /\bmaar (wat|iets) gokken\b/g,
    /\bmaakt niet uit\b/g,
    /\bboeit (me )?niet\b/g,
    /\b(idk|nvt|xxx)\b/g,
];

/**
 * Veelgebruikte functiewoorden. Ze tellen niet mee voor de inhoudelijke overlap
 * met de vraag, anders zou een willekeurige zin al aansluiting lijken te hebben.
 */
const OBSERVATION_STOPWORDS = new Set([
    'alle', 'allemaal', 'alleen', 'ander', 'andere', 'beste', 'beschrijf', 'daar',
    'deze', 'denk', 'denken', 'doen', 'doet', 'door', 'echt', 'eens', 'eigen',
    'elke', 'even', 'gaan', 'gaat', 'geen', 'geeft', 'gewoon', 'goed', 'haar',
    'hebben', 'hebt', 'heeft', 'heel', 'hier', 'hoeveel', 'hun', 'iemand', 'iets',
    'ieder', 'jouw', 'juist', 'kijken', 'kijkt', 'kunnen', 'kunt', 'maar', 'maken',
    'meer', 'misschien', 'moet', 'moeten', 'mogelijk', 'mogelijke', 'naar', 'niet',
    'niets', 'nooit', 'omdat', 'ongeveer', 'onze', 'ooit', 'over', 'opvalt', 'soms',
    'staan', 'staat', 'toch', 'toen', 'vaak', 'vaker', 'valt', 'veel', 'vind',
    'vinden', 'voor', 'vooral', 'waar', 'waarom', 'want', 'wanneer', 'welke', 'wordt',
    'worden', 'woorden', 'zeer', 'zegt', 'zeggen', 'zelf', 'zich', 'zien', 'zijn',
    'zoals', 'zodat', 'zou', 'zouden',
]);

/**
 * Een antwoord dat een volledige URL, een pad of een formule is. Zulke antwoorden
 * zijn per definitie kort: het juiste antwoord op `api-verkenner` q8
 * (https://pokeapi.co/api/v2/pokemon/charizard) telt zeven woorden en haalde de
 * generieke eis van acht niet, waardoor de bevestigknop uit bleef én de score 0
 * was — een leerling met het juiste antwoord kwam niet verder.
 *
 * Het patroon eist een volledig adres MET pad. Een kaal domein telt niet: bij
 * `network-navigator` q3 haalde "https://latency-server.nl" anders het keyword
 * `latency` plus een woord uit de uitleg, en scoorde 10/10 zonder één observatie.
 */
const STRUCTURED_ANSWER = /https?:\/\/[^\s/]+\/\S+|\b[a-z0-9-]+(\.[a-z]{2,})+\/\S+|\d\s*[+\-*/×÷=]\s*\d/i;

/**
 * Verwacht deze vraag een gestructureerd antwoord? Dat leiden we af uit de uitleg:
 * staat daar zelf een URL, pad of formule in, dan is dát het modelantwoord en zegt
 * het aantal woorden niets. In een gewone observatievraag is een URL gewone tekst
 * en geldt de lengte-eis onverkort.
 */
function expectsStructuredAnswer(q: DataQuestion): boolean {
    return STRUCTURED_ANSWER.test(q.explanation) || STRUCTURED_ANSWER.test(String(q.correctAnswer));
}

/**
 * Haalt het antwoord de lengte-eis? Een gestructureerd antwoord is vrijgesteld —
 * maar alleen bij een vraag die zo'n antwoord ook echt verwacht. Zowel de score
 * als de bevestigknop gebruiken deze functie, zodat die twee nooit uit elkaar lopen.
 */
export function meetsObservationLength(q: DataQuestion, value: string, minWords: number): boolean {
    if (expectsStructuredAnswer(q) && STRUCTURED_ANSWER.test(value)) return true;
    return observationWords(meaningfulObservation(value)).length >= minWords;
}

/** Kleine letters zonder accenten, zodat "Café" en "cafe" hetzelfde matchen. */
function normalizeObservation(value: string): string {
    return value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

/** Splitst op woordniveau, zodat "de" niet in "dezelfde" wordt gevonden. */
function observationWords(value: string): string[] {
    return normalizeObservation(value)
        .split(/[^a-z0-9]+/)
        .filter(Boolean);
}

/** Ontaard = één herhaald teken, één herhaald woord, of alleen leestekens/cijfers. */
function isDegenerateObservation(value: string): boolean {
    const words = observationWords(value);
    if (words.length === 0) return true;
    const letters = normalizeObservation(value).replace(/[^a-z]/g, '');
    if (letters.length === 0) return true;
    if (new Set(letters).size === 1) return true;
    if (new Set(words).size === 1) return true;
    return false;
}

function countKeywordHits(value: string, keywords: string[]): number {
    const words = observationWords(value);
    const wordSet = new Set(words);
    const phrase = ` ${words.join(' ')} `;
    return keywords.filter(kw => {
        const kwWords = observationWords(kw);
        if (kwWords.length === 0) return false;
        if (kwWords.length === 1) return wordSet.has(kwWords[0]);
        return phrase.includes(` ${kwWords.join(' ')} `);
    }).length;
}

/**
 * Haalt de standaard niet-antwoorden uit de tekst. Wat overblijft is wat de
 * leerling echt over de data zegt; dát is waarop lengte en inhoud worden gemeten.
 */
function meaningfulObservation(value: string): string {
    let text = ` ${observationWords(value).join(' ')} `;
    for (const pattern of NON_ANSWER_PATTERNS) text = text.replace(pattern, ' ');
    return text.trim().replace(/\s+/g, ' ');
}

/** Inhoudswoorden, ingekort tot vijf letters zodat "router" en "routers" matchen. */
function contentStems(text: string): Set<string> {
    return new Set(
        observationWords(text)
            .filter(w => w.length >= 4 && !OBSERVATION_STOPWORDS.has(w))
            .map(w => w.slice(0, 5))
    );
}

/**
 * Hoeveel inhoudswoorden het antwoord deelt met de vraag en de bijbehorende
 * uitleg. Dit vervangt de kale lengtecontrole voor vragen zonder keywords: daar
 * gaf de terugval altijd de volle punten, dus scoorde "ik weet het antwoord niet
 * en gok maar wat" 10/10 bij `network-navigator` q3.
 */
function topicOverlap(text: string, q: DataQuestion, exclude?: Set<string>): number {
    const topic = contentStems(`${q.question} ${q.explanation}`);
    let hits = 0;
    for (const stem of contentStems(text)) {
        if (exclude?.has(stem)) continue;
        if (topic.has(stem)) hits++;
    }
    return hits;
}

/** 0 = te kort, ontaard of niet ter zake; halve punten = te weinig inhoud; anders vol. */
export function scoreObservation(q: DataQuestion, raw: string | number | undefined): number {
    const value = String(raw ?? '');
    const minWords = q.minWords ?? DEFAULT_MIN_WORDS;
    if (isDegenerateObservation(value)) return 0;
    const meaningful = meaningfulObservation(value);
    if (!meetsObservationLength(q, value, minWords)) return 0;
    if (q.keywords && q.keywords.length > 0) {
        const hits = countKeywordHits(meaningful, q.keywords);
        const needed = Math.min(q.minKeywords ?? DEFAULT_MIN_KEYWORDS, q.keywords.length);
        // De kernbegrippen zelf tellen niet mee voor de inhoud: een rij losse
        // keywords achter elkaar is geen observatie.
        const keywordStems = contentStems(q.keywords.join(' '));
        const substance = topicOverlap(meaningful, q, keywordStems);
        // Een kort maar raak antwoord bestaat soms bijna volledig uit kernbegrippen
        // en deelt dan weinig andere woorden met de uitleg. Zo'n antwoord telt ook
        // als inhoudelijk, mits er een echte zin omheen staat — een kale rij
        // keywords ("moe moe blij uren patroon") haalt die eigen woorden niet.
        const ownWords = new Set(
            observationWords(meaningful).filter(w => !keywordStems.has(w.slice(0, 5)))
        );
        const substantive = substance >= MIN_SUBSTANCE || (hits >= 3 && ownWords.size >= 5);
        if (hits >= needed && substantive) return q.points;
        // Halve punten alleen bij een echt aanknopingspunt: één kernbegrip, of
        // zonder kernbegrip minstens twee inhoudswoorden uit de vraag of uitleg.
        return hits > 0 || substance >= MIN_TOPIC_OVERLAP ? Math.round(q.points / 2) : 0;
    }
    const overlap = topicOverlap(meaningful, q);
    if (overlap >= MIN_TOPIC_OVERLAP) return q.points;
    return overlap === 1 ? Math.round(q.points / 2) : 0;
}

function scoreQuestion(q: DataQuestion, answers: Record<string, string | number>): number {
    if (q.type === 'text-observation') return scoreObservation(q, answers[q.id]);
    const raw = answers[q.id];
    if (raw === undefined || raw === '') return 0;
    if (q.type === 'number-input') {
        const num = Number(raw);
        const correct = Number(q.correctAnswer);
        if (isNaN(num)) return 0;
        const tolerance = Math.abs(correct) * 0.05;
        return Math.abs(num - correct) <= tolerance ? q.points : 0;
    }
    // multiple-choice
    return String(raw).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()
        ? q.points
        : 0;
}

function clampScore(score: number, maxScore: number): number {
    return Math.min(Math.max(score, 0), maxScore);
}

function isCorrect(q: DataQuestion, answers: Record<string, string | number>): boolean | null {
    if (q.type === 'text-observation') return scoreObservation(q, answers[q.id]) === q.points;
    const raw = answers[q.id];
    if (raw === undefined || raw === '') return null;
    if (q.type === 'number-input') {
        const num = Number(raw);
        const correct = Number(q.correctAnswer);
        if (isNaN(num)) return false;
        return Math.abs(num - correct) <= Math.abs(correct) * 0.05;
    }
    return String(raw).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();
}

// ── Question component ────────────────────────────────────────────────────────

interface QuestionCardProps {
    q: DataQuestion;
    answers: Record<string, string | number>;
    submitted: Record<string, boolean>;
    textObservations: Record<string, string>;
    confidences: Record<string, 1 | 2 | 3>;
    onAnswer: (id: string, value: string | number) => void;
    onTextObservation: (id: string, value: string) => void;
    onConfidence: (id: string, level: 1 | 2 | 3) => void;
    onSubmit: (id: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
    q,
    answers,
    submitted,
    textObservations,
    confidences,
    onAnswer,
    onTextObservation,
    onConfidence,
    onSubmit,
}) => {
    const isSubmitted = submitted[q.id];
    const correct = isSubmitted ? isCorrect(q, answers) : null;
    const answer = answers[q.id];
    const observation = textObservations[q.id] ?? '';
    const confidence = confidences[q.id];
    const showConfidenceWidget =
        q.showConfidence === true &&
        q.type !== 'text-observation' &&
        !isSubmitted &&
        answer !== undefined &&
        answer !== '';
    const minWords = q.minWords ?? DEFAULT_MIN_WORDS;
    const wordCount = q.type === 'text-observation' ? observationWords(observation).length : 0;
    const observationScore = q.type === 'text-observation' && isSubmitted
        ? scoreObservation(q, answers[q.id] ?? observation)
        : null;
    const positiveFeedback = q.type === 'text-observation'
        ? (observationScore ?? 0) > 0
        : correct === true;
    const lengthOk = q.type === 'text-observation' && meetsObservationLength(q, observation, minWords);
    const submitDisabled = q.type === 'text-observation'
        ? !lengthOk
        : answer === undefined || answer === '';
    const observationHintId = `${q.id}-observation-hint`;

    return (
        <div className="bg-white rounded-2xl border border-duck-gray p-4 mb-3">
            <div className="flex items-start justify-between gap-3 mb-3">
                <p
                    className="text-sm font-semibold text-duck-ink leading-snug flex-1"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {q.question}
                </p>
                <span
                    className="text-xs font-bold text-duck-ink bg-duck-acid/10 px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {q.points} pt
                </span>
            </div>

            {/* Answer input */}
            {!isSubmitted && (
                <>
                    {q.type === 'multiple-choice' && q.options && (
                        <div className="flex flex-col gap-2 mb-3">
                            {q.options.map(opt => (
                                <label
                                    key={opt}
                                    className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
                                        answer === opt
                                            ? 'border-duck-acid bg-duck-acid/8'
                                            : 'border-duck-gray hover:border-duck-acid/40'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name={q.id}
                                        value={opt}
                                        checked={answer === opt}
                                        onChange={() => onAnswer(q.id, opt)}
                                        className="accent-duck-error"
                                    />
                                    <span
                                        className="text-sm text-duck-ink/75"
                                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                    >
                                        {opt}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}

                    {q.type === 'number-input' && (
                        <input
                            type="number"
                            step="any"
                            placeholder="Typ een getal…"
                            value={answer ?? ''}
                            onChange={e => onAnswer(q.id, e.target.value)}
                            className="w-full mb-3 px-3 py-2 text-sm rounded-xl border border-duck-gray bg-duck-bg text-duck-ink focus:outline-none focus:border-duck-acid"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        />
                    )}

                    {q.type === 'text-observation' && (
                        <>
                            <textarea
                                rows={3}
                                placeholder="Schrijf je observatie hier…"
                                value={observation}
                                onChange={e => onTextObservation(q.id, e.target.value)}
                                className="w-full mb-1.5 px-3 py-2 text-sm rounded-xl border border-duck-gray bg-duck-bg text-duck-ink focus:outline-none focus:border-duck-acid resize-none"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            />
                            {/* Live-regio én uitleg bij de bevestigknop: anders hoort een
                                schermlezergebruiker niet waarom de knop uit staat, en
                                krijgt hij tijdens het typen geen terugkoppeling. */}
                            <p
                                id={observationHintId}
                                aria-live="polite"
                                className="text-xs text-duck-ink/75 mb-3"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                {!lengthOk
                                    ? `Schrijf in je eigen woorden wat je in de data ziet — nog minstens ${Math.max(1, minWords - wordCount)} woord${minWords - wordCount === 1 ? '' : 'en'}.`
                                    : `${wordCount} woorden — je kunt bevestigen.`}
                            </p>
                        </>
                    )}

                    {showConfidenceWidget && (
                        <div className="mb-3">
                            <ConfidenceRating selected={confidence} onSelect={(level) => onConfidence(q.id, level)} />
                            {confidence !== undefined && (
                                <p
                                    className="mt-1.5 text-xs text-duck-ink/75 text-center"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    Genoteerd — dit telt niet mee voor je punten.
                                </p>
                            )}
                        </div>
                    )}

                    <button
                        onClick={() => onSubmit(q.id)}
                        disabled={submitDisabled}
                        aria-describedby={q.type === 'text-observation' ? observationHintId : undefined}
                        className="w-full min-h-[44px] py-2.5 bg-gradient-to-r from-duck-acid to-duck-acid hover:from-duck-acid hover:to-duck-acid disabled:opacity-40 disabled:cursor-not-allowed text-duck-ink rounded-xl font-bold text-sm transition-all duration-200"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Bevestigen
                    </button>
                </>
            )}

            {/* Feedback after submit */}
            {isSubmitted && (
                <div
                    role="status"
                    aria-live="polite"
                    className={`rounded-xl p-3 flex items-start gap-2.5 ${
                        positiveFeedback
                            ? 'bg-duck-ink/10 border border-duck-ink/25'
                            : 'bg-duck-acid/8 border border-duck-acid/20'
                    }`}
                >
                    {positiveFeedback ? (
                        <CheckCircle size={16} className="text-duck-ink mt-0.5 flex-shrink-0" />
                    ) : (
                        <XCircle size={16} className="text-duck-ink mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                        {q.type === 'text-observation' ? (
                            <p
                                className="text-xs font-semibold text-duck-ink mb-1"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                {observationScore === 0
                                    ? `Dit telt nog niet mee. Schrijf in je eigen woorden minstens ${minWords} woorden op wat jou opvalt in de data — noem bijvoorbeeld een getal, een groep of een verschil dat je ziet.`
                                    : observationScore !== null && observationScore < q.points
                                        ? `Goed begin — +${observationScore} van ${q.points} punten. Je kunt het scherper maken door de begrippen uit de opdracht te gebruiken en concreet te benoemen wat je in de data ziet.`
                                        : `Goed opgeschreven! +${q.points} punten voor je observatie.`}
                            </p>
                        ) : correct ? (
                            <p
                                className="text-xs font-semibold text-duck-ink mb-1"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                Goed! +{q.points} punten
                            </p>
                        ) : (
                            <p
                                className="text-xs font-semibold text-duck-ink mb-1"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                Niet helemaal — het juiste antwoord: <strong>{q.correctAnswer}</strong>
                            </p>
                        )}
                        <p
                            className="text-xs text-duck-ink/75 leading-snug"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            {q.explanation}
                        </p>
                        {/* Kalibratie: alleen waar goed/fout eenduidig is, dus niet bij observaties */}
                        {q.type !== 'text-observation' && (
                            <ConfidenceFeedback confidence={confidence} correct={correct === true} className="mt-1" />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// ── Dataset view ──────────────────────────────────────────────────────────────

interface DatasetViewProps {
    dataset: Dataset;
    answers: Record<string, string | number>;
    submitted: Record<string, boolean>;
    textObservations: Record<string, string>;
    confidences: Record<string, 1 | 2 | 3>;
    followUpAnswered: Record<string, boolean>;
    onAnswer: (id: string, value: string | number) => void;
    onTextObservation: (id: string, value: string) => void;
    onConfidence: (id: string, level: 1 | 2 | 3) => void;
    onSubmit: (id: string) => void;
    onFollowUpAnswer: (datasetId: string, correct: boolean) => void;
    onFollowUpComplete: (datasetId: string, correct: boolean) => void;
    allSubmitted: boolean;
    onNext: () => void;
    isLast: boolean;
    datasetIndex: number;
    totalDatasets: number;
}

const DatasetView: React.FC<DatasetViewProps> = ({
    dataset,
    answers,
    submitted,
    textObservations,
    confidences,
    followUpAnswered,
    onAnswer,
    onTextObservation,
    onConfidence,
    onSubmit,
    onFollowUpAnswer,
    onFollowUpComplete,
    allSubmitted,
    onNext,
    isLast,
    datasetIndex,
    totalDatasets,
}) => {
    const showFollowUp = allSubmitted && dataset.followUp !== undefined && !followUpAnswered[dataset.id];
    const canGoNext = allSubmitted && (dataset.followUp === undefined || followUpAnswered[dataset.id]);

    return (
    <div>
        {/* Dataset header */}
        <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
                <span
                    className="text-xs font-black text-duck-ink uppercase tracking-widest"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Dataset {datasetIndex + 1} / {totalDatasets}
                </span>
            </div>
            <h2
                className="text-lg font-black text-duck-ink mb-1"
                style={{ fontFamily: "'Newsreader', Georgia, serif" }}
            >
                {dataset.title}
            </h2>
            <p
                className="text-sm text-duck-ink/75 leading-relaxed"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                {dataset.description}
            </p>
            {dataset.source && (
                <div className="mt-3 rounded-xl border border-duck-gray bg-white/70 px-3 py-2.5">
                    <p
                        className="text-[10px] font-black uppercase tracking-widest text-duck-ink/70"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Databron
                    </p>
                    <p
                        className="mt-1 text-xs font-semibold text-duck-ink"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        {dataset.source.kind === 'synthetic' ? 'Oefendataset · ' : 'Externe bron · '}
                        {dataset.source.url ? (
                            <a
                                href={dataset.source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline decoration-duck-acid underline-offset-2 hover:text-duck-ink/70"
                            >
                                {dataset.source.label}
                            </a>
                        ) : (
                            dataset.source.label
                        )}
                    </p>
                    {(dataset.source.published || dataset.source.accessed || dataset.source.methodNote) && (
                        <p
                            className="mt-1 text-[11px] leading-relaxed text-duck-ink/70"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            {dataset.source.published && `Gepubliceerd: ${dataset.source.published}. `}
                            {dataset.source.accessed && `Geraadpleegd: ${dataset.source.accessed}. `}
                            {dataset.source.methodNote}
                        </p>
                    )}
                </div>
            )}
        </div>

        {/* Visualisation */}
        <div className="mb-5">
            {dataset.type === 'table' && dataset.columns && dataset.rows && (
                <InteractiveTable columns={dataset.columns} rows={dataset.rows} />
            )}

            {(dataset.type === 'bar-chart' || dataset.type === 'pie-chart') && dataset.chartData && (
                <div className="bg-white rounded-2xl border border-duck-gray p-4">
                    <SimpleChart
                        data={dataset.chartData}
                        type={dataset.type === 'pie-chart' ? 'pie' : 'bar'}
                    />
                </div>
            )}

            {dataset.type === 'document-cards' && dataset.cards && (
                <div className="flex flex-col gap-3">
                    {dataset.cards.map((card, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-2xl border border-duck-gray p-4 flex items-start gap-3"
                        >
                            <div className="text-2xl flex-shrink-0">{card.icon}</div>
                            <div>
                                <p
                                    className="text-sm font-black text-duck-ink mb-1"
                                    style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                                >
                                    {card.title}
                                </p>
                                <p
                                    className="text-xs text-duck-ink/75 leading-relaxed"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    {card.content}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Hint */}
        <div className="flex items-center gap-2 mb-4 p-2.5 bg-duck-acid/6 rounded-xl border border-duck-acid/15">
            <BookOpen size={14} className="text-duck-ink flex-shrink-0" />
            <p
                className="text-xs text-duck-ink"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                Gebruik de data hierboven om de vragen te beantwoorden. Sorteer of filter om antwoorden te vinden.
            </p>
        </div>

        {/* Questions */}
        <div>
            {dataset.questions.map(q => (
                <QuestionCard
                    key={q.id}
                    q={q}
                    answers={answers}
                    submitted={submitted}
                    textObservations={textObservations}
                    confidences={confidences}
                    onAnswer={onAnswer}
                    onTextObservation={onTextObservation}
                    onConfidence={onConfidence}
                    onSubmit={onSubmit}
                />
            ))}
        </div>

        {/* FollowUp card — shown after all questions, before next dataset */}
        {showFollowUp && (
            <FollowUpCard
                followUp={dataset.followUp!}
                onAnswer={(correct) => onFollowUpAnswer(dataset.id, correct)}
                onComplete={(correct) => onFollowUpComplete(dataset.id, correct)}
                theme="light"
            />
        )}

        {/* Next button */}
        {canGoNext && (
            <button
                onClick={onNext}
                className="w-full mt-4 py-3.5 bg-gradient-to-r from-duck-acid to-duck-acid hover:from-duck-acid hover:to-duck-acid text-duck-ink rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                {isLast ? 'Bekijk resultaten' : 'Volgende dataset'}
                <ChevronRight size={16} />
            </button>
        )}
    </div>
    );
};

// ── Main component ────────────────────────────────────────────────────────────

interface DataViewerProps extends TemplateMissionProps {
    config: DataViewerConfig;
}

const DataViewerInner: React.FC<DataViewerProps> = ({
    missionId,
    onBack,
    onComplete,
    config,
}) => {
    const INITIAL_STATE: DataViewerState = {
        phase: 'intro',
        currentDataset: 0,
        answers: {},
        submitted: {},
        textObservations: {},
        confidences: {},
        followUpAnswered: {},
        followUpCorrect: {},
    };

    // Een opgeslagen sessie kan van een oudere, grotere config komen, of beschadigd
    // zijn. Herstel alleen wanneer de datasetindex nog bestaat, elke map een écht
    // object is met sleutels én waarden van het juiste soort, en fase en index bij
    // elkaar passen. `?? {}` volstond niet: `answers: null` kwam daar ongezien
    // doorheen, overschreef de lege beginwaarde en liet de vraagkaart crashen.
    const validateSavedState = useCallback((restored: DataViewerState): boolean => {
        if (!restored || typeof restored !== 'object') return false;
        if (!['intro', 'explore', 'results'].includes(restored.phase)) return false;
        const index = restored.currentDataset;
        if (!Number.isInteger(index) || index < 0 || index >= config.datasets.length) return false;
        // Samenhang fase/index: de intro staat altijd op de eerste dataset, en het
        // resultatenscherm wordt pas bereikt vanaf de laatste.
        if (restored.phase === 'intro' && index !== 0) return false;
        if (restored.phase === 'results' && index !== config.datasets.length - 1) return false;

        const questionIds = new Set(config.datasets.flatMap(ds => ds.questions.map(q => q.id)));
        // De verdiepingsregistraties worden op DATASET-id gezet, niet op vraag-id.
        // Ze tegen de vraag-id's toetsen wiste de opslag zodra een leerling één
        // verdiepingsvraag had beantwoord.
        const followUpIds = new Set(config.datasets.filter(ds => ds.followUp).map(ds => ds.id));

        const isValidMap = (
            value: unknown,
            allowedKeys: Set<string>,
            isValidValue: (v: unknown) => boolean
        ): boolean =>
            typeof value === 'object' && value !== null && !Array.isArray(value) &&
            Object.entries(value as Record<string, unknown>)
                .every(([key, v]) => allowedKeys.has(key) && isValidValue(v));

        const isAnswer = (v: unknown) =>
            typeof v === 'string' || (typeof v === 'number' && Number.isFinite(v));
        const isBoolean = (v: unknown) => typeof v === 'boolean';
        const isText = (v: unknown) => typeof v === 'string';
        const isConfidence = (v: unknown) => v === 1 || v === 2 || v === 3;

        return (
            isValidMap(restored.answers, questionIds, isAnswer) &&
            isValidMap(restored.submitted, questionIds, isBoolean) &&
            isValidMap(restored.textObservations, questionIds, isText) &&
            isValidMap(restored.confidences, questionIds, isConfidence) &&
            isValidMap(restored.followUpAnswered, followUpIds, isBoolean) &&
            isValidMap(restored.followUpCorrect, followUpIds, isBoolean)
        );
    }, [config]);

    const { state, setState, clearSave } = useMissionAutoSave<DataViewerState>(
        missionId,
        INITIAL_STATE,
        { validate: validateSavedState }
    );

    const [isChatOpen, setIsChatOpen] = useState(false);
    const teacherAlert = useWellbeingTeacherAlert();
    const {
        scanText: scanWellbeingText,
        showHulplijn,
        lastMatch: wellbeingMatch,
        dismissHulplijn,
    } = useWellbeingMonitor({ onAlert: teacherAlert.onAlert });
    // De monitor toont de overlay maar één keer per minuut (cooldown). Een
    // geblokkeerde inzending mag nooit stil zijn: deze lokale match zorgt dat
    // de hulplijn bij élke geblokkeerde inzending opnieuw verschijnt.
    const [blockedMatch, setBlockedMatch] = useState<WellbeingMatch | null>(null);

    const userId = (() => {
        try {
            // Zelfde reden als in useMissionAutoSave: pak de sleutel van hét
            // ingestelde project, niet de eerste de beste sb-*-auth-token. Op een
            // gedeelde schoolcomputer kan een token van een ander Supabase-project
            // in de browser staan, en dan loopt de chat onder de verkeerde leerling.
            const supabaseUrl = ((import.meta as any).env.VITE_SUPABASE_URL as string)?.trim();
            if (!supabaseUrl) return null;
            const projectId = new URL(supabaseUrl).hostname.split('.')[0];
            const raw = localStorage.getItem(`sb-${projectId}-auth-token`);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            return parsed?.user?.id ?? parsed?.currentSession?.user?.id ?? null;
        } catch {
            return null;
        }
    })();

    const { phase, answers, submitted, textObservations, confidences, followUpAnswered, followUpCorrect } = state;
    const currentDataset = Math.min(Math.max(state.currentDataset, 0), config.datasets.length - 1);

    useEffect(() => {
        if (state.currentDataset !== currentDataset) {
            setState(prev => ({ ...prev, currentDataset }));
        }
    }, [state.currentDataset, currentDataset, setState]);

    const questionScore = config.datasets.flatMap(ds => ds.questions).reduce((sum, q) => {
        if (!submitted[q.id]) return sum;
        return sum + scoreQuestion(q, answers);
    }, 0);

    const followUpBonusScore = config.datasets.reduce((sum, ds) => {
        if (!ds.followUp || !followUpAnswered[ds.id] || !followUpCorrect[ds.id]) return sum;
        return sum + ds.followUp.bonusPoints;
    }, 0);

    const totalScore = clampScore(questionScore + followUpBonusScore, config.maxScore);

    const missionGoal = config.missionGoal ?? getMissionGoal(config.missionId);
    /** Puntendrempel van de missie, of null wanneer voltooien niet van de score afhangt.
     *  missionGoals-drempels zijn percentages (registratie werkt in procenten): bij
     *  eindproject-j2 (maxScore 85) betekent 65 dus 65% = 56 punten, niet 65 punten. */
    const scoreThreshold = missionGoal?.criteria.type === 'score-threshold'
        ? Math.ceil(config.maxScore * ((missionGoal.criteria.threshold ?? 40) / 100))
        : null;
    // Zonder eigen missiedrempel blijft de oude regel staan: 40% van het maximum,
    // gemeten op hetzelfde afgeronde percentage dat de docent te zien krijgt.
    const missionPassed = scoreThreshold !== null
        ? totalScore >= scoreThreshold
        : (toScorePercent(totalScore, config.maxScore) ?? 0) >= 40;

    const handleAnswer = (id: string, value: string | number) => {
        setState(prev => ({ ...prev, answers: { ...prev.answers, [id]: value } }));
    };

    const handleConfidence = (id: string, level: 1 | 2 | 3) => {
        setState(prev => ({ ...prev, confidences: { ...prev.confidences, [id]: level } }));
    };

    // Het eerste antwoord telt: eenmaal onthuld mag een refresh of hermount de uitslag
    // niet meer verbeteren.
    const handleFollowUpAnswer = (datasetId: string, correct: boolean) => {
        setState(prev =>
            prev.followUpCorrect[datasetId] !== undefined
                ? prev
                : { ...prev, followUpCorrect: { ...prev.followUpCorrect, [datasetId]: correct } }
        );
    };

    const handleFollowUpComplete = (datasetId: string, correct: boolean) => {
        setState(prev => ({
            ...prev,
            followUpAnswered: { ...prev.followUpAnswered, [datasetId]: true },
            followUpCorrect:
                prev.followUpCorrect[datasetId] !== undefined
                    ? prev.followUpCorrect
                    : { ...prev.followUpCorrect, [datasetId]: correct },
        }));
    };

    const handleTextObservation = (id: string, value: string) => {
        setState(prev => ({
            ...prev,
            textObservations: { ...prev.textObservations, [id]: value },
            answers: { ...prev.answers, [id]: value },
        }));
    };

    const handleSubmitQuestion = (id: string) => {
        const q = config.datasets.flatMap(ds => ds.questions).find(q => q.id === id);
        if (q?.type === 'text-observation') {
            const observation = String(textObservations[id] ?? answers[id] ?? '');
            const wellbeingResult = scanWellbeingText(observation);
            if (wellbeingResult.isBlocked) {
                setBlockedMatch(wellbeingResult.match);
                if (config.enableChat) setIsChatOpen(true);
                return;
            }
        }

        // For text-observation, copy current observation into answers if not already
        setState(prev => {
            const newAnswers = { ...prev.answers };
            if (q?.type === 'text-observation' && prev.textObservations[id]) {
                newAnswers[id] = prev.textObservations[id];
            }
            return {
                ...prev,
                answers: newAnswers,
                submitted: { ...prev.submitted, [id]: true },
            };
        });
    };

    const currentDs = config.datasets[currentDataset];
    const allQuestionsSubmitted =
        currentDs?.questions.every(q => submitted[q.id]) ?? false;

    const handleNextDataset = () => {
        if (currentDataset < config.datasets.length - 1) {
            setState(prev => ({ ...prev, currentDataset: prev.currentDataset + 1 }));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            setState(prev => ({ ...prev, phase: 'results' }));
        }
    };

    const handlePrevDataset = () => {
        if (currentDataset > 0) {
            setState(prev => ({ ...prev, currentDataset: prev.currentDataset - 1 }));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleComplete = async () => {
        // Eén bron voor de uitkomst: het eindscherm, de docentrapportage en het
        // wissen van de opslag gebruiken allemaal `missionPassed`, zodat 'Gehaald'
        // op het scherm nooit iets anders betekent dan wat er wordt vastgelegd.
        const passed = missionPassed;
        // Pas wissen als de missie ook echt gehaald én vastgelegd is: bij een
        // mislukte serveropslag of een score onder de drempel raakt een leerling
        // zijn werk anders kwijt terwijl hij nog verder kan.
        const completed = await onComplete(passed, toScorePercent(totalScore, config.maxScore));
        if (passed && completed !== false) {
            clearSave();
        }
    };

    /** Uitweg uit het eindscherm: opnieuw beginnen met een lege staat. */
    const handleRetryMission = () => {
        clearSave();
        setState(INITIAL_STATE);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Phase breakdown for CompletionScreen
    const phaseScores = config.datasets.map(ds => {
        const max = ds.questions.reduce((s, q) => s + q.points, 0) + (ds.followUp?.bonusPoints ?? 0);
        const score = ds.questions.reduce((s, q) => (submitted[q.id] ? s + scoreQuestion(q, answers) : s), 0)
            + (followUpAnswered[ds.id] && followUpCorrect[ds.id] && ds.followUp ? ds.followUp.bonusPoints : 0);

        return {
            icon: ds.type === 'table' ? '📊' : ds.type === 'document-cards' ? '📰' : '📈',
            title: ds.title,
            score: clampScore(score, max),
            max,
        };
    });

    if (phase === 'intro') {
        return (
            <IntroScreen
                missionId={config.missionId}
                emoji={config.introEmoji}
                title={config.introTitle}
                description={config.introDescription}
                goal={missionGoal}
                features={config.introFeatures}
                wellbeingSupport={config.showWellbeingSupport}
                onStart={() => setState(prev => ({ ...prev, phase: 'explore' }))}
            />
        );
    }

    if (phase === 'results') {
        return (
            // Bewust GEEN onRetry op CompletionScreen: de vragen zijn na bevestigen
            // definitief, dus opnieuw proberen wist alles. Blijft de afrondknop de
            // primaire knop, dan kan een leerling onder de drempel toch afronden met
            // behoud van zijn score (er wordt niets als 'gehaald' geregistreerd). Wie
            // wél opnieuw wil, gebruikt de knop in de drempelmelding hieronder; de
            // terugknop (nakijken) is de derde uitweg. Alle drie gelden ook voor een
            // opgeslagen results-fase die na herladen weer op dit scherm uitkomt.
            <div className="min-h-screen bg-duck-bg">
                <div className="max-w-lg mx-auto px-4 pt-6">
                    <button
                        onClick={() => setState(prev => ({ ...prev, phase: 'explore' }))}
                        className="flex items-center gap-1.5 min-h-[44px] px-1 text-xs text-duck-ink/75 hover:text-duck-ink transition-colors"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        <ChevronLeft size={14} />
                        Terug naar de datasets
                    </button>

                    {!missionPassed && scoreThreshold !== null && (
                        <div
                            data-qa="data-viewer-threshold-notice"
                            role="status"
                            className="mt-4 rounded-2xl border-2 border-duck-ink bg-white p-4"
                        >
                            <p
                                className="text-sm font-black text-duck-ink"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                Nog niet gehaald — je hebt {Math.round(scoreThreshold)} van de {config.maxScore} punten nodig.
                            </p>
                            <p
                                className="mt-1 text-xs text-duck-ink/70"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                Je staat nu op {totalScore}. Je antwoorden blijven bewaard — je kunt ze
                                nakijken met de knop hierboven, of opnieuw beginnen voor een hogere score.
                            </p>
                            <button
                                data-qa="data-viewer-retry"
                                onClick={handleRetryMission}
                                className="mt-3 w-full min-h-[44px] rounded-full bg-duck-acid py-2.5 text-sm font-black text-duck-ink transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                Opnieuw proberen
                            </button>
                        </div>
                    )}
                </div>
                <CompletionScreen
                    score={totalScore}
                    maxScore={config.maxScore}
                    badges={config.badges}
                    phases={phaseScores}
                    takeaways={config.takeaways}
                    onComplete={handleComplete}
                    passScorePercent={scoreThreshold !== null && config.maxScore > 0
                        ? Math.round((scoreThreshold / config.maxScore) * 100)
                        : undefined}
                    passed={missionPassed}
                />
            </div>
        );
    }

    // Vangnet: wijst de herstelde index buiten de huidige config, toon een herstart
    // in plaats van een wit scherm.
    if (!currentDs) {
        return (
            <div className="min-h-screen bg-duck-bg flex items-center justify-center p-4">
                <div className="text-center max-w-sm">
                    <p
                        className="text-sm text-duck-ink/75 mb-4 leading-relaxed"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Deze missie is bijgewerkt sinds je laatste bezoek, dus je oude voortgang past er niet meer op. Je begint opnieuw.
                    </p>
                    <button
                        onClick={() => {
                            clearSave();
                            setState(INITIAL_STATE);
                        }}
                        className="min-h-[44px] px-4 py-2.5 bg-duck-acid text-duck-ink rounded-xl text-sm font-bold"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Opnieuw beginnen
                    </button>
                </div>
            </div>
        );
    }

    // Explore phase
    const totalPhases = config.datasets.length;

    return (
        <div className="min-h-screen bg-duck-bg">
            {(showHulplijn || blockedMatch) && (
                <WellbeingAlert
                    match={blockedMatch ?? wellbeingMatch}
                    teacherNotified={teacherAlert.notifiedFor((blockedMatch ?? wellbeingMatch)?.category)}
                    onDismiss={() => {
                        dismissHulplijn();
                        setBlockedMatch(null);
                    }}
                />
            )}

            <div className="max-w-lg mx-auto px-4 py-6">
                <PhaseHeader
                    currentPhase={currentDataset}
                    totalPhases={totalPhases}
                    totalScore={totalScore}
                    onBack={onBack}
                />

                <DatasetView
                    dataset={currentDs}
                    answers={answers}
                    submitted={submitted}
                    textObservations={textObservations}
                    confidences={confidences}
                    followUpAnswered={followUpAnswered}
                    onAnswer={handleAnswer}
                    onTextObservation={handleTextObservation}
                    onConfidence={handleConfidence}
                    onSubmit={handleSubmitQuestion}
                    onFollowUpAnswer={handleFollowUpAnswer}
                    onFollowUpComplete={handleFollowUpComplete}
                    allSubmitted={allQuestionsSubmitted}
                    onNext={handleNextDataset}
                    isLast={currentDataset === config.datasets.length - 1}
                    datasetIndex={currentDataset}
                    totalDatasets={config.datasets.length}
                />

                {/* Back to previous dataset */}
                {currentDataset > 0 && (
                    <button
                        onClick={handlePrevDataset}
                        className="mt-3 flex items-center gap-1.5 min-h-[44px] px-1 text-xs text-duck-ink/75 hover:text-duck-ink transition-colors"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        <ChevronLeft size={14} />
                        Vorige dataset
                    </button>
                )}
            </div>

            {/* AI Chat overlay */}
            {config.enableChat && (
                <>
                    <StudentAIChat
                        roleId={config.chatRoleId ?? 'student-assistant'}
                        userIdentifier={userId ?? 'anonymous'}
                        isOpen={isChatOpen}
                        onOpenChange={setIsChatOpen}
                        context={{
                            currentDataset: {
                                title: currentDs?.title,
                                description: currentDs?.description,
                            },
                            progress: {
                                dataset: currentDataset + 1,
                                total: config.datasets.length,
                                score: totalScore,
                                maxScore: config.maxScore,
                            },
                        }}
                    />
                    {!isChatOpen && (
                        <button
                            onClick={() => setIsChatOpen(true)}
                            className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-duck-acid to-duck-acid text-duck-ink shadow-lg transition-all duration-200 hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2 active:scale-95"
                            aria-label="Open AI-assistent"
                        >
                            <MessageCircle size={22} />
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

// ── Allowlist ────────────────────────────────────────────────────────────────
const VALID_DATA_VIEWER_IDS: ReadonlySet<string> = new Set([
    'api-verkenner',
    'dashboard-designer',
    'data-journalist',
    'data-pipeline',
    'digital-divide-researcher',
    'eindproject-j2',
    'ml-trainer',
    'network-navigator',
    'neural-navigator',
    'research-project',
    'spreadsheet-specialist',
    'sustainability-scanner',
    'tech-impact-analyst',
    'ux-detective',
    'welzijnsonderzoeker',
]);

// ── Public entry point — loads config dynamically ────────────────────────────

const LoadingScreen = () => (
    <div className="min-h-screen bg-duck-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-duck-acid border-t-transparent" />
    </div>
);

export const DataViewer: React.FC<TemplateMissionProps> = ({ missionId, onBack, onComplete }) => {
    const [config, setConfig] = useState<DataViewerConfig | null>(null);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        if (!VALID_DATA_VIEWER_IDS.has(missionId)) { setLoadError(true); return; }
        import(`./configs/${missionId}.ts`)
            .then((mod) => {
                const cfg = mod.default ?? Object.values(mod).find((v): v is DataViewerConfig => !!v && typeof v === 'object' && 'missionId' in v);
                if (cfg) setConfig(cfg);
                else setLoadError(true);
            })
            .catch(() => setLoadError(true));
    }, [missionId]);

    if (loadError) return (
        <div className="min-h-screen bg-duck-bg flex items-center justify-center p-4">
            <div className="text-center">
                <p className="text-duck-ink/75 mb-4" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                    Config niet gevonden: {missionId}
                </p>
                <button onClick={onBack} className="px-4 py-2 bg-duck-acid text-duck-ink rounded-xl text-sm font-bold">Terug</button>
            </div>
        </div>
    );
    if (!config) return <LoadingScreen />;

    return <DataViewerInner config={config} missionId={missionId} onBack={onBack} onComplete={onComplete} />;
};
