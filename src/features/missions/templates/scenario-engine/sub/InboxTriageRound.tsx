import React, { useRef, useState } from 'react';
import { motion, type PanInfo } from 'framer-motion';
import { Inbox, FolderCheck, Flag } from 'lucide-react';
import type { ScenarioRound } from '../types';
import { RoundInstruction } from './RoundInstruction';

const ScenarioIcon = ({ icon, className }: { icon: string; className: string }) => (
    icon.startsWith('/assets/') ? (
        <img src={icon} alt="" className={`shrink-0 object-contain ${className}`} width={24} height={24} loading="lazy" decoding="async" />
    ) : (
        <span className={className}>{icon}</span>
    )
);

interface Props {
    round: ScenarioRound;
    selections: number[];
    submitted: boolean;
    onChoice: (id: number, accepted: boolean) => void;
    onSubmit: () => void;
}

/** Compacte rij voor een bericht dat al in een bak ligt (vóór inzenden). Blijft aanpasbaar via de twee knoppen. */
const SortedRow: React.FC<{
    item: ScenarioRound['items'][number];
    accepted: boolean;
    acceptLabel: string;
    rejectLabel: string;
    onChoice: (id: number, accepted: boolean) => void;
    announce: (title: string, accepted: boolean) => void;
}> = ({ item, accepted, acceptLabel, rejectLabel, onChoice, announce }) => (
    <div className="rounded-lg bg-white/70 border border-duck-gray px-2 py-1.5">
        <div className="flex items-center gap-2 mb-1.5">
            <ScenarioIcon icon={item.icon} className="h-4 w-4 text-sm shrink-0" />
            <span
                className="flex-1 text-[11px] font-bold text-duck-ink truncate"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                {item.title}
            </span>
        </div>
        <div className="flex gap-1.5">
            <button
                data-qa="scenario-binary-accept"
                data-scenario-item-id={item.id}
                aria-label={`Markeer als ${acceptLabel.toLowerCase()}: ${item.title}`}
                aria-pressed={accepted}
                onClick={() => { onChoice(item.id, true); announce(item.title, true); }}
                className={`flex-1 min-h-[44px] py-1 rounded-lg text-[11px] font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid/40 ${
                    accepted
                        ? 'bg-duck-acid text-duck-ink'
                        : 'bg-duck-bg text-duck-ink/70 hover:bg-duck-acid/10 hover:text-duck-ink border border-duck-gray'
                }`}
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                ✓ {acceptLabel}
            </button>
            <button
                data-qa="scenario-binary-reject"
                data-scenario-item-id={item.id}
                aria-label={`Markeer als ${rejectLabel.toLowerCase()}: ${item.title}`}
                aria-pressed={!accepted}
                onClick={() => { onChoice(item.id, false); announce(item.title, false); }}
                className={`flex-1 min-h-[44px] py-1 rounded-lg text-[11px] font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink/30 ${
                    !accepted
                        ? 'bg-duck-ink text-white'
                        : 'bg-duck-bg text-duck-ink/70 hover:bg-duck-ink/10 hover:text-duck-ink border border-duck-gray'
                }`}
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                ✕ {rejectLabel}
            </button>
        </div>
    </div>
);

export const InboxTriageRound: React.FC<Props> = ({ round, selections, submitted, onChoice, onSubmit }) => {
    const acceptedIds = new Set(selections.filter((id) => id > 0));
    const rejectedIds = new Set(selections.filter((id) => id < 0).map((id) => -id));
    const allAnswered = (acceptedIds.size + rejectedIds.size) === round.items.length;
    const acceptLabel = round.acceptLabel ?? 'Vertrouwen';
    const rejectLabel = round.rejectLabel ?? 'Verdacht';

    const acceptZoneRef = useRef<HTMLDivElement>(null);
    const rejectZoneRef = useRef<HTMLDivElement>(null);
    const [dragOverZone, setDragOverZone] = useState<'accept' | 'reject' | null>(null);
    const [liveMessage, setLiveMessage] = useState('');

    const announce = (title: string, accepted: boolean) => {
        setLiveMessage(`${title} is gesorteerd naar ${accepted ? acceptLabel : rejectLabel}.`);
    };

    const zoneUnderPoint = (info: PanInfo): 'accept' | 'reject' | null => {
        const point = { x: info.point.x, y: info.point.y };
        const acceptRect = acceptZoneRef.current?.getBoundingClientRect();
        const rejectRect = rejectZoneRef.current?.getBoundingClientRect();
        if (acceptRect && point.x >= acceptRect.left && point.x <= acceptRect.right && point.y >= acceptRect.top && point.y <= acceptRect.bottom) {
            return 'accept';
        }
        if (rejectRect && point.x >= rejectRect.left && point.x <= rejectRect.right && point.y >= rejectRect.top && point.y <= rejectRect.bottom) {
            return 'reject';
        }
        return null;
    };

    const handleDrag = (_e: unknown, info: PanInfo) => {
        setDragOverZone(zoneUnderPoint(info));
    };

    const handleDragEnd = (item: ScenarioRound['items'][number], info: PanInfo) => {
        const zone = zoneUnderPoint(info);
        setDragOverZone(null);
        if (zone === 'accept') {
            onChoice(item.id, true);
            announce(item.title, true);
        } else if (zone === 'reject') {
            onChoice(item.id, false);
            announce(item.title, false);
        }
    };

    const acceptedItems = round.items.filter((item) => acceptedIds.has(item.id));
    const rejectedItems = round.items.filter((item) => rejectedIds.has(item.id));
    const unsortedItems = round.items.filter((item) => !acceptedIds.has(item.id) && !rejectedIds.has(item.id));

    return (
        <>
            <div aria-live="polite" className="sr-only">{liveMessage}</div>

            {!submitted && (
                <RoundInstruction
                    icon="📥"
                    action={`Sorteer elk bericht: "${acceptLabel}" of "${rejectLabel}"`}
                    hint="Sleep een bericht naar een bak of gebruik de knoppen — je keuze kun je aanpassen tot je inzendt."
                />
            )}

            {!submitted && (
                <div className="grid grid-cols-2 gap-2 mb-4 mt-4">
                    <div
                        ref={acceptZoneRef}
                        className={`rounded-2xl border-2 border-dashed p-2 min-h-[90px] transition-colors duration-150 ${
                            dragOverZone === 'accept' ? 'border-duck-acid bg-duck-acid/20' : 'border-duck-gray bg-duck-bg'
                        }`}
                    >
                        <p
                            className="flex items-center gap-1 text-[11px] font-black text-duck-ink mb-1.5"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            <FolderCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                            {acceptLabel} ({acceptedItems.length})
                        </p>
                        <div className="space-y-1">
                            {acceptedItems.map((item) => (
                                <SortedRow
                                    key={item.id}
                                    item={item}
                                    accepted
                                    acceptLabel={acceptLabel}
                                    rejectLabel={rejectLabel}
                                    onChoice={onChoice}
                                    announce={announce}
                                />
                            ))}
                        </div>
                    </div>
                    <div
                        ref={rejectZoneRef}
                        className={`rounded-2xl border-2 border-dashed p-2 min-h-[90px] transition-colors duration-150 ${
                            dragOverZone === 'reject' ? 'border-duck-ink bg-duck-ink/10' : 'border-duck-gray bg-duck-bg'
                        }`}
                    >
                        <p
                            className="flex items-center gap-1 text-[11px] font-black text-duck-ink mb-1.5"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            <Flag className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                            {rejectLabel} ({rejectedItems.length})
                        </p>
                        <div className="space-y-1">
                            {rejectedItems.map((item) => (
                                <SortedRow
                                    key={item.id}
                                    item={item}
                                    accepted={false}
                                    acceptLabel={acceptLabel}
                                    rejectLabel={rejectLabel}
                                    onChoice={onChoice}
                                    announce={announce}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Postvak IN: echte inbox-lijst met kopbalk, rijen en dunne scheidingslijnen i.p.v. losse kaarten */}
            <div className="rounded-2xl border-2 border-duck-gray bg-white overflow-hidden mb-4">
                {!submitted && (
                    <div
                        className="flex items-center gap-1.5 px-3 py-2 bg-duck-bg border-b-2 border-duck-gray"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        <Inbox className="h-3.5 w-3.5 shrink-0 text-duck-ink" aria-hidden="true" />
                        <span className="text-[11px] font-black text-duck-ink">Postvak IN</span>
                        {unsortedItems.length > 0 && (
                            <span className="ml-auto text-[11px] font-bold text-duck-ink/70">
                                Nog {unsortedItems.length} te sorteren
                            </span>
                        )}
                    </div>
                )}
                <div className="divide-y divide-duck-gray">
                    {(submitted ? round.items : unsortedItems).map((item) => {
                        const isAccepted = acceptedIds.has(item.id);
                        const isRejected = rejectedIds.has(item.id);
                        const isAnswered = isAccepted || isRejected;
                        const isCorrectAnswer = item.correct === true ? isAccepted : isRejected;
                        const isWrong = submitted && isAnswered && !isCorrectAnswer;
                        const feedbackText = isWrong && item.wrongFeedback ? item.wrongFeedback : item.explanation;

                        return (
                            <motion.div
                                key={item.id}
                                data-qa="scenario-inbox-item"
                                data-scenario-item-id={item.id}
                                drag={!submitted}
                                dragMomentum={false}
                                dragElastic={0.15}
                                onDrag={submitted ? undefined : handleDrag}
                                onDragEnd={submitted ? undefined : (_e, info) => handleDragEnd(item, info)}
                                whileDrag={{ scale: 1.02, zIndex: 10 }}
                                style={{ touchAction: submitted ? undefined : 'none' }}
                                className={`px-3 py-2.5 transition-colors duration-200 ${
                                    submitted && isAnswered
                                        ? isCorrectAnswer
                                            ? 'bg-duck-ink/5'
                                            : 'bg-duck-acid/10'
                                        : 'bg-white cursor-grab active:cursor-grabbing'
                                }`}
                            >
                                <div className="flex items-start gap-2.5">
                                    <ScenarioIcon icon={item.icon} className="h-5 w-5 text-base mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                        <p
                                            className="text-sm font-bold text-duck-ink truncate"
                                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                        >
                                            {item.title}
                                        </p>
                                        <p
                                            className="text-xs text-duck-ink/60 truncate"
                                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                        >
                                            {item.description}
                                        </p>
                                    </div>
                                </div>

                                {!submitted && (
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            data-qa="scenario-binary-accept"
                                            data-scenario-item-id={item.id}
                                            aria-label={`Markeer als ${acceptLabel.toLowerCase()}: ${item.title}`}
                                            aria-pressed={isAccepted}
                                            onClick={() => { onChoice(item.id, true); announce(item.title, true); }}
                                            className={`flex-1 min-h-[44px] py-2 rounded-lg text-xs font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid/40 ${
                                                isAccepted
                                                    ? 'bg-duck-acid text-duck-ink'
                                                    : 'bg-duck-bg text-duck-ink/70 hover:bg-duck-acid/10 hover:text-duck-ink border border-duck-gray'
                                            }`}
                                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                        >
                                            ✓ {acceptLabel}
                                        </button>
                                        <button
                                            data-qa="scenario-binary-reject"
                                            data-scenario-item-id={item.id}
                                            aria-label={`Markeer als ${rejectLabel.toLowerCase()}: ${item.title}`}
                                            aria-pressed={isRejected}
                                            onClick={() => { onChoice(item.id, false); announce(item.title, false); }}
                                            className={`flex-1 min-h-[44px] py-2 rounded-lg text-xs font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink/30 ${
                                                isRejected
                                                    ? 'bg-duck-ink text-white'
                                                    : 'bg-duck-bg text-duck-ink/70 hover:bg-duck-ink/10 hover:text-duck-ink border border-duck-gray'
                                            }`}
                                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                        >
                                            ✕ {rejectLabel}
                                        </button>
                                    </div>
                                )}

                                {submitted && isAnswered && (
                                    <div
                                        className="mt-2 text-[11px] italic leading-relaxed text-duck-ink"
                                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                    >
                                        {isCorrectAnswer ? '✓ ' : '✕ '}
                                        {feedbackText}
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {!submitted && allAnswered && (
                <button
                    data-qa="scenario-submit"
                    onClick={onSubmit}
                    className="w-full py-3 rounded-full font-black text-sm bg-duck-acid hover:bg-duck-acid hover:brightness-95 hover:shadow-md active:scale-[0.98] text-duck-ink transition-all duration-300"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Controleer keuzes
                </button>
            )}
            {!submitted && !allAnswered && (
                <p
                    className="text-center text-xs text-duck-ink/70 mt-2"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Sleep elk bericht naar een bak of gebruik de knoppen om door te gaan
                </p>
            )}
        </>
    );
};
