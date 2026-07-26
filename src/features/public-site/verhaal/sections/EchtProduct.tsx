import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BrowserFrame, Reveal } from '../components/storyBrand';
import { HeroDashboardPreview } from '@/features/public-site/demo/HeroDashboardPreview';

/**
 * "Zo ziet het er echt uit" — het enige blok op /verhaal waar het werkelijke
 * product te zien is in plaats van een getekende impressie.
 *
 * Beide dashboards zijn zwaar, dus er wordt er altijd maar één tegelijk
 * gerenderd, en pas zodra het blok in beeld komt.
 */

type Rol = 'leerling' | 'docent';

const ROLLEN: { id: Rol; label: string; url: string; zin: string }[] = [
    {
        id: 'leerling',
        label: 'De leerling',
        url: 'dgskills.app/mijn-projecten',
        zin: 'Mila kiest haar eigen project, ziet haar voortgang en verzamelt bewijs van wat ze kan.',
    },
    {
        id: 'docent',
        label: 'De docent',
        url: 'dgskills.app/klas',
        zin: 'Jij ziet in één blik wie er vastzit — zonder rondje langs alle tafels.',
    },
];

/**
 * Nog vast te leggen met `npm run capture:product`. Zolang het bestand er niet
 * is blijft dit `null`: een `<img>` naar een ontbrekend pad laat elke bezoeker
 * een 404 ophalen, en de `onError`-terugval verbergt dat alleen visueel.
 * Zet dit op '/assets/product/leerling-trofeeen.webp' zodra de opname staat.
 */
const TROFEEEN_SRC: string | null = null;

/**
 * Trofeeën/unlocks staan naast het live scherm en niet erin: die omgeving zit
 * achter een login en is dus niet live in te bedden. Klein gehouden — het
 * dashboard moet de volle breedte houden, anders wordt de tekst erin onleesbaar.
 */
function TrofeeenFiguur() {
    const [failed, setFailed] = useState(false);

    return (
        <figure className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
            {failed || TROFEEEN_SRC === null ? (
                <div
                    className="flex h-[180px] w-full shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-duck-bg/20 px-4 text-center sm:w-[280px]"
                    aria-hidden="true"
                >
                    <span className="text-xs font-bold uppercase tracking-widest text-duck-bg/40">
                        Badges en unlocks
                    </span>
                </div>
            ) : (
                <img
                    src={TROFEEEN_SRC}
                    alt="Trofeeënscherm van een leerling: behaalde badges naast badges die nog te verdienen zijn."
                    width={1200}
                    height={800}
                    loading="lazy"
                    decoding="async"
                    onError={() => setFailed(true)}
                    className="w-full shrink-0 rounded-xl border-2 border-duck-bg/20 sm:w-[280px]"
                />
            )}
            <figcaption className="text-sm leading-relaxed text-duck-bg/60">
                XP geef je uit aan je avatar. Wat je nog niet hebt vrijgespeeld zie je staan — dat is
                wat leerlingen terugbrengt.{' '}
                <span className="text-duck-bg/40">Dit scherm zit achter een login.</span>
            </figcaption>
        </figure>
    );
}

export function EchtProduct() {
    const [rol, setRol] = useState<Rol>('leerling');
    const [zichtbaar, setZichtbaar] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

    // Zwaar blok: pas laden als de lezer in de buurt is.
    useEffect(() => {
        const element = ref.current;
        if (!element) return;
        if (typeof IntersectionObserver !== 'function') {
            setZichtbaar(true);
            return;
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setZichtbaar(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '400px 0px' },
        );
        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    const onTabKeyDown = useCallback((event: React.KeyboardEvent, index: number) => {
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
        event.preventDefault();
        const next = event.key === 'ArrowRight'
            ? (index + 1) % ROLLEN.length
            : (index - 1 + ROLLEN.length) % ROLLEN.length;
        setRol(ROLLEN[next].id);
        tabRefs.current[next]?.focus();
    }, []);

    const actief = ROLLEN.find((r) => r.id === rol) ?? ROLLEN[0];

    return (
        <div ref={ref} className="mt-20">
            <Reveal>
                <h3 className="font-display text-2xl font-black leading-tight text-duck-bg md:text-3xl">
                    En zo ziet het er echt uit.
                </h3>
            </Reveal>

            <Reveal delay={0.08}>
                <div
                    role="tablist"
                    aria-label="Kies een rol"
                    className="mt-6 inline-flex rounded-full border-2 border-duck-bg/25 p-1"
                >
                    {ROLLEN.map((r, index) => {
                        const isActief = r.id === rol;
                        return (
                            <button
                                key={r.id}
                                ref={(el) => { tabRefs.current[index] = el; }}
                                role="tab"
                                type="button"
                                id={`echt-tab-${r.id}`}
                                aria-selected={isActief}
                                aria-controls="echt-paneel"
                                tabIndex={isActief ? 0 : -1}
                                onClick={() => setRol(r.id)}
                                onKeyDown={(event) => onTabKeyDown(event, index)}
                                className={`min-h-[44px] rounded-full px-6 text-sm font-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid focus-visible:ring-offset-2 focus-visible:ring-offset-duck-ink ${
                                    isActief ? 'bg-duck-acid text-duck-ink' : 'text-duck-bg/70 hover:text-duck-bg'
                                }`}
                            >
                                {r.label}
                            </button>
                        );
                    })}
                </div>
            </Reveal>

            <Reveal delay={0.12}>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-duck-bg/70">{actief.zin}</p>
            </Reveal>

            <div
                role="tabpanel"
                id="echt-paneel"
                aria-labelledby={`echt-tab-${rol}`}
                className="mt-8"
            >
                {!zichtbaar ? (
                    <div className="aspect-[16/10] w-full rounded-2xl border-2 border-duck-bg/15 bg-[#2b2b30]" aria-hidden="true" />
                ) : (
                    <>
                        {/* Volle breedte: het dashboard schaalt met de containerbreedte,
                            en in een smallere kolom wordt de tekst erin onleesbaar. */}
                        <BrowserFrame url={actief.url}>
                            {rol === 'docent' ? (
                                // Hoger podium dan de standaard 16:10: het Aandacht-paneel
                                // begint net onder 800px en dat is precies de boodschap.
                                <HeroDashboardPreview which="teacher" baseHeight={1180} />
                            ) : (
                                <HeroDashboardPreview which="student" />
                            )}
                        </BrowserFrame>
                        {rol === 'leerling' && <TrofeeenFiguur />}
                    </>
                )}
            </div>

            <Reveal delay={0.16}>
                <p className="mt-4 text-xs italic text-duck-bg/45">
                    Live uit het echte product. De leerlingen zijn fictief — geen echte
                    leerlinggegevens. Op een smal scherm is het dashboard sterk verkleind;{' '}
                    <a href="/leerlingdemo" className="underline underline-offset-2 hover:text-duck-bg/70">
                        open de demo
                    </a>{' '}
                    om erin te klikken.
                </p>
            </Reveal>
        </div>
    );
}
