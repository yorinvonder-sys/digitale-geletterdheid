import React from 'react';
import { Trophy, CheckCircle2, MinusCircle, XCircle, Sparkles, Clock3 } from 'lucide-react';
import { bewijsScore, scoreMail, scoreShift } from '../scoring';
import type { HandledMail, HelpdeskShiftConfig, SchoolState, ShiftMail } from '../types';

interface Props {
    config: HelpdeskShiftConfig;
    behandeld: HandledMail[];
    eindstand: SchoolState;
    gebeurtenissen: string[];
    onKlaar: () => void;
}

/** Rij met een uitkomst-getal, vergeleken met de beginstand. */
const StandRegel: React.FC<{ label: string; start: number; eind: number; omgekeerd?: boolean; euro?: boolean }> = ({
    label,
    start,
    eind,
    omgekeerd,
    euro,
}) => {
    const verschil = eind - start;
    const beter = omgekeerd ? verschil < 0 : verschil > 0;
    const gelijk = verschil === 0;
    const format = (n: number) => (euro ? `€${n.toLocaleString('nl-NL')}` : n.toLocaleString('nl-NL'));

    return (
        <div className="flex items-center justify-between py-2 border-b border-duck-gray last:border-0">
            <span className="text-sm text-duck-ink/75" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                {label}
            </span>
            <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-black text-duck-ink">{format(eind)}</span>
                {!gelijk && (
                    <span className={`text-xs font-bold ${beter ? 'text-duck-ink/50' : 'text-duck-ink'}`}>
                        ({verschil > 0 ? '+' : ''}
                        {format(verschil)})
                    </span>
                )}
            </div>
        </div>
    );
};

/**
 * Wat de leerling in dit bericht aanwees als verdacht, en wat hij miste.
 * Onterecht aangewezen kost nooit punten — dus de toon is nieuwsgierig, niet
 * afkeurend: "goed dat je oplet, maar kijk hier nog eens naar".
 */
const BewijsBlok: React.FC<{ vlaggen: NonNullable<ShiftMail['vlaggen']>; bewijs: string[] }> = ({
    vlaggen,
    bewijs,
}) => {
    const terecht = vlaggen.filter((v) => v.verdacht && bewijs.includes(v.id));
    const onterecht = vlaggen.filter((v) => !v.verdacht && bewijs.includes(v.id));
    const gemist = vlaggen.filter((v) => v.verdacht && !bewijs.includes(v.id));

    return (
        <div className="mt-2 space-y-1.5 rounded-xl bg-duck-bgLight p-2.5">
            {terecht.length > 0 && (
                <p className="text-xs leading-relaxed text-duck-ink/75">
                    <span className="font-bold text-duck-ink">Terecht aangewezen:</span>{' '}
                    {terecht.map((v) => `"${v.tekst}"`).join(', ')}
                </p>
            )}
            {onterecht.map((v) => (
                <p key={v.id} className="text-xs leading-relaxed text-duck-ink/75">
                    <span className="font-bold text-duck-ink">Je wees "{v.tekst}" aan</span> — goed dat je
                    oplet, maar kijk hier nog eens naar: {v.uitleg}
                </p>
            ))}
            {gemist.map((v) => (
                <p key={v.id} className="text-xs leading-relaxed text-duck-ink/75">
                    <span className="font-bold text-duck-ink">Gemist: "{v.tekst}"</span> — {v.uitleg}
                </p>
            ))}
        </div>
    );
};

/** Eén regel per behandeld bericht, met uitkomst en uitleg — fouten bovenaan. */
const MailRegel: React.FC<{ mail: ShiftMail; keuze: HandledMail }> = ({ mail, keuze }) => {
    const punten = scoreMail(mail, keuze.gekozenActie);
    const staat =
        punten === 1
            ? { icoon: <CheckCircle2 size={16} className="text-duck-ink" aria-hidden="true" />, label: 'Goed gedaan' }
            : punten === 0.5
              ? { icoon: <MinusCircle size={16} className="text-duck-ink/60" aria-hidden="true" />, label: 'Kon beter' }
              : { icoon: <XCircle size={16} className="text-duck-ink" aria-hidden="true" />, label: 'Fout' };

    return (
        <div className="py-3 border-b border-duck-gray last:border-0">
            <div className="flex items-start gap-2">
                {staat.icoon}
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-duck-ink truncate">{mail.subject}</p>
                    <p className="text-xs text-duck-ink/60 truncate">{mail.fromName}</p>
                </div>
                <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${
                        punten === 1
                            ? 'bg-duck-ink text-duck-acid'
                            : 'border border-duck-ink text-duck-ink'
                    }`}
                >
                    {staat.label}
                </span>
            </div>
            <p className="mt-1.5 text-xs text-duck-ink/75">
                Jij deed: <span className="font-bold text-duck-ink">{mail.tell}</span>
            </p>
            <p className="mt-1 text-xs leading-relaxed text-duck-ink/75">{mail.uitleg}</p>
            {mail.vlaggen && mail.vlaggen.length > 0 && keuze.bewijs && keuze.bewijs.length > 0 && (
                <BewijsBlok vlaggen={mail.vlaggen} bewijs={keuze.bewijs} />
            )}
        </div>
    );
};

export const ShiftDebrief: React.FC<Props> = ({ config, behandeld, eindstand, gebeurtenissen, onKlaar }) => {
    const score = scoreShift(config, behandeld, eindstand);
    const badge = [...config.badges]
        .sort((a, b) => b.minScore - a.minScore)
        .find((b) => score >= b.minScore) || config.badges[config.badges.length - 1];

    const perId = new Map(behandeld.map((h) => [h.mailId, h]));
    const behandeldeMails = config.mails
        .filter((mail) => perId.has(mail.id))
        .map((mail) => ({ mail, keuze: perId.get(mail.id)! }))
        .sort((a, b) => scoreMail(a.mail, a.keuze.gekozenActie) - scoreMail(b.mail, b.keuze.gekozenActie));

    const onbehandeld = config.mails.filter((mail) => !perId.has(mail.id));

    // Hoe goed de leerling keek, samengevat over alle berichten met verdachte
    // onderdelen. bewijsScore doet het rekenwerk per bericht; hier wordt alleen
    // het aantal verdachte onderdelen per bericht geteld om de score om te
    // zetten naar "zoveel van de zoveel gevonden".
    const metVlaggen = behandeldeMails
        .map(({ mail, keuze }) => ({ mail, keuze, verdacht: (mail.vlaggen ?? []).filter((v) => v.verdacht).length }))
        .filter(({ verdacht }) => verdacht > 0);
    const verdachteTotaal = metVlaggen.reduce((som, { verdacht }) => som + verdacht, 0);
    const gevondenTotaal = metVlaggen.reduce(
        (som, { mail, keuze, verdacht }) => som + Math.round(bewijsScore(mail, keuze.bewijs) * verdacht),
        0
    );

    return (
        <div data-qa="helpdesk-debrief" className="min-h-screen overflow-y-auto bg-duck-bg flex items-start justify-center px-4 py-6">
            <div className="w-full max-w-md">
                {/* Uitkomst van de ochtend */}
                <div
                    className="text-center mb-4 p-6 rounded-3xl"
                    style={{ background: `linear-gradient(135deg, ${badge.color}15, ${badge.color}08)` }}
                >
                    <p
                        className="text-[11px] font-black text-duck-ink/75 uppercase tracking-widest mb-1"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        De dienst zit erop
                    </p>
                    <h2 className="text-2xl font-black text-duck-ink mb-3" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        {badge.title}
                    </h2>
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Trophy size={16} className="text-duck-ink" aria-hidden="true" />
                        <span className="text-lg font-black text-duck-ink">
                            {score}/{config.maxScore} punten
                        </span>
                    </div>
                    {verdachteTotaal > 0 && (
                        <p className="text-xs text-duck-ink/60 mb-3">
                            Je vond {gevondenTotaal} van de {verdachteTotaal} verdachte signalen in de berichten.
                        </p>
                    )}
                    <div className="bg-white/70 rounded-2xl p-3 text-left">
                        <StandRegel label="Veilige accounts" start={config.startStand.veiligeAccounts} eind={eindstand.veiligeAccounts} />
                        <StandRegel label="Verloren geld" start={config.startStand.verlorenGeld} eind={eindstand.verlorenGeld} omgekeerd euro />
                        <StandRegel label="Terechte meldingen" start={config.startStand.meldingen} eind={eindstand.meldingen} />
                    </div>
                </div>

                {/* Wat er gebeurde */}
                {gebeurtenissen.length > 0 && (
                    <div className="bg-white rounded-2xl border border-duck-gray p-4 mb-4">
                        <p className="text-xs font-black text-duck-ink uppercase tracking-widest mb-2" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            Wat er gebeurde
                        </p>
                        <ul className="space-y-1.5">
                            {gebeurtenissen.map((regel, i) => (
                                <li key={i} className="text-xs text-duck-ink/75">
                                    {regel}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Per bericht */}
                <div className="bg-white rounded-2xl border border-duck-gray p-4 mb-4">
                    <p className="text-xs font-black text-duck-ink uppercase tracking-widest mb-1" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        Bericht voor bericht
                    </p>
                    {behandeldeMails.map(({ mail, keuze }) => (
                        <MailRegel key={mail.id} mail={mail} keuze={keuze} />
                    ))}
                </div>

                {/* Niet meer aan toegekomen */}
                {onbehandeld.length > 0 && (
                    <div className="bg-white rounded-2xl border border-duck-gray p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock3 size={14} className="text-duck-ink/60" aria-hidden="true" />
                            <p className="text-xs font-black text-duck-ink uppercase tracking-widest" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                Niet meer aan toegekomen
                            </p>
                        </div>
                        <ul className="space-y-1.5">
                            {onbehandeld.map((mail) => (
                                <li key={mail.id} className="text-xs text-duck-ink/75">
                                    <span className="font-bold text-duck-ink">{mail.subject}</span> — {mail.fromName}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Lessen */}
                <div className="bg-white rounded-2xl border border-duck-gray p-4 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles size={16} className="text-duck-ink" aria-hidden="true" />
                        <span className="text-xs font-black text-duck-ink uppercase tracking-widest" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            Wat je hieruit meeneemt
                        </span>
                    </div>
                    <ul className="space-y-2">
                        {config.takeaways.map((t, i) => (
                            <li key={i} className="text-sm text-duck-ink/75 flex items-start gap-2">
                                <span className="text-duck-ink mt-0.5" aria-hidden="true">•</span>
                                {t}
                            </li>
                        ))}
                    </ul>
                </div>

                <button
                    data-qa="helpdesk-debrief-klaar"
                    onClick={onKlaar}
                    className="w-full py-3.5 bg-duck-acid hover:bg-duck-acid/80 text-duck-ink rounded-full font-black text-sm transition-all duration-200 active:scale-[0.98] shadow-lg shadow-duck-acid/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Klaar
                </button>
            </div>
        </div>
    );
};
