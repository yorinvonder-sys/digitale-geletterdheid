# Missie-review: ML Trainer (`ml-trainer`)

**Datum:** 2026-07-01 · **Wave:** 9 (verse review) · **Template:** `data-viewer`
**Curriculum:** Leerjaar 3, Periode 1 (Geavanceerd Programmeren & AI) · **SLO (autoritair):** 22B, 21D, 21C

**Config:** `src/features/missions/templates/data-viewer/configs/ml-trainer.ts`
**Agent-rol (dormant):** `src/config/agents/year3.tsx:6-40`
**Visueel bewijs:** geen bestaande screenshots-map voor deze missie; geen vermelding in `docs/audits/student-missions-ui-ux-review-2026-06-30.md` (noch missie-specifiek, noch een data-viewer-template-sectie) — dynamische verificatie overgeslagen, statisch oordeel op basis van config + bekende engine-brede bevindingen.

---

## 🎨 Design review

**Mission:** ml-trainer (data-viewer)
**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (Tailwind tokens):** config bevat geen hardcoded hex voor UI-chrome. De 8 hex-literals zijn alle badge-kleuren (`color: '#202023'` op de 4 badges + `#e1ff01`/`#202023` in de bar-chart) — het bekende, al-geëscaleerde engine-brede badge-tokenisatiepatroon, niet opnieuw rapporteren — `configs/ml-trainer.ts:93-96,208,214,220,226`
- **Criterium 2 (Layout consistentie):** gebruikt hetzelfde `DataViewerConfig`-schema (datasets/questions/badges/takeaways) als de overige 14 data-viewer-missies — geen structurele afwijking
- **Criterium 4 (Copy-lengte):** `introDescription` 38 woorden, dataset-beschrijvingen 16-24 woorden — ruim binnen de leerjaar-3-grens (intro <120, opdracht <80)
- **Criterium 6 (Framer Motion):** geen missie-specifieke animatie-code in de config (animaties zitten in de gedeelde engine — buiten scope van deze review)

### ⚠️ Aandachtspunten
- **Visual Precision Gate — unverified**: geen Chrome-plugin bewijs beschikbaar voor deze missie specifiek, en geen data-viewer-templategroep-sectie in het 30-juni-auditrapport om op terug te vallen (in tegenstelling tot bv. scenario-engine, dat wél een groepscore heeft).
  - **Wat:** deze missie is nooit los gescreenshot/geaudit; geen `.ui-review/`-artefacten en geen `screenshots/`-map te vinden.
  - **Waarom:** zonder dynamisch bewijs kan niet worden bevestigd of de staafgrafiek (dataset 2, 4 balken met de bekende zwart-op-zwart-kleurherhaling `#202023`/`#202023`/`#202023` voor 3 van de 4 balken — zie tech-sectie) leesbaar contrasteert op mobiel, of de document-cards (dataset 3, 4 kaarten met relatief lange body-tekst) prettig scrollen.
  - **Voorstel:** meenemen in een volgende Fase B-sweep zodra een dev-server draait; geen actie nu.

### ❌ Blocking issues
_geen (design-laag zelf)_

### Score
3/4 statisch-verifieerbare criteria geslaagd (Visual Precision Gate = unverified, niet fail) · Aanbeveling: **fix-eerst** (design zelf is ship-klaar; het blokkerende issue zit in de didactiek/tech-laag — zie hieronder)

---

## 📚 Didactiek review

**Mission:** ml-trainer (data-viewer)
**Curriculum-plek:** Leerjaar 3, Periode 1
**SLO-claim:** 22B (Programmeren), 21D (AI), 21C (Data & Dataverwerking) — `slo-kerndoelen-mapping.ts:154`
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes correct):** 22B, 21D en 21C zijn alle drie geldige regulier-VO-codes — `slo-kerndoelen-mapping.ts:154`
- **Criterium 2 (SLO-fit):** 21D (AI) en 21C (Data) worden substantieel geraakt — de hele missie draait om dataset-analyse, features/labels en modelbeoordeling. 22B (Programmeren) is oppervlakkiger: er wordt niet geprogrammeerd, wel "ontwerp"-achtige keuzes gemaakt (welke features kiezen) — grensgeval, geen misalignment
- **Criterium 3 (Leerdoelen helder):** `missionGoals.ts:753-761` bevat een expliciet, meetbaar `primaryGoal` ("Ik begrijp hoe een supervised ML-model werkt...") met concreet `evidence`-criterium ("Je kunt het verschil uitleggen tussen trainings- en testset en aanwijzen welk model overfit")
- **Criterium 5 (Leeftijds-passend):** vocabulaire past bij leerjaar 3 havo/vwo (13-14 jaar) — technische termen (features, labels, overfitting, accuracy) worden elk uitgelegd in de document-cards vóór ze in vragen gebruikt worden — `configs/ml-trainer.ts:144-169`
- **Criterium 6 (Curriculum-plek):** logisch geplaatst in Periode 1 "Geavanceerd Programmeren & AI" naast `neural-navigator`, `data-pipeline`, `api-architect` — bouwt voort op eerdere data-missies (leerjaar 1-2) — `curriculum.ts:249-259`
- **Criterium 7 (Bloom-balans):** goede mix — q1/q4/q5 zijn tellen/vergelijken (toepassen), q2 is een sterkste-voorspeller-analyse (analyseren), q3/q6/q8 zijn open reflectievragen (evalueren/uitleggen), q7 is een diagnose-vraag (analyseren/evalueren). Geen pure onthoud-quiz.

### ⚠️ Aandachtspunten
- **Criterium 2 (SLO-drift agent-rol vs. autoritaire mapping):** de `systemInstruction` van de agent-rol claimt SLO `21D, 22B` maar noemt **21C niet**, terwijl de autoritaire mapping (`slo-kerndoelen-mapping.ts:154`) juist expliciet `21C` toevoegt met de comment `// +21C: dataset preparatie (features, labels, train/test split)` — `year3.tsx:39`
  - **Wat:** de agent (dormant, chat is niet actief voor `ml-trainer` — `templateRegistry.ts:75` heeft geen `enableChat`) noemt bij een eventuele toekomstige activatie een onvolledige SLO-set aan een leerling of docent.
  - **Waarom:** klein risico zolang de chat dormant blijft; wordt een echte inconsistentie zodra dit platform-brede beslispunt wordt opgelost en de rol geactiveerd wordt.
  - **Voorstel:** bij activatie van de agent-rol de `SLO KERNDOELEN`-regel in de systemInstruction bijwerken naar `21D, 22B, 21C` conform de autoritaire mapping. Geen actie nu (dormant).
- **Criterium 4 (Bloom-balans in Bloom-taxonomie q6):** q6 vraagt "Wat betekent een accuracy van 88%? Hoe zou jij dit uitleggen aan een niet-technisch persoon?" — een sterke reflectievraag, maar heeft `type: 'text-observation'` met `correctAnswer: ''`, dus wordt niet automatisch beoordeeld (zie tech-sectie voor het puntensom-gevolg).

### ❌ Blocking issues
_geen (didactische inhoud zelf; het rekenkundige gebrek zit in de tech-laag, zie hieronder)_

### SLO-fit oordeel
- **21D (AI):** sterk geraakt — dataset 1+2+3 draaien allemaal om ML-concepten (supervised learning, accuracy, overfitting)
- **21C (Data & Dataverwerking):** sterk geraakt — dataset-analyse, filteren, features/labels identificeren is de kern van elke ronde
- **22B (Programmeren):** oppervlakkig — geen daadwerkelijke code, wel ontwerpkeuzes over features; consistent met hoe andere data-viewer-missies (bv. `neural-navigator`) 22B claimen zonder code te schrijven

### Score
6/7 toepasbare criteria geslaagd (Criterium 9/welzijn n.v.t. — geen gevoelig onderwerp) · Bloom-balans: **medium-hoog** · Aanbeveling: **fix-eerst** (didactische inhoud is sterk; SLO-drift in agent-rol is een dormant-issue, geen blocker voor ship)

---

## 🔧 Tech review

**Mission:** ml-trainer (data-viewer)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen dev-server beschikbaar in deze reviewrun, en geen bestaande screenshots/audit-vermelding om op terug te vallen

### Static analyse

#### ✅ Geslaagd
- **Criterium A3 (TypeScript-discipline):** config is volledig getypeerd via `DataViewerConfig`, geen `any` of `@ts-ignore` in het bestand
- **Criterium A4 (Imports via alias):** config zelf heeft geen imports die relatief pad-conventies schenden (enige import is `DataViewerConfig` via relatief pad `../DataViewer`, consistent met de andere 14 configs in dezelfde map — geen afwijking)
- **Criterium A7 (Security):** geen `dangerouslySetInnerHTML`, geen leerling-input die direct naar een AI-model gaat (chat is niet enabled voor deze missie — `templateRegistry.ts:75`)

#### ⚠️ Aandachtspunten
- **Puntensom klopt niet met maxScore** — `configs/ml-trainer.ts:201` (`maxScore: 100`) versus de daadwerkelijke som van alle `points`-velden over de 8 vragen: 15+15+10 (dataset 1) + 10+15+10 (dataset 2) + 15+0 (dataset 3) = **90**, niet 100.
  - **Wat:** een leerling die alle 8 vragen 100% correct beantwoordt (inclusief de 2 open text-observation-vragen die sowieso niet automatisch scoren) haalt maximaal 90 punten op een schaal van 100.
  - **Risico:** de hoogste badge (`minScore: 85`, "ML Expert!") is nog wel haalbaar (90≥85), maar de missie oogt onvolledig-gescoord en de leerling ziet nooit "100/100" — een kleine maar zichtbare inconsistentie t.o.v. andere missies waar punten wél optellen tot maxScore. Bovendien is `q8` (classificatie-vs-regressie, text-observation) met `points: 0` gedefinieerd, wat vermoedelijk een bewuste keuze is (open reflectievraag zonder scorewaarde) maar dat verklaart niet de resterende 10-punten-kloof.
  - **Voorstel:** verhoog `maxScore` naar `90` óf herverdeel de punten zodat de som 100 is (bv. `q8` van 0 naar 10 punten, aangezien het wél een valide, beoordeelbare reflectievraag is over classificatie/regressie).
    ```ts
    // ❌ Huidig — configs/ml-trainer.ts:195,201
    points: 0,
    // ...
    maxScore: 100,

    // ✅ Voorgesteld (optie A — punten herverdelen)
    points: 10,
    // ...
    maxScore: 100,
    ```

#### ❌ Blocking issues
- **Feitelijk/rekenkundig incorrecte vraag `q1-spam-percentage`** — `configs/ml-trainer.ts:46-55`. De vraag luidt "Hoeveel procent van de e-mails in deze dataset is gelabeld als 'Spam'?" met `correctAnswer: 50`. De daadwerkelijke 12-rijen dataset (`configs/ml-trainer.ts:33-44`) bevat echter maar **5 Spam-rijen** (ID 1, 3, 5, 7, 10) op 12 totaal = **41,7%**, niet 50%. De bijbehorende `explanation` (regel 52-53) bevestigt de fout expliciet zelf: *"Er zijn 6 spam-mails (ID 1, 3, 5, 7, 10 en één extra)..."* — er ís geen "extra" spam-rij; de opsomming noemt zelf maar 5 ID's en telt ze dan toch als 6.
  - **Wat:** een leerling die de dataset correct telt (5/12 = 41,7% of afgerond 42%) krijgt het antwoord **fout gerekend**, ondanks dat die/diegene het juiste analytische werk heeft gedaan. Dit is precies het soort content-bug die het leerdoel ondermijnt ("analyseer de dataset correct") — de missie straft correcte analyse af.
  - **Risico:** dit is de eerste vraag van de eerste dataset — een leerling die hier vastloopt of het als fout ervaart terwijl die/diegene wél correct telde, verliest vertrouwen in de rest van de missie en in het eigen rekenwerk.
  - **Voorstel:** twee opties, beide vereisen een keuze van Yorin over de bedoelde dataset-grootte:

    **Optie A — corrigeer het antwoord naar de werkelijke data (minimale fix, 2 regels):**
    ```ts
    // ❌ Huidig — configs/ml-trainer.ts:49-53
    question: 'Hoeveel procent van de e-mails in deze dataset is gelabeld als "Spam"?',
    type: 'number-input',
    correctAnswer: 50,
    explanation:
        'Er zijn 6 spam-mails (ID 1, 3, 5, 7, 10 en één extra) en 6 geen-spam-mails. 6 ÷ 12 × 100 = 50%. Filter op "Label" = "Spam" om te tellen. Een gebalanceerde dataset (50/50) is ideaal voor training — anders leert het model een voorkeur voor de meest voorkomende klasse.',

    // ✅ Voorgesteld
    question: 'Hoeveel procent van de e-mails in deze dataset is gelabeld als "Spam"?',
    type: 'number-input',
    correctAnswer: 42,
    explanation:
        'Er zijn 5 spam-mails (ID 1, 3, 5, 7, 10) en 7 geen-spam-mails. 5 ÷ 12 × 100 ≈ 42%. Filter op "Label" = "Spam" om te tellen. Deze dataset is licht ongebalanceerd (42/58) — in de praktijk leren modellen beter van een meer gebalanceerde verdeling, anders krijgen ze een voorkeur voor de meest voorkomende klasse.'
    ```
    Let op: `number-input`-vragen vergelijken vermoedelijk exact — controleer of de engine afgeronde percentages (41,7 vs 42) tolereert, of gebruik een expliciet afgeronde waarde in zowel vraag als antwoord.

    **Optie B — pas de dataset aan zodat 50% klopt (voegt 1 spam-rij toe, wijzigt de "12 e-mails"-titel naar "13"):** minder wenselijk, want de titel en `q5` (accuracy-sprong-berekening, ongerelateerd aan spam-percentage) blijven ongemoeid, maar dit raakt meer regels dan optie A voor hetzelfde resultaat.

    **Aanbevolen: Optie A** — kleinste, meest surgical fix; raakt alleen de vraag zelf, niet de dataset die q2 en de document-cards ook gebruiken.

### Dynamic verificatie (indien uitgevoerd)
_niet uitgevoerd — geen dev-server beschikbaar in deze reviewrun. Geen bestaand `.ui-review/`- of `screenshots/`-artefact voor `ml-trainer` om op terug te vallen._

### Score
Static: 3/4 toepasbare criteria geslaagd, 1 blocking (q1 rekenfout) · Dynamic: n.v.t. · Aanbeveling: **kritieke fix vereist** (q1 correctAnswer/explanation) vóór ship; puntensom-mismatch is een secundaire fix-eerst

---

## Samenvatting & vervolgstappen

**Triage-berekening** (schaal 0-10, 10=uitstekend; conform BEKEND-instructie):
- Design-score: **8/10** (sterke config, enige gebrek is ontbrekend visueel bewijs — geen inhoudelijk gebrek)
- Didactiek-score: **8/10** (sterke SLO-fit en Bloom-balans; enige minpunt is de dormant SLO-drift in de agent-rol, geen blocker)
- Tech-score: **3/10** (blocking rekenfout in de kern-content van de eerste vraag + puntensom-mismatch; dit weegt zwaar omdat het de leerling direct een foutief "fout"-oordeel geeft)

```
triageScore = (10-design)*0.3 + (10-didactiek)*0.4 + (10-tech)*0.3
            = (10-8)*0.3 + (10-8)*0.4 + (10-3)*0.3
            = 2*0.3 + 2*0.4 + 7*0.3
            = 0.6 + 0.8 + 2.1
            = 3.5
```

**Eindoordeel:** **fix-eerst** — niet ship-klaar. De blocking-fout in `q1-spam-percentage` (correctAnswer 50 vs. werkelijke 41,7%) is een content-bug die een correct-analyserende leerling direct fout rekent — dit ondermijnt het kernleerdoel van de missie. Gecombineerd met de puntensom-mismatch (90 vs. maxScore 100) is dit een klein maar concreet fix-eerst-pakket (2 velden in 1 vraag + 1 veld voor de puntensom), geen herontwerp.

**Extra bevinding (niet-blocking, ter info):** `src/features/missions/MLTrainerMission.tsx` is een volledig ongebruikte/orphaned handcrafted component voor deze missie (geen enkele import elders in de codebase — geverifieerd via repo-brede grep). De actieve, geregistreerde implementatie is uitsluitend de `data-viewer`-config die in dit rapport is gereviewd (`templateRegistry.ts:75`). Dit dode bestand is buiten scope van deze content-review maar is een kandidaat voor een aparte opschoon-taak.
