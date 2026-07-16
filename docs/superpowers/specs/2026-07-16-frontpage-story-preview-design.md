# DGSkills Frontpage Story Preview — Design Specification

**Status:** Approved for a first preview through the user's request to show the recommended result on a public Vercel URL.

**Date:** 2026-07-16

## Purpose

Redesign the public DGSkills front page around one coherent lesson story. The teacher is the protagonist; the student creation is the emotional proof; the dashboard and SLO evidence are the practical payoff. The preview must preserve the existing DGSkills logo, color palette, typography, public claims, and navigation destinations.

## Core idea

**Bouw het. Test het. Bewijs het.**

The visitor follows one school lesson from 09:00 to 09:45:

1. A teacher selects a ready-made mission.
2. Students start building immediately.
3. The visitor briefly becomes a student and programs a tiny game.
4. The game runs and produces a visible result.
5. The teacher view updates with skill and SLO evidence.
6. The school sees how this becomes a repeatable learning route.

The same mission card and lesson status language recur through the page so each section advances the story instead of restarting it.

## Audience and conversion

- **Primary protagonist:** VO/VSO teacher who needs an achievable lesson.
- **Secondary reassurance:** school leader and ICT/privacy reviewer.
- **Primary action:** plan a school pilot at `/pilot`.
- **Secondary action:** try the embedded mini mission.
- **Existing demo paths:** keep links to `/leerlingdemo` and `/docentdemo` where useful.

## Page structure

### 1. Header and hero — 08:55

- Keep the official `DuckMark` asset and DGSkills wordmark treatment.
- Headline: one lesson, from first click to visible evidence.
- Explain the product in one sentence: ready-made digital-literacy missions, live teacher overview, and SLO proof.
- Hero visual is a compact live lesson card that connects student activity to teacher overview.
- Primary pilot CTA and a scroll CTA to the mini mission.

### 2. Lesson story — 09:00 to 09:45

- Four chapters: choose, build, coach, prove.
- Desktop/tablet landscape use a sticky stage with chapter text and a transforming mission/status panel.
- Mobile and reduced-motion users receive the same content as a normal vertical sequence without long pinned scrolling.
- Motion always explains state change: selected mission, active students, teacher signal, saved proof.

### 3. Interactive mini mission

- Challenge: program Kees through a short game sequence.
- Visitor selects three commands in order and presses **Test mijn game**.
- Correct order animates the official duck mark through the scene and unlocks a teacher evidence receipt.
- Incorrect order gives specific, friendly feedback and preserves the selected program for correction.
- Controls work with mouse, touch, and keyboard. No drag-only interaction.
- State is local and deterministic: no account, database, personal data, AI endpoint, analytics payload, or persistence.

### 4. Student creation gallery

- Show real project/mission artwork already shipped by DGSkills.
- Examples include game programming, website building, deepfake detection, AI drawing, and digital storytelling.
- Cards reveal the concrete output and associated skill, not generic feature descriptions.

### 5. Teacher payoff

- Continue the same successful mini mission into a teacher dashboard receipt.
- Show: completed product, computational-thinking signal, SLO alignment, and who needs help.
- Copy emphasizes targeted help during the lesson rather than extra administration afterwards.

### 6. School proof and pilot CTA

- Compact proof strip for curriculum, portfolio, privacy review, and implementation.
- Preserve cautious claims already present in the public site; do not invent customer numbers, impact percentages, or certifications.
- Finish with a clear pilot CTA and the existing legal/ICT destinations.

## Visual direction

- Preserve tokens: `duck-bg`, `duck-bgLight`, `duck-ink`, `duck-acid`, `duck-gray`, and `duck-error`.
- Preserve typography: Outfit for interface/body and Fraunces for editorial display.
- Use generous editorial spacing, large type, rounded product surfaces, thin ink borders, and the existing soft shadow.
- Use actual repository assets for project visuals. Do not generate substitute logos or generic stock imagery.
- The acid color marks decisions, progress, and successful proof. Dark ink panels represent product/workspace moments.

## Motion direction

- Use the existing Framer Motion dependency for viewport reveals, shared state transitions, and the mini-game run.
- Prefer `transform` and `opacity`; avoid continuous layout animation and heavyweight 3D.
- Animate only after user intent or when a story chapter becomes active.
- Pause or eliminate non-essential motion when the section is offscreen.
- Honor `prefers-reduced-motion`; all information and interactions remain understandable without animation.
- No scroll-jacking. Sticky scenes release naturally and mobile uses regular document flow.

## Responsive behavior

- **Desktop:** two-column hero, sticky lesson stage, side-by-side mini mission and evidence panel.
- **Tablet landscape:** compressed two-column layouts and shorter sticky travel.
- **Tablet portrait:** stacked lesson text and stage, full-width controls, no clipped artwork.
- **Mobile:** one-column story, 44px minimum tap targets, horizontally scrollable gallery with visible next-card affordance, no pinned viewport trap.

## Accessibility and content safety

- Semantic header, navigation, main, sections, lists, buttons, and status regions.
- Visible keyboard focus, descriptive button names, and an `aria-live` result for game feedback.
- Decorative visuals are hidden from assistive technology; meaningful artwork has useful alternative text.
- Color is never the only success/error signal.
- No personal or student data is requested or displayed.

## Technical boundaries

- Implement as a new public-site story component and route `/` and `/scholen` to it on the preview branch.
- Keep the current `ScholenLanding.tsx` intact for easy comparison and rollback.
- Keep the mini-mission state reducer/logic independent from rendering and cover it with unit tests.
- Do not add dependencies, change Supabase, touch authentication, or modify production Vercel aliases.

## Acceptance criteria

- A visitor can understand the full lesson story without opening another page.
- A visitor can complete and retry the mini mission on desktop, tablet, or mobile.
- A successful run visibly connects student creation to teacher/SLO evidence.
- Existing logo, palette, fonts, pilot route, and public trust links are retained.
- Reduced-motion behavior preserves all content.
- `npm run doctor` and `npm run build:prod` pass.
- Browser checks pass at desktop, tablet portrait, tablet landscape, and mobile widths.
- Delivery is a Vercel preview URL only; production remains unchanged.
