# Audit — Web Developer (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `web-developer` |
| **Titel** | Web Developer |
| **Leerjaar & Periode** | Leerjaar 2, Periode 2 |
| **Template-engine** | BuilderCanvas (enableChat: true) |
| **SLO-kerndoelen** | 22A, 22B |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig — "Bouw een interactieve webpagina"
- [x] `introDescription` concreet en activerend
- [x] Dierenasiel-context is herkenbaar en motiveert ("adoptieaanvragen missen")
- [x] Moeilijkheidsgraad "Medium" zichtbaar, passend voor J2

**Bronbestanden:** `config/agents/year2.tsx:685-765`, `components/missions/templates/builder-canvas/configs/web-developer.ts`

**Score:** 5 / 5

**Opmerkingen:**
> De context (dierenasiel zonder website) is goed gekozen: realistisch, motiverend en begrijpelijk voor 13-14-jarigen. De EERSTE BERICHT-aanpak ("Type dit in je editor en vertel me wat je ziet") is direct hands-on. De vier fasen (Structuur → Styling → Interactiviteit → Testen) zijn duidelijk gestructureerd.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] BuilderCanvas-template biedt consistente visuele structuur
- [x] Blauw kleurthema consistent door missie
- [ ] Hardcoded hex-kleur `#2563EB` in visualPreview
- [x] Template-gebaseerde layout zorgt voor consistente UX

**Bronbestanden:** `config/agents/year2.tsx:697-703`

**Score:** 4 / 5

**Opmerkingen:**
> De BuilderCanvas-template zorgt voor structurele visuele consistentie. De visualPreview gebruikt hardcoded `#2563EB` in plaats van lab-* tokens. Verder is de visuele presentatie solide dankzij de template-engine.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw — HTML → CSS → JS is de canonieke volgorde voor webdev
- [x] Vier fasen in BuilderCanvas: "Paginastructuur plannen", "Layout en stijl ontwerpen", "Interactiviteit toevoegen", "Testen en verbeteren"
- [x] Elke stap bouwt aantoonbaar voort op de vorige
- [x] Moeilijkheidsgraad "Medium" — HTML/CSS/JS voor J2 is passend
- [x] SCOPE GUARD houdt leerlingen weg van frameworks (React, Vue)

**Bronbestanden:** `config/agents/year2.tsx:747-763`, template BuilderCanvas

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw. De huismetafoor (HTML = muren, CSS = verf, JS = elektriciteit) is een bewezen pedagogische aanpak. De vier fasen in de BuilderCanvas zijn goed gesequenced. De SCOPE GUARD is precies goed: "Frameworks zijn cool, maar die bouwen op wat we nu doen."

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Technisch correct — HTML/CSS/JS-lagen correct beschreven
- [x] "Geef ALTIJD de volledige HTML" — goede didactische keuze voor beginners
- [x] Taalgebruik passend — "Laten we dit direct uitproberen!" is J2-friendly
- [x] STEP_COMPLETE criteria technisch correct geformuleerd
- [x] Geen spelfouten of feitelijke fouten gevonden

**Bronbestanden:** `config/agents/year2.tsx:704-746`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk sterk. De instructie "Geef NOOIT '...' of '// rest van de code'" is een uitstekende praktijkregel die voorkomt dat leerlingen gedeeltelijke code krijgen. De drie STEP_COMPLETE-criteria zijn helder en toetsbaar. Het EERSTE BERICHT bevat werkende code die leerlingen direct kunnen testen.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` minimaal 500 tekens — ~1200 tekens
- [x] EERSTE BERICHT aanwezig — "Welkom bij Web Dev Academy!"
- [x] STEP_COMPLETE markers aanwezig (3/3) — HTML structuur, CSS, JS interactie
- [x] Verificatiecriteria helder per stap
- [x] SCOPE GUARD aanwezig en relevant

**Bronbestanden:** `config/agents/year2.tsx:704-746`

**Score:** 5 / 5

**Opmerkingen:**
> Alle essentiële elementen aanwezig. De STEP_COMPLETE criteria zijn concreet verifieerbaar: "minimaal een heading, paragraaf en link/afbeelding" voor stap 1. De toon (enthousiast en hands-on) past goed bij webdev. Het EERSTE BERICHT geeft direct werkende code om te testen.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] BuilderCanvas biedt een canvas-omgeving voor het bouwen
- [x] Chat-component met AI-coach is geïntegreerd
- [x] Vier fasen bieden structuur voor het bouwproces
- [x] maxScore: 100 met badge-systeem

**Bronbestanden:** `components/missions/templates/builder-canvas/configs/web-developer.ts`

**Score:** 4 / 5

**Opmerkingen:**
> De BuilderCanvas met geïntegreerde AI-chat is een goede combinatie voor webdev. Leerlingen bouwen actief terwijl ze de AI om hulp kunnen vragen. De vier fasen bieden voldoende structuur. Punt van aandacht: de BuilderCanvas is primair een schrijfomgeving, geen echte code-editor met live preview — leerlingen moeten code kopiëren naar een externe editor. Dit is een bekende beperking van de template.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Badges aanwezig (4) — "Full Stack Hero" (90%), "Web Developer" (70%), "Code Knutselaar" (50%), "Op weg"
- [x] maxScore: 100
- [x] takeaways aanwezig in BuilderCanvas-config
- [x] Badge "Full Stack Hero" bij 90% is ambitieus maar motiverend

**Bronbestanden:** `components/missions/templates/builder-canvas/configs/web-developer.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Volledige afrondingsstructuur. De badge-namen zijn leuk en motiverend voor de doelgroep. "Full Stack Hero" is een term die leerlingen kennen en aspireren.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] SLO 22A (Digitale vaardigheden) — correct, HTML/CSS zijn digitale basisvaardigheden
- [x] SLO 22B (Programmeren) — correct, JavaScript-interactiviteit is programmeren
- [x] Beide kerndoelen worden feitelijk aangeraakt in de missie
- [x] Geen conflict tussen mapping en feitelijke content

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:109`

**Score:** 5 / 5

**Opmerkingen:**
> Beide SLO-kerndoelen zijn goed vertegenwoordigd. 22A via HTML/CSS structuur en ontwerp; 22B via JavaScript DOM-manipulatie. De missie-inhoud en SLO-mapping zijn consistent.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau passend voor J2
- [x] BuilderCanvas-template heeft structurele toegankelijkheid
- [x] Tekstuele labels bij alle interactieve elementen
- [ ] Code-voorbeelden in EERSTE BERICHT niet in een `<code>`-blok — screenreaders kunnen dit missen

**Score:** 4 / 5

**Opmerkingen:**
> Over het algemeen goed toegankelijk. Het EERSTE BERICHT bevat inline code (`<!DOCTYPE html>`) zonder code-markup, wat screenreader-users kan hinderen. Dit is een minor punt.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Dierenasiel-context motiverend, hands-on EERSTE BERICHT |
| 2. Visueel | 4 | ×1 = 4 | Hardcoded hex, template solide |
| 3. Didactische flow | 5 | ×2 = 10 | HTML→CSS→JS canonieke volgorde, SCOPE GUARD goed |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Technisch correct, geen "..." in codevoorbeelden |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | Alle elementen aanwezig |
| 6. Interactiviteit | 4 | ×1 = 4 | BuilderCanvas solide, geen live preview |
| 7. Afronding & feedback | 5 | ×1 = 5 | Badges, maxScore, takeaways compleet |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 22A en 22B beide gedekt |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Code in EERSTE BERICHT geen code-markup |
| **TOTAAL** | | **53 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (5×2) + (5×1) + (4×1) + (5×1) + (5×1) + (4×1) = 53
Percentage = (53 / 55) × 100% = 96,4%
```

### Verdict

**✅ Klaar voor inzet** (96,4%)

> Een sterke, goed gestructureerde missie die de canonieke webdev-leerlijn volgt. De huismetafoor, hands-on EERSTE BERICHT en complete afrondingsstructuur maken dit tot een solide missie voor J2-leerlingen.

---

### Actielijst

#### Verbeterpunten (score 4 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 2. Visueel | Hardcoded hex `#2563EB` vervangen door lab-* token | Laag |
| 2 | 9. Toegankelijkheid | Code in EERSTE BERICHT markeren met backticks voor screenreader-support | Laag |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
