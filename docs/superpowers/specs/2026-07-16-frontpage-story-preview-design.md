# DGSkills Frontpage Story Preview — Design Specification

**Status:** Approved for a second preview. On 2026-07-17 the user approved the documentary classroom direction and explicitly requested stronger click-through interactivity plus Kees the duck as the page narrator.

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

## Approved second-preview refinement

The second preview keeps the lesson story but makes three improvements:

1. **Human proof:** original Image 2.0 classroom photographs show pupils building, testing, receiving coaching, and presenting work.
2. **A visible click route:** the visitor can choose a mission and click through briefing, building, and proof instead of only reading static product cards.
3. **Kees as narrator:** the official `DuckMark` becomes a recurring guide with short, useful speech bubbles that change with the current story or mission step.

The duck must not become a replacement logo or a visually unrelated generated mascot. The existing brand asset supplies the character; motion, poses made with transforms, and speech bubbles provide expression while preserving the identity.

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

### 3A. Guided assignment walkthrough

- Add an immediately visible mission explorer before the detailed mini-game.
- A visitor chooses from **Game Programmeur**, **Website Bouwer**, and **Deepfake Detector**.
- Each mission has four navigable stages: choose, briefing, build, and proof.
- Previous/next controls, clickable step labels, keyboard focus, and an announced current-step label make navigation explicit.
- Each mission uses authentic assignment copy and a small deterministic choice so the visitor does something rather than watching a carousel.
- The Game Programmeur build stage leads directly into the existing command mini-game; the other mission previews end with a concrete example output and linked skill.
- Changing mission resets only the walkthrough state and never changes routes or persists data.

### 3B. Kees the duck as narrator

- Show Kees at the hero, assignment walkthrough, and teacher payoff.
- Narration is one or two short sentences and always explains the visitor's current action or why it matters.
- Animate Kees only on entry or step change with small translate/rotate/scale transforms.
- Speech bubbles never overlap headings, controls, or photos and collapse into the normal document flow on mobile.
- Respect reduced motion and keep all narration available without animation.

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
- Generate three original photorealistic classroom images with Image 2.0 in one consistent documentary/editorial style: pupils coding together, a teacher coaching a pupil group, and pupils presenting a finished digital project.
- Classroom images depict a contemporary Dutch secondary-school setting, diverse pupils aged roughly 13–16 in ordinary clothing, natural daylight, believable desks and devices, and candid rather than posed behavior.
- Laptop screens may use DGSkills' acid-lime, charcoal, off-white, and red visual language but must not contain generated readable words, fake logos, or gibberish UI copy. Exact labels remain real HTML layered outside the image.
- Save final images as optimized project assets under `public/assets/story/` and provide descriptive Dutch alternative text.
- The acid color marks decisions, progress, and successful proof. Dark ink panels represent product/workspace moments.

## Visual polish correction

- Remove the absolute hero highlight strip that intersects glyphs and replace it with a non-overlapping underline/accent treatment.
- Relax display line-height and negative letter-spacing at mobile and tablet widths; large headings may become tighter only at wide desktop widths.
- Constrain heading measures so line breaks remain intentional and words never collide with decorative elements.
- Keep connector lines inside their own layout columns. They may connect numbered steps but never pass behind text.
- Avoid five equally narrow desktop project cards; use a wider responsive grid or featured-card composition so titles and labels have stable measures.
- Validate no horizontal overflow, clipped speech bubbles, crossed text, or orphaned single-word heading lines at 390, 820, 1180, and 1440 CSS pixels.

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
- A visitor can select each of the three assignment previews, move forwards and backwards through its stages, and understand which stage is active.
- Kees narrates the hero, assignment walkthrough, and teacher payoff without obscuring content.
- Three consistent Image 2.0 classroom images show pupils actively using or discussing digital work.
- No decorative line crosses text and display headings remain readable at 390, 820, 1180, and 1440 CSS pixels.
- A successful run visibly connects student creation to teacher/SLO evidence.
- Existing logo, palette, fonts, pilot route, and public trust links are retained.
- Reduced-motion behavior preserves all content.
- `npm run doctor` and `npm run build:prod` pass.
- Browser checks pass at desktop, tablet portrait, tablet landscape, and mobile widths.
- Delivery is a Vercel preview URL only; production remains unchanged.
