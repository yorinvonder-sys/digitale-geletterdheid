import { useEffect, useRef } from 'react';

// Passive homepage behaviour tracking — section visibility, scroll depth, time on page.
// All events are gated behind cookie consent inside trackEvent (analyticsService.ts).
export const useHomepageAnalytics = () => {
    const trackedSections = useRef<Set<string>>(new Set());
    const trackedDepths = useRef<Set<number>>(new Set());
    const pageEnterTime = useRef<number>(Date.now());

    useEffect(() => {
        void import('@/services/analyticsService').then(({ trackEvent }) => {
            trackEvent('homepage_pageview', { page: 'scholen-landing' });
        });
    }, []);

    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState !== 'hidden') return;
            const seconds = Math.round((Date.now() - pageEnterTime.current) / 1000);
            void import('@/services/analyticsService').then(({ trackEvent }) => {
                trackEvent('homepage_time_on_page', { value: seconds, page: 'scholen-landing' });
            });
        };
        document.addEventListener('visibilitychange', handleVisibility);
        return () => document.removeEventListener('visibilitychange', handleVisibility);
    }, []);

    useEffect(() => {
        const sections = document.querySelectorAll<HTMLElement>('[data-section]');
        if (!sections.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const name = (entry.target as HTMLElement).dataset.section;
                    if (!name || trackedSections.current.has(name)) return;
                    trackedSections.current.add(name);
                    void import('@/services/analyticsService').then(({ trackEvent }) => {
                        trackEvent('homepage_section_view', { page: name });
                    });
                });
            },
            { threshold: 0.2 }
        );

        sections.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const MILESTONES = [25, 50, 75, 100];

        const check = () => {
            const el = document.documentElement;
            const total = el.scrollHeight - el.clientHeight;
            if (total <= 0) return;
            const pct = Math.round((el.scrollTop / total) * 100);
            MILESTONES.forEach((milestone) => {
                if (pct < milestone || trackedDepths.current.has(milestone)) return;
                trackedDepths.current.add(milestone);
                void import('@/services/analyticsService').then(({ trackEvent }) => {
                    trackEvent('homepage_scroll_depth', { value: milestone, page: 'scholen-landing' });
                });
            });
        };

        let ticking = false;
        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                check();
                ticking = false;
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
};
