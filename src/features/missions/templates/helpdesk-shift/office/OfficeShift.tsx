import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { HelpdeskShiftConfig, LiveShiftState, ShiftAction, ShiftMail } from '../types';
import { AFLEVERPLEK } from './officeTypes';
import type { Keuze, OfficeConfig, OfficeLive, Onderbreking, Spot } from './officeTypes';
import { afstand, dichtstbijzijnde, kijkrichting, stap as zetStap, toontVoorbeeld } from './officeLogic';
import { OfficeScene } from './OfficeScene';
import { Player } from './Player';
import { TouchJoystick } from './TouchJoystick';
import { InterruptionOverlay } from './InterruptionOverlay';
import { useMovement } from './useMovement';
import { MailPane } from '../sub/MailPane';
import { SchoolStatus } from '../sub/SchoolStatus';

/**
 * Hoe vaak per seconde de positie naar React wordt teruggeschreven. Dertig keer
 * loopt vloeiend en houdt het aantal hertekeningen laag genoeg voor een iPad.
 */
const STAP_MS = 1000 / 30;

interface Props {
    config: HelpdeskShiftConfig;
    office: OfficeConfig;
    live: LiveShiftState;
    onderbreking: Onderbreking | null;
    onActie: (mailId: number, actie: ShiftAction, bewijs: string[]) => void;
    onKies: (keuze: Keuze, bij: Onderbreking) => void;
    onBack: () => void;
}

export const OfficeShift: React.FC<Props> = ({
    config,
    office,
    live,
    onderbreking,
    onActie,
    onKies,
    onBack,
}) => {
    const [positie, setPositie] = useState<Spot>(office.startPositie);
    const [richting, setRichting] = useState(0);
    const [loopt, setLoopt] = useState(false);
    const [koffieGehaald, setKoffieGehaald] = useState(0);
    const [leest, setLeest] = useState(false);
    /** Draagt de leerling het bericht met zich mee om het weg te brengen? */
    const [draagt, setDraagt] = useState(false);
    /** Onderdelen die hij in dit bericht heeft aangewezen. */
    const [bewijs, setBewijs] = useState<string[]>([]);

    const focus = Math.max(
        0,
        Math.min(
            100,
            100 - live.stap * office.focus.daalPerStap + koffieGehaald * office.focus.koffieHerstel
        )
    );

    const mailObject: ShiftMail | null = live.huidigeMail !== null
        ? config.mails.find((m) => m.id === live.huidigeMail) ?? null
        : null;

    /** Het bureau waar dit bericht vandaan komt. */
    const bronDesk = mailObject ? office.mailPerDesk[mailObject.id] ?? null : null;

    /**
     * De plekken waar een gedragen bericht naartoe kan. Elke plek is een
     * handeling: de serverkast is melden, de versnipperaar is weggooien, en het
     * bureau van de collega zelf is doorlaten. Zo is kiezen een plek in plaats
     * van een knop, en kun je je onderweg nog bedenken.
     */
    const afleveropties = useMemo(() => {
        if (!draagt || !mailObject) return [] as Array<{ id: string; actie: ShiftAction; label: string }>;
        const opties: Array<{ id: string; actie: ShiftAction; label: string }> = [];
        for (const station of office.stations) {
            const actie = AFLEVERPLEK[station.soort];
            if (!actie) continue;
            opties.push({
                id: station.id,
                actie,
                label: actie === 'melden' ? 'Melden bij IT' : 'Versnipperen',
            });
        }
        const desk = office.desks.find((d) => d.id === bronDesk);
        if (desk) {
            opties.push({ id: desk.id, actie: 'doorlaten', label: `Afgeven aan ${desk.naam}` });
        }
        return opties;
    }, [draagt, mailObject, office.stations, office.desks, bronDesk]);

    /** Waar de leerling nu naartoe moet: het bericht ophalen, of het wegbrengen. */
    const doelPlek = onderbreking ? onderbreking.plek : draagt ? null : bronDesk;

    const dichtbij = useMemo(() => dichtstbijzijnde(positie, office), [positie, office]);
    const staatBijDoel = dichtbij !== null && doelPlek !== null && dichtbij.id === doelPlek;
    const afleverHier = dichtbij ? afleveropties.find((o) => o.id === dichtbij.id) ?? null : null;

    const mag = !leest && !(onderbreking !== null && staatBijDoel);
    const { richting: invoer, zetJoystick } = useMovement({ actief: mag });

    const invoerRef = useRef(invoer);
    invoerRef.current = invoer;

    useEffect(() => {
        if (!mag) {
            setLoopt(false);
            return;
        }
        let vorige = performance.now();
        const timer = window.setInterval(() => {
            const nu = performance.now();
            const delta = Math.min((nu - vorige) / 1000, 0.25);
            vorige = nu;
            const r = invoerRef.current;
            const beweegt = r.x !== 0 || r.z !== 0;
            setLoopt(beweegt);
            if (!beweegt) return;
            setPositie((prev) => zetStap(prev, r, office, delta));
            setRichting((prev) => kijkrichting(r, prev));
        }, STAP_MS);
        return () => window.clearInterval(timer);
    }, [mag, office]);

    // Wegwandelen bij een geopend bericht sluit het scherm.
    useEffect(() => {
        if (leest && !staatBijDoel) setLeest(false);
    }, [leest, staatBijDoel]);

    // Nieuw onderdeel: schone lei.
    useEffect(() => {
        setLeest(false);
        setDraagt(false);
        setBewijs([]);
    }, [live.stap]);

    const wijsAan = useCallback((vlagId: string) => {
        setBewijs((prev) =>
            prev.includes(vlagId) ? prev.filter((id) => id !== vlagId) : [...prev, vlagId]
        );
    }, []);

    const neemMee = useCallback(() => {
        setLeest(false);
        setDraagt(true);
    }, []);

    const leverAf = useCallback((actie: ShiftAction) => {
        if (!mailObject) return;
        onActie(mailObject.id, actie, bewijs);
    }, [mailObject, onActie, bewijs]);

    const kiesBij = useCallback((keuze: Keuze) => {
        if (onderbreking) onKies(keuze, onderbreking);
    }, [onderbreking, onKies]);

    /** Collega's van wie het account is overgenomen, voor de rode schermen. */
    const getroffenDesks = useMemo(() => {
        const kwijt = config.startStand.veiligeAccounts - live.stand.veiligeAccounts;
        if (kwijt <= 0) return [];
        return office.desks.slice(0, Math.min(kwijt, office.desks.length)).map((d) => d.id);
    }, [config.startStand.veiligeAccounts, live.stand.veiligeAccounts, office.desks]);

    const officeLive: OfficeLive = {
        positie,
        richting,
        loopt,
        focus,
        desksMetPost: doelPlek && !onderbreking && !draagt ? [doelPlek] : [],
        dichtbij: dichtbij?.id ?? null,
        actieveOnderbreking: onderbreking,
        bijKoffie: false,
        draagtBericht: draagt,
        afleverplekken: afleveropties.map((o) => o.id),
        getroffenDesks,
    };

    const stationDichtbij = dichtbij?.soort === 'station'
        ? office.stations.find((s) => s.id === dichtbij.id) ?? null
        : null;

    // Wegwijzer naar het doel; bij dragen wijst hij naar de dichtstbijzijnde
    // afleverplek, zodat de leerling nooit hoeft te zoeken.
    const wijsNaar = useMemo(() => {
        const kandidaten = draagt
            ? afleveropties.map((o) =>
                office.stations.find((s) => s.id === o.id)?.positie
                ?? office.desks.find((d) => d.id === o.id)?.positie)
            : doelPlek
                ? [office.desks.find((d) => d.id === doelPlek)?.positie
                    ?? office.stations.find((s) => s.id === doelPlek)?.positie]
                : [];
        const geldig = kandidaten.filter((p): p is Spot => Boolean(p));
        if (geldig.length === 0) return null;
        return geldig.reduce((beste, p) =>
            afstand(positie, p) < afstand(positie, beste) ? p : beste
        );
    }, [draagt, afleveropties, doelPlek, office.stations, office.desks, positie]);

    const doelAfstand = wijsNaar ? afstand(positie, wijsNaar) : null;
    const doelHoek = wijsNaar
        ? Math.atan2(wijsNaar.x - positie.x, -(wijsNaar.z - positie.z))
        : 0;

    /** De regel die vertelt wat er nu te doen is, en waar. */
    const opdrachtregel = (() => {
        if (onderbreking) {
            const station = office.stations.find((s) => s.id === onderbreking.plek);
            const desk = office.desks.find((d) => d.id === onderbreking.plek);
            const naam = station?.label ?? desk?.naam ?? 'de plek';
            return staatBijDoel ? onderbreking.aanhef : `Loop naar ${naam}`;
        }
        if (!mailObject) return 'De ochtend zit erop';
        if (draagt) {
            return afleverHier
                ? afleverHier.label + '?'
                : 'Je hebt het bericht bij je — breng het ergens heen';
        }
        const desk = office.desks.find((d) => d.id === bronDesk);
        if (staatBijDoel) {
            return toontVoorbeeld(focus, office.focus)
                ? `Nieuw bericht: ${mailObject.subject}`
                : 'Nieuw bericht — lees het op het scherm';
        }
        return `Er wacht een bericht bij ${desk?.naam ?? 'een collega'}`;
    })();

    return (
        <div className="min-h-screen bg-duck-bg">
            <div className="relative mx-auto max-w-md md:max-w-3xl">
                <div className="relative h-[52vh] min-h-[300px] w-full overflow-hidden md:h-[60vh]">
                    <OfficeScene config={office} live={officeLive}>
                        <Player config={office} positie={positie} richting={richting} loopt={loopt} />
                    </OfficeScene>

                    <TouchJoystick onRichting={zetJoystick} zichtbaar={mag} />

                    <div className="pointer-events-none absolute inset-x-0 top-0 p-3">
                        <p
                            className="inline-block rounded-full bg-duck-ink/85 px-3 py-1.5 text-xs font-black text-duck-bgLight"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            {opdrachtregel}
                        </p>
                    </div>

                    {/* Wegwijzer met afstand, zolang je er nog niet bent */}
                    {!afleverHier && !staatBijDoel && doelAfstand !== null && (
                        <div className="pointer-events-none absolute inset-x-0 top-12 flex justify-center">
                            <div className="flex items-center gap-2 rounded-full bg-duck-acid px-3 py-1.5">
                                <span
                                    aria-hidden="true"
                                    className="text-base leading-none text-duck-ink"
                                    style={{ transform: `rotate(${doelHoek}rad)` }}
                                >
                                    ↑
                                </span>
                                <span
                                    className="text-xs font-black text-duck-ink"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    {Math.round(doelAfstand)} meter
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Het bericht dat je bij je draagt */}
                    {draagt && (
                        <div className="pointer-events-none absolute bottom-3 left-3">
                            <span
                                className="rounded-lg border-2 border-duck-ink bg-duck-bgLight px-2 py-1 text-[11px] font-black text-duck-ink"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                📄 in je hand
                            </span>
                        </div>
                    )}

                    {!leest && !draagt && mailObject && staatBijDoel && (
                        <button
                            data-qa="helpdesk-open-bericht"
                            onClick={() => setLeest(true)}
                            className="absolute bottom-3 right-3 min-h-[44px] rounded-full border-2 border-duck-ink bg-duck-acid px-4 text-sm font-black text-duck-ink"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            Bericht lezen
                        </button>
                    )}

                    {draagt && afleverHier && (
                        <button
                            data-qa="helpdesk-lever-af"
                            data-actie={afleverHier.actie}
                            onClick={() => leverAf(afleverHier.actie)}
                            className="absolute bottom-3 right-3 min-h-[44px] rounded-full border-2 border-duck-ink bg-duck-acid px-4 text-sm font-black text-duck-ink"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            {afleverHier.label}
                        </button>
                    )}

                    {!draagt && mag && stationDichtbij?.soort === 'koffie' && (
                        <button
                            data-qa="helpdesk-koffie"
                            onClick={() => setKoffieGehaald((n) => n + 1)}
                            className="absolute bottom-3 right-3 min-h-[44px] rounded-full border-2 border-duck-ink bg-duck-bgLight px-4 text-sm font-black text-duck-ink"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            Koffie halen
                        </button>
                    )}
                </div>

                <div className="mx-auto max-w-md space-y-3 p-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={onBack}
                            className="text-xs font-bold text-duck-ink/70 underline underline-offset-2"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            ← Terug
                        </button>
                        <span
                            className="text-[10px] font-black uppercase tracking-widest text-duck-ink/50"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            Helpdesk-ochtend
                        </span>
                    </div>

                    <SchoolStatus
                        stand={live.stand}
                        startStand={config.startStand}
                        gebeurtenissen={live.gebeurtenissen}
                        stap={live.stap}
                        totaalStappen={live.totaalStappen}
                        focus={focus}
                    />
                </div>
            </div>

            {leest && mailObject && (
                <div className="fixed inset-0 z-40 overflow-y-auto bg-duck-ink/40 p-4">
                    <div className="mx-auto max-w-md">
                        <button
                            onClick={() => setLeest(false)}
                            className="mb-2 min-h-[44px] rounded-full border-2 border-duck-ink bg-duck-bgLight px-4 text-sm font-black text-duck-ink"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            ← Terug naar het kantoor
                        </button>
                        <MailPane
                            mail={mailObject}
                            bewijs={bewijs}
                            onWijsAan={wijsAan}
                            onNeemMee={neemMee}
                        />
                    </div>
                </div>
            )}

            <InterruptionOverlay
                onderbreking={staatBijDoel ? onderbreking : null}
                onKies={kiesBij}
            />
        </div>
    );
};
