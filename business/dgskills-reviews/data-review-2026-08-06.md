# Reviewrapport — data-review (periode-review Leerjaar 2, Periode 1 "Data & Informatie")

Datum: 2026-08-06
Bestand: `src/features/missions/templates/review-arena/configs/data-review.ts`
Template: `review-arena` (gedeelde engine niet meegenomen in deze review)

## Samenvatting

**Blocking probleem: de reviewmissie test het verkeerde onderwerp.** De config
staat als reviewmissie van periode "Data & Informatie" (missies:
data-journalist, spreadsheet-specialist, factchecker, api-verkenner,
dashboard-designer, ai-bias-detective), maar de inhoud gaat vrijwel volledig
over AVG / persoonsgegevens / databeveiliging (encryptie, hashing, HTTPS,
biometrische data, meldplicht datalekken). Dat onderwerp hoort thuis bij
leerjaar 3 periode 2 "Cybersecurity & Privacy" — en wordt daar al gedekt door
`security-review.ts` (zelfde rondestructuur, zelfde badge-kleuren, vrijwel
identiek thema: wachtwoorden, encryptie, phishing, veilig/onveilig gedrag).

Van de zes periode-1-missies komt er **geen enkele** inhoudelijk terug, op een
losse randraking na: ronde 1 (bronnen sorteren op betrouwbaarheid) raakt
zijdelings `factchecker` en `data-journalist`, maar test niet de CRAAP-methode
of de schermtijd/social-media-analyse die deze missies daadwerkelijk leren.
`spreadsheet-specialist` (formules SOM/GEMIDDELDE/MAX), `api-verkenner`
(JSON/URL-parameters/API-sleutels), `dashboard-designer`
(visualisatiekeuze/KPI's) en `ai-bias-detective` (AI-bias/risico/maatregelen)
komen in de vier ronden helemaal niet voor.

Gevolg: leerlingen die deze reviewmissie spelen, bereiden zich niet voor op
`assessment-j2-p1` — de periodetoets test immers de zes gegeven missies, niet
AVG/privacy. Dit is naar verwachting een kopieer-/toewijzingsfout tijdens het
scaffolden van de review-arena-configs (vermoedelijk per ongeluk dezelfde
inhoud als een privacy/security-review gebruikt voor de verkeerde periode).

**Advies: herontwerp** — de vier ronden + followUp + takeaways + intro-copy
moeten opnieuw worden opgebouwd rond de zes daadwerkelijke periode-1-missies.
De bestaande structuur (drag-sort, match-pairs, categorize, rapid-fire; 4×25
punten; badge-drempels 0/25/50/70/90) kan als skelet blijven staan.

## Bevindingen per as

### Dekking (kern van deze review)

| Missie | Gedekt? | Toelichting |
|---|---|---|
| data-journalist | Zwak/toevallig | Ronde 1 (bronbetrouwbaarheid) raakt het thema losjes, maar mist schermtijd-/social-media-data-analyse en "onderbouwde conclusies over betrouwbaarheid van nieuwsartikelen". |
| spreadsheet-specialist | Nee | Geen enkele vraag over SOM/GEMIDDELDE/MAX, filteren/sorteren van data. |
| factchecker | Zwak/toevallig | Ronde 1 raakt bronrangschikking, maar CRAAP-methode en rode vlaggen (het kernconcept van deze missie) komen niet terug. |
| api-verkenner | Nee | Geen JSON, URL-parameters of API-sleutels. |
| dashboard-designer | Nee | Geen visualisatiekeuze of KPI-selectie. |
| ai-bias-detective | Nee | Geen AI-bias, risico-inschatting of maatregelen. |

Geschatte dekking (0-10 per missie, "hoeveel van de kerninhoud van die missie
wordt getoetst"): data-journalist 1, spreadsheet-specialist 0, factchecker 2,
api-verkenner 0, dashboard-designer 0, ai-bias-detective 0.

### Didactiek

- **Blocking**: bereidt niet voor op de periodetoets (zie hierboven) — dit is
  het primaire doel van een reviewmissie en wordt gemist.
- **Warning (feitelijk)**: rapid-fire vraag 4 stelt "Foto's waarop personen
  herkenbaar zijn, zijn biometrische persoonsgegevens." Dat is een overreach.
  Onder de AVG is een gewone foto een persoonsgegeven, maar pas
  "biometrische persoonsgegevens" (art. 4 lid 14 AVG) wanneer die via
  specifieke technische verwerking (bv. gezichtsherkenning) uniek
  identificeerbaar wordt gemaakt. De stelling zelf ("nooit persoonsgegevens")
  is terecht fout, maar de gegeven uitleg introduceert een nieuwe
  onnauwkeurigheid.
  ```
  before: "Foto's waarop personen herkenbaar zijn, zijn biometrische persoonsgegevens."
  after:  "Foto's waarop personen herkenbaar zijn, zijn persoonsgegevens — pas 'biometrisch' als ze specifiek verwerkt worden om iemand uniek te identificeren (zoals bij gezichtsherkenning)."
  ```
- Overige inhoud die WEL aanwezig is (bronbetrouwbaarheid, persoonsgegevens,
  AVG-rechten, databeveiliging) is op zichzelf grotendeels correct en
  passend qua taalniveau voor 13-14 jaar — het probleem is puur de
  misplaatsing, niet de kwaliteit van de individuele vragen.
- Geen gok-zonder-inhoud-patroon gevonden: drag-sort en categorize gebruiken
  `showConfidence`, geen zichtbaar vast antwoordpatroon (A/B/C/D verdeling in
  rapid-fire en match-pairs is gemengd).
- Geen verklapte antwoorden of te vroege hints in de config zelf.

### Design

- Rondestructuur, badge-drempels (0/25/50/70/90) en badge-kleuren
  (`#e1ff01`/`#202023`/`#ff3c21`) zijn identiek aan de zusterconfigs
  (`security-review.ts` e.a.) — consistent met het gevestigde patroon.
  Geen probleem op deze as.
- `introDescription` en `takeaways` benoemen expliciet "databronnen,
  persoonsgegevens en de AVG" — bevestigt dat de misplaatsing systematisch is
  (niet één vergeten vraag, maar de hele config is rond het verkeerde thema
  gebouwd).

### Tech

- `maxScore: 100` maar de optelsom van haalbare punten is 4×25 + 5
  (bonusPoints uit de followUp) = 105. Dit overschrijdt `maxScore` met 5.
  **Niet uniek voor deze config** — hetzelfde patroon (en soms erger: twee
  followUps = +10) komt voor in alle zusterconfigs (`code-review-2.ts`,
  `advanced-code-review.ts`, `impact-review.ts`, `review-week-2.ts`,
  `media-review.ts`). Vermoedelijk vangt de gedeelde engine dit op door de
  score te cappen op `maxScore` — dat valt buiten de scope van deze
  missie-review (engine wordt apart beoordeeld). Vermeld hier als
  bevinding, niet als missie-specifieke bug.
- Typestructuur volgt `ReviewArenaConfig` consistent met de zustermissies;
  geen zichtbare type- of syntaxproblemen in de config zelf.

## Claims om na te spelen

- Bevestig in de daadwerkelijke missie-UI dat de vier ronden inderdaad exact
  de hierboven beschreven vragen/items tonen (geen runtime-override van de
  config).
- Bevestig of de score inderdaad capt op 100 bij het behalen van de bonus
  (105 haalbaar volgens config).

## Verdict

**Herontwerp.** De inhoud moet volledig herbouwd worden rond de zes
periode-1-missies (data-journalist, spreadsheet-specialist, factchecker,
api-verkenner, dashboard-designer, ai-bias-detective) zodat de missie zijn
doel — voorbereiding op `assessment-j2-p1` — daadwerkelijk waarmaakt. De
huidige AVG/privacy-inhoud kan mogelijk hergebruikt worden elders (het thema
overlapt sterk met het al-bestaande `security-review.ts` voor leerjaar 3
periode 2), maar hoort niet in deze missie.
