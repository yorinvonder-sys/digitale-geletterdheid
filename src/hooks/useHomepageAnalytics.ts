import { useEffect, useRef } from 'react';

// Passive homepage behaviour tracking — section visibility, scroll depth, time on
// page and CTA-kliks. All events are gated behind cookie consent inside trackEvent
// (analyticsService.ts).
//
// `page` labelt de pagina in de meting. `sectionSelector` bepaalt welke elementen
// als sectie tellen: standaard `[data-section]`, maar een pagina die haar secties
// al met een `id` markeert (zoals de verhaalpagina) kan die selector meegeven.
// De sectienaam komt uit `data-section`, met `id` als terugval.
//
// CTA-kliks worden gemeten via `data-cta` op de knop of link; pagina's zonder dat
// attribuut meten niets extra's.
export const useHomepageAnalytics = (
    page = 'scholen-landing',
    sectionSelector = '[data-section]',
) => {
    const trackedSections = useRef<Set<string>>(new Set());
    const trackedDepths = useRef<Set<number>>(new Set());
    const pageEnterTime = useRef<number>(Date.now());

    useEffect(() => {
        void import('@/services/analyticsService').then(({ trackEvent }) => {
            trackEvent('homepage_pageview', { page });
        });
    }, [page]);

    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState !== 'hidden') return;
            const seconds = Math.round((Date.now() - pageEnterTime.current) / 1000);
            void import('@/services/analyticsService').then(({ trackEvent }) => {
                trackEvent('homepage_time_on_page', { value: seconds, page });
            });
        };
        document.addEventListener('visibilitychange', handleVisibility);
        return () => document.removeEventListener('visibilitychange', handleVisibility);
    }, [page]);

    useEffect(() => {
        const sections = document.querySelectorAll<HTMLElement>(sectionSelector);
        if (!sections.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const el = entry.target as HTMLElement;
                    const name = el.dataset.section || el.id;
                    if (!name || trackedSections.current.has(name)) return;
                    trackedSections.current.add(name);
                    void import('@/services/analyticsService').then(({ trackEvent }) => {
                        trackEvent('homepage_section_view', { page: name });
                    });
                });
            },
            // Een sectie telt als gezien zodra hij de middelste helft van het
            // scherm raakt. Bewust géén percentage-drempel: die schaalt mee met
            // de hoogte van de sectie, zodat een sectie die zelf hoger is dan
            // vijf schermen (zoals het bewijs-hoofdstuk op de verhaalpagina)
            // die drempel per definitie nooit haalt en dus nooit werd geteld.
            { threshold: 0, rootMargin: '-25% 0px -25% 0px' }
        );

        sections.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [sectionSelector]);

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
                    trackEvent('homepage_scroll_depth', { value: milestone, page });
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
    }, [page]);

    // CTA-kliks. Eén gedelegeerde luisteraar op document-niveau, zodat een sectie
    // die later in beeld komt (of pas na een klik bestaat, zoals de film) geen
    // eigen bedrading nodig heeft. `closest` vangt ook een klik op een <span>
    // binnen de knop.
    useEffect(() => {
        const onClick = (event: MouseEvent) => {
            const target = event.target as Element | null;
            const trigger = target?.closest?.('[data-cta]') as HTMLElement | null;
            const cta = trigger?.dataset.cta;
            if (!cta) return;
            void import('@/services/analyticsService').then(({ trackEvent }) => {
                trackEvent('dual_cta_click', { type: cta, page });
            });
        };

        document.addEventListener('click', onClick);
        return () => document.removeEventListener('click', onClick);
    }, [page]);
};
