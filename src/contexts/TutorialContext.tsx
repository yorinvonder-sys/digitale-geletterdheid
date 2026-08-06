import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { logger } from '@/utils/logger';

export interface TutorialStep {
    id: string;
    target: string | null; // CSS selector or null for fullscreen
    title: string;
    content: string;
    requireClick?: boolean;
    position?: 'top' | 'bottom' | 'left' | 'right';
    onEnter?: () => void; // Callback when step becomes active
    /**
     * Sla deze stap over als het target bij de start van de rondleiding niet
     * zichtbaar is. Zonder deze vlag blijft een stap altijd staan (huidig
     * gedrag), dus de docentrondleiding verandert niet.
     */
    skipIfMissing?: boolean;
}

interface TutorialContextType {
    isActive: boolean;
    currentStepIndex: number;
    currentStep: TutorialStep | null;
    steps: TutorialStep[];
    startTutorial: () => void;
    endTutorial: () => void;
    nextStep: () => void;
    prevStep: () => void;
    skipTutorial: () => void;
    completeStep: () => void;
    hasCompleted: boolean;
}

const TutorialContext = createContext<TutorialContextType | null>(null);

/**
 * Zoek het element dat ECHT op het scherm staat.
 *
 * Tailwind's `lg:hidden` / `sm:hidden` haalt een element niet uit de DOM maar
 * zet `display:none`. `querySelector` vindt zo'n element dus wél, terwijl
 * `getBoundingClientRect()` daarna nullen teruggeeft — de spotlight licht een
 * lege hoek uit en de tooltip belandt buiten beeld, inclusief de enige knoppen
 * om verder te gaan. `getClientRects().length === 0` dekt precies dat geval.
 *
 * Loopt bovendien ALLE kandidaten langs: bij een selectorlijst
 * (`[data-tutorial=x], [data-tutorial-nav=x]`) pakt `querySelector` de eerste in
 * documentvolgorde, niet de zichtbare.
 */
export const resolveTutorialTarget = (selector: string): HTMLElement | null =>
    Array.from(document.querySelectorAll<HTMLElement>(selector))
        .find(el => el.getClientRects().length > 0) ?? null;

const clickTutorialTarget = (selector: string, delayMs = 0) => {
    const run = () => {
        resolveTutorialTarget(selector)?.click();
    };
    if (delayMs > 0) {
        window.setTimeout(run, delayMs);
        return;
    }
    run();
};

/** Close any open modals/overlays by clicking their backdrop or close button */
const dismissOpenOverlays = () => {
    // Close feedback modal backdrop (z-[100] overlay)
    const feedbackBackdrop = document.querySelector('.fixed.inset-0.z-\\[100\\] .bg-lab-ink\\/60') as HTMLElement | null;
    feedbackBackdrop?.click();
    // Close profile dropdown by clicking outside
    const profileMenu = document.querySelector('[aria-haspopup="true"][aria-expanded="true"]') as HTMLElement | null;
    if (profileMenu) {
        document.body.click();
    }
};

// Tutorial steps definition
//
// De navigatie-selectors staan zowel op de sidebar (`data-tutorial`) als op de
// mobiele balk (`data-tutorial-mobile`); querySelector pakt de eerste die
// bestaat, zodat de rondleiding op elk schermformaat werkt.
const navTarget = (tab: string) => `[data-tutorial="${tab}-tab"], [data-tutorial-mobile="${tab}-tab"]`;

export const TEACHER_TUTORIAL_STEPS: TutorialStep[] = [
    {
        id: 'start-lesson',
        target: '[data-tutorial="presentation-btn"]',
        title: 'Start je les',
        content: 'Klik op Presentatie voor het lespresentatiescherm met QR-code.',
        requireClick: true,
        position: 'bottom',
    },
    {
        id: 'focus-task',
        target: '[data-tutorial="focus-toggle"]',
        title: 'Focusmodus',
        content: 'Stuur alle leerlingen naar dezelfde opdracht.',
        requireClick: true,
        position: 'bottom',
        onEnter: () => {
            clickTutorialTarget(navTarget('overview'));
        },
    },
    {
        id: 'students-tab',
        target: navTarget('students'),
        title: 'Leerlingen',
        content: 'Beheer individuele leerlingen en stuur berichten.',
        requireClick: true,
        position: 'bottom',
    },
    {
        id: 'student-message',
        target: '[data-tutorial="students-message-btn"]',
        title: 'Klasbericht',
        content: 'Stuur berichten naar de hele klas of individuele leerlingen.',
        requireClick: true,
        position: 'bottom',
        onEnter: () => {
            clickTutorialTarget(navTarget('students'));
        },
    },
    {
        id: 'evidence-tab',
        target: navTarget('progress'),
        title: 'Bewijs',
        content: 'Voortgang, SLO-dekking en groei — de onderbouwing voor school en inspectie.',
        requireClick: true,
        position: 'bottom',
    },
    {
        id: 'today-tab',
        target: navTarget('overview'),
        title: 'Vandaag',
        content: 'Je startscherm: wie aandacht nodig heeft, en waar de klas aan werkt.',
        requireClick: true,
        position: 'bottom',
    },
];

// Student tutorial steps — logische volgorde: welkom → missies → profiel → start
export const STUDENT_TUTORIAL_STEPS: TutorialStep[] = [
    {
        id: 'welcome',
        target: null, // fullscreen
        title: 'Welkom bij DGSkills!',
        content: 'Dit is jouw dashboard. Hier vind je al je missies, XP en trofeeën. We laten je even zien hoe alles werkt.',
        requireClick: false,
    },
    {
        id: 'main-missions',
        target: '[data-tutorial="student-main-missions"]',
        title: 'Jouw Missies',
        content: 'Dit zijn je opdrachten. Elke missie levert XP op en brengt je dichter bij een nieuw level.',
        requireClick: false,
        position: 'top',
    },
    {
        id: 'review-missions',
        target: '[data-tutorial="student-review-missions"]',
        title: 'Herhalingsopdrachten',
        content: 'Oranje opdrachten zijn herhalingen van de vorige periode. Rond deze eerst af om nieuwe missies vrij te spelen.',
        requireClick: false,
        position: 'bottom',
        // Niet elke periode heeft herhalingsopdrachten; dan bestaat de sectie niet.
        skipIfMissing: true,
    },
    {
        // Mobiel is dit de avatarknop in de bovenbalk, op desktop de knop
        // "Mijn portfolio" in de navigatie. De resolver kiest de zichtbare.
        id: 'profile-btn',
        target: '[data-tutorial="student-profile-btn"], [data-tutorial-nav="student-profile-btn"]',
        title: 'Jouw Profiel',
        content: 'Bekijk je avatar, trofeeën en de winkel. Verdien XP om nieuwe items vrij te spelen!',
        requireClick: false,
        position: 'bottom',
    },
    {
        id: 'first-mission',
        target: '[data-tutorial="student-first-mission"]',
        title: 'Klaar? Begin hier!',
        content: "Klik op 'Start missie' om je eerste opdracht te openen. Succes!",
        requireClick: true,
        position: 'bottom',
        // Heeft de docent de periode nog niet geopend, dan is er niets te starten.
        skipIfMissing: true,
    },
];

const TEACHER_STORAGE_KEY = 'teacher_tutorial_completed';
const STUDENT_STORAGE_KEY = 'student_tutorial_completed';

interface TutorialProviderProps {
    children: ReactNode;
    steps?: TutorialStep[];
    autoStart?: boolean;
    storageKey?: string;
    onComplete?: () => void;
    isCompleted?: boolean;
    /**
     * Selector die bewijst dat het scherm waar de rondleiding over gaat
     * gerenderd is. Zonder dit start de rondleiding op een vaste vertraging en
     * racet die met een lazy-geladen dashboard.
     */
    readySelector?: string;
    /**
     * Mag "al gezien" in localStorage staan? Op gedeelde schoolapparaten mag een
     * apparaatvlag nooit bepalen of DEZE leerling de rondleiding heeft gehad;
     * geef dan `false` en laat `isCompleted` het werk doen.
     */
    persistLocally?: boolean;
}

export const TutorialProvider: React.FC<TutorialProviderProps> = ({
    children,
    steps = TEACHER_TUTORIAL_STEPS,
    autoStart = false, // Changed from true to false for clean screenshots
    storageKey = TEACHER_STORAGE_KEY,
    onComplete,
    isCompleted,
    readySelector,
    persistLocally = true,
}) => {
    const [isActive, setIsActive] = useState(false);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [resolvedSteps, setResolvedSteps] = useState<TutorialStep[]>(steps);
    const [hasCompleted, setHasCompleted] = useState(() => {
        if (isCompleted !== undefined) return isCompleted;
        // Onbekend + gedeeld apparaat = behandelen als "nog niet gehad".
        if (!persistLocally) return false;
        return localStorage.getItem(storageKey) === 'true';
    });

    React.useEffect(() => {
        if (isCompleted === undefined) return;
        setHasCompleted(isCompleted);
        // Komt de serverwaarde later alsnog binnen: geen rondleiding bovenop een
        // leerling die hem al gehad heeft.
        if (isCompleted) setIsActive(false);
    }, [isCompleted]);

    // Zelfherstellend: ruim een vlag op die een oudere build hier heeft achtergelaten.
    React.useEffect(() => {
        if (!persistLocally) localStorage.removeItem(storageKey);
    }, [persistLocally, storageKey]);

    /** Alleen stappen waarvan het target er ook echt staat. */
    const pickVisibleSteps = useCallback(
        () => steps.filter(s => !s.skipIfMissing || !s.target || resolveTutorialTarget(s.target)),
        [steps],
    );

    // Auto-start tutorial for first-time users
    React.useEffect(() => {
        if (!autoStart || hasCompleted) return;
        let cancelled = false;
        let attempts = 0;
        let timer = 0;

        const tryStart = () => {
            if (cancelled) return;
            const ready = !readySelector || resolveTutorialTarget(readySelector);
            if (!ready) {
                if (attempts++ > 40) return; // ~8s: het scherm komt niet, geen rondleiding
                timer = window.setTimeout(tryStart, 200);
                return;
            }
            const visible = pickVisibleSteps();
            if (visible.length === 0) return;
            setResolvedSteps(visible);
            setCurrentStepIndex(0);
            setIsActive(true);
        };

        timer = window.setTimeout(tryStart, 400);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [autoStart, hasCompleted, readySelector, pickVisibleSteps]);

    const currentStep = isActive ? resolvedSteps[currentStepIndex] : null;

    const startTutorial = useCallback(() => {
        setResolvedSteps(pickVisibleSteps());
        setCurrentStepIndex(0);
        setIsActive(true);
        // Adoption event logging could be added here
        logger.log('[Tutorial] Started');
    }, [pickVisibleSteps]);

    const endTutorial = useCallback(() => {
        setIsActive(false);
        setHasCompleted(true);
        if (persistLocally) localStorage.setItem(storageKey, 'true');
        onComplete?.();
        logger.log('[Tutorial] Completed');
    }, [storageKey, onComplete, persistLocally]);

    const nextStep = useCallback(() => {
        dismissOpenOverlays();
        if (currentStepIndex < resolvedSteps.length - 1) {
            const newIndex = currentStepIndex + 1;
            setCurrentStepIndex(newIndex);
            resolvedSteps[newIndex]?.onEnter?.();
        } else {
            endTutorial();
        }
    }, [currentStepIndex, resolvedSteps, endTutorial]);

    const prevStep = useCallback(() => {
        dismissOpenOverlays();
        if (currentStepIndex > 0) {
            setCurrentStepIndex(currentStepIndex - 1);
        }
    }, [currentStepIndex]);

    const skipTutorial = useCallback(() => {
        endTutorial();
    }, [endTutorial]);

    const completeStep = useCallback(() => {
        nextStep();
    }, [nextStep]);

    return (
        <TutorialContext.Provider value={{
            isActive,
            currentStepIndex,
            currentStep,
            steps: resolvedSteps,
            startTutorial,
            endTutorial,
            nextStep,
            prevStep,
            skipTutorial,
            completeStep,
            hasCompleted,
        }}>
            {children}
        </TutorialContext.Provider>
    );
};

export const useTutorial = (): TutorialContextType => {
    const context = useContext(TutorialContext);
    if (!context) {
        throw new Error('useTutorial must be used within a TutorialProvider');
    }
    return context;
};

// Reset tutorial (for testing)
export const resetTutorial = (key: string = TEACHER_STORAGE_KEY) => {
    localStorage.removeItem(key);
};

export const resetStudentTutorial = () => {
    localStorage.removeItem(STUDENT_STORAGE_KEY);
};

export { STUDENT_STORAGE_KEY, TEACHER_STORAGE_KEY };
