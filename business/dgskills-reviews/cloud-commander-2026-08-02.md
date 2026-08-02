# Missie-review: Cloud Commander

**Mission ID:** `cloud-commander`
**Template:** `tool-guide`
**Curriculum-plek:** Leerjaar 1, Periode 1
**Productiebron vóór fix:** `3ac58caabf38aee2ea16a487bf2b0ca0d6a8770e`
**Fixcommit:** `4128aceb7e4b7306aeaad4730f562eea4706d993`
**Datum:** 2026-08-02
**Reviewer-pipeline:** `dgskills-mission-review` met design-, didactiek- en tech-rubrics; interne-browserworkers; onafhankelijke Sol-herbeoordeling; Sol-eindvalidatie
**Eindoordeel:** **FIX-EERST TOT MERGE EN PRODUCTIEHERCONTROLE**

## Managementsamenvatting

De leerlingopdracht is volledig met zichtbare klikken doorlopen op desktop, iPad-portret, iPad-landschap en mobiel. De productieflow op mobiel werd met één synthetisch QA-account voltooid en bleef na reload bewaard. De lokale side-effectvrije preview bewees de overige formaten zonder XP- of voortgangsmutaties.

De review vond twee HIGH-bevindingen:

1. De intro beloofde **50 XP**, terwijl productie door de servercap aantoonbaar **25 XP** toekende.
2. De missie claimde veilig delen en SLO 23A, maar liet een leerling volle punten halen zonder toegangsbereik of kijk-/bewerkrechten te kiezen en controleren.

Beide zijn in [PR #260](https://github.com/yorinvonder-sys/digitale-geletterdheid/pull/260) op commit `4128ace` hersteld. De intro belooft nu 25 XP. De deelstap vereist `Specifieke personen`, een bewuste keuze voor Bekijken/Bewerken, controle via `Toegang beheren`, een docentcheck en een inhoudelijke checkvraag.

De missie telt nog niet als 2/97: de fix-PR is nog niet gemerged en nog niet opnieuw op productie bewezen. Vercel en performance zijn groen; GitHub `quality-checks` blokkeert uitsluitend op de bestaande repo-brede advisory `GHSA-mh99-v99m-4gvg`, buiten de missie-inhoud.

## Auditgrens

- Dit is een review van de leerlingopdracht, niet een security-audit.
- Alleen het mobiele synthetische QA-account muteerde productie; de andere routes deden `productionMutations=0` en `xpMutations=0`.
- Geen echte leerlingnamen, deellinks, bestandsnamen, wachtwoorden of tokens zijn in rapporten of evidence opgenomen.
- De tijdelijke QA-accounts blijven bestaan totdat heel Jaar 1, Periode 1 is afgerond.
- iPadmetingen zijn Chromium CSS-viewportemulaties; fysieke Safari/iPad blijft onbewezen.

## HIGH-bevindingen en minimumfix

### HIGH 1 — XP-belofte week af van productie

- Alle vier intro-evidences op productie-SHA `3ac58ca` tonen `+50 XP`.
- De productiecompletion verhoogde het synthetische account exact van 25 naar 50 XP: één Cloud Commander-transactie van 25 XP.
- De standaard Easy-beloning is 50; Cloud Commander had geen missieoverride. — `src/config/xp.ts:3-24`
- Fix: `cloud-commander: 25` toegevoegd en als contracttest vastgelegd. — `src/config/xp.ts:19-22`; `tests/mission-xp-contract.test.ts`

### HIGH 2 — “Veilig delen” toetste geen toegang of rechten

- De missieclaim en SLO-mapping vereisen veilig delen en privacybewust handelen. — `src/config/missionGoals.ts:13-21`; `src/config/slo-kerndoelen-mapping.ts:27-32`
- De oude stap toetste alleen het maken/versturen van een link en het voordeel van actuele versie-inhoud.
- Een link is niet automatisch veiliger: bereik en rechten bepalen wie kan kijken of bewerken.
- Fix: stap 4 laat `Specifieke personen`, `Bekijken` of bewust `Bewerken`, `Toegang beheren`, docentbewijs en een passende checkvraag uitvoeren. — `src/features/missions/templates/tool-guide/configs/cloud-commander.ts:65-85`
- Twee gerichte contracttests borgen de toegangs- en rechtenbeslissing. — `tests/cloud-commander-contract.test.ts`

## Viewport- en flowbewijs

| Oppervlak | CSS-viewport | Route | Post-fixstatus | Bewijs |
|---|---:|---|---|---|
| Desktop | 1440x900 | lokale DEV-preview | PASS | `screenshots/mission-audit/batches/j1p1/cloud-commander/4128ace/local-preview/desktop/` |
| iPad portret | 820x1180 | lokale DEV-preview | PASS met capture-caveat | `screenshots/mission-audit/batches/j1p1/cloud-commander/4128ace/local-preview/ipad-portrait/` |
| iPad landschap | 1180x820 | lokale DEV-preview | PASS met capture-caveat | `screenshots/mission-audit/batches/j1p1/cloud-commander/4128ace/local-preview/ipad-landscape/` |
| Mobiel | 390x844 | lokale DEV-preview | PASS | `screenshots/mission-audit/batches/j1p1/cloud-commander/4128ace/local-preview/mobile/` |

Elke volledige route bevat intro, normale flow, één bewuste fout met zichtbare feedback, de nieuwe deelstap, resultaat en eindstaat na precies één klik op de definitieve CTA. De bewuste fout was de keuze dat OneDrive-bestanden alleen op de iPad staan. De feedback noemt en verklaart het juiste cloudantwoord. Het resultaat is `45/50 punten (90%)`; stap 4 levert na alle nieuwe controles `15/15`.

De eerste post-fix screenshots zijn afgekeurd: een combinatie van transitie-animatie, zoom en `fullPage:true` legde slechts een deel van de pagina vast. De definitieve evidence gebruikt 100% zoom, wacht na iedere transitie en maakt alleen viewportcaptures. Daarmee wordt een capturefout niet als product-PASS vermomd.

Alle 24 definitieve screenshots in de vier manifests hebben een geldige SHA-256-hash. Tijdelijke `00-*`- en superseded debugcaptures zijn expliciet uitgesloten van de hashsets.

## 🎨 Design review

### ✅ Geslaagd

- **Visual Precision Gate:** de geldige intro-, flow-, foutfeedback-, deel- en eindstaten tonen geen horizontale overflow, overlappende controls, afgekapte kernlabels of onbruikbare CTA's.
- **Responsive gedrag:** dezelfde inhoud en bediening werken op desktop, beide tabletoriëntaties en mobiel.
- **Knop-clarity:** checklist, antwoord, docentcheck, volgende stap en completion zijn echte buttons met duidelijke labels en focusringen. — `src/features/missions/templates/tool-guide/ToolGuide.tsx:243-310,348-424`
- **Copy-fit:** de intro en vier stapinstructies blijven kort en concreet voor leerjaar 1. — `src/features/missions/templates/tool-guide/configs/cloud-commander.ts:8-85`
- **Resultaatduidelijkheid:** score, fases, badge, leeropbrengst en definitieve CTA blijven zichtbaar en logisch geordend.

### ⚠️ Aandachtspunten

- **[DGS-76](https://linear.app/dgskillsapp/issue/DGS-76/low-render-nadruk-in-toolguide-tips-zonder-letterlijke-sterretjes) — Low — letterlijke Markdown-markering in tips:** `ToolGuide` rendert instructies via `RichText`, maar tiptekst als gewone `p`. Daardoor is `**Bekijken**` in de deeltip zichtbaar met sterretjes. Dit is cosmetisch en blokkeert begrip of completion niet. — `src/features/missions/templates/tool-guide/ToolGuide.tsx:217-227`; `src/features/missions/templates/tool-guide/configs/cloud-commander.ts:70`
- De tabletchecks zijn browseremulatie; **Echte iPad-check nodig** voor fysieke Safari-eigenaardigheden.

### ❌ Blocking issues

Geen visuele blocker.

### Score

6/7 criteria volledig geslaagd · Visual Precision Gate: **PASS** · Aanbeveling: **ship na productiehercontrole**

## 📚 Didactiek review

**SLO-claim:** regulier `21A`, `23A` · VSO `18A`, `20A` — `src/config/slo-kerndoelen-mapping.ts:27-32`

### ✅ Geslaagd

- **SLO-codes en curriculum:** geldig en logisch in Jaar 1, Periode 1 Digitale Basisvaardigheden. — `src/config/curriculum.ts:61-73`
- **21A-fit:** de leerling onderscheidt lokale en cloudopslag en voert echte mappen- en uploadhandelingen uit.
- **23A-fit na fix:** de leerling kiest een beperkt toegangsbereik, passende rechten en controleert wie toegang heeft.
- **Observeerbare leerdoelen:** herkennen, toepassen, uploaden, controleren en rechten instellen zijn meetbaar. — `src/features/missions/templates/tool-guide/configs/cloud-commander.ts:109-120`
- **Leerbaar bewijs:** de School-map en upload worden aan de docent getoond; de deelactie krijgt een aparte docentcheck zonder dat DGSkills namen of links opslaat.
- **Feedbackkwaliteit:** de foutfeedback noemt het juiste antwoord en legt uit wat cloudservers betekenen.
- **AI-as-copilot:** n.v.t.; deze missie gebruikt geen chat.

### ⚠️ Aandachtspunten

- Na een fout antwoord zijn de opties disabled. De uitleg is bruikbaar en de flow gaat verder, maar de leerling kiest het correcte antwoord niet actief opnieuw. Dit is de al bekende templatebrede medium uit DGS-74.

### ❌ Blocking issues

Geen didactische blocker na de fix.

### SLO-fit oordeel en score

- **21A:** sterk geraakt op instap- en toepassingsniveau.
- **23A:** na de fix sterk geraakt door een echte privacy- en rechtenbeslissing.

8/9 criteria geslaagd · Bloom-balans: laag tot midden met praktisch toepassen · Aanbeveling: **ship na productiehercontrole**

## 🔧 Tech review

### Static analyse — ✅ geslaagd

- Alle interactieve controls hebben gekoppelde handlers. — `src/features/missions/templates/tool-guide/ToolGuide.tsx:243-310,348-424`
- De scoreberekening is intern consistent: vier stappen van 10 punten plus twee checkvragen van 5 punten is maximaal 50. — `src/features/missions/templates/tool-guide/ToolGuide.tsx:76-95`; `src/features/missions/templates/tool-guide/configs/cloud-commander.ts:87-107`
- `useMissionAutoSave` bewaart de tussenstand; completion wist de lokale save pas bij de definitieve CTA. — `src/features/missions/templates/tool-guide/ToolGuide.tsx:441-455,519-555`
- De dynamische import heeft een loading- en foutstaat; mission-ID's zijn geallowlist. — `src/features/missions/templates/tool-guide/ToolGuide.tsx:52-61,591-620`
- Geen AI-call, leerling-HTML-injectie of leerlingtekstverwerking in de opdrachtflow.

### Dynamic verificatie

- Productie vóór fix: volledige mobiele completion, één 25-XP-transactie, dashboard/portfolio en reloadpersistentie bewezen.
- Post-fix: volledige side-effectvrije flow op vier CSS-viewports; `productionMutations=0` en `xpMutations=0`.
- Lokale preview meldt uitsluitend de verwachte ontbrekende Supabase-env van de side-effectvrije harness.
- Productie vóór fix gaf geen console-errors, wel niet-blokkerende GSAP missing-targetwaarschuwingen en een `THREE.Clock`-deprecation.

### ❌ Blocking issues

- Geen productcodeblocker in de missie.
- Releaseketen tijdelijk geblokkeerd door de bestaande repo-brede dependency-advisory in GitHub `quality-checks`.

### Score

Static: 7/7 · Dynamic: 4/4 viewports · Aanbeveling: **merge na groene gate, daarna productiehercontrole**

## Verificatieketen

- `node --test tests/mission-xp-contract.test.ts tests/cloud-commander-contract.test.ts`: 5/5 geslaagd.
- `npm run doctor`: geslaagd.
- `npm run typecheck`: geslaagd.
- `npm run build:prod`: geslaagd; lokale build meldt verwacht ontbrekende Supabase-env.
- Vercel preview voor `4128ace`: READY.
- GitHub performance: PASS.
- GitHub quality-checks: FAIL uitsluitend bij `npm run audit:security` door `GHSA-mh99-v99m-4gvg`; niet veroorzaakt door deze missie-diff.
- Fix-PR: [#260](https://github.com/yorinvonder-sys/digitale-geletterdheid/pull/260).
- Evidence-PR: [#257](https://github.com/yorinvonder-sys/digitale-geletterdheid/pull/257).

## Open acties en resterend risico

1. Los de bestaande repo-brede CI-advisory buiten deze missie-review op; merge daarna PR #260.
2. Hercontroleer de gemergde productieversie met een vers synthetisch QA-account: intro 25 XP, volledige nieuwe deelstap, exact één completion, één 25-XP-transactie en reloadpersistentie.
3. DGS-76 bewaart de letterlijke Markdown-markering als low zonder de periodebatch uit te breiden.
4. Fysieke Safari/iPad blijft onbewezen.
5. Verwijder de tijdelijke QA-accounts pas na alle vijf missies van Jaar 1, Periode 1.

## Eindstatus

**Cloud Commander is inhoudelijk hersteld maar telt nog niet als missie 2 van 5 of 2 van 97. Verdict: FIX-EERST tot merge en productiehercontrole.**
