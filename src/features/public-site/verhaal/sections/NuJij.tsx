import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { ChapterMarker, Reveal } from '../components/storyBrand';

const GameLabExperience = lazy(() => import('@/features/public-site/game-lab/GameLabExperience'));

/**
 * "Nu jij" — het enige hoofdstuk waar de lezer zelf iets doet.
 *
 * Mila heeft net haar game gebouwd; hier bouwt de bezoeker er zelf een. De
 * game is echt speelbaar en de AI stuurt hem aan via een gevalideerde spec —
 * geen code-generatie.
 */

function Skeleton() {
    return (
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="aspect-video rounded-2xl border-2 border-duck-bg/15 bg-[#2b2b30]" />
            <div className="min-h-[420px] rounded-2xl border-2 border-duck-bg/15 bg-[#2b2b30]" />
        </div>
    );
}

export function NuJij() {
    const [show, setShow] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    // Het game-lab is een aparte chunk. Pas laden zodra de lezer in de buurt is,
    // zodat de rest van het verhaal niet op deze sectie hoeft te wachten.
    useEffect(() => {
        const element = ref.current;
        if (!element) return;
        if (typeof IntersectionObserver !== 'function') {
            setShow(true);
            return;
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShow(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '400px 0px' },
        );
        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    return (
        <section id="zelf" className="scroll-mt-24 relative overflow-hidden bg-duck-ink text-duck-bg grain">
            <div className="mx-auto max-w-6xl px-6 py-24 md:px-14 md:py-36">
                <ChapterMarker
                    kicker="Tussendoor · Nu jij"
                    number="·"
                    dark
                    title={
                        <>
                            Mila bouwde een game. <em className="italic">Bouw jij er ook een.</em>
                        </>
                    }
                />

                <Reveal delay={0.15} className="mt-8 max-w-2xl">
                    <p className="text-lg leading-relaxed text-duck-bg/70 md:text-xl">
                        Hieronder staat een echte, speelbare game. Vertel de AI wat je wilt veranderen —
                        een ander thema, een ander karakter, meer obstakels, een nieuw doel — en{' '}
                        <strong className="text-duck-bg">je ziet het meteen gebeuren</strong>. Tien prompts,
                        geen account. Dit is precies wat een leerling in de les doet.
                    </p>
                </Reveal>

                <div ref={ref} className="mt-14">
                    {show ? (
                        <Suspense fallback={<Skeleton />}>
                            <GameLabExperience />
                        </Suspense>
                    ) : (
                        <Skeleton />
                    )}
                </div>

                <Reveal className="mt-8">
                    {/* Bewust geen kerndoelcode: dit blok is een demo, geen
                        geregistreerde missie, en staat niet in de SLO-mapping.
                        Een code eraan hangen zou een dekkingsclaim zijn die het
                        product hier niet waarmaakt. */}
                    <p className="text-xs font-bold text-duck-bg/45">
                        Geen account nodig. DGSkills bewaart de inhoud van je gesprek niet in
                        de eigen database; de AI-verwerking loopt via Mistral, onder de
                        afspraken uit onze{' '}
                        <a href="/ict/privacy/ai" className="underline underline-offset-2 hover:text-duck-bg/70">
                            AI-transparantie
                        </a>.
                    </p>
                </Reveal>
            </div>
        </section>
    );
}
