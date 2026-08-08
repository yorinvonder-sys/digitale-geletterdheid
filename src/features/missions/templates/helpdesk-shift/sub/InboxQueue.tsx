import React from 'react';
import { Inbox } from 'lucide-react';
import type { ShiftMail } from '../types';

const FONT = "'Outfit', system-ui, sans-serif";

interface Props {
    mails: ShiftMail[];
    geopendId: number | null;
    grens: number;
    onOpen: (mailId: number) => void;
}

/**
 * De wachtrij met binnengekomen berichten. Laat zien hoeveel er wachten en
 * waarschuwt rustig — geen knipperende kleuren — zodra de wachtrij vol loopt.
 */
export const InboxQueue: React.FC<Props> = ({ mails, geopendId, grens, onOpen }) => {
    const isVol = mails.length >= grens;

    return (
        <div className="w-full max-w-md rounded-2xl border-2 border-duck-gray bg-white overflow-hidden">
            <div className={`flex items-center justify-between gap-2 px-4 py-2.5 ${isVol ? 'bg-duck-error' : 'bg-duck-ink'}`}>
                <div className="flex items-center gap-2 min-w-0">
                    <Inbox size={14} className="text-duck-bgLight shrink-0" />
                    <span className="text-[11px] font-black text-duck-bgLight uppercase tracking-widest truncate" style={{ fontFamily: FONT }}>
                        Wachtrij
                    </span>
                </div>
                <span className="text-[11px] font-bold text-duck-bgLight shrink-0" style={{ fontFamily: FONT }}>
                    {mails.length} / {grens}
                </span>
            </div>

            {isVol && (
                <p className="px-4 py-2 text-xs font-bold text-duck-error bg-duck-error/10 border-b border-duck-gray" style={{ fontFamily: FONT }}>
                    Wachtrij loopt vol — behandel eerst een bericht
                </p>
            )}

            {mails.length === 0 ? (
                <p className="px-4 py-6 text-sm text-center text-duck-ink/50" style={{ fontFamily: FONT }}>
                    Nog geen berichten binnen
                </p>
            ) : (
                <ul className="divide-y divide-duck-gray">
                    {mails.map((mail) => {
                        const isGeopend = mail.id === geopendId;
                        return (
                            <li key={mail.id}>
                                <button
                                    type="button"
                                    data-qa="helpdesk-queue-item"
                                    data-mail-id={mail.id}
                                    onClick={() => onOpen(mail.id)}
                                    aria-current={isGeopend ? 'true' : undefined}
                                    aria-label={`Open bericht van ${mail.fromName}: ${mail.subject}`}
                                    className={`w-full min-h-[44px] px-4 py-3 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid/40 ${
                                        isGeopend ? 'bg-duck-acid/20 border-l-4 border-duck-ink' : 'bg-white hover:bg-duck-gray/30 border-l-4 border-transparent'
                                    }`}
                                >
                                    <div className="flex items-baseline justify-between gap-2">
                                        <span className="font-bold text-sm text-duck-ink truncate" style={{ fontFamily: FONT }}>
                                            {mail.fromName}
                                        </span>
                                    </div>
                                    <p className="text-sm text-duck-ink/90 truncate" style={{ fontFamily: FONT }}>
                                        {mail.subject}
                                    </p>
                                    <p className="text-xs text-duck-ink/50 truncate" style={{ fontFamily: FONT }}>
                                        {mail.preview}
                                    </p>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};
