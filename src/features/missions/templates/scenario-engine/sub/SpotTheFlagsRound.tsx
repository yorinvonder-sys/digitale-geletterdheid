import React from 'react';
import { Check, X, Paperclip, Link2 } from 'lucide-react';
import type { ScenarioItem, ScenarioRound } from '../types';
import { RoundInstruction } from './RoundInstruction';

const FONT = "'Outfit', system-ui, sans-serif";

interface Props {
    round: ScenarioRound;
    selections: number[];
    submitted: boolean;
    onToggle: (id: number) => void;
    onSubmit: () => void;
}

const stateFor = (item: ScenarioItem, selections: number[], submitted: boolean) => {
    const isSelected = selections.includes(item.id);
    const isWrong = submitted && ((isSelected && !item.correct) || (!isSelected && item.correct));
    const feedbackText = isWrong && item.wrongFeedback ? item.wrongFeedback : item.explanation;
    return { isSelected, isWrong, feedbackText };
};

interface FlagProps {
    item: ScenarioItem;
    selections: number[];
    submitted: boolean;
    onToggle: (id: number) => void;
}

/** Compacte, inline aanklikbare vlag — voor afzender/onderwerp/metaregel. */
const InlineFlag: React.FC<FlagProps> = ({ item, selections, submitted, onToggle }) => {
    const { isSelected, feedbackText } = stateFor(item, selections, submitted);
    let ring = 'border-transparent';
    if (isSelected && !submitted) ring = 'border-duck-acid bg-duck-acid/10';
    if (submitted && isSelected && item.correct) ring = 'border-duck-ink bg-duck-ink/5';
    if (submitted && isSelected && !item.correct) ring = 'border-duck-error bg-duck-acid/10';
    if (submitted && !isSelected && item.correct) ring = 'border-duck-ink/40 bg-duck-ink/5';

    return (
        <span className="inline-flex flex-col align-top">
            <button
                type="button"
                data-qa="scenario-option"
                data-scenario-item-id={item.id}
                onClick={() => !submitted && onToggle(item.id)}
                disabled={submitted}
                aria-pressed={isSelected}
                aria-label={`Verdacht onderdeel: ${item.title}`}
                className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border-2 px-2.5 py-1.5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid/40 ${ring}`}
            >
                <span className="text-sm font-bold text-duck-ink break-words" style={{ fontFamily: FONT }}>
                    {item.title}
                </span>
                {submitted && isSelected && (
                    item.correct
                        ? <Check size={14} className="shrink-0 text-duck-ink" />
                        : <X size={14} className="shrink-0 text-duck-ink/70" />
                )}
                {submitted && !isSelected && item.correct && (
                    <span className="shrink-0 text-[10px] text-duck-ink font-bold">gemist!</span>
                )}
            </button>
            {submitted && (isSelected || item.correct) && (
                <p className="text-[11px] text-duck-ink/70 mt-1 italic max-w-[16rem]" style={{ fontFamily: FONT }}>
                    {feedbackText}
                </p>
            )}
        </span>
    );
};

/** Volledige kaart — voor onderdelen in de mailtekst, links en bijlagen. */
const CardFlag: React.FC<FlagProps & { variant: 'body' | 'link' | 'attachment' }> = ({ item, variant, selections, submitted, onToggle }) => {
    const { isSelected, feedbackText } = stateFor(item, selections, submitted);
    let border = 'border-duck-gray';
    let bg = 'bg-white';

    if (isSelected && !submitted) { border = 'border-duck-acid ring-1 ring-duck-acid/20'; bg = 'bg-duck-acid/5'; }
    if (submitted && isSelected && item.correct) { border = 'border-duck-ink'; bg = 'bg-duck-ink/5'; }
    if (submitted && isSelected && !item.correct) { border = 'border-duck-error'; bg = 'bg-duck-acid/10'; }
    if (submitted && !isSelected && item.correct) { border = 'border-duck-ink/40'; bg = 'bg-duck-ink/5'; }
    if (submitted && !isSelected && !item.correct) { bg = 'bg-duck-gray'; }

    return (
        <button
            type="button"
            data-qa="scenario-option"
            data-scenario-item-id={item.id}
            onClick={() => !submitted && onToggle(item.id)}
            disabled={submitted}
            aria-pressed={isSelected}
            aria-label={`Verdacht onderdeel: ${item.title}`}
            className={`w-full min-h-[44px] p-3 rounded-2xl border-2 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid/40 ${border} ${bg}`}
        >
            <div className="flex items-start gap-2.5">
                {variant === 'link' && <Link2 size={16} className="shrink-0 text-duck-ink/60 mt-0.5" />}
                {variant === 'attachment' && <Paperclip size={16} className="shrink-0 text-duck-ink/60 mt-0.5" />}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="min-w-0 max-w-full text-sm font-bold text-duck-ink break-words" style={{ fontFamily: FONT }}>
                            {item.title}
                        </span>
                        {isSelected && !submitted && (
                            <span className="shrink-0 text-[10px] bg-duck-acid/10 text-duck-ink px-2 py-0.5 rounded-full font-bold">aangewezen</span>
                        )}
                        {submitted && isSelected && (
                            item.correct
                                ? <Check size={14} className="shrink-0 text-duck-ink" />
                                : <X size={14} className="shrink-0 text-duck-ink/70" />
                        )}
                        {submitted && !isSelected && item.correct && (
                            <span className="shrink-0 text-[10px] text-duck-ink font-bold">gemist!</span>
                        )}
                    </div>
                    <p className="text-xs text-duck-ink/70 leading-relaxed mt-0.5" style={{ fontFamily: FONT }}>
                        {item.description}
                    </p>
                    {submitted && (isSelected || item.correct) && (
                        <p className="text-[11px] text-duck-ink/70 mt-2 italic" style={{ fontFamily: FONT }}>
                            {feedbackText}
                        </p>
                    )}
                </div>
            </div>
        </button>
    );
};

/**
 * Speelse variant van SelectCorrectRound: dezelfde selectie- en scorelogica,
 * maar de items worden getekend als aanklikbare onderdelen ín een nagebootste
 * mail in plaats van als losse kaartjes.
 */
export const SpotTheFlagsRound: React.FC<Props> = ({ round, selections, submitted, onToggle, onSubmit }) => {
    const frame = round.emailFrame;
    const items = round.items;

    const correctCount = items.filter((item) => item.correct).length;
    // Zie SelectCorrectRound: de drempel mag nooit gelijk zijn aan het aantal
    // juiste antwoorden, anders verklapt hij het antwoord.
    const minSelections = Math.max(1, round.minSelections ?? 1);
    const canSubmit = selections.length >= minSelections;
    const mayShowTarget = round.minSelections !== undefined && round.minSelections !== correctCount;
    const instruction = round.selectionInstruction
        ?? (mayShowTarget
            ? `Wijs minimaal ${minSelections} verdachte onderdelen aan`
            : 'Tik alle onderdelen aan die volgens jou verdacht zijn');

    const bySlot = (slot: ScenarioItem['flagSlot']) => items.filter((item) => item.flagSlot === slot);
    const bodyItems = bySlot('body');
    // Onderdelen zonder plek in de mail horen niet ín het bericht: dat zijn
    // meldingen die via een ander kanaal binnenkwamen. Ze krijgen een eigen blok
    // onder de mail, anders lijken ze ten onrechte deel van dezelfde mail.
    const asideItems = items.filter((item) => item.flagSlot === undefined);
    const linkItems = bySlot('link');
    const attachmentItems = bySlot('attachment');
    const fromItems = bySlot('from');
    const subjectItems = bySlot('subject');
    const metaItems = bySlot('meta');

    return (
        <>
            {!submitted && (
                <RoundInstruction
                    icon="🔍"
                    action={instruction}
                    hint="Tik op een onderdeel om het te markeren. Nog een keer tikken maakt het ongedaan."
                />
            )}

            {frame && (
                <div className="max-w-md w-full rounded-2xl border-2 border-duck-gray bg-white overflow-hidden mt-4">
                    <div className="p-4 border-b border-duck-gray space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-black text-duck-ink/50 uppercase tracking-widest shrink-0" style={{ fontFamily: FONT }}>
                                Van
                            </span>
                            {fromItems.length > 0
                                ? fromItems.map((item) => <InlineFlag key={item.id} item={item} selections={selections} submitted={submitted} onToggle={onToggle} />)
                                : <span className="text-sm font-bold text-duck-ink" style={{ fontFamily: FONT }}>{frame.fromName}</span>}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-black text-duck-ink/50 uppercase tracking-widest shrink-0" style={{ fontFamily: FONT }}>
                                Onderwerp
                            </span>
                            {subjectItems.length > 0
                                ? subjectItems.map((item) => <InlineFlag key={item.id} item={item} selections={selections} submitted={submitted} onToggle={onToggle} />)
                                : <span className="text-sm font-bold text-duck-ink" style={{ fontFamily: FONT }}>{frame.subject}</span>}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] text-duck-ink/50 shrink-0" style={{ fontFamily: FONT }}>
                                {frame.receivedLabel}
                            </span>
                            {metaItems.map((item) => <InlineFlag key={item.id} item={item} selections={selections} submitted={submitted} onToggle={onToggle} />)}
                        </div>
                    </div>

                    <div className="p-4 space-y-3">
                        {frame.body.map((paragraph, index) => (
                            <p key={index} className="text-sm text-duck-ink/90 leading-relaxed break-words" style={{ fontFamily: FONT }}>
                                {paragraph}
                            </p>
                        ))}
                        {bodyItems.length > 0 && (
                            <div className="grid gap-2.5 pt-1">
                                {bodyItems.map((item) => <CardFlag key={item.id} item={item} variant="body" selections={selections} submitted={submitted} onToggle={onToggle} />)}
                            </div>
                        )}
                        {linkItems.length > 0 && (
                            <div className="grid gap-2.5 pt-1">
                                {linkItems.map((item) => <CardFlag key={item.id} item={item} variant="link" selections={selections} submitted={submitted} onToggle={onToggle} />)}
                            </div>
                        )}
                    </div>

                    {attachmentItems.length > 0 && (
                        <div className="p-4 border-t border-duck-gray grid gap-2.5">
                            {attachmentItems.map((item) => <CardFlag key={item.id} item={item} variant="attachment" selections={selections} submitted={submitted} onToggle={onToggle} />)}
                        </div>
                    )}
                </div>
            )}

            {/* Vangnet: zonder mail-omlijsting valt de ronde terug op losse kaarten,
                zodat een config zonder `emailFrame` speelbaar blijft. */}
            {(!frame || asideItems.length > 0) && (
                <div className="mt-4 grid gap-2.5">
                    {frame && asideItems.length > 0 && (
                        <p
                            className="text-[10px] font-black text-duck-ink/50 uppercase tracking-widest"
                            style={{ fontFamily: FONT }}
                        >
                            Ook binnengekomen — via een ander kanaal
                        </p>
                    )}
                    {(frame ? asideItems : items).map((item) => (
                        <CardFlag key={item.id} item={item} variant="body" selections={selections} submitted={submitted} onToggle={onToggle} />
                    ))}
                </div>
            )}

            {!submitted && selections.length > 0 && (
                <p
                    className="text-center text-xs text-duck-ink/70 mb-3 mt-4"
                    style={{ fontFamily: FONT }}
                >
                    {mayShowTarget
                        ? `${selections.length} van minimaal ${minSelections} onderdelen aangewezen`
                        : `${selections.length} ${selections.length === 1 ? 'onderdeel' : 'onderdelen'} aangewezen`}
                </p>
            )}
            {!submitted && (
                <button
                    data-qa="scenario-submit"
                    onClick={onSubmit}
                    disabled={!canSubmit}
                    className={`w-full py-3 mt-4 rounded-full font-black text-sm transition-all duration-300 ${
                        canSubmit
                            ? 'bg-duck-acid hover:bg-duck-acid hover:brightness-95 hover:shadow-md active:scale-[0.98] text-duck-ink'
                            : 'bg-duck-gray text-duck-ink/70 cursor-not-allowed'
                    }`}
                    style={{ fontFamily: FONT }}
                >
                    Controleer mijn keuze
                </button>
            )}
        </>
    );
};
