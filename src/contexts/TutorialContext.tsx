import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { shouldAutoStart } from '@/features/onboarding/core/autostart';
import { isTourDisabled, isTourSeen, markTourSeen, type TourId } from '@/features/onboarding/core/tourStorage';

export interface TutorialStep {
    id: string;
    target: string | null; // CSS selector or null for fullscreen
    title: string;
    content: string;
    requireClick?: boolean;
    position?: 'top' | 'bottom' | 'left' | 'right';
    onEnter?: () => void; // Callback when step becomes active
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

const clickTutorialTarget = (selector: string, delayMs = 0) => {
    const run = () => {
        const element = document.querySelector(selector) as HTMLElement | null;
        element?.click();
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
        title: 'Welkom bij Project DG!',
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
    },
    {
        id: 'profile-btn',
        target: '[data-tutorial="student-profile-btn"]',
        title: 'Jouw Profiel',
        content: 'Bekijk je avatar, trofeeën en de winkel. Verdien XP om nieuwe items vrij te spelen!',
        requireClick: false,
        position: 'left',
    },
    {
        id: 'first-mission',
        target: '[data-tutorial="student-first-mission"]',
        title: 'Klaar? Begin hier!',
        content: 'Klik op een opdracht om je eerste missie te starten. Succes!',
        requireClick: true,
        position: 'bottom',
    },
];

interface TutorialProviderProps {
    children: ReactNode;
    steps?: TutorialStep[];
    autoStart?: boolean;
    /** Welke rondleiding dit is — bepaalt de sessiesleutel. */
    tourId?: TourId;
    /** Gebruikers-id: maakt het sessievangnet uniek per persoon. */
    userId?: string | null;
    /** Serverwaarheid uit `users.stats`. Ontbreekt hij, dan geldt "nog niet gedaan". */
    completed?: boolean;
    /** Publieke demo of marketingpreview — daar start nooit een rondleiding. */
    isDemo?: boolean;
    onComplete?: () => void;
}

const getSessionStore = (): Storage | null => {
    try {
        return typeof window === 'undefined' ? null : window.sessionStorage;
    } catch {
        return null;
    }
};

const getLocalStore = (): Storage | null => {
    try {
        return typeof window === 'undefined' ? null : window.localStorage;
    } catch {
        return null;
    }
};

export const TutorialProvider: React.FC<TutorialProviderProps> = ({
    children,
    steps = TEACHER_TUTORIAL_STEPS,
    autoStart = false,
    tourId = 'teacher',
    userId,
    completed,
    isDemo = false,
    onComplete
}) => {
    const [isActive, setIsActive] = useState(false);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    // De server is leidend. Het sessievangnet dekt alleen het geval dat de
    // RPC faalde nadat de gebruiker de rondleiding wél had afgerond; het is
    // per gebruiker gescheiden, dus een volgende leerling erft het niet.
    const [seenThisSession, setSeenThisSession] = useState(
        () => isTourSeen(getSessionStore(), userId, tourId)
    );

    // Wisselt de gebruiker binnen dezelfde tab, dan hoort het vangnet mee te wisselen.
    React.useEffect(() => {
        setSeenThisSession(isTourSeen(getSessionStore(), userId, tourId));
    }, [userId, tourId]);

    const hasCompleted = completed === true || seenThisSession;

    // Auto-start voor wie hem nog niet gezien heeft.
    React.useEffect(() => {
        const mayStart = shouldAutoStart({
            enabled: autoStart,
            completed: hasCompleted,
            seenThisSession,
            disabled: isTourDisabled(window.location.search, getLocalStore()),
            ready: true,
            isDemo,
        });
        if (!mayStart) return;
        // Korte vertraging zodat het dashboard eerst kan renderen.
        const timer = setTimeout(() => setIsActive(true), 800);
        return () => clearTimeout(timer);
    }, [autoStart, hasCompleted, seenThisSession, isDemo]);

    const currentStep = isActive ? steps[currentStepIndex] : null;

    const startTutorial = useCallback(() => {
        setCurrentStepIndex(0);
        setIsActive(true);
    }, []);

    const endTutorial = useCallback(() => {
        setIsActive(false);
        // Eerst het sessievangnet, dan pas de server: faalt de RPC, dan start de
        // rondleiding deze sessie in elk geval niet opnieuw.
        markTourSeen(getSessionStore(), userId, tourId);
        setSeenThisSession(true);
        onComplete?.();
    }, [userId, tourId, onComplete]);

    const nextStep = useCallback(() => {
        dismissOpenOverlays();
        if (currentStepIndex < steps.length - 1) {
            const newIndex = currentStepIndex + 1;
            setCurrentStepIndex(newIndex);
            steps[newIndex]?.onEnter?.();
        } else {
            endTutorial();
        }
    }, [currentStepIndex, steps, endTutorial]);

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
            steps,
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

/**
 * Buiten een provider (publieke demo, marketingpreview) is er geen rondleiding.
 * `useTutorial` gooit daar bewust; deze variant geeft `null` terug voor
 * componenten die zowel binnen als buiten de app-shell gerenderd worden.
 */
export const useTutorialOptional = (): TutorialContextType | null => useContext(TutorialContext);
