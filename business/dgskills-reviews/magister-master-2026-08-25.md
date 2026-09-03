# Missie-review: magister-master

**Datum:** 2026-08-25
**TemplateType:** tool-guide
**Curriculum:** leerjaar 1, periode 1 (SLO 21A / VSO 18A)

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

## 🎨 Design review — score 7/10

De config bevat alleen content (tool-guide is een gedeelde renderlaag zonder eigen className's in de config), dus tokens/layout/knop-clarity vallen grotendeels onder de al-beoordeelde engine.

### Geslaagd
- Copy-lengte past bij leerjaar 1: `introDescription` (23 woorden), instructies per stap ruim onder de 60-woordengrens.
- Content is consistent qua toon en structuur met andere tool-guide-missies (stap → instructie → checklist → tip → teacherCheck [→ verificationQuestion]).

### Aandachtspunten
- **Inconsistente stapstructuur** — `src/features/missions/templates/tool-guide/configs/magister-master.ts:78-92` (stap 3 "Huiswerk opzoeken") heeft als enige van de vier stappen géén `verificationQuestion`, terwijl stap 1, 2 en 4 er wel een hebben. Dat is inhoudelijk geen fout, maar breekt het ritme dat een leerling al drie stappen lang heeft opgebouwd en is een gemiste kans om het "waar zoek je huiswerk" inzicht te toetsen.
  - **Voorstel:** voeg een korte verificationQuestion toe, bv. over waarom huiswerk soms niet in Magister maar in Teams/Classroom staat (sluit aan bij de tip die al in die stap staat).

### Blocking issues
Geen (afhankelijk van engine-gate; zie tech-sectie).

**Visual Precision Gate:** niet dynamisch geverifieerd in deze pass (geen Chrome-plugin bewijs meegeleverd aan deze sub-review) — markeer als unverified, niet als fail.

---

## 📚 Didactiek review — score 7.5/10

### Geslaagd
- `missionGoal` (config) en `MISSION_GOALS['magister-master']` (`src/config/missionGoals.ts:4-13`) zijn inhoudelijk identiek qua strekking (kleine tekstvariatie, geen tegenspraak) en beide leggen terecht nadruk op privacy: "zonder je cijfers hardop te delen".
- Vier stappen dekken de kernvaardigheid logisch op: inloggen → rooster → huiswerk → cijfers, oplopend in complexiteit en met een expliciete privacy-norm (schoolaccount, geen cijfers hardop noemen).
- Verificationvragen (stap 1, 2, 4) toetsen begrip in plaats van herhaling van de instructie (bv. "waarom check je elke ochtend je rooster" i.p.v. "wat is een rooster").
- `learningObjectives` en `takeaways` zijn 1:1 herleidbaar naar de vier stappen — geen doelen die niet bevraagd worden, geen bevraagde stof zonder leerdoel.
- SLO-koppeling (`slo-kerndoelen-mapping.ts:31`, kerndoel 21A) past bij "digitale basisvaardigheden" in periode 1 van leerjaar 1 — logische plaatsing in het curriculum naast cloud-commander/word-wizard/slide-specialist/print-pro.

### Aandachtspunten
- **Ontbrekende toets in stap 3** (zie ook design-sectie) verzwakt de didactische dekking: van de vier leerdoelen wordt er één (huiswerk opzoeken) alleen door zelfrapportage-checklist gedekt, niet door een begripsvraag. Gecombineerd met de reeds vastgestelde engine-bevinding dat checklist-items zelfrapportage zonder inhoudelijke controle zijn, is dit de zwakste schakel in de missie: een leerling kan "huiswerk gevonden" aanvinken zonder ooit echt de Agenda/ELO geopend te hebben, en er is geen vraag die dat alsnog toetst.
- **maxScore-mismatch met engine-realiteit:** `maxScore: 55` en de badge-drempels (55/40/0) zijn intern consistent, maar de engine-bevinding "40 van de 55 punten = 73% is al haalbaar met alleen checklist-clicks" (zie gedeeld engine-rapport) betekent dat de badge "Magister Meester" (drempel 40) puur op klikgedrag haalbaar is zonder de verificationvragen goed te beantwoorden. Dit is een missie-brede consequentie van een engine-gebrek, geen missie-specifieke fout — niet apart oplosbaar binnen deze config.

### Blocking issues
Geen missie-specifieke blockers; de scoring-zwakte is een engine-erfenis (zie gedeeld engine-rapport, al vastgesteld).

---

## 🔧 Tech review — score 8/10

Missie-specifieke config bevat geen eigen logica (tool-guide is 100% engine-gedreven), dus technische bevindingen zijn vrijwel volledig de gedeelde engine-bevindingen. Missie-specifiek gecontroleerd:

### Geslaagd
- Wiring compleet en consistent over de vier bronnen: `templateRegistry.ts:100` (`templateType: 'tool-guide'`), `missionGoals.ts:4-13`, `curriculum.ts:67` (periode 1, leerjaar 1), `slo-kerndoelen-mapping.ts:31` (kerndoel 21A / VSO 18A). Geen dubbele of ontbrekende entry.
- `missionId: 'magister-master'` is overal identiek gespeld — geen typo-risico op state-persistence keys.
- 4 stappen × juiste `steps-complete min: 4`-criterium in zowel config als `missionGoals.ts` — consistent.

### Aandachtspunten
- Geërfd van de engine (niet missie-specifiek op te lossen binnen deze config): het ontbreken van een `validate`-callback bij `useMissionAutoSave` kan bij een toekomstige config-wijziging (bijv. een stap verwijderen) deze missie laten crashen voor leerlingen met een oude save. Nu nog geen probleem omdat de config stabiel is, maar relevant zodra deze missie ooit wordt aangepast.

### Blocking issues
Geen missie-specifieke technische blockers (de blocking engine-bevindingen — gokbestendige scoring, state-herstel crash, dubbele-klik-afronding — zijn al vastgesteld in het gedeelde engine-rapport en gelden voor alle tool-guide-missies, niet uniek voor magister-master).

---

## Voorstellen

**1. Verificationvraag toevoegen aan stap 3 (huiswerk)** — dekt het ontbrekende leerdoel en herstelt het ritme.

Voor (`src/features/missions/templates/tool-guide/configs/magister-master.ts:78-92`):
```ts
{
    id: 'stap-3-huiswerk',
    title: 'Huiswerk opzoeken',
    instruction: '...',
    tip: 'Sommige docenten zetten huiswerk in de ELO van Magister, anderen gebruiken Teams of Classroom. Als je niks ziet in Magister, vraag je docent waar hij of zij huiswerk plaatst.',
    checklistItems: [ /* ... */ ],
    teacherCheck: 'Laat je docent zien waar jij huiswerk of opdrachten terugvindt.',
},
```

Na:
```ts
{
    id: 'stap-3-huiswerk',
    title: 'Huiswerk opzoeken',
    instruction: '...',
    tip: 'Sommige docenten zetten huiswerk in de ELO van Magister, anderen gebruiken Teams of Classroom. Als je niks ziet in Magister, vraag je docent waar hij of zij huiswerk plaatst.',
    checklistItems: [ /* ... */ ],
    teacherCheck: 'Laat je docent zien waar jij huiswerk of opdrachten terugvindt.',
    verificationQuestion: {
        question: 'Je vindt geen huiswerk in Magister. Wat doe je?',
        options: [
            'Ik neem aan dat er geen huiswerk is',
            'Ik vraag mijn docent waar hij of zij huiswerk plaatst',
            'Ik wacht tot de les begint',
            'Ik maak dan maar geen huiswerk',
        ],
        correctIndex: 1,
        allowRetry: true,
        retryHint: 'Nog niet. Denk aan de tip hierboven over verschillende plekken voor huiswerk.',
        explanation: 'Goed! Niet elke docent gebruikt Magister voor huiswerk — vraag het gewoon als je niets vindt.',
    },
},
```

Dit is een reguliere content-toevoeging binnen de whitelist (missie-eigen config), geen engine-wijziging.

---

## Samenvatting & verdict

Magister-master is een inhoudelijk goed opgebouwde, leeftijdspassende introductiemissie voor leerjaar 1: logische opbouw, terechte privacy-nadruk, correcte SLO- en curriculumkoppeling, en drie van de vier stappen toetsen begrip in plaats van herhaling. De enige missie-specifieke tekortkoming is het ontbreken van een verificationvraag in stap 3, wat het zwakste leerdoel (huiswerk vinden) ongetoetst laat — een kleine, whitelist-conforme fix. De zwaardere bevindingen (gokbestendige scoring, state-herstel, dubbele-klik) zijn allemaal engine-breed en al vastgelegd in het gedeelde tool-guide-rapport; ze zijn niet uniek voor deze missie en niet oplosbaar binnen deze config.

**Verdict: fix-eerst** (kleine, mechanische fix: verificationvraag stap 3 toevoegen; geen herontwerp nodig).
