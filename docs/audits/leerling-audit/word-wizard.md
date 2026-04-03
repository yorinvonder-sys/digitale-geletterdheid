# Audit — Word Wizard (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `word-wizard` |
| **Titel** | Word Wizard |
| **Leerjaar & Periode** | Leerjaar 1, Periode 1 |
| **Template-engine** | ToolGuide (`components/missions/templates/tool-guide/configs/word-wizard.ts`) |
| **SLO-kerndoelen** | 21A, 22A (VO) / 18A, 19A (VSO) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en begrijpelijk voor de doelgroep — "Word Wizard" is memorabel
- [x] `introDescription` geeft een concrete, begrijpelijke opdracht — "Leer werken met Microsoft Word op je iPad. Je maakt een professioneel verslag met koppen, een afbeelding en een automatische inhoudsopgave — precies zoals het op school verwacht wordt."
- [x] Emoji of visueel element past bij het thema — ✍️ en een nep-documentpreview met kopblok, tekst en afbeeldingsplaceholder
- [x] Moeilijkheidsgraad is zichtbaar — "Medium" (iets uitdagender dan Magister/OneDrive, terecht voor Word-opmaak)

**Bronbestanden:** `config/agents/year1.tsx:387-449`, `components/missions/templates/tool-guide/configs/word-wizard.ts:3-15`

**Score:** 5 / 5

**Opmerkingen:**
> Sterke eerste indruk. De zin "precies zoals het op school verwacht wordt" is krachtig — het sluit aan op de echte motivatie van de leerling. De visualPreview simuleert een Word-document met kopregel, tekst en afbeelding-placeholder, wat de verwachting direct helder maakt. De `introFeatures` zijn concreet en activiteitsgericht.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] Kleuren zijn consistent — donkerblauw (#2563EB) past bij Word/Microsoft-branding
- [ ] Kleuren via `lab-*` tokens — `color: '#2563EB'` is een hardcoded hex in `year1.tsx:392`
- [x] Animaties zijn niet afleidend — geen animaties in de visualPreview
- [x] Responsive op minimaal 375 px — ToolGuide-template is mobiel-vriendelijk
- [x] Badges in word-wizard.ts gebruiken `#2563EB` (Expert) en `#3B82F6` (Wizard) — beiden blauw, thematisch correct maar hardcoded

**Bronbestanden:** `config/agents/year1.tsx:392`, `components/missions/templates/tool-guide/configs/word-wizard.ts:104-124`

**Score:** 3 / 5

**Opmerkingen:**
> Drie hardcoded hex-waarden (`#2563EB`, `#3B82F6`, `#10B981`). Dit is een terugkerende patroon in de ToolGuide-configs en geen functionele blokkeerder, maar het gaat wel in tegen de kleurconventie van het project. De kleuren zijn visueel consistent met het Word/Microsoft-thema.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw van eenvoudig naar complex — Nieuw document → Kopstijlen → Afbeelding invoegen → Automatische inhoudsopgave
- [x] Elke stap bouwt aantoonbaar voort op de vorige — je hebt kopstijlen nodig om de inhoudsopgave te genereren (stap 2 is een vereiste voor stap 4)
- [x] Moeilijkheid past bij het leerjaar — Medium, J1P1, maar passend voor de verwachting op school
- [x] Geen onverklaard vakjargon — "kopstijlen", "tekstomloop", "automatische inhoudsopgave" worden allemaal uitgelegd

**Bronbestanden:** `components/missions/templates/tool-guide/configs/word-wizard.ts:18-102`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw met een impliciet leerpunt: de leerling ontdekt zelf (via de explanation in stap 4) dat kopstijlen en inhoudsopgave met elkaar verbonden zijn. Dit is een "aha-moment" dat goed is verankerd in de flow. De tip "Sla je document altijd meteen op als je begint" is een cruciale gewoonte die vroeg wordt geïntroduceerd.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Informatie is feitelijk correct — Word-instructies voor iPad zijn accuraat (penseel-icoon, tabblad Stijlen, Invoegen > Afbeeldingen, Inhoudsopgave bijwerken)
- [x] Geen typografische fouten of spelfouten — teksten zijn correct
- [x] Taalgebruik past bij de leeftijdsgroep — informeel maar informatief
- [x] De uitleg "Met de instelling 'Strak' loopt tekst direct om de rand van de afbeelding" is feitelijk correct
- [x] De uitleg "Als je koppen later aanpast, vergeet dan niet de inhoudsopgave bij te werken" is correct gedrag voor Word
- [ ] Kleine technische nuance: op iPads met oudere Word-versies kan de "Automatische inhoudsopgave" optie onder een ander submenu staan — niet gedekt in de instructie

**Bronbestanden:** `components/missions/templates/tool-guide/configs/word-wizard.ts:21-101`

**Score:** 4 / 5

**Opmerkingen:**
> Inhoudelijk sterk en correct. De Word-instructies zijn accuraat voor de huidige versie van Word op iPad. Kleine kanttekening: iPad-versies van Word zijn soms functioneel beperkt ten opzichte van de desktopversie (bijv. beperkte inhoudsopgave-opties). Een korte disclaimer zou helpen. De uitleg over textomloop ("Strak" vs "Vierkant") is didactisch waardevol en correct.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens lang — ~700 tekens in `year1.tsx:413-431`
- [x] EERSTE BERICHT is aanwezig — "Hoi! ✍️ Ik ben je Word Coach. Je gaat een professioneel Word-document maken..."
- [x] STEP_COMPLETE markers worden beschreven — "bevestig je de stap met de ---STEP_COMPLETE:X--- marker"
- [x] Verificatievragen aanwezig — "Welke stijlen zie je in het menu staan?", "Hoeveel koppen staan er nu in je inhoudsopgave?"
- [x] Toon past bij de rolnaam — "Document Expert" / "Word Coach" is toegankelijk
- [x] Farming-detectie actief — via `SYSTEM_INSTRUCTION_SUFFIX`

**Bronbestanden:** `config/agents/year1.tsx:413-431`

**Score:** 5 / 5

**Opmerkingen:**
> Goed opgebouwde systemInstruction. Het EERSTE BERICHT bevat een subtiele uitdaging ("Klinkt simpel? Er zit meer achter dan je denkt!") wat nieuwsgierigheid opwekt. De verificatievragen controleren echte app-interactie. De WERKWIJZE-structuur is consistent met de andere ToolGuide-missies.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] Interactietype past bij het leerdoel — checklist + verificatievragen voor document-opmaak is passend
- [x] Voldoende variatie — 4 stappen, 3 met verificationQuestion
- [x] Feedback op foute antwoorden is leerzaam — explanations geven context
- [x] Het element werkt technisch — bewezen ToolGuide-template
- [ ] Stap 3 (Afbeelding invoegen) heeft geen verificationQuestion — de enige stap zonder kennischeck

**Bronbestanden:** `components/missions/templates/tool-guide/configs/word-wizard.ts:67-78`

**Score:** 4 / 5

**Opmerkingen:**
> Goede interactiviteit met 3/4 verificationQuestions. De ontbrekende vraag in stap 3 (Afbeelding invoegen) is de enige lacune. Een vraag als "Wat is het verschil tussen 'Strak' en 'In lijn met tekst'?" zou hier passen en het tekstomloop-concept verankeren.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Completion-criteria zijn helder — alle checklistItems voltooien
- [x] Badges hebben betekenisvolle namen — "Document Expert", "Word Wizard", "Aan de slag"
- [x] Scoredrempels zijn realistisch — maxScore 60, drempels 55 en 40
- [x] `takeaways[]` vatten de kernlessen samen — 5 takeaways, inclusief de koppeling tussen kopstijlen en inhoudsopgave

**Bronbestanden:** `components/missions/templates/tool-guide/configs/word-wizard.ts:103-132`

**Score:** 5 / 5

**Opmerkingen:**
> Sterke afrondingsstructuur. De takeaway "Je begrijpt waarom kopstijlen en automatische inhoudsopgaven samenwerken" is conceptueel de meest waardevolle en terecht als afsluiter opgenomen. Badges zijn thematisch consistent. Scoredrempels zijn haalbaar.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] Inhoud matcht het geclaimde SLO-kerndoel aantoonbaar — 21A (ICT-tools gebruiken: Word) en 22A (digitaal produceren: een verslag maken) kloppen beiden
- [x] Geen conflict tussen curriculum en slo-kerndoelen-mapping — week 1, J1, 21A + 22A consistent
- [x] Het leerdoel is toetsbaar geformuleerd — takeaways zijn meetbaar

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:30`

**Score:** 5 / 5

**Opmerkingen:**
> Perfecte SLO-aansluiting. De missie raakt twee kerndoelen: 21A (Word als tool) en 22A (professioneel document produceren). De koppeling tussen technische vaardigheid (kopstijlen instellen) en productieve vaardigheid (inhoudsopgave genereren) is didactisch sterk en meetbaar.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij het leerjaar — Medium-missie heeft iets meer vakjargon, maar alles wordt uitgelegd
- [x] ToolGuide-template gebruikt standaard HTML-semantiek met focus-states
- [x] Informatie niet uitsluitend via kleur — checkmarktjes zijn aanvullend op tekst
- [x] Tips en explanations zijn aanvullend op instructies, niet vervangend — goed voor leerlingen die ze overslaan

**Bronbestanden:** `components/missions/templates/tool-guide/` (gedeelde template)

**Score:** 4 / 5

**Opmerkingen:**
> Goed toegankelijk. Het verhoogde taalniveau bij "Medium" is gecompenseerd door uitgebreide tips. Kleine kanttekening: instructieteksten bevatten soms lange zinnen (Stap 3: "Klik in je document op de plek waar je de afbeelding wilt. Tik op Invoegen (tabblad bovenaan) en kies Afbeeldingen of Foto's.") — voor leerlingen met leesproblemen zou opsomming handiger zijn.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Concreet, schoolrelevant, uitnodigend |
| 2. Visueel | 3 | ×1 = 3 | Drie hardcoded hex-waarden |
| 3. Didactische flow | 5 | ×2 = 10 | Impliciete koppeling kopstijlen-inhoudsopgave excellent |
| 4. Inhoudelijke correctheid | 4 | ×2 = 8 | Sterk, kleine iPad-versie nuance |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | EERSTE BERICHT + bewijs-verificatie aanwezig |
| 6. Interactiviteit | 4 | ×1 = 4 | 3/4 stappen met verificationQuestion |
| 7. Afronding & feedback | 5 | ×1 = 5 | Badges, takeaways, scores kloppen |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 21A + 22A direct en toetsbaar |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Goed, lange zinnen in stap 3 |
| **TOTAAL** | | **49 / 55** | |

### Gewogen totaal

```
(5×1) + (3×1) + (5×2) + (4×2) + (5×1) + (4×1) + (5×1) + (5×1) + (4×1) = 49
Percentage = (49 / 55) × 100% = 89,1%
```

### Verdict

**✅ Klaar** (89,1% — boven de 80% drempel)

> Word Wizard is een sterke missie met uitstekende didactische opbouw en een waardevolle impliciete leerlijn (kopstijlen → inhoudsopgave). Hardcoded kleuren en een ontbrekende verificatievraag zijn kleine aandachtspunten. Direct inzetbaar in de pilot.

---

### Actielijst

#### Verbeterpunten (score 3-4 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 2. Visueel | Hardcoded hex-waarden in `year1.tsx` en `word-wizard.ts` vervangen door `lab-*` tokens | Laag |
| 2 | 6. Interactiviteit | VerificationQuestion toevoegen aan stap 3 (Afbeelding invoegen): "Wat is het verschil tussen tekstomloop 'Strak' en 'In lijn met tekst'?" | Laag |
| 3 | 9. Toegankelijkheid | Lange instructiezinnen in stap 3 opsplitsen in kortere stappen of opsomming | Laag |

#### Nice-to-haves

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 4. Inhoudelijke correctheid | Korte disclaimer toevoegen: "Op sommige iPad-versies van Word kan de inhoudsopgave-optie iets anders heten" |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
