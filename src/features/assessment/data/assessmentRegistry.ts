/**
 * Assessment Registry
 * Maps assessment IDs from curriculum.ts to their data files.
 * Provides a single lookup function for dynamic assessment loading.
 */

import { AssessmentTask, AssessmentConfig } from '../types';

// Leerjaar 1
import { WEEK_1_ASSESSMENT, WEEK_1_CONFIG } from './week1Assessment';
import { WEEK_2_ASSESSMENT, WEEK_2_CONFIG } from './week2Assessment';
import { WEEK_3_ASSESSMENT, WEEK_3_CONFIG } from './week3Assessment';

// Leerjaar 2
import { J2P1_ASSESSMENT, J2P1_CONFIG } from './j2p1Assessment';
import { J2P2_ASSESSMENT, J2P2_CONFIG } from './j2p2Assessment';
import { J2P3_ASSESSMENT, J2P3_CONFIG } from './j2p3Assessment';
import { J2P4_ASSESSMENT, J2P4_CONFIG } from './j2p4Assessment';

// Leerjaar 3
import { J3P1_ASSESSMENT, J3P1_CONFIG } from './j3p1Assessment';
import { J3P2_ASSESSMENT, J3P2_CONFIG } from './j3p2Assessment';
import { J3P3_ASSESSMENT, J3P3_CONFIG } from './j3p3Assessment';
import { J3P4_ASSESSMENT, J3P4_CONFIG } from './j3p4Assessment';

export interface AssessmentEntry {
    config: AssessmentConfig;
    tasks: AssessmentTask[];
}

/**
 * Registry mapping assessment IDs (from curriculum.ts) to their data.
 * Also includes legacy 'review-week-X' mappings for backward compatibility.
 */
const ASSESSMENT_REGISTRY: Record<string, AssessmentEntry> = {
    // Leerjaar 1
    'assessment-j1-p1': { config: WEEK_1_CONFIG, tasks: WEEK_1_ASSESSMENT },
    'assessment-j1-p2': { config: WEEK_2_CONFIG, tasks: WEEK_2_ASSESSMENT },
    'assessment-j1-p3': { config: WEEK_3_CONFIG, tasks: WEEK_3_ASSESSMENT },
    'assessment-j1-p4': { config: WEEK_1_CONFIG, tasks: WEEK_1_ASSESSMENT }, // Periode 4 hergebruikt week 1 als fallback

    // Legacy mappings (review mission IDs)
    'review-week-1': { config: WEEK_1_CONFIG, tasks: WEEK_1_ASSESSMENT },
    'review-week-2': { config: WEEK_2_CONFIG, tasks: WEEK_2_ASSESSMENT },
    'review-week-3': { config: WEEK_3_CONFIG, tasks: WEEK_3_ASSESSMENT },

    // Leerjaar 2
    'assessment-j2-p1': { config: J2P1_CONFIG, tasks: J2P1_ASSESSMENT },
    'assessment-j2-p2': { config: J2P2_CONFIG, tasks: J2P2_ASSESSMENT },
    'assessment-j2-p3': { config: J2P3_CONFIG, tasks: J2P3_ASSESSMENT },
    'assessment-j2-p4': { config: J2P4_CONFIG, tasks: J2P4_ASSESSMENT },

    // Legacy mappings leerjaar 2
    'data-review': { config: J2P1_CONFIG, tasks: J2P1_ASSESSMENT },
    'code-review-2': { config: J2P2_CONFIG, tasks: J2P2_ASSESSMENT },
    'media-review': { config: J2P3_CONFIG, tasks: J2P3_ASSESSMENT },

    // Leerjaar 3
    'assessment-j3-p1': { config: J3P1_CONFIG, tasks: J3P1_ASSESSMENT },
    'assessment-j3-p2': { config: J3P2_CONFIG, tasks: J3P2_ASSESSMENT },
    'assessment-j3-p3': { config: J3P3_CONFIG, tasks: J3P3_ASSESSMENT },
    'assessment-j3-p4': { config: J3P4_CONFIG, tasks: J3P4_ASSESSMENT },

    // Legacy mappings leerjaar 3
    'advanced-code-review': { config: J3P1_CONFIG, tasks: J3P1_ASSESSMENT },
    'security-review': { config: J3P2_CONFIG, tasks: J3P2_ASSESSMENT },
    'impact-review': { config: J3P3_CONFIG, tasks: J3P3_ASSESSMENT },
};

/**
 * Look up assessment data by ID.
 * Supports both curriculum assessment IDs and review mission IDs.
 */
export function getAssessment(id: string): AssessmentEntry | undefined {
    return ASSESSMENT_REGISTRY[id];
}

/**
 * Check if an assessment exists for a given ID.
 */
export function hasAssessment(id: string): boolean {
    return id in ASSESSMENT_REGISTRY;
}
