# Missiereview: De Code Denker (code-denker)
**Datum:** 2026-08-25 · **templateType:** scenario-engine

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

## Design — score 7/10

De config zelf bevat geen UI-code (rendering loopt via de gedeelde scenario-engine); beoordeeld is de content-kwaliteit en de al-vastgestelde engine-gebreken die deze missie concreet raken.

- **[warning]** Ronde 2 (`algoritme-volgorde`, type `order-priority`) erft het gedeelde contrastprobleem uit de engine (`bg-duck-error text-white` ~3,6:1, onder de AA-eis van 4,5:1 — `OrderPriorityRound.tsx:140/150`). Dit is een engine-bug, geen missie-specifieke fix, maar deze missie heeft er wél een ronde van dat type.
- **[warning]** Focusbeheer bij rondewisseling ontbreekt engine-breed (`ScenarioEngine.tsx:289`) — bij 4 rondes wisselt de leerling 3 keer zonder aankondiging voor schermlezers.
- **[info]** `src/config/agents/year1.tsx:3519` gebruikt `lab-teal`/`lab-coral` (legacy palet) voor de briefing-kaart in plaats van `duck-*`. Consistent met de rest van de bestaande agent-kaarten in dit bestand, dus geen missie-specifieke afwijking — puur een dossiernotitie.

Verder is de content zelf helder: acht iconen per ronde, consistente kaartopbouw, geen visuele afleiding.

## Didactiek — score 7.5/10

- Leerdoelen kloppen aantoonbaar met de content: "minimaal 3 voorbeelden decompositie" → 4 items (id 1,3,5,7) zijn `correct: true` in ronde 1. "5 stappen algoritme" → ronde 2 heeft precies 5 items met `correctPosition` 0–4. "6 voorbeelden abstractie" → ronde 3 heeft exact 6 items. "Patronen zonder willekeurige voorbeelden" → ronde 4 is `select-correct` met 4 juiste patronen tussen 4 afleiders (Fibonacci, +2-reeks, dagen, kleurcyclus vs. willekeurige getallen/letters/noten).
- `maxScore: 100` = 4 × 25, sluitend met vier rondes.
- **[warning]** `criteria.type: 'rounds-complete'` in `missionGoals.ts:146` — deze missie gebruikt dus NIET de 60%-drempel van online-helden/factchecker/ai-bias-detective. De blocking engine-bevinding over de 40%-vs-60-mismatch (finding #2 in de engine-pass) is hier dus **niet van toepassing**. Wel van toepassing: de blocking 40%-doodlopend-eindscherm-bevinding (finding #1), want die geldt voor alle 12 scenario-missies inclusief deze, ongeacht drempeltype.
- **[info]** Uitleg bij ronde-2-item 2 ("Pak een mes...") is licht verwarrend: "Je hebt het mes nodig om te smeren, maar je kunt het mes ook al pakken terwijl het brood klaarstaat" suggereert parallelle uitvoering, terwijl de opdracht juist een strikte lineaire volgorde vraagt ("een computer begrijpt niets vanzelf"). Voor de doelgroep (brugklas, onderbouw) een kleine tegenstrijdigheid in de didactische boodschap — niet fout genoeg om de score te laten zakken, wel de moeite van een woordje bijschaven.
- Geen AI-interactie in deze missie (bewust, puur computational thinking) — dat is een expliciete designkeuze in `introDescription`, geen gat.

## Tech — score 6/10

Missie-eigen config is technisch schoon (geen typefouten, ids consistent, `correctPosition` sluitend 0–4, geen dubbele item-ids). De score wordt gedrukt door twee gedeelde-engine-gebreken die deze missie concreet raakt:

- **[blocking]** (geërfd van engine) Onder 40% score is het eindscherm een doodlopende weg zonder `onRetry`, `onBack` of PhaseHeader — en de opgeslagen `phase: 'results'`-state herstelt dat scherm bij elk volgend bezoek. Dit raakt code-denker net zo hard als de andere 11 scenario-missies. Niet oplosbaar binnen de config-whitelist van deze missie; hoort bij `ScenarioEngine.tsx`/`CompletionScreen.tsx`.
- **[warning]** (geërfd van engine) `scoreOrderPriority` (gebruikt door ronde 2, type `order-priority`) heeft als enige scoreformule geen gokcorrectie: van boven naar beneden klikken zonder lezen levert bij een ronde van 5 items gemiddeld ~9/25 punten op. Ronde 2 van deze missie (5 items, 25 max) valt binnen dat patroon.
- Geen missie-specifieke technische gebreken gevonden buiten deze twee geërfde engine-issues.

## Voorstellen

Geen mechanische voor/na-fixes binnen de whitelist van deze missie (`code-denker.ts`, templateRegistry-entry, agent-entry, slo-mapping-entry, curriculum-entry, missionGoals-entry) — beide gevonden gebreken zitten in de gedeelde `ScenarioEngine`/`FeedbackBanner`-laag en zijn engine-brede fixes, geen config-aanpassingen.

Eén optioneel, niet-blokkerend tekstvoorstel (didactiek, kleine verduidelijking):

```ts
// voor (src/features/missions/templates/scenario-engine/configs/code-denker.ts:186-187)
explanation:
    'Het gereedschap ophalen is de tweede stap. Je hebt het mes nodig om te smeren, maar je kunt het mes ook al pakken terwijl het brood klaarstaat.',

// na
explanation:
    'Het gereedschap ophalen is de tweede stap. Een computer voert stappen na elkaar uit — dus eerst het mes pakken, dan pas de pindakaas.',
```

## Samenvatting & verdict

De missie-config zelf is inhoudelijk en didactisch solide: leerdoelen, itemaantallen en scoreverdeling sluiten precies op elkaar aan, en het gebruik van `rounds-complete` als voltooiingscriterium ontwijkt de 40-vs-60-drempelbug die drie andere missies wél raakt. Het resterende risico zit volledig in de gedeelde scenario-engine (dood eindscherm onder 40%, geen gokcorrectie in de volgorde-ronde) — dat is al vastgesteld in de aparte engine-pass en hoort daar opgelost te worden, niet in deze config. Voor deze missie op zichzelf: **fix-eerst**, uitsluitend vanwege de geërfde blocking engine-bevinding die de missie voor laagscorende leerlingen permanent blokkeert; er is geen missie-eigen blocker.

**Verdict: fix-eerst** (engine-afhankelijk, geen missie-eigen config-fix nodig).
