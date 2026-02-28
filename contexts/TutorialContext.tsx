import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

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
    const feedbackBackdrop = document.querySelector('.fixed.inset-0.z-\\[100\\] .bg-slate-900\\/60') as HTMLElement | null;
    feedbackBackdrop?.click();
    // Close profile dropdown by clicking outside
    const profileMenu = document.querySelector('[aria-haspopup="true"][aria-expanded="true"]') as HTMLElement | null;
    if (profileMenu) {
        document.body.click();
    }
};

// Tutorial steps definition
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
        title: 'Focus-modus',
        content: 'Stuur alle leerlingen naar dezelfde opdracht.',
        requireClick: true,
        position: 'bottom',
    },
    {
        id: 'students-tab',
        target: '[data-tutorial="students-tab"]',
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
            clickTutorialTarget('[data-tutorial="students-tab"]');
        },
    },
    {
        id: 'activities-tab',
        target: '[data-tutorial="activities-tab"]',
        title: 'Activiteiten',
        content: 'Games en gamification voor de klas.',
        requireClick: true,
        position: 'bottom',
    },
    {
        id: 'xp-boost',
        target: '[data-tutorial="xp-boost-btn"]',
        title: 'XP Boost',
        content: 'Start motivatie-events voor extra betrokkenheid.',
        requireClick: true,
        position: 'bottom',
        onEnter: () => {
            clickTutorialTarget('[data-tutorial="activities-tab"]');
            clickTutorialTarget('[data-tutorial="gamification-subtab"]', 50);
        },
    },
    {
        id: 'slo-overview',
        target: '[data-tutorial="dashboard-tab"]',
        title: 'Dashboard',
        content: 'Klasstatus, signalering en voortgang richting SLO-doelen.',
        requireClick: true,
        position: 'bottom',
    },
];

// Student tutorial steps
// Kept simple: only point-and-explain, no dropdown/modal interactions.
// One requireClick at the end to start the first mission.
export const STUDENT_TUTORIAL_STEPS: TutorialStep[] = [
    {
        id: 'profile-btn',
        target: '[data-tutorial="student-profile-btn"]',
        title: 'Jouw Profiel',
        content: 'Hier vind je je avatar, trofeeën en de winkel.',
        requireClick: false,
        position: 'bottom',
    },
    {
        id: 'feedback-btn',
        target: '[data-tutorial="student-feedback-btn"]',
        title: 'Feedback',
        content: 'Idee of bug? Stuur hier direct feedback.',
        requireClick: false,
        position: 'bottom',
    },
    {
        id: 'review-missions',
        target: '[data-tutorial="student-review-missions"]',
        title: 'Herhalingsopdrachten',
        content: 'De oranje opdrachten zijn herhalingen. Rond deze eerst af voor nieuwe missies.',
        requireClick: false,
        position: 'bottom',
    },
    {
        id: 'main-missions',
        target: '[data-tutorial="student-main-missions"]',
        title: 'Nieuwe Opdrachten',
        content: 'Dit zijn je nieuwe missies. Hier verdien je XP en badges.',
        requireClick: false,
        position: 'top',
    },
    {
        id: 'first-mission',
        target: '[data-tutorial="student-first-mission"]',
        title: 'Begin hier!',
        content: 'Klik op een opdracht om te starten.',
        requireClick: true,
        position: 'bottom',
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
}

export const TutorialProvider: React.FC<TutorialProviderProps> = ({
    children,
    steps = TEACHER_TUTORIAL_STEPS,
    autoStart = false, // Changed from true to false for clean screenshots
    storageKey = TEACHER_STORAGE_KEY,
    onComplete,
    isCompleted
}) => {
    const [isActive, setIsActive] = useState(false);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [hasCompleted, setHasCompleted] = useState(() => {
        if (isCompleted !== undefined) return isCompleted;
        return localStorage.getItem(storageKey) === 'true';
    });

    React.useEffect(() => {
        if (isCompleted !== undefined) {
            setHasCompleted(isCompleted);
        }
    }, [isCompleted]);


    // Auto-start tutorial for first-time users
    React.useEffect(() => {
        if (autoStart && !hasCompleted) {
            // Small delay to let dashboard render first
            const timer = setTimeout(() => setIsActive(true), 800);
            return () => clearTimeout(timer);
        }
    }, [autoStart, hasCompleted]);

    const currentStep = isActive ? steps[currentStepIndex] : null;

    const startTutorial = useCallback(() => {
        setCurrentStepIndex(0);
        setIsActive(true);
        // Adoption event logging could be added here
        console.log('[Tutorial] Started');
    }, []);

    const endTutorial = useCallback(() => {
        setIsActive(false);
        setHasCompleted(true);
        localStorage.setItem(storageKey, 'true');
        onComplete?.();
        console.log('[Tutorial] Completed');
    }, [storageKey, onComplete]);

    const nextStep = useCallback(() => {
        if (currentStepIndex < steps.length - 1) {
            const newIndex = currentStepIndex + 1;
            setCurrentStepIndex(newIndex);
            // Call onEnter callback if defined
            steps[newIndex]?.onEnter?.();
            console.log(`[Tutorial] Step ${newIndex} reached: ${steps[newIndex].id}`);
        } else {
            endTutorial();
        }
    }, [currentStepIndex, steps, endTutorial]);

    const prevStep = useCallback(() => {
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

// Reset tutorial (for testing)
export const resetTutorial = (key: string = TEACHER_STORAGE_KEY) => {
    localStorage.removeItem(key);
};

export const resetStudentTutorial = () => {
    localStorage.removeItem(STUDENT_STORAGE_KEY);
};

export { STUDENT_STORAGE_KEY, TEACHER_STORAGE_KEY };
