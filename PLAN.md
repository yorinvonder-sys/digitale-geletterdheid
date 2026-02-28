# Plan: Landing Page Redesign — Linear Animaties + Stripe Helderheid

## Doel
De huidige ScholenLanding.tsx (786 regels, 10+ secties) transformeren naar een
scroll-storytelling ervaring die Linear's animatie-kwaliteit combineert met
Stripe's visuele helderheid. Minder secties, meer impact, wow-factor.

---

## Wat verandert er concreet?

### Huidige structuur (10 secties):
```
1. Hero (tekst + zwevende screenshots)
2. Social Proof strip (cijfers)
3. Pain Points (4 probleemkaarten)
4. Features (6 feature-cards)
5. Customization (5 pijlers)
6. How It Works (3 stappen)
7. Game Demo (interactieve games)
8. Platform Preview (screenshot carousel)
9. SLO Kerndoelen (expandable)
10. FAQ + ICT + Expertise + Contact + Footer
```

### Nieuwe structuur (6 secties — "less is more"):
```
1. Hero (fullscreen, gradient, één statement, device mockup)
2. Probleem (sticky scroll counters — 3 stats, één per keer)
3. Oplossing (3 features, elk fullscreen, progressive reveal)
4. Social Proof (groot quote + animated metrics)
5. Hoe het werkt (verticale timeline met scroll-highlight)
6. CTA (gradient achtergrond, simpel formulier)
+ Compacte footer
```

### Wat wordt VERWIJDERD van de hoofdpagina:
- Customization (5 pijlers) → verplaatst naar aparte pagina of FAQ
- Game Demo → verplaatst naar aparte "/demo" route
- Platform Preview carousel → vervangen door inline screenshots in feature secties
- SLO Kerndoelen (expandable) → verkort tot badges in social proof
- ICT sectie → blijft als link, verwijderd als volledige sectie
- Expertise (oprichter) → naar footer of about-pagina

### Wat wordt TOEGEVOEGD:
- GSAP ScrollTrigger voor sticky scroll-animaties
- Lenis voor smooth scrolling
- Framer Motion `useScroll` + `useTransform` voor parallax
- Animated counters (nummers die optellen)
- Subtiele gradient-achtergronden (indigo → purple)
- Staggered text reveals
- Grotere typografie (4.5rem+ koppen)
- Veel meer witruimte (py-32 i.p.v. py-14)

---

## Stap-voor-stap implementatieplan

### Fase 1: Dependencies & Infra (15 min)
**Bestanden:** `package.json`, nieuwe utility hooks

1. Installeer `gsap` + `@gsap/react` (ScrollTrigger plugin)
2. Installeer `lenis` (smooth scroll)
3. Maak `hooks/useScrollAnimation.ts` — wrapper rond GSAP ScrollTrigger
4. Maak `hooks/useSmoothScroll.ts` — Lenis initialisatie
5. Maak `hooks/useAnimatedCounter.ts` — getal optellen bij in-view

### Fase 2: Nieuwe Landing Page Component (kernwerk)
**Bestanden:** `components/ScholenLandingV2.tsx` (nieuw bestand, vervangt niet direct)

Ik maak een **nieuw bestand** naast het oude. Dit voorkomt dat de live site breekt
tijdens ontwikkeling. Na goedkeuring wissel ik de import in `AppRouter.tsx`.

#### Sectie 1: Hero — Fullscreen Statement
```tsx
// 100vh, gradient achtergrond, één kop, één CTA, device mockup
// Animaties: fade-in text (staggered), floating device met parallax
// Inspiratie: Linear hero (bold tekst) + Stripe (gradient glow)
```
- Fullscreen (min-h-screen) met subtiele `bg-gradient-to-br from-slate-50 via-white to-indigo-50`
- H1 op **4.5rem** (desktop), font-extrabold, tracking-tight
- Eén subheading-zin, max 20 woorden
- Eén primaire CTA ("Ontdek het platform" → scrollt naar features)
- Device mockup rechts met Framer Motion parallax (`useScroll` + `useTransform`)
- Trust badges (AVG, SLO, Geen installatie) als discrete iconen
- Scroll-indicator puls onderaan

#### Sectie 2: Het Probleem — Sticky Counter Section
```tsx
// Sticky container (300vh hoogte), scherm blijft vast
// 3 statistieken verschijnen één voor één bij scrollen
// Animaties: GSAP ScrollTrigger pin + animated counter
// Inspiratie: Apple product page sticky sections
```
- Outer div: `h-[300vh]` (zorgt voor scroll-ruimte)
- Inner div: `position: sticky; top: 0; height: 100vh`
- 3 stats (4.7 rapportcijfer, 2027 deadline, 3.800 FTE tekort)
- Elke stat verschijnt op een scroll-breakpoint met `useAnimatedCounter`
- Achtergrondkleur verschuift subtiel per stat (warm rood → amber → koel blauw)
- Bronvermelding per stat (kleine tekst)
- Progress-dots onderaan (● ○ ○ → ○ ● ○ → ○ ○ ●)

#### Sectie 3: De Oplossing — Progressive Feature Reveal
```tsx
// 3 features, elk 100vh, links tekst + rechts screenshot
// Animaties: scroll-triggered slide-in (tekst van links, screenshot van rechts)
// Inspiratie: Stripe feature sections (progressieve onthulling)
```
- Feature 1: **AI-Missies** — "Elke leerling een unieke ervaring"
  - Links: kop + 2 zinnen + mini-CTA
  - Rechts: screenshot van missie-interface (bestaande asset)
- Feature 2: **SLO Kerndoelen** — "Alle 9 kerndoelen, automatisch gedekt"
  - Links: kop + kerndoel-badges (interactief)
  - Rechts: screenshot van kerndoel-dashboard
- Feature 3: **Real-time Dashboard** — "Zie precies waar elke leerling staat"
  - Links: kop + 2 zinnen
  - Rechts: screenshot van docent-dashboard
- Elke feature: `opacity: 0 → 1` en `translateY: 40px → 0` via Framer Motion `whileInView`
- Afwisselende layout (links/rechts/links) voor visuele variatie

#### Sectie 4: Social Proof — Testimonial + Metrics
```tsx
// Groot citaat, staggered woord-voor-woord reveal
// Animated metrics (20+ missies, 9 kerndoelen, 3 domeinen)
// Inspiratie: Linear testimonial style
```
- Achtergrond: `bg-slate-50`
- Groot citaat (text-3xl, italic) met staggered text reveal
- Citaatbron: "Docent informatica, Almere College"
- 3 metrics als animated counters eronder
- SLO + AVG badges

#### Sectie 5: Hoe het werkt — Verticale Timeline
```tsx
// 3 stappen verticaal, scroll-triggered highlight
// Verbindende lijn die "groeit" bij scrollen
// Inspiratie: Stripe's stap-voor-stap uitleg
```
- Verticale layout (niet horizontaal)
- Verbindende lijn: `scaleY: 0 → 1` geanimeerd met scroll-progress
- Elke stap licht op wanneer je erlangs scrollt (GSAP ScrollTrigger)
- Minimale copy per stap (titel + één zin)

#### Sectie 6: CTA — Krachtige Afsluiter
```tsx
// Gradient achtergrond (indigo → purple), bold statement
// Simpel formulier: alleen email + submit
// Trust badges onderaan
```
- `bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800`
- Grote kop: "Klaar om digitale geletterdheid écht leuk te maken?"
- Eén e-mailveld + knop (de rest van het formulier volgt na submit als modal/redirect)
- Trust badges: AVG, SLO 2025, EU AI Act compliant
- Of: direct een link naar het volledige contactformulier (bestaande Contact component)

### Fase 3: Smooth Scroll & Global Setup
**Bestanden:** `App.tsx` of wrapper component

1. Lenis initialiseren op root-level (smooth scroll voor hele pagina)
2. GSAP ScrollTrigger registreren
3. `prefers-reduced-motion` respecteren — alle animaties fallback naar instant

### Fase 4: Route Switch & Cleanup
**Bestanden:** `AppRouter.tsx`

1. Import wisselen: `ScholenLanding` → `ScholenLandingV2`
2. Oude component NIET verwijderen (bewaren als fallback)
3. Testen op mobiel, tablet, desktop
4. Lighthouse check (performance moet ≥90 blijven)

---

## Technische details

### Nieuwe dependencies
```json
{
  "gsap": "^3.12.5",
  "@gsap/react": "^2.1.1",
  "lenis": "^1.1.18"
}
```

### Nieuwe bestanden
```
hooks/useScrollAnimation.ts    — GSAP ScrollTrigger wrapper
hooks/useSmoothScroll.ts       — Lenis setup
hooks/useAnimatedCounter.ts    — Counter animatie
components/ScholenLandingV2.tsx — Nieuwe landing page
```

### Gewijzigde bestanden
```
package.json        — nieuwe dependencies
AppRouter.tsx       — import switch (na goedkeuring)
tailwind.config.js  — evt. nieuwe animatie keyframes
```

### Behouden & hergebruikt
- Alle bestaande screenshots/assets
- JSON-LD structured data
- SEO meta tags
- Analytics tracking (trackEvent)
- SectionErrorBoundary
- Bestaande sub-componenten voor FAQ/Contact (optioneel hergebruik)

### Performance-garanties
- Alleen `transform` en `opacity` animeren (GPU)
- `will-change` alleen op actief geanimeerde elementen
- Lazy loading behouden voor alles onder de fold
- GSAP tree-shaking (alleen ScrollTrigger importeren)
- Lenis: ~5KB gzipped
- GSAP ScrollTrigger: ~25KB gzipped
- Target: Lighthouse Performance ≥ 90

### Accessibility
- `prefers-reduced-motion: reduce` → alle animaties uit
- Keyboard navigatie behouden
- ARIA labels op alle interactieve elementen
- Focus management bij scroll-to-section
- Contrast ratio ≥ 4.5:1 op alle tekst

---

## Wat ik NIET doe
- De bestaande `ScholenLanding.tsx` overschrijven (nieuw bestand ernaast)
- Sub-componenten verwijderen (Game Demo, SLO, etc. blijven bestaan)
- SEO-structuur wijzigen (JSON-LD, meta tags blijven intact)
- De authenticated app aanpassen
- Dark mode toevoegen (dat is een apart project)

---

## Geschatte omvang
- **ScholenLandingV2.tsx**: ~400-500 regels (vs. 786 nu — less is more)
- **3 hooks**: ~150 regels totaal
- **Totaal nieuw**: ~550-650 regels code
