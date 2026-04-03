# Audit — Neural Navigator (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `neural-navigator` |
| **Titel** | Neural Navigator |
| **Leerjaar & Periode** | Leerjaar 3, Periode 1 |
| **Template-engine** | DataViewer + standalone NeuralNavigatorMission.tsx |
| **SLO-kerndoelen** | 21D (AI), 22B (Programmeren) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en begrijpelijk — "Word een Neural Navigator" is actief en uitnodigend
- [x] `introDescription` maakt duidelijk wat neurale netwerken zijn en wat je gaat doen
- [x] Emoji ⚡ past bij het energie/activiteit-thema van neuronen
- [x] Moeilijkheidsgraad "Hard" is correct voor J3 havo/vwo
- [x] `introFeatures` (3 bullets) zijn concreet: forward pass berekenen, gewichtseffect vergelijken, backpropagation beoordelen

**Bronbestanden:** `components/missions/templates/data-viewer/configs/neural-navigator.ts:3-14`

**Score:** 5 / 5

**Opmerkingen:**
> Sterke eerste indruk. "Geïnspireerd op het menselijk brein" in de introductie is een effectieve haak. De drie features beschrijven precies het leertraject.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [ ] Staafgrafiek gebruikt hardcoded hex-kleuren (`#EF4444`, `#10B981`, `#F97316`, `#3B82F6`, `#8B5CF6`, `#6B7280`) — 6 kleuren in één grafiek
- [x] DataViewer responsive lay-out is bewezen
- [x] Tabel-weergave voor 4 neurons is overzichtelijk (7 kolommen)
- [ ] 7-koloms tabel kan op 375px mobiel horizontaal scrollen vereisen

**Bronbestanden:** `components/missions/templates/data-viewer/configs/neural-navigator.ts:80-87`

**Score:** 3 / 5

**Opmerkingen:**
> Dezelfde hardcoded hex-kleurenproblematiek als bij ml-trainer, maar hier met 6 kleuren in één grafiek (voor vs. na training). Op mobiel kan de 7-koloms neuron-tabel problematisch zijn. De standalone NeuralNavigatorMission.tsx heeft een eigen visuele lay-out die niet beoordeeld kan worden zonder runtime.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw: Forward pass berekenen → Trainingseffect vergelijken → Netwerkarchitectuur begrijpen
- [x] Elke stap bouwt voort — je kunt pas de lagen begrijpen als je de neuronberekening snapt
- [x] Moeilijkheid past bij leerjaar — "Hard" voor J3 is correct
- [x] STEP_COMPLETE markers aanwezig (3/3): neuronberekening → netwerk getekend → backpropagation uitgelegd
- [x] De vier begripskaarten (input/hidden/output layer + activatiefunctie) zijn een goede conceptuele samenvatting
- [x] Reflectievragen (text-observation) stimuleren toepassing op eigen ervaringen

**Bronbestanden:** `config/agents/year3.tsx:227-231`, `components/missions/templates/data-viewer/configs/neural-navigator.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw. De rekenkundige aanpak (forward pass numeriek doorrekenen) gevolgd door conceptuele uitleg (lagen en activatiefuncties) is een bewezen wiskundig-conceptuele opbouw die goed werkt voor havo/vwo. De NeuralNavigatorMission.tsx voegt een visueel-interactieve gewichtsaanpassingslaag toe die de abstractie concreet maakt.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Forward pass formule correct: (input × gewicht) + bias = output
- [x] Neuron B controle: (1.0×0.2)+(0.4×0.7)+0.0 = 0.2+0.28 = 0.48 — correct
- [x] Backpropagation-uitleg correct — vergelijking basketbalworp is didactisch effectief
- [x] ReLU-activatiefunctie correct beschreven: "geef waarde door als positief, anders 0"
- [x] Weergave voor/na training correct — 0.12 → 0.87 voor cijfer 3 na 1000 trainingsrondes
- [x] Geen aantoonbare spelfouten

**Bronbestanden:** `components/missions/templates/data-viewer/configs/neural-navigator.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk uitstekend. De numerieke rekenvoorbeelden zijn exact correct. De vergelijking met dagelijkse apps (TikTok-aanbevelingen, gezichtsontgrendeling) in de reflectievraag maakt het relevant. De tabel met 4 neurons is consistent en correct.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens — ruim voldoende
- [x] EERSTE BERICHT aanwezig — "Agent, welkom bij het onderzoekslab. We hebben een probleem."
- [x] STEP_COMPLETE markers aanwezig voor alle drie stappen (3/3)
- [x] Toon past bij de rolnaam — "AI-wetenschapper" is inspirerend voor J3
- [x] SCOPE GUARD aanwezig — "Maak het concreet met berekeningen en ASCII-schema's"
- [x] Farming-detectie actief via gedeelde suffix

**Bronbestanden:** `config/agents/year3.tsx:203-265`

**Score:** 5 / 5

**Opmerkingen:**
> De coach-instructie is goed geconfigureerd. De hint dat de coach ASCII-schema's mag gebruiken om het netwerk te visualiseren is een waardevolle didactische tool voor een tekstgebaseerde chat.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] DataViewer (8 vragen over 3 datasets) + standalone NeuralNavigatorMission.tsx bieden complementaire ervaringen
- [x] De interactieve gewichtsaanpassing in NeuralNavigatorMission.tsx is didactisch zeer waardevol — leerlingen zien direct het effect
- [x] Variatie in vraagtypen: number-input (exact rekenen), multiple-choice (conceptkeuze), text-observation (reflectie)
- [ ] Integratie DataViewer en NeuralNavigatorMission.tsx is onduidelijk — zelfde mismatch als bij ml-trainer

**Bronbestanden:** `components/missions/NeuralNavigatorMission.tsx`

**Score:** 4 / 5

**Opmerkingen:**
> De standalone NeuralNavigatorMission.tsx is technisch indrukwekkend — echte forward pass berekeningen in React met sigmoid-activatie. De didactische waarde is hoog. De integratieonduidelijkheid met de DataViewer is hetzelfde minpunt als bij ml-trainer.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Badges aanwezig: ⚡ Neural Netwerk Expert! (≥85), 🧠 Netwerk Navigator (≥65), 🔌 Neuron Ontdekker (≥40), 📚 Aan de slag! (≥0)
- [x] `maxScore: 100` is helder
- [x] `takeaways[]` aanwezig — 5 kernlessen die de missie samenvatten
- [x] Badgenames zijn thematisch consistent en motiverend
- [x] Puntenstructuur: 20+10+10+15+10+10+15+0 = 90 scoreable punten van 100

**Bronbestanden:** `components/missions/templates/data-viewer/configs/neural-navigator.ts:186-222`

**Score:** 5 / 5

**Opmerkingen:**
> Volledige afrondingsset. De takeaway "Activatiefuncties zorgen dat netwerken niet-lineaire patronen kunnen leren" is precies goed niveau voor J3 — inhoudelijk correct en toch begrijpelijk.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] 21D (AI): neurale netwerken zijn kern van moderne AI-kennis
- [x] 22B (Programmeren): forward pass berekeningen en het begrijpen van algoritmen past bij computationeel denken
- [x] Mapping is consistent met `slo-kerndoelen-mapping.ts` (week 1, J3)

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:154`

**Score:** 5 / 5

**Opmerkingen:**
> De dubbele SLO-koppeling is onderbouwd. Voor een missie die expliciet numerieke berekeningen vraagt is 22B (programmeren/computational thinking) terecht opgenomen.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij J3 havo/vwo
- [ ] Staafgrafiek gebruikt 6 kleuren als enig onderscheidingsmiddel — problematisch voor kleurblindheid
- [x] Neuron-tabel is kleur-onafhankelijk (sorteren op output werkt zonder kleur)
- [ ] De NeuralNavigatorMission.tsx gebruikt visuele feedback die mogelijk alleen via kleur wordt overgebracht (groen = correct, rood = fout) — niet verifieerbaar

**Bronbestanden:** `components/missions/NeuralNavigatorMission.tsx`

**Score:** 3 / 5

**Opmerkingen:**
> Toegankelijkheidszorgen zijn gelijk aan ml-trainer plus de onzekerheid over NeuralNavigatorMission.tsx visuele feedback.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Actief, helder, goede haak |
| 2. Visueel | 3 | ×1 = 3 | Hardcoded kleuren, mobiel tabel-zorg |
| 3. Didactische flow | 5 | ×2 = 10 | Rekenkundig-conceptueel, STEP_COMPLETE compleet |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Rekenvoorbeelden exact correct |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | Volledig geconfigureerd |
| 6. Interactiviteit | 4 | ×1 = 4 | Sterke standalone component, integratie onduidelijk |
| 7. Afronding & feedback | 5 | ×1 = 5 | Badges en takeaways compleet |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 21D+22B aantoonbaar aanwezig |
| 9. Toegankelijkheid | 3 | ×1 = 3 | Grafiek-kleuren zonder alternatief |
| **TOTAAL** | | **50 / 55** | |

### Gewogen totaal

```
(5×1) + (3×1) + (5×2) + (5×2) + (5×1) + (4×1) + (5×1) + (5×1) + (3×1) = 50
Percentage = (50 / 55) × 100% = 90,9%
```

### Verdict

**✅ Klaar** (90,9% — ruim boven de 80% drempel)

> Inhoudelijk en didactisch een sterke missie. De NeuralNavigatorMission.tsx is een uniek interactief element. Twee structurele verbeterpunten (kleuren, integratie) maar geen blockers.

---

### Actielijst

#### Verbeterpunten (score 3 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 2. Visueel | Hardcoded hex-kleuren in `chartData` vervangen door `lab-*` tokens | Medium |
| 2 | 9. Toegankelijkheid | Staafgrafiek: 6 kleuren — voeg datawaarden als tekstlabel toe zodat kleur niet het enige onderscheid is | Medium |

#### Nice-to-haves

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 6. Interactiviteit | Verduidelijken hoe DataViewer en NeuralNavigatorMission.tsx samenhangen in de gebruikersflow |
| 2 | 9. Toegankelijkheid | NeuralNavigatorMission.tsx feedback-kleuren controleren op kleuronafhankelijkheid |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
