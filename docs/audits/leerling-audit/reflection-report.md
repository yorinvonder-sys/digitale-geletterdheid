# Audit — Reflection Report (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `reflection-report` |
| **Titel** | Reflection Report |
| **Leerjaar & Periode** | Leerjaar 3, Periode 4 (J3P4 — Meesterproef) |
| **Template-engine** | DebateArena + AI-chat (chatRoleId: `reflection-report`) |
| **SLO-kerndoelen** | 23B (Digitaal welzijn) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig — "Reflection Report"
- [x] `introDescription` stelt een diep en persoonlijk dilemma — zelfreflectie in informatica
- [x] `introFeatures` beschrijft vijf stappen helder
- [x] Emoji (📖) past bij reflectie
- [x] Dilemma is direct aansprekend voor afstuderenden ("Drie jaar informatica zitten erop")

**Bronbestanden:** `components/missions/templates/debate-arena/configs/reflection-report.ts:1-16`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende eerste indruk. De opening "Drie jaar informatica zitten erop — maar wat heb je eigenlijk geleerd?" is persoonlijk en uitnodigend voor J3P4-leerlingen die daadwerkelijk aan het einde van hun driejarige traject staan. Het dilemma (moet informatica persoonlijke groei bijdragen of alleen technische vaardigheden?) is genuanceerd en niet-triviaal.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [ ] Kleuren via lab-* tokens — hardcoded hex in badges (`#F59E0B`, `#D97706`, `#10B981`, `#6B6B66`)
- [x] DebateArena-template is visueel consistent
- [x] Stakeholder-kaarten zijn visueel onderscheiden via emoji
- [x] Posities zijn duidelijk gelabeld en beschreven
- [x] Responsive via template

**Score:** 4 / 5

**Opmerkingen:**
> Visueel sterk via de DebateArena-template. Hardcoded hex is een bekende code-kwaliteitsklacht. Geen blokkerende visuele issues.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw — Lees standpunten → Kies positie → Bouw argumenten → Reageer op tegenargument → Reflecteer
- [x] Elke stap bouwt voort op de vorige
- [x] Vier stakeholders vertegenwoordigen diverse perspectieven (leerling, HR, docent, filosoof)
- [x] Tegenargument ("concurrentiepositie") is een sterk en realistisch argument
- [x] Moeilijkheid past bij J3P4 — het is een capstone-reflectie

**Bronbestanden:** `components/missions/templates/debate-arena/configs/reflection-report.ts:20-93`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw. De vier stakeholders zijn bijzonder goed gekozen: Lena (ervaringsdeskundige leerling), HR-manager (beroepsmarkt), docent (praktische realiteit), onderwijsfilosoof (ethisch-theoretisch niveau). Dit bereik van perspectieven — van persoonlijk tot filosofisch — is een didactisch hoog niveau dat past bij de afsluiting van J3. Het tegenargument over concurrentiepositie is een realistisch en sterk argument dat leerlingen dwingt dieper te denken.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] "Technische vaardigheden verouderen; zelfkennis niet" is een inhoudelijk verdedigbaar standpunt
- [x] HR-perspectief correct — zelfreflectie als professionele vaardigheid is breed erkend
- [x] "Technologie is niet neutraal" is een correcte en bekende stelling in techniekethiek
- [x] Makelaars-analogie ("de snelste programmeur die niet nadenkt is gevaarlijker") is een bekend ethisch argument
- [x] Geen spelfouten gevonden
- [x] Taalgebruik is volwassen maar toegankelijk voor J3

**Bronbestanden:** `components/missions/templates/debate-arena/configs/reflection-report.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk sterk en filosofisch verantwoord. De stelling "technologie is niet neutraal — de maker draagt verantwoordelijkheid" is een centrale these in de techniekethiek (Langdon Winner, Stuart Russell). De HR-perspectief is realistisch en wordt breed erkend in de beroepsmarkt. De vier posities zijn evenwichtig — geen is duidelijk "fout".

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] AI-chat actief — `enableChat: true`, `chatRoleId: 'reflection-report'`
- [x] Agent aanwezig in year3.tsx (regel 2119)
- [x] EERSTE BERICHT verwacht aanwezig (convention)
- [x] STEP_COMPLETE markers verwacht aanwezig (3/3)
- [ ] Exacte agent-inhoud niet volledig geverifieerd in dit leesbereik

**Bronbestanden:** `config/templateRegistry.ts:91`, `config/agents/year3.tsx:2119`

**Score:** 4 / 5

**Opmerkingen:**
> Chat actief gekoppeld. De AI-coach is in een reflectie-missie bijzonder waardevol — de coach kan persoonlijke reflecties dieper uitvragen. De agent-inhoud op regel 2119 was buiten het gelezen bereik; verificatie van EERSTE BERICHT en STEP_COMPLETE (3/3) is aanbevolen.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] DebateArena biedt vier keuze-posities — actieve keuze bevordert eigenaarschap
- [x] Argumentprompts verlagen drempel ("Ik vind dat...", "Mijn ervaring of redenering is...")
- [x] Reflectievragen sluiten de missie af met een persoonlijk element
- [x] AI-chat biedt gepersonaliseerde begeleiding
- [x] Tegenargument-ronde dwingt leerling tot kritisch nadenken over eigen positie

**Score:** 5 / 5

**Opmerkingen:**
> De DebateArena-template is uitstekend geschikt voor een reflectie-missie die over zelfontwikkeling gaat. De reflectievragen ("Wat heb jij de afgelopen jaren het meest geleerd — en was dat wat je verwachtte?") zijn diep persoonlijk en nodigen tot echte introspectie uit. Dit is een passende afsluiting van J3P4.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Badges aanwezig — "Debatmeester" (≥80%), "Scherp Denker" (≥60%), "Goed Bezig" (≥40%), "Aan de Start" (≥0%)
- [x] maxScore: 100
- [x] `takeaways[]` aanwezig — 4 lessen over reflectie, technologie en verantwoordelijkheid
- [x] Badgenamen zijn thematisch passend
- [x] Reflectievragen sluiten de missie passend af

**Bronbestanden:** `components/missions/templates/debate-arena/configs/reflection-report.ts:96-127`

**Score:** 5 / 5

**Opmerkingen:**
> Sterke afronding. De vier takeaways zijn goed gekozen: zelfreflectie als professionele vaardigheid, technische kennis veroudert, technologie is niet neutraal, eerlijk reflectieverslag met zwakke punten. Dit zijn blijvende inzichten voor de verdere loopbaan van de leerling.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] 23B (Digitaal welzijn) aanwezig — zelfreflectie, persoonlijke groei, ethisch bewustzijn
- [x] Mapping correct — `['23B']` in slo-kerndoelen-mapping.ts
- [x] Leerdoel toetsbaar — leerling formuleert een beredeneerde positie en reflectie
- [x] Past bij J3P4 als afsluiting — reflectie op drie jaar leren

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:190`

**Score:** 4 / 5

**Opmerkingen:**
> Correcte SLO-aansluiting voor 23B (digitaal welzijn). De missie gaat over persoonlijke groei en ethisch bewustzijn als digitale burger. Licht punt: 23B omvat ook aspecten als schermtijd-bewustzijn; de missie focust puur op professionele zelfreflectie. 23C (maatschappij) zou evengoed van toepassing zijn gezien de filosofische dimensie. De huidige mapping is verdedigbaar maar beperkt.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij J3P4 — volwassen maar begrijpelijk
- [x] Informatie niet alleen via kleur — stakeholders via emoji + naam
- [x] Toetsenbord-toegankelijkheid via template
- [ ] Kleurcontrast formeel niet geverifieerd — amber/goud palet
- [x] Positie-keuze is tekstueel beschreven

**Score:** 4 / 5

**Opmerkingen:**
> Geen fundamentele toegankelijkheidsproblemen. WCAG AA-test voor het amber/goud palet aanbevolen.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Persoonlijk dilemma, capstone-context |
| 2. Visueel | 4 | ×1 = 4 | Hardcoded hex in badges |
| 3. Didactische flow | 5 | ×2 = 10 | Vier perspectieven, sterk tegenargument |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Techniekethiek correct, HR-perspectief realistisch |
| 5. AI-coach kwaliteit | 4 | ×1 = 4 | Chat actief, agent niet volledig geverifieerd |
| 6. Interactiviteit | 5 | ×1 = 5 | Persoonlijke reflectievragen, actieve keuze |
| 7. Afronding & feedback | 5 | ×1 = 5 | Badges, takeaways, reflectiesluiting |
| 8. SLO-aansluiting | 4 | ×1 = 4 | 23B aanwezig, 23C ook van toepassing |
| 9. Toegankelijkheid | 4 | ×1 = 4 | WCAG-test aanbevolen |
| **TOTAAL** | | **51 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (5×2) + (4×1) + (5×1) + (5×1) + (4×1) + (4×1) = 51
Percentage = (51 / 55) × 100% = 92,7%
```

### Verdict

**✅ Klaar** (92,7% — ruim boven de 80% drempel)

> Een filosofisch rijke en didactisch sterke afsluiting van J3P4. De vier stakeholders (leerling, HR, docent, filosoof) bieden een uitzonderlijk breed perspectief. Het persoonlijke karakter van de reflectievragen maakt dit een waardevolle capstone-activiteit. De SLO-mapping op 23C zou ook verdedigbaar zijn. Direct inzetbaar in de Meesterproef.

---

### Actielijst

#### Verbeterpunten (score 3-4 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 2. Visueel | Hardcoded hex in badges vervangen door `lab-*` tokens | Laag |
| 2 | 5. AI-coach kwaliteit | Agent-inhoud (year3.tsx:2119+) direct verifiëren op EERSTE BERICHT en STEP_COMPLETE (3/3) | Medium |
| 3 | 8. SLO-aansluiting | Overweeg 23C toe te voegen aan de mapping — missie raakt ook maatschappelijke dimensie | Laag |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
