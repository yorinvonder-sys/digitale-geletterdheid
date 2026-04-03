# Audit — Verhalen Ontwerper (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `verhalen-ontwerper` |
| **Titel** | Verhalen Ontwerper |
| **Leerjaar & Periode** | Leerjaar 1, Periode 2 |
| **Template-engine** | Standalone (chat + AI-beeldgeneratie) |
| **SLO-kerndoelen** | 21D (AI aansturen), 22A (digitaal product maken) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en begrijpelijk voor de doelgroep — "Verhalen Ontwerper" is uitnodigend en creatief
- [x] `introDescription` geeft een concrete, begrijpelijke opdracht — leerling weet direct dat ze een prentenboek gaan maken met AI
- [x] Emoji of visueel element past bij het thema — boekontwerp met gezichtsanimatie is charmant en past bij het verhaalthema
- [x] Moeilijkheidsgraad is zichtbaar of voelbaar uit de intro — "Easy" klopt voor een creatieve J1-missie

**Bronbestanden:** `config/agents/year1.tsx:846-945`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende eerste indruk. Het geanimeerde boek met gezicht in de preview is charmant en nodigt leerlingen onmiddellijk uit om te beginnen. De beschrijving is concreet en prikkelt de verbeelding. De roze kleurthema past bij het creatief-schrijven thema. Moeilijkheidsgraad "Easy" is correct voor een open creatieve opdracht.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] Geen afgebroken of afgekapte teksten — chat-interface schaalt goed
- [x] Kleuren zijn consistent — roze gradient is coherent en past bij het creatieve thema
- [x] Animaties zijn niet afleidend of overweldigend — rotatie-animatie op het boek is subtiel en aantrekkelijk
- [x] Responsive op minimaal 375 px breed (mobiel) — chat-gebaseerde interface is inherent mobiel-vriendelijk

**Bronbestanden:** `config/agents/year1.tsx:846-944`

**Score:** 5 / 5

**Opmerkingen:**
> Visueel een van de sterkste previews in de missie-catalogus. Het geanimeerde boek met de roze gradient en gezicht is creatief en consistent met het thema. Chat-interface met AI-beeldgeneratie schaalt goed naar mobiel. Kleuren zijn coherent en het roze thema versterkt de creatieve sfeer. Geen hardcoded hex-kleuren gevonden in de preview-definitie.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw van eenvoudig naar complex — karakter → verhaal → afwerken is een logische creatieve flow
- [x] Elke stap bouwt aantoonbaar voort op de vorige — karakter eerst, dan situatie, dan plot, dan afbeeldingen
- [x] Moeilijkheid past bij het leerjaar — J1, Easy, open creatieve opdracht met veel begeleiding
- [ ] Geen onverklaard vakjargon of plotselinge sprongen in complexiteit — STAP-VOLTOOIING sectie ontbreekt in de systemInstruction, waardoor de AI-coach niet formeel doorschakelt

**Bronbestanden:** `config/agents/year1.tsx:846-1014`

**Score:** 4 / 5

**Opmerkingen:**
> Goede didactische opbouw. De VERHAALBOOG-template in de systemInstruction biedt leerlingen die vastlopen een concreet houvast. Het TAG-systeem voor het genereren van afbeeldingen leidt leerlingen stap voor stap door het proces. Verbeterpunt: er zijn geen formele STAP-VOLTOOIING markers, waardoor de AI-coach niet expliciet markeert wanneer een fase is afgerond en de volgende begint.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Informatie is feitelijk correct — uitleg over AI-beeldgeneratie en verhaalontwikkeling is correct
- [x] Geen typografische fouten of spelfouten — tekst is verzorgd
- [x] Taalgebruik past bij de leeftijdsgroep — warm, aanmoedigend, toegankelijk voor J1
- [x] Geen Engelse termen waar goed Nederlands beschikbaar is — "TAG-systeem" is technisch maar goed uitgelegd
- [x] Terminologie consistent door de hele missie — "hoofdpersoon", "VERHAALBOOG", "afbeelding" consistent gebruikt

**Bronbestanden:** `config/agents/year1.tsx:846-1014`

**Score:** 4 / 5

**Opmerkingen:**
> Inhoudelijk sterk. De VERHAALBOOG-template is pedagogisch waardevol en geeft leerlingen een concrete structuur voor hun verhaal. De voorbeeldscenario's zijn divers en herkenbaar voor J1-leerlingen. Kleine beperking: de systemInstruction (~3500+ tekens) is uitgebreid maar heeft geen formeel verificatieprotocol. De instructies zijn helder in het Nederlands en "hoofdpersoon" is de correct-Nederlandse term.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens lang — ~3500+ tekens, zeer uitgebreid
- [x] EERSTE BERICHT is aanwezig en heet de leerling goed welkom — aanwezig op regel 945: warm, uitnodigend, met eerste vraag
- [ ] STEP_COMPLETE markers zijn aanwezig voor alle stappen — **ONTBREEKT**: geen STAP-VOLTOOIING sectie in de systemInstruction
- [ ] Verificatievragen aanwezig — geen formeel verificatieprotocol aanwezig
- [x] Toon past bij de rolnaam en het thema — warme, aanmoedigende toon past bij creatief schrijven
- [x] Farming-detectie actief — via `SYSTEM_INSTRUCTION_SUFFIX` (gedeelde suffix)

**Bronbestanden:** `config/agents/year1.tsx:846-1014`, `config/agents/shared.tsx`

**Score:** 3 / 5

**Opmerkingen:**
> Het EERSTE BERICHT is warm en uitnodigend. De systemInstruction is inhoudelijk uitstekend met de VERHAALBOOG-template en het TAG-systeem. Maar twee essentiële elementen ontbreken: (1) geen STEP_COMPLETE markers, waardoor de AI-coach niet formeel doorschakelt tussen fases en voortgang niet getrackt kan worden, en (2) geen formeel verificatieprotocol. Een rijke systemInstruction compenseert dit gedeeltelijk, maar structurele voortgangsregistratie ontbreekt.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] Interactietype past bij het leerdoel — een prentenboek maken met AI-afbeeldingen is de meest directe manier om 21D/22A te leren
- [x] Voldoende variatie — leerlingen kiezen eigen karakter, verhaal en afbeeldingen; hoge personalisatiegraad
- [x] Feedback op foute antwoorden is leerzaam — AI helpt verhaal verbeteren en geeft suggesties voor afbeeldingen
- [x] Het element werkt technisch zonder zichtbare bugs — chat + beeldgeneratie is bewezen stabiel

**Bronbestanden:** `config/agents/year1.tsx:846-1014`

**Score:** 5 / 5

**Opmerkingen:**
> De combinatie van verhaalschrijven en AI-beeldgeneratie is bijzonder boeiend voor J1-leerlingen. Het eindproduct (een prentenboek) is tastbaar en deelbaar, wat de motivatie verhoogt. De hoge personalisatiegraad (eigen karakter, eigen verhaal, eigen afbeeldingen) maakt elke sessie uniek. Dit is een van de meest creatief en motiverend uitgewerkte interactievormen in de catalogus.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Completion-criteria zijn beschreven — via bonusChallenges zijn er twee uitbreidingen beschikbaar
- [ ] `goalCriteria` is formeel gedefinieerd — **geen goalCriteria** in het missie-object
- [ ] `primaryGoal` is aanwezig — **geen primaryGoal** gedefinieerd
- [ ] `takeaways[]` vatten de kernlessen samen — geen takeaways gedefinieerd

**Bronbestanden:** `config/agents/year1.tsx:846-1014`

**Score:** 3 / 5

**Opmerkingen:**
> De twee bonusChallenges (Extra Lange Versie, Het Vervolg) zijn een positief element: leerlingen die snel klaar zijn hebben een duidelijke vervolgstap. Maar er ontbreekt een formeel `goalCriteria` en `primaryGoal`, waardoor het systeem niet weet wanneer de basismissie is afgerond. Er zijn ook geen `takeaways` gedefinieerd. De bonusChallenges compenseren dit gedeeltelijk maar vervangen geen formeel afrondingsprotocol.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] Inhoud matcht het geclaimde SLO-kerndoel aantoonbaar — 21D (AI voor creatieve output aansturen) past uitstekend
- [x] Geen conflict tussen `curriculum.ts` en `slo-kerndoelen-mapping.ts` — 21D + 22A zijn consistent voor J1P2
- [ ] Het leerdoel is toetsbaar geformuleerd — geen formeel toetsbaar leerdoel gedefinieerd

**Bronbestanden:** `config/agents/year1.tsx:846`, `config/curriculum.ts`, `config/slo-kerndoelen-mapping.ts`

**Score:** 4 / 5

**Opmerkingen:**
> Goede SLO-aansluiting. 21D (AI aansturen) is de kern: leerlingen sturen de AI aan om zowel het verhaal te schrijven als afbeeldingen te genereren. 22A (digitaal product maken) sluit aan omdat het eindproduct een digitaal prentenboek is. Verbeterpunt: het leerdoel is niet formeel toetsbaar geformuleerd. "Maak een prentenboek" is een activiteit; een toetsbaar leerdoel zou zijn "kan uitleggen hoe je AI kunt aansturen voor creatieve doeleinden".

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij het leerjaar — warm, toegankelijk taalgebruik voor J1
- [x] Alt-teksten aanwezig op alle niet-decoratieve afbeeldingen — AI-gegenereerde afbeeldingen krijgen beschrijving via de prompt
- [x] Alle interactieve elementen bereikbaar en bedienbaar met toetsenbord — chat-interface is toetsenbord-toegankelijk
- [ ] Kleurcontrast voldoet aan WCAG AA — roze gradient niet getest op WCAG AA
- [x] Informatie wordt niet uitsluitend via kleur overgebracht — tekst is de primaire communicatiemiddel

**Bronbestanden:** `config/agents/year1.tsx:846-1014`

**Score:** 4 / 5

**Opmerkingen:**
> Chat-gebaseerde missie is inherent toegankelijk. De AI-gegenereerde afbeeldingen krijgen een tekstbeschrijving via de prompt, wat als alternatief dient. Leesniveau is passend voor J1. Verbeterpunt: het kleurcontrast van tekst op de roze gradient is niet getest op WCAG AA-conformiteit. Dit is een laag risico maar moet worden gecheckt voor de definitieve release.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Charmante boekpreview, uitnodigend |
| 2. Visueel | 5 | ×1 = 5 | Mooie animatie, roze thema, geen hardcoded hex |
| 3. Didactische flow | 4 | ×2 = 8 | Goede scaffolding, mist STEP_COMPLETE |
| 4. Inhoudelijke correctheid | 4 | ×2 = 8 | Sterk, VERHAALBOOG-template, geen fouten |
| 5. AI-coach kwaliteit | 3 | ×1 = 3 | EERSTE BERICHT aanwezig, mist STEP_COMPLETE + verificatie |
| 6. Interactiviteit | 5 | ×1 = 5 | Prentenboek + AI-afbeeldingen = uitzonderlijk boeiend |
| 7. Afronding & feedback | 3 | ×1 = 3 | BonusChallenges aanwezig, mist goalCriteria + takeaways |
| 8. SLO-aansluiting | 4 | ×1 = 4 | 21D + 22A goed, leerdoel niet toetsbaar |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Inherent toegankelijk, contrast niet getest |
| **TOTAAL** | | **45 / 55** | |

### Gewogen totaal

```
(5×1) + (5×1) + (4×2) + (4×2) + (3×1) + (5×1) + (3×1) + (4×1) + (4×1) = 45
Percentage = (45 / 55) × 100% = 81,8%
```

### Verdict

**✅ Klaar voor pilot** (81,8% — goede kwaliteit met gerichte verbeterpunten)

> Verhalen Ontwerper heeft een uitzonderlijk sterk concept: het maken van een AI-prentenboek is motiverend, creatief en sluit perfect aan bij 21D/22A. De visuele kwaliteit is hoog. De twee structurele tekortkomingen (ontbrekende STEP_COMPLETE markers en goalCriteria) verminderen de kwaliteit maar blokkeren de pilot niet. Aanbevolen: voeg goalCriteria en STEP_COMPLETE toe vóór productie-release.

---

### Actielijst

#### Blokkerende issues (score 1-2 — oplossen vóór inzet)

_Geen blokkerende issues aangetroffen._

#### Verbeterpunten (score 3 — oplossen vóór of tijdens pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 5. AI-coach kwaliteit | STEP_COMPLETE markers toevoegen aan systemInstruction: minimaal 3 fases (karakter → verhaal → afbeeldingen). | Hoog |
| 2 | 7. Afronding & feedback | `goalCriteria` en `primaryGoal` toevoegen aan het missie-object zodat het systeem weet wanneer de basismissie klaar is. | Hoog |
| 3 | 7. Afronding & feedback | `takeaways[]` toevoegen met 2-3 kernlessen over AI-aansturen voor creatieve doeleinden. | Medium |

#### Nice-to-haves (score 4 — optioneel, verbetert kwaliteit)

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 9. Toegankelijkheid | Kleurcontrast van tekst op roze gradient verifiëren tegen WCAG AA. |
| 2 | 8. SLO-aansluiting | Leerdoel herformuleren als toetsbaar resultaat (bijv. "kan uitleggen hoe AI-prompts de output beïnvloeden"). |
| 3 | 5. AI-coach kwaliteit | Formeel verificatieprotocol toevoegen: leerling beantwoordt een reflectievraag per fase voordat er doorgeschakeld wordt. |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
