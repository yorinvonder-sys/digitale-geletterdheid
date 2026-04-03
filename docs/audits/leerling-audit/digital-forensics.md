# Audit — Digital Forensics (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `digital-forensics` |
| **Titel** | Digital Forensics |
| **Leerjaar & Periode** | Leerjaar 3, Periode 2 |
| **Template-engine** | ScenarioEngine |
| **SLO-kerndoelen** | 23A (Veiligheid & Privacy), 21C (Data & Dataverwerking) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en uitnodigend — "Digital Forensics" is een professionele en herkenbare term
- [x] `introDescription` beschrijft de essentie goed: digitale sporen lezen, tijdlijn reconstrueren, conclusies trekken
- [x] Emoji 🕵️ past perfect bij het forensisch onderzoek-thema
- [x] Moeilijkheidsgraad "Hard" is correct voor J3 havo/vwo
- [x] `introFeatures` (4 bullets) beschrijven een echte forensische methodologie

**Bronbestanden:** `components/missions/templates/scenario-engine/configs/digital-forensics.ts:3-16`

**Score:** 5 / 5

**Opmerkingen:**
> Sterke eerste indruk. De ziekenhuiscontext in de introductie ("patiëntgegevens") maakt de ernst van digitale forensics direct duidelijk en relevant.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] ScenarioEngine-template heeft een bewezen responsive lay-out
- [x] Logregels zijn als platte tekst weergegeven — leesbaar
- [ ] Badge-kleuren zijn hardcoded: `#2563EB`, `#10B981`, `#6B6B66`
- [x] Scenario-items hebben pictogrammen (🔁, 🌅, 🕒, etc.) — visuele diversiteit
- [x] Logregels zijn kort en scanbaar — goed gedoseerd

**Bronbestanden:** `components/missions/templates/scenario-engine/configs/digital-forensics.ts`

**Score:** 4 / 5

**Opmerkingen:**
> ScenarioEngine scoort goed. De pictogrammen per item maken de select-correct rondes overzichtelijk. Badge hex-kleuren zijn de enige stijlovertreding.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw: Verdachte logregels herkennen → Tijdlijn bouwen → Feit of aanname → Forensisch protocol
- [x] Elke ronde bouwt voort — je kunt pas een tijdlijn bouwen als je de verdachte regels hebt herkend
- [x] Moeilijkheidsgraad "Hard" is correct
- [x] STEP_COMPLETE markers aanwezig (3/3): 3 verdachte logregels geïdentificeerd → tijdlijn opgesteld → onderbouwde conclusie getrokken
- [x] "Feit of aanname?" ronde is een unieke en kritisch-denken stimulerende toevoeging
- [x] 8 items per select-correct ronde is goed gedoseerd

**Bronbestanden:** `config/agents/year3.tsx:1003-1006`, `components/missions/templates/scenario-engine/configs/digital-forensics.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw. De "Feit of aanname?"-ronde is didactisch onderscheidend — dit is een zeldzame vaardigheid die leerlingen in andere vakken nauwelijks oefenen. Het onderscheid "Dr. Bakker heeft ingelogd" vs. "Er is ingelogd met Bakkers gegevens" is een subtiel maar cruciaal forensisch principe.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Brute force patroon (5 pogingen in 9 sec) correct geïdentificeerd
- [x] Nacht-inlog met extern IP correct als "verdacht" gelabeld (niet zeker, maar reden voor nader onderzoek)
- [x] Data-exfiltratie (847 MB naar extern IP) correct als alarmsignaal gelabeld
- [x] Portscan als eerste stap van aanval correct uitgelegd
- [x] Privilege escalation (nieuw superadmin-account) correct herkend
- [x] "Dr. Bakker heeft zelf ingelogd" correct als aanname gelabeld — IP-adres alleen bewijst geen identiteit
- [x] 10.0.5.44 als intern IP-adres (RFC 1918) correct uitgelegd
- [x] Chain of custody correct uitgelegd: forensische kopie, nooit origineel bewerken
- [x] "RAM-geheugen verlies bij afsluiting" correct — dit is een feitelijk correct argument tegen direct uitschakelen
- [x] Geen aantoonbare spelfouten

**Bronbestanden:** `components/missions/templates/scenario-engine/configs/digital-forensics.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk uitstekend. De RFC 1918 referentie (privé IP-adressen) is een technisch correct detail dat voor J3 een goed niveau is. Het RAM-geheugen argument bij het "uitschakelen" antwoord is nauwkeurig en niet vereenvoudigd.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens — ruim voldoende
- [x] EERSTE BERICHT aanwezig — "Analist, de politie heeft je ingeschakeld."
- [x] STEP_COMPLETE markers aanwezig voor alle drie stappen (3/3)
- [x] Toon past bij de rolnaam — "Digital Forensics expert" is professioneel en methodisch
- [x] SCOPE GUARD: "Benadruk altijd: feiten vs. aannames — een rechter accepteert alleen bewijs"

**Bronbestanden:** `config/agents/year3.tsx:970-1044`

**Score:** 5 / 5

**Opmerkingen:**
> Volledig geconfigureerde coach. De SCOPE GUARD-instructie over feiten vs. aannames is perfect afgestemd op de "Feit of aanname?"-ronde.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] ScenarioEngine met vier ronde-types (select-correct, order-priority, binary-choice, select-correct) is gevarieerd
- [x] Order-priority tijdlijn-ronde is het hoogtepunt — leerlingen reconstrueren de aanval
- [x] Binary-choice "Feit of aanname?" is uniek en stimuleert kritisch denken
- [x] 8 items per select-correct ronde is goed gedoseerd
- [x] Feedbackteksten zijn leerzaam en specifiek per item

**Bronbestanden:** `components/missions/templates/scenario-engine/configs/digital-forensics.ts`

**Score:** 5 / 5

**Opmerkingen:**
> De "Feit of aanname?"-ronde is het meest onderscheidende element van alle 12 missies. Dit is een cognitief hoogwaardige oefening die zelfs buiten cybersecurity-context waarde heeft.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Badges aanwezig: 🏆 Hoofd Forensisch Analist (≥80), 🔍 Digitale Speurder (≥60), 📚 Goed Begonnen (≥40), 🌱 Blijf Oefenen (≥0)
- [x] `maxScore: 100` is helder (4 rondes × 25 punten)
- [x] `takeaways[]` aanwezig — 5 kernlessen over digitale forensics
- [x] "Digitaal forensisch bewijs speelt steeds vaker een rol in rechtszaken" is een motiverende takeaway

**Bronbestanden:** `components/missions/templates/scenario-engine/configs/digital-forensics.ts:17-49`

**Score:** 5 / 5

**Opmerkingen:**
> Volledige afrondingsset. De drempelwaarden (≥80 voor topscore) zijn iets lager dan andere missies — passend voor een "Hard" missie die hoge cognitieve eisen stelt.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] 23A (Veiligheid & Privacy): forensisch bewijs, aanvallen herkennen, chain of custody zijn kern van veiligheidskennis
- [x] 21C (Data & Dataverwerking): logdata analyseren en tijdlijnen reconstrueren is dataverwerking
- [x] Mapping is consistent met `slo-kerndoelen-mapping.ts` (week 2, J3)

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:167`

**Score:** 5 / 5

**Opmerkingen:**
> De 21C-koppeling is goed gemotiveerd door de logdata-analyse component. Logbestanden zijn immers gestructureerde data die verwerkt en geïnterpreteerd moeten worden.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij J3 havo/vwo — forensisch-professioneel maar uitgelegd
- [x] Logregels zijn tekst-gebaseerd — geen kleurafhankelijkheid
- [x] Pictogrammen per item zijn decoratief, niet informatief — tekst draagt de betekenis
- [ ] Badge-kleuren zijn hardcoded hex
- [ ] Order-priority (drag-and-drop tijdlijn) is niet volledig toetsenbord-toegankelijk

**Score:** 3 / 5

**Opmerkingen:**
> Drag-and-drop in de tijdlijn-ronde is hetzelfde template-niveau toegankelijkheidsprobleem. De tijdlijn-ronde is juist didactisch centraal — een toetsenbord-alternatief is hier extra belangrijk.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Ziekenhuis-context, ernst meteen duidelijk |
| 2. Visueel | 4 | ×1 = 4 | Pictogrammen per item, badge hex-kleuren |
| 3. Didactische flow | 5 | ×2 = 10 | "Feit of aanname?" is didactisch uniek |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | RFC 1918, RAM-verlies allemaal correct |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | Feiten vs. aannames in SCOPE GUARD |
| 6. Interactiviteit | 5 | ×1 = 5 | Unieke binary-choice feit/aanname-ronde |
| 7. Afronding & feedback | 5 | ×1 = 5 | Motiverende takeaways |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 23A+21C aantoonbaar aanwezig |
| 9. Toegankelijkheid | 3 | ×1 = 3 | Tijdlijn drag-drop niet toetsenbord-toegankelijk |
| **TOTAAL** | | **53 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (5×2) + (5×1) + (5×1) + (5×1) + (5×1) + (3×1) = 53
Percentage = (53 / 55) × 100% = 96,4%
```

### Verdict

**✅ Klaar** (96,4% — ruim boven de 80% drempel)

> Een didactisch onderscheidende missie met de beste cognitieve diepte van J3P2. De "Feit of aanname?"-ronde is uniek en waardevol. Alleen drag-drop toegankelijkheid is een aandachtspunt.

---

### Actielijst

#### Verbeterpunten (score 3 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 9. Toegankelijkheid | Order-priority tijdlijn-ronde: toetsenbord-alternatief toevoegen (template-niveau) | Medium |

#### Nice-to-haves

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 2. Visueel | Badge hex-kleuren vervangen door `lab-*` tokens |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
