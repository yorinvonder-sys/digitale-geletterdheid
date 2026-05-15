# SLO-opdracht-audit

## Samenvatting

- Geauditeerde opdrachten: 83
- Uitvoering in primaire route: 13 interactief, 8 assessment, 60 chatgestuurd, 2 metadata-only
- Kerndoelconsistentie: 49 consistent, 34 met bronconflict
- Belangrijkste patroon: thematische variatie is hoog, maar de meeste opdrachten volgen nog steeds dezelfde driedelige chatstructuur.
- Belangrijkste risico: de kerndoelclaim is op meerdere plekken niet eenduidig, waardoor inspectie- of schoolbewijs nu zwak is.

## Belangrijkste conclusies

- De primaire leerroute loopt vooral via `AiLab`; daar krijgen slechts een beperkt aantal rollen een eigen interactieve of assessment-ervaring. Veel andere opdrachten zijn vooral coachingsgesprekken.
- Dedicated missiecomponenten bestaan lokaal, maar een deel lijkt legacy of niet de primaire route te zijn. Dat maakt de feitelijke leerervaring anders dan de codebasis op het eerste gezicht suggereert.
- `22A` en `23C` zijn ruim vertegenwoordigd. `21C` en vooral concrete invulling van `23A` zijn dunner en vaker indirect gedekt.
- Voor artefactgerichte opdrachten ontbreekt vaak nog verplicht productbewijs (bestand, screenshot, rubric, checklist), waardoor bewijs van doelbereik afhankelijk blijft van tekstinteractie.

## Kerndoeldekking in het curriculum

- `21A`: 18 opdrachten
- `21B`: 19 opdrachten
- `21C`: 10 opdrachten
- `21D`: 18 opdrachten
- `22A`: 29 opdrachten
- `22B`: 18 opdrachten
- `23A`: 11 opdrachten
- `23B`: 21 opdrachten
- `23C`: 25 opdrachten

## Auditmatrix

| Opdracht | LJ.W | Kerndoelen | Uitvoering | Claim | Bewijs | Werkvorm | Notitie | Advies |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `cloud-commander` | 1.1 | 21A | chat | ok | laag | chatopdracht | Gesprek of reflectie domineert; objectieve bewijsvoering voor het kerndoel is beperkt. | Voeg een observeerbaar artefact of beslisproduct toe naast het gesprek. |
| `magister-master` | 1.1 | 21A | chat | ok | laag | chatopdracht | Gesprek of reflectie domineert; objectieve bewijsvoering voor het kerndoel is beperkt. | Voeg een observeerbaar artefact of beslisproduct toe naast het gesprek. |
| `print-pro` | 1.1 | 21A | chat | ok | laag | chatopdracht | Gesprek of reflectie domineert; objectieve bewijsvoering voor het kerndoel is beperkt. | Voeg een observeerbaar artefact of beslisproduct toe naast het gesprek. |
| `slide-specialist` | 1.1 | 21A, 22A | chat | ok | laag-middel | ontwerp/media | Artefactgericht, maar bewijs blijft grotendeels afhankelijk van leerlingtekst en coachbeoordeling. | Vraag een zichtbaar eindproduct of upload en beoordeel dat met een rubric. |
| `word-wizard` | 1.1 | 21A, 22A | interactief | ok | middel | simulatie/game | Concrete taakstructuur aanwezig; beter auditeerbaar dan chatmissies. | Vraag een zichtbaar eindproduct of upload en beoordeel dat met een rubric. |
| `ai-beleid-brainstorm` | 1.2 | 23B, 23C | interactief | ok | middel | simulatie/game | Concrete taakstructuur aanwezig; beter auditeerbaar dan chatmissies. | Voeg een observeerbaar artefact of beslisproduct toe naast het gesprek. |
| `ai-tekengame` | 1.2 | 21D | interactief | dashboard | middel | simulatie/game | Kerndoelclaim wijkt af tussen bronbestanden; eerst normaliseren voor auditbaarheid. | Normaliseer mapping in config, dashboard en agenttekst; voeg daarna een rubric toe. |
| `ai-trainer` | 1.2 | 21D | interactief | ok | middel | simulatie/game | Concrete taakstructuur aanwezig; beter auditeerbaar dan chatmissies. | Voeg een observeerbaar artefact of beslisproduct toe naast het gesprek. |
| `chatbot-trainer` | 1.2 | 21D, 22A | interactief | ok | middel | simulatie/game | Concrete taakstructuur aanwezig; beter auditeerbaar dan chatmissies. | Vraag een zichtbaar eindproduct of upload en beoordeel dat met een rubric. |
| `cloud-cleaner` | 1.2 | 21A | metadata | ok | zeer laag | niet uitgewerkt | Legacy component bestaat, maar huidige AiLab-route toont geen uitgewerkte taakstructuur. | Herstel of activeer de interactieve component, of verlaag de kerndoelclaim tot er taakbewijs is. |
| `game-director` | 1.2 | 22A, 22B | chat | ok | middel | maak/programmeer | Rijke interactieve component bestaat, maar de huidige hoofdroute lijkt via chat/AiLab te lopen. | Beslis of de interactieve missie of de chatversie leidend is en verwijder de andere route. |
| `game-programmeur` | 1.2 | 22A, 22B | interactief | ok | middel | simulatie/game | Concrete taakstructuur aanwezig; beter auditeerbaar dan chatmissies. | Voeg een observeerbaar artefact of beslisproduct toe naast het gesprek. |
| `ipad-print-instructies` | 1.2 | 21A | chat | ok | laag | chatopdracht | Zeer smalle instructietaak; weinig bewijs buiten het volgen van stappen. | Voeg een observeerbaar artefact of beslisproduct toe naast het gesprek. |
| `layout-doctor` | 1.2 | 21A | interactief | ok | middel | simulatie/game | Concrete taakstructuur aanwezig; beter auditeerbaar dan chatmissies. | Voeg een observeerbaar artefact of beslisproduct toe naast het gesprek. |
| `pitch-police` | 1.2 | 21A, 22A | metadata | dashboard | zeer laag | niet uitgewerkt | Legacy review-component bestaat, maar de primaire route gebruikt de uitgewerkte missie niet zichtbaar. | Kies één bron als waarheid en koppel de live route weer aan de echte review-opdracht. |
| `prompt-master` | 1.2 | 21D, 22A | chat | dashboard | middel | chatopdracht | Sterk voor 22A; bewijs voor 21D blijft indirect en scoring leunt deels op AI/keywords. | Voeg expliciete reflectiestap op AI-beperkingen toe en gebruik een vaste rubric per criterium. |
| `verhalen-ontwerper` | 1.2 | 21D, 22A | interactief | dashboard | middel | simulatie/game | Kerndoelclaim wijkt af tussen bronbestanden; eerst normaliseren voor auditbaarheid. | Normaliseer mapping in config, dashboard en agenttekst; voeg daarna een rubric toe. |
| `ai-spiegel` | 1.3 | 23B, 23C | chat | ok | middel | maak/programmeer | Artefactgericht, maar bewijs blijft grotendeels afhankelijk van leerlingtekst en coachbeoordeling. | Vraag een zichtbaar eindproduct of upload en beoordeel dat met een rubric. |
| `cookie-crusher` | 1.3 | 23C, 21B | chat | ok | middel | analyse | Gesprek of reflectie domineert; objectieve bewijsvoering voor het kerndoel is beperkt. | Voeg een observeerbaar artefact of beslisproduct toe naast het gesprek. |
| `data-detective` | 1.3 | 21B, 23C | interactief | ok | middel-hoog | simulatie/game | Sterke interactieve analyse met concrete datageletterdheid; mapping in dashboard is consistenter dan enkele legacy bronnen. | Vraag een zichtbaar eindproduct of upload en beoordeel dat met een rubric. |
| `data-handelaar` | 1.3 | 23C, 23B | chat | ok | middel | analyse | Artefactgericht, maar bewijs blijft grotendeels afhankelijk van leerlingtekst en coachbeoordeling. | Vraag een zichtbaar eindproduct of upload en beoordeel dat met een rubric. |
| `data-voor-data` | 1.3 | 23C, 23B | interactief | ok | middel-hoog | simulatie/game | Concrete taakstructuur aanwezig; beter auditeerbaar dan chatmissies. | Voeg een observeerbaar artefact of beslisproduct toe naast het gesprek. |
| `datalekken-rampenplan` | 1.3 | 23A, 23B, 23C | interactief | ok | middel-hoog | simulatie/game | Sterke casusvorm; scoringlogica in het noodplanscenario is onnodig verwarrend. | Maak de noodplanvraag eenduidig met één correcte logica en expliciete rationale. |
| `deepfake-detector` | 1.3 | 21B, 21D, 23C | interactief | dashboard | middel-hoog | simulatie/game | Sterke interactieve vorm, maar enkele heuristieken zijn te simplistisch voor betrouwbaar brononderwijs. | Vervang heuristieken door checklists met bron, context, metadata en verificatiestappen. |
| `filter-bubble-breaker` | 1.3 | 23B, 23C, 21B | interactief | ok | middel-hoog | simulatie/game | Concrete taakstructuur aanwezig; beter auditeerbaar dan chatmissies. | Voeg een observeerbaar artefact of beslisproduct toe naast het gesprek. |
| `privacy-profiel-spiegel` | 1.3 | 23A, 23B | chat | ok | middel | analyse | Artefactgericht, maar bewijs blijft grotendeels afhankelijk van leerlingtekst en coachbeoordeling. | Vraag een zichtbaar eindproduct of upload en beoordeel dat met een rubric. |
| `review-week-2` | 1.3 | 21B, 21D | assessment | dashboard | middel | hybride toets | Kerndoelclaim wijkt af tussen bronbestanden; eerst normaliseren voor auditbaarheid. | Normaliseer mapping in config, dashboard en agenttekst; voeg daarna een rubric toe. |
| `social-safeguard` | 1.3 | 23A, 23B | chat | ok | laag | chatopdracht | Gesprek of reflectie domineert; objectieve bewijsvoering voor het kerndoel is beperkt. | Voeg een observeerbaar artefact of beslisproduct toe naast het gesprek. |
| `mission-blueprint` | 1.4 | 21A, 22A | chat | ok | middel | chatopdracht | Eindprojectdeelopdracht vraagt om productbewijs, maar de primaire uitvoering is vooral chatgestuurd. | Vraag een echt planbestand of screenshot als inleverproduct. |
| `mission-launch` | 1.4 | 21A, 21C | chat | ok | laag-middel | ontwerp/media | Eindprojectdeelopdracht heeft praktische waarde, maar data-component 21C is zwak zichtbaar. | Maak de datacomponent expliciet of verlaag de mapping naar 21A/22A. |
| `mission-vision` | 1.4 | 21D, 22A | chat | dashboard | middel | standpunt/product | Eindprojectdeelopdracht vraagt om productbewijs, maar mapping verschilt met dashboard/agenttekst. | Vraag een moodboard/pitchbestand en herstel daarna de kerndoelclaim. |
| `review-week-3` | 1.4 | 23C | assessment | dashboard | middel | hybride toets | Kerndoelclaim wijkt af tussen bronbestanden; eerst normaliseren voor auditbaarheid. | Normaliseer mapping in config, dashboard en agenttekst; voeg daarna een rubric toe. |
| `ai-bias-detective` | 2.1 | 21D, 23C | chat | ok | middel | analyse | Gesprek of reflectie domineert; objectieve bewijsvoering voor het kerndoel is beperkt. | Voeg een observeerbaar artefact of beslisproduct toe naast het gesprek. |
| `api-verkenner` | 2.1 | 21C, 21D | chat | agent | laag | maak/programmeer | In agenttekst verschuift focus richting 22B, terwijl de opdracht vooral op databegrip zit. | Zet claim recht naar 21C/21D of herschrijf de opdracht zodat 22B echt aantoonbaar wordt. |
| `dashboard-designer` | 2.1 | 21C, 22A | chat | ok | middel | ontwerp/media | Artefactgericht, maar bewijs blijft grotendeels afhankelijk van leerlingtekst en coachbeoordeling. | Vraag een zichtbaar eindproduct of upload en beoordeel dat met een rubric. |
| `data-journalist` | 2.1 | 21B, 21C | chat | agent | middel | analyse | Didactisch sterk, maar agenttekst voegt 22A toe terwijl mapping 21B/21C noemt. | Kies expliciet of infographic-ontwerp deel van de beoordeling is; pas mapping daarop aan. |
| `data-review` | 2.1 | 21B, 21C, 21D | assessment | agent | middel | hybride toets | Kerndoelclaim wijkt af tussen bronbestanden; eerst normaliseren voor auditbaarheid. | Normaliseer mapping in config, dashboard en agenttekst; voeg daarna een rubric toe. |
| `factchecker` | 2.1 | 21B, 23C | chat | agent | middel | analyse | Kerndoelclaim wijkt af tussen bronbestanden; eerst normaliseren voor auditbaarheid. | Normaliseer mapping in config, dashboard en agenttekst; voeg daarna een rubric toe. |
| `spreadsheet-specialist` | 2.1 | 21C, 22A | chat | agent | middel | chatopdracht | Inhoudelijk bruikbaar, maar SLO-claim verschilt tussen mapping en agenttekst. | Normaliseer mapping en voeg een rubric toe voor formules, visualisatie en conclusie. |
| `algorithm-architect` | 2.2 | 22B | chat | ok | middel | ontwerp/media | Artefactgericht, maar bewijs blijft grotendeels afhankelijk van leerlingtekst en coachbeoordeling. | Vraag een zichtbaar eindproduct of upload en beoordeel dat met een rubric. |
| `app-prototyper` | 2.2 | 22A, 22B | chat | agent | middel | ontwerp/media | Kerndoelclaim wijkt af tussen bronbestanden; eerst normaliseren voor auditbaarheid. | Normaliseer mapping in config, dashboard en agenttekst; voeg daarna een rubric toe. |
| `automation-engineer` | 2.2 | 22A, 22B | chat | agent | middel | maak/programmeer | Kerndoelclaim wijkt af tussen bronbestanden; eerst normaliseren voor auditbaarheid. | Normaliseer mapping in config, dashboard en agenttekst; voeg daarna een rubric toe. |
| `bug-hunter` | 2.2 | 22B | chat | ok | laag | maak/programmeer | Gesprek of reflectie domineert; objectieve bewijsvoering voor het kerndoel is beperkt. | Voeg een observeerbaar artefact of beslisproduct toe naast het gesprek. |
| `code-review-2` | 2.2 | 22A, 22B | assessment | agent | middel | hybride toets | Kerndoelclaim wijkt af tussen bronbestanden; eerst normaliseren voor auditbaarheid. | Normaliseer mapping in config, dashboard en agenttekst; voeg daarna een rubric toe. |
| `code-reviewer` | 2.2 | 22B, 23B | chat | agent | laag-middel | chatopdracht | Kerndoelclaim wijkt af tussen bronbestanden; eerst normaliseren voor auditbaarheid. | Normaliseer mapping in config, dashboard en agenttekst; voeg daarna een rubric toe. |
| `web-developer` | 2.2 | 22A, 22B | chat | ok | middel | maak/programmeer | Artefactgericht, maar bewijs blijft grotendeels afhankelijk van leerlingtekst en coachbeoordeling. | Vraag een zichtbaar eindproduct of upload en beoordeel dat met een rubric. |
| `brand-builder` | 2.3 | 22A, 21B | chat | ok | middel | ontwerp/media | Artefactgericht, maar bewijs blijft grotendeels afhankelijk van leerlingtekst en coachbeoordeling. | Vraag een zichtbaar eindproduct of upload en beoordeel dat met een rubric. |
| `digital-storyteller` | 2.3 | 22A, 21B | chat | agent | middel | ontwerp/media | Kerndoelclaim wijkt af tussen bronbestanden; eerst normaliseren voor auditbaarheid. | Normaliseer mapping in config, dashboard en agenttekst; voeg daarna een rubric toe. |
| `media-review` | 2.3 | 22A, 21B, 23B | assessment | agent | middel | hybride toets | Kerndoelclaim wijkt af tussen bronbestanden; eerst normaliseren voor auditbaarheid. | Normaliseer mapping in config, dashboard en agenttekst; voeg daarna een rubric toe. |
| `meme-machine` | 2.3 | 21B, 23B | chat | ok | middel | analyse | Artefactgericht, maar bewijs blijft grotendeels afhankelijk van leerlingtekst en coachbeoordeling. | Vraag een zichtbaar eindproduct of upload en beoordeel dat met een rubric. |
| `podcast-producer` | 2.3 | 22A, 21B | chat | ok | middel | maak/programmeer | Artefactgericht, maar bewijs blijft grotendeels afhankelijk van leerlingtekst en coachbeoordeling. | Vraag een zichtbaar eindproduct of upload en beoordeel dat met een rubric. |
| `ux-detective` | 2.3 | 22A, 21B | chat | ok | middel | analyse | Artefactgericht, maar bewijs blijft grotendeels afhankelijk van leerlingtekst en coachbeoordeling. | Vraag een zichtbaar eindproduct of upload en beoordeel dat met een rubric. |
| `video-editor` | 2.3 | 22A, 21B | chat | agent | laag | ontwerp/media | Kerndoelclaim wijkt af tussen bronbestanden; eerst normaliseren voor auditbaarheid. | Normaliseer mapping in config, dashboard en agenttekst; voeg daarna een rubric toe. |
| `ai-ethicus` | 2.4 | 21D, 23C | chat | ok | middel | analyse | Gesprek of reflectie domineert; objectieve bewijsvoering voor het kerndoel is beperkt. | Voeg een observeerbaar artefact of beslisproduct toe naast het gesprek. |
| `digital-rights-defender` | 2.4 | 23A, 23B | chat | agent | middel | standpunt/product | Manifestvorm is sterk, maar 23B/23C liggen didactisch dichterbij dan 23A alleen. | Voeg een concrete privacy-handeling of casusbeslissing toe om 23A beter te dekken. |
| `eindproject-j2` | 2.4 | 21A, 21B, 22A, 22B, 23C | chat | ok | laag-middel | maak/programmeer | Artefactgericht, maar bewijs blijft grotendeels afhankelijk van leerlingtekst en coachbeoordeling. | Vraag een zichtbaar eindproduct of upload en beoordeel dat met een rubric. |
| `future-forecaster` | 2.4 | 21D, 23C | chat | agent | middel | maak/programmeer | Kerndoelclaim wijkt af tussen bronbestanden; eerst normaliseren voor auditbaarheid. | Normaliseer mapping in config, dashboard en agenttekst; voeg daarna een rubric toe. |
| `sustainability-scanner` | 2.4 | 23C, 23B | chat | ok | middel | analyse | Gesprek of reflectie domineert; objectieve bewijsvoering voor het kerndoel is beperkt. | Voeg een observeerbaar artefact of beslisproduct toe naast het gesprek. |
| `tech-court` | 2.4 | 23B, 23C | chat | ok | laag | standpunt/product | Gesprek of reflectie domineert; objectieve bewijsvoering voor het kerndoel is beperkt. | Voeg een observeerbaar artefact of beslisproduct toe naast het gesprek. |
| `advanced-code-review` | 3.1 | 22B | assessment | ok | middel | hybride toets | Periodebrede review met concrete taken; koppeling aan individuele missie blijft indirect. | Label per taak expliciet welk kerndoel wordt getoetst. |
| `api-architect` | 3.1 | 22B, 21C | chat | agent | middel | maak/programmeer | Kerndoelclaim wijkt af tussen bronbestanden; eerst normaliseren voor auditbaarheid. | Normaliseer mapping in config, dashboard en agenttekst; voeg daarna een rubric toe. |
| `data-pipeline` | 3.1 | 21C, 22B | chat | ok | middel | ontwerp/media | Artefactgericht, maar bewijs blijft grotendeels afhankelijk van leerlingtekst en coachbeoordeling. | Vraag een zichtbaar eindproduct of upload en beoordeel dat met een rubric. |
| `ml-trainer` | 3.1 | 22B, 21D | chat | ok | middel | maak/programmeer | Gesprek of reflectie domineert; objectieve bewijsvoering voor het kerndoel is beperkt. | Voeg een observeerbaar artefact of beslisproduct toe naast het gesprek. |
| `neural-navigator` | 3.1 | 21D, 22B | chat | agent | laag | chatopdracht | Kerndoelclaim wijkt af tussen bronbestanden; eerst normaliseren voor auditbaarheid. | Normaliseer mapping in config, dashboard en agenttekst; voeg daarna een rubric toe. |
| `open-source-contributor` | 3.1 | 22A, 22B, 23B | chat | agent | laag | chatopdracht | Kerndoelclaim wijkt af tussen bronbestanden; eerst normaliseren voor auditbaarheid. | Normaliseer mapping in config, dashboard en agenttekst; voeg daarna een rubric toe. |
| `cyber-detective` | 3.2 | 23A, 21A | chat | ok | middel | standpunt/product | Artefactgericht, maar bewijs blijft grotendeels afhankelijk van leerlingtekst en coachbeoordeling. | Vraag een zichtbaar eindproduct of upload en beoordeel dat met een rubric. |
| `digital-forensics` | 3.2 | 23A, 21A | chat | agent | middel | maak/programmeer | Kerndoelclaim wijkt af tussen bronbestanden; eerst normaliseren voor auditbaarheid. | Normaliseer mapping in config, dashboard en agenttekst; voeg daarna een rubric toe. |
| `encryption-expert` | 3.2 | 23A, 21A | chat | agent | laag | chatopdracht | Kerndoelclaim wijkt af tussen bronbestanden; eerst normaliseren voor auditbaarheid. | Normaliseer mapping in config, dashboard en agenttekst; voeg daarna een rubric toe. |
| `phishing-fighter` | 3.2 | 23A | chat | agent | middel | ontwerp/media | Kerndoelclaim wijkt af tussen bronbestanden; eerst normaliseren voor auditbaarheid. | Normaliseer mapping in config, dashboard en agenttekst; voeg daarna een rubric toe. |
| `security-auditor` | 3.2 | 23A, 21A | chat | ok | middel | analyse | Artefactgericht, maar bewijs blijft grotendeels afhankelijk van leerlingtekst en coachbeoordeling. | Vraag een zichtbaar eindproduct of upload en beoordeel dat met een rubric. |
| `security-review` | 3.2 | 23A | assessment | ok | middel | hybride toets | Periodebrede review met concrete taken; koppeling aan individuele missie blijft indirect. | Label per taak expliciet welk kerndoel wordt getoetst. |
| `digital-divide-researcher` | 3.3 | 23C, 23B | chat | ok | middel | analyse | Gesprek of reflectie domineert; objectieve bewijsvoering voor het kerndoel is beperkt. | Voeg een observeerbaar artefact of beslisproduct toe naast het gesprek. |
| `impact-review` | 3.3 | 23B, 23C | assessment | agent | middel | hybride toets | Kerndoelclaim wijkt af tussen bronbestanden; eerst normaliseren voor auditbaarheid. | Normaliseer mapping in config, dashboard en agenttekst; voeg daarna een rubric toe. |
| `innovation-lab` | 3.3 | 21D, 22A | chat | agent | laag-middel | analyse | Kerndoelclaim wijkt af tussen bronbestanden; eerst normaliseren voor auditbaarheid. | Normaliseer mapping in config, dashboard en agenttekst; voeg daarna een rubric toe. |
| `policy-maker` | 3.3 | 23C, 23B | chat | ok | middel | analyse | Artefactgericht, maar bewijs blijft grotendeels afhankelijk van leerlingtekst en coachbeoordeling. | Vraag een zichtbaar eindproduct of upload en beoordeel dat met een rubric. |
| `startup-simulator` | 3.3 | 23B, 23C | chat | agent | middel | maak/programmeer | Kerndoelclaim wijkt af tussen bronbestanden; eerst normaliseren voor auditbaarheid. | Normaliseer mapping in config, dashboard en agenttekst; voeg daarna een rubric toe. |
| `tech-impact-analyst` | 3.3 | 23C, 21D | chat | ok | middel | analyse | Artefactgericht, maar bewijs blijft grotendeels afhankelijk van leerlingtekst en coachbeoordeling. | Vraag een zichtbaar eindproduct of upload en beoordeel dat met een rubric. |
| `meesterproef` | 3.4 | 21A, 21B, 21C, 21D, 22A, 22B, 23A, 23B, 23C | chat | agent | middel | chatopdracht | Claim op alle kerndoelen is te breed zonder expliciete beoordelingsmatrix per kerndoel. | Maak een beoordelingsmatrix per kerndoel en eis bewijs per domein. |
| `pitch-perfect` | 3.4 | 21B, 22A | chat | agent | laag-middel | standpunt/product | Kerndoelclaim wijkt af tussen bronbestanden; eerst normaliseren voor auditbaarheid. | Normaliseer mapping in config, dashboard en agenttekst; voeg daarna een rubric toe. |
| `portfolio-builder` | 3.4 | 21A, 22A | chat | ok | laag-middel | ontwerp/media | Artefactgericht, maar bewijs blijft grotendeels afhankelijk van leerlingtekst en coachbeoordeling. | Vraag een zichtbaar eindproduct of upload en beoordeel dat met een rubric. |
| `prototype-developer` | 3.4 | 22A, 22B | chat | ok | middel | maak/programmeer | Artefactgericht, maar bewijs blijft grotendeels afhankelijk van leerlingtekst en coachbeoordeling. | Vraag een zichtbaar eindproduct of upload en beoordeel dat met een rubric. |
| `reflection-report` | 3.4 | 23B, 23C | chat | agent | laag-middel | analyse | Kerndoelclaim wijkt af tussen bronbestanden; eerst normaliseren voor auditbaarheid. | Normaliseer mapping in config, dashboard en agenttekst; voeg daarna een rubric toe. |
| `research-project` | 3.4 | 21B, 21C, 23C | chat | ok | middel | maak/programmeer | Artefactgericht, maar bewijs blijft grotendeels afhankelijk van leerlingtekst en coachbeoordeling. | Vraag een zichtbaar eindproduct of upload en beoordeel dat met een rubric. |

## Prioriteiten

1. Kies één bron als waarheid voor kerndoelmapping: `config/slo-kerndoelen-mapping.ts` of een nieuw centraal curriculumcontract.
2. Synchroniseer daarna dashboard, agentteksten en eventuele database seed/migrations.
3. Voeg per opdracht een observeerbaar eindproduct of taakbewijs toe.
4. Maak per kerndoel een rubric met zichtbaar bewijs, vooral voor `21C`, `23A` en de eindprojecten.
5. Vergroot de werkvormvariatie binnen chatopdrachten: meer beslisbomen, peer review, vergelijkingstabellen, checklists, uploads en mini-simulaties.
