# SLO Gap-Analyse — DGSkills Curriculum

**Versie:** 2.0
**Datum:** 28 maart 2026
**Auteur:** DGSkills Curriculum Team
**Status:** Intern — vertrouwelijk
**Wijziging v2.0:** Volledige audit van alle mission-to-kerndoel mappings. Elke missie is gevalideerd tegen de daadwerkelijke systemInstruction-inhoud in `config/agents.tsx`. 12 assessment-missies toegevoegd aan de mapping. Alle tellingen zijn bijgewerkt.

---

## 1. Methode

Voor deze analyse zijn alle missies uit `config/slo-kerndoelen-mapping.ts` geteld per SLO-kerndoel. De SLO-kerndoelen Digitale Geletterdheid voor het voortgezet onderwijs omvatten 9 reguliere codes (21A t/m 23C), verdeeld over drie domeinen:

- **Domein 21 — Digitale technologie & informatica** (21A, 21B, 21C, 21D)
- **Domein 22 — Toepassingen** (22A, 22B)
- **Domein 23 — Digitaal burgerschap** (23A, 23B, 23C)

**Verschil met v1.0:** In versie 1.0 werd per missie alleen het primaire kerndoel geteld. In v2.0 zijn **alle kerndoelen** geteld die de missie-inhoud daadwerkelijk afdekt, gevalideerd tegen de systemInstruction in `config/agents.tsx`. Dit geeft een eerlijker beeld van de werkelijke dekking. Daarnaast zijn 12 assessment-missies (1 per periode) nu ook opgenomen in de mapping.

---

## 2. Dekkingsmatrix

### 2.1 Huidige telling (v2.0 — na audit)

| Kerndoel | Omschrijving | J1 | J2 | J3 | Totaal |
|----------|---|:---:|:---:|:---:|:---:|
| **21A** | Digitale systemen | 12 | 6 | 6 | **24** |
| **21B** | Media & Informatie | 6 | 11 | 6 | **23** |
| **21C** | Data & Dataverwerking | 6 | 7 | 7 | **20** |
| **21D** | AI | 11 | 7 | 8 | **26** |
| **22A** | Digitale producten | 14 | 16 | 9 | **39** |
| **22B** | Programmeren | 7 | 9 | 10 | **26** |
| **23A** | Veiligheid & privacy | 12 | 7 | 9 | **28** |
| **23B** | Digitaal welzijn | 3 | 5 | 3 | **11** |
| **23C** | Maatschappij | 11 | 10 | 11 | **32** |

**Totaal missies:** 39 (J1) + 35 (J2) + 28 (J3) = 102 (inclusief 12 assessments)

### 2.2 Vergelijking met v1.0

| Kerndoel | v1.0 | v2.0 | Delta | Toelichting |
|----------|:---:|:---:|:---:|---|
| **21A** | 21 | 24 | +3 | +21A bij automation-engineer, api-verkenner, datalekken-rampenplan |
| **21B** | 21 | 23 | +2 | Correcties bij mission-vision, mission-launch, portfolio-builder, digital-divide-researcher |
| **21C** | 12 | 20 | **+8** | Sterkste stijging. Data-detective, ai-spiegel, ai-trainer, digital-forensics nu correct getagd |
| **21D** | 19 | 26 | +7 | ai-beleid-brainstorm, review-week-3, advanced-code-review, assessments correct getagd |
| **22A** | 31 | 39 | +8 | Assessments + correcties (data-journalist, startup-simulator, phishing-fighter, innovation-lab) |
| **22B** | 23 | 26 | +3 | chatbot-trainer, review-week-2, code-denker nu correct als 22B; app-prototyper, network-navigator 22B verwijderd |
| **23A** | 15 | 28 | **+13** | Grootste correctie. Cookie-crusher, data-handelaar, data-voor-data, deepfake-detector, data-detective, ai-spiegel, privacy-by-design, digital-rights-defender waren onder-getagd |
| **23B** | 20 | 11 | **-9** | Grootste daling. 23B was systematisch over-getagd; veel missies gingen over privacy (23A) of maatschappij (23C), niet over persoonlijk welzijn |
| **23C** | 26 | 32 | +6 | privacy-by-design, digital-rights-defender, open-source-contributor, assessments toegevoegd |

### 2.3 Belangrijkste bevindingen uit de audit

1. **23B was systematisch over-getagd.** Missies over privacy-regelgeving (AVG), datahandel, en maatschappelijke ethiek werden foutief als "digitaal welzijn" gemarkeerd. Na correctie daalt 23B van 20 naar 11. Dit is de enige code die daalt, maar het beeld is nu eerlijk.

2. **23A was systematisch onder-getagd.** Veel privacy- en veiligheidsmissies in J1P3 hadden geen 23A-tag terwijl ze duidelijk over dataveiligheid, AVG en online veiligheid gaan. Na correctie stijgt 23A van 15 naar 28.

3. **21C was breder dan gedacht.** Door correcties bij data-detective, ai-spiegel, ai-trainer, en het meenemen van assessments stijgt 21C van 12 naar 20.

4. **22B had valse positieven én valse negatieven.** App-prototyper (geen code), network-navigator (geen code), en privacy-by-design (geen code) verloren hun 22B-tag. Maar chatbot-trainer (IF-THEN regels), review-week-2 (code-bugs herkennen), en code-denker (CT-puzzels) kregen terecht 22B.

---

## 3. Geïdentificeerde gaten

### 3.1 HOOG — 23B Digitaal Welzijn (11 missies totaal)

**Gap:** Na correctie van de over-tagging is 23B het zwakste kerndoel met slechts 11 missies. Vooral J1 (3) en J3 (3) zijn dun.

**Waarom dit echt een gat is:** De correctie maakt zichtbaar dat DGSkills weinig expliciete aandacht geeft aan persoonlijk digitaal welzijn: schermtijd, online druk, cyberpesten, gezonde digitale gewoonten. De meeste 23B-missies zijn indirect (social-safeguard, meme-machine, ai-spiegel).

**Risico voor verkoop:** Scholen vragen steeds meer om aandacht voor digitaal welzijn. Een inspectie die kerndoel 23B toetst, vindt weinig expliciete lesactiviteiten.

**J1 (3):** social-safeguard, ai-spiegel, assessment-j1-p3
**J2 (5):** meme-machine, media-review, assessment-j2-p3, assessment-j2-p4, eindproject-j2
**J3 (3):** reflection-report, assessment-j3-p3, meesterproef

---

### 3.2 HOOG — 21B Media & Informatie in J1 (6 missies)

**Gap:** Na correctie van de tags voor data-detective (was 21B, nu 23A) en data-speurder (was 21B, nu alleen 21C) zijn er nog 6 missies met 21B in J1. Dit is aanvaardbaar, maar de spreiding is smal: mission-vision, mission-launch, filter-bubble-breaker, deepfake-detector, data-verzamelaar, assessment-j1-p3.

**Waarom dit monitoren verdient:** 21B (bronnen evalueren, mediawijsheid) is een kernvaardigheid die zwaarder leunt op J2 (11 missies). De J1-basis is smal maar niet alarmerend.

---

### 3.3 MATIG — 22B Programmeren in J1 (7 missies na correctie)

**Verbetering t.o.v. v1.0:** Door correcte tagging van chatbot-trainer (IF-THEN regels), review-week-2 (code-bugs), en code-denker (CT-puzzels), plus het assessment, stijgt 22B in J1 van 4 naar 7. De diversiteit in programmeercontexten is nu beter: games (game-programmeur, game-director), web (website-bouwer), chatbot-regels (chatbot-trainer), en computational thinking (code-denker).

**Restrisico:** Alle niet-game programmeercontexten zijn licht (introductie-niveau). De sprong naar J2 (9 missies met serieuze Python/JS/HTML) blijft groot.

---

### 3.4 MATIG — 23B in J3 (3 missies)

**Gap:** In J3 is 23B vertegenwoordigd door alleen reflection-report, assessment-j3-p3, en meesterproef. Er is geen expliciete welzijnsmissie in J3.

**Waarom acceptabel:** J3 is een specialisatiejaar (havo/vwo only). De reflectie op eigen digitale gewoonten past daar minder prominent dan in J1/J2 waar de basis wordt gelegd. De meesterproef geeft ruimte voor een welzijns-thema als de leerling dat kiest.

---

## 4. Aanbeveling: prioriteiten na audit

De urgente situatie is verschoven door de audit. De oorspronkelijke "kritieke gaten" (21C in J1, 22B in J1, 23A in J2) zijn grotendeels opgelost door correcte tagging:

| Vorig gat | v1.0 telling | v2.0 telling | Status |
|-----------|:---:|:---:|---|
| 21C in J1 | 2 | 6 | **Opgelost** door correcte tagging van data-detective, ai-spiegel, ai-trainer, data-speurder, data-verzamelaar + assessment |
| 22B in J1 | 2 | 7 | **Sterk verbeterd** door correcte tagging van chatbot-trainer, review-week-2, code-denker + assessment |
| 23A in J2 | 2 | 7 | **Opgelost** door correcte tagging van privacy-by-design, digital-rights-defender, wachtwoord-warrior, access-control-engineer + assessment + eindproject |
| 21A in J2 | 2 | 6 | **Opgelost** door correcte tagging van api-verkenner, automation-engineer, network-navigator, access-control-engineer + assessment + eindproject |

### Nieuwe prioriteiten

1. **23B versterken in J1** (P2, hoog). Overweeg een expliciete welzijnsmissie rond schermtijd, online druk, of digitale balans. De huidige J1-dekking (3 missies) is het zwakste punt.

2. **23B versterken in J2** (P3, matig). De 5 missies zijn grotendeels indirect. Een missie specifiek over cyberpesten of online identiteit zou 23B inhoudelijk versterken.

3. **22B contexten diversifiëren in J1** (P3, matig). De 7 missies zijn een verbetering, maar de serieuze programmeerinhoud is nog beperkt tot game-programmeur, game-director, website-bouwer, en chatbot-trainer. Meer non-game contexten blijven gewenst.

---

## 5. Conclusie

De audit van maart 2026 laat zien dat de **werkelijke dekking van het DGSkills-curriculum aanzienlijk beter is dan v1.0 suggereerde**. De belangrijkste "gaten" uit v1.0 bleken grotendeels verkeerde tags:

- **23A** was systematisch onder-getagd (15 → 28)
- **23B** was systematisch over-getagd (20 → 11)
- **21C** was onder-getagd (12 → 20)

Het enige echte nieuwe gat is **23B (Digitaal Welzijn)**, dat na correctie het zwakste kerndoel is. Dit verdient aandacht bij de volgende curriculum-iteratie.

**Voor verkoopgesprekken:** DGSkills kan nu met meer vertrouwen claimen dat alle 9 SLO-kerndoelen structureel worden gedekt. De mapping is gevalideerd tegen de daadwerkelijke missie-inhoud, niet alleen de titels. Het enige verbeterpunt is explicieter aandacht voor digitaal welzijn (23B).

---

*Dit document is opgesteld ten behoeve van interne curriculumontwikkeling en mag worden gedeeld met potentiële pilotscholen als onderdeel van het inkooptraject.*
