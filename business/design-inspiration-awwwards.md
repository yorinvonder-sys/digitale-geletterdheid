# Design Inspiratie Rapport — DGSkills.app Redesign

> Onderzoek naar award-winnende websites (Awwwards, Webby Awards) die passen bij een
> educatief AI-platform. Focus: storytelling, "less is more", wow-factor, visuele helderheid.
>
> Datum: 27 februari 2026

---

## Inhoudsopgave

1. [Huidige staat DGSkills.app](#1-huidige-staat-dgskillsapp)
2. [Top Design-patronen die werken](#2-top-design-patronen-die-werken)
3. [Award-winnende inspiratie-sites](#3-award-winnende-inspiratie-sites)
4. [Concrete aanbevelingen voor DGSkills](#4-concrete-aanbevelingen-voor-dgskills)
5. [Technische implementatie](#5-technische-implementatie)
6. [Bronnen](#6-bronnen)

---

## 1. Huidige staat DGSkills.app

### Wat werkt goed
- **Informatiehiërarchie** — Duidelijke progressie van probleem → oplossing → validatie
- **Data-gedreven narratief** — Concrete cijfers en bronnen bouwen geloofwaardigheid
- **Performance** — Lazy loading, deferred components, goede LCP
- **Trust signals** — AVG, SLO 2025, EU AI Act, Almere College pilot
- **Kleurconsistentie** — Indigo primair (#0B453F), duidelijke kleurcodering per domein

### Wat beter kan
- **Te veel informatie tegelijk** — 8+ secties op de landingspagina; geen "ademruimte"
- **Geen scroll-storytelling** — Secties zijn informatief maar niet narratief
- **Statische presentatie** — Voornamelijk screenshots; geen video, geen live demo
- **CTA-moeheid** — 8+ "Gratis pilot aanvragen" knoppen voelen repetitief
- **Geen wow-factor** — Functioneel maar niet memorabel
- **Visuele hiërarchie in features** — Alle 6 feature-cards hebben gelijk gewicht
- **Hero-sectie** — Zwevende screenshots rechts verdwijnen op mobiel

---

## 2. Top Design-patronen die werken

### A. De "Linear Look" — Dominant SaaS-trend 2024-2026

**Wat het is:** Een design-stijl gepopulariseerd door [Linear.app](https://linear.app) die nu het hele SaaS-landschap domineert.

**Kernkenmerken:**
- **Donkere achtergrond** met subtiele gradiënt-glows
- **Monochrome kleurenpalet** met spaarzame accentkleuren
- **Glassmorphism** — Semi-transparante elementen met blur
- **Lineaire layout** — Opeenvolgend, logische progressie
- **Micro-animaties** — Subtiel maar doelgericht
- **Bold typografie** — Groot, strak, met veel witruimte

**Wie het gebruiken:** Linear, Raycast, Vercel, Resend, Supabase, Clerk

**Relevant voor DGSkills?** Gedeeltelijk. De donkere modus past niet direct bij onderwijs (te "developer-achtig"), maar de **principes** — eenvoud, witruimte, doelgerichte animatie, lineaire flow — zijn goud waard.

**Aanpassing voor DGSkills:**
- Behoud het lichte kleurenschema maar adopteer de **witruimte en ademruimte**
- Gebruik de **lineaire scroll-flow** (één verhaal, sectie per sectie)
- Implementeer **subtiele glow-effecten** in indigo/purple op lichte achtergrond
- Neem de **bold typografie** over met meer contrast

---

### B. Apple-stijl Scroll-animaties — De gouden standaard

**Wat het is:** Apple's productpagina's (AirPods Pro, MacBook, iPhone) gebruiken scroll-gestuurde animaties waar elementen "vastplakken" aan het scherm en transformeren terwijl je scrollt.

**Technieken:**
1. **`position: sticky`** — Elementen blijven vast terwijl de achtergrond scrollt
2. **Canvas frame-sequencing** — Honderden frames worden afgespeeld op basis van scrollpositie
3. **CSS `animation-timeline: scroll()`** — Moderne CSS-only benadering
4. **Clip-path wipes** — Secties "onthullen" zich via maskers
5. **Parallax layers** — Verschillende elementen bewegen op verschillende snelheden

**Relevant voor DGSkills?** Zeer relevant. De "one page, one story" aanpak is perfect voor het uitleggen van een complex educatief platform aan docenten en ICT-coördinatoren die snel willen begrijpen wat het is.

**Aanpassing voor DGSkills:**
- **Hero → Probleem → Oplossing → Bewijs → CTA** als één scroll-reis
- Platform-screenshots die "tot leven komen" bij scrollen
- Nummers die optellen (animated counters) bij het in beeld komen
- Feature-onthullingen met sticky secties

---

### C. Stripe-stijl Progressieve Onthulling

**Wat het is:** Stripe.com onthult product-features geleidelijk met elegante animaties en micro-interacties, in plaats van alles tegelijk te tonen.

**Technieken:**
- **Continu vloeiende gradiënt-animaties** als achtergrond
- **Progressieve feature-onthulling** — Features verschijnen pas als je scrollt
- **Alleen `transform` en `opacity` animeren** — GPU-geaccelereerd, geen jank
- **Animaties onder 500ms** — Snel genoeg om responsief te voelen
- **Viewport-triggered autoplay** — Animaties starten wanneer ze zichtbaar worden

**Relevant voor DGSkills?** De gradiënten zijn signature Stripe, maar het **principe van progressieve onthulling** is perfect. In plaats van alle 6 features tegelijk te tonen, onthul ze één voor één met scroll-animatie.

---

### D. Scroll-triggered Storytelling — Awwwards Trend

**Wat het is:** Websites die een verhaal vertellen door scroll-interactie, waar elke scroll-actie nieuwe content, animaties of transformaties triggert.

**Awwwards-winnaars in deze categorie:**
- **Igloo Inc** (Site of the Year 2024) — Immersieve 3D-ervaring met scroll-interactie
- **The White Tower** — WebVR scroll-triggered storytelling
- **Rose Island** — Parallax met Three.js en Webflow
- **C2MTL** — Naadloze scroll-triggered text/image reveals
- **LX HAUSYS Trendship 2025** — WebGL shaders met scroll-synchronisatie

---

## 3. Award-winnende inspiratie-sites

### Tier 1: Directe inspiratie voor DGSkills

#### 1. Vivacity (EdTech Gouden Standaard 2025)
- **Waarom:** De "gouden standaard voor EdTech in 2025" — strategisch gebruik van metrics en certificeringen
- **Wow-factor:** Directe geloofwaardigheid via data + visuele demo's van het platform
- **Toepasbaar:** DGSkills kan dezelfde aanpak gebruiken met SLO-kerndoelen als trust anchors

#### 2. Grammarly (AI EdTech)
- **Waarom:** AI-product dat vertrouwen opbouwt in onderwijssettings
- **Wow-factor:** Prominente CTA's, visuele demonstratie van AI-features met concrete percentages
- **Toepasbaar:** Laat zien hoe AI daadwerkelijk werkt in het platform (live preview-stijl)

#### 3. Linear.app (SaaS Design Referentie)
- **Waarom:** Definitieve SaaS-design — elke pixel is doelbewust
- **Wow-factor:** Subtiele animaties, live product-previews, torenhoge typografie
- **Toepasbaar:** Adopteer de witruimte-filosofie en het "minder = meer" principe
- **URL:** https://linear.app

#### 4. Vercel.com (Developer SaaS Minimal)
- **Waarom:** Extreem minimalistisch maar toch indrukwekkend
- **Wow-factor:** Donkere modus, geometrische patronen, snelle page transitions
- **Toepasbaar:** De grid-gebaseerde layout en strakke typografie
- **URL:** https://vercel.com

#### 5. Stripe.com (Progressieve Onthulling)
- **Waarom:** Meester in het simpel presenteren van complex
- **Wow-factor:** Vloeiende gradiënten, progressieve feature reveals, micro-animaties
- **Toepasbaar:** "Complex simpel maken" — perfect voor het uitleggen van AI + onderwijs
- **URL:** https://stripe.com

---

### Tier 1b: Awwwards 2025 Winnaars & EdTech-specifiek

#### 6. Lando Norris (Awwwards Site of the Year 2025)
- **Waarom:** GSAP-driven scroll choreografie — tekst, stats en 3D bewegen in perfecte sync
- **Wow-factor:** Twee-kleurenpalet (#D2FF00 + #111112) — bold, onverwacht, direct herkenbaar. WebGL + Rive animaties + scroll-driven cinematics
- **Toepasbaar:** De "elke scroll triggert iets betekenisvols" aanpak werkt perfect voor stap-voor-stap AI uitleg. Performance-first ondanks visuele dichtheid
- **URL:** https://landonorris.com
- **Score:** 8.18/10, Creativity 8.71/10

#### 7. Skillex Online Education (Awwwards Honorable Mention)
- **Waarom:** Educatie-platform met ronde vormen, zachte pastels, rustige uitstraling — "productief en vredig"
- **Wow-factor:** Parallax single-page design, A/B geteste registratieflows
- **Toepasbaar:** De "kalm en productief" esthetiek is exact juist voor een schooltool — niet flashy, niet saai. Ronde vormen signaleren veiligheid voor jongere doelgroepen
- **URL:** https://skillex.webflow.io
- **Awards:** Awwwards, CSS Design Awards, CSS Nectar, CSS Winner

#### 8. Signs AI (Awwwards Honorable Mention — AI + Educatie)
- **Waarom:** AI + Educatie + Toegankelijkheid combinatie met Three.js
- **Wow-factor:** Gesture-based navigatie, deep purple (#322476) + light lavender palette. Score: 8.70-9.10
- **Toepasbaar:** Laat zien hoe AI als tool voor educatieve inclusie kan worden gepresenteerd. Purple palette past bij DGSkills branding
- **URL:** https://www.awwwards.com/sites/signs-ai

#### 9. Clever (EdTech Simpliciteit)
- **Waarom:** Minimalistisch blauw-wit design, audience-specifieke navigatie ("Schools", "Partners", "Students")
- **Wow-factor:** Echte klaslokaalfoto's (geen stock), strategische kleuraccenten
- **Toepasbaar:** Aparte ingangen voor "Docenten", "ICT-coördinatoren" en "Schoolleiders" — de koper is niet de gebruiker
- **URL:** https://clever.com

#### 10. Obys AIM — AI Modernism (Awwwards Site of the Month 2024)
- **Waarom:** Variable typografie als centerpiece, scroll-storytelling per "hoofdstuk"
- **Wow-factor:** LCP ~1.3s desktop ondanks zware animatie. Kinetische tekst onthult content progressief
- **Toepasbaar:** "Hoofdstuk-gebaseerde" scroll-storytelling is perfect voor de 5 pijlers van digitale geletterdheid. Accessibility-first: `prefers-reduced-motion` swaps animaties naar fades
- **URL:** https://obys.agency/aim

---

### Tier 2: Visuele & animatie-inspiratie

#### 11. Igloo Inc (Awwwards Site of the Year 2024)
- **Waarom:** Combinatie van immersieve 3D + eenvoudige scroll-navigatie
- **Wow-factor:** Procedurele ijsblokgeneratie, particle effects, WebGL UI, geluid
- **Toepasbaar:** De filosofie: "weinig secties, veel interactieve elementen per sectie"
- **URL:** https://igloo.inc
- **Tech:** Three.js, GSAP, Svelte, Vite

#### 12. Design Education Series® (Awwwards SOTD)
- **Waarom:** Educatief + award-winnend design in één — directe referentie
- **Wow-factor:** Designprincipes visueel uitgelegd via interactie
- **Toepasbaar:** Laat "digitale geletterdheid" zelf voelen via het design
- **URL:** https://www.awwwards.com/sites/design-education-series-r

#### 13. Don't Board Me (Awwwards Users' Choice 2024)
- **Waarom:** "Verrassende mix van art direction, engaging copywriting en praktische website"
- **Wow-factor:** Persoonlijkheid + functionaliteit in balans
- **Toepasbaar:** Copywriting-stijl — warm, direct, met karakter

#### 14. Notion.so (Product-led SaaS)
- **Waarom:** Complexe tool, eenvoudig gepresenteerd
- **Wow-factor:** Template-galerij als selling point, interactieve demo's
- **Toepasbaar:** "Probeer het zelf" aanpak — interactieve missie-preview
- **URL:** https://notion.so

#### 15. Padlet (EdTech Interactief)
- **Waarom:** Onderwijs-tool met speelse, kleurrijke design
- **Wow-factor:** Interactieve canvassen die direct laten zien wat het doet
- **Toepasbaar:** De "show don't tell" benadering met interactieve elementen
- **URL:** https://padlet.com

---

### Tier 3: Animatie-technieken & bibliotheken

#### 16. Mana Yerba Maté (3D Scroll Storytelling)
- **Techniek:** 3D-render van product die roteert/beweegt bij scrollen
- **Toepasbaar:** DGSkills mascotte of device-mockup die transformeert bij scroll

#### 17. C2MTL (Text Reveal Animations)
- **Techniek:** Naadloze scroll-triggered tekst en afbeelding onthullingen
- **Toepasbaar:** Kerndoelen en features die "verschijnen" bij scrollen

#### 18. Toyfight (Easing Mastery)
- **Techniek:** Unieke easing per element — tekst, illustraties, knoppen
- **Toepasbaar:** Variatie in animatie-timing voor visuele rijkdom

#### 19. Immersive Garden (Awwwards Agency of the Year 2025)
- **Techniek:** Bas-relief 3D, "Backstage" sectie die het technische proces toont, easter eggs
- **Toepasbaar:** Een "Backstage" concept dat laat zien hoe de AI werkt — dit IS de educatieve waarde. Perfect voor een AI-geletterdheidplatform
- **URL:** https://immersive-g.com

#### 20. Huly.io (Motion Storytelling SaaS)
- **Techniek:** Vloeiende secties met dynamische kleurinteracties, vibrant palette dat verschuift bij scroll
- **Toepasbaar:** Complexe all-in-one tool die simpel gepresenteerd wordt per feature-sectie. Elke feature krijgt eigen kleur + animatie
- **URL:** https://huly.io

### Scrollytelling — Kernstatistiek

> **Goed gemaakte scroll-driven stories bereiken 400% hogere engagement dan statische content.**
> — Bron: Maglr/Shorthand scrollytelling research

---

## 4. Concrete aanbevelingen voor DGSkills

### Redesign-concept: "Eén Scroll, Eén Verhaal"

De kernfilosofie: verander de landingspagina van een **informatiebrochure** naar een **scroll-ervaring** die één verhaal vertelt.

---

### Sectie-voor-sectie concept

#### Sectie 1: Hero — "De Toekomst van Digitale Geletterdheid" (100vh)
**Huidige staat:** Tekst links, zwevende screenshots rechts
**Nieuw concept:**
- **Volledig scherm** met één krachtige zin
- **Animated gradient achtergrond** (subtiel, indigo → purple → sky)
- **Eén grote CTA** — "Ontdek het platform" (scroll-down trigger)
- **Scroll-indicator** met pulserende animatie
- **Geen navigatie-items** in de hero — alleen het logo en "Inloggen"
- **Device mockup** die "zweeft" met subtiele parallax

```
┌─────────────────────────────────────────────┐
│  DGSkills                        Inloggen   │
│                                             │
│                                             │
│     Digitale geletterdheid                  │
│     waar leerlingen écht                    │
│     enthousiast van worden.                 │
│                                             │
│         [ Ontdek het platform ↓ ]           │
│                                             │
│              ╭───────────────╮              │
│              │  📱 App Demo  │              │
│              │   (floating)  │              │
│              ╰───────────────╯              │
│                    ↓                        │
└─────────────────────────────────────────────┘
```

#### Sectie 2: Het Probleem — Sticky Counter Section (100vh)
**Huidige staat:** 4 probleem-cards naast elkaar
**Nieuw concept:**
- **Sticky sectie** — het scherm blijft vast terwijl je scrollt
- **Animated counters** die optellen: 4.7 → rapportcijfer, 2027 → deadline, 2.200 → FTE
- **Eén nummer tegelijk** dat groot in beeld verschijnt en dan verkleint
- **Minimale tekst** — alleen het getal en één zin
- **Kleur-shift** — achtergrond verandert subtiel per probleem (warm → koud)

```
┌─────────────────────────────────────────────┐
│                                             │
│                                             │
│              4.7                            │
│     Het gemiddelde rapportcijfer            │
│     dat leerlingen geven aan hun            │
│     digitale geletterdheid lessen.          │
│                                             │
│              — Kennisnet, 2024              │
│                                             │
│              ● ○ ○ ○                        │
└─────────────────────────────────────────────┘

  ↓ scroll → volgende stat verschijnt met animatie
```

#### Sectie 3: De Oplossing — Progressive Reveal (3x 100vh)
**Huidige staat:** 6 feature-cards in een grid
**Nieuw concept:**
- **3 key features** (niet 6) — "less is more"
- **Elke feature krijgt een volledig scherm**
- **Links: tekst + CTA | Rechts: live platform preview**
- **Scroll-triggered** — tekst schuift in, screenshot animeert

**Feature 1: AI-Missies**
```
┌─────────────────────────────────────────────┐
│                                             │
│  AI-gestuurde missies          ┌──────────┐ │
│  die aanpassen aan             │          │ │
│  het niveau van                │  Live    │ │
│  elke leerling.                │  Demo    │ │
│                                │  Preview │ │
│  "Elke missie is uniek —       │          │ │
│   geen twee leerlingen         └──────────┘ │
│   krijgen dezelfde ervaring."              │
│                                             │
└─────────────────────────────────────────────┘
```

**Feature 2: SLO Kerndoelen** (met interactieve kerndoel-mapping)
**Feature 3: Dashboard** (met animated data visualisatie)

#### Sectie 4: Social Proof — Animated Testimonial (100vh)
**Huidige staat:** Statistieken-strip
**Nieuw concept:**
- **Groot quote** van een docent/school
- **Fade-in animatie** met staggered woord-voor-woord onthulling
- **School-logo** + foto
- **Animated metrics** rondom de quote

```
┌─────────────────────────────────────────────┐
│                                             │
│                                             │
│   "Eindelijk een platform dat              │
│    mijn leerlingen wél                     │
│    motiveert."                             │
│                                             │
│    — Docent informatica,                    │
│      Almere College                         │
│                                             │
│   ┌────┐  ┌────┐  ┌────┐                   │
│   │ 20+│  │ 9  │  │ 3  │                   │
│   │miss│  │kern│  │dom.│                   │
│   └────┘  └────┘  └────┘                   │
│                                             │
└─────────────────────────────────────────────┘
```

#### Sectie 5: Hoe het werkt — 3-Step Timeline (100vh)
**Huidige staat:** 3 horizontale cards
**Nieuw concept:**
- **Verticale timeline** met scroll-triggered highlights
- **Elke stap licht op** wanneer je erlangs scrollt
- **Verbindende lijn** die "groeit" bij scrollen
- **Minimale copy** per stap

```
┌─────────────────────────────────────────────┐
│                                             │
│     ● Pilot aanvragen                       │
│     │  Vul het formulier in —               │
│     │  binnen 24u reactie.                  │
│     │                                       │
│     ◉ Onboarding (30 min)     ← actief     │
│     │  We richten alles samen in.           │
│     │  Geen technische kennis nodig.        │
│     │                                       │
│     ○ Leerlingen starten                    │
│        Direct aan de slag                   │
│        met AI-missies.                      │
│                                             │
└─────────────────────────────────────────────┘
```

#### Sectie 6: CTA — Één Krachtige Afsluiter (100vh)
**Huidige staat:** Formulier met veel velden
**Nieuw concept:**
- **Groot, bold statement**
- **Eén e-mailveld** + submit-knop (niet 6 velden)
- **Gradient achtergrond** die pulseert
- **Trust badges** onderaan (AVG, SLO, EU AI Act)

```
┌─────────────────────────────────────────────┐
│                                             │
│    ── gradient achtergrond ──               │
│                                             │
│    Klaar om digitale                        │
│    geletterdheid écht                       │
│    leuk te maken?                           │
│                                             │
│    ┌────────────────────┐ ┌──────┐          │
│    │ je@school.nl       │ │ Start│          │
│    └────────────────────┘ └──────┘          │
│                                             │
│    🔒 AVG   📋 SLO 2025   🇪🇺 AI Act       │
│                                             │
└─────────────────────────────────────────────┘
```

---

### Design Tokens — Nieuw Voorstel

| Token | Huidig | Voorstel | Reden |
|-------|--------|----------|-------|
| **Typografie H1** | 3.5rem | **4.5rem–5rem** | Meer impact, Linear-stijl bold |
| **Body spacing** | py-14/20 | **py-24–32** | Meer ademruimte |
| **Max secties** | 8+ | **6** | Less is more |
| **Features getoond** | 6 tegelijk | **3 (sequentieel)** | Focus |
| **CTA's** | 8+ knoppen | **3 max** | Geen CTA-moeheid |
| **Animaties** | fadeInUp only | **scroll-triggered + sticky** | Wow-factor |
| **Gradient** | Geen | **Subtiele indigo→purple** | Visuele warmte |
| **Witruimte** | Gemiddeld | **Veel meer** | Luxe gevoel |

---

## 5. Technische implementatie

### Aanbevolen Libraries (compatibel met huidige stack)

| Library | Doel | Grootte |
|---------|------|---------|
| **Framer Motion** (al aanwezig) | Basis animaties, layout transitions | ~30KB |
| **GSAP ScrollTrigger** | Scroll-triggered animaties, sticky secties | ~25KB |
| **Lenis** | Smooth scrolling (vervangt default browser scroll) | ~5KB |
| **CSS `animation-timeline: scroll()`** | Parallax zonder JS (Chrome/Edge) | 0KB |
| **`position: sticky`** | Sticky secties (native CSS) | 0KB |

### Performance-overwegingen
- **Alleen `transform` en `opacity` animeren** — GPU-geaccelereerd, geen layout thrashing
- **`will-change` sparingly gebruiken** — Alleen op elementen die daadwerkelijk animeren
- **IntersectionObserver** (al aanwezig) voor viewport-triggered loading
- **Animaties onder 500ms** — Stripe's vuistregel
- **Reduced motion respecteren** — `prefers-reduced-motion` media query
- **Lazy load alles onder de fold** — Al geïmplementeerd, behouden

### Implementatie-prioriteit
1. **Hero redesign** — Grootste impact, minste effort
2. **Sticky counter sectie** — Wow-factor, relatief simpel met GSAP
3. **Progressive feature reveal** — Vervangt de 6-card grid
4. **Smooth scrolling** — Lenis integratie voor vloeiende scroll
5. **Gradient achtergronden** — CSS-only, geen performance impact
6. **Testimonial animatie** — Staggered text reveal

---

## 6. Bronnen

### Awwwards & Awards
- [Awwwards Annual Awards 2025](https://www.awwwards.com/annual-awards/) — Lando Norris als Site of the Year
- [Awwwards Annual Awards 2024](https://www.awwwards.com/annual-awards-2024/) — Igloo Inc als Site of the Year
- [Awwwards Site of the Year 2024](https://www.awwwards.com/annual-awards-2024/site-of-the-year) — Igloo Inc details
- [Awwwards Minimal Websites](https://www.awwwards.com/websites/minimal/) — Minimale design-galerij
- [Awwwards Scroll Websites](https://www.awwwards.com/websites/scrolling/) — Scroll-animatie galerij
- [Awwwards Education Websites](https://www.awwwards.com/websites/culture-education/) — Educatie-categorie
- [Awwwards Storytelling Category](https://www.awwwards.com/websites/storytelling/) — Storytelling designs
- [Design Education Series® (SOTD)](https://www.awwwards.com/sites/design-education-series-r) — Educatief design
- [Signs AI (Honorable Mention)](https://www.awwwards.com/sites/signs-ai) — AI + Educatie + Toegankelijkheid
- [Skillex Online Education](https://www.awwwards.com/sites/skillex-online-education) — EdTech parallax design
- [Lando Norris Case Study — OFF+BRAND](https://www.itsoffbrand.com/our-work/lando-norris) — GSAP scroll choreografie
- [Immersive Garden Case Study](https://www.awwwards.com/case-study-immersive-gardens-new-website.html) — Agency of the Year 2025
- [Made With GSAP](https://madewithgsap.com/) — 50 web motion technieken showcase

### Design Trends & Analyse
- [The Linear Look — Frontend Horse](https://frontend.horse/articles/the-linear-look/) — Analyse van de Linear-trend
- [Linear Design Trend — LogRocket](https://blog.logrocket.com/ux-design/linear-design/) — Diepgaande analyse
- [Rise of Linear Style Design — Medium/Bootcamp](https://medium.com/design-bootcamp/the-rise-of-linear-style-design-origins-trends-and-techniques-4fd96aab7646) — Oorsprong en technieken
- [Web Design Trends 2025 — Framer](https://www.framer.com/blog/web-design-trends/) — Framer's trend-overzicht
- [2025 Web Design Trends — Bubble.io](https://bubble.io/blog/web-design-trends/) — Parallax & trends

### EdTech Design
- [Top 13 EdTech Landing Pages 2025 — Caffeine Marketing](https://www.caffeinemarketing.com/blog/top-13-edtech-landing-page-designs) — Vivacity als gouden standaard
- [15 Best EdTech Websites — Webstacks](https://www.webstacks.com/blog/edtech-websites) — Design-voorbeelden
- [Education Landing Pages — Lapa Ninja](https://www.lapa.ninja/category/education/) — 430 voorbeelden

### Technische Implementatie
- [Awwward-winning Animation Techniques — Medium](https://medium.com/design-bootcamp/awwward-winning-animation-techniques-for-websites-cb7c6b5a86ff) — GSAP, Three.js, Lenis
- [Apple Scroll Animations — CSS-Tricks](https://css-tricks.com/lets-make-one-of-those-fancy-scrolling-animations-used-on-apple-product-pages/) — Sticky + canvas techniek
- [CSS Scroll-Driven Animations — CSS-Tricks](https://css-tricks.com/bringing-back-parallax-with-scroll-driven-css-animations/) — Moderne CSS parallax
- [Apple-style with CSS view-timeline — Builder.io](https://www.builder.io/blog/view-timeline) — CSS-only aanpak
- [Stripe Connect Front-end — Stripe Blog](https://stripe.com/blog/connect-front-end-experience) — Stripe's animatie-filosofie
- [Rebuild Awwwards Landing Page — Olivier Larose](https://blog.olivierlarose.com/tutorials/awwwards-landing-page) — Next.js + Framer Motion + GSAP tutorial
- [SaaS Landing Design Linear Style — Natxo](https://natxo.dev/en/design/saas) — Linear-stijl implementatie
- [10 Best SaaS Website Designs 2026 — Azuro Digital](https://azurodigital.com/saas-website-examples/) — Recente SaaS voorbeelden

### Referentie-sites (direct bekijken!)
- [Linear.app](https://linear.app) — SaaS design benchmark, glassmorphism, micro-motion
- [Stripe.com](https://stripe.com) — Progressieve onthulling, gradient animations, 3D globe
- [Vercel.com](https://vercel.com) — Minimalistisch SaaS, Geist font, snelheid als brand
- [Notion.so](https://notion.so) — Product-led design, interactieve demo's
- [Padlet.com](https://padlet.com) — EdTech interactief, warm en speels
- [Huly.io](https://huly.io) — Motion-based storytelling, vibrant kleurshifts bij scroll
- [Raycast.com](https://raycast.com) — Gradient-on-dark hero, product screenshots als kunst
- [Ramp.com](https://ramp.com) — Product-led storytelling, geen stock foto's
- [Airtable.com](https://airtable.com) — Animaties die educeren, complexiteit visueel uitgelegd
- [Framer.com](https://framer.com) — Meta-demonstratie, staggered fade-ins, layout animations
- [LottieFiles Education](https://lottiefiles.com/education) — Lichtgewicht vectoranimaties

### Template Starting Points (voor rapid prototyping)

| Template | Platform | Best For |
|----------|----------|----------|
| [Suprema](https://framerbite.com/blog/40-best-saas-framer-templates) | Framer | AI SaaS first impression |
| [CoursePro](https://www.bryntaylor.co.uk/templates/education-framer) | Framer | Educatie-specifieke secties |
| [Linear Figma Kit](https://www.figma.com/community/file/1367670334751609522) | Figma (gratis) | Dark mode referentie |
| [Webflow Education](https://webflow.com/templates) | Webflow | Storytelling layout |

### Galerijen voor doorlopende inspiratie
- [Saaspo.com](https://saaspo.com) — Beste SaaS landing pages, filterbaar
- [Motion.dev/examples](https://motion.dev/examples) — 330+ Framer Motion code examples
- [Dribbble: AI Landing Pages](https://dribbble.com/tags/ai_landing_page) — 600+ AI designs
- [Behance: Education Landing Pages](https://www.behance.net/search/projects/education%20landing%20page) — Volledige case studies
- [Framer Gallery](https://www.framer.com/gallery/categories/landing-page) — Beste Framer-gebouwde sites

---

## Samenvatting: De 5 Belangrijkste Lessen

1. **Less is more** — Van 8+ secties naar 6. Van 6 features naar 3. Van 8 CTA's naar 3. Elke pixel moet er recht op hebben.

2. **Scroll = Storytelling** — De pagina moet één verhaal vertellen: probleem → oplossing → bewijs → actie. Gebruik sticky secties en scroll-triggered animaties om dit verhaal te vertellen.

3. **Show, don't tell** — In plaats van features te beschrijven, laat ze zien. Live previews, animated counters, interactieve demo's. Eén screenshot die tot leven komt zegt meer dan drie alinea's tekst.

4. **Ademruimte = Luxe** — Meer witruimte, grotere typografie, minder elementen per scherm. Dit communiceert kwaliteit en vertrouwen — exact wat scholen willen zien.

5. **Wow-factor zit in de details** — Geen overdreven 3D of WebGL nodig. Subtiele scroll-animaties, vloeiende gradiënten, staggered text reveals en een smooth scroll-ervaring zijn genoeg om memorabel te zijn.
