import { RoleId } from '../types';

export interface EnhancedPromptResult {
    originalPrompt: string;
    enhancedPrompt: string;
    wasEnhanced: boolean;
    enhancements: string[];  // List of what was added/changed
}

interface EnhancementContext {
    agentType: RoleId | string;
    conversationHistory?: string[];
    userLevel?: 'beginner' | 'intermediate' | 'advanced';
}

interface EnhancementStrategy {
    name: string;
    description: string;
    enhance: (prompt: string, context: EnhancementContext) => string;
}


export const PROMPT_ENHANCER_CONFIG = {
    enabled: true,
    // G-04 FIX: Changed from 'silent' to 'educational' for AI Act Art. 13 transparency
    mode: 'educational' as 'silent' | 'educational' | 'off',
    minPromptLength: 3,  // Don't enhance very short prompts
    strategies: {
        addContext: true,
        professionalTone: true,
        technicalTerms: true,
        clarifyIntent: true,
    }
};

// --- Enhancement patterns ---

// Common vague words that can be enhanced
const VAGUE_TERMS: Record<string, string> = {
    'maak': 'genereer',
    'doe': 'voer uit',
    'verander': 'wijzig',
    'zet': 'stel in',
    'fix': 'repareer',
    'beter': 'verbeter de kwaliteit van',
    'mooi': 'visueel aantrekkelijk',
    'cool': 'professioneel en modern',
    'leuk': 'engaging en aantrekkelijk',
};

// Agent-specific enhancement templates
const AGENT_ENHANCEMENT_TEMPLATES: Record<string, {
    prefix?: string;
    suffix?: string;
    keywords: Record<string, string>;
}> = {
    'verhalen-ontwerper': {
        prefix: '',
        suffix: ' Gebruik een kindvriendelijke, vrolijke illustratiestijl geschikt voor kinderen 4-8 jaar.',
        keywords: {
            'draak': 'een vriendelijke, kleurrijke draak',
            'monster': 'een schattig, niet-eng monster',
            'bos': 'een betoverend, magisch bos vol kleur',
            'kasteel': 'een sprookjesachtig kasteel',
            'prinses': 'een avontuurlijke, sterke prinses',
            'ridder': 'een dappere, vriendelijke ridder',
        }
    },
    'game-programmeur': {
        prefix: 'Pas de game-code aan: ',
        suffix: ' Geef de complete, werkende HTML-code terug.',
        keywords: {
            'sneller': 'verhoog de bewegingssnelheid (playerSpeed variabele)',
            'hoger': 'verhoog de springkracht (jumpForce variabele)',
            'groter': 'vergroot de afmetingen (width/height properties)',
            'kleiner': 'verklein de afmetingen (width/height properties)',
            'rood': 'kleurcode #ef4444 (rood)',
            'groen': 'kleurcode #22c55e (groen)',
            'blauw': 'kleurcode #3b82f6 (blauw)',
            'geel': 'kleurcode #eab308 (geel)',
            'paars': 'kleurcode #a855f7 (paars)',
            'oranje': 'kleurcode #f97316 (oranje)',
        }
    },
    'ai-trainer': {
        prefix: 'Machine Learning opdracht: ',
        suffix: ' Leg uit hoe de AI leert van deze data.',
        keywords: {
            'leer': 'train het model met supervised learning',
            'classificeer': 'classificeer in de juiste categorie',
            'voorspel': 'maak een predictie op basis van geleerde patronen',
        }
    },
    'magister-master': {
        prefix: 'Magister instructie: ',
        suffix: '',
        keywords: {}
    },
    'cloud-commander': {
        prefix: 'OneDrive/Cloud instructie: ',
        suffix: '',
        keywords: {}
    },
    'word-wizard': {
        prefix: 'Microsoft Word instructie: ',
        suffix: ' Focus op professionele opmaak.',
        keywords: {}
    },
    'slide-specialist': {
        prefix: 'PowerPoint instructie: ',
        suffix: ' Houd het visueel en minimalistisch.',
        keywords: {}
    },
};


const enhanceVagueTerms = (prompt: string): { text: string; changes: string[] } => {
    let enhanced = prompt.toLowerCase();
    const changes: string[] = [];

    for (const [vague, precise] of Object.entries(VAGUE_TERMS)) {
        const regex = new RegExp(`\\b${vague}\\b`, 'gi');
        if (regex.test(enhanced)) {
            enhanced = enhanced.replace(regex, precise);
            changes.push(`"${vague}" → "${precise}"`);
        }
    }

    return { text: enhanced, changes };
};

const enhanceWithAgentKeywords = (
    prompt: string,
    agentType: string
): { text: string; changes: string[] } => {
    const template = AGENT_ENHANCEMENT_TEMPLATES[agentType];
    if (!template) return { text: prompt, changes: [] };

    let enhanced = prompt;
    const changes: string[] = [];

    for (const [keyword, replacement] of Object.entries(template.keywords)) {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        if (regex.test(enhanced) && !enhanced.includes(replacement)) {
            enhanced = enhanced.replace(regex, replacement);
            changes.push(`"${keyword}" → technische term`);
        }
    }

    return { text: enhanced, changes };
};

const applyAgentTemplate = (prompt: string, agentType: string): string => {
    const template = AGENT_ENHANCEMENT_TEMPLATES[agentType];
    if (!template) return prompt;

    let enhanced = prompt;

    // Only add prefix if prompt doesn't already start with something formal
    if (template.prefix && !prompt.match(/^(analyseer|genereer|pas aan|maak|wijzig)/i)) {
        enhanced = template.prefix + enhanced;
    }

    // Add suffix for context if not already present
    if (template.suffix && !prompt.includes('.')) {
        enhanced = enhanced + '.' + template.suffix;
    }

    return enhanced;
};

const polishGrammar = (prompt: string): string => {
    let polished = prompt.trim();

    // Capitalize first letter
    polished = polished.charAt(0).toUpperCase() + polished.slice(1);

    // Ensure ends with punctuation
    if (!polished.match(/[.!?]$/)) {
        polished += '.';
    }

    return polished;
};

export const enhancePrompt = (
    rawPrompt: string,
    context: EnhancementContext
): EnhancedPromptResult => {
    // Check if enhancement is disabled
    if (!PROMPT_ENHANCER_CONFIG.enabled || PROMPT_ENHANCER_CONFIG.mode === 'off') {
        return {
            originalPrompt: rawPrompt,
            enhancedPrompt: rawPrompt,
            wasEnhanced: false,
            enhancements: []
        };
    }

    // Don't enhance very short prompts
    if (rawPrompt.length < PROMPT_ENHANCER_CONFIG.minPromptLength) {
        return {
            originalPrompt: rawPrompt,
            enhancedPrompt: rawPrompt,
            wasEnhanced: false,
            enhancements: []
        };
    }

    const allEnhancements: string[] = [];
    let enhanced = rawPrompt;

    // Step 1: Replace vague terms
    if (PROMPT_ENHANCER_CONFIG.strategies.professionalTone) {
        const { text, changes } = enhanceVagueTerms(enhanced);
        enhanced = text;
        allEnhancements.push(...changes);
    }

    // Step 2: Apply agent-specific keyword replacements
    if (PROMPT_ENHANCER_CONFIG.strategies.technicalTerms) {
        const { text, changes } = enhanceWithAgentKeywords(enhanced, context.agentType);
        enhanced = text;
        allEnhancements.push(...changes);
    }

    // Step 3: Add agent context (prefix/suffix)
    if (PROMPT_ENHANCER_CONFIG.strategies.addContext) {
        const before = enhanced;
        enhanced = applyAgentTemplate(enhanced, context.agentType);
        if (enhanced !== before) {
            allEnhancements.push('Context toegevoegd');
        }
    }

    // Step 4: Polish grammar
    enhanced = polishGrammar(enhanced);

    // Only mark as enhanced if something actually changed
    const wasEnhanced = enhanced.toLowerCase() !== rawPrompt.toLowerCase();

    return {
        originalPrompt: rawPrompt,
        enhancedPrompt: wasEnhanced ? enhanced : rawPrompt,
        wasEnhanced,
        enhancements: allEnhancements
    };
};

export const isPromptEnhancerEnabled = (): boolean => {
    return PROMPT_ENHANCER_CONFIG.enabled && PROMPT_ENHANCER_CONFIG.mode !== 'off';
};

export const shouldShowEnhancementDiff = (): boolean => {
    return PROMPT_ENHANCER_CONFIG.mode === 'educational';
};
