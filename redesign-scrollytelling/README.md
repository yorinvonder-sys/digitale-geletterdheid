# DGSkills — Scrollytelling homepage (concept)

Een alternatieve versie van de dgskills.app-landingspagina als **scrollytelling-verhaal**:
Proloog → 1. Het probleem → 2. De ontmoeting → 3. Mila (leerling) → 4. De docent → 5. Het bewijs → Epiloog.

> Deze map is volledig self-contained. Er is **niets aan de bestaande app gewijzigd** —
> dit staat op de branch `kimi/scrollytelling-redesign` als concept naast de huidige site.

## Stack

React 19 + TypeScript + Vite + Tailwind CSS 3 + Framer Motion (+ shadcn/ui accordion).

## Lokaal draaien

```bash
cd redesign-scrollytelling
npm install
npm run dev      # http://localhost:3000
npm run build    # productie-build naar dist/
```

## Structuur

- `src/App.tsx` — compositie + nav + scroll-progress
- `src/components/brand.tsx` — merk-elementen: Eyes (volgen cursor), Duck, Marquee, BrowserFrame, Reveal, ChapterMarker
- `src/components/ChapterRail.tsx` — hoofdstuk-navigatie links + voortgangsbalk
- `src/sections/` — de zeven hoofdstukken:
  - `Hero.tsx` — Proloog met parallax-props
  - `Problem.tsx` — gepinde chaos-scène (maandag 8:07 → 8:58), eindigt op 'Deze keer werkt 'ie'
  - `Meet.tsx` — missiebibliotheek, 4 beloftes, tellende stats
  - `StudentJourney.tsx` — 5 beats (Ontdek/Leer/Maak/Bewijs/Groei) met per beat een eigen visual
  - `Teacher.tsx` — docentdashboard + spreadsheet die met pensioen gaat
  - `Proof.tsx` — SLO-domeinen 21/22/23, schoolleiding, ICT & privacy, FAQ
  - `Finale.tsx` — epiloog-CTA met eend + footer

## Design-tokens

Papier `#f4f0e6`, inkt `#17140e`, lime `#d7f70c` / `#b8dd00`.
Display-font: Fraunces, body: Space Grotesk (Google Fonts, non-blocking in `index.html`).

## Content

Alle feitelijke claims (20+ missies, 24 projecten, 9 SLO-kerndoelen, 10 werkdagen,
pilotrapport na 6 weken, DPIA/verwerkersovereenkomst, SLO-domeinen 21A–23C,
KvK 81819889) zijn overgenomen van de huidige dgskills.app.
