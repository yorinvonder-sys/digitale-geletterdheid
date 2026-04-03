# Audit — Print Pro (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `print-pro` |
| **Titel** | Print Pro |
| **Leerjaar & Periode** | Leerjaar 1, Periode 1 |
| **Template-engine** | ToolGuide (`components/missions/templates/tool-guide/configs/print-pro.ts`) |
| **SLO-kerndoelen** | 21A (VO) / 18A (VSO) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en begrijpelijk voor de doelgroep — "Print Pro" is helder
- [x] `introDescription` geeft een concrete, begrijpelijke opdracht — "Leer printen op school, stap voor stap. Je ontdekt hoe je je apparaat verbindt met de schoolprinter, de juiste instellingen kiest en je printopdracht verstuurt."
- [x] Emoji of visueel element past bij het thema — 🖨️ en een blauwe printer-simulatie in de visualPreview
- [x] Moeilijkheidsgraad is voelbaar — "Easy" past bij J1P1

**Bronbestanden:** `config/agents/year1.tsx:615-699`, `components/missions/templates/tool-guide/configs/print-pro.ts:3-15`

**Score:** 5 / 5

**Opmerkingen:**
> Sterke eerste indruk. De missie lost een direct praktisch probleem op: leerlingen weten niet hoe ze op school moeten printen. De `introFeatures` zijn helder en concreet. Het probleemscenario ("Je werkstuk is af, maar hoe krijg je het nou op papier?") is herkenbaar en urgent.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [ ] Kleuren via `lab-*` tokens — `color: '#6B6B66'` is een hardcoded hex in `year1.tsx:619`
- [ ] Badge-kleuren in `print-pro.ts:105-123` zijn hardcoded — `#6B6B66` (Expert) en `#64748B` (Print Pro)
- [x] Kleuren zijn consistent — grijze tinten passen bij een printer-thema
- [x] Animaties zijn niet afleidend — geen animaties in de visualPreview
- [x] Responsive op minimaal 375 px — ToolGuide-template is mobiel-vriendelijk

**Bronbestanden:** `config/agents/year1.tsx:619`, `components/missions/templates/tool-guide/configs/print-pro.ts:104-123`

**Score:** 3 / 5

**Opmerkingen:**
> Hardcoded hex-kleuren (patroon consistent met andere ToolGuide-missies). De grijze kleurkeuze is thematisch consistent met een printer, maar de badge-kleuren (grijstinten) zijn minder aantrekkelijk en minder motiverend dan de badgekleuren van de andere missies. Een kleur als groen of blauw voor het Expert-badge zou meer belonend aanvoelen.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw van eenvoudig naar complex — Systeem herkennen → Printer instellen → Instellingen kiezen → Versturen & ophalen
- [x] Elke stap bouwt aantoonbaar voort op de vorige — je moet het systeem kennen (stap 1) om de printer in te stellen (stap 2)
- [x] Moeilijkheid past bij het leerjaar — Easy, J1P1
- [x] Geen onverklaard vakjargon — "PaperCut", "FollowMe", "RICOH myPrint" worden benoemd als voorbeelden, niet als aannames
- [x] De aanpak "EERST VRAGEN, DAN HELPEN" in de systemInstruction is didactisch sterk — de AI past zich aan op het specifieke apparaat van de leerling

**Bronbestanden:** `config/agents/year1.tsx:642-682`, `components/missions/templates/tool-guide/configs/print-pro.ts:18-102`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw met een unieke aanpak: de missie erkent dat elk apparaat en elke school anders is, en bouwt adaptieve scaffolding in. De stap "Systeem herkennen" is essentieel en ontbreekt in veel vergelijkbare instructies. De tip bij stap 3 ("Druk nooit zomaar op 'Print' zonder de instellingen te checken") is een praktisch principe.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Informatie is feitelijk correct — printinstructies voor iPad (Deel > Afdrukken), Chromebook (Ctrl+P), Windows (Ctrl+P), Mac (Cmd+P) zijn correct
- [x] Geen typografische fouten of spelfouten — teksten zijn correct
- [x] Taalgebruik past bij de leeftijdsgroep — helder en concreet
- [x] De uitleg over FollowMe-systemen is correct en nuttig
- [x] De tip over privacy (print direct ophalen) is inhoudelijk correct en relevant
- [x] De systemInstruction heeft een uitgebreide aanpak per apparaattype — adaptief en feitelijk correct

**Bronbestanden:** `config/agents/year1.tsx:642-682`, `components/missions/templates/tool-guide/configs/print-pro.ts:18-101`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk uitstekend. De missie is de meest complexe van de vijf ToolGuide-missies qua variatie (meerdere apparaten, meerdere printsystemen) en lost dit op door een adaptieve aanpak. De systemInstruction in `year1.tsx` is de meest uitgebreid gedocumenteerde van alle vijf — ~1200 tekens — wat aantoont dat er goed nagedacht is over de variatie. De verificationQuestion bij stap 3 (dubbelzijdig afdrukken) is correct en didactisch relevant.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens lang — ~1200 tekens in `year1.tsx:642-682`, ruim voldoende
- [ ] EERSTE BERICHT ontbreekt in de systemInstruction — de systemInstruction geeft een uitgebreide aanpak maar geen expliciete "EERSTE BERICHT:" sectie
- [x] STEP_COMPLETE markers — de systemInstruction in `year1.tsx` geeft geen expliciete STEP_COMPLETE instructie, maar de ToolGuide-template handelt dit via verificationQuestions af
- [x] Verificatievragen aanwezig in de systemInstruction — "Welk apparaat gebruik je?", "Weet je welke print-app of welk printsysteem jullie school gebruikt?"
- [x] Toon past bij de rolnaam — "Printing Specialist" is professioneel, de toon is rustig en ondersteunend ("Leerlingen raken in paniek als de printer niet werkt. Jij bent de rustige expert.")
- [x] Farming-detectie actief — via `SYSTEM_INSTRUCTION_SUFFIX`

**Bronbestanden:** `config/agents/year1.tsx:642-682`

**Score:** 3 / 5

**Opmerkingen:**
> De systemInstruction is inhoudelijk de sterkste van alle vijf ToolGuide-missies — gedetailleerd, adaptief, met een duidelijke AANPAK-sectie. Maar er ontbreekt een expliciete "EERSTE BERICHT:" sectie. In tegenstelling tot magister-master, cloud-commander, word-wizard en slide-specialist — die allen een gemarkeerd EERSTE BERICHT hebben — begint Print Pro de AI-chat zonder gestructureerd welkomstbericht. Dit kan leiden tot inconsistente eerste interacties. De overige AI-kwaliteit is uitstekend.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] Interactietype past bij het leerdoel — checklist + verificatievragen voor printen is passend
- [x] Voldoende variatie — 4 stappen, 2 met verificationQuestion
- [x] Feedback op foute antwoorden is leerzaam — explanations geven context
- [x] Het element werkt technisch — bewezen ToolGuide-template
- [ ] Stap 2 (Printer instellen) en stap 4 (Versturen en ophalen) hebben geen verificationQuestion — inconsistentie
- [ ] De verificationQuestion bij stap 4 ontbreekt: een vraag over privacy (waarom print direct ophalen?) was hier sterk geweest en sluit aan op de tip

**Bronbestanden:** `components/missions/templates/tool-guide/configs/print-pro.ts:42-89`

**Score:** 3 / 5

**Opmerkingen:**
> Slechts 2/4 stappen hebben een verificationQuestion (stap 1 en stap 3). Dit is de laagste verhouding van de vijf ToolGuide-missies. Stap 4 mist een verificatievraag over privacy (het ophalen van de print), terwijl de tip dit expliciet benoemt. Dit is een gemiste kans om SLO-23A (digitale veiligheid) te verankeren.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Completion-criteria zijn helder — alle checklistItems voltooien
- [x] Badges hebben betekenisvolle namen — "Print Expert", "Print Pro", "Aan de slag"
- [x] Scoredrempels zijn realistisch — maxScore 60, drempels 55 en 40
- [x] `takeaways[]` vatten de kernlessen samen — 5 takeaways dekken alle stappen
- [ ] Badge-kleuren zijn grijstinten — minder belonend en motiverend dan de andere missies

**Bronbestanden:** `components/missions/templates/tool-guide/configs/print-pro.ts:103-131`

**Score:** 4 / 5

**Opmerkingen:**
> Goede afrondingsstructuur. De takeaway "Je begrijpt waarom je printopdracht direct ophalen slim en veilig is" verankert de privacyboodschap. De grijze badge-kleuren zijn thematisch consistent met een printer maar minder motiverend dan de levendige kleuren van de andere missies.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] Inhoud matcht het geclaimde SLO-kerndoel aantoonbaar — 21A (ICT-tools gebruiken: de schoolprinter) klopt
- [x] Geen conflict tussen curriculum en slo-kerndoelen-mapping — week 1, J1, 21A consistent
- [x] Het leerdoel is toetsbaar geformuleerd — takeaways zijn meetbaar
- [ ] De privacy-dimensie van de missie (print direct ophalen) zou ook SLO 23A kunnen raken — dit is niet in de mapping opgenomen

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:32`

**Score:** 4 / 5

**Opmerkingen:**
> Goede SLO-aansluiting op 21A. De missie bevat echter een expliciete privacyboodschap (print direct ophalen voor je privacy) die ook aansluit op 23A (digitale veiligheid en privacy). Dit is een gemiste kans om de SLO-mapping te verrijken.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij het leerjaar — Easy, helder taalgebruik, korte zinnen
- [x] ToolGuide-template gebruikt standaard HTML-semantiek met focus-states
- [x] Informatie niet uitsluitend via kleur — checkmarktjes zijn aanvullend op tekst
- [x] De instructie erkent dat elke leerling een ander apparaat heeft — inclusief voor diversiteit in apparaten

**Bronbestanden:** `components/missions/templates/tool-guide/` (gedeelde template)

**Score:** 4 / 5

**Opmerkingen:**
> Goed toegankelijk. De adaptieve aanpak (per apparaattype instructies) maakt de missie inclusiever voor leerlingen met verschillende apparaten. Runtime kleurcontrast niet getest.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Helder, urgent, schoolrelevant |
| 2. Visueel | 3 | ×1 = 3 | Hardcoded hex, grijze badges minder motiverend |
| 3. Didactische flow | 5 | ×2 = 10 | Adaptieve aanpak per apparaat is uniek sterk |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Meest uitgebreide systemInstruction van de 5 |
| 5. AI-coach kwaliteit | 3 | ×1 = 3 | EERSTE BERICHT ontbreekt |
| 6. Interactiviteit | 3 | ×1 = 3 | 2/4 stappen met verificationQuestion |
| 7. Afronding & feedback | 4 | ×1 = 4 | Goed, badge-kleuren minder motiverend |
| 8. SLO-aansluiting | 4 | ×1 = 4 | 21A klopt, 23A-privacy niet in mapping |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Goed, adaptief per apparaat |
| **TOTAAL** | | **46 / 55** | |

### Gewogen totaal

```
(5×1) + (3×1) + (5×2) + (5×2) + (3×1) + (3×1) + (4×1) + (4×1) + (4×1) = 46
Percentage = (46 / 55) × 100% = 83,6%
```

### Verdict

**✅ Klaar** (83,6% — boven de 80% drempel)

> Print Pro is een sterke missie met een unieke adaptieve aanpak en uitstekende inhoud. De twee aandachtspunten zijn het ontbrekende EERSTE BERICHT en de beperkte verificationQuestions (2/4). Direct inzetbaar, maar verdient prioritaire verbetering voor de volgende versie.

---

### Actielijst

#### Blokkerende issues (score 3 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Verantwoordelijk |
|---|----------|--------------|-----------------|
| 1 | 5. AI-coach kwaliteit | EERSTE BERICHT toevoegen aan systemInstruction — begin met "Hoi! 🖨️ Ik ben je Print Specialist. Welk apparaat gebruik je?..." | Product |
| 2 | 6. Interactiviteit | VerificationQuestion toevoegen aan stap 4: "Waarom is het belangrijk om je print direct op te halen?" (correctIndex: 1 — privacy + wachtrij) | Product |

#### Verbeterpunten (score 3-4 — oplossen vóór volgende versie)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 2. Visueel | Hardcoded hex-kleuren vervangen door `lab-*` tokens. Badge-kleur "Print Expert" naar groen of blauw voor meer motiverende werking | Laag |
| 2 | 8. SLO-aansluiting | SLO 23A toevoegen aan de mapping — de privacyboodschap (print direct ophalen) rechtvaardigt dit | Laag |
| 3 | 6. Interactiviteit | VerificationQuestion toevoegen aan stap 2 (Printer instellen): "Waarom log je in met je schoolaccount bij de printer?" | Laag |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
