import type { TemplateMissionEntry, TemplateType } from '@/features/missions/templates/shared/types';

/**
 * Registry of all template-based missions.
 * Adding a mission here automatically routes it to the correct template.
 * No changes needed in AuthenticatedApp.tsx.
 */
export const TEMPLATE_MISSIONS: Record<string, TemplateMissionEntry> = {
    // === ScenarioEngine (11) ===
    'mail-detective':       { missionId: 'mail-detective',       templateType: 'scenario-engine' },
    'cookie-crusher':       { missionId: 'cookie-crusher',       templateType: 'scenario-engine' },
    'notificatie-ninja':    { missionId: 'notificatie-ninja',    templateType: 'scenario-engine' },
    'online-helden':        { missionId: 'online-helden',        templateType: 'scenario-engine' },
    'phishing-fighter':     { missionId: 'phishing-fighter',     templateType: 'scenario-engine' },
    'social-safeguard':     { missionId: 'social-safeguard',     templateType: 'scenario-engine' },
    'veilig-internet':      { missionId: 'veilig-internet',      templateType: 'scenario-engine' },
    'factchecker':          { missionId: 'factchecker',          templateType: 'scenario-engine' },
    'ai-bias-detective':    { missionId: 'ai-bias-detective',    templateType: 'scenario-engine' },
    'digital-forensics':    { missionId: 'digital-forensics',    templateType: 'scenario-engine' },
    'code-denker':          { missionId: 'code-denker',          templateType: 'scenario-engine' },
    'data-speurder':        { missionId: 'data-speurder',        templateType: 'scenario-engine' },

    // === PuzzleLab (5) ===
    'encryption-expert':    { missionId: 'encryption-expert',    templateType: 'puzzle-lab' },
    'cyber-detective':      { missionId: 'cyber-detective',      templateType: 'puzzle-lab' },
    'wachtwoord-warrior':   { missionId: 'wachtwoord-warrior',   templateType: 'puzzle-lab' },
    'data-handelaar':       { missionId: 'data-handelaar',       templateType: 'puzzle-lab' },
    'security-auditor':     { missionId: 'security-auditor',     templateType: 'puzzle-lab' },

    // === SimulationLab (5) ===
    'privacy-by-design':    { missionId: 'privacy-by-design',    templateType: 'simulation-lab' },
    'bug-hunter':           { missionId: 'bug-hunter',           templateType: 'simulation-lab' },
    'code-reviewer':        { missionId: 'code-reviewer',        templateType: 'simulation-lab' },
    'ai-spiegel':           { missionId: 'ai-spiegel',           templateType: 'simulation-lab' },
    'algorithm-architect':  { missionId: 'algorithm-architect',  templateType: 'simulation-lab' },

    // === ReviewArena (7) ===
    'review-week-2':        { missionId: 'review-week-2',        templateType: 'review-arena' },
    'data-review':          { missionId: 'data-review',          templateType: 'review-arena' },
    'code-review-2':        { missionId: 'code-review-2',        templateType: 'review-arena' },
    'media-review':         { missionId: 'media-review',         templateType: 'review-arena' },
    'security-review':      { missionId: 'security-review',      templateType: 'review-arena' },
    'advanced-code-review': { missionId: 'advanced-code-review', templateType: 'review-arena' },
    'impact-review':        { missionId: 'impact-review',        templateType: 'review-arena' },

    // === BuilderCanvas (19) ===
    'website-bouwer':       { missionId: 'website-bouwer',       templateType: 'builder-canvas', enableChat: true, chatRoleId: 'website-bouwer' },
    'web-developer':        { missionId: 'web-developer',        templateType: 'builder-canvas', enableChat: true, chatRoleId: 'web-developer' },
    'podcast-producer':     { missionId: 'podcast-producer',     templateType: 'builder-canvas', enableChat: true, chatRoleId: 'podcast-producer' },
    'brand-builder':        { missionId: 'brand-builder',        templateType: 'builder-canvas', enableChat: true, chatRoleId: 'brand-builder' },
    'video-editor':         { missionId: 'video-editor',         templateType: 'builder-canvas', enableChat: true, chatRoleId: 'video-editor' },
    'meme-machine':         { missionId: 'meme-machine',         templateType: 'builder-canvas', enableChat: true, chatRoleId: 'meme-machine' },
    'digital-storyteller':  { missionId: 'digital-storyteller',  templateType: 'builder-canvas', enableChat: true, chatRoleId: 'digital-storyteller' },
    'app-prototyper':       { missionId: 'app-prototyper',       templateType: 'builder-canvas', enableChat: true, chatRoleId: 'app-prototyper' },
    'automation-engineer':  { missionId: 'automation-engineer',  templateType: 'builder-canvas', enableChat: true, chatRoleId: 'automation-engineer' },
    'api-architect':        { missionId: 'api-architect',        templateType: 'builder-canvas', enableChat: true, chatRoleId: 'api-architect' },
    'open-source-contributor': { missionId: 'open-source-contributor', templateType: 'builder-canvas', enableChat: true, chatRoleId: 'open-source-contributor' },
    'startup-simulator':    { missionId: 'startup-simulator',    templateType: 'builder-canvas', enableChat: true, chatRoleId: 'startup-simulator' },
    'innovation-lab':       { missionId: 'innovation-lab',       templateType: 'builder-canvas', enableChat: true, chatRoleId: 'innovation-lab' },
    'portfolio-builder':    { missionId: 'portfolio-builder',    templateType: 'builder-canvas', enableChat: true, chatRoleId: 'portfolio-builder' },
    'prototype-developer':  { missionId: 'prototype-developer',  templateType: 'builder-canvas', enableChat: true, chatRoleId: 'prototype-developer' },
    'pitch-perfect':        { missionId: 'pitch-perfect',        templateType: 'builder-canvas', enableChat: true, chatRoleId: 'pitch-perfect' },
    'meesterproef':         { missionId: 'meesterproef',         templateType: 'builder-canvas', enableChat: true, chatRoleId: 'meesterproef' },
    'mission-blueprint':    { missionId: 'mission-blueprint',    templateType: 'builder-canvas', enableChat: true, chatRoleId: 'mission-blueprint' },
    'mission-vision':       { missionId: 'mission-vision',       templateType: 'builder-canvas', enableChat: true, chatRoleId: 'mission-vision' },

    // === DataViewer (15) ===
    'data-journalist':      { missionId: 'data-journalist',      templateType: 'data-viewer', enableChat: true, chatRoleId: 'data-journalist' },
    'welzijnsonderzoeker':  { missionId: 'welzijnsonderzoeker',  templateType: 'data-viewer' },
    'spreadsheet-specialist': { missionId: 'spreadsheet-specialist', templateType: 'data-viewer' },
    'api-verkenner':        { missionId: 'api-verkenner',        templateType: 'data-viewer' },
    'dashboard-designer':   { missionId: 'dashboard-designer',   templateType: 'data-viewer' },
    'network-navigator':    { missionId: 'network-navigator',    templateType: 'data-viewer' },
    'data-pipeline':        { missionId: 'data-pipeline',        templateType: 'data-viewer' },
    'ml-trainer':           { missionId: 'ml-trainer',           templateType: 'data-viewer' },
    'neural-navigator':     { missionId: 'neural-navigator',     templateType: 'data-viewer' },
    'ux-detective':         { missionId: 'ux-detective',         templateType: 'data-viewer' },
    'digital-divide-researcher': { missionId: 'digital-divide-researcher', templateType: 'data-viewer' },
    'tech-impact-analyst':  { missionId: 'tech-impact-analyst',  templateType: 'data-viewer' },
    'sustainability-scanner': { missionId: 'sustainability-scanner', templateType: 'data-viewer' },
    'research-project':     { missionId: 'research-project',     templateType: 'data-viewer' },
    'eindproject-j2':       { missionId: 'eindproject-j2',       templateType: 'data-viewer', enableChat: true, chatRoleId: 'eindproject-j2' },

    // === DebateArena (10) ===
    'schermtijd-coach':     { missionId: 'schermtijd-coach',     templateType: 'debate-arena', enableChat: true, chatRoleId: 'schermtijd-coach' },
    'digitale-balans-coach': { missionId: 'digitale-balans-coach', templateType: 'debate-arena' },
    'scroll-stopper':       { missionId: 'scroll-stopper',       templateType: 'debate-arena', enableChat: true, chatRoleId: 'scroll-stopper' },
    'ai-ethicus':           { missionId: 'ai-ethicus',           templateType: 'debate-arena', enableChat: true, chatRoleId: 'ai-ethicus' },
    'digital-rights-defender': { missionId: 'digital-rights-defender', templateType: 'debate-arena', enableChat: true, chatRoleId: 'digital-rights-defender' },
    'tech-court':           { missionId: 'tech-court',           templateType: 'debate-arena', enableChat: true, chatRoleId: 'tech-court' },
    'future-forecaster':    { missionId: 'future-forecaster',    templateType: 'debate-arena', enableChat: true, chatRoleId: 'future-forecaster' },
    'policy-maker':         { missionId: 'policy-maker',         templateType: 'debate-arena', enableChat: true, chatRoleId: 'policy-maker' },
    'reflection-report':    { missionId: 'reflection-report',    templateType: 'debate-arena', enableChat: true, chatRoleId: 'reflection-report' },
    'review-week-3':        { missionId: 'review-week-3',        templateType: 'ethics-council' },

    // === ToolGuide (7) ===
    'magister-master':      { missionId: 'magister-master',      templateType: 'tool-guide' },
    'cloud-commander':      { missionId: 'cloud-commander',      templateType: 'tool-guide' },
    'word-wizard':          { missionId: 'word-wizard',          templateType: 'tool-guide' },
    'slide-specialist':     { missionId: 'slide-specialist',     templateType: 'tool-guide' },
    'print-pro':            { missionId: 'print-pro',            templateType: 'tool-guide' },
    'mission-launch':       { missionId: 'mission-launch',       templateType: 'tool-guide' },
    'startup-pitch':        { missionId: 'startup-pitch',        templateType: 'tool-guide' },
};

/** Check if a mission ID is a template-based mission */
export function isTemplateMission(missionId: string): boolean {
    return missionId in TEMPLATE_MISSIONS;
}

/** Get the template config for a mission */
export function getTemplateMission(missionId: string): TemplateMissionEntry | undefined {
    return TEMPLATE_MISSIONS[missionId];
}
