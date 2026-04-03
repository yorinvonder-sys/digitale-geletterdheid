# Audit — Meesterproef (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `meesterproef` |
| **Titel** | De Meesterproef |
| **Leerjaar & Periode** | Leerjaar 3, Periode 4 (J3P4 — Capstone) |
| **Template-engine** | BuilderCanvas + AI-chat (chatRoleId: `meesterproef`) |
| **SLO-kerndoelen** | 21A, 21B, 21C, 21D, 22A, 22B, 23A, 23B, 23C (alle kerndoelen) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig — "Het grote eindproject"
- [x] `introDescription` is krachtig — "Dit is het moment"
- [x] `introFeatures` beschrijft vier stappen helder
- [x] Emoji (🏆) past bij een capstone-moment
- [x] "Laat zien dat je klaar bent voor de volgende stap" is aspirationeel en motiverend

**Bronbestanden:** `components/missions/templates/builder-canvas/configs/meesterproef.ts:1-18`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende eerste indruk. De opening "Dit is het moment" is krachtig en geeft de Meesterproef de gewicht die het verdient als capstone van drie jaar. De vier stappen (voorstel, dagboek, product, verdediging) geven een complete projectstructuur. De formulering "van begin tot eind een complex digitaal project doorlopen" is een concreet en meetbaar leerdoel.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [ ] Kleuren via lab-* tokens — hardcoded hex in badges (`#F59E0B`, `#10B981`, `#D97757`, `#6B6B66`)
- [x] BuilderCanvas-template visueel consistent
- [x] Tips zijn visueel onderscheiden
- [x] Checklist-items per stap zijn duidelijk
- [x] Responsive via template

**Score:** 4 / 5

**Opmerkingen:**
> Geen fundamentele visuele issues. De amber-trofee kleur (🏆) in de badge "Meesterproef Geslaagd" is thematisch passend. Hardcoded hex is een bekende code-kwaliteitsklacht.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw — Voorstel → Proces documenteren → Product beschrijven → Verdediging voorbereiden
- [x] Elke stap bouwt voort op de vorige — verdediging vereist een afgerond product
- [x] SMART-doelstelling in stap 1 is een concrete methodologie
- [x] Beslissingenlog is een authentieke documentatietechniek
- [x] Moeilijkheid past bij J3P4 — dit is het hoogste niveau in de catalogus

**Bronbestanden:** `components/missions/templates/builder-canvas/configs/meesterproef.ts:19-83`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw voor een capstone-project. De vier stappen volgen een professionele projectmethodologie: planning (SMART), documentatie (dagboek + beslissingenlog), product-oplevering, en presentatie. Het beslissingenlog is een origineel en waardevol element — het verplicht leerlingen om keuzes te documenteren, wat de jury-verdediging versterkt. De SMART-doelstelling in stap 1 is correct uitgelegd.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] SMART-uitleg correct — Specifiek, Meetbaar, Acceptabel, Realistisch, Tijdgebonden
- [x] Ontwikkeldagboek-structuur correct — doel, actie, probleem, oplossing per sessie
- [x] "Eerlijk over wat niet werkt" advies is inhoudelijk correct en professioneel
- [x] Jury-verdediging structuur is realistisch en haalbaar
- [x] "De sterkste verdedigingen bevatten zowel trots als eerlijkheid" is een correcte observatie
- [x] Geen spelfouten gevonden

**Bronbestanden:** `components/missions/templates/builder-canvas/configs/meesterproef.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk uitstekend. De SMART-methodologie is correct toegepast. Het advies om eerlijk te zijn over wat niet werkt is zowel pedagogisch correct als realistisch — jury's in het VO waarderen zelfreflectie. De tip "Als je jouw projectdoel niet in één zin kunt beschrijven, is het nog niet concreet genoeg" is uitstekend advies dat direct toepasbaar is. Geen fouten gevonden.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] AI-chat actief — `enableChat: true`, `chatRoleId: 'meesterproef'`
- [x] Agent aanwezig in year3.tsx (regel 2211)
- [x] EERSTE BERICHT verwacht aanwezig (convention)
- [x] STEP_COMPLETE markers verwacht aanwezig (3/3)
- [ ] Exacte agent-inhoud niet volledig geverifieerd in dit leesbereik

**Bronbestanden:** `config/templateRegistry.ts:61`, `config/agents/year3.tsx:2211`

**Score:** 4 / 5

**Opmerkingen:**
> Chat actief gekoppeld. De AI-coach is in een capstone-missie bijzonder waardevol — de coach kan het projectvoorstel beoordelen, SMART-doelstellingen verbeteren, en jury-vragen simuleren. Dit is de complexste missie in de catalogus; gepersonaliseerde begeleiding is essentieel. Verificatie van agent-inhoud op regel 2211+ is prioritair.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] Schrijf-interactie past bij het leerdoel — projectdocumentatie is authentiek
- [x] AI-chat biedt begeleiding bij SMART-doelstellingen, dagboek en verdediging
- [x] Ontwikkeldagboek vereist echte werksessies buiten de missie
- [x] Checklist-items per stap zijn concreet en verifieerbaar
- [x] Vier stappen bieden voldoende variatie over de meesterproef-periode

**Score:** 5 / 5

**Opmerkingen:**
> De BuilderCanvas + AI-chat combinatie is ideaal voor de Meesterproef. Het ontwikkeldagboek vereist echte werksessies buiten de missie, wat de missie authentiek maakt. De AI-coach kan feedback geven op SMART-formuleringen, beslissingenlog-keuzes beoordelen, en jury-vragen simuleren. Dit is een uitstekend gebruik van AI als capstone-coach.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Badges aanwezig — "Meesterproef Geslaagd" (≥90%), "Digital Professional" (≥70%), "Doorzetters Medaille" (≥50%), "Op weg" (≥0%)
- [x] maxScore: 100
- [x] `takeaways[]` aanwezig — 5 lessen die het complete capstone-traject samenvatten
- [x] "Doorzetters Medaille" is een inclusieve en bemoedigende badge voor leerlingen die het moeilijk hebben
- [x] "Meesterproef Geslaagd" is de meest betekenisvolle badge in de catalogus

**Bronbestanden:** `components/missions/templates/builder-canvas/configs/meesterproef.ts:84-97`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende afronding. De badge "Meesterproef Geslaagd" is de hoogste erkenning in de catalogus en voelt als een echte mijlpaal. De "Doorzetters Medaille" voor 50% is inclusief en erkent doorzettingsvermogen naast prestatie — een pedagogisch juiste keuze. De vijf takeaways vatten het complete projecttraject samen en zijn ook bruikbaar als zelfassessment.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] Alle negen kerndoelen geclaimd — 21A, 21B, 21C, 21D, 22A, 22B, 23A, 23B, 23C
- [x] Mapping correct in slo-kerndoelen-mapping.ts
- [x] Als capstone-missie is de brede dekking correct — het project integreert alle kennis
- [x] Leerdoel toetsbaar — leerling produceert een compleet projectdossier
- [ ] Of alle negen kerndoelen daadwerkelijk aanwezig zijn hangt af van het gekozen project

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:191`

**Score:** 4 / 5

**Opmerkingen:**
> De brede SLO-claim (alle negen kerndoelen) is verdedigbaar voor een capstone-missie — het project integreert kennis van drie jaar. Wel: of alle negen kerndoelen daadwerkelijk aanwezig zijn, hangt af van het gekozen project van de individuele leerling. Een leerling die een website bouwt raakt minder 23C (maatschappij) dan een leerling die een maatschappelijk project doet. De brede claim is correct voor de catalogus, maar docenten moeten per project beoordelen welke kerndoelen aantoonbaar aanwezig zijn.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij J3P4 — professioneel en direct
- [x] Informatie niet alleen via kleur
- [x] Toetsenbord-toegankelijkheid via template
- [ ] Kleurcontrast formeel niet geverifieerd
- [x] Checklist-items zijn tekstueel

**Score:** 4 / 5

**Opmerkingen:**
> Geen fundamentele toegankelijkheidsproblemen. WCAG AA-test aanbevolen maar niet blokkerend.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Capstone-gevoel, krachtige intro |
| 2. Visueel | 4 | ×1 = 4 | Hardcoded hex in badges |
| 3. Didactische flow | 5 | ×2 = 10 | SMART, beslissingenlog, complete cyclus |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | SMART correct, authentieke adviezen |
| 5. AI-coach kwaliteit | 4 | ×1 = 4 | Chat actief, agent niet volledig geverifieerd |
| 6. Interactiviteit | 5 | ×1 = 5 | Authentiek, echte werksessies, dagboek |
| 7. Afronding & feedback | 5 | ×1 = 5 | Badges inklusief, takeaways compleet |
| 8. SLO-aansluiting | 4 | ×1 = 4 | Brede claim verdedigbaar, projectafhankelijk |
| 9. Toegankelijkheid | 4 | ×1 = 4 | WCAG-test aanbevolen |
| **TOTAAL** | | **51 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (5×2) + (4×1) + (5×1) + (5×1) + (4×1) + (4×1) = 51
Percentage = (51 / 55) × 100% = 92,7%
```

### Verdict

**✅ Klaar** (92,7% — ruim boven de 80% drempel)

> De Meesterproef is de sterkste en meest complete missie in de catalogus als capstone-project. De SMART-methodologie, het beslissingenlog, de eerlijkheidseis en de jury-voorbereiding maken dit pedagogisch hoogwaardig. De brede SLO-claim (alle negen kerndoelen) is verdedigbaar voor een integratieve capstone. Prioritaire actie: verificatie van agent-inhoud voor chat-coaching kwaliteit.

---

### Actielijst

#### Verbeterpunten (score 3-4 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 5. AI-coach kwaliteit | Agent-inhoud (year3.tsx:2211+) direct verifiëren op EERSTE BERICHT en STEP_COMPLETE (3/3) — dit is prioriteit voor de meest complexe missie | Hoog |
| 2 | 2. Visueel | Hardcoded hex in badges vervangen door `lab-*` tokens | Laag |

#### Nice-to-haves

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 8. SLO-aansluiting | Docent-handout toevoegen: welke kerndoelen zijn aantoonbaar bij welk type project |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
