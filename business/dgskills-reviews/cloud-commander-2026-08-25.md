# Missiereview: Cloud Commander

**Datum:** 2026-08-25
**TemplateType:** tool-guide

---

## Design — score 7,5/10

De vier stappen zijn kort, consistent opgebouwd (instructie → tip → checklist, met teacherCheck en verificationQuestion op de scharnierstappen) en de copy is beknopt genoeg voor de doelgroep.

**Bevindingen:**
- **Warning** — Slash-opacity `/8`-klassen in de gedeelde `ToolGuide.tsx` (engine-bevinding) raken ook deze missie: tip-blokken en aangevinkte checklist-items renderen mogelijk zonder vulkleur. Dit is een engine-issue, niet in `cloud-commander.ts` zelf op te lossen.
- **Info** — De badge-drempels (`minScore: 45/30/0` op `maxScore: 50`) zijn intern consistent, maar 45/50 = 90% voor de topbadge is fors hoger dan de 40%-voltooiingsdrempel van de engine; leerlingen die net de poort door zijn krijgen alleen de laagste badge. Geen bevinding om te fixen, wel vermeldenswaardig voor motivatie-ontwerp.
- **Info** — `stap-4-delen` bevat de langste instructietekst van de missie (5 zinnen); nog binnen het bruikbare bereik voor leerjaar 1, maar op de rand.

Geen blocking bevindingen op deze as.

---

## Didactiek — score 7/10

**Sterke punten:**
- De vier `learningObjectives` dekken precies de vier stappen (opslaan, ordenen, uploaden, delen-met-rechten) en zijn geformuleerd als leerlingdoel, niet als taak.
- De twee verificatievragen toetsen begrip (cloud vs. lokaal; rechten "bekijken" vs. "bewerken") in plaats van pure herhaling van de instructie, met passende `retryHint` en `explanation`.
- `teacherCheck` op stap 3 en 4 borgt een menselijke controle op precies de twee stappen waar zelfrapportage het risicovolst is (echte upload, echte deelrechten).

**Bevindingen:**
- **Blocking (engine-gedeeld, hier concreet zichtbaar)** — Zoals de engine-bevinding beschrijft is scoring puur zelfrapportage via checklist-items. Voor deze missie betekent dat concreet: een leerling kan alle 8 checklist-items aanvinken zonder ooit OneDrive te openen, en met de gratis kennisbonus (`allowRetry: true` op beide vragen) toch 100% scoren. De `teacherCheck`-tekst compenseert dit gedeeltelijk omdat een docent het er fysiek naast moet leggen, maar de score zelf toont geen enkel bewijs van uitvoering.
- **Warning** — `verificationQuestion` op stap 2 test een kennisvraag over cloud vs. lokaal die inhoudelijk los staat van "een map met de naam School aanmaken" (de stap-taak zelf). Didactisch geldig als transferverdieping, maar het is geen check op de stap-taak — een leerling die de map fout benoemt, kan de vraag alsnog goed beantwoorden.
- **Info** — De privacy-instructie in stap 3 ("geen foto's van jezelf of klasgenoten") is een goede impliciete kindveiligheidsmaatregel binnen de instructietekst zelf; buiten scope van deze review maar positief te noteren.

---

## Tech — score 8/10

- Config volgt het `ToolGuideConfig`-contract volledig: alle verplichte velden aanwezig, `id`'s zijn kebab-case en uniek, `correctIndex` binnen bereik van `options`.
- Registratie is compleet en consistent over de vier bronnen: `templateRegistry.ts` (tool-guide), `slo-kerndoelen-mapping.ts` (kerndoelen 21A/23A, vso 18A/20A, leerjaar 1 periode 1), `curriculum.ts` (leerjaar 1) en `missionGoals.ts` (steps-complete, min 4).
- `maxScore: 50` is consistent met 4 stappen × 10 checklistpunten + 2 × 5 kennisbonus = 50 — rekent kloppend met de engine-scoring die hierboven als didactisch risico is genoemd.

**Bevindingen:**
- **Blocking (engine-gedeeld)** — `useMissionAutoSave` zonder validate-callback (engine-bevinding) raakt deze missie zodra `steps` ooit wijzigt (stap toevoegen/verwijderen/hernummeren): een leerling met een opgeslagen `currentStep` buiten bereik krijgt een wit scherm. Niet oplosbaar binnen `cloud-commander.ts`.
- **Info** — Geen mission-specifieke technische issues gevonden buiten de gedeelde engine-bevindingen.

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## Voorstellen

Geen mechanische fix binnen de whitelist-scope van dit rapport (`cloud-commander.ts`, registry-entries) is nodig of nuttig — de blocking bevindingen (scoring-gokbestendigheid, state-herstel-crash) zitten in de gedeelde `ToolGuide.tsx`-engine en horen bij de aparte engine-fix, niet bij deze missieconfig.

Eén optionele, niet-blokkerende suggestie voor de missie-auteur (geen whitelist-fix, ter overweging):

```ts
// voor — badge-drempel ver boven de voltooiingsdrempel
{ minScore: 45, emoji: '🏆', title: 'Cloud Expert', color: '#D97848' },

// na — dichter bij een haalbaar "goed gedaan"-percentage (bv. 80%)
{ minScore: 40, emoji: '🏆', title: 'Cloud Expert', color: '#D97848' },
```

---

## Samenvatting

Cloud Commander is inhoudelijk een nette, doelgroep-passende tool-guide-missie: heldere stappen, zinvolle verificatievragen en docentchecks precies waar zelfrapportage het meest kwetsbaar is. De twee blocking bevindingen (gokbestendige scoring, state-herstel-crash) zitten volledig in de gedeelde `ToolGuide.tsx`-engine en zijn al vastgelegd in de engine-review; ze zijn niet oplosbaar binnen deze missieconfig en vereisen geen aparte auto-fix hier.

**Verdict: fix-eerst** — de missie zelf is gereed, maar blijft afhankelijk van de engine-fix voor gokbestendige scoring en crash-veilig state-herstel voordat ze zonder voorbehoud naar leerlingen kan.

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).
