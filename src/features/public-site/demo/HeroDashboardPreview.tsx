import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { DEMO_STUDENT_STATS, DEMO_STUDENTS } from '@/features/public-site/demo/demoFixtures';

const ProjectZeroDashboard = lazy(() =>
    import('@/features/student/ProjectZeroDashboard').then(m => ({ default: m.ProjectZeroDashboard }))
);
const TeacherDashboard = lazy(() =>
    import('@/features/teacher/TeacherDashboard').then(m => ({ default: m.TeacherDashboard }))
);

const STUDENT_BASE_W = 1024;
const STUDENT_BASE_H = 640;
const TEACHER_BASE_W = 1280;
const TEACHER_BASE_H = 800;

const noop = () => { /* noop */ };

function openFullDemo() {
    window.history.pushState({}, '', '/leerlingdemo');
    window.dispatchEvent(new Event('pathchange'));
}

const Skeleton: React.FC<{ which: 'student' | 'teacher' }> = ({ which }) => (
    <div
        className="w-full h-full rounded-[1.1rem] bg-duck-ink/5 animate-pulse"
        aria-label={which === 'student' ? 'Leerlingdashboard laden...' : 'Docentdashboard laden...'}
    />
);

interface Props {
    which: 'student' | 'teacher';
}

export const HeroDashboardPreview: React.FC<Props> = ({ which }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [scale, setScale] = useState(1);
    const [mounted, setMounted] = useState(false);

    const BASE_W = which === 'student' ? STUDENT_BASE_W : TEACHER_BASE_W;
    const BASE_H = which === 'student' ? STUDENT_BASE_H : TEACHER_BASE_H;

    // ResizeObserver: recompute scale whenever the container resizes
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const compute = () => {
            const w = el.getBoundingClientRect().width;
            if (w > 0) setScale(w / BASE_W);
        };

        compute();

        const ro = new ResizeObserver(compute);
        ro.observe(el);
        return () => ro.disconnect();
    }, [BASE_W]);

    // Deferred mount: after first paint via requestIdleCallback (or setTimeout fallback),
    // or immediately on first pointer interaction — whichever comes first.
    useEffect(() => {
        let done = false;

        const mount = () => {
            if (done) return;
            done = true;
            setMounted(true);
        };

        const idleId = typeof window.requestIdleCallback === 'function'
            ? window.requestIdleCallback(mount, { timeout: 2000 })
            : null;
        const timeoutId = idleId === null ? setTimeout(mount, 200) : null;

        const onInteraction = () => mount();
        const el = containerRef.current;
        el?.addEventListener('pointerenter', onInteraction, { once: true });
        el?.addEventListener('focus', onInteraction, { once: true, capture: true });

        return () => {
            if (idleId !== null && typeof window.cancelIdleCallback === 'function') {
                window.cancelIdleCallback(idleId);
            }
            if (timeoutId !== null) clearTimeout(timeoutId);
            el?.removeEventListener('pointerenter', onInteraction);
            el?.removeEventListener('focus', onInteraction, true);
        };
    }, []);

    const [activeWeek, setActiveWeek] = useState(2);
    const [activeYearGroup, setActiveYearGroup] = useState(
        DEMO_STUDENT_STATS.yearGroup ?? 2
    );

    return (
        <div
            ref={containerRef}
            className="relative w-full overflow-hidden rounded-[1.1rem]"
            style={{ aspectRatio: `${BASE_W}/${BASE_H}` }}
        >
            <div
                style={{
                    width: BASE_W,
                    height: BASE_H,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                }}
            >
                <Suspense fallback={<Skeleton which={which} />}>
                    {mounted && which === 'student' && (
                        <ProjectZeroDashboard
                            userUid="capture-student"
                            stats={DEMO_STUDENT_STATS}
                            userDisplayName="Demo-leerling"
                            userRole="student"
                            gamesEnabled={false}
                            containers={[]}
                            activeWeek={activeWeek}
                            setActiveWeek={setActiveWeek}
                            activeYearGroup={activeYearGroup}
                            setActiveYearGroup={setActiveYearGroup}
                            onSelectModule={openFullDemo}
                            onOpenProfile={openFullDemo}
                            onOpenGames={openFullDemo}
                            onLogout={noop}
                            onGoHome={noop}
                        />
                    )}
                    {mounted && which === 'teacher' && (
                        <TeacherDashboard
                            demoMode
                            demoStudents={DEMO_STUDENTS}
                            onLogout={noop}
                            onOpenGames={openFullDemo}
                            onViewAssignments={openFullDemo}
                        />
                    )}
                    {!mounted && <Skeleton which={which} />}
                </Suspense>
            </div>
        </div>
    );
};
