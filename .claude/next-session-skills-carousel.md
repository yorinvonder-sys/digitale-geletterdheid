# Handoff: Skills-sectie carousel — visuele bevindingen fixen

## Context
De DGSkills homepage (`src/features/public-site/ScholenLanding.tsx`) heeft een
horizontale skills-carousel (`SkillsSection`, regels 1023–1093). Op mobile/tablet
werkt dit via `overflow-x-auto` + CSS snap; op desktop (lg+) via een GSAP
ScrollTrigger die de track pinned en horizontaal translate.

Er zijn 6 screenshots genomen van de live site op `localhost:5173`:

```
/Users/yorinvonder/Downloads/ai-lab---future-architect/.claude/worktrees/priceless-lewin-b11f6d/
  skills-1280-900.png          ← 1280×900 desktop viewport
  skills-section.png           ← crop van de sectie, Design & Create actief
  skills-cards-full.png        ← full breedte, Design & Create actief
  skills-cards-bottom-visible.png ← idem, bottom visible
  skills-section-bottom.png    ← scroll verder, Code & Bouw in beeld
  skills-fullpage.png          ← volledige pagina-view
```

## Bevindingen uit de screenshots

### B1 — Eerste kaart zit te dicht bij de linkerrand (desktop, 1280px)
Op `skills-1280-900.png` is de eerste kaart ("AI & Data") gedeeltelijk afgesneden
aan de linkerrand — er is geen zichtbare padding/marge links van de kaart.
De tekst "AI & Data" is afgesneden tot "& Data". Het icoon staat half buiten het
canvas. De andere screenshots tonen de tweede kaart (Design & Create) al gecentreerd.

**Relevante code** (`ScholenLanding.tsx:1039-1040`):
```tsx
<div className="mt-10 overflow-x-auto pb-8 [scrollbar-width:none] ... lg:overflow-visible">
    <div data-skills-track className="flex w-max snap-x snap-mandatory gap-5 px-5 md:px-10 lg:snap-none lg:will-change-transform">
```

De GSAP ScrollTrigger berekent (`regel 843`):
```js
const getAmount = () => Math.max(0, track.scrollWidth - window.innerWidth);
```
Dit houdt géén rekening met de `px-10` (40px) leading padding aan de linkerrand.
De track wordt daardoor iets te ver naar links geschoven: de eerste kaart verdwijnt
achter de viewport-rand vóórdat de scroll helemaal klaar is.

**Fix-richting:** voeg `window.innerWidth` compensatie toe voor de padding, óf zorg
dat `getAmount` subtraheert met de padding:
```js
const padStart = 40; // md:px-10 = 2.5rem = 40px
const getAmount = () => Math.max(0, track.scrollWidth - window.innerWidth - padStart);
```
Of: gebruik `track.getBoundingClientRect().left` als startoffset.

### B2 — Geen scroll-indicator (alle viewports)
Er zijn geen visuele pijlen of "swipe"-hints om aan te geven dat er meer kaarten zijn
naast de half-zichtbare kaarten aan de randen. Op mobile is het peek-effect de enige
hint; op desktop is er helemaal geen indicator.

**Fix-richting:** voeg pijl-knoppen toe of een dot-indicator onder de carousel, of
maak de peek-effect explicieter (iets meer van de volgende kaart tonen).

### B3 — Cookie-banner bedekt kaart 3 (cosmetic)
In twee screenshots bedekt de cookie-banner (`z-50` fixed) de rechterkaarten.
Dit is verwacht gedrag, maar de z-index is correct.

## Taak voor deze sessie

1. **Lees de screenshots** (zie paden hierboven) om de bevindingen visueel te bevestigen.
2. **Lees de component** (`ScholenLanding.tsx` rond regel 1023–1093) en de GSAP-sectie
   (regel 840–857) om de exacte oorzaak van B1 te begrijpen.
3. **Fix B1** — de leading-padding compensatie in de GSAP `getAmount()` functie.
4. **Beslis over B2** — vraag Yorin of hij een scroll-indicator wil of dat het peek-effect
   voldoende is; implementeer pas na goedkeuring.
5. **Verificeer op localhost:5173** via een Sonnet-subagent screenshot op 1280px viewport
   dat de eerste kaart volledig zichtbaar is aan de start van de skills-sectie.

## Volgorde van uitvoering
1. Read screenshots → bevestig B1 visueel
2. Read ScholenLanding.tsx:840-860 + 1039-1092
3. Fix GSAP getAmount() compensatie
4. Verificatie via Sonnet-subagent screenshot (ALTIJD via subagent, nooit hoofdloop)
5. Commit op branch `main` of een nieuwe fix-branch

## Branch & bestanden
- Hoofdbestand: `src/features/public-site/ScholenLanding.tsx`
- Actieve branch: `main` (de homepage-code staat op main)
- Screenshots: in worktree `priceless-lewin-b11f6d` (alleen voor referentie, geen code)

## Reminder
- Gebruik ALTIJD localhost:5173 (nooit andere poorten)
- Screenshots ALTIJD via Sonnet-subagent, nooit in de hoofdloop
- Scope: alleen de skills-carousel — geen andere secties aanraken
