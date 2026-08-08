import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
    HandledMail,
    HelpdeskShiftConfig,
    LiveShiftState,
    SchoolState,
    ShiftAction,
} from './types';
import type { Keuze, Onderbreking } from './office/officeTypes';
import { pasGevolgToe, scoreMail, verwerkHandeling } from './scoring';
import { bouwStappen, huidigeMailId, huidigeOnderbrekingId, isKlaar } from './shiftFlow';

interface KernState {
    /** Hoeveelste stap van de ochtend. */
    index: number;
    behandeld: HandledMail[];
    stand: SchoolState;
    gebeurtenissen: string[];
}

/**
 * De ochtend als aaneenschakeling van stappen: is het één klaar, dan komt het
 * volgende. Geen klok, geen wachtrij die volloopt — het tempo is dat van de
 * leerling.
 */
export function useShiftFlow(
    config: HelpdeskShiftConfig,
    onderbrekingen: readonly Onderbreking[],
    opts: {
        onAfgerond: (resultaat: {
            behandeld: HandledMail[];
            eindstand: SchoolState;
            gebeurtenissen: string[];
        }) => void;
    }
) {
    const stappen = useMemo(() => bouwStappen(config, onderbrekingen), [config, onderbrekingen]);

    const [kern, setKern] = useState<KernState>(() => ({
        index: 0,
        behandeld: [],
        stand: config.startStand,
        gebeurtenissen: [],
    }));

    const afgerond = useRef(false);
    const onAfgerondRef = useRef(opts.onAfgerond);
    onAfgerondRef.current = opts.onAfgerond;

    const klaar = isKlaar(stappen, kern.index);

    useEffect(() => {
        if (afgerond.current || !klaar) return;
        afgerond.current = true;
        onAfgerondRef.current({
            behandeld: kern.behandeld,
            eindstand: kern.stand,
            gebeurtenissen: kern.gebeurtenissen,
        });
    }, [klaar, kern.behandeld, kern.stand, kern.gebeurtenissen]);

    const mailId = huidigeMailId(stappen, kern.index);
    const onderbrekingId = huidigeOnderbrekingId(stappen, kern.index);
    const onderbreking = onderbrekingId
        ? onderbrekingen.find((o) => o.id === onderbrekingId) ?? null
        : null;

    /** Handelt het bericht af dat nu aan de beurt is en schuift door. */
    const handel = useCallback(
        (id: number, actie: ShiftAction, bewijs: string[] = []) => {
            setKern((prev) => {
                // Alleen het bericht dat nú aan de beurt is telt. Opnieuw
                // afgeleid uit de state, zodat een dubbele aanroep hetzelfde
                // resultaat geeft en niemand twee keer punten krijgt.
                if (huidigeMailId(stappen, prev.index) !== id) return prev;
                const mail = config.mails.find((m) => m.id === id);
                if (!mail) return prev;

                const { stand, gebeurtenis } = verwerkHandeling(mail, actie, prev.stand);
                return {
                    index: prev.index + 1,
                    behandeld: [
                        ...prev.behandeld,
                        { mailId: id, gekozenActie: actie, punten: scoreMail(mail, actie), bewijs },
                    ],
                    stand,
                    gebeurtenissen: gebeurtenis
                        ? [...prev.gebeurtenissen, gebeurtenis]
                        : prev.gebeurtenissen,
                };
            });
        },
        [config, stappen]
    );

    /** Verwerkt een keuze bij een onderbreking en schuift door. */
    const kiesBijOnderbreking = useCallback(
        (keuze: Keuze, bij: Onderbreking) => {
            setKern((prev) => {
                if (huidigeOnderbrekingId(stappen, prev.index) !== bij.id) return prev;
                if (keuze.veilig) return { ...prev, index: prev.index + 1 };

                const melding = keuze.gevolgMelding ?? `Onveilige keuze bij: ${bij.aanhef}`;
                return {
                    ...prev,
                    index: prev.index + 1,
                    stand: pasGevolgToe(prev.stand, {
                        melding,
                        accountsKwijt: keuze.accountsKwijt,
                        geldKwijt: keuze.geldKwijt,
                    }),
                    gebeurtenissen: [...prev.gebeurtenissen, melding],
                };
            });
        },
        [stappen]
    );

    const live: LiveShiftState = {
        huidigeMail: mailId,
        stap: kern.index,
        totaalStappen: stappen.length,
        behandeld: kern.behandeld,
        stand: kern.stand,
        gebeurtenissen: kern.gebeurtenissen,
    };

    return { live, onderbreking, handel, kiesBijOnderbreking };
}
