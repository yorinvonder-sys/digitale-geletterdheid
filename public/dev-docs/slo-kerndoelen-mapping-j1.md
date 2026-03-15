# SLO Kerndoelen Mapping — Leerjaar 1, Blok 1 + 2

Mapping van alle missies naar de SLO Definitieve Conceptkerndoelen Digitale Geletterdheid (september 2025).

**Kerndoelcodes:**
- 21A = Digitale systemen functioneel inzetten
- 21B = Media & Informatie (kritisch medialandschap navigeren)
- 21C = Data & Dataverwerking
- 21D = AI (mogelijkheden en beperkingen verkennen)
- 22A = Digitale producten (passende werkwijzen bij creatie)
- 22B = Programmeren (computationele denkstrategieen)
- 23A = Veiligheid & Privacy
- 23B = Digitaal welzijn (weloverwogen keuzes)
- 23C = Maatschappij (wederzijdse invloed technologie/samenleving)

## Blok 1 — Digitale Basisvaardigheden

| Missie-ID | Missie Titel | Blok | Huidige SLO (curriculum.ts) | Huidige SLO (mapping.ts) | Aanbevolen SLO | Reden voor wijziging |
|---|---|---|---|---|---|---|
| magister-master | Magister Meester | 1 | 21A, 22A (periode) | 21A | **21A** | 22A verwijderd uit periode-focus: er wordt niets gecreeerd, alleen navigeren in Magister. 21A (digitale systemen functioneel inzetten) past perfect. |
| cloud-commander | Cloud Commander | 1 | 21A, 22A (periode) | 21A | **21A, 23A** | 23A toegevoegd: de missie draait om veilig opslaan van bestanden in de cloud (databeheer/privacy). 22A past niet want er wordt niets gecreeerd. |
| word-wizard | Word Wizard | 1 | 21A, 22A (periode) | 21A, 22A | **21A, 22A** | Geen wijziging. 21A (Word als systeem) + 22A (professioneel document creeren) is correct. |
| slide-specialist | Slide Specialist | 1 | 21A, 22A (periode) | 21A, 22A | **21A, 22A** | Geen wijziging. 21A (PowerPoint als systeem) + 22A (presentatie creeren) is correct. |
| print-pro | Print Pro | 1 | 21A, 22A (periode) | 21A | **21A** | 22A verwijderd uit periode-focus: printen is puur systeem bedienen, geen digitaal product creeren. |
| cloud-cleaner | Cloud Schoonmaker | 1 (review) | 21A, 22A (periode) | 21A | **21A, 23A** | 23A toegevoegd: bestanden opruimen en organiseren raakt veilig databeheer. |
| layout-doctor | Layout Doctor | 1 (review) | 21A, 22A (periode) | 21A | **21A, 22A** | 22A toegevoegd: review van Word-opmaak is reflectie op digitale productcreatie. |
| pitch-police | Pitch Politie | 1 (review) | 21A, 22A (periode) | 21A, 22A | **21A, 22A** | Geen wijziging. Review van presentaties dekt zowel systeemgebruik als productcreatie. |

## Blok 2 — AI & Creatie

| Missie-ID | Missie Titel | Blok | Huidige SLO (curriculum.ts) | Huidige SLO (mapping.ts) | Aanbevolen SLO | Reden voor wijziging |
|---|---|---|---|---|---|---|
| prompt-master | Prompt Perfectionist | 2 | 21B, 21D, 22A, 22B (periode) | 21D, 22A | **21D, 22A** | Geen wijziging aan missie-mapping. 21D (AI verkennen) + 22A (digitaal product creeren via prompts) klopt. |
| game-programmeur | Game Programmeur | 2 | 21B, 21D, 22A, 22B (periode) | 22A, 22B | **22A, 22B** | Geen wijziging. 22A (game als digitaal product) + 22B (programmeren/computational thinking) klopt. |
| ai-trainer | AI Trainer | 2 | 21B, 21D, 22A, 22B (periode) | 21D | **21D** | Geen wijziging. Puur AI verkennen (trainen van een model, leren over bias). |
| chatbot-trainer | Chatbot Trainer | 2 | 21B, 21D, 22A, 22B (periode) | 21D, 22A | **21D, 22A** | Geen wijziging. 21D (AI/chatbot begrijpen) + 22A (chatbot-regels ontwerpen als product). |
| verhalen-ontwerper | Verhalen Ontwerper | 2 | 21B, 21D, 22A, 22B (periode) | 21D, 22A | **21D, 22A** | Geen wijziging. 21D (AI-beeldgeneratie verkennen) + 22A (prentenboek als digitaal product). |
| game-director | Game Director | 2 | 21B, 21D, 22A, 22B (periode) | 22A, 22B | **22A, 22B** | Geen wijziging. 22A (game ontwerpen) + 22B (visueel programmeren met codeblokken). |
| ai-tekengame | AI Tekengame | 2 | 21B, 21D, 22A, 22B (periode) | 21D | **21D** | Geen wijziging. Puur AI patroonherkenning verkennen. |
| ai-beleid-brainstorm | AI Beleid Brainstorm | 2 | 21B, 21D, 22A, 22B (periode) | 23B, 23C | **23B, 23C** | Geen wijziging aan missie-mapping. 23B (weloverwogen keuzes over AI) + 23C (maatschappelijke impact). Valt buiten de periode-focus 21B/21D/22A/22B, maar is thematisch correct. |
| review-week-2 | De Code-Criticus | 2 (review) | 21B, 21D, 22A, 22B (periode) | 21B, 21D | **21B, 21D** | Geen wijziging. 21B (kritisch beoordelen van AI-output) + 21D (AI-beperkingen herkennen). |

## Samenvatting wijzigingen

### Per-missie mapping (`slo-kerndoelen-mapping.ts`)
1. **cloud-commander**: `['21A']` -> `['21A', '23A']` (veilig databeheer)
2. **cloud-cleaner**: `['21A']` -> `['21A', '23A']` (veilig databeheer)
3. **layout-doctor**: `['21A']` -> `['21A', '22A']` (review van digitale producten)

### Periode-niveau focus (`curriculum.ts`)
1. **Periode 1**: `['21A', '22A']` -> `['21A', '22A', '23A']` (23A toegevoegd vanwege cloud-commander en cloud-cleaner)
2. **Periode 2**: `['21B', '21D', '22A', '22B']` -> `['21D', '22A', '22B', '23B', '23C']` (21B verwijderd: geen enkele blok-2 missie richt zich primair op mediawijsheid; 23B en 23C toegevoegd vanwege ai-beleid-brainstorm)

### Rationale per correctie
- **magister-master + 22A**: Magister is navigeren/bedienen, niet creeren. 22A past niet.
- **cloud-commander + 23A**: Bestanden veilig opslaan in de cloud is direct gerelateerd aan veiligheid/privacy.
- **print-pro + 22A**: Printen is apparaat bedienen (21A), geen digitaal product creeren.
- **cloud-cleaner + 23A**: Bestanden opruimen en organiseren voor veilig databeheer.
- **layout-doctor + 22A**: Beoordelen van Word-opmaak is reflectie op digitale productcreatie.
- **Periode 2 - 21B verwijderd**: Geen missie in blok 2 richt zich primair op mediawijsheid/informatielandschap. review-week-2 gebruikt 21B maar dat is een review-missie.
- **Periode 2 + 23B/23C**: ai-beleid-brainstorm is expliciet gericht op digitaal welzijn en maatschappelijke impact van AI.
