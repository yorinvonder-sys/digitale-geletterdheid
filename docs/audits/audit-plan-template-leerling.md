# Audit Template — Missies vanuit Leerlingperspectief

**Platform:** DGSkills — Digitale geletterdheid VO  
**Doelgroep:** Leerlingen 12-18 jaar, leerjaar 1-6  
**Doel van dit template:** Beoordeel elke missie op kwaliteit, bruikbaarheid en didactische waarde **vanuit het perspectief van de leerling**. Gebruik dit template voor handmatige audits en voor geautomatiseerde batch-audits door Claude.

**Goudstandaard-missies (referentie bij twijfel):**
- `data-verzamelaar` — solide basis, goede didactische opbouw
- `network-navigator` — sterke interactiviteit en scaffolding
- `privacy-by-design` — **de ultieme referentie**: uitzonderlijke didactische flow, rijke AI-coaching, volledige SLO-aansluiting

---

## Hoe te gebruiken

### Handmatige audit (één missie)

1. Kopieer het blok onder **"Template (kopieer per missie)"**.
2. Vul de metadata in.
3. Open de bijbehorende bronbestanden (zie per dimensie welke bestanden relevant zijn).
4. Vul voor elke dimensie de score (1-5) en opmerkingen in.
5. Bereken het gewogen totaal en bepaal het verdict.
6. Noteer blokkerende issues, verbeterpunten en nice-to-haves.
7. Sla op als `docs/audits/leerling-audit/[missie-id].md`.

### Geautomatiseerde batch-audit (Claude)

Zie de **Batch-audit workflow** onderaan dit document. Claude kan dit template autonoom invullen voor alle missies in de registry.

### Scoringsnorm

Gebruik `privacy-by-design` als ijkpunt voor score 5. Als een element beter of gelijkwaardig is aan die missie, geef een 5. Als het duidelijk achterblijft maar functioneel is, geef een 3.

---

## Template (kopieer per missie)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | |
| **Titel** | |
| **Leerjaar & Periode** | bijv. Leerjaar 1, Periode 2 |
| **Template-engine** | ScenarioEngine / PuzzleLab / SimulationLab / ReviewArena / BuilderCanvas / DataViewer / DebateArena / ToolGuide / Standalone |
| **SLO-kerndoelen** | bijv. DG-K1.2, DG-K3.1 |
| **Auditdatum** | YYYY-MM-DD |
| **Auditor** | naam of "Claude (geautomatiseerd)" |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [ ] `introTitle` aanwezig en begrijpelijk voor de doelgroep
- [ ] `introDescription` geeft een concrete, begrijpelijke opdracht
- [ ] Emoji of visueel element past bij het thema
- [ ] Moeilijkheidsgraad is zichtbaar of voelbaar uit de intro

**Bronbestanden:** `introTitle`, `introDescription`, `introEmoji` in de missie-config

**Score:** __ / 5

**Opmerkingen:**
> _Noteer hier wat goed werkt en wat verbeterd kan worden._

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [ ] Geen afgebroken of afgekapte teksten
- [ ] Kleuren zijn consistent met `lab-*` tokens (geen hardcoded hex)
- [ ] Animaties zijn niet afleidend of overweldigend
- [ ] Responsive op minimaal 375 px breed (mobiel)

**Bronbestanden:** Template component + Tailwind classes in de missie-config

**Score:** __ / 5

**Opmerkingen:**
> _Noteer hier wat goed werkt en wat verbeterd kan worden._

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [ ] Logische opbouw van eenvoudig naar complex
- [ ] Elke stap bouwt aantoonbaar voort op de vorige
- [ ] Moeilijkheid past bij het leerjaar (J1 = toegankelijker, J3 = complexer)
- [ ] Geen onverklaard vakjargon of plotselinge sprongen in complexiteit

**Bronbestanden:** `steps[]` of `rounds[]` in de config, `systemInstruction` van de agent

> **Let op:** Deze dimensie telt dubbel mee in het eindtotaal.

**Score:** __ / 5

**Opmerkingen:**
> _Noteer hier wat goed werkt en wat verbeterd kan worden._

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [ ] Informatie is feitelijk correct
- [ ] Geen typografische fouten of spelfouten
- [ ] Taalgebruik past bij de leeftijdsgroep (niet te formeel, niet te kinderachtig)
- [ ] Geen Engelse termen waar goed Nederlands beschikbaar is
- [ ] Terminologie consistent door de hele missie

**Bronbestanden:** Alle tekstvelden in de missie-config + de agent-role definitie

> **Let op:** Deze dimensie telt dubbel mee in het eindtotaal.

**Score:** __ / 5

**Opmerkingen:**
> _Noteer hier wat goed werkt en wat verbeterd kan worden._

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie (vaag → concreet → antwoord)? Past de toon bij de doelgroep?

**Checkpunten:**
- [ ] `systemInstruction` is minimaal 500 tekens lang (oppervlakkige instructies geven slechte coaching)
- [ ] EERSTE BERICHT is aanwezig en heet de leerling goed welkom
- [ ] STEP_COMPLETE markers zijn aanwezig voor alle drie stappen (3/3)
- [ ] Verificatievragen aanwezig: AI vraagt door in plaats van direct antwoord te geven
- [ ] Toon past bij de rolnaam en het thema
- [ ] Farming-detectie actief: herhaling of afhankelijkheid van AI wordt ontmoedigd

**Bronbestanden:** `systemInstruction` in de agent-config, `SYSTEM_INSTRUCTION_SUFFIX` in `config/agents/shared.tsx`

**Score:** __ / 5

**Opmerkingen:**
> _Noteer hier wat goed werkt en wat verbeterd kan worden._

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [ ] Interactietype past bij het leerdoel (quiz voor kennis, bouwopdracht voor vaardigheid)
- [ ] Voldoende variatie in vraag- of taaktypes om betrokkenheid vast te houden
- [ ] Feedback op foute antwoorden is leerzaam, niet alleen "Fout, probeer opnieuw"
- [ ] Het element werkt technisch zonder zichtbare bugs of haperingen

**Bronbestanden:** Template component + config

**Score:** __ / 5

**Opmerkingen:**
> _Noteer hier wat goed werkt en wat verbeterd kan worden._

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [ ] Completion-criteria zijn helder voor de leerling
- [ ] Badges hebben betekenisvolle namen (niet generiek als "Voltooier")
- [ ] Scoredrempels zijn realistisch: niet te makkelijk (leeg gevoel) en niet te moeilijk (frustratie)
- [ ] `takeaways[]` vatten de kernlessen samen in begrijpelijke taal

**Bronbestanden:** `badges[]`, `maxScore`, `takeaways[]`, `goalCriteria` in de config

**Score:** __ / 5

**Opmerkingen:**
> _Noteer hier wat goed werkt en wat verbeterd kan worden._

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [ ] Inhoud matcht het geclaimde SLO-kerndoel aantoonbaar
- [ ] Geen conflict tussen `curriculum.ts` en `slo-kerndoelen-mapping.ts`
- [ ] Het leerdoel is toetsbaar geformuleerd (niet alleen "kennismaken met", maar "kunnen uitleggen" of "kunnen toepassen")

**Bronbestanden:** `config/curriculum.ts`, `config/slo-kerndoelen-mapping.ts` tegenover de daadwerkelijke missie-inhoud

**Score:** __ / 5

**Opmerkingen:**
> _Noteer hier wat goed werkt en wat verbeterd kan worden._

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [ ] Leesniveau past bij het leerjaar (gebruik Flesch-Kincaid als richtlijn)
- [ ] Alt-teksten aanwezig op alle niet-decoratieve afbeeldingen
- [ ] Alle interactieve elementen bereikbaar en bedienbaar met toetsenbord
- [ ] Kleurcontrast voldoet aan WCAG AA (minimaal 4,5:1 voor normale tekst)
- [ ] Informatie wordt niet uitsluitend via kleur overgebracht

**Bronbestanden:** Component code

**Score:** __ / 5

**Opmerkingen:**
> _Noteer hier wat goed werkt en wat verbeterd kan worden._

---

### Scoretabel

```
| Dimensie                          | Score (1-5) | Gewogen | Opmerkingen |
|-----------------------------------|-------------|---------|-------------|
| 1. Eerste indruk                  |             | ×1      |             |
| 2. Visueel                        |             | ×1      |             |
| 3. Didactische flow               |             | ×2      |             |
| 4. Inhoudelijke correctheid       |             | ×2      |             |
| 5. AI-coach kwaliteit             |             | ×1      |             |
| 6. Interactiviteit                |             | ×1      |             |
| 7. Afronding & feedback           |             | ×1      |             |
| 8. SLO-aansluiting                |             | ×1      |             |
| 9. Toegankelijkheid               |             | ×1      |             |
| **TOTAAL**                        |             | **/ 55**|             |
```

### Score-uitleg

| Score | Betekenis |
|-------|-----------|
| **5** | Uitstekend — Referentiekwaliteit (vergelijkbaar met `privacy-by-design`) |
| **4** | Goed — Kleine verbeterpunten, inzetbaar zoals het is |
| **3** | Voldoende — Werkt, maar kan duidelijk beter |
| **2** | Matig — Significante verbeterpunten nodig vóór inzet |
| **1** | Onvoldoende — Blokkerende issues, missie nu niet inzetbaar |

### Gewogen totaal berekenen

```
Gewogen totaal = (D1 × 1) + (D2 × 1) + (D3 × 2) + (D4 × 2) + (D5 × 1) + (D6 × 1) + (D7 × 1) + (D8 × 1) + (D9 × 1)
Maximum = 55 punten  (7 enkelvoudige dimensies × 5) + (2 dubbele dimensies × 5 × 2)
Percentage = (gewogen totaal / 55) × 100%
```

### Verdict

| Percentage | Verdict |
|------------|---------|
| **≥ 80%** (≥ 44 / 55) | ✅ Klaar voor pilot |
| **60–79%** (33–43 / 55) | ⚠️ Needs work — verbeterpunten oplossen voor inzet |
| **< 60%** (< 33 / 55) | ❌ Niet inzetbaar — blokkerende issues eerst oplossen |

**Verdict voor deze missie:** ___

---

### Actielijst

#### Blokkerende issues (score 1-2 — oplossen vóór inzet)

| # | Dimensie | Beschrijving | Verantwoordelijk |
|---|----------|--------------|-----------------|
| 1 | | | |

#### Verbeterpunten (score 3 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | | | Hoog / Medium |

#### Nice-to-haves (score 4 — optioneel, verbetert kwaliteit)

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | | |

---

## Batch-audit workflow (geautomatiseerd door Claude)

Gebruik deze werkwijze als je Claude vraagt om alle missies in één keer te auditten.

### Stappen

1. **Lees de missie-registry**
   - Open `config/templateRegistry.ts`
   - Haal de lijst van alle missies op met hun template-engine en missie-ID

2. **Lees de agent-definities**
   - Open `config/agents/year1.tsx`, `year2.tsx`, `year3.tsx`
   - Noteer welke agent-role bij welke missie hoort

3. **Per missie: verzamel de bronbestanden**
   - Missie-config (introTitle, introDescription, steps/rounds, badges, takeaways, etc.)
   - Agent-role met systemInstruction
   - Template component (ScenarioEngine.tsx, PuzzleLab.tsx, etc.)

4. **Vul dit template in**
   - Kopieer het template-blok hierboven
   - Beoordeel elke dimensie op basis van de bronbestanden
   - Bereken het gewogen totaal en bepaal het verdict
   - Noteer alle actiepunten

5. **Sla het resultaat op**
   - Schrijf het ingevulde template naar `docs/audits/leerling-audit/[missie-id].md`
   - Gebruik kebab-case voor de bestandsnaam (gelijk aan de missie-ID)

6. **Update de samenvattingstabel**
   - Open of maak `docs/audits/leerling-audit/README.md`
   - Voeg een rij toe aan de samenvattingstabel met:
     - Missie-ID, Titel, Template-engine, Score, Percentage, Verdict, Datum

### Samenvattingstabel format (voor README.md)

```markdown
| Missie ID | Titel | Template | Score | % | Verdict | Datum |
|-----------|-------|----------|-------|---|---------|-------|
| privacy-by-design | Privacy by Design | ScenarioEngine | 52/55 | 95% | ✅ Klaar | 2026-04-03 |
```

### Prioriteringsvolgorde

Audit in deze volgorde voor maximale pilotgereedheid:
1. Missies van leerjaar 1 (eerste groep pilotleerlingen)
2. Missies met een score-verwachting laag (bekend problematisch)
3. Overige missies op volgorde van templateRegistry.ts

### Goudstandaard als vergelijkingspunt

Gebruik bij twijfel de volgende referentie-scores:

| Missie | Verwachte score | Reden |
|--------|-----------------|-------|
| `privacy-by-design` | 50-55 / 55 | Ultieme referentie — rijkste inhoud, beste AI-coaching |
| `network-navigator` | 44-50 / 55 | Sterke interactiviteit, goede scaffolding |
| `data-verzamelaar` | 40-46 / 55 | Solide basis, aandachtspunt: variatie in vraagtypen |

---

_Template versie 1.0 — aangemaakt 2026-04-03_
_Onderdeel van de DGSkills kwaliteitsborging voor de pilotfase_
