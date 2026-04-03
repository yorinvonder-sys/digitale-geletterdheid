# Niveaudifferentiatieplan — DGSkills

**Versie:** 1.0
**Datum:** 3 april 2026
**Auteur:** DGSkills Productteam
**Status:** Conceptplan — ter besluitvorming

---

## 1. Probleemstelling

### Huidige situatie

Alle leerlingen — van vmbo-b tot vwo — doorlopen nu dezelfde missies met dezelfde teksten, dezelfde verwachte uitvoeringsdiepte en dezelfde AI-aanpak. Dit is een bewuste startkeuze geweest om snel tot een werkend product te komen, maar het past niet bij de onderwijsrealiteit van brede scholen.

### Concrete knelpunten

| Knelpunt | Impact |
|---------|--------|
| Teksten zijn soms te abstract voor vmbo-leerlingen | Afhaken, lager taakafronding |
| Opdrachten zijn soms te eenvoudig voor vwo-leerlingen | Verveling, minder meerwaarde |
| Docenten kunnen leerlingen op niveau niet sturen vanuit het dashboard | Lagere docenttevredenheid |
| In pilotfeedback benoemd als top-2 verbeterpunt | Risico op verloren jaarcontracten |

In de type `AgentRole` (zie `types.ts`) bestaat al een veld `educationLevels?: EducationLevel[]` en is `EducationLevel` gedefinieerd als `'mavo' | 'havo' | 'vwo'`. Dit is een bestaand haakje in de datastructuur dat nog niet volledig benut wordt.

---

## 2. Doelgroep per niveau

| Niveau | Leergroepen | Kenmerken |
|--------|-------------|-----------|
| **Basis** | vmbo-b, vmbo-k | Kortere aandachtsboog, baat bij concrete en visuele instructies, meer scaffolding nodig, directe feedback werkt het beste |
| **Standaard** | vmbo-gt, mavo, onderbouw havo | Goede mix van theorie en praktijk, huidige niveau van de missies, enige zelfstandigheid |
| **Gevorderd** | havo (bovenbouw), vwo | Meer open opdrachten, diepere analyse, ruimte voor kritisch denken en eigen onderzoek, minder scaffolding nodig |

---

## 3. Voorgestelde aanpak — drie implementatie-opties

### Optie A: AI-gestuurde differentiatie (volledig dynamisch)

De AI-assistent past de taal, complexiteit en hints aan op basis van het leerlingprofiel dat in de sessie wordt meegegeven via de `systemInstruction`.

**Hoe het werkt:**
- Bij het starten van een missie wordt het niveau van de leerling (`educationLevel` op het `ParentUser`-object) meegegeven in de systeeminstructie.
- De AI-assistent krijgt instructie om taal, voorbeelden en verwachte uitvoerdiepte aan te passen aan dat niveau.
- De missietekst in de briefing (`problemScenario`, `missionObjective`, `steps`) blijft één versie — alleen de AI-dialoog differentieert.

**Voordeel:**
- Geen duplicatie van content nodig — één missie werkt voor alle niveaus.
- Snel te implementeren als aanpassing van `systemInstruction` in de edge function.
- De AI kan reageren op de feitelijke schrijfvaardigheid van de leerling, niet alleen op het opgegeven niveau.

**Nadeel:**
- Minder voorspelbaar: de docent kan niet van tevoren precies zien wat een leerling op vmbo-niveau te zien krijgt.
- Controle is moeilijker (moeilijker te auditen voor AI Act compliance).
- Werkt minder goed bij missieonderdelen zonder AI-chat (bijv. statische opdrachten, spelcomponenten).

**Impact op codebase:**
- `supabase/functions/chat/index.ts` — aanpassen van `getSystemInstruction()` om `educationLevel` op te nemen
- `supabase/functions/chatStream/index.ts` — zelfde aanpassing
- `types.ts` — `educationLevel` is al aanwezig op `ParentUser`, geen wijziging nodig
- Geen wijzigingen aan `AgentRole`-definities in `config/agents.tsx`

**Ontwikkeltijd (schatting):** 1–2 dagen voor basis-implementatie, 1 week voor testen en itereren.

---

### Optie B: Missie-varianten (volledig statisch)

Elke missie krijgt twee of drie varianten: één voor Basis, één voor Standaard en één voor Gevorderd. Elke variant heeft een eigen `RoleId`, eigen teksten en eigen `steps[]`.

**Hoe het werkt:**
- In `config/agents.tsx` wordt per bestaande missie een `-basis` en `-gevorderd` variant aangemaakt.
- De missieregistratie (`missionRegistry.ts`) filtert op basis van `educationLevel` van de leerling.
- Docenten kunnen in het dashboard zien welke variant hun leerlingen doorlopen.

**Voordeel:**
- Volledig transparant — docenten weten exact wat leerlingen zien.
- Makkelijker te auditen en te controleren (AI Act Art. 12 logging).
- Werkt voor alle onderdelen van een missie, ook zonder AI-chat.

**Nadeel:**
- Enorme contentvermenigvuldiging: 94 missies × 3 niveaus = 282 `AgentRole`-definities.
- Hoge onderhoudslast: elke content-update moet in drie varianten worden doorgevoerd.
- Niet haalbaar vóór de mai-2026 deadline.

**Impact op codebase:**
- `config/agents.tsx` — 188 nieuwe role-definities (enorm)
- `types.ts` — `RoleId` uitbreiden met nieuwe IDs
- `missionRegistry.ts` — filterfunctie op niveau toevoegen
- Docentdashboard — niveauweergave per missie

**Ontwikkeltijd (schatting):** 8–12 weken fulltime voor volledige implementatie. Niet haalbaar in Q2 2026.

---

### Optie C: Hybride — AI-scaffolding per niveau (aanbevolen)

De basisstructuur van elke missie blijft gelijk (één `AgentRole`, één set `steps`), maar:

1. De AI-assistent differentieert actief in de dialoog op basis van `educationLevel`.
2. De briefing-teksten (`problemScenario`, `description` per stap) krijgen een optionele `levelHint` per stap — een korte instructie voor de AI over hoe dit onderdeel op welk niveau moet worden behandeld.
3. Docenten kunnen in het dashboard het niveau per klas instellen (of het automatisch laten bepalen op basis van `educationLevel` per leerling).

**Hoe het werkt in de praktijk:**
- De AI-systeeminstructie bevat het niveau van de leerling en een instructie om scaffolding, voorbeelden en verwachte uitvoerdiepte aan te passen.
- Per stap (`MissionStep`) kan een optioneel veld `levelHints` worden toegevoegd dat de AI extra richting geeft per niveau.
- De docent stelt het standaardniveau in per klas; individuele leerlingen kunnen een afwijkend niveau hebben.

**Voordeel:**
- Geen grote content-duplicatie nodig.
- De docent heeft controle via het dashboard.
- Iteratief te bouwen — start met AI-differentiatie, voeg later stap-specifieke hints toe.
- Past binnen de bestaande type-structuur met minimale aanpassingen.

**Nadeel:**
- Iets minder voorspelbaar dan Optie B.
- Vereist goede prompt engineering en testen per niveau.

**Impact op codebase:**
- `types.ts` — `MissionStep` uitbreiden met optioneel `levelHints?: Record<EducationLevel, string>`
- `supabase/functions/chat/index.ts` — `getSystemInstruction()` aanpassen
- `supabase/functions/chatStream/index.ts` — zelfde aanpassing
- Docentdashboard — niveauinstelling per klas toevoegen
- `config/agents.tsx` — optioneel: `levelHints` toevoegen aan prioriteitsmissies

**Ontwikkeltijd (schatting):** Fase 1 in 3–5 dagen. Volledig uitgerold in Q3 2026.

---

## 4. Aanbeveling

**Kies Optie C (Hybride).** Dit is de enige optie die:

- Haalbaar is vóór de deadline van mei 2026 (Fase 1 in Q2).
- Docenten directe controle geeft zonder enorme contentvermenigvuldiging.
- Uitbreidbaar is naar Optie B als content-resources dat later mogelijk maken.
- Aansluit bij de bestaande type-structuur zonder grote refactors.

---

## 5. Fasering

### Fase 1 — Q2 2026 (april–juni): AI-differentiatie via systeeminstructie

**Doel:** Zichtbaar verschil in hoe de AI reageert op vmbo- versus vwo-leerlingen.

**Taken:**
1. Voeg `educationLevel` van de leerling toe aan de context die wordt meegegeven aan `getSystemInstruction()` in `supabase/functions/chat/index.ts` en `chatStream/index.ts`.
2. Stel een niveaubewuste instructie op die de AI vertelt hoe hij taalgebruik, voorbeeldcomplexiteit en scaffolding aanpast.
3. Test de drie niveaus op minimaal 5 prioriteitsmissies.
4. Documenteer de aanpak voor AI Act Art. 9 risicobeheersing.

**Done-criterium:** Een vmbo-b leerling en een vwo-leerling die dezelfde missie starten, ontvangen aantoonbaar anders geformuleerde hulp van de AI-assistent.

---

### Fase 2 — Q3 2026 (juli–september): Niveaukeuze in docentdashboard

**Doel:** Docenten kunnen het niveau per klas of per leerling instellen.

**Taken:**
1. Voeg een niveauinstelling toe aan de klassenbeheerpagina in het docentdashboard.
2. Sla het ingestelde niveau op in de database (koppeld aan `class` of individuele `user`).
3. Zorg dat het niveau automatisch wordt doorgegeven aan de chat edge function.
4. Voeg een niveauweergave toe aan het leerlingoverzicht.

**Done-criterium:** Een docent kan in het dashboard kiezen of een klas op Basis, Standaard of Gevorderd niveau werkt. Deze keuze is zichtbaar in de leerlingrapportage.

---

### Fase 3 — Q4 2026 (oktober–december): Missie-specifieke level hints

**Doel:** De meest gebruikte missies krijgen stap-voor-stap aanwijzingen per niveau.

**Taken:**
1. Breid `MissionStep` uit met optioneel `levelHints?: Record<EducationLevel, string>`.
2. Voeg `levelHints` toe aan de top 20 meest gespeelde missies.
3. Geef deze hints mee in de AI-context bij het starten van een stap.
4. Evalueer of dit leidt tot betere taakafronding bij vmbo-leerlingen.

**Done-criterium:** In de top 20 missies heeft elke stap een niveau-specifieke hint. Docenttevredenheidscore stijgt met ≥ 0,3 punt ten opzichte van de nulmeting.

---

## 6. Impact op bestaande code — samenvatting

| Bestand | Aanpassing | Fase |
|---------|-----------|------|
| `supabase/functions/chat/index.ts` | `educationLevel` meegeven in systeeminstructie | 1 |
| `supabase/functions/chatStream/index.ts` | Zelfde als boven | 1 |
| `types.ts` — `MissionStep` | Optioneel veld `levelHints` toevoegen | 3 |
| Docentdashboard — klasbeheer | Niveauinstelling per klas | 2 |
| Docentdashboard — leerlingoverzicht | Niveauweergave toevoegen | 2 |
| `config/agents.tsx` | Optioneel `levelHints` toevoegen aan prioriteitsmissies | 3 |

**Geen aanpassingen nodig aan:**
- `types.ts` — `EducationLevel` en `educationLevel` op `ParentUser` bestaan al.
- `AgentRole.educationLevels` — veld bestaat al, wordt nu al gesupport.
- RLS policies — geen nieuwe data-entiteiten.

---

## 7. Didactische onderbouwing

Niveaudifferentiatie sluit aan bij:

- **Zone van naaste ontwikkeling (Vygotsky):** Elke leerling leert het meest effectief net boven zijn huidige niveau, met de juiste scaffolding. AI-gestuurde differentiatie maakt dit individueel mogelijk.
- **SLO-kerndoelen:** De SLO-doelen zijn voor alle niveaus gelijk, maar de diepte en complexiteit van uitvoering mogen verschillen. Dit is expliciet bedoeld in het SLO-raamwerk.
- **EU AI Act Art. 9 (risicomanagement):** Niveaudifferentiatie vermindert het risico dat AI-content niet aansluit bij het cognitief niveau van minderjarige leerlingen — een expliciete HIGH RISK zorg.

---

## 8. Open vragen voor besluitvorming

1. **Prioriteit Fase 1:** Is niveaudifferentiatie urgenter dan de onboarding wizard (Fase C in het sprintplan)? Aanbeveling: parallel draaien — Fase 1 kost 3–5 dagen en kan worden meegenomen in de sprint.
2. **Vmbo-b specifiek:** Overwegen we een vierde niveau toe te voegen voor VSO/vmbo-b? Dit vereist eigen content. Aanbeveling: nu nog niet — eerst pilotresultaten afwachten.
3. **Niveaubepaling:** Wie stelt het niveau in — de docent, de school (via import), of automatisch via een intake-toets? Aanbeveling: docent in Fase 2, optionele intake-toets in Fase 3+.
