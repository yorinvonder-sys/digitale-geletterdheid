import React from 'react';
import { Link2, Paperclip, MailOpen, Send } from 'lucide-react';
import type { ShiftMail, Vlag } from '../types';

const FONT = "'Outfit', system-ui, sans-serif";

interface Props {
    mail: ShiftMail | null;
    /** Onderdelen die de leerling nu heeft aangewezen. */
    bewijs: string[];
    onWijsAan: (vlagId: string) => void;
    /** De leerling pakt het bericht op en gaat het wegbrengen. */
    onNeemMee: () => void;
}

/** Twee letters uit een naam voor het avatarrondje, bv. "Meneer Smits" → "MS". */
const initialsFor = (name: string) => {
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return '?';
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

interface VlagChipProps {
    vlag: Vlag;
    aangewezen: boolean;
    onWijsAan: (vlagId: string) => void;
}

/**
 * Eén aanwijsbaar onderdeel, als klein aantikbaar label. Elk aangewezen
 * onderdeel krijgt dezelfde markeerstift-achtige markering — of het nu echt
 * verdacht is of niet. De leerling hoort dat pas in de nabespreking.
 */
const VlagChip: React.FC<VlagChipProps> = ({ vlag, aangewezen, onWijsAan }) => (
    <button
        type="button"
        data-qa="helpdesk-vlag"
        data-vlag-id={vlag.id}
        aria-pressed={aangewezen}
        aria-label={
            aangewezen
                ? `${vlag.tekst} — aangewezen, tik om dit weer los te laten`
                : `Wijs aan als verdacht: ${vlag.tekst}`
        }
        onClick={() => onWijsAan(vlag.id)}
        className={`inline-flex min-h-[44px] max-w-full items-center rounded-xl border-2 px-3 py-2 text-left text-sm font-bold break-words transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid/60 ${
            aangewezen
                ? 'border-duck-acid bg-duck-acid/50 text-duck-ink'
                : 'border-dashed border-duck-gray text-duck-ink/80 hover:bg-duck-gray/20'
        }`}
        style={{ fontFamily: FONT }}
    >
        {vlag.tekst}
    </button>
);

interface VlaggenRijProps {
    vlaggen: Vlag[];
    bewijs: string[];
    onWijsAan: (vlagId: string) => void;
}

/** Rij met alle aanwijsbare onderdelen op één plek in het bericht. */
const VlaggenRij: React.FC<VlaggenRijProps> = ({ vlaggen, bewijs, onWijsAan }) => {
    if (vlaggen.length === 0) return null;
    return (
        <div className="flex flex-wrap gap-2 pt-1">
            {vlaggen.map((vlag) => (
                <VlagChip key={vlag.id} vlag={vlag} aangewezen={bewijs.includes(vlag.id)} onWijsAan={onWijsAan} />
            ))}
        </div>
    );
};

/**
 * Het geopende bericht als nagebootste mail. De leerling wijst hier aan wat
 * hem verdacht lijkt en neemt het bericht daarna mee — kiezen is een plek
 * (het kantoor), geen knop hier. Zonder geopend bericht toont dit een
 * rustige lege staat.
 */
export const MailPane: React.FC<Props> = ({ mail, bewijs, onWijsAan, onNeemMee }) => {
    if (!mail) {
        return (
            <div className="w-full max-w-md rounded-2xl border-2 border-dashed border-duck-gray bg-white/60 px-4 py-10 text-center">
                <MailOpen size={28} className="mx-auto mb-2 text-duck-ink/30" />
                <p className="text-sm text-duck-ink/70" style={{ fontFamily: FONT }}>
                    Open een bericht uit de wachtrij
                </p>
            </div>
        );
    }

    const vlaggen = mail.vlaggen ?? [];
    const vlaggenOp = (plek: Vlag['plek']) => vlaggen.filter((v) => v.plek === plek);
    const aantalAangewezen = bewijs.filter((id) => vlaggen.some((v) => v.id === id)).length;

    return (
        <div className="w-full max-w-md rounded-2xl border-2 border-duck-gray bg-white overflow-hidden">
            <div className="p-4 border-b border-duck-gray space-y-2.5">
                <h2 className="text-base font-black text-duck-ink break-words" style={{ fontFamily: FONT }}>
                    {mail.subject}
                </h2>
                <VlaggenRij vlaggen={vlaggenOp('onderwerp')} bewijs={bewijs} onWijsAan={onWijsAan} />
                <div className="flex items-center gap-2.5">
                    <span className="shrink-0 flex items-center justify-center h-9 w-9 rounded-full bg-duck-acid text-duck-ink text-xs font-black" style={{ fontFamily: FONT }}>
                        {initialsFor(mail.fromName)}
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm text-duck-ink truncate" style={{ fontFamily: FONT }}>
                            {mail.fromName}
                        </p>
                        <p className="text-[11px] text-duck-ink/70 break-all" style={{ fontFamily: FONT }}>
                            {mail.fromAddress}
                        </p>
                    </div>
                </div>
                <VlaggenRij vlaggen={vlaggenOp('afzender')} bewijs={bewijs} onWijsAan={onWijsAan} />
            </div>

            <div className="p-4 space-y-3">
                {mail.body.map((paragraph, index) => (
                    <p key={index} className="text-sm text-duck-ink/90 leading-relaxed break-words whitespace-pre-line" style={{ fontFamily: FONT }}>
                        {paragraph}
                    </p>
                ))}
                <VlaggenRij vlaggen={vlaggenOp('tekst')} bewijs={bewijs} onWijsAan={onWijsAan} />

                {mail.link && (
                    <div className="pt-1 space-y-1.5">
                        {/* Nagebootste knop — geen navigatie, alleen visuele imitatie. */}
                        <button
                            type="button"
                            tabIndex={-1}
                            aria-hidden="true"
                            className="w-full flex items-center justify-center gap-2 rounded-full bg-duck-ink px-4 py-2.5 min-h-[44px] cursor-default"
                        >
                            <Link2 size={16} className="shrink-0 text-duck-bgLight" />
                            <span className="text-sm font-bold text-duck-bgLight break-words text-center" style={{ fontFamily: FONT }}>
                                {mail.link.label}
                            </span>
                        </button>
                        <p className="text-xs text-duck-ink/70 px-1 break-all" style={{ fontFamily: FONT }}>
                            {mail.link.destination}
                        </p>
                        <VlaggenRij vlaggen={vlaggenOp('link')} bewijs={bewijs} onWijsAan={onWijsAan} />
                    </div>
                )}
            </div>

            {mail.attachment && (
                <div className="p-4 border-t border-duck-gray space-y-2">
                    <div className="w-full p-3 rounded-2xl border-2 border-duck-gray bg-duck-gray/20">
                        <div className="flex items-center gap-3">
                            <span className="shrink-0 flex items-center justify-center h-9 w-9 rounded-lg bg-duck-gray/50">
                                <Paperclip size={16} className="text-duck-ink/70" />
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold text-duck-ink break-words" style={{ fontFamily: FONT }}>
                                    {mail.attachment.filename}
                                </p>
                                <p className="text-xs text-duck-ink/70" style={{ fontFamily: FONT }}>
                                    {mail.attachment.size}
                                </p>
                            </div>
                        </div>
                    </div>
                    <VlaggenRij vlaggen={vlaggenOp('bijlage')} bewijs={bewijs} onWijsAan={onWijsAan} />
                </div>
            )}

            <div className="p-4 border-t border-duck-gray space-y-2">
                {vlaggen.length > 0 && (
                    <p className="text-xs text-duck-ink/70" style={{ fontFamily: FONT }}>
                        {aantalAangewezen === 0
                            ? 'Nog geen onderdelen aangewezen'
                            : aantalAangewezen === 1
                              ? '1 onderdeel aangewezen'
                              : `${aantalAangewezen} onderdelen aangewezen`}
                    </p>
                )}
                <button
                    type="button"
                    data-qa="helpdesk-neem-mee"
                    onClick={onNeemMee}
                    aria-label="Neem het bericht mee"
                    className="w-full min-h-[44px] flex items-center justify-center gap-2 rounded-full bg-duck-ink px-4 py-2.5 text-sm font-black text-duck-bgLight transition-all duration-200 hover:bg-duck-ink/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid/40"
                    style={{ fontFamily: FONT }}
                >
                    <Send size={16} />
                    <span>Neem het bericht mee</span>
                </button>
                <p className="text-xs text-duck-ink/70 text-center" style={{ fontFamily: FONT }}>
                    Je brengt het bericht naar iemand in het kantoor — onderweg kun je je nog bedenken.
                </p>
            </div>
        </div>
    );
};
