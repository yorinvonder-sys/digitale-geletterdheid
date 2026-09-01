## Gespeeld
- Ja; begin-tot-eind: ja (intro → 4 fasen → eindscherm 96/100)
- Commit-SHA: 169e76bb906e056199ce3c5a361ae17318a10da2
- Evidence: business/dgskills-reviews/evidence/datalekken-rampenplan-2026-09-01/manifest.json
- Validator: **FAIL (4 fouten)** — `reducedMotionChecked` niet true, viewport ontbreekt: ipad-portrait/ipad-landscape/mobile.

## Handelingslijst
Afgeleid uit `actionLog[]` (8 browser-tijdstempels, strikt oplopend) + de verder gespeelde fasen:
| Moment | Wat de leerling doet |
|---|---|
| 0 | leest intro-scherm, verzegelt verwachting |
| 1 | klikt "Start de missie" |
| 2 | analyseert 6 bewijsstukken (serverlog, e-mail, wachtwoordlog, X-bericht, printer, exportlog), selecteert er 4 |
| 2b | selecteert bewust ook het foute bewijsstuk (printer-decoy), herstelt daarna |
| 3 | dient analyse in (25/25), leest per-bewijsstuk-verklaring |
| 4 | klikt 6 crisisacties in eigen volgorde van prioriteit (deels fout: team/lek verwisseld), bevestigt |
| 5 | leest correctiefeedback met uitleg waarom die volgorde klopt (21/25) |
| 6 | selecteert brief-onderdelen incl. bewust foute keuze ("Bagatelliseren"), herstelt, verstuurt brief (25/25) |
| 7 | verdeelt €10.000 budget over 5 maatregelen, botst tegen budgetgrens (firewall wordt automatisch disabled), dient in (25/25) |

Dit is fundamenteel andere handelingen dan de andere drie missies: bewijs wegen tegen decoys, een volgorde met echte consequenties bepalen, een gegenereerde brief samenstellen uit inhoudelijk relevante/irrelevante bouwstenen, en een budgetbeperking navigeren. Ruim onder 50% is puur lezen+klikken.

## Afkeurformulier

**Veto 1 Artefact** — GESLAAGD
Wat blijft er over: een volledig samengestelde crisisbrief (zichtbaar, leesbare paragrafen, screenshot 9), een prioriteitenvolgorde met eigen redenering, en een budgetverdeling — samen een herkenbaar "rampenplan".
Wie kan het bekijken: niet apart getest binnen de preview (geen docentweergave beschikbaar, reload met reset=1 is per ontwerp een no-op); oordeel steunt op het inhoudelijk samengestelde karakter van de brief zelf, niet op een bewezen persistentie. Kanttekening: de brief-tekst wordt samengesteld uit vaste bouwsteen-paragrafen per gekozen checkbox, niet vrij getypt — dat ligt dichter bij "kiezen" dan bij Veto 1's striktste lezing ("heeft de leerling dit bedacht of aangewezen"), maar de keuze zelf vereist inhoudelijk oordeel over toon or relevantie (bijv. "Bagatelliseren"/"Schuld toewijzen" verwerpen).

**Veto 2 Handelingen** — GESLAAGD
Handelingslijst per minuut (bijgevoegd): ja
Aandeel lezen+klikken: <50%; elke fase vraagt een afweging met een aantoonbaar gevolg (score/feedback verandert met de keuze).

**Veto 3 Onderscheid** — NIET VASTGESTELD
Motor: maatwerk (`src/features/missions/DatalekkenRampenplanMission.tsx`), niet onder `src/features/missions/templates/`.
Vergeleken met: geen — er is geen tweede opdracht op dezelfde motor, want dit is per definitie geen sjabloon.
Reden en benodigd bewijs: Veto 3 zoals geformuleerd ("motor" = mapnaam onder `templates/`) is hier niet één-op-één toepasbaar; opdracht-standaard.md classificeert maatwerkopdrachten zoals deze expliciet als de "goede" categorie omdat ze juist NIET op een gedeelde motor draaien. Strikt genomen is er dus geen tweede manifest te vergelijken. Benodigd bewijs om dit alsnog als GESLAAGD vast te stellen: bevestiging door de skill-eigenaar dat maatwerkmissies zonder gedeelde motor Veto 3 automatisch doorstaan (dit staat impliciet in Deel 3 van opdracht-standaard.md maar niet als expliciete regel in het afkeurformulier zelf).

**Veto 4 Belofte** — GESLAAGD
Titel + verwachte handeling: "Datalekken Rampenplan" / goal "Ik maak een stappenplan voor een datalek" → verwacht: een rampenplan/stappenplan maken.
Wat de leerling werkelijk doet: bewijs analyseren, prioriteiten stellen, een crisisbrief samenstellen, budget verdelen — samen vormt dit aantoonbaar een stappenplan. De belofte wordt waargemaakt.

Poort 1 Visueel + Beweging  NIET VASTGESTELD
  Bewijs: één actiegebonden meting uitgevoerd (bewijskaart-klik, fase 1) toont identieke transform/opacity over 4 frames — dat is volgens de regel "identieke frames zijn NIET VASTGESTELD, niet GEZAKT". Bovendien kon reduced-motion niet apart getest worden (geen Playwright emulateMedia-tool beschikbaar) en is alleen desktop-viewport bekeken, niet de volledige verplichte matrix. Reden: tool-beperking. Benodigd bewijs: een Playwright-omgeving met `page.emulateMedia()` en metingen op minstens 3 viewports.

Poort 2 Instructie          GEZAKT
  Bewijs: de intro (screenshot 1, `introText` in manifest) is één statisch scherm — titel, meta, beschrijving, /goal, 4 genummerde stappen (platte tekst, geen eigen scènes), mentorquote, één knop. Dat is precies het patroon dat kwaliteitspoorten.md als "Slecht voorbeeld" aanwijst (`IntroScreen.tsx`, minder dan drie opeenvolgende in-app stappen/scènes met eigen overgang). Er is geen enkele geanimeerde tussenstap; de 4 fase-headers in de missie zelf ("Fase 1/4" etc.) zijn onderdeel van de speelflow, niet van de intro-presentatie.

Poort 3 Doelen              GESLAAGD
  Bewijs: toegekende kerndoelen in `src/config/slo-kerndoelen-mapping.ts` regel 79: `23A`, `21A`.
  - 23A ↔ bewijsanalyse fase 1 (actionLog: "klikt bewijskaart 'Wachtwoordlog'"; screenshot 4 toont de vier correct geselecteerde bewijsstukken met verklaring).
  - 21A ↔ prioriteitenvolgorde fase 2 (screenshot 7 toont de gecorrigeerde volgorde-uitleg).
  Beide toegekende doelen zijn dus gekoppeld aan zowel een gespeelde actie als een artefact-screenshot. P3c Project-gereedheid (groei over lessen, tweede bijdrager, groter dan één scherm) is hier puur observatie zonder eigen status: niet van toepassing binnen één eenmalige preview-sessie, en telt dus niet mee voor GESLAAGD/GEZAKT.

## UITKOMST
AFGEKEURD

Toelichting: de vier veto's zijn drie keer GESLAAGD en één keer NIET VASTGESTELD (Veto 3, om een structurele reden — maatwerk zonder motor-tegenhanger). Omdat er geen enkele GEZAKT staat op veto-niveau, gaat de beoordeling door naar de poorten (conform de uitkomstvolgorde: "anders minstens één NIET VASTGESTELD" zou normaliter naar "NIET VASTGESTELD — NIET NAAR LEERLINGEN" leiden, maar Poort 2 is hier al hard GEZAKT, wat zwaarder weegt). Poort 2 (Instructie) is GEZAKT op de statische, niet-geanimeerde intro. Dit komt overeen met de verwachting uit de opdracht en met de regressieset in kwaliteitspoorten.md.
