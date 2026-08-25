import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';
import { IntroScreen } from '../shared/IntroScreen';
import { getMissionGoal } from '@/config/missionGoals';
import type { TemplateMissionProps } from '../shared/types';
import { toScorePercent } from '../shared/scorePercent';
import type { HelpdeskShiftConfig, HelpdeskShiftState } from './types';
import type { OfficeConfig } from './office/officeTypes';
import { scoreShift } from './scoring';
import { useShiftFlow } from './useShiftFlow';
import { ShiftDebrief } from './sub/ShiftDebrief';
import { OfficeShift } from './office/OfficeShift';
import officeConfig from './office/configs/mail-detective.office';


// ── Allowlist ────────────────────────────────────────────────────────────────
const VALID_HELPDESK_SHIFT_IDS: ReadonlySet<string> = new Set(['mail-detective']);

const LoadingScreen: React.FC = () => (
    <div className="min-h-screen bg-duck-bg flex items-center justify-center p-4">
        <div className="text-center">
            <div
                className="w-8 h-8 border-2 border-duck-acid border-t-transparent rounded-full animate-spin mx-auto mb-3"
                aria-label="Laden..."
            />
            <p className="text-sm text-duck-ink/70" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                Missie laden…
            </p>
        </div>
    </div>
);

const ErrorScreen: React.FC<{ missionId: string; onBack: () => void }> = ({ missionId, onBack }) => (
    <div className="min-h-screen bg-duck-bg flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-lg font-black text-duck-ink mb-2" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                Missie niet gevonden
            </h2>
            <p className="text-sm text-duck-ink/70 mb-4" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                De configuratie voor <code>{missionId}</code> kon niet worden geladen.
            </p>
            <button
                onClick={onBack}
                className="px-5 py-2.5 bg-duck-acid text-duck-ink rounded-xl text-sm font-bold"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                Terug
            </button>
        </div>
    </div>
);

/**
 * Alleen een fase die we ook echt bewaren is geldig. Een lopende dienst wordt
 * nooit opgeslagen (zie `HelpdeskShiftState`), dus een opslag die beweert
 * midden in een dienst te zitten is bewerkt of verouderd.
 */
function isStateValid(saved: HelpdeskShiftState): boolean {
    if (!saved || typeof saved !== 'object') return false;
    if (saved.phase !== 'intro' && saved.phase !== 'debrief') return false;
    if (saved.phase === 'debrief') {
        const d = saved.afgerondeDienst;
        if (!d || !Array.isArray(d.behandeld) || !Array.isArray(d.gebeurtenissen)) return false;
        if (!d.eindstand || typeof d.eindstand.veiligeAccounts !== 'number') return false;
    }
    return true;
}

/**
 * De dienst hangt aan een naamkoppeling tussen twee losse configbestanden: elk
 * bericht komt binnen op een bureau uit `mailPerDesk`, en elke onderbreking
 * speelt op een bestaande plek. Klopt die koppeling niet, dan wordt het doel
 * null, verschijnt de knop "Bericht lezen" nooit en loopt de dienst stil vast.
 * Hier faalt het zichtbaar bij het laden in plaats van halverwege de ochtend.
 */
function isOfficeContractValid(config: HelpdeskShiftConfig, office: OfficeConfig): boolean {
    const deskIds = new Set(office.desks.map((d) => d.id));
    const plekken = new Set<string>([...deskIds, ...office.stations.map((s) => s.id)]);
    const mailsOk = config.mails.every((mail) => deskIds.has(office.mailPerDesk[mail.id] ?? ''));
    const onderbrekingenOk = office.onderbrekingen.every((o) => plekken.has(o.plek));
    return mailsOk && onderbrekingenOk;
}

export const HelpdeskShift: React.FC<TemplateMissionProps> = ({ missionId, onBack, onComplete }) => {
    const [config, setConfig] = useState<HelpdeskShiftConfig | null>(null);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        if (!VALID_HELPDESK_SHIFT_IDS.has(missionId)) { setLoadError(true); return; }
        import(`./configs/${missionId}.ts`)
            .then((mod) => {
                const geladen = mod.default as HelpdeskShiftConfig;
                if (!isOfficeContractValid(geladen, officeConfig)) { setLoadError(true); return; }
                setConfig(geladen);
            })
            .catch(() => setLoadError(true));
    }, [missionId]);

    if (loadError) return <ErrorScreen missionId={missionId} onBack={onBack} />;
    if (!config) return <LoadingScreen />;

    return <HelpdeskShiftInner config={config} onBack={onBack} onComplete={onComplete} />;
};

const HelpdeskShiftInner: React.FC<{
    config: HelpdeskShiftConfig;
    onBack: () => void;
    onComplete: TemplateMissionProps['onComplete'];
}> = ({ config, onBack, onComplete }) => {
    const { state, setState, clearSave } = useMissionAutoSave<HelpdeskShiftState>(
        config.missionId,
        { phase: 'intro' },
        { validate: isStateValid }
    );

    /**
     * Of de dienst nú loopt. Bewust alleen in het geheugen: een dienst is één
     * ononderbroken sessie. Wie halverwege herlaadt begint opnieuw, in plaats
     * van terug te komen in een bevroren klok met een halve wachtrij.
     */
    const [bezig, setBezig] = useState(false);

    /**
     * Of het afronden loopt. Houdt de Klaar-knop uit terwijl de host de
     * voltooiing afhandelt; loopt dat mis, dan komt de knop terug zodat de
     * nabespreking geen doodlopend eindscherm wordt.
     */
    const [afrondt, setAfrondt] = useState(false);
    const afrondtRef = useRef(false);

    const handleAfgerond = useCallback((resultaat: NonNullable<HelpdeskShiftState['afgerondeDienst']>) => {
        setBezig(false);
        setState(() => ({ phase: 'debrief', afgerondeDienst: resultaat }));
    }, [setState]);

    const { live, onderbreking, handel, kiesBijOnderbreking } = useShiftFlow(
        config,
        officeConfig.onderbrekingen,
        { onAfgerond: handleAfgerond }
    );

    const afgerondeDienst = state.phase === 'debrief' ? state.afgerondeDienst : undefined;

    const handleKlaar = useCallback(async () => {
        if (!afgerondeDienst || afrondtRef.current) return;
        afrondtRef.current = true;
        setAfrondt(true);
        try {
            const score = scoreShift(config, afgerondeDienst.behandeld, afgerondeDienst.eindstand);
            const completed = await onComplete(score >= config.maxScore * 0.4, toScorePercent(score, config.maxScore));
            // Pas wissen als de voltooiing is vastgelegd, anders raakt de leerling
            // de afgeronde dienst kwijt bij een mislukte serveropslag.
            if (completed !== false) {
                clearSave();
            }
        } finally {
            // Mislukt afronden, dan moet de leerling het opnieuw kunnen proberen.
            afrondtRef.current = false;
            setAfrondt(false);
        }
    }, [afgerondeDienst, clearSave, config, onComplete]);

    // ── Nabespreking ──
    if (afgerondeDienst) {
        const { behandeld, eindstand, gebeurtenissen } = afgerondeDienst;
        return (
            <ShiftDebrief
                config={config}
                behandeld={behandeld}
                eindstand={eindstand}
                gebeurtenissen={gebeurtenissen}
                afrondt={afrondt}
                onKlaar={handleKlaar}
            />
        );
    }

    // ── Intro ──
    if (!bezig) {
        return (
            <IntroScreen
                missionId={config.missionId}
                emoji={config.introEmoji}
                title={config.introTitle}
                description={config.introDescription}
                goal={config.missionGoal ?? getMissionGoal(config.missionId)}
                features={config.introFeatures}
                onStart={() => setBezig(true)}
            />
        );
    }

    // ── De dienst: het 3D-kantoor ──
    return (
        <OfficeShift
            config={config}
            office={officeConfig}
            live={live}
            onderbreking={onderbreking}
            onActie={handel}
            onKies={kiesBijOnderbreking}
            onBack={onBack}
        />
    );
};
