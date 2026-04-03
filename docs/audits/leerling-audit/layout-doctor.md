# Audit — Layout Doctor (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `layout-doctor` |
| **Titel** | Layout Doctor (ook wel: "Word Match" in SLO-mapping) |
| **Leerjaar & Periode** | Leerjaar 1, Periode 1 (Review week 2) |
| **Template-engine** | Standalone (`components/missions/review/LayoutDoctorMission.tsx`) |
| **SLO-kerndoelen** | 21A, 22A (VO) / 18A, 19A (VSO) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [ ] `introTitle` aanwezig in agents — in `year1.tsx:17-23` is de missie gedefinieerd met `systemInstruction: ''` en `steps: []`, geen volledige briefing
- [x] Een opdrachtkaart ("Opdracht: Maak dit document professioneel") is aanwezig bovenaan de interface
- [x] De criteria zijn direct zichtbaar — ASSIGNMENT_CRITERIA worden als checklist getoond
- [x] De interface simuleert een Word-omgeving — de context is meteen duidelijk
- [ ] Geen apart introscherm — de leerling wordt direct in de Word-simulator geplaatst zonder welkom

**Bronbestanden:** `config/agents/year1.tsx:17-23`, `components/missions/review/LayoutDoctorMission.tsx:346-380`

**Score:** 3 / 5

**Opmerkingen:**
> Vergelijkbaar met cloud-cleaner: geen introscherm. De opdrachtkaart is echter wel aanwezig en zichtbaar bovenaan de Word-simulator, wat deels compenseert. De opdrachtcriteria zijn direct als checklist zichtbaar, wat de verwachting helder maakt. De titel "Word Match" in de SLO-mapping wijkt af van de missie-titel "Layout Doctor" — een naamconflict.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] De Word-simulator is visueel sterk — nabootsing van het Microsoft Word-ribbon (tabbladen, knoppen) is herkenbaar
- [x] Kleuren zijn intern consistent — `#C46849` voor de header, `#D97757` voor highlights, `#2A9D8F` voor succesberichten
- [ ] Kleuren via `lab-*` tokens — hardcoded hex-waarden gebruikt (`#C46849`, `#D97757`, `#2A9D8F`, `#FAF9F0`, `#E8E6DF`, `#1A1A19`, `#6B6B66`, `#3D3D38`, `#8B6F9E`)
- [x] Animaties zijn intentioneel — Framer Motion voor toast-meldingen (CHANGE_EXPLANATIONS, inlineMessage)
- [x] Responsive — het component gebruikt `min(21cm, 100%)` voor de documentbreedte, waardoor het op smalle schermen inkrimpt
- [ ] Op kleine schermen (375 px) is de ribbon mogelijk te smal voor alle tabbladen — overflow-x is aanwezig maar kan ervaring verstoren

**Bronbestanden:** `components/missions/review/LayoutDoctorMission.tsx:282-308`, `components/missions/review/LayoutDoctorMission.tsx:383-389`

**Score:** 4 / 5

**Opmerkingen:**
> Visueel indrukwekkend — de Word-simulator is het meest visueel gedetailleerde reviewcomponent van de drie. De ribbon-navigatie met tabbladen (Bestand, Start, Invoegen, Ontwerpen, Indeling, Verwijzingen) is authentiek. De kleurconventie (geen `lab-*` tokens) is een terugkerend patroon. Kleine zorg over de ribbonbreedte op mobiel.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Duidelijke opdracht — 5 criteria met progressiebalk geven een helder pad
- [x] CHANGE_EXPLANATIONS geven directe feedback op elke wijziging — leerling leert terwijl ze doen
- [x] De criteria zijn in logische volgorde: titel-stijl → lettertype → afbeelding tekstterugloop → afbeelding positie → lettergrootte
- [x] Moeilijkheid past bij de reviewcontext — J1P2, aansluitend op word-wizard
- [ ] De criteria vereisen soms specifieke interactie-volgorde (afbeelding klikken voor tekstterugloop-optie) — dit is niet uitgelegd in de opdrachtkaart
- [x] De progressiebalk geeft visueel feedback over voortgang

**Bronbestanden:** `components/missions/review/LayoutDoctorMission.tsx:24-41`, `components/missions/review/LayoutDoctorMission.tsx:166-220`

**Score:** 4 / 5

**Opmerkingen:**
> Goede didactische opbouw. De CHANGE_EXPLANATIONS zijn een sterk element — elke correct uitgevoerde actie geeft een mini-les over waarom die actie professioneel is. Kleine kanttekening: de tekstterugloop-optie verschijnt alleen als de afbeelding geselecteerd is (`selection === 'image'`), maar dit wordt niet uitgelegd in de opdrachtkaart. Een hint als "Klik eerst op de afbeelding" zou helpend zijn.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Criteria zijn inhoudelijk correct — "Kop 1", "Arial", tekstterugloop "wrap", lettergrootte ≥12 zijn correct voor professionele documenten
- [x] CHANGE_EXPLANATIONS zijn feitelijk correct — "Sans-serif lettertypen zoals Arial zijn beter leesbaar op schermen" en "Lettergrootte 12 of hoger is de standaard" zijn correcte uitspraken
- [x] Geen typografische fouten of spelfouten
- [x] Taalgebruik past bij de leeftijdsgroep — "Comic Sans wordt als onprofessioneel gezien" is herkenbaar voor deze doelgroep
- [x] De verborgen inhoud (extra tabbladen) is correct: Invoegen, Ontwerpen, Indeling hebben plausibele nep-functies
- [ ] Kleine nuance: "Afbeeldingen rechts plaatsen is een veelgebruikte conventie die de leesbaarheid verbetert" — dit is niet universeel waar; de beste afbeeldingspositie hangt af van context

**Bronbestanden:** `components/missions/review/LayoutDoctorMission.tsx:24-41`, `components/missions/review/LayoutDoctorMission.tsx:34-40`

**Score:** 4 / 5

**Opmerkingen:**
> Inhoudelijk sterk. De uitleg over Comic Sans vs. Arial is sociaal-cultureel correct en herkenbaar. De uitleg over tekstterugloop en lettergrootte zijn vakinhoudelijk juist. Kleine kanttekening bij de claim over afbeeldingspositie rechts — in twee-koloms layouts of bij links-lezende culturen is dit niet universeel.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [ ] `systemInstruction` — in `year1.tsx:22` is `systemInstruction: ''` — leeg!
- [ ] EERSTE BERICHT — ontbreekt (geen AI-chat)
- [ ] STEP_COMPLETE markers — niet van toepassing (geen AI-chat)
- [x] CHANGE_EXPLANATIONS vervangen de AI-coach voor directe feedback
- [x] InlineMessage toast geeft contextuele feedback

**Bronbestanden:** `config/agents/year1.tsx:22`, `components/missions/review/LayoutDoctorMission.tsx:34-40`

**Score:** 3 / 5

**Opmerkingen:**
> De Layout Doctor heeft geen AI-coach — bewust standalone ontworpen. De CHANGE_EXPLANATIONS (automatische mini-lessen na elke correcte actie) vervangen de AI-coaching rol effectief. Dit is een goede ontwerpkeuze voor een simulatie-gebaseerde missie. Score van 3 omdat de coaching-functie inhoudelijk aanwezig is, maar anders geïmplementeerd dan het standaard AI-coach format.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] Interactietype past bij het leerdoel — een echte Word-simulator bedienen versterkt de Word-vaardigheden uit word-wizard
- [x] Voldoende variatie — ribbon met 6 tabbladen, drag-and-drop afbeelding, font-selector, stijlknoppen
- [x] Feedback op acties is direct — CHANGE_EXPLANATIONS na elke correcte actie, inline toasts na verkeerde
- [x] Drag-and-drop voor de afbeelding is aanwezig — `motion.div` met `drag` prop
- [x] Progressiebalk toont voortgang in real-time
- [ ] Sommige extra functies (Tabel invoegen, Vormen, Pagina-einde) zijn nep en doen niets inhoudelijk — leerlingen kunnen verward raken als ze deze proberen te gebruiken

**Bronbestanden:** `components/missions/review/LayoutDoctorMission.tsx:166-278`

**Score:** 4 / 5

**Opmerkingen:**
> Sterke interactiviteit. De Word-simulator is het meest interactieve reviewcomponent van de drie. De nep-functies (Tabel, Vormen, Pagina-einde) zijn een bewuste uitbreiding voor realisme, maar kunnen verwarring veroorzaken als leerlingen ze proberen te gebruiken zonder resultaat. Een kleine visuele aanduiding dat deze functies "buiten de opdracht" vallen zou helpen.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Completion-criteria zijn helder — `isComplete` check op alle 5 criteria
- [x] De "Inleveren"-knop wordt groen zodra alle criteria voltooid zijn — duidelijk visueel signaal
- [ ] Geen badges gedefinieerd — geen badge-structuur zoals in ToolGuide-missies
- [ ] Geen takeaways — geen afrondingsscherm met kernlessen
- [x] Het "Inleveren"-scherm toont een informatieve button-state

**Bronbestanden:** `components/missions/review/LayoutDoctorMission.tsx:163`, `components/missions/review/LayoutDoctorMission.tsx:295-299`

**Score:** 3 / 5

**Opmerkingen:**
> De afrondingsstructuur is minimaal. De "Inleveren"-knop die groen wordt is een goede visuele indicator, maar er is geen afrondingsscherm met een samenvatting van wat geleerd is. Vergelijk met de ToolGuide-missies die takeaways en badges hebben. Een kort afrondingsscherm met "Je hebt geleerd: ..." zou de didactische sluiting sterk verbeteren.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] Inhoud matcht het geclaimde SLO-kerndoel aantoonbaar — 21A (Word als tool) en 22A (professioneel document produceren) kloppen
- [x] De missie versterkt de leerdoelen uit word-wizard (reviewfunctie)
- [ ] Naamconflict: SLO-mapping gebruikt "Word Match" als titel, maar de missie heet "Layout Doctor" — mogelijke administratieve verwarring

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:37`

**Score:** 4 / 5

**Opmerkingen:**
> Goede SLO-aansluiting als reviewmissie voor word-wizard. Het naamconflict ("Layout Doctor" vs. "Word Match" in de mapping) is een administratief punt zonder didactische impact, maar verdient correctie voor helderheid in docentrapportages.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij het leerjaar — duidelijke, korte opdrachtcriteria
- [x] Informatie niet puur via kleur — criteria hebben zowel kleur als tekst + icoon (CheckCircle)
- [x] Focus-states aanwezig — `focus-visible:ring-2` op de Inleveren-knop en Terug-knop
- [ ] De ribbon-tabbladen hebben geen focus-visible ring — `cursor-pointer px-1 whitespace-nowrap` zonder focus-state
- [ ] De drag-and-drop afbeelding is niet toetsenbord-toegankelijk

**Bronbestanden:** `components/missions/review/LayoutDoctorMission.tsx:283-300`

**Score:** 3 / 5

**Opmerkingen:**
> Beperkte toegankelijkheid op twee punten: ribbontabbladen zonder focus-states, en drag-and-drop afbeelding zonder toetsenbordnavigatie. De checklist en statusknop zijn wel toegankelijk. Voor een simulatie-gebaseerde missie zijn deze beperkingen deels inherent aan het format.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 3 | ×1 = 3 | Geen introscherm, opdrachtkaart compenseert gedeeltelijk |
| 2. Visueel | 4 | ×1 = 4 | Word-simulator indrukwekkend, hardcoded kleuren |
| 3. Didactische flow | 4 | ×2 = 8 | Goed, verborgen interactie bij afbeelding niet uitgelegd |
| 4. Inhoudelijke correctheid | 4 | ×2 = 8 | Sterk, kleine nuance afbeeldingspositie |
| 5. AI-coach kwaliteit | 3 | ×1 = 3 | Geen AI-chat, CHANGE_EXPLANATIONS compenseren |
| 6. Interactiviteit | 4 | ×1 = 4 | Sterk, nep-functies kunnen verwarren |
| 7. Afronding & feedback | 3 | ×1 = 3 | Groen knop goed, geen takeaways/badges |
| 8. SLO-aansluiting | 4 | ×1 = 4 | 21A + 22A klopt, naamconflict |
| 9. Toegankelijkheid | 3 | ×1 = 3 | Ribbon zonder focus-state, drag niet toetsenbord |
| **TOTAAL** | | **40 / 55** | |

### Gewogen totaal

```
(3×1) + (4×1) + (4×2) + (4×2) + (3×1) + (4×1) + (3×1) + (4×1) + (3×1) = 40
Percentage = (40 / 55) × 100% = 72,7%
```

### Verdict

**⚠️ Needs work** (72,7% — boven de 60% drempel, maar met meerdere verbeterpunten)

> Layout Doctor heeft een indrukwekkende Word-simulator met sterke inhoud en interactiviteit, maar mist introscherm, afrondingsstructuur en heeft beperkte toegankelijkheid. Met gerichte verbeteringen is dit een uitstekende reviewmissie.

---

### Actielijst

#### Blokkerende issues (oplossen vóór pilot)

| # | Dimensie | Beschrijving | Verantwoordelijk |
|---|----------|--------------|-----------------|
| 1 | 1. Eerste indruk | Introscherm toevoegen met uitleg over de opdracht ("Kap je document op als een pro!") en een startknop | Product |
| 2 | 7. Afronding & feedback | Afrondingsscherm toevoegen na klikken op "Inleveren" — toon 3-5 takeaways over geleerde opmaaklessen | Product |

#### Verbeterpunten (score 3-4 — oplossen vóór volgende versie)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 3. Didactische flow | Hint toevoegen in opdrachtkaart: "Klik op de afbeelding om de tekstterugloop-optie te zien" | Medium |
| 2 | 9. Toegankelijkheid | Focus-visible ring toevoegen aan ribbon-tabbladen | Medium |
| 3 | 8. SLO-aansluiting | Naamconflict oplossen: "Word Match" in slo-kerndoelen-mapping.ts aanpassen naar "Layout Doctor" | Laag |
| 4 | 6. Interactiviteit | Nep-functies (Tabel, Vormen) visueel markeren als "buiten de opdracht" met een grijs label | Laag |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
