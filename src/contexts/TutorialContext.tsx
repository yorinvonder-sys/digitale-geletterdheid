import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { shouldAutoStart } from '@/features/onboarding/core/autostart';
import { isTourDisabled, isTourSeen, markTourSeen, type TourId } from '@/features/onboarding/core/tourStorage';

/**
 * Wat een stap het omliggende dashboard mag laten doen.
 *
 * Hiervóór stuurde de rondleiding het dashboard aan door zelf knoppen uit de DOM
 * te vissen en `.click()` aan te roepen, en door een backdrop met een `lab-*`
 * klassenaam te zoeken die na de duck-migratie niet meer bestond. Dat is
 * gekoppeld aan opmaak die verandert. Het dashboard levert nu zijn eigen acties
 * aan, die zijn React-state aansturen.
 */
export interface TourActions {
    /** Navigeer naar een tabblad of gebied binnen het huidige dashboard. */
    goTo?: (area: string) => void;
    /** Sluit menu's en modals die de rondleiding in de weg zitten. */
    closeOverlays?: () => void;
}

export interface TutorialStep {
    id: string;
    target: string | null; // CSS-selector, of null voor een schermvullende stap
    title: string;
    content: string;
    requireClick?: boolean;
    position?: 'top' | 'bottom' | 'left' | 'right';
    /** Zet het dashboard klaar voordat deze stap in beeld komt. */
    beforeEnter?: (actions: TourActions) => void;
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
    /** Waar terwijl een modal het scherm bezit — de overlay verbergt zich dan. */
    isBlocked: boolean;
    setBlocker: (id: string, active: boolean) => void;
    /** Het dashboard meldt hier welke acties de rondleiding mag uitvoeren. */
    registerActions: (actions: TourActions | null) => void;
}

const TutorialContext = createContext<TutorialContextType | null>(null);

// De navigatiesleutel staat zowel op de zijbalk als op de mobiele balk. De
// spotlight kiest zelf het zichtbare exemplaar, dus één sleutel volstaat.
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
        beforeEnter: (actions) => actions.goTo?.('overview'),
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
        beforeEnter: (actions) => actions.goTo?.('students'),
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

const NO_ACTIONS: TourActions = {};

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

    // Componenten die het scherm even opeisen (presentatie, roosterimport,
    // berichtvenster) melden zich hier. De rondleiding verbergt zich dan en
    // onthoudt de stap, in plaats van boven een zwart scherm te blijven wijzen.
    const [blockers, setBlockers] = useState<readonly string[]>([]);
    const setBlocker = useCallback((id: string, active: boolean) => {
        setBlockers((prev) => {
            const present = prev.includes(id);
            if (active === present) return prev;
            return active ? [...prev, id] : prev.filter((entry) => entry !== id);
        });
    }, []);

    // Het dashboard dat onder deze provider hangt levert zijn eigen acties aan.
    // In een ref, niet in state: een stap leest ze op het moment dat hij start,
    // en een nieuwe actieset hoeft geen herrender te veroorzaken.
    const actionsRef = React.useRef<TourActions>(NO_ACTIONS);
    const registerActions = useCallback((actions: TourActions | null) => {
        actionsRef.current = actions ?? NO_ACTIONS;
    }, []);

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

    /**
     * Zet het dashboard klaar voor een stap.
     *
     * Dit gebeurde eerder alleen bij vooruit navigeren, waardoor teruggaan je op
     * het verkeerde tabblad achterliet en de spotlight naar een element wees dat
     * niet in beeld was.
     */
    const enterStep = useCallback((index: number) => {
        const step = steps[index];
        if (!step) return;
        actionsRef.current.closeOverlays?.();
        step.beforeEnter?.(actionsRef.current);
    }, [steps]);

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
        const timer = setTimeout(() => {
            setIsActive(true);
            enterStep(0);
        }, 800);
        return () => clearTimeout(timer);
    }, [autoStart, hasCompleted, seenThisSession, isDemo, enterStep]);

    const currentStep = isActive ? steps[currentStepIndex] : null;

    const startTutorial = useCallback(() => {
        setCurrentStepIndex(0);
        setIsActive(true);
        enterStep(0);
    }, [enterStep]);

    const endTutorial = useCallback(() => {
        setIsActive(false);
        // Eerst het sessievangnet, dan pas de server: faalt de RPC, dan start de
        // rondleiding deze sessie in elk geval niet opnieuw.
        markTourSeen(getSessionStore(), userId, tourId);
        setSeenThisSession(true);
        onComplete?.();
    }, [userId, tourId, onComplete]);

    const nextStep = useCallback(() => {
        if (currentStepIndex < steps.length - 1) {
            const newIndex = currentStepIndex + 1;
            setCurrentStepIndex(newIndex);
            enterStep(newIndex);
        } else {
            endTutorial();
        }
    }, [currentStepIndex, steps, endTutorial, enterStep]);

    const prevStep = useCallback(() => {
        if (currentStepIndex > 0) {
            const newIndex = currentStepIndex - 1;
            setCurrentStepIndex(newIndex);
            enterStep(newIndex);
        }
    }, [currentStepIndex, enterStep]);

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
            isBlocked: blockers.length > 0,
            setBlocker,
            registerActions,
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

/**
 * Meld dat dit component het scherm opeist zolang `active` waar is.
 *
 * De rondleiding verbergt zich dan en onthoudt de stap. Nodig omdat de spotlight
 * op `z-[9999]` staat: zonder dit bleef hij elementen aanwijzen die achter een
 * schermvullende presentatie of modal verdwenen waren.
 *
 * Veilig buiten een provider (publieke demo) — dan doet de hook niets.
 */
export const useTourBlocker = (id: string, active: boolean): void => {
    const tour = useContext(TutorialContext);
    const setBlocker = tour?.setBlocker;

    React.useEffect(() => {
        if (!setBlocker) return;
        setBlocker(id, active);
        return () => setBlocker(id, false);
    }, [setBlocker, id, active]);
};

/**
 * Meld welke acties de rondleiding op dit dashboard mag uitvoeren.
 *
 * Geef een stabiele `actions` mee (bijvoorbeeld uit `useMemo`); state-setters
 * uit `useState` zijn zelf al stabiel. Veilig buiten een provider.
 */
export const useTourActions = (actions: TourActions): void => {
    const tour = useContext(TutorialContext);
    const registerActions = tour?.registerActions;

    React.useEffect(() => {
        if (!registerActions) return;
        registerActions(actions);
        return () => registerActions(null);
    }, [registerActions, actions]);
};
