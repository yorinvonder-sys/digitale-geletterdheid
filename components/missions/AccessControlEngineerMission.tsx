/**
 * AccessControlEngineerMission.tsx
 *
 * Leerlingen repareren een onveilige login- en toegangsflow van een school.
 * Ze analyseren wie waar toegang toe heeft, passen regels aan met
 * programmeerlogica (if/then), en testen of de juiste rollen de juiste
 * rechten hebben.
 *
 * SLO-doelen: 21A (Digitale systemen), 23A (Veiligheid & privacy), 22B (Programmeren)
 * Leerjaar 2, Periode 2 — Programmeren & Computational Thinking
 */

import React, { useState, useCallback } from 'react';
import {
    ArrowLeft, Shield, Check, X, ChevronRight, Lock, Unlock,
    AlertTriangle, Eye, UserCheck, Settings, Users, Sparkles,
    CheckCircle2, XCircle, ShieldAlert, ShieldCheck, Play,
} from 'lucide-react';
import { UserStats, VsoProfile } from '../../types';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';

// ============================================================================
// Types
// ============================================================================

interface AccessControlState {
    currentStep: 1 | 2 | 3;
    showIntro: boolean;
    showMissionComplete: boolean;
    // Step 1
    foundIssues: string[];
    // Step 2
    rules: AccessRule[];
    ruleSelections: Record<string, { condition: string; permission: Permission }>;
    // Step 3
    testResults: TestResult[];
    score: number;
}

type Role = 'leerling' | 'docent' | 'admin' | 'gast';
type Permission = 'lezen' | 'schrijven' | 'geen';

interface AccessEntry {
    id: string;
    role: Role;
    resource: string;
    permission: Permission;
    isSecure: boolean;
    issue?: string;
    hint?: string;
}

interface AccessRule {
    id: string;
    condition: string;  // e.g. "rol === 'leerling'"
    resource: string;
    permission: Permission;
    isCorrect?: boolean;
}

interface TestResult {
    id: string;
    scenario: string;
    role: Role;
    resource: string;
    expectedAccess: boolean;
    actualAccess: boolean | null;
    passed: boolean | null;
}

interface Props {
    onBack: () => void;
    onComplete: (success: boolean) => void;
    stats?: UserStats;
    vsoProfile?: VsoProfile;
}

// ============================================================================
// Data
// ============================================================================

const ROLE_LABELS: Record<Role, string> = {
    leerling: 'Leerling',
    docent: 'Docent',
    admin: 'Beheerder',
    gast: 'Gast',
};

const ROLE_COLORS: Record<Role, string> = {
    leerling: '#10B981',
    docent: '#3B82F6',
    admin: '#8B6F9E',
    gast: '#6B6B66',
};

/** The broken access table that students need to analyse */
const BROKEN_ACCESS_TABLE: AccessEntry[] = [
    { id: 'a1', role: 'leerling', resource: 'Eigen cijfers bekijken', permission: 'lezen', isSecure: true },
    { id: 'a2', role: 'leerling', resource: 'Cijfers aanpassen', permission: 'schrijven', isSecure: false, issue: 'leerling-cijfers', hint: 'Mag een leerling zelf cijfers veranderen?' },
    { id: 'a3', role: 'leerling', resource: 'Rooster bekijken', permission: 'lezen', isSecure: true },
    { id: 'a4', role: 'docent', resource: 'Cijfers invoeren', permission: 'schrijven', isSecure: true },
    { id: 'a5', role: 'docent', resource: 'Leerlingdossiers', permission: 'geen', isSecure: false, issue: 'docent-dossiers', hint: 'Een docent heeft dossiers nodig voor mentoraat.' },
    { id: 'a6', role: 'gast', resource: 'Leerlingdossiers', permission: 'lezen', isSecure: false, issue: 'gast-dossiers', hint: 'Mag iemand zonder account bij persoonlijke dossiers?' },
    { id: 'a7', role: 'admin', resource: 'Gebruikers beheren', permission: 'schrijven', isSecure: true },
    { id: 'a8', role: 'gast', resource: 'Openbaar rooster', permission: 'lezen', isSecure: true },
    { id: 'a9', role: 'leerling', resource: 'Wachtwoorden van docenten', permission: 'lezen', isSecure: false, issue: 'leerling-wachtwoorden', hint: 'Wachtwoorden moeten altijd geheim zijn.' },
    { id: 'a10', role: 'admin', resource: 'Alle cijfers', permission: 'schrijven', isSecure: true },
    { id: 'a11', role: 'gast', resource: 'Admin-paneel', permission: 'lezen', isSecure: false, issue: 'gast-admin', hint: 'Zou een gast het beheerdersmenu mogen zien?' },
    { id: 'a12', role: 'docent', resource: 'Eigen rooster', permission: 'lezen', isSecure: true },
];

const ALL_ISSUES = BROKEN_ACCESS_TABLE.filter(e => !e.isSecure).map(e => e.id);

/** Rule templates — students pick conditions and permissions */
interface RuleTemplate {
    id: string;
    description: string;
    targetIssue: string;
    correctCondition: string;
    correctPermission: Permission;
    options: { label: string; value: string }[];
    permissionOptions: { label: string; value: Permission }[];
}

const RULE_TEMPLATES: RuleTemplate[] = [
    {
        id: 'r1',
        description: 'Cijfers aanpassen',
        targetIssue: 'leerling-cijfers',
        correctCondition: 'rol === "docent" OF rol === "admin"',
        correctPermission: 'schrijven',
        options: [
            { label: 'Als rol === "leerling"', value: 'rol === "leerling"' },
            { label: 'Als rol === "docent" OF rol === "admin"', value: 'rol === "docent" OF rol === "admin"' },
            { label: 'Als rol === "gast"', value: 'rol === "gast"' },
        ],
        permissionOptions: [
            { label: 'Lezen', value: 'lezen' },
            { label: 'Schrijven', value: 'schrijven' },
            { label: 'Geen toegang', value: 'geen' },
        ],
    },
    {
        id: 'r2',
        description: 'Leerlingdossiers voor docenten',
        targetIssue: 'docent-dossiers',
        correctCondition: 'rol === "docent"',
        correctPermission: 'lezen',
        options: [
            { label: 'Als rol === "docent"', value: 'rol === "docent"' },
            { label: 'Als rol === "leerling"', value: 'rol === "leerling"' },
            { label: 'Als rol === "gast"', value: 'rol === "gast"' },
        ],
        permissionOptions: [
            { label: 'Lezen', value: 'lezen' },
            { label: 'Schrijven', value: 'schrijven' },
            { label: 'Geen toegang', value: 'geen' },
        ],
    },
    {
        id: 'r3',
        description: 'Leerlingdossiers voor gasten',
        targetIssue: 'gast-dossiers',
        correctCondition: 'rol === "gast"',
        correctPermission: 'geen',
        options: [
            { label: 'Als rol === "gast"', value: 'rol === "gast"' },
            { label: 'Als rol === "docent"', value: 'rol === "docent"' },
            { label: 'Als rol === "admin"', value: 'rol === "admin"' },
        ],
        permissionOptions: [
            { label: 'Lezen', value: 'lezen' },
            { label: 'Schrijven', value: 'schrijven' },
            { label: 'Geen toegang', value: 'geen' },
        ],
    },
    {
        id: 'r4',
        description: 'Wachtwoorden van docenten',
        targetIssue: 'leerling-wachtwoorden',
        correctCondition: 'NIEMAND (alleen het systeem)',
        correctPermission: 'geen',
        options: [
            { label: 'Als rol === "admin"', value: 'rol === "admin"' },
            { label: 'Als rol === "leerling"', value: 'rol === "leerling"' },
            { label: 'NIEMAND (alleen het systeem)', value: 'NIEMAND (alleen het systeem)' },
        ],
        permissionOptions: [
            { label: 'Lezen', value: 'lezen' },
            { label: 'Schrijven', value: 'schrijven' },
            { label: 'Geen toegang', value: 'geen' },
        ],
    },
    {
        id: 'r5',
        description: 'Admin-paneel voor gasten',
        targetIssue: 'gast-admin',
        correctCondition: 'rol === "admin"',
        correctPermission: 'schrijven',
        options: [
            { label: 'Als rol === "admin"', value: 'rol === "admin"' },
            { label: 'Als rol === "gast"', value: 'rol === "gast"' },
            { label: 'Als rol === "docent" OF rol === "admin"', value: 'rol === "docent" OF rol === "admin"' },
        ],
        permissionOptions: [
            { label: 'Lezen', value: 'lezen' },
            { label: 'Schrijven', value: 'schrijven' },
            { label: 'Geen toegang', value: 'geen' },
        ],
    },
];

/** Test scenarios for step 3 */
const TEST_SCENARIOS: TestResult[] = [
    { id: 't1', scenario: 'Leerling Jamal probeert zijn eigen cijfers te bekijken', role: 'leerling', resource: 'Eigen cijfers', expectedAccess: true, actualAccess: null, passed: null },
    { id: 't2', scenario: 'Leerling Sanne probeert cijfers aan te passen', role: 'leerling', resource: 'Cijfers aanpassen', expectedAccess: false, actualAccess: null, passed: null },
    { id: 't3', scenario: 'Docent Bakker opent een leerlingdossier', role: 'docent', resource: 'Leerlingdossiers', expectedAccess: true, actualAccess: null, passed: null },
    { id: 't4', scenario: 'Gast (ouder op open dag) klikt op het admin-paneel', role: 'gast', resource: 'Admin-paneel', expectedAccess: false, actualAccess: null, passed: null },
    { id: 't5', scenario: 'Beheerder Visser beheert gebruikersaccounts', role: 'admin', resource: 'Gebruikers beheren', expectedAccess: true, actualAccess: null, passed: null },
    { id: 't6', scenario: 'Leerling Youssef zoekt wachtwoorden van docenten op', role: 'leerling', resource: 'Wachtwoorden', expectedAccess: false, actualAccess: null, passed: null },
];

// ============================================================================
// Component
// ============================================================================

export const AccessControlEngineerMission: React.FC<Props> = ({ onBack, onComplete, vsoProfile }) => {
    const { state, setState, clearSave } = useMissionAutoSave<AccessControlState>('access-control-engineer', {
        currentStep: 1,
        showIntro: true,
        showMissionComplete: false,
        foundIssues: [],
        rules: [],
        ruleSelections: {},
        testResults: [],
        score: 0,
    });

    const { currentStep, showIntro, showMissionComplete, foundIssues, rules, ruleSelections, testResults, score } = state;

    // Transient UI state (not persisted)
    const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
    const [showStepComplete, setShowStepComplete] = useState(false);
    const [testInProgress, setTestInProgress] = useState<string | null>(null);

    // ========================================================================
    // Step 1: Analyse
    // ========================================================================

    const handleMarkIssue = useCallback((entryId: string) => {
        const entry = BROKEN_ACCESS_TABLE.find(e => e.id === entryId);
        if (!entry) return;

        setState(prev => {
            const already = prev.foundIssues.includes(entryId);
            if (already) return prev;

            const next = [...prev.foundIssues, entryId];
            const pointsEarned = entry.isSecure ? 0 : 25; // only get points for real issues
            return { ...prev, foundIssues: next, score: prev.score + pointsEarned };
        });
        setSelectedEntry(entryId);
    }, [setState]);

    const allIssuesFound = ALL_ISSUES.every(id => foundIssues.includes(id));
    const falsePositives = foundIssues.filter(id => {
        const entry = BROKEN_ACCESS_TABLE.find(e => e.id === id);
        return entry?.isSecure;
    });

    const handleCompleteStep1 = useCallback(() => {
        if (!allIssuesFound) return;
        setShowStepComplete(true);
        setTimeout(() => {
            setState(prev => ({ ...prev, currentStep: 2 }));
            setShowStepComplete(false);
            setSelectedEntry(null);
        }, 1500);
    }, [allIssuesFound, setState]);

    // ========================================================================
    // Step 2: Fix rules
    // ========================================================================

    const handleSetRuleSelection = useCallback((ruleId: string, field: 'condition' | 'permission', value: string) => {
        setState(prev => ({
            ...prev,
            ruleSelections: {
                ...prev.ruleSelections,
                [ruleId]: {
                    ...prev.ruleSelections[ruleId],
                    [field]: value,
                },
            },
        }));
    }, [setState]);

    const handleSubmitRules = useCallback(() => {
        const newRules: AccessRule[] = [];
        let earnedPoints = 0;

        for (const template of RULE_TEMPLATES) {
            const sel = ruleSelections[template.id];
            const condCorrect = sel?.condition === template.correctCondition;
            const permCorrect = sel?.permission === template.correctPermission;
            const isCorrect = condCorrect && permCorrect;

            if (isCorrect) earnedPoints += 30;

            newRules.push({
                id: template.id,
                condition: sel?.condition || '',
                resource: template.description,
                permission: sel?.permission || 'geen',
                isCorrect,
            });
        }

        setState(prev => ({
            ...prev,
            rules: newRules,
            score: prev.score + earnedPoints,
        }));

        const allCorrect = newRules.every(r => r.isCorrect);
        if (allCorrect) {
            setShowStepComplete(true);
            setTimeout(() => {
                setState(prev => ({
                    ...prev,
                    currentStep: 3,
                    testResults: TEST_SCENARIOS.map(t => ({ ...t, actualAccess: null, passed: null })),
                }));
                setShowStepComplete(false);
            }, 1500);
        }
    }, [ruleSelections, setState]);

    const allRulesSelected = RULE_TEMPLATES.every(t => {
        const sel = ruleSelections[t.id];
        return sel?.condition && sel?.permission;
    });

    const rulesSubmitted = rules.length > 0;
    const allRulesCorrect = rulesSubmitted && rules.every(r => r.isCorrect);

    // ========================================================================
    // Step 3: Test
    // ========================================================================

    const handleRunTest = useCallback((testId: string) => {
        const test = TEST_SCENARIOS.find(t => t.id === testId);
        if (!test) return;

        setTestInProgress(testId);

        // Simulate a brief "running" delay
        setTimeout(() => {
            setState(prev => {
                const updated = prev.testResults.map(t => {
                    if (t.id !== testId) return t;
                    const actual = test.expectedAccess; // Rules are correct at this point
                    return { ...t, actualAccess: actual, passed: actual === test.expectedAccess };
                });
                const newPassed = updated.filter(t => t.passed === true).length;
                const prevPassed = prev.testResults.filter(t => t.passed === true).length;
                const pointsEarned = (newPassed - prevPassed) * 20;
                return { ...prev, testResults: updated, score: prev.score + pointsEarned };
            });
            setTestInProgress(null);
        }, 800);
    }, [setState]);

    const handleRunAllTests = useCallback(() => {
        TEST_SCENARIOS.forEach((test, i) => {
            setTimeout(() => handleRunTest(test.id), i * 600);
        });
    }, [handleRunTest]);

    const allTestsPassed = testResults.length > 0 && testResults.every(t => t.passed === true);

    const handleCompleteMission = useCallback(() => {
        setState(prev => ({ ...prev, showMissionComplete: true }));
    }, [setState]);

    // ========================================================================
    // Render: Intro
    // ========================================================================

    if (showIntro) {
        return (
            <div className="min-h-screen bg-[#FAF9F0] flex items-center justify-center p-4" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                <div className="max-w-lg w-full text-center space-y-8">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-[#D97757]/20 blur-3xl rounded-full animate-pulse" />
                        <div className="relative bg-gradient-to-br from-[#D97757] to-[#C46849] w-28 h-28 rounded-3xl flex items-center justify-center shadow-2xl mx-auto">
                            <Shield size={56} className="text-white" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h1 className="text-3xl font-black text-[#1A1A19]" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                            Access Control Engineer
                        </h1>
                        <p className="text-[#3D3D38] text-lg leading-relaxed">
                            Het digitale systeem van Openbare Scholengemeenschap De Meervaart
                            heeft een groot probleem: <strong>de toegangsrechten kloppen niet</strong>.
                            Leerlingen kunnen cijfers aanpassen, gasten zien privégegevens, en
                            docenten missen rechten die ze nodig hebben.
                        </p>
                        <p className="text-[#6B6B66]">
                            Jij bent ingehuurd als Access Control Engineer.
                            Vind de fouten, schrijf betere regels, en test of alles klopt.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-[#E8E6DF] text-left space-y-3">
                        <h3 className="font-bold text-[#1A1A19] text-sm uppercase tracking-wider">Jouw opdracht in 3 stappen</h3>
                        <div className="flex items-start gap-3">
                            <div className="w-7 h-7 rounded-full bg-[#D97757]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Eye size={14} className="text-[#D97757]" />
                            </div>
                            <div>
                                <p className="font-bold text-[#1A1A19] text-sm">1. Analyseer</p>
                                <p className="text-[#6B6B66] text-sm">Bekijk de toegangstabel en markeer wat onveilig is.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-7 h-7 rounded-full bg-[#D97757]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Settings size={14} className="text-[#D97757]" />
                            </div>
                            <div>
                                <p className="font-bold text-[#1A1A19] text-sm">2. Repareer</p>
                                <p className="text-[#6B6B66] text-sm">Schrijf nieuwe toegangsregels met als/dan-logica.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-7 h-7 rounded-full bg-[#D97757]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Play size={14} className="text-[#D97757]" />
                            </div>
                            <div>
                                <p className="font-bold text-[#1A1A19] text-sm">3. Test</p>
                                <p className="text-[#6B6B66] text-sm">Voer testscenario's uit en controleer of alles klopt.</p>
                            </div>
                        </div>
                    </div>

                    {vsoProfile && (
                        <p className="text-xs text-[#8B6F9E] bg-[#8B6F9E]/10 rounded-lg px-3 py-2 border border-[#8B6F9E]/20">
                            Aangepaste versie — je krijgt extra hints bij elke stap.
                        </p>
                    )}

                    <button
                        onClick={() => setState(prev => ({ ...prev, showIntro: false }))}
                        className="w-full py-4 bg-[#D97757] hover:bg-[#C46849] text-white rounded-full font-black uppercase tracking-wide hover:shadow-lg hover:shadow-[#D97757]/30 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#D97757]"
                    >
                        Start de missie
                    </button>
                </div>
            </div>
        );
    }

    // ========================================================================
    // Render: Mission Complete
    // ========================================================================

    if (showMissionComplete) {
        return (
            <div className="min-h-screen bg-[#FAF9F0] flex items-center justify-center p-4" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                <div className="max-w-lg w-full text-center space-y-8">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-[#10B981]/20 blur-3xl rounded-full animate-pulse" />
                        <div className="relative bg-gradient-to-br from-[#10B981] to-[#059669] w-32 h-32 rounded-3xl flex items-center justify-center shadow-2xl mx-auto animate-bounce">
                            <ShieldCheck size={64} className="text-white" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-4xl font-black text-[#1A1A19]" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                            MISSIE VOLTOOID!
                        </h1>
                        <p className="text-[#3D3D38] text-lg">
                            Het toegangssysteem van De Meervaart is veilig dankzij jou.
                            Je bent een echte Access Control Engineer!
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-[#E8E6DF]">
                        <div className="flex justify-around">
                            <div>
                                <p className="text-3xl font-black text-[#10B981]">{ALL_ISSUES.length}/{ALL_ISSUES.length}</p>
                                <p className="text-[#6B6B66] text-sm">Fouten gevonden</p>
                            </div>
                            <div>
                                <p className="text-3xl font-black text-[#3B82F6]">{RULE_TEMPLATES.length}</p>
                                <p className="text-[#6B6B66] text-sm">Regels gerepareerd</p>
                            </div>
                            <div>
                                <p className="text-3xl font-black text-[#D97757]">{score}</p>
                                <p className="text-[#6B6B66] text-sm">Punten</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#8B6F9E]/10 rounded-2xl p-6 border border-[#8B6F9E]/20">
                        <h3 className="text-lg font-bold text-[#8B6F9E] mb-2" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>Wat heb je geleerd?</h3>
                        <ul className="text-[#3D3D38] text-sm text-left space-y-1">
                            <li>Hoe toegangscontrole werkt in digitale systemen</li>
                            <li>Waarom het 'principle of least privilege' belangrijk is</li>
                            <li>Hoe je als/dan-regels schrijft voor beveiliging</li>
                            <li>Hoe je test of beveiligingsregels echt werken</li>
                            <li>Waarom privacy en veiligheid hand in hand gaan</li>
                        </ul>
                    </div>

                    <button
                        onClick={() => { clearSave(); onComplete(true); }}
                        className="w-full py-4 bg-[#D97757] hover:bg-[#C46849] text-white rounded-full font-black uppercase tracking-wide hover:shadow-lg hover:shadow-[#D97757]/30 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#D97757]"
                    >
                        Terug naar Mission Control
                    </button>
                </div>
            </div>
        );
    }

    // ========================================================================
    // Render: Step transition overlay
    // ========================================================================

    if (showStepComplete) {
        return (
            <div className="min-h-screen bg-[#FAF9F0] flex items-center justify-center p-4" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 rounded-full bg-[#10B981] flex items-center justify-center mx-auto animate-bounce">
                        <CheckCircle2 size={40} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-black text-[#1A1A19]" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                        Stap {currentStep} voltooid!
                    </h2>
                    <p className="text-[#6B6B66]">Door naar de volgende stap...</p>
                </div>
            </div>
        );
    }

    // ========================================================================
    // Render: Main mission view
    // ========================================================================

    const stepLabels = ['Analyseer', 'Repareer', 'Test'];

    return (
        <div className="min-h-screen overflow-y-auto bg-[#FAF9F0]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
            {/* Header */}
            <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-[#E8E6DF]">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="p-2 text-[#6B6B66] hover:text-[#1A1A19] transition-all duration-300"
                        aria-label="Terug"
                    >
                        <ArrowLeft size={24} />
                    </button>

                    <div className="flex items-center gap-3">
                        {/* Step indicator */}
                        <div className="flex items-center gap-1">
                            {stepLabels.map((label, i) => (
                                <div key={label} className="flex items-center">
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i + 1 < currentStep ? 'bg-[#10B981] text-white' :
                                        i + 1 === currentStep ? 'bg-[#D97757] text-white' :
                                        'bg-[#E8E6DF] text-[#6B6B66]'
                                    }`}>
                                        {i + 1 < currentStep ? <Check size={14} /> : i + 1}
                                    </div>
                                    {i < stepLabels.length - 1 && (
                                        <div className={`w-6 h-0.5 mx-0.5 ${i + 1 < currentStep ? 'bg-[#10B981]' : 'bg-[#E8E6DF]'}`} />
                                    )}
                                </div>
                            ))}
                        </div>

                        {vsoProfile && (
                            <span className="text-[10px] bg-[#8B6F9E]/10 text-[#8B6F9E] px-2 py-1 rounded-full border border-[#8B6F9E]/30 font-bold uppercase tracking-tight">
                                {vsoProfile === 'dagbesteding' ? 'Focus: Ervaren' : 'Focus: Beheersen'}
                            </span>
                        )}

                        <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border border-[#E8E6DF]">
                            <Sparkles size={14} className="text-[#D97757]" />
                            <span className="text-[#1A1A19] font-bold text-sm">{score}</span>
                        </div>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="h-1 bg-[#F0EEE8]">
                    <div
                        className="h-full bg-gradient-to-r from-[#D97757] to-[#C46849] transition-all duration-500"
                        style={{ width: `${(currentStep / 3) * 100}%` }}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
                {/* ============================================================ */}
                {/* STEP 1: Analyse */}
                {/* ============================================================ */}
                {currentStep === 1 && (
                    <>
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-black text-[#1A1A19]" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                                <Eye className="inline mr-2 mb-1" size={24} />
                                Stap 1: Analyseer de toegangstabel
                            </h2>
                            <p className="text-[#6B6B66]">
                                Hieronder zie je wie waartoe toegang heeft op De Meervaart.
                                <strong className="text-[#D97757]"> Tik op elke rij die onveilig is.</strong>
                            </p>
                            {vsoProfile && (
                                <p className="text-xs text-[#8B6F9E] bg-[#8B6F9E]/5 rounded-lg px-3 py-2 border border-[#8B6F9E]/10 mt-2">
                                    Tip: Denk na — mag deze persoon dit écht doen? Bekijk de hints als je twijfelt.
                                </p>
                            )}
                        </div>

                        {/* Progress */}
                        <div className="bg-white rounded-xl p-4 border border-[#E8E6DF] flex items-center justify-between">
                            <span className="text-sm text-[#6B6B66]">Gevonden beveiligingsproblemen:</span>
                            <span className="font-bold text-[#D97757]">
                                {foundIssues.filter(id => ALL_ISSUES.includes(id)).length} / {ALL_ISSUES.length}
                            </span>
                        </div>

                        {/* Access table */}
                        <div className="space-y-2">
                            {BROKEN_ACCESS_TABLE.map((entry) => {
                                const isMarked = foundIssues.includes(entry.id);
                                const isSelected = selectedEntry === entry.id;
                                const isFalsePositive = isMarked && entry.isSecure;
                                const isCorrectFind = isMarked && !entry.isSecure;

                                return (
                                    <button
                                        key={entry.id}
                                        onClick={() => handleMarkIssue(entry.id)}
                                        disabled={isMarked}
                                        className={`w-full text-left rounded-xl p-4 border-2 transition-all duration-300 ${
                                            isCorrectFind ? 'bg-red-50 border-red-300' :
                                            isFalsePositive ? 'bg-[#10B981]/5 border-[#10B981]/30' :
                                            'bg-white border-[#E8E6DF] hover:border-[#D97757]/50 hover:shadow-sm'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className="text-xs font-bold px-2 py-1 rounded-full border"
                                                    style={{
                                                        color: ROLE_COLORS[entry.role],
                                                        backgroundColor: `${ROLE_COLORS[entry.role]}15`,
                                                        borderColor: `${ROLE_COLORS[entry.role]}30`,
                                                    }}
                                                >
                                                    {ROLE_LABELS[entry.role]}
                                                </span>
                                                <span className="text-[#1A1A19] font-medium text-sm">{entry.resource}</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                                    entry.permission === 'schrijven' ? 'bg-amber-100 text-amber-700' :
                                                    entry.permission === 'lezen' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-gray-100 text-gray-500'
                                                }`}>
                                                    {entry.permission === 'schrijven' ? '✏️ Schrijven' :
                                                     entry.permission === 'lezen' ? '👁 Lezen' : '🚫 Geen'}
                                                </span>

                                                {isCorrectFind && <ShieldAlert size={18} className="text-red-500" />}
                                                {isFalsePositive && <ShieldCheck size={18} className="text-[#10B981]" />}
                                            </div>
                                        </div>

                                        {/* Feedback when marked */}
                                        {isMarked && isSelected && (
                                            <div className={`mt-3 text-sm rounded-lg p-3 ${
                                                isCorrectFind ? 'bg-red-100 text-red-800' : 'bg-[#10B981]/10 text-[#10B981]'
                                            }`}>
                                                {isCorrectFind ? (
                                                    <><AlertTriangle size={14} className="inline mr-1" /> Gevonden! {entry.hint}</>
                                                ) : (
                                                    <><Check size={14} className="inline mr-1" /> Deze regel is veilig — goed bekeken!</>
                                                )}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {falsePositives.length > 0 && (
                            <p className="text-sm text-[#6B6B66] text-center">
                                {falsePositives.length} veilige regel{falsePositives.length > 1 ? 's' : ''} per ongeluk gemarkeerd — niet erg, goed dat je kritisch bent!
                            </p>
                        )}

                        {allIssuesFound && (
                            <button
                                onClick={handleCompleteStep1}
                                className="w-full py-4 bg-[#D97757] hover:bg-[#C46849] text-white rounded-full font-black uppercase tracking-wide hover:shadow-lg hover:shadow-[#D97757]/30 transition-all duration-300 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#D97757]"
                            >
                                Alle fouten gevonden — door naar stap 2 <ChevronRight size={20} />
                            </button>
                        )}
                    </>
                )}

                {/* ============================================================ */}
                {/* STEP 2: Fix rules */}
                {/* ============================================================ */}
                {currentStep === 2 && (
                    <>
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-black text-[#1A1A19]" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                                <Settings className="inline mr-2 mb-1" size={24} />
                                Stap 2: Schrijf nieuwe toegangsregels
                            </h2>
                            <p className="text-[#6B6B66]">
                                Kies voor elke onveilige situatie de juiste <strong className="text-[#D97757]">als/dan-regel</strong>.
                                Wie mag wat, en wat is het juiste recht?
                            </p>
                            {vsoProfile && (
                                <p className="text-xs text-[#8B6F9E] bg-[#8B6F9E]/5 rounded-lg px-3 py-2 border border-[#8B6F9E]/10 mt-2">
                                    Tip: Lees elke situatie rustig. Kies eerst WIE iets mag, en dan WAT ze mogen doen.
                                </p>
                            )}
                        </div>

                        <div className="space-y-4">
                            {RULE_TEMPLATES.map((template) => {
                                const sel = ruleSelections[template.id];
                                const submitted = rulesSubmitted;
                                const rule = rules.find(r => r.id === template.id);

                                return (
                                    <div
                                        key={template.id}
                                        className={`bg-white rounded-xl p-5 border-2 transition-all ${
                                            submitted && rule?.isCorrect ? 'border-[#10B981]' :
                                            submitted && !rule?.isCorrect ? 'border-red-400' :
                                            'border-[#E8E6DF]'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 mb-3">
                                            <Lock size={16} className="text-[#D97757]" />
                                            <h3 className="font-bold text-[#1A1A19]">{template.description}</h3>
                                            {submitted && rule?.isCorrect && <CheckCircle2 size={18} className="text-[#10B981] ml-auto" />}
                                            {submitted && !rule?.isCorrect && <XCircle size={18} className="text-red-500 ml-auto" />}
                                        </div>

                                        {/* Condition selector */}
                                        <div className="mb-3">
                                            <p className="text-xs text-[#6B6B66] mb-1.5 font-medium uppercase tracking-wider">Wie mag dit?</p>
                                            <div className="flex flex-wrap gap-2">
                                                {template.options.map(opt => (
                                                    <button
                                                        key={opt.value}
                                                        onClick={() => handleSetRuleSelection(template.id, 'condition', opt.value)}
                                                        disabled={submitted && allRulesCorrect}
                                                        className={`text-sm px-3 py-2 rounded-lg border-2 font-medium transition-all ${
                                                            sel?.condition === opt.value
                                                                ? 'border-[#D97757] bg-[#D97757]/10 text-[#D97757]'
                                                                : 'border-[#E8E6DF] text-[#6B6B66] hover:border-[#D97757]/30'
                                                        }`}
                                                    >
                                                        <code className="text-xs">{opt.label}</code>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Permission selector */}
                                        <div>
                                            <p className="text-xs text-[#6B6B66] mb-1.5 font-medium uppercase tracking-wider">Dan krijgt die persoon:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {template.permissionOptions.map(opt => (
                                                    <button
                                                        key={opt.value}
                                                        onClick={() => handleSetRuleSelection(template.id, 'permission', opt.value)}
                                                        disabled={submitted && allRulesCorrect}
                                                        className={`text-sm px-3 py-2 rounded-lg border-2 font-medium transition-all ${
                                                            sel?.permission === opt.value
                                                                ? 'border-[#3B82F6] bg-[#3B82F6]/10 text-[#3B82F6]'
                                                                : 'border-[#E8E6DF] text-[#6B6B66] hover:border-[#3B82F6]/30'
                                                        }`}
                                                    >
                                                        {opt.value === 'schrijven' && <Unlock size={14} className="inline mr-1" />}
                                                        {opt.value === 'lezen' && <Eye size={14} className="inline mr-1" />}
                                                        {opt.value === 'geen' && <Lock size={14} className="inline mr-1" />}
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Feedback */}
                                        {submitted && !rule?.isCorrect && (
                                            <div className="mt-3 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
                                                <AlertTriangle size={14} className="inline mr-1" />
                                                Niet helemaal goed. Pas je keuze aan en probeer opnieuw.
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {!allRulesCorrect && (
                            <button
                                onClick={handleSubmitRules}
                                disabled={!allRulesSelected}
                                className={`w-full py-4 rounded-full font-black uppercase tracking-wide transition-all duration-300 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#D97757] ${
                                    allRulesSelected
                                        ? 'bg-[#D97757] hover:bg-[#C46849] text-white hover:shadow-lg hover:shadow-[#D97757]/30'
                                        : 'bg-[#E8E6DF] text-[#6B6B66] cursor-not-allowed'
                                }`}
                            >
                                {rulesSubmitted ? 'Opnieuw controleren' : 'Regels controleren'}
                                <ChevronRight size={20} />
                            </button>
                        )}
                    </>
                )}

                {/* ============================================================ */}
                {/* STEP 3: Test */}
                {/* ============================================================ */}
                {currentStep === 3 && (
                    <>
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-black text-[#1A1A19]" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                                <UserCheck className="inline mr-2 mb-1" size={24} />
                                Stap 3: Test de beveiligingsregels
                            </h2>
                            <p className="text-[#6B6B66]">
                                Voer testscenario's uit om te bewijzen dat jouw regels werken.
                                Druk op <strong className="text-[#D97757]">▶ Test</strong> per scenario, of test ze allemaal tegelijk.
                            </p>
                            {vsoProfile && (
                                <p className="text-xs text-[#8B6F9E] bg-[#8B6F9E]/5 rounded-lg px-3 py-2 border border-[#8B6F9E]/10 mt-2">
                                    Tip: Denk eerst na — zou deze persoon toegang moeten krijgen? Klik dan op Test.
                                </p>
                            )}
                        </div>

                        {/* Run all button */}
                        <div className="flex justify-end">
                            <button
                                onClick={handleRunAllTests}
                                disabled={allTestsPassed}
                                className="text-sm font-bold text-[#D97757] hover:text-[#C46849] disabled:text-[#6B6B66] flex items-center gap-1 transition-all"
                            >
                                <Play size={16} /> Alles testen
                            </button>
                        </div>

                        <div className="space-y-3">
                            {(testResults.length > 0 ? testResults : TEST_SCENARIOS).map(test => {
                                const isRunning = testInProgress === test.id;
                                const isPassed = test.passed === true;
                                const isTested = test.actualAccess !== null;

                                return (
                                    <div
                                        key={test.id}
                                        className={`bg-white rounded-xl p-4 border-2 transition-all ${
                                            isPassed ? 'border-[#10B981]' :
                                            isTested && !isPassed ? 'border-red-400' :
                                            'border-[#E8E6DF]'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span
                                                        className="text-xs font-bold px-2 py-0.5 rounded-full border"
                                                        style={{
                                                            color: ROLE_COLORS[test.role],
                                                            backgroundColor: `${ROLE_COLORS[test.role]}15`,
                                                            borderColor: `${ROLE_COLORS[test.role]}30`,
                                                        }}
                                                    >
                                                        {ROLE_LABELS[test.role]}
                                                    </span>
                                                    <span className="text-xs text-[#6B6B66]">
                                                        Verwacht: {test.expectedAccess ? '✅ Toegang' : '🚫 Geblokkeerd'}
                                                    </span>
                                                </div>
                                                <p className="text-[#1A1A19] text-sm font-medium">{test.scenario}</p>
                                            </div>

                                            <div className="flex items-center gap-2 ml-4">
                                                {isPassed && <CheckCircle2 size={24} className="text-[#10B981]" />}
                                                {isTested && !isPassed && <XCircle size={24} className="text-red-500" />}

                                                {!isTested && (
                                                    <button
                                                        onClick={() => handleRunTest(test.id)}
                                                        disabled={isRunning}
                                                        className="px-4 py-2 bg-[#D97757] hover:bg-[#C46849] text-white rounded-lg text-sm font-bold transition-all disabled:opacity-50 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-[#D97757]"
                                                    >
                                                        {isRunning ? (
                                                            <span className="animate-spin">⏳</span>
                                                        ) : (
                                                            <>▶ Test</>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {isPassed && (
                                            <div className="mt-2 text-xs text-[#10B981] bg-[#10B981]/5 rounded-lg px-3 py-1.5 border border-[#10B981]/20">
                                                Resultaat: {test.expectedAccess ? 'Toegang verleend' : 'Toegang geblokkeerd'} — correct!
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Score summary */}
                        <div className="bg-white rounded-xl p-4 border border-[#E8E6DF] flex items-center justify-between">
                            <span className="text-sm text-[#6B6B66]">Tests geslaagd:</span>
                            <span className="font-bold text-[#10B981]">
                                {testResults.filter(t => t.passed).length} / {TEST_SCENARIOS.length}
                            </span>
                        </div>

                        {allTestsPassed && (
                            <button
                                onClick={handleCompleteMission}
                                className="w-full py-4 bg-[#10B981] hover:bg-[#059669] text-white rounded-full font-black uppercase tracking-wide hover:shadow-lg hover:shadow-[#10B981]/30 transition-all duration-300 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#10B981]"
                            >
                                <ShieldCheck size={20} /> Missie afronden
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
