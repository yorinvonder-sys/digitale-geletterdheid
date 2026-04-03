# Audit — Cloud Schoonmaker (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `cloud-cleaner` |
| **Titel** | Cloud Schoonmaker |
| **Leerjaar & Periode** | Leerjaar 1, Periode 1 (Review week 2) |
| **Template-engine** | Standalone (`components/missions/review/CloudCleanerMission.tsx`) |
| **SLO-kerndoelen** | 21A, 23A (VO) / 18A, 20A (VSO) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [ ] `introTitle` aanwezig in agents — in `year1.tsx:11` is de missie gedefinieerd met `systemInstruction: ''` en `steps: []`, zonder title, description of visualPreview naast de basisvelden
- [x] De missie heeft een duidelijk concept — bestanden sorteren in de juiste mappen (OneDrive-simulatie)
- [x] Het doel is direct visueel duidelijk zodra de missie start — bestanden zichtbaar aan de linkerkant, mappen aan de rechterkant
- [ ] Er is geen apart introscherm of welkomstboodschap — de missie start direct in de drag-and-drop interface zonder context

**Bronbestanden:** `config/agents/year1.tsx:8-15`, `components/missions/review/CloudCleanerMission.tsx`

**Score:** 3 / 5

**Opmerkingen:**
> De missie heeft geen formeel introscherm. Leerlingen zien direct de drag-and-drop interface. Het ontbreken van een welkomst- of uitlegscherm betekent dat leerlingen zelf moeten ontdekken hoe het werkt. Voor een reviewmissie is dit enigszins acceptabel (leerlingen kennen de context al), maar een kort intro-tekstje ("Ruim je OneDrive op!") zou de eerste indruk sterk verbeteren.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] Kleuren zijn consistent — gebruik van `#2A9D8F` (teal), `#D97757` (oranje), `#8B6F9E` (paars) voor mapiconen — dit zijn de DGSkills design tokens
- [x] Animaties zijn intentioneel — shake-animatie bij foute plaatsing, succeshighlight bij goede plaatsing
- [x] Tekst is goed leesbaar — bestandsnamen en mapnamen zijn duidelijk
- [x] Mobiele ondersteuning aanwezig — er is een `touchDragFile` en `touchPosition` state voor touch drag-and-drop, plus een `mobileSidebarOpen` state
- [x] Framer Motion gebruikt voor intentionele animaties — drag-interactie is goed geïmplementeerd

**Bronbestanden:** `components/missions/review/CloudCleanerMission.tsx:98-106`, `components/missions/review/CloudCleanerMission.tsx:138-165`

**Score:** 4 / 5

**Opmerkingen:**
> Visueel goed uitgevoerd. De kleurcodering van mappen (teal voor schoolmappen, oranje voor privémappen) is consistent. Touch drag-and-drop is geïmplementeerd, wat cruciaal is voor iPad-gebruik. Kleine kanttekening: de "Prullenbak" voor virussen/junk ontbreekt als visueel zichtbare map in de FOLDERS-lijst, maar is beschikbaar als drop-target.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw — bestanden herkennen → categoriseren → reflecteren (waarom-vraag)
- [x] De "Waarom"-reflectievragen (WHY_QUESTIONS) zijn een sterke didactische toevoeging — leerlingen leren niet alleen sorteren maar ook redeneren
- [x] Moeilijkheid past bij het leerjaar — J1P2 reviewmissie, aansluitend op cloud-commander
- [x] Junk-bestanden (Gratis_Minecraft_Hack.exe, Virus_Alert.html) zijn herkenbare voorbeelden voor 12-jarigen
- [x] Foute plaatsingen geven specifieke feedback ("Dit is een virus- of onzinbestand. Gooi dit weg!")

**Bronbestanden:** `components/missions/review/CloudCleanerMission.tsx:14-63`, `components/missions/review/CloudCleanerMission.tsx:85-96`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw voor een reviewmissie. De "Waarom"-reflectievragen zijn het sterkste didactische element — ze dwingen de leerling tot redeneren, niet alleen tot sorteren. De foutmeldingen zijn specifiek en instructief. De acht bestanden bieden voldoende variatie (school, privé, junk) om alle leergebieden te dekken.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Bestandsclassificaties zijn feitelijk correct — `Boekverslag_NL.docx` → Nederlands, `Huiswerk_Wiskunde.pdf` → Wiskunde, `Gratis_Minecraft_Hack.exe` → Prullenbak
- [x] De "Waarom"-opties zijn didactisch correct — het goede antwoord focust op het type/doel van het bestand, niet op technische kenmerken
- [x] Geen typografische fouten of spelfouten
- [x] Taalgebruik past bij de leeftijdsgroep — "Priv\u00e9 & Foto's", "Oeps!", "Ho!" zijn informeel en passend
- [x] Privé-bestand: `Meme_Collectie.zip` → Privé — dit is correct, memes zijn persoonlijk, niet schoolwerk
- [x] Lesaantekeningen.txt → School Algemeen — correct, niet aan een specifiek vak gebonden

**Bronbestanden:** `components/missions/review/CloudCleanerMission.tsx:14-96`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk uitstekend. De bestandsclassificaties zijn correct en de reflectievragen maken duidelijk onderscheid tussen "wat het bestand is" (bestandstype) en "waarom het daar hoort" (doel). Dit is een subtiel maar belangrijk informatievaardighedenconcept dat goed is verwerkt.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [ ] `systemInstruction` — in `year1.tsx:13` is `systemInstruction: ''` — leeg!
- [ ] EERSTE BERICHT — ontbreekt (lege systemInstruction)
- [ ] STEP_COMPLETE markers — niet van toepassing (geen AI-chat in deze missie)
- [ ] Verificatievragen via AI — niet van toepassing
- [x] Farming-detectie — niet van toepassing (geen AI-chat)
- [x] De WHY_QUESTIONS in de component vervangen de AI-coach gedeeltelijk voor kennistoetsing

**Bronbestanden:** `config/agents/year1.tsx:13`, `components/missions/review/CloudCleanerMission.tsx:14-63`

**Score:** 3 / 5

**Opmerkingen:**
> De Cloud Schoonmaker heeft geen AI-coach — dit is een standalone interactieve missie. De lege systemInstruction is correct voor deze missie-architectuur. De WHY_QUESTIONS vullen de coaching-rol gedeeltelijk in. Score van 3 (niet 1) omdat de missie bewust zonder AI-chat is ontworpen en de WHY_QUESTIONS een adequate vervanging zijn. Dit beoordeeld op basis van de missie-architectuur als geheel.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] Interactietype past bij het leerdoel — drag-and-drop bestanden sorteren simuleert echte OneDrive-organisatie
- [x] Voldoende variatie — 9 bestanden (6 schoolgerelateerd, 3 junk) met 6 doelmappen + prullenbak
- [x] Feedback op foute antwoorden is leerzaam — specifieke foutmeldingen per fouttype
- [x] Touch drag-and-drop geïmplementeerd voor iPad
- [x] "Waarom"-reflectievragen na elke juiste plaatsing — extra interactielaag
- [x] Score-tracking via `savedState.score` (10 punten per correct bestand)

**Bronbestanden:** `components/missions/review/CloudCleanerMission.tsx:85-225`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende interactiviteit. De combinatie van drag-and-drop + reflectievragen is een sterke leerinteractie. De shake-animatie bij fout en de successhighlight bij goed zijn goede immediate feedback. De score-tracking maakt voortgang zichtbaar. De touch-ondersteuning is essentieel voor de iPad-doelgroep.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Completion-criteria zijn helder — alle bestanden sorteren (files.length === 0)
- [x] Score-systeem aanwezig — 10 punten per correct bestand, zichtbaar in de interface
- [x] Foutenteller aanwezig — `mistakes` wordt bijgehouden
- [ ] Badges zijn niet gedefinieerd in de config — er zijn geen badges zoals in de ToolGuide-missies
- [ ] Takeaways zijn niet gedefinieerd — er is geen afrondingsscherm met kernlessen
- [x] Een `showSuccess` state toont wel een afrondingsmoment

**Bronbestanden:** `components/missions/review/CloudCleanerMission.tsx:107-115`, `components/missions/review/CloudCleanerMission.tsx:205-208`

**Score:** 3 / 5

**Opmerkingen:**
> De missie heeft een score-systeem en een win-conditie maar geen formele badges of takeaways. Het afrondingsmoment (`showSuccess`) bestaat maar de inhoud ervan is niet controleerbaar in de gelezen code. Een formeel afrondingsscherm met lessen samengevat ("Je weet nu hoe je bestanden organiseert in OneDrive") zou de didactische sluiting versterken.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] Inhoud matcht het geclaimde SLO-kerndoel aantoonbaar — 21A (bestanden organiseren in OneDrive) en 23A (junk/virus herkennen = digitale veiligheid) kloppen beiden
- [x] Geen conflict tussen curriculum en slo-kerndoelen-mapping — week 2, J1, 21A + 23A consistent
- [x] Het leerdoel is impliciet toetsbaar — correcte sortering is meetbaar via score

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:36`

**Score:** 5 / 5

**Opmerkingen:**
> Sterke SLO-aansluiting. De missie raakt 21A (OneDrive-organisatie) en 23A (virussen herkennen en verwijderen) op een directe, toetsbare manier. De WHY_QUESTIONS maken de SLO-doelen impliciet expliciet.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij het leerjaar — korte bestandsnamen, eenvoudige maptitels
- [x] Touch drag-and-drop als alternatief voor muis-drag — goede toegankelijkheid voor iPad
- [x] Klik-alternatief aanwezig — leerlingen kunnen ook klikken (bestand selecteren, dan map selecteren)
- [ ] Kleurcodering: mappen hebben verschillende kleuren maar ook tekstlabels — informatie niet puur via kleur
- [ ] Focus states bij drag-and-drop zijn beperkt — toetsenbord-navigatie bij drag-and-drop is inherent complex

**Bronbestanden:** `components/missions/review/CloudCleanerMission.tsx:257-282`

**Score:** 4 / 5

**Opmerkingen:**
> Goed toegankelijk. Het klik-alternatief (bestand klikken → map klikken) maakt de missie bruikbaar zonder drag. Touch-ondersteuning is aanwezig. Toetsenbordnavigatie bij drag-and-drop is inherent beperkt, maar het klik-alternatief compenseert dit grotendeels.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 3 | ×1 = 3 | Geen introscherm, direct in interface |
| 2. Visueel | 4 | ×1 = 4 | Consistent, touch-support aanwezig |
| 3. Didactische flow | 5 | ×2 = 10 | WHY_QUESTIONS zijn didactisch hoogtepunt |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Bestandsclassificaties correct, redeneren gestimuleerd |
| 5. AI-coach kwaliteit | 3 | ×1 = 3 | Geen AI-chat, WHY_QUESTIONS compenseren |
| 6. Interactiviteit | 5 | ×1 = 5 | Drag-and-drop + reflectievragen + touch |
| 7. Afronding & feedback | 3 | ×1 = 3 | Score aanwezig, geen badges/takeaways |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 21A + 23A direct en toetsbaar |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Klik-alternatief, touch-support |
| **TOTAAL** | | **43 / 55** | |

### Gewogen totaal

```
(3×1) + (4×1) + (5×2) + (5×2) + (3×1) + (5×1) + (3×1) + (5×1) + (4×1) = 43
Percentage = (43 / 55) × 100% = 78,2%
```

### Verdict

**⚠️ Needs work** (78,2% — net onder de 80% drempel)

> Cloud Schoonmaker heeft een sterk didactisch concept en uitstekende interactiviteit, maar mist een introscherm en een formele afrondingsstructuur (badges/takeaways). Met twee kleine toevoegingen stijgt de score boven de 80%.

---

### Actielijst

#### Blokkerende issues (oplossen vóór pilot)

| # | Dimensie | Beschrijving | Verantwoordelijk |
|---|----------|--------------|-----------------|
| 1 | 1. Eerste indruk | Kort introscherm toevoegen met titel, korte uitleg ("Ruim je OneDrive op!") en een startknop. Max 3 zinnen. | Product |
| 2 | 7. Afronding & feedback | Afrondingsscherm met takeaways toevoegen: minstens 2-3 lessen samengevat ("Je weet nu..."). Optioneel een badge voor het afronden. | Product |

#### Verbeterpunten (score 3-4 — oplossen vóór volgende versie)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 5. AI-coach kwaliteit | De Prullenbak-map visueel duidelijker maken als drop-target in de UI (nu niet in FOLDERS-lijst) | Medium |
| 2 | 2. Visueel | Ensure de `#2A9D8F`, `#D97757`, `#8B6F9E` kleurwaarden zijn gealigneerd aan `lab-*` design tokens | Laag |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
