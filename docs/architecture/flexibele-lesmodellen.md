# Technisch ontwerp: Flexibele lesmodellen

Productvisie en varianten-definitie: `business/nl-vo/11-productvisie-flexibel-leerroute-systeem.md`

Dit document beschrijft de huidige staat van de container-architectuur, de geverifieerde
technische blokkades die de niet-default modellen breken, het minimale datamodel, en een
gefaseerde implementatie-roadmap.

---

## 1. Huidige staat — wat al werkt

### Types en templates

`src/config/containerTypes.ts:7–87` definieert:

```ts
export type ContainerType = 'period' | 'project_week' | 'weekly_lesson' | 'custom';
export type SchedulingModel = 'default' | 'custom';
```

`SCHEDULING_TEMPLATES` bevat vier varianten:

| Template | `containerType` | `defaultContainerCount` |
|---|---|---|
| `four-periods` | `period` | 4 |
| `project-weeks` | `project_week` | 5 |
| `weekly-lessons` | `weekly_lesson` | 40 |
| `custom` | `custom` | 4 |

### Supabase-schema (geverifieerd)

| Tabel | Sleutelkolommen | Doel |
|---|---|---|
| `school_configs` | `school_id`, `scheduling_model`, `period_naming`, `periods_per_year`, `custom_config jsonb` | Schoolconfiguratie; `scheduling_model = 'default'/'custom'` |
| `school_containers` | `school_id`, `year_group`, `container_type`, `label`, `sort_order`, `start_date`, `end_date`, `slo_focus`, `is_review_gate` | Planningseenheden per school |
| `school_container_missions` | `container_id`, `mission_id`, `sort_order`, `is_review`, `is_required` | Missies per container |

### Coordinator-flow

`src/features/coordinator/SchedulingConfigurator.tsx` bevat al een `TemplateSelector`
die één van de vier templates kiest en via `seedTemplateContainersForSchool`
(`src/services/containerService.ts`) de containers aanmaakt. Bereikbaar via:
Docentendashboard → Beheer → Instellingen → "Leerlijn Inrichten".

### Datum-activering

`src/app/AuthenticatedApp.tsx:167`:
```ts
setActiveWeekFromSystem(getProjectWeekForDate(new Date(), containers));
```

`getProjectWeekForDate` (`src/utils/projectWeekSchedule.ts:64`) zoekt de container
waarvan `startDate <= vandaag <= endDate` en retourneert de `sortOrder` als actief blok.

### Leerling-dashboard

`components/ProjectZeroDashboard.tsx:379–385` bepaalt het actieve thema:
```ts
const activeContainer = containers?.find(c => c.sortOrder === activeWeek);
// bij custom containers:
getContainerTheme(activeContainer?.colorKey)
// bij default (geen custom containers):
PERIOD_THEME[activeWeek] || DEFAULT_PERIOD_THEME
```

`getContainerTheme`/`getAutoTheme` zijn geïmporteerd uit `src/config/containerThemes.ts`.

---

## 2. Geverifieerde blokkades

### Blokkade 1 — Harde 1–4 cap in datum-activering

`src/utils/projectWeekSchedule.ts:3`:
```ts
export type ProjectWeekNumber = 1 | 2 | 3 | 4;
```

`src/utils/projectWeekSchedule.ts:55`:
```ts
if (candidate < 1 || candidate > 4 || !Number.isInteger(candidate)) return null;
```

`normalizeSortOrderToProjectWeek` retourneert `null` voor elke `sortOrder > 4`.
`getProjectWeekForDate` valt dan terug op `getFallbackProjectWeekForDate` (maandtabel,
ook `ProjectWeekNumber` = 1–4). Gevolg: bij het `weekly-lessons`-template (40 containers)
kan blok 5–40 nooit datum-geactiveerd worden. Bij `project-weeks` (5 containers) valt
blok 5 ook altijd terug op de maand-fallback.

### Blokkade 2 — Dubbele hardcoded `PERIOD_THEME` met sleutels 1–4

`components/ProjectZeroDashboard.tsx:59–64`:
```ts
const PERIOD_THEME: Record<number, ...> = { 1: ..., 2: ..., 3: ..., 4: ... };
```

Naast deze inline definitie bestaat een tweede in `src/config/dashboardThemes.tsx:9–16`
(DUCK-stijl tokens). Beide hebben sleutels 1–4; blok 5+ geeft `DEFAULT_PERIOD_THEME`
(neutraal, geen kleur/label). De inline definitie in `ProjectZeroDashboard.tsx` is de
actief gebruikte; de `dashboardThemes.tsx`-versie is een kandidaat voor deduplicatie.

### Blokkade 3 — `lesduur` hardcoded, alleen leerjaar 1

`src/config/dashboardThemes.tsx:99–125`: `PERIOD_LEERDOELEN` heeft keys `'1-1'` t/m `'1-4'`.
Key `'1-5'` of `'2-5'` bestaat niet. Lookup `PERIOD_LEERDOELEN[\`${year}-${activeWeek}\`]`
geeft `undefined` voor indices > 4 of leerjaar 2/3 → geen crash, maar geen lesduur-content.

### Blokkade 4 — `KerndoelMissionMeta.week` is periode-nummer 1–4

`src/config/slo-kerndoelen-mapping.ts:7`:
```ts
export interface KerndoelMissionMeta {
  week: number; // semantisch: periode-nummer 1–4, niet een weeknummer
  ...
}
```

Het veld wordt gebruikt als identifier (niet voor routing). Geen runtime crash bij >4,
maar de naamgeving is misleidend en conflicteert met het wekelijkse model.

---

## 3. Datamodel-ontwerp

### Nieuwe kolom: `deployment_model`

Voeg toe aan `school_configs`:

```sql
ALTER TABLE school_configs
  ADD COLUMN IF NOT EXISTS deployment_model text DEFAULT 'periods';
-- waarden: 'periods' | 'project_weeks' | 'weekly' | 'embedded'
```

**Waarom een aparte kolom, niet via `custom_config jsonb`.** `deployment_model` is een
first-class concept dat alle UI-conditionering stuurt. Een typeveilig, indexeerbaar kolom
is beter dan een jsonb-sleutel. De bestaande `custom_config` is bedoeld voor school-eigen
metadata; dit is platform-structuur.

**Relatie met `scheduling_model`.** De twee kolommen zijn orthogonaal:
- `scheduling_model` = technisch: zijn er custom containers aangemaakt? (`'default'/'custom'`)
- `deployment_model` = pedagogisch: welk lesmodel gebruikt de school?

Een school kan `deployment_model = 'weekly'` hebben terwijl `scheduling_model = 'default'`
(containers nog niet aangemaakt) of `'custom'` (al ingericht).

**RLS.** `school_configs` heeft al correcte policies (migratie `20260402120000`). Leerlingen
lezen dit niet rechtstreeks; ze ontvangen containers via props/context. Geen nieuwe tabel →
geen nieuwe RLS-policies nodig.

### Geen nieuw `ContainerType` voor embedded

"Geïntegreerd in bestaande vakken" (variant B) past structureel niet in de container-navigatie:
het heeft geen `sortOrder`, geen datum-activering en geen blok-volgorde. Het modelleren als
een extra `ContainerType` zou de container-rendering routes vervuilen.

Aanbeveling: bij `deployment_model = 'embedded'` slaat `containerService.getContainersForSchool`
een lege array terug (of een meta-flag); het docentendashboard toont dan de
permissie-gebaseerde missie-bibliotheek (`enabled_games`-laag) i.p.v. de blok-navigatie.

**Beslispunt 4** (zie sectie 6): virtuele containers per SLO-domein zodat de dekkingsbalk
blijft werken bij embedded-model.

---

## 4. Technische fixes per blokkade

### Fix 1 — De-cappen van de `ProjectWeekNumber` 1–4 limiet

**Aanpak:**
1. Hernoem het type `ProjectWeekNumber` naar `ContainerIndex` (of breid het uit naar
   `number`). Alle callers (`AuthenticatedApp.tsx:167`, `ProjectZeroDashboard.tsx:28,619,625`)
   verwachten al een `number` — het type-rename heeft geen cascade-effect.
2. Verwijder de `candidate > 4` guard in `normalizeSortOrderToProjectWeek`
   (`projectWeekSchedule.ts:55`). Retourneer `candidate` voor alle `>= 1`-waarden.
3. Maak de maand-fallback-tabel opt-out: bij meer dan 4 containers heeft
   "maand → blok 1–4" geen semantische betekenis. Geef in dat geval de
   container terug met de hoogste `startDate <= vandaag` als fallback, of blok 1 als
   noodgeval.

**Geraakte bestanden:**
- `src/utils/projectWeekSchedule.ts` (type + guard + fallback-logica)
- `src/app/AuthenticatedApp.tsx:167` (type-annotatie, als die er is)

### Fix 2 — Thema-lookup ontkoppelen van harde sleutels 1–4

**Aanpak:**
Bij custom containers gebruikt `ProjectZeroDashboard.tsx:384` al `getContainerTheme(colorKey)`.
Het probleem zit in het fallback-pad (geen custom containers, `sortOrder > 4`).

Stap 1: zorg dat het default-pad (`PERIOD_THEME[activeWeek] || DEFAULT_PERIOD_THEME`)
altijd `DEFAULT_PERIOD_THEME` teruggeven voor indices > 4 — dit werkt al door de
`|| DEFAULT_PERIOD_THEME` guard. Controleer dat `DEFAULT_PERIOD_THEME` visueel acceptabel is.

Stap 2 (opruiming): verwijder de dubbele `PERIOD_THEME`-definitie in
`src/config/dashboardThemes.tsx:9–16` en importeer de definitie uit één bron.
Dit is geen blokkade, maar een onderhoudslast.

**Geraakte bestanden:**
- `components/ProjectZeroDashboard.tsx:59–65` (inline definitie)
- `src/config/dashboardThemes.tsx:9–16` (duplicate, kandidaat voor verwijdering)

### Fix 3 — `KerndoelMissionMeta.week` hernoemen

**Aanpak:** Hernoem naar `periodIndex` in `src/config/slo-kerndoelen-mapping.ts:7` en
update alle verwijzingen. Dit is een puur cosmetische fix zonder runtime-impact.

**Prioriteit: laag** — geen blokkade voor de andere modellen. Opnemen als onderdeel van
een grotere SLO-refactoring.

---

## 5. UX-wiring

### Landingsplek voor de model-keuze

**Niet in `TeacherFirstLoginWizard`.** De wizard (`src/features/teacher/TeacherFirstLoginWizard.tsx`)
vraagt alleen een naam en is persoonlijk. De model-keuze is school-breed en vereist kennis van
het rooster — te vroeg voor een nieuwe docent die de app nog niet kent.

**Wel in de bestaande `SchedulingConfigurator`-flow.** Voeg een stap "Hoe gebruikt jouw
school DGSkills?" toe vóór de huidige `TemplateSelector` in
`src/features/coordinator/SchedulingConfigurator.tsx`. Drie grote keuzekaarten:
1. Wekelijks DG-uur — eigen roosterblok, ~40 weken
2. Projectweken — 4–6 intensieve blokken
3. Geïntegreerd in bestaande vakken — geen eigen blok

De keuze schrijft `deployment_model` naar `school_configs`. Op basis daarvan:
- `weekly` → toon het `weekly-lessons`-template (40 blokken, datum-invoer verplicht of
  auto-berekend — zie beslispunt 3)
- `project_weeks` → toon het `project-weeks`-template (5 blokken, datum-invoer)
- `embedded` → sla container-aanmaak over; toon bevestiging dat de missie-bibliotheek
  actief is

### Wat de docent ziet per model

| Model | Docentweergave |
|---|---|
| Wekelijks / Periodes / Projectweken | Blokken met sortOrder, datum-activering, SLO-dekkingsbalk per blok |
| Embedded | Missie-bibliotheek gegroepeerd op SLO-kerndoel; aan/uit per klas; geen blokken |

### Wat de leerling ziet per model

| Model | Leerlingweergave |
|---|---|
| Wekelijks / Periodes / Projectweken | Blok-navigatie (tabs of swipe), huidig blok actief, overige vergrendeld of zichtbaar |
| Embedded | "Missies voor jou" — alleen actieve missies zonder blokcontext; geen datumreferentie |

Het leerling-dashboard (`components/ProjectZeroDashboard.tsx`) ontvangt `containers` al als
prop. Bij `deployment_model = 'embedded'` wordt een lege `containers`-array doorgegeven;
de component toont dan de missies puur op basis van `permissions.enabled_games` i.p.v.
de blok-navigatie. Geen nieuw component nodig — bestaande conditionele logica uitbreiden.

### Waarschuwing bij ontbrekende datums (wekelijks model)

Bij `deployment_model = 'weekly'` en containers zonder `startDate`/`endDate` valt
datum-activering terug op de maand-fallback (blok 1–4 na fix 1 nog steeds beperkt zinvol
voor 40 blokken). Toon een waarschuwingsbanner in `SchedulingConfigurator` als containers
geen datums hebben na template-aanmaak.

---

## 6. Beslispunten

Onderstaande punten moeten besloten worden vóór implementatie van fase 2 of 3. Per punt
staat een aanbevolen default.

**Beslispunt 1 — `deployment_model` per school of per leerjaar?**
Nu is `school_configs` één rij per school. Een school die leerjaar 1 wekelijks inzet en
leerjaar 2 als projectweken zou per-leerjaar moeten kunnen kiezen.
_Aanbevolen default:_ één model per school (eenvoudigste implementatie). Per-leerjaar
is mogelijk via `school_containers.metadata` of een afzonderlijk `deployment_model`-veld
op `school_containers`; dit is fase 3+-werk.

**Beslispunt 2 — Granulariteit embedded-model**
Het `enabled_games`-systeem werkt klas-breed (alle leerlingen van een klas krijgen dezelfde
toegang). Als de docent in een gemengde klas wil differentiëren, is dat onvoldoende.
_Aanbevolen default:_ klas-brede granulariteit accepteren voor fase 3; per-leerling
differentiatie is een aparte feature.

**Beslispunt 3 — Datum-activering bij wekelijks model: verplicht of auto-berekend?**
Handmatig 40 datums invullen is veel werk. Auto-berekening op basis van schooljaar-startdatum
+ configureerbare vakantieweken is gebruiksvriendelijker maar vereist extra input.
_Aanbevolen default:_ optioneel — auto-bereken op basis van een startdatum (bijv. eerste
maandag van september) en laat de docent uitzonderingen aanpassen. Vakantie-configuratie
is vervolgwerk.

**Beslispunt 4 — Virtuele containers bij embedded model**
Zonder containers mist de coordinator het SLO-coverage-overzicht dat `SchedulingConfigurator`
biedt. Alternatief: genereer per `yearGroup` zeven virtuele containers (één per SLO-domein
21A–23C) zodat de dekkingsbalk blijft werken.
_Aanbevolen default:_ implementeer virtuele SLO-domeincontainers in fase 3; fase 2 toont
alleen een plat missie-overzicht zonder SLO-dekkingsbalk.

**Beslispunt 5 — `buildMissionsForPeriod` zonder `activeWeek` bij embedded**
`components/ProjectZeroDashboard.tsx:525` roept `buildMissionsForPeriod(yearGroup, activeWeek)` aan.
Bij embedded model is er geen `activeWeek` in de traditionele zin.
_Aanbevolen default:_ bij `deployment_model = 'embedded'` missies puur renderen op basis van
`permissions.enabled_games`, de `buildMissionsForPeriod`-aanroep overslaan. Dit is optie (a)
uit het ontwerpvoorstel (conceptueel zuiver, vereist een nieuwe rendering-route).

---

## 7. Gefaseerde implementatie-roadmap

### Fase 1 — Blokkades fixen

Doel: `weekly-lessons` (40 blokken) en `project-weeks` (5 blokken) werken end-to-end
zonder datum-activeringsfouten. Geen nieuwe features.

| Actie | Bestand |
|---|---|
| `ProjectWeekNumber` → `number`/`ContainerIndex`, guard verwijderen | `src/utils/projectWeekSchedule.ts:3,55` |
| Fallback-logica voor N > 4 containers | `src/utils/projectWeekSchedule.ts:60–77` |
| Thema-fallback valideren bij blok > 4 (visuele check) | `components/ProjectZeroDashboard.tsx:384–385` |
| Optioneel: deduplicate `PERIOD_THEME` | `src/config/dashboardThemes.tsx:9–16` + `components/ProjectZeroDashboard.tsx:59–64` |

### Fase 2 — Model-keuze vindbaar + `deployment_model`

Doel: docenten kunnen het lesmodel kiezen via de `SchedulingConfigurator`; keuze wordt
opgeslagen.

| Actie | Bestand |
|---|---|
| Supabase-migratie: `ALTER TABLE school_configs ADD COLUMN deployment_model` | `supabase/migrations/` (nieuw) |
| TypeScript-types bijwerken | `src/types.ts` of `database.types.ts` |
| "Hoe gebruikt jouw school DGSkills?"-stap toevoegen aan TemplateSelector | `src/features/coordinator/SchedulingConfigurator.tsx` |
| `deployment_model` lezen + doorgeven aan dashboard | `src/app/AuthenticatedApp.tsx` |
| Waarschuwingsbanner bij wekelijks model zonder datums | `src/features/coordinator/SchedulingConfigurator.tsx` |

### Fase 3 — Embedded model + leerling-bewustzijn

Doel: variant B werkt volledig; leerlingen in embedded-model zien een andere weergave.

| Actie | Bestand |
|---|---|
| `containerService`: bij `embedded` lege containers retourneren + meta-flag | `src/services/containerService.ts` |
| Dashboard conditioneel op `deployment_model`: embedded = missie-lijst | `components/ProjectZeroDashboard.tsx` |
| Docenten-missie-bibliotheek bij embedded (SLO-gegroepeerd, aan/uit per klas) | `src/features/teacher/SettingsPanel.tsx` |
| Optioneel: virtuele SLO-domein-containers voor dekkingsbalk (beslispunt 4) | `src/services/containerService.ts` + `src/features/coordinator/SchedulingConfigurator.tsx` |
