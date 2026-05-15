# DGSkills Homepage Redesign

## Richting

De homepage voelt als een digitale skill journey voor leerlingen: warm, speels, projectgericht en duidelijk genoeg voor scholen. De visuele taal is gebaseerd op echte DGSkills-schermen, organische vormen, handgetekende accenten en compacte gamification-kaarten.

## Kleurpalet

| Token | Hex | Gebruik |
| --- | --- | --- |
| `cream` | `#FCF6EA` | Basisachtergrond |
| `paper` | `#FFFDF7` | Kaarten en witte secties |
| `creamDeep` | `#F3E4CB` | Warme golvende projectsectie |
| `ink` | `#08283B` | Headlines, primaire tekst |
| `muted` | `#445865` | Bodytekst |
| `olive` | `#99984D` | Skill-highlight en organische accenten |
| `gold` | `#D7C95F` | Primaire CTA |
| `sage` | `#5F947D` | Groei, learning, schoolvertrouwen |
| `coral` | `#D97848` | Creatie, projecttags, energie |
| `teal` | `#0B453F` | Donkere footer en secundaire CTA |
| `line` | `#E7D8BD` | Borders en subtiele scheiding |

## Typografie

- Gebruik `Outfit` voor alle interface- en marketingtekst.
- Headlines zijn zwaar, compact en afgerond: `font-black`, `text-balance`, ruime line-heightcontrole.
- Bodytekst blijft kort, actief en leerlinggericht, met schoolargumenten alleen waar ze koopbeslissingen ondersteunen.

## Logo

- Gebruik de bever/otter-mascotte als merkbasis: speels en herkenbaar voor 12-16 jaar, maar niet kinderachtig.
- Bronassets: `public/assets/brand/dgskills-beaver-laptop.webp` voor de gekozen compacte dashboardmark en `public/brand-redesign/otter/dgskills-beaver-phone-favicon-512.png` voor favicon/app-icon varianten.
- Productie-assets: `public/assets/brand/dgskills-beaver-laptop.webp` voor compacte dashboardmark en `public/logo-lockup.svg` voor de homepage-header.
- Het compacte logo moet op 32px en 48px leesbaar blijven: groot silhouet, duidelijke kop/laptop, geen extra woordmerkfragmenten.
- De lockup gebruikt de bever/otter-mark plus `DGSkills` met `ink` voor `DG` en teal voor `Skills`.
- Het logo moet werken op de cream navbar en later ook als basis voor donkere footer/app-icon toepassingen.

## Sectieopbouw

1. Hero: leerlingbelofte, twee CTA's, productbrowser met echte missiekaarten, floating cards voor challenge, streak en level.
2. Cinematic skill journey: pinned scroll-story met vijf hoofdstukken van ontdekken tot delen.
3. Skills: vijf compacte skillkaarten met icon, checkmarks en projectaantal.
4. Projecten: vier voorbeeldprojecten met echte DGSkills-screenshots, tag, maker en engagement-signalen.
5. Portfolio: voorbeeldprofiel, badges en portfolio-preview.
6. Voor scholen: bestaande propositie samengevat met SLO, privacy, onboarding en implementatie.
7. Footer CTA: donkere band met duidelijke startknop.

## Componentregels

- Gebruik organische vormen alleen op grote visuele assets en sectie-overgangen.
- Sectie-overgangen moeten overlappen of vloeiend in elkaar doorlopen; vermijd harde rechthoekige knippen, zichtbare dubbele golfstrepen en grote lege fade-zones tussen hero en journey.
- Kaarten hebben afgeronde hoeken, maar geen nested cards behalve portfolio/badge-compositie.
- Doodles zijn decoratief en krijgen `aria-hidden`.
- Icon-only buttons krijgen een `aria-label`.
- Alle interactieve doelen hebben minimaal 44px hoogte.
- Scroll-motion gebruikt GSAP ScrollTrigger als premium animatielaag, dynamisch geladen op de homepage.
- De motion-regie is: DGSkills als scrollbare digitale vaardigheidsreis, niet losse decoratieve fades.
- Scroll-motion gebruikt alleen `opacity` en `transform`; geen scrolljacking, geen layout-animaties en geen grote blur/filter-effecten.
- Pinned scenes blijven native-scroll vriendelijk: geen Lenis/smooth-scroll override, anchorlinks blijven werken.
- Respecteer `prefers-reduced-motion`: content blijft direct zichtbaar en parallax/reveal-effecten worden uitgeschakeld.

## Beeldstijl

De homepage gebruikt echte DGSkills-productbeelden als bron. Geen generieke AI-lifestylebeelden of fictieve schermen als primaire mockup.

Primaire screenshotbronnen:

- `public/screenshots/new-mission-cards.png`
- `public/screenshots/new-dashboard-missions.png`
- `public/screenshots/prompt-master.webp`
- `public/screenshots/mission-game-programmeur.webp`
- `public/screenshots/ai-trainer.webp`
- `public/screenshots/student-progress-xp.webp`
- `public/screenshots/student-dashboard.webp`

Regels:

- Zet screenshots in browser-, kaart- of deviceframes met CSS.
- Gebruik echte missienamen en echte UI-fragmenten uit het platform.
- Voeg labels, projecttags en CTA's in HTML/CSS toe, niet in gegenereerde rasterbeelden.
- Gebruik geen AI-gegenereerde beelden als homepage-asset; productmockups worden opgebouwd uit echte screenshots en CSS-frames.

## Contentregels

- Gebruik bestaande DGSkills-inhoud: AI-missies, projecten, badges, portfolio, SLO-kerndoelen, privacy-first en gratis pilot.
- Neem geen onverifieerbare claims uit de referentie over.
- Projectkaarten zijn voorbeeldprojecten, geen echte leerlingstatistieken.
- Schoolclaims blijven concreet en voorzichtig: `20+ AI-missies`, `9 SLO-kerndoelen`, `10 werkdagen tot live`, gratis pilot.
