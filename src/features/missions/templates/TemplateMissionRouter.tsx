import React, { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';
import { getTemplateMission } from '@/config/templateRegistry';
import type { TemplateMissionProps } from './shared/types';

// Lazy-load each template — only the active template is ever loaded
const ScenarioEngine = lazy(() => import('./scenario-engine/ScenarioEngine').then(m => ({ default: m.ScenarioEngine })));
const PuzzleLab = lazy(() => import('./puzzle-lab/PuzzleLab').then(m => ({ default: m.PuzzleLab })));
const SimulationLab = lazy(() => import('./simulation-lab/SimulationLab').then(m => ({ default: m.SimulationLab })));
const ReviewArena = lazy(() => import('./review-arena/ReviewArena').then(m => ({ default: m.ReviewArena })));
const BuilderCanvas = lazy(() => import('./builder-canvas/BuilderCanvas').then(m => ({ default: m.BuilderCanvas })));
const DataViewer = lazy(() => import('./data-viewer/DataViewer').then(m => ({ default: m.DataViewer })));
const DebateArena = lazy(() => import('./debate-arena/DebateArena').then(m => ({ default: m.DebateArena })));
const ToolGuide = lazy(() => import('./tool-guide/ToolGuide').then(m => ({ default: m.ToolGuide })));

const TemplateLoadingFallback = () => (
    <div className="min-h-screen bg-[#FCF6EA] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
            <Loader2 size={32} className="animate-spin text-[#D97848]" />
            <p className="text-sm text-[#445865]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                Missie laden...
            </p>
        </div>
    </div>
);

/**
 * Routes a mission ID to the correct template component.
 * This is the single entry point for all template-based missions.
 * AuthenticatedApp only needs one routing branch for all ~74 missions.
 */
export const TemplateMissionRouter: React.FC<TemplateMissionProps> = (props) => {
    const entry = getTemplateMission(props.missionId);

    if (!entry) {
        return (
            <div className="min-h-screen bg-[#FCF6EA] flex items-center justify-center p-4">
                <p className="text-[#445865]">Missie niet gevonden: {props.missionId}</p>
            </div>
        );
    }

    const templateProps = { ...props };

    return (
        <Suspense fallback={<TemplateLoadingFallback />}>
            {entry.templateType === 'scenario-engine' && <ScenarioEngine {...templateProps} />}
            {entry.templateType === 'puzzle-lab' && <PuzzleLab {...templateProps} />}
            {entry.templateType === 'simulation-lab' && <SimulationLab {...templateProps} />}
            {entry.templateType === 'review-arena' && <ReviewArena {...templateProps} />}
            {entry.templateType === 'builder-canvas' && <BuilderCanvas {...templateProps} />}
            {entry.templateType === 'data-viewer' && <DataViewer {...templateProps} />}
            {entry.templateType === 'debate-arena' && <DebateArena {...templateProps} />}
            {entry.templateType === 'tool-guide' && <ToolGuide {...templateProps} />}
        </Suspense>
    );
};
