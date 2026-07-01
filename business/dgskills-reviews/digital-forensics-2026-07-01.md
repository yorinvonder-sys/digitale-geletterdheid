# Fix-pass: digital-forensics (cyclus 1)

**Datum:** 2026-07-01
**Fixer:** Sonnet (M4 batch-review, wave 6, fix-inhaalslag)
**Bron-rapport:** `business/dgskills-reviews/digital-forensics-2026-06-17.md`
**Type:** Fix-pass op het rapport van 2026-06-17 — dit is géén nieuwe review, maar een gerichte toepassing van de resterende auto-fixbare voorstellen uit dat rapport, ~2 weken later.

**Context:** 1 van de 3 auto-fixbare voorstellen uit het bronrapport was al eerder toegepast (`missionGoal` in `missionGoals.ts` bestaat inmiddels — zie ⏭️ hieronder). Deze pass verifieert elk voorstel opnieuw tegen de huidige source vóór toepassing (stale-check).

---

## ✅ Toegepaste fixes (1)

- `src/features/missions/templates/scenario-engine/configs/digital-forensics.ts:177` — timestamp-inconsistentie ronde 2 rechtgetrokken: `'22:54:17 en 22:54:19 | LOGIN FAILED | user: dr_bakker...'` → `'22:54:10–22:54:19 | LOGIN FAILED (×5) | user: dr_bakker...'`, nu consistent met de brute-force-reeks uit ronde 1 (5 pogingen vanaf 22:54:10). (sectie: didactiek)

## ⏭️ Geskipte voorstellen (2)

- `src/config/missionGoals.ts` — **al-opgelost:** de entry voor `digital-forensics` bestaat al (regels 309–316: `primaryGoal: 'Ik analyseer logbestanden en trek een onderbouwde conclusie over wat er is gebeurd.'`, `criteria.type: 'rounds-complete'`). Dit is het voorstel dat in een eerdere fix-pass al is toegepast (`missionGoals.ts` is sinds PR #186 flink uitgebreid). Geen actie nodig.
- `src/features/missions/templates/scenario-engine/ScenarioEngine.tsx:219` — **scope-violation:** het voorstel "silent null return → `<ErrorScreen />`" raakt `ScenarioEngine.tsx`, dat niet in de whitelist staat (whitelist bevat alleen `configs/digital-forensics.ts` en de losse config-entries). Dit is gedeelde engine-code die alle scenario-engine-missies raakt — buiten missie-specifieke scope.

## ⚠️ Escalatie nodig (3)

- **Badge-color hardcoded hex (`#202023`), 4×** — `src/features/missions/templates/scenario-engine/configs/digital-forensics.ts:22,28,34,40`. Het rapport markeert dit zelf al als niet-auto-fixbaar: de `color`-prop wordt verwerkt door `src/features/missions/templates/shared/CompletionScreen.tsx` (bevestigd: gedeelde template-code, buiten whitelist). Een swap naar een CSS-variabele of duck-token vereist eerst vastleggen hoe `CompletionScreen` (en mogelijk `SimpleChart`) de `color`-prop consumeert — dat is een wijziging aan gedeelde engine-code, geen missie-specifieke config-wijziging. Blijft escalatie, ongewijzigd sinds het bronrapport.
- **`lab-coral`/`lab-teal` in agent-visualPreview** — `src/config/agents/year3.tsx:961` (binnen de `digital-forensics`-rol-entry, regel 948). Nog steeds `from-lab-coral to-lab-teal` — ongewijzigd sinds 17 juni. **Extra bevinding tijdens verificatie:** het rapport-voorstel `from-duck-teal to-duck-acid` introduceert een **niet-bestaand token** — `duck-teal` staat niet in `tailwind.shared.js` (de duck-groep bevat uitsluitend `bg`/`bgLight`/`ink`/`acid`/`gray`/`error`). Dit voorstel is dus niet direct toepasbaar zoals geschreven; een correcte duck-token-mapping voor dit gradient moet eerst worden vastgesteld voordat dit fixbaar is. Blijft escalatie.
- **SLO 21C buiten `sloFocus` van J3-P2** — `src/config/slo-kerndoelen-mapping.ts:169` claimt `sloKerndoelen: ['23A', '21C']`; `src/config/curriculum.ts:268` definieert `sloFocus: ['23A', '21A']` voor Cybersecurity & Privacy (J3-P2). Beide waarden zijn **ongewijzigd** sinds het bronrapport — de mismatch bestaat nog. Dit is een curriculum-/mappingbeslissing (keuze a: mapping aanpassen naar `21A`, of keuze b: `21C` toevoegen aan de periode-sloFocus) met impact op teacher-dashboard-rapportage. Vereist expliciete beslissing van Yorin — niet zelf de mapping of curriculum gewijzigd, conform instructie.

## Triage-correctie (overgenomen uit bronrapport, geen actie)

- STEP_COMPLETE is aanwezig in de systemInstruction van de `digital-forensics`-agentrol — de oorspronkelijke triage-vlag was onterecht. Bevestigd, geen wijziging nodig.

## Volgende stap

Eén fix toegepast (timestamp-consistentie). De drie escalaties (badge-color, lab→duck gradient, SLO 21C) vereisen alle een expliciete beslissing van Yorin voordat ze autonoom fixbaar zijn — dit zijn geen scope-uitbreidingen die de fixer zelf kan oplossen. Aanbeveling: bundel de drie escalaties in één beslismoment (Yorin), aangezien twee ervan (badge-color, lab→duck) allebei wachten op een concreet, gevalideerd duck-token-besluit voor de scenario-engine.
