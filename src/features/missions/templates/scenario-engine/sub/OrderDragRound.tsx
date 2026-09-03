import React from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { ArrowDown, ArrowUp, Check, GripVertical } from 'lucide-react';
import type { ScenarioRound } from '../types';
import { RoundInstruction } from './RoundInstruction';
import { getLearnerSeed } from './OrderPriorityRound';

const ScenarioIcon = ({ icon, className }: { icon: string; className: string }) => (
    icon.startsWith('/assets/') ? (
        <img src={icon} alt="" className={`shrink-0 object-contain ${className}`} width={24} height={24} loading="lazy" decoding="async" />
    ) : (
        <span className={className}>{icon}</span>
    )
);

/** Eenvoudige, deterministische stringhash (FNV-1a-achtig) — geen Math.random. */
const hashSeed = (seed: string): number => {
    let h = 2166136261;
    for (let i = 0; i < seed.length; i++) {
        h ^= seed.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
};

/** De antwoordvolgorde: item-ids gesorteerd op `correctPosition`. */
const answerOrderIds = (items: ScenarioRound['items']): number[] =>
    [...items]
        .sort((a, b) => (a.correctPosition ?? 0) - (b.correctPosition ?? 0))
        .map((it) => it.id);

/**
 * Bouwt een deterministische startvolgorde uit de item-ids zelf (geen
 * Math.random, zodat de volgorde na herladen exact hetzelfde terugkomt —
 * de voortgang wordt opgeslagen). De seed van de leerling gaat mee in de
 * hash: zonder dat kreeg iedere leerling en iedere poging exact dezelfde
 * startvolgorde en kon één leerling de reeks zetten doorgeven aan de klas —
 * hetzelfde lek dat OrderPriorityRound al dichtzette. Veel configs zetten de
 * items al in de juiste volgorde; wijkt de hash-volgorde toevallig niet af
 * van het antwoord, dan keren we hem om.
 *
 * Omkeren en niet één plek roteren: bij een rotatie staat élke kaart precies
 * één plek naast zijn plek, en `scoreOrderPriority` beloont een buurpositie met
 * een halve punt. Een leerling die niets doet zou dan de helft van de punten
 * krijgen. Na omkeren staan de kaarten ver van hun plek en levert nietsdoen
 * vrijwel niets op.
 */
const buildStartOrder = (round: ScenarioRound, learnerSeed: string): number[] => {
    if (round.items.length < 2) return round.items.map((it) => it.id);
    const scrambled = [...round.items]
        .sort((a, b) => hashSeed(`${learnerSeed}:${round.id}:${a.id}`) - hashSeed(`${learnerSeed}:${round.id}:${b.id}`))
        .map((it) => it.id);
    const answer = answerOrderIds(round.items);
    const matchesAnswer = scrambled.every((id, i) => id === answer[i]);
    return matchesAnswer ? scrambled.reverse() : scrambled;
};

interface Props {
    round: ScenarioRound;
    selections: number[];
    submitted: boolean;
    onReorder: (order: number[]) => void;
    onSubmit: () => void;
}

interface CardRowProps {
    itemId: number;
    round: ScenarioRound;
    submitted: boolean;
    currentIndex: number;
    totalItems: number;
    onMove: (id: number, direction: -1 | 1) => void;
}

const CardRow: React.FC<CardRowProps> = ({ itemId, round, submitted, currentIndex, totalItems, onMove }) => {
    const item = round.items.find((it) => it.id === itemId);
    const controls = useDragControls();
    if (!item) return null;
    const isCorrect = submitted && item.correctPosition === currentIndex;

    return (
        <Reorder.Item
            data-qa="scenario-drag-item"
            data-scenario-item-id={itemId}
            value={itemId}
            dragListener={false}
            dragControls={controls}
            className={`flex items-start gap-2 p-3 rounded-xl border-2 transition-all duration-300 select-none ${
                submitted
                    ? isCorrect
                        ? 'bg-duck-ink/10 border-duck-ink'
                        : 'bg-duck-error/10 border-duck-error'
                    : 'bg-white border-duck-gray'
            }`}
        >
            <div
                onPointerDown={submitted ? undefined : (e) => controls.start(e)}
                className={`min-h-[44px] min-w-[32px] mt-0.5 inline-flex items-center justify-center text-duck-ink/70 shrink-0 ${submitted ? '' : 'cursor-grab active:cursor-grabbing'}`}
                style={{ touchAction: 'none' }}
                aria-hidden="true"
            >
                <GripVertical size={16} />
            </div>

            <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 ${
                    submitted
                        // Wit haalt op duck-error maar 3,6:1; duck-ink haalt 4,6:1.
                        ? isCorrect ? 'bg-duck-ink text-white' : 'bg-duck-error text-duck-ink'
                        : 'bg-duck-acid/20 text-duck-ink'
                }`}
            >
                {currentIndex + 1}
            </span>

            <ScenarioIcon icon={item.icon} className="h-6 w-6 text-lg mt-0.5" />

            <div className="flex-1 min-w-0">
                <p
                    className="text-sm font-bold text-duck-ink"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {item.title}
                </p>
                <p
                    className="text-xs text-duck-ink/70 line-clamp-3"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {item.description}
                </p>
                {submitted && (
                    <p
                        className="text-xs text-duck-ink/70 italic mt-1"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        {item.explanation}
                    </p>
                )}
            </div>

            {submitted && (
                isCorrect
                    ? <Check size={14} className="text-duck-ink shrink-0 mt-0.5" />
                    : (
                        <span className="text-[10px] text-duck-ink/70 shrink-0 mt-0.5">
                            (#{(item.correctPosition ?? 0) + 1})
                        </span>
                    )
            )}

            {!submitted && (
                <div className="flex flex-col shrink-0 gap-1">
                    <button
                        data-qa="scenario-drag-up"
                        data-scenario-item-id={itemId}
                        type="button"
                        onClick={() => onMove(itemId, -1)}
                        disabled={currentIndex === 0}
                        aria-label={`${item.title} omhoog verplaatsen`}
                        className="grid min-h-[44px] min-w-[44px] place-items-center rounded-lg border border-duck-gray text-duck-ink/70 transition-colors hover:border-duck-acid hover:text-duck-ink disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid/40"
                    >
                        <ArrowUp size={14} />
                    </button>
                    <button
                        data-qa="scenario-drag-down"
                        data-scenario-item-id={itemId}
                        type="button"
                        onClick={() => onMove(itemId, 1)}
                        disabled={currentIndex === totalItems - 1}
                        aria-label={`${item.title} omlaag verplaatsen`}
                        className="grid min-h-[44px] min-w-[44px] place-items-center rounded-lg border border-duck-gray text-duck-ink/70 transition-colors hover:border-duck-acid hover:text-duck-ink disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid/40"
                    >
                        <ArrowDown size={14} />
                    </button>
                </div>
            )}
        </Reorder.Item>
    );
};

export const OrderDragRound: React.FC<Props> = ({ round, selections, submitted, onReorder, onSubmit }) => {
    /**
     * De werkvolgorde wordt tijdens het renderen afgeleid, niet in een effect.
     * Dat is hier wezenlijk om twee redenen.
     *
     * 1. Een leerling die deze ronde nog in de oude aanklik-vorm heeft
     *    opgeslagen, heeft mogelijk een HALVE volgorde staan (hij had er drie
     *    van de vijf aangeklikt). Zou de opgeslagen lijst leidend zijn, dan
     *    toonde de sleepronde alleen díe drie kaarten, was inzenden onmogelijk
     *    en zat die leerling muurvast in een missie die hij niet kan afmaken.
     *    Ontbrekende kaarten worden daarom altijd achteraan aangevuld.
     * 2. Zou de startvolgorde pas ná het schilderen door een effect worden
     *    gezet, dan is de configvolgorde één beeld lang zichtbaar — en die is
     *    in veel configs precies het juiste antwoord.
     */
    const learnerSeed = React.useMemo(() => getLearnerSeed(), []);
    const order = React.useMemo(() => {
        const known = new Set(round.items.map((it) => it.id));
        const seen = new Set<number>();
        const kept = selections.filter((id) => {
            if (!known.has(id) || seen.has(id)) return false;
            seen.add(id);
            return true;
        });
        if (kept.length === round.items.length) return kept;
        const missing = buildStartOrder(round, learnerSeed).filter((id) => !seen.has(id));
        return [...kept, ...missing];
    }, [round, selections, learnerSeed]);

    // Wijkt de werkvolgorde af van wat er is opgeslagen (verse ronde, of een
    // aangevulde halve volgorde uit de oude vorm), leg de herstelde volgorde
    // dan vast zodat opslag en beeld weer gelijklopen.
    React.useEffect(() => {
        if (submitted) return;
        const differs =
            order.length !== selections.length ||
            order.some((id, index) => selections[index] !== id);
        if (differs) onReorder(order);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order, submitted]);
    const instruction = round.orderInstruction ?? 'Sleep de kaarten in de juiste volgorde';

    const handleMove = (id: number, direction: -1 | 1) => {
        const index = order.indexOf(id);
        const nextIndex = index + direction;
        if (index < 0 || nextIndex < 0 || nextIndex >= order.length) return;
        const next = [...order];
        [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
        onReorder(next);
    };

    return (
        <div className="mt-4 max-w-md mx-auto">
            {!submitted && (
                <RoundInstruction
                    icon="↕️"
                    action={instruction}
                    hint="Bovenaan = eerste plek. Gebruik de greep links om te slepen, of de pijlknoppen op elke kaart."
                />
            )}

            <Reorder.Group
                axis="y"
                values={order}
                onReorder={submitted ? () => {} : onReorder}
                className="space-y-2"
            >
                {order.map((id, index) => (
                    <CardRow
                        key={id}
                        itemId={id}
                        round={round}
                        submitted={submitted}
                        currentIndex={index}
                        totalItems={order.length}
                        onMove={handleMove}
                    />
                ))}
            </Reorder.Group>

            {!submitted && order.length > 0 && order.length === round.items.length && (
                <button
                    data-qa="scenario-submit"
                    onClick={onSubmit}
                    className="w-full mt-4 py-3 rounded-full font-black text-sm bg-duck-acid hover:bg-duck-acid text-duck-ink transition-all duration-300"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Controleer volgorde
                </button>
            )}
        </div>
    );
};
