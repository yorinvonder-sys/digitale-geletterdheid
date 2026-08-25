# Missie-review: website-bouwer

**Datum:** 2026-08-25
**templateType:** builder-canvas

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

## Design — score 7/10

De config levert alleen content aan de gedeelde `BuilderCanvas`-engine; er zit geen eigen JSX/CSS in deze missie. De reeds beoordeelde engine-bevindingen zijn dus het volledige design-oppervlak van deze missie, met twee die concreet hier spelen:

- **warning** — `src/features/missions/templates/builder-canvas/sub/StepInstructionPanel.tsx:157` en `ChecklistItem.tsx:31`: het contrastprobleem (`text-duck-ink/70` op zowel getypte tekst als placeholder, en op afgevinkte/niet-afgevinkte checklist-labels) raakt alle vier stappen van website-bouwer, inclusief de langste vrije-tekststap (reflectie, 3-5 zinnen).
- **info** — `MilestoneToast.tsx` mist `aria-live`; raakt alle 4 mijlpalen van deze missie gelijk.
- Copy-lengte: instructies liggen tussen ~35-55 woorden per stap, passend bij leerjaar 1. Geen eigen design-afwijkingen gevonden t.o.v. de baseline builder-canvas-missies.

Geen missie-specifieke nieuwe designbevindingen buiten wat de engine al blootlegt.

## Didactiek — score 6.5/10

- **SLO-codes**: `22B` (Programmeren) en `22A` (Digitale producten) in `slo-kerndoelen-mapping.ts:55`, VSO `19A`. Twee codes is prima; de fit is grotendeels overtuigend — leerlingen schrijven zelf HTML/CSS-code (22B) en bouwen een werkend digitaal product (22A).
- ⚠️ **Curriculumplek vroeg**: `curriculum.ts:90` plaatst website-bouwer in leerjaar 1, week 2 — de tweede week van de brugklas. HTML-syntax (tags, attributen, `<style>`-blokken met CSS-selectors) is voor veel leerlingen de eerste kennismaking met "echte" code-syntax. Dat kán didactisch bewust zijn (vroege motivatie via zichtbaar resultaat), maar is wel een instap met een steilere leercurve dan gemiddeld voor week 2.
- ⚠️ **Tekstinconsistentie tussen bronnen**: `missionGoals.ts:151` zegt "Ik bouw een werkende **Over Mij**-webpagina", de config zelf (`website-bouwer.ts:8`) zegt "Ik bouw een werkende **fictieve** Over Mij-webpagina". Klein verschil, maar `missionGoals.ts` mist het woord "fictieve" dat in de instructies van elke stap wél consequent wordt gehandhaafd (geen echte naam/adres/school/foto). Voor een leerling die alleen het primaire doel op het dashboard leest is dat een gemiste herhaling van de veiligheidsafspraak.
- ✅ **Leerdoel-heldere opbouw**: vier stappen volgen een logische leerlijn (structuur → stijl → inhoud → reflectie), en de reflectiestap (Bloom: begrijpen/evalueren) voorkomt dat de missie bij pure toepassing blijft steken.
- ✅ **AI-as-copilot**: `enableChat: true` met `chatRoleId: 'website-bouwer'`, systeeminstructie server-side (buiten scope van deze review, bekende valkuil).
- Engine-bevinding "scoring is presence-based" (checklist + 40 tekens tekst) raakt de didactische validiteit direct: een leerling kan bij elke stap alle vinkjes aanzetten en generieke tekst typen ("Ik heb een style-blok toegevoegd") zonder dat de HTML/CSS-syntax zelf ooit gecontroleerd wordt. Voor een programmeer-missie is dat een reëel gat — de opdracht *vraagt* om code (`<!DOCTYPE html>`, `font-size: 18px`), maar niets in de engine valideert of die code daadwerkelijk correct is.

## Tech — score 7/10 (10 = beste)

Volledig template-based, geen eigen handlers of state buiten de config. Relevante engine-bevindingen die deze missie raken:

- **blocking** (van engine, geldt hier onverkort): dubbele-klik-afronding via `CompletionScreen.tsx:163` — website-bouwer heeft `maxScore: 100` en normale badge-drempels; een dubbele voltooiing zou dubbele XP opleveren zoals bij elke builder-canvas-missie.
- **warning** (van engine): `showMilestone`-persistentie-bug — bij website-bouwer met 4 stappen kan de leerling na elke stap de vastgeplakte toast tegenkomen bij snel herladen.
- Config-niveau: `textPrompt`-velden en `checklistItems` zijn consistent gestructureerd, `id`'s zijn uniek per stap, geen dode verwijzingen naar niet-bestaande badge- of stap-ID's gevonden. `maxScore: 100` klopt met de badge-drempels (0/25/50/70/90).
- Geen missie-specifieke technische fouten in de config zelf.

## Voorstellen

### 1. Tekstconsistentie primaryGoal (missionGoals.ts, whitelisted)

```ts
// voor — src/config/missionGoals.ts:151
'website-bouwer': {
    primaryGoal: 'Ik bouw een werkende Over Mij-webpagina met HTML, CSS en een korte uitleg van mijn keuzes.',

// na
'website-bouwer': {
    primaryGoal: 'Ik bouw een werkende fictieve Over Mij-webpagina met HTML, CSS en een korte uitleg van mijn keuzes.',
```

Trekt de dashboard-samenvatting gelijk met de config (`website-bouwer.ts:8`) en de per-stap instructies, die allemaal consequent "fictief"/"geen echte naam" benadrukken.

### 2. Overige bevindingen (geen mechanische config-fix mogelijk)

- Curriculumplek leerjaar 1 / week 2: geen code-fix — is een didactische afweging voor Yorin (vroege motivatie vs. steile leercurve). Genoteerd, niet auto-fixed.
- Presence-based scoring zonder syntax-validatie: zit in de gedeelde `BuilderCanvas`-engine, niet in deze config — buiten de whitelist van deze missie-review, engine is al beoordeeld.
- Contrast (`/70`-tokens) en `aria-live` op de toast: gedeelde engine-bestanden, buiten de whitelist van deze review.
- Dubbele-klik-afronding: gedeelde `CompletionScreen.tsx`, buiten de whitelist.

## Samenvatting en verdict

Website-bouwer is een goed gestructureerde, template-conforme HTML/CSS-instapmissie met een logische leerlijn en een aanwezige reflectiestap. De belangrijkste risico's zitten in de gedeelde builder-canvas-engine (dubbele-klik-afronding, presence-based scoring zonder syntax-check, contrast, toast-persistentie) en zijn al als engine-brede bevindingen vastgelegd — ze worden niet opnieuw per missie opgelost. Missie-specifiek is er één kleine tekstinconsistentie (fictieve vs. niet-fictieve formulering tussen `missionGoals.ts` en de config) en een aandachtspunt over de vroege curriculumplek voor een eerste code-syntax-missie.

**Verdict: fix-eerst** — geen blokkerende missie-specifieke fouten, maar de engine-brede blocking (dubbele-klik) en de presence-based scoring maken deze missie afhankelijk van een engine-fix die in de sweep elders wordt opgepakt.
