# Missie-review: Mail Detective

**Mission ID:** `mail-detective`
**Template:** `scenario-engine`
**Curriculum-plek:** Leerjaar 1, Periode 3 - Digitaal Burgerschap
**Datum:** 2026-05-08
**Reviewer-pipeline:** Codex orchestrator (`gpt-5.5`) met drie Spark-subagents (`design`, `didactiek`, `tech`)
**Status:** Fix-eerst voor pilot/ship; intern testbaar

---

## Samenvatting

Mail Detective is inhoudelijk sterk geplaatst: de missie traint precies wat SLO 23A vraagt, staat in de juiste periode, heeft nu expliciete leerdoelen en is technisch correct geregistreerd. De oude build-blockers uit het rapport van 2026-05-06 zijn opgelost: `goalCriteria` is geen ongeldig type meer en `mail_detective.webp` bestaat.

De resterende aandachtspunten zitten in drie lagen:

1. De missie heeft twee schermen met 8 keuzes, wat voor leerjaar 1 waarschijnlijk te zwaar is.
2. `goalCriteria: { type: 'custom' }` is type-technisch geldig, maar wordt in `AiLab` niet afgehandeld.
3. De gedeelde scenario-engine heeft contrast- en hoverfeedbackproblemen die de toegankelijkheid raken; de browsercheck bevestigt dat foutfeedback op coral visueel vrijwel wegvalt.

---

## Topbevindingen

### 1. Functioneel: `custom` goalCriteria wordt niet uitgevoerd

**Ernst:** Medium
**Impact:** De primaire missie-doelstelling kan niet automatisch als behaald worden herkend via de bestaande goal-detectie. De missie zelf kan nog werken, maar het doelmodal/extra XP-pad is functioneel ineffectief voor deze missie.

**Bewijs:**
- `mail-detective` gebruikt `goalCriteria: { type: 'custom', min: 60 }` in `config/agents/year1.tsx:4205`.
- `AiLab` handelt alleen `message-count` en `steps-complete` af in `components/AiLab.tsx:315-327`.
- `types.ts:123` staat ook `code-changes` en `custom` toe, maar die worden daar niet verwerkt.

**Voorstel:** Kies een van deze twee routes:
- Maak `mail-detective` `goalCriteria: { type: 'steps-complete', min: 4 }` als doel-behaald gekoppeld moet zijn aan vier rondes.
- Of implementeer expliciete `custom`/score-afhandeling voor template-missies.

### 2. Didactiek: ronde 1 en 4 bevatten 8 keuzes per scherm

**Ernst:** Medium
**Impact:** Voor leerjaar 1 is 8 opties met uitleg per scherm cognitief zwaar. Leerlingen kunnen gaan gokken of afhaken, terwijl de inhoud zelf goed is.

**Bewijs:**
- Ronde 1 `signalen-herkennen` bevat 8 items in `components/missions/templates/scenario-engine/configs/mail-detective.ts:57-155`.
- Ronde 4 `slim-reageren` bevat 8 items in `components/missions/templates/scenario-engine/configs/mail-detective.ts:306-400`.
- De review-rubric voor leerjaar 1-2 stuurt op maximaal 3-4 keuzes per scherm.

**Voorstel:** Splits beide 8-item rondes in kleinere stappen, of reduceer per ronde naar 4 kernitems. Beste inhoudelijke route: ronde 1 focussen op herkennen, ronde 4 focussen op handelen.

### 3. Toegankelijkheid: foutfeedback in binary-choice heeft slecht contrast

**Ernst:** Medium
**Impact:** Bij een fout antwoord wordt de kaart `bg-lab-coral`, maar de feedbacktekst blijft `text-lab-coral`. In de browsercheck op mobiel was de uitleg op de coral kaart daardoor vrijwel onzichtbaar. Dat raakt WCAG/leerlingtoegankelijkheid.

**Bewijs:**
- Foute kaartstijl: `components/missions/templates/scenario-engine/sub/BinaryChoiceRound.tsx:29-35`.
- Foutfeedbacktekst: `components/missions/templates/scenario-engine/sub/BinaryChoiceRound.tsx:82-90`.

**Voorstel:** Gebruik bij foutfeedback op coral-achtergrond `text-white` of plaats feedback in een lichte sub-container.

### 3b. Mobiel: feedback-badges kunnen aan de rechterkant wegvallen

**Ernst:** Low/Medium
**Impact:** Na het indienen van ronde 1 viel op mobiel de `gemist!` badge aan de rechterkant deels buiten beeld. Dit maakt feedback minder scanbaar en kan horizontale overloop veroorzaken.

**Bewijs:**
- De titelregel en statusbadge staan in dezelfde flexrij in `components/missions/templates/scenario-engine/sub/SelectCorrectRound.tsx:38-55`.
- Browsercheck op 390px breedte liet de `gemist!` tekst rechts afgesneden zien.

**Voorstel:** Laat titel en badge wrappen of stapelen op mobiel, bijvoorbeeld met `flex-wrap`, `min-w-0`, en een aparte regel voor de statusbadge.

### 4. UX: hover-states geven weinig tot geen visuele feedback

**Ernst:** Low/Medium
**Impact:** Desktopgebruikers krijgen minder duidelijke interactieterugkoppeling. Dit is geen blocker, maar wel polish die de engine betrouwbaarder laat voelen.

**Bewijs:**
- `SelectCorrectRound` gebruikt `bg-[#D97848] hover:bg-[#D97848]` in `components/missions/templates/scenario-engine/sub/SelectCorrectRound.tsx:89-93`.
- `BinaryChoiceRound` gebruikt hetzelfde patroon in `components/missions/templates/scenario-engine/sub/BinaryChoiceRound.tsx:99-104`.

**Voorstel:** Gebruik bijvoorbeeld `hover:brightness-95`, `hover:shadow-md` of een echte tokenvariant.

### 5. Didactiek: Bloom-balans is laag-midden

**Ernst:** Low/Medium
**Impact:** De missie traint herkenning en risicorangschikking goed, maar laat leerlingen weinig uitleggen waarom een keuze veilig of onveilig is.

**Bewijs:**
- De vier rondes zijn selectie-, orden- en binary-choice taken in `components/missions/templates/scenario-engine/configs/mail-detective.ts:57-400`.
- Er is geen afsluitende reflectie/follow-up vraag in de config.

**Voorstel:** Voeg na ronde 4 een korte reflectievraag toe: "Welke twee signalen check jij voortaan eerst voordat je op een link in een schoolmail klikt?"

---

## Wat goed staat

- `mail-detective` staat correct in de template registry als `scenario-engine`: `config/templateRegistry.ts:8-11`.
- De curriculumplek is logisch: leerjaar 1, periode 3, Digitaal Burgerschap: `config/curriculum.ts:104-124`.
- SLO-mapping is passend en compact: `23A`, plus VSO `18B` en `20A`: `config/slo-kerndoelen-mapping.ts:72`.
- De mission-config gebruikt expliciete, meetbare leerdoelen: `components/missions/templates/scenario-engine/configs/mail-detective.ts:16-20`.
- De briefing-afbeelding verwijst naar een bestaande asset: `config/agents/year1.tsx:4201`, `public/assets/agents/mail_detective.webp`.
- De oude TypeScript-fout rond `'score-threshold'` is opgelost: `config/agents/year1.tsx:4205` gebruikt nu `custom`.

---

## Verificatie

- Subagent review uitgevoerd in drie parallelle sporen: design, didactiek, techniek.
- Lokale statische verificatie uitgevoerd op relevante bestanden.
- Visuele browsercheck uitgevoerd via tijdelijke dev-route op `http://127.0.0.1:5176/dev/mail-detective-visual-check`, daarna route en harness verwijderd.
- Desktop intro gecontroleerd: missie rendert en startknop is aanwezig.
- Mobiele ronde 1 gecontroleerd op 390px breedte: inhoud rendert, maar 8 items maken het scherm lang en na indienen viel `gemist!` rechts deels weg.
- Binary-choice feedback gecontroleerd: foutfeedback op coral kaart was visueel nauwelijks leesbaar.
- `npm run doctor` uitgevoerd: critical TypeScript check geslaagd.
- Geen volledige end-to-end afronding van alle vier rondes uitgevoerd.

---

## Codex-stempel

**Verdict:** Fix-eerst voor pilot/ship.

**Reden:** Geen harde runtime-blocker gevonden, maar er zijn drie relevante kwaliteitsrisico's: `custom` goalCriteria zonder runtime-afhandeling, hoge cognitieve belasting door 8-keuze schermen, en een visueel bevestigde contrastfout in de gedeelde scenario-engine. Voor interne test is de missie bruikbaar; voor een schoolpilot zou ik eerst deze punten oplossen of bewust accepteren.
