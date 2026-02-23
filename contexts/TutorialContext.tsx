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

// Tutorial steps definition
export const TEACHER_TUTORIAL_STEPS: TutorialStep[] = [
    {
        id: 'welcome',
        target: null,
        title: 'Welkom in je docentendashboard',
        content: 'Dit is een korte producttour. Je klikt zelf op de belangrijkste knoppen, net als in games, zodat je direct ziet wat elke actie doet.',
        requireClick: false,
    },
    {
        id: 'start-lesson',
        target: '[data-tutorial="presentation-btn"]',
        title: 'Start je les in 1 klik',
        content: 'Klik nu op Presentatie. Je ziet daarna direct het presentatiescherm met de QR-code voor leerlingen.',
        requireClick: true,
        position: 'bottom',
    },
    {
        id: 'focus-task',
        target: '[data-tutorial="focus-toggle"]',
        title: 'Stuur de klas met Focus',
        content: 'Klik op de Focus-schakelaar. Je ziet meteen dat je een opdracht kunt kiezen om alle leerlingen naar dezelfde taak te sturen.',
        requireClick: true,
        position: 'bottom',
    },
    {
        id: 'students-tab',
        target: '[data-tutorial="students-tab"]',
        title: 'Open het leerlingenoverzicht',
        content: 'Klik op de tab Leerlingen. Daar beheer je individuele leerlingen en klassencommunicatie.',
        requireClick: true,
        position: 'bottom',
    },
    {
        id: 'student-message',
        target: '[data-tutorial="students-message-btn"]',
        title: 'Stuur snel een klasbericht',
        content: 'Klik op Bericht. Zo zie je direct waar je berichten stuurt naar alle leerlingen, een klas of een individuele leerling.',
        requireClick: true,
        position: 'bottom',
        onEnter: () => {
            clickTutorialTarget('[data-tutorial="students-tab"]');
        },
    },
    {
        id: 'activities-tab',
        target: '[data-tutorial="activities-tab"]',
        title: 'Ga naar activiteiten en beloningen',
        content: 'Klik op Activiteiten. Dit is je route naar games en gamification-motivatie voor de klas.',
        requireClick: true,
        position: 'bottom',
    },
    {
        id: 'xp-boost',
        target: '[data-tutorial="xp-boost-btn"]',
        title: 'Activeer een XP-moment',
        content: 'Klik op XP Boost om te zien waar je motivatie-events start voor extra betrokkenheid tijdens de les.',
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
        title: 'Terug naar overzicht en voortgang',
        content: 'Klik op Dashboard. Hier vind je de klasstatus, signalering en voortgang richting SLO-doelen.',
        requireClick: true,
        position: 'bottom',
    },
    {
        id: 'complete',
        target: null,
        title: 'Klaar voor je eerste les',
        content: 'Top. Je hebt de belangrijkste docentacties doorlopen. Gebruik het vraagteken rechtsonder om deze tour later opnieuw te starten.',
        requireClick: false,
    },
];

// Student tutorial steps
export const STUDENT_TUTORIAL_STEPS: TutorialStep[] = [
    {
        id: 'welcome',
        target: null,
        title: '🚀 Welkom Future Architect!',
        content: 'Dit is jouw dashboard voor alle digitale vaardigheden. Laten we even rondkijken zodat je weet waar alles zit!',
        requireClick: false,
    },
    {
        id: 'profile-btn',
        target: '[data-tutorial="student-profile-btn"]',
        title: '👤 Jouw Profiel',
        content: 'Hier vind je jouw profiel met avatar, trofeeën en opgeslagen werk. Klik op je profielfoto!',
        requireClick: true,
        position: 'bottom',
    },
    {
        id: 'avatar-btn',
        target: '[data-tutorial="student-avatar-btn"]',
        title: '🎨 Avatar Aanpassen',
        content: 'Maak je eigen unieke avatar! Klik hier om je uiterlijk aan te passen.',
        requireClick: true,
        position: 'left',
    },
    {
        id: 'avatar-shop',
        target: null,
        title: '🛒 De Winkel',
        content: 'In de avatar editor vind je ook de WINKEL. Daar kun je met verdiende XP nieuwe items kopen zoals hoeden, brillen en achtergronden! Sluit dit scherm om verder te gaan.',
        requireClick: false,
    },
    {
        id: 'feedback-btn',
        target: '[data-tutorial="student-feedback-btn"]',
        title: '💬 Feedback Geven',
        content: 'Heb je een idee of bug gevonden? Klik hier om feedback te sturen naar de ontwikkelaar!',
        requireClick: true,
        position: 'bottom',
    },
    {
        id: 'feedback-close',
        target: null,
        title: '✅ Feedback Verstuurd',
        content: 'Super! Je feedback helpt ons de website beter te maken. Sluit dit scherm om verder te gaan.',
        requireClick: false,
    },
    {
        id: 'review-missions',
        target: '[data-tutorial="student-review-missions"]',
        title: '🔄 Herhalingsopdrachten',
        content: 'De ORANJE opdrachten zijn herhalingen van vorige lessen. Deze moet je eerst afronden voordat je nieuwe opdrachten kunt doen!',
        requireClick: false,
        position: 'bottom',
    },
    {
        id: 'main-missions',
        target: '[data-tutorial="student-main-missions"]',
        title: '🎯 Nieuwe Opdrachten',
        content: 'Dit zijn de nieuwe missies waar je XP en badges mee kunt verdienen. Elke opdracht leert je iets nieuws over digitale vaardigheden en AI!',
        requireClick: false,
        position: 'top',
    },
    {
        id: 'first-mission',
        target: '[data-tutorial="student-first-mission"]',
        title: '▶️ Start een Opdracht',
        content: 'Klik op een opdracht om te beginnen! Je kunt altijd terugkeren naar dit overzicht.',
        requireClick: true,
        position: 'bottom',
    },
    {
        id: 'complete',
        target: null,
        title: '🎉 Je bent klaar!',
        content: 'Je weet nu hoe alles werkt! Veel succes met je digitale avontuur. Je kunt deze tutorial altijd opnieuw starten via het vraagteken rechtsonder.',
        requireClick: false,
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
