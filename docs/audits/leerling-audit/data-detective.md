# Audit — Data Detective (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `data-detective` |
| **Titel** | Data Detective |
| **Leerjaar & Periode** | Leerjaar 1, Periode 3 |
| **Template-engine** | Standalone (AI-chat coach) |
| **SLO-kerndoelen** | 23A (privacy), 21C (data) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en begrijpelijk voor de doelgroep — "Data Detective" is helder
- [x] `introDescription` geeft een concrete, begrijpelijke opdracht — "Onderzoek 3 populaire apps, ontdek welke data ze verzamelen"
- [x] Emoji of visueel element past bij het thema — visuele preview met vergrootglas en data-labels (Locatie, Camera, Contacten) is sterk
- [x] Moeilijkheidsgraad is zichtbaar of voelbaar uit de intro — "Easy" klopt voor J1

**Bronbestanden:** `config/agents/year1.tsx:2036-2066`

**Score:** 5 / 5

**Opmerkingen:**
> De visual preview is uitstekend: het vergrootglas met datatags (Locatie, Camera, Contacten) die samenkomen in "Jouw profiel" vertelt het verhaal direct. Het problemScenario verwijst naar TikTok, Instagram, Roblox en YouTube — allemaal herkenbaar voor de doelgroep. Sterke eerste indruk.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] Kleuren zijn consistent — emerald/teal gradient met Tailwind klassen
- [x] Animaties zijn niet afleidend — geen overmatige animaties in de preview
- [ ] Kleur via `lab-*` tokens — `color: '#10B981'` op het agent-object is hardcoded hex
- [ ] Responsive op minimaal 375 px breed — niet verifieerbaar zonder runtime

**Bronbestanden:** `config/agents/year1.tsx:2041` (hardcoded `#10B981`)

**Score:** 3 / 5

**Opmerkingen:**
> De visuele preview is kwalitatief goed en thematisch sterk. Het emerald/teal kleurschema via Tailwind klassen is correct, maar `color: '#10B981'` op het agent-object is een hardcoded hex-waarde in plaats van een `lab-*` token. Geen zware afwijking, maar het is consistent afwijkend van de stijlconventie.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw van eenvoudig naar complex — App Scan → Data Reis → Mijn Data Regels is een progressieve flow
- [x] Elke stap bouwt aantoonbaar voort op de vorige — je scant eerst apps, volgt dan de datareis, en formuleert dan regels
- [x] Moeilijkheid past bij het leerjaar — J1, Easy, concrete herkenbare apps
- [x] Geen onverklaard vakjargon — "data-regels", "permissies" worden uitgelegd via concrete voorbeelden

**Bronbestanden:** `config/agents/year1.tsx:2144-2162` (steps)

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw. De drie rondes (Permissie Scan → Data Reis → Mijn Data Regels) zijn pedagogisch sterk: van observatie (wat mag welke app?) naar begrip (waar gaat data naartoe?) naar handelingsperspectief (wat doe ik ermee?). De systemInstruction bevat ook een visuele tekst-art van de datareis (telefoon → app → server → data broker → adverteerder) — didactisch krachtig.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Informatie is feitelijk correct — datareis-uitleg klopt (locatiedata, camera, microfoon, data brokers)
- [x] Geen typografische fouten of spelfouten gevonden
- [x] Taalgebruik past bij de leeftijdsgroep — B1-niveau, aansprekend, gebruik van emoji
- [x] Benoemt zowel KANS als GEVAAR per datapunt — didactisch evenwichtig
- [x] Terminologie consistent door de hele missie

**Bronbestanden:** `config/agents/year1.tsx:2067-2143`

**Score:** 5 / 5

**Opmerkingen:**
> De inhoud is uitstekend. De instructie benoemt expliciet: "Empower leerlingen: geef ze kennis en handelingsperspectief, GEEN angst." De data-reis-visualisatie (iPad → TikTok → Server Beijing → Data Broker → Adverteerder) is feitelijk correct en herkenbaar. De voorbeeldregels in de afsluiting (locatie alleen bij gebruik, camera-toegang checken voor nieuwe apps, niet automatisch accepteren) zijn praktisch en toepasbaar.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens lang — ruim voldoende (~1600 tekens)
- [x] EERSTE BERICHT is aanwezig en verwelkomt de leerling goed — "Welkom, Data Detective! 🔍"
- [ ] STEP_COMPLETE markers aanwezig (3/3) — **ONTBREEKT** (0/3)
- [ ] Verificatievragen aanwezig met formele drempel — hints zijn er, maar geen expliciete drempel
- [x] Toon past bij de rolnaam — "Data Detective Coach" is een passende, empowerende rol
- [x] Farming-detectie actief — via `SYSTEM_INSTRUCTION_SUFFIX`

**Bronbestanden:** `config/agents/year1.tsx:2067-2143`

**Score:** 3 / 5

**Opmerkingen:**
> Het EERSTE BERICHT is aanwezig en uitstekend opgebouwd: verwelkoming, belofte van "geen angstverhalen maar echte kennis", duidelijke preview van drie rondes, en een openingsvraag. De toon is perfect voor J1. Echter: er ontbreken STEP_COMPLETE markers, waardoor voortgang niet getrackt wordt. De `goalCriteria: { type: 'steps-complete', min: 3 }` is wel aanwezig maar de AI-coach heeft geen instructie om stap-voltooiing te signaleren.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] Interactietype past bij het leerdoel — echte iPad-scan (Instellingen > Privacy) is authentiek en praktisch
- [x] Voldoende variatie — drie rondes met verschillende interactietypes (scan, reis, regels)
- [x] Feedback is leerzaam — AI geeft data in [DATA]-tags en bespreekt kansen én gevaren
- [x] Werkelijke apparaten worden gebruikt — leerlingen checken hun eigen instellingen

**Bronbestanden:** `config/agents/year1.tsx:2078-2128`

**Score:** 4 / 5

**Opmerkingen:**
> De aanpak van echte iPad-instellingen checken is bijzonder sterk voor een J1-missie: het is authentiek, direct toepasbaar en geeft een direct persoonlijk resultaat. De visuele tekst-art van de datareis is creatief en passend. Punt van verbetering: de instructie beschrijft "iPad" specifiek, maar leerlingen kunnen ook Android-apparaten of schoollaptops hebben. De instructie bevat geen fallback voor andere apparaten.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Completion-criteria zijn helder voor de coach — `goalCriteria: { type: 'steps-complete', min: 3 }`
- [ ] Badges hebben betekenisvolle namen — **geen badges gedefinieerd** in year1.tsx
- [ ] Scoredrempels zijn realistisch — **geen scoring**
- [ ] `takeaways[]` vatten de kernlessen samen — **geen takeaways gedefinieerd**
- [x] Afsluiting is in systemInstruction aanwezig — "AFSLUITING — MIJN DATA REGELS" beschrijft het einddoel

**Bronbestanden:** `config/agents/year1.tsx:2161-2163` (`goalCriteria` aanwezig, geen badges/takeaways)

**Score:** 2 / 5

**Opmerkingen:**
> De `goalCriteria` is aanwezig, wat een positief punt is. Maar er zijn geen badges, geen score, en geen `takeaways[]`. De afsluiting in de systemInstruction is inhoudelijk goed (drie persoonlijke data-regels formuleren), maar er is geen formele sluiting met een badge of samenvatting. Een leerling weet niet expliciet wanneer de missie "klaar" is vanuit het platform. Vergelijk met de goud-standaard `data-verzamelaar` die ook geen badges heeft — dit is een structureel punt.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] Inhoud matcht het geclaimde SLO-kerndoel — 23A (privacy) en 21C (data) kloppen: app-permissies en data-tracking
- [x] Mapping is consistent tussen `curriculum.ts` en `slo-kerndoelen-mapping.ts`
- [x] Het leerdoel is toetsbaar geformuleerd — "Onderzoek 3 populaire apps en maak 3 bewuste keuzes" is meetbaar
- [x] Periode 3-thema "Digitaal Burgerschap" sluit aan bij de missie-inhoud

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts` (week 3, 23A + 21C)

**Score:** 4 / 5

**Opmerkingen:**
> De SLO-aansluiting is goed. 23A (privacy) en 21C (data) zijn beide duidelijk aanwezig in de missie-inhoud. De mapping is intern consistent. Kleine verbetering: de missie raakt ook 23C (maatschappelijke aspecten van datagebruik) maar dit is niet geclaimd in de mapping — geen blokkeerder, maar de mapping is daarmee conservatief.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij het leerjaar — B1-niveau, expliciet vermeld in systemInstruction, geschikt voor 12-13 jaar
- [x] Informatie niet uitsluitend via kleur — data-labels zijn tekstueel ("Locatie", "Camera")
- [ ] Alt-teksten aanwezig — geen afbeeldingen maar ook geen alt-tekst in de preview-div
- [ ] iPad-specifieke instructie — Android-leerlingen krijgen geen alternatieve navigatie-instructie

**Bronbestanden:** `config/agents/year1.tsx:2048-2065` (visualPreview), `2079-2083` (instructie)

**Score:** 3 / 5

**Opmerkingen:**
> Het leesniveau is goed en de emoji-labels zijn informatief genoeg zonder kleurafhankelijkheid. De iPad-specifieke instructie ("ga naar Instellingen > Privacy") is een toegankelijkheidsprobleem voor leerlingen met Android-apparaten of een Chromebook. De instructie bevat geen alternatief voor niet-iPad-gebruikers, terwijl de missie hier actief om vraagt.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Uitstekende visual preview, herkenbare apps |
| 2. Visueel | 3 | ×1 = 3 | Hardcoded hex kleur |
| 3. Didactische flow | 5 | ×2 = 10 | Sterke opbouw, empowering approach |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Feitelijk correct, kans + gevaar |
| 5. AI-coach kwaliteit | 3 | ×1 = 3 | Goed EERSTE BERICHT, mist STEP_COMPLETE |
| 6. Interactiviteit | 4 | ×1 = 4 | Echte iPad-scan is krachtig |
| 7. Afronding & feedback | 2 | ×1 = 2 | Geen badges, geen takeaways |
| 8. SLO-aansluiting | 4 | ×1 = 4 | 23A + 21C kloppen, conservatief |
| 9. Toegankelijkheid | 3 | ×1 = 3 | iPad-only instructie is beperking |
| **TOTAAL** | | **44 / 55** | |

### Gewogen totaal

```
(5×1) + (3×1) + (5×2) + (5×2) + (3×1) + (4×1) + (2×1) + (4×1) + (3×1) = 44
Percentage = (44 / 55) × 100% = 80%
```

### Verdict

**✅ Klaar** (80% — precies op de drempel)

> Data Detective is inhoudelijk en didactisch sterk: uitstekende first impression, krachtige opbouw, feitelijk correcte inhoud en een goed EERSTE BERICHT van de AI-coach. De twee zwaktes zijn het ontbreken van badges/takeaways bij afsluiting en de iPad-specifieke instructie die Android-leerlingen uitsluit. Geen blokkerende issues voor inzet.

---

### Actielijst

#### Blokkerende issues (score 1-2 — oplossen vóór inzet)

Geen blokkerende issues.

#### Verbeterpunten (score 2-3 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 7. Afronding & feedback | Badges en takeaways toevoegen zodat leerling formele afsluiting krijgt. | Hoog |
| 2 | 5. AI-coach kwaliteit | STEP_COMPLETE markers (3/3) toevoegen aan systemInstruction voor voortgangsregistratie. | Hoog |
| 3 | 9. Toegankelijkheid | Android-instructie toevoegen naast iPad-instructie in systemInstruction. | Medium |

#### Nice-to-haves (score 4 — optioneel, verbetert kwaliteit)

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 2. Visueel | `color: '#10B981'` vervangen door `lab-*` token. |
| 2 | 8. SLO-aansluiting | 23C toevoegen aan SLO-mapping (maatschappelijke dimensie van datagebruik is aanwezig in content). |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
