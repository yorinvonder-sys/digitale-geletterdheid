import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { shouldAutoStart } from '@/features/onboarding/core/autostart';
import { isTourDisabled, isTourSeen, markTourSeen, type TourId } from '@/features/onboarding/core/tourStorage';
import { resolveTourSteps } from '@/features/onboarding/core/resolveTour';

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

const doel = (sleutel: string) => `[data-tutorial="${sleutel}"]`;

// Zijbalk en mobiele balk dragen dezelfde sleutel; de spotlight kiest zelf het
// zichtbare exemplaar, dus een apart `data-tutorial-mobile` is niet meer nodig.
const navTarget = (tab: string) => doel(`teacher-nav-${tab}`);

/**
 * Volgorde volgt de dag van een docent: eerst zien wat er speelt, dan ingrijpen,
 * dan verantwoorden. Stappen die een schermvullend venster openen laten we de
 * gebruiker zelf aanklikken; de rest gaat met de doorknop.
 */
export const TEACHER_TUTORIAL_STEPS: TutorialStep[] = [
    {
        id: 'welcome',
        target: null,
        title: 'Welkom bij je dashboard',
        content: 'In een minuut laten we zien waar je klas staat, hoe je bijstuurt en waar het bewijs voor school vandaan komt.',
    },
    {
        id: 'today-tab',
        target: navTarget('overview'),
        title: 'Vandaag',
        content: 'Je startscherm: wie aandacht nodig heeft en waar de klas op dit moment aan werkt.',
        position: 'right',
        beforeEnter: (actions) => actions.goTo?.('overview'),
    },
    {
        id: 'class-filter',
        target: doel('teacher-class-filter'),
        title: 'Kies je klas',
        content: 'Alles op dit scherm — cijfers, lijsten en exports — volgt de klas die je hier kiest.',
        position: 'bottom',
    },
    {
        id: 'attention',
        target: doel('teacher-attention'),
        title: 'Wie heeft je nodig',
        content: 'Leerlingen die vastlopen of achterblijven staan bovenaan, zodat je niet zelf hoeft te zoeken.',
        position: 'bottom',
    },
    {
        id: 'mission-map',
        target: doel('teacher-mission-map'),
        title: 'Waar de klas aan werkt',
        content: 'Per missie zie je hoeveel leerlingen gestart en klaar zijn, met de SLO-doelen die eronder zitten.',
        position: 'top',
    },
    {
        id: 'focus-task',
        target: doel('teacher-focus-toggle'),
        title: 'Focusmodus',
        content: 'Zet de hele klas op dezelfde opdracht — handig aan het begin van een les.',
        position: 'bottom',
        beforeEnter: (actions) => actions.goTo?.('overview'),
    },
    {
        id: 'students-import',
        target: doel('teacher-students-import'),
        title: 'Leerlingen toevoegen',
        content: 'Zet je klassenlijst in één keer klaar met een import; daarna kun je per leerling verder.',
        position: 'bottom',
        beforeEnter: (actions) => actions.goTo?.('students'),
    },
    {
        id: 'student-message',
        target: doel('teacher-students-message'),
        title: 'Klasbericht',
        content: 'Stuur een bericht naar de hele klas of naar één leerling.',
        position: 'bottom',
        beforeEnter: (actions) => actions.goTo?.('students'),
    },
    {
        id: 'evidence-views',
        target: doel('teacher-evidence-views'),
        title: 'Bewijs voor school',
        content: 'Voortgang, SLO-dekking en groei — de onderbouwing die je nodig hebt richting school en inspectie.',
        position: 'bottom',
        beforeEnter: (actions) => actions.goTo?.('progress'),
    },
    {
        id: 'presentation',
        target: doel('teacher-presentation'),
        title: 'Klaar om les te geven',
        content: 'Hiermee open je het presentatiescherm met QR-code voor op het digibord.',
        position: 'bottom',
        beforeEnter: (actions) => actions.goTo?.('overview'),
    },
    {
        id: 'account-menu',
        target: doel('teacher-account-menu'),
        title: 'De rest staat hier',
        content: 'Instellingen, missies aan- of uitzetten, de kennisbank en deze rondleiding vind je in dit menu terug.',
        position: 'bottom',
    },
];

/**
 * Volgorde: eerst waar je bent, dan wat je moet doen, dan wat je ermee verdient.
 * Stappen waarvan het doel op dit scherm niet bestaat — de leerlijnkiezer bij één
 * leerjaar, de XP-balk op desktop — worden bij de start vanzelf weggelaten.
 */
export const STUDENT_TUTORIAL_STEPS: TutorialStep[] = [
    {
        id: 'welcome',
        target: null, // schermvullend
        title: 'Welkom bij Project DG!',
        content: 'Dit is jouw dashboard. Hier staan al je missies, je XP en je trofeeën. We laten even zien hoe het werkt.',
    },
    {
        id: 'main-missions',
        target: doel('student-main-missions'),
        title: 'Jouw missies',
        content: 'Dit zijn je opdrachten. Elke missie levert XP op en brengt je dichter bij een nieuw level.',
        position: 'top',
    },
    {
        id: 'review-missions',
        target: doel('student-review-missions'),
        title: 'Herhalingsopdrachten',
        content: 'Deze komen uit de vorige periode. Maak ze eerst af, dan spelen je nieuwe missies vrij.',
        position: 'bottom',
    },
    {
        id: 'period',
        target: doel('student-period'),
        title: 'Wisselen van periode',
        content: 'Hiermee spring je naar een andere periode — handig om terug te kijken wat je al gedaan hebt.',
        position: 'bottom',
    },
    {
        id: 'yearline',
        target: doel('student-yearline'),
        title: 'Jouw leerlijn',
        content: 'Zit je in meerdere leerjaren? Hier kies je welke leerlijn je nu volgt.',
        position: 'bottom',
    },
    {
        id: 'xp',
        target: doel('student-xp'),
        title: 'Je XP en level',
        content: 'Elke afgeronde missie levert XP op. Tik erop om te zien hoeveel je nog nodig hebt voor het volgende level.',
        position: 'bottom',
    },
    {
        id: 'profile-btn',
        target: doel('student-profile-btn'),
        title: 'Jouw portfolio',
        content: 'Hier vind je je avatar, je trofeeën en de winkel waar je XP kunt uitgeven.',
        position: 'bottom',
    },
    {
        id: 'first-mission',
        target: doel('student-first-mission'),
        title: 'Klaar? Begin hier!',
        content: 'Klik op deze opdracht om je eerste missie te starten. Succes!',
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

    // De stappen die deze gebruiker op dit scherm daadwerkelijk krijgt. Wordt bij
    // de start bepaald; zie resolveTour.ts voor waarom sommige afvallen.
    const [activeSteps, setActiveSteps] = useState<TutorialStep[]>(steps);
    const activeStepsRef = React.useRef(activeSteps);
    activeStepsRef.current = activeSteps;

    React.useEffect(() => { setActiveSteps(steps); }, [steps]);

    const resolveSteps = useCallback((): TutorialStep[] => {
        const bestaat = (selector: string) => {
            try {
                return Array.from(document.querySelectorAll<HTMLElement>(selector)).some((el) => {
                    const r = el.getBoundingClientRect();
                    return r.width > 0 && r.height > 0;
                });
            } catch {
                return false;
            }
        };
        const gefilterd = resolveTourSteps(steps, bestaat);
        // Valt alles weg (bijvoorbeeld doordat het dashboard nog niet gerenderd is),
        // val dan terug op de volledige lijst in plaats van een lege rondleiding.
        const resultaat = gefilterd.length > 0 ? gefilterd : steps;
        activeStepsRef.current = resultaat;
        setActiveSteps(resultaat);
        return resultaat;
    }, [steps]);

    /**
     * Zet het dashboard klaar voor een stap.
     *
     * Dit gebeurde eerder alleen bij vooruit navigeren, waardoor teruggaan je op
     * het verkeerde tabblad achterliet en de spotlight naar een element wees dat
     * niet in beeld was.
     */
    const enterStep = useCallback((index: number) => {
        const step = activeStepsRef.current[index];
        if (!step) return;
        actionsRef.current.closeOverlays?.();
        step.beforeEnter?.(actionsRef.current);
    }, []);

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
        // Korte vertraging zodat het dashboard eerst kan renderen — pas daarna
        // valt te zien welke stappen op dit scherm een doel hebben.
        const timer = setTimeout(() => {
            resolveSteps();
            setCurrentStepIndex(0);
            setIsActive(true);
            enterStep(0);
        }, 800);
        return () => clearTimeout(timer);
    }, [autoStart, hasCompleted, seenThisSession, isDemo, enterStep, resolveSteps]);

    const currentStep = isActive ? activeSteps[currentStepIndex] : null;

    const startTutorial = useCallback(() => {
        resolveSteps();
        setCurrentStepIndex(0);
        setIsActive(true);
        enterStep(0);
    }, [enterStep, resolveSteps]);

    const endTutorial = useCallback(() => {
        setIsActive(false);
        // Eerst het sessievangnet, dan pas de server: faalt de RPC, dan start de
        // rondleiding deze sessie in elk geval niet opnieuw.
        markTourSeen(getSessionStore(), userId, tourId);
        setSeenThisSession(true);
        onComplete?.();
    }, [userId, tourId, onComplete]);

    const nextStep = useCallback(() => {
        if (currentStepIndex < activeSteps.length - 1) {
            const newIndex = currentStepIndex + 1;
            setCurrentStepIndex(newIndex);
            enterStep(newIndex);
        } else {
            endTutorial();
        }
    }, [currentStepIndex, activeSteps, endTutorial, enterStep]);

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
            steps: activeSteps,
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
