
import { ReactNode } from 'react';

export type AssessmentType = 'inspector' | 'simulator' | 'rescuer';

export interface AssessmentConfig {
    title: string;
    description: string;
    introIcon: string; // Emoji or Lucide icon name
    themeColor: string; // Tailwind class or hex
    introText: ReactNode; // Customizable introduction text
    hybridAssessment?: {
        autoWeight: number; // 0-1 (AI automatic checks)
        teacherWeight: number; // 0-1 (teacher validation)
        teacherChecklist: {
            id: string;
            label: string;
            required?: boolean;
        }[];
        teacherInstructions?: string;
    };
}

export interface BaseTask {
    id: string;
    type: AssessmentType;
    title: string;
    description: string;
    xpReward: number;
}

// INSPECTOR (Fouten opsporen)
export interface InspectorHotspot {
    id: string;
    x: number; // percentage (0-100)
    y: number; // percentage (0-100)
    width: number; // percentage
    height: number; // percentage
    label: string; // Internal label for debugging
    correct: boolean; // Is this the error we are looking for?
    feedback: string; // Message shown when clicked
}

export interface InspectorTask extends BaseTask {
    type: 'inspector';
    image: string; // Path to screenshot/image (can be a placeholder color for now)
    hotspots: InspectorHotspot[];
    question: string; // "Waar zit de fout in deze slide?"
}

// SIMULATOR (Drag & Drop)
export interface SimItem {
    id: string;
    type: 'file' | 'folder' | 'app';
    name: string;
    icon?: string; // Lucide icon name
    content?: string; // Text content if it's a file
}

export interface SimTarget {
    id: string;
    name: string;
    type: 'folder' | 'cloud' | 'trash';
    accepts: string[]; // List of item IDs or types it accepts
}

export interface SimulatorTask extends BaseTask {
    type: 'simulator';
    items: SimItem[];
    targets: SimTarget[];
    goal: string; // "Verplaats het bestand 'Huiswerk' naar de map 'OneDrive'"
    successCondition: (state: any) => boolean; // Logic to check if done (simplified in data)
}

// RESCUER (Scenario Sequence)
export interface RescuerStep {
    id: string;
    text: string;
}

export interface RescuerTask extends BaseTask {
    type: 'rescuer';
    npcName: string;
    npcAvatar?: string;
    scenario: string; // "Help! Mijn Word doet raar. Alles staat door elkaar."
    availableSteps: RescuerStep[]; // Pool of possible steps (including wrong ones)
    correctSequence: string[]; // Array of step IDs in order
}

export type AssessmentTask = InspectorTask | SimulatorTask | RescuerTask;

export interface AssessmentState {
    currentTaskIndex: number;
    score: number;
    completedTasks: string[];
    isFinished: boolean;
}
