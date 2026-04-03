# Audit — Cloud Commander (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `cloud-commander` |
| **Titel** | Cloud Commander |
| **Leerjaar & Periode** | Leerjaar 1, Periode 1 |
| **Template-engine** | ToolGuide (`components/missions/templates/tool-guide/configs/cloud-commander.ts`) |
| **SLO-kerndoelen** | 21A, 23A (VO) / 18A, 20A (VSO) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en begrijpelijk voor de doelgroep — "Cloud Commander" is pakkend en memorabel
- [x] `introDescription` geeft een concrete, begrijpelijke opdracht — "Leer werken met OneDrive op je school-iPad. Je slaat je bestanden op in de cloud, maakt mappen aan en deelt je werk met klasgenoten — zonder USB-stick of e-mail."
- [x] Emoji of visueel element past bij het thema — ☁️ en een wolk-animatie met `animate-pulse` in de visualPreview
- [x] Moeilijkheidsgraad is zichtbaar of voelbaar uit de intro — "Easy" past bij J1P1

**Bronbestanden:** `config/agents/year1.tsx:317-385`, `components/missions/templates/tool-guide/configs/cloud-commander.ts:3-15`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende eerste indruk. De tagline "zonder USB-stick of e-mail" maakt het voordeel direct concreet voor een 12-jarige. De vier `introFeatures` zijn helder en activiteitsgericht. Het probleemscenario ("Je hebt een supergoed verslag gemaakt, maar je computer gaat kapot") is herkenbaar en urgentie-creërend.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] Kleuren zijn consistent — lichtblauwe sky-tint past bij de "cloud" metafoor
- [ ] Kleuren via `lab-*` tokens — `color: '#0EA5E9'` is een hardcoded hex in `year1.tsx:321`
- [ ] Badges in `cloud-commander.ts:92` bevatten hardcoded hex `#D97757` voor "Cloud Expert" — dit is geen lab-token
- [x] Animaties zijn niet afleidend — alleen `animate-pulse` op een wolk-element in de preview
- [x] Responsive op minimaal 375 px — ToolGuide-template is mobiel-vriendelijk

**Bronbestanden:** `config/agents/year1.tsx:321`, `components/missions/templates/tool-guide/configs/cloud-commander.ts:87-106`

**Score:** 3 / 5

**Opmerkingen:**
> Twee hardcoded hex-kleuren: één in het agent-object (`#0EA5E9`) en één in de badge-config (`#D97757`). De `#D97757` badge-kleur is opvallend omdat het een warme oranje kleur is voor een "Cloud Expert"-badge die eigenlijk blauw zou moeten zijn (thematisch). Functioneel zijn er geen problemen, maar de kleurconventie wordt niet gevolgd.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw van eenvoudig naar complex — OneDrive openen → Map aanmaken → Bestand uploaden → Delen is een perfecte lineaire opbouw
- [x] Elke stap bouwt aantoonbaar voort op de vorige — je moet de app open hebben om een map te maken, en een map nodig om een bestand daarin te uploaden
- [x] Moeilijkheid past bij het leerjaar — J1P1, Easy, directe schoolrelevantie
- [x] Geen onverklaard vakjargon — "cloud", "uploaden", "deellink" worden allemaal uitgelegd in tips en explanations

**Bronbestanden:** `components/missions/templates/tool-guide/configs/cloud-commander.ts:18-114`

**Score:** 5 / 5

**Opmerkingen:**
> Perfecte didactische opbouw. De stap-voor-stap bouw is letterlijk het leerpad: installeren → organiseren → opslaan → delen. De tip bij stap 4 ("Een deellink is veiliger dan je bestand als bijlage sturen") introduceert een subtiele informatieveiligheidsboodschap die aansluit op SLO-kerndoel 23A. Didactisch sterk.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Informatie is feitelijk correct — OneDrive instructies (+-icoon, Deel > Afdrukken, deellink) zijn correct
- [x] Geen typografische fouten of spelfouten — teksten zijn correct
- [x] Taalgebruik past bij de leeftijdsgroep — informeel, helder
- [x] Geen Engelse termen waar goed Nederlands beschikbaar is — alles in het Nederlands
- [x] Terminologie consistent — "schoolaccount" consistent, "deellink" consistent
- [x] De explanation bij stap 4 ("Als je iets aanpast, hoef je de link niet opnieuw te sturen — het wordt automatisch bijgewerkt.") is feitelijk correct voor OneDrive

**Bronbestanden:** `components/missions/templates/tool-guide/configs/cloud-commander.ts:40-83`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk uitstekend. De informatie is actueel en correct voor OneDrive op iPad. De tip bij stap 2 ("Gebruik altijd je schoolaccount — niet je persoonlijke Gmail of iCloud. Zo weet je zeker dat je bestanden veilig staan") is informatief en verankert de security-boodschap. De explanation bij de deellink-vraag is feitelijk volledig correct.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens lang — de systemInstruction in `year1.tsx:344-362` is ~740 tekens
- [x] EERSTE BERICHT is aanwezig en heet de leerling goed welkom — "Welkom, Cloud Commander! ☁️ Jouw OneDrive is een puinhoop..."
- [x] STEP_COMPLETE markers worden beschreven in de werkwijze — "bevestig je de stap met de ---STEP_COMPLETE:X--- marker"
- [x] Verificatievragen aanwezig — "Welke opties zie je nu in het menu?", "Wat is de volledige naam van het bestand dat je zojuist hebt opgeslagen?"
- [x] Toon past bij de rolnaam — "Cloud Storage Specialist" is professioneel, het EERSTE BERICHT is direct uitnodigend
- [x] Farming-detectie actief — via `SYSTEM_INSTRUCTION_SUFFIX`

**Bronbestanden:** `config/agents/year1.tsx:344-362`

**Score:** 5 / 5

**Opmerkingen:**
> Goed opgebouwde systemInstruction. Het EERSTE BERICHT zet direct een context ("jouw OneDrive is een puinhoop") en geeft een concrete eerste taak. De verificatievragen zijn specifiek genoeg om farming te voorkomen zonder een correct antwoord te dicteren. De WERKWIJZE-structuur is identiek aan de Magister-referentie, wat goed is voor consistentie.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] Interactietype past bij het leerdoel — checklist + verificatievragen voor cloud-vaardigheden is passend
- [x] Voldoende variatie — 4 stappen, 2 met verificationQuestion en alle met checklistItems
- [x] Feedback op foute antwoorden is leerzaam — explanations geven extra context
- [x] Het element werkt technisch — bewezen ToolGuide-template
- [ ] Stap 1 (OneDrive openen) en stap 3 (Bestand uploaden) hebben geen verificationQuestion — inconsistentie met stap 2 en 4

**Bronbestanden:** `components/missions/templates/tool-guide/configs/cloud-commander.ts:18-84`

**Score:** 4 / 5

**Opmerkingen:**
> Goede interactiviteit. De verificatievragen die er zijn (stap 2 en 4) zijn inhoudelijk sterk. Stap 1 en 3 hebben enkel checklistItems, wat de leerling meer op eigen verantwoordelijkheid laat werken. Voor een Easy-missie in J1P1 is dit acceptabel, maar consistentie met 4/4 verificationQuestions (zoals in magister-master) zou sterker zijn.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Completion-criteria zijn helder — alle checklistItems voltooien
- [x] Badges hebben betekenisvolle namen — "Cloud Expert", "Cloud Commander", "Aan de slag"
- [x] Scoredrempels zijn realistisch — maxScore 60, drempels 55 en 40
- [x] `takeaways[]` vatten de kernlessen samen — 5 takeaways die de stappen dekken plus het verschil cloud vs. lokaal
- [ ] Badge kleurschema is inconsistent — "Cloud Expert" heeft kleur `#D97757` (oranje) terwijl het thema blauw is

**Bronbestanden:** `components/missions/templates/tool-guide/configs/cloud-commander.ts:86-113`

**Score:** 4 / 5

**Opmerkingen:**
> Goede afrondingsstructuur. De takeaways zijn geformuleerd als "Je kunt..." en "Je snapt...", meetbaar en concreet. De badge "Cloud Expert" heeft een onjuiste kleur (#D97757 is oranje, niet sky-blauw zoals het thema). Dit is een visuele inconsistentie die de coherentie van het afrondingsmoment vermindert.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] Inhoud matcht het geclaimde SLO-kerndoel aantoonbaar — 21A (ICT-tools gebruiken) en 23A (digitale communicatie en samenwerking) kloppen beiden
- [x] Geen conflict tussen curriculum en slo-kerndoelen-mapping — week 1, J1, 21A + 23A consistent
- [x] Het leerdoel is toetsbaar geformuleerd — takeaways zijn meetbaar via checklistafronding

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:29`, `components/missions/templates/tool-guide/configs/cloud-commander.ts:107-113`

**Score:** 5 / 5

**Opmerkingen:**
> Sterke SLO-aansluiting. De missie raakt twee kerndoelen: 21A (OneDrive als tool gebruiken) en 23A (bestanden delen = digitale samenwerking). De takeaway "Je begrijpt het verschil tussen opslaan op je apparaat en in de cloud" is bovendien informatievaardigheid die breder past bij de digitale geletterdheid.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij het leerjaar — korte zinnen, informele toon, concreet
- [x] ToolGuide-template gebruikt standaard HTML-semantiek met focus-states
- [x] Informatie niet uitsluitend via kleur — checkmarktjes zijn aanvullend op tekst
- [x] Kleurcontrast aannemelijk voldoende — sky-blauw op wit is goed leesbaar

**Bronbestanden:** `components/missions/templates/tool-guide/` (gedeelde template)

**Score:** 4 / 5

**Opmerkingen:**
> Goed toegankelijk. Dezelfde kanttekening als bij magister-master: de visualPreview-div heeft geen ARIA-labels, maar dit betreft de thumbnail, niet de missie-interface. Runtime-contrast is niet getest.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Pakkend, herkenbaar probleem |
| 2. Visueel | 3 | ×1 = 3 | Twee hardcoded hex, badge kleur inconsistent |
| 3. Didactische flow | 5 | ×2 = 10 | Perfecte lineaire opbouw |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Feitelijk sterk, securityboodschap ingebakken |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | EERSTE BERICHT + bewijs-verificatie aanwezig |
| 6. Interactiviteit | 4 | ×1 = 4 | 2/4 stappen zonder verificationQuestion |
| 7. Afronding & feedback | 4 | ×1 = 4 | Badge-kleur inconsistent, verder goed |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 21A + 23A direct en toetsbaar |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Goed, runtime-contrast niet getest |
| **TOTAAL** | | **50 / 55** | |

### Gewogen totaal

```
(5×1) + (3×1) + (5×2) + (5×2) + (5×1) + (4×1) + (4×1) + (5×1) + (4×1) = 50
Percentage = (50 / 55) × 100% = 90,9%
```

### Verdict

**✅ Klaar** (90,9% — boven de 80% drempel)

> Cloud Commander is een sterke missie met uitstekende didactische opbouw en inhoud. Kleine visuele inconsistenties (hardcoded hex-kleuren, badge-kleur) zijn de enige aandachtspunten. Direct inzetbaar in de pilot.

---

### Actielijst

#### Verbeterpunten (score 3-4 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 2. Visueel | Hardcoded hex `#0EA5E9` (year1.tsx) en `#D97757` (cloud-commander.ts badge) vervangen door `lab-*` tokens | Laag |
| 2 | 7. Afronding | Badge "Cloud Expert" krijgt kleur `#0EA5E9` (sky-blauw) in plaats van `#D97757` (oranje) — thematische consistentie | Laag |
| 3 | 6. Interactiviteit | VerificationQuestion toevoegen aan stap 1 en stap 3 voor consistentie (optioneel bij Easy-niveau) | Laag |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
