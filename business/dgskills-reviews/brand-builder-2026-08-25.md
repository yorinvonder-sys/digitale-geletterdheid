# Rubric-review: brand-builder

Datum: 2026-08-25
TemplateType: builder-canvas

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

## Design — score 7/10

- De vier stappen (merkanalyse → kleurenpalet → logo-concept → huisstijl) volgen een logische opbouw, elk met heldere instructie, tip en checklist. Consistent met de builder-canvas-stijl.
- **Warning (geërfd van engine, hier concreet):** `StepInstructionPanel.tsx` en `ChecklistItem.tsx` gebruiken `/70`-opacity op tekst en placeholder; het invoerveld waar leerlingen hun merkbeschrijving, kleurenpalet en huisstijlgids intypen heeft hierdoor mogelijk onvoldoende contrast en een placeholder die niet te onderscheiden is van getypte tekst. Raakt alle vier stappen van deze missie.
- **Info:** `previewType: 'text-preview'` is een passende, sobere keuze voor een tekst-gebaseerde ontwerptaak — geen losstaande design-bevinding voor dit config-bestand.
- Geen missie-specifieke UI-bugs gevonden buiten de gedeelde engine.

## Didactiek — score 6.5/10

- Sterke opbouw: merkpersoonlijkheid → kleur → logo → stijlgids bouwt logisch op elkaar voort, en elke stap koppelt terug naar de eerder gekozen merkwoorden ("in relatie tot je merkwoorden", "hoe de stijl de merkwaarden weerspiegelt"). Dat is precies de vorm van cumulatieve reflectie die de missie beoogt.
- De reflectievraag over kleurcontrast (stap 2, bonusPoints 5) is inhoudelijk correct en legt een echte link naar WCAG-toegankelijkheid — goed voorbeeld van kennisoverdracht die verder gaat dan de opdracht zelf.
- **Warning (geërfd van engine, concreet voor deze missie):** de score is voor alle vier stappen presence-based (checklist + ≥40 tekens plausibele tekst). Een leerling die snel iets plausibels typt over "duurzame sneakers" en alle vinkjes aanvinkt, haalt de volle 95/100 stappunten zonder dat de kleurkeuzes, het logo-concept of de huisstijl inhoudelijk kloppen met de gekozen merkwoorden. Alleen de 5 bonuspunten van de reflectievraag toetsen echte kennis. Voor een missie die juist "coherentie tussen merkwoorden en ontwerpkeuzes" als leerdoel heeft (zie `missionGoals.ts`), is dit een reëel gat tussen wat de score meet en wat de missie beoogt te toetsen.
- SLO-koppeling is mager: alleen kerndoel 22A/19A. Past bij een ontwerp/mediawijsheid-achtige missie, maar is niet inhoudelijk geverifieerd tegen het volledige kerndoelenkader — buiten scope van deze pass.
- `missionGoals.ts`-entry (`min: 4` steps-complete) is consistent met de 4 configstappen — geen mismatch.

## Tech — score 7.5/10

- Config zelf is intern consistent: `maxScore: 100`, badges lopen van 0 tot 90, 4 stappen met elk 3-4 checklistItems, één reflectievraag met correcte `correctIndex` en `bonusPoints`.
- Alle bevindingen op techniek-niveau (dubbele `onComplete`-afvuring bij snel klikken, presence-based scoring, `showMilestone` die na page-reload blijft hangen, ontbrekende `role="status"` op de mijlpaal-toast) zitten in de **gedeelde engine** (`BuilderCanvas.tsx`, `CompletionScreen.tsx`, `MilestoneToast.tsx`) en zijn al beoordeeld — ze gelden voor brand-builder net als voor de andere 18 builder-canvas-configs, zonder missie-specifieke escalatie.
- `templateRegistry.ts`, `slo-kerndoelen-mapping.ts`, `curriculum.ts` en `missionGoals.ts` bevatten allemaal een coherente `brand-builder`-entry (geen ontbrekende of tegenstrijdige registratie gevonden).

## Voorstellen

Geen missie-specifieke autoFixable wijzigingen binnen de whitelist gevonden: de config, registry- en curriculum-entries zijn intern consistent. De belangrijkste knelpunten (contrast, presence-based scoring, dubbele-klik-guard) zitten in gedeelde bestanden (`StepInstructionPanel.tsx`, `ChecklistItem.tsx`, `BuilderCanvas.tsx`, `CompletionScreen.tsx`) buiten de whitelist voor dit missie-rapport en horen thuis in een engine-brede fix, niet in een brand-builder-specifieke patch.

## Samenvatting en verdict

brand-builder is een didactisch goed opgebouwde, coherente missie zonder eigen technische of ontwerpfouten buiten wat de gedeelde builder-canvas-engine al draagt. Het belangrijkste inhoudelijke risico is dat de score voor alle vier stappen vrijwel volledig presence-based is — een leerling kan met oppervlakkige, incoherente antwoorden bijna de volle punten halen, terwijl het expliciete leerdoel (coherentie tussen merkwoorden en ontwerpkeuzes) daardoor niet echt getoetst wordt. Dat is een engine-brede beperking, geen brand-builder-specifiek defect, en vereist geen missie-eigen herontwerp.

**Verdict: ok** (geen blocking bevindingen specifiek voor deze missie; de blocking dubbele-klik-bug zit in de gedeelde engine en is daar al geregistreerd).
