# Audit — Slide Specialist (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `slide-specialist` |
| **Titel** | Slide Specialist |
| **Leerjaar & Periode** | Leerjaar 1, Periode 1 |
| **Template-engine** | ToolGuide (`components/missions/templates/tool-guide/configs/slide-specialist.ts`) |
| **SLO-kerndoelen** | 21A, 22A (VO) / 18A, 19A (VSO) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en begrijpelijk voor de doelgroep — "Slide Specialist" is pakkend
- [x] `introDescription` geeft een concrete, begrijpelijke opdracht — "Leer presenteren met PowerPoint op je iPad. Je maakt een professionele presentatie met een strak thema, korte tekst, afbeeldingen en animaties — zodat je publiek blijft kijken."
- [x] Emoji of visueel element past bij het thema — 🎨 en een oranje presentatie-preview met slidethumbnails
- [x] Moeilijkheidsgraad is voelbaar — "Medium" past bij de extra variatie (thema + animatie + overgang)

**Bronbestanden:** `config/agents/year1.tsx:547-612`, `components/missions/templates/tool-guide/configs/slide-specialist.ts:3-15`

**Score:** 5 / 5

**Opmerkingen:**
> Sterke eerste indruk. De zin "zodat je publiek blijft kijken" zet meteen de didactische intentie: presenteren is voor de kijker, niet voor de maker. De visualPreview simuleert een presentatie-interface met slidethumbnails, wat de context meteen duidelijk maakt. De vier `introFeatures` zijn helder en activiteitsgericht.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] Kleuren zijn consistent — oranje (#EA580C) past bij het levendige presentatie-thema
- [ ] Kleuren via `lab-*` tokens — `color: '#EA580C'` is een hardcoded hex in `year1.tsx:552`
- [ ] Badge-kleuren in `slide-specialist.ts:105-123` zijn hardcoded — `#EA580C`, `#F97316`, `#10B981`
- [x] Animaties passen bij het thema — `animate-pulse` op een Sparkles-icoon in de visualPreview is subtiel en thematisch
- [x] Responsive op minimaal 375 px — ToolGuide-template is mobiel-vriendelijk

**Bronbestanden:** `config/agents/year1.tsx:552`, `components/missions/templates/tool-guide/configs/slide-specialist.ts:104-123`

**Score:** 3 / 5

**Opmerkingen:**
> Meerdere hardcoded hex-waarden, vergelijkbaar met de andere ToolGuide-missies. De oranje kleur is visueel sterk en consistent met het thema, maar de conventie voor `lab-*` tokens wordt niet gevolgd. Geen functionele blokkeerder.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw van eenvoudig naar complex — Thema kiezen → Inhoud → Animatie → Overgang
- [x] Elke stap bouwt aantoonbaar voort op de vorige — je hebt slides nodig (stap 2) om er animaties op te zetten (stap 3), en slides om er overgangen tussen in te stellen (stap 4)
- [x] Moeilijkheid past bij het leerjaar — Medium, J1P1, maar passend voor de eerste presentatie-opdracht op school
- [x] Geen onverklaard vakjargon — "thema", "animatie", "overgang", "kleurvariant" worden uitgelegd
- [x] De "gouden regel" in stap 2 (één gedachte per slide) is een didactisch hoogtepunt

**Bronbestanden:** `components/missions/templates/tool-guide/configs/slide-specialist.ts:18-102`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw. De flow van stijl (thema) → inhoud → dynamiek (animatie) → overgang is logisch en sluit aan op hoe presentaties daadwerkelijk worden gemaakt. De tip "maximaal één of twee animaties per slide" en "gebruik één type overgang voor de hele presentatie" zijn didactisch waardevolle principes die verder gaan dan technische instructies.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Informatie is feitelijk correct — PowerPoint iPad-instructies zijn accuraat (tabblad Ontwerp, Kleurvariant, Animaties, Overgangen, Diavoorstelling)
- [x] Geen typografische fouten of spelfouten — teksten zijn correct
- [x] Taalgebruik past bij de leeftijdsgroep — informeel maar professioneel
- [x] De tip "De gouden regel van presentaties: één gedachte per slide" is een erkend didactisch principe
- [x] De uitleg "Consistentie maakt je presentatie professioneel" is feitelijk en didactisch correct
- [ ] Kleine nuance: "Tik op Animatievenster of Afspelen" — het "Animatievenster" is op iPad-versie van PowerPoint mogelijk niet beschikbaar of anders benoemd dan op desktop

**Bronbestanden:** `components/missions/templates/tool-guide/configs/slide-specialist.ts:18-101`

**Score:** 4 / 5

**Opmerkingen:**
> Inhoudelijk sterk. De presentatieprincipes (minder tekst, consistente stijl, één animatie per slide) zijn correct en didactisch waardevol. Kleine kanttekening: het "Animatievenster" is een desktop-functie die op iPad mogelijk anders heet of beperkt beschikbaar is. De verificatievraag over "hetzelfde type overgang" (correctIndex: 1) is correct en goed geformuleerd.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens lang — ~660 tekens in `year1.tsx:577-595`
- [x] EERSTE BERICHT is aanwezig — "Hey! 🎨 Ik ben je Slide Coach. Wist je dat de beste presentaties bijna GEEN tekst hebben?"
- [x] STEP_COMPLETE markers worden beschreven — "bevestig je de stap met de ---STEP_COMPLETE:X--- marker"
- [x] Verificatievragen aanwezig — "Welke themakleuren zie je nu?", "Wat is de titel van je tweede slide?"
- [x] Toon past bij de rolnaam — "Presentatie Coach" / "Slide Coach" is energiek en aansluitend bij de doelgroep
- [x] Farming-detectie actief — via `SYSTEM_INSTRUCTION_SUFFIX`

**Bronbestanden:** `config/agents/year1.tsx:577-595`

**Score:** 5 / 5

**Opmerkingen:**
> Goed opgebouwde systemInstruction. Het EERSTE BERICHT begint met een verrassende stelling ("Wist je dat de beste presentaties bijna GEEN tekst hebben?") wat direct de aandacht trekt. De verificatievragen in de systemInstruction zijn specifiek en controleren echte app-interactie.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] Interactietype past bij het leerdoel — checklist + verificatievragen voor presentatie-opmaak is passend
- [x] Voldoende variatie — 4 stappen, 3 met verificationQuestion
- [x] Feedback op foute antwoorden is leerzaam — explanations geven presentatieprincipes mee
- [x] Het element werkt technisch — bewezen ToolGuide-template
- [ ] Stap 3 (Animatie toevoegen) heeft geen verificationQuestion — de enige stap zonder kennischeck

**Bronbestanden:** `components/missions/templates/tool-guide/configs/slide-specialist.ts:67-77`

**Score:** 4 / 5

**Opmerkingen:**
> Goede interactiviteit met 3/4 verificationQuestions. De ontbrekende vraag in stap 3 (Animatie) laat een kans liggen om het principe van "spaarzaam animeren" te toetsen. Een vraag als "Hoeveel animaties per slide is het maximum voor een professionele presentatie?" zou hier passen.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Completion-criteria zijn helder — alle checklistItems voltooien
- [x] Badges hebben betekenisvolle namen — "Presentatie Expert", "Slide Specialist", "Aan de slag"
- [x] Scoredrempels zijn realistisch — maxScore 60, drempels 55 en 40
- [x] `takeaways[]` vatten de kernlessen samen — 5 takeaways, inclusief het principe "minder tekst is meer"

**Bronbestanden:** `components/missions/templates/tool-guide/configs/slide-specialist.ts:103-131`

**Score:** 5 / 5

**Opmerkingen:**
> Sterke afrondingsstructuur. De takeaway "Je begrijpt waarom minder tekst en consistente stijl je presentatie sterker maakt" vat de kern van de missie samen. Badges zijn thematisch passend. Het "Presentatie Expert"-badge geeft een realistisch aspiratieniveau.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] Inhoud matcht het geclaimde SLO-kerndoel aantoonbaar — 21A (ICT-tools gebruiken: PowerPoint) en 22A (digitaal presenteren en produceren) kloppen beiden
- [x] Geen conflict tussen curriculum en slo-kerndoelen-mapping — week 1, J1, 21A + 22A consistent
- [x] Het leerdoel is toetsbaar geformuleerd — takeaways zijn meetbaar

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:31`

**Score:** 5 / 5

**Opmerkingen:**
> Perfecte SLO-aansluiting. De missie raakt twee kerndoelen: 21A (PowerPoint als tool) en 22A (een professionele presentatie produceren). De didactische principes over minder tekst en consistente stijl zijn bovendien mediawijsheidscompetenties die breder passen.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij het leerjaar — Medium-missie met helder taalgebruik
- [x] ToolGuide-template gebruikt standaard HTML-semantiek met focus-states
- [x] Informatie niet uitsluitend via kleur — checkmarktjes zijn aanvullend op tekst
- [x] De opmaak van de stappen is consistent en scanbaar

**Bronbestanden:** `components/missions/templates/tool-guide/` (gedeelde template)

**Score:** 4 / 5

**Opmerkingen:**
> Goed toegankelijk. Dezelfde kanttekeningen als bij de andere ToolGuide-missies: runtime kleurcontrast niet getest, visualPreview-div heeft geen ARIA-labels. De instructies zijn duidelijk gestructureerd met vetgedrukte termen.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Pakkend, doelgroepgericht, concreet |
| 2. Visueel | 3 | ×1 = 3 | Hardcoded hex-kleuren |
| 3. Didactische flow | 5 | ×2 = 10 | Gouden regel + principes ingebakken |
| 4. Inhoudelijke correctheid | 4 | ×2 = 8 | Sterk, kleine iPad-versie nuance stap 3 |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | Energiek EERSTE BERICHT, bewijs-verificatie |
| 6. Interactiviteit | 4 | ×1 = 4 | 3/4 stappen met verificationQuestion |
| 7. Afronding & feedback | 5 | ×1 = 5 | Badges, takeaways, scores kloppen |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 21A + 22A direct en toetsbaar |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Goed, runtime-contrast niet getest |
| **TOTAAL** | | **49 / 55** | |

### Gewogen totaal

```
(5×1) + (3×1) + (5×2) + (4×2) + (5×1) + (4×1) + (5×1) + (5×1) + (4×1) = 49
Percentage = (49 / 55) × 100% = 89,1%
```

### Verdict

**✅ Klaar** (89,1% — boven de 80% drempel)

> Slide Specialist is een sterke missie met uitstekende didactische opbouw en waardevolle presentatieprincipes. Hardcoded kleuren en één ontbrekende verificatievraag zijn kleine aandachtspunten. Direct inzetbaar in de pilot.

---

### Actielijst

#### Verbeterpunten (score 3-4 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 2. Visueel | Hardcoded hex-waarden vervangen door `lab-*` tokens | Laag |
| 2 | 4. Inhoudelijke correctheid | Controleren of "Animatievenster" op iPad beschikbaar is — evt. alternatieve naamgeving toevoegen | Laag |
| 3 | 6. Interactiviteit | VerificationQuestion toevoegen aan stap 3 (Animatie): "Hoeveel animaties per slide is het maximum?" | Laag |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
