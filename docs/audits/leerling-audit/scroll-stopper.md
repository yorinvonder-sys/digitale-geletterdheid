# Audit — De Scroll Stopper (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `scroll-stopper` |
| **Titel** | De Scroll Stopper |
| **Leerjaar & Periode** | Leerjaar 1, Periode 3 |
| **Template-engine** | DebateArena (met AI-chat via `enableChat: true`) |
| **SLO-kerndoelen** | 23B (welzijn), 21B (mediawijsheid) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en begrijpelijk — "Scroll Stopper" is direct
- [x] `introDescription` geeft een concrete opdracht — "Is verslavend app-design acceptabel?" is een prikkelende vraag
- [x] Visueel element past bij het thema — dark pattern lab met "Infinite scroll AAN", "Notificatie-badges AAN", "Streak-druk ???" is visueel sterk en direct relevant
- [x] Moeilijkheidsgraad voelbaar — "Medium" past bij de debatactiviteit

**Bronbestanden:** `config/agents/year1.tsx:1873-1921`, `components/missions/templates/debate-arena/configs/scroll-stopper.ts:1-16`

**Score:** 5 / 5

**Opmerkingen:**
> Het visuele ontwerp van de "Dark Pattern Lab" preview is bijzonder effectief: de gebruiker ziet direct de elementen die ze in de missie gaan bespreken (infinite scroll, notificatiebadges, streak-druk). De introverklaring ("Word ingehuurd als app-ontwerper") is een sterke hook. De DebateArena-intro beschrijft de vijf stappen duidelijk.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] Kleuren consistent — violet/fuchsia gradient past bij het thema
- [x] DebateArena-template is proven responsive
- [ ] Kleur via `lab-*` tokens — `color: '#8B5CF6'` is hardcoded hex
- [x] Stakeholder-kaarten in DebateArena zijn leesbaar en overzichtelijk

**Bronbestanden:** `config/agents/year1.tsx:1876` (hardcoded hex)

**Score:** 4 / 5

**Opmerkingen:**
> De DebateArena-template is visueel goed uitgewerkt met stakeholder-kaarten, positieknopppen en argumentprompts. Het violet/fuchsia kleurschema is thematisch passend voor het tech-thema.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw — Lees standpunten → Kies positie → Bouw argumenten → Reageer op tegenargument → Reflecteer
- [x] Elke stap bouwt voort — je kunt pas argumenteren als je de standpunten kent
- [x] Moeilijkheid past bij leerjaar — debatformat is herkenbaar uit de klas
- [x] Vier diverse stakeholders (tiener, app-ontwerper, psycholoog, politicus) bieden meerdere perspectieven

**Bronbestanden:** `components/missions/templates/debate-arena/configs/scroll-stopper.ts:20-93`

**Score:** 5 / 5

**Opmerkingen:**
> De didactische opbouw van de DebateArena is sterk. De vier stakeholders zijn divers en realistisch: Luna (tiener, ervaringsdeskundige), Mark (app-ontwerper, economisch belang), Dr. Bakker (psycholoog, wetenschappelijke onderbouwing), Kamerlid De Vries (regulering). De opbouw van standpunten lezen → positie kiezen → argumenten bouwen → tegenargument verwerken → reflecteren is solide debatdidactiek.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Informatie is feitelijk correct — "variabele beloningen activeren dezelfde hersengebieden als gokken" klopt
- [x] Prefrontale cortex uitleg correct — "volledig ontwikkeld rond 25e levensjaar" is wetenschappelijk juist
- [x] Politiek stakeholder is genuanceerd — "Europese samenwerking is de sleutel" is realistisch beleidsstandpunt
- [x] Gevoeligheidsinstructie aanwezig — voor leerlingen met schermtijdproblemen (year1.tsx)
- [x] Geen spelfouten gevonden
- [x] Taalgebruik past bij doelgroep — beide stakeholder- en debat-taal zijn toegankelijk

**Bronbestanden:** `components/missions/templates/debate-arena/configs/scroll-stopper.ts:20-93`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk uitstekend. De wetenschappelijke onderbouwing (prefrontale cortex, variable rewards / dopamine-loop) is correct en wordt op niveau gebracht. Het tegenargument ("Als we design-keuzes gaan verbieden, waar stoppen we dan?") is realistisch en stimuleert kritisch denken. De vier posities (verbieden, reguleren, zelfregulatie, vrijheid) dekken het beleidslandschap goed af.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] DebateArena heeft ingebouwde structuur — posities, argumentprompts, reflectievragen
- [x] Chat-component actief via `enableChat: true` — AI-coach begeleidt het debatproces
- [x] EERSTE BERICHT aanwezig in year1.tsx systemInstruction — "Welkom bij ScrollMore Inc.! 📱💰"
- [x] Gevoeligheidsinstructie aanwezig in chat-systemInstruction
- [ ] STEP_COMPLETE markers in chat-systemInstruction — **ONTBREEKT** in year1.tsx
- [x] Toon van chat-coach als "CEO ScrollMore Inc." is creatief en passend voor het roleplay-format

**Bronbestanden:** `components/missions/templates/debate-arena/configs/scroll-stopper.ts`, `config/agents/year1.tsx:1924-2016`

**Score:** 4 / 5

**Opmerkingen:**
> De DebateArena en de chat-coach zijn samen goed: de DebateArena structureert het debat, de chat-coach begeleid. Het rollenspel-format (CEO van ScrollMore Inc.) is creatief. Punt: de chat-systemInstruction is heel uitgebreid (3 aktes, 5 keuzemomenten, plottwist, herontwerp) maar de DebateArena-config is de primaire interactie — er is spanning tussen de twee instrucielagen.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] Debatformat past bij het leerdoel — ethische afweging vereist standpuntinname en argumentatie
- [x] Vier posities zijn divers en uitdagend — geen "obvious correct answer"
- [x] Tegenargument-onderdeel is didactisch sterk — leerlingen moeten actief reageren op kritiek
- [x] Reflectievragen aan het einde sluiten de cirkel — "Is je mening veranderd?"

**Bronbestanden:** `components/missions/templates/debate-arena/configs/scroll-stopper.ts:62-93`

**Score:** 4 / 5

**Opmerkingen:**
> De DebateArena biedt sterke interactiviteit voor een ethisch vraagstuk. Het ontbreken van een "juist antwoord" is pedagogisch correct voor een debat. De chat-coach als aanvulling zorgt voor persoonlijke begeleiding. Punt: de argumentprompts ("Ik vind dat...", "Want uit onderzoek blijkt dat...") zijn generiek — specifiekere prompts zouden de kwaliteit van argumenten verbeteren.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Badges gedefinieerd — 4 badges: Debatmeester (≥80), Scherp Denker (≥60), Goed Bezig (≥40), Aan de Start (≥0)
- [x] `maxScore: 100` aanwezig
- [x] `takeaways` aanwezig — 4 lessen (verslavend design, belangen botsen, geen juist antwoord, EU-regelgeving)
- [x] Badgedrempels zijn realistisch

**Bronbestanden:** `components/missions/templates/debate-arena/configs/scroll-stopper.ts:96-127`

**Score:** 5 / 5

**Opmerkingen:**
> Volledige afrondingsstructuur. De "Debatmeester"-badge is inhoudelijk sterk. De takeaway "Er is geen 'juist' antwoord, maar jouw argumenten maken je standpunt sterker" is een uitstekende meta-les over debatvaardigheden.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] Inhoud matcht geclaimde kerndoelen — 23B (welzijn) en 21B (mediawijsheid) zijn aanwezig
- [x] Mapping is intern consistent
- [x] Leerdoel toetsbaar — debatprestatie via DebateArena-scoring

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts` (week 3, 23B + 21B)

**Score:** 4 / 5

**Opmerkingen:**
> Goede SLO-aansluiting. 23B (welzijn) is duidelijk via de schermtijd/verslavingsthematiek. 21B (mediawijsheid) is aanwezig via het begrip van dark patterns. Kleine noot: de missie raakt ook 23C (maatschappij, regelgeving) via het Europese regelgevingsstandpunt — dit is niet geclaimd in de mapping.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij het leerjaar — stakeholder-teksten zijn helder geschreven
- [x] Gevoeligheidsinstructie aanwezig voor schermtijdproblematiek
- [x] DebateArena-template is proven toegankelijk
- [ ] Debatformat vereist leesvaardigheid boven J1-gemiddelde voor alle vier stakeholder-teksten

**Bronbestanden:** `components/missions/templates/debate-arena/configs/scroll-stopper.ts:20-61`

**Score:** 4 / 5

**Opmerkingen:**
> De missie is goed toegankelijk. De gevoeligheidsinstructie voor schermtijdproblemen is aanwezig. De stakeholder-teksten zijn relatief lang voor J1-leerlingen met leesproblemen, maar de onderwerpen zijn herkenbaar genoeg om te overbruggen.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Dark Pattern Lab preview is sterk |
| 2. Visueel | 4 | ×1 = 4 | DebateArena proven, hardcoded hex |
| 3. Didactische flow | 5 | ×2 = 10 | Diverse stakeholders, solide opbouw |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Wetenschappelijk correct, genuanceerd |
| 5. AI-coach kwaliteit | 4 | ×1 = 4 | DebateArena + chat, spanning tussen lagen |
| 6. Interactiviteit | 4 | ×1 = 4 | Sterk debatformat, generieke prompts |
| 7. Afronding & feedback | 5 | ×1 = 5 | Volledig: badges + takeaways |
| 8. SLO-aansluiting | 4 | ×1 = 4 | 23B + 21B aanwezig, 23C niet geclaimd |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Goed, stakeholder-teksten vrij lang |
| **TOTAAL** | | **46 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (5×2) + (4×1) + (4×1) + (5×1) + (4×1) + (4×1) = 46
Percentage = (46 / 55) × 100% = 83,6%
```

### Verdict

**✅ Klaar** (83,6% — boven de 80% drempel)

> Scroll Stopper is een sterke missie met een creatief rollenspel-concept en een volledige DebateArena-implementatie. De inhoud is wetenschappelijk correct en pedagogisch evenwichtig. Geen blokkerende issues.

---

### Actielijst

#### Blokkerende issues (score 1-2 — oplossen vóór inzet)

Geen blokkerende issues.

#### Verbeterpunten (score 4 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 5. AI-coach kwaliteit | Spanning tussen chat-systemInstruction (3-akte roleplay) en DebateArena-config verduidelijken. Welke is primair bij gebruik? | Medium |
| 2 | 6. Interactiviteit | Argumentprompts specifieker maken voor dit onderwerp ("Schermtijdonderzoek toont aan dat...", "Voor minderjarigen geldt..."). | Laag |

#### Nice-to-haves (score 4 — optioneel, verbetert kwaliteit)

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 8. SLO-aansluiting | 23C toevoegen aan SLO-mapping (regelgeving/maatschappij is een kern van het debat). |
| 2 | 2. Visueel | Hardcoded hex `#8B5CF6` vervangen door `lab-*` token. |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
