# Missie-review: AI Bias Detective

**Datum:** 2026-08-25 · **templateType:** scenario-engine · **Missie-ID:** `ai-bias-detective`

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## Design — 7.5/10

**Geslaagd**
- Content is uitsluitend config-gedreven (`ai-bias-detective.ts`); geen inline styling-afwijkingen t.o.v. andere scenario-engine-missies.
- Vier rondes met consistente structuur (`select-correct`, `order-priority`, `binary-choice`, `select-correct`), elk 25 punten — visueel en qua ritme in lijn met de template-baseline.
- Emoji-iconen per item zijn functioneel gevarieerd, geen herhaling die de betekenis vertroebelt.

**Aandachtspunten**
- ⚠️ **Visual Precision Gate: unverified.** Geen Chrome-plugin-bewijs beschikbaar in deze pass (rubric-only review, geen live playthrough uitgevoerd). Dynamische claims over alignment/overlap/text-fit kunnen hierdoor niet bevestigd worden — behandel dit gat expliciet in een aparte live-check (`opdracht-live-check`), niet als "geslaagd" veronderstellen.
- ⚠️ Engine-breed (niet missie-specifiek): geen focusbeheer bij rondewisseling (`ScenarioEngine.tsx:289`) — raakt deze missie net zo hard als de andere 11, want alle 4 rondes wisselen via `handleNextRound`.
- ⚠️ Engine-breed: contrast onder WCAG AA op gedeelde tekststijlen (`text-duck-ink/50`, `text-duck-ink/60`, `bg-duck-error text-white`) — deze missie gebruikt `SelectCorrectRound`/`OrderPriorityRound`/`BinaryChoiceRound`, die de betrokken gedeelde stijlen erven.

---

## Didactiek — 8/10

**SLO-koppeling:** `21D` (AI), `23C` (Maatschappij) — regulier; `18C`, `20B` — VSO. Beide codes zijn geldig en de fit is sterk: de missie laat leerlingen bias herkennen (21D: AI), inschatten wat de maatschappelijke impact is (23C), en oplossingen beoordelen op werkzaamheid — precies het soort kritisch-AI-denken dat 21D/23C beogen. Geen overclaim, geen misalignment.

**Leerdoel:** `missionGoals.ts:413` — "Ik herken AI-bias in systemen, schat het risico in en kies maatregelen die bijdragen aan eerlijkere AI." Helder, meetbaar via de drie rondetypen (herkennen → rangschikken → beoordelen), goed uitgelijnd met de vier rondes.

**Bloom-balans:** sterk. Ronde 1 (herkennen/select-correct) = onthouden/begrijpen; ronde 2 (rangschikken naar risico) = analyseren; ronde 3 (eerlijk-of-scheef) = analyseren/evalueren; ronde 4 (welke oplossingen werken echt) = evalueren. Geen missie die op louter feitjes-onthouden blijft hangen.

**Leeftijd-passendheid (leerjaar 2, ca. 13-14 jaar):** content refereert aan echte, gedocumenteerde casussen (Amazon-CV-filter 2018, Joy Buolamwini gezichtsherkenning, Obermeyer et al. 2019 zorgalgoritme, COMPAS) met correcte, beknopte bronvermelding in de uitleg — voegt geloofwaardigheid toe zonder een leerjaar-2-leerling te overvragen.

**Aandachtspunt**
- ⚠️ **Voltooiingsdrempel-risico (engine-finding, raakt deze missie concreet).** `missionGoals.ts:415` zet `threshold: 60`, terwijl `CompletionScreen` de voltooi-knop al vanaf 40% actief toont (zie gedeeld engine-rapport, bevinding "Stille voltooiing-mismatch"). Een leerling die 40-59 van de 100 punten haalt in AI Bias Detective klikt op een knop die "Missie voltooid!" belooft, maar de host registreert geen voltooiing/XP en wist de run. Dit is een engine-bug maar heeft hier een concrete, didactisch relevante impact: een leerling die drie van de vier rondes redelijk goed doet (bv. 50-55 punten) verliest zijn hele poging zonder duidelijke reden.
- ℹ️ De volgorde-ronde ("Meest risicovolle AI-toepassing eerst") heeft geen gokcorrectie in de scoreformule (engine-breed, `scoreOrderPriority`); bij 5 items levert lukraak klikken gemiddeld 9/25 punten op. Voor déze missie is dat op zichzelf geen didactisch lek — de opdracht test wél echt risico-inschatting — maar in combinatie met de 40%-drempel-mismatch hierboven vergroot het de kans dat een leerling zonder inhoudelijk begrip toch de (misleidende) "voltooid"-knop ziet oplichten.

---

## Tech — 8/10 (static only)

**Static A1-A4 (config-niveau)**
- Config is puur declaratieve data (geen handlers, geen `any`, geen relatieve imports) — niets te falen op A1/A3/A4 op configniveau; dat ligt bij de gedeelde engine.
- `templateRegistry.ts:18` correct geregistreerd als `scenario-engine`, geen dubbele of ontbrekende entry.
- `missionGoals.ts:412-420`, `slo-kerndoelen-mapping.ts:109`, `curriculum.ts:175` — alle vier de bronnen consistent op `ai-bias-detective` als sleutel; geen ID-drift.

**Aandachtspunten — overgeërfd van de gedeelde engine (geen missie-specifieke code-fout, maar wel concreet van toepassing)**
- ❌ **Blocking (engine, geraakt deze missie):** onder 40% score is het eindscherm een doodlopende weg — geen `onRetry`, geen `onBack`, `phase: 'results'` wordt opgeslagen en blokkeert de missie permanent bij hernieuwd bezoek.
- ❌ **Blocking (engine, geraakt deze missie concreet, zie Didactiek):** 40-59 score triggert een misleidende "voltooid"-knop die de run zonder registratie wist.
- Beide zijn generieke engine-defecten (`ScenarioEngine.tsx`) en horen thuis in de engine-fix, niet in een missie-specifieke config-wijziging — vandaar geen autoFixable-voorstel hieronder voor deze twee.

**Dynamic (browser/console/network):** niet uitgevoerd in deze rubric-only pass — aanbevolen als vervolgstap via `opdracht-live-check` vóórdat de missie als "ship" wordt bevestigd, mede omdat de 40-59%-score-val alleen live reproduceerbaar is.

---

## Voorstellen

Geen van de gevonden problemen valt binnen de whitelist voor mechanische auto-fix op missie-config-niveau: de twee blocking-issues zitten in de gedeelde `ScenarioEngine.tsx`/`CompletionScreen.tsx` (niet toegestaan te wijzigen vanuit een missie-review), en de resterende missie-eigen bevindingen zijn kwalitatief (Visual Precision Gate onbewezen) in plaats van een concrete voor/na-code-snippet.

Er is één indirecte mitigatie die wél binnen de whitelist valt en het risico voor déze missie verkleint zonder de engine aan te raken — het optrekken van de score-drempel zodat de 40-59%-val zich hier niet voordoet:

**Voor** (`src/config/missionGoals.ts:412-420`):
```ts
'ai-bias-detective': {
    primaryGoal: 'Ik herken AI-bias in systemen, schat het risico in en kies maatregelen die bijdragen aan eerlijkere AI.',
    criteria: {
        type: 'score-threshold',
        threshold: 60,
        description: 'Je identificeert bias-situaties, rangschikt risico\'s en beoordeelt oplossingen.',
    },
    evidence: '...',
},
```

**Niet toegepast in deze pass** — dit raakt de score-drempel die de leerling ziet en is een productbeslissing (hoeveel moet een leerling minimaal kennen om te slagen), geen mechanische fix. Voorgesteld ter overweging aan Yorin, niet automatisch doorgevoerd; de eigenlijke oplossing hoort in de engine (CompletionScreen op de missie-drempel laten reageren i.p.v. een vaste 40%).

---

## Samenvatting & Verdict

AI Bias Detective is inhoudelijk sterk: correcte, goed onderbouwde voorbeelden, heldere SLO-fit, goede Bloom-balans, en geen missie-eigen technische fouten in de config. De twee blocking-bevindingen zijn engine-breed (niet in deze config te repareren) maar hebben op déze missie een concreet effect via de 60%-drempel in combinatie met de 40%-voltooiingsknop van de gedeelde `CompletionScreen`. Design is grotendeels in orde maar de Visual Precision Gate is niet live geverifieerd.

**Verdict: fix-eerst** — niet vanwege de missie-content zelf, maar omdat de engine-brede voltooiing-bug een leerling die deze missie redelijk goed doorloopt (40-59/100) zijn poging kan laten verliezen zonder registratie. Blokkeer op de engine-fix (`ScenarioEngine.tsx` + `CompletionScreen.tsx`), niet op een herschrijving van deze config.
