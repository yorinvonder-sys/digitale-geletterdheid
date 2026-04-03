# Audit — Open Source Contributor (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `open-source-contributor` |
| **Titel** | Open Source Contributor |
| **Leerjaar & Periode** | Leerjaar 3, Periode 1 |
| **Template-engine** | BuilderCanvas (enableChat: true) |
| **SLO-kerndoelen** | 22B (Programmeren), 23C (Maatschappij) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en begrijpelijk — "Draag bij aan een open source project" is concreet
- [x] `introDescription` beschrijft de volledige workflow: analyseren, forken, bugfix, pull request
- [x] Emoji 🐙 (octopus = GitHub-mascotte Octocat) is herkenbaar voor J3 leerlingen
- [x] Moeilijkheidsgraad "Hard" is correct voor J3 havo/vwo
- [x] `introFeatures` (4 bullets) zijn concreet en beschrijven een echte professionele workflow

**Bronbestanden:** `components/missions/templates/builder-canvas/configs/open-source-contributor.ts:3-15`

**Score:** 5 / 5

**Opmerkingen:**
> Sterke eerste indruk. De verwijzing naar "precies zoals echte developers dat doen op GitHub" is een effectieve motivator voor J3 leerlingen die professionele vaardigheden willen leren. De 🐙 emoji is een slimme keuze voor de GitHub-doelgroep.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] BuilderCanvas heeft een bewezen responsive lay-out
- [x] `previewType: 'text-preview'` — geen grafische elementen met hardcoded kleuren
- [x] Code-voorbeelden in de stap-instructies zijn inline als tekst — goed leesbaar
- [ ] `git checkout -b fix/zoek-sortering` als code-snippet in tekst is niet in een code-block weergegeven — kan onduidelijk zijn voor leerlingen

**Bronbestanden:** `components/missions/templates/builder-canvas/configs/open-source-contributor.ts`

**Score:** 4 / 5

**Opmerkingen:**
> BuilderCanvas scoort goed. De missie is tekstintensief maar dat past bij het onderwerp (professionele Git-workflow). Code-snippets in de instructietekst zouden in monospace/code-blocks weergegeven moeten worden voor leesbaarheid.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw: Git-workflow begrijpen → Issue analyseren → Bugfix schrijven → Pull Request indienen
- [x] Elke stap bouwt aantoonbaar voort — je kunt geen PR schrijven zonder de bugfix
- [x] Moeilijkheid past bij leerjaar — "Hard" voor J3
- [x] STEP_COMPLETE markers aanwezig (3/3): issue samengevat + fork beschreven → fix + commit message → PR beschrijving geschreven
- [x] Tips per stap zijn professioneel en concreet ("Nooit direct op main werken")
- [x] Bugfix-scenario (sorteerstabiliteit) is concreet en toepasbaar

**Bronbestanden:** `config/agents/year3.tsx:407-410`, `components/missions/templates/builder-canvas/configs/open-source-contributor.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw. De stap "Reproduceer het probleem vóór je code schrijft" is een professionele vaardigheid die leerlingen zelden leren. Het concrete sorteerbug-scenario (`items.sort((a, b) => a.date - b.date)`) maakt de abstracte Git-workflow tastbaar.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Git-workflow correct beschreven: fork → clone → branch → fix → commit → push → PR
- [x] Fork vs. clone onderscheid correct en relevant voor beginners
- [x] `items.sort((a, b) => a.date - b.date)` als buggy code is correct — niet-deterministisch bij gelijke waarden
- [x] PR-titeltip ("Fix: sorteervolstabiliteit") is correct en professioneel
- [x] "Closes #42" syntax correct voor GitHub issue-koppeling
- [x] Geen aantoonbare spelfouten

**Bronbestanden:** `components/missions/templates/builder-canvas/configs/open-source-contributor.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk uitstekend. De bugfix-opdracht is een echte professionele situatie — sorteerstabiliteit is een veelvoorkomend real-world probleem. De PR-sjabloon (titel, beschrijving, testinstructies, issue-koppeling) is een industriestandaard die J3 leerlingen direct kunnen toepassen.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens — ruim voldoende
- [x] EERSTE BERICHT aanwezig — "Welkom, Contributor! Er is een melding binnengekomen op GitHub."
- [x] STEP_COMPLETE markers aanwezig voor alle drie stappen (3/3)
- [x] Toon past bij de rolnaam — "Open Source Mentor" is coachend en professioneel
- [x] Chat ingeschakeld (`enableChat: true`)
- [x] SCOPE GUARD: "Simuleer de code review — geef altijd constructieve feedback"

**Bronbestanden:** `config/agents/year3.tsx:382-447`

**Score:** 5 / 5

**Opmerkingen:**
> Volledig geconfigureerde coach. De instructie om code review te simuleren is didactisch waardevol — de leerling krijgt professionele feedback op zijn "code" (ook al is het conceptueel).

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] BuilderCanvas met teksteditor + chat is geschikt voor deze schrijf-en-reflectie opdracht
- [x] Chat-integratie maakt de code review realistisch
- [x] De vier stappen hebben elk hun eigen checklistItems (4-4-4-4)
- [x] `textPrompt` per stap geeft een duidelijk startpunt
- [ ] De missie vereist veel schrijfwerk (Git-workflow 6 stappen, issue-analyse 5 punten, bugfix met test, PR-beschrijving) — tijdsinvestering is hoog

**Bronbestanden:** `components/missions/templates/builder-canvas/configs/open-source-contributor.ts`

**Score:** 4 / 5

**Opmerkingen:**
> Sterk concept maar hoog schrijfvolume. Een leerling die alle vier stappen volledig uitwerkt is waarschijnlijk 60-90 minuten bezig. Geen blocker, maar een tijdschatting op het intro-scherm zou helpen.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Badges aanwezig: 🏆 Open Source Hero (≥90), 🐙 Contributor (≥70), 🔀 Pull Request Beginner (≥50), 🌱 Op weg (≥0)
- [x] `maxScore: 100` is helder
- [x] `takeaways[]` aanwezig — 5 kernlessen over de volledige open source workflow
- [x] Badgenames zijn thematisch correct en motiverend
- [x] Checklistcriteria per stap geven tussentijdse done-signalen

**Bronbestanden:** `components/missions/templates/builder-canvas/configs/open-source-contributor.ts:84-98`

**Score:** 5 / 5

**Opmerkingen:**
> Volledige afrondingsset. De takeaway "Je weet hoe miljoenen developers wereldwijd samenwerken aan open source code" geeft leerlingen een gevoel van verbondenheid met de technologiegemeenschap.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] 22B (Programmeren): Git-workflow, bugfix, commit messages, code review zijn programmeerpraktijk
- [x] 23C (Maatschappij): Open source als collaboratief en maatschappelijk fenomeen past bij 23C
- [x] Mapping is consistent met `slo-kerndoelen-mapping.ts` (week 1, J3)

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:156`

**Score:** 5 / 5

**Opmerkingen:**
> De koppeling van 22B (code) + 23C (maatschappij) reflecteert dat open source zowel een technische vaardigheid als een maatschappelijke beweging is. Goed onderbouwd.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij J3 havo/vwo — professioneel maar uitlegbaar
- [x] Geen kleur als primaire informatiebron — tekst-gebaseerde interface
- [x] Code-snippets in de instructie zijn tekst — geen visuele elementen
- [x] BuilderCanvas heeft standaard focus states

**Score:** 4 / 5

**Opmerkingen:**
> Goede toegankelijkheid. Kleine opmerking: code-snippets in de instructietekst zijn niet geformatteerd als code-blocks, wat voor leerlingen met dyslexie of concentratieproblemen onduidelijk kan zijn (welk deel is instructie, welk deel is code?).

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Professioneel en motiverend |
| 2. Visueel | 4 | ×1 = 4 | Code-snippets niet in code-blocks |
| 3. Didactische flow | 5 | ×2 = 10 | Professionele workflow, STEP_COMPLETE compleet |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Git-kennis, bugfix en PR allemaal correct |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | Volledig geconfigureerd met chat |
| 6. Interactiviteit | 4 | ×1 = 4 | Hoog schrijfvolume, geen tijdschatting |
| 7. Afronding & feedback | 5 | ×1 = 5 | Badges en takeaways compleet |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 22B+23C aantoonbaar aanwezig |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Code-snippets als platte tekst |
| **TOTAAL** | | **53 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (5×2) + (5×1) + (4×1) + (5×1) + (5×1) + (4×1) = 53
Percentage = (53 / 55) × 100% = 96,4%
```

### Verdict

**✅ Klaar** (96,4% — ruim boven de 80% drempel)

> Een professioneel geconstrueerde missie met authentiek leermateriaal. Geen blokkerende issues.

---

### Actielijst

#### Nice-to-haves (optioneel)

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 6. Interactiviteit | Tijdschatting ("~60-90 min") toevoegen aan het intro-scherm |
| 2 | 2. Visueel / 9. Toegankelijkheid | Code-snippets in de stap-instructies opmaken in monospace/code-block stijl |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
