# Audit — Network Navigator (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `network-navigator` |
| **Titel** | Network Navigator |
| **Leerjaar & Periode** | Leerjaar 2, Periode 2 |
| **Template-engine** | DataViewer |
| **SLO-kerndoelen** | 21A |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |
| **Referentiestatus** | GOLD STANDARD — hoge score verwacht |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig — "Network Navigator"
- [x] `introDescription` concreet en herkenbaar — Instagram-bericht dat niet aankomt
- [x] `primaryGoal` aanwezig — "🎯 Beschrijf de volledige reis van een bericht door het internet"
- [x] `goalCriteria` aanwezig — `{ type: 'steps-complete', min: 3 }`
- [x] Moeilijkheidsgraad "Medium" zichtbaar en passend

**Bronbestanden:** `config/agents/year2.tsx:1099-1115`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende eerste indruk. Het Instagram-scenario is hyporelevant voor 13-16-jarigen. De visualPreview toont een glassmorphism-stijl met "Telefoon → Router → Server" en "Spoor het op!" — dit maakt direct duidelijk wat de missie inhoudt. De `primaryGoal` geeft leerlingen een concrete doelstelling vooraf.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] Visuele preview gebruikt Tailwind inline classes — consistent met de codebase-conventies
- [x] Cyan kleurthema is consistent door de missie
- [x] Glassmorphism-effect (`backdrop-blur-md`, `bg-white/20`) is subtiel en niet afleidend
- [x] Radial gradient is decoratief, niet informatiedragend
- [x] DataViewer-template biedt structurele visuele consistentie

**Bronbestanden:** `config/agents/year2.tsx:1113-1126`

**Score:** 5 / 5

**Opmerkingen:**
> De visualPreview is de sterkste in de hele J2P2-missiecollectie: inline glassmorphism met relevante tekst ("Telefoon → Router → Server") zonder hardcoded hex-kleuren. Alle kleuren zijn Tailwind utility-classes. Professioneel en consistent.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw — DNS/IP → Reis van bericht → Troubleshooting
- [x] Elke stap bouwt voort op de vorige — je moet DNS kennen voor de reis, en de reis kennen voor troubleshooting
- [x] Concrete beoordelingscriteria per stap in systemInstruction
- [x] "Minimaal 4 stappen" voor Stap 2 is een concrete, toetsbare eis
- [x] Moeilijkheidsgraad "Medium" correct voor J2-niveau

**Bronbestanden:** `config/agents/year2.tsx:1127-1187`

**Score:** 5 / 5

**Opmerkingen:**
> De didactische opbouw is nauwkeurig: je begint met het "adresboek" (DNS), dan de reis zelf, dan wat er mis kan gaan. Dit is precies hoe een netwerkengineer een storing aanpakt. De BEOORDELINGSCRITERIA-sectie in de systemInstruction is een uniek sterk punt: expliciete criteria vooraf geven de AI-coach concrete meetpunten.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] DNS-uitleg correct — "vertaalt domeinnaam naar IP-adres"
- [x] HTTP/HTTPS correct onderscheiden
- [x] Foutcodes correct — 404 = niet gevonden, 500 = serverfout
- [x] "Latency, timeout, pakketverlies" correct benoemd
- [x] PostNL-vergelijking is didactisch sterk en feitelijk correct
- [x] Geen spelfouten of feitelijke fouten gevonden

**Bronbestanden:** `config/agents/year2.tsx:1127-1187`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk uitstekend. De netwerktechnieken worden correct en begrijpelijk uitgelegd. De PostNL-vergelijking ("een bericht is als een pakketje bij PostNL dat langs meerdere sorteercentra gaat") is een bewezen didactische analogie. De IP-adres voorbeeldnotatie (192.168.1.1) is correct. Foutcodes zijn correct benoemd.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` minimaal 500 tekens — ~1800 tekens, ruim voldoende
- [x] EERSTE BERICHT aanwezig — levendig, stelt activerende vraag
- [x] STEP_COMPLETE markers aanwezig (3/3) — DNS/IP, reis in 4 stappen, troubleshooting
- [x] BEOORDELINGSCRITERIA-sectie aanwezig — uniek: expliciete criteria per stap
- [x] REGELS-sectie aanwezig — vergelijkingen verplicht, geen volledig antwoord geven

**Bronbestanden:** `config/agents/year2.tsx:1127-1187`

**Score:** 5 / 5

**Opmerkingen:**
> De systemInstruction is een van de beste in de codebase. De BEOORDELINGSCRITERIA-sectie is een uniek sterk punt: de AI-coach weet exact wat verwacht wordt voor elke stap. De REGELS-sectie ("gebruik ALTIJD vergelijkingen uit het dagelijks leven", "geef NOOIT een volledig antwoord") zijn duidelijke gedragsrichtlijnen. Het EERSTE BERICHT is warm, uitnodigend en stelt een activerende vraag.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] DataViewer-template biedt interactieve data-exploratie
- [x] Drie stappen zijn concreet en uitvoerbaar via chat
- [x] `goalCriteria: { type: 'steps-complete', min: 3 }` koppelt voortgang aan concrete prestaties
- [x] De stap-voorbeelden zijn conceet en activerend

**Bronbestanden:** `config/agents/year2.tsx:1188-1205`

**Score:** 4 / 5

**Opmerkingen:**
> De DataViewer-template is goed geschikt voor het verkennen van netwerktopologie. De drie stappen zijn praktisch uitvoerbaar via de AI-chat. Enige beperking: de DataViewer biedt geen gesimuleerde netwerktool of packet-trace visualisatie — dit is een template-beperking, geen missiefout. De interactie is primair via chat, wat voor dit conceptuele onderwerp wel werkt.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] `goalCriteria` aanwezig — `{ type: 'steps-complete', min: 3 }`
- [x] `primaryGoal` geeft leerling een helder einddoel
- [ ] Badges en maxScore niet zichtbaar in agent-config (`bonusChallenges: null`) — DataViewer-template heeft mogelijk eigen scoring
- [ ] takeaways niet expliciet zichtbaar in year2.tsx — DataViewer-template config niet gevonden

**Bronbestanden:** `config/agents/year2.tsx:1205`

**Score:** 3 / 5

**Opmerkingen:**
> De `goalCriteria` en `primaryGoal` zijn aanwezig en geven een duidelijk einddoel. De DataViewer-template heeft echter geen zichtbaar badge/takeaway-systeem in de beschikbare config (geen `network-navigator.ts` config gevonden in `builder-canvas` of andere template-configs). De afronding is functioneel maar minder rijk dan de SimulationLab-missies.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] SLO 21A (Digitale basisvaardigheden — hoe internet werkt) — correct
- [x] Missie leert expliciet: DNS, IP-adressen, HTTP/HTTPS, routers, servers
- [x] Geen programmeercomponent — 22B niet geclaimd en terecht
- [x] Geen conflict tussen mapping en content

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:114`

**Score:** 5 / 5

**Opmerkingen:**
> De SLO-koppeling is precies goed. 21A omvat digitale basisvaardigheden inclusief begrijpen hoe netwerken en internet werken. De missie leert geen programmeren (22B is terecht niet geclaimd). De SLO-mapping-opmerking ("netwerken begrijpen, geen programmeren") is een correct onderscheid.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau passend — zowel voor J2 als uitgebreider voor havo/vwo (13-16 jaar)
- [x] Taalgebruik via chat is tekstueel — geen kleurafhankelijke informatie in de missie zelf
- [x] Concrete vergelijkingen maken abstracte concepten toegankelijk voor visueel ingestelde leerlingen
- [x] Stap-voorbeelden zijn korte, begrijpelijke zinnen

**Score:** 5 / 5

**Opmerkingen:**
> De missie is via tekst en chat volledig toegankelijk. Er zijn geen visuele elementen die de enige informatiedrager zijn. De vergelijkingen (PostNL, telefoonboek) maken het concept toegankelijk voor leerlingen met verschillende leerprofielen.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Instagram-context relevant, primaryGoal aanwezig |
| 2. Visueel | 5 | ×1 = 5 | Beste visualPreview in J2P2, geen hardcoded hex |
| 3. Didactische flow | 5 | ×2 = 10 | DNS→Reis→Troubleshooting perfecte opbouw |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Feitelijk correct, goede analogieën |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | BEOORDELINGSCRITERIA uniek sterk punt |
| 6. Interactiviteit | 4 | ×1 = 4 | Chat-gebaseerd, geen netwerksimulatie |
| 7. Afronding & feedback | 3 | ×1 = 3 | goalCriteria aanwezig, badges/takeaways onduidelijk |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 21A correct, 22B terecht niet geclaimd |
| 9. Toegankelijkheid | 5 | ×1 = 5 | Volledig tekstueel, vergelijkingen inclusief |
| **TOTAAL** | | **52 / 55** | |

### Gewogen totaal

```
(5×1) + (5×1) + (5×2) + (5×2) + (5×1) + (4×1) + (3×1) + (5×1) + (5×1) = 52
Percentage = (52 / 55) × 100% = 94,5%
```

### Verdict

**✅ Klaar voor inzet** (94,5%)

> Een van de sterkste missies in het platform. De Instagram-context, de BEOORDELINGSCRITERIA-sectie en de glassmorphism visualPreview maken dit tot een referentiemissie. De enige zwakke plek is de onduidelijkheid over badges/takeaways in de DataViewer-template, wat bij verificatie eenvoudig op te lossen is.

---

### Actielijst

#### Verbeterpunten (score 3-4 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 7. Afronding & feedback | Verifieer of DataViewer-template badges en takeaways ondersteunt voor network-navigator. Voeg toe indien afwezig. | Medium |
| 2 | 6. Interactiviteit | Overweeg een eenvoudige netwerk-traceroute visualisatie toe te voegen aan de DataViewer | Laag |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
