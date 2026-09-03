# Missie-review: API Architect

**Datum:** 2026-08-25
**templateType:** builder-canvas

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

## Design — score 6.5/10

- **Blocking (overgeërfd van engine):** de afrondknop op het CompletionScreen kent geen bezig-toestand; bij dubbelklik kan `onComplete` twee keer afvuren (BuilderCanvas.tsx:264 / CompletionScreen.tsx:163). Geldt onverkort voor deze missie, want de 4 stappen leiden allemaal naar hetzelfde afrondscherm.
- **Warning (overgeërfd):** `showMilestone` blijft na een herlaad binnen 2s vast in beeld (BuilderCanvas.tsx:229). Bij deze missie met 4 stappen is de kans op een herlaad-tijdens-toast reëel bij een lange sessie (elke stap is tekstzwaar).
- **Warning (overgeërfd):** contrastrisico op `/70`-opacity tekens in `StepInstructionPanel.tsx` en `ChecklistItem.tsx` — raakt elk tekstveld in deze missie, dus alle 4 stappen.
- **Info:** de icoonlijst voor stapoverzicht heeft maar 4 iconen (BuilderCanvas.tsx:292) — deze missie heeft precies 4 stappen, dus dit specifieke risico ("stap 5 krijgt hetzelfde icoon") raakt api-architect niet.
- Config-eigen: geen extra design-issues gevonden. `introEmoji: '🔌'`, badges en emoji-progressie zijn consistent en thematisch passend.

## Didactiek — score 7/10

- Opbouw is logisch: principes → endpoints ontwerpen → authenticatie → documentatie. Elke stap bouwt voort op de vorige (endpoints uit stap 2 worden ddocgeschreven in stap 4).
- `missionGoals.ts:636-641` (`primaryGoal`, criteria `steps-complete min:4`) sluit één-op-één aan bij de 4 configstappen — coherent.
- SLO-koppeling (`slo-kerndoelen-mapping.ts:162`: 22A, 22B, 21A) is inhoudelijk passend: API-ontwerp raakt zowel systeemdenken (22A/22B) als product/code (21A).
- **Warning:** alleen stap 1 (`api-basics`) heeft een `evidence`-veld; stappen 2-4 (endpoints, authenticatie, documentatie) hebben dat niet, terwijl juist dáár concreet, verifieerbaar werk wordt gevraagd (een endpoint-tabel, een auth-flow, JSON-voorbeelden). Gecombineerd met de engine-bevinding "scoring is presence-based, checklist is zelfrapportage" (enginebevindingen, `area: scoring`) betekent dit dat een leerling in stap 2-4 alleen hoeft te typen wat er in de instructie al staat beschreven, zonder dat een bewijsveld dwingt tot een concreet, natrekbaar antwoord. Voor een missie die uitdrukkelijk "documentatie zoals een professional" en "minimaal 6 endpoints in een tabel" vraagt, is een `evidence`-veld op stap 2 (bijv. de endpoint-tabel zelf) en stap 4 (het JSON-voorbeeld) een goedkope manier om de gokbestendigheid te verhogen.
- **Info:** stap 4 vraagt expliciet Engelstalige documentatie ("Documentatie is geschreven in het Engels" als checklist-item) — een taaleis die de tekstcheck (`isMeaningfulAnswer`, presence-based) niet verifieert. Zelfrapportage via checkbox is hier het enige controlepunt; past bij de bekende engine-beperking, geen nieuw punt.
- Tip-teksten zijn functioneel en leggen vakjargon (JWT, statuscodes, Swagger/OpenAPI) telkens kort uit — goed voor de doelgroep onderbouw VO.

## Tech — score 7.5/10

- Config is technisch correct gestructureerd: `maxScore: 100`, 4 steps, badges van 0 tot 90 monotoon oplopend, geen dubbele `id`'s in checklistItems of steps.
- `enableChat: true` + `chatRoleId: 'api-architect'` in zowel `templateRegistry.ts:59` als de config zelf — consistent (geen "dormant agent"-mismatch).
- `previewType: 'text-preview'` is passend gezien er geen visuele/canvas-content wordt gebouwd, alleen tekst.
- Overgeërfde engine-bevindingen (dubbele complete-klik, showMilestone-persistentie, presence-based scoring, geen onRetry) zijn niet missie-specifiek te verhelpen binnen dit configbestand — horen bij de gedeelde engine, niet bij api-architect zelf.
- Geen technische issues gevonden die uniek zijn aan deze config.

## Voorstellen

### 1. Evidence-veld toevoegen aan stap "endpoints-ontwerpen" (didactiek)

Verhoogt gokbestendigheid: dwingt de leerling een concreet, natrekbaar artefact te leveren i.p.v. alleen tekst die aan de minLength-check voldoet.

**Voor** (`src/features/missions/templates/builder-canvas/configs/api-architect.ts:41-56`):
```ts
        {
            id: 'endpoints-ontwerpen',
            ...
            textPrompt: 'Ontwerp je API-endpoints hier',
        },
```

**Na:**
```ts
        {
            id: 'endpoints-ontwerpen',
            ...
            textPrompt: 'Ontwerp je API-endpoints hier',
            evidence: {
                label: 'Bewijs van je endpoint-tabel',
                prompt: 'Plak minimaal 3 regels uit je endpoint-tabel (URL, methode, statuscode) als controleerbaar fragment.',
                placeholder: 'Bijv. GET /taken → 200 OK; POST /taken → 201 Created',
                minLength: 30,
            },
        },
```

### 2. Evidence-veld toevoegen aan stap "documentatie" (didactiek)

**Voor** (regel 73-88, slot):
```ts
            textPrompt: 'Schrijf je API-documentatie',
        },
```

**Na:**
```ts
            textPrompt: 'Schrijf je API-documentatie',
            evidence: {
                label: 'JSON-voorbeeld als bewijs',
                prompt: 'Plak één van je JSON request- of response-voorbeelden hier ter controle.',
                placeholder: '{ "status": 200, "data": [...] }',
                minLength: 20,
            },
        },
```

Beide voorstellen zijn mechanisch, binnen de missie-eigen configwhitelist, en raken geen gedeelde engine-code.

## Samenvatting en verdict

api-architect is een didactisch goed opgebouwde, technisch correct bedrade missie met een logische leerlijn (principes → ontwerp → beveiliging → documentatie) en consistente SLO/curriculum/registry-koppeling. De belangrijkste zwakte is missie-eigen: alleen stap 1 heeft een bewijsveld, terwijl stappen 2-4 — juist de inhoudelijk zwaarste onderdelen — volledig op zelfrapportage en een presence-based tekstcheck leunen. Gecombineerd met de al bekende engine-brede scoring-zwakte maakt dat de missie relatief gokbestendig-arm voor 75% van haar stappen. De overige bevindingen (dubbele complete-klik, showMilestone-persistentie, contrast) zijn engine-breed en niet missie-specifiek op te lossen.

**Verdict: fix-eerst** (geen blokkerende missie-eigen fout, maar de ontbrekende evidence-velden zijn een goedkope, aanbevolen verbetering vóór brede uitrol).
