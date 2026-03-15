# Toetsmatrix AVG & AI Act Compliance - DGSkills.app

> **Correctie 15-03-2026:** Classificatie gewijzigd van 'beperkt risico' naar **hoog risico** conform EU AI Act Annex III punt 3(b) — AI-systemen bedoeld voor gebruik bij het beoordelen van leerresultaten in het onderwijs. Deadline hoog-risico verplichtingen: **2 augustus 2026**.

Dit document dient als intern referentiekader voor de compliance-audit van DGSkills.app (Februari 2026).

## 1. AVG / GDPR (Verordening EU 2016/679)

| ID | Controlepunt | Wettelijke Basis | Criterium voor DGSkills |
|:---|:---|:---|:---|
| AVG-01 | **Rolverdeling** | Art. 4(7), 4(8), 28 | School is Verwerkingsverantwoordelijke; DGSkills is Verwerker. Moet expliciet in DPA staan. |
| AVG-02 | **Rechtsgrondslag** | Art. 6 | Meestal 'Publieke taak' (voor scholen) of 'Gerechtvaardigd belang'. DGSkills moet dit faciliteren. |
| AVG-03 | **Informatieplicht** | Art. 13, 14 | Duidelijke privacyverklaring toegankelijk vóór gegevensverzameling (login/registratie). |
| AVG-04 | **Rechten Betrokkenen** | Art. 15 - 22 | In-app functies voor inzage (export) en verwijdering (vergetelheid). |
| AVG-05 | **Minimale Gegevens** | Art. 5(1)(c) | Alleen strikt noodzakelijke data voor leerproces (geen BSN, geen adres indien mogelijk). |
| AVG-06 | **Bewaartermijnen** | Art. 5(1)(e) | Data niet langer bewaren dan nodig. Automatische opschoning inrichten. |
| AVG-07 | **Beveiliging** | Art. 32 | Versleuteling (HTTPS/TLS), database-regels, toegangsbeheer (docent vs leerling). |
| AVG-08 | **Datalocatie** | Art. 44 - 50 | Opslag binnen de EER (bijv. Google Cloud `europe-west4`). |
| AVG-09 | **Subverwerkers** | Art. 28(2) | Lijst van subverwerkers (Supabase, Google AI) moet beschikbaar zijn. |
| AVG-10 | **DPIA** | Art. 35 | DGSkills moet school ondersteunen bij het uitvoeren van een DPIA. |
| AVG-11 | **Minderjarigen <16** | Art. 8 AVG / UAVG | Juridische basis en waarborgen voor minderjarigen expliciet vastgelegd in privacydocumentatie. |
| AVG-12 | **Beperking verwerking** | Art. 18 AVG | Betrokkene moet verwerkingsbeperking kunnen aanvragen; workflow en logging vereist. |

## 2. Cookies & ePrivacy (Telecommunicatiewet / ePrivacy Richtlijn)

| ID | Controlepunt | Wettelijke Basis | Criterium voor DGSkills |
|:---|:---|:---|:---|
| C-01 | **Toestemming** | Art. 11.7a Tw | Voorafgaande toestemming voor niet-essentiële cookies (zoals analytics). |
| C-02 | **Gelijkwaardigheid** | AP Richtlijnen | 'Weigeren' moet even makkelijk zijn als 'Accepteren' (geen dark patterns). |
| C-03 | **Transparantie** | Art. 13 AVG | Overzicht van welke cookies, doel, en bewaartermijn. |
| C-04 | **Intrekken** | Art. 7(3) AVG | Toestemming moet op elk moment eenvoudig ingetrokken kunnen worden. |
| C-05 | **Consent Enforcement** | Art. 11.7a Tw | Niet-essentiele analytics mag pas na expliciete consent technisch actief worden. |

## 3. EU AI Act (Verordening EU 2024/1689)

*DGSkills valt onder **hoog risico** (Annex III, punt 3(b)): AI-systemen bedoeld voor gebruik bij het beoordelen van leerresultaten in het onderwijs, inclusief systemen die worden gebruikt om het passende onderwijsniveau voor een persoon te bepalen. Dit brengt verplichtingen mee onder Art. 9-17, Art. 26, en Art. 43-49.*

### 3.1 Transparantie en AI-geletterdheid

| ID | Controlepunt | Wettelijke Basis | Criterium voor DGSkills | Status |
|:---|:---|:---|:---|:---|
| AI-01 | **Transparantie** | Art. 50(1) | Gebruikers moeten weten dat ze met AI communiceren (Chat/Feedback). | VOLDAAN |
| AI-02 | **Output Labeling** | Art. 50(2) | AI-gegenereerde content moet als zodanig herkenbaar zijn (disclaimer/watermerk). | VOLDAAN |
| AI-03 | **AI-geletterdheid** | Art. 4 | Uitleg over de beperkingen (fouten/hallucinaties) en menselijke controle. Aanbieders en deployers moeten AI-geletterdheid waarborgen bij personeel en gebruikers. | VOLDAAN |
| AI-04 | **Datagebruik AI** | Privacy-by-design | Expliciet vermelden dat input niet wordt gebruikt voor training (bij API-gebruik). | VOLDAAN |

### 3.2 Risicobeheersysteem (Art. 9)

| ID | Controlepunt | Wettelijke Basis | Criterium voor DGSkills | Status |
|:---|:---|:---|:---|:---|
| AI-09a | **Risicobeheerproces** | Art. 9(1)-(2) | Continu risicobeheersysteem gedurende de gehele levenscyclus van het AI-systeem. Identificatie en analyse van bekende en voorzienbare risico's. | NIET VOLDAAN |
| AI-09b | **Risicobeperking** | Art. 9(3)-(4) | Passende risicobeperkende maatregelen treffen. Restrisico's moeten aanvaardbaar laag zijn. Testen onder reële omstandigheden. | NIET VOLDAAN |
| AI-09c | **Specifieke risico's minderjarigen** | Art. 9(9) | Bijzondere aandacht voor risico's voor minderjarigen (kwetsbare groep in onderwijscontext). | GEDEELTELIJK |

### 3.3 Data governance (Art. 10)

| ID | Controlepunt | Wettelijke Basis | Criterium voor DGSkills | Status |
|:---|:---|:---|:---|:---|
| AI-10a | **Kwaliteit trainingsdata** | Art. 10(2)-(3) | Trainings-, validatie- en testdatasets moeten relevant, representatief, zo foutvrij mogelijk en volledig zijn. | NIET VOLDAAN |
| AI-10b | **Bias-monitoring** | Art. 10(2)(f) | Onderzoek naar mogelijke bias, met name m.b.t. kwetsbare groepen (leeftijd, achtergrond). | NIET VOLDAAN |
| AI-10c | **Dataminimalisatie AI** | Art. 5(1)(c) AVG | Alleen noodzakelijke context naar AI-endpoints; geen vrije tekst in analytics/audit waar niet nodig. | VOLDAAN |

### 3.4 Technische documentatie (Art. 11, Annex IV)

| ID | Controlepunt | Wettelijke Basis | Criterium voor DGSkills | Status |
|:---|:---|:---|:---|:---|
| AI-11a | **Systeembeschrijving** | Art. 11(1), Annex IV(1) | Algemene beschrijving van het AI-systeem: beoogd doel, ontwikkelaar, versie, interactie met hardware/software. | GEDEELTELIJK |
| AI-11b | **Ontwerp en ontwikkeling** | Annex IV(2) | Beschrijving van ontwikkelmethoden, ontwerpkeuzes, architectuur, rekenkundige middelen. | NIET VOLDAAN |
| AI-11c | **Prestatiemetrieken** | Annex IV(3) | Beschrijving van validatie- en testprocedures, prestatiemetrieken, bekende beperkingen. | NIET VOLDAAN |

### 3.5 Registratie van gebeurtenissen — logging (Art. 12)

| ID | Controlepunt | Wettelijke Basis | Criterium voor DGSkills | Status |
|:---|:---|:---|:---|:---|
| AI-12a | **Automatische logging** | Art. 12(1)-(2) | Het systeem moet automatisch gebeurtenissen loggen gedurende de levenscyclus, traceerbaar en doorzoekbaar. | GEDEELTELIJK |
| AI-12b | **Loginhoud** | Art. 12(3) | Logs bevatten minimaal: periode van gebruik, referentiedatabase, inputdata, identificatie betrokken personen. | NIET VOLDAAN |
| AI-12c | **Bewaarplicht logs** | Art. 12(4) | Logs bewaren voor een passende periode in overeenstemming met het beoogde doel en toepasselijke wetgeving. | NIET VOLDAAN |

### 3.6 Transparantie en informatieverstrekking (Art. 13)

| ID | Controlepunt | Wettelijke Basis | Criterium voor DGSkills | Status |
|:---|:---|:---|:---|:---|
| AI-13a | **Gebruiksinstructies** | Art. 13(1)-(2) | Duidelijke, begrijpelijke gebruiksinstructies voor deployers (scholen), inclusief identiteit aanbieder, kenmerken, beperkingen en risico's. | GEDEELTELIJK |
| AI-13b | **Interpreteerbaarheid output** | Art. 13(3)(b)(ii) | Deployers moeten de output van het systeem kunnen interpreteren en correct gebruiken. | GEDEELTELIJK |
| AI-13c | **Prestatie-informatie** | Art. 13(3)(b)(iii) | Informatie over nauwkeurigheidsniveaus en bekende beperkingen beschikbaar voor deployers. | NIET VOLDAAN |

### 3.7 Menselijk toezicht (Art. 14)

| ID | Controlepunt | Wettelijke Basis | Criterium voor DGSkills | Status |
|:---|:---|:---|:---|:---|
| AI-14a | **Human-in-the-loop** | Art. 14(1)-(2) | Het systeem moet zo ontworpen zijn dat er effectief menselijk toezicht op mogelijk is gedurende de gebruiksperiode. | GEDEELTELIJK |
| AI-14b | **Docentcontrole** | Art. 14(3)-(4) | Docent moet eindbeslissing hebben over leerling-beoordeling. Mogelijkheid om het systeem te negeren, te overrulen of stop te zetten. | GEDEELTELIJK |
| AI-14c | **Automation bias** | Art. 14(4)(b) | Maatregelen tegen overmatig vertrouwen op AI-output (automation bias), met name bij beoordelingen. | NIET VOLDAAN |

### 3.8 Nauwkeurigheid, robuustheid en cybersecurity (Art. 15)

| ID | Controlepunt | Wettelijke Basis | Criterium voor DGSkills | Status |
|:---|:---|:---|:---|:---|
| AI-15a | **Nauwkeurigheid** | Art. 15(1)-(2) | Het systeem bereikt een passend nauwkeurigheidsniveau. Nauwkeurigheidsniveaus worden gedeclareerd in gebruiksinstructies. | NIET VOLDAAN |
| AI-15b | **Robuustheid** | Art. 15(3)-(4) | Bestand tegen fouten en inconsistenties. Technische redundantie (back-up, fail-safe). | GEDEELTELIJK |
| AI-15c | **Cybersecurity** | Art. 15(5) | Bescherming tegen aanvallen specifiek gericht op AI (data poisoning, adversarial attacks, model manipulation). | NIET VOLDAAN |

### 3.9 Verplichtingen aanbieder (Art. 16-17)

| ID | Controlepunt | Wettelijke Basis | Criterium voor DGSkills | Status |
|:---|:---|:---|:---|:---|
| AI-16a | **Kwaliteitsmanagementsysteem** | Art. 17 | Documenteerbaar kwaliteitsmanagementsysteem met beleid en procedures voor de gehele levenscyclus. | NIET VOLDAAN |
| AI-16b | **Post-market monitoring** | Art. 16(i), Art. 72 | Systeem voor monitoring na het op de markt brengen: incidenten, klachten, prestatieverval. | NIET VOLDAAN |
| AI-16c | **Corrigerende maatregelen** | Art. 16(g)-(h) | Procedures voor het nemen van corrigerende maatregelen en het informeren van deployers bij non-conformiteit. | NIET VOLDAAN |
| AI-16d | **Registratie EU-databank** | Art. 16(d), Art. 71 | Registratie van het hoog-risico AI-systeem in de EU-databank vóór het in de handel brengen. | NIET VOLDAAN |

### 3.10 Verplichtingen deployers — scholen (Art. 26)

| ID | Controlepunt | Wettelijke Basis | Criterium voor DGSkills | Status |
|:---|:---|:---|:---|:---|
| AI-26a | **Gebruik conform instructies** | Art. 26(1) | Scholen gebruiken het systeem conform de gebruiksinstructies van de aanbieder. | GEDEELTELIJK |
| AI-26b | **Menselijk toezicht door school** | Art. 26(2) | School wijst competente personen aan voor het menselijk toezicht (docenten). | GEDEELTELIJK |
| AI-26c | **Informatieplicht deployer** | Art. 26(7) | School informeert betrokkenen (leerlingen, ouders) dat zij onderworpen zijn aan een hoog-risico AI-systeem. | NIET VOLDAAN |
| AI-26d | **DPIA door deployer** | Art. 26(9) | School voert een DPIA uit vóór gebruik. DGSkills levert de benodigde informatie hiervoor. | GEDEELTELIJK |

### 3.11 Conformiteitsbeoordeling en CE-markering (Art. 43, 47-49)

| ID | Controlepunt | Wettelijke Basis | Criterium voor DGSkills | Status |
|:---|:---|:---|:---|:---|
| AI-43a | **Conformiteitsbeoordeling** | Art. 43 | Conformiteitsbeoordeling uitvoeren vóór het in de handel brengen. Voor AI in onderwijs (Annex III, 3(b)): interne controle conform Annex VI. | NIET VOLDAAN |
| AI-47a | **EU-conformiteitsverklaring** | Art. 47-48 | Schriftelijke EU-conformiteitsverklaring opstellen, inhoud conform Annex V. Beschikbaar houden voor toezichthouders gedurende 10 jaar. | NIET VOLDAAN |
| AI-49a | **CE-markering** | Art. 49 | CE-markering zichtbaar, leesbaar en onuitwisbaar aanbrengen op het AI-systeem of bijbehorende documentatie. | NIET VOLDAAN |

## 4. Onderwijs-specifiek (Convenant Digitale Onderwijsmiddelen)

| ID | Controlepunt | Basis | Criterium voor DGSkills |
|:---|:---|:---|:---|
| EDU-01 | **Verwerkersovereenkomst** | Model 4.0 | Gebruik van het standaardmodel van het Privacyconvenant Onderwijs. |
| EDU-02 | **Geen Commercie** | Convenant | Geen advertenties of commerciële profilering van minderjarigen. |
| EDU-03 | **School-scoped toegang** | Onderwijsnorm / AVG art. 32 | Gegevens zichtbaar op need-to-know basis per school/klas. |

## 5. Samenvatting hoog-risico compliance status

| Categorie | Voldaan | Gedeeltelijk | Niet voldaan |
|:---|:---|:---|:---|
| Transparantie & AI-geletterdheid (3.1) | 4 | 0 | 0 |
| Risicobeheersysteem (3.2) | 0 | 1 | 2 |
| Data governance (3.3) | 1 | 0 | 2 |
| Technische documentatie (3.4) | 0 | 1 | 2 |
| Logging (3.5) | 0 | 1 | 2 |
| Transparantie deployers (3.6) | 0 | 2 | 1 |
| Menselijk toezicht (3.7) | 0 | 2 | 1 |
| Nauwkeurigheid & security (3.8) | 0 | 1 | 2 |
| Verplichtingen aanbieder (3.9) | 0 | 0 | 4 |
| Verplichtingen deployers (3.10) | 0 | 3 | 1 |
| Conformiteit & CE (3.11) | 0 | 0 | 3 |
| **Totaal** | **5** | **11** | **20** |
